//Make a point object, out of another point, an Array, or two numbers.
$doodle.point = function (params) {
	var self = {};
	
	if(arguments.length === 2 || arguments.length === 0) {
		//2 numbers or none
		self.x = (typeof(arguments[0])==='number') ? arguments[0] : undefined;
		self.y = (typeof(arguments[1])==='number') ? arguments[1] : undefined;
		
	}else if(arguments.length === 3) {
		//given an axis-point
		self.x = (typeof(arguments[0])==='number') ? arguments[0] : undefined;
		self.y = (typeof(arguments[1])==='number') ? arguments[1] : undefined;
		if((typeof arguments[2] ==='string') &&
		   (arguments[2] === 'local' || arguments[2] === 'global')) {
			self.coord = arguments[2];
		}else {
			throw new SyntaxError("point: Axis-point must be 'local' or 'global'.");
		}
	}else if(typeof(params) === 'object'){
		//array or point object
		self.x = (typeof(params[0])==='number') ? params[0] : params.x;
		self.y = (typeof(params[1])==='number') ? params[1] : params.y;
		if(params.coord){ self.coord = params.coord; }//given axis point
	}
	
	return self;
};
