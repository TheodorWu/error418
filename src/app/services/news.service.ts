import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StopwatchService } from './stopwatch.service';
import { NEWS_TXT } from 'src/assets/texts/News';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  currentNewsCounter = 0;

  constructor(
    private toastr: ToastrService,
    private stopWatch: StopwatchService
    ) {
      this.stopWatch.registerCallback(() => this.showNextNews(), 20, true);
     }

  showToast() {
    this.toastr.show('Hello World!', 'Toast fun');
  }

  showNewsMsg(title: string, txt: string) {
    this.toastr.show(txt, title, {
      disableTimeOut: true,
      toastClass: 'toast news-toast'
    });
  }

  showInfoMsg(title: string, txt: string) {
    this.toastr.info(txt, title, {
      timeOut: 2000,
    });
  }

  showNextNews() {
    if (this.toastr.currentlyActive > 0) {
      return;
    }
    if (this.currentNewsCounter < NEWS_TXT.length) {
      const msg = NEWS_TXT[this.currentNewsCounter];
      this.showNewsMsg(msg.headline, msg.subheadline);
      this.currentNewsCounter++;
    } else {
      this.showNewsMsg('WOW Really?', 'You have been playing for so long we have run out of news to display...');
    }
  }

  showPositiveMsg(title: string, txt: string) {
    this.toastr.success(txt, title, {
      timeOut: 3000,
    });
  }

  showErrorMsg(title: string, txt: string, duration: number = 3000) {
    this.toastr.error(txt, title, {
      timeOut: duration,
    });
  }
}
