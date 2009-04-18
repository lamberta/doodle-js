/**
 * @classDescription	Returns a basic object. Position information.
 * @param {Object}		[params.context = canvas.context]
 * @param {Number}		[params.z = 0]
 * @param {point}		[params.axis = {x:0,y:0,coord:'local',visible:false}]
 * @param {Boolean}		[params.visible = true] //not fully implemented
 * @param {shape}		[params.masks = []] //takes a path-shape function
 * @return {Object}
 */
$doodle.object = function (params) {
	var self = {};
	//add all the properties in the top object, will value/type check later
	for(var prop in params) {
		//apply any in-line functions to properties
		if(typeof params[prop] === 'function') {
			var f = params[prop];
			self[prop] = f(self/*call with this object*/);
		
		}else {
			//add all our properties in the top object
			self[prop] = params[prop];
		}
	}

	//defaults for object
	self.context = self.context || $doodle.canvas().context;
	self.visible = (typeof self.visible !=='undefined') ? self.visible : true;
	
	self.x = (typeof self.x !=='undefined') ? self.x : 0;
	self.y = (typeof self.y !=='undefined') ? self.y : 0;
	self.z = (typeof self.z !=='undefined') ? self.z : 0;
	
	//make sure all the axis parts are there
	self.axis = self.axis || {};
	self.axis.x = (typeof self.axis.x !=='undefined') ? self.axis.x : 0;
	self.axis.y = (typeof self.axis.y !=='undefined') ? self.axis.y : 0;
	self.axis.coord = self.axis.coord || 'local';
	self.axis.visible = (typeof self.axis.visible!=='undefined')? self.axis.visible : false;

	self.masks = self.masks || []; //shape functions drawn as clipping paths
	//apply initial translate to matrix
	self.matrix = $doodle.Matrix.translate($doodle.Matrix.identity(), self.x, self.y);
	
	//type-checks
	if(typeof self.z !=='number'){ throw new TypeError("object: z must be a number."); }
	if(typeof self.visible !=='boolean'){ throw new TypeError("object: visible must be true or false."); }
	if(self.axis && (typeof self.axis.x !=='number' ||
					 typeof self.axis.y !=='number')) {
		throw new TypeError("object: axis x and y must be numbers.");
	}
	if(self.axis.coord && typeof self.axis.coord ==='string') {
		if(self.axis.coord !== 'local' && self.axis.coord !== 'global') {
			throw new SyntaxError("object: axis coord must be 'local' or 'global'."); }
	}
	if(typeof self.axis.visible !=='boolean') {
		throw new TypeError("object: axis.visible must be 'true' or 'false'."); }

	if(typeof self.masks==='object' && typeof self.masks.length==='number') {
		//it's an array all right, now check it the elements are shape functions
		for(var i = 0; i < self.masks.length; i++) {
			if(typeof self.masks[i] !=='function') {
				throw new TypeError("object.masks: '"+self.masks[i]+"' must be a shape function.");}
		}
	}else {
		throw new TypeError("object.masks: Must be an Array of shape functions."); }

	
	self.loaded = true; //loaded by default, image changes it
	
	//apply differences to object
	self.modify = function(params) {
		var f, n;
		var paramFuncs = {};
		//loop through all supplied properties to modify
		for(var prop in params) {
			//if passed an inline function, eval and store value
			if(typeof params[prop] === 'function') {
				f = params[prop];
				params[prop] = f(self/*this object*/, self[prop]/*this property*/);
			}
			
			switch(prop) {
				//fall through, check if we have a relative equation
			case 'x':
				n = params[prop];
				if(typeof n === 'string') {
					n = $doodle.utils.parse.relativeEquation(self[prop], n); }
				self.translate(n - self.x, 0);
				self[prop] = n;
				break;
				
			case 'y':
				n = params[prop];
				if(typeof n === 'string') {
					n = $doodle.utils.parse.relativeEquation(self[prop], n); }
				self.translate(0, n - self.y );
				self[prop] = n;
				break;

			case 'z':
				n = params[prop];
				if(typeof n === 'string') {
					n = $doodle.utils.parse.relativeEquation(self[prop], n); }
				self[prop] = n;
				break;
				
			case 'alpha':
				n = params[prop];
				if(typeof n === 'string') {
					n = $doodle.utils.parse.relativeEquation(self[prop], n); }
				if(n > 1){ n = 1; }
				if(n < 0){ n = 0; }
				self[prop] = n;
				break;
				
			case 'width':
				n = params[prop];
				if(typeof n === 'string') {
					n = $doodle.utils.parse.relativeEquation(self[prop], n); }
				self[prop] = n;
				break;
				
			case 'height':
				n = params[prop];
				if(typeof n === 'string') {
					n = $doodle.utils.parse.relativeEquation(self[prop], n); }
				self[prop] = n;
				break;
				
			case 'fill':
				self[prop] = params[prop];
				break;

			case 'axis':
				for(var p in params[prop]) {
					switch(p) {
					case 'x':
					case 'y':
						if(typeof params[prop][p] === 'string') {
							params[prop][p] = $doodle.utils.parse.relativeEquation(self.axis[p], params[prop][p]);}
						self[prop][p] = params[prop][p];
						break;
					case 'coord':
					case 'visible':
						self[prop][p] = params[prop][p];
						break;
					default:
						throw new SyntaxError("object.modify.axis: "+p+" parameter not found.");
					}
				}
				break;
				
			case 'translate':
				f = self[prop];
				f(params[prop]);
				break;
			case 'rotate':
				f = self[prop];
				f(params[prop]);
				break;
			case 'scale':
				f = self[prop];
				f(params[prop]);
				break;
			case 'transform':
				f = self[prop];
				f(params[prop]);
				break;
				
			default:
				n = params[prop];
				if(typeof n === 'string') {
					n = $doodle.utils.parse.relativeEquation(self[prop], n); }
				self[prop] = n;
				//throw new SyntaxError("object.modify: "+prop+" parameter not found.");
			}//end{switch-prop}
		}//end{for prop in params}
		
		return self;
		
	};//end{self.modify}


	/*
	 * transform functions
	 */

	
	self.translate = function (point) {
		var tX, tY;
		//--type check
		if(arguments.length === 2){
			//given numbers
			tX = arguments[0];
			tY = arguments[1];
		}else if(typeof point === 'object'){
			//given array or point object
			tX = point[0] || point.x;
			tY = point[1] || point.y;
		}else {
			throw new SyntaxError("translate: requires a point.");
		}//--end type check

		self.matrix = $doodle.Matrix.translate(self.matrix, tX, tY);
		self.x = self.matrix[4];
		self.y = self.matrix[5];

		return self;
	};

	self.rotate = function (angle, axis/*optional*/) {
		var dx, dy;
		if(typeof axis ==='undefined'){ axis = self.axis; }

		if(axis.coord === 'local'){
			//rotate around internal point
			dx = axis.x;
			dy = axis.y;
		}else if(axis.coord === 'global'){
			//rotate around external point
			dx = axis.x - self.x;
			dy = axis.y - self.y;
		}else {
			throw new SyntaxError("rotate: coord system must be 'local' or 'global'."); }

		var m = $doodle.Matrix.translate(self.matrix, dx, dy);
		m = $doodle.Matrix.rotate(m, angle * Math.PI/180);
		self.matrix = $doodle.Matrix.translate(m, -dx, -dy);

		return self;
	};

	self.scale = function (scale) {
		var sx, sy;
		if(typeof scale ==='object'){
			//passed array or object
			if(scale.length === 1){ sx = sy = scale[0]; }
			else{
				sx = scale[0] || scale.x;
				sy = scale[1] || scale.y;
			}
		}else {
			//passed args
			if(arguments.length === 1){ sx = sy = scale; }
			else if(arguments.length === 2){
				sx = arguments[0];
				sy = arguments[1];
			}
		}
		self.matrix = $doodle.Matrix.scale(self.matrix, sx, sy);
		return self;
	};

	self.transform = function (matrix) {
		var m;
		if(arguments.length === 1){ m = $doodle.Matrix.create(matrix); }
		else if(arguments.length === 6) {
			m = $doodle.Matrix.create(arguments[0],arguments[1],arguments[2],
									  arguments[3],arguments[4],arguments[5]);
			
		}else{ throw new SyntaxError("object.transform: incorrect number or arguments."); }
		
		self.matrix = $doodle.Matrix.multiply(self.matrix, m);
		return self;
	};

	/*
	 * end transform functions
	 */

	
	//apply the transform functions, should consolidate with modify i guess
	//have to add at end when everything is defined
	for(var p in params) {
		if(p === 'translate') {
			self.translate(params[p]);
		}else if(p === 'rotate') {
			self.rotate(params[p]);
		}else if(p === 'scale') {
			self.scale(params[p]);
		}else if(p === 'transform') {
			self.transform(params[p]);
		}
	}

	return self;
	
};//end{object}
