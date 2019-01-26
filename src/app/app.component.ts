import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from './services/news.service';
import { StoryService } from './services/story.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'error418';

  constructor(
    private news: NewsService,
    private story: StoryService
    ) {  }

    ngOnInit() {
      this.story.openNextStoryMsg();
    }


}
