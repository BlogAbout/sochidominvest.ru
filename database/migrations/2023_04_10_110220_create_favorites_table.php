<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_favorites', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('building_id')->nullable();

            $table->index(['user_id', 'building_id'], 'favorite_idx');
            $table->foreign('user_id', 'favorite_user_fk')->on('sdi_users')->references('id');
            $table->foreign('building_id', 'favorite_building_fk')->on('sdi_buildings')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_favorites');
    }
}
