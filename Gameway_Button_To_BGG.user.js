// ==UserScript==
// @name        Go to gameway site for price
// @namespace   Violentmonkey Scripts
// @match       https://boardgamegeek.com/boardgame/*/*
// @grant       none
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     1.0
// @author      Mario De Luca
// @description 11/8/2024, 21:51:14
// ==/UserScript==

// Get the current URL
const currentURL = window.location.href;

// Split the URL into an array of parts
const urlParts = currentURL.split('/');

// Get the last part of the URL
const gameName = urlParts[urlParts.length - 1].replaceAll("-", "+");

console.log(gameName);

const buttonsContainer = document.querySelector("#mainbody > div.global-body-content-container.container-fluid > div > div.content.ng-isolate-scope > div:nth-child(2) > ng-include > div > ng-include > div > div.game-header > div.game-header-body > div.game-header-secondary-actions.hidden-game-header-collapsed")

const newButton = document.createElement("a")

newButton.classList = "btn btn-xs btn-white"
newButton.href = "https://www.gameway.it/?q=" + gameName
newButton.target = "_blank"
newButton.innerText = "Go to gameway"


buttonsContainer.appendChild(newButton)