const sampleRow = document.querySelector('.row').cloneNode(true)
sampleRow.classList.remove('hidden')
const sampleBox = document.querySelector('.row .box')
const samplePinyinBox = document.querySelector('.row .pinyin')

document.querySelector('#words').value =
  '2 chuǎng闯荡世界 gē+mài+割麦 打谷 积肥 锄草 勇往直前 笑眯眯 狐狸 笨蛋 酸菜 己 所 不 欲 勿 施 于 人'

const regexPunctuation = /[，,。！!？?；、：:（）()《》]/
const regexPunctuationWithQuotes = /[，,。！！？?；、：:（）()《》“”‘’"']/

const rowsPerSheet = 16
const maxColumns = 8
const emptyRow = sampleRow.cloneNode(false)
Array.from({ length: maxColumns }, () => {
  emptyRow.appendChild(sampleBox.cloneNode(true))
})

make()

function make() {
  document.querySelector('#printable').innerHTML = ''
  document.querySelector('#screen').innerHTML = ''

  document.querySelector('#words').value.trim().split(/\s+/).forEach(printWord)
  layoutScreen()
}

function doPrint() {
  window.print()
}

/**
 * 将 html 字符串转为 DOM 节点：https://stackoverflow.com/a/35385518/474231 。
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  var template = document.createElement('template')
  template.innerHTML = html.trim() // Never return a text node of whitespace as the result
  return template.content.firstChild
}

function printWord(text) {
  // 如果长度大于 10 ，判断为长句子，按长句子规则打印
  if (text.length > 10) {
    printLongSentence(text)
    return
  }

  const row = sampleRow.cloneNode(false)

  // 纯数字，则增加几个空白行。便于复用打印纸。
  if (/^\d+$/.test(text)) {
    printBlankRows(parseInt(text))
    return
  }

  let word = text
  const cjkPattern = /[\u4e00-\u9fff]/g
  if (!cjkPattern.test(text[0])) {
    const pinyin = text.replace(cjkPattern, '')
    word = text.replace(pinyin, '')
    printPinyinRow(pinyin)
  }

  const toAddMoreEmptyRows = /\+\d+$/.test(word)
  // 四行+2 => 四行
  word = toAddMoreEmptyRows ? /^(.+?)\+\d+$/.exec(word)[1] : word

  const settings = [
    { size: 1, sample: 3, split: 0, extraRows: 0 },
    { size: 2, sample: 2, split: 1, extraRows: 1 },
    { size: 3, sample: 1, split: 1, extraRows: 1 },
    { size: 4, sample: 1, split: 0, extraRows: 1 },
  ]
  const setting = settings[(word.length % 5) - 1]
  let extraRows = toAddMoreEmptyRows
    ? // 四行+2 => 2
      parseInt(/\+(\d+)$/.exec(text)[1]) + setting.extraRows
    : setting.extraRows

  const sampleBoxType = document.querySelector('#sample-box-type').value
  const extraRowBoxType = document.querySelector('#extra-row-box-type').value
  const chars = word.split('')
  printChars(chars, row, [sampleBoxType])

  Array.from({ length: setting.sample }, () => {
    Array.from({ length: setting.split }, () => {
      const split = sampleBox.cloneNode(true)
      split.classList.add(sampleBoxType)
      row.appendChild(split)
    })

    printChars(chars, row, ['sample', sampleBoxType])
  })
  const boxType = setting.size === 1 ? extraRowBoxType : sampleBoxType
  Array.from({ length: maxColumns - row.childNodes.length }, () => {
    const box = sampleBox.cloneNode(true)
    box.classList.add(boxType)
    row.appendChild(box)
  })
  addRow(row)

  Array.from({ length: extraRows }, () => {
    const extraRow = emptyRow.cloneNode(true)
    extraRow
      .querySelectorAll('.box')
      .forEach((box) => box.classList.add(extraRowBoxType))
    addRow(extraRow)
  })
}

// 长句子打印函数。先合并标点到前一个汉字的 token，再在打印时分离处理
function printLongSentence(text) {
  const maxCells = maxColumns
  const sampleBoxType = document.querySelector('#sample-box-type').value
  const extraRowBoxType = document.querySelector('#extra-row-box-type').value

  // 预处理：合并标点到前一个 token
  const rawTokens = Array.from(text)
  const tokens = []
  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i]
    const lastToken = tokens[tokens.length - 1]
    if (i > 0 && /[“‘”’"']/.test(token) && lastToken.length > 1) {
      // 引号合并到前一个标点，独占一格
      tokens[tokens.length - 1] = lastToken[0]
      tokens.push(lastToken[1] + token)
      continue
    } else if (i < rawTokens.length - 1 && /[“‘]/.test(token)) {
      // 左引号合并到后一个字符
      tokens.push(token + rawTokens[i + 1])
      i++
      continue
    }

    if (regexPunctuationWithQuotes.test(token)) {
      if (lastToken.length > 1) {
        // 前一个 token 带标点，拿回来组合符号独占一格
        tokens[tokens.length - 1] = lastToken[0]
        tokens.push(lastToken[1] + token)
      } else {
        // 前一个 token 不带标点，直接合并
        tokens[tokens.length - 1] += token
      }
    } else {
      tokens.push(token)
    }
  }

  // 分组：每组占满一行
  const groups = []
  for (let i = 0; i < tokens.length; i += maxCells) {
    let group = tokens.slice(i, i + maxCells)
    while (group.length < maxCells) {
      group.push(' ')
    }
    groups.push(group)
  }

  // 每组打印两行：第一行为描红格子，第二行为留空仿写
  groups.forEach((group) => {
    // 描红行
    const printRow = sampleRow.cloneNode(false)
    printRow.classList.add('sample')
    group.forEach((token) => {
      const box = sampleBox.cloneNode(true)
      const charEl = box.querySelector('.char')
      if (token.length === 1) {
        // 单独汉字，独占一格
        charEl.innerHTML = token
      } else if (
        regexPunctuationWithQuotes.test(token[0]) &&
        regexPunctuationWithQuotes.test(token[1])
      ) {
        // 组合符号，独占一格
        charEl.innerHTML = token
        charEl.classList.add('punc')
      } else {
        // 汉字带符号
        const isPuncAtLeft = regexPunctuationWithQuotes.test(token[0])
        const punc = isPuncAtLeft ? token[0] : token[1]
        const char = isPuncAtLeft ? token[1] : token[0]
        charEl.innerHTML = char
        const puncSpan = document.createElement('span')
        puncSpan.classList.add('punc')
        if (isPuncAtLeft) {
          puncSpan.classList.add('left')
        }
        puncSpan.innerHTML = punc
        charEl.appendChild(puncSpan)
      }
      box.classList.add(sampleBoxType)
      printRow.appendChild(box)
    })
    addRow(printRow)

    // 仿写行（格子内不显示任何文字）
    const imitationRow = sampleRow.cloneNode(false)
    group.forEach(() => {
      const box = sampleBox.cloneNode(true)
      const charEl = box.querySelector('.char')
      charEl.innerHTML = ''
      box.classList.add(extraRowBoxType)
      imitationRow.appendChild(box)
    })
    addRow(imitationRow)
  })
}

function printChars(chars, row, extraClassList) {
  chars.forEach((it) => {
    const box = sampleBox.cloneNode(true)
    const char = box.querySelector('.char')
    char.innerHTML = it
    ;(extraClassList || []).forEach((c) => box.classList.add(c))

    row.appendChild(box)
  })
}

function printBlankRows(rows) {
  const blankRow = sampleRow.cloneNode(true)
  blankRow.classList.add('opacity-0')
  Array.from({ length: rows }, () => addRow(blankRow.cloneNode(true)))
}

function printPinyinRow(pinyin) {
  const row = sampleRow.cloneNode(false)
  const box = samplePinyinBox.cloneNode(true)
  const arr = pinyin.split('+')
  arr.forEach((item) => {
    const box = samplePinyinBox.cloneNode(true)
    box.querySelector('span').innerText = item
    row.appendChild(box)
  })
  Array.from({ length: maxColumns - arr.length }, () =>
    row.appendChild(samplePinyinBox.cloneNode(true))
  )
  addRow(row)
}

function addRow(row) {
  document.querySelector('#printable').appendChild(row)
}

function layoutScreen() {
  const screen = document.querySelector('#screen')

  const sheetHeight = screen.offsetHeight * 0.9
  const boxSize = (sheetHeight + 0.0) / rowsPerSheet - 2
  document.documentElement.style.setProperty('--box-size', `${boxSize}px`)

  let sheet
  const sheetHtml = `<div class="sheet w-1/2 flex-col mx-auto"></div>`

  screen.innerHTML = ''
  document.querySelectorAll('#printable .row').forEach((row, idx) => {
    if (idx % rowsPerSheet === 0) {
      sheet = htmlToElement(sheetHtml)
      screen.appendChild(sheet)
    }

    sheet.appendChild(row.cloneNode(true))
  })
}
