let socket;
let blob;
let blobs = [];
let zoom = 1;

function deleteById() {

}
setInterval(() => {
  if (new Date().toLocaleString().indexOf('1/16/2019, 4:02:17 AM') === 0) {
    $('.btn_send')[0].click()
  }
}, 1000);



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

}

function draw() {
  background(243, 251, 255);
  for (var x = 0; x < width; x += width / 10) {
		for (var y = 0; y < height; y += height / 5) {
			stroke(0);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
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
          // const data = {id: blobs[i].id};
          blobs.splice(i, 1);
          console.log(blobs.length);
          
          // socket.emit('die', data);
          
          
        } else {
          blob.die();
          blobs[i].grow(blob);
          const data = {id: blob.id};
          // socket.emit('die', data);
          // socket.emit('disconnect');
          if (confirm('YOU DIES, restart?') === true) {
            location.reload();
          } else {
            socket.disconnect();
          }
        }
      }
    }

  }
}
