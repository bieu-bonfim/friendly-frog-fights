class Character extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    framesHold,
    attackBox = {offset: {}, width: undefined, height: undefined}
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      framesHold,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastkey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.sprites = sprites;

    for (const i in this.sprites) {
      sprites[i].image = new Image();
      sprites[i].image.src = sprites[i].imageSrc;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Attack box
    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // velocity is not needed
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.framesMax = this.sprites.idle.framesMax;
          this.image = this.sprites.idle.image;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.framesMax = this.sprites.run.framesMax;
          this.image = this.sprites.run.image;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.framesMax = this.sprites.jump.framesMax;
          this.image = this.sprites.jump.image;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.framesMax = this.sprites.fall.framesMax;
          this.image = this.sprites.fall.image;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.framesMax = this.sprites.attack1.framesMax;
          this.image = this.sprites.attack1.image;
          this.framesCurrent = 0;
        }
        break;
      default:
        break;
    }
  }
}
