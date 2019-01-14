let socket;
let blob;
let blobs = [];
let zoom = 1;

function deleteById() {

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  blob = new Blob(socket.id, random(width), random(height), random(10,25));
  const data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
  };

  socket.emit('start', data);

  socket.on('heartbeat', (data) => {
    const newBlobs = [];
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].id !== socket.id) {
        newBlobs.push(new Blob(data[i].id, data[i].x, data[i].y, data[i].r, true));
      }
    }  
    blobs = newBlobs;  
    console.log(blobs);
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
  const newzoom = 32 / blob.r;
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
      blobs[i].show();
      if (blob.touch(blobs[i])) {
        // blobs.splice(i, 1);
        if (blob.r > blobs[i].r) {
          blob.grow(blobs[i]);
          blobs[i].die();
          blobs.splice(i, 1);
          location.reload();
        } else {
          blob.die();
          blobs[i].grow(blob);
          const data = {id: blob.id};
          socket.emit('die', data);
        }
      }
    }

  }
}
