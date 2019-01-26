import { Component, OnInit } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  private range: number[] = [];
  private count: number; // number of buttons
  private correct: string; // id of correct button
  private tries: number = 0;

  private colors: string[];

  constructor(private story: StoryService) { }

  ngOnInit() {
    let i;
    this.count = Math.floor(Math.random() * 100) + 100;
    for(i=0; i<this.count; i++){
      this.range.push(i);
    }
    this.correct = 'b-'+ Math.floor(Math.random() * this.count);

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
    let id = event.srcElement.id;
    if(id===this.correct){
      this.story.openNextStoryMsg();
    } else {
      this.tries++;
      let ids = this.randomIds(Math.floor(Math.random() *13)+2);
      ids.push(id);
      this.changeColors(ids);
    }
  }

  changeColors(ids) {
    let newc = this.colors[(Math.floor(Math.random() * this.colors.length-1))];
    for (let id of ids) {
      if(!(id==this.correct)){
        document.getElementById(id).setAttribute('style', 'background-color: ' + newc);
      }
    }
  }

  randomIds(n){
    let idArray = [];
    for(let i=0; i<n;i++){
      idArray.push('b-'+ (Math.floor(Math.random() * this.count)));
    }
    return idArray;
  }
}
