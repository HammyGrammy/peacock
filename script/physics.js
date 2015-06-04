/*
Goal for physics library - Pass objects in, get impulses out

-------------------------------
short term - impulse resolution
-------------------------------

Collisions
	(check) point in poly
	(reaction) moment of inertia/area, mass and velocities
	return the impulse and direction vector so we can resolve the other forces
	restitution

ropes and cables
	tension calculator (use impulses, not forces)
	how do bodies joined by a cable rotate?
	
deformation and splitting
	sound effects
	decide the split path
	absorbs some impulse????
	
explosions
	ray casting algorithm (force decays with distance)
	orthogonal component of cast rays	
	
gravity
	classical mechanics for attractive forces
	maybe passive attraction between everything?
	Gravity wells are the only attractive objects
	Fields needn't be circular, they could be normal to closest surface	

propulsion
	subset of explosions???
	constant linear force	
		
* Remember that all constant forces are pulsed at a 1 frame interval

--------------------
Freaky Stretch goals
--------------------

light
	force due to light???
	heating due to light???
	radiation???
	scattering and refelecting light (ray tracing)
	

electricity
	determine electric potentials from dissimilar materials
	account for effects of electrolyte
	
thermal
	conduction of heat
	radiation
	change of state (could exert forces???)
	expansion (could exert forces???)
	
---------------------------
do these things every frame
---------------------------

	1) resolve all the impulses
	2) resolve the deformations to decrease impulses
	3) then find changes in velocity and angular velocity
	4) calculate movements
*/

function rigidResponse (objectA,objectB,P,N) { 
	//takes in two colliding objects, point of collision, surface normal vector
	//returns impulse magnitude

	var mA = objectA.M;
	var mB = objectB.M;
	
	var IA = objectA.I;
	var IB = objectB.I;
	
	var vAx1 = objectA.speed.x;
	var vAy1 = objectA.speed.y;
	var vAr1 = objectA.speed.r;
	
	var vBx1 = objectB.speed.x;
	var vBy1 = objectB.speed.y;
	var vBr1 = objectB.speed.r;
	
	var rAP = vSubtract(objectA.pos,P);
	var rBP = vSubtract(objectB.pos,P);
	
	var vABx = vAx1 + (-vAr1*rAP.y) - vBx1 - (-vBr1*rBP.y);
	var vABy = vAy1 + (vAr1*rAP.x) - vBy1 - (vBr1*rBP.x);
	
	var e = Math.min(objectA.E, objectB.E);
	
	return (-(1 + e)*(vABx*N.x + vABy*N.y))/(1/mA + 1/mB + Math.pow((rAP.x*N.y - rAP.y*N.x),2)/IA + Math.pow((rBP.x*N.y - rBP.y*N.x),2)/IB);
}
function edgeCheck (shape) {
	//bounce off the top and bottom
	if(shape.pos.y < -c.high/c.divisions || shape.pos.y > c.high*(1 + 1/c.divisions)) shape.speed.y = -shape.speed.y;/*{
		shape.speed.y += a.speeeed/10;
	} else if(shape.pos.y > c.high) {
		shape.speed.y -= a.speeeed/10; 
	}*/
	//bounce off the sides
	if(shape.pos.x < -c.wide/c.divisions || shape.pos.x > c.wide*(1 + 1/c.divisions)) shape.speed.x = -shape.speed.x;/*{
		shape.speed.x += a.speeeed/10;
	} else if(shape.pos.x > c.wide) {
		shape.speed.x -= a.speeeed/10; 
	}*/
}

function applyImpulse (object, j, N, P) {
	//takes in an object, impulse, direction vector and point of application,
	//applies impluse to cause change in velocity of object
	
	rP = vSubtract(object.pos,P);
	
	object.speed.x += (j*N.x)/object.M;
	object.speed.y += (j*N.y)/object.M;
	object.speed.r += (rP.x * j * N.y - rP.y * j * N.x)/object.I;
}

function goodFix(shape, shape2, numSteps) {

	while(checkCollisions(shape,shape2))  {

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
	//translation is px/frame, rotation in radians/frame
	shape.pos.x += modifier*shape.speed.x;
	shape.pos.y += modifier*shape.speed.y;
	shape.pos.r += modifier*shape.speed.r;
	shape.pos.r %= 2*Math.PI;
	
	//console.log(shape.pos.r);
	
	var redraw = false;

	for(var i = 0; i < shape.bCoords.length; i++) {
		//rotations
		shape.tCoords[i].x = shape.bCoords[i].x*Math.cos(shape.pos.r) - shape.bCoords[i].y*Math.sin(shape.pos.r);
		shape.tCoords[i].y = shape.bCoords[i].x*Math.sin(shape.pos.r) + shape.bCoords[i].y*Math.cos(shape.pos.r);
		//translations
		shape.tCoords[i].x = shape.tCoords[i].x + shape.pos.x;
		shape.tCoords[i].y = shape.tCoords[i].y + shape.pos.y;
	}
	shape.tCom.x = shape.bCom.x + shape.pos.x;
	shape.tCom.y = shape.bCom.y + shape.pos.y;
}
//function to quickly check overlaps
function checkCollisions(item1, item2){
	for(var i = 0; i < item1.tCoords.length; i++){
		if(pointInPolygon(item1.tCoords[i], item2.tCoords)){
			return true;
		}
	}
	
	for (i = 0; i < item2.tCoords.length; i++) {
		if (pointInPolygon(item2.tCoords[i],item1.tCoords)) {
			return true;
		}
	}
	return false;
}
//function to check collisions
function getCollisionData(item1, item2){
    var obj = {};
	obj.P = {};
	obj.N = {}
	obj.flag = false;
	obj.result = false;
	var pointsInside = [];
	
	//checking item1 in item2
	for(var i = 0; i < item1.tCoords.length; i++){
		if(pointInPolygon(item1.tCoords[i], item2.tCoords)){
			//item1.colour.current = a.colour.colide;
			//item2.colour.current = a.colour.colide;
			pointsInside.push(item1.tCoords[i]);
			//if it's completely inside or something
		}
	}	
	if (pointsInside.length != 0) {
	
			if (pointsInside.length > 1) {
				obj.P = vAvg(pointsInside)
			} else {
				obj.P = pointsInside[0]
			}
			
			for (var k = 0; k < item2.tCoords.length; k++) {
				var l = k + 1;
				if (l > item2.tCoords.length - 1)
					l = 0;
				if (intersect(obj.P,item1.pos,item2.tCoords[k],item2.tCoords[l])){
					obj.N = findNormal(vSubtract(item2.tCoords[l],item2.tCoords[k]));
					obj.flag = false;
					obj.result = true;
					return obj;
				}
			}
			
			for (var k = 0; k < item2.tCoords.length; k++) {
				var l = k + 1;
				if (l > item2.tCoords.length - 1)
					l = 0;
				if (intersect(pointsInside[0],item1.pos,item2.tCoords[k],item2.tCoords[l])){
					obj.N = findNormal(vSubtract(item2.tCoords[l],item2.tCoords[k]));
					obj.flag = false;
					obj.result = true;
					return obj;
				}
					
			}
			
			//obj.P = {'x': item1.tCoords[i].x, 'y': item1.tCoords[i].y};
			obj.N = {};
			obj.N.x = (obj.P.x - item2.tCom.x)/Math.sqrt((obj.P.x-item2.tCom.x)*(obj.P.x-item2.tCom.x)+(obj.P.y-item2.tCom.y)*(obj.P.y-item2.tCom.y))
			obj.N.y = (obj.P.y - item2.tCom.y)/Math.sqrt((obj.P.x-item2.tCom.x)*(obj.P.x-item2.tCom.x)+(obj.P.y-item2.tCom.y)*(obj.P.y-item2.tCom.y))
			//obj.N.x = 1
			//obj.N.y = 0
			//console.log(obj.N)
			console.log("FUCK", item1.id, pointsInside);
			rClick();
			obj.flag = false;
			obj.result = true;
			return obj;
	}

	pointsInside = [];
	
	//checking item2 in item1
	for (i = 0; i < item2.tCoords.length; i++) {
		if (pointInPolygon(item2.tCoords[i],item1.tCoords)) {
			pointsInside.push(item2.tCoords[i]);
			//if it's completely inside or something
		}
	}
	if (pointsInside.length != 0) {
			if (pointsInside.length > 1) {
				obj.P = vAvg(pointsInside)
			} else {
				obj.P = pointsInside[0]
			}
			
			for (var k = 0; k < item1.tCoords.length; k++) {
				var l = k + 1;
				if (l > item1.tCoords.length - 1)
					l = 0;
				if (intersect(obj.P,item2.pos,item1.tCoords[k],item1.tCoords[l])){
					obj.N = findNormal(vSubtract(item1.tCoords[l],item1.tCoords[k]));
					obj.flag = true;
					obj.result = true;
					return obj;
				}
			}
		
			for (var k = 0; k < item1.tCoords.length; k++) {
				var l = k + 1;
				if (l > item1.tCoords.length - 1)
					l = 0;
				if (intersect(pointsInside[0],item2.pos,item1.tCoords[k],item1.tCoords[l])){
					obj.N = findNormal(vSubtract(item1.tCoords[l],item1.tCoords[k]));
					obj.flag = false;
					obj.result = true;
					return obj;
				}
					
			}
			
			obj.N = {};
			obj.N.x = (obj.P.x - item1.tCom.x)/Math.sqrt((obj.P.x-item1.tCom.x)*(obj.P.x-item1.tCom.x)+(obj.P.y-item1.tCom.y)*(obj.P.y-item1.tCom.y))
			obj.N.y = (obj.P.y - item1.tCom.y)/Math.sqrt((obj.P.x-item1.tCom.x)*(obj.P.x-item1.tCom.x)+(obj.P.y-item1.tCom.y)*(obj.P.y-item1.tCom.y))
			console.log("FUCK", item2.id, pointsInside);
			rClick();
			obj.flag = true;
			obj.result = true;
			return obj;
	}
	//console.log("snowflake")
	return obj;
}
	
//function to see if point is in polygon
function pointInPolygon(point, poly) {
	var j = a.points - 1;
	var colide = false;
	
	var x = point.x;
	var y = point.y;
	
	for (var i=0; i < a.points; i++){
		if (poly[i].y < y && poly[j].y >= y ||  poly[j].y < y && poly[i].y >= y) {
			//if (poly[i].x + (y - poly[i].y)/(poly[j].y - poly[i].y)*(poly[j].x - poly[i].x) < x) {
			if ((poly[j].x - poly[i].x)/(poly[j].y - poly[i].y)*(y - poly[i].y) + poly[i].x >= x) {
				colide = !colide;
			}
		}
		j = i;
	}
	return colide;
}

		function pointInPolygon2(p,vertices) {
			
			//Loop through vertices, check if point is left of each line.
			//If it is, check if it line intersects with horizontal ray from point p
			
			var n = vertices.length;
			var j = 0;
			var v1 = {};  
			var v2 = {};
			var count = 0;
			for (var i = 0; i < n; i++)
			{
				j = i + 1;
				if (j == n) j = 0;
				v1 = vertices[i];
				v2 = vertices[j];
				//does point lay to the left of the line?
				if (isLeft(p,v1,v2))
				{
					if ((p.y > v1.y && p.y <= v2.y) || (p.y > v2.y && p.y <= v1.y))
					{
						count++;
					}
				}
			}
			if (count % 2 == 0) {
				return false;
			} else {
				return true;
			}
		}
		
		function isLeft(p, v1, v2) {
			
			if (v1.x == v2.x)
			{
				if (p.x <= v1.x)
				{
					return true;
				} else {
					return false;
				}
			} else {
				var m = (v2.y - v1.y) / (v2.x - v1.x);
				var x2 = (p.y - v1.y) / m + v1.x;
				if (p.x <= x2) {
					return true;
				} else {
					return false;
				}
			}
		}
		
//function to return the instantaneuos linear speed of the point
function maxSpeed(object) {
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