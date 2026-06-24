# Quick Start: Build OSP di Windows

## Langkah Cepat (5 menit)

### 1. Install Rust
Download dan install dari: https://rustup.rs

### 2. Install Visual Studio Build Tools
Download dari: https://visualstudio.microsoft.com/downloads/

Pilih "Build Tools for Visual Studio 2022" dan install dengan komponen:
- ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
- ✅ Windows 10 SDK (10.0.19041.0)

### 3. Clone dan Build

Buka **PowerShell** dan jalankan:

```powershell
# Clone repository
git clone https://github.com/mamangzed/osp.git
cd osp

# Build dengan script otomatis
.\scripts\build-windows.ps1
```

Atau manual:

```powershell
cargo build --release
```

### 4. Test

```powershell
# Generate JWT token
.\target\release\owl.exe issue-token --secret "my-secret-key" --device "test-device" --scopes "*"

# Start server
.\target\release\owl-server.exe --bind 0.0.0.0:9420 --ws-bind 0.0.0.0:9421 --jwt-secret "my-secret-key"
```

## Troubleshooting

### Error: "linker `link.exe` not found"
- Install Visual Studio Build Tools (lihat langkah 2)
- Atau jalankan dari "x64 Native Tools Command Prompt"

### Error: "could not compile `ring`"
- Pastikan MSVC Build Tools terinstall
- Restart PowerShell setelah install

### Error: "permission denied"
- Jalankan PowerShell sebagai Administrator

## File yang Dihasilkan

Setelah build berhasil:
- `target\release\owl.exe` - CLI tool (generate token, test)
- `target\release\owl-server.exe` - OSP server

## Dokumentasi Lengkap

Lihat `docs/WINDOWS_BUILD.md` untuk detail lengkap.
