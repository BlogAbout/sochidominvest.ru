<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_users', function (Blueprint $table) {
            $table->index('avatar_id', 'user_attachment_idx');
            $table->foreign('avatar_id', 'user_attachment_fk')->on('sdi_attachments')->references('id');

            $table->index('role_id', 'user_role_idx');
            $table->foreign('role_id', 'user_role_fk')->on('sdi_roles')->references('id');

            $table->index('post_id', 'user_post_idx');
            $table->foreign('post_id', 'user_post_fk')->on('sdi_posts')->references('id');

            $table->index('tariff_id', 'user_tariff_idx');
            $table->foreign('tariff_id', 'user_tariff_fk')->on('sdi_tariffs')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_users', function (Blueprint $table) {
            $table->dropForeign('user_attachment_fk');
            $table->dropIndex('user_attachment_idx');

            $table->dropForeign('user_role_fk');
            $table->dropIndex('user_role_idx');

            $table->dropForeign('user_post_fk');
            $table->dropIndex('user_post_idx');

            $table->dropForeign('user_tariff_fk');
            $table->dropIndex('user_tariff_idx');
        });
    }
}
