// owl_php_entry.c — C wrapper for the OWL PHP extension.
//
// The actual implementation is in Rust (owl-php cdylib). This C file
// just provides the C ABI `get_module()` entry point that PHP looks
// for, and constructs a `zend_module_entry` whose function table is
// populated by the Rust side via `owl_php_register_module()`.

#include <php.h>
#include <zend_API.h>

extern int owl_php_register_module(zend_module_entry *entry);

zend_module_entry owl_php_module_entry;

ZEND_DLEXPORT zend_module_entry *get_module(void)
{
    if (owl_php_register_module(&owl_php_module_entry) != 0) {
        return NULL;
    }
    return &owl_php_module_entry;
}
