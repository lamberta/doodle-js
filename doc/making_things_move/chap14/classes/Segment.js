function Segment (segmentWidth, segmentHeight, color) {
  color = color || 0xffffff;
  return doodle.Sprite(function () {
    this.segmentWidth = segmentWidth;
    this.segmentHeight = segmentHeight;
    this.vx = 0;
    this.vy = 0;
    init.call(this);

    function init () {
      //draw the segment itself
      this.graphics.lineStyle(0);
      this.graphics.beginFill(color);
      this.graphics.roundRect(-segmentHeight / 2,
                              -segmentHeight / 2,
                              segmentWidth + segmentHeight,
                              segmentHeight,
                              segmentHeight / 2,
                              segmentHeight / 2);
      this.graphics.endFill();
      //draw the two "pins"
      this.graphics.circle(0, 0, 2);
      this.graphics.circle(segmentWidth, 0, 2);
    }

    this.getPin = function () {
      var angle = this.rotation * Math.PI / 180,
          xPos = this.x + Math.cos(angle) * segmentWidth,
          yPos = this.y + Math.sin(angle) * segmentWidth;
      return {x:xPos, y:yPos}; //point
    };
  });
}
