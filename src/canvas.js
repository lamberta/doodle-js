$doodle.canvas = function() {
	var _canvas;
	var _backgroundColor = false; //defaults to clear
	var _backgroundImage = false; //nuthin'
	
	var canv = function(canvas) {
		//without args, just return the active canvas
		if(arguments.length === 0) { return _canvas; }
		
		//strip id selector if there
		if(typeof canvas ==='string' && canvas[0] === '#'){
			canvas = canvas.slice(1);
		}

		_canvas = document.getElementById(canvas) || canvas;

		//set context if supported
		if(_canvas.getContext) {
			_canvas.context = _canvas.getContext("2d");
			addProperties();
			return _canvas;
		}else {
			console.log("$doodle: canvas not supported.");
		}
	};

	/*
	 * add additional getter/setters to canvas object
	 */
	function addProperties() {
		
		_canvas.bgcolor = function(bgColor) {
			if(arguments.length === 0) { return _backgroundColor; }
			_backgroundColor = bgColor;
			_canvas.context.fillStyle = _backgroundColor;
			_canvas.context.fillRect(0, 0, _canvas.width, _canvas.height);
			return _canvas;
		};

		_canvas.bgimage = function(bgImage) {
			if(arguments.length === 0) { return _backgroundImage; }

			if(typeof bgImage ==='string') {
				_backgroundImage = new Image();
				_backgroundImage.src = bgImage;
			}else {
				_backgroundImage = bgImage;
			}

			_backgroundImage.onload = function() {
				_canvas.context.drawImage(_backgroundImage, 0, 0);
			}
			//_canvas.context.fillStyle = _backgroundColor;
			//_canvas.context.fillRect(0, 0, _canvas.width, _canvas.height);
			return _canvas;
		};

		_canvas.clear = function() {
			_canvas.context.save();
			//clear everything
			_canvas.context.clearRect(0, 0, _canvas.width, _canvas.height);
			
			if(_backgroundColor) {
				_canvas.context.fillStyle = _backgroundColor;
				_canvas.context.fillRect(0, 0, _canvas.width, _canvas.height);
			}
			if(_backgroundImage) {
				_canvas.context.drawImage(_backgroundImage, 0, 0);
			}
			_canvas.context.restore();
		};
	}
	
	return canv;
}();
