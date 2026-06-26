<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $fillable = [
        'title',
        'content',
        'user_id',
    ];

    /**
     * Relasi ke User (pemilik dokumen)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}