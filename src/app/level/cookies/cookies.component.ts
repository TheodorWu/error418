import { Component, OnInit } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';
import { environment } from 'src/environments/environment';


const FRICTION = 0.00015;
const GRAVITY = 0.0025;
const BOUNCINESS = 0.5;
const GROUND_FRICTION_MULTIPLIER = 2;
const COOKIE_SIZE = 32;
const COOKIE_ROTATION_SPEED = 0.01;
const RANDOM_BOUNCE_FACTOR = 0.05;
const RANDOM_DELAY_FACTOR = 300;
const ACCEPT_FREQUENCY = 3000;
const PLAYER_SPEED = 0.45;
const PLAYER_PICKUP_TIMEOUT = 300;
const MAX_SHOOT_VELOCITY = 2.0;
const SHOOT_VELOCITY_CHARGE_SPEED = 0.0025;
const COOKIE_COUNT = 25;
const SCORES_NEEDED = 5;
const BIN_SIZE = 192;
const BIN_Y_VARIATION = 250;

class Cookie {
  x;
  y;
  size;
  vx;
  vy;
  rotation;
  remove;

  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vx = 0;
    this.vy = 0;
    this.rotation = Math.random() * Math.PI * 2;
    this.remove = false;
  }

  tick(delta) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
  }
}

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {
  canvas;
  canvasWidth;
  canvasHeight;
  ctx;
  lastTick;
  images;
  keys;
  buttons;
  mousePos;

  cookies;
  player;
  bin;
  score;


  constructor(private story: StoryService) {}

  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.lastTick = Date.now();
    this.images = [];
    this.keys = [];
    this.buttons = [];
    this.mousePos = {
      x: 0,
      y: 0
    };
    this.cookies = [];
    this.score = SCORES_NEEDED;

    this.ctx.imageSmoothingQuality = 'low';
    this.ctx.imageSmoothingEnabled = false;

    this.loadImage(`${environment.deployUrl}assets/img/cookies/cookie.png`);
    this.loadImage(`${environment.deployUrl}assets/img/cookies/player.png`);
    this.loadImage(`${environment.deployUrl}assets/img/cookies/bin_back.png`);
    this.loadImage(`${environment.deployUrl}assets/img/cookies/bin_front.png`);
    this.resize();

    this.player = {
      x: 10,
      y: 0,
      width: 32,
      height: 64,
      cookie: null,
      charging: false,
      charge: 0,
      canPickup: true
    };

    this.randomizeBin();

    const header = document.getElementById('header');
    const acceptButton = document.getElementById('accept');
    const declineButton = document.getElementById('decline');
    const headerStyle = window.getComputedStyle(header);

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('keydown', (ev) => this.keydown(ev));
    window.addEventListener('keyup', (ev) => this.keyup(ev));
    window.addEventListener('mousedown', (ev) => this.mousedown(ev));
    window.addEventListener('mouseup', (ev) => this.mouseup(ev));
    window.addEventListener('mousemove', (ev) => this.mousemove(ev));
    acceptButton.addEventListener('click', () => {
      for (let i = 0; i < COOKIE_COUNT; i++) {
        let cookieX = 0;

        do {
          cookieX = Math.random() * (this.canvasWidth - COOKIE_SIZE);
        } while (cookieX + COOKIE_SIZE > this.bin.x && cookieX < this.bin.x + this.bin.width);

        setTimeout(() => {
          this.cookies.push(new Cookie(cookieX, -COOKIE_SIZE, COOKIE_SIZE));
        }, RANDOM_DELAY_FACTOR * Math.random());
      }

      // acceptButton.disabled = true;
      header.style.top = '-' + headerStyle.height;

      setTimeout(() => {
        // acceptButton.disabled = false;
        header.style.top = '0';
      }, ACCEPT_FREQUENCY);
    });
    // declineButton.disabled = true;
    declineButton.addEventListener('click', () => {
      window.location.replace('about:blank'); // TODO Use proper URL
    });

    requestAnimationFrame(() => this.loop());
  }

  loop() {
    const now = Date.now();
    const delta = (now - this.lastTick) / 1;
    const binBackImage = this.images['res/bin_back.png'];
    const binFrontImage = this.images['res/bin_front.png'];

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (binBackImage && binFrontImage) {
      this.ctx.drawImage(binBackImage, this.bin.x, this.bin.y, this.bin.width, this.bin.height);
    }

    this.tickPlayer(delta);
    this.tickBin();
    this.tickCookies(delta);

    if (binBackImage && binFrontImage) {
      this.ctx.drawImage(binFrontImage, this.bin.x, this.bin.y, this.bin.width, this.bin.height);
    }

    if (this.score > 0) {
      this.ctx.fillStyle = 'black';
      this.ctx.textBaseline = 'top';
      this.ctx.textAlign = 'center';
      this.ctx.font = '15pt Monospace';
      this.ctx.fillText('Cookies to delete: ' + this.score, this.bin.x + this.bin.width / 2, this.bin.y + this.bin.height + 15);
    }

    this.lastTick = now;

    requestAnimationFrame(() => this.loop());
  }

  tickCookies(delta) {
    const cookieImage = this.images['res/cookie.png'];

    this.cookies = this.cookies.filter((cookie) => {
      if (cookie.remove) {
        return false;
      }
      let friction = FRICTION * Math.sign(cookie.vx) * delta;

      if (cookie.y + cookie.size >= this.canvasHeight) {
        cookie.y = this.canvasHeight - cookie.size + 1;
        cookie.vy /= -2;

        if (Math.abs(cookie.vy) > GRAVITY) {
          cookie.vx += cookie.vy * BOUNCINESS * Math.random() * this.randomSign();
          cookie.vy -= Math.random() * RANDOM_BOUNCE_FACTOR;
        } else {
          cookie.vy = 0;
          friction *= GROUND_FRICTION_MULTIPLIER;
        }
      } else {
        cookie.vy += GRAVITY * delta;
      }

      if (Math.abs(cookie.vx) > Math.abs(friction)) {
        cookie.vx -= friction;
      } else {
        cookie.vx = 0;
      }

      if (cookie.x <= 0) {
        cookie.x = 0;
        cookie.vx /= -2;
      } else if (cookie.x + cookie.size >= this.canvasWidth) {
        cookie.x = this.canvasWidth - cookie.size;
        cookie.vx /= -2;
      }

      cookie.tick(delta);
      cookie.rotation += COOKIE_ROTATION_SPEED * cookie.vx * delta;

      if (cookieImage) {
        this.ctx.save();
        this.ctx.translate(cookie.x + cookie.size / 2, cookie.y + cookie.size / 2);
        this.ctx.rotate(cookie.rotation);
        this.ctx.drawImage(cookieImage, -cookie.size / 2, -cookie.size / 2, cookie.size, cookie.size);
        this.ctx.restore();
      }

      return true;
    });
  }

  randomSign() {
    return Math.sign(Math.random() - 0.5);
  }

  tickBin() {
    const intersections = this.intersectingCookies(this.bin.x, this.bin.y, this.bin.width, this.bin.height);

    for (let i = 0; i < intersections.length; i++) {
      const cookie = intersections[i];
      const leftIntersection = cookie.x + cookie.size - this.bin.x;
      const rightIntersection = this.bin.x + this.bin.width - cookie.x;
      const topIntersection = cookie.y + cookie.size - this.bin.y;
      const bottomIntersection = this.bin.y + this.bin.height - cookie.y;
      const leftRightIntersection = Math.min(leftIntersection, rightIntersection);
      const topBotIntersection = Math.min(topIntersection, bottomIntersection);

      if (cookie.vy > 0 && cookie.x > this.bin.x && cookie.x + cookie.size < this.bin.x + this.bin.width) {
        if (cookie.y + cookie.size / 2 > this.bin.y) {
          cookie.vx = 0;
        }

        if (cookie.y + cookie.size / 2 >= this.bin.y + this.bin.height / 2) {
          cookie.remove = true;
          this.score -= 1;
          this.randomizeBin();

          if (this.score <= 0) {
            // document.getElementById('decline').disabled = false;
            this.score = 0;
          }
        }
      } else if (leftRightIntersection < topBotIntersection) {
        if (leftIntersection < rightIntersection) {
          cookie.x = this.bin.x - cookie.size;
        } else {
          cookie.x = this.bin.x + this.bin.width;
        }

        cookie.vx /= -2;
      } else {
        if (topIntersection < bottomIntersection) {
          cookie.y = this.bin.y - cookie.size;
        } else {
          cookie.y = this.bin.y + this.bin.height;
        }

        cookie.vy /= -2;
      }
    }
  }

  tickPlayer(delta) {
    const movement = PLAYER_SPEED * delta;

    this.player.y = this.canvasHeight - this.player.height;

    if (this.keys['d'] || this.keys['ArrowRight']) {
      this.player.x += movement;
    }

    if (this.keys['a'] || this.keys['ArrowLeft']) {
      this.player.x -= movement;
    }

    if (this.player.x + this.player.width < 0) {
      this.player.x = this.canvasWidth;
    } else if (this.player.x > this.canvasWidth) {
      this.player.x = -this.player.width;
    }

    if (!this.player.cookie && this.player.canPickup) {
      const intersecting = this.intersectingCookies(this.player.x, this.player.y, this.player.width, this.player.height);

      if (intersecting[0]) {
        this.player.cookie = intersecting[0];
      }
    } else if (this.player.cookie) {
      this.player.cookie.x = this.player.x;
      this.player.cookie.y = this.player.y;
      this.player.cookie.vx = this.player.cookie.vy = 0;

      if (this.buttons[0]) {
        this.player.charging = true;
        this.player.charge += SHOOT_VELOCITY_CHARGE_SPEED * delta;

        if (this.player.charge > MAX_SHOOT_VELOCITY) {
          this.player.charge = MAX_SHOOT_VELOCITY;
        }
      } else if (this.player.charging) {
        this.shootCookie();
        this.player.charging = false;
        this.player.canPickup = false;
        setTimeout(() => {
          this.player.canPickup = true;
        }, PLAYER_PICKUP_TIMEOUT);
      }
    }

    const playerImage = this.images['res/player.png'];

    if (playerImage) {
      this.ctx.drawImage(playerImage, this.player.x, this.player.y, this.player.width, this.player.height);

      if (this.player.charging) {
        const chargeWidth = this.player.width * this.player.charge / MAX_SHOOT_VELOCITY;

        this.ctx.fillStyle = 'green';
        this.fillRect(this.ctx, this.player.x, this.player.y - 10, this.player.width, 5);
        this.ctx.fillStyle = 'red';
        this.fillRect(this.ctx, this.player.x, this.player.y - 10, chargeWidth, 5);
      }
    }
  }

  shootCookie() {
    const cookieCenterX = this.player.cookie.x + this.player.cookie.size / 2;
    const cookieCenterY = this.player.cookie.y + this.player.cookie.size / 2;
    const angle = Math.atan2(this.mousePos.y - cookieCenterY, this.mousePos.x - cookieCenterX);

    this.player.cookie.vx = Math.cos(angle) * this.player.charge;
    this.player.cookie.vy = Math.sin(angle) * this.player.charge;
    this.player.cookie = null;
    this.player.charge = 0;
  }

  fillRect(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
  }

  intersectingCookies(x, y, width, height) {
    const intersections = [];

    for (let i = 0; i < this.cookies.length; i++) {
      const cookie = this.cookies[i];

      if (x > cookie.x + cookie.size || x + width < cookie.x) {
        continue;
      }

      if (y > cookie.y + cookie.size || y + height < cookie.y) {
        continue;
      }

      intersections.push(cookie);
    }

    return intersections;
  }

  loadImage(path) {
    const img = new Image();

    img.onload = () => {
      this.images[path] = img;
    };
    img.src = path;
  }

  resize() {
    const html = document.documentElement;
    const body = document.body;
    const bodyWidth = Math.min(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    const bodyHeight = Math.min(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    this.canvasWidth = this.canvas.width = bodyWidth;
    this.canvasHeight = this.canvas.height = bodyHeight;
  }

  randomizeBin() {
    const x = Math.random() * (this.canvasWidth - BIN_SIZE);
    const yOffset = (Math.random() - 0.5) * BIN_Y_VARIATION;

    this.bin = {
      x: x,
      y: this.canvasHeight / 2 + yOffset,
      width: BIN_SIZE,
      height: BIN_SIZE
    };
  }

  keydown(ev) {
    this.keys[ev.key] = true;
  }

  keyup(ev) {
    this.keys[ev.key] = false;
  }

  mousedown(ev) {
    this.buttons[ev.button] = true;
  }

  mouseup(ev) {
    this.buttons[ev.button] = false;
  }

  mousemove(ev) {
    this.mousePos.x = ev.clientX;
    this.mousePos.y = ev.clientY;
  }

  next() {
    this.story.openNextStoryMsg();
  }
}
