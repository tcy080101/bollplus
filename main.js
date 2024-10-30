// 设置画布  
const canvas = document.querySelector('canvas');  
const ctx = canvas.getContext('2d');  
const width = canvas.width = window.innerWidth;  
const height = canvas.height = window.innerHeight;  
  
// 生成随机数的函数  
function random(min, max) {  
  return Math.floor(Math.random() * (max - min + 1)) + min;  
}  
  
// 生成随机颜色值的函数  
function randomColor() {  
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;  
}  
  
// 定义通用的 Shape 构造器  
function Shape(x, y, color, size) {  
  this.x = x;  
  this.y = y;  
  this.color = color;  
  this.size = size;  
}  
  
Shape.prototype.draw = function() {};  
Shape.prototype.update = function() {};  
  
// 定义 Ball 构造器，继承自 Shape  
function Ball(x, y, velX, velY, color, size) {  
  Shape.call(this, x, y, color, size);  
  this.velX = velX;  
  this.velY = velY;  
}  
  
Ball.prototype = Object.create(Shape.prototype);  
Ball.prototype.constructor = Ball;  
  
Ball.prototype.draw = function() {  
  ctx.beginPath();  
  ctx.fillStyle = this.color;  
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  
  ctx.fill();  
};  
  
Ball.prototype.update = function() {  
  if (this.x + this.size > width || this.x - this.size < 0) {  
    this.velX = -this.velX;  
  }  
  if (this.y + this.size > height || this.y - this.size < 0) {  
    this.velY = -this.velY;  
  }  
  this.x += this.velX;  
  this.y += this.velY;  
};  
  
Ball.prototype.collisionDetect = function(devilCircle) {  
  const dx = this.x - devilCircle.x;  
  const dy = this.y - devilCircle.y;  
  const distance = Math.sqrt(dx * dx + dy * dy);  
  return distance < this.size + devilCircle.size;  
};  
  
// ... (前面的代码保持不变)  
  
// 定义 DevilCircle 构造器，继承自 Shape  
function DevilCircle(x, y, size) {  
  Shape.call(this, x, y, 'rgba(0, 0, 0, 0)', size); // 透明填充  
  this.borderColor = 'white';  
  this.velX = 0; // 初始速度  
  this.velY = 0; // 初始速度  
}  
  
DevilCircle.prototype = Object.create(Shape.prototype);  
DevilCircle.prototype.constructor = DevilCircle;  
  
DevilCircle.prototype.draw = function() {  
  ctx.beginPath();  
  ctx.strokeStyle = this.borderColor;  
  ctx.lineWidth = 2;  
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  
  ctx.stroke();  
};  
  
// 添加 update 方法以处理恶魔圈的位置更新  
DevilCircle.prototype.update = function() {  
  if (this.x + this.size > width || this.x - this.size < 0) {  
    this.velX = -this.velX;  
  }  
  if (this.y + this.size > height || this.y - this.size < 0) {  
    this.velY = -this.velY;  
  }  
  this.x += this.velX;  
  this.y += this.velY;  
};  
  
// 玩家控制  
let devilCircle = new DevilCircle(width / 2, height / 2, 50);  
let ballCount = 25;  
let score = 0;  
  
let keyPressed = {}; // 用于存储当前按下的键  
  
document.addEventListener('keydown', (e) => {  
  keyPressed[e.key] = true; // 按下键时存储  
});  
  
document.addEventListener('keyup', (e) => {  
  keyPressed[e.key] = false; // 释放键时清除  
});  
  
// 更新恶魔圈的速度  
function updateDevilCircleVelocity() {  
  if (keyPressed['ArrowLeft']) {  
    devilCircle.velX = -5;  
  } else if (keyPressed['ArrowRight']) {  
    devilCircle.velX = 5;  
  } else {  
    devilCircle.velX = 0;  
  }  
  
  if (keyPressed['ArrowUp']) {  
    devilCircle.velY = -5;  
  } else if (keyPressed['ArrowDown']) {  
    devilCircle.velY = 5;  
  } else {  
    devilCircle.velY = 0;  
  }  
}  
  
// 初始化球  
let balls = [];  
for (let i = 0; i < ballCount; i++) {  
  const size = random(10, 20);  
  balls.push(new Ball(  
    random(size, width - size),  
    random(size, height - size),  
    random(-7, 7),  
    random(-7, 7),  
    randomColor(),  
    size  
  ));  
}  
  
// 定义一个循环来不停地播放  
function loop() {  
  ctx.fillStyle = 'rgba(0,0,0,0.25)';  
  ctx.fillRect(0, 0, width, height);  
  
  updateDevilCircleVelocity(); // 更新恶魔圈的速度  
  devilCircle.update(); // 更新恶魔圈的位置  
  devilCircle.draw();  
  
  for (let i = balls.length - 1; i >= 0; i--) {  
    balls[i].draw();  
    balls[i].update();  
  
    if (balls[i].collisionDetect(devilCircle)) {  
      balls.splice(i, 1); // 移除被吃掉的球  
      score++;  
    }  
  }  
  
  // 显示剩余球数和得分  
  ctx.fillStyle = 'white';  
  ctx.font = '20px Arial';  
  ctx.fillText(`Balls Left: ${balls.length}`, 10, 30);  
  ctx.fillText(`Score: ${score}`, width - 150, 30);  
  
  requestAnimationFrame(loop);  
}  
  
loop();