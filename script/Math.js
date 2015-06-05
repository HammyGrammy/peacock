function vAdd (vector1, vector2) {
//adds two vectors

	var vector3 = {};
	
	if('x' in vector1 && 'x' in vector2) vector3.x = vector2.x + vector1.x;
	if('y' in vector1 && 'y' in vector2) vector3.y = vector2.y + vector1.y;
	if('z' in vector1 && 'z' in vector2) vector3.z = vector2.z + vector1.z;
	if('r' in vector1 && 'r' in vector2) vector3.r = vector2.r + vector1.r;

	return vector3;
}

function vSub (vector1, vector2) {
//adds two vectors

	var vector3 = {};
	
	if('x' in vector1 && 'x' in vector2) vector3.x = vector2.x - vector1.x;
	if('y' in vector1 && 'y' in vector2) vector3.y = vector2.y - vector1.y;
	if('z' in vector1 && 'z' in vector2) vector3.z = vector2.z - vector1.z;
	if('r' in vector1 && 'r' in vector2) vector3.r = vector2.r - vector1.r;

	return vector3;
}

function vScale (vector, factor){
	
	var vector2 = {};
	
	if('x' in vector) vector2.x = factor * vector.x;
	if('y' in vector) vector2.y = factor * vector.y;
	if('z' in vector) vector2.z = factor * vector.z;
	if('r' in vector) vector2.r = factor * vector.r;

	return vector2;

}

function vAvg (vectorArray) {
//averages a series vectors

	vSum = {};
	vSum.x = 0;
	vSum.y = 0;
	vSum.z = 0;
	vSum.r = 0;
	
	for (var i = 0; i < vectorArray.length; i++) {
		vSum = vAdd(vSum,vectorArray[i]);
	}
	
	vSum.x /= vectorArray.length;
	vSum.y /= vectorArray.length;
	vSum.z /= vectorArray.length;
	vSum.r /= vectorArray.length;
	//console.log("Average was fine");
	return vSum;
}

function findNormal(vector) {
//returns a vector's unit normal (n hat)
    
	var M = Math.sqrt(vector.x*vector.x+vector.y*vector.y);
	var N = {};
	N.x = -vector.y/M;
	N.y = vector.x/M;
	return N;
}

function dProduct (vector1, vector2) {
//returns the dot product of two vectors
    
    if('z' in vector1 && 'z' in vector2) return vector2.x * vector1.x + vector2.y * vector1.y + vector2.z * vector1.z;
	return vector2.x * vector1.x + vector2.y * vector1.y;
}

function cProduct (vector1, vector2) {
//returns the cross product of two vectors

	var vector3 = {};
	
	if(!('z' in vector1)) vector1.z = 0;
	if(!('z' in vector2)) vector2.z = 0;
	
	vector3.x = vector1.y * vector2.z - vector2.y * vector1.z;
	vector3.y = vector1.z * vector2.x - vector2.x * vector1.z;
	vector3.z = vector1.x * vector2.y - vector2.y * vector1.x;

	return vector3;
}

function intersect (a, b, c, d) {
//determines if two line segements intersect

	if ((a.x == c.x && a.y == c.y) || (b.x == c.x && b.y == c.y) || (a.x == d.x && a.y == d.y) || (b.x == d.x && b.y == d.y))
		return true;

	var m1 = (b.y-a.y)/(b.x-a.x);
	var m2 = (d.y-c.y)/(d.x-c.x);
	var b1 = a.y - m1*a.x;
	var b2 = c.y - m2*c.x;
	
	var X = (b2-b1)/(m1-m2);
	var Y = ((b2-b1)/(m1-m2))*m1+b1;

	var ax1 = Math.min(a.x,b.x);
	var ax2 = Math.max(a.x,b.x);
	var bx1 = Math.min(c.x,d.x);
	var bx2 = Math.max(c.x,d.x);

	var ay1 = Math.min(a.y,b.y);
	var ay2 = Math.max(a.y,b.y);
	var by1 = Math.min(c.y,d.y);
	var by2 = Math.max(c.y,d.y);
	
	if (a.x == b.x) {
		if ((bx1 < a.x || bx2 > a.x) && m2*a.x + b2) {
			return true;
		}
	}
	
	if (c.x == d.x) {
		if ((ax1 < c.x || ax2 > c.x) && m1*c.x + b1) {
			return true;
		}
	}

	if(X >= ax1 && X <= ax2 && Y >= ay1 && Y <= ay2 && X >= bx1 && X <= bx2 && Y >= by1 && Y <= by2)
		return true;

	return false;
}

function interpolateX(x0, x1, y0, y1, y){
//interpolates the x value on a line (defined by [x0, y0] and [x1, y1]) for a given y
	return x0 + (y - y0)*((x1 - x0)/(y1 - y0));
}

function distance(p1, p2) {
//finds the absolute distance between two points
	return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y));
}

function transX(x) {return c.wide/2*(1 + 2*x/c.divisions);}
function transY(y) {return c.high/2*(1 - 2*y/c.divisions);}