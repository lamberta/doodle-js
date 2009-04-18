$doodle.image = function (params) {
	//grab on_load function to call later
	if(typeof params.on_load !=='undefined'){
		var on_load = params.on_load;
		delete params.on_load;
	}
	
	var self = $doodle.sprite(params);

	var _img; //internal Image reference

	//might already be there ya'know
	if(typeof self.width ==='undefined'){ self.width = params.width; }
	if(typeof self.height ==='undefined'){ self.height = params.height; }

	if(typeof self.src ==='undefined'){ _img = new Image(); }
	else if(typeof self.src ==='string') {
		//passed url
		_img = new Image();
		_img.src = self.src;
	}else if(typeof self.src ==='object'){ _img = self.src; }//passed Image

	//polls image to see if loaded, then turns itself off
	function image_check() {
		if(_img.complete) {
			property_set(_img);
			clearInterval(load_check);
			self.loaded = true;
		}
	}

	//called after image loaded
	function property_set(image) {
		self.width = image.width;
		self.height = image.height;

		if(typeof on_load ==='function'){ on_load(self); }
	}
	
	self.loaded = _img.complete ? true : false;
	
	if(self.loaded){ property_set(_img); }
	else{ var load_check = setInterval(image_check, 100); }

	self.mold = function() {
		self.context.drawImage(_img, 0, 0, self.width, self.height);
	};
	
	return self;
};
