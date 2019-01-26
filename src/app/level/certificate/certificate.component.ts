import { Component, AfterViewInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';
import { Router } from '@angular/router';

const PROGRESS_SPEED = 0.003;
const START_SPAWN_FREQUENCY = 1850;
const START_HEALTH = 100;
const END_SPAWN_FREQUENCY = 500;
const ENEMY_DATA = [];
const ENEMY_COLOR_SATURATION = 180;
const TIMEUP = 10000;

class Enemy {
  x;
  y;
  width;
  height;
  speed;
  damage;

  constructor(x, y, width, height, speed, damage) {
    this.x = x;
    this.y = y;
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

  lost;
  win;

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
  health;
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
      this.cert.src = '../../../assets/img/certificate.png';
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

      this.drawCert(this.ctx, this.cert, this.certX, this.certY);

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

      this.lastTick = now;
      this.time++;

      if(this.time > TIMEUP){
        this.win = true;
      }

      requestAnimationFrame(() => this.loop());
    }

    tickEnemies(delta) {
      this.enemies = this.enemies.filter(enemy => {

        const angle = Math.atan2(
          this.certY + this.certHeight / 2 - enemy.y - enemy.height / 2,
          this.certX +  this.certWidth/ 2 - enemy.x - enemy.width / 2
        );
        const color = `rgb(${ENEMY_COLOR_SATURATION}, 50, green)`;

        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;

        if (this.intersectsWithCertificate(enemy.x, enemy.y, enemy.width, enemy.height)) {
          this.health -= enemy.damage;

          if (this.health < 0) {
            this.health = 0;
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

        const enemy = new Enemy(
          x,
          y,
          data.size,
          data.size,
          data.speed,
          data.damage
        );

        this.enemies.push(enemy);

        this.spawnTimer -= spawnFrequency;
      }
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
      console.log(event);
    }


    handleMouseUp(event) {
      this.drag = false;
    }

    handleMouseMove(event) {
      console.log(event);
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
      location.reload();
    }

    fillCircle(ctx, x, y, width, height) {
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    drawCert(ctx, cert, x, y) {
      ctx.drawImage(cert, x, y, this.certWidth, this.certHeight);
      this.certTop = this.certY;
      this.certLeft = this.certX;
      this.certBottom = this.certY + this.certHeight;
      this.certRight = this.certX + this.certWidth;
    }
  }
