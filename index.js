let got = require('got')
let cheerio = require('cheerio')
let fs = require('fs')

let url = 'https://www.osustuff.org/img/avatars/base-images/'
got(url).then(async r => {
  let $ = cheerio.load(r.body)
  let tbody = $('tbody')[0]
  let links = []
  for (let i = 5; i < tbody.children.length; i++) {
    if (tbody.children[i] && tbody.children[i].children && tbody.children[i].children[1]) {
      links.push(tbody.children[i].children[1].children[0].attribs.href)
    }
  }
  let promises = []
  for (let i = 0; i < links.length; i++) {
    let base = 'https://www.osustuff.org/img/avatars/base-images/'
    promises.push(got(base + links[i]))
  }
  await Promise.all(promises).then(p => {
    let arr = p.map(x => {
      let $ = cheerio.load(x.body)
      let tbody = $('tbody')[0]
      let links = []
      let pre = $('h1').text().match(/\/.*/)[0]
      for (let i = 5; i < tbody.children.length; i++) {
        if (tbody.children[i] && tbody.children[i].children && tbody.children[i].children[1]) {
          if (tbody.children[i].children[1].children[0].attribs.href.indexOf('thumb') >= 0) continue
          links.push(pre + '/' + tbody.children[i].children[1].children[0].attribs.href)
        }
      }
      return links
    })
    arr = [].concat.apply([], arr)
    fs.writeFileSync('data.json', JSON.stringify({ date: Date.now(), url: 'https://www.osustuff.org', items: arr }, null, 4))
  })
})
