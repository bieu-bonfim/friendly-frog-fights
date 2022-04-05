const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.3;


const player = new Character({
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

const enemy = new Character({
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

function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId);
  document.querySelector("#results").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#results").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#results").innerHTML = "Player won!";
  } else if (player.health < enemy.health) {
    document.querySelector("#results").innerHTML = "Enemy won!";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({player, enemy, timerId});
  }
  
}

decreaseTimer();

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
    enemy.health -= 20;
    document.querySelector('#enemy-health').style.width = enemy.health+'%';
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
    player.health -= 20;
    document.querySelector('#player-health').style.width = player.health+'%';
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    console.log('pog');
    determineWinner({player, enemy, timerId});
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

