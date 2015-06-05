var paused = false;
var counter = 0;

function lClick() {
	//a.run();
	
	if (paused) {
	    a._intervalId = setInterval(a.run, 1000/a.fps);
	    paused = false;
	}
	
}

function rClick() {
	clearInterval(a._intervalId);
	paused = true;
	return false;
}

function begin() {
	clearInterval(a._intervalId);
	for(var i = 0; i < a.qty; i++) {
		a.rocks[i] = {};
		a.rocks[i] = new generateRock(a.points,i);
		a.rocks[i].id = i;
		moveRock(a.rocks[i], ((i%2)+0.5)*c.wide/2, (Math.floor(i/2)+0.5)*c.high/2);
		/*
		moveRock(a.rocks[i], 150, c.high/2);
		if (i == 1 || i == 2) moveRock(a.rocks[i], 150, 0);
		if (i == 2) moveRock(a.rocks[i], 0, -c.high/2+61);
		*/
		generalMotion(a.rocks[i], 0);
		
	}
	a._intervalId = setInterval(a.run, 1000/a.fps);
	//a.run();
}

a.run = function() {
	c.ctx.clearRect(0,0,c.wide,c.high);
	addGrid();
	
	//find the fastest linear velocity of any point on the screen
	var absMaxSpeed = 0;
	for(var i = 0; i < a.rocks.length; i++) {
		a.rocks[i].impulse = [];
		absMaxSpeed = Math.max(absMaxSpeed, maxSpeed(a.rocks[i]));
		a.rocks[i].step = true;
		a.rocks[i].colour.current = a.rocks[i].colour.base;
	}
	var maxNumSteps = 1*Math.ceil(absMaxSpeed);
	
	//step enough times that no point moves by more than a pixel at once
	for (var k = 0; k < maxNumSteps; k++) {
		for(var i = 0; i < a.rocks.length; i++){
			for(var j = i + 1; j < a.rocks.length; j++){
				if(a.rocks[i].step){ //if the rock is allowed to move, check if it will colide in the next small step
					if(distance(a.rocks[i].pos, a.rocks[j].pos) < a.rocks[i].maxRad + a.rocks[j].maxRad){ //coarse collision check
						if(a.rocks[i].colour.current != a.colour.colide) a.rocks[i].colour.current = a.colour.nearMiss;
						if(a.rocks[j].colour.current != a.colour.colide) a.rocks[j].colour.current = a.colour.nearMiss;
						
						if(checkOverlap(a.rocks[i], a.rocks[j])){
							
							a.rocks[i].colour.current = a.colour.colide;
							a.rocks[j].colour.current = a.colour.colide;
							a.rocks[i].step = false;
							
							//find the point of impact and unit normal (this is corrupting the speeds right now)
							var tempData = getCollisionData(a.rocks[i], a.rocks[j]);
				
							//rClick();
							drawLine(tempData.P, vAdd(tempData.P, vScale(tempData.N, 400)));
							
							if (checkCollisions(a.rocks[i], a.rocks[j], tempData) >= 0) {
								//handle the i rocks
								a.rocks[i].impulse.push({'data': tempData, 'mate': a.rocks[j]});
								if(tempData.flag){ //flag: true means i is an edge rock
									a.rocks[i].impulse[a.rocks[i].impulse.length - 1].j = -rigidResponse(a.rocks[j], a.rocks[i], tempData.P, tempData.N);
								} else {
									a.rocks[i].impulse[a.rocks[i].impulse.length - 1].j = rigidResponse(a.rocks[i], a.rocks[j], tempData.P, tempData.N);
								}

								//handle the j rocks
								a.rocks[j].impulse.push({'data': tempData, 'mate': a.rocks[i]});
								if(tempData.flag){ //flag: true means i is an edge rock
									a.rocks[j].impulse[a.rocks[j].impulse.length - 1].j = rigidResponse(a.rocks[j], a.rocks[i], tempData.P, tempData.N);
								} else {
									a.rocks[j].impulse[a.rocks[j].impulse.length - 1].j = -rigidResponse(a.rocks[i], a.rocks[j], tempData.P, tempData.N);
								}
							}
						}
					}
				}
			}
			if (a.rocks[i].step) {//if the rock hasn't colided, move it
				generalMotion(a.rocks[i],1/maxNumSteps);
			}
		}						
	}
	

	
	for(var i = 0; i < a.rocks.length; i++){
		for(var j = 0; j < a.rocks[i].impulse.length; j++){
			applyImpulse(a.rocks[i], a.rocks[i].impulse[j].j, a.rocks[i].impulse[j].data.N, a.rocks[i].impulse[j].data.P);
			//generalMotion(a.rocks[i], 1/maxNumSteps);
		}
	}

	for(var i = 0; i < a.rocks.length; i++){
		edgeCheck(a.rocks[i]);
		for(var j = 0; j < a.rocks[i].impulse.length; j++){
			//goodFix(a.rocks[i], a.rocks[i].impulse[j].mate, maxNumSteps);
		}
	}
	
	var totalEnergy = 0;
	for (var k = 0; k < a.rocks.length; k++) {
		totalEnergy += 0.5*a.rocks[k].M*Math.pow(Math.sqrt(a.rocks[k].speed.x*a.rocks[k].speed.x + a.rocks[k].speed.y*a.rocks[k].speed.y),2)
		totalEnergy += 0.5*a.rocks[k].I*Math.pow(a.rocks[k].speed.r,2)
	}
	
	/*
	counter++;
	counter %= 40
	if (counter == 0) {
		var totalEnergy = 0
			
		for (var i = 0; i < a.rocks.length; i++) {
			totalEnergy += 0.5*a.rocks[i].M*Math.pow(Math.sqrt(a.rocks[i].speed.x*a.rocks[i].speed.x + a.rocks[i].speed.y*a.rocks[i].speed.y),2)
			totalEnergy += 0.5*a.rocks[i].I*Math.pow(a.rocks[i].speed.r,2)
		}
		console.log(+totalEnergy.toFixed(4));
	}
	*/
	
	for(var i = 0; i < a.rocks.length; i++){
		trace(a.rocks[i]);
		if(a.rocks[i].impulse.length >= 2){
			console.log(a.rocks[i].impulse.length + 1);
			//rClick();
		}
	}
}

function magnum(N){ return Math.sqrt(N.x*N.x + N.y*N.y); }