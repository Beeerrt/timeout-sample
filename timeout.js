// Variable to store the current timer interval
let currentTimerInterval;
let currentTimer;

// Function to convert minutes to milliseconds
function minutesToMilliseconds(minutes) {
  return minutes * 60 * 1000;
}

// Function to handle the DOMContentLoaded event
const onDOMContentLoaded = (event) => {
  // Get timer value from URL query parameter
  const urlSearchParams = new URLSearchParams(window.location.search);
  const queryParamTimer = urlSearchParams.get("timer");

  // If query param is set, use it; otherwise, initialize with default value
  if (queryParamTimer) {
    initializeTimerWithValue(queryParamTimer);
  } else {
    initializeTimerWithoutValue();
  }
};

// Function to initialize timer with a specified value
function initializeTimerWithValue(queryParamTimer) {
  // Disable button to create QR Code
  document.getElementById("qr-code-button").remove();

  // Calculate timer value in milliseconds
  const currentTimestamp = Date.now();
  const targetTimestamp = new Date(Number(queryParamTimer));
  const timerValueMilliseconds = targetTimestamp - currentTimestamp;

  // Start the timer
  startTimer(timerValueMilliseconds);
}

// Function to initialize timer with a default value
function initializeTimerWithoutValue() {
  // Set default timer value to 2 minutes
  const defaultTimerValueMilliseconds = minutesToMilliseconds(2);

  // Start the timer
  startTimer(defaultTimerValueMilliseconds);
}

// Function to start the timer
function startTimer(timerValue) {
  // Calculate the target end time
  const targetEndTime = Date.now() + timerValue;
  console.log("StartInterval");

  // First Format --> Otherwise we skip the First second
  const timeRemaining = targetEndTime - Date.now();
  currentTimer = timeRemaining;
  console.log("Format Milliseconds");
  formatMilliseconds(timeRemaining);

  // Set up interval to update the timer display
  currentTimerInterval = setInterval(() => {
    const timeRemaining = targetEndTime - Date.now();
    currentTimer = timeRemaining;
    console.log("Format Milliseconds");
    formatMilliseconds(timeRemaining);

    // Check if the timer has reached zero
    if (timeRemaining <= 0) {
      document.getElementById("timer-text").innerHTML = "Let's get back to work!";
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      clearInterval(currentTimerInterval);
    }
  }, 1000);
}

// Function to format milliseconds into minutes and seconds
function formatMilliseconds(milliseconds) {
  // Calculate minutes and seconds
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Create HTML representation
  const html = `<p id='timer-text'>${minutes} : ${seconds}</p>`;

  // Display in the "output" div
  document.getElementById("output").innerHTML = html;
}

// Function to handle button click event
function onQRCodeButtonClick() {
  // Calculate the new end time based on the current timer value
  const newEndTime = Date.now() + currentTimer;

  // Check if the QR Code has already been generated
  if (document.getElementById("qrcode").childElementCount > 0) {
    return;
  }

  // Generate QR Code with a link containing the new end time
  new QRCode(document.getElementById("qrcode"), "https://timeout-sample.netlify.app/index.html?timer=" + newEndTime);

  // Remove the QR Code button
  document.getElementById("qr-code-button").remove();
}

// Add event listener for DOMContentLoaded
addEventListener("DOMContentLoaded", onDOMContentLoaded);
