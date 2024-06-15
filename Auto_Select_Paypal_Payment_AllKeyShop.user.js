// ==UserScript==
// @name        New script allkeyshop.com
// @namespace   Violentmonkey Scripts
// @match       https://www.allkeyshop.com/blog/buy-*
// @grant       none
// @version     1.0
// @author      Mario De luca
// @description 15/6/2024, 12:05:59
// ==/UserScript==

const paypalFormSelector = document.querySelector("#offer_filters_form > div > div:nth-child(1) > div.col-lg.col-md-11.filters-filter.filters-filter-last > div > label:nth-child(5)")
paypalFormSelector.click()
