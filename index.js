let got = require('got')
let cheerio = require('cheerio')
let fs = require('fs')

let url = 'https://www.osustuff.org/img/avatars/base-images/'

async function main () {
  let { body } = await got(url)
  let $ = cheerio.load(body)
  let links = Array.from($('tr > td > a')).slice(1).map(x => x.attribs.href)
  let res = await getImages(links)
  fs.writeFileSync('data.json', JSON.stringify({ date: Date.now(), url: 'https://www.osustuff.org/img/avatars/base-images/', items: res }, null, 4))
}

async function getImages (arr, res = [], i = 0) {
  if (i >= arr.length) return
  console.log(`${arr[i]} - ${i + 1}/${arr.length} [${(((i + 1) / arr.length) * 100).toFixed(2)}%]`)
  let { body } = await got(url + arr[i])
  let $ = cheerio.load(body)
  res.push(Array.from($('tr > td > a')).slice(1).map(x => arr[i] + x.attribs.href).filter(x => x.indexOf('_thumb.') === -1))
  await getImages(arr, res, ++i)
  return [].concat.apply([], res)
}

main()
