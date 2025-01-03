const sampleArticle = document.querySelector('.article').cloneNode(true)
sampleArticle.classList.remove('hidden')
const sampleWord = document.querySelector('.article .word')
const sampleBox = document.querySelector('.article .box')
const samplePinyinBox = document.querySelector('.article .pinyin')
const sampleH2 = document.querySelector('h2').cloneNode(true)
sampleH2.classList.remove('hidden')

const dictionary = `
1小蝌蚪找妈妈 看见|kàn jiàn,哪里|nǎ lǐ,那边|nà biān,头顶|tóu dǐng,眼睛|yǎn jing,雪白|xuě bái,肚皮|dù pí,找到|zhǎo dào,两条|liǎng tiáo,宽广|kuān guǎng,跳高|tiào gāo
2我是什么 天空|tiān kōng,傍晚|bàng wǎn,人们|rén men,冬天|dōng tiān,花朵|huā duǒ,平常|píng cháng,江河|jiāng hé,海洋|hǎi yáng,田地|tián dì,工作|gōng zuò,变化|biàn huà,北极|běi jí,好坏|hǎo huài,送给|sòng gěi,带来|dài lái
3植物妈妈有办法 办法|bàn fǎ,如果|rú guǒ,已经|yǐ jīng,长大|zhǎng dà,四海为家|sì hǎi wéi jiā,娃娃|wá wa,只要|zhǐ yào,皮毛|pí máo,那里|nà lǐ,知识|zhī shi,它们|tā men,更加|gèng jiā
1场景歌 花园|huā yuán,石桥|shí qiáo,队旗|duì qí,铜号|tóng hào,红领巾|hóng lǐng jīn,欢笑|huān xiào,到处|dào chù,羊群|yáng qún
2树之歌 杨树|yáng shù,树叶|shù yè,枫树|fēng shù,松柏|sōng bǎi,木棉|mù mián,水杉|shuǐ shān,化石|huà shí,金桂|jīn guì,粗壮|cū zhuàng,梧桐|wú tóng,儿歌|ér gē,六月|liù yuè,九牛一毛|jiǔ niú yī máo
3拍手歌 写字|xiě zì,丛林|cóng lín,深处|shēn chù,竹林|zhú lín,熊猫|xióng māo,朋友|péng you
4田家四季歌 四季|sì jì,农事|nóng shì,月光|yuè guāng,辛苦|xīn kǔ,棉衣|mián yī,吹风|chuī fēng,化肥|huà féi,连忙|lián máng,归来|guī lái,穿戴|chuān dài,辛苦|xīn kǔ
4曹冲称象 一同|yī tóng,柱子|zhù zi,一边|yī biān,到底|dào dǐ,秤杆|chèng gǎn,力气|lì qi,出来|chū lái,船身|chuán shēn,石头|shí tou,地方|dì fang,果然|guǒ rán,称重|chēng zhòng,做饭|zuò fàn,岁月|suì yuè,站立|zhàn lì
5玲玲的画 评奖|píng jiǎng,时间|shí jiān,报纸|bào zhǐ,来不及|lái bù jí,事情|shì qing,坏事|huài shì,好事|hào shì,拿起|ná qǐ,并非|bìng fēi,画纸|huà zhǐ,条幅|tiáo fú,另外|lìng wài
6一封信 出国|chū guó,今天|jīn tiān,圆珠笔|yuán zhū bǐ,开心|kāi xīn,以前|yǐ qián,还有|hái yǒu,台灯|tái dēng,这时|zhè shí,阳光|yáng guāng,电影|diàn yǐng,信封|xìn fēng,一支笔|yī zhī bǐ,句子|jù zi
7妈妈睡了 明亮|míng liàng,故事|gù shi,头发|tóu fa,窗外|chuāng wài,沉睡|chén shuì,沙沙作响|shā shā zuò xiǎng,直尺|zhí chǐ,哄骗|hǒng piàn,首先|shǒu xiān,闭上|bì shàng,笑脸|xiào liǎn
8古诗二首 依靠|yī kào,尽头|jìn tóu,黄河|huáng hé,高层|gāo céng,日照|rì zhào,香炉|xiāng lú,烟花|yān huā,高挂|gāo guà,山川|shān chuān
9黄山奇石 黄山|huáng shān,南部|nán bù,那些|nà xiē,山顶|shān dǐng,一动不动|yī dòng bú dòng,云海|yún hǎi,巨石|jù shí,前方|qián fāng,每当|měi dāng,金光闪闪|jīn guāng shǎn shǎn,它们|tā men,真好|zhēn hǎo,座位|zuò wèi,升旗|shēng qí,狗熊|gǒu xióng
10日月潭 群山|qún shān,树木|shù mù,名胜古迹|míng shèng gǔ jì,中央|zhōng yāng,美丽|měi lì,灯光|dēng guāng,中午|zhōng wǔ,展现|zhǎn xiàn,风光|fēng guāng,台湾|tái wān
11葡萄沟 出产|chū chǎn,水果|shuǐ guǒ,月份|yuè fèn,山坡|shān pō,枝叶|zhī yè,展开|zhǎn kāi,五光十色|wǔ guāng shí sè,好客|hào kè,老乡|lǎo xiāng,城市|chéng shì,空气|kōng qì,水分|shuǐ fèn,收下|shōu xià
12坐井观天 坐井观天|zuò jǐng guān tiān,井沿|jǐng yán,回答|huí dá,口渴|kǒu kě,大话|dà huà,井口|jǐng kǒu,无边无际|wú biān wú jì,喝水|hē shuǐ
13寒号鸟 山脚|shān jiǎo,当作|dàng zuò,前面|qián miàn,晴朗|qíng lǎng,枯草|kū cǎo,正好|zhèng hǎo,清早|qīng zǎo,门第|mén dì,现在|xiàn zài,将来|jiāng lái,难过|nán guò,大雪纷飞|dà xuě fēn fēi,枝头|zhī tóu,道理|dào lǐ,阵风|zhèn fēng,忘却|wàng què
14我要的是葫芦 从前|cóng qián,细长|xì cháng,可爱|kě ài,每天|měi tiān,自言自语|zì yán zì yǔ,南瓜|nán guā,邻居|lín jū,奇怪|qí guài,一棵树|yī kē shù,感谢|gǎn xiè,几次|jǐ cì,心想|xīn xiǎng,盯着|dīng zhe,好呢|hǎo ne,治病|zhì bìng
15八角楼上 八角楼|bā jiǎo lóu,深夜|shēn yè,星星之火|xīng xing zhī huǒ,沉思|chén sī,胜利|shèng lì,年代|nián dài,披着|pī zhe,轻轻|qīng qīng
16朱德的扁担 扁担|biǎn dàn,同志|tóng zhì,带领|dài lǐng,队伍|duì wǔ,会师|huì shī,红军|hóng jūn,来回|lái huí,战士|zhàn shì,白天|bái tiān,起来|qǐ lái
17难忘的泼水节 难忘|nán wàng,泼水节|pō shuǐ jié,一年一度|yì nián yí dù,四面八方|sì miàn bā fāng,龙船|lóng chuán,花炮|huā pào,欢呼|huān hū,人群|rén qún,欢乐|huān lè,开始|kāi shǐ,柏树枝|bǎi shù zhī,多么|duō me,身穿|shēn chuān,开始|kāi shǐ,口令|kǒu lìng
18刘胡兰 年轻|nián qīng,北风|běi fēng,刘胡兰|liú hú lán,反动|fǎn dòng,农村|nóng cūn,关在|guān zài
19古诗二首 危楼|wēi lóu,不敢|bù gǎn,惊吓|jīng xià,阴天|yīn tiān,好似|hǎo sì,田野|tián yě,苍茫|cāng máng
20雾在哪里 孩子|hái zi,于是|yú shì,无论|wú lùn,船只|chuán zhī,远方|yuǎn fāng,连同|lián tóng,岸边|àn biān,同时|tóng shí,房屋|fáng wū,一切|yī qiè,不久|bù jiǔ,出现|chū xiàn,散步|sàn bù
21雪孩子 空地|kòng dì,唱歌|chàng gē,回家|huí jiā,赶快|gǎn kuài,旁边|páng biān,火星|huǒ xīng,连忙|lián máng,浑身|hún shēn,时候|shí hou,谢谢|xiè xie,水汽|shuǐ qì,兴旺|xīng wàng,是谁|shì shúi
22狐假虎威 食物|shí wù,身边|shēn biān,为什么|wèi shén me,爪子|zhuǎ zi,面前|miàn qián,神气活现|shén qì huó xiàn,野猪|yě zhū,往常|wǎng cháng,身后|shēn hòu,信以为真|xìn yǐ wéi zhēn,老天爷|lǎo tiān yé,就是|jiù shì
23纸船和风筝 纸船|zhǐ chuán,松果|sōng guǒ,纸条|zhǐ tiáo,可是|kě shì,但是|dàn shì,屋顶|wū dǐng,和好|hé hǎo,对折|duì zhé,张开|zhāng kāi,祝福|zhù fú,包扎|bāo zā,抓住|zhuā zhù,争吵|zhēng chǎo,哭泣|kū qì
24风娃娃 田野|tián yě,风车|fēng chē,飞快|fēi kuài,秧苗|yāng miáo,不住|bú zhù,点头|diǎn tóu,急忙|jí máng,广场|guǎng chǎng,伤心|shāng xīn,路边|lù biān,生气|shēng qì,得意|dé yì,流汗|liú hàn,棉被|mián bèi
`

make()

function make() {
  const printable = document.querySelector('#printable')
  document.querySelector('#printable').innerHTML = ''
  document.querySelector('#screen').innerHTML = ''

  dictionary.trim().split('\n').forEach((line) => {
    let article = sampleArticle.cloneNode(false)

    // 1小蝌蚪找妈妈 看见|kàn jiàn,哪里|nǎ lǐ,那边|nà bian,头顶|tóu dǐng
    const title = line.split(' ')[0]
    const text = title.replace(/^(\d+)/, '$1. ')
    const h2 = sampleH2.cloneNode(true)
    h2.querySelector('span').innerText = text
    article.appendChild(h2)

    line.replace(title, '').trim()
      .split(',')
      .forEach((word) => {
        const [text, pinyin] = word.split('|')
        const chars = text.split('')
        const pinyinArr = pinyin.split(' ')

        const wordElement = sampleWord.cloneNode()
        for (let i = 0; i < chars.length; i++) {
          const box = sampleBox.cloneNode(true)
          // box.querySelector('.char').innerText = chars[i]
          box.querySelector('.pinyin').innerText = pinyinArr[i]

          // if (isQingyin(pinyinArr[i])) {
          //   box.classList.add('qingyin')
          // }

          wordElement.appendChild(box)
        }

        article.appendChild(wordElement)
      })

      printable.appendChild(article)
  })

  printable.classList.remove('hidden')
  // layoutScreen()
}

function isQingyin(pinyin) {
  return !'āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ'.split('').some((char) => pinyin.includes(char))
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

// function layoutScreen() {
// const rowsPerSheet = 9
// const maxColumns = 8
//   const screen = document.querySelector('#screen')

//   const sheetHeight = screen.offsetHeight * 0.9
//   const boxSize = (sheetHeight + 0.0) / rowsPerSheet - 2
//   document.documentElement.style.setProperty('--box-size', `${boxSize}px`)

//   let sheet
//   let filledRows = 0
//   const sheetHtml = `<div class="sheet w-1/2 flex-col mx-auto"></div>`

//   screen.innerHTML = ''
//   document.querySelectorAll('#printable .row').forEach((row, idx) => {
//     const boxes = row.querySelectorAll('.box')
//     const rows = Math.ceil(boxes.length / maxColumns)
//     if (filledRows + rows < rowsPerSheet) {
//       filledRows += rows
//     }

//     if (idx % rowsPerSheet === 0) {
//       sheet = htmlToElement(sheetHtml)
//       screen.appendChild(sheet)
//     }

//     sheet.appendChild(row.cloneNode(true))
//   })
// }
