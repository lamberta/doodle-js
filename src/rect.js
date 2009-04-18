$doodle.rect = function (params) {
	//type-check required parameters
	if(typeof params.width !=='number' ||
	   typeof params.height !=='number') {
		throw new SyntaxError("rect: requires width and height parameters.");
	}
	
	var self = $doodle.sprite(params); //inherit sprite properties

	/*
	 * This function gets called when it's time to draw.
	 * In local space, (0,0) is top-left corner of sprite.
	 */
	self.mold = function() {
		self.context.fillStyle = self.fill;
		self.context.fillRect(0, 0, self.width, self.height);
	};

	return self; //allows chaining
};
