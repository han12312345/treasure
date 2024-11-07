// 图片资源URLs
const explorerImageSrc = 'explorer.png';
const libraryImageSrc = 'library.png';
const templeImageSrc = 'temple.png';
const guardImageSrc = 'guard.png';
const blackPearlImageSrc = 'blackPearl.png';

// 图片对象
let explorerImage = new Image();
let libraryImage = new Image();
let templeImage = new Image();
let guardImage = new Image();
let blackPearlImage = new Image();

// 初始化图片对象
explorerImage.src = explorerImageSrc;
libraryImage.src = libraryImageSrc;
templeImage.src = templeImageSrc;
guardImage.src = guardImageSrc;
blackPearlImage.src = blackPearlImageSrc;

// 确保图片加载完成后再开始游戏
window.onload = function () {
    document.getElementById('start-btn').addEventListener('click', startGame);
};



class TreasureMap {
    static async getInitialClue() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("在图书馆里找到了一个线索...");
            }, 1000);
        });
    }

    static async decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!");
                }
                resolve("解码成功!有一把钥匙，宝藏在一座古老的神庙中...");
            }, 1500);
        });
    }
}

// 设置图书馆、神庙、探险者和守卫的初始位置
const library = { x: 100, y: 100, radius: 10 };
const temple = { x: 500, y: 500, radius: 20 };
let explorer = { x: 0, y: 0, radius: 10 };
let guard = { x: 150, y: 150, radius: 10 };
// 定义黑珍珠号的位置
const blackPearl = { x: 600, y: 100, radius: 15 };
const gridSize = 700;
let gameRunning = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = gridSize;
canvas.height = gridSize;

function drawCircle(position, color) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLibrary() {
    const imageSize = library.radius * 9;
    ctx.drawImage(libraryImage, library.x - imageSize / 2, library.y - imageSize / 2, imageSize, imageSize);
    ctx.font = '24px Arial'; // 设置字体大小为24px
    ctx.fillStyle = 'black';
    ctx.fillText('图书馆', library.x - 40, library.y + 10); // 更新文本位置以适应图片大小
}

// 绘制神庙的函数
function drawTemple() {
    const imageSize = temple.radius * 7;
    ctx.drawImage(templeImage, temple.x - imageSize / 2, temple.y - imageSize / 2, imageSize, imageSize);
    ctx.font = '24px Arial'; // 设置字体大小为24px
    ctx.fillStyle = 'black';
    ctx.fillText('神庙', temple.x - 40, temple.y + 10); // 更新文本位置以适应图片大小
}

function drawExplorer() {
    // 假设图片的大小是半径的两倍
    const imageSize = explorer.radius * 6;
    ctx.drawImage(explorerImage, explorer.x - imageSize / 2, explorer.y - imageSize / 2, imageSize, imageSize);
}

// 绘制守卫的函数
function drawGuard() {
    const imageSize = guard.radius * 6;
    ctx.drawImage(guardImage, guard.x - imageSize / 2, guard.y - imageSize / 2, imageSize, imageSize);
}

// 绘制黑珍珠号的函数，增加文字“黑珍珠号”
function drawBlackPearl() {
    const imageSize = blackPearl.radius * 8;
    ctx.drawImage(blackPearlImage, blackPearl.x - imageSize / 2, blackPearl.y - imageSize / 2, imageSize, imageSize);
    ctx.font = '24px Arial'; // 设置字体大小为24px
    ctx.fillStyle = 'black'; // 设置字体颜色
    ctx.fillText('黑珍珠号', blackPearl.x - 50, blackPearl.y + 30); // 在黑珍珠号图片上方绘制文字
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCollisionWith(position1, position2) {
    const dx = position1.x - position2.x;
    const dy = position1.y - position2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadii = position1.radius + position2.radius;
    return distance <= combinedRadii;
}

function displayMessage(message) {
    console.log(message);
}

function drawMessage(message) {
    ctx.font = '28px Arial'; // 设置字体大小为36px
    ctx.fillStyle = 'darkred'; // 设置字体颜色为深红色
    const metrics = ctx.measureText(message); // 获取文本的度量信息
    const textWidth = metrics.width; // 文本的宽度
    const textHeight = parseInt(ctx.font); // 文本的高度（基于字体大小）

    // 计算文本在画布上的水平居中位置
    const x = (canvas.width / 2) - (textWidth / 2);
    // 计算文本在画布底部的垂直位置
    const y = canvas.height - (textHeight / 2);

    ctx.fillText(message, x, y); // 在画布上绘制居中的文本
}


function draw() {
    clearCanvas();
    drawLibrary();
    drawTemple();
    drawExplorer();
    // 绘制黑珍珠号
    drawBlackPearl();
    if (guardActive) {
        drawGuard();
    }
    // 假设有一个变量来存储当前需要显示的消息
    if (currentMessage) {
        drawMessage(currentMessage);
    }
}

document.getElementById('start-btn').addEventListener('click', function () {
    if (!gameRunning) {
        startGame();
    }
});

let guardActive = false;
let currentMessage = "";



// 显示消息序列的异步函数
async function displayMessageSequence(messages) {
    for (const message of messages) {
        currentMessage = message;
        draw(); // 重新绘制所有元素，包括文字
        await new Promise(resolve => setTimeout(resolve, 2000)); // 等待3秒
    }
}

// 改变路径到黑珍珠号的异步函数
async function changePathToBlackPearl() {
    // 更新探险者的目标位置为黑珍珠号
    explorer.target = blackPearl;

    // 移动探险者到黑珍珠号
    while (!checkCollisionWithBlackPearl()) {
        moveExplorerToBlackPearl();
        draw(); // 重新绘制所有元素，包括文字
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 决定探险者的命运
    let fate = Math.random() > 0.5 ? 'success' : 'failure';
    if (fate === 'success') {
        currentMessage = "顺利找到黑珍珠号的位置，成功找到宝藏";
    } else {
        currentMessage = "找到位置，却被海浪掀翻，沉没海底，游戏结束";
    }
    draw(); // 重新绘制所有元素，包括文字
}

function moveExplorerTo(target) {
    const stepSize = 10;
    const maxDeviation = 20; // 最大偏移量
    let deviationX = 0; // 初始水平偏移量
    let deviationY = 0; // 初始垂直偏移量

    // 如果探险者已经到达图书馆，则在前往神庙的途中添加随机偏移
    if (checkCollisionWith(explorer, library)) {
        deviationX = (Math.random() * 2 - 1) * maxDeviation; // 随机水平偏移量
        deviationY = (Math.random() * 2 - 1) * maxDeviation; // 随机垂直偏移量
    }

    // 确保探险者不会偏离目标太远
    deviationX = Math.min(Math.max(deviationX, -maxDeviation), maxDeviation);
    deviationY = Math.min(Math.max(deviationY, -maxDeviation), maxDeviation);

    // 更新探险者的位置
    explorer.x = Math.min(Math.max(explorer.x + stepSize + deviationX, 0), gridSize - explorer.radius);
    explorer.y = Math.min(Math.max(explorer.y + stepSize + deviationY, 0), gridSize - explorer.radius);
}

// 更新探险者位置的函数，使其前往黑珍珠号
function moveExplorerToBlackPearl() {
    const stepSize = 10;
    const targetX = blackPearl.x;
    const targetY = blackPearl.y;

    // 简单的直线移动逻辑
    if (explorer.x < targetX) {
        explorer.x += stepSize;
    } else if (explorer.x > targetX) {
        explorer.x -= stepSize;
    }

    if (explorer.y < targetY) {
        explorer.y += stepSize;
    } else if (explorer.y > targetY) {
        explorer.y -= stepSize;
    }
}

// 检查探险者是否到达黑珍珠号
function checkCollisionWithBlackPearl() {
    return checkCollisionWith(explorer, blackPearl);
}

function moveGuardAroundTemple() {
    // 守卫的移动逻辑保持不变，但是只有在 guardActive 为 true 时才会移动
    if (guardActive) {
        const directions = ['up', 'down', 'left', 'right'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const moveDistance = guard.radius * 3; // 守卫的移动距离

        switch (direction) {
            case 'up':
                guard.y = Math.max(guard.radius, guard.y - moveDistance);
                break;
            case 'down':
                guard.y = Math.min(gridSize - guard.radius, guard.y + moveDistance);
                break;
            case 'left':
                guard.x = Math.max(guard.radius, guard.x - moveDistance);
                break;
            case 'right':
                guard.x = Math.min(gridSize - guard.radius, guard.x + moveDistance);
                break;
        }
    }
}



function startGame() {
    gameRunning = true;
    // 探险者前往图书馆
    (async function exploreToLibrary() {
        try {
            let currentGoal = 1; // 初始目标为1，表示探险者需要到达图书馆
            while (!checkCollisionWith(explorer, library)) {
                moveExplorerTo(library);
                draw();
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 在图书馆找到线索
            currentMessage = await TreasureMap.getInitialClue();
            draw(); // 重新绘制所有元素，包括文字
            // 解码线索
            currentMessage = await TreasureMap.decodeAncientScript(currentMessage);
            draw(); // 重新绘制所有元素，包括文字

            // 探险者前往神庙，激活守卫
            guardActive = true;

            while (!checkCollisionWith(explorer, guard) && !checkCollisionWith(explorer, temple)) {
                if (!gameRunning) return;
                if (guardActive) {
                    moveGuardAroundTemple();
                }
                moveExplorerTo(temple);
                draw(); // 重新绘制所有元素，包括文字
                await new Promise(resolve => setTimeout(resolve, 500));
                currentGoal++; // 到达神庙后，更新目标为2
            }

            // 停止游戏和角色移动
            gameRunning = false;
            guardActive = false;

            if (checkCollisionWith(explorer, guard)) {
                currentMessage = "糟糕，遇到了神庙守卫，游戏结束。";
                draw();
            } else if (checkCollisionWith(explorer, temple)) {
                await displayMessageSequence([
                    "找到了一个神秘的箱子...",
                    "用钥匙将锁打开后发现一张地图",
                    "上面有着前往遗失的文明：黑珍珠号的地图，还有一个圣杯",
                    "黑珍珠号有历代海盗抢来的珍宝，只有圣杯才可以打开它",
                    "于是探险者冒着风雨前往黑珍珠号..."
                ]);

                // 显示消息序列完成后，改变路径到黑珍珠号
                await changePathToBlackPearl();
            }
        } catch (error) {
            console.error("游戏过程中发生错误：", error);
        }
    })();
}

// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', function () {
    if (!gameRunning) {
        startGame();
    }
});
