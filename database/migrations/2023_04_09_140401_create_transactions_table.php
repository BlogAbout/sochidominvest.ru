<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_transactions', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('email')->nullable();
            $table->float('cost', 11)->nullable();
            $table->unsignedBigInteger('object_id')->nullable();
            $table->string('object_type')->nullable();
            $table->string('duration')->nullable();
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();

            $table->index('user_id', 'transaction_user_idx');
            $table->foreign('user_id', 'transaction_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_transactions');
    }
}
