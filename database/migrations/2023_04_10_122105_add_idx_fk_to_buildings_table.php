<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToBuildingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_buildings', function (Blueprint $table) {
            $table->index('author_id', 'building_user_idx');
            $table->foreign('author_id', 'building_user_fk')->on('sdi_users')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_buildings', function (Blueprint $table) {
            $table->dropForeign('building_user_fk');
            $table->dropIndex('building_user_idx');
        });
    }
}
