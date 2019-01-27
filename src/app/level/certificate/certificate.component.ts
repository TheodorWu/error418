import { Component, AfterViewInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';
import { Router } from '@angular/router';

const PROGRESS_SPEED = 0.01;
const START_SPAWN_FREQUENCY = 400;
const END_SPAWN_FREQUENCY = 50;
const START_HEALTH = 100;
const ENEMY_DATA = [];
const ENEMY_COLOR_SATURATION = 180;
const TIMEUP = 45000;

class Enemy {
  x;
  y;
  angle;
  width;
  height;
  speed;
  damage;

  constructor(x, y, angle, width, height, speed, damage) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.damage = damage;
  }
}

class EnemyData {
  size;
  speed;
  damage;

  constructor(size, speed, damage) {
    this.size = size;
    this.speed = speed;
    this.damage = damage;
  }
}

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements AfterViewInit {
  canvas;
  canvasWidth;
  canvasHeight;
  ctx;
  lastTick;

  lost: boolean = false;
  win: boolean = false;

  enemies;
  spawnTimer;

  cert;
  certX;
  certY;
  certWidth;
  certHeight;
  certTop;
  certLeft;
  certRight;
  certBottom;
  health: number = 100;
  progress;
  time;

  drag;
  lastMouseX;
  lastMouseY;

  constructor(
    private router: Router,
    private story: StoryService) { }

    ngAfterViewInit() {
      this.canvas = document.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.win = false;

      this.cert = new Image();
      this.cert.src = 'assets/img/certificate.png';
      this.certX = 100;
      this.certY = 100;
      this.certWidth = 120;
      this.certHeight = 140;
      this.drag = false;

      this.lost = false;
      this.lastTick = Date.now();
      this.progress = 0;
      this.time = 0;
      this.enemies = [];
      this.spawnTimer = 0;
      this.health = START_HEALTH;

      this.resize();

      window.addEventListener('resize', this.resize);

      ENEMY_DATA.push(new EnemyData(30, 1.9, 5));
      ENEMY_DATA.push(new EnemyData(38, 2.2, 10));
      ENEMY_DATA.push(new EnemyData(50, 2.4, 15));

      requestAnimationFrame(() => { this.loop(); });
    }

    loop() {
      const now = Date.now();
      const delta = now - this.lastTick;

      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.tickSpawner(delta);
      this.tickEnemies(delta);

      this.drawCert(this.ctx, this.cert, this.certX, this.certY);

      this.lastTick = now;
      this.time += delta;

      if(this.time > TIMEUP && !this.lost){
        this.win = true;
        this.drag = false;
        return true;
      }

      if(this.lost){
        return true;
      }

      requestAnimationFrame(() => this.loop());
    }

    tickEnemies(delta) {
      this.enemies = this.enemies.filter(enemy => {

        const color = `rgb(${ENEMY_COLOR_SATURATION}, 50, green)`;

        enemy.x += Math.cos(enemy.angle) * enemy.speed;
        enemy.y += Math.sin(enemy.angle) * enemy.speed;

        if (this.intersectsWithCertificate(enemy.x, enemy.y, enemy.width, enemy.height)) {
          this.health -= enemy.damage;

          if (this.health <= 0) {
            this.health = 0;
            this.drag = false;
            this.lost = true;
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

        let angle = Math.atan2(
          this.certY + this.certHeight / 2 - y - data.size / 2,
          this.certX +  this.certWidth/ 2 - x - data.size / 2
        );
        const enemy = new Enemy(
          x,
          y,
          angle,
          data.size,
          data.size,
          data.speed,
          data.damage
        );

        this.enemies.push(enemy);

        this.spawnTimer -= spawnFrequency;
      }
    }

    tickCert() {
      if(this.drag){
        var deltaX = Math.abs(this.lastMouseX);
        var deltaY = Math.abs(this.lastMouseY);
      }
      this.drawCert(this.ctx, this.cert, this.certX, this.certY);
    }

    intersectsWithCertificate(x, y, width, height) {
      return (
        x + width > this.certLeft &&
        x < this.certRight &&
        y + height > this.certTop &&
        y < this.certBottom
      );
    }

    handleMouseDown(event) {
      if((event.x <= this.certX + this.certWidth && event.x >= this.certX)
      && (event.y <=this.certY + this.certHeight && event.y >= this.certY)){
        this.drag = true;
        this.lastMouseX = event.x;
        this.lastMouseY = event.y;
      }
    }

    handleMouseUp() {
      this.drag = false;
    }

    handleMouseMove(event) {
      if(this.drag){
        let deltaX = event.x - this.lastMouseX;
        let deltaY = event.y - this.lastMouseY;
        this.lastMouseX = event.x;
        this.lastMouseY = event.y;
        this.certX += deltaX;
        this.certY += deltaY;
      }
    }

    resize() {
      const html = document.documentElement;
      const body = document.body;
      const bodyWidth = Math.min(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );
      const bodyHeight = Math.min(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      this.canvasWidth = this.canvas.width = bodyWidth;
      this.canvasHeight = this.canvas.height = bodyHeight;
      this.certTop = this.certY;
      this.certLeft = this.certX;
      this.certBottom = this.certY + this.certHeight;
      this.certRight = this.certX + this.certWidth;
    }

    restart() {
      this.win = false;
      this.lost = false;
      this.health = START_HEALTH;

      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.lastTick = Date.now();
      this.progress = 0;
      this.time = 0;
      this.enemies = [];
      this.spawnTimer = 0;

      this.cert.src = 'assets/img/certificate.png';

      this.resize();

      requestAnimationFrame(() => { this.loop(); });
    }

    continue() {
      this.story.openNextStoryMsg();
    }

    fillCircle(ctx, x, y, width, height) {
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    drawCert(ctx, cert, x, y) {
      if(this.health <= 30){
        this.cert.src = 'assets/img/certificate_cracked.png';
      }
      ctx.drawImage(cert, x, y, this.certWidth, this.certHeight);
      this.certTop = this.certY;
      this.certLeft = this.certX;
      this.certBottom = this.certY + this.certHeight;
      this.certRight = this.certX + this.certWidth;
    }
  }
