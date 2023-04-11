<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_questions', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->boolean('is_active')->default(1);

            $table->timestamps();

            $table->index('author_id', 'question_user_idx');
            $table->foreign('author_id', 'question_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_questions');
    }
}
