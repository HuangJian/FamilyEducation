const sampleRow = document.querySelector('.row').cloneNode(true)
sampleRow.classList.remove('hidden')
const sampleBox = sampleRow.querySelector('.box')

document.querySelector('#words').value =
    '百战百胜 割麦 打谷 积肥 锄草 勇往直前 紫色 笑眯眯 狐狸 笨蛋 酸菜 己 所 不 欲 勿 施 于 人'

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

    document.querySelector('#words').value.trim()
        .split(/\s+/)
        .forEach(printWord)
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
    const row = sampleRow.cloneNode(false)

    const toAddMoreEmptyRows = /\+\d+$/.test(text)
    // 四行+2 => 四行
    const word = toAddMoreEmptyRows ? /^(.+?)\+\d+$/.exec(text)[1] : text

    const settings = [
        {size: 1, sample: 3, split: 0, extraRows: 0},
        {size: 2, sample: 2, split: 1, extraRows: 1},
        {size: 3, sample: 1, split: 1, extraRows: 1},
        {size: 4, sample: 1, split: 0, extraRows: 2},
    ]
    const setting = settings[word.length % 5 - 1]
    let extraRows = toAddMoreEmptyRows
        // 四行+2 => 2
        ? parseInt(/\+(\d+)$/.exec(text)[1])  + setting.extraRows
        : setting.extraRows

    const chars = word.split('')
    printChars(chars, row)

    Array.from({ length: setting.sample }, () => {
        Array.from({ length: setting.split }, () => {
            row.appendChild(sampleBox.cloneNode(true))
        })

        printChars(chars, row, 'sample')
    })
    Array.from({ length: maxColumns - row.childNodes.length }, () => {
        row.appendChild(sampleBox.cloneNode(true))
    })
    addRow(row)

    Array.from({ length: extraRows }, () => addRow(emptyRow.cloneNode(true)))
}

function printChars(chars, row, extraClass) {
    chars.forEach(it => {
        const box = sampleBox.cloneNode(true)
        const char = box.querySelector('.char')
        char.innerHTML = it
        if (extraClass) {
            char.classList.add(extraClass)
        }

        row.appendChild(box)
    })
}

function addRow(row) {
    document.querySelector('#printable').appendChild(row)
}

function layoutScreen() {
    const screen = document.querySelector('#screen')

    const sheetHeight = screen.offsetHeight * .9
    const boxSize = (sheetHeight + .0) / rowsPerSheet - 2
    document.documentElement.style.setProperty('--box-size', `${boxSize}px`);

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
