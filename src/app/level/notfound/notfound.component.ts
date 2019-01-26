import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  gradientTop: number;
  gradientLeft: number;

  onMouseMove(e) {
    console.log(e);
    let elem = document.getElementById('gradient');
    console.log(e.x,e.target.clientWidth,e.y,e.target.clientHeight);
    console.log(e.target.clientX/e.target.clientWidth*100, e.clientY/e.target.clientHeight*100);
    elem.setAttribute('style', 'background: radial-gradient(60px at ' + e.clientX/e.target.clientWidth*100 + '% ' + e.clientY/e.target.clientHeight*100 + '%, white, black); !important');
  }

  constructor() { }

  ngOnInit() {
  }
}
