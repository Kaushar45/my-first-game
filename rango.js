// config
const canvasX = 500;
const canvasY = 500;

const heroSpeed = 15;
const heroSize = 100;
const heroHitX = 40;
const heroHitY = 65;
const heroHealth = 100;
const heroBulletSize = 20;
const heroBulletSpeed = 5;
const heroBulletDamage = 6;

const smallEnemySize = 70;
const smallEnemyHealth = 2;
const smallEnemyHitX = 17;
const smallEnemyHitY = 35;
const smallEnemySpeed = 5;
const smallEnemyChangeDirSpeed = 0.99;
const smallEnemyNumberAtATime = 6;
const smallEnemyBulletFiringRate = 0.9;
const smallEnemyBulletSize = 15;
const smallEnemyBulletDamage = 2;
const smallEnemyBulletSpeed = 4;

const bigEnemySize = 120;
const bigEnemyHealth = 30;
const bigEnemyHitX = 30;
const bigEnemyHitY = 60;
const bigEnemyChangeDirSpeed = 0.99;
const bigEnemySpeed = 2;
const bigEnemyNumberAtATime = 3;
const bigEnemyBulletFiringRate = 0.99;
const bigEnemyBulletSize = 30;
const bigEnemyBulletDamage = 4;
const bigEnemyBulletSpeed = 3;

// state
let score = 0;
const hero = {
  x: 200,
  y: 200,
  d: "up",
  size: heroSize,
  hitX: heroHitX,
  hitY: heroHitY,
  health: heroHealth,
  bulletSize: heroBulletSize,
  bulletSpeed: heroBulletSpeed,
  bulletDamage: heroBulletDamage,
};

const enemyArray = [];
const bulletArray = [];

const canvEle = document.getElementById("canvas");
const playBoxEle = document.getElementById("playBox");
const playBtnEle = document.getElementById("play");
const music = document.getElementById("backgroundMusic");
let interval;
playBoxEle.addEventListener("click", () => {
  interval = setInterval(function () {
    // Game Logic
    enemySpwaner();
    enemyMover();
    enemyBulletFire();
    bulletMover();
    heroBulletHit();
    enemyBulletHit();
    bulletToBulletHit();
    scoreUpdater();
    bulletRemover();
    enemyRemover();
    isGameOver();

    // Renderer
    ctx.clearRect(0, 0, canvasX, canvasY);
    drawBullet();
    drawEnemy();
    drawHero();
  }, 20);
  playBoxEle.style.display = "none";
  music.play();
});

const scoreEle = document.getElementById("score");
canvEle.height = canvasY;
canvEle.width = canvasX;
const ctx = canvEle.getContext("2d");

const heroUpImg = document.getElementById("up_hero");
const heroDownImg = document.getElementById("down_hero");
const heroLeftImg = document.getElementById("left_hero");
const heroRightImg = document.getElementById("right_hero");

const enemy1UpImg = document.getElementById("up_enemy1");
const enemy1DownImg = document.getElementById("down_enemy1");
const enemy1LeftImg = document.getElementById("left_enemy1");
const enemy1RightImg = document.getElementById("right_enemy1");

const enemy2UpImg = document.getElementById("up_enemy2");
const enemy2DownImg = document.getElementById("down_enemy2");
const enemy2LeftImg = document.getElementById("left_enemy2");
const enemy2RightImg = document.getElementById("right_enemy2");

const bullet1UpImg = document.getElementById("up_bullet1");
const bullet1DownImg = document.getElementById("down_bullet1");
const bullet1LeftImg = document.getElementById("left_bullet1");
const bullet1RightImg = document.getElementById("right_bullet1");

const bullet2UpImg = document.getElementById("up_bullet2");
const bullet2DownImg = document.getElementById("down_bullet2");
const bullet2LeftImg = document.getElementById("left_bullet2");
const bullet2RightImg = document.getElementById("right_bullet2");

const bullet3UpImg = document.getElementById("up_bullet3");
const bullet3DownImg = document.getElementById("down_bullet3");
const bullet3LeftImg = document.getElementById("left_bullet3");
const bullet3RightImg = document.getElementById("right_bullet3");

function enemyMover() {
  enemyArray.forEach((el) => {
    const rand = Math.random();
    // move in one direction
    if (el.d === "up") {
      el.y -= rand * el.speed;
    } else if (el.d === "down") {
      el.y += rand * el.speed;
    } else if (el.d === "left") {
      el.x -= rand * el.speed;
    } else if (el.d === "right") {
      el.x += rand * el.speed;
    }
    // choose change direction or not
    const rand2 = Math.random();
    if (rand2 > smallEnemyChangeDirSpeed && el.type === "small") {
      const rand1 = Math.random();
      // change direction
      if (rand1 < 0.25) {
        el.d = "up";
      } else if (rand1 < 0.5) {
        el.d = "down";
      } else if (rand1 < 0.75) {
        el.d = "left";
      } else {
        el.d = "right";
      }
    } else if (rand2 > bigEnemyChangeDirSpeed && el.type === "big") {
      const rand1 = Math.random();
      // change direction
      if (rand1 < 0.25) {
        el.d = "up";
      } else if (rand1 < 0.5) {
        el.d = "down";
      } else if (rand1 < 0.75) {
        el.d = "left";
      } else {
        el.d = "right";
      }
    }
  });
}

function heroBulletHit() {
  let i = 0;
  while (i < bulletArray.length) {
    if (bulletArray[i].owner == "enemy") {
      i++;
      continue;
    }
    let j = 0;
    while (j < enemyArray.length) {
      if (
        Math.abs(enemyArray[j].x - bulletArray[i].x) <
          enemyArray[j].enemyHitX + bulletArray[i].size / 2 &&
        Math.abs(enemyArray[j].y - bulletArray[i].y) <
          enemyArray[j].enemyHitY + bulletArray[i].size / 2
      ) {
        bulletArray[i].hitted = true;
        enemyArray[j].health = enemyArray[j].health - bulletArray[i].damage;
        if (enemyArray[j].health <= 0) {
          enemyArray[j].death = true;
        }
      }
      j++;
    }
    i++;
  }
}

function enemyBulletHit() {
  let i = 0;
  while (i < bulletArray.length) {
    if (bulletArray[i].owner == "hero") {
      i++;
      continue;
    }
    if (
      Math.abs(hero.x - bulletArray[i].x) <
        hero.hitX / 2 + bulletArray[i].size / 2 &&
      Math.abs(hero.y - bulletArray[i].y) <
        hero.hitY / 2 + bulletArray[i].size / 2
    ) {
      bulletArray[i].hitted = true;
      hero.health = hero.health - bulletArray[i].damage;
      if (hero.health <= 0) {
        hero.death = true;
      }
    }
    i++;
  }
}

function enemySpwaner() {
  let smallEnemyCount = 0;
  enemyArray.forEach((el) => {
    if (el.type === "small") {
      smallEnemyCount++;
    }
  });

  if (smallEnemyCount < smallEnemyNumberAtATime) {
    enemyArray.push({
      x: Math.random() * canvasX,
      y: Math.random() * canvasX,
      d: "up",
      size: smallEnemySize,
      health: smallEnemyHealth,
      speed: smallEnemySpeed,
      type: "small",
      enemyHitX: smallEnemyHitX,
      enemyHitY: smallEnemyHitY,
      enemyImages: {
        up: enemy1UpImg,
        down: enemy1DownImg,
        left: enemy1LeftImg,
        right: enemy1RightImg,
      },
      bulletSize: smallEnemyBulletSize,
      bulletDamage: smallEnemyBulletDamage,
      bulletSpeed: smallEnemyBulletSpeed,
    });
  }
  let bigEnemyCount = 0;
  enemyArray.forEach((el) => {
    if (el.type === "big") {
      bigEnemyCount++;
    }
  });

  if (bigEnemyCount < bigEnemyNumberAtATime) {
    console.log(enemyArray);
    enemyArray.push({
      x: Math.random() * canvasX,
      y: Math.random() * canvasX,
      d: "up",
      enemyHitX: bigEnemyHitX,
      enemyHitY: bigEnemyHitY,
      enemyImages: {
        up: enemy2UpImg,
        down: enemy2DownImg,
        left: enemy2LeftImg,
        right: enemy2RightImg,
      },
      size: bigEnemySize,
      health: bigEnemyHealth,
      speed: bigEnemySpeed,
      type: "big",
      bulletSize: bigEnemyBulletSize,
      bulletDamage: bigEnemyBulletDamage,
      bulletSpeed: bigEnemyBulletSpeed,
    });
  }
}

function enemyBulletFire() {
  enemyArray.forEach((e) => {
    const d = Math.random();
    if (d > smallEnemyBulletFiringRate) {
      bulletArray.push({
        x: e.x,
        y: e.y,
        d: e.d,
        owner: "enemy",
        bulletImages:
          e.type === "small"
            ? {
                up: bullet1UpImg,
                down: bullet1DownImg,
                left: bullet1LeftImg,
                right: bullet1RightImg,
              }
            : {
                up: bullet2UpImg,
                down: bullet2DownImg,
                left: bullet2LeftImg,
                right: bullet2RightImg,
              },
        size: e.bulletSize,
        damage: e.bulletDamage,
        speed: e.bulletSpeed,
      });
    }
  });
}

function enemyRemover() {
  let i = 0;
  while (i < enemyArray.length) {
    if (
      enemyArray[i].x + enemyArray[i].enemyHitX < 0 ||
      enemyArray[i].x - enemyArray[i].enemyHitX > canvasX ||
      enemyArray[i].y + enemyArray[i].enemyHitY < 0 ||
      enemyArray[i].y - enemyArray[i].enemyHitY > canvasY ||
      enemyArray[i].death
    ) {
      enemyArray.splice(i, 1);
    }
    i++;
  }
}

// Drawing
function drawHero() {
  if (hero.d == "up") {
    ctx.drawImage(
      heroUpImg,
      hero.x - hero.size / 2,
      hero.y - hero.size / 2,
      hero.size,
      hero.size
    );
  } else if (hero.d == "down") {
    ctx.drawImage(
      heroDownImg,
      hero.x - hero.size / 2,
      hero.y - hero.size / 2,
      hero.size,
      hero.size
    );
  } else if (hero.d == "left") {
    ctx.drawImage(
      heroLeftImg,
      hero.x - hero.size / 2,
      hero.y - hero.size / 2,
      hero.size,
      hero.size
    );
  } else {
    ctx.drawImage(
      heroRightImg,
      hero.x - hero.size / 2,
      hero.y - hero.size / 2,
      hero.size,
      hero.size
    );
  }
}

function drawEnemy() {
  enemyArray.forEach((el) => {
    if (el.d == "up") {
      ctx.drawImage(
        el.enemyImages.up,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    } else if (el.d == "down") {
      ctx.drawImage(
        el.enemyImages.down,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    } else if (el.d == "left") {
      ctx.drawImage(
        el.enemyImages.left,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    } else {
      ctx.drawImage(
        el.enemyImages.right,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    }
  });
}

function drawBullet() {
  bulletArray.forEach((el) => {
    if (el.d === "up") {
      ctx.drawImage(
        el.bulletImages.up,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    } else if (el.d === "down") {
      ctx.drawImage(
        el.bulletImages.down,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    } else if (el.d === "left") {
      ctx.drawImage(
        el.bulletImages.left,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    } else if (el.d === "right") {
      ctx.drawImage(
        el.bulletImages.right,
        el.x - el.size / 2,
        el.y - el.size / 2,
        el.size,
        el.size
      );
    }
  });
}

function bulletMover() {
  let index = 0;
  while (index < bulletArray.length) {
    if (bulletArray[index].d === "up") {
      bulletArray[index].y = bulletArray[index].y - bulletArray[index].speed;
    } else if (bulletArray[index].d === "down") {
      bulletArray[index].y = bulletArray[index].y + bulletArray[index].speed;
    } else if (bulletArray[index].d === "left") {
      bulletArray[index].x = bulletArray[index].x - bulletArray[index].speed;
    } else if (bulletArray[index].d === "right") {
      bulletArray[index].x = bulletArray[index].x + bulletArray[index].speed;
    }
    index++;
  }
}

function bulletRemover() {
  let index = 0;
  while (index < bulletArray.length) {
    if (
      bulletArray[index].x < 0 ||
      bulletArray[index].x > canvasX ||
      bulletArray[index].y < 0 ||
      bulletArray[index].y > canvasY ||
      bulletArray[index].hitted
    ) {
      bulletArray.splice(index, 1);
    }
    index++;
  }
}

function bulletToBulletHit() {
  let i = 0;
  while (i < bulletArray.length) {
    let j = i;
    while (j < bulletArray.length) {
      if (bulletArray[i].owner != bulletArray[j].owner) {
        if (
          Math.abs(bulletArray[i].x - bulletArray[j].x) <
            bulletArray[i].size / 2 + bulletArray[j].size / 2 &&
          Math.abs(bulletArray[i].y - bulletArray[j].y) <
            bulletArray[i].size / 2 + bulletArray[j].size / 2
        ) {
          if (bulletArray[i].damage < bulletArray[j].damage) {
            bulletArray[j].damage =
              bulletArray[j].damage - bulletArray[i].damage;
            bulletArray[i].damage = 0;
            bulletArray[i].hitted = true;
          } else if (bulletArray[i].damage > bulletArray[j].damage) {
            bulletArray[i].damage =
              bulletArray[i].damage - bulletArray[j].damage;
            bulletArray[j].damage = 0;
            bulletArray[j].hitted = true;
          } else {
            // equal
            bulletArray[i].damage = 0;
            bulletArray[j].damage = 0;
            bulletArray[i].hitted = true;
            bulletArray[j].hitted = true;
          }
        }
      }
      j++;
    }
    i++;
  }
}
let lastPressed = 0;
const throttle = (fn, delay, ...arg) => {
  if (Date.now() - lastPressed > delay) {
    lastPressed = Date.now();
    fn(...arg);
  }
};
window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowUp" && hero.y > heroHitY) {
    hero.d = "up";
    hero.y = hero.y - heroSpeed;
  } else if (e.code === "ArrowDown" && hero.y + heroHitY < canvEle.height) {
    hero.d = "down";
    hero.y = hero.y + heroSpeed;
  } else if (e.code === "ArrowLeft" && hero.x > heroHitX) {
    hero.d = "left";
    hero.x = hero.x - heroSpeed;
  } else if (e.code === "ArrowRight" && hero.x + heroHitX < canvEle.width) {
    hero.d = "right";
    hero.x = hero.x + heroSpeed;
  }
  if (e.code === "Space") {
    const audio_hero_bullet_fire = new Audio("./assets/fire1.mp3");
    audio_hero_bullet_fire.play();
    if (hero.d === "left") {
      bulletArray.push({
        x: hero.x - hero.size / 2,
        y: hero.y - 8,
        d: hero.d,
        owner: "hero",
        size: hero.bulletSize,
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    } else if (hero.d === "right") {
      bulletArray.push({
        x: hero.x + hero.size / 2,
        y: hero.y - 8,
        d: hero.d,
        owner: "hero",
        size: hero.bulletSize,
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    } else if (hero.d === "up") {
      bulletArray.push({
        x: hero.x + 1,
        y: hero.y - hero.size / 2,
        d: hero.d,
        owner: "hero",
        size: hero.bulletSize,
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    } else if (hero.d === "down") {
      bulletArray.push({
        x: hero.x + 20,
        y: hero.y + hero.size / 2,
        d: hero.d,
        owner: "hero",
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        size: hero.bulletSize,
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    }
  }
});
const InputEvent = (event) => {
  if (e.code === "Space") {
    const audio_hero_bullet_fire = new Audio("./assets/fire1.mp3");
    audio_hero_bullet_fire.play();
    if (hero.d === "left") {
      bulletArray.push({
        x: hero.x - hero.size / 2,
        y: hero.y - 8,
        d: hero.d,
        owner: "hero",
        size: hero.bulletSize,
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    } else if (hero.d === "right") {
      bulletArray.push({
        x: hero.x + hero.size / 2,
        y: hero.y - 8,
        d: hero.d,
        owner: "hero",
        size: hero.bulletSize,
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    } else if (hero.d === "up") {
      bulletArray.push({
        x: hero.x + 1,
        y: hero.y - hero.size / 2,
        d: hero.d,
        owner: "hero",
        size: hero.bulletSize,
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    } else if (hero.d === "down") {
      bulletArray.push({
        x: hero.x + 13,
        y: hero.y + hero.size / 2,
        d: hero.d,
        owner: "hero",
        bulletImages: {
          up: bullet3UpImg,
          down: bullet3DownImg,
          left: bullet3LeftImg,
          right: bullet3RightImg,
        },
        size: hero.bulletSize,
        damage: hero.bulletDamage,
        speed: hero.bulletSpeed,
      });
    }
  }
};

function isGameOver() {
  if (hero.health <= 0) {
    clearInterval(interval);
    music.pause();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

function scoreUpdater() {
  let index = 0;
  // bullet hit score update
  while (index < bulletArray.length) {
    if (bulletArray[index].owner === "hero" && bulletArray[index].hitted) {
      score += 5;
    }
    index++;
  }
  index = 0;
  // enemy death score update
  while (index < enemyArray.length) {
    if (enemyArray[index].death) {
      score += 10;
    }
    index++;
  }
  const highScoreStr = localStorage.getItem("high_score");
  scoreEle.innerHTML = `<span>Health ${
    hero.health
  } &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Score: ${score} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highest Score:${
    highScoreStr || 0
  } </span> `;
  // save high score to local storage
  const hScore = highScoreStr * 1;
  if (!isNaN(hScore) && hScore < score) {
    localStorage.setItem("high_score", score);
  }
}
