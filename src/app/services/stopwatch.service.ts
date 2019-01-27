import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast } from 'ngx-toastr';

const MAX_TIME_OFFSET = 10;

export class TimedCallback {
  callback: Function;
  timeInSec: number;
  useRandom: boolean;

  constructor(callback: Function, timeInSec: number, useRandom: boolean) {
    this.callback = callback;
    this.timeInSec = timeInSec;
    this.useRandom = useRandom;
  }
}

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  stopWatchToast: ActiveToast<any>;
  minutes = 0;
  seconds = 0;
  timer;
  callbackArray: Array<TimedCallback> = new Array<TimedCallback>();

  constructor(private toastr: ToastrService) {
  }

  start() {
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.callCallbacks();
      if (this.seconds < 60) {
        this.seconds++;
      } else {
        this.minutes++;
        this.seconds = 0;
      }
    }, 1000);
  }

  stop() {
    return (
      'It took you ' +
      this.minutes +
      ' minutes and ' +
      this.seconds +
      ' seconds to complete this game'
    );
  }

  registerCallback(callback: Function, seconds: number, useRandomOffset: boolean) {
    const callObj: TimedCallback = new TimedCallback(callback, seconds, useRandomOffset);
    this.callbackArray.push(callObj);
  }

  callCallbacks() {
    const timeSec = this.minutes * 60 + this.seconds;
    this.callbackArray.forEach((element ) => {
      const offset = element.useRandom ? Math.floor(Math.random() * MAX_TIME_OFFSET) : 0;
      if ((timeSec % (element.timeInSec + offset)) === 0 ) {
        element.callback();
      }
    });
  }

}
