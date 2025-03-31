// ==UserScript==
// @name        Animeunity Utils
// @namespace   Violentmonkey Scripts
// @match       https://www.animeunity.so/*
// @match       https://vixcloud.co/embed/*
// @grant       none
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js
// @version     1.0
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
          backgroundColor: "#7DDA58",
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
  GM_setValue("last_anime", { ...extractAnimeNameAndEpisode(), url: currentUrl })
}

setTimeout(() => {

  const buttonRow = document.querySelector(".jw-button-container")

  if (buttonRow) {
    const video = document.querySelector("video")
    const newButton = document.createElement("button")
    newButton.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_3_2)">
          <path d="M26 18C26 19.9778 25.4135 21.9112 24.3147 23.5557C23.2159 25.2002 21.6541 26.4819 19.8268 27.2388C17.9996 27.9957 15.9889 28.1937 14.0491 27.8079C12.1093 27.422 10.3275 26.4696 8.92894 25.0711C7.53041 23.6725 6.578 21.8907 6.19215 19.9509C5.8063 18.0111 6.00433 16.0004 6.76121 14.1732C7.51809 12.3459 8.79981 10.7841 10.4443 9.6853C12.0888 8.58649 14.0222 8 16 8H20V13L26 7L20 1V6H16C13.6266 6 11.3066 6.70379 9.33316 8.02236C7.35977 9.34094 5.8217 11.2151 4.91345 13.4078C4.0052 15.6005 3.76756 18.0133 4.23058 20.3411C4.6936 22.6689 5.83649 24.8071 7.51472 26.4853C9.19295 28.1635 11.3312 29.3064 13.6589 29.7694C15.9867 30.2324 18.3995 29.9948 20.5922 29.0866C22.7849 28.1783 24.6591 26.6402 25.9776 24.6668C27.2962 22.6935 28 20.3734 28 18H26Z" fill="white"/>
          <path d="M22.3917 21.947C21.9498 21.959 21.5112 21.8665 21.1117 21.677C20.7548 21.4996 20.4486 21.2347 20.2217 20.907C19.9837 20.5257 19.824 20.1007 19.7517 19.657C19.6286 19.1058 19.5715 18.5418 19.5817 17.977C19.5727 17.4123 19.6297 16.8485 19.7517 16.297C19.8411 15.8502 20.0178 15.4254 20.2717 15.047C20.4986 14.7193 20.8048 14.4544 21.1617 14.277C21.5612 14.0876 21.9998 13.9951 22.4417 14.007C22.8572 13.9754 23.2738 14.0507 23.6519 14.2258C24.03 14.4008 24.357 14.6698 24.6017 15.007C25.113 15.8956 25.3561 16.9133 25.3017 17.937C25.3561 18.9608 25.113 19.9784 24.6017 20.867C24.362 21.2266 24.0311 21.5161 23.6428 21.7059C23.2545 21.8957 22.8227 21.9789 22.3917 21.947ZM22.3917 20.727C22.5946 20.7483 22.7991 20.707 22.9779 20.6087C23.1566 20.5104 23.301 20.3598 23.3917 20.177C23.6116 19.7051 23.7145 19.1872 23.6917 18.667V17.287C23.7157 16.77 23.6127 16.255 23.3917 15.787C23.2811 15.6157 23.1294 15.4749 22.9503 15.3773C22.7713 15.2798 22.5706 15.2287 22.3667 15.2287C22.1628 15.2287 21.9622 15.2798 21.7831 15.3773C21.6041 15.4749 21.4523 15.6157 21.3417 15.787C21.1246 16.256 21.0251 16.7709 21.0517 17.287V18.667C21.0262 19.1863 21.1257 19.7041 21.3417 20.177C21.4352 20.3687 21.5875 20.5254 21.7764 20.6244C21.9653 20.7233 22.1809 20.7593 22.3917 20.727Z" fill="white"/>
          <path d="M16.62 17.237C16.9751 17.2723 17.3309 17.1762 17.62 16.967C17.7206 16.8853 17.801 16.7814 17.8548 16.6634C17.9086 16.5454 17.9343 16.4166 17.93 16.287V16.207C17.9374 16.0692 17.9143 15.9315 17.8625 15.8036C17.8106 15.6757 17.7313 15.5608 17.63 15.467C17.397 15.276 17.1007 15.1797 16.8 15.197C16.4866 15.1909 16.1778 15.2741 15.91 15.437C15.6338 15.608 15.401 15.8408 15.23 16.117L14.3 15.287C14.4359 15.108 14.5828 14.9377 14.74 14.777C14.9026 14.6217 15.084 14.4874 15.28 14.377C15.4987 14.253 15.7346 14.162 15.98 14.107C16.2642 14.0346 16.5568 14.001 16.85 14.007C17.2081 14.0053 17.5647 14.0524 17.91 14.147C18.207 14.225 18.4857 14.361 18.73 14.547C18.954 14.7149 19.1383 14.93 19.27 15.177C19.3929 15.4362 19.4545 15.7202 19.45 16.007C19.4518 16.235 19.4146 16.4616 19.34 16.677C19.2634 16.8671 19.1552 17.043 19.02 17.197C18.8844 17.3423 18.7256 17.4639 18.55 17.557C18.3698 17.6488 18.1781 17.7161 17.98 17.757V17.817C18.1989 17.8567 18.4111 17.9274 18.61 18.027C18.8024 18.1205 18.9754 18.2494 19.12 18.407C19.2641 18.5695 19.3791 18.7555 19.46 18.957C19.5435 19.1912 19.5842 19.4385 19.58 19.687C19.5875 20.0052 19.5189 20.3206 19.38 20.607C19.2456 20.889 19.0469 21.1356 18.8 21.327C18.5344 21.5318 18.2324 21.6845 17.91 21.777C17.5373 21.8896 17.1493 21.9436 16.76 21.937C16.4234 21.9416 16.0876 21.9046 15.76 21.827C15.494 21.7578 15.2385 21.6536 15 21.517C14.7945 21.3921 14.6063 21.2408 14.44 21.067C14.2783 20.8963 14.1311 20.7123 14 20.517L15.07 19.707C15.1516 19.8545 15.2453 19.995 15.35 20.127C15.455 20.2553 15.576 20.3695 15.71 20.467C15.8473 20.564 15.9992 20.6383 16.16 20.687C16.3456 20.7377 16.5376 20.7612 16.73 20.757C17.089 20.7847 17.4455 20.6777 17.73 20.457C17.8433 20.3473 17.9322 20.2148 17.9908 20.0684C18.0494 19.9219 18.0764 19.7647 18.07 19.607V19.527C18.0735 19.3743 18.042 19.2227 17.9779 19.0841C17.9138 18.9454 17.8187 18.8232 17.7 18.727C17.3849 18.5245 17.014 18.4265 16.64 18.447H15.88V17.237H16.62Z" fill="white"/>
          <path d="M12.9375 20.7891C12.6797 20.7891 12.4583 20.6979 12.2734 20.5156C12.0911 20.3333 12 20.112 12 19.8516C12 19.5964 12.0911 19.3776 12.2734 19.1953C12.4583 19.013 12.6797 18.9219 12.9375 18.9219C13.1875 18.9219 13.4062 19.013 13.5938 19.1953C13.7812 19.3776 13.875 19.5964 13.875 19.8516C13.875 20.0234 13.8307 20.181 13.7422 20.3242C13.6562 20.4648 13.543 20.5781 13.4023 20.6641C13.2617 20.7474 13.1068 20.7891 12.9375 20.7891ZM12.9375 16.8633C12.6797 16.8633 12.4583 16.7721 12.2734 16.5898C12.0911 16.4076 12 16.1862 12 15.9258C12 15.6706 12.0911 15.4531 12.2734 15.2734C12.4583 15.0911 12.6797 15 12.9375 15C13.1875 15 13.4062 15.0911 13.5938 15.2734C13.7812 15.4531 13.875 15.6706 13.875 15.9258C13.875 16.1003 13.8307 16.2591 13.7422 16.4023C13.6562 16.543 13.543 16.6549 13.4023 16.7383C13.2617 16.8216 13.1068 16.8633 12.9375 16.8633Z" fill="white"/>
          <path d="M10.5703 14V22H8.87891V15.6055H8.83203L7 16.7539V15.2539L8.98047 14H10.5703Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_3_2">
          <rect width="32" height="32" fill="white"/>
          </clipPath>
          </defs>
        </svg>
      `

    appendStyles(newButton, {
      backgroundColor: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer"
    })

    newButton.addEventListener("click", () => {
      video.pause()
      video.currentTime += 90
      video.play()
    })

    buttonRow.insertBefore(newButton, buttonRow.children[3])
  }


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

}, 1000)
