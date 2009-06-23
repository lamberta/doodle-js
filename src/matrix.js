/**
 * contains methods for modifying individual properties of a transformation matrix:
 * horizontal and vertical scale, horizontal and vertical skew, and rotation.
 * This class also has methods for rotating around a given transformation point
 * rather than the typical (0, 0) point.
**/

//namespacing
if (!$doodle) {
	var $doodle = {};
}
if (!$doodle.Matrix) {
	$doodle.Matrix = {};
}

//a matrix is an array containing 6 numbers
$doodle.Matrix.isMatrix = function (m1) {
	if (Array.isArray(m1) && m1.length === 6) {
		var i = m1.length;
		while (--i > -1) {
			if (typeof m1[i] !== 'number') {
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
};

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
	if ($doodle.Matrix.isMatrix(m1)) {
		m1[0] = 1;
		m1[1] = 0;
		m1[2] = 0;
		m1[3] = 1;
		m1[4] = 0;
		m1[5] = 0;
		return m1;
	}
	//otherwise...
	throw new TypeError("Matrix.nidentity: argument is not a matrix.");
};

$doodle.Matrix.create = function (a, b, c, d, tx, ty) {
	var len = arguments.length,
		m;

	if (len === 6) {
		//given 6 numbers
		m = Array.prototype.slice.call(arguments);
		if ($doodle.Matrix.isMatrix(m)) {
			return m;
		}
	} else if (len === 1) {
		//given an array, returns different object
		m = arguments[0].concat();
		if ($doodle.Matrix.isMatrix(m)) {
			return m;
		}
	}
	//otherwise...
	throw new SyntaxError("Matrix.create: A matrix requires 6 numbers.");
};

//given a literal, reuse
$doodle.Matrix.ncreate = function (m1) {
	if ($doodle.Matrix.isMatrix(m1)) {
		return m1;
	} else {
		var m = Array.prototype.slice.call(arguments);
		$doodle.Matrix.create(m);
	}
};

$doodle.Matrix.add = function (m1, m2) {
	var m = new Array(6);
	m[0] = m1[0] + m2[0];
	m[1] = m1[1] + m2[1];
	m[2] = m1[2] + m2[2];
	m[3] = m1[3] + m2[3];
	m[4] = m1[4] + m2[4];
	m[5] = m1[5] + m2[5];
	return m;
};

$doodle.Matrix.nadd = function (m1, m2) {
	m1[0] = m1[0] + m2[0];
	m1[1] = m1[1] + m2[1];
	m1[2] = m1[2] + m2[2];
	m1[3] = m1[3] + m2[3];
	m1[4] = m1[4] + m2[4];
	m1[5] = m1[5] + m2[5];
	return m1;
};

/*
 * m11 m21 dx   m[0], m[2], m[4]
 * m12 m22 dy   m[1], m[3], m[5]
 *  0   0  1
 */
$doodle.Matrix.multiply = function (m1, m2) {
	var m = new Array(6);
	m[0] = m1[0] * m2[0] + m1[2] * m2[1];
	m[1] = m1[1] * m2[0] + m1[3] * m2[1];
	m[2] = m1[0] * m2[2] + m1[2] * m2[3];
	m[3] = m1[1] * m2[2] + m1[3] * m2[3];
	m[4] = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	m[5] = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	return m;
};

$doodle.Matrix.nmultiply = function (m1, m2) {
	var a = m1[0] * m2[0] + m1[2] * m2[1],
		b = m1[1] * m2[0] + m1[3] * m2[1],
		c = m1[0] * m2[2] + m1[2] * m2[3],
		d = m1[1] * m2[2] + m1[3] * m2[3];
	m1[4] = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	m1[5] = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	m1[0] = a;
	m1[1] = b;
	m1[2] = c;
	m1[3] = d;
	return m1;
};

$doodle.Matrix.translate = function (m1, dx, dy) {
	return $doodle.Matrix.multiply(m1, [1, 0, 0, 1, dx, dy]);
};

$doodle.Matrix.ntranslate = function (m1, dx, dy) {
	return $doodle.Matrix.nmultiply(m1, [1, 0, 0, 1, dx, dy]);
};

$doodle.Matrix.rotate = function (m1, angle /*radians*/) {
	var sin = Math.sin(angle),
		cos = Math.cos(angle);
	return $doodle.Matrix.multiply(m1, [cos, sin, -sin, cos, 0, 0]);
};

$doodle.Matrix.nrotate = function (m1, angle /*radians*/) {
	var sin = Math.sin(angle),
		cos = Math.cos(angle);
	return $doodle.Matrix.nmultiply(m1, [cos, sin, -sin, cos, 0, 0]);
};

$doodle.Matrix.scale = function (m1, sx, sy) {
	return $doodle.Matrix.multiply(m1, [sx, 0, 0, sy, 0, 0]);
};

$doodle.Matrix.nscale = function (m1, sx, sy) {
	return $doodle.Matrix.nmultiply(m1, [sx, 0, 0, sy, 0, 0]);
};

$doodle.Matrix.skew = function (m1, sx, sy) {
	var skewX = Math.tan(sx),
		skewY = Math.tan(sy);
	return $doodle.Matrix.multiply(m1, [1, skewY, skewX, 1, 0, 0]);
};

$doodle.Matrix.nskew = function (m1, sx, sy) {
	var skewX = Math.tan(sx),
		skewY = Math.tan(sy);
	return $doodle.Matrix.nmultiply(m1, [1, skewY, skewX, 1, 0, 0]);
};

//when a matrix is multiplied by it's inversion matrix
//it returns an identity matrix.
//this function doesn't always work
$doodle.Matrix.invert = function (m1) {
	var m = new Array(6),
		det =  m1[0] * m1[3] - m1[1] * m1[2];
	m[0] =  m1[3] / det;
	m[1] = -m1[1] / det;
	m[2] = -m1[2] / det;
	m[3] =  m1[0] / det;
	m[4] =  (m1[5] * m1[2] - m1[3] * m1[4]) / det;
	m[5] = -(m1[5] * m1[0] - m1[1] * m1[4]) / det;
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
