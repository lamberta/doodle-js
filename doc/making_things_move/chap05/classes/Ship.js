function Ship () {
  return doodle.Sprite(function () {
    //method to call when key pressed
    this.draw = function (showFlame) {
      this.graphics.clear();
      this.graphics.lineStyle(1, 0xffffff);
      this.graphics.beginPath();
      this.graphics.moveTo(10, 0);
      this.graphics.lineTo(-10, 10);
      this.graphics.lineTo(-5, 0);
      this.graphics.lineTo(-10, -10);
      this.graphics.lineTo(10, 0);
      this.graphics.stroke();
      
      if (showFlame) {
        this.graphics.beginPath();
        this.graphics.moveTo(-7.5, -5);
        this.graphics.lineTo(-15, 0);
        this.graphics.lineTo(-7.5, 5);
        this.graphics.stroke();
      }
    };
  });
}
