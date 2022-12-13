let searchFormContainer = grab("searchFormContainer");

class SearchForm {
  constructor(element) {
    // this.element = element; //html container to put it into = searchFormContainer - empty div
    this.base_url =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/";
    this.newUrl;
    this.symbolsArray;
    //creates div container to hold input and button info
    let inputInformation = document.createElement("div");
    inputInformation.className = "flexRow flexRowHeader";
    //creates search input, assigns properties, and appends to outer container
    this.searchInput = document.createElement("input");
    this.searchInput.placeholder = "search";
    this.searchInput.name = "search";
    this.searchInput.type = "text";
    this.searchInput.id = "searchInput";
    this.searchInput.className =
      "w3-input w3-border w3-round side-margins media-search";
    inputInformation.appendChild(this.searchInput);

    this.hidden_search = document.createElement("input");
    this.hidden_search.type = "hidden";
    inputInformation.appendChild(this.hidden_search);

    //create container for button
    let inputButton = document.createElement("div");

    let searchButton = document.createElement("button");
    searchButton.type = "submit";
    searchButton.id = "searchButton";
    searchButton.className = "w3-button w3-white w3-border w3-round-large";
    searchButton.innerHTML = "Search";

    searchButton.onclick = (event) => {
      event.preventDefault();
      this.doSearch();
    };

    this.searchInput.addEventListener("keyup", function (event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        searchButton.click();
      }
    });

    inputButton.appendChild(searchButton);
    inputInformation.appendChild(inputButton);
    element.appendChild(inputInformation);
  }

  userInputToFetchUrl(input) {
    this.url = new URL(this.base_url);
    this.params = new URLSearchParams(this.url.search);
    this.params.set("query", input);
    this.newUrl = `${this.base_url}api/v3/search?${this.params}&limit=10&exchange=NASDAQ`;
    return this.newUrl;
  }

  async getResultsFromServer(tenResultsUrl) {
    try {
      this.response = await fetch(tenResultsUrl);
      const contentType = this.response.headers.get("content-type");
      if (contentType.indexOf("application/json") !== -1) {
        let data = await this.response.json();
        return data;
      } else {
        let data = await this.response.text();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
    return data; //data is an array of objects with names and symbols
  }

  async getAllTheCompanyUrls(tenResults) {
    let newUrlArray = [];
    this.symbolsArray = [];
    tenResults.forEach((element) => {
      let { symbol } = element;
      let companyDataUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;

      newUrlArray.push(companyDataUrl);
      this.symbolsArray = this.handleSymbol(symbol);
    });

    return newUrlArray;
  }
  handleSymbol(theSymbol) {
    this.symbolsArray.push(theSymbol);
    return this.symbolsArray;
  }

  onSearch(callback) {
    this.onSearchCallback = callback;
  }

  async doSearch() {
    if (!this.searchInput.value) {
      handleError();
    } else {
      this.clearSearchForm = () => {
        this.symbolsArray = [];
        newUrlArray = [];
      };
      this.newUrl = this.userInputToFetchUrl(this.searchInput.value);
      let companyData = await this.getResultsFromServer(this.newUrl);
      let companyDataUrlArray = await this.getAllTheCompanyUrls(companyData);
      let arrayOfSymbols = this.symbolsArray;
      this.onSearchCallback(arrayOfSymbols, companyDataUrlArray);
    }
  }
}
