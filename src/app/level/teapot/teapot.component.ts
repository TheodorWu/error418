import { Component, OnInit } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-teapot',
  templateUrl: './teapot.component.html',
  styleUrls: ['./teapot.component.scss']
})
export class TeapotComponent implements OnInit {

  constructor(private story: StoryService) { }

  ngOnInit() {
  }

  next() {
    this.story.openNextStoryMsg();
  }

}
