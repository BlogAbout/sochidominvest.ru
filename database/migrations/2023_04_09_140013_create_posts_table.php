<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_posts', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('post_id')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);

            $table->timestamps();

            $table->index('post_id', 'post_post_idx');
            $table->foreign('post_id', 'post_post_fk')->on('sdi_posts')->references('id');

            $table->index('author_id', 'post_user_idx');
            $table->foreign('author_id', 'post_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_posts');
    }
}
