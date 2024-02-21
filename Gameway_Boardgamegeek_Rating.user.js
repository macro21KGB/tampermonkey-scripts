// ==UserScript==
// @name         Gameway Boardgamegeek Rating
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @match        http*://www.gameway.it/p/*
// @description  Add Boardgamegeek rating
// @run-at       document-idle
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameway.it
// @grant        GM_addStyle
// ==/UserScript==

function addRatingToTitle() {
    const titleText = document.querySelector("b")

    const bggLink = Array.from(document.querySelectorAll("a")).filter((item) => {
        return item.href.startsWith("https://board");
    })[0].href;

    const gameId = bggLink.split("/")[4]
    fetch(`https://api.geekdo.com/xmlapi2/thing?id=${gameId}&stats=1&comments=0&marketplace=0&videos=0`)
        .then((response) => response.text())
        .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/xml");
        const gameItem = doc.documentElement.children[0];
        const gameRatings = +gameItem.querySelector("ratings").querySelector("average").getAttribute("value");
        titleText.innerText = titleText.innerText + " (" + gameRatings.toFixed(1) + ")"
    })
}

(function() {
    'use strict';

    addRatingToTitle()
})();