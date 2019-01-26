import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private toastr: ToastrService) { }

  showToast() {
    this.toastr.show('Hello World!', 'Toast fun');
  }

  showNewsMsg(title: string, txt: string) {
    this.toastr.show(txt, title, {
      disableTimeOut: true,
      toastClass: 'toast news-toast'
    });
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
