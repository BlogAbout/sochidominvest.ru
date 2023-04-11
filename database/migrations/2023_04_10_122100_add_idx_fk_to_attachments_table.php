<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_attachments', function (Blueprint $table) {
            $table->index('author_id', 'attachment_user_idx');
            $table->foreign('author_id', 'attachment_user_fk')->on('sdi_users')->references('id');

            $table->index('poster_id', 'attachment_attachment_idx');
            $table->foreign('poster_id', 'attachment_attachment_fk')->on('sdi_attachments')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_attachments', function (Blueprint $table) {
            $table->dropForeign('attachment_user_fk');
            $table->dropIndex('attachment_user_idx');

            $table->dropForeign('attachment_attachment_fk');
            $table->dropIndex('attachment_attachment_idx');
        });
    }
}
