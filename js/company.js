//get symbol string from company URL
let urlParams = new URLSearchParams(window.location.search);
let symbolString = urlParams.get("symbol");
let companyURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbolString}`;
console.log(`The link to company info is ${companyURL}`);

//get history link
let historyURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbolString}?serietype=line`;
console.log(`The link to company history is ${historyURL}`);

//grab DOM element containers
let logoSrc = grab("logo");
let companyNameContainer = grab("companyName");
let websiteContainer = grab("website");
let priceContainer = grab("price");
let descriptionContainer = grab("description");
let dateArray = [];
let dataArray = [];
let chartLoader = grab("chartLoader");
getCompanyInfo(companyURL);
getCompanyHistory(historyURL);

function grab(id) {
  const domElement = document.getElementById(id);
  if (domElement) {
    return domElement;
  } else {
    throw new Error(`No element found with id ${id}`);
  }
}
async function getCompanyInfo(url) {
  try {
    loader.classList.remove("displaynone");
    let response = await fetch(url);
    const contentType = response.headers.get("content-type");
    if (contentType.indexOf("application/json") !== -1) {
      data = await response.json();
      let profile = data.profile;
      if (profile) {
        let { image, companyName, description, website } = profile;
        //remove loader
        loader.classList.add("displaynone");
        printStockPrices(priceContainer, profile);
        printLink(websiteContainer, website);
        printImage(logoSrc, image);
        printCompanyData(companyNameContainer, companyName);
        printCompanyData(descriptionContainer, description);
      } else {
        loader.classList.add("displaynone");
        printStockPrices(priceContainer, "unavailable");
        printLink(websiteContainer, "unavailable");
        // printImage(logoSrc, "unavailable");
        printCompanyData(companyNameContainer, "unavailable");
        printCompanyData(descriptionContainer, "unavailable");
      }
    } else {
      data = await response.text();
      console.log(text);
      return text;
    }
  } catch (error) {
    console.log(error);
  }
}
async function getCompanyHistory(url) {
  try {
    chartLoader.classList.remove("displaynone");
    let response = await fetch(url);
    const contentType = response.headers.get("content-type");
    if (contentType.indexOf("application/json") !== -1) {
      data = await response.json();
      let history = data.historical;
      console.log(history);
      for (let element of history) {
        createLables(element);
        createChartData(element);
      }
      createChart(dateArray, dataArray);
      chartLoader.classList.add("displaynone");
    } else {
      data = await response.text();
      console.log(text);
      return text;
    }
  } catch (error) {
    console.log(error);
  }
}
function printStockPrices(container, { price, changesPercentage }) {
  let symbol;
  let newPrice = parseFloat(changesPercentage).toFixed(2);
  container.innerHTML = `
  <div class = "flexRow"> ${price} USD <span id = "stockChange" class = "padding-left"></span></div>`;
  let stockChange = grab("stockChange");
  if (newPrice > 0) {
    stockChange.classList.add("w3-text-light-green");
    symbol = `+`;
  } else {
    symbol = ``;
    stockChange.classList.add("w3-text-red");
  }
  stockChange.innerText = `  (${symbol}${newPrice}%)`;
}
function printLink(container, link) {
  if (link) {
    container.innerHTML = "";
    container.innerText = `${link}`;
    container.href = link;
  } else {
    container.innerText = "No website available.";
    container.classList.add("w3-text-red");
  }
}
function printImage(container, imageSource) {
  container.src = imageSource;
  container.onerror = () => {
    container.src = "../images/searchicon.png";
  };
}
function printCompanyData(container, info) {
  //clear containers
  container.innerHTML = "";
  //update content
  if (info) {
    container.innerText = info;
  } else {
    container.innerText =
      "Unfortunately, this information is not available at the moment.";
  }
}
function createLables({ date }) {
  // console.log (date);
  dateArray.push(date);

  return dateArray;
}
function createChartData({ close }) {
  dataArray.push(close);
  return dataArray;
}
function createChart(chartLabels, chartData) {
  let ctx = grab("myChart"); //this is for the chart
  historyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartLabels.reverse(), //array
      datasets: [
        {
          label: "Stock Prices (USD)",
          data: chartData.reverse(),
          fill: true,
          backgroundColor: "lightGrey",
          pointBorderWidth: 0.5,
          pointRadius: 1,
          pointBackgroundColor: "teal",
          tension: 0.1,
        },
      ],
    },
    options: {},
  });
}
