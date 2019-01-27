import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StopwatchService } from './stopwatch.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

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
    this.showNewsMsg('Test', 'Test');
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
