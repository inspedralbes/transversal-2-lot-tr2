<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChallengesController extends Controller
{
    public function store(Request $request)
    {
        $challenge = new Challenge();
        $challenge->seen = false;
        $challenge->winner = $request->winner;
        $challenge->idChallenger = $request->idChallenger;
        $challenge->idChallenged = $request->idChallenged;
        $challenge->idGame = $request->idGame;
        $challenge->save();

        $challengersInfo = DB::table('users')->where('id', $request->idChallenger)->first();
        $challengedsInfo = DB::table('users')->where('id', $request->idChallenged)->first();

        $from = "leagueoftrivial2@inspedralbes.cat";
        $subject = "Challenge alert!";
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: ' . $from . "\r\n" .
            'Reply-To: ' . $from . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

        // EMAIL FOR THE WINNER
        $toWinner = '';
        $msgWinner = '';
        if ($challenge->winner == $challenge->idChallenger) {
            $toWinner = "$challengersInfo->email";
            $msgWinner = "<html lang='ca'><head> <title>League of Trivial</title> <style type='text/css'> @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap'); * { background-color: #303660; font-family: Arial, Helvetica, sans-serif; color: white; } body { margin: 0; padding: 0; height: 100%; width: 100%; } img { border: 0; height: auto; /* width: auto; */ line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse; } .quiz-lobby__button { margin-top: 2%; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; color: white; padding: 10px; width: 200px; transition: all 0.7s ease-out; background: linear-gradient(270deg, rgba(188, 107, 234, 1) 0%, rgba(165, 70, 118, 1) 28%, rgba(76, 82, 134, 1) 62%, rgba(76, 82, 134, 1) 92%); background-position: 1% 50%; background-size: 300% 300%; text-decoration: none; margin: auto; border: 0; border-radius: 0.5em; border-bottom: 0.25em solid #242742; position: relative; transition: 0.5s; margin-top: 39px; height: 60px; display: flex; justify-content: center; align-items: center; } .quiz-lobby__button:after { font-size: 20px; font-weight: bolder; position: relative; opacity: 0; left: 12px; transition: 0.5s; } .quiz-lobby__button:hover { color: #fff; background-position: 99% 50%; } .quiz-lobby__button:hover:after { opacity: 1; } </style></head><body style='margin: 0; padding: 0;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff'> <div align='center' style='padding: 0px 15px 0px 15px;'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='wrapper'> <tr> <td style='padding: 20px 0px 30px 0px;' class='logo'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td bgcolor='#ffffff' width='100' align='left'><a href='http://trivial2.alumnes.inspedralbes.cat/' target='_blank'><img alt='Logo' src='http://trivial2.alumnes.inspedralbes.cat/img/logo-sm.png' width='52' height='78' border='0'></a></td> </tr> </table> </td> </tr> </table> </div> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center' style='padding: 0 15px 70px 15px;' class='section-padding'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='responsive-table'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='padding-copy'> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <img src='http://trivial2.alumnes.inspedralbes.cat/img/fina.gif' width='50%' border='0' alt='League of Trivial logo' style='display: block; padding: 0; color: #666666; text-decoration: none; font-size: 16px; width: 600px; height: 350px;' class='img-max'> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td align='center' style='font-size: 25px; padding-top: 30px;' class='padding-copy'>Challenge alert!</td> </tr> <tr> <td align='center' style='padding: 20px 0 0 0; font-size: 16px; line-height: 35px;' class='padding-copy'>What's up, <span style='color: #b967dd'>$challengersInfo->userName</span>? <br>You have challenged <span style='color: #b967dd'>$challengedsInfo->userName</span> and you have won!<br>Poor thing, <span style='color: #b967dd'>$challengedsInfo->userName</span> might be upset :( <br> But don't relax, <span style='color: #b967dd'>$challengedsInfo->userName</span> can challenge you back... <br>Maybe next time you result as defeated ;) </td> </tr> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'> <tr> <td align='center' style='padding: 25px 0 0 0;' class='padding-copy'> <table border='0' cellspacing='0' cellpadding='0' class='responsive-table'> <tr> <td align='center'><a href='http://trivial2.alumnes.inspedralbes.cat/front/index.html#/profile/" . $challengersInfo->id . "' target='_blank' class='quiz-lobby__button'>Your profile</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'> <tr> <td style='padding: 20px 0px 20px 0px;'> <table width='500' border='0' cellspacing='0' cellpadding='0' align='center' class='responsive-table'> <tr> <td align='center' valign='middle' style='font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;'> <span class='appleFooter' style='color:#666666;'>Av. Esplugues, 36-42. 08034. Barcelona</span><br><a class='original-only' style='color: #666666; text-decoration: none;'>League of Trivial | 2022</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>";
        } else if ($challenge->winner == $challenge->idChallenged) {
            $toWinner = "$challengedsInfo->email";
            $msgWinner = "<html lang='ca'><head> <title>League of Trivial</title> <style type='text/css'> @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap'); * { background-color: #303660; font-family: Arial, Helvetica, sans-serif; color: white; } body { margin: 0; padding: 0; height: 100%; width: 100%; } img { border: 0; height: auto; /* width: auto; */ line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse; } .quiz-lobby__button { margin-top: 2%; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; color: white; padding: 10px; width: 200px; transition: all 0.7s ease-out; background: linear-gradient(270deg, rgba(188, 107, 234, 1) 0%, rgba(165, 70, 118, 1) 28%, rgba(76, 82, 134, 1) 62%, rgba(76, 82, 134, 1) 92%); background-position: 1% 50%; background-size: 300% 300%; text-decoration: none; margin: auto; border: 0; border-radius: 0.5em; border-bottom: 0.25em solid #242742; position: relative; transition: 0.5s; margin-top: 39px; height: 60px; display: flex; justify-content: center; align-items: center; } .quiz-lobby__button:after { font-size: 20px; font-weight: bolder; position: relative; opacity: 0; left: 12px; transition: 0.5s; } .quiz-lobby__button:hover { color: #fff; background-position: 99% 50%; } .quiz-lobby__button:hover:after { opacity: 1; } </style></head><body style='margin: 0; padding: 0;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff'> <div align='center' style='padding: 0px 15px 0px 15px;'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='wrapper'> <tr> <td style='padding: 20px 0px 30px 0px;' class='logo'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td bgcolor='#ffffff' width='100' align='left'><a href='http://trivial2.alumnes.inspedralbes.cat/' target='_blank'><img alt='Logo' src='http://trivial2.alumnes.inspedralbes.cat/img/logo-sm.png' width='52' height='78' border='0'></a></td> </tr> </table> </td> </tr> </table> </div> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center' style='padding: 0 15px 70px 15px;' class='section-padding'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='responsive-table'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='padding-copy'> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <img src='http://trivial2.alumnes.inspedralbes.cat/img/fina.gif' width='50%' border='0' alt='League of Trivial logo' style='display: block; padding: 0; color: #666666; text-decoration: none; font-size: 16px; width: 600px; height: 350px;' class='img-max'> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td align='center' style='font-size: 25px; padding-top: 30px;' class='padding-copy'>Challenge alert!</td> </tr> <tr> <td align='center' style='padding: 20px 0 0 0; font-size: 16px; line-height: 35px;' class='padding-copy'>What's up, <span style='color: #b967dd'>$challengedsInfo->userName</span>? <br>You have been challenged by <span style='color: #b967dd'>$challengersInfo->userName</span>, but you are untouchable! <br>Keep it up ;) <br> But don't relax, you can't be untouchable forever... </td> </tr> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'> <tr> <td align='center' style='padding: 25px 0 0 0;' class='padding-copy'> <table border='0' cellspacing='0' cellpadding='0' class='responsive-table'> <tr> <td align='center'><a href='http://trivial2.alumnes.inspedralbes.cat/front/index.html#/profile/" . $challengedsInfo->id . "' target='_blank' class='quiz-lobby__button'>Your profile</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'> <tr> <td style='padding: 20px 0px 20px 0px;'> <table width='500' border='0' cellspacing='0' cellpadding='0' align='center' class='responsive-table'> <tr> <td align='center' valign='middle' style='font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;'> <span class='appleFooter' style='color:#666666;'>Av. Esplugues, 36-42. 08034. Barcelona</span><br><a class='original-only' style='color: #666666; text-decoration: none;'>League of Trivial | 2022</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>";
        }
        mail($toWinner, $subject, $msgWinner, $headers);

        // EMAIL FOR THE LOSER
        $toLoser = '';
        $msgLoser = '';
        if ($challenge->winner != $challenge->idChallenger) {
            $toLoser = "$challengersInfo->email";
            $msgLoser = "<html lang='ca'><head> <title>League of Trivial</title> <style type='text/css'> @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap'); * { background-color: #303660; font-family: Arial, Helvetica, sans-serif; color: white; } body { margin: 0; padding: 0; height: 100%; width: 100%; } img { border: 0; height: auto; /* width: auto; */ line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse; } .quiz-lobby__button { margin-top: 2%; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; color: white; padding: 10px; width: 200px; transition: all 0.7s ease-out; background: linear-gradient(270deg, rgba(188, 107, 234, 1) 0%, rgba(165, 70, 118, 1) 28%, rgba(76, 82, 134, 1) 62%, rgba(76, 82, 134, 1) 92%); background-position: 1% 50%; background-size: 300% 300%; text-decoration: none; margin: auto; border: 0; border-radius: 0.5em; border-bottom: 0.25em solid #242742; position: relative; transition: 0.5s; margin-top: 39px; height: 60px; display: flex; justify-content: center; align-items: center; } .quiz-lobby__button:after { font-size: 20px; font-weight: bolder; position: relative; opacity: 0; left: 12px; transition: 0.5s; } .quiz-lobby__button:hover { color: #fff; background-position: 99% 50%; } .quiz-lobby__button:hover:after { opacity: 1; } </style></head><body style='margin: 0; padding: 0;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff'> <div align='center' style='padding: 0px 15px 0px 15px;'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='wrapper'> <tr> <td style='padding: 20px 0px 30px 0px;' class='logo'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td bgcolor='#ffffff' width='100' align='left'><a href='http://trivial2.alumnes.inspedralbes.cat/' target='_blank'><img alt='Logo' src='http://trivial2.alumnes.inspedralbes.cat/img/logo-sm.png' width='52' height='78' border='0'></a></td> </tr> </table> </td> </tr> </table> </div> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center' style='padding: 0 15px 70px 15px;' class='section-padding'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='responsive-table'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='padding-copy'> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <img src='http://trivial2.alumnes.inspedralbes.cat/img/fina.gif' width='50%' border='0' alt='League of Trivial logo' style='display: block; padding: 0; color: #666666; text-decoration: none; font-size: 16px; width: 600px; height: 350px;' class='img-max'> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td align='center' style='font-size: 25px; padding-top: 30px;' class='padding-copy'>Challenge alert!</td> </tr> <tr> <td align='center' style='padding: 20px 0 0 0; font-size: 16px; line-height: 35px;' class='padding-copy'>What's up, <span style='color: #b967dd'>$challengersInfo->userName</span>? <br>You have challenged <span style='color: #b967dd'>$challengedsInfo->userName</span> but you did not succeed :(<br>But hey, don't you ever give up!<br> Maybe you will be able to win next time ;) </td> </tr> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'> <tr> <td align='center' style='padding: 25px 0 0 0;' class='padding-copy'> <table border='0' cellspacing='0' cellpadding='0' class='responsive-table'> <tr> <td align='center'><a href='http://trivial2.alumnes.inspedralbes.cat/front/index.html#/profile/" . $challengersInfo->id . "' target='_blank' class='quiz-lobby__button'>Your profile</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'> <tr> <td style='padding: 20px 0px 20px 0px;'> <table width='500' border='0' cellspacing='0' cellpadding='0' align='center' class='responsive-table'> <tr> <td align='center' valign='middle' style='font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;'> <span class='appleFooter' style='color:#666666;'>Av. Esplugues, 36-42. 08034. Barcelona</span><br><a class='original-only' style='color: #666666; text-decoration: none;'>League of Trivial | 2022</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>";
        } else if ($challenge->winner != $challenge->idChallenged) {
            $toLoser = "$challengedsInfo->email";
            $msgLoser = "<html lang='ca'><head> <title>League of Trivial</title> <style type='text/css'> @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap'); * { background-color: #303660; font-family: Arial, Helvetica, sans-serif; color: white; } body { margin: 0; padding: 0; height: 100%; width: 100%; } img { border: 0; height: auto; /* width: auto; */ line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse; } .quiz-lobby__button { margin-top: 2%; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; color: white; padding: 10px; width: 200px; transition: all 0.7s ease-out; background: linear-gradient(270deg, rgba(188, 107, 234, 1) 0%, rgba(165, 70, 118, 1) 28%, rgba(76, 82, 134, 1) 62%, rgba(76, 82, 134, 1) 92%); background-position: 1% 50%; background-size: 300% 300%; text-decoration: none; margin: auto; border: 0; border-radius: 0.5em; border-bottom: 0.25em solid #242742; position: relative; transition: 0.5s; margin-top: 39px; height: 60px; display: flex; justify-content: center; align-items: center; } .quiz-lobby__button:after { font-size: 20px; font-weight: bolder; position: relative; opacity: 0; left: 12px; transition: 0.5s; } .quiz-lobby__button:hover { color: #fff; background-position: 99% 50%; } .quiz-lobby__button:hover:after { opacity: 1; } </style></head><body style='margin: 0; padding: 0;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff'> <div align='center' style='padding: 0px 15px 0px 15px;'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='wrapper'> <tr> <td style='padding: 20px 0px 30px 0px;' class='logo'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td bgcolor='#ffffff' width='100' align='left'><a href='http://trivial2.alumnes.inspedralbes.cat/' target='_blank'><img alt='Logo' src='http://trivial2.alumnes.inspedralbes.cat/img/logo-sm.png' width='52' height='78' border='0'></a></td> </tr> </table> </td> </tr> </table> </div> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center' style='padding: 0 15px 70px 15px;' class='section-padding'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='responsive-table'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='padding-copy'> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <img src='http://trivial2.alumnes.inspedralbes.cat/img/fina.gif' width='50%' border='0' alt='League of Trivial logo' style='display: block; padding: 0; color: #666666; text-decoration: none; font-size: 16px; width: 600px; height: 350px;' class='img-max'> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td align='center' style='font-size: 25px; padding-top: 30px;' class='padding-copy'>Challenge alert!</td> </tr> <tr> <td align='center' style='padding: 20px 0 0 0; font-size: 16px; line-height: 35px;' class='padding-copy'>What's up, <span style='color: #b967dd'>$challengedsInfo->userName</span>? <br>You have been challenged by <span style='color: #b967dd'>$challengersInfo->userName</span> and (unfortunately) got defeated :(<br>But hey, don't you ever give up!<br> You can always challenge <span style='color: #b967dd'>$challengersInfo->userName</span> back and get your revenge ;) </td> </tr> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'> <tr> <td align='center' style='padding: 25px 0 0 0;' class='padding-copy'> <table border='0' cellspacing='0' cellpadding='0' class='responsive-table'> <tr> <td align='center'><a href='http://trivial2.alumnes.inspedralbes.cat/front/index.html#/profile/" . $challengedsInfo->id . "' target='_blank' class='quiz-lobby__button'>Your profile</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'> <tr> <td style='padding: 20px 0px 20px 0px;'> <table width='500' border='0' cellspacing='0' cellpadding='0' align='center' class='responsive-table'> <tr> <td align='center' valign='middle' style='font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;'> <span class='appleFooter' style='color:#666666;'>Av. Esplugues, 36-42. 08034. Barcelona</span><br><a class='original-only' style='color: #666666; text-decoration: none;'>League of Trivial | 2022</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>";
        }
        mail($toLoser, $subject, $msgLoser, $headers);

        // EMAIL FOR BOTH (TIE CASE)
        if ($challenge->winner == 0) {
            $to = "$challengersInfo->email, $challengedsInfo->email";
            $msg = "<html lang='ca'><head> <title>League of Trivial</title> <style type='text/css'> @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap'); * { background-color: #303660; font-family: Arial, Helvetica, sans-serif; color: white; } body { margin: 0; padding: 0; height: 100%; width: 100%; } img { border: 0; height: auto; /* width: auto; */ line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse; } .quiz-lobby__button { margin-top: 2%; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; color: white; padding: 10px; width: 200px; transition: all 0.7s ease-out; background: linear-gradient(270deg, rgba(188, 107, 234, 1) 0%, rgba(165, 70, 118, 1) 28%, rgba(76, 82, 134, 1) 62%, rgba(76, 82, 134, 1) 92%); background-position: 1% 50%; background-size: 300% 300%; text-decoration: none; margin: auto; border: 0; border-radius: 0.5em; border-bottom: 0.25em solid #242742; position: relative; transition: 0.5s; margin-top: 39px; height: 60px; display: flex; justify-content: center; align-items: center; } .quiz-lobby__button:after { font-size: 20px; font-weight: bolder; position: relative; opacity: 0; left: 12px; transition: 0.5s; } .quiz-lobby__button:hover { color: #fff; background-position: 99% 50%; } .quiz-lobby__button:hover:after { opacity: 1; } </style></head><body style='margin: 0; padding: 0;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff'> <div align='center' style='padding: 0px 15px 0px 15px;'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='wrapper'> <tr> <td style='padding: 20px 0px 30px 0px;' class='logo'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td bgcolor='#ffffff' width='100' align='left'><a href='http://trivial2.alumnes.inspedralbes.cat/' target='_blank'><img alt='Logo' src='http://trivial2.alumnes.inspedralbes.cat/img/logo-sm.png' width='52' height='78' border='0'></a></td> </tr> </table> </td> </tr> </table> </div> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center' style='padding: 0 15px 70px 15px;' class='section-padding'> <table border='0' cellpadding='0' cellspacing='0' width='500' class='responsive-table'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='padding-copy'> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td> <img src='http://trivial2.alumnes.inspedralbes.cat/img/fina.gif' width='50%' border='0' alt='League of Trivial logo' style='display: block; padding: 0; color: #666666; text-decoration: none; font-size: 16px; width: 600px; height: 350px;' class='img-max'> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td align='center' style='font-size: 25px; padding-top: 30px;' class='padding-copy'>Challenge alert!</td> </tr> <tr> <td align='center' style='padding: 20px 0 0 0; font-size: 16px; line-height: 35px;' class='padding-copy'>REALLY?<br> You both <span style='color: #b967dd'>$challengersInfo->userName</span> and <span style='color: #b967dd'>$challengedsInfo->userName</span> faced in a challenge which turned out as ...<br><strong style='color: #b967dd;font-size: 35;'>TIE</strong> <br> Well, I guess you are equally good :) </td> </tr> </table> </td> </tr> <tr> <td> <table width='100%' border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'> <tr> <td align='center' style='padding: 25px 0 0 0;' class='padding-copy'> <table border='0' cellspacing='0' cellpadding='0' class='responsive-table'> <tr> <td align='center'><a href='http://trivial2.alumnes.inspedralbes.cat' target='_blank' class='quiz-lobby__button'>Go to League</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'> <tr> <td bgcolor='#ffffff' align='center'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'> <tr> <td style='padding: 20px 0px 20px 0px;'> <table width='500' border='0' cellspacing='0' cellpadding='0' align='center' class='responsive-table'> <tr> <td align='center' valign='middle' style='font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;'> <span class='appleFooter' style='color:#666666;'>Av. Esplugues, 36-42. 08034. Barcelona</span><br><a class='original-only' style='color: #666666; text-decoration: none;'>League of Trivial | 2022</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>";
            mail($to, $subject, $msg, $headers);
        }
    }
    public function index()
    {
        $challenges = Challenge::all();
        $challenges = json_encode($challenges);

        return response()->json($challenges);
    }
    public function getGametoChallenge(Request $request)
    {
        $game = DB::table('games')->where('id', $request->idGame)->value('quiz');

        return response()->json($game);
    }
}
