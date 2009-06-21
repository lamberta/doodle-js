FunctionTest = TestCase("FunctionTest");

FunctionTest.prototype.test_bind = function() {
	expectAsserts(2);
	var obj1 = {name: "object 1",
				method: function () { return this.name; }}

	var obj2 = {name: "object 2"};

	var f2 = obj1.method.bind(obj2);

	assertEquals("object 1", obj1.method());
	assertEquals("object 2", f2());
};
