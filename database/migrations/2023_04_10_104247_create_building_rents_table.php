<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildingRentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_building_rent', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->unique();
            $table->text('description')->nullable();
            $table->string('type')->default('long');
            $table->boolean('deposit')->default(0);
            $table->boolean('commission')->default(0);
            $table->float('cost', 11)->nullable();
            $table->float('cost_deposit', 11)->nullable();
            $table->float('cost_commission', 11)->nullable();

            $table->index('id', 'building_rent_building_idx');
            $table->foreign('id', 'building_rent_building_fk')->on('sdi_buildings')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_building_rent');
    }
}
