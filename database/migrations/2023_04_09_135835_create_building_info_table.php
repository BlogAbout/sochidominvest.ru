<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildingInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_building_info', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->unique();
            $table->string('district')->nullable();
            $table->string('district_zone')->nullable();
            $table->string('house_class')->nullable();
            $table->string('material')->nullable();
            $table->string('house_type')->nullable();
            $table->string('entrance_house')->nullable();
            $table->string('parking')->nullable();
            $table->string('territory')->nullable();
            $table->float('ceiling_height', 5)->nullable();
            $table->float('maintenance_cost', 5)->nullable();
            $table->unsignedBigInteger('distance_sea')->nullable();
            $table->string('gas')->nullable();
            $table->string('heating')->nullable();
            $table->string('electricity')->nullable();
            $table->string('sewerage')->nullable();
            $table->string('water_supply')->nullable();
            $table->text('advantages')->nullable();
            $table->string('payments')->nullable();
            $table->string('formalization')->nullable();
            $table->string('amount_contract')->nullable();
            $table->float('surcharge_doc', 11)->nullable();
            $table->float('surcharge_gas', 11)->nullable();
            $table->boolean('is_sale_no_resident')->default(0);
            $table->string('passed')->nullable();
            $table->string('cadastr_number')->nullable();
            $table->float('cadastr_cost', 11)->nullable();
            $table->unsignedBigInteger('avatar_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_building_info');
    }
}
