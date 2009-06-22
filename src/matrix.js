/**
 * contains methods for modifying individual properties of a transformation matrix:
 * horizontal and vertical scale, horizontal and vertical skew, and rotation.
 * This class also has methods for rotating around a given transformation point
 * rather than the typical (0, 0) point.
**/

var $doodle = {}; //uncomment when jslinting

//like flash [a, b, c, d, tx, ty]
$doodle.Matrix = {};

$doodle.Matrix.identity = function () {
	var m = new Array(6);
	m[0] = 1;
	m[1] = 0;
	m[2] = 0;
	m[3] = 1;
	m[4] = 0;
	m[5] = 0;
	return m;
};

$doodle.Matrix.nidentity = function (m1)  {
	m1[0] = 1;
	m1[1] = 0;
	m1[2] = 0;
	m1[3] = 1;
	m1[4] = 0;
	m1[5] = 0;
	return m1;
};

$doodle.Matrix.create = function (a, b, c, d, tx, ty) {
	try {
		var i, m = new Array(6);
		
		if (typeof arguments[0] === 'object' && typeof arguments[0].length === 'number') {
			//given an array
			i = arguments[0].length;
			if (i !== 6) {
				throw new Error();
			}
			while (--i > -1) {
				if (typeof arguments[0][i] !== 'number') {
					throw new Error();
				}
				m[i] = arguments[0][i];
			}
		} else {
			//given numbers
			i = arguments.length;
			if (i !== 6) {
				throw new Error();
			}
			while (--i > -1) {
				if (typeof arguments[i] !== 'number') {
					throw new Error();
				}
			}

			m[0] = a;
			m[1] = b;
			m[2] = c;
			m[3] = d;
			m[4] = tx;
			m[5] = ty;
		}
		return m;
		
	}catch (e) {
		throw new SyntaxError("Matrix.create: A matrix requires 6 numbers.");
	}
};

//combine effects of 2 matrices
$doodle.Matrix.multiply = function (m1, m2) {
	var m = new Array(6);
	m[0] = m1[0] * m2[0] + m1[1] * m2[2];
	m[1] = m1[0] * m2[1] + m1[1] * m2[3];
	m[2] = m1[2] * m2[0] + m1[3] * m2[2];
	m[3] = m1[2] * m2[1] + m1[3] * m2[3];
	m[4] = m1[0] * m2[4] + m1[1] * m2[5] + m1[4];
	m[5] = m1[2] * m2[4] + m1[3] * m2[5] + m1[5];
	return m;
};

$doodle.Matrix.translate = function (m1, dx, dy) {
	return $doodle.Matrix.multiply(m1, [1, 0, 0, 1, dx, dy]);
};

$doodle.Matrix.rotate = function (m1, angle/*radians*/) {
	var sin = Math.sin(angle),
		cos = Math.cos(angle);
	return $doodle.Matrix.multiply(m1, [cos, sin, -sin, cos, 0, 0]);
};

$doodle.Matrix.scale = function (m1, sx, sy) {
	return $doodle.Matrix.multiply(m1, [sx, 0, 0, sy, 0, 0]);
};

//returns opposite transform of original matrix. to undo a transform
$doodle.Matrix.invert = function (m1) {
	var m = new Array(6),
		d =  m1[0] * m1[3] - m1[1] * m1[2];
	m[0] =  m1[3] / d;
	m[1] = -m1[1] / d;
	m[2] = -m1[2] / d;
	m[3] =  m1[0] / d;
	//x,y doesn't seem to be working right
	m[4] = (m1[1] * m1[5] - m1[3] * m1[4]) / d;
	m[5] = (m1[2] * m1[4] - m1[0] * m1[5]) / d;
	return m;
};

$doodle.Matrix.transformPoint = function (m1, x, y) {
	return {
		x: m1[0] * x + m1[1] * y + m1[4],
		y: m1[2] * x + m1[3] * y + m1[5]
	};
};

//same as transformPoint, except matrix translate has no effect
$doodle.Matrix.deltaTransformPoint = function (m1, x, y) {
	var point = new Array(2);
	point[0] = x * m1[0] + y * m1[2]; //x
	point[1] = x * m1[1] + y * m1[3]; //y
	return point; //[x,y]
};

$doodle.Matrix.rotateAroundInternalPoint = function (m1, x, y, angle) {
	var m = $doodle.Matrix.translate(m1, x, y);
	m = $doodle.Matrix.rotate(m, angle * Math.PI / 180);
	m = $doodle.Matrix.translate(m, -x, -y);
	return m;
};

$doodle.Matrix.rotateAroundExternalPoint = function (m1, x, y, angle) {
	var m = m1.concat();
	
	m = $doodle.Matrix.translate(m, x, y);
	m = $doodle.Matrix.rotate(m, angle * Math.PI / 180);
	m = $doodle.Matrix.translate(m, -x, -y);
	return m;
};
