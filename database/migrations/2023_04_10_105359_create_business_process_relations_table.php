<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusinessProcessRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_business_process_relations', function (Blueprint $table) {
            $table->unsignedBigInteger('business_process_id')->nullable();
            $table->unsignedBigInteger('object_id')->nullable();
            $table->string('object_type')->nullable();

            $table->index(['business_process_id', 'object_id', 'object_type'], 'relation_business_process_idx');
            $table->foreign('business_process_id', 'relation_business_process_fk')->on('sdi_business_processes')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_business_process_relations');
    }
}
