class Population {
	constructor(size) {
		this.size = size;
		this.population = [];
		this.active = [];
		this.generation = 0;
		this.initPopulation();
	}

	initPopulation() {
		for(let i = 0; i < this.size; i++) {
			let snake = new Snake();
			this.population.push(snake);
			this.active.push(snake);
		}
	}

	show() {
		for(let i = 0; i < this.active.length; i++) {
			this.active[i].show();
		}
	}

	update() {
		for(let i = this.active.length - 1; i >= 0; i--) {
			this.active[i].think();
			if(!this.active[i].update()) {
				this.active.splice(i, 1);
			}
		}

		if(!this.active.length) {
			// this.newGeneration();
			return false;
		}
		
		return true;
	}

	newGeneration() {
		this.generation++;
		this.normalizeFitness();
		this.active = this.newPopulation();
		this.population = this.active.slice();
	}

	normalizeFitness() {
		for(let i = 0; i < this.size; i++) {
			this.population[i].setScore(Math.pow(this.population[i].calcPoints(), 2));
		}

		let sum = 0;
		for(let i = 0; i < this.size; i++) {
			sum += this.population[i].getScore();
		}

		for(let i = 0; i < this.size; i++) {
			this.population[i].setFitness(this.population[i].getScore() / sum);
		}

	}

	newPopulation() {
		let newPopulation = [];
		// Sort population by points --- not yet sure this is beneficial ¯\_(ツ)_/¯
		this.population = this.population.sort(function(a, b){return b.calcPoints() - a.calcPoints();});

		for(let i = 0; i < this.population.length; i++) {
			let snake = this.selectFromPopulation();
			newPopulation.push(snake);
		}
		return newPopulation;
	}

	selectFromPopulation() { /*
		let index = 0;
		let r = Math.random();
		while(r > 0) {
			r -= this.population[index].getFitness();
			index += 1;
		}

		index -= 1; */
		let index = Math.floor(Math.random()*10);
		return this.population[index].copy(); 
	}

	longestTail() {
		let max = this.population[0].getTailLength();
		for(let i = 1; i < this.population.length; i++) {
			if(this.population[i].getTailLength() > max) {
				max = this.population[i].getTailLength();
			}
		}

		return max;
	}

	shortestTail() {
		let min = this.population[0].getTailLength();
		for(let i = 1; i < this.population.length; i++) {
			if(this.population[i].getTailLength() < min) {
				min = this.population[i].getTailLength();
			}
		}

		return min;
	}

	averageTail() {
		let sum = 0;
		for (let i = 0; i < this.population.length; i++) {
			sum += this.population[i].getTailLength();
		}
		console.log(`Sum: ${sum}, Len: ${this.population.length}`);
		console.log(this.population);
		return Math.floor(sum/this.population.length);
	}

	getMostPoints() {
		let max = this.population[0].getPoints();
		for(let i = 1; i < this.population.length; i++) {
			if(this.population[i].getPoints() > max) {
				max = this.population[i].getPoints();
			}
		}

		return max;
	}

	bestSnake() {

	}

	getGen() {
		return this.generation;
	}
}