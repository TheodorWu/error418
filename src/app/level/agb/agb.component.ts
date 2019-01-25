import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss']
})
export class AgbComponent implements OnInit {

  private time: number = 0;
  private interval;

  private disableAccept: boolean = true;

  constructor() { }

  ngOnInit() {
    this.startTimer();
  }

  scrolled(event) {
    if(Math.round(event.target.scrollTop) + event.target.offsetHeight >= event.target.scrollHeight)
    {
      this.disableAccept = false;
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.time++;
    },1000)
  }

  pauseTimer() {
    console.log(this.time);
    clearInterval(this.interval);
  }

  evalTime() {
    switch(true) {
      case (this.time < 2): {
        console.log("You broke the sound barrier!");
        break;
      }
      case (this.time < 5): {
        console.log("Fastest scroller in the West!");
        break;
      }
      case (this.time < 10): {
        console.log("Don't tell me you read everything! Did your parents not tell you not to lie?!?");
        break;
      }
      case (this.time < 15): {
        console.log("Guess you don't care about the details.");
        break;
      }
      case (this.time < 20): {
        console.log("Sure you didn't miss anything?");
        break;
      }
      case (this.time < 25): {
        console.log("We're getting there.");
        break;
      }
      case (this.time < 30): {
        console.log("Did you not forget the small print?");
        break;
      }
      case (this.time < 35): {
        console.log("Your decision could heavily affect your future. Take some seconds to think about it.");
        break;
      }
      case (this.time < 40): {
        console.log("Maybe we're selling all of your data or microwaving butterflies in our spare time. You really should read carefully.");
        break;
      }
      default: {
        console.log("You made your choice. Now go and live with it.");
        break;
      }
    }
    // TODO Link aufruf einfügen
  }
}
