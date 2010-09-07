function Box (width, height, color) {
  width = (width === undefined) ? 50 : width;
  height = (height === undefined) ? 50 : height;
  color = color || "#ff0000";
  return doodle.Sprite(function () {
    this.vx = 0;
    this.vy = 0;
    
    this.graphics.beginFill(color);
    this.graphics.rect(-width/2, -height/2, width, height);
    this.graphics.endFill();
  });
}
