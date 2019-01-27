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
      timeOut: 6000,
      toastClass: 'toast news-toast'
    });
  }

  showNextNews() {
    if (this.currentNewsCounter < NEWS_TXT.length){
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

  showErrorMsg(title: string, txt: string) {
    this.toastr.error(txt, title, {
      timeOut: 3000,
    });
  }
}
