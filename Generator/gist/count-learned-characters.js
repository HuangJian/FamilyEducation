const fs = require('fs')

fs.readFile('../../Exercise/learned-chars.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    countLearnedCharacters(data)
})

// https://stackoverflow.com/a/43419070/474231
// U+3040 - U+30FF: hiragana and katakana (Japanese only)
// U+3400 - U+4DBF: CJK unified ideographs extension A (Chinese, Japanese, and Korean)
// U+4E00 - U+9FFF: CJK unified ideographs (Chinese, Japanese, and Korean)
// U+F900 - U+FAFF: CJK compatibility ideographs (Chinese, Japanese, and Korean)
// U+FF66 - U+FF9F: half-width katakana (Japanese only)

const cjkPattern =/[\u4e00-\u9fff]/
function countLearnedCharacters(data) {
    const set = new Set()
    data.split('')
        .filter(char => cjkPattern.test(char))
        .forEach(char => set.add(char))

    // console.log(set)
    console.log(`Congratulations! You have learned ${set.size} unique Chinese characters.`)
}
