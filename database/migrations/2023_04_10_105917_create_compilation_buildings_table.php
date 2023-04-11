<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompilationBuildingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_compilation_buildings', function (Blueprint $table) {
            $table->unsignedBigInteger('compilation_id')->nullable();
            $table->unsignedBigInteger('building_id')->nullable();

            $table->index(['compilation_id', 'building_id'], 'compilation_building_idx');
            $table->foreign('compilation_id', 'compilation_compilation_fk')->on('sdi_compilations')->references('id');
            $table->foreign('building_id', 'compilation_building_fk')->on('sdi_buildings')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_compilation_buildings');
    }
}
