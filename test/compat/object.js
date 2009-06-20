ObjectTest = TestCase("ObjectTest");

ObjectTest.prototype.test_getPrototypeOf = function() {
	expectAsserts(3);
	var a = [1, 2, 3];
	var n = 1;
	assertEquals(Object.getPrototypeOf(a), Array.prototype);
	assertEquals(Object.getPrototypeOf(n), Number.prototype);
	assertEquals(Object.getPrototypeOf("test"), String.prototype);
};
