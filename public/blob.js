class Blob {

  constructor(x, y, r, hasColor) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);
    if (hasColor) {
      this.red = random(75, 255);
      this.g = random(75, 255);
      this.b = random(75, 255);
    }
    this.hasColor = hasColor;
  }

  update() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    // mouse inside it , stop;
    const mag = 7 - this.r * this.r * 0.0001;
    newvel.setMag(mag);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  }

  eats(other) {
    const d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r) {
      const sum = PI * this.r * this.r + PI * other.r * other.r;
      this.r = sqrt(sum / PI);
      return true;
    }
    return false;
  }

  show() {
    this.hasColor ? fill(this.red, this.g, this.b) : fill(255);
    // fill(255);
    // fill(this.r, this.g, this.b);
    if (!this.hasColor) {
      stroke(255, 204, 0);
      strokeWeight(4);
    } else {
      noStroke();
    }
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  constrain() {
    blob.pos.x = constrain(blob.pos.x, -width / 4, width / 4);
    blob.pos.y = constrain(blob.pos.y, -height / 4, height / 4);
  }
}