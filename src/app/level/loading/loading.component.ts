import { Component, AfterViewInit } from '@angular/core';
import { HostListener } from '@angular/core';

const PROGRESS_BAR_WIDTH_DIVIDER = 2.5;
const PROGRESS_BAR_HEIGHT_DIVIDER = 6.5;
const PROGRESS_SPEED = 0.003;
const PROGRESS_COLOR = '#33CC33';
const PROGRESS_RIGHT_EDGE_ANGLE = 1.5;
const START_SPAWN_FREQUENCY = 1850;
const END_SPAWN_FREQUENCY = 500;
const ENEMY_DATA = [];
const ENEMY_MAX_HP = 2;
const ENEMY_COLOR_SATURATION = 180;

class Enemy {
  x;
  y;
  width;
  height;
  hp;
  speed;
  damage;

  constructor(x, y, width, height, hp, speed, damage) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hp = hp;
    this.speed = speed;
    this.damage = damage;
  }
}

class EnemyData {
  size;
  hp;
  speed;
  damage;

  constructor(size, hp, speed, damage) {
    this.size = size;
    this.hp = hp;
    this.speed = speed;
    this.damage = damage;
  }
}


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements AfterViewInit {
  canvas;
  canvasWidth;
  canvasHeight;
  ctx;
  lastTick;

  progress;
  progressBarWidth;
  progressBarHeight;
  progressBarLeft;
  progressBarTop;
  progressBarRight;
  progressBarBottom;
  enemies;
  spawnTimer;

  constructor() {}

  ngAfterViewInit() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.lastTick = Date.now();
    this.progress = 0;
    this.enemies = [];
    this.spawnTimer = 0;

    this.resize();

    // window.addEventListener('click', (window, ev) => this.onClick(ev));
    window.addEventListener('resize', this.resize);

    ENEMY_DATA.push(new EnemyData(30, 1, 1.9, 5));
    ENEMY_DATA.push(new EnemyData(38, 2, 2.2, 10));
    ENEMY_DATA.push(new EnemyData(50, 2, 2.4, 15));

    requestAnimationFrame(() => { this.loop(); });
  }

  resize() {
    const html = document.documentElement;
    const body = document.body;
    const bodyWidth = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    );
    const bodyHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    this.canvasWidth = this.canvas.width = bodyWidth;
    this.canvasHeight = this.canvas.height = bodyHeight;
    this.progressBarWidth = this.canvasWidth / PROGRESS_BAR_WIDTH_DIVIDER;
    this.progressBarHeight = this.canvasHeight / PROGRESS_BAR_HEIGHT_DIVIDER;
    this.progressBarLeft = this.canvasWidth / 2 - this.progressBarWidth / 2;
    this.progressBarRight = this.progressBarLeft + this.progressBarWidth;
    this.progressBarTop = this.canvasHeight / 2 - this.progressBarHeight / 2;
    this.progressBarBottom = this.progressBarTop + this.progressBarHeight;
  }

  loop() {
    const now = Date.now();
    const delta = now - this.lastTick;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.tickSpawner(delta);
    this.tickEnemies(delta);
    this.tickBar(delta);

    this.lastTick = now;

    requestAnimationFrame(() => this.loop());
  }

  onClick(ev) {
    const clicked = this.clickedEnemy(ev.clientX, ev.clientY);

    if (clicked != null) {
      clicked.hp -= 1;
    }
  }

  tickBar(delta) {
    const progressWidth =
      ((this.progressBarWidth + this.progressBarHeight / PROGRESS_RIGHT_EDGE_ANGLE) *
      this.progress) /
        100 -
        this.progressBarHeight / PROGRESS_RIGHT_EDGE_ANGLE;

    if (this.progress < 100) {
      this.progress += PROGRESS_SPEED * delta;
    } else {
      this.progress = 100;

      // TODO Use proper URL
      window.location.replace('about:blank');
    }

    this.ctx.fillStyle = PROGRESS_COLOR;
    this.ctx.save();
    this.ctx.rect(
      this.progressBarLeft,
      this.progressBarTop,
      this.progressBarWidth,
      this.progressBarHeight
    );
    this.ctx.clip();
    this.fillProgressBar(
      this.ctx,
      this.progressBarLeft,
      this.progressBarTop,
      progressWidth,
      this.progressBarHeight
    );
    this.ctx.restore();
    this.ctx.strokeStyle = 'black';
    this.drawRect(
      this.ctx,
      this.progressBarLeft,
      this.progressBarTop,
      this.progressBarWidth,
      this.progressBarHeight
    );
    this.ctx.fillStyle = 'black';
    this.ctx.font = '30pt Monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Loading', this.canvasWidth / 2, this.canvasHeight / 2);
  }

  tickEnemies(delta) {
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.hp <= 0) {
        return false;
      }

      const angle = Math.atan2(
        this.canvasHeight / 2 - enemy.y - enemy.height / 2,
        this.canvasWidth / 2 - enemy.x - enemy.width / 2
      );
      const hpColor = (ENEMY_COLOR_SATURATION * (enemy.hp - 1)) / ENEMY_MAX_HP;
      const color = `rgb(${ENEMY_COLOR_SATURATION - hpColor}, 50, ${hpColor})`;

      enemy.x += Math.cos(angle) * enemy.speed;
      enemy.y += Math.sin(angle) * enemy.speed;

      if (this.intersectsWithBar(enemy.x, enemy.y, enemy.width, enemy.height)) {
        this.progress -= enemy.damage;

        if (this.progress < 0) {
          this.progress = 0;
        }

        return false;
      }

      this.ctx.fillStyle = color;
      this.fillCircle(this.ctx, enemy.x, enemy.y, enemy.width, enemy.height);

      return true;
    });
  }

  tickSpawner(delta) {
    this.spawnTimer += delta;

    const progressWeight = this.progress / 100;
    const spawnFrequency =
      (END_SPAWN_FREQUENCY - START_SPAWN_FREQUENCY) * progressWeight +
      START_SPAWN_FREQUENCY;

    if (this.spawnTimer >= spawnFrequency) {
      const type = Math.floor(Math.random() * ENEMY_DATA.length);
      const data = ENEMY_DATA[type];
      const side = Math.random() >= 0.5;
      let x, y;

      if (Math.random() >= 0.5) {
        x = side ? -data.size : this.canvasWidth;
        y = Math.random() * (this.canvasHeight + data.size) - data.size;
      } else {
        x = Math.random() * (this.canvasWidth + data.size) - data.size;
        y = side ? -data.size : this.canvasHeight;
      }

      const enemy = new Enemy(
        x,
        y,
        data.size,
        data.size,
        data.hp,
        data.speed,
        data.damage
      );

      this.enemies.push(enemy);

      this.spawnTimer -= spawnFrequency;
    }
  }

  clickedEnemy(x, y) {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      console.log(x, '  ', y, '  ', enemy);

      if (
        x > enemy.x &&
        y > enemy.y &&
        x < enemy.x + enemy.width &&
        y < enemy.y + enemy.height
      ) {
        return enemy;
      }
    }

    return null;
  }

  intersectsWithBar(x, y, width, height) {
    return (
      x + width > this.progressBarLeft &&
      x < this.progressBarRight &&
      y + height > this.progressBarTop &&
      y < this.progressBarBottom
    );
  }

  fillProgressBar(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width + height / PROGRESS_RIGHT_EDGE_ANGLE, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y);
    ctx.fill();
  }

  fillCircle(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCircle(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  fillRect(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
  }

  drawRect(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
  }
}
