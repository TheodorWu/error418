import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss']
})
export class AgbComponent implements OnInit {

  time:  number = 0;
  interval;

  constructor() { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.time++;
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}
