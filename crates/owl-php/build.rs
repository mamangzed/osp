//! Build the OWL PHP extension.
//!
//! Strategy: compile a tiny C wrapper (owl_php_entry.c) that exposes
//! `get_module()` returning a `zend_module_entry`. The wrapper is compiled
//! with the PHP include flags and links against the PHP import library
//! `php8ts.lib`. The Rust cdylib exposes the `owl_php_register_module`
//! function that the C wrapper calls to fill in the module struct.

use std::env;
use std::path::PathBuf;

fn main() {
    println!("cargo:rerun-if-env-changed=PHP_DIR");

    let php_dir = env::var("PHP_DIR")
        .unwrap_or_else(|_| "C:/wamp64/bin/php/php8.3.14".to_string());
    let php_dir = PathBuf::from(php_dir);

    let include = php_dir.join("");
    let lib_dir = php_dir.join("dev");
    let php_lib = lib_dir.join("php8ts.lib");

    println!("cargo:rerun-if-changed={}/owl_php_entry.c", env::var("CARGO_MANIFEST_DIR").unwrap());
    println!("cargo:rustc-link-search=native={}", lib_dir.display());
    println!("cargo:rustc-link-lib=dylib=php8ts");

    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let entry_c = manifest_dir.join("owl_php_entry.c");

    let mut build = cc::Build::new();
    build
        .file(&entry_c)
        .include(&include)
        // PHP ZTS build (Zend Thread Safety) is on for wamp64. We compile
        // with the matching ZTS flag so our struct layouts match php8ts.lib.
        .define("ZTS", "1")
        .define("PHP_WIN32", "1")
        .define("ZEND_WIN32", "1")
        .define("_WIN32_WINNT", "0x0601")
        .flag("/EHsc")
        .flag("/MD")
        .flag("/std:c11");
    build.compile("owl_php_entry");

    // Re-run if the C file changes
    println!("cargo:rerun-if-changed=owl_php_entry.c");

    // Tell the user where we found PHP (for debugging)
    if !php_lib.exists() {
        panic!(
            "PHP import lib not found at {}. Set PHP_DIR env var to the PHP install dir (containing dev/php8ts.lib).",
            php_lib.display()
        );
    }
}
