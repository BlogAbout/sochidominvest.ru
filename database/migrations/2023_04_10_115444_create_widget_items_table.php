<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWidgetItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_widget_items', function (Blueprint $table) {
            $table->unsignedBigInteger('widget_id')->nullable();
            $table->unsignedBigInteger('object_id')->nullable();
            $table->string('object_type')->nullable();
            $table->integer('ordering')->default(0);

            $table->index(['widget_id', 'object_id', 'object_type'], 'widget_item_idx');
            $table->foreign('widget_id', 'widget_item_widget_fk')->on('sdi_widgets')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_widget_items');
    }
}
