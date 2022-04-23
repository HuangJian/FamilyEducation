const fs = require('fs')

// download from https://github.com/kfcd/chaizi/blob/master/chaizi-jt.txt
fs.readFile('../data/chaizi-jt.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    convertDataToJson(data)
})

// https://stackoverflow.com/a/43419070/474231
// U+3040 - U+30FF: hiragana and katakana (Japanese only)
// U+3400 - U+4DBF: CJK unified ideographs extension A (Chinese, Japanese, and Korean)
// U+4E00 - U+9FFF: CJK unified ideographs (Chinese, Japanese, and Korean)
// U+F900 - U+FAFF: CJK compatibility ideographs (Chinese, Japanese, and Korean)
// U+FF66 - U+FF9F: half-width katakana (Japanese only)

const cjkPattern =/[\u4e00-\u9fff]/
const invisibleChars = []
function convertDataToJson(data) {
    const result = {}
    data.split('\n').forEach(row => {
        const arr = row.split('\t')
        const id = arr[0]
        if (!cjkPattern.test(id)) {
            invisibleChars.push(id)
        } else {
            result[id] = arr.filter((_, idx) => idx > 0).map(it => it.split(' '))
        }
    })

    // console.log(invisibleChars)
    // console.log(invisibleChars.length)

    //   console.log(result)
    fs.writeFile('../data/chaizi.json', JSON.stringify(result), err => console.log(`err = ${err}`))
}
