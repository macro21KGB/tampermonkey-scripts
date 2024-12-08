// ==UserScript==
// @name        Track anime watched
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

function extractAnimeNameAndEpisode() {
  const episode = document.querySelector("#video-top > span").innerText
  const title = document.querySelector("#anime > div.header > div > div.general > h1").innerText

  return {
    title,
    episode
  }
}

function lastAnimeWatchedComponent(name, episode, url) {
  const newLastAnimeWatchedComponent = document.createElement("div")
  const parentContainer = document.querySelector("#ultimi-episodi > div.home-wrapper-header")

  appendStyles(newLastAnimeWatchedComponent, {
    width: "100%",
    backgroundColor: "green",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    marginTop: "0.2rem",
  })

  newLastAnimeWatchedComponent.innerHTML = `
    Hai visto l'ultima volta
    <p>${name}(${episode})</p>
    <a style="background:white;color:black;padding:0.2rem;border-radius:0.4rem" href="${url}">Clicca qui per ritornare</a>
  `
  parentContainer.appendChild(newLastAnimeWatchedComponent)
}

setTimeout(() => {
  const currentUrl = window.location.href;
  let savedAnimes = GM_getValue("animes", {})
  let lastWatchedAnime = GM_getValue("last_anime", {})

  if (currentUrl == "https://www.animeunity.to/" || currentUrl.includes("?page=")) {

    const animes = Array.from(document.querySelectorAll(".item"))

    // render last anime component
    const lastAnimeInfo = GM_getValue("last_anime", {})

    if (lastAnimeInfo.title)
      lastAnimeWatchedComponent(lastAnimeInfo.title, lastAnimeInfo.episode, lastAnimeInfo.url)

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
    GM_setValue("last_anime", {...extractAnimeNameAndEpisode(), url: currentUrl })
    console.log(savedAnimes)
  }

}, 500)
