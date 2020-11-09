let fs = require('fs')
let dp = require('despair')
let hy = require('honesty')

let url = 'https://www.osustuff.org/img/avatars/base-images/'

async function main () {
  let { body } = await dp(url)
  let $ = hy(body)
  let links = $('tr > td > a').slice(1).map(x => x.attribs.href)
  let res = await getImages(links)
  fs.writeFileSync('data.json', JSON.stringify({ date: Date.now(), url: 'https://www.osustuff.org/img/avatars/base-images/', items: res }, null, 4))
}

async function getImages (arr, res = [], i = 0) {
  if (i >= arr.length) return
  reWrite(`${arr[i]} - ${i + 1}/${arr.length} [${(((i + 1) / arr.length) * 100).toFixed(2)}%]`)
  let { body } = await dp(url + arr[i])
  let $ = hy(body)
  res.push($('tr > td > a').slice(1).map(x => arr[i] + x.attribs.href).filter(x => x.indexOf('_thumb.') === -1))
  await getImages(arr, res, ++i)
  return [].concat.apply([], res)
}

main()

function reWrite (msg) {
  process.stdout.cursorTo(0)
  process.stdout.clearLine()
  process.stdout.write(msg)
}
