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
237+583=?,242+566=?,412+605=?
783-73=?,862-295=?,836-327=?
81+?=823,247+?=812,327+?=935
22*6=?,32*8=?,66*10=?
72/?=?,72/6=?,92/4=?
---
?-238=726-414,138+272+394+127=?
832-205=?+385,314+185+283-692=?
277+?+354=903,484+226-129-373=?
205+?-417=299,999-365-127-348=?
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
 * 根据传入的数字随机修改其末两位，生成一个新数字。
 * @param {传入的数字} seed
 * @returns 随机生成的新数字。
 */
function randomNumber(seed) {
  // 最后一题暂时固定为 999 减去多个数，所以不处理 999。
  // 977-317-113-353=?
  if (seed === '999') return seed

  const num = parseInt(seed)
  // 只随机生成末两位，避免答案出现负数或者超过一千
  let ret
  do {
    ret = seed - seed % 100 + Math.floor(Math.random() * 99)
  } while(ret < 11) // 避免出现 10 以下数字，难度过低
  return `${ret}`
}

/**
 * 生成随机计算题。
 */
function randomizeCalculations() {
  $('#calculations').value = $('#calculations').value.split('\n')
    .map(line => line.split(',').map(item => {
        if (!/[+-]/.test(item)) { // 只处理加减法
          return item
        }

        return item.replace(/\d+/g, match => randomNumber(match))
      }).join(',')
    ).join('\n')
}
