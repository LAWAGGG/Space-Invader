let board = document.getElementById("board")
let player = document.getElementById("player")
let score = document.getElementById("score")
let playerArea = document.getElementById("playerArea")
let btnPause = document.getElementById("btnPause")
let game = document.getElementById("game")
let btnPlay = document.getElementById("btnPlay")
let instructionModal = document.getElementById("instructionModal")

let grid = []
let rowCount = 5
let colCount = 11
let scoreCount = 0
let isPaused = false

btnPause.addEventListener("click", () => {
    isPaused = isPaused == true ? false : true
})
btnPlay.addEventListener("click",()=>{
    instructionModal.classList.add("hide")
})

for(let i=0;i<rowCount;i++){
    for(let j =0; j<colCount;j++){
        let star = document.createElement("div")
        star.className = "star"
        star.style.top = 160 * i + 40 + "px"
        star.style.left = 135 * j + 60 + "px"

        if(j % 2 == 0 && i % 2 ==1) star.style.display = "none"
        if(j % 2 == 1 && i % 2 == 0) star.style.display = "none"

        game.appendChild(star)
    }
}

for (let i = 0; i < rowCount; i++) {
    let col = []
    let rowEl = document.createElement("div")
    rowEl.className = "row"

    for (let j = 0; j < colCount; j++) {
        let enemy = document.createElement("div")
        enemy.style.top = 30 * i + 50 + "px"
        enemy.style.left = 50 * j + 130 + "px"
        enemy.className = "enemy two"

        if (i > 2) enemy.className = "enemy one"

        let enemykData = {
            row: i,
            col: j,
            enemy: enemy
        }

        rowEl.append(enemy)
        col.push(enemykData)
    }

    board.append(rowEl)
    grid.push(col)
}

function startShooting() {
    isShoot = true
    let bulletEl = document.createElement("div")
    bulletEl.className = "bullet"
    bulletEl.style.top = player.offsetTop - 30 + "px"
    bulletEl.style.left = player.offsetLeft - 5 + "px"

    board.append(bulletEl)
}

function isCollide(obj1, obj2) {
    if (obj1.offsetTop < obj2.offsetTop + obj2.offsetHeight &&
        obj1.offsetTop + obj1.offsetHeight > obj2.offsetTop &&
        obj1.offsetLeft < obj2.offsetLeft + obj2.offsetWidth &&
        obj1.offsetLeft + obj1.offsetWidth > obj2.offsetLeft
    ) {
        return true
    } else return false
}

let playerX = 0
let isShoot = false

const playerMove = setInterval(() => {
    if (isPaused) return

    let playerMoveX = player.offsetLeft + playerX

    if (playerMoveX < 20) playerMoveX = 20
    if (playerMoveX >= board.offsetWidth - 20) playerMoveX = board.offsetWidth - player.offsetWidth + 20
    player.style.left = playerMoveX + "px"
}, 10)

const bulletMove = setInterval(() => {
    if (isPaused) return
    let bulletY = -5

    if (isShoot) {
        let bullet = document.querySelector(".bullet")
        bullet.style.top = bullet.offsetTop + bulletY + "px"

        if (bullet.offsetTop < 0) {
            bullet.remove()
            isShoot = false
        }

        let enemies = document.querySelectorAll(".enemy")

        enemies.forEach(enemy => {
            if (isCollide(bullet, enemy)) {
                enemy.remove()
                bullet.remove()
                isShoot = false

                scoreCount += 10
                score.innerText = scoreCount
            }
        })
    }
}, 5)

let enemyX = -5
const enemyMove = setInterval(() => {
    if (isPaused) return
    let isHitRight = false
    let isHitLeft = false
    let enemies = document.querySelectorAll(".enemy")

    if (enemies.length == 0) {
        alert("game over")
        clearInterval(enemyMove)
        clearInterval(playerMove)
        clearInterval(bulletMove)
        window.location.reload()
    }

    enemies.forEach(enemy => {
        if (enemy.offsetLeft < 0) {
            isHitLeft = true
        }

        if (enemy.offsetLeft + enemy.offsetWidth > board.offsetWidth) {
            isHitRight = true
        }

        if (isCollide(enemy, player)) {
            alert("game over")
            clearInterval(enemyMove)
            clearInterval(playerMove)
            clearInterval(bulletMove)
            window.location.reload()
        }

        if (enemy.offsetTop + enemy.offsetHeight > board.offsetHeight) {
            alert("game over")
            clearInterval(enemyMove)
            clearInterval(playerMove)
            clearInterval(bulletMove)
            window.location.reload()
        }
    })

    if (isHitLeft || isHitRight) {
        enemyX *= -1
    }

    enemies.forEach(enemy => {
        enemy.style.left = enemy.offsetLeft + enemyX + "px"
        if (isHitLeft || isHitRight) {
            enemy.style.top = enemy.offsetTop + 10 + "px"
        }
    })
}, 80)

let isFrame1 = true
function changeSkin() {
    if (isPaused) return
    isFrame1 = isFrame1 == true ? false : true
    let frame = isFrame1 ? 1 : 2
    document.querySelectorAll(".enemy").forEach(enemy => {
        if (enemy.classList.contains("one")) {
            enemy.style.backgroundImage = `url('Sprite/alien\ ${frame}.png')`
        } else if (enemy.classList.contains("two")) {
            enemy.style.backgroundImage = `url('Sprite/alienn\ ${frame}.png')`
        }
    })
}

const enemyFrame = setInterval(() => changeSkin(), 1000);

document.addEventListener("keydown", (e) => {
    if (isPaused) return
    if (e.key == "a") playerX = -5
    if (e.key == "d") playerX = 5
    if (e.key == " " && !isShoot) startShooting()
})

document.addEventListener("keyup", (e) => {
    if (e.key == "a") playerX = 0
    if (e.key == "d") playerX = 0
})
