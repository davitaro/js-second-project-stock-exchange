class SearchResults {
  constructor(element) {
    this.element = element; //html container to put it into
    this.base_companyUrl = "./company.html?";
  }
  async myFetch(url) {
    try {
      const response = await fetch(url); //step 1
      const data = response.json(); //step 2
      return data; //step 3
    } catch (error) {
      console.log(error);
    }
  }

  async useLinkToGetProfileData(arrayOfLinks) {
    //console.log(arrayOfLinks); //array of 10 company urls to fetch the profile from
    const arrayOfPromises = [];
    for (let link of arrayOfLinks) {
      arrayOfPromises.push(this.myFetch(link)); //initiating promises, but not yet settled - up to step 1
    }
    console.log(arrayOfPromises); //[Promise1,Promise2,....]
    const results = await Promise.all(arrayOfPromises); //[response1, response2,...] //we're up to steps 2-3 - fetch function has finished
    const profiles = results.map((result) => result.profile);
    // map function to get profile
    return profiles;
  }

  async printResults(profileInfo, symbolsInfo) {
    searchInput.classList.remove("w3-text-red");
    clearScreen();
    this.createResultsHeader();
    this.i;
    for (this.i = 0; this.i < profileInfo.length; this.i++) {
      this.companyName = profileInfo[this.i].companyName;
      this.image = profileInfo[this.i].image;

      this.changesPercentage = profileInfo[this.i].changesPercentage;
      this.newCompanyUrl = `${this.base_companyUrl}symbol=${
        symbolsInfo[this.i]
      }`;
      this.companyLineResult = document.createElement("div");
      this.companyLineResult.innerHTML = `
        <div class = "animate-bottom w3-container w3-text-2020-navy-blazer company-result" id = "companyResult" onclick = "location.href='${
          this.newCompanyUrl
        }';"> 
          <img id = "imageContainer" src = ${this.image}
          } width = 50 height = 50 alt = "logo" class = "small-logo" onerror = "this.src = '../images/searchicon.png';"></img> ${
            this.companyName
          } (${symbolsInfo[this.i]})
          <span class = "changeContainer"> </span>
        </div>`;
      resultsContainer.appendChild(this.companyLineResult);
      this.plusminus;
      this.span = document.querySelectorAll(".changeContainer");
      this.decChange = parseFloat(this.changesPercentage).toFixed(2);
      this.innerSpan;
      if (this.decChange > 0) {
        this.span[this.i].classList.add("w3-text-green");
        this.plusminus = `+`;
        this.innerSpan = `  (${this.plusminus}${this.decChange}%)`;
      } else {
        this.plusminus = ``;
        this.span[this.i].classList.add("w3-text-red");
        this.innerSpan = `  (${this.plusminus}${this.decChange}%)`;
      }
      this.span[this.i].innerHTML = this.innerSpan;

      //highlight search query in results using mark.js
      this.obj = new Mark(this.companyLineResult);
      this.obj.mark(searchInput.value);
    }
  }

  createResultsHeader() {
    resultsContainer.classList = "resultsContainer w3-card w3-white";
    let resultsHeader = document.createElement("header");
    resultsHeader.innerHTML = `<header class="w3-container w3-2020-navy-blazer"><h1>Results
      </h1></header>`;
    resultsContainer.appendChild(resultsHeader);
  }

  async handleResults(array1, array2) {
    clearScreen();
    this.clearResults();
    this.showLoader();
    let companiesProfileArray = await this.useLinkToGetProfileData(array2);

    if (companiesProfileArray.length === 0) {
      this.printNoResultError();
    } else {
      this.printResults(companiesProfileArray, array1);
    }
  }

  showLoader() {
    backgroundTextContainer.classList.remove("displaynone");
    welcomeContainer.classList.add("displaynone");
    suitContainer.classList.add("displaynone");
    subtitleContainer.classList.remove("displaynone");
    subtitleContainer.innerText = "Hang tight! Your results are on the way.";
    loader.classList.remove("displaynone");
  }

  clearResults() {
    this.profile = []; //updated for object
  }

  printNoResultError() {
    resultsContainer.innerHTML = "";
    errorContainer.innerHTML = "";
    backgroundTextContainer.classList.add("displaynone");
    loader.classList.add("displaynone");
    searchInput.classList.add("w3-text-red");
    let errorLineResult = document.createElement("div");
    errorLineResult.innerHTML = `
  <div class = "shaker w3-panel w3-pale-red w3-border w3-text-red error-container w3-center" id = "errorContainer" >
  Sorry, no results are available with that search query. Please try again.
  </div>`;
    errorContainer.classList += "error-container";
    errorContainer.appendChild(errorLineResult);
  }
}
