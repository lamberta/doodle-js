function Point3D (x, y, z) {
  var _vpX = 0,
      _vpY = 0,
      _cX = 0,
      _cY = 0,
      _cZ = 0,
      point3d = doodle.Sprite(function () {
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
        this.z = (z === undefined) ? 0 : z;
        this.fl = 250;

        this.setVanishingPoint = function (vpX, vpY) {
          _vpX = vpX;
          _vpY = vpY;
        };
        
        this.setCenter = function (cX, cY, cZ) {
          _cX = cX;
          _cY = cY;
          _cZ = cZ;
        };

        this.rotateX = function (angleX) {
          var cosX = Math.cos(angleX),
              sinX = Math.sin(angleX),
              y1 = this.y * cosX - this.z * sinX,
              z1 = this.z * cosX + this.y * sinX;
          this.y = y1;
          this.z = z1;
        };

        this.rotateY = function (angleY) {
          var cosY = Math.cos(angleY),
              sinY = Math.sin(angleY),
              x1 = this.x * cosY - this.z * sinY,
              z1 = this.z * cosY + this.x * sinY;
          this.x = x1;
          this.z = z1;
        };

        this.rotateZ = function (angleZ) {
          var cosZ = Math.cos(angleZ),
              sinZ = Math.sin(angleZ),
              x1 = this.x * cosZ - this.y * sinZ,
              y1 = this.y * cosZ + this.x * sinZ;
          this.x = x1;
          this.y = y1;
        };
      });
  
  Object.defineProperties(point3d, {
    'screenX': {
      get: function () {
        var scale = this.fl / (this.fl + this.z + _cZ);
        return _vpX + (_cX + this.x) * scale;
      }
    },
    'screenY': {
      get: function () {
        var scale = this.fl / (this.fl + this.z + _cZ);
        return _vpY + (_cY + this.y) * scale;
      }
    }
  });
  
  return point3d;
}
