// ==UserScript==
// @name         Aggregate price boardgamegeek
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  aggregate all prices from boardgamegeek
// @author       Mario De Luca
// @match        https://boardgamegeek.com/boardgame/342942/ark-nova
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @match        http*://boardgamegeek.com/boardgame/*/*
// @run-at       document-idle
// ==/UserScript==

function convertToEuro(amount, currency) {
    const exchangeRates = {
        '$': 1.21, // Exchange rate for USD to EUR
        '£': 1.14, // Exchange rate for GBP to EUR
        '€': 1.00,
        "C$": 0.65
        // Add more exchange rates as needed
    };

    if (currency in exchangeRates) {
        return amount * exchangeRates[currency];
    } else {
        return +amount
    }
}

function parseToString(amount) {
    return amount.toFixed(2);
}

function convertAndParseToEuro(inputString) {
    if (inputString === "") return 0
    let currencySymbol = ""

    let finished = false
    let i = 0
    while (!finished) {
        if (!isNaN(inputString[i])) {
            finished = true;
        }
        else {
            currencySymbol += inputString[i]
        }
        i++;
    }

    const amount = parseFloat(inputString.substr(currencySymbol.length));
    const euroAmount = convertToEuro(amount, currencySymbol);
    return euroAmount
}

(function() {
    'use strict';

    setTimeout(() => {
        const storePrices = document.querySelector("stores-items-module")

        const storePriceItems = Array.from(storePrices.querySelectorAll(".summary-sale-item")).map(item => {
            return {
                name: item.querySelector(".summary-item-title").innerText,
                price: convertAndParseToEuro(item.querySelector(".summary-sale-item-price > strong").innerText)
            }
        })


        const sortedItem = storePriceItems.sort((a,b) => {
            return a.price - b.price
        })

        console.log(sortedItem)
        const textSpan = document.querySelector("#mainbody > div.global-body-content-container.container-fluid > div > div.content.ng-isolate-scope > div:nth-child(2) > ng-include > div > ng-include > div > div.game-header > div.game-header-body > div.game-header-title-container > div > div.game-header-title-info > h1 > span")
        textSpan.innerText += `[€${sortedItem[1].price.toFixed(2)}-€${sortedItem[sortedItem.length - 1].price.toFixed(2)}]`

    }, 1500)
})();