
var $doodle = {};

function throwError(type, msg) {
	throw new type(msg);
}


$doodle.utils = {};

$doodle.utils.parse = {};

$doodle.utils.parse.relativeEquation = function (old, str) {
	//get value in string equation
	var n  = parseFloat(str.substr(2));
	
	switch(str.substr(0,2)/*get operator*/) {
	 case '+=': old += n; break;
	 case '-=': old -= n; break;
	 case '*=': old *= n; break;
	 case '/=': old /= n; break;
	 case '%=': old %= n; break;
	 default: old = str; //not found, just apply
	}
	return old; //what's old is new again
};

$doodle.utils.parse.rotation = function (str/*degrees*/) {
	var a = parseFloat(str);
	if(!str.match(/rad/i)){ a = a * Math.PI/180; }//degrees to radians
	return a;
};

$doodle.utils.draw = {};

$doodle.utils.draw.circle = function (ctx, radius, color) {
	ctx.fillStyle = color;// || '#000000';
	ctx.beginPath();
	ctx.arc(0, 0, radius, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
};

$doodle.utils.draw.axis = function (obj) {
	var fillColor;
	
	//assuming context has already been moved for object
	obj.context.save(); //always 'source-over'
	
	if(obj.axis.coord === 'local') {
		fillColor = '#FF0000';
		obj.context.translate(obj.axis.x, obj.axis.y);
	}else if(obj.axis.coord === 'global') {
		fillColor = '#009999';
		obj.context.translate(obj.axis.x - obj.x, obj.axis.y - obj.y);
	}else {
		
	}
	
	obj.context.globalAlpha = 1;
	
	$doodle.utils.draw.circle(obj.context, 3, '#000000'); //stroke
	$doodle.utils.draw.circle(obj.context, 2, fillColor); //fill
	
	obj.context.restore();
};

//animate is just a proof-of-concept for now
$doodle.animate = function (draw, framerate, clear) {
	
	if(typeof draw !=='function'){
		throw new TypeError("doodle.animate: Must execute a function."); }

	framerate = (typeof framerate !=='undefined') ? framerate : 42; //24fps
	
	if(typeof clear ==='undefined'){ clear = true; }//clear screen by default

	var _framerate;
	var render;
	var ctx = $doodle.canvas().context;
	
	var self = {}; //animation control object
	self.ing = true;
	
	self.play = function (fps) {
		//if no args, just return current framerate
		if(arguments.length === 0){ return _framerate; }

		if(fps === false){ clearInterval(render); }//turn off
		else if(fps === true){ setInterval(render_frame, _framerate); }//restart
		else{
			if(typeof fps ==='string') {
				if(fps.match(/fps/i)){ fps = (1000 / parseInt(fps, 10)) | 0; }
				else if(fps.match(/sec/i)){ fps = (1000 * parseFloat(fps)) | 0; }
			}
			_framerate = fps;
			
			//stop and start renderloop
			clearInterval(render);
			render = setInterval(render_frame, _framerate);
		}
	};

	
	self.play(framerate); //set fps and start loop
	
	function render_frame() {
		if(clear) {
			//clear everything, redraw background
			ctx.save();
			$doodle.canvas().clear();
			ctx.restore();
		}
		draw();
	}
};


