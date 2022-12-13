//DOM grabs - global variables

function grab(id) {
  const domElement = document.getElementById(id);
  if (domElement) {
    return domElement;
  } else {
    throw new Error(`No element found with id ${id}`);
  }
}
let backgroundTextContainer = grab("backgroundText");
let welcomeContainer = grab("welcome");
let subtitleContainer = grab("subtitle");
let suitContainer = grab("suitContainer");
let loader = grab("loader");

let resultsContainer = grab("resultsContainer");
let errorContainer = grab("errorContainer");

let marqueeDiv = grab("marqueeDiv");

function clearScreen() {
  resultsContainer.innerHTML = "";
  errorContainer.innerHTML = "";
  backgroundTextContainer.classList.add("displaynone");
  loader.classList.add("displaynone");
}

function printNoInputError() {
  let errorLineResult = document.createElement("div");
  errorLineResult.innerHTML = `
    <div class = "shaker w3-panel w3-pale-red w3-border w3-text-red error-container w3-center medium-font" id = "errorContainer" >
    Please enter a search query to search the Stock Exchange.
    </div>`;
  errorContainer.classList += "error-container";
  errorContainer.appendChild(errorLineResult);
}

function handleError() {
  clearScreen();
  printNoInputError();
}
