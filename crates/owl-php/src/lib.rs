//! OWL PHP extension — Rust side.
//!
//! This cdylib is loaded by PHP at startup (via `extension=owl_php` in php.ini).
//! PHP calls `get_module()` (defined in `owl_php_entry.c`), which calls
//! `owl_php_register_module()` here, which fills in a `zend_module_entry`
//! with PHP function table entries. Each function is implemented in Rust.
//!
//! PHP usage:
//! ```php
//! $c = new Owl\Client("tcp://127.0.0.1:9420", "my-jwt-token");
//! $c->connect();
//! $c->set("users", "u1", "name", "alice");
//! $rec = $c->get("users", "u1");
//! $c->disconnect();
//! ```

#![allow(non_snake_case, non_camel_case_types, dead_code)]

use libc::{c_char, c_int, c_void, size_t};
use once_cell::sync::Lazy;
use std::sync::Arc;
use tokio::runtime::Runtime;

// === Minimal Zend API types ===
// We only declare the bits we touch. Field order MUST match the actual
// `zend_module_entry` struct in PHP 8.3 headers (zend_API.h).
//
// The struct layout is volatile across PHP versions; this is a
// best-effort skeleton suitable for v1 demo. For production, switch
// to `ext-php-rs` once the build environment has libclang.

#[repr(C)]
#[derive(Debug, Copy, Clone)]
pub enum _ZendResult { Ok = 0, Err = -1 }

pub type ZendResult = c_int;

pub const PHP_MODULE_API_NO: u32 = 20230831; // PHP 8.3

// Opaque zval — we don't construct these directly; we use the
// high-level wrappers in the API section below.
#[repr(C)]
pub struct _zval_struct {
    pub value: ZvalValue,
    pub u1: ZvalU1,
    pub u2: ZvalU2,
}

#[repr(C)]
pub union ZvalValue {
    pub lval: libc::c_long,
    pub dval: f64,
    pub counted: *mut c_void,
    pub str_: *mut c_void,
    pub arr: *mut c_void,
    pub obj: *mut c_void,
    pub res: *mut c_void,
    pub ref_: *mut c_void,
    pub ast: *mut c_void,
    pub zv: *mut c_void,
    pub ptr: *mut c_void,
    pub ce: *mut c_void,
    pub typed_ref: *mut c_void,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub union ZvalU1 {
    pub v: ZvalU1Inner,
    pub type_info: u32,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct ZvalU1Inner {
    pub type_: u8,
    pub type_flags: u8,
    pub const_flags: u8,
    pub reserved: u8,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub union ZvalU2 {
    pub var_flags: u32,
    pub next: u32,
    pub cache_slot: u32,
    pub lineno: u32,
    pub num_args: u32,
    pub fe_pos: u32,
    pub fe_iter_idx: u32,
    pub guard: u32,
    pub constant_flags: u32,
    pub extra: u32,
}

pub type zval = _zval_struct;

// zend_function_entry
#[repr(C)]
pub struct _zend_function_entry {
    pub fname: *const c_char,
    pub handler: Option<unsafe extern "C" fn(num_args: c_int, args: *mut zval, return_value: *mut zval) -> c_int>,
    pub arg_info: *const c_void,
    pub num_args: u32,
    pub flags: u32,
}

// zend_module_entry (PHP 8.3, simplified to the fields we use)
#[repr(C)]
pub struct _zend_module_entry {
    pub size: u16,
    pub zend_api: u32,
    pub zend_debug: u8,
    pub zts: u8,
    pub ini_entry: *const c_void,
    pub deps: *const c_void,
    pub name: *const c_char,
    pub functions: *const _zend_function_entry,
    pub module_startup_func: Option<unsafe extern "C" fn(type_: c_int, module_number: c_int) -> c_int>,
    pub module_shutdown_func: Option<unsafe extern "C" fn(type_: c_int, module_number: c_int) -> c_int>,
    pub request_startup_func: Option<unsafe extern "C" fn(type_: c_int, module_number: c_int) -> c_int>,
    pub request_shutdown_func: Option<unsafe extern "C" fn(type_: c_int, module_number: c_int) -> c_int>,
    pub info_func: Option<unsafe extern "C" fn(zend_module: *mut _zend_module_entry)>,
    pub version: *const c_char,
    pub globals_size: size_t,
    pub globals_ptr: *mut c_void,
    pub globals_ctor: Option<unsafe extern "C" fn(global: *mut c_void)>,
    pub globals_dtor: Option<unsafe extern "C" fn(global: *mut c_void)>,
    pub post_deactivate_func: Option<unsafe extern "C" fn() -> c_int>,
    pub module_started: c_int,
    pub type_: u8,
    pub handle: c_void,
    pub module_number: c_int,
    pub build_id: *const c_char,
}

pub type zend_module_entry = _zend_module_entry;

// === Per-request global state ===
//
// We keep one global tokio runtime + global session map. The runtime
// drives the async client work. In a real ZTS extension we'd use
// TSRMLS_FETCH, but for v1 we use a single global runtime.

static RUNTIME: Lazy<Runtime> = Lazy::new(|| {
    tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .worker_threads(2)
        .thread_name("owl-php")
        .build()
        .expect("failed to start tokio runtime")
});

// === Public FFI surface ===

/// Called from `owl_php_entry.c` `get_module()`. Fills in the module
/// struct's function table and lifecycle hooks, then returns 0.
#[no_mangle]
pub extern "C" fn owl_php_register_module(entry: *mut zend_module_entry) -> c_int {
    unsafe {
        (*entry).size = std::mem::size_of::<zend_module_entry>() as u16;
        (*entry).zend_api = PHP_MODULE_API_NO;
        (*entry).zend_debug = 0;
        (*entry).zts = 1; // wamp64 is ZTS
        (*entry).name = b"Owl\0".as_ptr() as *const c_char;
        (*entry).version = b"0.1.0\0".as_ptr() as *const c_char;
        (*entry).functions = FUNCTIONS.as_ptr();
        (*entry).module_startup_func = Some(owl_php_minit);
        (*entry).module_shutdown_func = Some(owl_php_mshutdown);
        (*entry).request_startup_func = Some(owl_php_rinit);
        (*entry).request_shutdown_func = Some(owl_php_rshutdown);
    }
    0
}

// Function table — exposed to PHP as `owl_connect()`, `owl_client_create()`,
// `owl_client_set()`, etc. We use function-style API (not OO) for the v1
// PHP extension to keep the C-side shim minimal.

static FUNCTIONS: [_zend_function_entry; 8] = [
    // null-terminator entry last
    _zend_function_entry { fname: b"owl_client_create\0".as_ptr() as *const c_char, handler: Some(php_owl_client_create), arg_info: std::ptr::null(), num_args: 2, flags: 0 },
    _zend_function_entry { fname: b"owl_client_connect\0".as_ptr() as *const c_char, handler: Some(php_owl_client_connect), arg_info: std::ptr::null(), num_args: 1, flags: 0 },
    _zend_function_entry { fname: b"owl_client_set\0".as_ptr() as *const c_char, handler: Some(php_owl_client_set), arg_info: std::ptr::null(), num_args: 5, flags: 0 },
    _zend_function_entry { fname: b"owl_client_get\0".as_ptr() as *const c_char, handler: Some(php_owl_client_get), arg_info: std::ptr::null(), num_args: 3, flags: 0 },
    _zend_function_entry { fname: b"owl_client_delete\0".as_ptr() as *const c_char, handler: Some(php_owl_client_delete), arg_info: std::ptr::null(), num_args: 3, flags: 0 },
    _zend_function_entry { fname: b"owl_client_restore\0".as_ptr() as *const c_char, handler: Some(php_owl_client_restore), arg_info: std::ptr::null(), num_args: 3, flags: 0 },
    _zend_function_entry { fname: b"owl_client_disconnect\0".as_ptr() as *const c_char, handler: Some(php_owl_client_disconnect), arg_info: std::ptr::null(), num_args: 1, flags: 0 },
    _zend_function_entry { fname: std::ptr::null(), handler: None, arg_info: std::ptr::null(), num_args: 0, flags: 0 },
];

// === Lifecycle hooks ===

unsafe extern "C" fn owl_php_minit(_t: c_int, _n: c_int) -> c_int {
    eprintln!("[owl-php] module init");
    Lazy::force(&RUNTIME);
    0
}
unsafe extern "C" fn owl_php_mshutdown(_t: c_int, _n: c_int) -> c_int {
    eprintln!("[owl-php] module shutdown");
    0
}
unsafe extern "C" fn owl_php_rinit(_t: c_int, _n: c_int) -> c_int {
    0
}
unsafe extern "C" fn owl_php_rshutdown(_t: c_int, _n: c_int) -> c_int {
    0
}

// === PHP-visible functions ===

// Client handle storage: a global map of int -> Arc<OwlClient>.
static CLIENTS: Lazy<parking_lot::Mutex<std::collections::HashMap<i64, Arc<owl_client::OwlClient>>>> =
    Lazy::new(|| parking_lot::Mutex::new(std::collections::HashMap::new()));
static NEXT_ID: Lazy<parking_lot::Mutex<i64>> = Lazy::new(|| parking_lot::Mutex::new(1));

unsafe extern "C" fn php_owl_client_create(
    num_args: c_int,
    args: *mut zval,
    return_value: *mut zval,
) -> c_int {
    if num_args < 2 { return -1; }
    let url = zval_to_str(&*args);
    let token = zval_to_str(&*args.offset(1));
    let cfg = owl_client::config::ClientConfig {
        url,
        token,
        ..Default::default()
    };
    let client = match owl_client::OwlClient::new(cfg) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("[owl-php] create failed: {}", e);
            return -1;
        }
    };
    let id = {
        let mut g = NEXT_ID.lock();
        let id = *g;
        *g += 1;
        id
    };
    CLIENTS.lock().insert(id, Arc::new(client));
    set_zval_long(return_value, id);
    0
}

unsafe extern "C" fn php_owl_client_connect(
    num_args: c_int,
    args: *mut zval,
    return_value: *mut zval,
) -> c_int {
    if num_args < 1 { return -1; }
    let id = zval_to_long(&*args);
    let client = match CLIENTS.lock().get(&id).cloned() {
        Some(c) => c,
        None => return -1,
    };
    let res = RUNTIME.block_on(async move { client.connect().await });
    set_zval_bool(return_value, res.is_ok());
    0
}

unsafe extern "C" fn php_owl_client_set(
    num_args: c_int,
    args: *mut zval,
    return_value: *mut zval,
) -> c_int {
    if num_args < 5 { return -1; }
    let id = zval_to_long(&*args);
    let coll = zval_to_str(&*args.offset(1));
    let id_str = zval_to_str(&*args.offset(2));
    let field = zval_to_str(&*args.offset(3));
    let value_str = zval_to_str(&*args.offset(4));
    let value: owl_protocol::Value = parse_value(&value_str);
    let client = match CLIENTS.lock().get(&id).cloned() {
        Some(c) => c,
        None => return -1,
    };
    let res = RUNTIME.block_on(async move {
        client.set(&coll, &id_str, &field, value).await
    });
    set_zval_bool(return_value, res.is_ok());
    0
}

unsafe extern "C" fn php_owl_client_get(
    num_args: c_int,
    args: *mut zval,
    return_value: *mut zval,
) -> c_int {
    if num_args < 3 { return -1; }
    let id = zval_to_long(&*args);
    let coll = zval_to_str(&*args.offset(1));
    let rid = zval_to_str(&*args.offset(2));
    let client = match CLIENTS.lock().get(&id).cloned() {
        Some(c) => c,
        None => return -1,
    };
    let res = RUNTIME.block_on(async move { client.get(&coll, &rid).await });
    match res {
        Ok(Some(rec)) => {
            let json = serde_json::to_string(&rec.fields).unwrap_or_else(|_| "null".into());
            set_zval_str(return_value, &json);
        }
        Ok(None) => {
            set_zval_null(return_value);
        }
        Err(_) => {
            set_zval_bool(return_value, false);
        }
    }
    0
}

unsafe extern "C" fn php_owl_client_delete(
    num_args: c_int,
    args: *mut zval,
    return_value: *mut zval,
) -> c_int {
    if num_args < 3 { return -1; }
    let id = zval_to_long(&*args);
    let coll = zval_to_str(&*args.offset(1));
    let rid = zval_to_str(&*args.offset(2));
    let client = match CLIENTS.lock().get(&id).cloned() {
        Some(c) => c,
        None => return -1,
    };
    let res = RUNTIME.block_on(async move { client.delete(&coll, &rid).await });
    set_zval_bool(return_value, res.is_ok());
    0
}

unsafe extern "C" fn php_owl_client_restore(
    num_args: c_int,
    args: *mut zval,
    return_value: *mut zval,
) -> c_int {
    if num_args < 3 { return -1; }
    let id = zval_to_long(&*args);
    let coll = zval_to_str(&*args.offset(1));
    let rid = zval_to_str(&*args.offset(2));
    let client = match CLIENTS.lock().get(&id).cloned() {
        Some(c) => c,
        None => return -1,
    };
    let res = RUNTIME.block_on(async move { client.restore(&coll, &rid).await });
    set_zval_bool(return_value, res.is_ok());
    0
}

unsafe extern "C" fn php_owl_client_disconnect(
    num_args: c_int,
    args: *mut zval,
    _return_value: *mut zval,
) -> c_int {
    if num_args < 1 { return -1; }
    let id = zval_to_long(&*args);
    CLIENTS.lock().remove(&id);
    0
}

// === Minimal zval helpers ===
// These are extremely simplified and rely on direct field access. They
// work for the scalar types we use (string, int, bool, null) and produce
// a JSON string for compound values.

unsafe fn zval_to_str(z: &zval) -> String {
    // Type 6 = IS_STRING, type 5 = IS_LONG (we read as number)
    // We peek at the type byte then read either the long value or the string
    let type_ = z.u1.v.type_;
    if type_ == 6 { // IS_STRING
        let s = &*z.value.str_;
        let ptr = (*s as *const zend_string).as_ref().unwrap();
        String::from_utf8_lossy(&ptr.val).to_string()
    } else if type_ == 5 { // IS_LONG
        z.value.lval.to_string()
    } else if type_ == 4 { // IS_DOUBLE
        z.value.dval.to_string()
    } else if type_ == 1 { // IS_NULL
        String::new()
    } else {
        String::new()
    }
}

unsafe fn zval_to_long(z: &zval) -> i64 {
    let type_ = z.u1.v.type_;
    if type_ == 5 { z.value.lval } else if type_ == 6 {
        zval_to_str(z).parse().unwrap_or(0)
    } else { 0 }
}

unsafe fn set_zval_long(z: *mut zval, v: i64) {
    (*z).u1.v.type_ = 5; // IS_LONG
    (*z).value.lval = v;
}

unsafe fn set_zval_bool(z: *mut zval, v: bool) {
    (*z).u1.v.type_ = 2; // IS_FALSE / IS_TRUE - simplified; we just use long 0/1
    (*z).value.lval = if v { 1 } else { 0 };
}

unsafe fn set_zval_null(z: *mut zval) {
    (*z).u1.v.type_ = 1; // IS_NULL
}

unsafe fn set_zval_str(z: *mut zval, s: &str) {
    // Allocate a Zend string and point zval at it.
    // For v1 demo we don't actually allocate; we just set the type to
    // IS_STRING and write the bytes into a static buffer (will leak,
    // and not safe for binary). Production code would use
    // ZEND_MALLOC/ZEND_STR_SIZE and proper refcounting.
    let bytes = s.as_bytes();
    static mut BUF: Vec<u8> = Vec::new();
    BUF = bytes.to_vec();
    (*z).u1.v.type_ = 6;
    (*z).value.str_ = BUF.as_ptr() as *mut c_void;
    // Length stored separately in a real implementation.
}

// Minimal stub of zend_string for the read path
#[repr(C)]
pub struct zend_string {
    pub gc: c_void,
    pub h: u64,
    pub len: size_t,
    pub val: [c_char; 1],
}

fn parse_value(s: &str) -> owl_protocol::Value {
    // Accept JSON for the value
    match serde_json::from_str::<serde_json::Value>(s.trim()) {
        Ok(v) => json_to_value(v),
        Err(_) => owl_protocol::Value::String(s.to_string()),
    }
}

fn json_to_value(v: serde_json::Value) -> owl_protocol::Value {
    match v {
        serde_json::Value::Null => owl_protocol::Value::Null,
        serde_json::Value::Bool(b) => owl_protocol::Value::Bool(b),
        serde_json::Value::Number(n) => {
            if let Some(i) = n.as_i64() { owl_protocol::Value::Int(i) }
            else if let Some(f) = n.as_f64() { owl_protocol::Value::Double(f) }
            else { owl_protocol::Value::Null }
        }
        serde_json::Value::String(s) => owl_protocol::Value::String(s),
        serde_json::Value::Array(items) => owl_protocol::Value::Array(items.into_iter().map(json_to_value).collect()),
        serde_json::Value::Object(m) => {
            let mut out = std::collections::BTreeMap::new();
            for (k, v) in m { out.insert(k, json_to_value(v)); }
            owl_protocol::Value::Object(out)
        }
    }
}
