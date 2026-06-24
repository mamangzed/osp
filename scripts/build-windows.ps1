# OSP Windows Build Script
# Run this script in PowerShell to build OSP for Windows

Write-Host "=== OSP Windows Build Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Rust is installed
Write-Host "Checking Rust installation..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version
    Write-Host "✓ $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Rust not found. Please install from https://rustup.rs" -ForegroundColor Red
    exit 1
}

# Check if cargo is installed
Write-Host "Checking Cargo installation..." -ForegroundColor Yellow
try {
    $cargoVersion = cargo --version
    Write-Host "✓ $cargoVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Cargo not found. Please install from https://rustup.rs" -ForegroundColor Red
    exit 1
}

# Clean previous build
Write-Host ""
Write-Host "Cleaning previous build..." -ForegroundColor Yellow
cargo clean
Write-Host "✓ Clean complete" -ForegroundColor Green

# Build release version
Write-Host ""
Write-Host "Building OSP in release mode..." -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Gray
cargo build --release

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Build failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "1. Install Visual Studio Build Tools with C++ workload" -ForegroundColor Gray
    Write-Host "2. Run this script from 'x64 Native Tools Command Prompt'" -ForegroundColor Gray
    Write-Host "3. Check docs/WINDOWS_BUILD.md for troubleshooting" -ForegroundColor Gray
    exit 1
}

Write-Host "✓ Build successful!" -ForegroundColor Green

# Show output files
Write-Host ""
Write-Host "=== Build Output ===" -ForegroundColor Cyan
Write-Host ""

$owlExe = "target\release\owl.exe"
$serverExe = "target\release\owl-server.exe"

if (Test-Path $owlExe) {
    $size = (Get-Item $owlExe).Length / 1MB
    Write-Host "✓ CLI Tool: $owlExe ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
}

if (Test-Path $serverExe) {
    $size = (Get-Item $serverExe).Length / 1MB
    Write-Host "✓ Server: $serverExe ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
}

# Test binaries
Write-Host ""
Write-Host "=== Testing Binaries ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testing CLI tool..." -ForegroundColor Yellow
& $owlExe --version

Write-Host ""
Write-Host "=== Build Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start server: .\$serverExe --bind 0.0.0.0:9420" -ForegroundColor Gray
Write-Host "2. Generate token: .\$owlExe issue-token --secret 'my-secret'" -ForegroundColor Gray
Write-Host "3. See docs/WINDOWS_BUILD.md for more info" -ForegroundColor Gray
Write-Host ""
