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
1+1=?,1+2=?,1+3=?,1+4=?
2+2=?,2+4=?,2+6=?,2+8=?
3+3=?,3+4=?,3+5=?,3+6=?
5-4=?,5-3=?,5-2=?,5-1=?
4-4=?,4-3=?,4-2=?,4-1=?
---
8+3=?,2+9=?,7+4=?,6+6=?
6+?=9,?+2=10,7-?=3,?-5=5
---
3+4+2=?,5+4-6=?
`.trim()

function makeMaths() {
  const lines = ($('#calculations').value || '').split('\n')

  const html = lines.map(line => {
    if (line.startsWith('---')) {
      return '<hr class="mt-4">'
    }
    
    const items = line.split(',')
    const inner = items.map(item => {
      const question = item.replaceAll(/\?/g, `<span class="box"></span>`)
      return `<div class="flex-1">${question}</div>`
    }).join('\n')
    return `<div class="flex origin-left mt-4">${inner}</div>`
  }).join('\n')

  $('#math').innerHTML = html
}

const charSize = 42
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
  }, 1000)
  
}

function copyHtmlSource() {
  const source = `<section id="output">${$('#output').innerHTML}</section>`
  navigator.clipboard.writeText(source).then(
    function() {
      console.log("Async: Copying to clipboard was successful!");
    },
    function(err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
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
  const emptyBox = htmlToElement(`
    <svg width="${charSize}" height="${charSize}">
    </svg>
  `)
  $$('#char > div > svg:first-child').forEach((char, idx) => {
    const clone = char.cloneNode(true)
    // 第一笔原来为红色，显示其为灰色，让娃在上面描写完整字样
    clone.querySelector('path:first-child').setAttribute('style', 'fill: rgb(153, 153, 153);')

    const container = htmlToElement('<div class="write-them-down flex w-100 justify-between"></div>')
    const id = `char${idx}`
    clone.firstChild.setAttribute('id', id)
    container.appendChild(clone)

    Array.from({ length: 9 }, () => {
      const item = clone.cloneNode(false)
      item.innerHTML = `<use href="#${id}"/>`
      container.appendChild(item)
    })
    char.parentElement.insertAdjacentElement('afterend', container)
    char.parentElement.classList.add('flex', 'scale-[0.6]', 'origin-left', 'sample')

    Array.from({ length: 5 }, () => {
      container.appendChild(emptyBox.cloneNode(false))
    })
  })
}

