function trace(shape) {
//draws a filled polygon
	c.ctx.beginPath();
	for(var point = 0; point < shape.tCoords.length; point++) {
		c.ctx.lineTo(shape.tCoords[point].x, shape.tCoords[point].y);
	}
		
	c.ctx.lineWidth = Math.ceil(5/c.divisions);
	c.ctx.fillStyle = shape.colour.current;
	c.ctx.fill();
	c.ctx.strokeStyle = "black";
	c.ctx.closePath();
	c.ctx.stroke();
	
	c.ctx.textAlign = "center";
	c.ctx.font="10px Showcard Gothic";
	c.ctx.fillStyle = "black";
	c.ctx.fillText(shape.id,shape.tCom.x,shape.tCom.y+5);
}

function addGrid() {
//draws a grid
	for(var i = 1; i < c.divisions; i++) {
		c.ctx.beginPath();
		c.ctx.lineTo(i/c.divisions*c.wide, 0);
		c.ctx.lineTo(i/c.divisions*c.wide, c.high);
		c.ctx.lineWidth = 1;
		c.ctx.strokeStyle = c.gridColour;
		c.ctx.stroke();
		
		c.ctx.beginPath();			
		c.ctx.moveTo(0, i/c.divisions*c.high);
		c.ctx.lineTo(c.wide, i/c.divisions*c.high);
		c.ctx.lineWidth = 1;
		c.ctx.strokeStyle = c.gridColour;
		c.ctx.stroke();
	}
}

function drawLine(A, B){
//draws a line from point A to B
	c.ctx.beginPath();
	c.ctx.lineTo(A.x, A.y);
	c.ctx.lineTo(B.x, B.y);
	
	c.ctx.lineWidth = 2;
	c.ctx.strokeStyle = "purple";
	c.ctx.stroke();
}