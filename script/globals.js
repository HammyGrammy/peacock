var a = {};
a.rocks = [];
a.qty = 100
a.points = 8;
a.fps = 40;
a.colour = {};
a.colour.base = "SlateGrey";
a.colour.nearMiss = "DarkOrange";
a.colour.colide = "Crimson";
a.speeeed = 2;

var c = {}
c.canvas = document.getElementById("coco");
c.ctx = c.canvas.getContext("2d");
c.wide = c.canvas.width;
c.high = c.canvas.height;
c.divisions = 20;
c.gridColour = "grey";