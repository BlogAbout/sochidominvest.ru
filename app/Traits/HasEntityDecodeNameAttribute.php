<?php

namespace App\Traits;

trait HasEntityDecodeNameAttribute
{
    public function getNameAttribute($value): string
    {
        return html_entity_decode($value);
    }
}
