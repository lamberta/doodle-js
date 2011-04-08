function Tree () {
  return doodle.Sprite(function () {
    this.xpos = 0;
    this.ypos = 0;
    this.zpos = 0;

    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.beginPath();
    this.graphics.lineTo(0, -140 - Math.random() * 20);
    this.graphics.moveTo(0, -30 - Math.random() * 30);
    this.graphics.lineTo(Math.random() * 80 - 40,
                         -100 - Math.random() * 40);
    this.graphics.moveTo(0, -60 - Math.random() * 40);
    this.graphics.lineTo(Math.random() * 60 - 30,
                         -110 - Math.random() * 20);
    this.graphics.stroke();
  });
}
