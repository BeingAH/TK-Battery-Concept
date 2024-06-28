let x = 0;
let y = 0;
let angle = 0;
let speed = 2;
const initialSpeed = 2;
let acceleration = 0.05;
const cryptoNames = ['BNB', 'Bitcoin', 'Ethereum', 'Solana', 'TRON'];
let grassBlades = [];
let cryptoX = 0; // crypto names position (x)

function setup() {
  let container = document.getElementById('anime_other');
  let canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent('anime_other');

  // build grass
  for (let i = 0; i < width; i += 5) {
    // decrease height
    grassBlades.push(new GrassBlade(i, height - 50, random(20, 50)));
  }
}

function draw() {
  let container = document.getElementById('anime_other');
  resizeCanvas(container.offsetWidth, container.offsetHeight);

  // gradient background
  let horizon = height / 2; // chart position (x)
  setGradient(
    0,
    0,
    width,
    horizon,
    color(135, 206, 235),
    color(135, 206, 235),
    'Y'
  ); // sky
  setGradient(
    0,
    horizon,
    width,
    height - horizon,
    color(135, 206, 235),
    color(144, 238, 144),
    'Y'
  ); // earth

  // draw sun
  drawSun();

  // draw chart
  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < width; i++) {
    let y = height / 2 + 30 * sin((TWO_PI * i) / 200);
    vertex(i, y);
  }
  endShape();

  // car position
  let prevY = y;
  y = height / 2 + 30 * sin((TWO_PI * x) / 200);
  angle = atan(cos((TWO_PI * x) / 200));

  // changing the speed of the car based on the position on the chart
  if (y > prevY) {
    speed += acceleration; // increase speed when going downhill
  } else {
    speed -= acceleration; // slow down when going uphill
  }

  // cruise control
  speed = constrain(speed, 1, 5);

  // draw car
  push();
  translate(x, y);
  rotate(angle);
  drawTruck();
  pop();

  // update position (x)
  x += speed;
  if (x > width) {
    x = 0;
    speed = initialSpeed; // set to initial speed
  }

  // draw grass
  drawGrass();

  // draw crypto names
  drawCryptoNames();
}

function drawTruck() {
  // car body
  fill(255, 0, 0); // color
  rect(-50, -20, 100, 40, 10); // main body
  rect(0, -40, 40, 40, 10); // cabin

  // windows
  fill(173, 216, 230, 150); // color
  rect(5, -35, 30, 20, 5); // front

  // wheels
  fill(0);
  ellipse(-30, 20, 30, 30); // front
  ellipse(30, 20, 30, 30); // back

  // lights
  fill(100);
  ellipse(-45, -10, 10, 10); // front
  ellipse(45, -10, 10, 10); // back
}

function drawSun() {
  let sunX = width - 50; // position (x)
  let sunY = 50; // position (y)
  let sunSize = 40; // size

  fill(255, 204, 0); // color
  noStroke();
  ellipse(sunX, sunY, sunSize, sunSize); // sun

  // rays
  stroke(255, 204, 0);
  strokeWeight(2);
  for (let i = 0; i < 360; i += 45) {
    let x1 = sunX + (sunSize / 2) * cos(radians(i));
    let y1 = sunY + (sunSize / 2) * sin(radians(i));
    let x2 = sunX + (sunSize / 2 + 10) * cos(radians(i));
    let y2 = sunY + (sunSize / 2 + 10) * sin(radians(i));
    line(x1, y1, x2, y2);
  }
}

function drawGrass() {
  for (let blade of grassBlades) {
    blade.update();
    blade.display();
  }
}

function drawCryptoNames() {
  fill(0); // color
  textSize(16);
  textAlign(CENTER, CENTER);

  let yPosition = height - 30; // position (y)

  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < cryptoNames.length; i++) {
      let xPosition =
        (cryptoX + map(i, 0, cryptoNames.length - 1, 0, width) + j * width) %
        (2 * width);
      text(cryptoNames[i], xPosition, yPosition);
    }
  }

  // movement
  cryptoX -= 2; // reduce speed
  if (cryptoX < -width) {
    cryptoX = 0;
  }
}

class GrassBlade {
  constructor(x, y, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.angle = random(-PI / 6, PI / 6);
  }

  update() {
    this.angle = (sin(frameCount / 20 + this.x / 50) * PI) / 6;
  }

  display() {
    stroke(34, 139, 34); // color
    strokeWeight(2);
    noFill();

    push();
    translate(this.x, this.y);
    rotate(this.angle);
    line(0, 0, 0, -this.height);
    pop();
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === 'Y') {
    // top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 'X') {
    // left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function windowResized() {
  let container = document.getElementById('anime_other');
  resizeCanvas(container.offsetWidth, container.offsetHeight);

  // redraw grass
  grassBlades = [];
  for (let i = 0; i < width; i += 5) {
    grassBlades.push(new GrassBlade(i, height - 50, random(20, 50)));
  }
}
