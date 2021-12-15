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
  template.innerHTML =  html.trim(); // Never return a text node of whitespace as the result
  return template.content.firstChild;
}

window.onerror = function(message, source, lineno, colno, error) { 
  console.log(message, source, error)
  $('.error').classList.remove('hidden')
  $('#message').innerText = message || JSON.stringify(error)
}

function closeErrorMessage() {
  $('.error').classList.add('hidden')
}

/**
 * 生成练习题。
 */
function make() {
  const char = $('#char-to-practise').value || '请输入汉字'
  cnchar.draw(char, {        
    el: '#char',        
    type: cnchar.draw.TYPE.STROKE,
    style: {
      length: 50,
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

/**
 * 布局汉字描红区域。
 */
function layoutChar() {
  $$('#char > div > svg:first-child').forEach((char, idx) => {
    const clone = char.cloneNode(true)
    // 第一笔原来为红色，显示其为灰色，让娃在上面描写完整字样
    clone.querySelector('path:first-child').setAttribute('style', 'fill: rgb(221, 221, 221);')

    const container = htmlToElement('<div class="write-them-down flex"></div>')
    const id = `char${idx}`
    clone.firstChild.setAttribute('id', id)
    container.appendChild(clone)

    Array.from({ length: 9 }, () => {
      const item = clone.cloneNode(false)
      item.innerHTML = `<use href="#${id}"/>`
      container.appendChild(item)
    })
    char.parentElement.insertAdjacentElement('afterend', container)

    char.parentElement.classList.add('flex', 'scale-[0.6]', 'origin-left')
  })
}

