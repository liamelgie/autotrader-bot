const Discord = require('discord.js')
const AutoTraderScraper = require('autotrader-scraper');
const autotrader = new AutoTraderScraper()

class AutoTraderBot {
  constructor(authToken) {
    this.AUTH_TOKEN = authToken
    this.client = new Discord.Client()
    this.client.login(this.AUTH_TOKEN)
    this.client.on('ready', () => {
      console.log(this.client.user.username + ' - (' + this.client.user.id + ')')
      this.client.user.setActivity('autotrader.co.uk', { type: 'WATCHING', url: 'https://www.autotrader.co.uk' })
    })
    this.client.on('message', message => {
      if (message.author.bot) return
      if (message.content.substring(0, 1) == '!') {
        let args = message.content.substring(1).split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(entry => entry.trim() != '');
        const cmd = args[0];
        args = args.splice(1);
        (async () => {
          switch(cmd) {
            case 'at':
            case 'AT':
            case 'autotrader':
            case 'AutoTrader':
              switch (args[0]) {
                case 'search':
                case 's':
                  this._loadedSearchResults = await this._search(this._parseOptions(message.channel, args.splice(1)))
                  this._loadedSearchResults.sendNext()
                  break;
                case 'next':
                  if (this._loadedSearchResults) this._loadedSearchResults.sendNext(args[1])
                  break;
                case 'help':
                case '--help':
                case '-h':
                default:
                  this._sendHelp(message.channel)
                // Help
              }
            break;
         }
       })()
      }
    })
  }

  _sendHelp(channel) {
    const embed = new Discord.RichEmbed()
      .setTitle('AutoTrader')
      .setColor('#2F1844')
      .setDescription('Searches AutoTrader.co.uk for cars, bikes and vans with your chosen criteria then shows you the results')
      .addBlankField()
      .addField('help | --help | -h', 'Displays this message')
      .addField('search {cars | bikes | vans} [--search-options]', 'Searches AutoTrader for the specified type of vehicle and displays the results')
      .addBlankField()
      .addField('Search Options', 'You can provide a wide range of criteria to narrow your search down. The options to do this are as follows:')
      .addField('--postcode', 'The postcode to search from to find local results (defaults to BH317LE)', true)
      .addField('--radius', 'The radius from the postcode (in miles) to show results from (defaults to 1500)', true)
      .addField('--min-price', 'The minimum price of the vehicle (e.g. --min-price 1000)', true)
      .addField('--max-price', 'The maximum price of the vehicle (e.g. --max-price 4000)', true)
      .addField('--make', 'The make of the vehicle (i.e. Ford, Nissan) (e.g. --make Ford)', true)
      .addField('--model', 'The model of the vehicle (i.e. Focus, Corsa) (e.g. --model Focus)', true)
      .addField('--variant', 'The variant of the vehicle (i.e. ST, GTI) (e.g. --variant ST)', true)
      .addField('--condition', 'The condition of the vehicle (New or Used) (e.g. --condition New)', true)
      .addField('--min-year', 'The minimum year of the vehicle\'s manufacture (e.g. --min-year 2010)', true)
      .addField('--max-year', 'The maximum year of the vehicle\'s manufacture (e.g. --max-year 2017)', true)
      .addField('--min-mileage', 'The minimum mileage of the vehicle (e.g. --min-mileage 50000)', true)
      .addField('--max-mileage', 'The maximum mileage of the vehicle (e.g. --max-mileage 120000)', true)
      .addField('--min-cc', 'The minimum CC of the vehicle, specifically for bikes', true)
      .addField('--max-cc', 'The maximum CC of the vehicle, specifically for bikes', true)
      .addField('--body', 'The body of the vehicle (i.e. SUV, Coupe) (e.g. --body SUV )', true)
      .addField('--gearbox', 'The gearbox in the vehicle (Manual or Automatic) (e.g. --gearbox Automatic)', true)
      .addField('--colour', 'The colour of the vehicle (e.g. --colour blue)', true)
      .addField('--page', 'The page number of results to retrieve (e.g. --page 2) (Defaults to 1)', true)
      .setFooter('Developed to demonstrate AutoTraderScraper by Liam Elgie (2019)')
    channel.send(embed)
  }

  _parseOptions(channel, args) {
    const vehicleType = args[0]
    const postcode = args.includes('--postcode') ? !isNaN(args[args.indexOf('--postcode') + 1]) ? args[args.indexOf('--postcode') + 1] : undefined : undefined
    const radius = args.includes('--radius') ? !isNaN(args[args.indexOf('--radius') + 1]) ? args[args.indexOf('--radius') + 1] : undefined : undefined
    const minPrice = args.includes('--min-price') ? !isNaN(args[args.indexOf('--min-price') + 1]) ? args[args.indexOf('--min-price') + 1] : undefined : undefined
    const maxPrice = args.includes('--max-price') ? !isNaN(args[args.indexOf('--max-price') + 1]) ? args[args.indexOf('--max-price') + 1] : undefined : undefined
    const make = args.includes('--make') ? args[args.indexOf('--make') + 1] : undefined
    const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : undefined
    const variant = args.includes('--variant') ? args[args.indexOf('--variant') + 1].replace(/["\']+/g, '') : undefined
    const condition = args.includes('--condition') ? args[args.indexOf('--condition') + 1] : undefined
    const minYear = args.includes('--min-year') ? !isNaN(args[args.indexOf('--min-year') + 1]) ? args[args.indexOf('--min-year') + 1] : undefined : undefined
    const maxYear = args.includes('--max-year') ? !isNaN(args[args.indexOf('--max-year') + 1]) ? args[args.indexOf('--max-year') + 1] : undefined : undefined
    const minMileage = args.includes('--min-mileage') ? !isNaN(args[args.indexOf('--min-mileage') + 1]) ? args[args.indexOf('--min-mileage') + 1] : undefined : undefined
    const maxMileage = args.includes('--max-mileage') ? !isNaN(args[args.indexOf('--max-mileage') + 1]) ? args[args.indexOf('--max-mileage') + 1] : undefined : undefined
    const wheelbase = args.includes('--wheelbase') ? args[args.indexOf('--wheelbase') + 1] : undefined
    const cab = args.includes('--cab') ? args[args.indexOf('--cab') + 1] : undefined
    const minCC = args.includes('--min-cc') ? !isNaN(args[args.indexOf('--min-cc') + 1]) ? args[args.indexOf('--min-cc') + 1] : undefined : undefined
    const maxCC = args.includes('--max-cc') ? !isNaN(args[args.indexOf('--max-cc') + 1]) ? args[args.indexOf('--max-cc') + 1] : undefined : undefined
    const body = args.includes('--body') ? args[args.indexOf('--body') + 1] : undefined
    const fuelType = args.includes('--fuel-type') ? args[args.indexOf('--fuel-type') + 1] : undefined
    const fuelConsumption = args.includes('--fuel-consumption') ? args[args.indexOf('--fuel-consumption') + 1] : undefined
    const minEngineSize = args.includes('--min-engine-size') ? args[args.indexOf('--min-engine-size') + 1] : undefined
    const maxEngineSize = args.includes('--max-engine-size') ? args[args.indexOf('--max-engine-size') + 1] : undefined
    const acceleration = args.includes('--acceleration') ? args[args.indexOf('--acceleration') + 1] : undefined
    const gearbox = args.includes('--gearbox') ? args[args.indexOf('--gearbox') + 1] : undefined
    const drivetrain = args.includes('--drivetrain') ? args[args.indexOf('--drivetrain') + 1] : undefined
    const emissions = args.includes('--emissions') ? args[args.indexOf('--emissions') + 1] : undefined
    const doors = args.includes('--doors') ? args[args.indexOf('--doors') + 1] : undefined
    const minSeats = args.includes('--min-seats') ? !isNaN(args[args.indexOf('--min-seats') + 1]) ? args[args.indexOf('--min-seats') + 1] : undefined : undefined
    const maxSeats = args.includes('--max-seats') ? !isNaN(args[args.indexOf('--max-seats') + 1]) ? args[args.indexOf('--max-seats') + 1] : undefined : undefined
    const insurance = args.includes('--insurance') ? args[args.indexOf('--insurance') + 1] : undefined
    const tax = args.includes('--tax') ? args[args.indexOf('--tax') + 1] : undefined
    const colour = args.includes('--colour') ? args[args.indexOf('--colour') + 1] : undefined
    const page = args.includes('--page') ? args[args.indexOf('--page') + 1] : undefined
    return {
      channel,
      vehicleType,
      location: {
        radius: radius || 1500,
        postcode: postcode || "BH317LE"
      },
      price: {
        min: minPrice,
        max: maxPrice
      },
      make,
      model,
      variant,
      condition,
      year: {
        min: minYear,
        max: maxYear
      },
      mileage: {
        min: minMileage,
        max: maxMileage
      },
      wheelbase,
      cab,
      cc: {
        min: minCC,
        max: maxCC
      },
      body,
      fuel: {
        type: fuelType,
        consumption: fuelConsumption
      },
      engine: {
        min: minEngineSize,
        max: maxEngineSize
      },
      acceleration,
      gearbox,
      drivetrain,
      emissions,
      doors,
      seats: {
        min: minSeats,
        max: maxSeats
      },
      insurance,
      tax,
      colour,
      page
    }
  }

  async _search(options) {
    const results = await autotrader.search(options.vehicleType).for({ criteria: options, results: 50 })
    .then(listings => listings.literals)
    const messages = new SearchResultMessages(options.channel, results)
    return messages
  }

  async _sendMessage(channel, content) {
    return await channel.send(content)
    .then(message => message)
  }

  async _getAd(channel, url) {
    const result = await autotrader.get.advert.from(url)
      .then(advert => advert.literal)
    const message = new AdvertMessage(channel, result)
  }

  async _updateMessage(message, content) {
    return await message.edit(content)
  }

  async _deleteMessage(message, timeout) {
    return await message.delete(timeout)
  }
}

class SearchResultMessages {
  constructor(channel, results) {
    this.channel = channel
    this.inc = 0
    this.messages = []
    for (let result of results) {
      this.messages.push(new SearchResultMessage(channel, result, this.sendNext.bind(this)))
    }
  }

  sendNext(incrementBy = 1) {
    incrementBy = incrementBy > 4 ? 4 : incrementBy
    for (let i = 0; i < incrementBy; i++) {
      if (this.inc === this.messages.length) return false
      this.messages[this.inc].send({ index: this.inc + 1, resultCount: this.messages.length })
      this.inc += 1
    }
  }

  sendAll() {
    for (let message of this.messages) {
      message.send()
    }
  }
}

class SearchResultMessage {
  constructor(channel, result, nextReactionCallback) {
    this.channel = channel
    this.result = result
    this.next = nextReactionCallback
  }

  async send(indexInfo) {
    this.message = await this.channel.send(this._generateEmbed(indexInfo))
    const filter = (reaction, user) => {
      return ['👎', '👉'].includes(reaction.emoji.name)
    }

    const collector = this.message.createReactionCollector(filter, { time: 300000 })

    collector.on('collect', (reaction, reactionCollector) => {
      if (reaction.emoji.name === '👉') this.next()
      if (reaction.emoji.name === '👎') this.message.delete()
    })
  }

  _generateEmbed(indexInfo) {
    return new Discord.RichEmbed()
      .setTitle(this.result.title)
      .setColor('#2F1844')
      .setDescription(this.result.description)
      .addField('Price', this.result.price, true)
      .addField('Location', this.result.location, true)
      .addField('Key Specs', this.result.keySpecs.join(' | '), true)
      .setThumbnail(this.result.image)
      .setURL(this.result.url)
      .setFooter(indexInfo.index === indexInfo.resultCount ? `Result ${indexInfo.index} of ${indexInfo.resultCount}. React with a 👎 to hide this result or perform a new search to find more` : `Result ${indexInfo.index} of ${indexInfo.resultCount}. React with a 👉 to see the next result or a 👎 to hide this one`)
  }

  async edit(embed) {
    this.message = await this.message.edit(embed)
  }
}

module.exports = AutoTraderBot
