/**
 * contains methods for modifying individual properties of a transformation matrix:
 * horizontal and vertical scale, horizontal and vertical skew, and rotation.
 * This class also has methods for rotating around a given transformation point
 * rather than the typical (0, 0) point.
**/

$doodle.Matrix = {
	//like flash [a, b, c, d, tx, ty]
	identity: function() {
		var m = new Array(6);
		m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 1; m[4] = 0; m[5] = 0;
		return m;
	},

	create: function (a, b, c, d, tx, ty) {
		try {
			var i, m = new Array(6);
			
			if(typeof arguments[0]==='object' && typeof arguments[0].length==='number') {
				//given an array
				i = arguments[0].length;
				if(i !== 6){ throw new Error(); }
				while(--i > -1){
					if(typeof arguments[0][i] !== 'number'){ throw new Error(); }
					m[i] = arguments[0][i];
				}
			}else {
				//given numbers
				i = arguments.length;
				if(i !== 6){ throw new Error(); }
				while(--i > -1){
					if(typeof arguments[i] !== 'number'){ throw new Error(); }}
				m[0] = a; m[1] = b; m[2] = c; m[3] = d; m[4] = tx; m[5] = ty;
			}
			return m;
			
		}catch (e) {
			throw new SyntaxError("Matrix.create: A matrix requires 6 numbers.");
		}
	},

	//combine effects of 2 matrices
	multiply: function (m1, m2) {
		var _m = new Array(6);
		_m[0] = m1[0] * m2[0] + m1[1] * m2[2];
		_m[1] = m1[0] * m2[1] + m1[1] * m2[3];
		_m[2] = m1[2] * m2[0] + m1[3] * m2[2];
		_m[3] = m1[2] * m2[1] + m1[3] * m2[3];
		_m[4] = m1[0] * m2[4] + m1[1] * m2[5] + m1[4];
		_m[5] = m1[2] * m2[4] + m1[3] * m2[5] + m1[5];
		return _m;
	},

	translate: function (m, dx, dy) {
		return this.multiply(m, [1,0,0,1,dx,dy]);
	},

	rotate: function (m, angle/*radians*/) {
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		return this.multiply(m, [cos,sin,-sin,cos,0,0]);
	},

	scale: function (m, sx, sy) {
		return this.multiply(m, [sx,0,0,sy,0,0]);
	},

	//returns opposite transform of original matrix. to undo a transform
	invert: function (m) {
		var _m = new Array(6);		
		var d =  m[0] * m[3] - m[1] * m[2];
		_m[0] =  m[3] / d;
		_m[1] = -m[1] / d;
		_m[2] = -m[2] / d;
		_m[3] =  m[0] / d;
		//x,y doesn't seem to be working right
		_m[4] = (m[1] * m[5] - m[3] * m[4]) / d;
		_m[5] = (m[2] * m[4] - m[0] * m[5]) / d;
		return _m;
	},

	transformPoint: function (m, x, y) {
		return {
			x: m[0] * x + m[1] * y + m[4],
			y: m[2] * x + m[3] * y + m[5]
		};
	},

	//same as transformPoint, except matrix translate has no effect
	deltaTransformPoint : function (m, x, y) {
		var point = new Array(2);
		point[0] = x * m[0] + y * m[2]; //x
		point[1] = x * m[1] + y * m[3]; //y
		return point; //[x,y]
	},

	rotateAroundInternalPoint: function (m, x, y, angle) {
		var _m = this.translate(m, x, y);
		_m = this.rotate(_m, angle * Math.PI/180);
		_m = this.translate(_m, -x, -y);
		return _m;
	},

	rotateAroundExternalPoint: function (m, x, y, angle) {
		var _m = m.concat();
		
		_m = $doodle.Matrix.translate(_m, x, y);
		_m = $doodle.Matrix.rotate(_m, angle*Math.PI/180);
		_m = $doodle.Matrix.translate(_m, -x, -y);
		return _m;
	},	
};	
