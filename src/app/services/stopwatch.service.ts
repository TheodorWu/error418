import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast } from 'ngx-toastr';

export class TimedCallback {
  callback: Function;
  timeInSec: number;

  constructor(callback: Function, timeInSec: number) {
    this.callback = callback;
    this.timeInSec = timeInSec;
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

  registerCallback(callback: Function, seconds: number) {
    const callObj: TimedCallback = new TimedCallback(callback, seconds);
    this.callbackArray.push(callObj);
  }

  callCallbacks() {
    const timeSec = this.minutes * 60 + this.seconds;
    this.callbackArray.forEach((element ) => {
      if ((timeSec % element.timeInSec) === 0 ) {
        element.callback();
      }
    });
  }

}
