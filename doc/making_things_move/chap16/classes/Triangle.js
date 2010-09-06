function Triangle (a, b, c, color) {
  var pointA = a,
      pointB = b,
      pointC = c;
  return doodle.Sprite(function () {
    this.color = color;
    this.draw = function (g) {
      g.beginFill(this.color, 0.5);
      g.beginPath();
      g.moveTo(pointA.screenX, pointA.screenY);
      g.lineTo(pointB.screenX, pointB.screenY);
      g.lineTo(pointC.screenX, pointC.screenY);
      g.lineTo(pointA.screenX, pointA.screenY);
      g.endFill();
    };
  });
}
