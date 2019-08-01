class Blob {

  constructor(id, x, y, r, isOther) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);
    if (isOther) {
      this.red = random(75, 255);
      this.g = random(75, 255);
      this.b = random(75, 255);
    }
    this.id = id;
    this.isOther = isOther;
  }

  update() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    // mouse inside it , stop;
    const mag = 7 - this.r * this.r * 0.0001;
    newvel.setMag(mag);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  }

  grow(other) {
    const sum = PI * this.r * this.r + PI * other.r * other.r;
    this.r = sqrt(sum / PI);
  }

  die() {
    this.r = 0;
    
  }

  
  touch(other) {
    const d = p5.Vector.dist(this.pos, other.pos);      
    return d < abs(this.r - other.r);
    
  }

  show() {
    this.isOther ? fill(200, 75, 75) : fill(255);
    if (!this.isOther) {
      stroke(255, 204, 0);
      strokeWeight(4);
    } else {
      noStroke();
    }
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    this.isOther ? fill(0) : fill(255);
    textAlign(CENTER);
    textSize(6);
    const textMsg = this.isOther ? this.id.substring(0,3) : 'yoooooo';
    text(textMsg, this.pos.x, this.pos.y + this.r);
  }

  constrain() {
    const rate = 4;
    blob.pos.x = constrain(blob.pos.x, -width / rate, width / rate);
    blob.pos.y = constrain(blob.pos.y, -height / rate, height / rate);
  }
}