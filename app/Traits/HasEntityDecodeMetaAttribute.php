<?php

namespace App\Traits;

trait HasEntityDecodeMetaAttribute
{
    public function getMetaTitleAttribute($value): string
    {
        return html_entity_decode($value);
    }

    public function getMetaDescriptionAttribute($value): string
    {
        return html_entity_decode($value);
    }
}
