<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'read_date',
        'review',
    ];

    protected $casts = [
        'read_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
