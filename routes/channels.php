<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('document.{documentId}', function ($user, $documentId) {
    return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
    ];
});