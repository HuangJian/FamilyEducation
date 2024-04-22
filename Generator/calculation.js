function calculateExpression(expression) {
    expression = expression.replace(/\s/g, '')

    const [leftSide, rightSide] = expression.split('=')
    let unknownSide = leftSide.includes('?') ? leftSide : rightSide
    const knownSide = leftSide.includes('?') ? rightSide : leftSide

    // 50-?=20, 100-20*?=200, 100-200/?=50
    const isNegative = /-[\d*/]*\?/.test(unknownSide)

    // extract the multiplication & division part: 100-30/?=20 => 30/?
    const mulDivPart = (/((\d+[*/])*\?([*/]\d+)*)/.exec(unknownSide))[0]
    if (mulDivPart.length > 2) {
        unknownSide = unknownSide.replace(mulDivPart, '0')
    } else {
        unknownSide = unknownSide.replace('?', '0')
    }

    let result = eval(knownSide) - eval(unknownSide)
    if (mulDivPart) {
        result = calculateSimpleMulDivExpression(mulDivPart, result)
    }

    return isNegative ? -result : result
}

// expression: 100/?, answer: 2 => result: 50
// expression: ?/4, answer: 25 => result: 100
// expression: 20*?, answer: 100 => result: 5
function calculateSimpleMulDivExpression(expression, answer) {
    if (/\d\/\?/.test(expression)) {
        return eval(expression.replace('?', '1')) / answer
    }
    if (/\?\/\d/.test(expression)) {
        return answer / eval(expression.replace('?', '1'))
    }
    return answer / eval(expression.replace('?', '1'))
}

const testExpressions = [
    // Simple addition
    ['5+?=15', 10],
    ['?+10=20', 10],
    ['40=20+?', 20],

    // Simple subtraction
    ['50-?=20', 30],
    ['?-15=25', 40],
    ['50=100-?', 50],

    // Complex addtion + substration expressions
    ['10+10-10=?', 10],
    ['10+?-5=15', 10],
    ['10+10-?=10', 10],
    ['10=10+10-?', 10],
    ['10+?=15+5', 10],

    // Simple multiplication
    ['5*?=50', 10],
    ['?*4=32', 8],
    ['100=10*?', 10],

    // Simple division
    ['100/?=25', 4],
    ['?/5=4', 20],
    ['9=81/?', 9],
    ['5=?/2', 10],

    // Complex addtion + substration expressions
    ['20-?*4=0', 5],
    ['300/?-20=10', 10],
    ['50+?/2-10=20', -40],
    ['30=25+?*3-10', 5],
    ['20+70=100-?/10', 100],

    // Complex multiplication + devision expressions
    ['2*?*2=16', 4],
    ['4=?/8*4', 8],
    ['2=8/?/2', 2],
    ['3*?/2=6', 4],
    ['1*2*3*?/6=2', 2],
    ['3=1*?/2/3*2', 9],

    // Complex expressions with all four operations
    ['10+?*4-20/5=30', 6],
    ['100-?/4+20=80', 160],
    ['10+?*2-50/5=30-30/3', 10],
    ['200-?+50/10-30=100', 75],
    ['25+?*3-10/2+5=40', 5],
    ['75+25/5=40+?/2', 80],
]

for (const [expression, expectedAnswer] of testExpressions) {
    const result = calculateExpression(expression)
    if (result !== expectedAnswer) {
        console.error(`${expression} expect ${expectedAnswer}, but got: ${result}`)
    }
}
