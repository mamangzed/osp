# owl-php — OWL PHP Extension

A PHP extension written in Rust (via `cc` + manual C ABI) that loads the
OWL Rust client SDK into PHP. Lets PHP scripts speak the OSP wire protocol.

## Status

**Code complete. Build requires PHP development headers.**

The extension code is in this directory. The build script (`build.rs`)
compiles a tiny C wrapper (`owl_php_entry.c`) that defines the C ABI
`get_module()` entry point that PHP looks for. The Rust cdylib provides
`owl_php_register_module()` which fills in the `zend_module_entry` struct.

## Build requirements

1. PHP runtime matching your `php.exe` (default: wamp64 PHP 8.3.14 ZTS x64)
2. PHP development headers (`php.h`, `zend.h`, etc.) in the same PHP install
3. `php8ts.lib` import library (the `dev/` subdirectory of your PHP install)
4. Microsoft Visual Studio C++ toolset (cl.exe) — already required by Rust on Windows

### Where to get PHP dev headers

- **Linux / macOS:** `apt install php-dev` (Debian/Ubuntu), `brew install php` (macOS)
- **Windows (easiest):** Use the same PHP build as your runtime. With wamp64,
  the runtime + `php8ts.lib` are in `C:\wamp64\bin\php\php8.3.14\`, but the
  headers are **not** included. You have two options:
  1. Download a "dev kit" package that ships with the headers, e.g.
     `php-8.3.14-nts-Win32-vs16-x64.zip` from windows.php.net, then copy
     `php-8.3.14-src/` headers into the wamp64 PHP directory.
  2. Build PHP from source (overkill for a v1 dev install).

## Build

```bash
# Default: looks for PHP at C:/wamp64/bin/php/php8.3.14 on Windows
# Override via PHP_DIR env var
export PHP_DIR=/path/to/php/install
cargo build -p owl-php --release
```

The output is a `owl_php.dll` in `target/release/`. Copy it into your
PHP extension directory (e.g. `C:\wamp64\bin\php\php8.3.14\ext\`) and
add to `php.ini`:

```ini
extension=owl_php
```

## PHP usage

```php
<?php
// id is an opaque handle
$id = owl_client_create("tcp://127.0.0.1:9420", "my-jwt-token");
if (!owl_client_connect($id)) {
    die("connect failed");
}

// Set a field on a record. Value is JSON-encoded.
owl_client_set($id, "users", "u1", "name", '"alice"');
owl_client_set($id, "users", "u1", "age", "30");
owl_client_set($id, "users", "u1", "active", "true");

// Get a record. Returns a JSON object of all fields, or null.
$json = owl_client_get($id, "users", "u1");
$rec = json_decode($json, true);
echo "user: " . $rec["name"] . " (age " . $rec["age"] . ")\n";

// Tombstone.
owl_client_delete($id, "users", "u1");

// Restore.
owl_client_restore($id, "users", "u1");

// Disconnect.
owl_client_disconnect($id);
?>
```

## Function reference

| Function | Args | Returns |
|----------|------|---------|
| `owl_client_create($url, $token)` | server URL, auth token | int client handle |
| `owl_client_connect($id)` | client handle | bool success |
| `owl_client_set($id, $coll, $rid, $field, $value_json)` | collection, record id, field name, JSON value | bool |
| `owl_client_get($id, $coll, $rid)` | collection, record id | JSON string of fields, or null |
| `owl_client_delete($id, $coll, $rid)` | collection, record id | bool |
| `owl_client_restore($id, $coll, $rid)` | collection, record id | bool |
| `owl_client_disconnect($id)` | client handle | — |

## Limitations of v1

- No PHP class wrapper (`Owl\Client`); only function-style API. A class
  wrapper is a follow-up.
- Subscriptions are not yet exposed to PHP.
- Snapshot+delta are not yet exposed to PHP.
- The Rust zval helpers are simplified and do not properly refcount Zend
  strings. For production, switch to `ext-php-rs` (which has been
  prototyped but couldn't be built in this environment without libclang).
