<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusinessProcessAttendeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_business_process_attendees', function (Blueprint $table) {
            $table->unsignedBigInteger('business_process_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->index(['business_process_id', 'user_id'], 'business_process_attendee_idx');
            $table->foreign('business_process_id', 'attendee_business_process_fk')->on('sdi_business_processes')->references('id');
            $table->foreign('user_id', 'attendee_user_fk')->on('sdi_users')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_business_process_attendees');
    }
}
