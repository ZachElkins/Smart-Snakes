class Snake {
	constructor(brain) {

		this.x = Math.floor(gridSize/2);//Math.floor(Math.random()*gridSize) //0
		this.y = Math.floor(gridSize/2);//Math.floor(Math.random()*gridSize); //0
		this.vx =0;//Math.floor(Math.random()*3 - 1);; //0
		this.vy = -1;//this.vx ? 0 : Math.floor(Math.random()*3 - 1); //1
		this.tail = 5;
		this.trail = [];
		this.target = null;
		this.createTarget();

		this.framesAlive = 0;
		this.targetsCollected = 0;
		this.points = 0;
		this.score = 0;
		this.fitness = 0;

		this.r = Math.floor(Math.random()*256);
		this.g = Math.floor(Math.random()*256);
		this.b = Math.floor(Math.random()*256);
		this.col = "rgba("+this.r+","+this.g+","+this.b+","+0.5+")";

		if(brain instanceof NeuralNetwork) {
			this.brain = brain.copy();
			this.brain.mutate(mutate);
		} else {
			this.brain = new NeuralNetwork(6, 12, 3);
		}

	}

	show() {
		ctx.fillStyle = "rgba(85, 85, 85, 0.25)";
		for(let i = 0; i < this.trail.length; i++) {
			ctx.fillRect(this.trail[i].x*spaceSize, this.trail[i].y*spaceSize,
				spaceSize, spaceSize);
		}

		ctx.fillStyle = this.col;
		ctx.fillRect(this.x*spaceSize, this.y*spaceSize, spaceSize, spaceSize)

		this.target.show();
	}

	update() {
		this.framesAlive++;

		this.dx = Math.abs(this.x - this.target.x);
		this.dy = Math.abs(this.y - this.target.y);

		this.x += this.vx;
		this.y += this.vy;

		this.dx2 = Math.abs(this.x - this.target.x);
		this.dy2 = Math.abs(this.y - this.target.y);

		if(this.dx > this.dx2) {
			this.points += 1;
		} else if(this.dx < this.dx2){
			this.points -= 1.5;
		}

		if(this.dy > this.dy2) {
			this.points += 1;
		} else if(this.dy < this.dy2){
			this.points -= 1.5;
		}

		if(this.x >= gridSize|| this.x < 0 ||
			this.y >= gridSize || this.y < 0) {
			return false;
		}

		for(let i = 0; i < this.trail.length; i++) {
			if(this.trail[i].x === this.x &&
				this.trail[i].y === this.y) {
				return false;
			}
		}

		this.trail.push({x: this.x, y: this.y})
		while(this.trail.length > this.tail) {
			this.trail.shift();
		}

		if(this.target.getX() == this.x &&
			this.target.getY() == this.y) {
			this.extend(1);
			this.createTarget();
			this.targetsCollected++;
			this.points += 100;
		}

		if(this.points < 0) {
			return false;
		}

		return true;
	}

	think() {
		let inputs = [];

		// is straigh clear?
		if(this.x + this.vx < 0 || this.x + this.vx > gridSize-1 ||
			this.y + this.vy < 0 || this.y + this.vy > gridSize-1) {
			inputs[0] = 0;
		} else {
			for(let i = 0; i < this.trail.length; i++) {
				if(this.x + this.vx == this.trail[i].x &&
					this.y + this.vy == this.trail[i].y) {
					inputs[0] = 0;
					break;
				}
			}
		}
		if(inputs[0] != 0 && inputs[0] != 1) {
			inputs[0] = 1;
		}

		// is the left clear?
		if(this.x + this.move("LEFT").vx < 0 || this.x + this.move("LEFT").vx > gridSize-1 ||
			this.y + this.move("LEFT").vy < 0 || this.y + this.move("LEFT").vy > gridSize-1) {
			inputs[1] = 0;
		} else {
			for(let i = 0; i < this.trail.length; i++) {
				if(this.x + this.move("LEFT").vx == this.trail[i].x &&
					this.y + this.move("LEFT").vy == this.trail[i].y) {
					inputs[1] = 0;
					break;
				}
			}
		}
		if(inputs[1] != 0 && inputs[1] != 1) {
			inputs[1] = 1;
		}

		// is the right clear?
		if(this.x + this.move("RIGHT").vx < 0 || this.x + this.move("RIGHT").vx > gridSize-1 ||
			this.y + this.move("RIGHT").vy < 0 || this.y + this.move("RIGHT").vy > gridSize-1) {
			inputs[2] = 0;
		} else {
			for(let i = 0; i < this.trail.length; i++) {
				if(this.x + this.move("RIGHT").vx == this.trail[i].x &&
					this.y + this.move("RIGHT").vy == this.trail[i].y) {
					inputs[2] = 0;
					break;
				}
			}
		}
		if(inputs[2] != 0 && inputs[2] != 1) {
			inputs[2] = 1;
		}

		// is the target straight?
		if(this.vx == -1 && this.x > this.target.x && this.y == this.target.y) {
			inputs[3] = 1;
		} else if(this.vx == 1 && this.y < this.target.x && this.y == this.target.y) {
			inputs[3] = 1;
		} else if(this.vy == -1 && this.y > this.target.y && this.x == this.target.x) {
			inputs[3] = 1;
		} else if(this.vy == 1 && this.y < this.target.y && this.x == this.target.x) {
			inputs[3] = 1;
		}

		if(!inputs[3]) {
			inputs[3] = 0;
		}

		// is the target to the left?
		if(this.vx == -1 && this.y < this.target.y && this.x == this.target.x) {
			inputs[4] = 1;
		} else if(this.vx == 1 && this.y > this.target.y && this.x == this.target.x) {
			inputs[4] = 1;
		} else if(this.vy == -1 && this.x > this.target.x && this.y == this.target.y) {
			inputs[4] = 1;
		} else if(this.vy == 1 && this.x < this.target.x && this.y == this.target.y) {
			inputs[4] = 1;
		}

		if(!inputs[4]) {
			inputs[4] = 0;
		}

		// is the target to the right?
		if(this.vx == -1 && this.y > this.target.y && this.x == this.target.x) {
			inputs[5] = 1;
		} else if(this.vx == 1 && this.y < this.target.y && this.x == this.target.x) {
			inputs[5] = 1;
		} else if(this.vy == -1 && this.x < this.target.x && this.y == this.target.y) {
			inputs[5] = 1;
		} else if(this.vy == 1 && this.x > this.target.x && this.y == this.target.y) {
			inputs[5] = 1;
		}

		if(!inputs[5]) {
			inputs[5] = 0;
		}

		let output = this.brain.predict(inputs);
		let action = findMaxIndex(output);

		switch(action) {
			case 0:
				this.setV(this.move("LEFT").vx, this.move("LEFT").vy);
				// Turn left
				break;
			case 1:
				this.setV(this.move("RIGHT").vx, this.move("RIGHT").vy);
				// Turn right
				break;
			case 2:
				// Do nothing
				break;
		}
	}

	copy() {
		return new Snake(this.brain);
	}

	createTarget() {
		this.target = new Target(gridSize, gridSize, spaceSize, spaceSize, this.col);
	}
	
	setV(vx, vy) {
		this.vx = vx;
		this.vy = vy;
	}

	move(dir) {
		let x = 0;
		let y = 0;
		if(dir === "LEFT") {
			if(this.vx == 0) {
				x = -1;
				y = 0;
			} else if(this.vy == 0) {
				x = 0;
				y = -1;
			}
		} else if(dir === "RIGHT") {
			if(this.vx == 0) {
				x = 1;
				y = 0;
			} else if(this.vy == 0) {
				x = 0;
				y = 1;
			}
		}

		return {vx: x, vy: y};
	}

	setFitness(fitness) {
		this.fitness = fitness;
	}

	setScore(score) {
		this.score = score;
	}

	extend(l) {
		this.tail += l;
	}

	calcPoints() {
		return this.points * this.targetsCollected /* (this.framesAlive)*/;
	}

	getPoints() {
		return this.points;
	}

	getFitness() {
		return this.fitness;
	}

	getScore() {
		return this.score;
	}

	getBrain() {
		return this.brain;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	getTailLength() {
		return this.tail;
	}
}

function mutate(x) {
	if(Math.random() < 0.5) {
		let offset = Math.nrand() * 0.75;
		let newx = x + offset;
		return newx;
	}

	return x;
}