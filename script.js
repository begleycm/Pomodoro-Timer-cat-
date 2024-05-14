// This is basically the main function. There may be a
// better way to do this. You can just write code straight
// in the File, but it doesnt guarantee all the page has loaded.
window.onload = function () {
  console.log("page loaded!");
  settings(); // this just auto closes the window, theres probably a better way to do this.
  about();
  reset(); // reset to default each opening
};

var wm = document.getElementById('w_minutes'); // int
var ws = document.getElementById('w_seconds'); // int

// Default times:
var studyT = 25
var shortT = 5
var longT = 10

var title = document.getElementById('title') // string?
var play = document.getElementById("start") // string
var timerInterval; // store a ref to a timer variable

var isBreak = false; // bool for if a break is active
var isPaused = true; // true at start, true if timer isn't moving

var alarmSound = new Audio("sounds/Ding.mp3")
var soundOn = true; // bool for if sound should be on

/**
 * Handles timer related things like ticking it down as needed, switching
 * to a break, and playing audio when the timer finishes.
 */
function timer() { // Increments timer by 1 second until 0
  if(ws.innerText != 0) {
    console.log(ws);
    console.log(typeof(ws));
    if (parseInt(ws.innerText) < 10) {
      String(ws.innerText).padStart(2, '0');
    }
    ws.innerText--; // decrement by one
    changeTimerTitle() // change title, after decrement so they match
  } else if (wm.innerText != 0 && ws.innerText == 0) {
    ws.innerText = 59;
    wm.innerText--;
  }

  // If reaches 0 and there's no break, go to 5
  if(wm.innerText == 0 && ws.innerText == 0 && !isBreak) {
    wm.innerText = shortT;
    ws.innerText = "00";

    document.getElementById('counter').innerText++; // +1 to counter
    isBreak = true;
    playAlarm() // plays a ding


  } else if (wm.innerText == 0 && ws.innerText == 0 && isBreak) {
    // If break finishes, go back to 25, don't increment counter
    wm.innerText = studyT;
    ws.innerText = "00";

    isBreak = false;
    playAlarm() // plays a ding
  }
}

/**
 * Starts the timer from whatever time it is at.
 */
function start() { 
  if (isPaused) {
    if(timerInterval == undefined){
      timerInterval = setInterval(timer, 1000);
    } else {
      alert("Timer is already running");
    } 
    isPaused = false;
    play.innerText = "Pause";
    
  } else {
    pause()
  }
}

/**
 * Pauses the timer.
 */
function pause() { 
  stopInterval()
  play.innerText = "Start"
  isPaused = true;
}

/**
 * Resets the timer, and the title. Currently does NOT reset the counter.
 */
function reset() { 
  wm.innerText = studyT;
  ws.innerText = "00";
  
  pause();
  isBreak = false;
  title.innerText = "pomodoro timer!"
}

function short_break() { // Change to 5:00
  wm.innerText = shortT;
  ws.innerText = "00";
  title.innerText = shortT.toString

  pause();
  isBreak = true;
}

function long_break() { // Change to 10:00
  wm.innerText = longT;
  ws.innerText = "00";
  title.innerText = longT.toString

  pause();
  isBreak = true;
}

function stopInterval() { // Stops the calculator
  clearInterval(timerInterval)
  timerInterval = undefined;
}

function playAlarm() { // plays alarm
  if (soundOn) {
    alarmSound.volume = slider.value / 100 // set sound to toggle bar in settings
    alarmSound.play()
  }
}

/**
 * Changes the title of the tab as the timer counts down.
 */
function changeTimerTitle() {
  title.innerText = wm.textContent + ":" + ws.textContent
}

///////////////////////////// Menu stuff /////////////////////////////

// making draggable window
const titleBars = document.querySelectorAll(".titlebar");
var selection = null

function onMouseDrag({ movementX, movementY }) {
  if (selection){
    // setting myParent to the greater window ancestor
    let myParent = selection.closest(".fauxwindow")
    // getting a computed value of the style (position) of the window
    let getTitleBarStyle = window.getComputedStyle(myParent);
    // getting the distance from the left and top of the screen
    let leftValue = parseInt(getTitleBarStyle.left);
    let topValue = parseInt(getTitleBarStyle.top);
    // adjusting the window style values to be the new x and y values
    myParent.style.left = `${leftValue + movementX}px`;
    myParent.style.top = `${topValue + movementY}px`;
  }
}

document.addEventListener("mousemove", onMouseDrag)

titleBars.forEach(titleBar => {
  titleBar.addEventListener("mousedown", (event) => {
      selection = event.target;
  });
});

document.addEventListener("mouseup", () => {
    selection = null;
});

// volume slider code from w3schools, this might be sus.

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
} 

/**
 * Opens and closes the settings menu.
 */
function settings() {
  let menu = document.getElementById("settings_menu")
  
  
  if (menu.style.visibility === "hidden") {
    menu.style.visibility = "visible";
  }
  else {
    menu.style.visibility = "hidden"
  }
}

/**
 * Opens and closes the about menu.
 */
function about() {
  let aboutVis = document.getElementById("about_menu")
  
  if (aboutVis.style.visibility === "hidden") {
    aboutVis.style.visibility = "visible";
  }
  else {
    aboutVis.style.visibility = "hidden"
  }
}

/**
 * Saves all settings once the "Save" button is clicked.
 */
function saveSettings() {
  var studyTime = document.getElementById("studyTime").value
  var shortTime = document.getElementById("shortTime").value
  var longTime = document.getElementById("longTime").value
  let soundCheck = document.getElementById("soundCheckBox")

  if (studyTime != "") {
    studyT = studyTime
  } else {
    studyT = 25
  }
  if (shortTime != "") {
    shortT = shortTime
  } else {
    shortT = 5
  }
  if (longTime != "") {
    longT = longTime
  } else {
    longT = 10
  }
  soundOn = soundCheck.checked // True if checked, false if not

  reset() // should simply reset timer, change later possibly
  alert("Settings saved!")
}
