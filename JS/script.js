/**
 * @author Heather Kusmierz
 */

// Global variable declarations
var winCount = 20;
var strictFlag = false;
var compSeq = [];
var userSeq = [];
var len;
var errorCount = 0;
var maxError = 3;

var greenSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var redSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var yellowSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var blueSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
var errorSound = new Audio("https://dl.dropboxusercontent.com/s/2l7p3bh8ju5ypvk/Computer%20Error-SoundBible.com-1655839472.mp3")
var gameLoseSound = new Audio("https://dl.dropboxusercontent.com/s/bb0dq80g0ajyf3a/party_horn-Mike_Koenig-76599891.mp3");
var gameWinSound = new Audio("https://dl.dropboxusercontent.com/s/l7dj72k4du2xbx4/Ta%20Da-SoundBible.com-1884170640.mp3");


// Function declarations

function genMove() {
  // Generates one of four moves for the computer to play
  var move;
  var num = Math.floor(Math.random()*4);
  switch(num) {
    case 0:
      move = 'G';
      break;
    case 1:
      move = 'R';
      break;
    case 2:
      move = 'Y';
      break;
    case 3:
      move = 'B';
      break;
  }
  console.log("New move is: " + move);
  return move;
}

function playButton(button) {
  // Inputs a string representing the color of the button
  // plays the sound and lights the color
  switch(button) {
    case 'G':
      greenSound.play();
      $(".green").addClass("green-light").delay(1000).queue(function(){
        $(".green").removeClass("green-light").dequeue();
      });
      break;
    case 'R':
      redSound.play();
      $(".red").addClass("red-light").delay(1000).queue(function(){
        $(".red").removeClass("red-light").dequeue();
      });
      break;
    case 'Y':
      yellowSound.play();
      $(".yellow").addClass("yellow-light").delay(1000).queue(function(){
        $(".yellow").removeClass("yellow-light").dequeue();
      });
      break;
    case 'B':
      blueSound.play();
      $(".blue").addClass("blue-light").delay(1000).queue(function(){
        $(".blue").removeClass("blue-light").dequeue();
      });
      break;
  }
}

function playSeq(comp) {
  // Plays the given sequence by lighting buttons and playing sound

  // Disables buttons while computer is playing sequence
  $(".color").each(function(index, element) {
    $(element).addClass("disabled");
  });

  // Loop function to set a delay between playing each move
  var i = 0;
  function myLoop () {
   setTimeout(function () {
      playButton(comp[i]);
      i++;
      if (i < comp.length) {
         myLoop();
      }
    }, 1000)
  }

  myLoop();

  // Re-enables buttons
  $(".color").each(function(index, element) {
    $(element).removeClass("disabled");
  });
}

function checkSeq(comp, user) {
  // Inputs two arrays, one with computer sequence, other with user
  // sequence, and checks if they match through the user's moves
  if (user.length > comp.length) {
    //console.log("Too many user clicks");
    return false;
  }

  for (var i = 0; i < user.length; i++) {
    if (user[i] != comp[i]) {
      //console.log("Wrong move");
      return false;
    }
  }
  //console.log("User clicks match!");
  return true;
}

function compPlay() {
  // Initiates the computer's turn
  var currMove = genMove();
  compSeq.push(currMove);
  len = compSeq.length;
  if (len < 10) {
    len = "0" + len;
  }
  $("#display").html(len);
  playSeq(compSeq);
}

function userPlay(comp, user) {
  // Function to run each time user clicks a color
  if(!checkSeq(comp, user)) {
    // User makes an error
    errorCount++;
    if(strictFlag || errorCount == maxError) {
      gameLoseSound.play();
      resetGame();
    } else {
      // User made error but gets another chance
      //console.log("User error, try again");
      errorSound.play();
      userSeq = [];
      playSeq(comp);
    }
  } else if (checkSeq(comp, user) && (comp.length == user.length)) {
    // User got full sequence correct
    if (user.length == winCount) {
      //console.log("You win!");
      gameWinSound.play();
      resetGame();
      compPlay();
    } else {
      userSeq = [];
      compPlay();
    }
  }
}

function resetGame(){
  strictFlag = false;
  compSeq = [];
  userSeq = [];
  errorCount = 0;
  $("#display").html("--");
  $("#start").removeClass("disabled");
}


// jQuery closure

$(function(){
  // Start button
  $("#start").on("click", function() {
    if(!$(this).hasClass("disabled")) {
      compPlay();
      $(this).addClass("disabled");
    }
  });

  // Strict button
  $("#strict").on("click", function() {
    strictFlag = true;
  });

  // Reset button
  $("#reset").on("click", function() {
    resetGame();
    compPlay();
  });

  // Color buttons
  $(".green").on("click", function(){
    if(!$(this).hasClass("disabled")) {
      playButton('G');
      userSeq.push('G');
      userPlay(compSeq, userSeq);
    }
  });

  $(".red").on("click", function(){
    if(!$(this).hasClass("disabled")) {
      playButton('R');
      userSeq.push('R');
      userPlay(compSeq, userSeq);
    }
  });

  $(".yellow").on("click", function(){
    if(!$(this).hasClass("disabled")) {
      playButton('Y');
      userSeq.push('Y');
      userPlay(compSeq, userSeq);
    }
  });

  $(".blue").on("click", function(){
    if(!$(this).hasClass("disabled")) {
      playButton('B');
      userSeq.push('B');
      userPlay(compSeq, userSeq);
    }
  });

}); // End jQuery function
