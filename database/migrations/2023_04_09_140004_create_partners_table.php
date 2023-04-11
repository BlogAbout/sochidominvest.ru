<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartnersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_partners', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description')->nullable();
            $table->text('info')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('type')->default('partner');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->unsignedBigInteger('avatar_id')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamps();

            $table->index('author_id', 'partner_user_idx');
            $table->foreign('author_id', 'partner_user_fk')->on('sdi_users')->references('id');

            $table->index('avatar_id', 'partner_attachment_idx');
            $table->foreign('avatar_id', 'partner_attachment_fk')->on('sdi_attachments')->references('id');

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
        Schema::dropIfExists('sdi_partners');
    }
}
