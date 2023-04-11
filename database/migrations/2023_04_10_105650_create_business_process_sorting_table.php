<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusinessProcessSortingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_business_process_sorting', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('sorting')->nullable();

            $table->index('user_id', 'bp_sorting_user_idx');
            $table->foreign('user_id', 'bp_sorting_user_fk')->on('sdi_users')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_business_process_sorting');
    }
}
