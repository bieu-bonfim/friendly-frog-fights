class Character extends Sprite {
  constructor({
    position,
    width,
    height,
    velocity,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    framesHold,
    attackBox = {offset: {}, width: undefined, height: undefined},
    stats = {health: 100, damage: 20, speed: 60, jump: 50, jumpQuantity: 1}
  }) {
    super({
      position,
      width,
      height,
      imageSrc,
      scale,
      framesMax,
      offset,
      framesHold,
    });
    this.velocity = velocity;
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
    this.isAttacking = false;
    this.health = stats.health;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.sprites = sprites;
    this.dead = false;
    this.stats = stats;

    this.canAttack = true;

    this.spriteLoop = 0;
    this.spriteHold = 0;

    for (const i in this.sprites) {
      sprites[i].image = new Image();
      sprites[i].image.src = sprites[i].imageSrc;
    }
  }

  update() {
    this.draw();
    if(!this.dead) {
      this.animateFrames();
    }
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Attack box
    if (debug) {
      c.fillStyle = 'rgba(255, 0, 0, 0.35)';
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
      if (debug && this.framesCurrent == this.sprites.attack1.attackFrame ) {
        c.fillStyle = 'rgba(0, 255, 0, 0.35)';
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
      }
    }
    if (debug) {
      c.fillStyle = 'rgba(255, 0, 0, 0.35)';
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // velocity is not needed
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330 + (150-this.height);
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  takeHit(damage) {
    if (this.health > 0) {
      this.health -= damage;
    }
    if (this.health <= 0) {
      this.switchSprite('death');
      this.isAttacking = false;
    } else {
      this.switchSprite('takeHit');
    }
  }

  completeLoop(sprite) {
    if (this.framesCurrent === sprite.framesMax - 1) {
      if (this.spriteHold >= this.framesHold -1) {
        return true;
      } else {
        this.spriteHold++;
        return false;
      }
    } else {
      return false;
    }
  }

  switchSprite(sprite) {
    // Overriding all animations with death animation
    if (
      this.image === this.sprites.death.image
    ) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }
    // Overriding all animations with attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax  &&
      !this.completeLoop(this.sprites.attack1)
    ) {
      return;
    }
    // Overriding all animations with take hit animation
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax &&
      !this.completeLoop(this.sprites.takeHit)
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
          this.spriteHold = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.framesMax = this.sprites.takeHit.framesMax;
          this.image = this.sprites.takeHit.image;
          this.framesCurrent = 0;
          this.spriteHold = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.framesMax = this.sprites.death.framesMax;
          this.image = this.sprites.death.image;
          this.framesCurrent = 0;
        }
        break; 
      default:
        break;
    }
  }
}
