# Build OSP untuk Windows

Panduan untuk build OSP server dan CLI di Windows.

## Prerequisites

1. **Install Rust** - Download dari https://rustup.rs
2. **Install Visual Studio Build Tools** (atau Visual Studio dengan C++ workload)
3. **Install Git** - Download dari https://git-scm.com

## Steps

### 1. Clone Repository

```powershell
git clone https://github.com/mamangzed/osp.git
cd osp
```

### 2. Build dengan Cargo

```powershell
# Build release version
cargo build --release

# Binaries akan ada di:
# target/release/owl.exe (CLI tool)
# target/release/owl-server.exe (Server)
```

### 3. Test

```powershell
# Test CLI
.\target\release\owl.exe --help

# Generate JWT token
.\target\release\owl.exe issue-token --secret "my-secret-key" --device "test-device" --scopes "*"

# Start server
.\target\release\owl-server.exe --bind 0.0.0.0:9420 --ws-bind 0.0.0.0:9421 --jwt-secret "my-secret-key"
```

## Troubleshooting

### "failed to find tool "lib.exe""

Install Visual Studio Build Tools dengan komponen:
- MSVC v143 - VS 2022 C++ x64/x86 build tools
- Windows 10 SDK

### "could not compile `ring`"

Ring crate butuh C compiler. Pastikan:
1. Visual Studio Build Tools terinstall
2. Jalankan build dari "Developer Command Prompt" atau "x64 Native Tools Command Prompt"

### "error: linker `link.exe` not found"

Tambah Visual Studio path ke environment:
```powershell
$env:PATH += ";C:\Program Files\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.39.33519\bin\Hostx64\x64"
```

## Distribusi

Setelah build berhasil, copy binaries ini ke folder distribusi:
- `target/release/owl.exe`
- `target/release/owl-server.exe`

Dan file konfigurasi:
- `proto/` folder
- `sdk/browser/dist/` folder
- `gateway/` folder (kalau butuh HTTP API)

## Alternatif: Download Pre-built Binary

Kalau tidak mau build sendiri, download binary pre-built dari:
- **GitHub Releases**: https://github.com/mamangzed/osp/releases

Download file `osp-windows-x86_64.zip` dan extract.
