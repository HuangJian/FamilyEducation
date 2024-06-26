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
  var template = document.createElement('template')
  template.innerHTML = html.trim() // Never return a text node of whitespace as the result
  return template.content.firstChild
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
  return $('#calculations').value
    .replaceAll('---', '')
    .replaceAll('===', '')
    .split(/[,\n]/g)
    .filter(it => it.length > 0)
    .map(it => calculateExpression(it))
}

// 翻转运算符: +402 => -402
function reverseOperator(number, operatorForEqualSign) {
  const operatorMap = {
    '+': '-',
    '-': '+',
    '*': '*', // 乘除法后一个数字不需要翻转运算符
    '/': '/',
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
  makeEnglish()
  makeMaths()
  makeChars()
}

function makeEnglish() {
  const words = $('#english-to-practise').value

  const line = words.split(' ')
    .map(word => {
      const images = word.split('')
        .map(letter => {
          const isCap = /[A-Z]/.test(letter)
          const style = isCap ? 'cap' : 'lower'
          return `<img class="letter" src="./images/${style}-${letter.toLowerCase()}.png"/>`
        })
        .join('\n')
      return `<div class="flex word">${images}</div>`
    })
    .join('\n')

    const lineHtml = `
      <div class="flex w-100 justify-between">
        ${line}
      </div>
    `

    const dottedLineHtml = lineHtml.replaceAll('cap-', 'dot-').replaceAll('lower-', 'lowdot-')
    const rows = [
      `<code class="hidden">${words}</code>`,
      ...Array.from({ length: $('#dashed-rows').value }, () => lineHtml),
      ...Array.from({ length: $('#dotted-rows').value }, () => dottedLineHtml),
    ]
    $('#english').innerHTML = rows.join('\n')
}

$('#calculations').value = `
282+73=?,3737-?=374,1110+?=5143
218*9=?,49*83=?,587*28=?
3976/8=?,495/33=?,8502/39=?
523-?=72*6,8264+364+831-6402=?
5946+38*12=?,5272+6400-7674-881=?
8624-6976/8=?,5881-305-3778-1106=?
`.trim()

// 处理复制粘贴时的格式错乱
function fixCalculationsFormat() {
  const content = ($('#calculations').value || [])
    .split('\n')
    .map(line => line.trim())
    .join('\n')
  $('#calculations').value = content
  return content
}

function makeMaths() {
  const content = fixCalculationsFormat()
  answers = calcMathAnswers()

  $('#math').innerHTML = `
    <code class="hidden">${content}</code>
    <code class="hidden" id="answers">${answers.join(',')}</code>
    ${
      content
        .split('\n')
        .map(line => convertLineToHtml(line))
        .join('')
    }
  `
}

// '83*7=?,9*48=?,774*4=?' => <div class="question flex-1">xxx</div>
// '---' => <hr class="mt-2">
// '===' => <hr class="my-12">
function convertLineToHtml(line) {
  if (line.startsWith('---')) {
    return '<hr class="mt-2">'
  } else if (line.startsWith('===')) {
    return '<hr class="my-12">'
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

      $('#char').innerHTML = svgArray.join('')

      layoutChar()
      $('#char').prepend(htmlToElement(`<code class="hidden">${char}</code>`))
    })
}

function copyHtmlSource() {
  $$('.box').forEach(box => box.innerText = '') // 清空答案
  const styles = $('#globalStyle').innerHTML.replaceAll(/\/\/*.+?\*\//gs, '')
  const madeHtml = $('#output').innerHTML.replaceAll('./images/', '../../Generator/images/')
  const source = `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com/3.0.12"></script>
      </head>
      <body>
        <section id="output">${madeHtml}</section>
        <style>${styles}</style>
        <script>${scriptToDisplayAnswers}</script>
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

    const sample = htmlToElement('<div class="flex scale-[0.6] origin-left w-fit sample"></div>')
    char.parentElement.prepend(sample)

    const id = `char${idx}`
    const g = char.querySelector('g')
    g.setAttribute('id', id)
    const ref = htmlToElement(`<svg><use href="#${id}"></use></svg>`)

    Array.from({ length: g.querySelectorAll('path').length}, () => sample.prepend(ref.cloneNode(true)))
    container.appendChild(char)
    Array.from({ length: parseInt($('#dashed-columns').value) - 1 }, () => container.appendChild(ref.cloneNode(true)))
    Array.from({ length: parseInt($('#empty-columns').value) }, () => container.appendChild(emptyBox.cloneNode(false)))
  })
}

const scriptToDisplayAnswers = `
  document.addEventListener('keydown', evt => {
    if (evt.code === 'ControlLeft') {
      let isAnswerVisible = document.querySelector('.box').innerText !== ''
      const answers = document.querySelector('#answers').textContent.split(',')
      document.querySelectorAll('.box')
        .forEach((box, idx) => box.innerText = isAnswerVisible ? '' : answers[idx])
    }
  })
`
eval(scriptToDisplayAnswers)


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
`

// 动态注入汉字笔画样式，避免大量重复 CSS 代码
eval(scriptToInjectStyles)

/**
 * 根据传入的数字随机修改后几位，生成一个新数字。
 * @param {传入的数字，字符串格式} seed
 * @param {需修改的数字位数} digitsToChange
 * @param {需要能整除的数字} divideBy
 * @returns 随机生成的新数字。
 */
function randomNumber(seed, digitsToChange, divideBy) {
  const num = parseInt(seed)
  const range = Math.pow(10, digitsToChange)
  const floor = num - num % range
  let minimum = Math.pow(10, digitsToChange - 1)
  minimum = Math.max(minimum, 4) // 不要生成小于4的乘数

  let ret
  do {
    ret = floor + Math.floor(Math.random() * range)
  } while(ret <= minimum || (divideBy && ret % divideBy !== 0))
  return `${ret}`
}

/**
 * 生成随机计算题。
 */
function randomizeCalculations() {
  const isRandomDivideBy = $('#random-divide-by').checked
  const isKeepHundredsForPlus = $('#keep-hundreds').checked

  $('#calculations').value = fixCalculationsFormat()
    .split('\n')
    .map(line => line.split(',').map(item => {
        let divideBy = NaN
        let previousDivideBy = NaN

        const isMultiply = item.includes('*')
        const isDivision = item.includes('/')
        if (isDivision) {
          previousDivideBy = /(\d+)=/.exec(item)[1] // '528/28=?' => '28'
          if (isRandomDivideBy) {
            divideBy = randomNumber(previousDivideBy, previousDivideBy.length, NaN)
          } else {
            divideBy = parseInt(previousDivideBy)
          }
        }

        let newItem
        let attempts = 0
        do {
          newItem = item.replace(/\d+/g, match => {
            if (isDivision && match === previousDivideBy) {
              return divideBy
            }
            const digitsToChange = ((isMultiply || isDivision) || !isKeepHundredsForPlus) ? match.length : 2
            return randomNumber(match, digitsToChange, divideBy)
          })
          ++attempts
        } while (calculateExpression(newItem) < 0 && attempts < 100)
        return newItem
      }).join(',')
    ).join('\n')

  makeMaths()
  toggleMathAnswersVisibility()
}

function calculateExpression(expression) {
  // Remove any whitespace from the expression
  expression = expression.replace(/\s/g, '')

  // Split the expression into left and right sides
  const [leftSide, rightSide] = expression.split('=')

  // Determine the unknown side and the known side
  const unknownSide = leftSide.includes('?') ? leftSide : rightSide
  const knownSide = leftSide.includes('?') ? rightSide : leftSide

  // Check if the unknown value is in a negative expression
  // 50-?=20, 100-20*?=200, 100-200/?=50
  const isNegative = /-[\d*/]*\?/.test(unknownSide)

  // Extract the multiplication and division part
  // 100-30/?=20 => 30/?
  const mulDivPart = /((\d+[*/])*\?([*/]\d+)*)/.exec(unknownSide)?.[0]
  const hasMultiplicationOrDivision = mulDivPart && mulDivPart.length > 2

  // Calculate the initial result
  let result = eval(knownSide) - eval(unknownSide.replace(mulDivPart || '?', '0'))

  // Handle the multiplication and division part
  if (hasMultiplicationOrDivision) {
    result = calculateSimpleMulDivExpression(mulDivPart, result)
  }

  // Return the final result, taking into account the negative expression
  return isNegative ? -result : result
}

// expression: 100/?, answer: 2 => result: 50
// expression: ?/4, answer: 25 => result: 100
// expression: 20*?, answer: 100 => result: 5
function calculateSimpleMulDivExpression(expression, answer) {
  if (/\d\/\?/.test(expression)) {
      return eval(expression.replace('?', '1')) / answer
  }
  return answer / eval(expression.replace('?', '1'))
}
