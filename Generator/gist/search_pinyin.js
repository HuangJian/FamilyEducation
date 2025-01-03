const fs = require('fs')

const dict = {}
const mergedWords = []

// download from https://www.mdbg.net/chinese/dictionary?page=cc-cedict
fs.readFile('./data/cedict_pinyin.u8', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    data.split('\n').forEach((line, idx) => {
        if (idx % 10000 === 0) {
            console.log('proceeded lines = ', idx, new Date())
        }
        if (line.startsWith('#')) { // skip the lines starting with #
            return null
        }

        const arr = line.split('|')
        dict[arr[0]] = arr[1]
    })

    // console.log(findPinyinForWord('纸船'))
    findPinyinForDictionary()
    console.log('merged words = ', mergedWords.join('\n'))
})

function findPinyinForWord(word) {
    let pinyin = dict[word]
    if (!pinyin && word.length > 0) {
        pinyin = word.split('').map(char => dict[char]).join(' ')
        mergedWords.push(`"${word} => ${pinyin}"`)
    }
    return pinyin
}

function findPinyinForDictionary() {
    const dictionary = `
    ---课文
    1 看见 哪里 那边 头顶 眼睛 雪白 肚皮 找到 两条 宽广 跳高
    2 天空 傍晚 人们 冬天 花朵 平常 江河 海洋 田地 工作 变化 北极 好坏 送给 带来
    3 办法 如果 已经 长大 四海为家 娃娃 只要 皮毛 那里 知识 它们 更加
    ---识字
    1 花园 石桥 队旗 铜号 红领巾 欢笑 到处 羊群
    2 杨树 树叶 枫树 松柏 木棉 水杉 化石 金桂 粗壮 梧桐 儿歌 六月 九牛一毛
    3 写字 丛林 深处 竹林 熊猫 朋友
    4 四季 农事 月光 辛苦 棉衣 吹风 化肥 连忙 归来 穿戴 辛苦
    ---课文
    4 一同 柱子 一边 到底 秤杆 力气 出来 船身 石头 地方 果然 称重 做饭 岁月 站立 画纸 条幅 另外
    5 评奖 时间 报纸 来不及 事情 坏事 好事 拿起 并非
    6 出国 今天 圆珠笔 开心 以前 还有 台灯 这时 阳光 电影 信封 一支笔 句子
    7 明亮 故事 头发 窗外 沉睡 沙沙作响 直尺 哄骗 首先 闭上 笑脸
    8 依靠 尽头 黄河 高层 日照 香炉 烟花 高挂 山川
    9 黄山 南部 那些 山顶 一动不动 云海 巨石 前方 每当 金光闪闪 它们 真好 座位 升旗 狗熊
    10 群山 树木 名胜古迹 中央 美丽 灯光 中午 展现 风光 台湾
    11 出产 水果 月份 山坡 枝叶 展开 五光十色 好客 老乡 城市 空气 水分 收下
    12 坐井观天 井沿 回答 口渴 大话 井口 无边无际 喝水
    13 山脚 当作 前面 晴朗 枯草 正好 清早 门第 现在 将来 难过 大雪纷飞 枝头 道理 阵风 忘却
    14 从前 细长 可爱 每天 自言自语 南瓜 邻居 奇怪 一棵树 感谢 几次 心想 盯着 好呢 治病
    15 八角楼 深夜 星星之火 沉思 胜利 年代 披着 轻轻
    16 扁担 同志 带领 队伍 会师 红军 来回 战士 白天 起来
    17 难忘 泼水节 一年一度 四面八方 龙船 花炮 欢呼 人群 欢乐 开始 柏树枝 多么 身穿 开始 口令
    18 年轻 北风 刘胡兰 反动 农村 关在
    19 危楼 不敢 惊吓 阴天 好似 田野 苍茫
    20 孩子 于是 无论 船只 远方 连同 岸边 同时 房屋 一切 不久 出现 散步
    21 空地 唱歌 回家 赶快 旁边 火星 连忙 浑身 时候 谢谢 水汽 兴旺 是谁
    22 食物 身边 为什么 爪子 面前 神气活现 野猪 往常 身后 信以为真 老天爷 就是
    23 纸船 松果 纸条 可是 但是 屋顶 和好 对折 张开 祝福 包扎 抓住 争吵 哭泣
    24 田野 风车 飞快 秧苗 不住 点头 急忙 广场 伤心 路边 生气 得意 流汗 棉被
    `
    dictionary.split('\n').forEach(line => {
        const matches = /^(\d+?) (.+)$/.exec(line.trim())
        if (matches) {
            const text = matches[2]
            const wordsWithPinyin = text.split(' ')
                .map(word => {
                    const pinyin = findPinyinForWord(word)
                    return `${word}|${pinyin ? pinyin : '∞'}`
                })
            console.log(matches[1], wordsWithPinyin.join(','))
        } else {
            console.log(line.trim())
        }
    })
}
