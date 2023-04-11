<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_contacts', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('agent_id')->nullable();
            $table->unsignedBigInteger('post_id')->nullable();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);

            $table->timestamps();

            $table->index('agent_id', 'contact_agent_idx');
            $table->foreign('agent_id', 'contact_agent_fk')->on('sdi_agents')->references('id');

            $table->index('post_id', 'contact_post_idx');
            $table->foreign('post_id', 'contact_post_fk')->on('sdi_posts')->references('id');

            $table->index('author_id', 'contact_user_idx');
            $table->foreign('author_id', 'contact_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_contacts');
    }
}
