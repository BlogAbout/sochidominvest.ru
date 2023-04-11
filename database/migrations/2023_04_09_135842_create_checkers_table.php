<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCheckersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_checkers', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('building_id')->nullable();
            $table->string('name');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->float('area', 5)->nullable();
            $table->float('cost', 11)->nullable();
            $table->string('furnish')->nullable();
            $table->integer('housing')->nullable();
            $table->string('stage')->nullable();
            $table->integer('rooms')->nullable();
            $table->boolean('is_active')->default(1);
            $table->string('status')->default('free');

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
        Schema::dropIfExists('sdi_checkers');
    }
}
