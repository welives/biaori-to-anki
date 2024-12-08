const fs = require('fs')
const path = require('path')

function output() {
  const levels = ['初级', '中级', '高级']

  for (const lv of levels) {
    const file = fs.readFileSync(path.join(__dirname, `./words/新标准日本语${lv}(假名到释义).txt`), 'utf8')
    const result = file.split('\n').map(line => {
      if (line.startsWith('#')) {
        return line
      }
      if (line) {
        const parts = line.split('\t')
        if (parts[3].indexOf('；')) {
          parts[4] = parts[3].split('；').map(it => `{{c1::${it}}}`).join('；')
        } else {
          parts[4] = `{{c1::${parts[3]}}}`
        }
        return parts.join('\t')
      }
    }).filter(Boolean).join('\n')

    fs.writeFileSync(path.join(__dirname, `./words/新标准日本语${lv}(假名到释义)_fillOut.txt`), result)
  }
}

output()
