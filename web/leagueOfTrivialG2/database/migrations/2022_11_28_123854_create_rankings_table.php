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
        Schema::create('rankings', function (Blueprint $table) {
            $table->integer('id-game')->index();
            $table->integer('id-user')->index();
            
            $table->integer('puntuacio');
            $table->timestamp('creationDate');
            $table->primary(['id-game', 'id-user']);
            $table->foreign('id-game')->references('id')->on('games')->onDelete('cascade');
            $table->foreign('id-user')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rankings');
    }
};
