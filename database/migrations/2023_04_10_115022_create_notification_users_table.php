<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_notification_users', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('notification_id')->nullable();
            $table->string('status')->default('new');

            $table->index(['user_id', 'notification_id'], 'notification_user_idx');
            $table->foreign('user_id', 'notification_user_user_fk')->on('sdi_users')->references('id');
            $table->foreign('notification_id', 'notification_user_notification_fk')->on('sdi_notifications')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_notification_users');
    }
}
