//function to generate arrays of points
function generateRock(ppr,index) {
	
	this.colour = {};
	this.colour.base = a.colour.base;
	this.colour.current = this.colour.base;
	
	this.impulse = [];

	var spread = Math.PI*2/ppr;
	var radius;
	var i;
		
	//fill the coord arrays with values
	this.bCoords = [];
	this.tCoords = [];
	this.maxRad = 0;
	
	if (index == 0) {
		this.bCoords.push({'x': -20, 'y': -60})
		this.bCoords.push({'x': 20, 'y': -60})
		//this.bCoords.push({'x': 40, 'y': 10})
		//this.bCoords.push({'x': 36, 'y': 15})
		//this.bCoords.push({'x': 40, 'y': 20})
		this.bCoords.push({'x': 20, 'y': 60})
		this.bCoords.push({'x': -20, 'y': 60})
	}
	
	if (index == 1) {
		this.bCoords.push({'x': -20, 'y': -30})
		this.bCoords.push({'x': 20, 'y': -30})
		this.bCoords.push({'x': 20, 'y': 30})
		this.bCoords.push({'x': -20, 'y': 30})
		//this.bCoords.push({'x': -20, 'y': 0.0001})
		this.bCoords.push({'x': -20, 'y': -30})
		//this.bCoords.push({'x': -20, 'y': -0.9999})
	}
	
	if (index == 2) {
		this.bCoords.push({'x': -20, 'y': -30})
		this.bCoords.push({'x': 20, 'y': -30})
		this.bCoords.push({'x': 20, 'y': 30})
		this.bCoords.push({'x': -20, 'y': 30})
		//this.bCoords.push({'x': -20, 'y': 0.0001})
		//this.bCoords.push({'x': -21, 'y': 0})
		//this.bCoords.push({'x': -20, 'y': -0.9999})
	}
	
	for(i = 0; i < this.bCoords.length; i++) {
		//this.bCoords[i] = {};
		this.tCoords[i] = {};
			
		//this.bCoords[i].r = c.wide/c.divisions// * (1 + index)/2;
			
		//this.bCoords[i].x = this.bCoords[i].r * Math.cos(spread*(i-1));
		//this.bCoords[i].y = this.bCoords[i].r * Math.sin(spread*(i-1));
		
		this.bCoords[i].r =  magnum(this.bCoords[i])
		if(this.bCoords[i].r > this.maxRad) {this.maxRad = this.bCoords[i].r;}
		
		this.tCoords[i].x = this.bCoords[i].x;
		this.tCoords[i].y = this.bCoords[i].y;
		this.tCoords[i].r = this.bCoords[i].r;
	}

	//now calculate areas and centroids
	this.tComs = [];
	this.tAreas = [];

	var sumproductX = 0;
	var sumproductY = 0;				
	var total = 0;
	this.bCom = {};
	this.tCom = {};
	
	for(i = 0; i < this.bCoords.length; i++) {
		this.tComs[i] = {};
		this.tComs[i].x = (this.bCoords[i].x + this.bCoords[(i+1)%ppr].x)/3;
		this.tComs[i].y = (this.bCoords[i].y + this.bCoords[(i+1)%ppr].y)/3;
		
		//traingle area
		this.tAreas[i] = 0.5 * this.bCoords[i].r * this.bCoords[(i+1)%ppr].r * Math.sin(spread);
			 
		sumproductX += this.tComs[i].x * this.tAreas[i];
		sumproductY += this.tComs[i].y * this.tAreas[i];
		total += this.tAreas[i];
	}
	
	this.bCom.x = 0//sumproductX/total;
	this.bCom.y = 0//sumproductY/total;
		
	//move all the points so the CoM is the new origin
	for(i = 0; i < this.bCoords.length; i++) {
		this.bCoords[i].x -= this.bCom.x;
		this.bCoords[i].y -= this.bCom.y;
		this.tComs[i].x -= this.bCom.x;
		this.tComs[i].y -= this.bCom.y;
	}
	this.bCom.x = 0;
	this.tCom.x = this.bCom.x;
	this.bCom.y = 0;
	this.tCom.y = this.bCom.x;

	//prepare movement properties
	this.pos = {};
	this.pos.x = 0;
	this.pos.y = 0;
	this.pos.r = 0;
	
	this.M = total;
	this.M = 8000
	if (index == 1 || index == 2) this.M = 4000
	console.log(this.M)
	//if (index == 0) this.M = Infinity;
	this.E = 1;
	
	this.I = 0;
	
	/*var j = this.tCoords.length - 1;
	var numerator = 0;
	var denominator = 0;
	var p = this.tCoords;
	for(var i = 0; i < p.length; i++){
		numerator += (p[j].x*p[j].x + p[j].y*p[j].y + p[j].x*p[i].x + p[j].y*p[i].y + p[i].x*p[i].x + p[i].y*p[i].y)*(p[j].x*p[i].y - p[i].x*p[j].y);
		denominator += p[j].x*p[i].y - p[i].x*p[j].y;
		j = i;
	}
	this.I = numerator/denominator*this.M/6;
	*/
	
	this.I = Math.PI/2*Math.pow(this.maxRad, 4);
	
	//prepare speeds
	this.speed = {};
	this.speed.x = a.speeeed * (Math.random()*2 - 1) * c.wide/c.divisions / a.fps;
	this.speed.y = a.speeeed * (Math.random()*2 - 1) * c.high/c.divisions / a.fps;
	this.speed.r = 0;//a.speeeed * (Math.random()*2 - 1) / a.fps;
	
	//this.speed.x = 0
	//this.speed.y = 0
	//this.speed.r = 0
	
	if (index == 0) {
		this.speed.y = 0;
		this.speed.x = 0;
		//this.pos.r = Math.PI/4;
	}
	if (index == 1 || index == 2) {
		this.speed.y = 0;
		this.speed.x = -a.speeeed;
		//this.pos.r = Math.PI/4;
	}/*
	if (index == 4) {
		this.speed.x = 0
		this.speed.y = -a.speeeed*4
	}*/
}
	
function moveRock(shape, x, y) {
    shape.pos.x += x;
    shape.pos.y += y;
}