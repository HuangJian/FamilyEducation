import fetch from 'node-fetch'
import fs from 'fs'

// https://handwritingworksheets.com/1-letters/denelian1/cap-a.gif
// https://handwritingworksheets.com/1-letters/denelian1/low-a.gif
// https://handwritingworksheets.com/1-letters/denelian1/dot-a.gif
// https://handwritingworksheets.com/1-letters/denelian1/lowdot-a.gif

const baseUrl = `https://handwritingworksheets.com/1-letters/denelian1`;

'abcdefghijklmnopqrstuvwxyz'.split('')
    .forEach(letter => {
        ['cap', 'lower', 'dot', 'lowdot'].forEach(async type => {
            const res = await fetch(`${baseUrl}/${type}-${letter}.gif`)
            res.body.pipe(fs.createWriteStream(`./images/${type}-${letter}.gif`))
        })
    })
