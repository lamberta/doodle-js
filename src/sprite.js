/**
 * @classDescription	Returns a new sprite object.
 * @param {Number}		params.x
 * @param {Number}		params.y
 * @param {String}		[params.fill = '#000000']
 * @param {Number}		[params.alpha = 1]
 * @return {Object}
 */
$doodle.sprite = function (params) {
	//if given a shape param, store it till assignment later
	if(typeof params.shape ==='function') {
		var arg_shape = params.shape;
		delete params.shape;
	}
	
	var self = $doodle.object(params);

	//defaults for sprite
	self.fill = (typeof self.fill !=='undefined') ? self.fill : '#000000';
	self.alpha = (typeof self.alpha !=='undefined') ? self.alpha : 1;
	
	if(typeof self.fill ==='string' && self.fill[3] === 'a') {
		//passed 'rgba(r,g,b,a)', regexp these out so we can use self.alpha as control
		//oh dear...
		var r = parseInt(self.fill.match(/\d*\s*(?=,)/), 10);
		var g = parseInt(self.fill.match(/\d*\s*,\s*\d*\s*,\s*\d*\.?\d*\s*\)$/), 10);
		var b = parseInt(self.fill.match(/\d*\s*,\s*\d*\.?\d*\s*\)$/), 10);
		var a = parseFloat(self.fill.match(/\d*\.?\d*\s*\)$/), 10);

		self.fill = 'rgb('+r+','+g+','+b+')';
		self.alpha = a;

		if(typeof r !=='number' || typeof g !=='number' ||
		   typeof b !=='number' || typeof a !=='number') {
			//of course the regexp wouldn't have worked if it got here
			throw new TypeError("sprite: error parsing " + self.fill);
		}
	}
	//alpha type and bounds check: 0.0 - 1.0
	if(typeof self.alpha !=='number' || (self.alpha < 0 || self.alpha > 1)) {
		throw new SyntaxError("sprite: alpha value must be between 0.0 and 1.0.");
	}


	function drawClippingMasks(obj) {
		obj.masks.map(function(shape) {
			obj.context.beginPath();
			shape();
			obj.context.clip();
		});
	}

	//the poor man's loop
	self.animate = function (params, framerate) {
		if(typeof framerate ==='undefined'){ framerate = 42; } //24fps
		self.loop(params, 0, framerate, true); //infinite loop w/ clear
	};
	
	self.loop = function (params/*or fn*/, count, framerate/*optional*/, clear/*optional*/) {
		if(typeof count ==='undefined' || typeof count !=='number') {
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
		
		self.draw(); //initial draw
		
		if(framerate) {
			//we gotta loop
			render = setInterval(renderFrame, framerate);
			self.loop.ing = true;
			
		}else {
			//no animation, just loop
			while(i < count) {
				if(clear){ $doodle.canvas().clear(); }

				//shallow copy of parameters object,
				//otherwise functions get overwritten on subsequent calls
				if(typeof params ==='object'){
					var params_copy = {};
					for(var prop in params) {
						//store update function to run after everything else
						if(prop === 'on_update'){ var update_fn = params[prop]; }
						else{ params_copy[prop] = params[prop]; }
					}
				}
				
				//self.modify(params_copy).draw();

				//call if function, otherwise apply modify parameters
				if(typeof params ==='function'){
					//console.log("heer");
					params(self); //call
					self.draw();  //update
				}else{ self.modify(params_copy).draw(); }

				//if update function exists, call it
				if(typeof update_fn !=='undefined'){ update_fn(self); }
				
				if(!infinite){ i += 1; }
			}
		}

		function renderFrame() {
			if(i < count) {
				if(clear) {
					self.context.save();
					
					$doodle.canvas().clear(); //this clears all canvas
					
					//self.context.transform(self.matrix[0],self.matrix[2],self.matrix[1],
					//					   self.matrix[3],self.matrix[4],self.matrix[5]);

					//draw shape woth erase fill?
					
					//just clear rects box. every sprite needs a width/height then
					//need to make a touch larger to get errant outlines
					/**
					if(!bgcolor) self.context.clearRect(-1, -1, self.width+2, self.height+2);
					else {
						self.context.fillStyle = bgcolor;
						self.context.fillRect(-1, -1, self.width+2, self.height+2);
					}
**/
					self.context.restore();
				}//end clear previous

				//shallow copy of parameters object,
				//otherwise functions get overwritten on subsequent calls
				if(typeof params ==='object'){
					var params_copy = {};
					for(var prop in params) {
						//store update function to run after everything else
						if(prop === 'on_update'){ var update_fn = params[prop]; }
						else{ params_copy[prop] = params[prop]; }
					}
				}
				
				//call if function, otherwise apply modify parameters
				if(typeof params ==='function'){
					params(self); //call
					self.draw();  //update

				//apply params to successive loops
				}else{ self.modify(params_copy).draw(); }

				//if update function exists, call it
				if(typeof update_fn !=='undefined'){ update_fn(self); }
				
				if(!infinite){ i += 1; }
				
			}else {
				//loop done
				clearInterval(render);
				self.loop.ing = false;
			}
		}
		
		return self;
	};

	//kinda cheap way to measure if loop is already executing - set in loop
	self.loop.ing = false;
	
	//mold holds the shape function
	self.mold = undefined;
	//shape takes the function and sets it in the mold
	self.shape = function(shape){ self.mold = shape; return self; };
	//if given a shape in the parameters assign it
	if(arg_shape){ self.shape(arg_shape); }
	
	self.draw = function(shape) {
		shape = shape || self.mold;
		if(typeof(shape) !== 'function') {
			throw new Error("sprite.draw: no shape function provided.");
		}
		if(typeof(self.context) === 'undefined') {
			throw new Error("sprite.draw: context must be defined.");
		}
		
		if(self.loaded){ draw(shape); }
		else{ redraw_when_loaded(self); }

		return self;
	};
	
	
	function draw (shape) {
		self.context.save();
		
		self.context.transform(self.matrix[0],self.matrix[2],self.matrix[1],
							   self.matrix[3],self.matrix[4],self.matrix[5]);

		self.context.fillStyle = self.fill; //set shape fill

		if(self.alpha > 1) {
			self.context.globalAlpha = self.alpha; //set global context alpha
		}
		
		$doodle.gfx = self.context;

		
		if(self.masks.length){ drawClippingMasks(self); }
		
		if(self.visible){ shape(self); }//should probably check the whole block

		if(self.axis.visible){ $doodle.utils.draw.axis(self); }
		
		$doodle.gfx = $doodle.canvas().context;

		self.context.restore();
	}

	//checks when the object is loaded, then redraws
	function redraw_when_loaded (obj) {
		//if not already loading
		if(!obj.loading) {
			var timeout = 10000; //ms, 10sec
			var time = 0;
			var obj_check = setInterval(check_object, 100); //ms
			obj.loading = true; //add property
		}
		function check_object () {
			if(self.loaded) {
				//stop checking and redraw everything
				clearInterval(obj_check);
				self.draw();
			}else {
				//check timeout
				if(time < timeout ){ time += 100; }//interval
				else {
					//reset and throw error
					clearInterval(obj_check);
					delete obj.loading;
					throw new Error ("group.redraw_when_loaded: Image load timeout.");
				}
			}
		}
	}
	
	return self;
};//end{sprite}
