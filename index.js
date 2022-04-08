const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const debug = true;

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
  width: 70,
  height: 140,
  offset: {
    x: 215,
    y: 165
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
      attackFrame: 4,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/TakeHit.png',
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
      y: 35
    },
    width: 180,
    height: 80
  },
  stats: {
    health: 100,
    speed: 66,
    damage: 0.1,
    jump: 50,
    jumpQuantity: 1
  }
});

player.draw();

const enemy = new Character({
  position: {
    x: 674, 
    y: 150
  },
  width: 50,
  height: 150,
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
      attackFrame: 1,
    },
    takeHit: {
      imageSrc: './img/kenji/TakeHit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7,
    }
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50
    },
    width: 172,
    height: 80
  },
  stats: {
    health: 100,
    speed: 66,
    damage: 0.1,
    jump: 50,
    jumpQuantity: 1
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
  },
  space: {
    pressed: false
  },
  Enter: {
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
      player.velocity.x = -(((player.stats.speed / 100)*3)+1.5);
    } else if (keys.d.pressed == true && player.lastkey == 'd') {
      player.switchSprite('run');
      player.velocity.x = (((player.stats.speed / 100)*3)+1.5);
    } else if (keys.d.pressed == true) {
      player.switchSprite('run');
      player.velocity.x = (((player.stats.speed / 100)*3)+1.5);
    } else if (keys.a.pressed == true) {
      player.switchSprite('run');
      player.velocity.x = -(((player.stats.speed / 100)*3)+1.5);
    } else {
      player.switchSprite('idle');
    }

    if (keys.space.pressed == true) {
      player.attack();
    }
  
    if (keys.w.pressed == true && player.velocity.y == 0) {
      player.velocity.y = -(20*player.stats.jump/100);
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
    } else {
      enemy.switchSprite('idle');
    }

    if (keys.Enter.pressed == true) {
      enemy.attack();
    }

    if (keys.ArrowUp.pressed == true && enemy.velocity.y == 0) {
      enemy.velocity.y = -(20*player.stats.jump/100);
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
    player.framesCurrent === player.sprites.attack1.attackFrame
  ) {
    enemy.takeHit(player.stats.damage);
    player.isAttacking = false;
    player.switchSprite('idle');
    gsap.to('#enemy-health', {
      width: enemy.health+'%'
    });
  }

  // Missed
  if (
    player.isAttacking &&
    player.framesCurrent === player.sprites.attack1.attackFrame
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
    enemy.framesCurrent === enemy.sprites.attack1.attackFrame
  ) {
    console.log(enemy.framesCurrent);
    player.takeHit(enemy.stats.damage);
    enemy.isAttacking = false;
    gsap.to('#player-health', {
      width: player.health+'%'
    });
  }

  // Missed

  if (
    enemy.isAttacking &&
    enemy.framesCurrent === enemy.sprites.attack1.attackFrame
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
      keys.space.pressed = true;
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
    case 'Enter':
      keys.Enter.pressed = true;
      break;
    default:
      break;
  }
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
    case ' ':
      keys.space.pressed = false;
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
    case 'Enter':
      keys.Enter.pressed = false;
      break;

    default:
      break;
  }
});

