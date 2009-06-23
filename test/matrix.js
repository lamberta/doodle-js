MatrixTest = TestCase("MatrixTest");

MatrixTest.prototype.test_isMatrix = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = [1, 0, 0, 1, 0, 0, 0],
		c = [1, 0, 0, 1, 0],
		d = [1, 0, 0, "1", 0, 0];

	assertTrue($doodle.Matrix.isMatrix(a));
	assertFalse($doodle.Matrix.isMatrix(b));
	assertFalse($doodle.Matrix.isMatrix(c));
	assertFalse($doodle.Matrix.isMatrix(d));
	assertFalse($doodle.Matrix.isMatrix(1, 0, 0, 1, 0, 0));
};

MatrixTest.prototype.test_identity = function() {
	var m = $doodle.Matrix.identity();
	
	assertTrue($doodle.Matrix.isMatrix(m));
	assertEquals(m[0], 1);
	assertEquals(m[1], 0);
	assertEquals(m[2], 0);
	assertEquals(m[3], 1);
	assertEquals(m[4], 0);
	assertEquals(m[5], 0);
};

MatrixTest.prototype.test_nidentity = function() {
	var a = [1, 2, 3, 4, 5, 6],
		b = $doodle.Matrix.nidentity(a);

	//b should now be a reference to a
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 1);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	//a has been modified
	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 1);
	assertEquals(a[1], 0);
	assertEquals(a[2], 0);
	assertEquals(a[3], 1);
	assertEquals(a[4], 0);
	assertEquals(a[5], 0);
	//it's the same object...
	assertSame(a, b);
	try {
		$doodle.Matrix.nidentity([1, 0, 0, "1", 0, 0]);
	} catch (e) {
		assertTrue(e instanceof TypeError);
	}
};

MatrixTest.prototype.test_create = function() {
	var a = $doodle.Matrix.create(1, 0, 0, 1, 0, 0),
		b = $doodle.Matrix.create(a);

	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 1);
	assertEquals(a[1], 0);
	assertEquals(a[2], 0);
	assertEquals(a[3], 1);
	assertEquals(a[4], 0);
	assertEquals(a[5], 0);

	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 1);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	//it's not the same object...
	assertNotSame(a, b);
	try {
		$doodle.Matrix.create([1, 0, 0, "1", 0, 0]);
	} catch (e) {
		assertTrue(e instanceof SyntaxError);
	}
	try {
		$doodle.Matrix.create(1, 0, 0, 1, 0, 0, 0);
	} catch (e) {
		assertTrue(e instanceof SyntaxError);
	}
};

MatrixTest.prototype.test_ncreate = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.ncreate(a),
		c = $doodle.Matrix.ncreate(1, 0, 0, 1, 0, 0);

	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 1);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	assertSame(a, b);
	assertNotSame(b, c);
};

MatrixTest.prototype.test_add = function() {
	var a = [1, 2, 3, 4, 5, 6],
		b = [2, 4, 6, 8, 10, 12],
		c = $doodle.Matrix.add(a, b);
	
	assertTrue($doodle.Matrix.isMatrix(c));
	assertEquals(c[0], 3);
	assertEquals(c[1], 6);
	assertEquals(c[2], 9);
	assertEquals(c[3], 12);
	assertEquals(c[4], 15);
	assertEquals(c[5], 18);
	assertNotSame(a, c);
};

MatrixTest.prototype.test_nadd = function() {
	var a = [1, 2, 3, 4, 5, 6],
		b = [2, 4, 6, 8, 10, 12],
		c = $doodle.Matrix.nadd(a, b);
	
	assertTrue($doodle.Matrix.isMatrix(c));
	assertEquals(c[0], 3);
	assertEquals(c[1], 6);
	assertEquals(c[2], 9);
	assertEquals(c[3], 12);
	assertEquals(c[4], 15);
	assertEquals(c[5], 18);
	//a has been modified..
	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 3);
	assertEquals(a[1], 6);
	assertEquals(a[2], 9);
	assertEquals(a[3], 12);
	assertEquals(a[4], 15);
	assertEquals(a[5], 18);
	//..because they're the same object
	assertSame(a, c);
};

MatrixTest.prototype.test_multiply = function() {
	var a = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
		b = [1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
		c = $doodle.Matrix.multiply(a, b);
	
	assertTrue($doodle.Matrix.isMatrix(c));
	assertEquals(c[0], 0.47);
	assertEquals(c[1], 0.7);
	assertEquals(c[2], 0.55);
	assertEquals(c[3], 0.82);
	assertEquals(c[4], 1.13);
	assertEquals(c[5], 1.54);
	assertNotSame(a, c);
};

MatrixTest.prototype.test_nmultiply = function() {
	var a = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
		b = [1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
		c = $doodle.Matrix.nmultiply(a, b);
	
	assertTrue($doodle.Matrix.isMatrix(c));
	assertEquals(c[0], 0.47);
	assertEquals(c[1], 0.7);
	assertEquals(c[2], 0.55);
	assertEquals(c[3], 0.82);
	assertEquals(c[4], 1.13);
	assertEquals(c[5], 1.54);
	//a has been modified..
	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 0.47);
	assertEquals(a[1], 0.7);
	assertEquals(a[2], 0.55);
	assertEquals(a[3], 0.82);
	assertEquals(a[4], 1.13);
	assertEquals(a[5], 1.54);
	//..because they're the same object
	assertSame(a, c);
};

MatrixTest.prototype.test_translate = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.translate(a, 50, 150);
	
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 1);
	assertEquals(b[4], 50);
	assertEquals(b[5], 150);
	assertNotSame(a, b);
	//and another..
	b = $doodle.Matrix.translate(a, -25, -375);
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 1);
	assertEquals(b[4], -25);
	assertEquals(b[5], -375);
	assertNotSame(a, b);
};

MatrixTest.prototype.test_ntranslate = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.ntranslate(a, 50, 150);
	
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 1);
	assertEquals(b[4], 50);
	assertEquals(b[5], 150);
	//a has been modified..
	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 1);
	assertEquals(a[1], 0);
	assertEquals(a[2], 0);
	assertEquals(a[3], 1);
	assertEquals(a[4], 50);
	assertEquals(a[5], 150);
	assertSame(a, b);
};

MatrixTest.prototype.test_rotate = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.rotate(a, 45 * Math.PI / 180);
	
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 0.7071067811865476);
	assertEquals(b[1], 0.7071067811865475);
	assertEquals(b[2],-0.7071067811865475);
	assertEquals(b[3], 0.7071067811865476);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	assertNotSame(a, b);
};

MatrixTest.prototype.test_nrotate = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.nrotate(a, 45 * Math.PI / 180);

	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 0.7071067811865476);
	assertEquals(b[1], 0.7071067811865475);
	assertEquals(b[2],-0.7071067811865475);
	assertEquals(b[3], 0.7071067811865476);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	//a has been modified..
	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 0.7071067811865476);
	assertEquals(a[1], 0.7071067811865475);
	assertEquals(a[2],-0.7071067811865475);
	assertEquals(a[3], 0.7071067811865476);
	assertEquals(a[4], 0);
	assertEquals(a[5], 0);
	assertSame(a, b);
};

MatrixTest.prototype.test_scale = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.scale(a, 1.5, 3);
	
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1.5);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 3);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	assertNotSame(a, b);
	//and another..
	b = $doodle.Matrix.scale(a, 2, -1.4);
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 2);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], -1.4);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	assertNotSame(a, b);
};

MatrixTest.prototype.test_nscale = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.nscale(a, 1.5, 3);
	
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1.5);
	assertEquals(b[1], 0);
	assertEquals(b[2], 0);
	assertEquals(b[3], 3);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	//a has been modified..
	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 1.5);
	assertEquals(a[1], 0);
	assertEquals(a[2], 0);
	assertEquals(a[3], 3);
	assertEquals(a[4], 0);
	assertEquals(a[5], 0);
	assertSame(a, b);
};

MatrixTest.prototype.test_skew = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.skew(a, 0.5, 0.4);
	
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0.4227932187381618);
	assertEquals(b[2], 0.5463024898437905);
	assertEquals(b[3], 1);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	assertNotSame(a, b);
};

MatrixTest.prototype.test_nskew = function() {
	var a = [1, 0, 0, 1, 0, 0],
		b = $doodle.Matrix.nskew(a, 0.5, 0.4);
	
	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(b[0], 1);
	assertEquals(b[1], 0.4227932187381618);
	assertEquals(b[2], 0.5463024898437905);
	assertEquals(b[3], 1);
	assertEquals(b[4], 0);
	assertEquals(b[5], 0);
	//a has been modified..
	assertTrue($doodle.Matrix.isMatrix(a));
	assertEquals(a[0], 1);
	assertEquals(a[1], 0.4227932187381618);
	assertEquals(a[2], 0.5463024898437905);
	assertEquals(a[3], 1);
	assertEquals(a[4], 0);
	assertEquals(a[5], 0);
	assertSame(a, b);
};

MatrixTest.prototype.test_invert = function() {
	var a = [1, 2, 3, 4, 5, 6],
		b = $doodle.Matrix.invert(a),
		c = $doodle.Matrix.multiply(a, b);

	assertTrue($doodle.Matrix.isMatrix(b));
	assertEquals(c[0], 1);
	assertEquals(c[1], 0);
	assertEquals(c[2], 0);
	assertEquals(c[3], 1);
	assertEquals(c[4], 0);
	assertEquals(c[5], 0);
	assertNotSame(a, b);
};
