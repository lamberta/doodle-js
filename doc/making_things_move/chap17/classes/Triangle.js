function Triangle (a, b, c, color) {
  var pointA = a,
      pointB = b,
      pointC = c,
      triangle = doodle.Sprite(function () {
        this.color = color;
        this.light = null;
        this.draw = function (g) {
          if (isBackface()) {
            return;
          }
          //Depth example doesn't set a light, use flat color.
          g.beginFill(this.light ? getAdjustedColor.call(this) : this.color);
          g.beginPath();
          g.moveTo(pointA.screenX, pointA.screenY);
          g.lineTo(pointB.screenX, pointB.screenY);
          g.lineTo(pointC.screenX, pointC.screenY);
          g.lineTo(pointA.screenX, pointA.screenY);
          g.endFill();
        };
      });

  Object.defineProperties(triangle, {
    'depth': {
      get: function () {
        var zpos = Math.min(pointA.z, pointB.z, pointC.z);
        return zpos;
      }
    }
  });

  function getAdjustedColor () {
    var red = this.color >> 16,
        green = this.color >> 8 & 0xff,
        blue = this.color & 0xff,
        lightFactor = getLightFactor.call(this);
    
    red *= lightFactor;
    green *= lightFactor;
    blue *= lightFactor;

    return red << 16 | green << 8 | blue;
  }

  function getLightFactor () {
    var ab = {
          x: pointA.x - pointB.x,
          y: pointA.y - pointB.y,
          z: pointA.z - pointB.z
        },
        bc = {
          x: pointB.x - pointC.x,
          y: pointB.y - pointC.y,
          z: pointB.z - pointC.z
        },
        norm = {
          x: (ab.y * bc.z) - (ab.z * bc.y),
          y: -((ab.x * bc.z) - (ab.z * bc.x)),
          z: (ab.x * bc.y) - (ab.y * bc.x)
        },
        dotProd = norm.x * this.light.x +
                  norm.y * this.light.y +
                  norm.z * this.light.z,
        normMag = Math.sqrt(norm.x * norm.x +
                            norm.y * norm.y +
                            norm.z * norm.z),
        lightMag = Math.sqrt(this.light.x * this.light.x +
                             this.light.y * this.light.y +
                             this.light.z * this.light.z);
    
    return (Math.acos(dotProd / (normMag * lightMag)) / Math.PI) * this.light.brightness;
  }
  
  function isBackface () {
    //see http://www.jurjans.lv/flash/shape.html
    var cax = pointC.screenX - pointA.screenX,
        cay = pointC.screenY - pointA.screenY,
        bcx = pointB.screenX - pointC.screenX,
        bcy = pointB.screenY - pointC.screenY;
    return cax * bcy > cay * bcx;
  }
  
  return triangle;
}
