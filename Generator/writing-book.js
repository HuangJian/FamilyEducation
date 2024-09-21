const sampleRow = document.querySelector('.row').cloneNode(true)
sampleRow.classList.remove('hidden')
const sampleBox = sampleRow.querySelector('.box')

const words = '采桑 除草 割麦 打谷 积肥 锄草 葡萄 紫色 狐狸 笨蛋 酸菜 己 所 不 欲 勿 施 于 人'

const rowsPerPage = 16
const maxColumns = 8
const emptyRow = sampleRow.cloneNode(false)
Array.from({ length: maxColumns }, () => {
    emptyRow.appendChild(sampleBox.cloneNode(true))
})

let rows = 0

make()

function make() {
    rows = 0
    words.split(/\s+/).forEach(word => {
        printWord(word)
    })
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
    document.body.appendChild(row)
    ++rows
    if (rows >= rowsPerPage) {
        row.classList.add('mt-8')
        rows = 1
    }
}
