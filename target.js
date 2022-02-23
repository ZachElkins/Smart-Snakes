class Target {
	constructor(x, y, w, h, c) {
		this.w = w;
		this.h = h;
		this.x = Math.floor(Math.random()*x);
		this.y = Math.floor(Math.random()*y);
		this.col = c;
	}

	show() {
		ctx.fillStyle = this.col;//"#ff00ff";//"rgba(252, 239, 111, 0.75)";
		ctx.fillRect(this.x*this.w, this.y*this.h, this.w, this.h);
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}
}