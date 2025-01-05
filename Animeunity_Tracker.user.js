// ==UserScript==
// @name        Animeunity Utils
// @namespace   Violentmonkey Scripts
// @match       https://www.animeunity.so/*
// @grant       none
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js
// @version     2.0
// @author      Mario De Luca
// @grant  GM_getValue
// @grant  GM_addElement
// @grant  GM_setValue
// @grant  GM_xmlhttpRequest
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
    background: "radial-gradient(circle at 10% 20%, rgb(14, 174, 87) 0%, rgb(12, 116, 117) 90%)",
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

function malScoreComponent(name, parent) {
  const malScoreText = document.createElement("a")

  const result = GM_xmlhttpRequest({
    url: `https://myanimelist.net/search/prefix.json?type=all&keyword=${name}&v=1`,
    responseType: "json",
    onload: (obj) => {
      const fuseOption = {
        keys: [
          "name",
          "url"
        ]
      }

      const fuse = new Fuse(obj.response.categories[0].items, fuseOption);
      const rankedNames = fuse.search(name)
      console.log(rankedNames)
      
      const firstAnimeScore = rankedNames[0].item.payload.score
      const firstAnimeUrl = rankedNames[0].item.url
      malScoreText.innerText = " (" + firstAnimeScore + ")"
      malScoreText.href = firstAnimeUrl
      parent.appendChild(malScoreText)

    }
  })



}

let currentUrl = window.location.href;
let savedAnimes = GM_getValue("animes", {})
let lastWatchedAnime = GM_getValue("last_anime", {})

function renderWatchedSectionAndAnimeItem() {

  if (currentUrl == "https://www.animeunity.so/" || currentUrl.includes("?page=")) {

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
}

function saveAnimeAndLastEpisodeWatched() {
    currentUrl = window.location.href;
    const id = getLastPartOfUrl(currentUrl)

    addToObject(savedAnimes, id, true)
    GM_setValue("animes", savedAnimes)
    GM_setValue("last_anime", {...extractAnimeNameAndEpisode(), url: currentUrl })
}

setTimeout(() => {

  renderWatchedSectionAndAnimeItem();
  if (currentUrl.includes("/anime/")) {

    const malScoreParent = document.querySelector("#anime > div.content.container > div.sidebar > div.info-wrapper.pt-3.anime-info-wrapper > div:nth-child(8)")
    malScoreComponent(extractAnimeNameAndEpisode().title, malScoreParent)

    try {
      // Use the native navigate event if supported
      navigation.addEventListener('navigate', e => {
        saveAnimeAndLastEpisodeWatched();
      });
    } catch (e) {
      // Polyfill for browsers that do not support the navigate event
      setInterval(() => {
        saveAnimeAndLastEpisodeWatched()
      }, 20000)
    }

    saveAnimeAndLastEpisodeWatched()
  }

}, 500)
