$doodle.group = function (params) {
	//need to grab these before being altered on the way down
	var aX, aY, coord;
	if(params && typeof params.axis.x ==='number'){ aX = params.axis.x; }
	if(params && typeof params.axis.y ==='number'){ aY = params.axis.y; }
	if(params && typeof params.axis.coord ==='string'){ coord = params.axis.coord; }
	
	var self = $doodle.object(params);
	
	//defaults for group if not there
	self.composite = self.composite || 'source-over';
	self.axis.x = (typeof aX !=='undefined') ? aX : $doodle.canvas().width/2;
	self.axis.y = (typeof aY !=='undefined') ? aY : $doodle.canvas().height/2;
	self.axis.coord = (typeof coord !=='undefined') ? coord : 'global';
	//self.axis.coord = self.axis.coord || 'global';

	var children = [];


	function drawClippingMasks(obj) {
		obj.masks.map(function(shape) {
			obj.context.beginPath();
			shape();
			obj.context.clip();
		});
	}
	
	function drawAxisPoint(obj) {
		//assuming context has already been moved for object
		obj.context.save(); //always 'source-over'

		obj.context.translate(obj.axis.x, obj.axis.y);
		obj.context.globalAlpha = 1;

		//draw 2 little circles, first for stroke
		obj.context.fillStyle = '#000000';
		obj.context.beginPath();
		obj.context.arc(0, 0, 4, 0, Math.PI*2, true);
		obj.context.closePath();
		obj.context.fill();
		
		obj.context.fillStyle = '#00FF00';
		obj.context.beginPath();
		obj.context.arc(0, 0, 3, 0, Math.PI*2, true);
		obj.context.closePath();
		obj.context.fill();

		obj.context.restore();
	}
	
	
	self.add = function(obj) {
		for(var i = 0; i < arguments.length; i++) {
			children.push(arguments[i]);
		}
		children.sort(function(a, b){ return a.z - b.z; }); //z-sort
		
		return self;
	};

	self.remove = function(/* obj(s) */) {
		for(var i = 0; i < arguments.length; i++) {
			children.splice(children.indexOf(arguments[i]), 1);
		}
		return self;
	};
	
	self.rotate = function(ang) {
		//rotate every child around the global group axis
		//doesn't apply to group matrix
		children.map(function(obj){ obj.rotate(ang, self.axis); });
		return self;
	};

	self.draw = function() {
		if(typeof(self.context) === 'undefined') {
			throw new Error("group.draw: context must be defined.");
		}

		self.context.save();
		self.context.globalCompositeOperation = self.composite;

		/*
		 * what if its an unloaded image? wait and reshuffle?
		 */
		
		children.map( function(obj){
			//tell if its a group, then loop through .children
			//console.log("what? " + obj.loaded);
			if(obj.loaded) {
				obj.context = self.context;
				obj.transform(self.matrix);
				obj.draw();
				
			}else{ redraw_when_loaded(obj); }
		});

		if(self.axis.visible){ drawAxisPoint(self); }
		
		self.context.restore();

		return self;
	};

	//checks when the object is loaded, then redraws group
	function redraw_when_loaded (obj) {
		//if not already loading
		if(!obj.loading) {
			var timeout = 10000; //ms, 10sec
			var time = 0;
			var obj_check = setInterval(check_object, 100); //ms
			obj.loading = true; //add property
		}
		
		function check_object () {
			if(obj.loaded) {
				//stop checking and redraw everything
				self.draw();
				clearInterval(obj_check);
				delete obj.loading; //remove property
			}else {
				//check timeout
				if(time < timeout ){ time += 100; }//add interval
				else {
					//reset and throw error
					clearInterval(obj_check);
					delete obj.loading;
					throw new Error ("group.redraw_when_loaded: Image load timeout.");
				}
			}
		}
	}

	self.loop = function(params/*or fn*/, count, framerate/*optional*/, clear/*optional*/) {
		//-->from sprite loop 
		if(typeof count ==='undefined' || typeof count !=='number'){
			throw new SyntaxError("sprite.loop: count must be a number."); }

		if(typeof clear ==='undefined'){ clear = false; }
		
		var infinite = false;
		var i = 1;
		var render;
		
		if(count === 0) {
			//infinite loop
			count = 2;
			infinite = true;
		}

		if(typeof framerate ==='undefined'){ framerate = false; }
		else if(typeof framerate ==='string'){
			if(framerate.match(/fps/i)){
				framerate = (1000 / parseInt(framerate, 10)) | 0;
			}else if(framerate.match(/sec/i)){
				framerate = (1000 * parseFloat(framerate, 10)) | 0;
			}
		}
		//<--
		self.draw(); //initial group draw
		
		if(framerate){
			//we gotta loop
			render = setInterval(renderFrame, framerate);
			self.loop.ing = true;			
		}else{
			//no animation, just loop
			while(i < count) {
				self.modify(params).draw();
				if(!infinite){ i += 1; }
			}
		}

		function renderFrame() {
			if(i < count) {
				if(!infinite){ i += 1; }
				
				if(clear){
					//clear everything, redraw background
					self.context.save();
					$doodle.canvas().clear();
					self.context.restore();
				}
				
				if(typeof params === 'function'){
					params(self); //call
					self.draw(); //update
					
				}else{ self.modify(params).draw(); }//apply params to successive loops
				
			}else {
				//loop done
				clearInterval(render);
				self.loop.ing = false;
			}
		}
		
		return self;
		
	};

	return self;
};
