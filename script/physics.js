function goodFix(shape, shape2, numSteps) {
//slides objects apart gemoetrically for collision resolution

	while(checkOverlap(shape,shape2))  {

		var M = 2*distance(shape.pos,shape2.pos)
		var Nx = (shape.pos.x-shape2.pos.x)/M
		var Ny = (shape.pos.y-shape2.pos.y)/M
		
		shape.pos.x += Nx;
		shape.pos.y += Ny;
		shape.pos.r += shape.speed.r/M
		shape2.pos.x -= Nx;
		shape2.pos.y -= Ny;
		shape2.pos.r += shape2.speed.r/M
		
		for(var i = 0; i < shape.bCoords.length; i++) {
			//rotations
			shape.tCoords[i].x = shape.bCoords[i].x*Math.cos(shape.pos.r) - shape.bCoords[i].y*Math.sin(shape.pos.r);
			shape.tCoords[i].y = shape.bCoords[i].x*Math.sin(shape.pos.r) + shape.bCoords[i].y*Math.cos(shape.pos.r);
			//translations
			shape.tCoords[i].x = shape.tCoords[i].x + shape.pos.x;
			shape.tCoords[i].y = shape.tCoords[i].y + shape.pos.y;
		}
		for(var i = 0; i < shape2.bCoords.length; i++) {
			//rotations
			shape2.tCoords[i].x = shape2.bCoords[i].x*Math.cos(shape2.pos.r) - shape2.bCoords[i].y*Math.sin(shape2.pos.r);
			shape2.tCoords[i].y = shape2.bCoords[i].x*Math.sin(shape2.pos.r) + shape2.bCoords[i].y*Math.cos(shape2.pos.r);
			//translations
			shape2.tCoords[i].x = shape2.tCoords[i].x + shape2.pos.x;
			shape2.tCoords[i].y = shape2.tCoords[i].y + shape2.pos.y;
		}
	}
}

function generalMotion(shape, modifier) {
//applies movement properties to objects

	//translation is px/frame, rotation in radians/frame
	shape.pos.x += modifier*shape.speed.x;
	shape.pos.y += modifier*shape.speed.y;
	shape.pos.r += modifier*shape.speed.r;
	shape.pos.r %= 2*Math.PI;

	for(var i = 0; i < shape.bCoords.length; i++) {
		//rotations
		shape.tCoords[i].x = shape.bCoords[i].x*Math.cos(shape.pos.r) - shape.bCoords[i].y*Math.sin(shape.pos.r);
		shape.tCoords[i].y = shape.bCoords[i].x*Math.sin(shape.pos.r) + shape.bCoords[i].y*Math.cos(shape.pos.r);
		//translations
		shape.tCoords[i].x = shape.tCoords[i].x + shape.pos.x;
		shape.tCoords[i].y = shape.tCoords[i].y + shape.pos.y;
	}
	
	//console.log(shape.speed);
	
	
	//probably don't need these lines
	shape.tCom.x = shape.bCom.x + shape.pos.x;
	shape.tCom.y = shape.bCom.y + shape.pos.y;
}

function checkCollisions(item1, item2, collisionInfo){

	var v1 = {};
	v1.x = item1.speed.x;
	v1.y = item1.speed.y;
	v1.r = item1.speed.r;
	
	var v2 = {};
	v2.x = item2.speed.x;
	v2.y = item2.speed.y;
	v2.r = item2.speed.r;	
	
	var r1P = vSub(item1.pos,collisionInfo.P);
	var r2P = vSub(item2.pos,collisionInfo.P);
	
	var v12 = {};
	v12.x = v1.x + (-v1.r*r1P.y) - v2.x - (-v2.r*r2P.y);
	v12.y = v1.y + (v1.r*r1P.x) - v2.y - (v2.r*r2P.x);
	
	console.log(dProduct(v12, collisionInfo.N)*(2*collisionInfo.flag-1))
	return dProduct(v12, collisionInfo.N)*(2*collisionInfo.flag-1);
	
	//this stuff is in checkOverlap now
	// for(var i = 0; i < item1.tCoords.length; i++){
		// if(pointInPolygon(item1.tCoords[i], item2.tCoords)){
			// return true;
		// }
	// }
	
	// for (i = 0; i < item2.tCoords.length; i++) {
		// if (pointInPolygon(item2.tCoords[i],item1.tCoords)) {
			// return true;
		// }
	// }
	// return false;
}

function pointInPolygon(point, poly) {
//check if a point is in a polygon

	var colide = false;
	
	var j = a.points - 1;
	for (var i=0; i < a.points; i++){
		if (poly[i].y < point.y && poly[j].y >= point.y ||  poly[j].y < point.y && poly[i].y >= point.y) {
			if ((poly[j].x - poly[i].x)/(poly[j].y - poly[i].y)*(point.y - poly[i].y) + poly[i].x >= point.x) {
				colide = !colide;
			}
		}
		j = i;
	}
	return colide;
}

function checkOverlap(item1, item2){
//quickly checks overlap between two objects

	for(var i = 0; i < item1.tCoords.length; i++){
		if(pointInPolygon(item1.tCoords[i], item2.tCoords)) {
			//console.log(item1.speed,item2.speed);
			return true;
		}
	}
	
	for (i = 0; i < item2.tCoords.length; i++) {
		if (pointInPolygon(item2.tCoords[i],item1.tCoords)) {
			//console.log(item1.speed,item2.speed);
			return true;
		}
	}
	
	return false;
}

function getCollisionData(item1, item2){
//finds the direction vector and point of application of an impulse

    var obj = {};
	obj.P = {};
	obj.N = {}
	obj.flag = false;
	var pointsInside = [];
	
	//checking item1 in item2
	for(var i = 0; i < item1.tCoords.length; i++){
		if(pointInPolygon(item1.tCoords[i], item2.tCoords)){
			pointsInside.push(item1.tCoords[i]);
		}
	}
	
	if (pointsInside.length != 0) {
	
		
		if (pointsInside.length > 1) {
			obj.P = vAvg(pointsInside);
			rClick();
		} else {
			obj.P = {'x': pointsInside[0].x, 'y': pointsInside[0].y} ;
		}
		
		for (var k = 0; k < item2.tCoords.length; k++) {
			var l = k + 1;
			if (l > item2.tCoords.length - 1)
				l = 0;
			if (intersect(obj.P, item1.pos,item2.tCoords[k], item2.tCoords[l])){
				console.log(obj.P)
				obj.N = findNormal(vSub(item2.tCoords[l], item2.tCoords[k]));
				obj.flag = false;
				return obj;
			}
		}
		
		for (var k = 0; k < item2.tCoords.length; k++) {
			var l = k + 1;
			if (l > item2.tCoords.length - 1) l = 0;
			if (intersect(pointsInside[0], item1.pos,item2.tCoords[k], item2.tCoords[l])){
				obj.N = findNormal(vSub(item2.tCoords[l], item2.tCoords[k]));
				obj.flag = false;
				return obj;
			}
				
		}
		
		obj.N.x = (obj.P.x - item2.tCom.x)/Math.sqrt((obj.P.x - item2.tCom.x)*(obj.P.x - item2.tCom.x)+(obj.P.y - item2.tCom.y)*(obj.P.y - item2.tCom.y))
		obj.N.y = (obj.P.y - item2.tCom.y)/Math.sqrt((obj.P.x - item2.tCom.x)*(obj.P.x - item2.tCom.x)+(obj.P.y - item2.tCom.y)*(obj.P.y - item2.tCom.y))
		
		console.log("FAKE NORMAL", "ROCK: " + item1.id, pointsInside + "POINTS INSIDE");
		rClick();
		obj.flag = false;
		
		return obj;
	}

	pointsInside = [];
	
	//checking item2 in item1
	for (i = 0; i < item2.tCoords.length; i++) {
		if (pointInPolygon(item2.tCoords[i], item1.tCoords)) {
			pointsInside.push(item2.tCoords[i]);
		}
	}
	
	if (pointsInside.length != 0) {
	
		
		if (pointsInside.length > 1) {
			obj.P = vAvg(pointsInside);
			rClick();
		} else {
			obj.P = {'x': pointsInside[0].x, 'y': pointsInside[0].y} ;
		}
		
		
		for (var k = 0; k < item1.tCoords.length; k++) {
			var l = k + 1;
			if (l > item1.tCoords.length - 1) l = 0;
			if (intersect(obj.P, item2.pos, item1.tCoords[k], item1.tCoords[l])){
				console.log(obj.P)
				obj.N = findNormal(vSub(item1.tCoords[l], item1.tCoords[k]));
				obj.flag = true;
				return obj;
			}
		}
	
		for (var k = 0; k < item1.tCoords.length; k++) {
			var l = k + 1;
			if (l > item1.tCoords.length - 1) l = 0;
			if (intersect(pointsInside[0], item2.pos,item1.tCoords[k], item1.tCoords[l])){
				obj.N = findNormal(vSub(item1.tCoords[l], item1.tCoords[k]));
				obj.flag = false;
				return obj;
			}	
		}
		
		obj.N.x = (obj.P.x - item1.tCom.x)/Math.sqrt((obj.P.x-item1.tCom.x)*(obj.P.x-item1.tCom.x)+(obj.P.y-item1.tCom.y)*(obj.P.y-item1.tCom.y))
		obj.N.y = (obj.P.y - item1.tCom.y)/Math.sqrt((obj.P.x-item1.tCom.x)*(obj.P.x-item1.tCom.x)+(obj.P.y-item1.tCom.y)*(obj.P.y-item1.tCom.y))
		
		console.log("FAKE NORMAL", "ROCK: " + item2.id, pointsInside + "POINTS INSIDE");
		rClick();
		obj.flag = true;
		
		return obj;
	}
	
	return obj;
}

function rigidResponse (item1, item2, P, N) { 
//returns impulse magnitude for two colliding objects, point of collision and surface normal vector

	var rAP = vSub(item1.pos,P);
	var rBP = vSub(item2.pos,P);
	
	var vAB = {};
	vAB.x = item1.speed.x + (-item1.speed.r * rAP.y) - item2.speed.x - (-item2.speed.r * rBP.y);
	vAB.y = item1.speed.y + (item1.speed.r * rAP.x) - item2.speed.y - (item2.speed.r * rBP.x);
	
	var e = Math.min(item1.E, item2.E);
	
	return (-(1 + e)*(vAB.x*N.x + vAB.y*N.y))/(1/item1.M + 1/item2.M + Math.pow((rAP.x*N.y - rAP.y*N.x),2)/item1.I + Math.pow((rBP.x*N.y - rBP.y*N.x),2)/item2.I);
}

function applyImpulse (object, j, N, P) {
//applies impluse to change velocity of object given an object, impulse, direction vector and point of application
	
	var rP = vSub(object.pos,P);
	
	object.speed.x += (j*N.x)/object.M;
	object.speed.y += (j*N.y)/object.M;
	object.speed.r += (rP.x * j * N.y - rP.y * j * N.x)/object.I;
}

function maxSpeed(object) {
//returns the instantaneuos linear speed of the fastes point in an object

	var maximum = 0;
    for(var i = 0; i < object.tCoords.length; i++){
		var point = object.tCoords[i];
		var tempSpeed = {};
		var pointAngle = Math.atan2(point.y, point.x);
		tempSpeed.x = Math.cos(pointAngle)*point.r*object.speed.r + object.speed.x;
		tempSpeed.y = Math.sin(pointAngle)*point.r*object.speed.r + object.speed.y;
		maximum = Math.max(maximum, Math.sqrt(Math.pow(tempSpeed.x, 2), Math.pow(tempSpeed.y, 2)));
	}
	return maximum;
}

function edgeCheck (shape) {
//turns an object around if it's headed off the edge

	if(shape.pos.y < -c.high/c.divisions || shape.pos.y > c.high*(1 + 1/c.divisions)) shape.speed.y = -shape.speed.y;
	if(shape.pos.x < -c.wide/c.divisions || shape.pos.x > c.wide*(1 + 1/c.divisions)) shape.speed.x = -shape.speed.x;
}
