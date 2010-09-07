function Arrow () {
  return doodle.Sprite(function () {
    this.graphics.lineStyle(2, "#000000", 1);
    this.graphics.beginFill("#ffff00");
    this.graphics.beginPath();
    this.graphics.moveTo(-50, -25);
    this.graphics.lineTo(0, -25);
    this.graphics.lineTo(0, -50);
    this.graphics.lineTo(50, 0);
    this.graphics.lineTo(0, 50);
    this.graphics.lineTo(0, 25);
    this.graphics.lineTo(-50, 25);
    this.graphics.lineTo(-50, -25);
    this.graphics.closePath();
    this.graphics.endFill();
  });
}
