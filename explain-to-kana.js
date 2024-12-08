const assert = require('assert').strict
const path = require('path')
const fs = require('fs-extra')
const log = require('signale')

function output() {
  const levels = ['初级', '中级', '高级']

  for (const lv of levels) {
    const file = fs.readFileSync(path.join(__dirname, `./words/新标准日本语${lv}(释义到日文).txt`), 'utf8')

    const result = file.split('\n').map(line => {
      if (line.startsWith('#')) {
        return line
      }
      if (line) {
        const parts = line.split('\t')
        const result = transformFuriganaToKanaAndKanji(normalizeWord(parts[1]))
        parts[4] = result.split('，').map(it => `{{c1::${it}}}`).join('，')
        return parts.join('\t')
      }
    }).filter(Boolean).join('\n')

    fs.writeFileSync(path.join(__dirname, `./words/新标准日本语${lv}(释义到日文)_fillOut.txt`), result)
  }
}


/**
 * 将单词中出现的符号规范化处理
 *
 * Normalize symbols in the word.
 *
 * @param {string} word
 * @returns {string}
 */
function normalizeWord(word) {
  return word
    .replace(/（/g, '(') // 全角变半角
    .replace(/）/g, ')')
    .replace(/／/g, '/')
    .replace(/~/g, '～') // 半角变日文全角
    .replace(/　/g, '') // 移除全角空格
    .replace(/\s+\(\s+/g, '(') // 移除多余空格
    .replace(/\s+\)\s+/g, ')')
    .replace(/\s+\/\s+/g, '/')
    .replace(/\s+~\s+/g, '～')
    .trim()
}

/**
 * 将圆括号格式的注音假名单词转换为Anki格式
 *
 * Example: こし(少し) => 少[こ] し
 * See test cases below for all supported formats.
 * @param {string} normalizedSingleWord
 * @returns {string}
 */
function transformFuriganaToKanaAndKanji(normalizedSingleWord) {
  let kana = ''
  let kanji = ''

  // If there is no bracket, return as it is.
  // Sample: わたし
  if (normalizedSingleWord.indexOf('[') === -1) {
    return normalizedSingleWord
  }

  // Sample: 韓国[かんこく] 人[じん]
  if (normalizedSingleWord.indexOf(' ') !== -1) {
    const words = normalizedSingleWord.split(' ')
    words.forEach(w => {
      const m = w.match(/\[([^\]]+)\](.*)?/)
      kana += m ? `${m[1].trim()}${m[2] ? m[2].trim() : ''}` : w
      kanji += w.replace(/\[[^\]]+\]/g, '').trim()
    })
  } else {
    // 匹配括号中的内容 Sample: 中国人[ちゅうごくじん] => ちゅうごくじん
    const m = normalizedSingleWord.match(/\[([^\]]+)\](.*)?/)
    kana += m ? `${m[1].trim()}${m[2] ? m[2].trim() : ''}` : normalizedSingleWord
    // 把括号和其中的内容变成空字符串, Sample: 中国人[ちゅうごくじん] => 中国人
    kanji += normalizedSingleWord.replace(/\[[^\]]+\]/g, '').trim()
  }

  return [kana, kanji].join('，')
}

async function __testTransformFuriganaAsync() {
  for (const [input, expect] of [
    ['中国人[ちゅうごくじん]', 'ちゅうごくじん，中国人'],
    ['韓国[かんこく] 人[じん]', 'かんこくじん，韓国人'],
    ['アメリカ 人[じん]', 'アメリカじん，アメリカ人'],
    ['出迎[でむか] え', 'でむかえ，出迎え'],
    ['わたし', 'わたし'],
    ['練習[れんしゅう] します', 'れんしゅうします，練習します'],
    ['自動[じどう] ドア', 'じどうドア，自動ドア'],
    ['お 邪魔[じゃま] します', 'おじゃまします，お邪魔します'],
    ['上海[シャンハイ] パール', 'シャンハイパール，上海パール'],
    ['よろしくお 伝[つた] えください', 'よろしくおつたえください，よろしくお伝えください'],
    ['分[わ] かりません', 'わかりません，分かりません'],
    ['～さん / ～ちゃん / ～君', '～さん/～ちゃん/～君'],
    ['塗[ぬ]り 薬[ぐすり]', 'ぬりぐすり，塗り薬']
  ]) {
    const result = transformFuriganaToKanaAndKanji(normalizeWord(input))
    console.log(result)
    assert.equal(result, expect)
  }
}

async function main() {
  log.start('Run pre-check test cases')
  await __testTransformFuriganaAsync()
}
main().catch((e) => console.error(e))

output()
