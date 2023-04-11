<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_feeds', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('type')->default('feed');
            $table->string('status')->default('new');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('phone')->nullable();
            $table->string('name')->nullable();
            $table->unsignedBigInteger('object_id')->nullable();
            $table->string('object_type')->nullable();
            $table->boolean('is_active')->default(1);

            $table->timestamps();

            $table->index('author_id', 'feed_author_idx');
            $table->foreign('author_id', 'feed_author_fk')->on('sdi_users')->references('id');

            $table->index('user_id', 'feed_user_idx');
            $table->foreign('user_id', 'feed_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_feeds');
    }
}
