import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from './services/news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'error418';

  constructor(private news: NewsService) {  }

  showToast() {
    this.news.showNewsMsg('The Content', 'The Title');
    this.news.showErrorMsg('U made a mistake', 'Dumbass');
  }


}
