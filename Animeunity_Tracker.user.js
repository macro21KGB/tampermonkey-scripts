// ==UserScript==
// @name        Track anime watched on animeunity
// @namespace   Violentmonkey Scripts
// @match       https://www.animeunity.to/*
// @grant       none
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     1.0
// @author      Mario De Luca
// @grant GM_getValue
// @grant GM_addElement
// @grant  GM_setValue
// @description 22/10/2024, 11:09:07
// ==/UserScript==

function appendStyles(element, newStyles) {
  Object.assign(element.style, newStyles);
}

function addToObject(obj, key, value) {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = value;
  }
}

function getLastPartOfUrl(url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

setTimeout(() => {
  const currentUrl = window.location.href;
  let savedAnimes = GM_getValue("animes", {})

  if (currentUrl == "https://www.animeunity.to/") {

    const animes = Array.from(document.querySelectorAll(".item"))
    console.log(savedAnimes)

    animes.forEach(el => {
      const id = getLastPartOfUrl(el.children[0].href)

      if (savedAnimes[id]) {
        appendStyles(el, {
          position: "relative"
        })
        const newText = document.createElement("div")

        appendStyles(newText, {
          position: "absolute",
          border: "3px solid green",
          top: "5px",
          left: "5px",
          zIndex: 10,
          backgroundColor : "#7DDA58",
          borderRadius: "50%",
          width: "20px",
          height: "20px"
        })

        el.appendChild(newText)
      }
    })
  }
  if (currentUrl.includes("/anime/")) {
    const id = getLastPartOfUrl(currentUrl)
    addToObject(savedAnimes, id, true)
    GM_setValue("animes", savedAnimes)
    console.log(savedAnimes)
  }

}, 500)
