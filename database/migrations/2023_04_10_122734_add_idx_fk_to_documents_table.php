<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_documents', function (Blueprint $table) {
            $table->index('author_id', 'document_user_idx');
            $table->foreign('author_id', 'document_user_fk')->on('sdi_users')->references('id');

            $table->index('attachment_id', 'document_attachment_idx');
            $table->foreign('attachment_id', 'document_attachment_fk')->on('sdi_attachments')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_documents', function (Blueprint $table) {
            $table->dropForeign('document_user_fk');
            $table->dropIndex('document_user_idx');

            $table->dropForeign('document_attachment_fk');
            $table->dropIndex('document_attachment_idx');
        });
    }
}
