function vSubtract (vector1, vector2) {

	var vector3 = {};
	
	if('x' in vector1 && 'x' in vector2) vector3.x = vector2.x - vector1.x;
	if('y' in vector1 && 'y' in vector2) vector3.y = vector2.y - vector1.y;
	if('z' in vector1 && 'z' in vector2) vector3.z = vector2.z - vector1.z;
	if('r' in vector1 && 'r' in vector2) vector3.r = vector2.r - vector1.r;
	
	return vector3;
}

function vAdd (vector1, vector2) {

	var vector3 = {};
	
	if('x' in vector1 && 'x' in vector2) vector3.x = vector2.x + vector1.x;
	if('y' in vector1 && 'y' in vector2) vector3.y = vector2.y + vector1.y;
	if('z' in vector1 && 'z' in vector2) vector3.z = vector2.z + vector1.z;
	if('r' in vector1 && 'r' in vector2) vector3.r = vector2.r + vector1.r;

	return vector3;
}

function vAvg (vectorArray) {
	
	vSum = {}
	vSum.x = 0
	vSum.y = 0
	vSum.z = 0
	vSum.r = 0
	
	for (var i = 0; i < vectorArray.length; i++) {
		vSum = vAdd(vSum,vectorArray[i])
	}
	
	vSum.x /= vectorArray.length
	vSum.y /= vectorArray.length
	vSum.z /= vectorArray.length
	vSum.r /= vectorArray.length
	
	return vSum
}

function findNormal(vector) { //returns nHat
    
	var M = Math.sqrt(vector.x*vector.x+vector.y*vector.y)
	var N = {};
	N.x = -vector.y/M;
	N.y = vector.x/M;
	return N;
		
}
function sqr(x) { return x * x }

function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}
function distToSegment(p, v, w) { 
	return Math.sqrt(distToSegmentSquared(p, v, w)); 
}

//function intersect(L1P1, L1P2, L2P1, L2P2){}

/*function intersect(A,B,E,F) {
	var ip = {}
	var a1
	var a2
	var b1
	var b2
	var c1
	var c2
		    
	a1= B.y-A.y;
	b1= A.x-B.x;
	c1= B.x*A.y - A.x*B.y;
	a2= F.y-E.y;
	b2= E.x-F.x;
	c2= F.x*E.y - E.x*F.y;
		 
	var denom = a1*b2 - a2*b1;
	if (denom == 0) {
		return false;
	}
	ip={}
	ip.x=(b1*c2 - b2*c1)/denom;
	ip.y=(a2*c1 - a1*c2)/denom;
		 
	//---------------------------------------------------
	//Do checks to see if intersection to endpoints
	//distance is longer than actual Segments.
	//Return null if it is with any.
	//---------------------------------------------------
	if(true){
		if(Math.pow(ip.x - B.x, 2) + Math.pow(ip.y - B.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)){
			return false;
		}
		if(Math.pow(ip.x - A.x, 2) + Math.pow(ip.y - A.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)){
			return false;
		}		 
		if(Math.pow(ip.x - F.x, 2) + Math.pow(ip.y - F.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)){
			return false;
		}
		if(Math.pow(ip.x - E.x, 2) + Math.pow(ip.y - E.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)){
			return false;
		}
	}
	return true;
}*/
function intersect (a, b, c, d) {
			
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
	
	//console.log("FUCK");
	return false;
}

function dProduct (vector1, vector2) {
    
    if(z in vector1 && z in vector2) return vector2.x * vector1.x + vector2.y * vector1.y + vector2.z * vector1.z;
	return vector2.x * vector1.x + vector2.y * vector1.y;
}

function cProduct (vector1, vector2) {

	var vector3 = {};
	
	if(!('z' in vector1)) vector1.z = 0;
	if(!('z' in vector2)) vector2.z = 0;
	
	vector3.x = vector1.y * vector2.z - vector2.y * vector1.z;
	vector3.y = vector1.z * vector2.x - vector2.x * vector1.z;
	vector3.z = vector1.x * vector2.y - vector2.y * vector1.x;

	return vector3;
}

function interpolateX(x0, x1, y0, y1, y){
	return x0 + (y - y0)*((x1 - x0)/(y1 - y0)); }
	
function transX(x) {return c.wide/2*(1 + 2*x/c.divisions);}
function transY(y) {return c.high/2*(1 - 2*y/c.divisions);}

function distance(p1, p2) {
	return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y)); }
	
function cosAngle(a, b, c) {
	return Math.acos((a*a + b*b - c*c)/(2*a*b)); }
	//compare function for sorting

function idSort(o1,o2) {
	return o1.id - o2.id;
}