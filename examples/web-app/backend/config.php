<?php

return [
    // OSP Server connection
    'osp' => [
        'host' => 'localhost',
        'port' => 9420,
        'token' => 'backend-token-123',
        'collection' => 'todos'
    ],

    // Database (simple JSON file for demo)
    'database' => [
        'path' => __DIR__ . '/data.json'
    ],

    // Validation rules
    'validation' => [
        'max_title_length' => 200,
        'min_title_length' => 1
    ]
];
