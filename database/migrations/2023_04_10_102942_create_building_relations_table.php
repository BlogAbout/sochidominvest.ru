<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildingRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_building_relations', function (Blueprint $table) {
            $table->unsignedBigInteger('building_id')->nullable();
            $table->unsignedBigInteger('object_id')->nullable();
            $table->string('object_type')->nullable();

            $table->index(['building_id', 'object_id', 'object_type'], 'building_relation_idx');
            $table->foreign('building_id', 'relation_building_fk')->on('sdi_buildings')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_building_relations');
    }
}
