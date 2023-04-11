<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWidgetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_widgets', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('type')->default('article');
            $table->string('style')->default('list');
            $table->string('page')->default('main');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->integer('ordering')->default(0);

            $table->timestamps();

            $table->index('author_id', 'widget_user_idx');
            $table->foreign('author_id', 'widget_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_widgets');
    }
}
