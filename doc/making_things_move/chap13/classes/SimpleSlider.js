
function SimpleSlider (min, max, value) {
  //parameter defaults
  min = min || 0;
  max = max || 100;
  value = value || 100;
  
  var _width = 6,
      _height = 100,
      _value,
      _max = 100,
      _min = 0,
      _handle,
      _back,
      _backWidth = 0,
      _handleHeight = 20,
      _backColor = 0xcccccc,
      _backBorderColor = 0x999999,
      _handleColor = 0x000000,
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
    _handle.graphics.rect(0, 0, _width, _handleHeight);
    _handle.graphics.endFill();
  }

  function updatePosition () {
    var handleRange = _height - _handleHeight,
        valueRange = _max - _min;
    _handle.y = handleRange - (_value - _min) / valueRange * handleRange;
  }

  function updateValue () {
    var handleRange = _height - _handleHeight,
        valueRange = _max - _min;
    _value = (handleRange - _handle.y) / handleRange * valueRange + _min;
    simple_slider.dispatchEvent(doodle.Event(Event.CHANGE));
  }

  function onMouseUp (event) {
    display.removeEventListener(doodle.MouseEvent.MOUSE_MOVE, onMouseMove);
    display.removeEventListener(doodle.Mouse_Move.MOUSE_UP, onMouseUp);
    _handle.stopDrag();
  }

  function onMouseDown (event) {
    display.addEventListener(doodle.MouseEvent.MOUSE_MOVE, onMouseMove);
    display.addEventListener(doodle.MouseEvent.MOUSE_UP, onMouseUp);
    _handle.startDrag();
  }

  function onMouseMove (event) {
    updateValue();
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
    }
  });


  return simple_slider;
}
