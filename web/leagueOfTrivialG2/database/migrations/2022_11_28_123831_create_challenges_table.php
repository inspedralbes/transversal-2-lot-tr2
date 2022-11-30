<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->bigInteger('id-game')->unsigned();
            $table->bigInteger('id-challenger')->unsigned();
            $table->bigInteger('id-challenged')->unsigned();

            $table->boolean('seen');
            $table->integer('winner');
            $table->timestamp('creationDate');
            $table->primary(['id-game', 'id-challenger', 'id-challenged']);
            $table->foreign('id-game')->references('id')->on('games')->onDelete('cascade');
            $table->foreign('id-challenger')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id-challenged')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('challenges');
    }
};
