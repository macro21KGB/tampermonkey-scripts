// ==UserScript==
// @name        New look gameway.it
// @namespace   Violentmonkey Scripts
// @match       https://www.gameway.it/*
// @grant       GM_addStyle
// @version     1.0
// @author      Mario De Luca
// @description 30/6/2024, 19:22:29
// ==/UserScript==


GM_addStyle(`

body > div:nth-child(6) {
  margin-top: 10px;
}

body {
  --link-color: hsl(213, 92%, 40%);
  --hovered-link-color: hsl(213, 92%, 20%);
  font-family: sans-serif;
  padding: 0.5rem;
}

body > div:nth-child(6) > a:nth-child(1) {
  border: 1px solid var(--link-color);
  border-radius: 0.4rem;
  padding: 0.5rem;
  top: 20%;
}


a {
  color: var(--link-color);
  text-decoration: none;
}

a:hover {
  color: var(--hovered-link-color);
}

body > div:nth-child(8) {
  display: none;
}

form {
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 0.5rem;
    flex-direction: column;
}

form > input[type="text"] {
  padding: 0.5rem;
}

form > input[type="submit"] {
  background-color: hsl(213, 92%, 30%);
  border: none;
  color: white;
  padding: 0.3rem 0.2rem;
}

form > input[type="submit"]:hover {
  font-weight: bold;
}

.evidenziato {
  padding: 0.1rem;
  border-radius: 0.2rem;
}

`)