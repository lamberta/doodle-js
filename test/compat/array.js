ArrayTest = TestCase("ArrayTest");

/* Javascript 1.6 Array methods */

ArrayTest.prototype.test_indexOf = function() {
	expectAsserts(3);
	var a = ['a', 'b', 'a', 'b', 'a'];
	assertEquals(a.indexOf('b'), 1);
	assertEquals(a.indexOf('b', 2), 3);
	assertEquals(a.indexOf('z'), -1);
};

ArrayTest.prototype.test_lastIndexOf = function() {
	expectAsserts(3);
	var a = ['a', 'b', 'c', 'd', 'a', 'b'];
	assertEquals(a.lastIndexOf('b'), 5);
	assertEquals(a.lastIndexOf('b', 4), 1);
	assertEquals(a.lastIndexOf('z'), -1);
};

ArrayTest.prototype.test_every = function() {
	expectAsserts(2);
	var isNumber = function(x) { return typeof x == 'number'; }
	var a = [1, 2, 3];
	assertTrue(a.every(isNumber));
	var b = [1, '2', 3];
	assertFalse(b.every(isNumber));
};

ArrayTest.prototype.test_some = function() {
	expectAsserts(3);
	var isNumber = function(x) { return typeof x == 'number'; }
	var a = [1, 2, 3];
	assertTrue(a.some(isNumber));
	var b = [1, '2', 3];
	assertTrue(b.some(isNumber));
	var c = ['1', '2', '3'];
	assertFalse(c.some(isNumber));
};

ArrayTest.prototype.test_forEach = function() {
	expectAsserts(3);
	var a = ['a', 'b', 'c'];
	var b = [];
	a.forEach(function(x){ b.push(x.toUpperCase()); });
	assertEquals(b[0], 'A');
	assertEquals(b[1], 'B');
	assertEquals(b[2], 'C');
};

ArrayTest.prototype.test_filter = function() {
	expectAsserts(3);
	var a = ['a', 10, 'b', 20, 'c', 30];
	var b = a.filter(function(x) { return typeof x == 'number'; });
	assertEquals(b[0], 10);
	assertEquals(b[1], 20);
	assertEquals(b[2], 30);
};

ArrayTest.prototype.test_map = function() {
	expectAsserts(3);
	var a = ['a', 'b', 'c'];
	var b = a.map(function(x) { return x.toUpperCase(); });
	assertEquals(b[0], 'A');
	assertEquals(b[1], 'B');
	assertEquals(b[2], 'C');
};

/* Javascript 1.8 Array methods */

ArrayTest.prototype.test_reduce = function() {
	expectAsserts(1);
	var a = [10, 20, 30];
	var total = a.reduce(function(x, y){ return x + y; }, 0);
	assertEquals(total, 60);
};

ArrayTest.prototype.test_reduceRight = function() {
	expectAsserts(1);
	var a = [10, 20, 30];
	var total = a.reduceRight(function(x, y){ return x + y; }, 0);
	assertEquals(total, 60);
};

ArrayTest.prototype.test_isArray = function() {
	expectAsserts(7);
	var a = [1, 2, 3],
		b = new Array(1);
	
	assertTrue(Array.isArray(a));
	assertTrue(Array.isArray(b));
	assertFalse(Array.isArray({a: 1, b: 2}));
	assertFalse(Array.isArray("test"));
	assertFalse(Array.isArray(1));

	(function () {
		assertFalse(Array.isArray(arguments));
		var a = Array.prototype.slice.call(arguments);
		assertTrue(Array.isArray(a));
	})();
};
