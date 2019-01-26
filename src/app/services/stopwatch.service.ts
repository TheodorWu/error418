import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {

  stopWatchToast: ActiveToast<any>;
  minutes = 0;
  seconds = 0;
  timer;

  constructor(private toastr: ToastrService) { }

  start() {
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.seconds < 60) {
        this.seconds++;
      } else {
        this.minutes++;
        this.seconds = 0;
      }
    }, 1000);
  }

  stop() {
    return 'It took you: ' + this.minutes + ' minutes and ' + this.seconds + ' seconds to complete this game';
    }
}
