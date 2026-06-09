# OSP language-binding templates

These templates are the source-of-truth for the hand-written per-language
wrappers emitted by `owl-codegen`. They are also inlined as `const &str` in
`crates/owl-codegen/src/lib.rs` so the codegen is self-contained. If you edit
the files here, mirror the change in the lib.rs constants.

* `dart.osp.dart.tmpl` — Dart wrapper around `package:protobuf`.
* `node.osp.js.tmpl`    — Node.js wrapper around `protobufjs`.
* `python.osp.py.tmpl`  — Python re-export of `_pb2` classes.
* `python.Makefile.tmpl`— `make` target for `protoc --python_out`.
* `php.Osp.php.tmpl`    — PHP convenience class.
* `go.README.md.tmpl`   — Go instructions for `protoc --go_out`.
* `rust.osp_v1.rs.tmpl` — Rust wrapper that re-exports the prost-build module.
