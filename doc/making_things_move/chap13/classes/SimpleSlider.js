
function SimpleSlider (min, max, value) {
  //parameter defaults
  min = (min === undefined) ? 0 : min;
  max = (max === undefined) ? 100 : max;
  value = (value === undefined) ? 100 : value;
  
  var _width = 16,
      _height = 100,
      _value,
      _max = 100,
      _min = 0,
      _handle,
      _back,
      _backWidth = 4,
      _handleHeight = 6,
      _backColor = 0xcccccc,
      _backBorderColor = 0x999999,
      _handleColor = 0xeeeeee,
      _handleBorderColor = 0xcccccc,
      _handleRadius = 2,
      _backRadius = 2;
  
  _min = min;
  _max = max;
  _value = Math.min(Math.max(value, min), max);

  var simple_slider =  doodle.Sprite();
  init();

  function init () {
    _back = doodle.Sprite();
    simple_slider.addChild(_back);

    _handle = doodle.Sprite();
    simple_slider.addChild(_handle);
    _handle.addEventListener(doodle.MouseEvent.MOUSE_DOWN, onMouseDown);

    draw();
    updatePosition();
  }

  function draw () {
    drawBack();
    drawHandle();
  }

  function drawBack () {
    _back.graphics.clear();
    _back.graphics.beginFill(_backColor);
    _back.graphics.lineStyle(0, _backBorderColor);
    _back.graphics.roundRect(0, 0, _backWidth, _height, _backRadius, _backRadius);
    _back.graphics.endFill();
    _back.x = _width / 2 - _backWidth / 2;
  }

  function drawHandle () {
    _handle.graphics.clear();
    _handle.graphics.beginFill(_handleColor);
    _handle.graphics.lineStyle(0, _handleBorderColor);
    _handle.graphics.roundRect(0, 0, _width, _handleHeight, _handleRadius, _handleRadius);
    _handle.graphics.endFill();
  }

  function updatePosition () {
    var handleRange = _height - _handleHeight,
        valueRange = _max - _min;
    _handle.y = handleRange - ((_value - _min) / valueRange) * handleRange;
  }

  function updateValue () {
    var handleRange = _height - _handleHeight,
        valueRange = _max - _min;
    _value = (handleRange - _handle.y) / handleRange * valueRange + _min;
    simple_slider.dispatchEvent(doodle.Event(doodle.Event.CHANGE));
  }

  function onMouseDown (event) {
    var display = simple_slider.root;
    display.addEventListener(doodle.MouseEvent.MOUSE_MOVE, onMouseMove);
    display.addEventListener(doodle.MouseEvent.MOUSE_UP, onMouseUp);
  }

  function onMouseMove (event) {
    var display = simple_slider.root;
    var pos_y = simple_slider.globalToLocal({x:display.mouseX, y:display.mouseY}).y,
        h = _height - _handleHeight;
    //set handle position, using height as bounds
    _handle.y = (pos_y < 0) ? 0 : ((pos_y > h) ? h : pos_y);
    updateValue();
  }

  function onMouseUp (event) {
    var display = simple_slider.root;
    display.removeEventListener(doodle.MouseEvent.MOUSE_MOVE, onMouseMove);
    display.removeEventListener(doodle.MouseEvent.MOUSE_UP, onMouseUp);
  }

  function invalidate () {
    draw();
  }

  function move (x, y) {
    simple_slider.x = x;
    simple_slider.y = y;
  }

  function setSize (w, h) {
    _width = w;
    _height = h;
    draw();
  }

  Object.defineProperties(simple_slider, {
    'backBorderColor': {
      get: function () { return _backBorderColor; },
      set: function (n) {
        _backBorderColor = n;
        draw();
      }
    },
    'backColor': {
      get: function () { return _backColor; },
      set: function (n) {
        _backColor = n;
        draw();
      }
    },
    'backRadius': {
      get: function () { return _backRadius; },
      set: function (n) {
        return _backRadius;
      }
    },
    'backWidth': {
      get: function () { return _backWidth; },
      set: function (n) {
        _backWidth = n;
        draw();
      }
    },
    'handleBorderColor': {
      get: function () { return _handleBorderColor; },
      set: function (n) {
        _handleBorderColor = n;
        draw();
      }
    },
    'handleColor': {
      get: function () { return _handleColor; },
      set: function (n) {
        _handleColor = n;
        draw();
      }
    },
    'handleRadius': {
      get: function () { return _handleRadius; },
      set: function (n) {
        _handleRadius = n;
        draw();
      }
    },
    'handleHeight': {
      get: function () { return _handleHeight; },
      set: function (n) {
        _handleHeight = n;
        draw();
        updatePosition();
      }
    },
    'max': {
      get: function () { return _max; },
      set: function (n) {
        _max = n;
        updatePosition();
      }
    },
    'min': {
      get: function () { return _min; },
      set: function (n) {
        _min = n;
        updatePosition();
      }
    },
    'value': {
      get: function () { return _value; },
      set: function (n) {
        _value = n;
        _value = Math.min(_max, Math.max(_value, _min));
        updatePosition();
      }
    },
    //width/height are super properties
    'w': {
      get: function () { return _width; },
      set: function (n) {
        simple_slider.width = _width = n;
        draw();
      }
    },
    'h': {
      get: function () { return _height; },
      set: function (n) {
        simple_slider.height = _height = n;
        draw();
      }
    }
  });

  return simple_slider;
}
