<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdxFkToCompilationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sdi_compilations', function (Blueprint $table) {
            $table->index('author_id', 'compilation_user_idx');
            $table->foreign('author_id', 'compilation_user_fk')->on('sdi_users')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sdi_compilations', function (Blueprint $table) {
            $table->dropForeign('compilation_user_fk');
            $table->dropIndex('compilation_user_idx');
        });
    }
}
