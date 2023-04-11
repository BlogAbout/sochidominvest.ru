<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToDevelopersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_developers', function (Blueprint $table) {
            $table->index('author_id', 'developer_user_idx');
            $table->foreign('author_id', 'developer_user_fk')->on('sdi_users')->references('id');

            $table->index('avatar_id', 'developer_attachment_idx');
            $table->foreign('avatar_id', 'developer_attachment_fk')->on('sdi_attachments')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_developers', function (Blueprint $table) {
            $table->dropForeign('developer_user_fk');
            $table->dropIndex('developer_user_idx');

            $table->dropForeign('developer_attachment_fk');
            $table->dropIndex('developer_attachment_idx');
        });
    }
}
