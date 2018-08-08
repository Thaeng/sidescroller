var player, floorHeight, blockSpawner;
function setup() {
	createCanvas(windowWidth, windowHeight);
	player = new unitPlayer(50, 50);
	blockSpawner = new BlockSpawner();
	frameRate(100);
}

function draw() {
	background(90);
	drawFloor();
	blockSpawner.maybeSpawn();
	for(var i = 0; i < blockSpawner.block.length; i++){
		blockSpawner.block[i].drawBlock();
	}
	player.drawBody();
}

function unitPlayer(sizeX, sizeY) {
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.offsetY = 0;
	this.offsetX = 0;
	this.orientation = radians(0);
	this.isJumping = false;
	var x = 0;
	var y = 0;
	var reachedTop = false;
	var jumpHeight = 400;
	var finalOffsetY = 0;
	var countAfterImages = 5;
	var afterImages = [ countAfterImages ];
	var afterImagesOrientation = [ countAfterImages ];
	var counter = 0;
	var finalCounter = 0;
	var heading = "right";

	this.drawBody = function() {
		if ("right" == heading) {
			this.drawAfterImage(x, y, this.orientation, this.sizeX, this.sizeY);
		} else if ("left" == heading) {
			this.drawAfterImage(x, y, -1 * this.orientation, this.sizeX,
					this.sizeY);
		}
		push();
		this.checkBehavior();
		rectMode(CENTER);
		x = width * 0.15 - this.offsetX;
		y = (floorHeight - this.sizeY / 2) - finalOffsetY;
		translate(x, y);
		if ("right" == heading) {
			rotate(this.orientation);
		} else if ("left" == heading) {
			rotate(-1 * this.orientation);
		}
		fill(color(100, 200, 100));
		rect(0, 0, this.sizeX, this.sizeY, 40, 40, 0, 0);
		pop();
	}

	this.checkBehavior = function() {
		if (this.isJumping == true) {
			this.jump();
		}
		if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
			this.offsetX += 6;
			heading = "left";
		} else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
			this.offsetX -= 6;
			heading = "right";
		}
		if (keyIsDown(UP_ARROW) || keyIsDown(32) || keyIsDown(87)) {
			player.isJumping = true;
		}
	}

	this.jump = function() {
		this.orientation += radians(360 / 40);
		this.offsetY++;
		finalOffsetY = 0.4 * (-1
				* ((this.offsetY - sqrt(jumpHeight)) * (this.offsetY - sqrt(jumpHeight))) + jumpHeight);
		if (finalOffsetY < 0) {
			this.offsetY = 0;
			this.isJumping = false;
			finalOffsetY = 0;
			this.orientation = radians(0);
		}
	}

	this.drawAfterImage = function(x, y, orientation, sizeX, sizeY) {
		afterImages[counter] = createVector(x, y);
		afterImagesOrientation[counter] = orientation;

		for (var i = 0; i < finalCounter; i++) {
			push();
			rectMode(CENTER);
			noStroke();
			translate(afterImages[i].x, afterImages[i].y);
			rotate(afterImagesOrientation[i]);
			fill(color(140, 220, 0, 20));
			rect(0, 0, sizeX, sizeY, 40, 40, 0, 0);
			pop();
		}
		counter++;
		finalCounter++;
		if (counter >= countAfterImages) {
			counter = 0;
		}
		if (finalCounter > countAfterImages) {
			finalCounter = countAfterImages;
		}
	}

}

function drawFloor() {
	floorHeight = height * 0.7;
	push();
	fill(200);
	rect(0, floorHeight, width, height - floorHeight);
	pop();
}

function BlockSpawner() {
	this.block = [];
	this.counter = 0;
	
	this.maybeSpawn = function() {
		this.counter++;
		if (this.counter === 80) {
			var x = 0;
			var y = randomIntFromInterval(0,floorHeight);
			var sizeX = randomIntFromInterval(100,300);
			var sizeY = randomIntFromInterval(10,50);
			var speed = randomIntFromInterval(1,5);
			this.block.push(new block(x,y,sizeX,sizeY,speed));
			this.counter = 0;
		}
	}
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function block(x, y, sizeX, sizeY, speed) {
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.speed = speed;
	this.x = x;
	this.y = y;

	this.move = function() {
		this.x = this.x + speed;
	}
	this.drawBlock = function() {
		this.move();
		push();
		fill(200, 100, 200);
		rect(this.x, this.y, this.sizeX, this.sizeY);
		pop();
	}

}
