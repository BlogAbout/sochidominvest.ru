<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class SettingService
{
    private $settings = [];
    private $defaultSettings = [
        'article_show_date' => 'date_created',
        'count_items_admin' => '20',
        'smtp_enable' => '0',
        'smtp_ssl' => '0',
        'smtp_host' => '',
        'smtp_login' => '',
        'smtp_password' => '',
        'smtp_email' => 'info@sochidominvest.ru',
        'sms_enable' => '0',
        'sms_service' => '',
        'sms_address' => '',
        'sms_api_key' => '',
        'sms_login' => '',
        'sms_password' => '',
        'telegram_enable' => '0',
        'telegram_bot_id' => '',
        'telegram_bot_api_key' => '',
        'mail_enable' => '0',
        'websocket_messenger' => '0',
        'websocket_notification' => '0',
        'image_thumb_width' => '400',
        'image_thumb_height' => '400',
        'image_full_width' => '2000',
        'image_full_height' => '2000',
        'map_api_key' => '',
        'map_icon_color' => 'islands#blueIcon'
    ];

    public function __construct()
    {
        $this->loadSettings();
    }

    public function get(string $name = '', string $defaultValue = '')
    {
        if (trim($name) === '') {
            return $this->settings;
        }

        if ($this->settings[$name]) {
            return $this->settings[$name];
        } elseif ($defaultValue) {
            return $defaultValue;
        }

        return '';
    }

    public function set(array $settings)
    {
        $includeSettings = array_intersect_key($settings, $this->settings);

        if (count($includeSettings)) {
            $arrayForStore = [];

            foreach ($includeSettings as $name => $value) {
                $this->settings[$name] = $value;
                array_push($arrayForStore, ['name' => $name, 'value' => $value]);
            }

            DB::table('sdi_settings')->upsert($arrayForStore, ['name'], ['value']);
        }
    }

    private function loadSettings(): void
    {
        $settingsArray = DB::table('sdi_settings')->get();

        $settings = [];
        foreach ($settingsArray as $setting) {
            $settings[$setting->name] = $setting->value;
        }

        $this->settings = array_merge($this->defaultSettings, $settings);
    }
}
