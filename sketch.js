/************************************************
 * Futuristic Blade Runner City
 * Более проработанная версия иллюстрации
 * с несколькими слоями города (параллакс),
 * летающими машинами, дождём и неоновыми вывесками.
 ************************************************/

// Параметры сцены
let WIDTH = 800;
let HEIGHT = 600;

// Массив слоёв города (для эффекта параллакса)
let cityLayers = [];

// Массив летающих объектов
let flyingCars = [];

// Массив капель дождя
let raindrops = [];

// Неоновая вывеска (пример класса вывески)
let neonSign;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  // Инициализируем слои города: от дальнего к ближнему
  // Чем дальше слой, тем ниже контраст/цвет и ниже скорость параллакса
  cityLayers.push(new CityLayer( 50,  20, color(70),    0.2));  // Самый дальний слой
  cityLayers.push(new CityLayer(200, 15, color(50),    0.4));
  cityLayers.push(new CityLayer(350, 10, color(30),    0.6));   // Средний слой
  cityLayers.push(new CityLayer(450,  8, color(20),    0.8));   // Ближний слой

  // Инициализация летающих машин (дронов)
  for (let i = 0; i < 6; i++) {
    flyingCars.push(new FlyingCar());
  }

  // Инициализируем дождь
  for (let i = 0; i < 300; i++) {
    raindrops.push(new RainDrop());
  }

  // Пример неоновой вывески
  neonSign = new NeonSign("BLADE CITY", width / 2, height / 4);
}

function draw() {
  background(10, 10, 30); // Тёмное "неоновое" небо

  // Сначала можно нарисовать градиент, имитирующий закат или "туман"
  drawSkyGradient();

  // Дальний (фоновые) слои города
  for (let layer of cityLayers) {
    layer.draw();
  }

  // Рисуем дождь (между слоями и перед машинами)
  for (let drop of raindrops) {
    drop.update();
    drop.draw();
  }

  // Летающие машины (на переднем плане)
  for (let car of flyingCars) {
    car.update();
    car.draw();
  }

  // Неоновая вывеска
  neonSign.update();
  neonSign.draw();
}

/* ----------------------------------------------
   Класс "CityLayer"
   - хранит набор зданий
   - имеет фактор параллакса
   ---------------------------------------------- */

class CityLayer {
  constructor(baseY, buildingCount, baseColor, parallaxFactor) {
    this.baseY = baseY;             // Средняя "линия" горизонта для слоя
    this.buildingCount = buildingCount;
    this.baseColor = baseColor;
    this.parallaxFactor = parallaxFactor;
    this.buildings = [];

    // Генерируем здания в данном слое
    this.generateBuildings();
  }

  generateBuildings() {
    let totalWidth = 0;

    for (let i = 0; i < this.buildingCount; i++) {
      // Случайная ширина и высота
      let w = random(50, 120);
      let h = random(100, 350);

      // Позиция по X — складываем ширину, чтобы расположить здания вплотную (примерно)
      let x = totalWidth;
      totalWidth += w + random(10, 30);

      // Рандомная плотность окон
      let cols = floor(random(3, 6));
      let rows = floor(random(4, 10));

      // Цвет окон
      let windowColor = color(random(100, 255), random(100, 255), random(100, 255));

      let b = new Building(x, this.baseY - h, w, h, this.baseColor, cols, rows, windowColor);
      this.buildings.push(b);
    }
  }

  draw() {
    // Рассчитываем "движение" слоя по X
    // Чтобы был эффект параллакса, смещаем в зависимости от мыши или от frameCount
    // Ниже — простой вариант с привязкой к frameCount
    let offsetX = (frameCount * 0.5) * this.parallaxFactor; 
    offsetX = offsetX % width; // чтобы сдвиг "зацикливался"

    push();
    translate(-offsetX, 0); // смещаем на offsetX влево
    // Рисуем "повтор" слоя, чтобы заполнить весь холст
    // (рисуем дважды: основной блок и клон после него)

    for (let i = 0; i < 2; i++) {
      let shift = i * this.totalWidth();
      push();
      translate(shift, 0);
      for (let b of this.buildings) {
        b.draw();
      }
      pop();
    }
    pop();
  }

  // Вычислить общую ширину слоя (по сумме ширин зданий)
  totalWidth() {
    let tw = 0;
    for (let b of this.buildings) {
      tw += b.w + 20; // небольшие зазоры
    }
    return tw;
  }
}

/* ----------------------------------------------
   Класс "Building"
   - отдельное здание со своими окнами
   ---------------------------------------------- */
class Building {
  constructor(x, y, w, h, baseColor, cols, rows, windowColor) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.baseColor = baseColor;
    this.cols = cols;
    this.rows = rows;
    this.windowColor = windowColor;
  }

  draw() {
    // Тень (сдвиг)
    fill(red(this.baseColor)*0.3, green(this.baseColor)*0.3, blue(this.baseColor)*0.3);
    rect(this.x+5, this.y+5, this.w, this.h);

    // Основной прямоугольник здания
    fill(this.baseColor);
    rect(this.x, this.y, this.w, this.h);

    // Рисуем окна
    let windowWidth = this.w / this.cols;
    let windowHeight = this.h / this.rows;

    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        let wx = this.x + c * windowWidth + 2;
        let wy = this.y + r * windowHeight + 2;

        // Мерцание окон: некоторый процент окон "гаснет"
        let flicker = random(1) > 0.88; // ~12% шанс отключиться
        let cWin = flicker ? color(10, 10, 10) : this.windowColor;
        fill(cWin);
        rect(wx, wy, windowWidth - 4, windowHeight - 4);
      }
    }
  }
}

/* ----------------------------------------------
   Класс "FlyingCar"
   - летающая машина/дрон
   - двигается по горизонтали, затем возвращается
   ---------------------------------------------- */
class FlyingCar {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(-200, -50);
    this.y = random(50, height - 200);
    this.speed = random(2, 5);
    this.size = random(20, 35);
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 200);
  }

  update() {
    this.x += this.speed;
    if (this.x > width + 100) {
      // Перезапускаем машину слева
      this.reset();
    }
  }

  draw() {
    push();
    noStroke();
    fill(this.color);
    // Основное "тело" машины
    ellipse(this.x, this.y, this.size * 1.5, this.size);

    // Небольшая кабина или огни
    fill(255, 255, 255, 200);
    ellipse(this.x + this.size * 0.2, this.y, this.size * 0.4, this.size * 0.4);

    // Выхлоп/шлейф
    fill(red(this.color), green(this.color), blue(this.color), 50);
    ellipse(this.x - this.size * 0.8, this.y, this.size * 0.8, this.size * 0.3);
    pop();
  }
}

/* ----------------------------------------------
   Класс "RainDrop"
   - капля дождя, падает сверху вниз
   ---------------------------------------------- */
class RainDrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.speed = random(8, 15);
    this.len = random(10, 20);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.reset();
    }
  }

  draw() {
    stroke(150, 150, 255, 180);
    line(this.x, this.y, this.x, this.y + this.len);
  }
}

/* ----------------------------------------------
   Класс "NeonSign"
   - неоновая вывеска с мерцающей анимацией
   ---------------------------------------------- */
class NeonSign {
  constructor(txt, x, y) {
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.baseSize = 48;
    this.t = 0;
  }

  update() {
    // Анимация синусом для мерцания
    this.t += 0.1;
  }

  draw() {
    push();
    textAlign(CENTER, CENTER);
    let alphaVal = map(sin(this.t), -1, 1, 50, 255);
    let txtSize = this.baseSize + sin(this.t * 0.5) * 5; // небольшие колебания размера

    textSize(txtSize);
    fill(255, 60, 200, alphaVal);
    text(this.txt, this.x, this.y);
    pop();
  }
}

/* ----------------------------------------------
   Фоновый градиент неба (или тумана)
   ---------------------------------------------- */
function drawSkyGradient() {
  // Цвет вверху
  let topColor = color(10, 10, 30);
  // Цвет внизу
  let bottomColor = color(30, 10, 50);

  noFill();
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, i, width, i);
  }
}
