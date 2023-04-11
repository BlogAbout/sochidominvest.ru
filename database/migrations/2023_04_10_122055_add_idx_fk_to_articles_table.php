<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_articles', function (Blueprint $table) {
            $table->index('author_id', 'article_user_idx');
            $table->foreign('author_id', 'article_user_fk')->on('sdi_users')->references('id');

            $table->index('avatar_id', 'article_attachment_idx');
            $table->foreign('avatar_id', 'article_attachment_fk')->on('sdi_attachments')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_articles', function (Blueprint $table) {
            $table->dropForeign('article_user_fk');
            $table->dropIndex('article_user_idx');

            $table->dropForeign('article_attachment_fk');
            $table->dropIndex('article_attachment_idx');
        });
    }
}
