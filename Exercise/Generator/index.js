function $(selector) {
  return document.querySelector(selector)
}

function $$(selector) {
  return Array.from(document.querySelectorAll(selector))
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
  const char = $('#char').value || '请输入汉字'
  cnchar.draw(char, {        
    el: '.char',        
    type: cnchar.draw.TYPE.STROKE,
  })
}

