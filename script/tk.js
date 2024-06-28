let sketch = function (p) {
  let x_tk = 0;
  let speed_tk = 4;
  const initialSpeed_tk = 4;
  let acceleration_tk = 0.05;
  const cryptoNames_tk = [
    'STON',
    'GAMEE',
    'Tether',
    'Toncoin',
    'Notcoin',
    'PunkCity',
  ];
  let grassBlades_tk = [];
  let cryptoX_tk = 0; // // horizontal position of crypto names

  p.setup = function () {
    let container = document.getElementById('anime_tk');
    let canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('anime_tk');

    // build grass
    for (let i = 0; i < p.width; i += 5) {
      grassBlades_tk.push(
        new GrassBlade_tk(i, p.height - 50, p.random(20, 50))
      );
    }
  };

  p.draw = function () {
    let container = document.getElementById('anime_tk');
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);

    // gradient background
    let horizon = p.height / 2;
    setGradient_tk(
      0,
      0,
      p.width,
      horizon,
      p.color(135, 206, 235),
      p.color(135, 206, 235),
      'Y'
    ); // sky
    setGradient_tk(
      0,
      horizon,
      p.width,
      p.height - horizon,
      p.color(135, 206, 235),
      p.color(144, 238, 144),
      'Y'
    ); // earth

    // draw sun
    drawSun_tk();

    // draw chart
    p.stroke(0);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < p.width; i++) {
      let y = p.height / 2 + 30 * p.sin((p.TWO_PI * i) / 200);
      p.vertex(i, y);
    }
    p.endShape();

    // draw wheels
    let wheelYFront = p.height / 2 + 30 * p.sin((p.TWO_PI * (x_tk - 30)) / 200);
    let wheelYBack = p.height / 2 + 30 * p.sin((p.TWO_PI * (x_tk + 30)) / 200);

    // wheels movement
    let maxWheelMovement = 20; // max
    wheelYFront = p.constrain(
      wheelYFront,
      p.height / 2 - maxWheelMovement,
      p.height / 2 + maxWheelMovement
    );
    wheelYBack = p.constrain(
      wheelYBack,
      p.height / 2 - maxWheelMovement,
      p.height / 2 + maxWheelMovement
    );

    // draw car
    drawTruck_tk(wheelYFront, wheelYBack);

    // update position(x)
    x_tk += speed_tk;
    if (x_tk > p.width) {
      x_tk = 0;
      speed_tk = initialSpeed_tk; // set to initial speed
    }

    // draw grass
    drawGrass_tk();

    // draw crypto names
    drawCryptoNames_tk();
  };

  function drawTruck_tk(wheelYFront, wheelYBack) {
    // car body
    p.fill(0, 102, 204); // color
    p.rect(x_tk - 50, p.height / 2 - 50, 100, 40, 10); // main body
    p.rect(x_tk - 10, p.height / 2 - 70, 40, 40, 10); // cabin

    // windows
    p.fill(173, 216, 230, 150); // color
    p.rect(x_tk - 5, p.height / 2 - 65, 30, 20, 5);

    // wheels
    p.fill(0);
    p.ellipse(x_tk - 30, wheelYFront, 30, 30); // front
    p.ellipse(x_tk + 30, wheelYBack, 30, 30); // back

    // shock absorber
    p.stroke(0);
    p.strokeWeight(4);
    p.line(x_tk - 30, p.height / 2 - 20, x_tk - 30, wheelYFront); // front
    p.line(x_tk + 30, p.height / 2 - 20, x_tk + 30, wheelYBack); // back

    // lights
    p.fill(100);
    p.ellipse(x_tk - 45, p.height / 2 - 10, 10, 10); // front
    p.ellipse(x_tk + 45, p.height / 2 - 10, 10, 10); // back

    // battery
    p.fill(255, 255, 0); // color
    p.rect(x_tk - 40, p.height / 2 - 50, 20, 20); // position
  }

  function drawSun_tk() {
    let sunX = p.width - 50; // position (x)
    let sunY = 50; // position (y)
    let sunSize = 40; // size

    p.fill(255, 204, 0);
    p.noStroke();
    p.ellipse(sunX, sunY, sunSize, sunSize); // sun

    // rays
    p.stroke(255, 204, 0);
    p.strokeWeight(2);
    for (let i = 0; i < 360; i += 45) {
      let x1 = sunX + (sunSize / 2) * p.cos(p.radians(i));
      let y1 = sunY + (sunSize / 2) * p.sin(p.radians(i));
      let x2 = sunX + (sunSize / 2 + 10) * p.cos(p.radians(i));
      let y2 = sunY + (sunSize / 2 + 10) * p.sin(p.radians(i));
      p.line(x1, y1, x2, y2);
    }
  }

  function drawGrass_tk() {
    for (let blade of grassBlades_tk) {
      blade.update();
      blade.display();
    }
  }

  function drawCryptoNames_tk() {
    p.fill(0); // color
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);

    let yPosition = p.height - 30; // position (y)

    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < cryptoNames_tk.length; i++) {
        let xPosition =
          (cryptoX_tk +
            p.map(i, 0, cryptoNames_tk.length - 1, 0, p.width) +
            j * p.width) %
          (2 * p.width);

        p.text(cryptoNames_tk[i], xPosition, yPosition);
      }
    }

    // movement
    cryptoX_tk -= 2; // reduce speed
    if (cryptoX_tk < -p.width) {
      cryptoX_tk = 0;
    }
  }

  class GrassBlade_tk {
    constructor(x, y, height) {
      this.x = x;
      this.y = y;
      this.height = height;
      this.angle = p.random(-p.PI / 6, p.PI / 6);
    }

    update() {
      this.angle = (p.sin(p.frameCount / 20 + this.x / 50) * p.PI) / 6;
    }

    display() {
      p.stroke(34, 139, 34); // color
      p.strokeWeight(2);
      p.noFill();

      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.angle);
      p.line(0, 0, 0, -this.height);
      p.pop();
    }
  }

  function setGradient_tk(x, y, w, h, c1, c2, axis) {
    p.noFill();

    if (axis === 'Y') {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        let inter = p.map(i, y, y + h, 0, 1);
        let c = p.lerpColor(c1, c2, inter);
        p.stroke(c);
        p.line(x, i, x + w, i);
      }
    } else if (axis === 'X') {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        let inter = p.map(i, x, x + w, 0, 1);
        let c = p.lerpColor(c1, c2, inter);
        p.stroke(c);
        p.line(i, y, i, y + h);
      }
    }
  }

  p.windowResized = function () {
    let container = document.getElementById('anime_tk');
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);

    // redraw grass
    grassBlades_tk = [];
    for (let i = 0; i < p.width; i += 5) {
      grassBlades_tk.push(
        new GrassBlade_tk(i, p.height - 50, p.random(20, 50))
      );
    }
  };
};

new p5(sketch);
