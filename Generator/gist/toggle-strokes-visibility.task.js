const fs = require('fs')

const htmlFilePath = process.argv[2]
const selectedText = process.argv[3]
const lineNumber = process.argv[4]
const startLineNumber = parseInt(lineNumber) - selectedText.split('\n').length + 1

// https://stackoverflow.com/a/20598914/474231
function nthIndexOf(str, pattern, n) {
    var i = -1;

    while (n-- && i++ < str.length) {
        i = str.indexOf(pattern, i);
        if (i < 0) break;
    }

    return i;
}

fs.readFile(htmlFilePath, 'utf8', (err, fileContent) => {
    if (err) {
        console.error(err)
        return
    }

    const isVisible = selectedText.includes('<svg>')
    const searchVal = isVisible ? /<svg>(\n*\s*)<use/g : /<svg style="display: none">/g
    const replaceVal = isVisible ? `<svg style="display: none">$1<use` : '<svg>'
    const replacedText = selectedText.replace(searchVal, replaceVal)

    const splitIndex = nthIndexOf(fileContent, '\n', startLineNumber - 1)
    const replacedContent = fileContent.substring(0, splitIndex) + '\n' +
        fileContent.substring(splitIndex + 1).replace(selectedText, replacedText)

    fs.writeFile(
        htmlFilePath,
        replacedContent,
        err => console.log(`err = ${err}`))
})
