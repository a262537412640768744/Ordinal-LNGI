const FOUR_POW_64 = 4 ** 64
const FOUR_POW_256 = 4 ** 256
const LOG104 = Math.log10(4)
const ADD = Math.log2(257 / 256) / 4
const ADD_MUL16 = ADD * 16
const ADD_MUL256 = ADD * 256
const ADD_DIV16 = ADD / 16

const LEVEL_TABLE = [
    -Infinity, 0, 0.5, Math.log2(3) / 2,
    1, Math.log2(5) / 2, Math.log2(6) / 2, 
    Math.log2(7) / 2, 1.5, Math.log2(9) / 2, 
    Math.log2(10) / 2, Math.log2(11) / 2,
    Math.log2(12) / 2, Math.log2(13) / 2, 
    Math.log2(14) / 2, Math.log2(15) / 2,
    2, Math.log2(20) / 2, Math.log2(24) / 2, 
    Math.log2(28) / 2, 2.5, Math.log2(40) / 2, 
    Math.log2(48) / 2, Math.log2(56) / 2,
    3, Math.log2(80) / 2, Math.log2(96) / 2,
    Math.log2(112) / 2, 3.5, Math.log2(160) / 2, 
    Math.log2(192) / 2, Math.log2(224) / 2,
    4, 6, 8, 12, 16, 24, 32, 48, 
    64, 80, 96, 112, 128, 160, 192, 224,
    4 ** 4, 4 ** 6, 4 ** 8, 4 ** 12, 
    4 ** 16, 4 ** 24, 4 ** 32, 4 ** 48, 
    4 ** 64, 4 ** 80, 4 ** 96, 4 ** 112, 
    4 ** 128, 4 ** 160, 4 ** 192, 4 ** 224
]

function display_ord(ord, dep = 5) {
    if (!ord) {
        return
    }
    if (dep == 0) {
        return "..."
    }
    if (ord >= 4 ** 256) {
        return "ψ(Ω)..."
    }
    if (ord < 1) {
        return `${Math.floor(4 ** ord)}`
    }
    let exp = Math.floor(ord)
    let high_num = Math.log2(ord) / 2
    let high
    if (exp == 1) {
        high = `ω`
    } else {
        high = `ω<sup>${display_ord(high_num)}</sup>`
    }  
    if (exp > 256) {
        return `${high}...`
    }
    let mult_all = 4 ** (ord - exp)
    let mult = Math.floor(mult_all)
    let low
    if (exp > 64) {
        low = "..."
    } else {
        low = "+" + display_ord(
            ord + Math.log2(1 - mult / mult_all) / 2,
            dep - 1
        )
    }
    if (low == "+0") {
        low = ""
    }
    if (mult == 1) {
        return `${high}${low}`
    } else {
        return `${high}${mult}${low}`
    }
}

function display_number(num) {
    let exp_all = num * LOG104
    if (exp_all < 3) {
        return `${(4 ** num).toFixed(3)}`
    }
    if (exp_all < 9) {
        return `${Math.floor(4 ** num)}`
    }
    if (exp_all > 1000000000) {
        return "e" + display_number(
            Math.log2(exp_all) / 2)
    }
    let exp = Math.floor(exp_all)
    let mult = 10 ** (exp_all - exp)
    if (exp_all < 1000000) {
        return `${mult.toFixed(3)}e${exp}`
    } else {
        return `${Math.floor(mult)}e${exp}`
    }
}

function get_level_ord(num) {
    if (num < 64) {
        return display_ord(LEVEL_TABLE[num])
    } else if (num == 64) {
        return "ψ(Ω)..."
    } else {
        return "ψ(Ω+ψ(Ω)...)..."
    }
}

let display = document.querySelectorAll("div")
let save = localStorage.getItem("Ordinal-LNGI")
let save_parse = save ? JSON.parse(save) : {n: -65536}
let n = save_parse.n
display[1].style = "color: #ffaa00;"
display[2].style = "color: #ffaa00;"
setInterval(() => {
    localStorage.setItem("Ordinal-LNGI", JSON.stringify({n: n}))
    display[0].innerHTML = display_ord(n)
    if (n < 0) {
        n = 0
    } else if (n < 4) {
        n += Math.log2(1 + (1 / 4) ** n) / 4
    } else if (n < 16) {
        n += ADD
    } else if (n < 64) {
        n += n * ADD_DIV16
    } else if (n < 4294967296) {
        n += n * ADD
    } else if (n < FOUR_POW_64) {
        n += n * ADD_MUL16
    } else if (n < FOUR_POW_256) {
        n += n * ADD_MUL256
    }
    if (n >= 4) {
        display[3].style = "color: #ffaa00;"
        display[4].style = "color: #ffaa00;"
        display[4].innerHTML = 
            "奖励：序数增加里程碑0的效果(×" + 
            display_number(n - 4) + ")"
    }
    if (n >= 16) {
        display[5].style = "color: #ffaa00;"
        display[6].style = "color: #ffaa00;"
        display[6].innerHTML = 
            "奖励：序数增加时间速度(×" + 
            display_number(
                Math.log2(n) / 2 - 2
            ) + ")"
    }
    if (n >= 64) {
        display[7].style = "color: #ffaa00;"
        display[8].style = "color: #ffaa00;"
        display[8].innerHTML = 
            "奖励：增加额外时间速度(×16)"
    }
    if (n >= 256) {
        display[9].style = "color: #ffaa00;"
        display[10].style = "color: #ffaa00;"
        let level = 0
        for (; level < 64;) {
            if (n >= LEVEL_TABLE[level]) {
                level++
            } else {
                break
            }
        }
        display[15].innerHTML = `序数等级：${level}，` +
            `下一级：${get_level_ord(level)}`
    }
    if (n >= 4294967296) {
        display[11].style = "color: #ffaa00;"
        display[12].style = "color: #ffaa00;"
        display[12].innerHTML = 
            "奖励：增加额外时间速度(×16)"
    }
    if (n >= FOUR_POW_64) {
        display[13].style = "color: #ffaa00;"
        display[14].style = "color: #ffaa00;"
        display[14].innerHTML = 
            "奖励：增加额外时间速度(×16)"
    }
    if (n >= FOUR_POW_256) {
        display[16].innerHTML = 
            "在序数等级达到64时，序数将达到硬上限"
    }


}, 25)