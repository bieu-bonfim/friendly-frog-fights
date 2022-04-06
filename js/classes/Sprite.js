class Sprite {

  constructor({position, height, width, imageSrc, scale = 1, framesMax = 1, offset = {x:0,y:0}, framesHold = 10}) {
    this.position = position;
    this.height = height;
    this.width = width;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = framesHold;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image, 
      this.framesCurrent * this.image.width / this.framesMax,
      0,
      this.image.width / this.framesMax ,
      this.image.height,
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      (this.image.width / this.framesMax) * this.scale, 
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.animateFrames();
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;      
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}