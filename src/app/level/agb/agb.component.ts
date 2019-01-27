import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Router } from '@angular/router';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss']
})
export class AgbComponent implements OnInit {
  private time = 0;
  private interval;

  public disableAccept = true;
  private movedCancel = false;

  constructor(
    private news: NewsService,
    private router: Router,
    private story: StoryService
  ) {}

  ngOnInit() {
    // this.story.openNextStoryMsg().subscribe(() => {
    //   console.log('Start TImer');
    // });
    this.startTimer();
  }

  scrolled(event) {
    if (
      Math.round(event.target.scrollTop) + event.target.offsetHeight >=
      event.target.scrollHeight
    ) {
      this.disableAccept = false;
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.time++;
    }, 100);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  cancelClick() {
    this.movedCancel = !this.movedCancel;
  }

  acceptClick() {
    switch (true) {
      case this.time < 2: {
        this.news.showErrorMsg('', 'You broke the sound barrier!');
        break;
      }
      case this.time < 5: {
        this.news.showErrorMsg('', 'Fastest scroller in the West!');
        break;
      }
      case this.time < 8: {
        this.news.showErrorMsg(
          '',
          'Don\'t tell me you read everything! Did your parents not tell you not to lie?!?'
        );
        break;
      }
      case this.time < 11: {
        this.news.showErrorMsg('', 'Guess you don\'t care about the details.');
        break;
      }
      case this.time < 14: {
        this.news.showErrorMsg('', 'Sure you didn\'t miss anything?');
        break;
      }
      case this.time < 17: {
        this.news.showErrorMsg('', 'We\'re getting there.');
        break;
      }
      case this.time < 20: {
        this.news.showErrorMsg('', 'Did you not forget the small print?');
        break;
      }
      case this.time < 23: {
        this.news.showErrorMsg(
          '',
          'Your decision could heavily affect your future. Take some seconds to think about it.'
        );
        break;
      }
      case this.time < 26: {
        this.news.showErrorMsg(
          '',
          'Maybe we\'re selling all of your data or microwaving butterflies in our spare time. You really should read carefully.'
        );
        break;
      }
      default: {
        this.news.showErrorMsg(
          '',
          'You made your choice. Now go and live with it.'
        );
        this.story.openNextStoryMsg();
        break;
      }
    }
  }
}
