import { Component, OnInit } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';
import { StopwatchService } from 'src/app/services/stopwatch.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  timeResult: string;

  constructor(private story: StoryService, private stopwatch: StopwatchService) { }

  ngOnInit() {
    if (this.story.isCompleted()) {
     this.timeResult = this.stopwatch.stop();
    }
  }

}
