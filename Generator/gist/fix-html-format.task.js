const fs = require('fs')

const htmlFilePath = process.argv[2]

console.log(`formatting file at ${htmlFilePath}`)

fs.readFile(htmlFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    // vscode 内置的 html 格式化工具效果有缺憾，使用 regex 替换完善之。
    const output = data
        // 使 <svg><use></svg> 紧凑到一行
        .replace(/<svg>\n\s*<use(.+?)\n\s*<\/svg>/g, `<svg><use$1</svg>`)
        // 使输入文字自己一行
        .replace(/><code/g, `>\n            <code`)
        // 避免空行
        .replace(/\n\n/g, '\n')
    fs.writeFile(htmlFilePath, output, err => console.log(`err = ${err}`))
})
