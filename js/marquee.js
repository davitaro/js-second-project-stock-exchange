class Marquee {
  constructor(element) {
    this.element = element; //html container to put it into
    this.url =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse";
  }

  async getMarqueeInfo() {
    try {
      const response = await fetch(this.url);
      if (response.ok) {
        const data = await response.json();
        this.printMarquee(data);
      } else {
        throw new Error("Oops, something went wrong.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  createSpan(data) {
    let { symbol } = data;
    let companySpan = document.createElement("div");
    companySpan.innerHTML = `<span> ${symbol} <span class = "priceContainer"></span>`;
    marqueeDiv.appendChild(companySpan);
    companySpan.classList.add("marquee-span");
  }

  priceContainer(data) {
    let { price, changesPercentage } = data;
    let priceContainers = document.querySelectorAll(".priceContainer");
    let currentPriceContainer = priceContainers[priceContainers.length - 1];
try{
    if (changesPercentage > 0) {
      currentPriceContainer.innerHTML = `<i class="fas fa-arrow-up"></i> $${price.toFixed(
        2
      )}`;
      currentPriceContainer.classList.add("w3-text-light-green");
    } else {
      currentPriceContainer.innerHTML = `<i class="fas fa-arrow-down"></i> $${price.toFixed(
        2
      )}`;
      currentPriceContainer.classList.add("w3-text-red");
    }
  }
  catch(error){
    console.log(error);
  }
  }

  printMarquee(data) {
    this.element.innerHTML = ``;
    let i;
    for (i = 0; i < 100; i++) {
      this.createSpan(data[i]);
      this.priceContainer(data[i]);
    }
  }
}
