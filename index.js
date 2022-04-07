const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.3;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 129
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
  framesHold: 9
});

const player = new Character({
  position: {
    x: 300, 
    y: 150
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 215,
    y: 155
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/takeHit.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6,
    }
  },
  framesHold: 5,
  attackBox: {
    offset: {
      x: 70,
      y: 50
    },
    width: 180,
    height: 80
  },
});

player.draw();

const enemy = new Character({
  position: {
    x: 674, 
    y: 150
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 215,
    y: 168
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/takeHit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7,
    }
  },
  attackBox: {
    offset: {
      x: -180,
      y: 50
    },
    width: 180,
    height: 80
  },
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

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  // Player Movement
  player.velocity.x = 0;
  if (!player.dead) {
    if (keys.a.pressed == true && player.lastkey == 'a') {
      player.switchSprite('run');
      player.velocity.x = -3.5;
    } else if (keys.d.pressed == true && player.lastkey == 'd') {
      player.switchSprite('run');
      player.velocity.x = 3.5;
    } else if (keys.d.pressed == true) {
      player.switchSprite('run');
      player.velocity.x = 3.5;
    } else if (keys.a.pressed == true) {
      player.switchSprite('run');
      player.velocity.x = -3.5;
    } else {
      player.switchSprite('idle');
    }
  
    if (keys.w.pressed == true && player.velocity.y == 0) {
      player.velocity.y = -10;
    }
  
    if (player.velocity.y < 0) {
      player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall');
    }
  } else {
    player.velocity.x = 0;
  }

  // Enemy Movement

  if (!enemy.dead) {
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed == true && enemy.lastkey == 'ArrowLeft') {
      enemy.switchSprite('run');
      enemy.velocity.x = -3.5;
    } else if (keys.ArrowRight.pressed == true && enemy.lastkey == 'ArrowRight') {
      enemy.switchSprite('run');
      enemy.velocity.x = 3.5;
    } else if (keys.ArrowRight.pressed == true) {
      enemy.switchSprite('run');
      enemy.velocity.x = 3.5;
    } else if (keys.ArrowLeft.pressed == true) {
      enemy.switchSprite('run');
      enemy.velocity.x = -3.5;
    }else {
      enemy.switchSprite('idle');
    }

    if (keys.ArrowUp.pressed == true && enemy.velocity.y == 0) {
      enemy.velocity.y = -10;
    }

    if (enemy.velocity.y < 0) {
      enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite('fall');
    }
  } else {
    enemy.velocity.x = 0;
  }

  // Colisions

  // Attacking Enemy
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('#enemy-health', {
      width: enemy.health+'%'
    });
  }

  // Missed
  if (
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
  }

  // Attacking Player
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#player-health', {
      width: player.health+'%'
    });
  }

  // Missed

  if (
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId});
  }
}

decreaseTimer();

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
    default:
      break;
  }

  switch (e.key) {
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
    default:
      break;
  }
  switch (e.key) {
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

