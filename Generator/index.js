function $(selector) {
  return document.querySelector(selector)
}

function $$(selector) {
  return Array.from(document.querySelectorAll(selector))
}

/**
 * 将 html 字符串转为 DOM 节点：https://stackoverflow.com/a/35385518/474231 。
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  var template = document.createElement('template');
  template.innerHTML = html.trim(); // Never return a text node of whitespace as the result
  return template.content.firstChild;
}

window.onerror = function(message, source, lineno, colno, error) {
  $('.error').classList.remove('hidden')
  $('#message').innerText = message || JSON.stringify(error)
}

function closeErrorMessage() {
  $('.error').classList.add('hidden')
}

function toggleMathAnswersVisibility() {
  const isAnswerVisible = $('.box')?.innerText.length > 0
  if (isAnswerVisible) {
    $$('.box').forEach(it => it.innerText = '')
  } else {
    $$('.box').forEach((box, idx) => box.innerText = answers[idx])
  }
}

let answers = []
function calcMathAnswers() {
  return $('#calculations').value.replace('---', '')
    .split(/[,\n]/g)
    .filter(it => it.length > 0)
    .map(question => {
      const isAnswerAtLeft = question.indexOf('?') < question.indexOf('=')

      const isMulDiv = /[*/]/.test(question)
      const text = isMulDiv ? question.replace('?', '1') : question.replace('?', '0') // 乘除法，把问号替换为 1
      const numbers = [...execAll('+' + text, /[*/+-=\s]\d+/g)] // 前面加加号，便于正则表达式处理
      const equalSignPosition = numbers.findIndex(it => it.startsWith('=')) // 找到等于号的位置，用于判断数字在等于号左边还是右边
      const operatorForEqualSign = isMulDiv ? (isAnswerAtLeft ? '/' : '*') : (isAnswerAtLeft ? '-' : '+')

      // ?*7=777 → +1 *7 /777
      // 790-279=?+331 → +790 -279 -0 -331
      // 229+?+395=993 → +229 +0 +395 -993
      // 771-269=?+366 → +771-269 -0 -366
      const expression = numbers.reduce((prev, curr, idx) => {
        const isCurrentNumberAtLeft = equalSignPosition < 0 || idx < equalSignPosition
        if (isCurrentNumberAtLeft) {
          return `${prev} ${curr}`
        }
        // 当前处理的数字在等于号右边，需要翻转运算符
        return `${prev} ${reverseOperator(curr, operatorForEqualSign)}`
      }, '')

      const answer = Math.abs(eval(expression)) // 加减法的问号在左边时，算出来负数，用 Math.abs 处理一下
      return answer < 1.0 ? 1.0 / answer : answer // 问号是被除数和乘数时，算出来分数，改成倒数
    })
}

// 翻转运算符: +402 => -402
function reverseOperator(number, operatorForEqualSign) {
  const operatorMap = {
    '+': '-',
    '-': '+',
    '*': '/',
    '/': '*',
    '=': operatorForEqualSign,
  }
  return operatorMap[number[0]] + number.substr(1)
}

function* execAll(str, regex) {
  if (!regex.global) {
    console.error('RegExp must have the global flag to retrieve multiple results.')
  }

  let match
  while (match = regex.exec(str)) {
    yield match[0]
  }
}

function make() {
  makeMaths()
  makeChars()
}

$('#calculations').value = `
420+391=?,215+409=?,926+778=?
724-95=?,971-600=?,1342-763=?
57+?=803,249+?=789,1245+?=1650
83*7=?,9*48=?,774*4=?
459/3=?,504/8=?,918/6=?
---
?-267=893-453,149+154+404+387=?
790-279=?+331,501+528+389-1218=?
229+?+395=993,1068+570-798-609=?
278+?-583=467,1999-652-522-431=?
`.trim()

function makeMaths() {
  const content = $('#calculations').value
  $('#math').innerHTML = `
    <code class="hidden">${content}</code>
    ${
      (content || '[]')
        .split('\n')
        .map(line => convertLineToHtml(line))
        .join('')
    }
  `
  answers = calcMathAnswers()
}

// '83*7=?,9*48=?,774*4=?' => <div class="question flex-1">xxx</div>
// '---' => <hr class="mt-2">
function convertLineToHtml(line) {
  if (line.startsWith('---')) {
    return '<hr class="mt-2">'
  }

  return `
    <div class="flex origin-left mt-2">
      ${ line
          .split(',')
          .map(item => `<div class="question flex-1">${convertQuestionToHtml(item)}</div>`)
          .join('')
      }
    </div>
  `
}

// '83*7=?' => <i>83</i><i>&times;</i><i>7</i><i>=</i><i class="box"></i>
function convertQuestionToHtml(question) {
  return question
    .replaceAll('/', '÷')
    .replaceAll(/(\d+|[*÷+-=])/g, `<i>$1</i>`)
    .replaceAll('?', `<i class="box"></i>`)
    .replaceAll(/\*/g, '&times;')
}

/**
 * 生成练习题。
 */
function makeChars() {
  const char = $('#char-to-practise').value
  if (!char) return

  const reqData = char.split('')
    .map(it => fetch(`../cnchar-data/draw/${it}.json`).then(res => res.text()))
  Promise.all(reqData)
    .then(arr => {
      const svgArray = arr.map(it => JSON.parse(it)['strokes'])
        .map(strokes => {
          const pathArrayText = strokes.map(s => `<path d="${s}"></path>`).join('')
          return `<div><svg><g>${pathArrayText}</g></svg></div>`
        })

      $('#char').innerHTML = svgArray.join('<hr class="my-2">')

      layoutChar()
      injectStyles()
      $('#char').prepend(htmlToElement(`<code class="hidden">${char}</code>`))
    })
}

function copyHtmlSource() {
  const styles = $('#globalStyle').innerHTML.replaceAll(/\/\/*.+?\*\//gs, '')
  const madeHtml = $('#output').innerHTML
  const source = `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com/3.0.12"></script>
      </head>
      <body>
        <section id="output">${madeHtml}</section>
        <style>${styles}</style>
        <script>${scriptToInjectStyles}</script>
      </body>
    </html>`
  navigator.clipboard.writeText(source)
}

function toggleStrokeNames() {
  const char = $('#char-to-practise').value
  const arr = cnchar.stroke(char, 'order', 'name')
  const isStrokeVisible = $('#strokes').innerHTML?.includes('<br>')
  if (isStrokeVisible) {
    $('#strokes').innerHTML = ''
  } else {
    $('#strokes').innerHTML = arr.map((it, idx) => char[idx] + ': ' + it.join(', ')).join('<br>')
  }
}

/**
 * 布局汉字描红区域。
 */
function layoutChar() {
  const emptyBox = htmlToElement(`<svg></svg>`)

  $$('#char svg').forEach((char, idx) => {
    const container = htmlToElement('<div class="write-them-down flex w-100 justify-between"></div>')
    char.parentElement.prepend(container)

    const sample = htmlToElement('<div class="flex scale-[0.7] origin-left w-fit sample"></div>')
    char.parentElement.prepend(sample)

    const id = `char${idx}`
    const g = char.querySelector('g')
    g.setAttribute('id', id)
    const ref = htmlToElement(`<svg><use href="#${id}"></use></svg>`)

    Array.from({ length: g.querySelectorAll('path').length}, () => sample.prepend(ref.cloneNode(true)))
    container.appendChild(char)
    Array.from({ length: 5 }, () => container.appendChild(ref.cloneNode(true)))
    Array.from({ length: 5 }, () => container.appendChild(emptyBox.cloneNode(false)))
  })
}

const scriptToInjectStyles = `
  const injectedStyles = Array.from({ length: 100 })
    .map(it => it + 1)
    .map((_, idx) =>
      \`.sample > svg:nth-child(\${idx}) { --char-index: \${idx}; }\`
      + \`path:nth-child(\${idx}) { --stroke-index: \${idx}; }\`
    )
    .join('\\n')

  document.querySelector('#injected')?.remove()
  document.head.insertAdjacentHTML('beforeend', \`<style id="injected">\${injectedStyles}</style>\`)
`;

/**
 * 动态注入汉字笔画样式，避免大量重复 CSS 代码。
 */
function injectStyles() {
  eval(scriptToInjectStyles)
}

/**
 * 根据传入的数字随机修改后几位，生成一个新数字。
 * @param {传入的数字} seed
 * @param {需修改的数字位数} digitsToChange
 * @param {允许生成的最小值} minValue
 * @param {需要能整除的数字} divideBy
 * @returns 随机生成的新数字。
 */
function randomNumber(seed, digitsToChange, minValue, divideBy) {
  const num = parseInt(seed)
  const max = Math.pow(10, digitsToChange) - 1

  let ret
  do {
    ret = num - num % (max + 1) + Math.floor(Math.random() * max)
  } while(ret < minValue || (divideBy && ret % divideBy !== 0) || ret === num)
  return `${ret}`
}

/**
 * 生成随机计算题。
 */
function randomizeCalculations() {
  $('#calculations').value = $('#calculations').value.split('\n')
    .map(line => line.split(',').map(item => {
        let digitsToChange = 2 // // 只随机生成末两位，避免答案出现负数或者超过一千
        let minValue = 11 // 避免出现 10 以下数字，难度过低
        let divideBy = NaN

        const isMultiply = item.includes('*')
        const isDivision = item.includes('/')
        if (isDivision) {
          divideBy = parseInt(/(\d)=/.exec(item)[1]) // '528/8=?' => 8
        }

        return item.replace(/\d+/g, match => {
          if ((isMultiply || isDivision) && match.length === 1) { // 乘数或者被除数，且只有个位数 → 不变
            return match
          } else if (match === '999') { // 最后一题暂时固定为 999 减去多个数，所以不处理 999。999-317-113-353=?
            return match
          }
          return randomNumber(match, digitsToChange, minValue, divideBy)
        })
      }).join(',')
    ).join('\n')

    makeMaths()
}
