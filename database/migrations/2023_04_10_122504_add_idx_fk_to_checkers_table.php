<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToCheckersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_checkers', function (Blueprint $table) {
            $table->index('author_id', 'checker_user_idx');
            $table->foreign('author_id', 'checker_user_fk')->on('sdi_users')->references('id');

            $table->index('building_id', 'checker_building_idx');
            $table->foreign('building_id', 'checker_building_fk')->on('sdi_buildings')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_checkers', function (Blueprint $table) {
            $table->dropForeign('checker_user_fk');
            $table->dropIndex('checker_user_idx');

            $table->dropForeign('checker_building_fk');
            $table->dropIndex('checker_building_idx');
        });
    }
}
