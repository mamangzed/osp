#!/bin/bash
set -e

echo "=== OWL Project Full Setup for Ubuntu ==="
echo ""

# ─── 1. System packages ───────────────────────────────────────────────────
echo "[1/5] Installing system packages..."
sudo apt-get update -qq
# Remove apt cargo/rustc if present to avoid shadowing rustup
sudo apt-get remove -y cargo rustc || true
sudo apt-get install -y \
    build-essential \
    pkg-config \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    cmake \
    protobuf-compiler \
    libssl-dev \
    libsqlite3-dev \
    php-dev \
    php-cli \
    php-xml \
    php-mbstring \
    php-zip \
    sqlite3

# ─── 2. Rust toolchain ───────────────────────────────────────────────────
echo "[2/5] Installing Rust via rustup..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Force reload of PATH and rustup
export PATH="$HOME/.cargo/bin:$PATH"
source "$HOME/.cargo/env"

# Pin a recent stable version that supports edition2024 (1.85+)
rustup default stable
rustup update stable
rustup component add rustfmt clippy

# ─── 3. Verify toolchain ────────────────────────────────────────────────
echo "[3/5] Verifying toolchain..."
echo "  rustc   : $(rustc --version)"
echo "  cargo   : $(cargo --version)"
echo "  protoc  : $(protoc --version)"
echo "  php     : $(php -v | head -n1)"
echo "  sqlite3 : $(sqlite3 --version)"
echo "  gcc     : $(gcc --version | head -n1)"

# ─── 4. Set PHP_DIR if not set ──────────────────────────────────────────
echo "[4/5] Configuring environment..."
PHP_INCLUDE=$(php-config --include-dir 2>/dev/null || echo "")
if [ -n "$PHP_INCLUDE" ]; then
    echo "  PHP_DIR detected: $PHP_INCLUDE"
    export PHP_DIR="$PHP_INCLUDE"
else
    echo "  PHP_DIR not set; owl-php extension will need it."
fi

# ─── 5. Build ───────────────────────────────────────────────────────────
echo "[5/5] Building project..."
cd "$(dirname "$0")/.."
cargo build --release
echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  cargo run -p owl-cli -- --help"
echo "  cargo test"
echo "  cargo build -p owl-php --release   # PHP extension"
