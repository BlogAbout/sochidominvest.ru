<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_agents', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('type')->default('agent');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->unsignedBigInteger('avatar_id')->nullable();

            $table->timestamps();

            $table->index('author_id', 'agent_user_idx');
            $table->foreign('author_id', 'agent_user_fk')->on('sdi_users')->references('id');

            $table->index('avatar_id', 'agent_attachment_idx');
            $table->foreign('avatar_id', 'agent_attachment_fk')->on('sdi_attachments')->references('id');

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
        Schema::dropIfExists('sdi_agents');
    }
}
