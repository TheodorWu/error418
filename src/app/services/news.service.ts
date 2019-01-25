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

  showNewsMsg(headline: string, txt: string) {
    console.log('getscalled');
    this.toastr.info(txt, headline, {
      disableTimeOut: true
    });
  }
}
