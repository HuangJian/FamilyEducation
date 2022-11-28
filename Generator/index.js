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

function make() {
  makeMaths()
  makeChars()
}

$('#calculations').value = `
420+391=?,215+409=?,426+778=?
724-95=?,971-600=?,942-163=?
57+?=803,249+?=789,345+?=950
83*7=?,9*48=?,774*4=?
459/3=?,504/8=?,918/6=?
---
?-267=893-453,149+154+404+187=?
790-279=?+331,501+328+289-918=?
229+?+395=993,468+470-298-309=?
278+?-583=467,999-252-122-431=?
`.trim()

function makeMaths() {
  const content = $('#calculations').value
  const lines = (content || '[]').split('\n')

  const html = lines.map(line => {
    if (line.startsWith('---')) {
      return '<hr class="mt-2">'
    }

    const items = line.split(',')
    const inner = items.map(item => {
      const arr = item.match(/(\d+)|\+|-|\*|\/|=|\?/g) || []
      const question = arr.map(it => {
        if (it === '?') {
          return `<i class="box"></i>`
        } else if (it === '/') {
          return `<i>÷</i>`
        }
        return `<i>${it}</i>`
      }).join('')
      return `<div class="question flex-1">\n${question}\n</div>`
    }).join('\n')
    return `<div class="flex origin-left mt-2">${inner}</div>`
  }).join('\n')

  $('#math').innerHTML = `\n<code class="hidden">\n${content}\n</code>\n`
    + html.replaceAll(/\*/g, '&times;')
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
  const styles = $('#globalStyle').innerHTML
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
    sample.appendChild(char)

    const id = `char${idx}`
    const g = char.querySelector('g')
    g.setAttribute('id', id)
    const ref = htmlToElement(`<svg><use href="#${id}"></use></svg>`)

    Array.from({ length: g.querySelectorAll('path').length - 1}, () => sample.prepend(ref.cloneNode(true)))
    Array.from({ length: 6 }, () => container.appendChild(ref.cloneNode(true)))
    Array.from({ length: 5 }, () => container.appendChild(emptyBox.cloneNode(false)))
  })
}

const scriptToInjectStyles = `
  const injectedStyles = Array.from({ length: 100 })
    .map((_, idx) => \`
      .sample > svg:nth-child(\${idx + 1}) { --char-index: \${idx + 1}; }
      path:nth-child(\${idx + 1}) { --stroke-index: \${idx + 1}; }
      \`
    ).join('\\n')

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
  } while(ret < minValue || (divideBy && ret % divideBy !== 0))
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
}
