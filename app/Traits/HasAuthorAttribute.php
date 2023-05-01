<?php

namespace App\Traits;

use App\Models\User;

trait HasAuthorAttribute
{
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites', 'bpSorting']);
    }
}
