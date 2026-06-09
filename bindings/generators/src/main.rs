//! bindings-generators: Stage 13 — emit per-language bindings from .proto files.
//!
//! Reads each `bindings/configs/*.yaml` and runs `owl_codegen::generate` with
//! the language + proto dir + out dir. Pure data-driven wrapper over
//! `owl-codegen`; keeps the per-language config in one place.
//!
//! For v1 we parse the YAML subset by hand. The configs look like:
//!
//!   lang: dart
//!   proto_dir: proto/osp/v1
//!   out: bindings/generated/dart
//!   includes: [frame.proto]
//!
//! Usage:
//!   cargo run -p bindings-generators -- --config-dir bindings/configs

use anyhow::{Context, Result};
use clap::Parser;
use std::path::{Path, PathBuf};

#[derive(Debug, Parser)]
#[command(name = "bindings-generators", version, about = "OSP per-language bindings generator")]
struct Cli {
    /// Directory containing *.yaml configs.
    #[arg(long, default_value = "bindings/configs")]
    config_dir: PathBuf,

    /// Workspace root (for resolving relative proto_dir paths).
    #[arg(long)]
    workspace_root: Option<PathBuf>,
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    let workspace_root = match cli.workspace_root {
        Some(p) => p,
        None => {
            // Walk up from current_exe to find the workspace root.
            let mut p = std::env::current_exe()?;
            let found = (0..8).find_map(|_| {
                if p.pop() && p.join("Cargo.toml").exists() && p.join("proto").exists() {
                    Some(p.clone())
                } else { None }
            });
            found.context("workspace root not found")?
        }
    };
    let mut entries: Vec<_> = std::fs::read_dir(&cli.config_dir)
        .with_context(|| format!("read_dir {}", cli.config_dir.display()))?
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().and_then(|s| s.to_str()) == Some("yaml"))
        .collect();
    entries.sort_by_key(|e| e.path());

    let mut emitted = 0;
    for entry in entries {
        let path = entry.path();
        let cfg_text = std::fs::read_to_string(&path)
            .with_context(|| format!("read {}", path.display()))?;
        let (lang, proto_dir_rel, out_rel) = parse_minimal_yaml(&cfg_text)
            .with_context(|| format!("parse {}", path.display()))?;
        let proto_dir = workspace_root.join(&proto_dir_rel);
        let out = workspace_root.join(&out_rel);
        let lang_enum = owl_codegen::Lang::parse(&lang)
            .with_context(|| format!("unknown language '{}' in {}", lang, path.display()))?;
        // Collect .proto files: frame.proto is the entry, common/auth/sync are
        // pulled in transitively.
        let frame = proto_dir.join("frame.proto");
        if !frame.exists() {
            anyhow::bail!("{} not found", frame.display());
        }
        // The .proto files import `osp/v1/common.proto` etc. — protox's
        // include path is therefore the parent of the `osp/` package,
        // i.e. two levels above `proto_dir` (proto_dir/osp/.. = proto/).
        let mut include_dir = proto_dir.clone();
        // Pop "v1" to land at "proto/osp".
        if !include_dir.pop() { anyhow::bail!("bad proto_dir"); }
        // Pop "osp" to land at "proto".
        if !include_dir.pop() { anyhow::bail!("bad proto_dir"); }
        eprintln!("[{}] {} -> {}", lang, proto_dir.display(), out.display());
        owl_codegen::generate(&[lang_enum], &[frame], &include_dir, &out)
            .with_context(|| format!("generate {}", path.display()))?;
        emitted += 1;
    }
    eprintln!("bindings-generators: {} config(s) processed", emitted);
    Ok(())
}

/// Minimal YAML parser: handles the subset used by our configs (no nested
/// structures, no escapes). For v1 we avoid pulling in a full YAML crate.
fn parse_minimal_yaml(text: &str) -> Result<(String, String, String)> {
    let mut lang = None;
    let mut proto_dir = None;
    let mut out = None;
    for line in text.lines() {
        let line = line.split('#').next().unwrap_or("").trim();
        if line.is_empty() { continue; }
        let (k, v) = match line.split_once(':') {
            Some((k, v)) => (k.trim(), v.trim().trim_matches('"').trim_matches('\'').to_string()),
            None => continue,
        };
        match k {
            "lang" => lang = Some(v),
            "proto_dir" => proto_dir = Some(v),
            "out" => out = Some(v),
            _ => {}
        }
    }
    Ok((
        lang.context("missing 'lang'")?,
        proto_dir.context("missing 'proto_dir'")?,
        out.context("missing 'out'")?,
    ))
}

// Suppress unused warning for the path helper used in error messages.
#[allow(dead_code)]
fn _ensure_exists(p: &Path) -> Result<()> {
    if p.exists() { Ok(()) } else { anyhow::bail!("missing: {}", p.display()) }
}
