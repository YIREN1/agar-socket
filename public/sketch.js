let socket;
let blob;
let blobs = [];
let zoom = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  blob = new Blob(random(width), random(height), 32);
  const data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
  };

  socket.emit('start', data);

  socket.on('heartbeat', (data) => {
    console.log(data);
    blobs = data;

  });
  // for (var i = 0; i < 200; i++) {
  //   var x = random(-2 * width, 2 * width);
  //   var y = random(-2 * height, 2 * height);
  //   blobs[i] = new Blob(x, y, 16, true);
  // }
}

function draw() {
  background(243, 251, 255);
  translate(width / 2, height / 2);
  const newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);
  blob.show();
  if (mouseIsPressed) {
    blob.update();
  }
  
  blob.constrain();
  const data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
  };

  socket.emit('update', data);

  for (var i = blobs.length - 1; i >= 0; i--) {
    if (blobs[i].id !== socket.id) {
      fill(75, 105, 200);
      stroke(255, 204, 0);
      strokeWeight(4);
      
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);
      fill(255);
      textAlign(CENTER);
      textSize(4);
      text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r);
      // if (blob.eats(blobs[i])) {
      //   blobs.splice(i, 1);
      // }
    }

  }
}
