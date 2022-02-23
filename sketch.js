
let canvas;
let ctx;

let speed;
let dispSpeed;
let dispGen;
let dispCurrentLongest;
let dispLongestOverall;

let gridSize = 100;
let spaceSize;

let population;
let size = 750;
let longest = 0;
let bestGen = 0;

let cycles;

let updateChart = true;
let xAxis = ['x'];
let dataLongest = ['Longest'];
let dataAverage = ['Average'];
let dataShortest = ['Shortest'];
let chart;

window.onload = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	dispSpeed = document.getElementById("display-speed");
	speed = document.getElementById("speed");
	dispGen = document.getElementById("display-generation");
	dispCurrentLongest = document.getElementById("current-longest");
	dispLongestOverall = document.getElementById("longest-overall");

	spaceSize = canvas.width / gridSize;

	population = new Population(size);

	chart = c3.generate({
		bindto: '#chart',
		size: {
			height: 250,
			width: 500
		},
		data: {
			x: 'x',
			columns: [
				xAxis,
				dataLongest,
				dataAverage,
				dataShortest
			],
			types: {
				Average: 'bar'
			}
		},
		axis: {
			y: {
				label: {
					text: 'Tail Length',
					position: 'outer-middle'
				}
			},
			x: {
				label: {
					text: 'Generation',
					position: 'center'
				}
			}
		}
	});
	requestAnimationFrame(update);
};

function draw() {
	ctx.fillStyle = "#efefef";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	population.show();

	requestAnimationFrame(update);
}

function update() {

	for (var i = 0; i < speed.value; i++) {
		dispSpeed.innerHTML = "Learning Speed | " + speed.value;
		dispGen.innerHTML = "Current Generation | " + population.getGen();
		dispCurrentLongest.innerHTML = "Current Longest | " + population.longestTail();

		if(population.longestTail() > longest && updateChart) {
			longest = population.longestTail();
			bestGen = population.getGen();
			dispLongestOverall.innerHTML = "Longest Overall | " + longest + " (Gen " + bestGen + ")";
		}

		if(!population.update()) {
				xAxis.push(population.getGen());
				console.log("here")
				dataLongest.push(population.longestTail());
				dataAverage.push(population.averageTail());
				dataShortest.push(population.shortestTail());

				chart.load({
  					columns: [
  						xAxis,
						dataLongest,
						dataAverage,
						dataShortest
  					]
				});

			population.newGeneration();
		}
	}

	requestAnimationFrame(draw);
}


function findMaxIndex(list) {
	let max = list[0];
	let index = 0;
	for(let i = 1; i < list.length; i++) {
		if(list[i] > max) {
			max = list[i];
			index = i;
		}
	}
	return index;
}

Math.nrand = function() {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * this.random() - 1;
		x2 = 2 * this.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);
	var c = this.sqrt(-2 * Math.log(rad) / rad);
	return x1 * c;
};