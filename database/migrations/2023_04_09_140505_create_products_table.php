<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_products', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->float('cost', 11)->nullable();
            $table->float('cost_old', 11)->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->unsignedBigInteger('avatar_id')->nullable();
            $table->text('fields')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamps();

            $table->index('category_id', 'product_category_idx');
            $table->foreign('category_id', 'product_category_fk')->on('sdi_categories')->references('id');

            $table->index('author_id', 'product_user_idx');
            $table->foreign('author_id', 'product_user_fk')->on('sdi_users')->references('id');

            $table->index('avatar_id', 'product_attachment_idx');
            $table->foreign('avatar_id', 'product_attachment_fk')->on('sdi_attachments')->references('id');

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
        Schema::dropIfExists('sdi_products');
    }
}
