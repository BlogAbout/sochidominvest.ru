<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_buildings', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('address')->nullable();
            $table->string('coordinates')->nullable();
            $table->string('type')->nullable();
            $table->string('status')->nullable();
            $table->boolean('is_active')->default(1);
            $table->boolean('is_publish')->default(0);
            $table->boolean('is_rent')->default(0);
            $table->float('area', 5)->nullable();
            $table->float('area_min', 5)->nullable();
            $table->float('area_max', 5)->nullable();
            $table->float('cost', 11)->nullable();
            $table->float('cost_min', 11)->nullable();
            $table->float('cost_max', 11)->nullable();
            $table->float('cost_min_unit', 11)->nullable();
            $table->string('meta_title')->nullable();;
            $table->text('meta_description')->nullable();
            $table->unsignedInteger('views')->default(0);

            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_buildings');
    }
}
