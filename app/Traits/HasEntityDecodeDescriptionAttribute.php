<?php

namespace App\Traits;

trait HasEntityDecodeDescriptionAttribute
{
    public function getDescriptionAttribute($value): string
    {
        return html_entity_decode($value);
    }
}
