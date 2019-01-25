import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'error418';

  constructor(private toastr: ToastrService) {  }

  showToast() {
    this.toastr.success('Hello World!', 'Toast fun');
  }


}
