/*
 * 	Ext.ns("Ext.grid", "Ext.list", "Ext.dd", "Ext.tree", "Ext.form", "Ext.menu","Ext.state", "Ext.layout.boxOverflow", "Ext.app", "Ext.ux", "Ext.chart", "Ext.direct", "Ext.slider");
 	Ext.apply(Ext, function(){ });
 */

/*Ext.isEmpty()*/

isNumber = function (n) {
  return Object.prototype.toString.call(n) !== "[object Array]" && !isNaN(parseFloat(n)) && isFinite(n.toString().replace(/^-/, ""));
};
// cal radian
Number.prototype.toRad = function () {
  return (this * Math.PI) / 180;
};

function floatRenderer(value) {
  if (value) {
    var nStr = value;

    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  } else return "";
}

floatAccount = function (value, decimal) {
  var nStr = parseFloat(value);
  var decimal = parseInt(decimal);
  decimal = decimal >= 0 ? decimal : 2;

  if (nStr > 0) {
    nStr += "";
    x = nStr.split(".");

    x[1] = x[1] == undefined ? "0" : x[1];
    x[1] = x[1].length > decimal ? x[1].substring(0, decimal) : x[1];

    return parseFloat(x[0] + "." + x[1]).toFixed(decimal);
  } else {
    return "";
  }
};

// แสดงยอดติดลบได้
floatMinus = function (value, decimal) {
  var nStr = parseFloat(value);
  var decimal = parseInt(decimal);
  decimal = decimal >= 0 ? decimal : 2;

  if ((nStr == "" || isNaN(nStr)) && nStr != 0) {
    return "";
  } else {
    nStr += "";
    x = nStr.split(".");

    x[1] = x[1] == undefined ? "0" : x[1];
    x[1] = x[1].length > decimal ? x[1].substring(0, decimal) : x[1];

    return parseFloat(x[0] + "." + x[1]).toFixed(decimal);
  }
};
