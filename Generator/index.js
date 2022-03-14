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
  makeChars()
  makeMaths()
}

$('#calculations').value = `
4+?=10,9+?=18,7+?=22
?-8=2,?-12=12,?-13=8
20-?=14,36-?=28,44-?=12
16+7=?,75+28=?,105-25=?
1*1=?,2*1=?,3*1=?
---
?+23=35-7,9+?=11+18
6+?+5=30,18+19+20+21=?
24+?=50-?,21+17+35+24=?
23-?=32-?,42-28+33-39=?
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
          return `<span class="box"></span>`
        }
        return `<span>${it}</span>`
      }).join('')
      return `<div class="question flex-1">${question}</div>`
    }).join('\n')
    return `<div class="flex origin-left mt-2">${inner}</div>`
  }).join('\n')

  $('#math').innerHTML = `<div class="hidden">${content}</div>\n` 
    + html.replaceAll(/\*/g, '&times;')
}

const charSize = 54
/**
 * 生成练习题。
 */
function makeChars() {
  const char = $('#char-to-practise').value
  if (!char) return

  // https://theajack.gitee.io/cnchar/doc/draw.html#_2-%E4%BD%BF%E7%94%A8
  cnchar.draw(char, {        
    el: '#char',        
    type: cnchar.draw.TYPE.STROKE,
    style: {
      length: charSize,
      outlineColor: '#999'
    },
    line: {
      lineStraight: false,
      lineCross: false,
    },
  })

  setTimeout(() => {
    layoutChar()
    simplifyCharSvg()
    $('#char').prepend(htmlToElement(`<div class="hidden">${char}</div>`))
  }, 2000)
  
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
        <style>${injectedStyles}</style>
      </body>
    </html>`
  navigator.clipboard.writeText(source)
}

function showStrokeNames() {
  const char = $('#char-to-practise').value
  const arr = cnchar.stroke(char, 'order', 'name')
  $('#strokes').innerHTML = arr.map((it, idx) => char[idx] + ': ' + it.join(', ')).join('<br>')
}
/**
 * 布局汉字描红区域。
 */
function layoutChar() {
  const emptyBox = htmlToElement(`<svg></svg>`)

  $$('#char > div > svg:first-child').forEach((char, idx) => {
    const clone = char.cloneNode(true)

    const container = htmlToElement('<div class="write-them-down flex w-100 justify-between"></div>')
    const id = `char${idx}`
    clone.firstChild.setAttribute('id', id)
    container.appendChild(clone)

    Array.from({ length: 5 }, () => {
      const item = clone.cloneNode(false)
      item.innerHTML = `<use href="#${id}"/>`
      container.appendChild(item)
    })
    char.parentElement.insertAdjacentElement('afterend', container)
    char.parentElement.classList.add('flex', 'scale-[0.7]', 'origin-left', 'sample')

    Array.from({ length: 5 }, () => {
      container.appendChild(emptyBox.cloneNode(false))
    })
  })
}

let injectedStyles = ''

/**
 * 简化汉字svg内容，减少代码量，加快浏览器加载速度。
 */
function simplifyCharSvg() {
  const charContainer = $('#char')
  charContainer.innerHTML = charContainer.innerHTML
    .replaceAll(/width=.+? height=.+? /g, '')
    .replaceAll(/style=".+?;"/g, '')

  let maxStrokesCount = 0
  $$('.sample').forEach((sample, idx) => {
    const strokesCount = sample.querySelectorAll('svg').length
    maxStrokesCount = Math.max(maxStrokesCount, strokesCount)

    sample.innerHTML = Array.from(
      { length: strokesCount }, 
      () => `<svg><use href="#char${idx}"/></svg>`
    ).join('\n')
  })

  injectedStyles = Array.from({ length: maxStrokesCount })
    .map((_, idx) => `
      .sample > svg:nth-child(${idx + 1}) {
        --char-index: ${idx + 1};
      }
      path:nth-child(${idx + 1}) {
        --stroke-index: ${idx + 1};
      }`
    ).join('\n')

  $('#injected')?.remove()
  document.head.insertAdjacentHTML('beforeend', `<style id="injected">${injectedStyles}</style>`)
}

