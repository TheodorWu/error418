import { Component, AfterViewInit } from '@angular/core';
import { StoryService } from '../../services/story.service';
import { NewsService } from '../../services/news.service';

const BOSS_HEALTH = 3;
const BOSS_LEVELS = [2,3,4];
const PLAYER_HEALTH = 100;
const GAUGE_LIMIT = 30;

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

  win = false;
  lost = false;
  go = true;

  tip1;
  tip2;
  tip3;
  tip4;

  gauge = 0;

  playerHealth = PLAYER_HEALTH;
  notEnoughEnergy = true;
  correctReact = false;

  constructor(private story: StoryService,
  private news: NewsService) { }

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
    this.teapotRage = BOSS_LEVELS;
    this.rageOffset = this.teapotRage.pop();

    this.playerHealth = PLAYER_HEALTH;

    this.gauge = 0;
    this.notEnoughEnergy = true;

    this.tip1 = false;
    this.tip2 = false;
    this.tip3 = false;
    this.tip4 = false;

    this.resize();

    this.drawBoss();

    window.addEventListener('resize', this.resize);
  }

  restart() {
    this.win = false;
    this.lost = false;
    this.playerHealth = PLAYER_HEALTH;
    this.teapotHealth = BOSS_HEALTH;
    this.gauge = 0;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.lastTick = Date.now();
    this.time = 0;

    this.resize();

    this.notEnoughEnergy = true;

    this.teapotRage = BOSS_LEVELS;
    this.rageOffset = this.teapotRage.pop();

    requestAnimationFrame(() => { this.loop(); });

  }

  start() {
    this.go = false;
    this.lastTick = Date.now();
    requestAnimationFrame(() => { this.loop(); });
  }

  continue() {
    this.story.openNextStoryMsg();
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

    if(this.gauge >= GAUGE_LIMIT) {
      this.notEnoughEnergy = false;
    } else {
      this.notEnoughEnergy = true;
    }

    if(this.win){
      return;
    }

    if(this.teapotHealth == 0){
      this.teapotAction = 'defeat';
      this.setBossSprite();
      this.win = true;
    }

    if(this.playerHealth <= 0){
      this.lost = true;
      return;
    }

    requestAnimationFrame(() => this.loop());
  }

  onClick(event) {
    let id = event.target.id;
    if(this.gauge <= GAUGE_LIMIT){
      if(id == 'hide' && this.teapotAction == 'steam'){
        this.gauge++;
        this.correctReact = true;
      } else
      if(id == 'attack' && this.teapotAction == 'block'){ //throw cookie
        this.gauge++;
        this.correctReact = true;
      } else
      if(id == 'block' && this.teapotAction == 'water'){
        this.gauge++;
        this.correctReact = true;
      } else if (this.gauge > 4){
        this.gauge -= 2;
        this.playerHealth -= 2;
      } else {
        this.playerHealth -= 5;
        if (!this.tip4) {
          this.tip4 = true;
        }
      }
    }
  }

  tickBoss() {
    let switcher = Math.round((Math.random()*3) + this.rageOffset)*1000;
    if (this.time > switcher && this.teapotAction != 'disabled') {
      this.switchAction();
      if(!this.correctReact){
        this.playerHealth -= 5;
      }
      this.time = 0;
    }
    this.drawBoss();
  }

  brew() {
    if(this.teapotHealth > 0){
      this.teapotHealth--;
    }
    this.rageOffset = this.teapotRage.pop();
    this.gauge = 0;
  }

  switchAction() {
    let currentIndex = this.teapotStates.findIndex(x => x === this.teapotAction);
    let nextActionIndex = Math.random()*2 + 1;
    let newIndex = (nextActionIndex + currentIndex) % 3;
    this.teapotAction = this.teapotStates[Math.floor(newIndex)];
    this.correctReact = false;
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
    this.ctx.drawImage(this.pot, (this.canvasWidth-this.canvasHeight*16/9)/2, 0, this.canvasHeight*16/9, this.canvasHeight);
  }
}
