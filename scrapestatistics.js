var names = {
  "Individual Square Probabilities for Preferred Long Term Jail Stay (as Percentages)": ['next','long'],
  "Individual Square Probabilities for Preferred Short Term Jail Stay (as Percentages)": ['next','short'],
  "Expected Number of Opponent Rolls to Lose or Recoup Mortgages (Long Jail Stay)": ['mortages','long'],
  "Expected Number of Opponent Rolls to Lose or Recoup Mortgages (Short Jail Stay)": ['mortages','short'],
  "Expected Number of Opponent Rolls to Recoup Incremental Cost (Long Jail Stay)": ['incremental','long'],
  "Expected Number of Opponent Rolls to Recoup Incremental Cost (Short Jail Stay)": ['incremental','short'],
  "Expected Income Per Opponent Roll on all Properties Assuming Preferred Long Jail Stay":['income','long'],
  "Expected Income Per Opponent Roll on all Properties Assuming Preferred Short Jail Stay":['income','short'],
  "Long Term Probabilities for Ending Up on Each of the Squares in Monopoly®":['prob','other'],
  "Average Income per Roll from other Squares":['income','other']
}

function camelCase(string) {
  return string.toLowerCase().replace(/[^a-z ]/g, '').split(/ +/).map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join('')
}

function parseTable(table) {
  return [...table.querySelectorAll('tr')]
    .map(n => [...n.querySelectorAll('td,th')].map(n => n.innerText.trim()))
    .reduce((map, row, i, rows) => {
      if (i) {
        map[camelCase(row[0])] = row.reduce((obj, cell, i) => {
          if (i) {
            obj[camelCase(rows[0][i])] = cell
          }
          return obj
        }, {})
      }
      return map
    }, {})
}

function scrape(properties){
  var seen = [];
  var statistics = $('h3,h4').get().reverse().map(n => {
    var mine = $(n).find('~ table').get().filter(m => !seen.includes(m))
    seen.push(...mine)
    return {
      name: names[n.innerText.trim()],
      tables: mine.map(parseTable)
    }
  }, {}).reduce((obj, stat) => {
    stat.tables.forEach(table => Object.entries(table).forEach(([prop, stats]) => {
      obj[prop] = obj[prop] || {}
      obj[prop][stat.name[0]] = obj[prop][stat.name[0]] || {}
      obj[prop][stat.name[0]][stat.name[1]] = stats
    }))
    return obj
  }, {})
  
  /* Clean up */
  delete statistics.Total
  delete statistics[""]
  for([prop,stats] of Object.entries(statistics)){
    if(stats.prob){
      stats.prob.long = stats.prob.other.ProbabilityJailLong
      stats.prob.short = stats.prob.other.ProbabilityJailShort
      delete stats.prob.other
    }
    if(stats.next){
      delete stats.next.long[""]
      delete stats.next.short[""]
    }
    if(stats.income && stats.income.other){
      stats.income.long = stats.income.other.IncomePerRollJailLong
      stats.income.short = stats.income.other.IncomePerRollJailShort
      delete stats.income.other
    }
  }

  properties.forEach(p => {
    var id = p.Name != "Jail" ? camelCase(p.Name) : "InJail"
    statistics[id].props = {
      type:p.Space,
      color:p.Color,
      name:p.Name,
      number:p.Number,
      position:p.Position,
      price:p.Price,
      priceBuild:p.PriceBuild,
      rent:{
        SingleProperty:p.Rent,
        OwnWholeBlock:p.Rent*2,
        OneHouse:p.RentBuild1,
        TwoHouses:p.RentBuild2,
        ThreeHouses:p.RentBuild3,
        FourHouses:p.RentBuild4,
        Hotel:p.RentBuild5,
      }
    }
  })
  return statistics
}

function grab(url){
  if(!document.querySelector(`[src="${url}"]`)){
    return new Promise(res => {
      var script = document.createElement('script')
      script.src = url
      script.onload = res
      document.body.appendChild(script)
    })
  }
}
Promise.all([
  fetch('https://raw.githubusercontent.com/dbreunig/monopoly/master/board.csv').then(res => res.text()),
  grab('https://code.jquery.com/jquery-3.3.1.slim.min.js'),
  grab('https://cdnjs.cloudflare.com/ajax/libs/d3-dsv/1.0.8/d3-dsv.min.js')])
  .then(([csv]) => d3.csvParse(csv))
  .then(scrape)
  .then(console.log)