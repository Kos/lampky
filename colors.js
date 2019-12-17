
var rgbToHex = function (rgb) { 
  // assume rgb 0 .. 1
  rgb *= 255;
  var hex = Number(rgb|0).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

var fullColorHex = function(a) {   
  const [r, g, b] = a;
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return "#" + red+green+blue;
};

function monoHex(b) {
  return fullColorHex([b, b, b]);
}

function lerp(c1, c2, val) {
  const lav = 1-val;
  return [
    c1[0] * lav + c2[0] * val,
    c1[1] * lav + c2[1] * val,
    c1[2] * lav + c2[2] * val,
  ];
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return [
      r, g, b
  ]
}