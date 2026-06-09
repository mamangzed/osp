//! owl-codegen: Stage 10 — emit multi-language stubs from OSP .proto files.
//!
//! See `owl_codegen::generate` for the library API. This binary is a thin
//! CLI over it. It defaults to the four .proto files under `proto/osp/v1/`
//! at the workspace root.

use anyhow::{Context, Result};
use clap::Parser;
use std::path::PathBuf;

#[derive(Debug, Parser)]
#[command(name = "owl-codegen", version, about = "OSP .proto → multi-language stubs")]
struct Cli {
    /// Comma-separated list of target languages: rust,dart,node,python,php,go
    #[arg(long, default_value = "rust")]
    lang: String,

    /// Output directory (one subdir per language is created inside)
    #[arg(long, default_value = "bindings/generated")]
    out: PathBuf,

    /// One or more .proto entry-point files. Defaults to all four under
    /// `proto/osp/v1/` at the workspace root.
    #[arg(long)]
    proto: Vec<PathBuf>,

    /// Include directory for protox (where imports are resolved from).
    /// Defaults to the parent of the first .proto file.
    #[arg(long)]
    include: Option<PathBuf>,
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    // Resolve languages.
    let langs: Vec<owl_codegen::Lang> = cli
        .lang
        .split(',')
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .map(|s| {
            owl_codegen::Lang::parse(s)
                .with_context(|| format!("unknown language: {}", s))
        })
        .collect::<Result<_>>()?;
    if langs.is_empty() {
        anyhow::bail!("no languages selected (use --lang rust,dart,node,python,php,go)");
    }

    // Resolve proto files. Default: all four under proto/osp/v1/.
    let mut protos: Vec<PathBuf> = if cli.proto.is_empty() {
        let workspace_root = workspace_root()?;
        ["frame.proto", "auth.proto", "common.proto", "sync.proto"]
            .iter()
            .map(|n| workspace_root.join("proto").join("osp").join("v1").join(n))
            .filter(|p| p.exists())
            .collect()
    } else {
        cli.proto
    };
    if protos.is_empty() {
        anyhow::bail!("no .proto files found; pass --proto FILE [FILE ...]");
    }

    // Canonicalize protos first so we can derive the include path from them.
    protos = protos
        .into_iter()
        .map(|p| p.canonicalize().unwrap_or(p))
        .collect();

    // Resolve include dir.
    let include = match cli.include {
        Some(p) => p.canonicalize().unwrap_or(p),
        None => {
            // For ".../proto/osp/v1/frame.proto", the include dir is ".../proto"
            // (one level above the `osp/` package).
            let first = &protos[0];
            // Pop "frame.proto" then "v1"; leave "osp" → pop it too.
            let mut p = first.clone();
            p.pop(); // frame.proto
            p.pop(); // v1
            p.pop(); // osp
            p
        }
    };

    eprintln!("owl-codegen: emitting {:?} to {}", langs, cli.out.display());
    owl_codegen::generate(&langs, &protos, &include, &cli.out)
        .context("codegen failed")?;

    for &lang in &langs {
        let dir = cli.out.join(match lang {
            owl_codegen::Lang::Rust => "rust",
            owl_codegen::Lang::Dart => "dart",
            owl_codegen::Lang::Node => "node",
            owl_codegen::Lang::Python => "python",
            owl_codegen::Lang::Php => "php",
            owl_codegen::Lang::Go => "go",
        });
        eprintln!("  → {}", dir.display());
    }
    Ok(())
}

fn workspace_root() -> Result<PathBuf> {
    // Walk up from the current executable (target/debug/owl-codegen[.exe])
    // until we find Cargo.toml.
    let mut p = std::env::current_exe()?;
    for _ in 0..6 {
        if !p.pop() { break; }
        if p.join("Cargo.toml").exists() && p.join("proto").exists() {
            return Ok(p);
        }
    }
    anyhow::bail!("could not locate workspace root (proto/ dir not found)")
}
