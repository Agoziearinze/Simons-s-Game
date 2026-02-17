
var buttonColors = ["green", "red", "yellow", "blue"];

// `gamePattern` stores the sequence the game generates across levels.

var gamePattern = [];

// `userClickedPattern` records the player's clicks for the current level only.

var userClickedPattern = [];

// `started` indicates whether a game session is active. We use it to
// prevent multiple simultaneous starts and to know when to reattach the
// starter handler on a restart.
var started = false;

// `level` tracks which round/level the player is on.
var level = 0;


// I'M COMING BACK TO FINISH THIS LATER

// Start the game on the first keypress. `.one` means this handler runs once
// and then removes itself — a clean way to wait for the player's first action.
$(document).one("keypress", function() {
  nextSequence();
  started = true;
});


function nextSequence() {
  // Clear user's input for the new level so previous clicks don't persist.
  userClickedPattern = [];

  // increment level and update header so user sees progress
  level++;
  $("h1").text("Level " + level);

  // choose and record a random color for this level
  var randomChosenColor = buttonColors[Math.floor(Math.random() * 4)];
  gamePattern.push(randomChosenColor);

  // animate and play sound for the new color
  $("#" + randomChosenColor)
    .animate({opacity: 0.5}, 100)
    .animate({opacity: 1}, 100);

  var audioSequence = new Audio("sounds/" + randomChosenColor + ".mp3");
  audioSequence.play();
}
    
// JOINING THE CLICK ANIMATION WITH ID SYNTAX 1 / 2 AND AUDIO SYNTAX

$(".btn").on("click", function() {
  // capture which button the user clicked and append it to their pattern
  var clickId = $(this).attr("id");
  userClickedPattern.push(clickId);

  // provide immediate feedback for the click
  $("#" + clickId)
    .animate({opacity: 0.5}, 100)
    .animate({opacity: 1}, 100);

  var audio = new Audio("sounds/" + clickId + ".mp3");
  audio.play();

  // We pass the index of the most recent entry (length - 1). This allows
  // `checkAnswer` to validate the latest click only instead of re-checking
  // the whole array on each click — that's how we avoid needing a loop.
  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentIndex) {
  // compare only the newest click to the corresponding position in gamePattern
  if (userClickedPattern[currentIndex] === gamePattern[currentIndex]) {
    // if the user has finished inputting the entire sequence for this level
    if (userClickedPattern.length === gamePattern.length) {
      // wait briefly, then generate the next level's sequence
      setTimeout(nextSequence, 1000);
    }
    // otherwise: correct so far, wait for next user click
  } else {
    // immediate failure path: show game-over, play sound, reset state
    $("h1").text("Game Over, Press Any Key to Restart");
    var wrong = new Audio("sounds/wrong.mp3");
    wrong.play();
    $("body").addClass("game-over");
    setTimeout(function() { $("body").removeClass("game-over"); }, 200);
    startOver();
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  $(document).one("keydown", function() {
    nextSequence();
    started = true;
  });
}