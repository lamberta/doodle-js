$doodle.circle = function (params) {
	if(typeof params.radius ==='undefined'){
		throw new SyntaxError("circle: requires radius parameter."); }
	
	var self = $doodle.sprite(params);
	
	var startAngle = 0;
	var endAngle = Math.PI * 2;
	var anticlockwise = true;
	
	self.mold = function() {
		self.context.fillStyle = self.fill;
		self.context.beginPath();
		self.context.arc(0, 0, self.radius,
						 startAngle, endAngle, anticlockwise);
		self.context.closePath();
		self.context.fill();
	};

	return self;
};
