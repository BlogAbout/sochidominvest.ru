<?php

namespace App\Traits;

use App\Models\Attachment;

trait HasAvatarAttribute
{
    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id', 'id')
            ->without(['poster', 'author']);
    }
}
