import { Component, AfterViewInit } from '@angular/core';

const BOSS_HEALTH = 3;
const BOSS_LEVELS = [2,4,5];
const PLAYER_HEALTH = 100;
const GAUGE_LIMIT = 50;

@Component({
  selector: 'app-teapot',
  templateUrl: './teapot.component.html',
  styleUrls: ['./teapot.component.scss']
})
export class TeapotComponent implements AfterViewInit {
  canvas;
  ctx;
  canvasWidth;
  canvasHeight;

  lastTick;
  time;

  teapotStates;
  teapotHealth = BOSS_HEALTH;
  teapotAction;
  teapotRage;
  rageOffset;
  pot;

  gauge = 0;

  playerHealth = PLAYER_HEALTH;
  notEnoughEnergy = true;

  constructor() { }

  ngAfterViewInit() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.lastTick = Date.now();
    this.time = 0;

    this.teapotStates = [
      'steam',
      'block',
      'water',
    ];
    this.teapotAction = 'steam';
    this.pot = new Image();
    this.setBossSprite();
    this.teapotHealth = BOSS_HEALTH;
    this.teapotRage = [2,4,5];
    this.rageOffset = this.teapotRage.pop();

    this.playerHealth = PLAYER_HEALTH;

    this.gauge = 0;
    this.notEnoughEnergy = true;

    this.resize();

    this.drawBoss();

    window.addEventListener('resize', this.resize);

    requestAnimationFrame(() => { this.loop(); });
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
  }

  loop() {
    const now = Date.now();
    const delta = now - this.lastTick;
    this.time += delta;
    this.lastTick = now;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.tickBoss();

    console.log(this.time);

    requestAnimationFrame(() => this.loop());
  }

  onClick(event) {
    let id = event.target.id;
    if(this.gauge <= GAUGE_LIMIT){
      if(id == 'hide' && this.teapotAction == 'steam'){
        this.gauge++;
      } else
      if(id == 'attack' && this.teapotAction == 'block'){ //throw cookie
        this.gauge++;
      } else
      if(id == 'block' && this.teapotAction == 'water'){
        this.gauge++;
      } else if (this.gauge > 4){
        this.gauge -= 4;
        this.playerHealth -= 4;
      } else {
        this.playerHealth -= 8;
      }
    }
  }

  tickBoss() {
    let switcher = Math.round((Math.random()*3) + this.rageOffset)*1000;
    if (this.time > switcher) {
      this.switchAction();
      this.time = 0;
    }
    this.drawBoss();
  }

  brew() {
    this.teapotHealth--;
    this.teapotRage = this.rageOffset.pop();
    this.switchAction();
    this.drawBoss();
  }

  switchAction() {
    let currentIndex = this.teapotStates.findIndex(x => x === this.teapotAction);
    let nextActionIndex = Math.random()*2 + 1;
    let newIndex = (nextActionIndex + currentIndex) % 3;
    this.teapotAction = this.teapotStates[Math.floor(newIndex)];
    this.setBossSprite();
  }

  setBossSprite(){
    if(this.teapotAction == 'steam'){
      this.pot.src = '../../../assets/img/teapot_steam.png';
    }
    if(this.teapotAction == 'block'){
      this.pot.src = '../../../assets/img/teapot_block.png';
    }
    if(this.teapotAction == 'water'){
      this.pot.src = '../../../assets/img/teapot_water.png';
    }
    if(this.teapotAction == 'defeat'){
      this.pot.src = '../../../assets/img/teapot_defeat.png';
    }
  }

  drawBoss() {
    this.ctx.drawImage(this.pot, 0, 0, this.canvasHeight*16/9, this.canvasHeight);
  }
}
