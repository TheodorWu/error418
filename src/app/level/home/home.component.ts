import { Component, OnInit } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';
import { StopwatchService } from 'src/app/services/stopwatch.service';

const BALOON_COUNT = 30;
const OFFSET_VARIATION = 1250;
const BALOON_SPEED = 10;
const UPDATE_INTERVAL = 10;
const BALOON_TEXT = "🎈";
const SPACE_OCCUPIED_DIVIDER = 4;
const RIGHT_SIDE_OFFSET = 150;

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
  
	thing() {
		if (!this.story.isCompleted()) {
			this.story.openNextStoryMsg();
		} else {
			this.end();
		}
	}
	
	end() {
		document.getElementById("time").innerText = this.timeResult;
		document.getElementById("content").removeChild(document.getElementById("button"));
		
		const body = document.body;
		const html = document.documentElement;
		const bodyWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
		const bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		const baloonContainer = document.getElementById("baloons");
		
		let baloons = [];
		
		for (let i = 0; i < BALOON_COUNT; i++) {
			const baloon = document.createElement("div");
			const bot = -Math.random() * OFFSET_VARIATION;
			const left = Math.random() * (bodyWidth - RIGHT_SIDE_OFFSET);
			
			baloon.innerText = BALOON_TEXT;
			baloon.style.position = "absolute";
			baloon.style.bottom = `${bot}px`;
			baloon.style.left = `${left}px`;
			
			baloonContainer.appendChild(baloon);
			baloons.push(baloon);
		}
		
		const interval = setInterval(() => {
			baloons = baloons.filter((baloon) => {
				const height = parseInt(baloon.style.bottom) + BALOON_SPEED;
			
				if (height >= bodyHeight) {
					return false;
				}
				
				baloon.style.bottom = `${height}px`;
				
				return true;
			});
			
			if (baloons.length == 0) {
				clearInterval(interval);
				baloonContainer.innerHTML = "";
			}
		}, UPDATE_INTERVAL);
	}
}
