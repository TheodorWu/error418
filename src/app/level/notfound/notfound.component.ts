import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  gradientTop: number;
  gradientLeft: number;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    console.log(e);
    // let mouseXpercentage = Math.round(e.X / windowWidth * 100);
    // let mouseYpercentage = Math.round(e.Y / windowHeight * 100);

    let elem = document.getElementById('gradient');
    console.log(e.clientX,e.clientWidth,e.clientY,e.clientHeight)
    elem.setAttribute('style', 'background: radial-gradient(50px at ' + e.clientX/e.target.clientWidth*100 + '% ' + e.clientY/e.target.clientHeight*100 + '%, white, black);');
  }

  constructor() { }

  ngOnInit() {
  }

  // $(document).mousemove(function(event) {
  //   windowWidth = $(window).width();
  //   windowHeight = $(window).height();
  //
  //   mouseXpercentage = Math.round(event.pageX / windowWidth * 100);
  //   mouseYpercentage = Math.round(event.pageY / windowHeight * 100);
  //
  //   $('.radial-gradient').css('background', 'radial-gradient(at ' + mouseXpercentage + '% ' + mouseYpercentage + '%, #3498db, #9b59b6)');
  // });
}
