const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.3;

class Sprite {

  constructor({position, velocity, height, width, color = 'red', offset}) {
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
    this.lastkey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
    };
    this.color = color;
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      c.fillStyle = 'green';
      c.fillRect(
        this.attackBox.position.x, 
        this.attackBox.position.y, 
        this.attackBox.width, 
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y - this.attackBox.offset.y;

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // velocity is not needed
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

}

const player = new Sprite({
  height: 150,
  width: 50,
  position: {
    x: 0, 
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
});

player.draw();

const enemy = new Sprite({
  height: 150,
  width: 50,
  position: {
    x: 400, 
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
});

enemy.draw();

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
};

function rectangularCollision({rectangle1, rectangle2}) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  // Player Movement

  player.velocity.x = 0;
  if (keys.a.pressed == true && player.lastkey == 'a') {
    player.velocity.x = -3;
  } else if (keys.d.pressed == true && player.lastkey == 'd') {
    player.velocity.x = 3;
  } else if (keys.d.pressed == true) {
    player.velocity.x = 3;
  } else if (keys.a.pressed == true) {
    player.velocity.x = -3;
  }

  if (keys.w.pressed == true && player.velocity.y == 0) {
    player.velocity.y = -10;
  }

  // Enemy Movement

  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed == true && enemy.lastkey == 'ArrowLeft') {
    enemy.velocity.x = -3;
  } else if (keys.ArrowRight.pressed == true && enemy.lastkey == 'ArrowRight') {
    enemy.velocity.x = 3;
  } else if (keys.ArrowRight.pressed == true) {
    enemy.velocity.x = 3;
  } else if (keys.ArrowLeft.pressed == true) {
    enemy.velocity.x = -3;
  }

  if (keys.ArrowUp.pressed == true && enemy.velocity.y == 0) {
    enemy.velocity.y = -10;
  }

  // Colisions

  // Attacking Enemy
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log('atacou inimig');
  }

  // Attacking Player
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log('atacou player');
  }
}

animate();

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastkey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastkey = 'a';
      break;
    case 'w':
      keys.w.pressed = true;
      break;
    case ' ':
      player.attack();
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastkey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = true;
      break;
    case 'ArrowDown':
      enemy.attack();
      break;

    default:
      break;
  }
  // console.log(e.key);
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;

    default:
      break;
  }
});

