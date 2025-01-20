/************************************************
 *  Пример иллюстрации футуристичного города
 *  c мерцающими огнями и движущимися объектами.
 *  (на основе p5.js)
 ************************************************/

// Массив зданий
let buildings = [];

// Массив летающих объектов (например, дронов/машин)
let flyingObjects = [];

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Инициализация зданий
  for (let i = 0; i < 15; i++) {
    let w = random(50, 100);
    let h = random(150, 400);
    let x = i * (width / 15);
    let y = height - h;
    buildings.push({
      x: x,
      y: y,
      w: w,
      h: h,
      cols: floor(random(3, 6)), 
      rows: floor(random(3, 8)), 
      color: color(random(100, 255), random(100, 255), random(100, 255)),
    });
  }

  // Инициализация летающих объектов
  for (let i = 0; i < 5; i++) {
    flyingObjects.push({
      x: random(width),
      y: random(height / 3),
      speed: random(1, 3),
      size: random(10, 20),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
}

function draw() {
  background(10, 10, 30); // Тёмное неоновое небо
  
  // Рисуем "дождь" или туман
  drawRainOrFog();

  // Рисуем здания
  drawBuildings();
  
  // Неоновые вывески
  drawNeonSigns();
  
  // Летающие объекты
  drawFlyingObjects();
}

function drawRainOrFog() {
  stroke(150, 150, 255, 20);
  for (let i = 0; i < 20; i++) {
    let rx = random(width);
    let ry = random(height);
    line(rx, ry, rx + random(-5, 5), ry + random(10, 30));
  }
  noStroke();
}

function drawBuildings() {
  for (let b of buildings) {
    // Тень
    fill(20);
    rect(b.x + 5, b.y + 5, b.w, b.h);

    // Здание
    fill(40);
    rect(b.x, b.y, b.w, b.h);

    // Окна
    let windowWidth = b.w / b.cols;
    let windowHeight = b.h / b.rows;
    for (let col = 0; col < b.cols; col++) {
      for (let row = 0; row < b.rows; row++) {
        let wx = b.x + col * windowWidth + 2;
        let wy = b.y + row * windowHeight + 2;

        // Мерцание
        let flicker = random(1) > 0.9; // 10% шанс отключиться
        let c = flicker ? color(10) : b.color;

        fill(c);
        rect(wx, wy, windowWidth - 4, windowHeight - 4);
      }
    }
  }
}

function drawNeonSigns() {
  push();
  textAlign(CENTER, CENTER);
  textSize(32);
  let alphaVal = map(sin(frameCount * 0.1), -1, 1, 50, 255);

  fill(255, 50, 150, alphaVal);
  text("NEON", width / 2, height / 4);

  fill(50, 255, 200, alphaVal);
  textSize(24);
  text("TECH", width / 2 + 100, height / 3);
  pop();
}

function drawFlyingObjects() {
  for (let obj of flyingObjects) {
    // Движение объектов слева направо
    obj.x += obj.speed;
    if (obj.x > width + 50) {
      obj.x = -50; // Возвращаем объект назад
    }

    fill(obj.color);
    ellipse(obj.x, obj.y, obj.size, obj.size / 2);

    // Шлейф
    fill(red(obj.color), green(obj.color), blue(obj.color), 50);
    ellipse(obj.x - obj.size, obj.y, obj.size / 1.5, obj.size / 3);
  }
}
