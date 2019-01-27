import { Component, OnInit } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  private range: number[] = [];
  private count: number; // number of buttons
  private correct: string; // id of correct button
  private tries = 0;

  private colors: string[];

  constructor(private story: StoryService, private news: NewsService) { }

  ngOnInit() {
    let i;
    this.count = Math.floor(Math.random() * 100) + 100;
    for (i = 0; i < this.count; i++) {
      this.range.push(i);
    }
    this.correct = 'b-' + Math.floor(Math.random() * this.count);

    this.colors = [ 'darkred',
    'lightsalmon',
    'salmon',
    'darksalmon',
    'lightcoral',
    'darksalmon',
    'crimson',
    'firebrick',
    'coral',
    'orange',
    'darkorange',
    'palegoldenrod',
    'lightyellow',
    'moccasin',
    'olive',
    'darkolivegreen',
    'olivedrab',
    'limegreen',
    'darkseagreen',
    'aquamarine',
    'cadetblue',
    'darkcyan',
    'lightblue',
    'steelblue',
    'royalblue',
    'mediumpurple',
    'thistle',
    'lavender',
    'seashell',
    'beige',
    'gainsboro'];
  }

  download(event) {
    const id = event.srcElement.id;
    if (id === this.correct) {
      this.story.openNextStoryMsg();
    } else {
      this.tries++;
      if (this.tries === 15) {
        this.news.showInfoMsg('Try clicking the less flashy Buttons', 'The right one is always the least noticible');
      } else if (this.tries === 25) {
        this.news.showInfoMsg('Is really every button changing its color?', '');
      } else if (this.tries === 100) {
        this.news.showNewsMsg('New World Record', 'Man clicked wrong download buttons a 100 times');
      }
      this.news.showErrorMsg('Attempt number: ' + this.tries, '', 500);
      const ids = this.randomIds(Math.floor(Math.random() * 13) + 2);
      ids.push(id);
      this.changeColors(ids);
    }
  }

  changeColors(ids) {
    const newc = this.colors[(Math.floor(Math.random() * this.colors.length - 1))];
    for (const id of ids) {
      if (!(id === this.correct)) {
        document.getElementById(id).setAttribute('style', 'background-color: ' + newc);
      }
    }
  }

  randomIds(n) {
    const idArray = [];
    for (let i = 0; i < n; i++) {
      idArray.push('b-' + (Math.floor(Math.random() * this.count)));
    }
    return idArray;
  }
}
