# AutoTrader Bot
A Discord chat bot for the online vehicle marketplace, [AutoTrader (UK)](https://www.autotrader.co.uk/).

This bot was originally developed to demonstrate the [AutoTrader Scraper](https://github.com/liamelgie/autotrader-scraper) package but is welcome to be edited and used by all under the GPL 3.0 license.
## Installation
Install [AutoTrader Bot](https://www.npmjs.com/package/autotrader-bot) via npm with the following:
````
npm i autotrader-bot --save
````
````Javascript
// yourscript.js
const AutoTraderBot = require('autotrader-bot')
````
Don't have node/npm installed? Get it [here](https://nodejs.org/en/)
## Usage & Examples
Start your bot by creating a new AutoTrader Bot instance:
````Javascript
const AutoTraderBot = require('autotrader-bot')
// You MUST have a bot authentication token from the Discord developer portal
const BOT_AUTH_TOKEN = '****************'
const bot = new AutoTraderBot(BOT_AUTH_TOKEN)
````
If you do not understand what this token is or how to get it, see [this page](https://discordapp.com/developers/docs/topics/oauth2#bots).
