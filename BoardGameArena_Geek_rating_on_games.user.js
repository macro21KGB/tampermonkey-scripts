// ==UserScript==
// @name         BoardGameArena Geek rating on games
// @namespace    http://tampermonkey.net/
// @version      2024-01-30
// @description  try to take over the world!
// @author       macro21KGB
// @run-at       context-menu
// @match        https://boardgamearena.com/gamepanel?game=yokohama
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamearena.com
// @grant        GM.xmlHttpRequest
// @match        http*://*.boardgamearena.com/gamepanel?game=*
// ==/UserScript==

async function fetchRatingFromBGG(gameId, callback) {

    GM.xmlHttpRequest({
        method: "GET",
        url: `https://boardgamegeek.com/xmlapi2/thing?id=${gameId}&stats=1&comments=0&marketplace=0&videos=0`,
    }).then((response) => response.responseText)
        .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/xml");
        const gameItem = doc.documentElement.children[0];
        const gameRatings = +gameItem.querySelector("ratings").querySelector("average").getAttribute("value");
        callback(gameRatings)
    })



}

function createNewElement() {
    const newElement = document.createElement("p")

    newElement.id = "score"
    newElement.style.backgroundColor = "#ffffff"
    newElement.style.color = "black"
    newElement.style.borderRadius = "8px"
    newElement.style.padding = "0.5rem"

    return newElement;
}

function updateScoreText(rating) {
    const tagContainer = document.querySelector("#main-content > div > div.overflow-hidden.relative.z-0 > div.panel-header.svelte-jhpb9e > div.panel-block.panel-block--tags.svelte-jhpb9e > div.text-base.desktop\\:text-xl.text-white.svelte-jhpb9e > div")

    const newElement = createNewElement()
    newElement.innerText = "Score: " +rating.toFixed(1)
    tagContainer.appendChild(newElement)
    tagContainer.style.flexWrap = "wrap"
}

function updateScore() {

    let items = document.getElementsByClassName("panel-links__link")
    let gameId = Array.from(items).filter((item) => {
        return item.href.includes("boardgamegeek") && item.href.includes("%2Fboardgame%2F")
    }).map(item => item.href)

    console.log(gameId)
    if (gameId.length == 1) {
        const parsedGameId = gameId[0].split("&id=")[0].split("%2F")[4]
        fetchRatingFromBGG(parsedGameId, updateScoreText)
    }
}

(function() {
    'use strict';

    const location = window.location.pathname

    if (location !== "/gamepanel") return
    const oldElement = document.getElementById("score")
    if (oldElement == null) {
        updateScore()
    }

})();