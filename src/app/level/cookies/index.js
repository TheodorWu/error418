let canvas;
let canvasWidth, canvasHeight;
let ctx;
let lastTick;
let images;
let keys;
let buttons;
let mousePos;

let cookies;
let player;
let bin;
let score;

const FRICTION = 0.00015;
const GRAVITY = 0.0025;
const BOUNCINESS = 0.5;
const GROUND_FRICTION_MULTIPLIER = 2;
const COOKIE_SIZE = 32;
const COOKIE_ROTATION_SPEED = 0.01;
const RANDOM_BOUNCE_FACTOR = 0.05;
const RANDOM_DELAY_FACTOR = 300;
const ACCEPT_FREQUENCY = 3000;
const PLAYER_SPEED = 0.45;
const PLAYER_PICKUP_TIMEOUT = 300;
const MAX_SHOOT_VELOCITY = 2.0;
const SHOOT_VELOCITY_CHARGE_SPEED = 0.0025;
const COOKIE_COUNT = 25;
const SCORES_NEEDED = 5;
const BIN_SIZE = 192;
const BIN_Y_VARIATION = 250;

window.onload = () => {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	lastTick = Date.now();
	images = [];
	keys = [];
	buttons = [];
	mousePos = {
		x: 0,
		y: 0
	};
	cookies = [];
	score = SCORES_NEEDED;

	ctx.imageSmoothingQuality = "low";
	ctx.imageSmoothingEnabled = false;

	loadImage("res/cookie.png");
	loadImage("res/player.png");
	loadImage("res/bin_back.png");
	loadImage("res/bin_front.png");
	resize();

	player = {
		x: 10,
		y: 0,
		width: 32,
		height: 64,
		cookie: null,
		charging: false,
		charge: 0,
		canPickup: true
	};

	randomizeBin();

	const header = document.getElementById("header");
	const acceptButton = document.getElementById("accept");
	const declineButton = document.getElementById("decline");
	const headerStyle = window.getComputedStyle(header);

	window.addEventListener("resize", resize);
	window.addEventListener("keydown", keydown);
	window.addEventListener("keyup", keyup);
	window.addEventListener("mousedown", mousedown);
	window.addEventListener("mouseup", mouseup);
	window.addEventListener("mousemove", mousemove);
	acceptButton.addEventListener("click", () => {
		for (let i = 0; i < COOKIE_COUNT; i++) {
			let cookieX = 0;

			do {
				cookieX = Math.random() * (canvasWidth - COOKIE_SIZE);
			} while(cookieX + COOKIE_SIZE > bin.x && cookieX < bin.x + bin.width);

			setTimeout(() => {
				cookies.push(new Cookie(cookieX, -COOKIE_SIZE, COOKIE_SIZE));
			}, RANDOM_DELAY_FACTOR * Math.random());
		}

		acceptButton.disabled = true;
		header.style.top = "-" + headerStyle.height;

		setTimeout(() => {
			acceptButton.disabled = false;
			header.style.top = 0;
		}, ACCEPT_FREQUENCY);
	});
	declineButton.disabled = true;
	declineButton.addEventListener("click", () => {
		window.location.replace("about:blank"); //TODO Use proper URL
	});

	requestAnimationFrame(loop);
};

function keydown(ev) {
	keys[ev.key] = true;
}

function keyup(ev) {
	keys[ev.key] = false;
}

function mousedown(ev) {
	buttons[ev.button] = true;
}

function mouseup(ev) {
	buttons[ev.button] = false;
}

function mousemove(ev) {
	mousePos.x = ev.clientX;
	mousePos.y = ev.clientY;
}

function resize() {
	const html = document.documentElement;
	const body = document.body;
	const bodyWidth = Math.min(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
	const bodyHeight = Math.min(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

	canvasWidth = canvas.width = bodyWidth;
	canvasHeight = canvas.height = bodyHeight;
}

function loop() {
	const now = Date.now();
	const delta = (now - lastTick) / 1;
	const binBackImage = images["res/bin_back.png"];
	const binFrontImage = images["res/bin_front.png"];

	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	if (binBackImage && binFrontImage) {
		ctx.drawImage(binBackImage, bin.x, bin.y, bin.width, bin.height);
	}

	tickPlayer(delta);
	tickBin();
	tickCookies(delta);

	if (binBackImage && binFrontImage) {
		ctx.drawImage(binFrontImage, bin.x, bin.y, bin.width, bin.height);
	}

	if (score > 0) {
		ctx.fillStyle = "black";
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.font = "15pt Monospace";
		ctx.fillText("Cookies to delete: " + score, bin.x + bin.width / 2, bin.y + bin.height + 15);
	}

	lastTick = now;

	requestAnimationFrame(loop);
}

function randomizeBin() {
	const x = Math.random() * (canvasWidth - BIN_SIZE);
	const yOffset = (Math.random() - 0.5) * BIN_Y_VARIATION;

	bin = {
		x: x,
		y: canvasHeight / 2 + yOffset,
		width: BIN_SIZE,
		height: BIN_SIZE
	};
}

function tickBin() {
	const intersections = intersectingCookies(bin.x, bin.y, bin.width, bin.height);

	for (let i = 0; i < intersections.length; i++) {
		const cookie = intersections[i];
		const leftIntersection = cookie.x + cookie.size - bin.x;
		const rightIntersection = bin.x + bin.width - cookie.x;
		const topIntersection = cookie.y + cookie.size - bin.y;
		const bottomIntersection = bin.y + bin.height - cookie.y;
		const leftRightIntersection = Math.min(leftIntersection, rightIntersection);
		const topBotIntersection = Math.min(topIntersection, bottomIntersection);

		if (cookie.vy > 0 && cookie.x > bin.x && cookie.x + cookie.size < bin.x + bin.width) {
			if (cookie.y + cookie.size / 2 > bin.y) {
				cookie.vx = 0;
			}

			if (cookie.y + cookie.size / 2 >= bin.y + bin.height / 2) {
				cookie.remove = true;
				score -= 1;
				randomizeBin();

				if (score <= 0) {
					document.getElementById("decline").disabled = false;
					score = 0;
				}
			}
		} else if (leftRightIntersection < topBotIntersection) {
			if (leftIntersection < rightIntersection) {
				cookie.x = bin.x - cookie.size;
			} else {
				cookie.x = bin.x + bin.width;
			}

			cookie.vx /= -2;
		} else {
			if (topIntersection < bottomIntersection) {
				cookie.y = bin.y - cookie.size;
			} else {
				cookie.y = bin.y + bin.height
			}

			cookie.vy /= -2;
		}
	}
}

function tickPlayer(delta) {
	const movement = PLAYER_SPEED * delta;

	player.y = canvasHeight - player.height;

	if (keys["d"] || keys["ArrowRight"]) {
		player.x += movement;
	}

	if (keys["a"] || keys["ArrowLeft"]) {
		player.x -= movement;
	}

	if (player.x + player.width < 0) {
		player.x = canvasWidth;
	} else if (player.x > canvasWidth) {
		player.x = -player.width;
	}

	if (!player.cookie && player.canPickup) {
		const intersecting = intersectingCookies(player.x, player.y, player.width, player.height);

		if (intersecting[0]) {
			player.cookie = intersecting[0];
		}
	} else if (player.cookie) {
		player.cookie.x = player.x;
		player.cookie.y = player.y;
		player.cookie.vx = player.cookie.vy = 0;

		if (buttons[0]) {
			player.charging = true;
			player.charge += SHOOT_VELOCITY_CHARGE_SPEED * delta;

			if (player.charge > MAX_SHOOT_VELOCITY) {
				player.charge = MAX_SHOOT_VELOCITY;
			}
		} else if (player.charging) {
			shootCookie();

			player.charging = false;
			player.canPickup = false;
			setTimeout(() => {
				player.canPickup = true;
			}, PLAYER_PICKUP_TIMEOUT);
		}
	}

	const playerImage = images["res/player.png"];

	if (playerImage) {
		ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

		if (player.charging) {
			const chargeWidth = player.width * player.charge / MAX_SHOOT_VELOCITY;

			ctx.fillStyle = "green";
			fillRect(ctx, player.x, player.y - 10, player.width, 5);
			ctx.fillStyle = "red";
			fillRect(ctx, player.x, player.y - 10, chargeWidth, 5);
		}
	}
}

function shootCookie() {
	const cookieCenterX = player.cookie.x + player.cookie.size / 2;
	const cookieCenterY = player.cookie.y + player.cookie.size / 2;
	const angle = Math.atan2(mousePos.y - cookieCenterY, mousePos.x - cookieCenterX);

	player.cookie.vx = Math.cos(angle) * player.charge;
	player.cookie.vy = Math.sin(angle) * player.charge;
	player.cookie = null;
	player.charge = 0;
}

function tickCookies(delta) {
	const cookieImage = images["res/cookie.png"];

	cookies = cookies.filter((cookie) => {
		if (cookie.remove) {
			return false;
		}

		let friction = FRICTION * Math.sign(cookie.vx) * delta;

		if (cookie.y + cookie.size >= canvasHeight) {
			cookie.y = canvasHeight - cookie.size + 1;
			cookie.vy /= -2;

			if (Math.abs(cookie.vy) > GRAVITY) {
				cookie.vx += cookie.vy * BOUNCINESS * Math.random() * randomSign();
				cookie.vy -= Math.random() * RANDOM_BOUNCE_FACTOR;
			} else {
				cookie.vy = 0;
				friction *= GROUND_FRICTION_MULTIPLIER;
			}
		} else {
			cookie.vy += GRAVITY * delta;
		}

		if (Math.abs(cookie.vx) > Math.abs(friction)) {
			cookie.vx -= friction;
		} else {
			cookie.vx = 0;
		}

		if (cookie.x <= 0) {
			cookie.x = 0;
			cookie.vx /= -2;
		} else if (cookie.x + cookie.size >= canvasWidth) {
			cookie.x = canvasWidth - cookie.size;
			cookie.vx /= -2;
		}

		cookie.tick(delta);
		cookie.rotation += COOKIE_ROTATION_SPEED * cookie.vx * delta;

		if (cookieImage) {
			ctx.save();
			ctx.translate(cookie.x + cookie.size / 2, cookie.y + cookie.size / 2);
			ctx.rotate(cookie.rotation);
			ctx.drawImage(cookieImage, -cookie.size / 2, -cookie.size / 2, cookie.size, cookie.size);
			ctx.restore();
		}

		return true;
	});
}

function intersectingCookies(x, y, width, height) {
	const intersections = [];

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];

		if (x > cookie.x + cookie.size || x + width < cookie.x) {
			continue;
		}

		if (y > cookie.y + cookie.size || y + height < cookie.y) {
			continue;
		}

		intersections.push(cookie);
	}

	return intersections;
}

class Cookie {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.vx = 0;
		this.vy = 0;
		this.rotation = Math.random() * Math.PI * 2;
		this.remove = false;
	}

	tick(delta) {
		this.x += this.vx * delta;
		this.y += this.vy * delta;
	}
}

function fillCircle(ctx, x, y, width, height) {
	ctx.beginPath();
	ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
	ctx.fill();
}

function drawCircle(ctx, x, y, width, height) {
	ctx.beginPath();
	ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
	ctx.stroke();
}

function fillRect(ctx, x, y, width, height) {
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.fill();
}

function drawRect(ctx, x, y, width, height) {
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
}

function loadImage(path) {
	const img = new Image();

	img.onload = () => {
		images[path] = img;
	};
	img.src = path;
}

function randomSign() {
	return Math.sign(Math.random() - 0.5);
}
