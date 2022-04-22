const fs = require('fs')

// download from https://github.com/kfcd/chaizi/blob/master/chaizi-jt.txt
fs.readFile('../data/chaizi-jt.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    convertDataToJson(data)
})

function convertDataToJson(data) {
    const result = {}
    data.split('\n').forEach(row => {
        const arr = row.split('\t')
        const id = arr[0]
        result[id] = arr.filter((_, idx) => idx > 0).map(it => it.split(' '))
    })

    //   console.log(result)
    fs.writeFile('../data/chaizi.json', JSON.stringify(result), err => console.log(`err = ${err}`))
}
