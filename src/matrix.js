/**
 * The n-functions are short for "non-concating". These do not create
 * new array objects, but overwrite the first array values.
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
//alias
$doodle.matrixp = $doodle.Matrix.isMatrix;

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

//get angle in radians of rotation in a matrix
$doodle.Matrix.rotation = function (m1) {
	return Math.atan2(m1[1], m1[0]);
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

$doodle.Matrix.transformPoint = function (m1, p) {
	return {
		x: p.x * m1[0] + p.y * m1[1] + m1[4],
		y: p.x * m1[2] + p.y * m1[3] + m1[5]
	};
};

$doodle.Matrix.ntransformPoint = function (m1, p) {
	var x = p.x * m1[0] + p.y * m1[1] + m1[4],
		y = p.x * m1[2] + p.y * m1[3] + m1[5];
	p.x = x;
	p.y = y;
	return p;
};

//same as transformPoint, except matrix translate has no effect
$doodle.Matrix.deltaTransformPoint = function (m1, p) {
	return {
		x: p.x * m1[0] + p.y * m1[1],
		y: p.x * m1[2] + p.y * m1[3]
	};
};

$doodle.Matrix.ndeltaTransformPoint = function (m1, p) {
	var x = p.x * m1[0] + p.y * m1[1],
		y = p.x * m1[2] + p.y * m1[3];
	p.x = x;
	p.y = y;
	return p;
};



$doodle.Matrix.rotateAroundExternalPoint = function (m1, x, y, angle /*degrees*/) {
	var m = $doodle.Matrix.translate(m1, x, y);
	$doodle.Matrix.nrotate(m, angle * Math.PI / 180);
	m[4] -= x;
	m[5] -= y;
	return m;
};

$doodle.Matrix.nrotateAroundExternalPoint = function (m1, x, y, angle /*degrees*/) {
	m1[4] += x;
	m1[5] += y;
	$doodle.Matrix.nrotate(m1, angle * Math.PI / 180);
	m1[4] -= x;
	m1[5] -= y;
	return m1;
};

$doodle.Matrix.rotateAroundInternalPoint = function (m1, x, y, angle /*degrees*/) {
	var p = $doodle.Matrix.transformPoint(m1, {x: x, y: y}),
		m = $doodle.Matrix.rotateAroundExternalPoint(m1, p.x, p.y, angle);
	return m;
};

$doodle.Matrix.nrotateAroundInternalPoint = function (m1, x, y, angle /*degrees*/) {
	var p = $doodle.Matrix.transformPoint(m1, {x: x, y: y});
	$doodle.Matrix.nrotateAroundExternalPoint(m1, p.x, p.y, angle);
	return m1;
};

/**
 * Moves a matrix to align an internal point with an external point.
 * Can be used to match a point in a transformed sprite with one in its parent.
 */
$doodle.Matrix.matchInternalPointWithExternal = function (m1, int_point, ext_point) {
	var int_p_trans = $doodle.Matrix.transformPoint(m1, int_point),
		dx = ext_point.x - int_p_trans.x,
		dy = ext_point.y - int_p_trans.y,
		m = $doodle.Matrix.translate(m1, dx, dy);
	return m;
};

$doodle.Matrix.nmatchInternalPointWithExternal = function (m1, int_point, ext_point) {
	var int_p_trans = $doodle.Matrix.transformPoint(m1, int_point),
		dx = ext_point.x - int_p_trans.x,
		dy = ext_point.y - int_p_trans.y;
	m1[4] += dx;
	m1[5] += dy;
	return m1;
};
