<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToBuildingInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_building_info', function (Blueprint $table) {
            $table->index('id', 'building_info_building_idx');
            $table->foreign('id', 'building_info_building_fk')->on('sdi_buildings')->references('id');

            $table->index('avatar_id', 'building_info_attachment_idx');
            $table->foreign('avatar_id', 'building_info_attachment_fk')->on('sdi_attachments')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_building_info', function (Blueprint $table) {
            $table->dropForeign('building_info_building_fk');
            $table->dropIndex('building_info_building_idx');

            $table->dropForeign('building_info_attachment_fk');
            $table->dropIndex('building_info_attachment_idx');
        });
    }
}
