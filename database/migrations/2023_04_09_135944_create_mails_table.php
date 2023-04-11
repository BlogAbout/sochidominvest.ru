<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_mails', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('content')->nullable();
            $table->text('content_html')->nullable();
            $table->string('type')->default('mail');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->smallInteger('status')->default(0);

            $table->timestamps();

            $table->index('author_id', 'mail_user_idx');
            $table->foreign('author_id', 'mail_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_mails');
    }
}
