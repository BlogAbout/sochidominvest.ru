<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Carbon::setLocale('ru_RU');

        if ($this->app->environment('local')) {
            Mail::alwaysTo(config('mail.local.address'));
        }
    }
}
