import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from './services/news.service';
import { StoryService } from './services/story.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'error418';

  constructor(
    private news: NewsService,
    private story: StoryService
    ) {  }

  showToast() {
    this.story.openStoryMsg('Tolle Story Line bisher ...');
  }


}
