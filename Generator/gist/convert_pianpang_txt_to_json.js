const fs = require('fs')

fs.readFile('../data/pianpang.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    //   console.log(data)
    fs.readFile('../data/pianpang_desc.txt', 'utf8', (err2, desc) => {
        if (err2) {
            console.error(err2)
            return
        }
        // console.log(desc)
        convertDataToJson(data, desc)
    })
})

function convertDataToJson(data, desc) {
    const rows = data.split('\n')
    let result = []
    for (let i = 0; i < rows.length / 3; ++i) {
        const item = {
            shape: rows[i * 3],
            name: rows[i * 3 + 1],
            sample: rows[i * 3 + 2]?.replace(/、$/, ''),
        }
        result.push(item)
    }

    desc.split('\n')
        .filter(it => it.length > 0)
        .forEach(row => {
            const id = row.charAt(0)
            const item = result.reduce((found, current) =>
                found || (current.shape === id ? current : null), null)

            if (item) {
                item.desc = row
            } else {
                result.push({
                    shape: id,
                    name: '',
                    sample: '',
                    desc: row
                })
            }
        })
    //   console.log(result)
    fs.writeFile('../data/pianpang.json', JSON.stringify(result), err => console.log(`err = ${err}`))
}
