use protox::Compiler;
use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let proto_dir = PathBuf::from("../../proto");
    // Only open frame.proto as the entry. The other .proto files are
    // pulled in via the explicit `import` statements inside frame.proto
    // and added to the file set as transitive imports. protox marks them
    // as `is_import = true` and the resulting FileDescriptorSet will
    // contain all four. `include_imports(true)` ensures the transitive
    // imports are also emitted in the descriptor (required by prost-build).
    let protos = [proto_dir.join("osp/v1/frame.proto")];
    println!("cargo:rerun-if-changed={}", proto_dir.display());
    for p in &protos {
        println!("cargo:rerun-if-changed={}", p.display());
    }
    let fds = Compiler::new(&[proto_dir])?
        .include_source_info(true)
        .include_imports(true)
        .open_files(protos)?
        .file_descriptor_set();
    let mut cfg = prost_build::Config::new();
    cfg.bytes(["."]);
    cfg.compile_fds(fds)?;
    Ok(())
}
