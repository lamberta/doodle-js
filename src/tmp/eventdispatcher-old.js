doodle = {};

Object.defineProperties(doodle, {
	'event': {
		get: function () {
			var event = document.createEvent("Event");
			event.init = function (eventType, useCapture) {
				this.initEvent(eventType, true);
				return this;
			};
			return event;
		}
	}
});

var DoodleEvent = {
	TEST: "test"
};

doodle.eventdispatcher = {
	init: function () {
		this.eventListeners = {};
		return this;
	},
	eventListeners: null, //{}
	
	addEventListener: function (type, listener, useCapture) {
		if (!this.eventListeners[type]) {
			this.eventListeners[type] = {capture:[], bubble:[]};
		}
		var phase = useCapture ? 'capture' : 'bubble';
		this.eventListeners[type][phase].push(listener);
	},
	removeEventListener: function (type, listener, useCapture) {
		if (!this.eventListeners[type]) {
			return
		}
		var phase = useCapture ? 'capture' : 'bubble',
				els = this.eventListeners[type];
		els[phase].splice(els[phase].indexOf(listener), 1);
		//if none left, remove event type object
		if (els.capture.length === 0 && els.bubble.length === 0) {
			delete this.eventListeners[type];
		}
	},
	hasEventListener: function (type) {
		return this.eventListeners.hasOwnProperty(type);
	},
	dispatchEvent: function (event) {
		var type = event.type;
		if (!event.target) {
			event.target = this.root.target;

			if (!event.target) {
				event.target = this;
			}
		}
		//gather nodes in an array to send event
		var path = [];
		var node = event.target;
		while (node && node != this) {
			path.push(node);
			node = node.parent;
		}
		path.push(this);
		
		event.phase = 'capture';
		for (var i = path.length - 1; i >= 0; i--) {
			if (!path[i].handleEvent(event)) {
				return false;
			}
		}
		event.phase = 'bubble';
		for (var i = 0; i < path.length; i++) {
			if (!path[i].handleEvent(event)) {
				return false;
			}
		}
		return true;
	},
	handleEvent: function (event) {
		//var type = event.type;
		//var phase = event.phase;
		/*if (this.cursor && phase === 'capture') {
			event.cursor = this.cursor; //?cursor?
		}*/
		//check for listener callbacks that match event type and phase
		var listeners = this.eventListeners[event.type];
		listeners = listeners && listeners[event.phase]; //return array
		if (listeners) {
			//if we have any, call each handler with event object
			for (var i = 0; i < listeners.length; i++) {
        var rv = listeners[i].call(this, event);
				
        if (rv == false || event.stopped) {
          if (!event.stopped) {
            event.stopPropagation();
					}
          event.stopped = true;
          return false;
        }
      }
		}
		return true;
	},

	//bare-bones
	fire: function (event) {
		//event: {type:"foo", phase:"bubble"}
    if (!event.target) {
      event.target = this;
    }
    var listeners = this.eventListeners[event.type][event.phase],
				len = listeners.length;
		for (var i = 0; i < len; i++) {
      listeners[i].call(this, event);
    }
	}
	
};
