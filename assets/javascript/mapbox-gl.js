(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.mapboxgl = f();
  }
})(function() {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw ((f.code = "MODULE_NOT_FOUND"), f);
        }
        var l = (n[o] = { exports: {} });
        t[o][0].call(
          l.exports,
          function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          },
          l,
          l.exports,
          e,
          t,
          n,
          r
        );
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  })(
    {
      1: [
        function(require, module, exports) {
          "use strict";
          function Bucket(e) {
            (this.zoom = e.zoom),
              (this.tileExtent = e.tileExtent),
              (this.layer = StyleLayer.create(e.layer)),
              this.layer.recalculate(this.zoom, {
                lastIntegerZoom: 1 / 0,
                lastIntegerZoomTime: 0,
                lastZoom: 0
              }),
              (this.layers = [this.layer.id]),
              (this.type = this.layer.type),
              (this.features = []),
              (this.id = this.layer.id),
              (this["source-layer"] = this.layer["source-layer"]),
              (this.interactive = this.layer.interactive),
              (this.minZoom = this.layer.minzoom),
              (this.maxZoom = this.layer.maxzoom),
              (this.filter = featureFilter(this.layer.filter)),
              this.resetBuffers(e.buffers);
            for (var t in this.shaders) {
              var r = this.shaders[t];
              this[this.getAddMethodName(t, "vertex")] = createVertexAddMethod(
                t,
                r,
                this.getBufferName(t, "vertex")
              );
            }
          }
          function createVertexAddMethod(e, t, r) {
            for (var i = [], s = 0; s < t.attributes.length; s++)
              i = i.concat(t.attributes[s].value);
            var u = "return this.buffers." + r + ".push(" + i.join(", ") + ");";
            return (
              createVertexAddMethodCache[u] ||
                (createVertexAddMethodCache[u] = new Function(
                  t.attributeArgs,
                  u
                )),
              createVertexAddMethodCache[u]
            );
          }
          function createElementAddMethod(e) {
            return function(t, r, i) {
              return e.push(t, r, i);
            };
          }
          function createElementBuffer(e) {
            return new Buffer({
              type: Buffer.BufferType.ELEMENT,
              attributes: [
                {
                  name: "vertices",
                  components: e || 3,
                  type: Buffer.ELEMENT_ATTRIBUTE_TYPE
                }
              ]
            });
          }
          function capitalize(e) {
            return e.charAt(0).toUpperCase() + e.slice(1);
          }
          var featureFilter = require("feature-filter"),
            ElementGroups = require("./element_groups"),
            Buffer = require("./buffer"),
            StyleLayer = require("../style/style_layer");
          (module.exports = Bucket),
            (Bucket.create = function(e) {
              var t = {
                fill: require("./fill_bucket"),
                line: require("./line_bucket"),
                circle: require("./circle_bucket"),
                symbol: require("./symbol_bucket")
              };
              return new t[e.layer.type](e);
            }),
            (Bucket.AttributeType = Buffer.AttributeType),
            (Bucket.prototype.addFeatures = function() {
              for (var e = 0; e < this.features.length; e++)
                this.addFeature(this.features[e]);
            }),
            (Bucket.prototype.makeRoomFor = function(e, t) {
              return this.elementGroups[e].makeRoomFor(t);
            }),
            (Bucket.prototype.resetBuffers = function(e) {
              (this.buffers = e), (this.elementGroups = {});
              for (var t in this.shaders) {
                var r = this.shaders[t],
                  i = this.getBufferName(t, "vertex");
                if (
                  (r.vertexBuffer &&
                    !e[i] &&
                    (e[i] = new Buffer({
                      type: Buffer.BufferType.VERTEX,
                      attributes: r.attributes
                    })),
                  r.elementBuffer)
                ) {
                  var s = this.getBufferName(t, "element");
                  e[s] ||
                    (e[s] = createElementBuffer(r.elementBufferComponents)),
                    (this[
                      this.getAddMethodName(t, "element")
                    ] = createElementAddMethod(this.buffers[s]));
                }
                if (r.secondElementBuffer) {
                  var u = this.getBufferName(t, "secondElement");
                  e[u] ||
                    (e[u] = createElementBuffer(
                      r.secondElementBufferComponents
                    )),
                    (this[
                      this.getAddMethodName(t, "secondElement")
                    ] = createElementAddMethod(this.buffers[u]));
                }
                this.elementGroups[t] = new ElementGroups(
                  e[this.getBufferName(t, "vertex")],
                  e[this.getBufferName(t, "element")],
                  e[this.getBufferName(t, "secondElement")]
                );
              }
            }),
            (Bucket.prototype.getAddMethodName = function(e, t) {
              return "add" + capitalize(e) + capitalize(t);
            }),
            (Bucket.prototype.getBufferName = function(e, t) {
              return e + capitalize(t);
            });
          var createVertexAddMethodCache = {};
        },
        {
          "../style/style_layer": 47,
          "./buffer": 2,
          "./circle_bucket": 3,
          "./element_groups": 4,
          "./fill_bucket": 6,
          "./line_bucket": 7,
          "./symbol_bucket": 8,
          "feature-filter": 105
        }
      ],
      2: [
        function(require, module, exports) {
          "use strict";
          function Buffer(t) {
            if (((this.type = t.type), t.arrayBuffer))
              (this.capacity = t.capacity),
                (this.arrayBuffer = t.arrayBuffer),
                (this.attributes = t.attributes),
                (this.itemSize = t.itemSize),
                (this.length = t.length);
            else {
              (this.capacity = align(
                Buffer.CAPACITY_DEFAULT,
                Buffer.CAPACITY_ALIGNMENT
              )),
                (this.arrayBuffer = new ArrayBuffer(this.capacity)),
                (this.attributes = []),
                (this.itemSize = 0),
                (this.length = 0);
              var e =
                this.type === Buffer.BufferType.VERTEX
                  ? Buffer.VERTEX_ATTRIBUTE_ALIGNMENT
                  : 1;
              (this.attributes = t.attributes.map(function(t) {
                var r = {};
                return (
                  (r.name = t.name),
                  (r.components = t.components || 1),
                  (r.type = t.type || Buffer.AttributeType.UNSIGNED_BYTE),
                  (r.size = r.type.size * r.components),
                  (r.offset = this.itemSize),
                  (this.itemSize = align(r.offset + r.size, e)),
                  r
                );
              }, this)),
                this._createPushMethod(),
                this._refreshViews();
            }
          }
          function align(t, e) {
            e = e || 1;
            var r = t % e;
            return 1 !== e && 0 !== r && (t += e - r), t;
          }
          (Buffer.prototype.bind = function(t) {
            var e = t[this.type];
            this.buffer
              ? t.bindBuffer(e, this.buffer)
              : ((this.buffer = t.createBuffer()),
                t.bindBuffer(e, this.buffer),
                t.bufferData(
                  e,
                  this.arrayBuffer.slice(0, this.length * this.itemSize),
                  t.STATIC_DRAW
                ),
                (this.arrayBuffer = null));
          }),
            (Buffer.prototype.destroy = function(t) {
              this.buffer && t.deleteBuffer(this.buffer);
            }),
            (Buffer.prototype.setAttribPointers = function(t, e, r) {
              for (var i = 0; i < this.attributes.length; i++) {
                var f = this.attributes[i];
                t.vertexAttribPointer(
                  e["a_" + f.name],
                  f.components,
                  t[f.type.name],
                  !1,
                  this.itemSize,
                  r + f.offset
                );
              }
            }),
            (Buffer.prototype.get = function(t) {
              this._refreshViews();
              for (
                var e = {}, r = t * this.itemSize, i = 0;
                i < this.attributes.length;
                i++
              )
                for (
                  var f = this.attributes[i], s = (e[f.name] = []), a = 0;
                  a < f.components;
                  a++
                ) {
                  var h = (r + f.offset) / f.type.size + a;
                  s.push(this.views[f.type.name][h]);
                }
              return e;
            }),
            (Buffer.prototype.validate = function(t) {
              for (var e = 0; e < this.attributes.length; e++)
                for (var r = 0; r < this.attributes[e].components; r++);
            }),
            (Buffer.prototype._resize = function(t) {
              var e = this.views.UNSIGNED_BYTE;
              (this.capacity = align(t, Buffer.CAPACITY_ALIGNMENT)),
                (this.arrayBuffer = new ArrayBuffer(this.capacity)),
                this._refreshViews(),
                this.views.UNSIGNED_BYTE.set(e);
            }),
            (Buffer.prototype._refreshViews = function() {
              this.views = {
                UNSIGNED_BYTE: new Uint8Array(this.arrayBuffer),
                BYTE: new Int8Array(this.arrayBuffer),
                UNSIGNED_SHORT: new Uint16Array(this.arrayBuffer),
                SHORT: new Int16Array(this.arrayBuffer)
              };
            });
          var createPushMethodCache = {};
          (Buffer.prototype._createPushMethod = function() {
            var t = "",
              e = [];
            (t += "var i = this.length++;\n"),
              (t += "var o = i * " + this.itemSize + ";\n"),
              (t +=
                "if (o + " +
                this.itemSize +
                " > this.capacity) { this._resize(this.capacity * 1.5); }\n");
            for (var r = 0; r < this.attributes.length; r++) {
              var i = this.attributes[r],
                f = "o" + r;
              t +=
                "\nvar " +
                f +
                " = (o + " +
                i.offset +
                ") / " +
                i.type.size +
                ";\n";
              for (var s = 0; s < i.components; s++) {
                var a = "v" + e.length,
                  h = "this.views." + i.type.name + "[" + f + " + " + s + "]";
                (t += h + " = " + a + ";\n"), e.push(a);
              }
            }
            (t += "\nreturn i;\n"),
              createPushMethodCache[t] ||
                (createPushMethodCache[t] = new Function(e, t)),
              (this.push = createPushMethodCache[t]);
          }),
            (Buffer.BufferType = {
              VERTEX: "ARRAY_BUFFER",
              ELEMENT: "ELEMENT_ARRAY_BUFFER"
            }),
            (Buffer.AttributeType = {
              BYTE: { size: 1, name: "BYTE" },
              UNSIGNED_BYTE: { size: 1, name: "UNSIGNED_BYTE" },
              SHORT: { size: 2, name: "SHORT" },
              UNSIGNED_SHORT: { size: 2, name: "UNSIGNED_SHORT" }
            }),
            (Buffer.ELEMENT_ATTRIBUTE_TYPE =
              Buffer.AttributeType.UNSIGNED_SHORT),
            (Buffer.CAPACITY_DEFAULT = 8192),
            (Buffer.CAPACITY_ALIGNMENT = 2),
            (Buffer.VERTEX_ATTRIBUTE_ALIGNMENT = 4),
            (module.exports = Buffer);
        },
        {}
      ],
      3: [
        function(require, module, exports) {
          "use strict";
          function CircleBucket() {
            Bucket.apply(this, arguments);
          }
          var Bucket = require("./bucket"),
            util = require("../util/util");
          (module.exports = CircleBucket),
            (CircleBucket.prototype = util.inherit(Bucket, {})),
            (CircleBucket.prototype.shaders = {
              circle: {
                vertexBuffer: !0,
                elementBuffer: !0,
                attributeArgs: ["x", "y", "extrudeX", "extrudeY"],
                attributes: [
                  {
                    name: "pos",
                    components: 2,
                    type: Bucket.AttributeType.SHORT,
                    value: [
                      "(x * 2) + ((extrudeX + 1) / 2)",
                      "(y * 2) + ((extrudeY + 1) / 2)"
                    ]
                  }
                ]
              }
            }),
            (CircleBucket.prototype.addFeature = function(e) {
              for (var t = e.loadGeometry()[0], r = 0; r < t.length; r++) {
                var i = this.makeRoomFor("circle", 4),
                  u = t[r].x,
                  c = t[r].y;
                if (
                  !(
                    0 > u ||
                    u >= this.tileExtent ||
                    0 > c ||
                    c >= this.tileExtent
                  )
                ) {
                  var l =
                    this.addCircleVertex(u, c, -1, -1) - i.vertexStartIndex;
                  this.addCircleVertex(u, c, 1, -1),
                    this.addCircleVertex(u, c, 1, 1),
                    this.addCircleVertex(u, c, -1, 1),
                    (i.vertexLength += 4),
                    this.addCircleElement(l, l + 1, l + 2),
                    this.addCircleElement(l, l + 3, l + 2),
                    (i.elementLength += 2);
                }
              }
            });
        },
        { "../util/util": 98, "./bucket": 1 }
      ],
      4: [
        function(require, module, exports) {
          "use strict";
          function ElementGroups(e, t, n) {
            (this.vertexBuffer = e),
              (this.elementBuffer = t),
              (this.secondElementBuffer = n),
              (this.groups = []);
          }
          function ElementGroup(e, t, n) {
            (this.vertexStartIndex = e),
              (this.elementStartIndex = t),
              (this.secondElementStartIndex = n),
              (this.elementLength = 0),
              (this.vertexLength = 0),
              (this.secondElementLength = 0);
          }
          (module.exports = ElementGroups),
            (ElementGroups.prototype.makeRoomFor = function(e) {
              return (
                (!this.current || this.current.vertexLength + e > 65535) &&
                  ((this.current = new ElementGroup(
                    this.vertexBuffer.length,
                    this.elementBuffer && this.elementBuffer.length,
                    this.secondElementBuffer && this.secondElementBuffer.length
                  )),
                  this.groups.push(this.current)),
                this.current
              );
            });
        },
        {}
      ],
      5: [
        function(require, module, exports) {
          "use strict";
          function FeatureTree(t, e) {
            (this.x = t.x),
              (this.y = t.y),
              (this.z = t.z - Math.log(e) / Math.LN2),
              (this.rtree = rbush(9)),
              (this.toBeInserted = []);
          }
          function geometryIntersectsBox(t, e, n) {
            return "Point" === e
              ? pointIntersectsBox(t, n)
              : "LineString" === e
              ? lineIntersectsBox(t, n)
              : "Polygon" === e
              ? polyIntersectsBox(t, n) || lineIntersectsBox(t, n)
              : !1;
          }
          function polyIntersectsBox(t, e) {
            return polyContainsPoint(t, new Point(e[0], e[1])) ||
              polyContainsPoint(t, new Point(e[0], e[3])) ||
              polyContainsPoint(t, new Point(e[2], e[1])) ||
              polyContainsPoint(t, new Point(e[2], e[3]))
              ? !0
              : lineIntersectsBox(t, e);
          }
          function lineIntersectsBox(t, e) {
            for (var n = 0; n < t.length; n++)
              for (
                var r = t[n], o = 0, i = r.length - 1;
                o < r.length;
                i = o++
              ) {
                var s = r[o],
                  a = r[i],
                  u = new Point(s.y, s.x),
                  l = new Point(a.y, a.x);
                if (
                  segmentCrossesHorizontal(s, a, e[0], e[2], e[1]) ||
                  segmentCrossesHorizontal(s, a, e[0], e[2], e[3]) ||
                  segmentCrossesHorizontal(u, l, e[1], e[3], e[0]) ||
                  segmentCrossesHorizontal(u, l, e[1], e[3], e[2])
                )
                  return !0;
              }
            return pointIntersectsBox(t, e);
          }
          function segmentCrossesHorizontal(t, e, n, r, o) {
            if (e.y === t.y)
              return (
                e.y === o && Math.min(t.x, e.x) <= r && Math.max(t.x, e.x) >= n
              );
            var i = (o - t.y) / (e.y - t.y),
              s = t.x + i * (e.x - t.x);
            return s >= n && r >= s && 1 >= i && i >= 0;
          }
          function pointIntersectsBox(t, e) {
            for (var n = 0; n < t.length; n++)
              for (var r = t[n], o = 0; o < r.length; o++)
                if (
                  r[o].x >= e[0] &&
                  r[o].y >= e[1] &&
                  r[o].x <= e[2] &&
                  r[o].y <= e[3]
                )
                  return !0;
            return !1;
          }
          function geometryContainsPoint(t, e, n, r) {
            return "Point" === e
              ? pointContainsPoint(t, n, r)
              : "LineString" === e
              ? lineContainsPoint(t, n, r)
              : "Polygon" === e
              ? polyContainsPoint(t, n) || lineContainsPoint(t, n, r)
              : !1;
          }
          function distToSegmentSquared(t, e, n) {
            var r = e.distSqr(n);
            if (0 === r) return t.distSqr(e);
            var o = ((t.x - e.x) * (n.x - e.x) + (t.y - e.y) * (n.y - e.y)) / r;
            return 0 > o
              ? t.distSqr(e)
              : o > 1
              ? t.distSqr(n)
              : t.distSqr(
                  n
                    .sub(e)
                    ._mult(o)
                    ._add(e)
                );
          }
          function lineContainsPoint(t, e, n) {
            for (var r = n * n, o = 0; o < t.length; o++)
              for (var i = t[o], s = 1; s < i.length; s++) {
                var a = i[s - 1],
                  u = i[s];
                if (distToSegmentSquared(e, a, u) < r) return !0;
              }
            return !1;
          }
          function polyContainsPoint(t, e) {
            for (var n, r, o, i = !1, s = 0; s < t.length; s++) {
              n = t[s];
              for (var a = 0, u = n.length - 1; a < n.length; u = a++)
                (r = n[a]),
                  (o = n[u]),
                  r.y > e.y != o.y > e.y &&
                    e.x < ((o.x - r.x) * (e.y - r.y)) / (o.y - r.y) + r.x &&
                    (i = !i);
            }
            return i;
          }
          function pointContainsPoint(t, e, n) {
            for (var r = n * n, o = 0; o < t.length; o++)
              for (var i = t[o], s = 0; s < i.length; s++)
                if (i[s].distSqr(e) <= r) return !0;
            return !1;
          }
          var rbush = require("rbush"),
            Point = require("point-geometry"),
            vt = require("vector-tile"),
            util = require("../util/util");
          (module.exports = FeatureTree),
            (FeatureTree.prototype.insert = function(t, e, n) {
              (t.layers = e), (t.feature = n), this.toBeInserted.push(t);
            }),
            (FeatureTree.prototype._load = function() {
              this.rtree.load(this.toBeInserted), (this.toBeInserted = []);
            }),
            (FeatureTree.prototype.query = function(t, e) {
              this.toBeInserted.length && this._load();
              var n,
                r,
                o = t.params || {},
                i = t.x,
                s = t.y,
                a = [];
              "undefined" != typeof i && "undefined" != typeof s
                ? ((n = ((o.radius || 0) * (t.tileExtent || 4096)) / t.scale),
                  (r = [i - n, s - n, i + n, s + n]))
                : (r = [t.minX, t.minY, t.maxX, t.maxY]);
              for (var u = this.rtree.search(r), l = 0; l < u.length; l++) {
                var y = u[l].feature,
                  x = u[l].layers,
                  f = vt.VectorTileFeature.types[y.type];
                if (
                  (!o.$type || f === o.$type) &&
                  (!n ||
                    geometryContainsPoint(
                      y.loadGeometry(),
                      f,
                      new Point(i, s),
                      n
                    )) &&
                  geometryIntersectsBox(y.loadGeometry(), f, r)
                ) {
                  var h = y.toGeoJSON(this.x, this.y, this.z);
                  o.includeGeometry || (h.geometry = null);
                  for (var d = 0; d < x.length; d++) {
                    var g = x[d];
                    (o.layerIds && o.layerIds.indexOf(g) < 0) ||
                      a.push(util.extend({ layer: g }, h));
                  }
                }
              }
              e(null, a);
            });
        },
        {
          "../util/util": 98,
          "point-geometry": 133,
          rbush: 134,
          "vector-tile": 138
        }
      ],
      6: [
        function(require, module, exports) {
          "use strict";
          function FillBucket() {
            Bucket.apply(this, arguments);
          }
          var Bucket = require("./bucket"),
            util = require("../util/util");
          (module.exports = FillBucket),
            (FillBucket.prototype = util.inherit(Bucket, {})),
            (FillBucket.prototype.shaders = {
              fill: {
                vertexBuffer: !0,
                elementBuffer: !0,
                secondElementBuffer: !0,
                secondElementBufferComponents: 2,
                attributeArgs: ["x", "y"],
                attributes: [
                  {
                    name: "pos",
                    components: 2,
                    type: Bucket.AttributeType.SHORT,
                    value: ["x", "y"]
                  }
                ]
              }
            }),
            (FillBucket.prototype.addFeature = function(e) {
              for (var t = e.loadGeometry(), l = 0; l < t.length; l++)
                this.addFill(t[l]);
            }),
            (FillBucket.prototype.addFill = function(e) {
              if (!(e.length < 3))
                for (
                  var t,
                    l,
                    i = e.length,
                    r = this.makeRoomFor("fill", i + 1),
                    n = 0;
                  n < e.length;
                  n++
                ) {
                  var u = e[n],
                    o = this.addFillVertex(u.x, u.y) - r.vertexStartIndex;
                  r.vertexLength++,
                    0 === n && (t = o),
                    n >= 2 &&
                      (u.x !== e[0].x || u.y !== e[0].y) &&
                      (this.addFillElement(t, l, o), r.elementLength++),
                    n >= 1 &&
                      (this.addFillSecondElement(l, o),
                      r.secondElementLength++),
                    (l = o);
                }
            });
        },
        { "../util/util": 98, "./bucket": 1 }
      ],
      7: [
        function(require, module, exports) {
          "use strict";
          function LineBucket() {
            Bucket.apply(this, arguments);
          }
          var Bucket = require("./bucket"),
            util = require("../util/util"),
            EXTRUDE_SCALE = 63;
          (module.exports = LineBucket),
            (LineBucket.prototype = util.inherit(Bucket, {})),
            (LineBucket.prototype.shaders = {
              line: {
                vertexBuffer: !0,
                elementBuffer: !0,
                attributeArgs: [
                  "point",
                  "extrude",
                  "tx",
                  "ty",
                  "dir",
                  "linesofar"
                ],
                attributes: [
                  {
                    name: "pos",
                    components: 2,
                    type: Bucket.AttributeType.SHORT,
                    value: ["(point.x << 1) | tx", "(point.y << 1) | ty"]
                  },
                  {
                    name: "data",
                    components: 4,
                    type: Bucket.AttributeType.BYTE,
                    value: [
                      "Math.round(" + EXTRUDE_SCALE + " * extrude.x)",
                      "Math.round(" + EXTRUDE_SCALE + " * extrude.y)",
                      "((dir < 0) ? -1 : 1) * ((dir ? 1 : 0) | ((linesofar << 1) & 0x7F))",
                      "(linesofar >> 6) & 0x7F"
                    ]
                  }
                ]
              }
            }),
            (LineBucket.prototype.addFeature = function(e) {
              for (var t = e.loadGeometry(), i = 0; i < t.length; i++)
                this.addLine(
                  t[i],
                  this.layer.layout["line-join"],
                  this.layer.layout["line-cap"],
                  this.layer.layout["line-miter-limit"],
                  this.layer.layout["line-round-limit"]
                );
            }),
            (LineBucket.prototype.addLine = function(e, t, i, r, n) {
              for (var s = e.length; s > 2 && e[s - 1].equals(e[s - 2]); ) s--;
              if (!(e.length < 2)) {
                "bevel" === t && (r = 1.05);
                var u = e[0],
                  a = e[s - 1],
                  d = u.equals(a);
                if ((this.makeRoomFor("line", 10 * s), 2 !== s || !d)) {
                  var h,
                    l,
                    o,
                    x,
                    p,
                    m,
                    f,
                    c = i,
                    y = d ? "butt" : i,
                    v = 1,
                    L = 0,
                    V = !0;
                  (this.e1 = this.e2 = this.e3 = -1),
                    d &&
                      ((h = e[s - 2]),
                      (p = u
                        .sub(h)
                        ._unit()
                        ._perp()));
                  for (var _ = 0; s > _; _++)
                    if (
                      ((o = d && _ === s - 1 ? e[1] : e[_ + 1]),
                      !o || !e[_].equals(o))
                    ) {
                      p && (x = p),
                        h && (l = h),
                        (h = e[_]),
                        l && (L += h.dist(l)),
                        (p = o
                          ? o
                              .sub(h)
                              ._unit()
                              ._perp()
                          : x),
                        (x = x || p);
                      var b = x.add(p)._unit(),
                        k = b.x * p.x + b.y * p.y,
                        C = 1 / k,
                        B = l && o,
                        E = B ? t : o ? c : y;
                      if (
                        (B &&
                          "round" === E &&
                          (n > C ? (E = "miter") : 2 >= C && (E = "fakeround")),
                        "miter" === E && C > r && (E = "bevel"),
                        "bevel" === E &&
                          (C > 2 && (E = "flipbevel"), r > C && (E = "miter")),
                        "miter" === E)
                      )
                        b._mult(C), this.addCurrentVertex(h, v, L, b, 0, 0, !1);
                      else if ("flipbevel" === E) {
                        if (C > 100) b = p.clone();
                        else {
                          var g = x.x * p.y - x.y * p.x > 0 ? -1 : 1,
                            S = (C * x.add(p).mag()) / x.sub(p).mag();
                          b._perp()._mult(S * g);
                        }
                        this.addCurrentVertex(h, v, L, b, 0, 0, !1),
                          this.addCurrentVertex(h, -v, L, b, 0, 0, !1);
                      } else if ("bevel" === E || "fakeround" === E) {
                        var q = v * (x.x * p.y - x.y * p.x) > 0,
                          T = -Math.sqrt(C * C - 1);
                        if (
                          (q ? ((f = 0), (m = T)) : ((m = 0), (f = T)),
                          V || this.addCurrentVertex(h, v, L, x, m, f, !1),
                          "fakeround" === E)
                        ) {
                          for (
                            var A, R = Math.floor(8 * (0.5 - (k - 0.5))), F = 0;
                            R > F;
                            F++
                          )
                            (A = p
                              .mult((F + 1) / (R + 1))
                              ._add(x)
                              ._unit()),
                              this.addPieSliceVertex(h, v, L, A, q);
                          this.addPieSliceVertex(h, v, L, b, q);
                          for (var M = R - 1; M >= 0; M--)
                            (A = x
                              .mult((M + 1) / (R + 1))
                              ._add(p)
                              ._unit()),
                              this.addPieSliceVertex(h, v, L, A, q);
                        }
                        o && this.addCurrentVertex(h, v, L, p, -m, -f, !1);
                      } else
                        "butt" === E
                          ? (V || this.addCurrentVertex(h, v, L, x, 0, 0, !1),
                            o && this.addCurrentVertex(h, v, L, p, 0, 0, !1))
                          : "square" === E
                          ? (V ||
                              (this.addCurrentVertex(h, v, L, x, 1, 1, !1),
                              (this.e1 = this.e2 = -1),
                              (v = 1)),
                            o && this.addCurrentVertex(h, v, L, p, -1, -1, !1))
                          : "round" === E &&
                            (V ||
                              (this.addCurrentVertex(h, v, L, x, 0, 0, !1),
                              this.addCurrentVertex(h, v, L, x, 1, 1, !0),
                              (this.e1 = this.e2 = -1),
                              (v = 1)),
                            o &&
                              (this.addCurrentVertex(h, v, L, p, -1, -1, !0),
                              this.addCurrentVertex(h, v, L, p, 0, 0, !1)));
                      V = !1;
                    }
                }
              }
            }),
            (LineBucket.prototype.addCurrentVertex = function(
              e,
              t,
              i,
              r,
              n,
              s,
              u
            ) {
              var a,
                d = u ? 1 : 0,
                h = this.elementGroups.line.current;
              (h.vertexLength += 2),
                (a = r.mult(t)),
                n && a._sub(r.perp()._mult(n)),
                (this.e3 =
                  this.addLineVertex(e, a, d, 0, n, i) - h.vertexStartIndex),
                this.e1 >= 0 &&
                  this.e2 >= 0 &&
                  (this.addLineElement(this.e1, this.e2, this.e3),
                  h.elementLength++),
                (this.e1 = this.e2),
                (this.e2 = this.e3),
                (a = r.mult(-t)),
                s && a._sub(r.perp()._mult(s)),
                (this.e3 =
                  this.addLineVertex(e, a, d, 1, -s, i) - h.vertexStartIndex),
                this.e1 >= 0 &&
                  this.e2 >= 0 &&
                  (this.addLineElement(this.e1, this.e2, this.e3),
                  h.elementLength++),
                (this.e1 = this.e2),
                (this.e2 = this.e3);
            }),
            (LineBucket.prototype.addPieSliceVertex = function(e, t, i, r, n) {
              var s = n ? 1 : 0;
              r = r.mult(t * (n ? -1 : 1));
              var u = this.elementGroups.line.current;
              (this.e3 =
                this.addLineVertex(e, r, 0, s, 0, i) - u.vertexStartIndex),
                u.vertexLength++,
                this.e1 >= 0 &&
                  this.e2 >= 0 &&
                  (this.addLineElement(this.e1, this.e2, this.e3),
                  u.elementLength++),
                n ? (this.e2 = this.e3) : (this.e1 = this.e3);
            });
        },
        { "../util/util": 98, "./bucket": 1 }
      ],
      8: [
        function(require, module, exports) {
          "use strict";
          function SymbolBucket(e) {
            Bucket.apply(this, arguments),
              (this.collisionDebug = e.collisionDebug),
              (this.overscaling = e.overscaling);
            var t = {
              lastIntegerZoom: 1 / 0,
              lastIntegerZoomTime: 0,
              lastZoom: 0
            };
            (this.adjustedTextMaxSize = this.layer.getLayoutValue(
              "text-size",
              18,
              t
            )),
              (this.adjustedTextSize = this.layer.getLayoutValue(
                "text-size",
                this.zoom + 1,
                t
              )),
              (this.adjustedIconMaxSize = this.layer.getLayoutValue(
                "icon-size",
                18,
                t
              )),
              (this.adjustedIconSize = this.layer.getLayoutValue(
                "icon-size",
                this.zoom + 1,
                t
              ));
          }
          function SymbolInstance(e, t, o, i, a, s, n, l, r, h, u, c) {
            (this.x = e.x),
              (this.y = e.y),
              (this.hasText = !!o),
              (this.hasIcon = !!i),
              this.hasText &&
                ((this.glyphQuads = s ? getGlyphQuads(e, o, n, t, a, r) : []),
                (this.textCollisionFeature = new CollisionFeature(
                  t,
                  e,
                  o,
                  n,
                  l,
                  r,
                  !1
                ))),
              this.hasIcon &&
                ((this.iconQuads = s ? getIconQuads(e, i, h, t, a, c) : []),
                (this.iconCollisionFeature = new CollisionFeature(
                  t,
                  e,
                  i,
                  h,
                  u,
                  c,
                  !0
                )));
          }
          var Point = require("point-geometry"),
            Bucket = require("./bucket"),
            ElementGroups = require("./element_groups"),
            Anchor = require("../symbol/anchor"),
            getAnchors = require("../symbol/get_anchors"),
            resolveTokens = require("../util/token"),
            Quads = require("../symbol/quads"),
            Shaping = require("../symbol/shaping"),
            resolveText = require("../symbol/resolve_text"),
            mergeLines = require("../symbol/mergelines"),
            shapeText = Shaping.shapeText,
            shapeIcon = Shaping.shapeIcon,
            getGlyphQuads = Quads.getGlyphQuads,
            getIconQuads = Quads.getIconQuads,
            clipLine = require("../symbol/clip_line"),
            util = require("../util/util"),
            CollisionFeature = require("../symbol/collision_feature");
          (module.exports = SymbolBucket),
            (SymbolBucket.prototype = util.inherit(Bucket, {}));
          var shaderAttributeArgs = [
              "x",
              "y",
              "ox",
              "oy",
              "tx",
              "ty",
              "minzoom",
              "maxzoom",
              "labelminzoom"
            ],
            shaderAttributes = [
              {
                name: "pos",
                components: 2,
                type: Bucket.AttributeType.SHORT,
                value: ["x", "y"]
              },
              {
                name: "offset",
                components: 2,
                type: Bucket.AttributeType.SHORT,
                value: ["Math.round(ox * 64)", "Math.round(oy * 64)"]
              },
              {
                name: "data1",
                components: 4,
                type: Bucket.AttributeType.UNSIGNED_BYTE,
                value: ["tx / 4", "ty / 4", "(labelminzoom || 0) * 10", "0"]
              },
              {
                name: "data2",
                components: 2,
                type: Bucket.AttributeType.UNSIGNED_BYTE,
                value: [
                  "(minzoom || 0) * 10",
                  "Math.min(maxzoom || 25, 25) * 10"
                ]
              }
            ];
          (SymbolBucket.prototype.shaders = {
            glyph: {
              vertexBuffer: !0,
              elementBuffer: !0,
              attributeArgs: shaderAttributeArgs,
              attributes: shaderAttributes
            },
            icon: {
              vertexBuffer: !0,
              elementBuffer: !0,
              attributeArgs: shaderAttributeArgs,
              attributes: shaderAttributes
            },
            collisionBox: {
              vertexBuffer: !0,
              attributeArgs: ["point", "extrude", "maxZoom", "placementZoom"],
              attributes: [
                {
                  name: "pos",
                  components: 2,
                  type: Bucket.AttributeType.SHORT,
                  value: ["point.x", "point.y"]
                },
                {
                  name: "extrude",
                  components: 2,
                  type: Bucket.AttributeType.SHORT,
                  value: ["Math.round(extrude.x)", "Math.round(extrude.y)"]
                },
                {
                  name: "data",
                  components: 2,
                  type: Bucket.AttributeType.UNSIGNED_BYTE,
                  value: ["maxZoom * 10", "placementZoom * 10"]
                }
              ]
            }
          }),
            (SymbolBucket.prototype.addFeatures = function(e, t, o) {
              var i = 512 * this.overscaling;
              (this.tilePixelRatio = this.tileExtent / i),
                (this.compareText = {}),
                (this.symbolInstances = []),
                (this.iconsNeedLinear = !1);
              var a = this.layer.layout,
                s = this.features,
                n = this.textFeatures,
                l = 0.5,
                r = 0.5;
              switch (a["text-anchor"]) {
                case "right":
                case "top-right":
                case "bottom-right":
                  l = 1;
                  break;
                case "left":
                case "top-left":
                case "bottom-left":
                  l = 0;
              }
              switch (a["text-anchor"]) {
                case "bottom":
                case "bottom-right":
                case "bottom-left":
                  r = 1;
                  break;
                case "top":
                case "top-right":
                case "top-left":
                  r = 0;
              }
              for (
                var h =
                    "right" === a["text-justify"]
                      ? 1
                      : "left" === a["text-justify"]
                      ? 0
                      : 0.5,
                  u = 24,
                  c = a["text-line-height"] * u,
                  m =
                    "line" !== a["symbol-placement"]
                      ? a["text-max-width"] * u
                      : 0,
                  x = a["text-letter-spacing"] * u,
                  p = [a["text-offset"][0] * u, a["text-offset"][1] * u],
                  y = a["text-font"].join(","),
                  d = [],
                  g = 0;
                g < s.length;
                g++
              )
                d.push(s[g].loadGeometry());
              if ("line" === a["symbol-placement"]) {
                var b = mergeLines(s, n, d);
                (d = b.geometries), (s = b.features), (n = b.textFeatures);
              }
              for (var f, v, S = 0; S < s.length; S++)
                if (d[S]) {
                  if (
                    ((f = n[S]
                      ? shapeText(n[S], t[y], m, c, l, r, h, x, p)
                      : null),
                    a["icon-image"])
                  ) {
                    var B = resolveTokens(s[S].properties, a["icon-image"]),
                      I = o[B];
                    (v = shapeIcon(I, a)),
                      I &&
                        (void 0 === this.sdfIcons
                          ? (this.sdfIcons = I.sdf)
                          : this.sdfIcons !== I.sdf &&
                            console.warn(
                              "Style sheet warning: Cannot mix SDF and non-SDF icons in one buffer"
                            ),
                        1 !== I.pixelRatio && (this.iconsNeedLinear = !0));
                  } else v = null;
                  (f || v) && this.addFeature(d[S], f, v);
                }
              this.placeFeatures(e, this.buffers, this.collisionDebug);
            }),
            (SymbolBucket.prototype.addFeature = function(e, t, o) {
              var i = this.layer.layout,
                a = 24,
                s = this.adjustedTextSize / a,
                n =
                  void 0 !== this.adjustedTextMaxSize
                    ? this.adjustedTextMaxSize
                    : this.adjustedTextSize,
                l = this.tilePixelRatio * s,
                r = (this.tilePixelRatio * n) / a,
                h = this.tilePixelRatio * this.adjustedIconSize,
                u = this.tilePixelRatio * i["symbol-spacing"],
                c = i["symbol-avoid-edges"],
                m = i["text-padding"] * this.tilePixelRatio,
                x = i["icon-padding"] * this.tilePixelRatio,
                p = (i["text-max-angle"] / 180) * Math.PI,
                y =
                  "map" === i["text-rotation-alignment"] &&
                  "line" === i["symbol-placement"],
                d =
                  "map" === i["icon-rotation-alignment"] &&
                  "line" === i["symbol-placement"],
                g =
                  i["text-allow-overlap"] ||
                  i["icon-allow-overlap"] ||
                  i["text-ignore-placement"] ||
                  i["icon-ignore-placement"],
                b = "line" === i["symbol-placement"],
                f = u / 2;
              b && (e = clipLine(e, 0, 0, this.tileExtent, this.tileExtent));
              for (var v = 0; v < e.length; v++) {
                var S,
                  B = e[v];
                S = b
                  ? getAnchors(
                      B,
                      u,
                      p,
                      t,
                      o,
                      a,
                      r,
                      this.overscaling,
                      this.tileExtent
                    )
                  : [new Anchor(B[0].x, B[0].y, 0)];
                for (var I = 0, T = S.length; T > I; I++) {
                  var M = S[I];
                  if (!(t && b && this.anchorIsTooClose(t.text, f, M))) {
                    var k = !(
                      M.x < 0 ||
                      M.x > this.tileExtent ||
                      M.y < 0 ||
                      M.y > this.tileExtent
                    );
                    if (!c || k) {
                      var z = k || g;
                      this.symbolInstances.push(
                        new SymbolInstance(M, B, t, o, i, z, l, m, y, h, x, d)
                      );
                    }
                  }
                }
              }
            }),
            (SymbolBucket.prototype.anchorIsTooClose = function(e, t, o) {
              var i = this.compareText;
              if (e in i) {
                for (var a = i[e], s = a.length - 1; s >= 0; s--)
                  if (o.dist(a[s]) < t) return !0;
              } else i[e] = [];
              return i[e].push(o), !1;
            }),
            (SymbolBucket.prototype.placeFeatures = function(e, t, o) {
              this.resetBuffers(t);
              var i = (this.elementGroups = {
                  glyph: new ElementGroups(t.glyphVertex, t.glyphElement),
                  icon: new ElementGroups(t.iconVertex, t.iconElement),
                  sdfIcons: this.sdfIcons,
                  iconsNeedLinear: this.iconsNeedLinear
                }),
                a = this.layer.layout,
                s = e.maxScale;
              (i.glyph.adjustedSize = this.adjustedTextSize),
                (i.icon.adjustedSize = this.adjustedIconSize);
              var n =
                  "map" === a["text-rotation-alignment"] &&
                  "line" === a["symbol-placement"],
                l =
                  "map" === a["icon-rotation-alignment"] &&
                  "line" === a["symbol-placement"],
                r =
                  a["text-allow-overlap"] ||
                  a["icon-allow-overlap"] ||
                  a["text-ignore-placement"] ||
                  a["icon-ignore-placement"];
              if (r) {
                var h = e.angle,
                  u = Math.sin(h),
                  c = Math.cos(h);
                this.symbolInstances.sort(function(e, t) {
                  var o = u * e.x + c * e.y,
                    i = u * t.x + c * t.y;
                  return o - i;
                });
              }
              for (var m = 0; m < this.symbolInstances.length; m++) {
                var x = this.symbolInstances[m],
                  p = x.hasText,
                  y = x.hasIcon,
                  d = a["text-optional"] || !p,
                  g = a["icon-optional"] || !y,
                  b = p
                    ? e.placeCollisionFeature(
                        x.textCollisionFeature,
                        a["text-allow-overlap"],
                        a["symbol-avoid-edges"]
                      )
                    : e.minScale,
                  f = y
                    ? e.placeCollisionFeature(
                        x.iconCollisionFeature,
                        a["icon-allow-overlap"],
                        a["symbol-avoid-edges"]
                      )
                    : e.minScale;
                d || g
                  ? !g && b
                    ? (b = Math.max(f, b))
                    : !d && f && (f = Math.max(f, b))
                  : (f = b = Math.max(f, b)),
                  p &&
                    (a["text-ignore-placement"] ||
                      e.insertCollisionFeature(x.textCollisionFeature, b),
                    s >= b &&
                      this.addSymbols(
                        "glyph",
                        x.glyphQuads,
                        b,
                        a["text-keep-upright"],
                        n,
                        e.angle
                      )),
                  y &&
                    (a["icon-ignore-placement"] ||
                      e.insertCollisionFeature(x.iconCollisionFeature, f),
                    s >= f &&
                      this.addSymbols(
                        "icon",
                        x.iconQuads,
                        f,
                        a["icon-keep-upright"],
                        l,
                        e.angle
                      ));
              }
              o && this.addToDebugBuffers(e);
            }),
            (SymbolBucket.prototype.addSymbols = function(e, t, o, i, a, s) {
              for (
                var n = this.makeRoomFor(e, 4 * t.length),
                  l = this[this.getAddMethodName(e, "element")].bind(this),
                  r = this[this.getAddMethodName(e, "vertex")].bind(this),
                  h = this.zoom,
                  u = Math.max(Math.log(o) / Math.LN2 + h, 0),
                  c = 0;
                c < t.length;
                c++
              ) {
                var m = t[c],
                  x = m.angle,
                  p = (x + s + Math.PI) % (2 * Math.PI);
                if (!(i && a && (p <= Math.PI / 2 || p > (3 * Math.PI) / 2))) {
                  var y = m.tl,
                    d = m.tr,
                    g = m.bl,
                    b = m.br,
                    f = m.tex,
                    v = m.anchorPoint,
                    S = Math.max(h + Math.log(m.minScale) / Math.LN2, u),
                    B = Math.min(h + Math.log(m.maxScale) / Math.LN2, 25);
                  if (!(S >= B)) {
                    S === u && (S = 0);
                    var I =
                      r(v.x, v.y, y.x, y.y, f.x, f.y, S, B, u) -
                      n.vertexStartIndex;
                    r(v.x, v.y, d.x, d.y, f.x + f.w, f.y, S, B, u),
                      r(v.x, v.y, g.x, g.y, f.x, f.y + f.h, S, B, u),
                      r(v.x, v.y, b.x, b.y, f.x + f.w, f.y + f.h, S, B, u),
                      (n.vertexLength += 4),
                      l(I, I + 1, I + 2),
                      l(I + 1, I + 2, I + 3),
                      (n.elementLength += 2);
                  }
                }
              }
            }),
            (SymbolBucket.prototype.updateIcons = function(e) {
              var t = this.layer.layout["icon-image"];
              if (t)
                for (var o = 0; o < this.features.length; o++) {
                  var i = resolveTokens(this.features[o].properties, t);
                  i && (e[i] = !0);
                }
            }),
            (SymbolBucket.prototype.updateFont = function(e) {
              var t = this.layer.layout["text-font"],
                o = (e[t] = e[t] || {});
              this.textFeatures = resolveText(
                this.features,
                this.layer.layout,
                o
              );
            }),
            (SymbolBucket.prototype.addToDebugBuffers = function(e) {
              this.elementGroups.collisionBox = new ElementGroups(
                this.buffers.collisionBoxVertex
              );
              for (
                var t = this.makeRoomFor("collisionBox", 8),
                  o = -e.angle,
                  i = e.yStretch,
                  a = 0;
                a < this.symbolInstances.length;
                a++
              )
                for (var s = 0; 2 > s; s++) {
                  var n = this.symbolInstances[a][
                    0 === s ? "textCollisionFeature" : "iconCollisionFeature"
                  ];
                  if (n)
                    for (var l = n.boxes, r = 0; r < l.length; r++) {
                      var h = l[r],
                        u = h.anchorPoint,
                        c = new Point(h.x1, h.y1 * i)._rotate(o),
                        m = new Point(h.x2, h.y1 * i)._rotate(o),
                        x = new Point(h.x1, h.y2 * i)._rotate(o),
                        p = new Point(h.x2, h.y2 * i)._rotate(o),
                        y = Math.max(
                          0,
                          Math.min(
                            25,
                            this.zoom + Math.log(h.maxScale) / Math.LN2
                          )
                        ),
                        d = Math.max(
                          0,
                          Math.min(
                            25,
                            this.zoom + Math.log(h.placementScale) / Math.LN2
                          )
                        );
                      this.addCollisionBoxVertex(u, c, y, d),
                        this.addCollisionBoxVertex(u, m, y, d),
                        this.addCollisionBoxVertex(u, m, y, d),
                        this.addCollisionBoxVertex(u, p, y, d),
                        this.addCollisionBoxVertex(u, p, y, d),
                        this.addCollisionBoxVertex(u, x, y, d),
                        this.addCollisionBoxVertex(u, x, y, d),
                        this.addCollisionBoxVertex(u, c, y, d),
                        (t.vertexLength += 8);
                    }
                }
            });
        },
        {
          "../symbol/anchor": 55,
          "../symbol/clip_line": 58,
          "../symbol/collision_feature": 60,
          "../symbol/get_anchors": 62,
          "../symbol/mergelines": 65,
          "../symbol/quads": 66,
          "../symbol/resolve_text": 67,
          "../symbol/shaping": 68,
          "../util/token": 97,
          "../util/util": 98,
          "./bucket": 1,
          "./element_groups": 4,
          "point-geometry": 133
        }
      ],
      9: [
        function(require, module, exports) {
          "use strict";
          function Coordinate(o, t, n) {
            (this.column = o), (this.row = t), (this.zoom = n);
          }
          (module.exports = Coordinate),
            (Coordinate.prototype = {
              clone: function() {
                return new Coordinate(this.column, this.row, this.zoom);
              },
              zoomTo: function(o) {
                return this.clone()._zoomTo(o);
              },
              sub: function(o) {
                return this.clone()._sub(o);
              },
              _zoomTo: function(o) {
                var t = Math.pow(2, o - this.zoom);
                return (
                  (this.column *= t), (this.row *= t), (this.zoom = o), this
                );
              },
              _sub: function(o) {
                return (
                  (o = o.zoomTo(this.zoom)),
                  (this.column -= o.column),
                  (this.row -= o.row),
                  this
                );
              }
            });
        },
        {}
      ],
      10: [
        function(require, module, exports) {
          "use strict";
          function LngLat(t, n) {
            if (isNaN(t) || isNaN(n))
              throw new Error("Invalid LngLat object: (" + t + ", " + n + ")");
            if (
              ((this.lng = +t),
              (this.lat = +n),
              this.lat > 90 || this.lat < -90)
            )
              throw new Error(
                "Invalid LngLat latitude value: must be between -90 and 90"
              );
          }
          module.exports = LngLat;
          var wrap = require("../util/util").wrap;
          (LngLat.prototype.wrap = function() {
            return new LngLat(wrap(this.lng, -180, 180), this.lat);
          }),
            (LngLat.prototype.toArray = function() {
              return [this.lng, this.lat];
            }),
            (LngLat.prototype.toString = function() {
              return "LngLat(" + this.lng + ", " + this.lat + ")";
            }),
            (LngLat.convert = function(t) {
              return t instanceof LngLat
                ? t
                : Array.isArray(t)
                ? new LngLat(t[0], t[1])
                : t;
            });
        },
        { "../util/util": 98 }
      ],
      11: [
        function(require, module, exports) {
          "use strict";
          function LngLatBounds(t, n) {
            t &&
              (n
                ? this.extend(t).extend(n)
                : 4 === t.length
                ? this.extend([t[0], t[1]]).extend([t[2], t[3]])
                : this.extend(t[0]).extend(t[1]));
          }
          module.exports = LngLatBounds;
          var LngLat = require("./lng_lat");
          (LngLatBounds.prototype = {
            extend: function(t) {
              var n,
                e,
                s = this._sw,
                i = this._ne;
              if (t instanceof LngLat) (n = t), (e = t);
              else {
                if (!(t instanceof LngLatBounds))
                  return t
                    ? this.extend(LngLat.convert(t) || LngLatBounds.convert(t))
                    : this;
                if (((n = t._sw), (e = t._ne), !n || !e)) return this;
              }
              return (
                s || i
                  ? ((s.lng = Math.min(n.lng, s.lng)),
                    (s.lat = Math.min(n.lat, s.lat)),
                    (i.lng = Math.max(e.lng, i.lng)),
                    (i.lat = Math.max(e.lat, i.lat)))
                  : ((this._sw = new LngLat(n.lng, n.lat)),
                    (this._ne = new LngLat(e.lng, e.lat))),
                this
              );
            },
            getCenter: function() {
              return new LngLat(
                (this._sw.lng + this._ne.lng) / 2,
                (this._sw.lat + this._ne.lat) / 2
              );
            },
            getSouthWest: function() {
              return this._sw;
            },
            getNorthEast: function() {
              return this._ne;
            },
            getNorthWest: function() {
              return new LngLat(this.getWest(), this.getNorth());
            },
            getSouthEast: function() {
              return new LngLat(this.getEast(), this.getSouth());
            },
            getWest: function() {
              return this._sw.lng;
            },
            getSouth: function() {
              return this._sw.lat;
            },
            getEast: function() {
              return this._ne.lng;
            },
            getNorth: function() {
              return this._ne.lat;
            },
            toArray: function() {
              return [this._sw.toArray(), this._ne.toArray()];
            },
            toString: function() {
              return (
                "LngLatBounds(" +
                this._sw.toString() +
                ", " +
                this._ne.toString() +
                ")"
              );
            }
          }),
            (LngLatBounds.convert = function(t) {
              return !t || t instanceof LngLatBounds ? t : new LngLatBounds(t);
            });
        },
        { "./lng_lat": 10 }
      ],
      12: [
        function(require, module, exports) {
          "use strict";
          function Transform(t, i) {
            (this.tileSize = 512),
              (this._minZoom = t || 0),
              (this._maxZoom = i || 22),
              (this.latRange = [-85.05113, 85.05113]),
              (this.width = 0),
              (this.height = 0),
              (this._center = new LngLat(0, 0)),
              (this.zoom = 0),
              (this.angle = 0),
              (this._altitude = 1.5),
              (this._pitch = 0),
              (this._unmodified = !0);
          }
          var LngLat = require("./lng_lat"),
            Point = require("point-geometry"),
            Coordinate = require("./coordinate"),
            wrap = require("../util/util").wrap,
            interp = require("../util/interpolate"),
            glmatrix = require("gl-matrix"),
            vec4 = glmatrix.vec4,
            mat4 = glmatrix.mat4,
            mat2 = glmatrix.mat2;
          (module.exports = Transform),
            (Transform.prototype = {
              get minZoom() {
                return this._minZoom;
              },
              set minZoom(t) {
                this._minZoom !== t &&
                  ((this._minZoom = t), (this.zoom = Math.max(this.zoom, t)));
              },
              get maxZoom() {
                return this._maxZoom;
              },
              set maxZoom(t) {
                this._maxZoom !== t &&
                  ((this._maxZoom = t), (this.zoom = Math.min(this.zoom, t)));
              },
              get worldSize() {
                return this.tileSize * this.scale;
              },
              get centerPoint() {
                return this.size._div(2);
              },
              get size() {
                return new Point(this.width, this.height);
              },
              get bearing() {
                return (-this.angle / Math.PI) * 180;
              },
              set bearing(t) {
                var i = (-wrap(t, -180, 180) * Math.PI) / 180;
                this.angle !== i &&
                  ((this._unmodified = !1),
                  (this.angle = i),
                  this._calcProjMatrix(),
                  (this.rotationMatrix = mat2.create()),
                  mat2.rotate(
                    this.rotationMatrix,
                    this.rotationMatrix,
                    this.angle
                  ));
              },
              get pitch() {
                return (this._pitch / Math.PI) * 180;
              },
              set pitch(t) {
                var i = (Math.min(60, t) / 180) * Math.PI;
                this._pitch !== i &&
                  ((this._unmodified = !1),
                  (this._pitch = i),
                  this._calcProjMatrix());
              },
              get altitude() {
                return this._altitude;
              },
              set altitude(t) {
                var i = Math.max(0.75, t);
                this._altitude !== i &&
                  ((this._unmodified = !1),
                  (this._altitude = i),
                  this._calcProjMatrix());
              },
              get zoom() {
                return this._zoom;
              },
              set zoom(t) {
                var i = Math.min(Math.max(t, this.minZoom), this.maxZoom);
                this._zoom !== i &&
                  ((this._unmodified = !1),
                  (this._zoom = i),
                  (this.scale = this.zoomScale(i)),
                  (this.tileZoom = Math.floor(i)),
                  (this.zoomFraction = i - this.tileZoom),
                  this._calcProjMatrix(),
                  this._constrain());
              },
              get center() {
                return this._center;
              },
              set center(t) {
                (t.lat !== this._center.lat || t.lng !== this._center.lng) &&
                  ((this._unmodified = !1),
                  (this._center = t),
                  this._calcProjMatrix(),
                  this._constrain());
              },
              resize: function(t, i) {
                (this.width = t),
                  (this.height = i),
                  (this.exMatrix = mat4.create()),
                  mat4.ortho(this.exMatrix, 0, t, i, 0, 0, -1),
                  this._calcProjMatrix(),
                  this._constrain();
              },
              get unmodified() {
                return this._unmodified;
              },
              zoomScale: function(t) {
                return Math.pow(2, t);
              },
              scaleZoom: function(t) {
                return Math.log(t) / Math.LN2;
              },
              project: function(t, i) {
                return new Point(this.lngX(t.lng, i), this.latY(t.lat, i));
              },
              unproject: function(t, i) {
                return new LngLat(this.xLng(t.x, i), this.yLat(t.y, i));
              },
              get x() {
                return this.lngX(this.center.lng);
              },
              get y() {
                return this.latY(this.center.lat);
              },
              get point() {
                return new Point(this.x, this.y);
              },
              lngX: function(t, i) {
                return ((180 + t) * (i || this.worldSize)) / 360;
              },
              latY: function(t, i) {
                var n =
                  (180 / Math.PI) *
                  Math.log(Math.tan(Math.PI / 4 + (t * Math.PI) / 360));
                return ((180 - n) * (i || this.worldSize)) / 360;
              },
              xLng: function(t, i) {
                return (360 * t) / (i || this.worldSize) - 180;
              },
              yLat: function(t, i) {
                var n = 180 - (360 * t) / (i || this.worldSize);
                return (
                  (360 / Math.PI) * Math.atan(Math.exp((n * Math.PI) / 180)) -
                  90
                );
              },
              panBy: function(t) {
                var i = this.centerPoint._add(t);
                this.center = this.pointLocation(i);
              },
              setLocationAtPoint: function(t, i) {
                var n = this.locationCoordinate(t),
                  o = this.pointCoordinate(i),
                  e = this.pointCoordinate(this.centerPoint),
                  a = o._sub(n);
                (this._unmodified = !1),
                  (this.center = this.coordinateLocation(e._sub(a)));
              },
              setZoomAround: function(t, i) {
                var n;
                i && (n = this.locationPoint(i)),
                  (this.zoom = t),
                  i && this.setLocationAtPoint(i, n);
              },
              setBearingAround: function(t, i) {
                var n;
                i && (n = this.locationPoint(i)),
                  (this.bearing = t),
                  i && this.setLocationAtPoint(i, n);
              },
              locationPoint: function(t) {
                return this.coordinatePoint(this.locationCoordinate(t));
              },
              pointLocation: function(t) {
                return this.coordinateLocation(this.pointCoordinate(t));
              },
              locationCoordinate: function(t) {
                var i = this.zoomScale(this.tileZoom) / this.worldSize,
                  n = LngLat.convert(t);
                return new Coordinate(
                  this.lngX(n.lng) * i,
                  this.latY(n.lat) * i,
                  this.tileZoom
                );
              },
              coordinateLocation: function(t) {
                var i = this.zoomScale(t.zoom);
                return new LngLat(this.xLng(t.column, i), this.yLat(t.row, i));
              },
              pointCoordinate: function(t, i) {
                void 0 === i && (i = 0);
                var n = this.coordinatePointMatrix(this.tileZoom);
                if ((mat4.invert(n, n), !n))
                  throw new Error("failed to invert matrix");
                var o = [t.x, t.y, 0, 1],
                  e = [t.x, t.y, 1, 1];
                vec4.transformMat4(o, o, n), vec4.transformMat4(e, e, n);
                var a = o[3],
                  r = e[3],
                  h = o[0] / a,
                  s = e[0] / r,
                  c = o[1] / a,
                  u = e[1] / r,
                  l = o[2] / a,
                  m = e[2] / r,
                  g = l === m ? 0 : (i - l) / (m - l);
                return new Coordinate(
                  interp(h, s, g),
                  interp(c, u, g),
                  this.tileZoom
                );
              },
              coordinatePoint: function(t) {
                var i = this.coordinatePointMatrix(t.zoom),
                  n = [t.column, t.row, 0, 1];
                return (
                  vec4.transformMat4(n, n, i),
                  new Point(n[0] / n[3], n[1] / n[3])
                );
              },
              coordinatePointMatrix: function(t) {
                var i = mat4.copy(new Float64Array(16), this.projMatrix),
                  n = this.worldSize / this.zoomScale(t);
                return (
                  mat4.scale(i, i, [n, n, 1]),
                  mat4.multiply(i, this.getPixelMatrix(), i),
                  i
                );
              },
              getPixelMatrix: function() {
                var t = mat4.create();
                return (
                  mat4.scale(t, t, [this.width / 2, -this.height / 2, 1]),
                  mat4.translate(t, t, [1, -1, 0]),
                  t
                );
              },
              _constrain: function() {
                if (
                  this.center &&
                  this.width &&
                  this.height &&
                  !this._constraining
                ) {
                  this._constraining = !0;
                  var t,
                    i,
                    n,
                    o,
                    e,
                    a,
                    r,
                    h,
                    s = this.size,
                    c = this._unmodified;
                  this.latRange &&
                    ((t = this.latY(this.latRange[1])),
                    (i = this.latY(this.latRange[0])),
                    (e = i - t < s.y ? s.y / (i - t) : 0)),
                    this.lngRange &&
                      ((n = this.lngX(this.lngRange[0])),
                      (o = this.lngX(this.lngRange[1])),
                      (a = o - n < s.x ? s.x / (o - n) : 0));
                  var u = Math.max(a || 0, e || 0);
                  if (u)
                    return (
                      (this.center = this.unproject(
                        new Point(
                          a ? (o + n) / 2 : this.x,
                          e ? (i + t) / 2 : this.y
                        )
                      )),
                      (this.zoom += this.scaleZoom(u)),
                      (this._unmodified = c),
                      void (this._constraining = !1)
                    );
                  if (this.latRange) {
                    var l = this.y,
                      m = s.y / 2;
                    t > l - m && (h = t + m), l + m > i && (h = i - m);
                  }
                  if (this.lngRange) {
                    var g = this.x,
                      d = s.x / 2;
                    n > g - d && (r = n + d), g + d > o && (r = o - d);
                  }
                  (void 0 !== r || void 0 !== h) &&
                    (this.center = this.unproject(
                      new Point(
                        void 0 !== r ? r : this.x,
                        void 0 !== h ? h : this.y
                      )
                    )),
                    (this._unmodified = c),
                    (this._constraining = !1);
                }
              },
              _calcProjMatrix: function() {
                var t = new Float64Array(16),
                  i = Math.atan(0.5 / this.altitude),
                  n =
                    (Math.sin(i) * this.altitude) /
                    Math.sin(Math.PI / 2 - this._pitch - i),
                  o = Math.cos(Math.PI / 2 - this._pitch) * n + this.altitude;
                mat4.perspective(
                  t,
                  2 * Math.atan(this.height / 2 / this.altitude),
                  this.width / this.height,
                  0.1,
                  o
                ),
                  mat4.translate(t, t, [0, 0, -this.altitude]),
                  mat4.scale(t, t, [1, -1, 1 / this.height]),
                  mat4.rotateX(t, t, this._pitch),
                  mat4.rotateZ(t, t, this.angle),
                  mat4.translate(t, t, [-this.x, -this.y, 0]),
                  (this.projMatrix = t);
              }
            });
        },
        {
          "../util/interpolate": 94,
          "../util/util": 98,
          "./coordinate": 9,
          "./lng_lat": 10,
          "gl-matrix": 113,
          "point-geometry": 133
        }
      ],
      13: [
        function(require, module, exports) {
          "use strict";
          var simplexFont = {
            " ": [16, []],
            "!": [10, [5, 21, 5, 7, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
            '"': [16, [4, 21, 4, 14, -1, -1, 12, 21, 12, 14]],
            "#": [
              21,
              [
                11,
                25,
                4,
                -7,
                -1,
                -1,
                17,
                25,
                10,
                -7,
                -1,
                -1,
                4,
                12,
                18,
                12,
                -1,
                -1,
                3,
                6,
                17,
                6
              ]
            ],
            $: [
              20,
              [
                8,
                25,
                8,
                -4,
                -1,
                -1,
                12,
                25,
                12,
                -4,
                -1,
                -1,
                17,
                18,
                15,
                20,
                12,
                21,
                8,
                21,
                5,
                20,
                3,
                18,
                3,
                16,
                4,
                14,
                5,
                13,
                7,
                12,
                13,
                10,
                15,
                9,
                16,
                8,
                17,
                6,
                17,
                3,
                15,
                1,
                12,
                0,
                8,
                0,
                5,
                1,
                3,
                3
              ]
            ],
            "%": [
              24,
              [
                21,
                21,
                3,
                0,
                -1,
                -1,
                8,
                21,
                10,
                19,
                10,
                17,
                9,
                15,
                7,
                14,
                5,
                14,
                3,
                16,
                3,
                18,
                4,
                20,
                6,
                21,
                8,
                21,
                10,
                20,
                13,
                19,
                16,
                19,
                19,
                20,
                21,
                21,
                -1,
                -1,
                17,
                7,
                15,
                6,
                14,
                4,
                14,
                2,
                16,
                0,
                18,
                0,
                20,
                1,
                21,
                3,
                21,
                5,
                19,
                7,
                17,
                7
              ]
            ],
            "&": [
              26,
              [
                23,
                12,
                23,
                13,
                22,
                14,
                21,
                14,
                20,
                13,
                19,
                11,
                17,
                6,
                15,
                3,
                13,
                1,
                11,
                0,
                7,
                0,
                5,
                1,
                4,
                2,
                3,
                4,
                3,
                6,
                4,
                8,
                5,
                9,
                12,
                13,
                13,
                14,
                14,
                16,
                14,
                18,
                13,
                20,
                11,
                21,
                9,
                20,
                8,
                18,
                8,
                16,
                9,
                13,
                11,
                10,
                16,
                3,
                18,
                1,
                20,
                0,
                22,
                0,
                23,
                1,
                23,
                2
              ]
            ],
            "'": [10, [5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15]],
            "(": [
              14,
              [
                11,
                25,
                9,
                23,
                7,
                20,
                5,
                16,
                4,
                11,
                4,
                7,
                5,
                2,
                7,
                -2,
                9,
                -5,
                11,
                -7
              ]
            ],
            ")": [
              14,
              [
                3,
                25,
                5,
                23,
                7,
                20,
                9,
                16,
                10,
                11,
                10,
                7,
                9,
                2,
                7,
                -2,
                5,
                -5,
                3,
                -7
              ]
            ],
            "*": [
              16,
              [8, 21, 8, 9, -1, -1, 3, 18, 13, 12, -1, -1, 13, 18, 3, 12]
            ],
            "+": [26, [13, 18, 13, 0, -1, -1, 4, 9, 22, 9]],
            ",": [10, [6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4]],
            "-": [26, [4, 9, 22, 9]],
            ".": [10, [5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
            "/": [22, [20, 25, 2, -7]],
            0: [
              20,
              [
                9,
                21,
                6,
                20,
                4,
                17,
                3,
                12,
                3,
                9,
                4,
                4,
                6,
                1,
                9,
                0,
                11,
                0,
                14,
                1,
                16,
                4,
                17,
                9,
                17,
                12,
                16,
                17,
                14,
                20,
                11,
                21,
                9,
                21
              ]
            ],
            1: [20, [6, 17, 8, 18, 11, 21, 11, 0]],
            2: [
              20,
              [
                4,
                16,
                4,
                17,
                5,
                19,
                6,
                20,
                8,
                21,
                12,
                21,
                14,
                20,
                15,
                19,
                16,
                17,
                16,
                15,
                15,
                13,
                13,
                10,
                3,
                0,
                17,
                0
              ]
            ],
            3: [
              20,
              [
                5,
                21,
                16,
                21,
                10,
                13,
                13,
                13,
                15,
                12,
                16,
                11,
                17,
                8,
                17,
                6,
                16,
                3,
                14,
                1,
                11,
                0,
                8,
                0,
                5,
                1,
                4,
                2,
                3,
                4
              ]
            ],
            4: [20, [13, 21, 3, 7, 18, 7, -1, -1, 13, 21, 13, 0]],
            5: [
              20,
              [
                15,
                21,
                5,
                21,
                4,
                12,
                5,
                13,
                8,
                14,
                11,
                14,
                14,
                13,
                16,
                11,
                17,
                8,
                17,
                6,
                16,
                3,
                14,
                1,
                11,
                0,
                8,
                0,
                5,
                1,
                4,
                2,
                3,
                4
              ]
            ],
            6: [
              20,
              [
                16,
                18,
                15,
                20,
                12,
                21,
                10,
                21,
                7,
                20,
                5,
                17,
                4,
                12,
                4,
                7,
                5,
                3,
                7,
                1,
                10,
                0,
                11,
                0,
                14,
                1,
                16,
                3,
                17,
                6,
                17,
                7,
                16,
                10,
                14,
                12,
                11,
                13,
                10,
                13,
                7,
                12,
                5,
                10,
                4,
                7
              ]
            ],
            7: [20, [17, 21, 7, 0, -1, -1, 3, 21, 17, 21]],
            8: [
              20,
              [
                8,
                21,
                5,
                20,
                4,
                18,
                4,
                16,
                5,
                14,
                7,
                13,
                11,
                12,
                14,
                11,
                16,
                9,
                17,
                7,
                17,
                4,
                16,
                2,
                15,
                1,
                12,
                0,
                8,
                0,
                5,
                1,
                4,
                2,
                3,
                4,
                3,
                7,
                4,
                9,
                6,
                11,
                9,
                12,
                13,
                13,
                15,
                14,
                16,
                16,
                16,
                18,
                15,
                20,
                12,
                21,
                8,
                21
              ]
            ],
            9: [
              20,
              [
                16,
                14,
                15,
                11,
                13,
                9,
                10,
                8,
                9,
                8,
                6,
                9,
                4,
                11,
                3,
                14,
                3,
                15,
                4,
                18,
                6,
                20,
                9,
                21,
                10,
                21,
                13,
                20,
                15,
                18,
                16,
                14,
                16,
                9,
                15,
                4,
                13,
                1,
                10,
                0,
                8,
                0,
                5,
                1,
                4,
                3
              ]
            ],
            ":": [
              10,
              [
                5,
                14,
                4,
                13,
                5,
                12,
                6,
                13,
                5,
                14,
                -1,
                -1,
                5,
                2,
                4,
                1,
                5,
                0,
                6,
                1,
                5,
                2
              ]
            ],
            ";": [
              10,
              [
                5,
                14,
                4,
                13,
                5,
                12,
                6,
                13,
                5,
                14,
                -1,
                -1,
                6,
                1,
                5,
                0,
                4,
                1,
                5,
                2,
                6,
                1,
                6,
                -1,
                5,
                -3,
                4,
                -4
              ]
            ],
            "<": [24, [20, 18, 4, 9, 20, 0]],
            "=": [26, [4, 12, 22, 12, -1, -1, 4, 6, 22, 6]],
            ">": [24, [4, 18, 20, 9, 4, 0]],
            "?": [
              18,
              [
                3,
                16,
                3,
                17,
                4,
                19,
                5,
                20,
                7,
                21,
                11,
                21,
                13,
                20,
                14,
                19,
                15,
                17,
                15,
                15,
                14,
                13,
                13,
                12,
                9,
                10,
                9,
                7,
                -1,
                -1,
                9,
                2,
                8,
                1,
                9,
                0,
                10,
                1,
                9,
                2
              ]
            ],
            "@": [
              27,
              [
                18,
                13,
                17,
                15,
                15,
                16,
                12,
                16,
                10,
                15,
                9,
                14,
                8,
                11,
                8,
                8,
                9,
                6,
                11,
                5,
                14,
                5,
                16,
                6,
                17,
                8,
                -1,
                -1,
                12,
                16,
                10,
                14,
                9,
                11,
                9,
                8,
                10,
                6,
                11,
                5,
                -1,
                -1,
                18,
                16,
                17,
                8,
                17,
                6,
                19,
                5,
                21,
                5,
                23,
                7,
                24,
                10,
                24,
                12,
                23,
                15,
                22,
                17,
                20,
                19,
                18,
                20,
                15,
                21,
                12,
                21,
                9,
                20,
                7,
                19,
                5,
                17,
                4,
                15,
                3,
                12,
                3,
                9,
                4,
                6,
                5,
                4,
                7,
                2,
                9,
                1,
                12,
                0,
                15,
                0,
                18,
                1,
                20,
                2,
                21,
                3,
                -1,
                -1,
                19,
                16,
                18,
                8,
                18,
                6,
                19,
                5
              ]
            ],
            A: [18, [9, 21, 1, 0, -1, -1, 9, 21, 17, 0, -1, -1, 4, 7, 14, 7]],
            B: [
              21,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                21,
                13,
                21,
                16,
                20,
                17,
                19,
                18,
                17,
                18,
                15,
                17,
                13,
                16,
                12,
                13,
                11,
                -1,
                -1,
                4,
                11,
                13,
                11,
                16,
                10,
                17,
                9,
                18,
                7,
                18,
                4,
                17,
                2,
                16,
                1,
                13,
                0,
                4,
                0
              ]
            ],
            C: [
              21,
              [
                18,
                16,
                17,
                18,
                15,
                20,
                13,
                21,
                9,
                21,
                7,
                20,
                5,
                18,
                4,
                16,
                3,
                13,
                3,
                8,
                4,
                5,
                5,
                3,
                7,
                1,
                9,
                0,
                13,
                0,
                15,
                1,
                17,
                3,
                18,
                5
              ]
            ],
            D: [
              21,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                21,
                11,
                21,
                14,
                20,
                16,
                18,
                17,
                16,
                18,
                13,
                18,
                8,
                17,
                5,
                16,
                3,
                14,
                1,
                11,
                0,
                4,
                0
              ]
            ],
            E: [
              19,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                21,
                17,
                21,
                -1,
                -1,
                4,
                11,
                12,
                11,
                -1,
                -1,
                4,
                0,
                17,
                0
              ]
            ],
            F: [
              18,
              [4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11]
            ],
            G: [
              21,
              [
                18,
                16,
                17,
                18,
                15,
                20,
                13,
                21,
                9,
                21,
                7,
                20,
                5,
                18,
                4,
                16,
                3,
                13,
                3,
                8,
                4,
                5,
                5,
                3,
                7,
                1,
                9,
                0,
                13,
                0,
                15,
                1,
                17,
                3,
                18,
                5,
                18,
                8,
                -1,
                -1,
                13,
                8,
                18,
                8
              ]
            ],
            H: [
              22,
              [4, 21, 4, 0, -1, -1, 18, 21, 18, 0, -1, -1, 4, 11, 18, 11]
            ],
            I: [8, [4, 21, 4, 0]],
            J: [
              16,
              [12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7]
            ],
            K: [21, [4, 21, 4, 0, -1, -1, 18, 21, 4, 7, -1, -1, 9, 12, 18, 0]],
            L: [17, [4, 21, 4, 0, -1, -1, 4, 0, 16, 0]],
            M: [
              24,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                21,
                12,
                0,
                -1,
                -1,
                20,
                21,
                12,
                0,
                -1,
                -1,
                20,
                21,
                20,
                0
              ]
            ],
            N: [22, [4, 21, 4, 0, -1, -1, 4, 21, 18, 0, -1, -1, 18, 21, 18, 0]],
            O: [
              22,
              [
                9,
                21,
                7,
                20,
                5,
                18,
                4,
                16,
                3,
                13,
                3,
                8,
                4,
                5,
                5,
                3,
                7,
                1,
                9,
                0,
                13,
                0,
                15,
                1,
                17,
                3,
                18,
                5,
                19,
                8,
                19,
                13,
                18,
                16,
                17,
                18,
                15,
                20,
                13,
                21,
                9,
                21
              ]
            ],
            P: [
              21,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                21,
                13,
                21,
                16,
                20,
                17,
                19,
                18,
                17,
                18,
                14,
                17,
                12,
                16,
                11,
                13,
                10,
                4,
                10
              ]
            ],
            Q: [
              22,
              [
                9,
                21,
                7,
                20,
                5,
                18,
                4,
                16,
                3,
                13,
                3,
                8,
                4,
                5,
                5,
                3,
                7,
                1,
                9,
                0,
                13,
                0,
                15,
                1,
                17,
                3,
                18,
                5,
                19,
                8,
                19,
                13,
                18,
                16,
                17,
                18,
                15,
                20,
                13,
                21,
                9,
                21,
                -1,
                -1,
                12,
                4,
                18,
                -2
              ]
            ],
            R: [
              21,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                21,
                13,
                21,
                16,
                20,
                17,
                19,
                18,
                17,
                18,
                15,
                17,
                13,
                16,
                12,
                13,
                11,
                4,
                11,
                -1,
                -1,
                11,
                11,
                18,
                0
              ]
            ],
            S: [
              20,
              [
                17,
                18,
                15,
                20,
                12,
                21,
                8,
                21,
                5,
                20,
                3,
                18,
                3,
                16,
                4,
                14,
                5,
                13,
                7,
                12,
                13,
                10,
                15,
                9,
                16,
                8,
                17,
                6,
                17,
                3,
                15,
                1,
                12,
                0,
                8,
                0,
                5,
                1,
                3,
                3
              ]
            ],
            T: [16, [8, 21, 8, 0, -1, -1, 1, 21, 15, 21]],
            U: [
              22,
              [
                4,
                21,
                4,
                6,
                5,
                3,
                7,
                1,
                10,
                0,
                12,
                0,
                15,
                1,
                17,
                3,
                18,
                6,
                18,
                21
              ]
            ],
            V: [18, [1, 21, 9, 0, -1, -1, 17, 21, 9, 0]],
            W: [
              24,
              [
                2,
                21,
                7,
                0,
                -1,
                -1,
                12,
                21,
                7,
                0,
                -1,
                -1,
                12,
                21,
                17,
                0,
                -1,
                -1,
                22,
                21,
                17,
                0
              ]
            ],
            X: [20, [3, 21, 17, 0, -1, -1, 17, 21, 3, 0]],
            Y: [18, [1, 21, 9, 11, 9, 0, -1, -1, 17, 21, 9, 11]],
            Z: [20, [17, 21, 3, 0, -1, -1, 3, 21, 17, 21, -1, -1, 3, 0, 17, 0]],
            "[": [
              14,
              [
                4,
                25,
                4,
                -7,
                -1,
                -1,
                5,
                25,
                5,
                -7,
                -1,
                -1,
                4,
                25,
                11,
                25,
                -1,
                -1,
                4,
                -7,
                11,
                -7
              ]
            ],
            "\\": [14, [0, 21, 14, -3]],
            "]": [
              14,
              [
                9,
                25,
                9,
                -7,
                -1,
                -1,
                10,
                25,
                10,
                -7,
                -1,
                -1,
                3,
                25,
                10,
                25,
                -1,
                -1,
                3,
                -7,
                10,
                -7
              ]
            ],
            "^": [
              16,
              [
                6,
                15,
                8,
                18,
                10,
                15,
                -1,
                -1,
                3,
                12,
                8,
                17,
                13,
                12,
                -1,
                -1,
                8,
                17,
                8,
                0
              ]
            ],
            _: [16, [0, -2, 16, -2]],
            "`": [10, [6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17]],
            a: [
              19,
              [
                15,
                14,
                15,
                0,
                -1,
                -1,
                15,
                11,
                13,
                13,
                11,
                14,
                8,
                14,
                6,
                13,
                4,
                11,
                3,
                8,
                3,
                6,
                4,
                3,
                6,
                1,
                8,
                0,
                11,
                0,
                13,
                1,
                15,
                3
              ]
            ],
            b: [
              19,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                11,
                6,
                13,
                8,
                14,
                11,
                14,
                13,
                13,
                15,
                11,
                16,
                8,
                16,
                6,
                15,
                3,
                13,
                1,
                11,
                0,
                8,
                0,
                6,
                1,
                4,
                3
              ]
            ],
            c: [
              18,
              [
                15,
                11,
                13,
                13,
                11,
                14,
                8,
                14,
                6,
                13,
                4,
                11,
                3,
                8,
                3,
                6,
                4,
                3,
                6,
                1,
                8,
                0,
                11,
                0,
                13,
                1,
                15,
                3
              ]
            ],
            d: [
              19,
              [
                15,
                21,
                15,
                0,
                -1,
                -1,
                15,
                11,
                13,
                13,
                11,
                14,
                8,
                14,
                6,
                13,
                4,
                11,
                3,
                8,
                3,
                6,
                4,
                3,
                6,
                1,
                8,
                0,
                11,
                0,
                13,
                1,
                15,
                3
              ]
            ],
            e: [
              18,
              [
                3,
                8,
                15,
                8,
                15,
                10,
                14,
                12,
                13,
                13,
                11,
                14,
                8,
                14,
                6,
                13,
                4,
                11,
                3,
                8,
                3,
                6,
                4,
                3,
                6,
                1,
                8,
                0,
                11,
                0,
                13,
                1,
                15,
                3
              ]
            ],
            f: [12, [10, 21, 8, 21, 6, 20, 5, 17, 5, 0, -1, -1, 2, 14, 9, 14]],
            g: [
              19,
              [
                15,
                14,
                15,
                -2,
                14,
                -5,
                13,
                -6,
                11,
                -7,
                8,
                -7,
                6,
                -6,
                -1,
                -1,
                15,
                11,
                13,
                13,
                11,
                14,
                8,
                14,
                6,
                13,
                4,
                11,
                3,
                8,
                3,
                6,
                4,
                3,
                6,
                1,
                8,
                0,
                11,
                0,
                13,
                1,
                15,
                3
              ]
            ],
            h: [
              19,
              [
                4,
                21,
                4,
                0,
                -1,
                -1,
                4,
                10,
                7,
                13,
                9,
                14,
                12,
                14,
                14,
                13,
                15,
                10,
                15,
                0
              ]
            ],
            i: [8, [3, 21, 4, 20, 5, 21, 4, 22, 3, 21, -1, -1, 4, 14, 4, 0]],
            j: [
              10,
              [
                5,
                21,
                6,
                20,
                7,
                21,
                6,
                22,
                5,
                21,
                -1,
                -1,
                6,
                14,
                6,
                -3,
                5,
                -6,
                3,
                -7,
                1,
                -7
              ]
            ],
            k: [17, [4, 21, 4, 0, -1, -1, 14, 14, 4, 4, -1, -1, 8, 8, 15, 0]],
            l: [8, [4, 21, 4, 0]],
            m: [
              30,
              [
                4,
                14,
                4,
                0,
                -1,
                -1,
                4,
                10,
                7,
                13,
                9,
                14,
                12,
                14,
                14,
                13,
                15,
                10,
                15,
                0,
                -1,
                -1,
                15,
                10,
                18,
                13,
                20,
                14,
                23,
                14,
                25,
                13,
                26,
                10,
                26,
                0
              ]
            ],
            n: [
              19,
              [
                4,
                14,
                4,
                0,
                -1,
                -1,
                4,
                10,
                7,
                13,
                9,
                14,
                12,
                14,
                14,
                13,
                15,
                10,
                15,
                0
              ]
            ],
            o: [
              19,
              [
                8,
                14,
                6,
                13,
                4,
                11,
                3,
                8,
                3,
                6,
                4,
                3,
                6,
                1,
                8,
                0,
                11,
                0,
                13,
                1,
                15,
                3,
                16,
                6,
                16,
                8,
                15,
                11,
                13,
                13,
                11,
                14,
                8,
                14
              ]
            ],
            p: [
              19,
              [
                4,
                14,
                4,
                -7,
                -1,
                -1,
                4,
                11,
                6,
                13,
                8,
                14,
                11,
                14,
                13,
                13,
                15,
                11,
                16,
                8,
                16,
                6,
                15,
                3,
                13,
                1,
                11,
                0,
                8,
                0,
                6,
                1,
                4,
                3
              ]
            ],
            q: [
              19,
              [
                15,
                14,
                15,
                -7,
                -1,
                -1,
                15,
                11,
                13,
                13,
                11,
                14,
                8,
                14,
                6,
                13,
                4,
                11,
                3,
                8,
                3,
                6,
                4,
                3,
                6,
                1,
                8,
                0,
                11,
                0,
                13,
                1,
                15,
                3
              ]
            ],
            r: [13, [4, 14, 4, 0, -1, -1, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14]],
            s: [
              17,
              [
                14,
                11,
                13,
                13,
                10,
                14,
                7,
                14,
                4,
                13,
                3,
                11,
                4,
                9,
                6,
                8,
                11,
                7,
                13,
                6,
                14,
                4,
                14,
                3,
                13,
                1,
                10,
                0,
                7,
                0,
                4,
                1,
                3,
                3
              ]
            ],
            t: [12, [5, 21, 5, 4, 6, 1, 8, 0, 10, 0, -1, -1, 2, 14, 9, 14]],
            u: [
              19,
              [
                4,
                14,
                4,
                4,
                5,
                1,
                7,
                0,
                10,
                0,
                12,
                1,
                15,
                4,
                -1,
                -1,
                15,
                14,
                15,
                0
              ]
            ],
            v: [16, [2, 14, 8, 0, -1, -1, 14, 14, 8, 0]],
            w: [
              22,
              [
                3,
                14,
                7,
                0,
                -1,
                -1,
                11,
                14,
                7,
                0,
                -1,
                -1,
                11,
                14,
                15,
                0,
                -1,
                -1,
                19,
                14,
                15,
                0
              ]
            ],
            x: [17, [3, 14, 14, 0, -1, -1, 14, 14, 3, 0]],
            y: [
              16,
              [2, 14, 8, 0, -1, -1, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7]
            ],
            z: [17, [14, 14, 3, 0, -1, -1, 3, 14, 14, 14, -1, -1, 3, 0, 14, 0]],
            "{": [
              14,
              [
                9,
                25,
                7,
                24,
                6,
                23,
                5,
                21,
                5,
                19,
                6,
                17,
                7,
                16,
                8,
                14,
                8,
                12,
                6,
                10,
                -1,
                -1,
                7,
                24,
                6,
                22,
                6,
                20,
                7,
                18,
                8,
                17,
                9,
                15,
                9,
                13,
                8,
                11,
                4,
                9,
                8,
                7,
                9,
                5,
                9,
                3,
                8,
                1,
                7,
                0,
                6,
                -2,
                6,
                -4,
                7,
                -6,
                -1,
                -1,
                6,
                8,
                8,
                6,
                8,
                4,
                7,
                2,
                6,
                1,
                5,
                -1,
                5,
                -3,
                6,
                -5,
                7,
                -6,
                9,
                -7
              ]
            ],
            "|": [8, [4, 25, 4, -7]],
            "}": [
              14,
              [
                5,
                25,
                7,
                24,
                8,
                23,
                9,
                21,
                9,
                19,
                8,
                17,
                7,
                16,
                6,
                14,
                6,
                12,
                8,
                10,
                -1,
                -1,
                7,
                24,
                8,
                22,
                8,
                20,
                7,
                18,
                6,
                17,
                5,
                15,
                5,
                13,
                6,
                11,
                10,
                9,
                6,
                7,
                5,
                5,
                5,
                3,
                6,
                1,
                7,
                0,
                8,
                -2,
                8,
                -4,
                7,
                -6,
                -1,
                -1,
                8,
                8,
                6,
                6,
                6,
                4,
                7,
                2,
                8,
                1,
                9,
                -1,
                9,
                -3,
                8,
                -5,
                7,
                -6,
                5,
                -7
              ]
            ],
            "~": [
              24,
              [
                3,
                6,
                3,
                8,
                4,
                11,
                6,
                12,
                8,
                12,
                10,
                11,
                14,
                8,
                16,
                7,
                18,
                7,
                20,
                8,
                21,
                10,
                -1,
                -1,
                3,
                8,
                4,
                10,
                6,
                11,
                8,
                11,
                10,
                10,
                14,
                7,
                16,
                6,
                18,
                6,
                20,
                7,
                21,
                10,
                21,
                12
              ]
            ]
          };
          module.exports = function(l, n, t, e) {
            e = e || 1;
            var r,
              o,
              u,
              s,
              i,
              x,
              f,
              p,
              h = [];
            for (r = 0, o = l.length; o > r; r++)
              if ((i = simplexFont[l[r]])) {
                for (p = null, u = 0, s = i[1].length; s > u; u += 2)
                  -1 === i[1][u] && -1 === i[1][u + 1]
                    ? (p = null)
                    : ((x = n + i[1][u] * e),
                      (f = t - i[1][u + 1] * e),
                      p && h.push(p.x, p.y, x, f),
                      (p = { x: x, y: f }));
                n += i[0] * e;
              }
            return h;
          };
        },
        {}
      ],
      14: [
        function(require, module, exports) {
          "use strict";
          var mapboxgl = (module.exports = {});
          (mapboxgl.Map = require("./ui/map")),
            (mapboxgl.Control = require("./ui/control/control")),
            (mapboxgl.Navigation = require("./ui/control/navigation")),
            (mapboxgl.Attribution = require("./ui/control/attribution")),
            (mapboxgl.Popup = require("./ui/popup")),
            (mapboxgl.GeoJSONSource = require("./source/geojson_source")),
            (mapboxgl.VideoSource = require("./source/video_source")),
            (mapboxgl.ImageSource = require("./source/image_source")),
            (mapboxgl.Style = require("./style/style")),
            (mapboxgl.LngLat = require("./geo/lng_lat")),
            (mapboxgl.LngLatBounds = require("./geo/lng_lat_bounds")),
            (mapboxgl.Point = require("point-geometry")),
            (mapboxgl.Evented = require("./util/evented")),
            (mapboxgl.util = require("./util/util")),
            (mapboxgl.supported = require("./util/browser").supported);
          var ajax = require("./util/ajax");
          (mapboxgl.util.getJSON = ajax.getJSON),
            (mapboxgl.util.getArrayBuffer = ajax.getArrayBuffer);
          var config = require("./util/config");
          (mapboxgl.config = config),
            Object.defineProperty(mapboxgl, "accessToken", {
              get: function() {
                return config.ACCESS_TOKEN;
              },
              set: function(e) {
                config.ACCESS_TOKEN = e;
              }
            });
        },
        {
          "./geo/lng_lat": 10,
          "./geo/lng_lat_bounds": 11,
          "./source/geojson_source": 28,
          "./source/image_source": 30,
          "./source/video_source": 37,
          "./style/style": 44,
          "./ui/control/attribution": 71,
          "./ui/control/control": 72,
          "./ui/control/navigation": 73,
          "./ui/map": 83,
          "./ui/popup": 84,
          "./util/ajax": 86,
          "./util/browser": 87,
          "./util/config": 91,
          "./util/evented": 92,
          "./util/util": 98,
          "point-geometry": 133
        }
      ],
      15: [
        function(require, module, exports) {
          "use strict";
          function drawBackground(t, e, r) {
            var i,
              a = t.gl,
              n = t.transform,
              u = util.premultiply(
                r.paint["background-color"],
                r.paint["background-opacity"]
              ),
              l = r.paint["background-pattern"],
              o = r.paint["background-opacity"],
              s = l ? t.spriteAtlas.getPosition(l.from, !0) : null,
              f = l ? t.spriteAtlas.getPosition(l.to, !0) : null;
            if ((t.setDepthSublayer(0), s && f)) {
              if (t.isOpaquePass) return;
              (i = t.patternShader),
                a.switchShader(i),
                a.uniform1i(i.u_image, 0),
                a.uniform2fv(i.u_pattern_tl_a, s.tl),
                a.uniform2fv(i.u_pattern_br_a, s.br),
                a.uniform2fv(i.u_pattern_tl_b, f.tl),
                a.uniform2fv(i.u_pattern_br_b, f.br),
                a.uniform1f(i.u_opacity, o),
                a.uniform1f(i.u_mix, l.t);
              var p = t.tileExtent / n.tileSize / Math.pow(2, 0);
              a.uniform2fv(i.u_patternscale_a, [
                1 / (s.size[0] * p * l.fromScale),
                1 / (s.size[1] * p * l.fromScale)
              ]),
                a.uniform2fv(i.u_patternscale_b, [
                  1 / (f.size[0] * p * l.toScale),
                  1 / (f.size[1] * p * l.toScale)
                ]),
                t.spriteAtlas.bind(a, !0);
            } else {
              if (t.isOpaquePass !== (1 === u[3])) return;
              (i = t.fillShader), a.switchShader(i), a.uniform4fv(i.u_color, u);
            }
            a.disable(a.STENCIL_TEST),
              a.bindBuffer(a.ARRAY_BUFFER, t.tileExtentBuffer),
              a.vertexAttribPointer(
                i.a_pos,
                t.tileExtentBuffer.itemSize,
                a.SHORT,
                !1,
                0,
                0
              );
            for (var c = pyramid.coveringTiles(n), _ = 0; _ < c.length; _++)
              a.setPosMatrix(t.calculatePosMatrix(c[_], t.tileExtent)),
                a.drawArrays(a.TRIANGLE_STRIP, 0, t.tileExtentBuffer.itemCount);
            a.enable(a.STENCIL_TEST),
              a.stencilMask(0),
              a.stencilFunc(a.EQUAL, 128, 128);
          }
          var TilePyramid = require("../source/tile_pyramid"),
            pyramid = new TilePyramid({ tileSize: 512 }),
            util = require("../util/util");
          module.exports = drawBackground;
        },
        { "../source/tile_pyramid": 35, "../util/util": 98 }
      ],
      16: [
        function(require, module, exports) {
          "use strict";
          function drawCircles(e, r, t, i) {
            if (!e.isOpaquePass) {
              var a = e.gl,
                l = e.circleShader;
              e.gl.switchShader(l),
                e.setDepthSublayer(0),
                e.depthMask(!1),
                a.disable(a.STENCIL_TEST);
              var s = 1 / browser.devicePixelRatio / t.paint["circle-radius"],
                c = util.premultiply(
                  t.paint["circle-color"],
                  t.paint["circle-opacity"]
                );
              a.uniform4fv(l.u_color, c),
                a.uniform1f(l.u_blur, Math.max(t.paint["circle-blur"], s)),
                a.uniform1f(l.u_size, t.paint["circle-radius"]);
              for (var n = 0; n < i.length; n++) {
                var u = i[n],
                  o = r.getTile(u);
                if (o.buffers) {
                  var f = o.getElementGroups(t, "circle");
                  if (f) {
                    var p = o.buffers.circleVertex,
                      m = o.buffers.circleElement;
                    a.setPosMatrix(
                      e.translatePosMatrix(
                        e.calculatePosMatrix(u, o.tileExtent, r.maxzoom),
                        o,
                        t.paint["circle-translate"],
                        t.paint["circle-translate-anchor"]
                      )
                    ),
                      a.setExMatrix(e.transform.exMatrix);
                    for (var x = 0; x < f.groups.length; x++) {
                      var d = f.groups[x],
                        b = d.vertexStartIndex * p.itemSize;
                      p.bind(a), p.setAttribPointers(a, l, b), m.bind(a);
                      var S = 3 * d.elementLength,
                        v = d.elementStartIndex * m.itemSize;
                      a.drawElements(a.TRIANGLES, S, a.UNSIGNED_SHORT, v);
                    }
                  }
                }
              }
              a.enable(a.STENCIL_TEST);
            }
          }
          var browser = require("../util/browser"),
            util = require("../util/util");
          module.exports = drawCircles;
        },
        { "../util/browser": 87, "../util/util": 98 }
      ],
      17: [
        function(require, module, exports) {
          "use strict";
          function drawCollisionDebug(o, e, r, i) {
            if (i.buffers) {
              var t = i.getElementGroups(e, "collisionBox");
              if (t) {
                var l = o.gl,
                  s = i.buffers.collisionBoxVertex,
                  a = o.collisionBoxShader,
                  n = o.calculatePosMatrix(r, i.tileExtent);
                l.enable(l.STENCIL_TEST),
                  o.enableTileClippingMask(r),
                  l.switchShader(a, n),
                  s.bind(l),
                  s.setAttribPointers(l, a, 0),
                  l.lineWidth(1),
                  l.uniform1f(
                    a.u_scale,
                    Math.pow(2, o.transform.zoom - i.coord.z)
                  ),
                  l.uniform1f(a.u_zoom, 10 * o.transform.zoom),
                  l.uniform1f(a.u_maxzoom, 10 * (i.coord.z + 1));
                var u = t.groups[0].vertexStartIndex,
                  f = t.groups[0].vertexLength;
                l.drawArrays(l.LINES, u, f), l.disable(l.STENCIL_TEST);
              }
            }
          }
          module.exports = drawCollisionDebug;
        },
        {}
      ],
      18: [
        function(require, module, exports) {
          "use strict";
          function drawDebug(e, r) {
            if (!e.isOpaquePass && e.options.debug)
              for (var t = 0; t < r.length; t++) drawDebugTile(e, r[t]);
          }
          function drawDebugTile(e, r) {
            var t = e.gl,
              i = e.debugShader;
            t.switchShader(i, e.calculatePosMatrix(r, e.tileExtent)),
              t.bindBuffer(t.ARRAY_BUFFER, e.debugBuffer),
              t.vertexAttribPointer(
                i.a_pos,
                e.debugBuffer.itemSize,
                t.SHORT,
                !1,
                0,
                0
              ),
              t.uniform4f(i.u_color, 1, 0, 0, 1),
              t.lineWidth(4),
              t.drawArrays(t.LINE_STRIP, 0, e.debugBuffer.itemCount);
            var u = textVertices(r.toString(), 50, 200, 5);
            t.bindBuffer(t.ARRAY_BUFFER, e.debugTextBuffer),
              t.bufferData(t.ARRAY_BUFFER, new Int16Array(u), t.STREAM_DRAW),
              t.vertexAttribPointer(
                i.a_pos,
                e.debugTextBuffer.itemSize,
                t.SHORT,
                !1,
                0,
                0
              ),
              t.lineWidth(8 * browser.devicePixelRatio),
              t.uniform4f(i.u_color, 1, 1, 1, 1),
              t.drawArrays(t.LINES, 0, u.length / e.debugTextBuffer.itemSize),
              t.lineWidth(2 * browser.devicePixelRatio),
              t.uniform4f(i.u_color, 0, 0, 0, 1),
              t.drawArrays(t.LINES, 0, u.length / e.debugTextBuffer.itemSize);
          }
          var textVertices = require("../lib/debugtext"),
            browser = require("../util/browser");
          module.exports = drawDebug;
        },
        { "../lib/debugtext": 13, "../util/browser": 87 }
      ],
      19: [
        function(require, module, exports) {
          "use strict";
          function draw(e, t, i, r) {
            var l = e.gl,
              a = util.premultiply(
                i.paint["fill-color"],
                i.paint["fill-opacity"]
              ),
              n = i.paint["fill-pattern"],
              o = util.premultiply(
                i.paint["fill-outline-color"],
                i.paint["fill-opacity"]
              );
            if (n ? !e.isOpaquePass : e.isOpaquePass === (1 === a[3]))
              for (var f = 0; f < r.length; f++) drawFill(e, t, i, r[f]);
            if (
              !e.isOpaquePass &&
              i.paint["fill-antialias"] &&
              (!i.paint["fill-pattern"] || o)
            ) {
              l.switchShader(e.outlineShader),
                l.lineWidth(2 * browser.devicePixelRatio * 10),
                o ? e.setDepthSublayer(2) : e.setDepthSublayer(0),
                l.uniform2f(
                  e.outlineShader.u_world,
                  l.drawingBufferWidth,
                  l.drawingBufferHeight
                ),
                l.uniform4fv(e.outlineShader.u_color, o ? o : a);
              for (var s = 0; s < r.length; s++) drawStroke(e, t, i, r[s]);
            }
          }
          function drawFill(e, t, i, r) {
            var l = t.getTile(r);
            if (l.buffers) {
              var a = l.getElementGroups(i, "fill");
              if (a) {
                var n = e.gl,
                  o = util.premultiply(
                    i.paint["fill-color"],
                    i.paint["fill-opacity"]
                  ),
                  f = i.paint["fill-pattern"],
                  s = i.paint["fill-opacity"],
                  u = e.calculatePosMatrix(r, l.tileExtent, t.maxzoom),
                  p = e.translatePosMatrix(
                    u,
                    l,
                    i.paint["fill-translate"],
                    i.paint["fill-translate-anchor"]
                  );
                e.setDepthSublayer(1),
                  n.stencilMask(7),
                  n.clear(n.STENCIL_BUFFER_BIT),
                  e.enableTileClippingMask(r),
                  n.stencilOpSeparate(n.FRONT, n.KEEP, n.KEEP, n.INCR_WRAP),
                  n.stencilOpSeparate(n.BACK, n.KEEP, n.KEEP, n.DECR_WRAP),
                  n.colorMask(!1, !1, !1, !1),
                  e.depthMask(!1),
                  n.switchShader(e.fillShader, p);
                var c = l.buffers.fillVertex;
                c.bind(n);
                var d = l.buffers.fillElement;
                d.bind(n);
                for (var S = 0; S < a.groups.length; S++) {
                  var m = a.groups[S],
                    E = m.vertexStartIndex * c.itemSize;
                  c.setAttribPointers(n, e.fillShader, E);
                  var v = 3 * m.elementLength,
                    h = m.elementStartIndex * d.itemSize;
                  n.drawElements(n.TRIANGLES, v, n.UNSIGNED_SHORT, h);
                }
                n.colorMask(!0, !0, !0, !0),
                  e.depthMask(!0),
                  n.stencilOp(n.KEEP, n.KEEP, n.KEEP),
                  n.stencilMask(0);
                var _;
                if (f) {
                  var b = e.spriteAtlas.getPosition(f.from, !0),
                    x = e.spriteAtlas.getPosition(f.to, !0);
                  if (!b || !x) return;
                  (_ = e.patternShader),
                    n.switchShader(_, u),
                    n.uniform1i(_.u_image, 0),
                    n.uniform2fv(_.u_pattern_tl_a, b.tl),
                    n.uniform2fv(_.u_pattern_br_a, b.br),
                    n.uniform2fv(_.u_pattern_tl_b, x.tl),
                    n.uniform2fv(_.u_pattern_br_b, x.br),
                    n.uniform1f(_.u_opacity, s),
                    n.uniform1f(_.u_mix, f.t);
                  var g = Math.pow(2, e.transform.tileZoom - l.coord.z),
                    w = l.tileExtent / l.tileSize,
                    P = [
                      (b.size[0] * f.fromScale) / g,
                      (b.size[1] * f.fromScale) / g
                    ],
                    z = [
                      (x.size[0] * f.toScale) / g,
                      (x.size[1] * f.toScale) / g
                    ];
                  n.uniform2fv(_.u_patternscale_a, [
                    1 / (P[0] * w),
                    1 / (P[1] * w)
                  ]),
                    n.uniform2fv(_.u_patternscale_b, [
                      1 / (z[0] * w),
                      1 / (z[1] * w)
                    ]);
                  var M =
                      ((l.tileSize % P[0]) *
                        (l.coord.x + r.w * Math.pow(2, l.coord.z))) /
                      P[0],
                    R = ((l.tileSize % P[1]) * l.coord.y) / P[1],
                    A =
                      ((l.tileSize % z[0]) *
                        (l.coord.x + r.w * Math.pow(2, l.coord.z))) /
                      z[0],
                    y = ((l.tileSize % z[1]) * l.coord.y) / z[1];
                  n.uniform2fv(_.u_offset_a, [M, R]),
                    n.uniform2fv(_.u_offset_b, [A, y]),
                    e.spriteAtlas.bind(n, !0);
                } else
                  (_ = e.fillShader),
                    n.switchShader(_, u),
                    n.uniform4fv(_.u_color, o);
                n.stencilFunc(n.NOTEQUAL, 0, 7),
                  n.bindBuffer(n.ARRAY_BUFFER, e.tileExtentBuffer),
                  n.vertexAttribPointer(
                    _.a_pos,
                    e.tileExtentBuffer.itemSize,
                    n.SHORT,
                    !1,
                    0,
                    0
                  ),
                  n.drawArrays(
                    n.TRIANGLE_STRIP,
                    0,
                    e.tileExtentBuffer.itemCount
                  ),
                  n.stencilMask(0);
              }
            }
          }
          function drawStroke(e, t, i, r) {
            var l = t.getTile(r);
            if (l.buffers && l.elementGroups[i.ref || i.id]) {
              var a = e.gl,
                n = l.elementGroups[i.ref || i.id].fill;
              a.setPosMatrix(
                e.translatePosMatrix(
                  e.calculatePosMatrix(r, l.tileExtent, t.maxzoom),
                  l,
                  i.paint["fill-translate"],
                  i.paint["fill-translate-anchor"]
                )
              );
              var o = l.buffers.fillVertex,
                f = l.buffers.fillSecondElement;
              o.bind(a), f.bind(a), e.enableTileClippingMask(r);
              for (var s = 0; s < n.groups.length; s++) {
                var u = n.groups[s],
                  p = u.vertexStartIndex * o.itemSize;
                o.setAttribPointers(a, e.outlineShader, p);
                var c = 2 * u.secondElementLength,
                  d = u.secondElementStartIndex * f.itemSize;
                a.drawElements(a.LINES, c, a.UNSIGNED_SHORT, d);
              }
            }
          }
          var browser = require("../util/browser"),
            util = require("../util/util");
          module.exports = draw;
        },
        { "../util/browser": 87, "../util/util": 98 }
      ],
      20: [
        function(require, module, exports) {
          "use strict";
          var browser = require("../util/browser"),
            mat2 = require("gl-matrix").mat2,
            util = require("../util/util");
          module.exports = function(t, i, e, r) {
            if (!t.isOpaquePass) {
              t.setDepthSublayer(0), t.depthMask(!1);
              var a = r.some(function(t) {
                return i.getTile(t).getElementGroups(e, "line");
              });
              if (a) {
                var n = t.gl;
                if (!(e.paint["line-width"] <= 0)) {
                  var l = 1 / browser.devicePixelRatio,
                    o = e.paint["line-blur"] + l,
                    f = e.paint["line-width"] / 2,
                    u = -1,
                    s = 0,
                    m = 0;
                  e.paint["line-gap-width"] > 0 &&
                    ((u = e.paint["line-gap-width"] / 2 + 0.5 * l),
                    (f = e.paint["line-width"]),
                    (s = u - l / 2));
                  var _ = s + f + l / 2 + m,
                    p = util.premultiply(
                      e.paint["line-color"],
                      e.paint["line-opacity"]
                    ),
                    h = t.transform,
                    d = mat2.create();
                  mat2.scale(d, d, [1, Math.cos(h._pitch)]),
                    mat2.rotate(d, d, t.transform.angle);
                  var v,
                    c,
                    x,
                    g,
                    b,
                    w = Math.sqrt(
                      ((h.height * h.height) / 4) *
                        (1 + h.altitude * h.altitude)
                    ),
                    S = (h.height / 2) * Math.tan(h._pitch),
                    M = (w + S) / w - 1,
                    z = e.paint["line-dasharray"],
                    y = e.paint["line-pattern"];
                  if (z)
                    (v = t.linesdfpatternShader),
                      n.switchShader(v),
                      n.uniform2fv(v.u_linewidth, [_, u]),
                      n.uniform1f(v.u_blur, o),
                      n.uniform4fv(v.u_color, p),
                      (c = t.lineAtlas.getDash(
                        z.from,
                        "round" === e.layout["line-cap"]
                      )),
                      (x = t.lineAtlas.getDash(
                        z.to,
                        "round" === e.layout["line-cap"]
                      )),
                      t.lineAtlas.bind(n),
                      n.uniform1f(v.u_tex_y_a, c.y),
                      n.uniform1f(v.u_tex_y_b, x.y),
                      n.uniform1i(v.u_image, 0),
                      n.uniform1f(v.u_mix, z.t),
                      n.uniform1f(v.u_extra, M),
                      n.uniform1f(v.u_offset, -e.paint["line-offset"]),
                      n.uniformMatrix2fv(v.u_antialiasingmatrix, !1, d);
                  else if (y) {
                    if (
                      ((g = t.spriteAtlas.getPosition(y.from, !0)),
                      (b = t.spriteAtlas.getPosition(y.to, !0)),
                      !g || !b)
                    )
                      return;
                    t.spriteAtlas.bind(n, !0),
                      (v = t.linepatternShader),
                      n.switchShader(v),
                      n.uniform2fv(v.u_linewidth, [_, u]),
                      n.uniform1f(v.u_blur, o),
                      n.uniform2fv(v.u_pattern_tl_a, g.tl),
                      n.uniform2fv(v.u_pattern_br_a, g.br),
                      n.uniform2fv(v.u_pattern_tl_b, b.tl),
                      n.uniform2fv(v.u_pattern_br_b, b.br),
                      n.uniform1f(v.u_fade, y.t),
                      n.uniform1f(v.u_opacity, e.paint["line-opacity"]),
                      n.uniform1f(v.u_extra, M),
                      n.uniform1f(v.u_offset, -e.paint["line-offset"]),
                      n.uniformMatrix2fv(v.u_antialiasingmatrix, !1, d);
                  } else
                    (v = t.lineShader),
                      n.switchShader(v),
                      n.uniform2fv(v.u_linewidth, [_, u]),
                      n.uniform1f(v.u_blur, o),
                      n.uniform1f(v.u_extra, M),
                      n.uniform1f(v.u_offset, -e.paint["line-offset"]),
                      n.uniformMatrix2fv(v.u_antialiasingmatrix, !1, d),
                      n.uniform4fv(v.u_color, p);
                  for (var A = 0; A < r.length; A++) {
                    var E = r[A],
                      P = i.getTile(E),
                      T = P.getElementGroups(e, "line");
                    if (T) {
                      t.enableTileClippingMask(E);
                      var R = t.translatePosMatrix(
                        t.calculatePosMatrix(E, P.tileExtent, i.maxzoom),
                        P,
                        e.paint["line-translate"],
                        e.paint["line-translate-anchor"]
                      );
                      n.setPosMatrix(R), n.setExMatrix(t.transform.exMatrix);
                      var q =
                        t.transform.scale /
                        (1 << E.z) /
                        (P.tileExtent / P.tileSize);
                      if (z) {
                        var D = P.tileSize / t.transform.tileSize,
                          G =
                            (Math.pow(
                              2,
                              Math.floor(
                                Math.log(t.transform.scale) / Math.LN2
                              ) - E.z
                            ) /
                              8) *
                            D,
                          I = [G / c.width / z.fromScale, -c.height / 2],
                          N =
                            t.lineAtlas.width /
                            (z.fromScale *
                              c.width *
                              256 *
                              browser.devicePixelRatio) /
                            2,
                          L = [G / x.width / z.toScale, -x.height / 2],
                          O =
                            t.lineAtlas.width /
                            (z.toScale *
                              x.width *
                              256 *
                              browser.devicePixelRatio) /
                            2;
                        n.uniform1f(v.u_ratio, q),
                          n.uniform2fv(v.u_patternscale_a, I),
                          n.uniform2fv(v.u_patternscale_b, L),
                          n.uniform1f(v.u_sdfgamma, Math.max(N, O));
                      } else if (y) {
                        var k =
                          P.tileExtent /
                          P.tileSize /
                          Math.pow(2, t.transform.tileZoom - E.z);
                        n.uniform1f(v.u_ratio, q),
                          n.uniform2fv(v.u_pattern_size_a, [
                            g.size[0] * k * y.fromScale,
                            b.size[1]
                          ]),
                          n.uniform2fv(v.u_pattern_size_b, [
                            b.size[0] * k * y.toScale,
                            b.size[1]
                          ]);
                      } else n.uniform1f(v.u_ratio, q);
                      var H = P.buffers.lineVertex;
                      H.bind(n);
                      var B = P.buffers.lineElement;
                      B.bind(n);
                      for (var C = 0; C < T.groups.length; C++) {
                        var U = T.groups[C],
                          V = U.vertexStartIndex * H.itemSize;
                        n.vertexAttribPointer(
                          v.a_pos,
                          2,
                          n.SHORT,
                          !1,
                          8,
                          V + 0
                        ),
                          n.vertexAttribPointer(
                            v.a_data,
                            4,
                            n.BYTE,
                            !1,
                            8,
                            V + 4
                          );
                        var Y = 3 * U.elementLength,
                          Z = U.elementStartIndex * B.itemSize;
                        n.drawElements(n.TRIANGLES, Y, n.UNSIGNED_SHORT, Z);
                      }
                    }
                  }
                }
              }
            }
          };
        },
        { "../util/browser": 87, "../util/util": 98, "gl-matrix": 113 }
      ],
      21: [
        function(require, module, exports) {
          "use strict";
          function drawRaster(t, r, e, a) {
            if (!t.isOpaquePass) {
              var i = t.gl;
              i.depthFunc(i.LESS);
              for (var n = a.length - 1; n >= 0; n--)
                drawRasterTile(t, r, e, a[n]);
              i.depthFunc(i.LEQUAL);
            }
          }
          function drawRasterTile(t, r, e, a) {
            t.setDepthSublayer(0);
            var i = t.gl;
            i.disable(i.STENCIL_TEST);
            var n = r.getTile(a),
              o = t.calculatePosMatrix(a, n.tileExtent, r.maxzoom),
              u = t.rasterShader;
            i.switchShader(u, o),
              i.uniform1f(u.u_brightness_low, e.paint["raster-brightness-min"]),
              i.uniform1f(
                u.u_brightness_high,
                e.paint["raster-brightness-max"]
              ),
              i.uniform1f(
                u.u_saturation_factor,
                saturationFactor(e.paint["raster-saturation"])
              ),
              i.uniform1f(
                u.u_contrast_factor,
                contrastFactor(e.paint["raster-contrast"])
              ),
              i.uniform3fv(
                u.u_spin_weights,
                spinWeights(e.paint["raster-hue-rotate"])
              );
            var s,
              c,
              f = n.source && n.source._pyramid.findLoadedParent(a, 0, {}),
              d = getOpacities(n, f, e, t.transform);
            i.activeTexture(i.TEXTURE0),
              i.bindTexture(i.TEXTURE_2D, n.texture),
              f
                ? (i.activeTexture(i.TEXTURE1),
                  i.bindTexture(i.TEXTURE_2D, f.texture),
                  (s = Math.pow(2, f.coord.z - n.coord.z)),
                  (c = [(n.coord.x * s) % 1, (n.coord.y * s) % 1]))
                : (d[1] = 0),
              i.uniform2fv(u.u_tl_parent, c || [0, 0]),
              i.uniform1f(u.u_scale_parent, s || 1),
              i.uniform1f(u.u_buffer_scale, 1),
              i.uniform1f(u.u_opacity0, d[0]),
              i.uniform1f(u.u_opacity1, d[1]),
              i.uniform1i(u.u_image0, 0),
              i.uniform1i(u.u_image1, 1),
              i.bindBuffer(
                i.ARRAY_BUFFER,
                n.boundsBuffer || t.tileExtentBuffer
              ),
              i.vertexAttribPointer(u.a_pos, 2, i.SHORT, !1, 8, 0),
              i.vertexAttribPointer(u.a_texture_pos, 2, i.SHORT, !1, 8, 4),
              i.drawArrays(i.TRIANGLE_STRIP, 0, 4),
              i.enable(i.STENCIL_TEST);
          }
          function spinWeights(t) {
            t *= Math.PI / 180;
            var r = Math.sin(t),
              e = Math.cos(t);
            return [
              (2 * e + 1) / 3,
              (-Math.sqrt(3) * r - e + 1) / 3,
              (Math.sqrt(3) * r - e + 1) / 3
            ];
          }
          function contrastFactor(t) {
            return t > 0 ? 1 / (1 - t) : 1 + t;
          }
          function saturationFactor(t) {
            return t > 0 ? 1 - 1 / (1.001 - t) : -t;
          }
          function getOpacities(t, r, e, a) {
            var i = [1, 0],
              n = e.paint["raster-fade-duration"];
            if (t.source && n > 0) {
              var o = new Date().getTime(),
                u = (o - t.timeAdded) / n,
                s = r ? (o - r.timeAdded) / n : -1,
                c = t.source._pyramid.coveringZoomLevel(a),
                f = r ? Math.abs(r.coord.z - c) > Math.abs(t.coord.z - c) : !1;
              !r || f
                ? ((i[0] = util.clamp(u, 0, 1)), (i[1] = 1 - i[0]))
                : ((i[0] = util.clamp(1 - s, 0, 1)), (i[1] = 1 - i[0]));
            }
            var d = e.paint["raster-opacity"];
            return (i[0] *= d), (i[1] *= d), i;
          }
          var util = require("../util/util");
          module.exports = drawRaster;
        },
        { "../util/util": 98 }
      ],
      22: [
        function(require, module, exports) {
          "use strict";
          function drawSymbols(e, t, i, r) {
            if (!e.isOpaquePass) {
              var a = !(
                  i.layout["text-allow-overlap"] ||
                  i.layout["icon-allow-overlap"] ||
                  i.layout["text-ignore-placement"] ||
                  i.layout["icon-ignore-placement"]
                ),
                o = e.gl;
              a && o.disable(o.STENCIL_TEST),
                e.setDepthSublayer(0),
                e.depthMask(!1),
                o.disable(o.DEPTH_TEST);
              for (var l, n, s, u = 0; u < r.length; u++)
                (l = t.getTile(r[u])),
                  l.buffers &&
                    ((n = l.elementGroups[i.ref || i.id]),
                    n &&
                      n.icon.groups.length &&
                      ((s = e.calculatePosMatrix(
                        r[u],
                        l.tileExtent,
                        t.maxzoom
                      )),
                      e.enableTileClippingMask(r[u]),
                      drawSymbol(
                        e,
                        i,
                        s,
                        l,
                        n.icon,
                        "icon",
                        n.sdfIcons,
                        n.iconsNeedLinear
                      )));
              for (var f = 0; f < r.length; f++)
                (l = t.getTile(r[f])),
                  l.buffers &&
                    ((n = l.elementGroups[i.ref || i.id]),
                    n &&
                      n.glyph.groups.length &&
                      ((s = e.calculatePosMatrix(
                        r[f],
                        l.tileExtent,
                        t.maxzoom
                      )),
                      e.enableTileClippingMask(r[f]),
                      drawSymbol(e, i, s, l, n.glyph, "text", !0, !1)));
              for (var m = 0; m < r.length; m++)
                (l = t.getTile(r[m])),
                  e.enableTileClippingMask(r[m]),
                  drawCollisionDebug(e, i, r[m], l);
              a && o.enable(o.STENCIL_TEST), o.enable(o.DEPTH_TEST);
            }
          }
          function drawSymbol(e, t, i, r, a, o, l, n) {
            var s = e.gl;
            i = e.translatePosMatrix(
              i,
              r,
              t.paint[o + "-translate"],
              t.paint[o + "-translate-anchor"]
            );
            var u,
              f,
              m,
              d = e.transform,
              p = "map" === t.layout[o + "-rotation-alignment"],
              h = p;
            h
              ? ((u = mat4.create()),
                (f =
                  r.tileExtent /
                  r.tileSize /
                  Math.pow(2, e.transform.zoom - r.coord.z)),
                (m = 1 / Math.cos(d._pitch)))
              : ((u = mat4.clone(e.transform.exMatrix)),
                (f = e.transform.altitude),
                (m = 1)),
              mat4.scale(u, u, [f, f, 1]);
            var g = t.layout[o + "-size"],
              c = g / defaultSizes[o];
            mat4.scale(u, u, [c, c, 1]);
            var S,
              x,
              b,
              v,
              T = Math.sqrt(
                ((d.height * d.height) / 4) * (1 + d.altitude * d.altitude)
              ),
              y = (d.height / 2) * Math.tan(d._pitch),
              _ = (T + y) / T - 1,
              z = "text" === o;
            if (z || e.style.sprite.loaded()) {
              if (
                (s.activeTexture(s.TEXTURE0),
                (S = l ? e.sdfShader : e.iconShader),
                z)
              ) {
                var w = t.layout["text-font"],
                  E = w && w.join(","),
                  M = E && e.glyphSource.getGlyphAtlas(E);
                if (!M) return;
                M.updateTexture(s),
                  (x = r.buffers.glyphVertex),
                  (b = r.buffers.glyphElement),
                  (v = [M.width / 4, M.height / 4]);
              } else {
                var I = e.options.rotating || e.options.zooming,
                  N =
                    1 !== c ||
                    browser.devicePixelRatio !== e.spriteAtlas.pixelRatio ||
                    n,
                  P = p || e.transform.pitch;
                e.spriteAtlas.bind(s, l || I || N || P),
                  (x = r.buffers.iconVertex),
                  (b = r.buffers.iconElement),
                  (v = [e.spriteAtlas.width / 4, e.spriteAtlas.height / 4]);
              }
              s.switchShader(S, i, u),
                s.uniform1i(S.u_texture, 0),
                s.uniform2fv(S.u_texsize, v),
                s.uniform1i(S.u_skewed, h),
                s.uniform1f(S.u_extra, _);
              var A = Math.log(g / a.adjustedSize) / Math.LN2 || 0;
              s.uniform1f(S.u_zoom, 10 * (e.transform.zoom - A));
              var L = e.frameHistory.getFadeProperties(300);
              s.uniform1f(S.u_fadedist, 10 * L.fadedist),
                s.uniform1f(S.u_minfadezoom, Math.floor(10 * L.minfadezoom)),
                s.uniform1f(S.u_maxfadezoom, Math.floor(10 * L.maxfadezoom)),
                s.uniform1f(S.u_fadezoom, 10 * (e.transform.zoom + L.bump));
              var R, G, D, C;
              if ((b.bind(s), l)) {
                var q = 8,
                  H = 1.19,
                  k = 6,
                  O = (0.105 * defaultSizes[o]) / g / browser.devicePixelRatio;
                if (t.paint[o + "-halo-width"]) {
                  var U = util.premultiply(
                    t.paint[o + "-halo-color"],
                    t.paint[o + "-opacity"]
                  );
                  s.uniform1f(
                    S.u_gamma,
                    ((t.paint[o + "-halo-blur"] * H) / c / q + O) * m
                  ),
                    s.uniform4fv(S.u_color, U),
                    s.uniform1f(
                      S.u_buffer,
                      (k - t.paint[o + "-halo-width"] / c) / q
                    );
                  for (var j = 0; j < a.groups.length; j++)
                    (R = a.groups[j]),
                      (G = R.vertexStartIndex * x.itemSize),
                      x.bind(s),
                      x.setAttribPointers(s, S, G),
                      (D = 3 * R.elementLength),
                      (C = R.elementStartIndex * b.itemSize),
                      s.drawElements(s.TRIANGLES, D, s.UNSIGNED_SHORT, C);
                }
                var V = util.premultiply(
                  t.paint[o + "-color"],
                  t.paint[o + "-opacity"]
                );
                s.uniform1f(S.u_gamma, O * m),
                  s.uniform4fv(S.u_color, V),
                  s.uniform1f(S.u_buffer, 0.75);
                for (var F = 0; F < a.groups.length; F++)
                  (R = a.groups[F]),
                    (G = R.vertexStartIndex * x.itemSize),
                    x.bind(s),
                    x.setAttribPointers(s, S, G),
                    (D = 3 * R.elementLength),
                    (C = R.elementStartIndex * b.itemSize),
                    s.drawElements(s.TRIANGLES, D, s.UNSIGNED_SHORT, C);
              } else {
                s.uniform1f(S.u_opacity, t.paint["icon-opacity"]);
                for (var X = 0; X < a.groups.length; X++)
                  (R = a.groups[X]),
                    (G = R.vertexStartIndex * x.itemSize),
                    x.bind(s),
                    x.setAttribPointers(s, S, G),
                    (D = 3 * R.elementLength),
                    (C = R.elementStartIndex * b.itemSize),
                    s.drawElements(s.TRIANGLES, D, s.UNSIGNED_SHORT, C);
              }
            }
          }
          var mat4 = require("gl-matrix").mat4,
            browser = require("../util/browser"),
            drawCollisionDebug = require("./draw_collision_debug"),
            util = require("../util/util");
          module.exports = drawSymbols;
          var defaultSizes = { icon: 1, text: 24 };
        },
        {
          "../util/browser": 87,
          "../util/util": 98,
          "./draw_collision_debug": 17,
          "gl-matrix": 113
        }
      ],
      23: [
        function(require, module, exports) {
          "use strict";
          function FrameHistory() {
            this.frameHistory = [];
          }
          (module.exports = FrameHistory),
            (FrameHistory.prototype.getFadeProperties = function(t) {
              void 0 === t && (t = 300);
              for (
                var e = new Date().getTime();
                this.frameHistory.length > 3 &&
                this.frameHistory[1].time + t < e;

              )
                this.frameHistory.shift();
              this.frameHistory[1].time + t < e &&
                (this.frameHistory[0].z = this.frameHistory[1].z);
              var r = this.frameHistory.length;
              3 > r &&
                console.warn(
                  "there should never be less than three frames in the history"
                );
              var i = this.frameHistory[0].z,
                s = this.frameHistory[r - 1],
                o = s.z,
                a = Math.min(i, o),
                m = Math.max(i, o),
                h = s.z - this.frameHistory[1].z,
                f = s.time - this.frameHistory[1].time,
                y = h / (f / t);
              isNaN(y) && console.warn("fadedist should never be NaN");
              var n = ((e - s.time) / t) * y;
              return { fadedist: y, minfadezoom: a, maxfadezoom: m, bump: n };
            }),
            (FrameHistory.prototype.record = function(t) {
              var e = new Date().getTime();
              this.frameHistory.length ||
                this.frameHistory.push({ time: 0, z: t }, { time: 0, z: t }),
                (2 === this.frameHistory.length ||
                  this.frameHistory[this.frameHistory.length - 1].z !== t) &&
                  this.frameHistory.push({ time: e, z: t });
            });
        },
        {}
      ],
      24: [
        function(require, module, exports) {
          "use strict";
          var shaders = require("./shaders"),
            util = require("../util/util");
          exports.extend = function(r) {
            var t = r.lineWidth,
              e = r.getParameter(r.ALIASED_LINE_WIDTH_RANGE);
            return (
              (r.lineWidth = function(i) {
                t.call(r, util.clamp(i, e[0], e[1]));
              }),
              (r.getShader = function(r, t) {
                var e = t === this.FRAGMENT_SHADER ? "fragment" : "vertex";
                if (!shaders[r] || !shaders[r][e])
                  throw new Error("Could not find shader " + r);
                var i = this.createShader(t),
                  a = shaders[r][e];
                if (
                  ("undefined" == typeof orientation &&
                    (a = a.replace(/ highp /g, " ")),
                  this.shaderSource(i, a),
                  this.compileShader(i),
                  !this.getShaderParameter(i, this.COMPILE_STATUS))
                )
                  throw new Error(this.getShaderInfoLog(i));
                return i;
              }),
              (r.initializeShader = function(r, t, e) {
                var i = {
                  program: this.createProgram(),
                  fragment: this.getShader(r, this.FRAGMENT_SHADER),
                  vertex: this.getShader(r, this.VERTEX_SHADER),
                  attributes: []
                };
                if (
                  (this.attachShader(i.program, i.vertex),
                  this.attachShader(i.program, i.fragment),
                  this.linkProgram(i.program),
                  this.getProgramParameter(i.program, this.LINK_STATUS))
                ) {
                  for (var a = 0; a < t.length; a++)
                    (i[t[a]] = this.getAttribLocation(i.program, t[a])),
                      i.attributes.push(i[t[a]]);
                  for (var h = 0; h < e.length; h++)
                    i[e[h]] = this.getUniformLocation(i.program, e[h]);
                } else console.error(this.getProgramInfoLog(i.program));
                return i;
              }),
              (r.switchShader = function(t, e, i) {
                if (this.currentShader !== t) {
                  this.useProgram(t.program);
                  for (
                    var a = this.currentShader
                        ? this.currentShader.attributes
                        : [],
                      h = t.attributes,
                      s = 0;
                    s < a.length;
                    s++
                  )
                    h.indexOf(a[s]) < 0 && this.disableVertexAttribArray(a[s]);
                  for (var n = 0; n < h.length; n++)
                    a.indexOf(h[n]) < 0 && this.enableVertexAttribArray(h[n]);
                  this.currentShader = t;
                }
                void 0 !== e && r.setPosMatrix(e),
                  void 0 !== i && r.setExMatrix(i);
              }),
              (r.setPosMatrix = function(r) {
                var t = this.currentShader;
                t.posMatrix !== r &&
                  (this.uniformMatrix4fv(t.u_matrix, !1, r), (t.posMatrix = r));
              }),
              (r.setExMatrix = function(r) {
                var t = this.currentShader;
                r &&
                  t.exMatrix !== r &&
                  t.u_exmatrix &&
                  (this.uniformMatrix4fv(t.u_exmatrix, !1, r),
                  (t.exMatrix = r));
              }),
              (r.vertexAttrib2fv = function(t, e) {
                r.vertexAttrib2f(t, e[0], e[1]);
              }),
              (r.vertexAttrib3fv = function(t, e) {
                r.vertexAttrib3f(t, e[0], e[1], e[2]);
              }),
              (r.vertexAttrib4fv = function(t, e) {
                r.vertexAttrib4f(t, e[0], e[1], e[2], e[3]);
              }),
              r
            );
          };
        },
        { "../util/util": 98, "./shaders": 27 }
      ],
      25: [
        function(require, module, exports) {
          "use strict";
          function LineAtlas(t, i) {
            (this.width = t),
              (this.height = i),
              (this.nextRow = 0),
              (this.bytes = 4),
              (this.data = new Uint8Array(
                this.width * this.height * this.bytes
              )),
              (this.positions = {});
          }
          (module.exports = LineAtlas),
            (LineAtlas.prototype.setSprite = function(t) {
              this.sprite = t;
            }),
            (LineAtlas.prototype.getDash = function(t, i) {
              var e = t.join(",") + i;
              return (
                this.positions[e] || (this.positions[e] = this.addDash(t, i)),
                this.positions[e]
              );
            }),
            (LineAtlas.prototype.addDash = function(t, i) {
              var e = i ? 7 : 0,
                h = 2 * e + 1,
                s = 128;
              if (this.nextRow + h > this.height)
                return console.warn("LineAtlas out of space"), null;
              for (var a = 0, r = 0; r < t.length; r++) a += t[r];
              for (
                var n = this.width / a,
                  o = n / 2,
                  d = t.length % 2 === 1,
                  E = -e;
                e >= E;
                E++
              )
                for (
                  var T = this.nextRow + e + E,
                    l = this.width * T,
                    R = d ? -t[t.length - 1] : 0,
                    u = t[0],
                    g = 1,
                    p = 0;
                  p < this.width;
                  p++
                ) {
                  for (; p / n > u; )
                    (R = u),
                      (u += t[g]),
                      d && g === t.length - 1 && (u += t[0]),
                      g++;
                  var x,
                    f = Math.abs(p - R * n),
                    A = Math.abs(p - u * n),
                    w = Math.min(f, A),
                    _ = g % 2 === 1;
                  if (i) {
                    var y = e ? (E / e) * (o + 1) : 0;
                    if (_) {
                      var D = o - Math.abs(y);
                      x = Math.sqrt(w * w + D * D);
                    } else x = o - Math.sqrt(w * w + y * y);
                  } else x = (_ ? 1 : -1) * w;
                  this.data[3 + 4 * (l + p)] = Math.max(
                    0,
                    Math.min(255, x + s)
                  );
                }
              var c = {
                y: (this.nextRow + e + 0.5) / this.height,
                height: (2 * e) / this.height,
                width: a
              };
              return (this.nextRow += h), (this.dirty = !0), c;
            }),
            (LineAtlas.prototype.bind = function(t) {
              this.texture
                ? (t.bindTexture(t.TEXTURE_2D, this.texture),
                  this.dirty &&
                    ((this.dirty = !1),
                    t.texSubImage2D(
                      t.TEXTURE_2D,
                      0,
                      0,
                      0,
                      this.width,
                      this.height,
                      t.RGBA,
                      t.UNSIGNED_BYTE,
                      this.data
                    )))
                : ((this.texture = t.createTexture()),
                  t.bindTexture(t.TEXTURE_2D, this.texture),
                  t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.REPEAT),
                  t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.REPEAT),
                  t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR),
                  t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR),
                  t.texImage2D(
                    t.TEXTURE_2D,
                    0,
                    t.RGBA,
                    this.width,
                    this.height,
                    0,
                    t.RGBA,
                    t.UNSIGNED_BYTE,
                    this.data
                  ));
            }),
            (LineAtlas.prototype.debug = function() {
              var t = document.createElement("canvas");
              document.body.appendChild(t),
                (t.style.position = "absolute"),
                (t.style.top = 0),
                (t.style.left = 0),
                (t.style.background = "#ff0"),
                (t.width = this.width),
                (t.height = this.height);
              for (
                var i = t.getContext("2d"),
                  e = i.getImageData(0, 0, this.width, this.height),
                  h = 0;
                h < this.data.length;
                h++
              )
                if (this.sdf) {
                  var s = 4 * h;
                  (e.data[s] = e.data[s + 1] = e.data[s + 2] = 0),
                    (e.data[s + 3] = this.data[h]);
                } else e.data[h] = this.data[h];
              i.putImageData(e, 0, 0);
            });
        },
        {}
      ],
      26: [
        function(require, module, exports) {
          "use strict";
          function Painter(t, e) {
            (this.gl = glutil.extend(t)),
              (this.transform = e),
              (this.reusableTextures = {}),
              (this.preFbos = {}),
              (this.frameHistory = new FrameHistory()),
              this.setup(),
              (this.numSublayers = 3),
              (this.depthEpsilon = 1 / Math.pow(2, 16));
          }
          var glutil = require("./gl_util"),
            browser = require("../util/browser"),
            mat4 = require("gl-matrix").mat4,
            FrameHistory = require("./frame_history"),
            TileCoord = require("../source/tile_coord");
          (module.exports = Painter),
            (Painter.prototype.resize = function(t, e) {
              var i = this.gl;
              (this.width = t * browser.devicePixelRatio),
                (this.height = e * browser.devicePixelRatio),
                i.viewport(0, 0, this.width, this.height);
            }),
            (Painter.prototype.setup = function() {
              var t = this.gl;
              (t.verbose = !0),
                t.enable(t.BLEND),
                t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA),
                t.enable(t.STENCIL_TEST),
                t.enable(t.DEPTH_TEST),
                t.depthFunc(t.LEQUAL),
                (this._depthMask = !1),
                t.depthMask(!1),
                (this.debugShader = t.initializeShader(
                  "debug",
                  ["a_pos"],
                  ["u_matrix", "u_color"]
                )),
                (this.rasterShader = t.initializeShader(
                  "raster",
                  ["a_pos", "a_texture_pos"],
                  [
                    "u_matrix",
                    "u_brightness_low",
                    "u_brightness_high",
                    "u_saturation_factor",
                    "u_spin_weights",
                    "u_contrast_factor",
                    "u_opacity0",
                    "u_opacity1",
                    "u_image0",
                    "u_image1",
                    "u_tl_parent",
                    "u_scale_parent",
                    "u_buffer_scale"
                  ]
                )),
                (this.circleShader = t.initializeShader(
                  "circle",
                  ["a_pos"],
                  ["u_matrix", "u_exmatrix", "u_blur", "u_size", "u_color"]
                )),
                (this.lineShader = t.initializeShader(
                  "line",
                  ["a_pos", "a_data"],
                  [
                    "u_matrix",
                    "u_linewidth",
                    "u_color",
                    "u_ratio",
                    "u_blur",
                    "u_extra",
                    "u_antialiasingmatrix",
                    "u_offset",
                    "u_exmatrix"
                  ]
                )),
                (this.linepatternShader = t.initializeShader(
                  "linepattern",
                  ["a_pos", "a_data"],
                  [
                    "u_matrix",
                    "u_linewidth",
                    "u_ratio",
                    "u_pattern_size_a",
                    "u_pattern_size_b",
                    "u_pattern_tl_a",
                    "u_pattern_br_a",
                    "u_pattern_tl_b",
                    "u_pattern_br_b",
                    "u_blur",
                    "u_fade",
                    "u_opacity",
                    "u_extra",
                    "u_antialiasingmatrix",
                    "u_offset"
                  ]
                )),
                (this.linesdfpatternShader = t.initializeShader(
                  "linesdfpattern",
                  ["a_pos", "a_data"],
                  [
                    "u_matrix",
                    "u_linewidth",
                    "u_color",
                    "u_ratio",
                    "u_blur",
                    "u_patternscale_a",
                    "u_tex_y_a",
                    "u_patternscale_b",
                    "u_tex_y_b",
                    "u_image",
                    "u_sdfgamma",
                    "u_mix",
                    "u_extra",
                    "u_antialiasingmatrix",
                    "u_offset"
                  ]
                )),
                (this.dotShader = t.initializeShader(
                  "dot",
                  ["a_pos"],
                  ["u_matrix", "u_size", "u_color", "u_blur"]
                )),
                (this.sdfShader = t.initializeShader(
                  "sdf",
                  ["a_pos", "a_offset", "a_data1", "a_data2"],
                  [
                    "u_matrix",
                    "u_exmatrix",
                    "u_texture",
                    "u_texsize",
                    "u_color",
                    "u_gamma",
                    "u_buffer",
                    "u_zoom",
                    "u_fadedist",
                    "u_minfadezoom",
                    "u_maxfadezoom",
                    "u_fadezoom",
                    "u_skewed",
                    "u_extra"
                  ]
                )),
                (this.iconShader = t.initializeShader(
                  "icon",
                  ["a_pos", "a_offset", "a_data1", "a_data2"],
                  [
                    "u_matrix",
                    "u_exmatrix",
                    "u_texture",
                    "u_texsize",
                    "u_zoom",
                    "u_fadedist",
                    "u_minfadezoom",
                    "u_maxfadezoom",
                    "u_fadezoom",
                    "u_opacity",
                    "u_skewed",
                    "u_extra"
                  ]
                )),
                (this.outlineShader = t.initializeShader(
                  "outline",
                  ["a_pos"],
                  ["u_matrix", "u_color", "u_world"]
                )),
                (this.patternShader = t.initializeShader(
                  "pattern",
                  ["a_pos"],
                  [
                    "u_matrix",
                    "u_pattern_tl_a",
                    "u_pattern_br_a",
                    "u_pattern_tl_b",
                    "u_pattern_br_b",
                    "u_mix",
                    "u_patternscale_a",
                    "u_patternscale_b",
                    "u_opacity",
                    "u_image",
                    "u_offset_a",
                    "u_offset_b"
                  ]
                )),
                (this.fillShader = t.initializeShader(
                  "fill",
                  ["a_pos"],
                  ["u_matrix", "u_color"]
                )),
                (this.collisionBoxShader = t.initializeShader(
                  "collisionbox",
                  ["a_pos", "a_extrude", "a_data"],
                  ["u_matrix", "u_scale", "u_zoom", "u_maxzoom"]
                )),
                (this.identityMatrix = mat4.create()),
                (this.backgroundBuffer = t.createBuffer()),
                (this.backgroundBuffer.itemSize = 2),
                (this.backgroundBuffer.itemCount = 4),
                t.bindBuffer(t.ARRAY_BUFFER, this.backgroundBuffer),
                t.bufferData(
                  t.ARRAY_BUFFER,
                  new Int16Array([-1, -1, 1, -1, -1, 1, 1, 1]),
                  t.STATIC_DRAW
                ),
                this.setExtent(4096),
                (this.debugTextBuffer = t.createBuffer()),
                (this.debugTextBuffer.itemSize = 2);
            }),
            (Painter.prototype.setExtent = function(t) {
              if (t && t !== this.tileExtent) {
                this.tileExtent = t;
                var e = this.gl;
                (this.tileExtentBuffer = e.createBuffer()),
                  (this.tileExtentBuffer.itemSize = 4),
                  (this.tileExtentBuffer.itemCount = 4),
                  e.bindBuffer(e.ARRAY_BUFFER, this.tileExtentBuffer),
                  e.bufferData(
                    e.ARRAY_BUFFER,
                    new Int16Array([
                      0,
                      0,
                      0,
                      0,
                      this.tileExtent,
                      0,
                      32767,
                      0,
                      0,
                      this.tileExtent,
                      0,
                      32767,
                      this.tileExtent,
                      this.tileExtent,
                      32767,
                      32767
                    ]),
                    e.STATIC_DRAW
                  ),
                  (this.debugBuffer = e.createBuffer()),
                  (this.debugBuffer.itemSize = 2),
                  (this.debugBuffer.itemCount = 5),
                  e.bindBuffer(e.ARRAY_BUFFER, this.debugBuffer),
                  e.bufferData(
                    e.ARRAY_BUFFER,
                    new Int16Array([
                      0,
                      0,
                      this.tileExtent - 1,
                      0,
                      this.tileExtent - 1,
                      this.tileExtent - 1,
                      0,
                      this.tileExtent - 1,
                      0,
                      0
                    ]),
                    e.STATIC_DRAW
                  );
              }
            }),
            (Painter.prototype.clearColor = function() {
              var t = this.gl;
              t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT);
            }),
            (Painter.prototype.clearStencil = function() {
              var t = this.gl;
              t.clearStencil(0),
                t.stencilMask(255),
                t.clear(t.STENCIL_BUFFER_BIT);
            }),
            (Painter.prototype.clearDepth = function() {
              var t = this.gl;
              t.clearDepth(1), this.depthMask(!0), t.clear(t.DEPTH_BUFFER_BIT);
            }),
            (Painter.prototype._renderTileClippingMasks = function(t, e) {
              var i = this.gl;
              i.colorMask(!1, !1, !1, !1),
                this.depthMask(!1),
                i.disable(i.DEPTH_TEST),
                i.stencilMask(248),
                i.stencilOp(i.KEEP, i.KEEP, i.REPLACE);
              var r = 1;
              this._tileClippingMaskIDs = {};
              for (var a = 0; a < t.length; a++) {
                var s = t[a],
                  n = (this._tileClippingMaskIDs[s.id] = r++ << 3);
                i.stencilFunc(i.ALWAYS, n, 248),
                  i.switchShader(
                    this.fillShader,
                    this.calculatePosMatrix(s, this.tileExtent, e)
                  ),
                  i.bindBuffer(i.ARRAY_BUFFER, this.tileExtentBuffer),
                  i.vertexAttribPointer(
                    this.fillShader.a_pos,
                    this.tileExtentBuffer.itemSize,
                    i.SHORT,
                    !1,
                    8,
                    0
                  ),
                  i.drawArrays(
                    i.TRIANGLE_STRIP,
                    0,
                    this.tileExtentBuffer.itemCount
                  );
              }
              i.stencilMask(0),
                i.colorMask(!0, !0, !0, !0),
                this.depthMask(!0),
                i.enable(i.DEPTH_TEST);
            }),
            (Painter.prototype.enableTileClippingMask = function(t) {
              var e = this.gl;
              e.stencilFunc(e.EQUAL, this._tileClippingMaskIDs[t.id], 248);
            }),
            (Painter.prototype.prepareBuffers = function() {}),
            (Painter.prototype.bindDefaultFramebuffer = function() {
              var t = this.gl;
              t.bindFramebuffer(t.FRAMEBUFFER, null);
            });
          var draw = {
            symbol: require("./draw_symbol"),
            circle: require("./draw_circle"),
            line: require("./draw_line"),
            fill: require("./draw_fill"),
            raster: require("./draw_raster"),
            background: require("./draw_background"),
            debug: require("./draw_debug")
          };
          (Painter.prototype.render = function(t, e) {
            (this.style = t),
              (this.options = e),
              (this.lineAtlas = t.lineAtlas),
              (this.spriteAtlas = t.spriteAtlas),
              this.spriteAtlas.setSprite(t.sprite),
              (this.glyphSource = t.glyphSource),
              this.frameHistory.record(this.transform.zoom),
              this.prepareBuffers(),
              this.clearColor(),
              this.clearDepth(),
              (this.depthRange =
                (t._order.length + 2) * this.numSublayers * this.depthEpsilon),
              this.renderPass({ isOpaquePass: !0 }),
              this.renderPass({ isOpaquePass: !1 });
          }),
            (Painter.prototype.renderPass = function(t) {
              var e = this.style._groups,
                i = t.isOpaquePass;
              this.currentLayer = i ? this.style._order.length : -1;
              for (var r = 0; r < e.length; r++) {
                var a = e[i ? e.length - 1 - r : r],
                  s = this.style.sources[a.source],
                  n = [];
                s &&
                  ((n = s.getVisibleCoordinates()),
                  this.clearStencil(),
                  s.prepare && s.prepare(),
                  s.isTileClipped &&
                    this._renderTileClippingMasks(n, s.maxzoom)),
                  i
                    ? (this.gl.disable(this.gl.BLEND), (this.isOpaquePass = !0))
                    : (this.gl.enable(this.gl.BLEND),
                      (this.isOpaquePass = !1),
                      n.reverse());
                for (var u = 0; u < a.length; u++) {
                  var o = a[i ? a.length - 1 - u : u];
                  (this.currentLayer += i ? -1 : 1),
                    this.renderLayer(this, s, o, n);
                }
                draw.debug(this, n);
              }
            }),
            (Painter.prototype.depthMask = function(t) {
              t !== this._depthMask &&
                ((this._depthMask = t), this.gl.depthMask(t));
            }),
            (Painter.prototype.renderLayer = function(t, e, i, r) {
              i.isHidden(this.transform.zoom) ||
                (("background" === i.type || r.length) &&
                  draw[i.type](t, e, i, r));
            }),
            (Painter.prototype.drawStencilBuffer = function() {
              var t = this.gl;
              t.switchShader(this.fillShader, this.identityMatrix),
                t.stencilMask(0),
                t.stencilFunc(t.EQUAL, 128, 128),
                t.bindBuffer(t.ARRAY_BUFFER, this.backgroundBuffer),
                t.vertexAttribPointer(
                  this.fillShader.a_pos,
                  this.backgroundBuffer.itemSize,
                  t.SHORT,
                  !1,
                  0,
                  0
                ),
                t.uniform4fv(this.fillShader.u_color, [0, 0, 0, 0.5]),
                t.drawArrays(
                  t.TRIANGLE_STRIP,
                  0,
                  this.tileExtentBuffer.itemCount
                );
            }),
            (Painter.prototype.setDepthSublayer = function(t) {
              var e =
                  1 -
                  ((1 + this.currentLayer) * this.numSublayers + t) *
                    this.depthEpsilon,
                i = e - 1 + this.depthRange;
              this.gl.depthRange(i, e);
            }),
            (Painter.prototype.translatePosMatrix = function(t, e, i, r) {
              if (!i[0] && !i[1]) return t;
              if ("viewport" === r) {
                var a = Math.sin(-this.transform.angle),
                  s = Math.cos(-this.transform.angle);
                i = [i[0] * s - i[1] * a, i[0] * a + i[1] * s];
              }
              var n =
                  this.transform.scale /
                  (1 << e.coord.z) /
                  (e.tileExtent / e.tileSize),
                u = [i[0] / n, i[1] / n, 0],
                o = new Float32Array(16);
              return mat4.translate(o, t, u), o;
            }),
            (Painter.prototype.calculatePosMatrix = function(t, e, i) {
              t instanceof TileCoord && (t = t.toCoordinate());
              var r = this.transform;
              void 0 === i && (i = 1 / 0);
              var a = Math.min(t.zoom, i),
                s = t.column,
                n = t.row,
                u = r.worldSize / Math.pow(2, a),
                o = new Float64Array(16);
              return (
                mat4.identity(o),
                mat4.translate(o, o, [s * u, n * u, 0]),
                mat4.scale(o, o, [u / e, u / e, 1]),
                mat4.multiply(o, r.projMatrix, o),
                new Float32Array(o)
              );
            }),
            (Painter.prototype.saveTexture = function(t) {
              var e = this.reusableTextures[t.size];
              e ? e.push(t) : (this.reusableTextures[t.size] = [t]);
            }),
            (Painter.prototype.getTexture = function(t) {
              var e = this.reusableTextures[t];
              return e && e.length > 0 ? e.pop() : null;
            });
        },
        {
          "../source/tile_coord": 34,
          "../util/browser": 87,
          "./draw_background": 15,
          "./draw_circle": 16,
          "./draw_debug": 18,
          "./draw_fill": 19,
          "./draw_line": 20,
          "./draw_raster": 21,
          "./draw_symbol": 22,
          "./frame_history": 23,
          "./gl_util": 24,
          "gl-matrix": 113
        }
      ],
      27: [
        function(require, module, exports) {
          "use strict";
          var path = require("path");
          module.exports = {
            debug: {
              fragment:
                "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n",
              vertex:
                "precision mediump float;\n\nattribute vec2 a_pos;\n\nuniform highp mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, step(32767.0, a_pos.x), 1);\n}\n"
            },
            dot: {
              fragment:
                "precision mediump float;\n\nuniform vec4 u_color;\nuniform float u_blur;\n\nvoid main() {\n    float dist = length(gl_PointCoord - 0.5);\n    float t = smoothstep(0.5, 0.5 - u_blur, dist);\n\n    gl_FragColor = u_color * t;\n}\n",
              vertex:
                "precision mediump float;\n\nuniform highp mat4 u_matrix;\nuniform float u_size;\n\nattribute vec2 a_pos;\n\nvoid main(void) {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    gl_PointSize = u_size;\n}\n"
            },
            fill: {
              fragment:
                "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n",
              vertex:
                "precision mediump float;\n\nattribute vec2 a_pos;\nuniform highp mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n"
            },
            circle: {
              fragment:
                "precision mediump float;\n\nuniform vec4 u_color;\nuniform float u_blur;\nuniform float u_size;\n\nvarying vec2 v_extrude;\n\nvoid main() {\n    float t = smoothstep(1.0 - u_blur, 1.0, length(v_extrude));\n    gl_FragColor = u_color * (1.0 - t);\n}\n",
              vertex:
                "precision mediump float;\n\n// set by gl_util\nuniform float u_size;\n\nattribute vec2 a_pos;\n\nuniform highp mat4 u_matrix;\nuniform mat4 u_exmatrix;\n\nvarying vec2 v_extrude;\n\nvoid main(void) {\n    // unencode the extrusion vector that we snuck into the a_pos vector\n    v_extrude = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);\n\n    vec4 extrude = u_exmatrix * vec4(v_extrude * u_size, 0, 0);\n    // multiply a_pos by 0.5, since we had it * 2 in order to sneak\n    // in extrusion data\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5), 0, 1);\n\n    // gl_Position is divided by gl_Position.w after this shader runs.\n    // Multiply the extrude by it so that it isn't affected by it.\n    gl_Position += extrude * gl_Position.w;\n}\n"
            },
            line: {
              fragment:
                "precision mediump float;\n\nuniform vec2 u_linewidth;\nuniform vec4 u_color;\nuniform float u_blur;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * u_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (u_linewidth.t - blur), u_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    gl_FragColor = u_color * alpha;\n}\n",
              vertex:
                "precision mediump float;\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform highp mat4 u_matrix;\nuniform float u_ratio;\nuniform vec2 u_linewidth;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform float u_offset;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy;\n    float a_direction = sign(a_data.z) * mod(a_data.z, 2.0);\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    vec4 dist = vec4(u_linewidth.s * a_extrude * scale, 0.0, 0.0);\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    float u = 0.5 * a_direction;\n    float t = 1.0 - abs(u);\n    vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist.xy) / u_ratio, 0.0, 1.0);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"
            },
            linepattern: {
              fragment:
                "precision mediump float;\n\nuniform vec2 u_linewidth;\nuniform float u_point;\nuniform float u_blur;\n\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_fade;\nuniform float u_opacity;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * u_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (u_linewidth.t - blur), u_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float x_a = mod(v_linesofar / u_pattern_size_a.x, 1.0);\n    float x_b = mod(v_linesofar / u_pattern_size_b.x, 1.0);\n    float y_a = 0.5 + (v_normal.y * u_linewidth.s / u_pattern_size_a.y);\n    float y_b = 0.5 + (v_normal.y * u_linewidth.s / u_pattern_size_b.y);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, vec2(x_a, y_a));\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, vec2(x_b, y_b));\n\n    vec4 color = mix(texture2D(u_image, pos), texture2D(u_image, pos2), u_fade);\n\n    alpha *= u_opacity;\n\n    gl_FragColor = color * alpha;\n}\n",
              vertex:
                "precision mediump float;\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform highp mat4 u_matrix;\nuniform float u_ratio;\nuniform vec2 u_linewidth;\nuniform vec4 u_color;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform float u_offset;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy;\n    float a_direction = sign(a_data.z) * mod(a_data.z, 2.0);\n    float a_linesofar = abs(floor(a_data.z / 2.0)) + a_data.w * 64.0;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    vec2 extrude = a_extrude * scale;\n    vec2 dist = u_linewidth.s * extrude;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    float u = 0.5 * a_direction;\n    float t = 1.0 - abs(u);\n    vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist.xy) / u_ratio, 0.0, 1.0);\n    v_linesofar = a_linesofar;\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"
            },
            linesdfpattern: {
              fragment:
                "precision mediump float;\n\nuniform vec2 u_linewidth;\nuniform vec4 u_color;\nuniform float u_blur;\nuniform sampler2D u_image;\nuniform float u_sdfgamma;\nuniform float u_mix;\n\nvarying vec2 v_normal;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * u_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (u_linewidth.t - blur), u_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float sdfdist_a = texture2D(u_image, v_tex_a).a;\n    float sdfdist_b = texture2D(u_image, v_tex_b).a;\n    float sdfdist = mix(sdfdist_a, sdfdist_b, u_mix);\n    alpha *= smoothstep(0.5 - u_sdfgamma, 0.5 + u_sdfgamma, sdfdist);\n\n    gl_FragColor = u_color * alpha;\n}\n",
              vertex:
                "precision mediump float;\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform highp mat4 u_matrix;\nuniform vec2 u_linewidth;\nuniform float u_ratio;\nuniform vec2 u_patternscale_a;\nuniform float u_tex_y_a;\nuniform vec2 u_patternscale_b;\nuniform float u_tex_y_b;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform float u_offset;\n\nvarying vec2 v_normal;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy;\n    float a_direction = sign(a_data.z) * mod(a_data.z, 2.0);\n    float a_linesofar = abs(floor(a_data.z / 2.0)) + a_data.w * 64.0;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    vec4 dist = vec4(u_linewidth.s * a_extrude * scale, 0.0, 0.0);\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    float u = 0.5 * a_direction;\n    float t = 1.0 - abs(u);\n    vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist.xy) / u_ratio, 0.0, 1.0);\n\n    v_tex_a = vec2(a_linesofar * u_patternscale_a.x, normal.y * u_patternscale_a.y + u_tex_y_a);\n    v_tex_b = vec2(a_linesofar * u_patternscale_b.x, normal.y * u_patternscale_b.y + u_tex_y_b);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"
            },
            outline: {
              fragment:
                "precision mediump float;\n\nuniform vec4 u_color;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = smoothstep(1.0, 0.0, dist);\n    gl_FragColor = u_color * alpha;\n}\n",
              vertex:
                "precision mediump float;\n\nattribute vec2 a_pos;\n\nuniform highp mat4 u_matrix;\nuniform vec2 u_world;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos = (gl_Position.xy/gl_Position.w + 1.0) / 2.0 * u_world;\n}\n"
            },
            pattern: {
              fragment:
                "precision mediump float;\n\nuniform float u_opacity;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    gl_FragColor = mix(color1, color2, u_mix) * u_opacity;\n}\n",
              vertex:
                "precision mediump float;\n\nuniform highp mat4 u_matrix;\nuniform vec2 u_patternscale_a;\nuniform vec2 u_patternscale_b;\nuniform vec2 u_offset_a;\nuniform vec2 u_offset_b;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos_a = u_patternscale_a * a_pos + u_offset_a;\n    v_pos_b = u_patternscale_b * a_pos + u_offset_b;\n}\n"
            },
            raster: {
              fragment:
                "precision mediump float;\n\nuniform float u_opacity0;\nuniform float u_opacity1;\nuniform sampler2D u_image0;\nuniform sampler2D u_image1;\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nuniform float u_brightness_low;\nuniform float u_brightness_high;\n\nuniform float u_saturation_factor;\nuniform float u_contrast_factor;\nuniform vec3 u_spin_weights;\n\nvoid main() {\n\n    // read and cross-fade colors from the main and parent tiles\n    vec4 color0 = texture2D(u_image0, v_pos0);\n    vec4 color1 = texture2D(u_image1, v_pos1);\n    vec4 color = color0 * u_opacity0 + color1 * u_opacity1;\n    vec3 rgb = color.rgb;\n\n    // spin\n    rgb = vec3(\n        dot(rgb, u_spin_weights.xyz),\n        dot(rgb, u_spin_weights.zxy),\n        dot(rgb, u_spin_weights.yzx));\n\n    // saturation\n    float average = (color.r + color.g + color.b) / 3.0;\n    rgb += (average - rgb) * u_saturation_factor;\n\n    // contrast\n    rgb = (rgb - 0.5) * u_contrast_factor + 0.5;\n\n    // brightness\n    vec3 u_high_vec = vec3(u_brightness_low, u_brightness_low, u_brightness_low);\n    vec3 u_low_vec = vec3(u_brightness_high, u_brightness_high, u_brightness_high);\n\n    gl_FragColor = vec4(mix(u_high_vec, u_low_vec, rgb), color.a);\n}\n",
              vertex:
                "precision mediump float;\n\nuniform highp mat4 u_matrix;\nuniform vec2 u_tl_parent;\nuniform float u_scale_parent;\nuniform float u_buffer_scale;\n\nattribute vec2 a_pos;\nattribute vec2 a_texture_pos;\n\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos0 = (((a_texture_pos / 32767.0) - 0.5) / u_buffer_scale ) + 0.5;\n    v_pos1 = (v_pos0 * u_scale_parent) + u_tl_parent;\n}\n"
            },
            icon: {
              fragment:
                "precision mediump float;\n\nuniform sampler2D u_texture;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\n\nvoid main() {\n    gl_FragColor = texture2D(u_texture, v_tex) * v_alpha;\n}\n",
              vertex:
                "precision mediump float;\n\nattribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec4 a_data1;\nattribute vec4 a_data2;\n\n\n// matrix is for the vertex position, exmatrix is for rotating and projecting\n// the extrusion vector.\nuniform highp mat4 u_matrix;\nuniform mat4 u_exmatrix;\nuniform float u_zoom;\nuniform float u_fadedist;\nuniform float u_minfadezoom;\nuniform float u_maxfadezoom;\nuniform float u_fadezoom;\nuniform float u_opacity;\nuniform bool u_skewed;\nuniform float u_extra;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\n\nvoid main() {\n    vec2 a_tex = a_data1.xy;\n    float a_labelminzoom = a_data1[2];\n    vec2 a_zoom = a_data2.st;\n    float a_minzoom = a_zoom[0];\n    float a_maxzoom = a_zoom[1];\n\n    float a_fadedist = 10.0;\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    // fade out labels\n    float alpha = clamp((u_fadezoom - a_labelminzoom) / u_fadedist, 0.0, 1.0);\n\n    if (u_fadedist >= 0.0) {\n        v_alpha = alpha;\n    } else {\n        v_alpha = 1.0 - alpha;\n    }\n    if (u_maxfadezoom < a_labelminzoom) {\n        v_alpha = 0.0;\n    }\n    if (u_minfadezoom >= a_labelminzoom) {\n        v_alpha = 1.0;\n    }\n\n    // if label has been faded out, clip it\n    z += step(v_alpha, 0.0);\n\n    if (u_skewed) {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, 0, 0);\n        gl_Position = u_matrix * vec4(a_pos + extrude.xy, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    } else {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, z, 0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + extrude;\n    }\n\n    v_tex = a_tex / u_texsize;\n\n    v_alpha *= u_opacity;\n}\n"
            },
            sdf: {
              fragment:
                "precision mediump float;\n\nuniform sampler2D u_texture;\nuniform vec4 u_color;\nuniform float u_buffer;\nuniform float u_gamma;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\nvarying float v_gamma_scale;\n\nvoid main() {\n    float gamma = u_gamma * v_gamma_scale;\n    float dist = texture2D(u_texture, v_tex).a;\n    float alpha = smoothstep(u_buffer - gamma, u_buffer + gamma, dist) * v_alpha;\n    gl_FragColor = u_color * alpha;\n}\n",
              vertex:
                "precision mediump float;\n\nattribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec4 a_data1;\nattribute vec4 a_data2;\n\n\n// matrix is for the vertex position, exmatrix is for rotating and projecting\n// the extrusion vector.\nuniform highp mat4 u_matrix;\nuniform mat4 u_exmatrix;\n\nuniform float u_zoom;\nuniform float u_fadedist;\nuniform float u_minfadezoom;\nuniform float u_maxfadezoom;\nuniform float u_fadezoom;\nuniform bool u_skewed;\nuniform float u_extra;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_tex = a_data1.xy;\n    float a_labelminzoom = a_data1[2];\n    vec2 a_zoom = a_data2.st;\n    float a_minzoom = a_zoom[0];\n    float a_maxzoom = a_zoom[1];\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    // fade out labels\n    float alpha = clamp((u_fadezoom - a_labelminzoom) / u_fadedist, 0.0, 1.0);\n\n    if (u_fadedist >= 0.0) {\n        v_alpha = alpha;\n    } else {\n        v_alpha = 1.0 - alpha;\n    }\n    if (u_maxfadezoom < a_labelminzoom) {\n        v_alpha = 0.0;\n    }\n    if (u_minfadezoom >= a_labelminzoom) {\n        v_alpha = 1.0;\n    }\n\n    // if label has been faded out, clip it\n    z += step(v_alpha, 0.0);\n\n    if (u_skewed) {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, 0, 0);\n        gl_Position = u_matrix * vec4(a_pos + extrude.xy, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    } else {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, z, 0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + extrude;\n    }\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - y * u_extra);\n    v_gamma_scale = perspective_scale;\n\n    v_tex = a_tex / u_texsize;\n}\n"
            },
            collisionbox: {
              fragment:
                "precision mediump float;\n\nuniform float u_zoom;\nuniform float u_maxzoom;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n\n    float alpha = 0.5;\n\n    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0) * alpha;\n\n    if (v_placement_zoom > u_zoom) {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * alpha;\n    }\n\n    if (u_zoom >= v_max_zoom) {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) * alpha * 0.25;\n    }\n\n    if (v_placement_zoom >= u_maxzoom) {\n        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0) * alpha * 0.2;\n    }\n}\n",
              vertex:
                "precision mediump float;\n\nattribute vec2 a_pos;\nattribute vec2 a_extrude;\nattribute vec2 a_data;\n\nuniform highp mat4 u_matrix;\nuniform float u_scale;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n     gl_Position = u_matrix * vec4(a_pos + a_extrude / u_scale, 0.0, 1.0);\n\n     v_max_zoom = a_data.x;\n     v_placement_zoom = a_data.y;\n}\n"
            }
          };
        },
        { path: 100 }
      ],
      28: [
        function(require, module, exports) {
          "use strict";
          function GeoJSONSource(e) {
            (e = e || {}),
              (this._data = e.data),
              void 0 !== e.maxzoom && (this.maxzoom = e.maxzoom),
              (this.geojsonVtOptions = { maxZoom: this.maxzoom }),
              void 0 !== e.buffer && (this.geojsonVtOptions.buffer = e.buffer),
              void 0 !== e.tolerance &&
                (this.geojsonVtOptions.tolerance = e.tolerance),
              (this.cluster = e.cluster || !1),
              (this.superclusterOptions = {
                maxZoom:
                  Math.max(e.clusterMaxZoom, this.maxzoom - 1) ||
                  this.maxzoom - 1,
                extent: 4096,
                radius: e.clusterRadius || 400,
                log: !1
              }),
              (this._pyramid = new TilePyramid({
                tileSize: 512,
                minzoom: this.minzoom,
                maxzoom: this.maxzoom,
                cacheSize: 20,
                load: this._loadTile.bind(this),
                abort: this._abortTile.bind(this),
                unload: this._unloadTile.bind(this),
                add: this._addTile.bind(this),
                remove: this._removeTile.bind(this),
                redoPlacement: this._redoTilePlacement.bind(this)
              }));
          }
          var util = require("../util/util"),
            Evented = require("../util/evented"),
            TilePyramid = require("./tile_pyramid"),
            Source = require("./source"),
            urlResolve = require("resolve-url");
          (module.exports = GeoJSONSource),
            (GeoJSONSource.prototype = util.inherit(Evented, {
              minzoom: 0,
              maxzoom: 14,
              _dirty: !0,
              isTileClipped: !0,
              setData: function(e) {
                return (
                  (this._data = e),
                  (this._dirty = !0),
                  this.fire("change"),
                  this.map && this.update(this.map.transform),
                  this
                );
              },
              onAdd: function(e) {
                this.map = e;
              },
              loaded: function() {
                return this._loaded && this._pyramid.loaded();
              },
              update: function(e) {
                this._dirty && this._updateData(),
                  this._loaded && this._pyramid.update(this.used, e);
              },
              reload: function() {
                this._loaded && this._pyramid.reload();
              },
              getVisibleCoordinates: Source._getVisibleCoordinates,
              getTile: Source._getTile,
              featuresAt: Source._vectorFeaturesAt,
              featuresIn: Source._vectorFeaturesIn,
              _updateData: function() {
                this._dirty = !1;
                var e = this._data;
                "string" == typeof e &&
                  "undefined" != typeof window &&
                  (e = urlResolve(window.location.href, e)),
                  (this.workerID = this.dispatcher.send(
                    "parse geojson",
                    {
                      data: e,
                      tileSize: 512,
                      source: this.id,
                      geojsonVtOptions: this.geojsonVtOptions,
                      cluster: this.cluster,
                      superclusterOptions: this.superclusterOptions
                    },
                    function(e) {
                      (this._loaded = !0),
                        e
                          ? this.fire("error", { error: e })
                          : (this._pyramid.reload(), this.fire("change"));
                    }.bind(this)
                  ));
              },
              _loadTile: function(e) {
                var i =
                    e.coord.z > this.maxzoom
                      ? Math.pow(2, e.coord.z - this.maxzoom)
                      : 1,
                  t = {
                    uid: e.uid,
                    coord: e.coord,
                    zoom: e.coord.z,
                    maxZoom: this.maxzoom,
                    tileSize: 512,
                    source: this.id,
                    overscaling: i,
                    angle: this.map.transform.angle,
                    pitch: this.map.transform.pitch,
                    collisionDebug: this.map.collisionDebug
                  };
                e.workerID = this.dispatcher.send(
                  "load geojson tile",
                  t,
                  function(i, t) {
                    if ((e.unloadVectorData(this.map.painter), !e.aborted)) {
                      if (i) return void this.fire("tile.error", { tile: e });
                      e.loadVectorData(t),
                        e.redoWhenDone &&
                          ((e.redoWhenDone = !1), e.redoPlacement(this)),
                        this.fire("tile.load", { tile: e });
                    }
                  }.bind(this),
                  this.workerID
                );
              },
              _abortTile: function(e) {
                e.aborted = !0;
              },
              _addTile: function(e) {
                this.fire("tile.add", { tile: e });
              },
              _removeTile: function(e) {
                this.fire("tile.remove", { tile: e });
              },
              _unloadTile: function(e) {
                e.unloadVectorData(this.map.painter),
                  this.dispatcher.send(
                    "remove tile",
                    { uid: e.uid, source: this.id },
                    null,
                    e.workerID
                  );
              },
              redoPlacement: Source.redoPlacement,
              _redoTilePlacement: function(e) {
                e.redoPlacement(this);
              }
            }));
        },
        {
          "../util/evented": 92,
          "../util/util": 98,
          "./source": 32,
          "./tile_pyramid": 35,
          "resolve-url": 135
        }
      ],
      29: [
        function(require, module, exports) {
          "use strict";
          function GeoJSONWrapper(e) {
            (this.features = e), (this.length = e.length);
          }
          function FeatureWrapper(e) {
            (this.type = e.type),
              (this.rawGeometry = 1 === e.type ? [e.geometry] : e.geometry),
              (this.properties = e.tags),
              (this.extent = 4096);
          }
          var Point = require("point-geometry"),
            VectorTileFeature = require("vector-tile").VectorTileFeature;
          (module.exports = GeoJSONWrapper),
            (GeoJSONWrapper.prototype.feature = function(e) {
              return new FeatureWrapper(this.features[e]);
            }),
            (FeatureWrapper.prototype.loadGeometry = function() {
              var e = this.rawGeometry;
              this.geometry = [];
              for (var t = 0; t < e.length; t++) {
                for (var r = e[t], o = [], a = 0; a < r.length; a++)
                  o.push(new Point(r[a][0], r[a][1]));
                this.geometry.push(o);
              }
              return this.geometry;
            }),
            (FeatureWrapper.prototype.bbox = function() {
              this.geometry || this.loadGeometry();
              for (
                var e = this.geometry,
                  t = 1 / 0,
                  r = -(1 / 0),
                  o = 1 / 0,
                  a = -(1 / 0),
                  p = 0;
                p < e.length;
                p++
              )
                for (var i = e[p], n = 0; n < i.length; n++) {
                  var h = i[n];
                  (t = Math.min(t, h.x)),
                    (r = Math.max(r, h.x)),
                    (o = Math.min(o, h.y)),
                    (a = Math.max(a, h.y));
                }
              return [t, o, r, a];
            }),
            (FeatureWrapper.prototype.toGeoJSON =
              VectorTileFeature.prototype.toGeoJSON);
        },
        { "point-geometry": 133, "vector-tile": 138 }
      ],
      30: [
        function(require, module, exports) {
          "use strict";
          function ImageSource(e) {
            ajax.getImage(
              e.url,
              function(t, i) {
                t ||
                  ((this.image = i),
                  this.image.addEventListener(
                    "load",
                    function() {
                      this.map._rerender();
                    }.bind(this)
                  ),
                  (this._loaded = !0),
                  this.map &&
                    (this.createTile(e.coordinates), this.fire("change")));
              }.bind(this)
            );
          }
          var util = require("../util/util"),
            Tile = require("./tile"),
            LngLat = require("../geo/lng_lat"),
            Point = require("point-geometry"),
            Evented = require("../util/evented"),
            ajax = require("../util/ajax");
          (module.exports = ImageSource),
            (ImageSource.prototype = util.inherit(Evented, {
              onAdd: function(e) {
                (this.map = e), this.image && this.createTile();
              },
              createTile: function(e) {
                var t = this.map,
                  i = e.map(function(e) {
                    return t.transform
                      .locationCoordinate(LngLat.convert(e))
                      .zoomTo(0);
                  }),
                  r = (this.centerCoord = util.getCoordinatesCenter(i)),
                  n = 4096,
                  a = i.map(function(e) {
                    var t = e.zoomTo(r.zoom);
                    return new Point(
                      Math.round((t.column - r.column) * n),
                      Math.round((t.row - r.row) * n)
                    );
                  }),
                  o = t.painter.gl,
                  u = 32767,
                  s = new Int16Array([
                    a[0].x,
                    a[0].y,
                    0,
                    0,
                    a[1].x,
                    a[1].y,
                    u,
                    0,
                    a[3].x,
                    a[3].y,
                    0,
                    u,
                    a[2].x,
                    a[2].y,
                    u,
                    u
                  ]);
                (this.tile = new Tile()),
                  (this.tile.buckets = {}),
                  (this.tile.boundsBuffer = o.createBuffer()),
                  o.bindBuffer(o.ARRAY_BUFFER, this.tile.boundsBuffer),
                  o.bufferData(o.ARRAY_BUFFER, s, o.STATIC_DRAW);
              },
              loaded: function() {
                return this.image && this.image.complete;
              },
              update: function() {},
              reload: function() {},
              prepare: function() {
                if (this._loaded && this.loaded()) {
                  var e = this.map.painter,
                    t = e.gl;
                  this.tile.texture
                    ? (t.bindTexture(t.TEXTURE_2D, this.tile.texture),
                      t.texSubImage2D(
                        t.TEXTURE_2D,
                        0,
                        0,
                        0,
                        t.RGBA,
                        t.UNSIGNED_BYTE,
                        this.image
                      ))
                    : ((this.tile.texture = t.createTexture()),
                      t.bindTexture(t.TEXTURE_2D, this.tile.texture),
                      t.texParameteri(
                        t.TEXTURE_2D,
                        t.TEXTURE_WRAP_S,
                        t.CLAMP_TO_EDGE
                      ),
                      t.texParameteri(
                        t.TEXTURE_2D,
                        t.TEXTURE_WRAP_T,
                        t.CLAMP_TO_EDGE
                      ),
                      t.texParameteri(
                        t.TEXTURE_2D,
                        t.TEXTURE_MIN_FILTER,
                        t.LINEAR
                      ),
                      t.texParameteri(
                        t.TEXTURE_2D,
                        t.TEXTURE_MAG_FILTER,
                        t.LINEAR
                      ),
                      t.texImage2D(
                        t.TEXTURE_2D,
                        0,
                        t.RGBA,
                        t.RGBA,
                        t.UNSIGNED_BYTE,
                        this.image
                      ));
                }
              },
              getVisibleCoordinates: function() {
                return this.centerCoord ? [this.centerCoord] : [];
              },
              getTile: function() {
                return this.tile;
              },
              featuresAt: function(e, t, i) {
                return i(null, []);
              },
              featuresIn: function(e, t, i) {
                return i(null, []);
              }
            }));
        },
        {
          "../geo/lng_lat": 10,
          "../util/ajax": 86,
          "../util/evented": 92,
          "../util/util": 98,
          "./tile": 33,
          "point-geometry": 133
        }
      ],
      31: [
        function(require, module, exports) {
          "use strict";
          function RasterTileSource(e) {
            util.extend(this, util.pick(e, ["url", "tileSize"])),
              Source._loadTileJSON.call(this, e);
          }
          var util = require("../util/util"),
            ajax = require("../util/ajax"),
            Evented = require("../util/evented"),
            Source = require("./source"),
            normalizeURL = require("../util/mapbox").normalizeTileURL;
          (module.exports = RasterTileSource),
            (RasterTileSource.prototype = util.inherit(Evented, {
              minzoom: 0,
              maxzoom: 22,
              roundZoom: !0,
              tileSize: 512,
              _loaded: !1,
              onAdd: function(e) {
                this.map = e;
              },
              loaded: function() {
                return this._pyramid && this._pyramid.loaded();
              },
              update: function(e) {
                this._pyramid &&
                  this._pyramid.update(
                    this.used,
                    e,
                    this.map.style.rasterFadeDuration
                  );
              },
              reload: function() {},
              getVisibleCoordinates: Source._getVisibleCoordinates,
              getTile: Source._getTile,
              _loadTile: function(e) {
                function t(t, i) {
                  if ((delete e.request, !e.aborted)) {
                    if (t)
                      return (
                        (e.errored = !0),
                        void this.fire("tile.error", { tile: e, error: t })
                      );
                    var r = this.map.painter.gl;
                    (e.texture = this.map.painter.getTexture(i.width)),
                      e.texture
                        ? (r.bindTexture(r.TEXTURE_2D, e.texture),
                          r.texSubImage2D(
                            r.TEXTURE_2D,
                            0,
                            0,
                            0,
                            r.RGBA,
                            r.UNSIGNED_BYTE,
                            i
                          ))
                        : ((e.texture = r.createTexture()),
                          r.bindTexture(r.TEXTURE_2D, e.texture),
                          r.texParameteri(
                            r.TEXTURE_2D,
                            r.TEXTURE_MIN_FILTER,
                            r.LINEAR_MIPMAP_NEAREST
                          ),
                          r.texParameteri(
                            r.TEXTURE_2D,
                            r.TEXTURE_MAG_FILTER,
                            r.LINEAR
                          ),
                          r.texParameteri(
                            r.TEXTURE_2D,
                            r.TEXTURE_WRAP_S,
                            r.CLAMP_TO_EDGE
                          ),
                          r.texParameteri(
                            r.TEXTURE_2D,
                            r.TEXTURE_WRAP_T,
                            r.CLAMP_TO_EDGE
                          ),
                          r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0),
                          r.texImage2D(
                            r.TEXTURE_2D,
                            0,
                            r.RGBA,
                            r.RGBA,
                            r.UNSIGNED_BYTE,
                            i
                          ),
                          (e.texture.size = i.width)),
                      r.generateMipmap(r.TEXTURE_2D),
                      (e.timeAdded = new Date().getTime()),
                      this.map.animationLoop.set(this.style.rasterFadeDuration),
                      (e.source = this),
                      (e.loaded = !0),
                      this.fire("tile.load", { tile: e });
                  }
                }
                var i = normalizeURL(e.coord.url(this.tiles), this.url);
                e.request = ajax.getImage(i, t.bind(this));
              },
              _abortTile: function(e) {
                (e.aborted = !0),
                  e.request && (e.request.abort(), delete e.request);
              },
              _addTile: function(e) {
                this.fire("tile.add", { tile: e });
              },
              _removeTile: function(e) {
                this.fire("tile.remove", { tile: e });
              },
              _unloadTile: function(e) {
                e.texture && this.map.painter.saveTexture(e.texture);
              },
              featuresAt: function(e, t, i) {
                i(null, []);
              },
              featuresIn: function(e, t, i) {
                i(null, []);
              }
            }));
        },
        {
          "../util/ajax": 86,
          "../util/evented": 92,
          "../util/mapbox": 95,
          "../util/util": 98,
          "./source": 32
        }
      ],
      32: [
        function(require, module, exports) {
          "use strict";
          var util = require("../util/util"),
            ajax = require("../util/ajax"),
            browser = require("../util/browser"),
            TilePyramid = require("./tile_pyramid"),
            normalizeURL = require("../util/mapbox").normalizeSourceURL,
            TileCoord = require("./tile_coord");
          (exports._loadTileJSON = function(e) {
            var i = function(e, i) {
              return e
                ? void this.fire("error", { error: e })
                : (util.extend(
                    this,
                    util.pick(i, ["tiles", "minzoom", "maxzoom", "attribution"])
                  ),
                  i.vector_layers &&
                    ((this.vectorLayers = i.vector_layers),
                    (this.vectorLayerIds = this.vectorLayers.map(function(e) {
                      return e.id;
                    }))),
                  (this._pyramid = new TilePyramid({
                    tileSize: this.tileSize,
                    cacheSize: 20,
                    minzoom: this.minzoom,
                    maxzoom: this.maxzoom,
                    roundZoom: this.roundZoom,
                    reparseOverscaled: this.reparseOverscaled,
                    load: this._loadTile.bind(this),
                    abort: this._abortTile.bind(this),
                    unload: this._unloadTile.bind(this),
                    add: this._addTile.bind(this),
                    remove: this._removeTile.bind(this),
                    redoPlacement: this._redoTilePlacement
                      ? this._redoTilePlacement.bind(this)
                      : void 0
                  })),
                  void this.fire("load"));
            }.bind(this);
            e.url
              ? ajax.getJSON(normalizeURL(e.url), i)
              : browser.frame(i.bind(this, null, e));
          }),
            (exports.redoPlacement = function() {
              if (this._pyramid)
                for (
                  var e = this._pyramid.orderedIDs(), i = 0;
                  i < e.length;
                  i++
                ) {
                  var r = this._pyramid.getTile(e[i]);
                  this._redoTilePlacement(r);
                }
            }),
            (exports._getTile = function(e) {
              return this._pyramid.getTile(e.id);
            }),
            (exports._getVisibleCoordinates = function() {
              return this._pyramid
                ? this._pyramid.renderedIDs().map(TileCoord.fromID)
                : [];
            }),
            (exports._vectorFeaturesAt = function(e, i, r) {
              if (!this._pyramid) return r(null, []);
              var t = this._pyramid.tileAt(e);
              return t
                ? void this.dispatcher.send(
                    "query features",
                    {
                      uid: t.tile.uid,
                      x: t.x,
                      y: t.y,
                      tileExtent: t.tile.tileExtent,
                      scale: t.scale,
                      source: this.id,
                      params: i
                    },
                    r,
                    t.tile.workerID
                  )
                : r(null, []);
            }),
            (exports._vectorFeaturesIn = function(e, i, r) {
              if (!this._pyramid) return r(null, []);
              var t = this._pyramid.tilesIn(e);
              return t
                ? void util.asyncAll(
                    t,
                    function(e, r) {
                      this.dispatcher.send(
                        "query features",
                        {
                          uid: e.tile.uid,
                          source: this.id,
                          minX: e.minX,
                          maxX: e.maxX,
                          minY: e.minY,
                          maxY: e.maxY,
                          params: i
                        },
                        r,
                        e.tile.workerID
                      );
                    }.bind(this),
                    function(e, i) {
                      r(e, Array.prototype.concat.apply([], i));
                    }
                  )
                : r(null, []);
            }),
            (exports.create = function(e) {
              var i = {
                vector: require("./vector_tile_source"),
                raster: require("./raster_tile_source"),
                geojson: require("./geojson_source"),
                video: require("./video_source"),
                image: require("./image_source")
              };
              for (var r in i) if (e instanceof i[r]) return e;
              return new i[e.type](e);
            });
        },
        {
          "../util/ajax": 86,
          "../util/browser": 87,
          "../util/mapbox": 95,
          "../util/util": 98,
          "./geojson_source": 28,
          "./image_source": 30,
          "./raster_tile_source": 31,
          "./tile_coord": 34,
          "./tile_pyramid": 35,
          "./vector_tile_source": 36,
          "./video_source": 37
        }
      ],
      33: [
        function(require, module, exports) {
          "use strict";
          function Tile(e, t, i) {
            (this.coord = e),
              (this.uid = util.uniqueId()),
              (this.loaded = !1),
              (this.uses = 0),
              (this.tileSize = t),
              (this.sourceMaxZoom = i);
          }
          function unserializeBuffers(e) {
            var t = {};
            for (var i in e) t[i] = new Buffer(e[i]);
            return t;
          }
          var util = require("../util/util"),
            Buffer = require("../data/buffer");
          (module.exports = Tile),
            (Tile.prototype = {
              tileExtent: 4096,
              positionAt: function(e) {
                var t = e.zoomTo(Math.min(this.coord.z, this.sourceMaxZoom));
                return {
                  x: (t.column - this.coord.x) * this.tileExtent,
                  y: (t.row - this.coord.y) * this.tileExtent
                };
              },
              loadVectorData: function(e) {
                (this.loaded = !0),
                  e &&
                    ((this.buffers = unserializeBuffers(e.buffers)),
                    (this.elementGroups = e.elementGroups),
                    (this.tileExtent = e.extent));
              },
              reloadSymbolData: function(e, t) {
                if (this.buffers) {
                  this.buffers.glyphVertex &&
                    this.buffers.glyphVertex.destroy(t.gl),
                    this.buffers.glyphElement &&
                      this.buffers.glyphElement.destroy(t.gl),
                    this.buffers.iconVertex &&
                      this.buffers.iconVertex.destroy(t.gl),
                    this.buffers.iconElement &&
                      this.buffers.iconElement.destroy(t.gl),
                    this.buffers.collisionBoxVertex &&
                      this.buffers.collisionBoxVertex.destroy(t.gl);
                  var i = unserializeBuffers(e.buffers);
                  (this.buffers.glyphVertex = i.glyphVertex),
                    (this.buffers.glyphElement = i.glyphElement),
                    (this.buffers.iconVertex = i.iconVertex),
                    (this.buffers.iconElement = i.iconElement),
                    (this.buffers.collisionBoxVertex = i.collisionBoxVertex);
                  for (var s in e.elementGroups)
                    this.elementGroups[s] = e.elementGroups[s];
                }
              },
              unloadVectorData: function(e) {
                this.loaded = !1;
                for (var t in this.buffers)
                  this.buffers[t] && this.buffers[t].destroy(e.gl);
                (this.elementGroups = null),
                  (this.buffers = null),
                  (this.tileExtent = null);
              },
              redoPlacement: function(e) {
                function t(t, i) {
                  this.reloadSymbolData(i, e.map.painter),
                    e.fire("tile.load", { tile: this }),
                    (this.redoingPlacement = !1),
                    this.redoWhenDone &&
                      (this.redoPlacement(e), (this.redoWhenDone = !1));
                }
                return !this.loaded || this.redoingPlacement
                  ? void (this.redoWhenDone = !0)
                  : ((this.redoingPlacement = !0),
                    void e.dispatcher.send(
                      "redo placement",
                      {
                        uid: this.uid,
                        source: e.id,
                        angle: e.map.transform.angle,
                        pitch: e.map.transform.pitch,
                        collisionDebug: e.map.collisionDebug
                      },
                      t.bind(this),
                      this.workerID
                    ));
              },
              getElementGroups: function(e, t) {
                return (
                  this.elementGroups &&
                  this.elementGroups[e.ref || e.id] &&
                  this.elementGroups[e.ref || e.id][t]
                );
              }
            });
        },
        { "../data/buffer": 2, "../util/util": 98 }
      ],
      34: [
        function(require, module, exports) {
          "use strict";
          function TileCoord(t, i, o, r) {
            isNaN(r) && (r = 0),
              (this.z = +t),
              (this.x = +i),
              (this.y = +o),
              (this.w = +r),
              (r *= 2),
              0 > r && (r = -1 * r - 1);
            var e = 1 << this.z;
            this.id = 32 * (e * e * r + e * this.y + this.x) + this.z;
          }
          function edge(t, i) {
            if (t.row > i.row) {
              var o = t;
              (t = i), (i = o);
            }
            return {
              x0: t.column,
              y0: t.row,
              x1: i.column,
              y1: i.row,
              dx: i.column - t.column,
              dy: i.row - t.row
            };
          }
          function scanSpans(t, i, o, r, e) {
            var n = Math.max(o, Math.floor(i.y0)),
              h = Math.min(r, Math.ceil(i.y1));
            if (
              t.x0 === i.x0 && t.y0 === i.y0
                ? t.x0 + (i.dy / t.dy) * t.dx < i.x1
                : t.x1 - (i.dy / t.dy) * t.dx < i.x0
            ) {
              var s = t;
              (t = i), (i = s);
            }
            for (
              var d = t.dx / t.dy,
                a = i.dx / i.dy,
                l = t.dx > 0,
                y = i.dx < 0,
                c = n;
              h > c;
              c++
            ) {
              var x = d * Math.max(0, Math.min(t.dy, c + l - t.y0)) + t.x0,
                u = a * Math.max(0, Math.min(i.dy, c + y - i.y0)) + i.x0;
              e(Math.floor(u), Math.ceil(x), c);
            }
          }
          function scanTriangle(t, i, o, r, e, n) {
            var h,
              s = edge(t, i),
              d = edge(i, o),
              a = edge(o, t);
            s.dy > d.dy && ((h = s), (s = d), (d = h)),
              s.dy > a.dy && ((h = s), (s = a), (a = h)),
              d.dy > a.dy && ((h = d), (d = a), (a = h)),
              s.dy && scanSpans(a, s, r, e, n),
              d.dy && scanSpans(a, d, r, e, n);
          }
          var Coordinate = require("../geo/coordinate");
          (module.exports = TileCoord),
            (TileCoord.prototype.toString = function() {
              return this.z + "/" + this.x + "/" + this.y;
            }),
            (TileCoord.prototype.toCoordinate = function() {
              var t = this.z,
                i = Math.pow(2, t),
                o = this.y,
                r = this.x + i * this.w;
              return new Coordinate(r, o, t);
            }),
            (TileCoord.fromID = function(t) {
              var i = t % 32,
                o = 1 << i,
                r = (t - i) / 32,
                e = r % o,
                n = ((r - e) / o) % o,
                h = Math.floor(r / (o * o));
              return (
                h % 2 !== 0 && (h = -1 * h - 1),
                (h /= 2),
                new TileCoord(i, e, n, h)
              );
            }),
            (TileCoord.prototype.url = function(t, i) {
              return t[(this.x + this.y) % t.length]
                .replace(
                  "{prefix}",
                  (this.x % 16).toString(16) + (this.y % 16).toString(16)
                )
                .replace("{z}", Math.min(this.z, i || this.z))
                .replace("{x}", this.x)
                .replace("{y}", this.y);
            }),
            (TileCoord.prototype.parent = function(t) {
              return 0 === this.z
                ? null
                : this.z > t
                ? new TileCoord(this.z - 1, this.x, this.y, this.w)
                : new TileCoord(
                    this.z - 1,
                    Math.floor(this.x / 2),
                    Math.floor(this.y / 2),
                    this.w
                  );
            }),
            (TileCoord.prototype.wrapped = function() {
              return new TileCoord(this.z, this.x, this.y, 0);
            }),
            (TileCoord.prototype.children = function(t) {
              if (this.z >= t)
                return [new TileCoord(this.z + 1, this.x, this.y, this.w)];
              var i = this.z + 1,
                o = 2 * this.x,
                r = 2 * this.y;
              return [
                new TileCoord(i, o, r, this.w),
                new TileCoord(i, o + 1, r, this.w),
                new TileCoord(i, o, r + 1, this.w),
                new TileCoord(i, o + 1, r + 1, this.w)
              ];
            }),
            (TileCoord.cover = function(t, i, o) {
              function r(t, i, r) {
                var h, s, d;
                if (r >= 0 && e >= r)
                  for (h = t; i > h; h++)
                    (s = ((h % e) + e) % e),
                      (d = new TileCoord(o, s, r, Math.floor(h / e))),
                      (n[d.id] = d);
              }
              var e = 1 << t,
                n = {};
              return (
                scanTriangle(i[0], i[1], i[2], 0, e, r),
                scanTriangle(i[2], i[3], i[0], 0, e, r),
                Object.keys(n).map(function(t) {
                  return n[t];
                })
              );
            });
        },
        { "../geo/coordinate": 9 }
      ],
      35: [
        function(require, module, exports) {
          "use strict";
          function TilePyramid(e) {
            (this.tileSize = e.tileSize),
              (this.minzoom = e.minzoom),
              (this.maxzoom = e.maxzoom),
              (this.roundZoom = e.roundZoom),
              (this.reparseOverscaled = e.reparseOverscaled),
              (this._load = e.load),
              (this._abort = e.abort),
              (this._unload = e.unload),
              (this._add = e.add),
              (this._remove = e.remove),
              (this._redoPlacement = e.redoPlacement),
              (this._tiles = {}),
              (this._cache = new Cache(
                e.cacheSize,
                function(e) {
                  return this._unload(e);
                }.bind(this)
              )),
              (this._filterRendered = this._filterRendered.bind(this));
          }
          function compareKeyZoom(e, i) {
            return (i % 32) - (e % 32);
          }
          var Tile = require("./tile"),
            TileCoord = require("./tile_coord"),
            Point = require("point-geometry"),
            Cache = require("../util/mru_cache"),
            util = require("../util/util");
          (module.exports = TilePyramid),
            (TilePyramid.prototype = {
              loaded: function() {
                for (var e in this._tiles)
                  if (!this._tiles[e].loaded && !this._tiles[e].errored)
                    return !1;
                return !0;
              },
              orderedIDs: function() {
                return Object.keys(this._tiles)
                  .map(Number)
                  .sort(compareKeyZoom);
              },
              renderedIDs: function() {
                return this.orderedIDs().filter(this._filterRendered);
              },
              _filterRendered: function(e) {
                return this._tiles[e].loaded && !this._coveredTiles[e];
              },
              reload: function() {
                this._cache.reset();
                for (var e in this._tiles) this._load(this._tiles[e]);
              },
              getTile: function(e) {
                return this._tiles[e];
              },
              getZoom: function(e) {
                return e.zoom + Math.log(e.tileSize / this.tileSize) / Math.LN2;
              },
              coveringZoomLevel: function(e) {
                return (this.roundZoom ? Math.round : Math.floor)(
                  this.getZoom(e)
                );
              },
              coveringTiles: function(e) {
                var i = this.coveringZoomLevel(e),
                  t = i;
                if (i < this.minzoom) return [];
                i > this.maxzoom && (i = this.maxzoom);
                var o = e,
                  r = o.locationCoordinate(o.center)._zoomTo(i),
                  n = new Point(r.column - 0.5, r.row - 0.5);
                return TileCoord.cover(
                  i,
                  [
                    o.pointCoordinate(new Point(0, 0))._zoomTo(i),
                    o.pointCoordinate(new Point(o.width, 0))._zoomTo(i),
                    o.pointCoordinate(new Point(o.width, o.height))._zoomTo(i),
                    o.pointCoordinate(new Point(0, o.height))._zoomTo(i)
                  ],
                  this.reparseOverscaled ? t : i
                ).sort(function(e, i) {
                  return n.dist(e) - n.dist(i);
                });
              },
              findLoadedChildren: function(e, i, t) {
                var o = !1;
                for (var r in this._tiles) {
                  var n = this._tiles[r];
                  if (
                    !(t[r] || !n.loaded || n.coord.z <= e.z || n.coord.z > i)
                  ) {
                    var s = Math.pow(
                      2,
                      Math.min(n.coord.z, this.maxzoom) -
                        Math.min(e.z, this.maxzoom)
                    );
                    if (
                      Math.floor(n.coord.x / s) === e.x &&
                      Math.floor(n.coord.y / s) === e.y
                    )
                      for (t[r] = !0, o = !0; n && n.coord.z - 1 > e.z; ) {
                        var d = n.coord.parent(this.maxzoom).id;
                        (n = this._tiles[d]),
                          n && n.loaded && (delete t[r], (t[d] = !0));
                      }
                  }
                }
                return o;
              },
              findLoadedParent: function(e, i, t) {
                for (var o = e.z - 1; o >= i; o--) {
                  e = e.parent(this.maxzoom);
                  var r = this._tiles[e.id];
                  if (r && r.loaded) return (t[e.id] = !0), r;
                }
              },
              update: function(e, i, t) {
                var o,
                  r,
                  n,
                  s = (this.roundZoom ? Math.round : Math.floor)(
                    this.getZoom(i)
                  ),
                  d = Math.max(s - 10, this.minzoom),
                  a = Math.max(s + 3, this.minzoom),
                  h = {},
                  l = new Date().getTime();
                this._coveredTiles = {};
                var m = e ? this.coveringTiles(i) : [];
                for (o = 0; o < m.length; o++)
                  (r = m[o]),
                    (n = this.addTile(r)),
                    (h[r.id] = !0),
                    n.loaded ||
                      this.findLoadedChildren(r, a, h) ||
                      this.findLoadedParent(r, d, h);
                for (var c = {}, u = Object.keys(h), f = 0; f < u.length; f++) {
                  var _ = u[f];
                  (r = TileCoord.fromID(_)),
                    (n = this._tiles[_]),
                    n &&
                      n.timeAdded > l - (t || 0) &&
                      (this.findLoadedChildren(r, a, h) && (h[_] = !0),
                      this.findLoadedParent(r, d, c));
                }
                var v;
                for (v in c) h[v] || (this._coveredTiles[v] = !0);
                for (v in c) h[v] = !0;
                var z = util.keysDifference(this._tiles, h);
                for (o = 0; o < z.length; o++) this.removeTile(+z[o]);
                this.transform = i;
              },
              addTile: function(e) {
                var i = this._tiles[e.id];
                if (i) return i;
                var t = e.wrapped();
                if (
                  ((i = this._tiles[t.id]),
                  i ||
                    ((i = this._cache.get(t.id)),
                    i && this._redoPlacement && this._redoPlacement(i)),
                  !i)
                ) {
                  var o = e.z,
                    r = o > this.maxzoom ? Math.pow(2, o - this.maxzoom) : 1;
                  (i = new Tile(t, this.tileSize * r, this.maxzoom)),
                    this._load(i);
                }
                return i.uses++, (this._tiles[e.id] = i), this._add(i, e), i;
              },
              removeTile: function(e) {
                var i = this._tiles[e];
                i &&
                  (i.uses--,
                  delete this._tiles[e],
                  this._remove(i),
                  i.uses > 0 ||
                    (i.loaded
                      ? this._cache.add(i.coord.wrapped().id, i)
                      : (this._abort(i), this._unload(i))));
              },
              clearTiles: function() {
                for (var e in this._tiles) this.removeTile(e);
                this._cache.reset();
              },
              tileAt: function(e) {
                for (var i = this.orderedIDs(), t = 0; t < i.length; t++) {
                  var o = this._tiles[i[t]],
                    r = o.positionAt(e);
                  if (
                    r &&
                    r.x >= 0 &&
                    r.x < o.tileExtent &&
                    r.y >= 0 &&
                    r.y < o.tileExtent
                  )
                    return {
                      tile: o,
                      x: r.x,
                      y: r.y,
                      scale: this.transform.worldSize / Math.pow(2, o.coord.z)
                    };
                }
              },
              tilesIn: function(e) {
                for (
                  var i = [], t = this.orderedIDs(), o = 0;
                  o < t.length;
                  o++
                ) {
                  var r = this._tiles[t[o]],
                    n = [r.positionAt(e[0]), r.positionAt(e[1])];
                  n[0].x < r.tileExtent &&
                    n[0].y < r.tileExtent &&
                    n[1].x >= 0 &&
                    n[1].y >= 0 &&
                    i.push({
                      tile: r,
                      minX: n[0].x,
                      maxX: n[1].x,
                      minY: n[0].y,
                      maxY: n[1].y
                    });
                }
                return i;
              }
            });
        },
        {
          "../util/mru_cache": 96,
          "../util/util": 98,
          "./tile": 33,
          "./tile_coord": 34,
          "point-geometry": 133
        }
      ],
      36: [
        function(require, module, exports) {
          "use strict";
          function VectorTileSource(e) {
            if (
              (util.extend(this, util.pick(e, ["url", "tileSize"])),
              512 !== this.tileSize)
            )
              throw new Error(
                "vector tile sources must have a tileSize of 512"
              );
            Source._loadTileJSON.call(this, e);
          }
          var util = require("../util/util"),
            Evented = require("../util/evented"),
            Source = require("./source"),
            normalizeURL = require("../util/mapbox").normalizeTileURL;
          (module.exports = VectorTileSource),
            (VectorTileSource.prototype = util.inherit(Evented, {
              minzoom: 0,
              maxzoom: 22,
              tileSize: 512,
              reparseOverscaled: !0,
              _loaded: !1,
              isTileClipped: !0,
              onAdd: function(e) {
                this.map = e;
              },
              loaded: function() {
                return this._pyramid && this._pyramid.loaded();
              },
              update: function(e) {
                this._pyramid && this._pyramid.update(this.used, e);
              },
              reload: function() {
                this._pyramid && this._pyramid.reload();
              },
              getVisibleCoordinates: Source._getVisibleCoordinates,
              getTile: Source._getTile,
              featuresAt: Source._vectorFeaturesAt,
              featuresIn: Source._vectorFeaturesIn,
              _loadTile: function(e) {
                var i =
                    e.coord.z > this.maxzoom
                      ? Math.pow(2, e.coord.z - this.maxzoom)
                      : 1,
                  t = {
                    url: normalizeURL(
                      e.coord.url(this.tiles, this.maxzoom),
                      this.url
                    ),
                    uid: e.uid,
                    coord: e.coord,
                    zoom: e.coord.z,
                    tileSize: this.tileSize * i,
                    source: this.id,
                    overscaling: i,
                    angle: this.map.transform.angle,
                    pitch: this.map.transform.pitch,
                    collisionDebug: this.map.collisionDebug
                  };
                e.workerID
                  ? this.dispatcher.send(
                      "reload tile",
                      t,
                      this._tileLoaded.bind(this, e),
                      e.workerID
                    )
                  : (e.workerID = this.dispatcher.send(
                      "load tile",
                      t,
                      this._tileLoaded.bind(this, e)
                    ));
              },
              _tileLoaded: function(e, i, t) {
                if (!e.aborted) {
                  if (i)
                    return void this.fire("tile.error", { tile: e, error: i });
                  e.loadVectorData(t),
                    e.redoWhenDone &&
                      ((e.redoWhenDone = !1), e.redoPlacement(this)),
                    this.fire("tile.load", { tile: e }),
                    this.fire("tile.stats", t.bucketStats);
                }
              },
              _abortTile: function(e) {
                (e.aborted = !0),
                  this.dispatcher.send(
                    "abort tile",
                    { uid: e.uid, source: this.id },
                    null,
                    e.workerID
                  );
              },
              _addTile: function(e) {
                this.fire("tile.add", { tile: e });
              },
              _removeTile: function(e) {
                this.fire("tile.remove", { tile: e });
              },
              _unloadTile: function(e) {
                e.unloadVectorData(this.map.painter),
                  this.dispatcher.send(
                    "remove tile",
                    { uid: e.uid, source: this.id },
                    null,
                    e.workerID
                  );
              },
              redoPlacement: Source.redoPlacement,
              _redoTilePlacement: function(e) {
                e.redoPlacement(this);
              }
            }));
        },
        {
          "../util/evented": 92,
          "../util/mapbox": 95,
          "../util/util": 98,
          "./source": 32
        }
      ],
      37: [
        function(require, module, exports) {
          "use strict";
          function VideoSource(e) {
            ajax.getVideo(
              e.urls,
              function(t, i) {
                if (!t) {
                  (this.video = i), (this.video.loop = !0);
                  var r;
                  this.video.addEventListener(
                    "playing",
                    function() {
                      (r = this.map.style.animationLoop.set(1 / 0)),
                        this.map._rerender();
                    }.bind(this)
                  ),
                    this.video.addEventListener(
                      "pause",
                      function() {
                        this.map.style.animationLoop.cancel(r);
                      }.bind(this)
                    ),
                    (this._loaded = !0),
                    this.map &&
                      (this.video.play(),
                      this.createTile(e.coordinates),
                      this.fire("change"));
                }
              }.bind(this)
            );
          }
          var util = require("../util/util"),
            Tile = require("./tile"),
            LngLat = require("../geo/lng_lat"),
            Point = require("point-geometry"),
            Evented = require("../util/evented"),
            ajax = require("../util/ajax");
          (module.exports = VideoSource),
            (VideoSource.prototype = util.inherit(Evented, {
              roundZoom: !0,
              getVideo: function() {
                return this.video;
              },
              onAdd: function(e) {
                (this.map = e),
                  this.video && (this.video.play(), this.createTile());
              },
              createTile: function(e) {
                var t = this.map,
                  i = e.map(function(e) {
                    return t.transform
                      .locationCoordinate(LngLat.convert(e))
                      .zoomTo(0);
                  }),
                  r = (this.centerCoord = util.getCoordinatesCenter(i)),
                  n = 4096,
                  o = i.map(function(e) {
                    var t = e.zoomTo(r.zoom);
                    return new Point(
                      Math.round((t.column - r.column) * n),
                      Math.round((t.row - r.row) * n)
                    );
                  }),
                  a = t.painter.gl,
                  u = 32767,
                  s = new Int16Array([
                    o[0].x,
                    o[0].y,
                    0,
                    0,
                    o[1].x,
                    o[1].y,
                    u,
                    0,
                    o[3].x,
                    o[3].y,
                    0,
                    u,
                    o[2].x,
                    o[2].y,
                    u,
                    u
                  ]);
                (this.tile = new Tile()),
                  (this.tile.buckets = {}),
                  (this.tile.boundsBuffer = a.createBuffer()),
                  a.bindBuffer(a.ARRAY_BUFFER, this.tile.boundsBuffer),
                  a.bufferData(a.ARRAY_BUFFER, s, a.STATIC_DRAW);
              },
              loaded: function() {
                return this.video && this.video.readyState >= 2;
              },
              update: function() {},
              reload: function() {},
              prepare: function() {
                if (this._loaded && !(this.video.readyState < 2)) {
                  var e = this.map.painter.gl;
                  this.tile.texture
                    ? (e.bindTexture(e.TEXTURE_2D, this.tile.texture),
                      e.texSubImage2D(
                        e.TEXTURE_2D,
                        0,
                        0,
                        0,
                        e.RGBA,
                        e.UNSIGNED_BYTE,
                        this.video
                      ))
                    : ((this.tile.texture = e.createTexture()),
                      e.bindTexture(e.TEXTURE_2D, this.tile.texture),
                      e.texParameteri(
                        e.TEXTURE_2D,
                        e.TEXTURE_WRAP_S,
                        e.CLAMP_TO_EDGE
                      ),
                      e.texParameteri(
                        e.TEXTURE_2D,
                        e.TEXTURE_WRAP_T,
                        e.CLAMP_TO_EDGE
                      ),
                      e.texParameteri(
                        e.TEXTURE_2D,
                        e.TEXTURE_MIN_FILTER,
                        e.LINEAR
                      ),
                      e.texParameteri(
                        e.TEXTURE_2D,
                        e.TEXTURE_MAG_FILTER,
                        e.LINEAR
                      ),
                      e.texImage2D(
                        e.TEXTURE_2D,
                        0,
                        e.RGBA,
                        e.RGBA,
                        e.UNSIGNED_BYTE,
                        this.video
                      )),
                    (this._currentTime = this.video.currentTime);
                }
              },
              getVisibleCoordinates: function() {
                return this.centerCoord ? [this.centerCoord] : [];
              },
              getTile: function() {
                return this.tile;
              },
              featuresAt: function(e, t, i) {
                return i(null, []);
              },
              featuresIn: function(e, t, i) {
                return i(null, []);
              }
            }));
        },
        {
          "../geo/lng_lat": 10,
          "../util/ajax": 86,
          "../util/evented": 92,
          "../util/util": 98,
          "./tile": 33,
          "point-geometry": 133
        }
      ],
      38: [
        function(require, module, exports) {
          "use strict";
          function Worker(e) {
            (this.self = e),
              (this.actor = new Actor(e, this)),
              (this.loading = {}),
              (this.loaded = {}),
              (this.layers = []),
              (this.geoJSONIndexes = {});
          }
          var Actor = require("../util/actor"),
            WorkerTile = require("./worker_tile"),
            util = require("../util/util"),
            ajax = require("../util/ajax"),
            vt = require("vector-tile"),
            Protobuf = require("pbf"),
            supercluster = require("supercluster"),
            geojsonvt = require("geojson-vt"),
            GeoJSONWrapper = require("./geojson_wrapper");
          (module.exports = function(e) {
            return new Worker(e);
          }),
            util.extend(Worker.prototype, {
              "set layers": function(e) {
                this.layers = e;
              },
              "load tile": function(e, r) {
                function t(e, t) {
                  return (
                    delete this.loading[i][o],
                    e
                      ? r(e)
                      : ((a.data = new vt.VectorTile(
                          new Protobuf(new Uint8Array(t))
                        )),
                        a.parse(a.data, this.layers, this.actor, r),
                        (this.loaded[i] = this.loaded[i] || {}),
                        void (this.loaded[i][o] = a))
                  );
                }
                var i = e.source,
                  o = e.uid;
                this.loading[i] || (this.loading[i] = {});
                var a = (this.loading[i][o] = new WorkerTile(e));
                a.xhr = ajax.getArrayBuffer(e.url, t.bind(this));
              },
              "reload tile": function(e, r) {
                var t = this.loaded[e.source],
                  i = e.uid;
                if (t && t[i]) {
                  var o = t[i];
                  o.parse(o.data, this.layers, this.actor, r);
                }
              },
              "abort tile": function(e) {
                var r = this.loading[e.source],
                  t = e.uid;
                r && r[t] && (r[t].xhr.abort(), delete r[t]);
              },
              "remove tile": function(e) {
                var r = this.loaded[e.source],
                  t = e.uid;
                r && r[t] && delete r[t];
              },
              "redo placement": function(e, r) {
                var t = this.loaded[e.source],
                  i = this.loading[e.source],
                  o = e.uid;
                if (t && t[o]) {
                  var a = t[o],
                    s = a.redoPlacement(e.angle, e.pitch, e.collisionDebug);
                  s.result && r(null, s.result, s.transferables);
                } else i && i[o] && (i[o].angle = e.angle);
              },
              "parse geojson": function(e, r) {
                var t = function(t, i) {
                  if (t) return r(t);
                  if ("object" != typeof i)
                    return r(
                      new Error("Input data is not a valid GeoJSON object.")
                    );
                  try {
                    this.geoJSONIndexes[e.source] = e.cluster
                      ? supercluster(e.superclusterOptions).load(i.features)
                      : geojsonvt(i, e.geojsonVtOptions);
                  } catch (t) {
                    return r(t);
                  }
                  r(null);
                }.bind(this);
                "string" == typeof e.data
                  ? ajax.getJSON(e.data, t)
                  : t(null, e.data);
              },
              "load geojson tile": function(e, r) {
                var t = e.source,
                  i = e.coord;
                if (!this.geoJSONIndexes[t]) return r(null, null);
                var o = this.geoJSONIndexes[t].getTile(i.z, i.x, i.y);
                if (!o) return r(null, null);
                var a = new WorkerTile(e);
                a.parse(
                  new GeoJSONWrapper(o.features),
                  this.layers,
                  this.actor,
                  r
                ),
                  (this.loaded[t] = this.loaded[t] || {}),
                  (this.loaded[t][e.uid] = a);
              },
              "query features": function(e, r) {
                var t = this.loaded[e.source] && this.loaded[e.source][e.uid];
                t ? t.featureTree.query(e, r) : r(null, []);
              }
            });
        },
        {
          "../util/actor": 85,
          "../util/ajax": 86,
          "../util/util": 98,
          "./geojson_wrapper": 29,
          "./worker_tile": 39,
          "geojson-vt": 108,
          pbf: 131,
          supercluster: 136,
          "vector-tile": 138
        }
      ],
      39: [
        function(require, module, exports) {
          "use strict";
          function WorkerTile(e) {
            (this.coord = e.coord),
              (this.uid = e.uid),
              (this.zoom = e.zoom),
              (this.tileSize = e.tileSize),
              (this.source = e.source),
              (this.overscaling = e.overscaling),
              (this.angle = e.angle),
              (this.pitch = e.pitch),
              (this.collisionDebug = e.collisionDebug);
          }
          function getElementGroups(e) {
            for (var t = {}, r = 0; r < e.length; r++)
              t[e[r].id] = e[r].elementGroups;
            return t;
          }
          function getTransferables(e) {
            var t = [];
            for (var r in e) t.push(e[r].arrayBuffer), (e[r].push = null);
            return t;
          }
          function getExtent(e) {
            var t = 4096;
            if (!e) return t;
            for (var r in e) {
              var o = e[r];
              o && o.extent && (t = o.extent);
            }
            return t;
          }
          var FeatureTree = require("../data/feature_tree"),
            CollisionTile = require("../symbol/collision_tile"),
            Bucket = require("../data/bucket");
          (module.exports = WorkerTile),
            (WorkerTile.prototype.parse = function(e, t, r, o) {
              function s(e, t) {
                for (var r = 0; r < e.length; r++) {
                  var o = e.feature(r);
                  for (var s in t) t[s].filter(o) && t[s].features.push(o);
                }
              }
              function i(e) {
                if (e) return o(e);
                if ((E++, 2 === E)) {
                  for (var t = y.length - 1; t >= 0; t--) n(g, y[t]);
                  l();
                }
              }
              function n(e, t) {
                var r = Date.now();
                t.addFeatures(k, B, z);
                var o = Date.now() - r;
                if (t.interactive)
                  for (var s = 0; s < t.features.length; s++) {
                    var i = t.features[s];
                    e.featureTree.insert(i.bbox(), t.layers, i);
                  }
                (t.features = null),
                  (h._total += o),
                  (h[t.id] = (h[t.id] || 0) + o);
              }
              function l() {
                if (((g.status = "done"), g.redoPlacementAfterDone)) {
                  var e = g.redoPlacement(g.angle, g.pitch).result;
                  (m.glyphVertex = e.buffers.glyphVertex),
                    (m.iconVertex = e.buffers.iconVertex),
                    (m.collisionBoxVertex = e.buffers.collisionBoxVertex),
                    (g.redoPlacementAfterDone = !1);
                }
                o(
                  null,
                  {
                    elementGroups: getElementGroups(b),
                    buffers: m,
                    extent: d,
                    bucketStats: h
                  },
                  getTransferables(m)
                );
              }
              (this.status = "parsing"),
                (this.featureTree = new FeatureTree(
                  this.coord,
                  this.overscaling
                ));
              var a,
                u,
                f,
                c,
                h = { _total: 0 },
                g = this,
                m = {},
                p = {},
                v = {},
                d = (this.extent = getExtent(e.layers));
              for (a = 0; a < t.length; a++)
                (u = t[a]),
                  u.source === this.source &&
                    (u.ref ||
                      (u.minzoom && this.zoom < u.minzoom) ||
                      (u.maxzoom && this.zoom >= u.maxzoom) ||
                      (u.layout && "none" === u.layout.visibility) ||
                      ((c = Bucket.create({
                        layer: u,
                        buffers: m,
                        zoom: this.zoom,
                        overscaling: this.overscaling,
                        collisionDebug: this.collisionDebug,
                        tileExtent: d
                      })),
                      (p[u.id] = c),
                      e.layers &&
                        ((f = u["source-layer"]),
                        (v[f] = v[f] || {}),
                        (v[f][u.id] = c))));
              for (a = 0; a < t.length; a++)
                (u = t[a]),
                  u.source === this.source &&
                    u.ref &&
                    p[u.ref] &&
                    p[u.ref].layers.push(u.id);
              if (e.layers) for (f in v) (u = e.layers[f]), u && s(u, v[f]);
              else s(e, p);
              var b = [],
                y = (this.symbolBuckets = []),
                x = [],
                k = new CollisionTile(this.angle, this.pitch, d);
              for (var T in p)
                (c = p[T]),
                  0 !== c.features.length &&
                    (b.push(c), "symbol" === c.type ? y.push(c) : x.push(c));
              var z = {},
                B = {};
              if (y.length > 0) {
                for (a = y.length - 1; a >= 0; a--)
                  y[a].updateIcons(z), y[a].updateFont(B);
                for (var D in B) B[D] = Object.keys(B[D]).map(Number);
                z = Object.keys(z);
                var E = 0;
                r.send("get glyphs", { uid: this.uid, stacks: B }, function(
                  e,
                  t
                ) {
                  (B = t), i(e);
                }),
                  z.length
                    ? r.send("get icons", { icons: z }, function(e, t) {
                        (z = t), i(e);
                      })
                    : i();
              }
              for (a = x.length - 1; a >= 0; a--) n(this, x[a]);
              return 0 === y.length ? l() : void 0;
            }),
            (WorkerTile.prototype.redoPlacement = function(e, t, r) {
              if ("done" !== this.status)
                return (this.redoPlacementAfterDone = !0), (this.angle = e), {};
              for (
                var o = {},
                  s = new CollisionTile(e, t, this.extent),
                  i = this.symbolBuckets.length - 1;
                i >= 0;
                i--
              )
                this.symbolBuckets[i].placeFeatures(s, o, r);
              return {
                result: {
                  elementGroups: getElementGroups(this.symbolBuckets),
                  buffers: o
                },
                transferables: getTransferables(o)
              };
            });
        },
        {
          "../data/bucket": 1,
          "../data/feature_tree": 5,
          "../symbol/collision_tile": 61
        }
      ],
      40: [
        function(require, module, exports) {
          "use strict";
          function AnimationLoop() {
            (this.n = 0), (this.times = []);
          }
          (module.exports = AnimationLoop),
            (AnimationLoop.prototype.stopped = function() {
              return (
                (this.times = this.times.filter(function(t) {
                  return t.time >= new Date().getTime();
                })),
                !this.times.length
              );
            }),
            (AnimationLoop.prototype.set = function(t) {
              return (
                this.times.push({ id: this.n, time: t + new Date().getTime() }),
                this.n++
              );
            }),
            (AnimationLoop.prototype.cancel = function(t) {
              this.times = this.times.filter(function(i) {
                return i.id !== t;
              });
            });
        },
        {}
      ],
      41: [
        function(require, module, exports) {
          "use strict";
          function ImageSprite(t) {
            (this.base = t), (this.retina = browser.devicePixelRatio > 1);
            var i = this.retina ? "@2x" : "";
            ajax.getJSON(
              normalizeURL(t, i, ".json"),
              function(t, i) {
                return t
                  ? void this.fire("error", { error: t })
                  : ((this.data = i), void (this.img && this.fire("load")));
              }.bind(this)
            ),
              ajax.getImage(
                normalizeURL(t, i, ".png"),
                function(t, i) {
                  if (t) return void this.fire("error", { error: t });
                  for (
                    var e = i.getData(),
                      r = (i.data = new Uint8Array(e.length)),
                      a = 0;
                    a < e.length;
                    a += 4
                  ) {
                    var o = e[a + 3] / 255;
                    (r[a + 0] = e[a + 0] * o),
                      (r[a + 1] = e[a + 1] * o),
                      (r[a + 2] = e[a + 2] * o),
                      (r[a + 3] = e[a + 3]);
                  }
                  (this.img = i), this.data && this.fire("load");
                }.bind(this)
              );
          }
          function SpritePosition() {}
          var Evented = require("../util/evented"),
            ajax = require("../util/ajax"),
            browser = require("../util/browser"),
            normalizeURL = require("../util/mapbox").normalizeSpriteURL;
          (module.exports = ImageSprite),
            (ImageSprite.prototype = Object.create(Evented)),
            (ImageSprite.prototype.toJSON = function() {
              return this.base;
            }),
            (ImageSprite.prototype.loaded = function() {
              return !(!this.data || !this.img);
            }),
            (ImageSprite.prototype.resize = function() {
              if (browser.devicePixelRatio > 1 !== this.retina) {
                var t = new ImageSprite(this.base);
                t.on(
                  "load",
                  function() {
                    (this.img = t.img),
                      (this.data = t.data),
                      (this.retina = t.retina);
                  }.bind(this)
                );
              }
            }),
            (SpritePosition.prototype = {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              pixelRatio: 1,
              sdf: !1
            }),
            (ImageSprite.prototype.getSpritePosition = function(t) {
              if (!this.loaded()) return new SpritePosition();
              var i = this.data && this.data[t];
              return i && this.img ? i : new SpritePosition();
            });
        },
        {
          "../util/ajax": 86,
          "../util/browser": 87,
          "../util/evented": 92,
          "../util/mapbox": 95
        }
      ],
      42: [
        function(require, module, exports) {
          "use strict";
          function parseColor(r) {
            if (colorCache[r]) return colorCache[r];
            if (Array.isArray(r)) return r;
            if (r && r.stops)
              return util.extend({}, r, {
                stops: r.stops.map(parseFunctionStopColor)
              });
            if ("string" == typeof r) {
              var o = colorDowngrade(parseCSSColor(r));
              return (colorCache[r] = o), o;
            }
            throw new Error("Invalid color " + r);
          }
          function parseFunctionStopColor(r) {
            return [r[0], parseColor(r[1])];
          }
          function colorDowngrade(r) {
            return [r[0] / 255, r[1] / 255, r[2] / 255, r[3] / 1];
          }
          var parseCSSColor = require("csscolorparser").parseCSSColor,
            util = require("../util/util"),
            colorCache = {};
          module.exports = parseColor;
        },
        { "../util/util": 98, csscolorparser: 104 }
      ],
      43: [
        function(require, module, exports) {
          "use strict";
          module.exports = require("mapbox-gl-style-spec/reference/latest");
        },
        { "mapbox-gl-style-spec/reference/latest": 126 }
      ],
      44: [
        function(require, module, exports) {
          "use strict";
          function Style(e, t) {
            (this.animationLoop = t || new AnimationLoop()),
              (this.dispatcher = new Dispatcher(
                Math.max(browser.hardwareConcurrency - 1, 1),
                this
              )),
              (this.spriteAtlas = new SpriteAtlas(512, 512)),
              (this.lineAtlas = new LineAtlas(256, 512)),
              (this._layers = {}),
              (this._order = []),
              (this._groups = []),
              (this.sources = {}),
              (this.zoomHistory = {}),
              util.bindAll(
                ["_forwardSourceEvent", "_forwardTileEvent", "_redoPlacement"],
                this
              );
            var r = function(e, t) {
              if (e) return void this.fire("error", { error: e });
              var r = validate(t);
              if (r.length)
                for (var i = 0; i < r.length; i++)
                  this.fire("error", { error: new Error(r[i].message) });
              else {
                (this._loaded = !0), (this.stylesheet = t);
                var s = t.sources;
                for (var o in s) this.addSource(o, s[o]);
                t.sprite &&
                  ((this.sprite = new ImageSprite(t.sprite)),
                  this.sprite.on("load", this.fire.bind(this, "change"))),
                  (this.glyphSource = new GlyphSource(t.glyphs)),
                  this._resolve(),
                  this.fire("load");
              }
            }.bind(this);
            "string" == typeof e
              ? ajax.getJSON(normalizeURL(e), r)
              : browser.frame(r.bind(this, null, e)),
              this.on("source.load", function(e) {
                var t = e.source;
                if (t && t.vectorLayerIds)
                  for (var r in this._layers) {
                    var i = this._layers[r];
                    i.source === t.id && this._validateLayer(i);
                  }
              });
          }
          var Evented = require("../util/evented"),
            styleBatch = require("./style_batch"),
            StyleLayer = require("./style_layer"),
            ImageSprite = require("./image_sprite"),
            GlyphSource = require("../symbol/glyph_source"),
            SpriteAtlas = require("../symbol/sprite_atlas"),
            LineAtlas = require("../render/line_atlas"),
            util = require("../util/util"),
            ajax = require("../util/ajax"),
            normalizeURL = require("../util/mapbox").normalizeStyleURL,
            browser = require("../util/browser"),
            Dispatcher = require("../util/dispatcher"),
            AnimationLoop = require("./animation_loop"),
            validate = require("mapbox-gl-style-spec/lib/validate/latest");
          (module.exports = Style),
            (Style.prototype = util.inherit(Evented, {
              _loaded: !1,
              _validateLayer: function(e) {
                var t = this.sources[e.source];
                e.sourceLayer &&
                  t &&
                  t.vectorLayerIds &&
                  -1 === t.vectorLayerIds.indexOf(e.sourceLayer) &&
                  this.fire("error", {
                    error: new Error(
                      'Source layer "' +
                        e.sourceLayer +
                        '" does not exist on source "' +
                        t.id +
                        '" as specified by style layer "' +
                        e.id +
                        '"'
                    )
                  });
              },
              loaded: function() {
                if (!this._loaded) return !1;
                for (var e in this.sources)
                  if (!this.sources[e].loaded()) return !1;
                return this.sprite && !this.sprite.loaded() ? !1 : !0;
              },
              _resolve: function() {
                var e, t;
                (this._layers = {}),
                  (this._order = this.stylesheet.layers.map(function(e) {
                    return e.id;
                  }));
                for (var r = 0; r < this.stylesheet.layers.length; r++)
                  (t = this.stylesheet.layers[r]),
                    t.ref ||
                      ((e = StyleLayer.create(t)), (this._layers[e.id] = e));
                for (var i = 0; i < this.stylesheet.layers.length; i++)
                  if (((t = this.stylesheet.layers[i]), t.ref)) {
                    var s = this.getLayer(t.ref);
                    (e = StyleLayer.create(t, s)), (this._layers[e.id] = e);
                  }
                this._groupLayers(), this._broadcastLayers();
              },
              _groupLayers: function() {
                var e;
                this._groups = [];
                for (var t = 0; t < this._order.length; ++t) {
                  var r = this._layers[this._order[t]];
                  (e && r.source === e.source) ||
                    ((e = []), (e.source = r.source), this._groups.push(e)),
                    e.push(r);
                }
              },
              _broadcastLayers: function() {
                this.dispatcher.broadcast(
                  "set layers",
                  this._order.map(function(e) {
                    return this._layers[e].serialize();
                  }, this)
                );
              },
              _cascade: function(e, t) {
                if (this._loaded) {
                  t = t || { transition: !0 };
                  for (var r in this._layers)
                    this._layers[r].cascade(
                      e,
                      t,
                      this.stylesheet.transition || {},
                      this.animationLoop
                    );
                  this.fire("change");
                }
              },
              _recalculate: function(e) {
                for (var t in this.sources) this.sources[t].used = !1;
                this._updateZoomHistory(e), (this.rasterFadeDuration = 300);
                for (t in this._layers) {
                  var r = this._layers[t];
                  r.recalculate(e, this.zoomHistory),
                    !r.isHidden(e) &&
                      r.source &&
                      (this.sources[r.source].used = !0);
                }
                var i = 300;
                Math.floor(this.z) !== Math.floor(e) &&
                  this.animationLoop.set(i),
                  (this.z = e),
                  this.fire("zoom");
              },
              _updateZoomHistory: function(e) {
                var t = this.zoomHistory;
                void 0 === t.lastIntegerZoom &&
                  ((t.lastIntegerZoom = Math.floor(e)),
                  (t.lastIntegerZoomTime = 0),
                  (t.lastZoom = e)),
                  Math.floor(t.lastZoom) < Math.floor(e)
                    ? ((t.lastIntegerZoom = Math.floor(e)),
                      (t.lastIntegerZoomTime = Date.now()))
                    : Math.floor(t.lastZoom) > Math.floor(e) &&
                      ((t.lastIntegerZoom = Math.floor(e + 1)),
                      (t.lastIntegerZoomTime = Date.now())),
                  (t.lastZoom = e);
              },
              batch: function(e) {
                styleBatch(this, e);
              },
              addSource: function(e, t) {
                return (
                  this.batch(function(r) {
                    r.addSource(e, t);
                  }),
                  this
                );
              },
              removeSource: function(e) {
                return (
                  this.batch(function(t) {
                    t.removeSource(e);
                  }),
                  this
                );
              },
              getSource: function(e) {
                return this.sources[e];
              },
              addLayer: function(e, t) {
                return (
                  this.batch(function(r) {
                    r.addLayer(e, t);
                  }),
                  this
                );
              },
              removeLayer: function(e) {
                return (
                  this.batch(function(t) {
                    t.removeLayer(e);
                  }),
                  this
                );
              },
              getLayer: function(e) {
                return this._layers[e];
              },
              getReferentLayer: function(e) {
                var t = this.getLayer(e);
                return t.ref && (t = this.getLayer(t.ref)), t;
              },
              setFilter: function(e, t) {
                return (
                  this.batch(function(r) {
                    r.setFilter(e, t);
                  }),
                  this
                );
              },
              setLayerZoomRange: function(e, t, r) {
                return (
                  this.batch(function(i) {
                    i.setLayerZoomRange(e, t, r);
                  }),
                  this
                );
              },
              getFilter: function(e) {
                return this.getReferentLayer(e).filter;
              },
              getLayoutProperty: function(e, t) {
                return this.getReferentLayer(e).getLayoutProperty(t);
              },
              getPaintProperty: function(e, t, r) {
                return this.getLayer(e).getPaintProperty(t, r);
              },
              featuresAt: function(e, t, r) {
                this._queryFeatures("featuresAt", e, t, r);
              },
              featuresIn: function(e, t, r) {
                this._queryFeatures("featuresIn", e, t, r);
              },
              _queryFeatures: function(e, t, r, i) {
                var s = [],
                  o = null;
                r.layer &&
                  (r.layerIds = Array.isArray(r.layer) ? r.layer : [r.layer]),
                  util.asyncAll(
                    Object.keys(this.sources),
                    function(i, a) {
                      var n = this.sources[i];
                      n[e](t, r, function(e, t) {
                        t && (s = s.concat(t)), e && (o = e), a();
                      });
                    }.bind(this),
                    function() {
                      return o
                        ? i(o)
                        : void i(
                            null,
                            s
                              .filter(
                                function(e) {
                                  return void 0 !== this._layers[e.layer];
                                }.bind(this)
                              )
                              .map(
                                function(e) {
                                  return (
                                    (e.layer = this._layers[
                                      e.layer
                                    ].serialize()),
                                    e
                                  );
                                }.bind(this)
                              )
                          );
                    }.bind(this)
                  );
              },
              _remove: function() {
                this.dispatcher.remove();
              },
              _reloadSource: function(e) {
                this.sources[e].reload();
              },
              _updateSources: function(e) {
                for (var t in this.sources) this.sources[t].update(e);
              },
              _redoPlacement: function() {
                for (var e in this.sources)
                  this.sources[e].redoPlacement &&
                    this.sources[e].redoPlacement();
              },
              _forwardSourceEvent: function(e) {
                this.fire(
                  "source." + e.type,
                  util.extend({ source: e.target }, e)
                );
              },
              _forwardTileEvent: function(e) {
                this.fire(e.type, util.extend({ source: e.target }, e));
              },
              "get sprite json": function(e, t) {
                var r = this.sprite;
                r.loaded()
                  ? t(null, { sprite: r.data, retina: r.retina })
                  : r.on("load", function() {
                      t(null, { sprite: r.data, retina: r.retina });
                    });
              },
              "get icons": function(e, t) {
                var r = this.sprite,
                  i = this.spriteAtlas;
                r.loaded()
                  ? (i.setSprite(r), i.addIcons(e.icons, t))
                  : r.on("load", function() {
                      i.setSprite(r), i.addIcons(e.icons, t);
                    });
              },
              "get glyphs": function(e, t) {
                function r(e, r, i) {
                  e && console.error(e), (o[i] = r), s--, 0 === s && t(null, o);
                }
                var i = e.stacks,
                  s = Object.keys(i).length,
                  o = {};
                for (var a in i)
                  this.glyphSource.getSimpleGlyphs(a, i[a], e.uid, r);
              }
            }));
        },
        {
          "../render/line_atlas": 25,
          "../symbol/glyph_source": 64,
          "../symbol/sprite_atlas": 69,
          "../util/ajax": 86,
          "../util/browser": 87,
          "../util/dispatcher": 89,
          "../util/evented": 92,
          "../util/mapbox": 95,
          "../util/util": 98,
          "./animation_loop": 40,
          "./image_sprite": 41,
          "./style_batch": 45,
          "./style_layer": 47,
          "mapbox-gl-style-spec/lib/validate/latest": 124
        }
      ],
      45: [
        function(require, module, exports) {
          "use strict";
          function styleBatch(e, t) {
            if (!e._loaded) throw new Error("Style is not done loading");
            var r = Object.create(styleBatch.prototype);
            (r._style = e),
              (r._groupLayers = !1),
              (r._broadcastLayers = !1),
              (r._reloadSources = {}),
              (r._events = []),
              (r._change = !1),
              t(r),
              r._groupLayers && r._style._groupLayers(),
              r._broadcastLayers && r._style._broadcastLayers(),
              Object.keys(r._reloadSources).forEach(function(e) {
                r._style._reloadSource(e);
              }),
              r._events.forEach(function(e) {
                r._style.fire.apply(r._style, e);
              }),
              r._change && r._style.fire("change");
          }
          var Source = require("../source/source"),
            StyleLayer = require("./style_layer");
          (styleBatch.prototype = {
            addLayer: function(e, t) {
              if (void 0 !== this._style._layers[e.id])
                throw new Error("There is already a layer with this ID");
              if (!(e instanceof StyleLayer)) {
                var r = e.ref && this._style.getLayer(e.ref);
                e = StyleLayer.create(e, r);
              }
              return (
                this._style._validateLayer(e),
                (this._style._layers[e.id] = e),
                this._style._order.splice(
                  t ? this._style._order.indexOf(t) : 1 / 0,
                  0,
                  e.id
                ),
                (this._groupLayers = !0),
                (this._broadcastLayers = !0),
                e.source && (this._reloadSources[e.source] = !0),
                this._events.push(["layer.add", { layer: e }]),
                (this._change = !0),
                this
              );
            },
            removeLayer: function(e) {
              var t = this._style._layers[e];
              if (void 0 === t)
                throw new Error("There is no layer with this ID");
              for (var r in this._style._layers)
                this._style._layers[r].ref === e && this.removeLayer(r);
              return (
                delete this._style._layers[e],
                this._style._order.splice(this._style._order.indexOf(e), 1),
                (this._groupLayers = !0),
                (this._broadcastLayers = !0),
                this._events.push(["layer.remove", { layer: t }]),
                (this._change = !0),
                this
              );
            },
            setPaintProperty: function(e, t, r, s) {
              return (
                this._style.getLayer(e).setPaintProperty(t, r, s),
                (this._change = !0),
                this
              );
            },
            setLayoutProperty: function(e, t, r) {
              return (
                (e = this._style.getReferentLayer(e)),
                e.setLayoutProperty(t, r),
                (this._broadcastLayers = !0),
                e.source && (this._reloadSources[e.source] = !0),
                (this._change = !0),
                this
              );
            },
            setFilter: function(e, t) {
              return (
                (e = this._style.getReferentLayer(e)),
                (e.filter = t),
                (this._broadcastLayers = !0),
                e.source && (this._reloadSources[e.source] = !0),
                (this._change = !0),
                this
              );
            },
            setLayerZoomRange: function(e, t, r) {
              var s = this._style.getReferentLayer(e);
              return (
                null != t && (s.minzoom = t),
                null != r && (s.maxzoom = r),
                (this._broadcastLayers = !0),
                s.source && (this._reloadSources[s.source] = !0),
                (this._change = !0),
                this
              );
            },
            addSource: function(e, t) {
              if (!this._style._loaded)
                throw new Error("Style is not done loading");
              if (void 0 !== this._style.sources[e])
                throw new Error("There is already a source with this ID");
              return (
                (t = Source.create(t)),
                (this._style.sources[e] = t),
                (t.id = e),
                (t.style = this._style),
                (t.dispatcher = this._style.dispatcher),
                t
                  .on("load", this._style._forwardSourceEvent)
                  .on("error", this._style._forwardSourceEvent)
                  .on("change", this._style._forwardSourceEvent)
                  .on("tile.add", this._style._forwardTileEvent)
                  .on("tile.load", this._style._forwardTileEvent)
                  .on("tile.error", this._style._forwardTileEvent)
                  .on("tile.remove", this._style._forwardTileEvent)
                  .on("tile.stats", this._style._forwardTileEvent),
                this._events.push(["source.add", { source: t }]),
                (this._change = !0),
                this
              );
            },
            removeSource: function(e) {
              if (void 0 === this._style.sources[e])
                throw new Error("There is no source with this ID");
              var t = this._style.sources[e];
              return (
                delete this._style.sources[e],
                t
                  .off("load", this._style._forwardSourceEvent)
                  .off("error", this._style._forwardSourceEvent)
                  .off("change", this._style._forwardSourceEvent)
                  .off("tile.add", this._style._forwardTileEvent)
                  .off("tile.load", this._style._forwardTileEvent)
                  .off("tile.error", this._style._forwardTileEvent)
                  .off("tile.remove", this._style._forwardTileEvent)
                  .off("tile.stats", this._style._forwardTileEvent),
                this._events.push(["source.remove", { source: t }]),
                (this._change = !0),
                this
              );
            }
          }),
            (module.exports = styleBatch);
        },
        { "../source/source": 32, "./style_layer": 47 }
      ],
      46: [
        function(require, module, exports) {
          "use strict";
          function StyleDeclaration(t, e) {
            (this.type = t.type),
              (this.transitionable = t.transition),
              null == e && (e = t["default"]),
              (this.json = JSON.stringify(e)),
              "color" === this.type
                ? (this.value = parseColor(e))
                : (this.value = e),
              "interpolated" === t["function"]
                ? (this.calculate = MapboxGLFunction.interpolated(this.value))
                : ((this.calculate = MapboxGLFunction["piecewise-constant"](
                    this.value
                  )),
                  t.transition &&
                    (this.calculate = transitioned(this.calculate)));
          }
          function transitioned(t) {
            return function(e, i, o) {
              var a,
                n,
                r,
                l = e % 1,
                s = Math.min((Date.now() - i.lastIntegerZoomTime) / o, 1),
                c = 1,
                u = 1;
              return (
                e > i.lastIntegerZoom
                  ? ((a = l + (1 - l) * s),
                    (c *= 2),
                    (n = t(e - 1)),
                    (r = t(e)))
                  : ((a = 1 - (1 - s) * l),
                    (r = t(e)),
                    (n = t(e + 1)),
                    (c /= 2)),
                { from: n, fromScale: c, to: r, toScale: u, t: a }
              );
            };
          }
          var MapboxGLFunction = require("mapbox-gl-function"),
            parseColor = require("./parse_color");
          module.exports = StyleDeclaration;
        },
        { "./parse_color": 42, "mapbox-gl-function": 123 }
      ],
      47: [
        function(require, module, exports) {
          "use strict";
          function StyleLayer(t, i) {
            (this.id = t.id),
              (this.ref = t.ref),
              (this.metadata = t.metadata),
              (this.type = (i || t).type),
              (this.source = (i || t).source),
              (this.sourceLayer = (i || t)["source-layer"]),
              (this.minzoom = (i || t).minzoom),
              (this.maxzoom = (i || t).maxzoom),
              (this.filter = (i || t).filter),
              (this.interactive = (i || t).interactive),
              (this._paintSpecifications =
                StyleSpecification["paint_" + this.type]),
              (this._layoutSpecifications =
                StyleSpecification["layout_" + this.type]),
              (this._paintTransitions = {}),
              (this._paintTransitionOptions = {}),
              (this._paintDeclarations = {}),
              (this._layoutDeclarations = {});
            for (var a in t) {
              var e = a.match(/^paint(?:\.(.*))?$/);
              if (e) {
                var n = e[1] || "";
                for (var r in t[a]) this.setPaintProperty(r, t[a][r], n);
              }
            }
            if (this.ref) this._layoutDeclarations = i._layoutDeclarations;
            else for (r in t.layout) this.setLayoutProperty(r, t.layout[r]);
          }
          function getDeclarationValue(t) {
            return t.value;
          }
          var util = require("../util/util"),
            StyleTransition = require("./style_transition"),
            StyleDeclaration = require("./style_declaration"),
            StyleSpecification = require("./reference"),
            parseColor = require("./parse_color");
          module.exports = StyleLayer;
          var TRANSITION_SUFFIX = "-transition";
          (StyleLayer.create = function(t, i) {
            var a = {
              background: require("./style_layer/background_style_layer"),
              circle: require("./style_layer/circle_style_layer"),
              fill: require("./style_layer/fill_style_layer"),
              line: require("./style_layer/line_style_layer"),
              raster: require("./style_layer/raster_style_layer"),
              symbol: require("./style_layer/symbol_style_layer")
            };
            return new a[(i || t).type](t, i);
          }),
            (StyleLayer.prototype = {
              setLayoutProperty: function(t, i) {
                null == i
                  ? delete this._layoutDeclarations[t]
                  : (this._layoutDeclarations[t] = new StyleDeclaration(
                      this._layoutSpecifications[t],
                      i
                    ));
              },
              getLayoutProperty: function(t) {
                return (
                  this._layoutDeclarations[t] &&
                  this._layoutDeclarations[t].value
                );
              },
              getLayoutValue: function(t, i, a) {
                var e = this._layoutSpecifications[t],
                  n = this._layoutDeclarations[t];
                return n ? n.calculate(i, a) : e["default"];
              },
              setPaintProperty: function(t, i, a) {
                util.endsWith(t, TRANSITION_SUFFIX)
                  ? (this._paintTransitionOptions[a || ""] ||
                      (this._paintTransitionOptions[a || ""] = {}),
                    null == i
                      ? delete this._paintTransitionOptions[a || ""][t]
                      : (this._paintTransitionOptions[a || ""][t] = i))
                  : (this._paintDeclarations[a || ""] ||
                      (this._paintDeclarations[a || ""] = {}),
                    null == i
                      ? delete this._paintDeclarations[a || ""][t]
                      : (this._paintDeclarations[a || ""][
                          t
                        ] = new StyleDeclaration(
                          this._paintSpecifications[t],
                          i
                        )));
              },
              getPaintProperty: function(t, i) {
                return (
                  (i = i || ""),
                  util.endsWith(t, TRANSITION_SUFFIX)
                    ? this._paintTransitionOptions[i] &&
                      this._paintTransitionOptions[i][t]
                    : this._paintDeclarations[i] &&
                      this._paintDeclarations[i][t] &&
                      this._paintDeclarations[i][t].value
                );
              },
              getPaintValue: function(t, i, a) {
                var e = this._paintSpecifications[t],
                  n = this._paintTransitions[t];
                return n
                  ? n.at(i, a)
                  : "color" === e.type && e["default"]
                  ? parseColor(e["default"])
                  : e["default"];
              },
              isHidden: function(t) {
                if (this.minzoom && t < this.minzoom) return !0;
                if (this.maxzoom && t >= this.maxzoom) return !0;
                if ("none" === this.getLayoutValue("visibility")) return !0;
                var i = this.type + "-opacity";
                return this._paintSpecifications[i] &&
                  0 === this.getPaintValue(i)
                  ? !0
                  : !1;
              },
              cascade: function(t, i, a, e) {
                for (var n in this._paintDeclarations)
                  if ("" === n || t[n])
                    for (var r in this._paintDeclarations[n]) {
                      var s = this._paintDeclarations[n][r],
                        o = i.transition ? this._paintTransitions[r] : void 0;
                      if (!o || o.declaration.json !== s.json) {
                        var l = (this._paintTransitions[
                          r
                        ] = new StyleTransition(
                          s,
                          o,
                          util.extend(
                            { duration: 300, delay: 0 },
                            a,
                            this.getPaintProperty(r + TRANSITION_SUFFIX)
                          )
                        ));
                        l.instant() ||
                          (l.loopID = e.set(l.endTime - new Date().getTime())),
                          o && e.cancel(o.loopID);
                      }
                    }
              },
              recalculate: function(t, i) {
                this.paint = {};
                for (var a in this._paintSpecifications)
                  this.paint[a] = this.getPaintValue(a, t, i);
                this.layout = {};
                for (a in this._layoutSpecifications)
                  this.layout[a] = this.getLayoutValue(a, t, i);
              },
              serialize: function() {
                var t = {
                  id: this.id,
                  ref: this.ref,
                  metadata: this.metadata,
                  type: this.type,
                  source: this.source,
                  "source-layer": this.sourceLayer,
                  minzoom: this.minzoom,
                  maxzoom: this.maxzoom,
                  filter: this.filter,
                  interactive: this.interactive,
                  layout: util.mapObject(
                    this._layoutDeclarations,
                    getDeclarationValue
                  )
                };
                for (var i in this._paintDeclarations) {
                  var a = "" === i ? "paint" : "paint." + a;
                  t[a] = util.mapObject(
                    this._paintDeclarations[i],
                    getDeclarationValue
                  );
                }
                return t;
              }
            });
        },
        {
          "../util/util": 98,
          "./parse_color": 42,
          "./reference": 43,
          "./style_declaration": 46,
          "./style_layer/background_style_layer": 48,
          "./style_layer/circle_style_layer": 49,
          "./style_layer/fill_style_layer": 50,
          "./style_layer/line_style_layer": 51,
          "./style_layer/raster_style_layer": 52,
          "./style_layer/symbol_style_layer": 53,
          "./style_transition": 54
        }
      ],
      48: [
        function(require, module, exports) {
          "use strict";
          function BackgroundStyleLayer() {
            StyleLayer.apply(this, arguments);
          }
          var util = require("../../util/util"),
            StyleLayer = require("../style_layer");
          (module.exports = BackgroundStyleLayer),
            (BackgroundStyleLayer.prototype = util.inherit(StyleLayer, {}));
        },
        { "../../util/util": 98, "../style_layer": 47 }
      ],
      49: [
        function(require, module, exports) {
          "use strict";
          function CircleStyleLayer() {
            StyleLayer.apply(this, arguments);
          }
          var util = require("../../util/util"),
            StyleLayer = require("../style_layer");
          (module.exports = CircleStyleLayer),
            (CircleStyleLayer.prototype = util.inherit(StyleLayer, {}));
        },
        { "../../util/util": 98, "../style_layer": 47 }
      ],
      50: [
        function(require, module, exports) {
          "use strict";
          function FillStyleLayer() {
            StyleLayer.apply(this, arguments);
          }
          var util = require("../../util/util"),
            StyleLayer = require("../style_layer");
          (module.exports = FillStyleLayer),
            (FillStyleLayer.prototype = util.inherit(StyleLayer, {}));
        },
        { "../../util/util": 98, "../style_layer": 47 }
      ],
      51: [
        function(require, module, exports) {
          "use strict";
          function LineStyleLayer() {
            StyleLayer.apply(this, arguments);
          }
          var util = require("../../util/util"),
            StyleLayer = require("../style_layer");
          (module.exports = LineStyleLayer),
            (LineStyleLayer.prototype = util.inherit(StyleLayer, {
              getPaintValue: function(e, t) {
                var r = StyleLayer.prototype.getPaintValue.apply(
                  this,
                  arguments
                );
                if (r && "line-dasharray" === e) {
                  var a = this.getPaintValue(
                    "line-width",
                    Math.floor(t),
                    1 / 0
                  );
                  (r.fromScale *= a), (r.toScale *= a);
                }
                return r;
              }
            }));
        },
        { "../../util/util": 98, "../style_layer": 47 }
      ],
      52: [
        function(require, module, exports) {
          "use strict";
          function RasterStyleLayer() {
            StyleLayer.apply(this, arguments);
          }
          var util = require("../../util/util"),
            StyleLayer = require("../style_layer");
          (module.exports = RasterStyleLayer),
            (RasterStyleLayer.prototype = util.inherit(StyleLayer, {}));
        },
        { "../../util/util": 98, "../style_layer": 47 }
      ],
      53: [
        function(require, module, exports) {
          "use strict";
          function SymbolStyleLayer() {
            StyleLayer.apply(this, arguments);
          }
          var util = require("../../util/util"),
            StyleLayer = require("../style_layer");
          (module.exports = SymbolStyleLayer),
            (SymbolStyleLayer.prototype = util.inherit(StyleLayer, {
              isHidden: function() {
                if (StyleLayer.prototype.isHidden.apply(this, arguments))
                  return !0;
                var t =
                    0 === this.paint["text-opacity"] ||
                    !this.layout["text-field"],
                  e =
                    0 === this.paint["icon-opacity"] ||
                    !this.layout["icon-image"];
                return t && e ? !0 : !1;
              },
              getLayoutValue: function(t, e, i) {
                return ("text-rotation-alignment" !== t ||
                  "line" !== this.getLayoutValue("symbol-placement", e, i) ||
                  this.getLayoutProperty("text-rotation-alignment")) &&
                  ("icon-rotation-alignment" !== t ||
                    "line" !== this.getLayoutValue("symbol-placement", e, i) ||
                    this.getLayoutProperty("icon-rotation-alignment"))
                  ? StyleLayer.prototype.getLayoutValue.apply(this, arguments)
                  : "map";
              }
            }));
        },
        { "../../util/util": 98, "../style_layer": 47 }
      ],
      54: [
        function(require, module, exports) {
          "use strict";
          function StyleTransition(t, i, e) {
            (this.declaration = t),
              (this.startTime = this.endTime = new Date().getTime());
            var n = t.type;
            ("string" !== n && "array" !== n) || !t.transitionable
              ? (this.interp = interpolate[n])
              : (this.interp = interpZoomTransitioned),
              (this.oldTransition = i),
              (this.duration = e.duration || 0),
              (this.delay = e.delay || 0),
              this.instant() ||
                ((this.endTime = this.startTime + this.duration + this.delay),
                (this.ease = util.easeCubicInOut)),
              i && i.endTime <= this.startTime && delete i.oldTransition;
          }
          function interpZoomTransitioned(t, i, e) {
            return {
              from: t.to,
              fromScale: t.toScale,
              to: i.to,
              toScale: i.toScale,
              t: e
            };
          }
          var util = require("../util/util"),
            interpolate = require("../util/interpolate");
          (module.exports = StyleTransition),
            (StyleTransition.prototype.instant = function() {
              return (
                !this.oldTransition ||
                !this.interp ||
                (0 === this.duration && 0 === this.delay)
              );
            }),
            (StyleTransition.prototype.at = function(t, i, e) {
              var n = this.declaration.calculate(t, i, this.duration);
              if (this.instant()) return n;
              if (((e = e || Date.now()), e < this.endTime)) {
                var r = this.oldTransition.at(t, i, this.startTime),
                  a = this.ease(
                    (e - this.startTime - this.delay) / this.duration
                  );
                n = this.interp(r, n, a);
              }
              return n;
            });
        },
        { "../util/interpolate": 94, "../util/util": 98 }
      ],
      55: [
        function(require, module, exports) {
          "use strict";
          function Anchor(t, e, o, n) {
            (this.x = t),
              (this.y = e),
              (this.angle = o),
              void 0 !== n && (this.segment = n);
          }
          var Point = require("point-geometry");
          (module.exports = Anchor),
            (Anchor.prototype = Object.create(Point.prototype)),
            (Anchor.prototype.clone = function() {
              return new Anchor(this.x, this.y, this.angle, this.segment);
            });
        },
        { "point-geometry": 133 }
      ],
      56: [
        function(require, module, exports) {
          "use strict";
          function BinPack(t, h) {
            (this.width = t),
              (this.height = h),
              (this.shelves = []),
              (this.stats = {}),
              (this.count = function(t) {
                this.stats[t] = (0 | this.stats[t]) + 1;
              });
          }
          function Shelf(t, h, i) {
            (this.y = t),
              (this.x = 0),
              (this.width = this.free = h),
              (this.height = i);
          }
          (module.exports = BinPack),
            (BinPack.prototype.allocate = function(t, h) {
              for (
                var i, e, s = 0, r = { shelf: -1, waste: 1 / 0 }, n = 0;
                n < this.shelves.length;
                n++
              ) {
                if (
                  ((i = this.shelves[n]),
                  (s += i.height),
                  h === i.height && t <= i.free)
                )
                  return this.count(h), i.alloc(t, h);
                h > i.height ||
                  t > i.free ||
                  (h < i.height &&
                    t <= i.free &&
                    ((e = i.height - h),
                    e < r.waste && ((r.waste = e), (r.shelf = n))));
              }
              return -1 !== r.shelf
                ? ((i = this.shelves[r.shelf]), this.count(h), i.alloc(t, h))
                : h <= this.height - s && t <= this.width
                ? ((i = new Shelf(s, this.width, h)),
                  this.shelves.push(i),
                  this.count(h),
                  i.alloc(t, h))
                : { x: -1, y: -1 };
            }),
            (BinPack.prototype.resize = function(t, h) {
              if (t < this.width || h < this.height) return !1;
              (this.height = h), (this.width = t);
              for (var i = 0; i < this.shelves.length; i++)
                this.shelves[i].resize(t);
              return !0;
            }),
            (Shelf.prototype = {
              alloc: function(t, h) {
                if (t > this.free || h > this.height) return { x: -1, y: -1 };
                var i = this.x;
                return (
                  (this.x += t),
                  (this.free -= t),
                  { x: i, y: this.y, w: t, h: h }
                );
              },
              resize: function(t) {
                return t < this.width
                  ? !1
                  : ((this.free += t - this.width), (this.width = t), !0);
              }
            });
        },
        {}
      ],
      57: [
        function(require, module, exports) {
          "use strict";
          function checkMaxAngle(e, t, a, r, n) {
            if (void 0 === t.segment) return !0;
            for (var i = t, s = t.segment + 1, f = 0; f > -a / 2; ) {
              if ((s--, 0 > s)) return !1;
              (f -= e[s].dist(i)), (i = e[s]);
            }
            (f += e[s].dist(e[s + 1])), s++;
            for (var l = [], o = 0; a / 2 > f; ) {
              var u = e[s - 1],
                c = e[s],
                g = e[s + 1];
              if (!g) return !1;
              var h = u.angleTo(c) - c.angleTo(g);
              for (
                h = Math.abs(((h + 3 * Math.PI) % (2 * Math.PI)) - Math.PI),
                  l.push({ distance: f, angleDelta: h }),
                  o += h;
                f - l[0].distance > r;

              )
                o -= l.shift().angleDelta;
              if (o > n) return !1;
              s++, (f += c.dist(g));
            }
            return !0;
          }
          module.exports = checkMaxAngle;
        },
        {}
      ],
      58: [
        function(require, module, exports) {
          "use strict";
          function clipLine(x, y, n, e, t) {
            for (var i = [], o = 0; o < x.length; o++)
              for (var r, P = x[o], u = 0; u < P.length - 1; u++) {
                var w = P[u],
                  l = P[u + 1];
                (w.x < y && l.x < y) ||
                  (w.x < y
                    ? (w = new Point(
                        y,
                        w.y + (l.y - w.y) * ((y - w.x) / (l.x - w.x))
                      ))
                    : l.x < y &&
                      (l = new Point(
                        y,
                        w.y + (l.y - w.y) * ((y - w.x) / (l.x - w.x))
                      )),
                  (w.y < n && l.y < n) ||
                    (w.y < n
                      ? (w = new Point(
                          w.x + (l.x - w.x) * ((n - w.y) / (l.y - w.y)),
                          n
                        ))
                      : l.y < n &&
                        (l = new Point(
                          w.x + (l.x - w.x) * ((n - w.y) / (l.y - w.y)),
                          n
                        )),
                    (w.x >= e && l.x >= e) ||
                      (w.x >= e
                        ? (w = new Point(
                            e,
                            w.y + (l.y - w.y) * ((e - w.x) / (l.x - w.x))
                          ))
                        : l.x >= e &&
                          (l = new Point(
                            e,
                            w.y + (l.y - w.y) * ((e - w.x) / (l.x - w.x))
                          )),
                      (w.y >= t && l.y >= t) ||
                        (w.y >= t
                          ? (w = new Point(
                              w.x + (l.x - w.x) * ((t - w.y) / (l.y - w.y)),
                              t
                            ))
                          : l.y >= t &&
                            (l = new Point(
                              w.x + (l.x - w.x) * ((t - w.y) / (l.y - w.y)),
                              t
                            )),
                        (r && w.equals(r[r.length - 1])) ||
                          ((r = [w]), i.push(r)),
                        r.push(l)))));
              }
            return i;
          }
          var Point = require("point-geometry");
          module.exports = clipLine;
        },
        { "point-geometry": 133 }
      ],
      59: [
        function(require, module, exports) {
          "use strict";
          function CollisionBox(i, t, s, h, o, l) {
            (this.anchorPoint = i),
              (this.x1 = t),
              (this.y1 = s),
              (this.x2 = h),
              (this.y2 = o),
              (this.maxScale = l),
              (this.placementScale = 0),
              (this[0] = this[1] = this[2] = this[3] = 0);
          }
          module.exports = CollisionBox;
        },
        {}
      ],
      60: [
        function(require, module, exports) {
          "use strict";
          function CollisionFeature(i, o, e, t, s, n, r) {
            var l = e.top * t - s,
              a = e.bottom * t + s,
              u = e.left * t - s,
              d = e.right * t + s;
            if (((this.boxes = []), n)) {
              var h = a - l,
                x = d - u;
              if (0 >= h) return;
              if (((h = Math.max(10 * t, h)), r)) {
                var f = i[o.segment + 1]
                    .sub(i[o.segment])
                    ._unit()
                    ._mult(x),
                  m = [o.sub(f), o.add(f)];
                this._addLineCollisionBoxes(m, o, 0, x, h);
              } else this._addLineCollisionBoxes(i, o, o.segment, x, h);
            } else
              this.boxes.push(
                new CollisionBox(new Point(o.x, o.y), u, l, d, a, 1 / 0)
              );
          }
          var CollisionBox = require("./collision_box"),
            Point = require("point-geometry");
          (module.exports = CollisionFeature),
            (CollisionFeature.prototype._addLineCollisionBoxes = function(
              i,
              o,
              e,
              t,
              s
            ) {
              var n = s / 2,
                r = Math.floor(t / n),
                l = -s / 2,
                a = this.boxes,
                u = o,
                d = e + 1,
                h = l;
              do {
                if ((d--, 0 > d)) return a;
                (h -= i[d].dist(u)), (u = i[d]);
              } while (h > -t / 2);
              for (var x = i[d].dist(i[d + 1]), f = 0; r > f; f++) {
                for (var m = -t / 2 + f * n; m > h + x; ) {
                  if (((h += x), d++, d + 1 >= i.length)) return a;
                  x = i[d].dist(i[d + 1]);
                }
                var b = m - h,
                  C = i[d],
                  _ = i[d + 1],
                  v = _.sub(C)
                    ._unit()
                    ._mult(b)
                    ._add(C),
                  p = Math.max(Math.abs(m - l) - n / 2, 0),
                  g = t / 2 / p;
                a.push(new CollisionBox(v, -s / 2, -s / 2, s / 2, s / 2, g));
              }
              return a;
            });
        },
        { "./collision_box": 59, "point-geometry": 133 }
      ],
      61: [
        function(require, module, exports) {
          "use strict";
          function CollisionTile(t, e, i) {
            (this.tree = rbush()), (this.angle = t);
            var o = Math.sin(t),
              a = Math.cos(t);
            (this.rotationMatrix = [a, -o, o, a]),
              (this.reverseRotationMatrix = [a, o, -o, a]),
              (this.yStretch = 1 / Math.cos((e / 180) * Math.PI)),
              (this.yStretch = Math.pow(this.yStretch, 1.3)),
              (this.edges = [
                new CollisionBox(new Point(0, 0), 0, -(1 / 0), 0, 1 / 0, 1 / 0),
                new CollisionBox(new Point(i, 0), 0, -(1 / 0), 0, 1 / 0, 1 / 0),
                new CollisionBox(new Point(0, 0), -(1 / 0), 0, 1 / 0, 0, 1 / 0),
                new CollisionBox(new Point(0, i), -(1 / 0), 0, 1 / 0, 0, 1 / 0)
              ]);
          }
          var rbush = require("rbush"),
            CollisionBox = require("./collision_box"),
            Point = require("point-geometry");
          (module.exports = CollisionTile),
            (CollisionTile.prototype.minScale = 0.25),
            (CollisionTile.prototype.maxScale = 2),
            (CollisionTile.prototype.placeCollisionFeature = function(t, e, i) {
              for (
                var o = this.minScale,
                  a = this.rotationMatrix,
                  n = this.yStretch,
                  l = 0;
                l < t.boxes.length;
                l++
              ) {
                var r = t.boxes[l];
                if (!e) {
                  var s = r.anchorPoint.matMult(a),
                    x = s.x,
                    h = s.y;
                  (r[0] = x + r.x1),
                    (r[1] = h + r.y1 * n),
                    (r[2] = x + r.x2),
                    (r[3] = h + r.y2 * n);
                  for (var c = this.tree.search(r), m = 0; m < c.length; m++) {
                    var y = c[m],
                      u = y.anchorPoint.matMult(a);
                    if (
                      ((o = this.getPlacementScale(o, s, r, u, y)),
                      o >= this.maxScale)
                    )
                      return o;
                  }
                }
                if (i)
                  for (
                    var M = this.reverseRotationMatrix,
                      S = new Point(r.x1, r.y1).matMult(M),
                      P = new Point(r.x2, r.y1).matMult(M),
                      p = new Point(r.x1, r.y2).matMult(M),
                      C = new Point(r.x2, r.y2).matMult(M),
                      v = new CollisionBox(
                        r.anchorPoint,
                        Math.min(S.x, P.x, p.x, C.x),
                        Math.min(S.y, P.x, p.x, C.x),
                        Math.max(S.x, P.x, p.x, C.x),
                        Math.max(S.y, P.x, p.x, C.x),
                        r.maxScale
                      ),
                      w = 0;
                    w < this.edges.length;
                    w++
                  ) {
                    var f = this.edges[w];
                    if (
                      ((o = this.getPlacementScale(
                        o,
                        r.anchorPoint,
                        v,
                        f.anchorPoint,
                        f
                      )),
                      o >= this.maxScale)
                    )
                      return o;
                  }
              }
              return o;
            }),
            (CollisionTile.prototype.getPlacementScale = function(
              t,
              e,
              i,
              o,
              a
            ) {
              var n = (a.x1 - i.x2) / (e.x - o.x),
                l = (a.x2 - i.x1) / (e.x - o.x),
                r = ((a.y1 - i.y2) * this.yStretch) / (e.y - o.y),
                s = ((a.y2 - i.y1) * this.yStretch) / (e.y - o.y);
              (isNaN(n) || isNaN(l)) && (n = l = 1),
                (isNaN(r) || isNaN(s)) && (r = s = 1);
              var x = Math.min(Math.max(n, l), Math.max(r, s));
              return (
                x > a.maxScale && (x = a.maxScale),
                x > i.maxScale && (x = i.maxScale),
                x > t && x >= a.placementScale && (t = x),
                t
              );
            }),
            (CollisionTile.prototype.insertCollisionFeature = function(t, e) {
              for (var i = t.boxes, o = 0; o < i.length; o++)
                i[o].placementScale = e;
              e < this.maxScale && this.tree.load(i);
            });
        },
        { "./collision_box": 59, "point-geometry": 133, rbush: 134 }
      ],
      62: [
        function(require, module, exports) {
          "use strict";
          function getAnchors(e, r, t, a, n, o, l, h, i) {
            var c = a ? 0.6 * o * l : 0,
              u = Math.max(a ? a.right - a.left : 0, n ? n.right - n.left : 0);
            if (0 === e[0].x || e[0].x === i || 0 === e[0].y || e[0].y === i)
              var s = !0;
            r / 4 > r - u * l && (r = u * l + r / 4);
            var g = 2 * o,
              p = s ? ((r / 2) * h) % r : ((u / 2 + g) * l * h) % r;
            return resample(e, p, r, c, t, u * l, s, !1, i);
          }
          function resample(e, r, t, a, n, o, l, h, i) {
            for (var c = 0, u = r - t, s = [], g = 0; g < e.length - 1; g++) {
              for (
                var p = e[g], x = e[g + 1], f = p.dist(x), v = x.angleTo(p);
                c + f > u + t;

              ) {
                u += t;
                var m = (u - c) / f,
                  A = interpolate(p.x, x.x, m),
                  y = interpolate(p.y, x.y, m);
                if (A >= 0 && i > A && y >= 0 && i > y) {
                  (A = Math.round(A)), (y = Math.round(y));
                  var M = new Anchor(A, y, v, g);
                  (!a || checkMaxAngle(e, M, o, a, n)) && s.push(M);
                }
              }
              c += f;
            }
            return (
              h ||
                s.length ||
                l ||
                (s = resample(e, c / 2, t, a, n, o, l, !0, i)),
              s
            );
          }
          var interpolate = require("../util/interpolate"),
            Anchor = require("../symbol/anchor"),
            checkMaxAngle = require("./check_max_angle");
          module.exports = getAnchors;
        },
        {
          "../symbol/anchor": 55,
          "../util/interpolate": 94,
          "./check_max_angle": 57
        }
      ],
      63: [
        function(require, module, exports) {
          "use strict";
          function GlyphAtlas(t, i) {
            (this.width = t),
              (this.height = i),
              (this.bin = new BinPack(t, i)),
              (this.index = {}),
              (this.ids = {}),
              (this.data = new Uint8Array(t * i));
          }
          var BinPack = require("./bin_pack");
          (module.exports = GlyphAtlas),
            (GlyphAtlas.prototype = {
              get debug() {
                return "canvas" in this;
              },
              set debug(t) {
                t && !this.canvas
                  ? ((this.canvas = document.createElement("canvas")),
                    (this.canvas.width = this.width),
                    (this.canvas.height = this.height),
                    document.body.appendChild(this.canvas),
                    (this.ctx = this.canvas.getContext("2d")))
                  : !t &&
                    this.canvas &&
                    (this.canvas.parentNode.removeChild(this.canvas),
                    delete this.ctx,
                    delete this.canvas);
              }
            }),
            (GlyphAtlas.prototype.getGlyphs = function() {
              var t,
                i,
                e,
                h = {};
              for (var s in this.ids)
                (t = s.split("#")),
                  (i = t[0]),
                  (e = t[1]),
                  h[i] || (h[i] = []),
                  h[i].push(e);
              return h;
            }),
            (GlyphAtlas.prototype.getRects = function() {
              var t,
                i,
                e,
                h = {};
              for (var s in this.ids)
                (t = s.split("#")),
                  (i = t[0]),
                  (e = t[1]),
                  h[i] || (h[i] = {}),
                  (h[i][e] = this.index[s]);
              return h;
            }),
            (GlyphAtlas.prototype.addGlyph = function(t, i, e, h) {
              if (!e) return null;
              var s = i + "#" + e.id;
              if (this.index[s])
                return (
                  this.ids[s].indexOf(t) < 0 && this.ids[s].push(t),
                  this.index[s]
                );
              if (!e.bitmap) return null;
              var a = e.width + 2 * h,
                r = e.height + 2 * h,
                n = 1,
                d = a + 2 * n,
                l = r + 2 * n;
              (d += 4 - (d % 4)), (l += 4 - (l % 4));
              var o = this.bin.allocate(d, l);
              if (
                (o.x < 0 && (this.resize(), (o = this.bin.allocate(d, l))),
                o.x < 0)
              )
                return (
                  console.warn("glyph bitmap overflow"),
                  { glyph: e, rect: null }
                );
              (this.index[s] = o), (this.ids[s] = [t]);
              for (var c = this.data, u = e.bitmap, p = 0; r > p; p++)
                for (
                  var x = this.width * (o.y + p + n) + o.x + n,
                    E = a * p,
                    T = 0;
                  a > T;
                  T++
                )
                  c[x + T] = u[E + T];
              return (this.dirty = !0), o;
            }),
            (GlyphAtlas.prototype.resize = function() {
              var t = this.width,
                i = this.height;
              if (!(t > 512 || i > 512)) {
                this.texture &&
                  (this.gl && this.gl.deleteTexture(this.texture),
                  (this.texture = null)),
                  (this.width *= 2),
                  (this.height *= 2),
                  this.bin.resize(this.width, this.height);
                for (
                  var e,
                    h,
                    s = new ArrayBuffer(this.width * this.height),
                    a = 0;
                  i > a;
                  a++
                )
                  (e = new Uint8Array(this.data.buffer, i * a, t)),
                    (h = new Uint8Array(s, i * a * 2, t)),
                    h.set(e);
                this.data = new Uint8Array(s);
              }
            }),
            (GlyphAtlas.prototype.bind = function(t) {
              (this.gl = t),
                this.texture
                  ? t.bindTexture(t.TEXTURE_2D, this.texture)
                  : ((this.texture = t.createTexture()),
                    t.bindTexture(t.TEXTURE_2D, this.texture),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_MAG_FILTER,
                      t.LINEAR
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_MIN_FILTER,
                      t.LINEAR
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_WRAP_S,
                      t.CLAMP_TO_EDGE
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_WRAP_T,
                      t.CLAMP_TO_EDGE
                    ),
                    t.texImage2D(
                      t.TEXTURE_2D,
                      0,
                      t.ALPHA,
                      this.width,
                      this.height,
                      0,
                      t.ALPHA,
                      t.UNSIGNED_BYTE,
                      null
                    ));
            }),
            (GlyphAtlas.prototype.updateTexture = function(t) {
              if ((this.bind(t), this.dirty)) {
                if (
                  (t.texSubImage2D(
                    t.TEXTURE_2D,
                    0,
                    0,
                    0,
                    this.width,
                    this.height,
                    t.ALPHA,
                    t.UNSIGNED_BYTE,
                    this.data
                  ),
                  this.ctx)
                ) {
                  for (
                    var i = this.ctx.getImageData(
                        0,
                        0,
                        this.width,
                        this.height
                      ),
                      e = 0,
                      h = 0;
                    e < this.data.length;
                    e++, h += 4
                  )
                    (i.data[h] = this.data[e]),
                      (i.data[h + 1] = this.data[e]),
                      (i.data[h + 2] = this.data[e]),
                      (i.data[h + 3] = 255);
                  this.ctx.putImageData(i, 0, 0),
                    (this.ctx.strokeStyle = "red");
                  for (var s = 0; s < this.bin.free.length; s++) {
                    var a = this.bin.free[s];
                    this.ctx.strokeRect(a.x, a.y, a.w, a.h);
                  }
                }
                this.dirty = !1;
              }
            });
        },
        { "./bin_pack": 56 }
      ],
      64: [
        function(require, module, exports) {
          "use strict";
          function GlyphSource(t) {
            (this.url = t && normalizeURL(t)),
              (this.atlases = {}),
              (this.stacks = {}),
              (this.loading = {});
          }
          function SimpleGlyph(t, e, l) {
            var r = 1;
            (this.advance = t.advance),
              (this.left = t.left - l - r),
              (this.top = t.top + l + r),
              (this.rect = e);
          }
          function glyphUrl(t, e, l, r) {
            return (
              (r = r || "abc"),
              l
                .replace("{s}", r[t.length % r.length])
                .replace("{fontstack}", t)
                .replace("{range}", e)
            );
          }
          var normalizeURL = require("../util/mapbox").normalizeGlyphsURL,
            getArrayBuffer = require("../util/ajax").getArrayBuffer,
            Glyphs = require("../util/glyphs"),
            GlyphAtlas = require("../symbol/glyph_atlas"),
            Protobuf = require("pbf");
          (module.exports = GlyphSource),
            (GlyphSource.prototype.getSimpleGlyphs = function(t, e, l, r) {
              void 0 === this.stacks[t] && (this.stacks[t] = {}),
                void 0 === this.atlases[t] &&
                  (this.atlases[t] = new GlyphAtlas(128, 128));
              for (
                var s,
                  a = {},
                  i = this.stacks[t],
                  h = this.atlases[t],
                  o = 3,
                  n = {},
                  p = 0,
                  u = 0;
                u < e.length;
                u++
              ) {
                var y = e[u];
                if (((s = Math.floor(y / 256)), i[s])) {
                  var f = i[s].glyphs[y],
                    c = h.addGlyph(l, t, f, o);
                  f && (a[y] = new SimpleGlyph(f, c, o));
                } else void 0 === n[s] && ((n[s] = []), p++), n[s].push(y);
              }
              p || r(void 0, a, t);
              var g = function(e, s, i) {
                if (!e)
                  for (
                    var u = (this.stacks[t][s] = i.stacks[0]), y = 0;
                    y < n[s].length;
                    y++
                  ) {
                    var f = n[s][y],
                      c = u.glyphs[f],
                      g = h.addGlyph(l, t, c, o);
                    c && (a[f] = new SimpleGlyph(c, g, o));
                  }
                p--, p || r(void 0, a, t);
              }.bind(this);
              for (var d in n) this.loadRange(t, d, g);
            }),
            (GlyphSource.prototype.loadRange = function(t, e, l) {
              if (256 * e > 65535) return l("glyphs > 65535 not supported");
              void 0 === this.loading[t] && (this.loading[t] = {});
              var r = this.loading[t];
              if (r[e]) r[e].push(l);
              else {
                r[e] = [l];
                var s = 256 * e + "-" + (256 * e + 255),
                  a = glyphUrl(t, s, this.url);
                getArrayBuffer(a, function(t, l) {
                  for (
                    var s = !t && new Glyphs(new Protobuf(new Uint8Array(l))),
                      a = 0;
                    a < r[e].length;
                    a++
                  )
                    r[e][a](t, e, s);
                  delete r[e];
                });
              }
            }),
            (GlyphSource.prototype.getGlyphAtlas = function(t) {
              return this.atlases[t];
            });
        },
        {
          "../symbol/glyph_atlas": 63,
          "../util/ajax": 86,
          "../util/glyphs": 93,
          "../util/mapbox": 95,
          pbf: 131
        }
      ],
      65: [
        function(require, module, exports) {
          "use strict";
          module.exports = function(e, t, n) {
            function r(r) {
              c.push(e[r]), f.push(n[r]), v.push(t[r]), h++;
            }
            function u(e, t, n) {
              var r = l[e];
              return (
                delete l[e],
                (l[t] = r),
                f[r][0].pop(),
                (f[r][0] = f[r][0].concat(n[0])),
                r
              );
            }
            function i(e, t, n) {
              var r = a[t];
              return (
                delete a[t],
                (a[e] = r),
                f[r][0].shift(),
                (f[r][0] = n[0].concat(f[r][0])),
                r
              );
            }
            function o(e, t, n) {
              var r = n ? t[0][t[0].length - 1] : t[0][0];
              return e + ":" + r.x + ":" + r.y;
            }
            var s,
              a = {},
              l = {},
              c = [],
              f = [],
              v = [],
              h = 0;
            for (s = 0; s < e.length; s++) {
              var p = n[s],
                d = t[s];
              if (d) {
                var g = o(d, p),
                  x = o(d, p, !0);
                if (g in l && x in a && l[g] !== a[x]) {
                  var m = i(g, x, p),
                    y = u(g, x, f[m]);
                  delete a[g],
                    delete l[x],
                    (l[o(d, f[y], !0)] = y),
                    (f[m] = null);
                } else
                  g in l
                    ? u(g, x, p)
                    : x in a
                    ? i(g, x, p)
                    : (r(s), (a[g] = h - 1), (l[x] = h - 1));
              } else r(s);
            }
            return { features: c, textFeatures: v, geometries: f };
          };
        },
        {}
      ],
      66: [
        function(require, module, exports) {
          "use strict";
          function SymbolQuad(t, a, e, n, i, o, l, h, r) {
            (this.anchorPoint = t),
              (this.tl = a),
              (this.tr = e),
              (this.bl = n),
              (this.br = i),
              (this.tex = o),
              (this.angle = l),
              (this.minScale = h),
              (this.maxScale = r);
          }
          function getIconQuads(t, a, e, n, i, o) {
            var l = a.image.rect,
              h = 1,
              r = a.left - h,
              s = r + l.w / a.image.pixelRatio,
              m = a.top - h,
              u = m + l.h / a.image.pixelRatio,
              c = new Point(r, m),
              g = new Point(s, m),
              M = new Point(s, u),
              P = new Point(r, u),
              x = (i["icon-rotate"] * Math.PI) / 180;
            if (o) {
              var y = n[t.segment];
              if (t.y === y.y && t.x === y.x && t.segment + 1 < n.length) {
                var f = n[t.segment + 1];
                x += Math.atan2(t.y - f.y, t.x - f.x) + Math.PI;
              } else x += Math.atan2(t.y - y.y, t.x - y.x);
            }
            if (x) {
              var p = Math.sin(x),
                v = Math.cos(x),
                S = [v, -p, p, v];
              (c = c.matMult(S)),
                (g = g.matMult(S)),
                (P = P.matMult(S)),
                (M = M.matMult(S));
            }
            return [
              new SymbolQuad(
                new Point(t.x, t.y),
                c,
                g,
                P,
                M,
                a.image.rect,
                0,
                minScale,
                1 / 0
              )
            ];
          }
          function getGlyphQuads(t, a, e, n, i, o) {
            for (
              var l = (i["text-rotate"] * Math.PI) / 180,
                h = i["text-keep-upright"],
                r = a.positionedGlyphs,
                s = [],
                m = 0;
              m < r.length;
              m++
            ) {
              var u = r[m],
                c = u.glyph,
                g = c.rect;
              if (g) {
                var M,
                  P = (u.x + c.advance / 2) * e,
                  x = minScale;
                o
                  ? ((M = []),
                    (x = getSegmentGlyphs(M, t, P, n, t.segment, !0)),
                    h &&
                      (x = Math.min(
                        x,
                        getSegmentGlyphs(M, t, P, n, t.segment, !1)
                      )))
                  : (M = [
                      {
                        anchorPoint: new Point(t.x, t.y),
                        offset: 0,
                        angle: 0,
                        maxScale: 1 / 0,
                        minScale: minScale
                      }
                    ]);
                for (
                  var y = u.x + c.left,
                    f = u.y - c.top,
                    p = y + g.w,
                    v = f + g.h,
                    S = new Point(y, f),
                    w = new Point(p, f),
                    d = new Point(y, v),
                    I = new Point(p, v),
                    b = 0;
                  b < M.length;
                  b++
                ) {
                  var Q = M[b],
                    G = S,
                    k = w,
                    q = d,
                    R = I,
                    _ = Q.angle + l;
                  if (_) {
                    var j = Math.sin(_),
                      z = Math.cos(_),
                      A = [z, -j, j, z];
                    (G = G.matMult(A)),
                      (k = k.matMult(A)),
                      (q = q.matMult(A)),
                      (R = R.matMult(A));
                  }
                  var B = Math.max(Q.minScale, x),
                    C = (t.angle + l + Q.offset + 2 * Math.PI) % (2 * Math.PI);
                  s.push(
                    new SymbolQuad(
                      Q.anchorPoint,
                      G,
                      k,
                      q,
                      R,
                      g,
                      C,
                      B,
                      Q.maxScale
                    )
                  );
                }
              }
            }
            return s;
          }
          function getSegmentGlyphs(t, a, e, n, i, o) {
            var l = !o;
            0 > e && (o = !o), o && i++;
            var h = new Point(a.x, a.y),
              r = n[i],
              s = 1 / 0;
            e = Math.abs(e);
            for (var m = minScale; ; ) {
              var u = h.dist(r),
                c = e / u,
                g = Math.atan2(r.y - h.y, r.x - h.x);
              if (
                (o || (g += Math.PI),
                l && (g += Math.PI),
                t.push({
                  anchorPoint: h,
                  offset: l ? Math.PI : 0,
                  minScale: c,
                  maxScale: s,
                  angle: (g + 2 * Math.PI) % (2 * Math.PI)
                }),
                m >= c)
              )
                break;
              for (h = r; h.equals(r); )
                if (((i += o ? 1 : -1), (r = n[i]), !r)) return c;
              var M = r.sub(h)._unit();
              (h = h.sub(M._mult(u))), (s = c);
            }
            return m;
          }
          var Point = require("point-geometry");
          module.exports = {
            getIconQuads: getIconQuads,
            getGlyphQuads: getGlyphQuads
          };
          var minScale = 0.5;
        },
        { "point-geometry": 133 }
      ],
      67: [
        function(require, module, exports) {
          "use strict";
          function resolveText(e, r, o) {
            for (var t = [], s = 0, l = e.length; l > s; s++) {
              var a = resolveTokens(e[s].properties, r["text-field"]);
              if (a) {
                a = a.toString();
                var n = r["text-transform"];
                "uppercase" === n
                  ? (a = a.toLocaleUpperCase())
                  : "lowercase" === n && (a = a.toLocaleLowerCase());
                for (var v = 0; v < a.length; v++) o[a.charCodeAt(v)] = !0;
                t[s] = a;
              } else t[s] = null;
            }
            return t;
          }
          var resolveTokens = require("../util/token");
          module.exports = resolveText;
        },
        { "../util/token": 97 }
      ],
      68: [
        function(require, module, exports) {
          "use strict";
          function PositionedGlyph(t, i, n, e) {
            (this.codePoint = t), (this.x = i), (this.y = n), (this.glyph = e);
          }
          function Shaping(t, i, n, e, o, h) {
            (this.positionedGlyphs = t),
              (this.text = i),
              (this.top = n),
              (this.bottom = e),
              (this.left = o),
              (this.right = h);
          }
          function shapeText(t, i, n, e, o, h, a, s, r) {
            for (
              var l = [],
                f = new Shaping(l, t, r[1], r[1], r[0], r[0]),
                c = -17,
                p = 0,
                u = c,
                v = 0;
              v < t.length;
              v++
            ) {
              var d = t.charCodeAt(v),
                g = i[d];
              g &&
                (l.push(new PositionedGlyph(d, p, u, g)), (p += g.advance + s));
            }
            return l.length ? (linewrap(f, i, e, n, o, h, a, r), f) : !1;
          }
          function linewrap(t, i, n, e, o, h, a, s) {
            var r = null,
              l = 0,
              f = 0,
              c = 0,
              p = 0,
              u = t.positionedGlyphs;
            if (e)
              for (var v = 0; v < u.length; v++) {
                var d = u[v];
                if (((d.x -= l), (d.y += n * c), d.x > e && null !== r)) {
                  var g = u[r + 1].x;
                  p = Math.max(g, p);
                  for (var x = r + 1; v >= x; x++) (u[x].y += n), (u[x].x -= g);
                  if (a) {
                    var y = r;
                    invisible[u[r].codePoint] && y--,
                      justifyLine(u, i, f, y, a);
                  }
                  (f = r + 1), (r = null), (l += g), c++;
                }
                breakable[d.codePoint] && (r = v);
              }
            var b = u[u.length - 1],
              P = b.x + i[b.codePoint].advance;
            p = Math.max(p, P);
            var m = (c + 1) * n;
            justifyLine(u, i, f, u.length - 1, a),
              align(u, a, o, h, p, n, c, s),
              (t.top += -h * m),
              (t.bottom = t.top + m),
              (t.left += -o * p),
              (t.right = t.left + p);
          }
          function justifyLine(t, i, n, e, o) {
            for (
              var h = i[t[e].codePoint].advance, a = (t[e].x + h) * o, s = n;
              e >= s;
              s++
            )
              t[s].x -= a;
          }
          function align(t, i, n, e, o, h, a, s) {
            for (
              var r = (i - n) * o + s[0],
                l = (-e * (a + 1) + 0.5) * h + s[1],
                f = 0;
              f < t.length;
              f++
            )
              (t[f].x += r), (t[f].y += l);
          }
          function shapeIcon(t, i) {
            if (!t || !t.rect) return null;
            var n = i["icon-offset"][0],
              e = i["icon-offset"][1],
              o = n - t.width / 2,
              h = o + t.width,
              a = e - t.height / 2,
              s = a + t.height;
            return new PositionedIcon(t, a, s, o, h);
          }
          function PositionedIcon(t, i, n, e, o) {
            (this.image = t),
              (this.top = i),
              (this.bottom = n),
              (this.left = e),
              (this.right = o);
          }
          module.exports = { shapeText: shapeText, shapeIcon: shapeIcon };
          var invisible = { 32: !0, 8203: !0 },
            breakable = {
              32: !0,
              38: !0,
              43: !0,
              45: !0,
              47: !0,
              173: !0,
              183: !0,
              8203: !0,
              8208: !0,
              8211: !0
            };
        },
        {}
      ],
      69: [
        function(require, module, exports) {
          "use strict";
          function SpriteAtlas(t, i) {
            (this.width = t),
              (this.height = i),
              (this.bin = new BinPack(t, i)),
              (this.images = {}),
              (this.data = !1),
              (this.texture = 0),
              (this.filter = 0),
              (this.pixelRatio = 1),
              (this.dirty = !0);
          }
          function copyBitmap(t, i, e, h, a, s, r, o, n, l, p) {
            var c,
              x,
              d = h * i + e,
              R = o * s + r;
            if (p)
              for (
                R -= s, x = -1;
                l >= x;
                x++, d = (((x + l) % l) + h) * i + e, R += s
              )
                for (c = -1; n >= c; c++) a[R + c] = t[d + ((c + n) % n)];
            else
              for (x = 0; l > x; x++, d += i, R += s)
                for (c = 0; n > c; c++) a[R + c] = t[d + c];
          }
          function AtlasImage(t, i, e, h, a) {
            (this.rect = t),
              (this.width = i),
              (this.height = e),
              (this.sdf = h),
              (this.pixelRatio = a);
          }
          var BinPack = require("./bin_pack"),
            browser = require("../util/browser");
          (module.exports = SpriteAtlas),
            (SpriteAtlas.prototype = {
              get debug() {
                return "canvas" in this;
              },
              set debug(t) {
                t && !this.canvas
                  ? ((this.canvas = document.createElement("canvas")),
                    (this.canvas.width = this.width * this.pixelRatio),
                    (this.canvas.height = this.height * this.pixelRatio),
                    (this.canvas.style.width = this.width + "px"),
                    (this.canvas.style.width = this.width + "px"),
                    document.body.appendChild(this.canvas),
                    (this.ctx = this.canvas.getContext("2d")))
                  : !t &&
                    this.canvas &&
                    (this.canvas.parentNode.removeChild(this.canvas),
                    delete this.ctx,
                    delete this.canvas);
              }
            }),
            (SpriteAtlas.prototype.allocateImage = function(t, i) {
              (t /= this.pixelRatio), (i /= this.pixelRatio);
              var e = 2,
                h = t + e + (4 - ((t + e) % 4)),
                a = i + e + (4 - ((i + e) % 4)),
                s = this.bin.allocate(h, a);
              return s.x < 0
                ? (console.warn("SpriteAtlas out of space."), s)
                : s;
            }),
            (SpriteAtlas.prototype.getImage = function(t, i) {
              if (this.images[t]) return this.images[t];
              if (!this.sprite) return null;
              var e = this.sprite.getSpritePosition(t);
              if (!e.width || !e.height) return null;
              var h = this.allocateImage(e.width, e.height);
              if (h.x < 0) return h;
              var a = new AtlasImage(
                h,
                e.width / e.pixelRatio,
                e.height / e.pixelRatio,
                e.sdf,
                e.pixelRatio / this.pixelRatio
              );
              return (this.images[t] = a), this.copy(h, e, i), a;
            }),
            (SpriteAtlas.prototype.getPosition = function(t, i) {
              var e = this.getImage(t, i),
                h = e && e.rect;
              if (!h) return null;
              var a = e.width * e.pixelRatio,
                s = e.height * e.pixelRatio,
                r = 1;
              return {
                size: [e.width, e.height],
                tl: [(h.x + r) / this.width, (h.y + r) / this.height],
                br: [(h.x + r + a) / this.width, (h.y + r + s) / this.height]
              };
            }),
            (SpriteAtlas.prototype.allocate = function() {
              if (!this.data) {
                var t = Math.floor(this.width * this.pixelRatio),
                  i = Math.floor(this.height * this.pixelRatio);
                this.data = new Uint32Array(t * i);
                for (var e = 0; e < this.data.length; e++) this.data[e] = 0;
              }
            }),
            (SpriteAtlas.prototype.copy = function(t, i, e) {
              if (this.sprite.img.data) {
                var h = new Uint32Array(this.sprite.img.data.buffer);
                this.allocate();
                var a = this.data,
                  s = 1;
                copyBitmap(
                  h,
                  this.sprite.img.width,
                  i.x,
                  i.y,
                  a,
                  this.width * this.pixelRatio,
                  (t.x + s) * this.pixelRatio,
                  (t.y + s) * this.pixelRatio,
                  i.width,
                  i.height,
                  e
                ),
                  (this.dirty = !0);
              }
            }),
            (SpriteAtlas.prototype.setSprite = function(t) {
              t &&
                ((this.pixelRatio = browser.devicePixelRatio > 1 ? 2 : 1),
                this.canvas &&
                  ((this.canvas.width = this.width * this.pixelRatio),
                  (this.canvas.height = this.height * this.pixelRatio))),
                (this.sprite = t);
            }),
            (SpriteAtlas.prototype.addIcons = function(t, i) {
              for (var e = 0; e < t.length; e++) this.getImage(t[e]);
              i(null, this.images);
            }),
            (SpriteAtlas.prototype.bind = function(t, i) {
              var e = !1;
              this.texture
                ? t.bindTexture(t.TEXTURE_2D, this.texture)
                : ((this.texture = t.createTexture()),
                  t.bindTexture(t.TEXTURE_2D, this.texture),
                  t.texParameteri(
                    t.TEXTURE_2D,
                    t.TEXTURE_WRAP_S,
                    t.CLAMP_TO_EDGE
                  ),
                  t.texParameteri(
                    t.TEXTURE_2D,
                    t.TEXTURE_WRAP_T,
                    t.CLAMP_TO_EDGE
                  ),
                  (e = !0));
              var h = i ? t.LINEAR : t.NEAREST;
              if (
                (h !== this.filter &&
                  (t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, h),
                  t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, h),
                  (this.filter = h)),
                this.dirty &&
                  (this.allocate(),
                  e
                    ? t.texImage2D(
                        t.TEXTURE_2D,
                        0,
                        t.RGBA,
                        this.width * this.pixelRatio,
                        this.height * this.pixelRatio,
                        0,
                        t.RGBA,
                        t.UNSIGNED_BYTE,
                        new Uint8Array(this.data.buffer)
                      )
                    : t.texSubImage2D(
                        t.TEXTURE_2D,
                        0,
                        0,
                        0,
                        this.width * this.pixelRatio,
                        this.height * this.pixelRatio,
                        t.RGBA,
                        t.UNSIGNED_BYTE,
                        new Uint8Array(this.data.buffer)
                      ),
                  (this.dirty = !1),
                  this.ctx))
              ) {
                var a = this.ctx.getImageData(
                  0,
                  0,
                  this.width * this.pixelRatio,
                  this.height * this.pixelRatio
                );
                a.data.set(new Uint8ClampedArray(this.data.buffer)),
                  this.ctx.putImageData(a, 0, 0),
                  (this.ctx.strokeStyle = "red");
                for (var s = 0; s < this.bin.free.length; s++) {
                  var r = this.bin.free[s];
                  this.ctx.strokeRect(
                    r.x * this.pixelRatio,
                    r.y * this.pixelRatio,
                    r.w * this.pixelRatio,
                    r.h * this.pixelRatio
                  );
                }
              }
            });
        },
        { "../util/browser": 87, "./bin_pack": 56 }
      ],
      70: [
        function(require, module, exports) {
          "use strict";
          var util = require("../util/util"),
            interpolate = require("../util/interpolate"),
            browser = require("../util/browser"),
            LngLat = require("../geo/lng_lat"),
            LngLatBounds = require("../geo/lng_lat_bounds"),
            Point = require("point-geometry"),
            Camera = (module.exports = function() {});
          util.extend(Camera.prototype, {
            getCenter: function() {
              return this.transform.center;
            },
            setCenter: function(t, i) {
              return this.jumpTo({ center: t }, i), this;
            },
            panBy: function(t, i, e) {
              return (
                this.panTo(
                  this.transform.center,
                  util.extend({ offset: Point.convert(t).mult(-1) }, i),
                  e
                ),
                this
              );
            },
            panTo: function(t, i, e) {
              this.stop(),
                (t = LngLat.convert(t)),
                (i = util.extend(
                  { duration: 500, easing: util.ease, offset: [0, 0] },
                  i
                ));
              var n = this.transform,
                o = Point.convert(i.offset).rotate(-n.angle),
                r = n.point,
                s = n.project(t).sub(o);
              return (
                i.noMoveStart || this.fire("movestart", e),
                this._ease(
                  function(t) {
                    (n.center = n.unproject(r.add(s.sub(r).mult(t)))),
                      this.fire("move", e);
                  },
                  function() {
                    this.fire("moveend", e);
                  },
                  i
                ),
                this
              );
            },
            getZoom: function() {
              return this.transform.zoom;
            },
            setZoom: function(t, i) {
              return this.jumpTo({ zoom: t }, i), this;
            },
            zoomTo: function(t, i, e) {
              this.stop(),
                (i = util.extend({ duration: 500 }, i)),
                (i.easing = this._updateEasing(i.duration, t, i.easing));
              var n = this.transform,
                o = n.center,
                r = n.zoom;
              return (
                i.around
                  ? (o = LngLat.convert(i.around))
                  : i.offset &&
                    (o = n.pointLocation(
                      n.centerPoint.add(Point.convert(i.offset))
                    )),
                i.animate === !1 && (i.duration = 0),
                this.zooming ||
                  ((this.zooming = !0),
                  this.fire("movestart", e).fire("zoomstart", e)),
                this._ease(
                  function(i) {
                    n.setZoomAround(interpolate(r, t, i), o),
                      this.fire("move", e).fire("zoom", e);
                  },
                  function() {
                    (this.ease = null),
                      i.duration >= 200 &&
                        ((this.zooming = !1),
                        this.fire("moveend", e).fire("zoomend", e));
                  },
                  i
                ),
                i.duration < 200 &&
                  (clearTimeout(this._onZoomEnd),
                  (this._onZoomEnd = setTimeout(
                    function() {
                      (this.zooming = !1),
                        this.fire("moveend", e).fire("zoomend", e);
                    }.bind(this),
                    200
                  ))),
                this
              );
            },
            zoomIn: function(t, i) {
              return this.zoomTo(this.getZoom() + 1, t, i), this;
            },
            zoomOut: function(t, i) {
              return this.zoomTo(this.getZoom() - 1, t, i), this;
            },
            getBearing: function() {
              return this.transform.bearing;
            },
            setBearing: function(t, i) {
              return this.jumpTo({ bearing: t }, i), this;
            },
            rotateTo: function(t, i, e) {
              this.stop(),
                (i = util.extend({ duration: 500, easing: util.ease }, i));
              var n = this.transform,
                o = this.getBearing(),
                r = n.center;
              return (
                i.around
                  ? (r = LngLat.convert(i.around))
                  : i.offset &&
                    (r = n.pointLocation(
                      n.centerPoint.add(Point.convert(i.offset))
                    )),
                (t = this._normalizeBearing(t, o)),
                (this.rotating = !0),
                i.noMoveStart || this.fire("movestart", e),
                this._ease(
                  function(i) {
                    n.setBearingAround(interpolate(o, t, i), r),
                      this.fire("move", e).fire("rotate", e);
                  },
                  function() {
                    (this.rotating = !1), this.fire("moveend", e);
                  },
                  i
                ),
                this
              );
            },
            resetNorth: function(t, i) {
              return (
                this.rotateTo(0, util.extend({ duration: 1e3 }, t), i), this
              );
            },
            snapToNorth: function(t, i) {
              return Math.abs(this.getBearing()) < this.options.bearingSnap
                ? this.resetNorth(t, i)
                : this;
            },
            getPitch: function() {
              return this.transform.pitch;
            },
            setPitch: function(t, i) {
              return this.jumpTo({ pitch: t }, i), this;
            },
            fitBounds: function(t, i, e) {
              (i = util.extend(
                { padding: 0, offset: [0, 0], maxZoom: 1 / 0 },
                i
              )),
                (t = LngLatBounds.convert(t));
              var n = Point.convert(i.offset),
                o = this.transform,
                r = o.project(t.getNorthWest()),
                s = o.project(t.getSouthEast()),
                a = s.sub(r),
                h = (o.width - 2 * i.padding - 2 * Math.abs(n.x)) / a.x,
                u = (o.height - 2 * i.padding - 2 * Math.abs(n.y)) / a.y;
              return (
                (i.center = o.unproject(r.add(s).div(2))),
                (i.zoom = Math.min(
                  o.scaleZoom(o.scale * Math.min(h, u)),
                  i.maxZoom
                )),
                (i.bearing = 0),
                i.linear ? this.easeTo(i, e) : this.flyTo(i, e)
              );
            },
            jumpTo: function(t, i) {
              this.stop();
              var e = this.transform,
                n = !1,
                o = !1,
                r = !1;
              return (
                "zoom" in t &&
                  e.zoom !== +t.zoom &&
                  ((n = !0), (e.zoom = +t.zoom)),
                "center" in t && (e.center = LngLat.convert(t.center)),
                "bearing" in t &&
                  e.bearing !== +t.bearing &&
                  ((o = !0), (e.bearing = +t.bearing)),
                "pitch" in t &&
                  e.pitch !== +t.pitch &&
                  ((r = !0), (e.pitch = +t.pitch)),
                this.fire("movestart", i).fire("move", i),
                n &&
                  this.fire("zoomstart", i)
                    .fire("zoom", i)
                    .fire("zoomend", i),
                o && this.fire("rotate", i),
                r && this.fire("pitch", i),
                this.fire("moveend", i)
              );
            },
            easeTo: function(t, i) {
              this.stop(),
                (t = util.extend(
                  { offset: [0, 0], duration: 500, easing: util.ease },
                  t
                ));
              var e = this.transform,
                n = Point.convert(t.offset).rotate(-e.angle),
                o = e.point,
                r = e.worldSize,
                s = this.getZoom(),
                a = this.getBearing(),
                h = this.getPitch(),
                u = "zoom" in t ? +t.zoom : s,
                c = "bearing" in t ? this._normalizeBearing(t.bearing, a) : a,
                f = "pitch" in t ? +t.pitch : h,
                m = e.zoomScale(u - s),
                g =
                  "center" in t
                    ? e.project(LngLat.convert(t.center)).sub(n.div(m))
                    : o,
                p = "center" in t ? null : LngLat.convert(t.around);
              return (
                (this.zooming = u !== s),
                (this.rotating = a !== c),
                (this.pitching = f !== h),
                this.fire("movestart", i),
                this.zooming && this.fire("zoomstart", i),
                this._ease(
                  function(t) {
                    this.zooming && p
                      ? e.setZoomAround(interpolate(s, u, t), p)
                      : (this.zooming && (e.zoom = interpolate(s, u, t)),
                        (e.center = e.unproject(o.add(g.sub(o).mult(t)), r))),
                      this.rotating && (e.bearing = interpolate(a, c, t)),
                      this.pitching && (e.pitch = interpolate(h, f, t)),
                      this.fire("move", i),
                      this.zooming && this.fire("zoom", i),
                      this.rotating && this.fire("rotate", i),
                      this.pitching && this.fire("pitch", i);
                  },
                  function() {
                    this.zooming && this.fire("zoomend", i),
                      this.fire("moveend", i),
                      (this.zooming = !1),
                      (this.rotating = !1),
                      (this.pitching = !1);
                  },
                  t
                ),
                this
              );
            },
            flyTo: function(t, i) {
              function e(t) {
                var i =
                  (_ * _ - M * M + (t ? -1 : 1) * Z * Z * L * L) /
                  (2 * (t ? _ : M) * Z * L);
                return Math.log(Math.sqrt(i * i + 1) - i);
              }
              function n(t) {
                return (Math.exp(t) - Math.exp(-t)) / 2;
              }
              function o(t) {
                return (Math.exp(t) + Math.exp(-t)) / 2;
              }
              function r(t) {
                return n(t) / o(t);
              }
              this.stop(),
                (t = util.extend(
                  {
                    offset: [0, 0],
                    speed: 1.2,
                    curve: 1.42,
                    easing: util.ease
                  },
                  t
                ));
              var s = this.transform,
                a = Point.convert(t.offset),
                h = this.getZoom(),
                u = this.getBearing(),
                c = this.getPitch(),
                f = "center" in t ? LngLat.convert(t.center) : this.getCenter(),
                m = "zoom" in t ? +t.zoom : h,
                g = "bearing" in t ? this._normalizeBearing(t.bearing, u) : u,
                p = "pitch" in t ? +t.pitch : c;
              Math.abs(s.center.lng) + Math.abs(f.lng) > 180 &&
                (s.center.lng > 0 && f.lng < 0
                  ? (f.lng += 360)
                  : s.center.lng < 0 && f.lng > 0 && (f.lng -= 360));
              var d = s.zoomScale(m - h),
                l = s.point,
                v = "center" in t ? s.project(f).sub(a.div(d)) : l,
                z = s.worldSize,
                b = t.curve,
                M = Math.max(s.width, s.height),
                _ = M / d,
                L = v.sub(l).mag();
              if ("minZoom" in t) {
                var x = util.clamp(
                    Math.min(t.minZoom, h, m),
                    s.minZoom,
                    s.maxZoom
                  ),
                  T = M / s.zoomScale(x - h);
                b = Math.sqrt((T / L) * 2);
              }
              var Z = b * b,
                B = e(0),
                j = function(t) {
                  return o(B) / o(B + b * t);
                },
                P = function(t) {
                  return (M * ((o(B) * r(B + b * t) - n(B)) / Z)) / L;
                },
                w = (e(1) - B) / b;
              if (Math.abs(L) < 1e-6) {
                if (Math.abs(M - _) < 1e-6) return this.easeTo(t);
                var S = M > _ ? -1 : 1;
                (w = Math.abs(Math.log(_ / M)) / b),
                  (P = function() {
                    return 0;
                  }),
                  (j = function(t) {
                    return Math.exp(S * b * t);
                  });
              }
              if ("duration" in t) t.duration = +t.duration;
              else {
                var q = "screenSpeed" in t ? +t.screenSpeed / b : +t.speed;
                t.duration = (1e3 * w) / q;
              }
              return (
                (this.zooming = !0),
                u !== g && (this.rotating = !0),
                c !== p && (this.pitching = !0),
                this.fire("movestart", i),
                this.fire("zoomstart", i),
                this._ease(
                  function(t) {
                    var e = t * w,
                      n = P(e);
                    (s.zoom = h + s.scaleZoom(1 / j(e))),
                      (s.center = s.unproject(l.add(v.sub(l).mult(n)), z)),
                      this.rotating && (s.bearing = interpolate(u, g, t)),
                      this.pitching && (s.pitch = interpolate(c, p, t)),
                      this.fire("move", i),
                      this.fire("zoom", i),
                      this.rotating && this.fire("rotate", i),
                      this.pitching && this.fire("pitch", i);
                  },
                  function() {
                    this.fire("zoomend", i),
                      this.fire("moveend", i),
                      (this.zooming = !1),
                      (this.rotating = !1),
                      (this.pitching = !1);
                  },
                  t
                ),
                this
              );
            },
            isEasing: function() {
              return !!this._abortFn;
            },
            stop: function() {
              return (
                this._abortFn && (this._abortFn(), this._finishEase()), this
              );
            },
            _ease: function(t, i, e) {
              (this._finishFn = i),
                (this._abortFn = browser.timed(
                  function(i) {
                    t.call(this, e.easing(i)), 1 === i && this._finishEase();
                  },
                  e.animate === !1 ? 0 : e.duration,
                  this
                ));
            },
            _finishEase: function() {
              delete this._abortFn;
              var t = this._finishFn;
              delete this._finishFn, t.call(this);
            },
            _normalizeBearing: function(t, i) {
              t = util.wrap(t, -180, 180);
              var e = Math.abs(t - i);
              return (
                Math.abs(t - 360 - i) < e && (t -= 360),
                Math.abs(t + 360 - i) < e && (t += 360),
                t
              );
            },
            _updateEasing: function(t, i, e) {
              var n;
              if (this.ease) {
                var o = this.ease,
                  r = (Date.now() - o.start) / o.duration,
                  s = o.easing(r + 0.01) - o.easing(r),
                  a = (0.27 / Math.sqrt(s * s + 1e-4)) * 0.01,
                  h = Math.sqrt(0.0729 - a * a);
                n = util.bezier(a, h, 0.25, 1);
              } else n = e ? util.bezier.apply(util, e) : util.ease;
              return (
                (this.ease = {
                  start: new Date().getTime(),
                  to: Math.pow(2, i),
                  duration: t,
                  easing: n
                }),
                n
              );
            }
          });
        },
        {
          "../geo/lng_lat": 10,
          "../geo/lng_lat_bounds": 11,
          "../util/browser": 87,
          "../util/interpolate": 94,
          "../util/util": 98,
          "point-geometry": 133
        }
      ],
      71: [
        function(require, module, exports) {
          "use strict";
          function Attribution(t) {
            util.setOptions(this, t);
          }
          var Control = require("./control"),
            DOM = require("../../util/dom"),
            util = require("../../util/util");
          (module.exports = Attribution),
            (Attribution.prototype = util.inherit(Control, {
              options: { position: "bottom-right" },
              onAdd: function(t) {
                var i = "mapboxgl-ctrl-attrib",
                  e = (this._container = DOM.create(
                    "div",
                    i,
                    t.getContainer()
                  ));
                return (
                  this._update(),
                  t.on("source.load", this._update.bind(this)),
                  t.on("source.change", this._update.bind(this)),
                  t.on("source.remove", this._update.bind(this)),
                  t.on("moveend", this._updateEditLink.bind(this)),
                  e
                );
              },
              _update: function() {
                var t = [];
                if (this._map.style)
                  for (var i in this._map.style.sources) {
                    var e = this._map.style.sources[i];
                    e.attribution &&
                      t.indexOf(e.attribution) < 0 &&
                      t.push(e.attribution);
                  }
                (this._container.innerHTML = t.join(" | ")),
                  (this._editLink = this._container.getElementsByClassName(
                    "mapbox-improve-map"
                  )[0]),
                  this._updateEditLink();
              },
              _updateEditLink: function() {
                if (this._editLink) {
                  var t = this._map.getCenter();
                  this._editLink.href =
                    "https://www.mapbox.com/map-feedback/#/" +
                    t.lng +
                    "/" +
                    t.lat +
                    "/" +
                    Math.round(this._map.getZoom() + 1);
                }
              }
            }));
        },
        { "../../util/dom": 90, "../../util/util": 98, "./control": 72 }
      ],
      72: [
        function(require, module, exports) {
          "use strict";
          function Control() {}
          (module.exports = Control),
            (Control.prototype = {
              addTo: function(o) {
                this._map = o;
                var t = (this._container = this.onAdd(o));
                if (this.options && this.options.position) {
                  var i = this.options.position,
                    n = o._controlCorners[i];
                  (t.className += " mapboxgl-ctrl"),
                    -1 !== i.indexOf("bottom")
                      ? n.insertBefore(t, n.firstChild)
                      : n.appendChild(t);
                }
                return this;
              },
              remove: function() {
                return (
                  this._container.parentNode.removeChild(this._container),
                  this.onRemove && this.onRemove(this._map),
                  (this._map = null),
                  this
                );
              }
            });
        },
        {}
      ],
      73: [
        function(require, module, exports) {
          "use strict";
          function Navigation(t) {
            util.setOptions(this, t);
          }
          function copyMouseEvent(t) {
            return new MouseEvent(t.type, {
              button: 2,
              buttons: 2,
              bubbles: !0,
              cancelable: !0,
              detail: t.detail,
              view: t.view,
              screenX: t.screenX,
              screenY: t.screenY,
              clientX: t.clientX,
              clientY: t.clientY,
              movementX: t.movementX,
              movementY: t.movementY,
              ctrlKey: t.ctrlKey,
              shiftKey: t.shiftKey,
              altKey: t.altKey,
              metaKey: t.metaKey
            });
          }
          var Control = require("./control"),
            DOM = require("../../util/dom"),
            util = require("../../util/util");
          (module.exports = Navigation),
            (Navigation.prototype = util.inherit(Control, {
              options: { position: "top-right" },
              onAdd: function(t) {
                var o = "mapboxgl-ctrl",
                  e = (this._container = DOM.create(
                    "div",
                    o + "-group",
                    t.getContainer()
                  ));
                return (
                  this._container.addEventListener(
                    "contextmenu",
                    this._onContextMenu.bind(this)
                  ),
                  (this._zoomInButton = this._createButton(
                    o + "-icon " + o + "-zoom-in",
                    t.zoomIn.bind(t)
                  )),
                  (this._zoomOutButton = this._createButton(
                    o + "-icon " + o + "-zoom-out",
                    t.zoomOut.bind(t)
                  )),
                  (this._compass = this._createButton(
                    o + "-icon " + o + "-compass",
                    t.resetNorth.bind(t)
                  )),
                  (this._compassArrow = DOM.create(
                    "div",
                    "arrow",
                    this._compass
                  )),
                  this._compass.addEventListener(
                    "mousedown",
                    this._onCompassDown.bind(this)
                  ),
                  (this._onCompassMove = this._onCompassMove.bind(this)),
                  (this._onCompassUp = this._onCompassUp.bind(this)),
                  t.on("rotate", this._rotateCompassArrow.bind(this)),
                  this._rotateCompassArrow(),
                  (this._el = t.getCanvasContainer()),
                  e
                );
              },
              _onContextMenu: function(t) {
                t.preventDefault();
              },
              _onCompassDown: function(t) {
                0 === t.button &&
                  (DOM.disableDrag(),
                  document.addEventListener("mousemove", this._onCompassMove),
                  document.addEventListener("mouseup", this._onCompassUp),
                  this._el.dispatchEvent(copyMouseEvent(t)),
                  t.stopPropagation());
              },
              _onCompassMove: function(t) {
                0 === t.button &&
                  (this._el.dispatchEvent(copyMouseEvent(t)),
                  t.stopPropagation());
              },
              _onCompassUp: function(t) {
                0 === t.button &&
                  (document.removeEventListener(
                    "mousemove",
                    this._onCompassMove
                  ),
                  document.removeEventListener("mouseup", this._onCompassUp),
                  DOM.enableDrag(),
                  this._el.dispatchEvent(copyMouseEvent(t)),
                  t.stopPropagation());
              },
              _createButton: function(t, o) {
                var e = DOM.create("button", t, this._container);
                return (
                  e.addEventListener("click", function() {
                    o();
                  }),
                  e
                );
              },
              _rotateCompassArrow: function() {
                var t =
                  "rotate(" +
                  this._map.transform.angle * (180 / Math.PI) +
                  "deg)";
                this._compassArrow.style.transform = t;
              }
            }));
        },
        { "../../util/dom": 90, "../../util/util": 98, "./control": 72 }
      ],
      74: [
        function(require, module, exports) {
          "use strict";
          function BoxZoom(o) {
            (this._map = o),
              (this._el = o.getCanvasContainer()),
              (this._container = o.getContainer()),
              util.bindHandlers(this);
          }
          var DOM = require("../../util/dom"),
            LngLatBounds = require("../../geo/lng_lat_bounds"),
            util = require("../../util/util");
          (module.exports = BoxZoom),
            (BoxZoom.prototype = {
              enable: function() {
                this._el.addEventListener("mousedown", this._onMouseDown, !1);
              },
              disable: function() {
                this._el.removeEventListener("mousedown", this._onMouseDown);
              },
              _onMouseDown: function(o) {
                o.shiftKey &&
                  0 === o.button &&
                  (document.addEventListener(
                    "mousemove",
                    this._onMouseMove,
                    !1
                  ),
                  document.addEventListener("keydown", this._onKeyDown, !1),
                  document.addEventListener("mouseup", this._onMouseUp, !1),
                  DOM.disableDrag(),
                  (this._startPos = DOM.mousePos(this._el, o)),
                  (this.active = !0));
              },
              _onMouseMove: function(o) {
                var e = this._startPos,
                  t = DOM.mousePos(this._el, o);
                this._box ||
                  ((this._box = DOM.create(
                    "div",
                    "mapboxgl-boxzoom",
                    this._container
                  )),
                  this._container.classList.add("mapboxgl-crosshair"),
                  this._fireEvent("boxzoomstart", o));
                var n = Math.min(e.x, t.x),
                  i = Math.max(e.x, t.x),
                  s = Math.min(e.y, t.y),
                  r = Math.max(e.y, t.y);
                DOM.setTransform(
                  this._box,
                  "translate(" + n + "px," + s + "px)"
                ),
                  (this._box.style.width = i - n + "px"),
                  (this._box.style.height = r - s + "px");
              },
              _onMouseUp: function(o) {
                if (0 === o.button) {
                  var e = this._startPos,
                    t = DOM.mousePos(this._el, o),
                    n = new LngLatBounds(
                      this._map.unproject(e),
                      this._map.unproject(t)
                    );
                  this._finish(),
                    e.x === t.x && e.y === t.y
                      ? this._fireEvent("boxzoomcancel", o)
                      : this._map
                          .fitBounds(n, { linear: !0 })
                          .fire("boxzoomend", {
                            originalEvent: o,
                            boxZoomBounds: n
                          });
                }
              },
              _onKeyDown: function(o) {
                27 === o.keyCode &&
                  (this._finish(), this._fireEvent("boxzoomcancel", o));
              },
              _finish: function() {
                (this.active = !1),
                  document.removeEventListener(
                    "mousemove",
                    this._onMouseMove,
                    !1
                  ),
                  document.removeEventListener("keydown", this._onKeyDown, !1),
                  document.removeEventListener("mouseup", this._onMouseUp, !1),
                  this._container.classList.remove("mapboxgl-crosshair"),
                  this._box &&
                    (this._box.parentNode.removeChild(this._box),
                    (this._box = null)),
                  DOM.enableDrag();
              },
              _fireEvent: function(o, e) {
                return this._map.fire(o, { originalEvent: e });
              }
            });
        },
        {
          "../../geo/lng_lat_bounds": 11,
          "../../util/dom": 90,
          "../../util/util": 98
        }
      ],
      75: [
        function(require, module, exports) {
          "use strict";
          function DoubleClickZoom(o) {
            (this._map = o), (this._onDblClick = this._onDblClick.bind(this));
          }
          (module.exports = DoubleClickZoom),
            (DoubleClickZoom.prototype = {
              enable: function() {
                this._map.on("dblclick", this._onDblClick);
              },
              disable: function() {
                this._map.off("dblclick", this._onDblClick);
              },
              _onDblClick: function(o) {
                this._map.zoomTo(
                  this._map.getZoom() + (o.originalEvent.shiftKey ? -1 : 1),
                  { around: o.lngLat }
                );
              }
            });
        },
        {}
      ],
      76: [
        function(require, module, exports) {
          "use strict";
          function DragPan(t) {
            (this._map = t),
              (this._el = t.getCanvasContainer()),
              util.bindHandlers(this);
          }
          var DOM = require("../../util/dom"),
            util = require("../../util/util");
          module.exports = DragPan;
          var inertiaLinearity = 0.3,
            inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
            inertiaMaxSpeed = 1400,
            inertiaDeceleration = 2500;
          DragPan.prototype = {
            enable: function() {
              this._el.addEventListener("mousedown", this._onDown),
                this._el.addEventListener("touchstart", this._onDown);
            },
            disable: function() {
              this._el.removeEventListener("mousedown", this._onDown),
                this._el.removeEventListener("touchstart", this._onDown);
            },
            _onDown: function(t) {
              this._ignoreEvent(t) ||
                this.active ||
                (t.touches
                  ? (document.addEventListener("touchmove", this._onMove),
                    document.addEventListener("touchend", this._onTouchEnd))
                  : (document.addEventListener("mousemove", this._onMove),
                    document.addEventListener("mouseup", this._onMouseUp)),
                (this.active = !1),
                (this._startPos = this._pos = DOM.mousePos(this._el, t)),
                (this._inertia = [[Date.now(), this._pos]]));
            },
            _onMove: function(t) {
              if (!this._ignoreEvent(t)) {
                this.active ||
                  ((this.active = !0),
                  this._fireEvent("dragstart", t),
                  this._fireEvent("movestart", t));
                var e = DOM.mousePos(this._el, t),
                  i = this._map;
                i.stop(),
                  this._drainInertiaBuffer(),
                  this._inertia.push([Date.now(), e]),
                  i.transform.setLocationAtPoint(
                    i.transform.pointLocation(this._pos),
                    e
                  ),
                  this._fireEvent("drag", t),
                  this._fireEvent("move", t),
                  (this._pos = e),
                  t.preventDefault();
              }
            },
            _onUp: function(t) {
              if (this.active) {
                (this.active = !1),
                  this._fireEvent("dragend", t),
                  this._drainInertiaBuffer();
                var e = function() {
                    this._fireEvent("moveend", t);
                  }.bind(this),
                  i = this._inertia;
                if (i.length < 2) return void e();
                var n = i[i.length - 1],
                  o = i[0],
                  r = n[1].sub(o[1]),
                  s = (n[0] - o[0]) / 1e3;
                if (0 === s || n[1].equals(o[1])) return void e();
                var a = r.mult(inertiaLinearity / s),
                  u = a.mag();
                u > inertiaMaxSpeed &&
                  ((u = inertiaMaxSpeed), a._unit()._mult(u));
                var h = u / (inertiaDeceleration * inertiaLinearity),
                  v = a.mult(-h / 2);
                this._map.panBy(
                  v,
                  { duration: 1e3 * h, easing: inertiaEasing, noMoveStart: !0 },
                  { originalEvent: t }
                );
              }
            },
            _onMouseUp: function(t) {
              this._ignoreEvent(t) ||
                (this._onUp(t),
                document.removeEventListener("mousemove", this._onMove),
                document.removeEventListener("mouseup", this._onMouseUp));
            },
            _onTouchEnd: function(t) {
              this._ignoreEvent(t) ||
                (this._onUp(t),
                document.removeEventListener("touchmove", this._onMove),
                document.removeEventListener("touchend", this._onTouchEnd));
            },
            _fireEvent: function(t, e) {
              return this._map.fire(t, { originalEvent: e });
            },
            _ignoreEvent: function(t) {
              var e = this._map;
              if (e.boxZoom && e.boxZoom.active) return !0;
              if (e.dragRotate && e.dragRotate.active) return !0;
              if (t.touches) return t.touches.length > 1;
              if (t.ctrlKey) return !0;
              var i = 1,
                n = 0;
              return "mousemove" === t.type
                ? t.buttons & (0 === i)
                : t.button !== n;
            },
            _drainInertiaBuffer: function() {
              for (
                var t = this._inertia, e = Date.now(), i = 160;
                t.length > 0 && e - t[0][0] > i;

              )
                t.shift();
            }
          };
        },
        { "../../util/dom": 90, "../../util/util": 98 }
      ],
      77: [
        function(require, module, exports) {
          "use strict";
          function DragRotate(t) {
            (this._map = t),
              (this._el = t.getCanvasContainer()),
              util.bindHandlers(this);
          }
          var DOM = require("../../util/dom"),
            Point = require("point-geometry"),
            util = require("../../util/util");
          module.exports = DragRotate;
          var inertiaLinearity = 0.25,
            inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
            inertiaMaxSpeed = 180,
            inertiaDeceleration = 720;
          DragRotate.prototype = {
            enable: function() {
              this._el.addEventListener("mousedown", this._onDown);
            },
            disable: function() {
              this._el.removeEventListener("mousedown", this._onDown);
            },
            _onDown: function(t) {
              if (!this._ignoreEvent(t) && !this.active) {
                document.addEventListener("mousemove", this._onMove),
                  document.addEventListener("mouseup", this._onUp),
                  (this.active = !1),
                  (this._inertia = [[Date.now(), this._map.getBearing()]]),
                  (this._startPos = this._pos = DOM.mousePos(this._el, t)),
                  (this._center = this._map.transform.centerPoint);
                var e = this._startPos.sub(this._center),
                  i = e.mag();
                200 > i &&
                  (this._center = this._startPos.add(
                    new Point(-200, 0)._rotate(e.angle())
                  )),
                  t.preventDefault();
              }
            },
            _onMove: function(t) {
              if (!this._ignoreEvent(t)) {
                this.active ||
                  ((this.active = !0),
                  this._fireEvent("rotatestart", t),
                  this._fireEvent("movestart", t));
                var e = this._map;
                e.stop();
                var i = this._pos,
                  n = DOM.mousePos(this._el, t),
                  r = this._center,
                  a = (i.sub(r).angleWith(n.sub(r)) / Math.PI) * 180,
                  o = e.getBearing() - a,
                  s = this._inertia,
                  h = s[s.length - 1];
                this._drainInertiaBuffer(),
                  s.push([Date.now(), e._normalizeBearing(o, h[1])]),
                  (e.transform.bearing = o),
                  this._fireEvent("rotate", t),
                  this._fireEvent("move", t),
                  (this._pos = n);
              }
            },
            _onUp: function(t) {
              if (
                !this._ignoreEvent(t) &&
                (document.removeEventListener("mousemove", this._onMove),
                document.removeEventListener("mouseup", this._onUp),
                this.active)
              ) {
                (this.active = !1),
                  this._fireEvent("rotateend", t),
                  this._drainInertiaBuffer();
                var e = this._map,
                  i = e.getBearing(),
                  n = this._inertia,
                  r = function() {
                    Math.abs(i) < e.options.bearingSnap
                      ? e.resetNorth({ noMoveStart: !0 }, { originalEvent: t })
                      : this._fireEvent("moveend", t);
                  }.bind(this);
                if (n.length < 2) return void r();
                var a = n[0],
                  o = n[n.length - 1],
                  s = n[n.length - 2],
                  h = e._normalizeBearing(i, s[1]),
                  v = o[1] - a[1],
                  u = 0 > v ? -1 : 1,
                  _ = (o[0] - a[0]) / 1e3;
                if (0 === v || 0 === _) return void r();
                var m = Math.abs(v * (inertiaLinearity / _));
                m > inertiaMaxSpeed && (m = inertiaMaxSpeed);
                var g = m / (inertiaDeceleration * inertiaLinearity),
                  f = u * m * (g / 2);
                (h += f),
                  Math.abs(e._normalizeBearing(h, 0)) < e.options.bearingSnap &&
                    (h = e._normalizeBearing(0, h)),
                  e.rotateTo(
                    h,
                    {
                      duration: 1e3 * g,
                      easing: inertiaEasing,
                      noMoveStart: !0
                    },
                    { originalEvent: t }
                  );
              }
            },
            _fireEvent: function(t, e) {
              return this._map.fire(t, { originalEvent: e });
            },
            _ignoreEvent: function(t) {
              var e = this._map;
              if (e.boxZoom && e.boxZoom.active) return !0;
              if (e.dragPan && e.dragPan.active) return !0;
              if (t.touches) return t.touches.length > 1;
              var i = t.ctrlKey ? 1 : 2,
                n = t.ctrlKey ? 0 : 2;
              return "mousemove" === t.type
                ? t.buttons & (0 === i)
                : t.button !== n;
            },
            _drainInertiaBuffer: function() {
              for (
                var t = this._inertia, e = Date.now(), i = 160;
                t.length > 0 && e - t[0][0] > i;

              )
                t.shift();
            }
          };
        },
        { "../../util/dom": 90, "../../util/util": 98, "point-geometry": 133 }
      ],
      78: [
        function(require, module, exports) {
          "use strict";
          function Keyboard(e) {
            (this._map = e),
              (this._el = e.getCanvasContainer()),
              (this._onKeyDown = this._onKeyDown.bind(this));
          }
          module.exports = Keyboard;
          var panDelta = 80,
            rotateDelta = 2,
            pitchDelta = 5;
          Keyboard.prototype = {
            enable: function() {
              this._el.addEventListener("keydown", this._onKeyDown, !1);
            },
            disable: function() {
              this._el.removeEventListener("keydown", this._onKeyDown);
            },
            _onKeyDown: function(e) {
              if (!(e.altKey || e.ctrlKey || e.metaKey)) {
                var t = this._map,
                  a = { originalEvent: e };
                switch (e.keyCode) {
                  case 61:
                  case 107:
                  case 171:
                  case 187:
                    t.zoomTo(Math.round(t.getZoom()) + (e.shiftKey ? 2 : 1), a);
                    break;
                  case 189:
                  case 109:
                  case 173:
                    t.zoomTo(Math.round(t.getZoom()) - (e.shiftKey ? 2 : 1), a);
                    break;
                  case 37:
                    e.shiftKey
                      ? t.easeTo({ bearing: t.getBearing() - rotateDelta }, a)
                      : t.panBy([-panDelta, 0], a);
                    break;
                  case 39:
                    e.shiftKey
                      ? t.easeTo({ bearing: t.getBearing() + rotateDelta }, a)
                      : t.panBy([panDelta, 0], a);
                    break;
                  case 38:
                    e.shiftKey
                      ? t.easeTo({ pitch: t.getPitch() + pitchDelta }, a)
                      : t.panBy([0, -panDelta], a);
                    break;
                  case 40:
                    e.shiftKey
                      ? t.easeTo(
                          { pitch: Math.max(t.getPitch() - pitchDelta, 0) },
                          a
                        )
                      : t.panBy([0, panDelta], a);
                }
              }
            }
          };
        },
        {}
      ],
      79: [
        function(require, module, exports) {
          "use strict";
          function ScrollZoom(e) {
            (this._map = e),
              (this._el = e.getCanvasContainer()),
              util.bindHandlers(this);
          }
          var DOM = require("../../util/dom"),
            browser = require("../../util/browser"),
            util = require("../../util/util");
          module.exports = ScrollZoom;
          var ua =
              "undefined" != typeof navigator
                ? navigator.userAgent.toLowerCase()
                : "",
            firefox = -1 !== ua.indexOf("firefox"),
            safari = -1 !== ua.indexOf("safari") && -1 === ua.indexOf("chrom");
          ScrollZoom.prototype = {
            enable: function() {
              this._el.addEventListener("wheel", this._onWheel, !1),
                this._el.addEventListener("mousewheel", this._onWheel, !1);
            },
            disable: function() {
              this._el.removeEventListener("wheel", this._onWheel),
                this._el.removeEventListener("mousewheel", this._onWheel);
            },
            _onWheel: function(e) {
              var t;
              "wheel" === e.type
                ? ((t = e.deltaY),
                  firefox &&
                    e.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL &&
                    (t /= browser.devicePixelRatio),
                  e.deltaMode === window.WheelEvent.DOM_DELTA_LINE && (t *= 40))
                : "mousewheel" === e.type &&
                  ((t = -e.wheelDeltaY), safari && (t /= 3));
              var i = (window.performance || Date).now(),
                o = i - (this._time || 0);
              (this._pos = DOM.mousePos(this._el, e)),
                (this._time = i),
                0 !== t && t % 4.000244140625 === 0
                  ? ((this._type = "wheel"), (t = Math.floor(t / 4)))
                  : 0 !== t && Math.abs(t) < 4
                  ? (this._type = "trackpad")
                  : o > 400
                  ? ((this._type = null),
                    (this._lastValue = t),
                    (this._timeout = setTimeout(this._onTimeout, 40)))
                  : this._type ||
                    ((this._type =
                      Math.abs(o * t) < 200 ? "trackpad" : "wheel"),
                    this._timeout &&
                      (clearTimeout(this._timeout),
                      (this._timeout = null),
                      (t += this._lastValue))),
                e.shiftKey && t && (t /= 4),
                this._type && this._zoom(-t, e),
                e.preventDefault();
            },
            _onTimeout: function() {
              (this._type = "wheel"), this._zoom(-this._lastValue);
            },
            _zoom: function(e, t) {
              var i = this._map,
                o = 2 / (1 + Math.exp(-Math.abs(e / 100)));
              0 > e && 0 !== o && (o = 1 / o);
              var s = i.ease ? i.ease.to : i.transform.scale,
                a = i.transform.scaleZoom(s * o);
              i.zoomTo(
                a,
                { duration: 0, around: i.unproject(this._pos) },
                { originalEvent: t }
              );
            }
          };
        },
        {
          "../../util/browser": 87,
          "../../util/dom": 90,
          "../../util/util": 98
        }
      ],
      80: [
        function(require, module, exports) {
          "use strict";
          function TouchZoomRotate(t) {
            (this._map = t),
              (this._el = t.getCanvasContainer()),
              util.bindHandlers(this);
          }
          var DOM = require("../../util/dom"),
            util = require("../../util/util");
          module.exports = TouchZoomRotate;
          var inertiaLinearity = 0.15,
            inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
            inertiaDeceleration = 12,
            inertiaMaxSpeed = 2.5,
            significantScaleThreshold = 0.15,
            significantRotateThreshold = 4;
          TouchZoomRotate.prototype = {
            enable: function() {
              this._el.addEventListener("touchstart", this._onStart, !1);
            },
            disable: function() {
              this._el.removeEventListener("touchstart", this._onStart);
            },
            disableRotation: function() {
              this._rotationDisabled = !0;
            },
            enableRotation: function() {
              this._rotationDisabled = !1;
            },
            _onStart: function(t) {
              if (2 === t.touches.length) {
                var e = DOM.mousePos(this._el, t.touches[0]),
                  i = DOM.mousePos(this._el, t.touches[1]);
                (this._startVec = e.sub(i)),
                  (this._startScale = this._map.transform.scale),
                  (this._startBearing = this._map.transform.bearing),
                  (this._gestureIntent = void 0),
                  (this._inertia = []),
                  document.addEventListener("touchmove", this._onMove, !1),
                  document.addEventListener("touchend", this._onEnd, !1);
              }
            },
            _onMove: function(t) {
              if (2 === t.touches.length) {
                var e = DOM.mousePos(this._el, t.touches[0]),
                  i = DOM.mousePos(this._el, t.touches[1]),
                  n = e.add(i).div(2),
                  a = e.sub(i),
                  s = a.mag() / this._startVec.mag(),
                  r = this._rotationDisabled
                    ? 0
                    : (180 * a.angleWith(this._startVec)) / Math.PI,
                  o = this._map;
                if (this._gestureIntent) {
                  var h = { duration: 0, around: o.unproject(n) };
                  "rotate" === this._gestureIntent &&
                    (h.bearing = this._startBearing + r),
                    ("zoom" === this._gestureIntent ||
                      "rotate" === this._gestureIntent) &&
                      (h.zoom = o.transform.scaleZoom(this._startScale * s)),
                    o.stop(),
                    this._drainInertiaBuffer(),
                    this._inertia.push([Date.now(), s, n]),
                    o.easeTo(h, { originalEvent: t });
                } else {
                  var u = Math.abs(1 - s) > significantScaleThreshold,
                    c = Math.abs(r) > significantRotateThreshold;
                  c
                    ? (this._gestureIntent = "rotate")
                    : u && (this._gestureIntent = "zoom"),
                    this._gestureIntent &&
                      ((this._startVec = a),
                      (this._startScale = o.transform.scale),
                      (this._startBearing = o.transform.bearing));
                }
                t.preventDefault();
              }
            },
            _onEnd: function(t) {
              document.removeEventListener("touchmove", this._onMove),
                document.removeEventListener("touchend", this._onEnd),
                this._drainInertiaBuffer();
              var e = this._inertia,
                i = this._map;
              if (e.length < 2)
                return void i.snapToNorth({}, { originalEvent: t });
              var n = e[e.length - 1],
                a = e[0],
                s = i.transform.scaleZoom(this._startScale * n[1]),
                r = i.transform.scaleZoom(this._startScale * a[1]),
                o = s - r,
                h = (n[0] - a[0]) / 1e3,
                u = n[2];
              if (0 === h || s === r)
                return void i.snapToNorth({}, { originalEvent: t });
              var c = (o * inertiaLinearity) / h;
              Math.abs(c) > inertiaMaxSpeed &&
                (c = c > 0 ? inertiaMaxSpeed : -inertiaMaxSpeed);
              var l =
                  1e3 * Math.abs(c / (inertiaDeceleration * inertiaLinearity)),
                _ = s + (c * l) / 2e3;
              0 > _ && (_ = 0),
                i.easeTo(
                  {
                    zoom: _,
                    duration: l,
                    easing: inertiaEasing,
                    around: i.unproject(u)
                  },
                  { originalEvent: t }
                );
            },
            _drainInertiaBuffer: function() {
              for (
                var t = this._inertia, e = Date.now(), i = 160;
                t.length > 2 && e - t[0][0] > i;

              )
                t.shift();
            }
          };
        },
        { "../../util/dom": 90, "../../util/util": 98 }
      ],
      81: [
        function(require, module, exports) {
          "use strict";
          function Hash() {
            util.bindAll(["_onHashChange", "_updateHash"], this);
          }
          module.exports = Hash;
          var util = require("../util/util");
          Hash.prototype = {
            addTo: function(t) {
              return (
                (this._map = t),
                window.addEventListener("hashchange", this._onHashChange, !1),
                this._map.on("moveend", this._updateHash),
                this
              );
            },
            remove: function() {
              return (
                window.removeEventListener(
                  "hashchange",
                  this._onHashChange,
                  !1
                ),
                this._map.off("moveend", this._updateHash),
                delete this._map,
                this
              );
            },
            _onHashChange: function() {
              var t = location.hash.replace("#", "").split("/");
              return t.length >= 3
                ? (this._map.jumpTo({
                    center: [+t[2], +t[1]],
                    zoom: +t[0],
                    bearing: +(t[3] || 0)
                  }),
                  !0)
                : !1;
            },
            _updateHash: function() {
              var t = this._map.getCenter(),
                e = this._map.getZoom(),
                a = this._map.getBearing(),
                h = Math.max(0, Math.ceil(Math.log(e) / Math.LN2)),
                n =
                  "#" +
                  Math.round(100 * e) / 100 +
                  "/" +
                  t.lat.toFixed(h) +
                  "/" +
                  t.lng.toFixed(h) +
                  (a ? "/" + Math.round(10 * a) / 10 : "");
              window.history.replaceState("", "", n);
            }
          };
        },
        { "../util/util": 98 }
      ],
      82: [
        function(require, module, exports) {
          "use strict";
          function Interaction(e) {
            (this._map = e), (this._el = e.getCanvasContainer());
            for (var t in handlers) e[t] = new handlers[t](e);
            util.bindHandlers(this);
          }
          var handlers = {
              scrollZoom: require("./handler/scroll_zoom"),
              boxZoom: require("./handler/box_zoom"),
              dragRotate: require("./handler/drag_rotate"),
              dragPan: require("./handler/drag_pan"),
              keyboard: require("./handler/keyboard"),
              doubleClickZoom: require("./handler/dblclick_zoom"),
              touchZoomRotate: require("./handler/touch_zoom_rotate")
            },
            DOM = require("../util/dom"),
            util = require("../util/util");
          (module.exports = Interaction),
            (Interaction.prototype = {
              enable: function() {
                var e = this._map.options,
                  t = this._el;
                for (var n in handlers) e[n] && this._map[n].enable();
                t.addEventListener("mousedown", this._onMouseDown, !1),
                  t.addEventListener("mouseup", this._onMouseUp, !1),
                  t.addEventListener("touchstart", this._onTouchStart, !1),
                  t.addEventListener("click", this._onClick, !1),
                  t.addEventListener("mousemove", this._onMouseMove, !1),
                  t.addEventListener("dblclick", this._onDblClick, !1),
                  t.addEventListener("contextmenu", this._onContextMenu, !1);
              },
              disable: function() {
                var e = this._map.options,
                  t = this._el;
                for (var n in handlers) e[n] && this._map[n].disable();
                t.removeEventListener("mousedown", this._onMouseDown),
                  t.removeEventListener("mouseup", this._onMouseUp),
                  t.removeEventListener("touchstart", this._onTouchStart),
                  t.removeEventListener("click", this._onClick),
                  t.removeEventListener("mousemove", this._onMouseMove),
                  t.removeEventListener("dblclick", this._onDblClick),
                  t.removeEventListener("contextmenu", this._onContextMenu);
              },
              _onMouseDown: function(e) {
                this._map.stop(),
                  (this._startPos = DOM.mousePos(this._el, e)),
                  this._fireEvent("mousedown", e);
              },
              _onMouseUp: function(e) {
                var t = this._map,
                  n = t.dragRotate && t.dragRotate.active;
                this._contextMenuEvent &&
                  !n &&
                  this._fireEvent("contextmenu", this._contextMenuEvent),
                  (this._contextMenuEvent = null),
                  this._fireEvent("mouseup", e);
              },
              _onTouchStart: function(e) {
                !e.touches ||
                  e.touches.length > 1 ||
                  (this._tapped
                    ? (clearTimeout(this._tapped),
                      (this._tapped = null),
                      this._fireEvent("dblclick", e))
                    : (this._tapped = setTimeout(this._onTimeout, 300)));
              },
              _onTimeout: function() {
                this._tapped = null;
              },
              _onMouseMove: function(e) {
                var t = this._map,
                  n = this._el;
                if (
                  !(
                    (t.dragPan && t.dragPan.active) ||
                    (t.dragRotate && t.dragRotate.active)
                  )
                ) {
                  for (var o = e.toElement || e.target; o && o !== n; )
                    o = o.parentNode;
                  o === n && this._fireEvent("mousemove", e);
                }
              },
              _onClick: function(e) {
                var t = DOM.mousePos(this._el, e);
                t.equals(this._startPos) && this._fireEvent("click", e);
              },
              _onDblClick: function(e) {
                this._fireEvent("dblclick", e), e.preventDefault();
              },
              _onContextMenu: function(e) {
                (this._contextMenuEvent = e), e.preventDefault();
              },
              _fireEvent: function(e, t) {
                var n = DOM.mousePos(this._el, t);
                return this._map.fire(e, {
                  lngLat: this._map.unproject(n),
                  point: n,
                  originalEvent: t
                });
              }
            });
        },
        {
          "../util/dom": 90,
          "../util/util": 98,
          "./handler/box_zoom": 74,
          "./handler/dblclick_zoom": 75,
          "./handler/drag_pan": 76,
          "./handler/drag_rotate": 77,
          "./handler/keyboard": 78,
          "./handler/scroll_zoom": 79,
          "./handler/touch_zoom_rotate": 80
        }
      ],
      83: [
        function(require, module, exports) {
          "use strict";
          function removeNode(t) {
            t.parentNode && t.parentNode.removeChild(t);
          }
          var Canvas = require("../util/canvas"),
            util = require("../util/util"),
            browser = require("../util/browser"),
            Evented = require("../util/evented"),
            DOM = require("../util/dom"),
            Style = require("../style/style"),
            AnimationLoop = require("../style/animation_loop"),
            Painter = require("../render/painter"),
            Transform = require("../geo/transform"),
            Hash = require("./hash"),
            Interaction = require("./interaction"),
            Camera = require("./camera"),
            LngLat = require("../geo/lng_lat"),
            LngLatBounds = require("../geo/lng_lat_bounds"),
            Point = require("point-geometry"),
            Attribution = require("./control/attribution"),
            Map = (module.exports = function(t) {
              if (
                ((t = this.options = util.inherit(this.options, t)),
                (this.animationLoop = new AnimationLoop()),
                (this.transform = new Transform(t.minZoom, t.maxZoom)),
                t.maxBounds)
              ) {
                var e = LngLatBounds.convert(t.maxBounds);
                (this.transform.lngRange = [e.getWest(), e.getEast()]),
                  (this.transform.latRange = [e.getSouth(), e.getNorth()]);
              }
              util.bindAll(
                [
                  "_forwardStyleEvent",
                  "_forwardSourceEvent",
                  "_forwardLayerEvent",
                  "_forwardTileEvent",
                  "_onStyleLoad",
                  "_onStyleChange",
                  "_onSourceAdd",
                  "_onSourceRemove",
                  "_onSourceUpdate",
                  "_onWindowResize",
                  "onError",
                  "_update",
                  "_render"
                ],
                this
              ),
                this._setupContainer(),
                this._setupPainter(),
                this.on("move", this._update.bind(this, !1)),
                this.on("zoom", this._update.bind(this, !0)),
                this.on(
                  "moveend",
                  function() {
                    this.animationLoop.set(300), this._rerender();
                  }.bind(this)
                ),
                "undefined" != typeof window &&
                  window.addEventListener("resize", this._onWindowResize, !1),
                (this.interaction = new Interaction(this)),
                t.interactive && this.interaction.enable(),
                (this._hash = t.hash && new Hash().addTo(this)),
                (this._hash && this._hash._onHashChange()) || this.jumpTo(t),
                (this.sources = {}),
                (this.stacks = {}),
                (this._classes = {}),
                this.resize(),
                t.classes && this.setClasses(t.classes),
                t.style && this.setStyle(t.style),
                t.attributionControl &&
                  this.addControl(new Attribution(t.attributionControl)),
                this.on("style.error", this.onError),
                this.on("source.error", this.onError),
                this.on("tile.error", this.onError);
            });
          util.extend(Map.prototype, Evented),
            util.extend(Map.prototype, Camera.prototype),
            util.extend(Map.prototype, {
              options: {
                center: [0, 0],
                zoom: 0,
                bearing: 0,
                pitch: 0,
                minZoom: 0,
                maxZoom: 20,
                interactive: !0,
                scrollZoom: !0,
                boxZoom: !0,
                dragRotate: !0,
                dragPan: !0,
                keyboard: !0,
                doubleClickZoom: !0,
                touchZoomRotate: !0,
                bearingSnap: 7,
                hash: !1,
                attributionControl: !0,
                failIfMajorPerformanceCaveat: !1,
                preserveDrawingBuffer: !1
              },
              addControl: function(t) {
                return t.addTo(this), this;
              },
              addClass: function(t, e) {
                this._classes[t] ||
                  ((this._classes[t] = !0),
                  this.style && this.style._cascade(this._classes, e));
              },
              removeClass: function(t, e) {
                this._classes[t] &&
                  (delete this._classes[t],
                  this.style && this.style._cascade(this._classes, e));
              },
              setClasses: function(t, e) {
                this._classes = {};
                for (var i = 0; i < t.length; i++) this._classes[t[i]] = !0;
                this.style && this.style._cascade(this._classes, e);
              },
              hasClass: function(t) {
                return !!this._classes[t];
              },
              getClasses: function() {
                return Object.keys(this._classes);
              },
              resize: function() {
                var t = 0,
                  e = 0;
                return (
                  this._container &&
                    ((t = this._container.offsetWidth || 400),
                    (e = this._container.offsetHeight || 300)),
                  this._canvas.resize(t, e),
                  this.transform.resize(t, e),
                  this.painter.resize(t, e),
                  this.fire("movestart")
                    .fire("move")
                    .fire("resize")
                    .fire("moveend")
                );
              },
              getBounds: function() {
                return new LngLatBounds(
                  this.transform.pointLocation(new Point(0, 0)),
                  this.transform.pointLocation(this.transform.size)
                );
              },
              project: function(t) {
                return this.transform.locationPoint(LngLat.convert(t));
              },
              unproject: function(t) {
                return this.transform.pointLocation(Point.convert(t));
              },
              featuresAt: function(t, e, i) {
                var o = this.unproject(t).wrap(),
                  r = this.transform.locationCoordinate(o);
                return this.style.featuresAt(r, e, i), this;
              },
              featuresIn: function(t, e, i) {
                return (
                  "undefined" == typeof i &&
                    ((i = e),
                    (e = t),
                    (t = [
                      Point.convert([0, 0]),
                      Point.convert([
                        this.transform.width,
                        this.transform.height
                      ])
                    ])),
                  (t = t.map(Point.convert.bind(Point))),
                  (t = [
                    new Point(
                      Math.min(t[0].x, t[1].x),
                      Math.min(t[0].y, t[1].y)
                    ),
                    new Point(
                      Math.max(t[0].x, t[1].x),
                      Math.max(t[0].y, t[1].y)
                    )
                  ].map(this.transform.pointCoordinate.bind(this.transform))),
                  this.style.featuresIn(t, e, i),
                  this
                );
              },
              batch: function(t) {
                this.style.batch(t),
                  this.style._cascade(this._classes),
                  this._update(!0);
              },
              setStyle: function(t) {
                return (
                  this.style &&
                    (this.style
                      .off("load", this._onStyleLoad)
                      .off("error", this._forwardStyleEvent)
                      .off("change", this._onStyleChange)
                      .off("source.add", this._onSourceAdd)
                      .off("source.remove", this._onSourceRemove)
                      .off("source.load", this._onSourceUpdate)
                      .off("source.error", this._forwardSourceEvent)
                      .off("source.change", this._onSourceUpdate)
                      .off("layer.add", this._forwardLayerEvent)
                      .off("layer.remove", this._forwardLayerEvent)
                      .off("tile.add", this._forwardTileEvent)
                      .off("tile.remove", this._forwardTileEvent)
                      .off("tile.load", this._update)
                      .off("tile.error", this._forwardTileEvent)
                      .off("tile.stats", this._forwardTileEvent)
                      ._remove(),
                    this.off("rotate", this.style._redoPlacement),
                    this.off("pitch", this.style._redoPlacement)),
                  t
                    ? (t instanceof Style
                        ? (this.style = t)
                        : (this.style = new Style(t, this.animationLoop)),
                      this.style
                        .on("load", this._onStyleLoad)
                        .on("error", this._forwardStyleEvent)
                        .on("change", this._onStyleChange)
                        .on("source.add", this._onSourceAdd)
                        .on("source.remove", this._onSourceRemove)
                        .on("source.load", this._onSourceUpdate)
                        .on("source.error", this._forwardSourceEvent)
                        .on("source.change", this._onSourceUpdate)
                        .on("layer.add", this._forwardLayerEvent)
                        .on("layer.remove", this._forwardLayerEvent)
                        .on("tile.add", this._forwardTileEvent)
                        .on("tile.remove", this._forwardTileEvent)
                        .on("tile.load", this._update)
                        .on("tile.error", this._forwardTileEvent)
                        .on("tile.stats", this._forwardTileEvent),
                      this.on("rotate", this.style._redoPlacement),
                      this.on("pitch", this.style._redoPlacement),
                      this)
                    : ((this.style = null), this)
                );
              },
              addSource: function(t, e) {
                return this.style.addSource(t, e), this;
              },
              removeSource: function(t) {
                return this.style.removeSource(t), this;
              },
              getSource: function(t) {
                return this.style.getSource(t);
              },
              addLayer: function(t, e) {
                return (
                  this.style.addLayer(t, e),
                  this.style._cascade(this._classes),
                  this
                );
              },
              removeLayer: function(t) {
                return (
                  this.style.removeLayer(t),
                  this.style._cascade(this._classes),
                  this
                );
              },
              getLayer: function(t) {
                return this.style.getLayer(t);
              },
              setFilter: function(t, e) {
                return this.style.setFilter(t, e), this;
              },
              setLayerZoomRange: function(t, e, i) {
                return this.style.setLayerZoomRange(t, e, i), this;
              },
              getFilter: function(t) {
                return this.style.getFilter(t);
              },
              setPaintProperty: function(t, e, i, o) {
                return (
                  this.batch(function(r) {
                    r.setPaintProperty(t, e, i, o);
                  }),
                  this
                );
              },
              getPaintProperty: function(t, e, i) {
                return this.style.getPaintProperty(t, e, i);
              },
              setLayoutProperty: function(t, e, i) {
                return (
                  this.batch(function(o) {
                    o.setLayoutProperty(t, e, i);
                  }),
                  this
                );
              },
              getLayoutProperty: function(t, e) {
                return this.style.getLayoutProperty(t, e);
              },
              getContainer: function() {
                return this._container;
              },
              getCanvasContainer: function() {
                return this._canvasContainer;
              },
              getCanvas: function() {
                return this._canvas.getElement();
              },
              _setupContainer: function() {
                var t = this.options.container,
                  e = (this._container =
                    "string" == typeof t ? document.getElementById(t) : t);
                e.classList.add("mapboxgl-map");
                var i = (this._canvasContainer = DOM.create(
                  "div",
                  "mapboxgl-canvas-container",
                  e
                ));
                this.options.interactive &&
                  i.classList.add("mapboxgl-interactive"),
                  (this._canvas = new Canvas(this, i));
                var o = (this._controlContainer = DOM.create(
                    "div",
                    "mapboxgl-control-container",
                    e
                  )),
                  r = (this._controlCorners = {});
                [
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right"
                ].forEach(function(t) {
                  r[t] = DOM.create("div", "mapboxgl-ctrl-" + t, o);
                });
              },
              _setupPainter: function() {
                var t = this._canvas.getWebGLContext({
                  failIfMajorPerformanceCaveat: this.options
                    .failIfMajorPerformanceCaveat,
                  preserveDrawingBuffer: this.options.preserveDrawingBuffer
                });
                return t
                  ? void (this.painter = new Painter(t, this.transform))
                  : void console.error("Failed to initialize WebGL");
              },
              _contextLost: function(t) {
                t.preventDefault(),
                  this._frameId && browser.cancelFrame(this._frameId),
                  this.fire("webglcontextlost", { originalEvent: t });
              },
              _contextRestored: function(t) {
                this._setupPainter(),
                  this.resize(),
                  this._update(),
                  this.fire("webglcontextrestored", { originalEvent: t });
              },
              loaded: function() {
                return this._styleDirty || this._sourcesDirty
                  ? !1
                  : this.style && !this.style.loaded()
                  ? !1
                  : !0;
              },
              _update: function(t) {
                return this.style
                  ? ((this._styleDirty = this._styleDirty || t),
                    (this._sourcesDirty = !0),
                    this._rerender(),
                    this)
                  : this;
              },
              _render: function() {
                return (
                  this.style &&
                    this._styleDirty &&
                    ((this._styleDirty = !1),
                    this.style._recalculate(this.transform.zoom)),
                  this.style &&
                    this._sourcesDirty &&
                    !this._sourcesDirtyTimeout &&
                    ((this._sourcesDirty = !1),
                    (this._sourcesDirtyTimeout = setTimeout(
                      function() {
                        this._sourcesDirtyTimeout = null;
                      }.bind(this),
                      50
                    )),
                    this.style._updateSources(this.transform)),
                  this.painter.render(this.style, {
                    debug: this.debug,
                    vertices: this.vertices,
                    rotating: this.rotating,
                    zooming: this.zooming
                  }),
                  this.fire("render"),
                  this.loaded() &&
                    !this._loaded &&
                    ((this._loaded = !0), this.fire("load")),
                  (this._frameId = null),
                  this.animationLoop.stopped() || (this._styleDirty = !0),
                  (this._sourcesDirty ||
                    this._repaint ||
                    !this.animationLoop.stopped()) &&
                    this._rerender(),
                  this
                );
              },
              remove: function() {
                this._hash && this._hash.remove(),
                  browser.cancelFrame(this._frameId),
                  clearTimeout(this._sourcesDirtyTimeout),
                  this.setStyle(null),
                  "undefined" != typeof window &&
                    window.removeEventListener(
                      "resize",
                      this._onWindowResize,
                      !1
                    ),
                  removeNode(this._canvasContainer),
                  removeNode(this._controlContainer),
                  this._container.classList.remove("mapboxgl-map");
              },
              onError: function(t) {
                console.error(t.error);
              },
              _rerender: function() {
                this.style &&
                  !this._frameId &&
                  (this._frameId = browser.frame(this._render));
              },
              _forwardStyleEvent: function(t) {
                this.fire(
                  "style." + t.type,
                  util.extend({ style: t.target }, t)
                );
              },
              _forwardSourceEvent: function(t) {
                this.fire(t.type, util.extend({ style: t.target }, t));
              },
              _forwardLayerEvent: function(t) {
                this.fire(t.type, util.extend({ style: t.target }, t));
              },
              _forwardTileEvent: function(t) {
                this.fire(t.type, util.extend({ style: t.target }, t));
              },
              _onStyleLoad: function(t) {
                this.transform.unmodified && this.jumpTo(this.style.stylesheet),
                  this.style._cascade(this._classes, { transition: !1 }),
                  this._forwardStyleEvent(t);
              },
              _onStyleChange: function(t) {
                this._update(!0), this._forwardStyleEvent(t);
              },
              _onSourceAdd: function(t) {
                var e = t.source;
                e.onAdd && e.onAdd(this), this._forwardSourceEvent(t);
              },
              _onSourceRemove: function(t) {
                var e = t.source;
                e.onRemove && e.onRemove(this), this._forwardSourceEvent(t);
              },
              _onSourceUpdate: function(t) {
                this._update(), this._forwardSourceEvent(t);
              },
              _onWindowResize: function() {
                this.stop()
                  .resize()
                  ._update();
              }
            }),
            util.extendAll(Map.prototype, {
              _debug: !1,
              get debug() {
                return this._debug;
              },
              set debug(t) {
                this._debug !== t && ((this._debug = t), this._update());
              },
              _collisionDebug: !1,
              get collisionDebug() {
                return this._collisionDebug;
              },
              set collisionDebug(t) {
                this._collisionDebug !== t &&
                  ((this._collisionDebug = t), this.style._redoPlacement());
              },
              _repaint: !1,
              get repaint() {
                return this._repaint;
              },
              set repaint(t) {
                (this._repaint = t), this._update();
              },
              _vertices: !1,
              get vertices() {
                return this._vertices;
              },
              set vertices(t) {
                (this._vertices = t), this._update();
              }
            });
        },
        {
          "../geo/lng_lat": 10,
          "../geo/lng_lat_bounds": 11,
          "../geo/transform": 12,
          "../render/painter": 26,
          "../style/animation_loop": 40,
          "../style/style": 44,
          "../util/browser": 87,
          "../util/canvas": 88,
          "../util/dom": 90,
          "../util/evented": 92,
          "../util/util": 98,
          "./camera": 70,
          "./control/attribution": 71,
          "./hash": 81,
          "./interaction": 82,
          "point-geometry": 133
        }
      ],
      84: [
        function(require, module, exports) {
          "use strict";
          function Popup(t) {
            util.setOptions(this, t),
              util.bindAll(["_update", "_onClickClose"], this);
          }
          module.exports = Popup;
          var util = require("../util/util"),
            Evented = require("../util/evented"),
            DOM = require("../util/dom"),
            LngLat = require("../geo/lng_lat");
          Popup.prototype = util.inherit(Evented, {
            options: { closeButton: !0, closeOnClick: !0 },
            addTo: function(t) {
              return (
                (this._map = t),
                this._map.on("move", this._update),
                this.options.closeOnClick &&
                  this._map.on("click", this._onClickClose),
                this._update(),
                this
              );
            },
            remove: function() {
              return (
                this._content &&
                  this._content.parentNode &&
                  this._content.parentNode.removeChild(this._content),
                this._container &&
                  (this._container.parentNode.removeChild(this._container),
                  delete this._container),
                this._map &&
                  (this._map.off("move", this._update),
                  this._map.off("click", this._onClickClose),
                  delete this._map),
                this
              );
            },
            getLngLat: function() {
              return this._lngLat;
            },
            setLngLat: function(t) {
              return (this._lngLat = LngLat.convert(t)), this._update(), this;
            },
            setText: function(t) {
              return (
                this._createContent(),
                this._content.appendChild(document.createTextNode(t)),
                this._update(),
                this
              );
            },
            setHTML: function(t) {
              this._createContent();
              var e,
                n = document.createElement("body");
              for (n.innerHTML = t; ; ) {
                if (((e = n.firstChild), !e)) break;
                this._content.appendChild(e);
              }
              return this._update(), this;
            },
            _createContent: function() {
              this._content &&
                this._content.parentNode &&
                this._content.parentNode.removeChild(this._content),
                (this._content = DOM.create(
                  "div",
                  "mapboxgl-popup-content",
                  this._container
                )),
                this.options.closeButton &&
                  ((this._closeButton = DOM.create(
                    "button",
                    "mapboxgl-popup-close-button",
                    this._content
                  )),
                  (this._closeButton.innerHTML = "&#215;"),
                  this._closeButton.addEventListener(
                    "click",
                    this._onClickClose
                  ));
            },
            _update: function() {
              if (this._map && this._lngLat && this._content) {
                this._container ||
                  ((this._container = DOM.create(
                    "div",
                    "mapboxgl-popup",
                    this._map.getContainer()
                  )),
                  (this._tip = DOM.create(
                    "div",
                    "mapboxgl-popup-tip",
                    this._container
                  )),
                  this._container.appendChild(this._content));
                var t = this._map.project(this._lngLat).round(),
                  e = this.options.anchor;
                if (!e) {
                  var n = this._container.offsetWidth,
                    i = this._container.offsetHeight;
                  (e =
                    t.y < i
                      ? ["top"]
                      : t.y > this._map.transform.height - i
                      ? ["bottom"]
                      : []),
                    t.x < n / 2
                      ? e.push("left")
                      : t.x > this._map.transform.width - n / 2 &&
                        e.push("right"),
                    (e = 0 === e.length ? "bottom" : e.join("-"));
                }
                var o = {
                    top: "translate(-50%,0)",
                    "top-left": "translate(0,0)",
                    "top-right": "translate(-100%,0)",
                    bottom: "translate(-50%,-100%)",
                    "bottom-left": "translate(0,-100%)",
                    "bottom-right": "translate(-100%,-100%)",
                    left: "translate(0,-50%)",
                    right: "translate(-100%,-50%)"
                  },
                  s = this._container.classList;
                for (var a in o) s.remove("mapboxgl-popup-anchor-" + a);
                s.add("mapboxgl-popup-anchor-" + e),
                  DOM.setTransform(
                    this._container,
                    o[e] + " translate(" + t.x + "px," + t.y + "px)"
                  );
              }
            },
            _onClickClose: function() {
              this.remove();
            }
          });
        },
        {
          "../geo/lng_lat": 10,
          "../util/dom": 90,
          "../util/evented": 92,
          "../util/util": 98
        }
      ],
      85: [
        function(require, module, exports) {
          "use strict";
          function Actor(t, e) {
            (this.target = t),
              (this.parent = e),
              (this.callbacks = {}),
              (this.callbackID = 0),
              (this.receive = this.receive.bind(this)),
              this.target.addEventListener("message", this.receive, !1);
          }
          (module.exports = Actor),
            (Actor.prototype.receive = function(t) {
              var e,
                s = t.data;
              if ("<response>" === s.type)
                (e = this.callbacks[s.id]),
                  delete this.callbacks[s.id],
                  e(s.error || null, s.data);
              else if ("undefined" != typeof s.id) {
                var i = s.id;
                this.parent[s.type](
                  s.data,
                  function(t, e, s) {
                    this.postMessage(
                      {
                        type: "<response>",
                        id: String(i),
                        error: t ? String(t) : null,
                        data: e
                      },
                      s
                    );
                  }.bind(this)
                );
              } else this.parent[s.type](s.data);
            }),
            (Actor.prototype.send = function(t, e, s, i) {
              var a = null;
              s && (this.callbacks[(a = this.callbackID++)] = s),
                this.postMessage({ type: t, id: String(a), data: e }, i);
            }),
            (Actor.prototype.postMessage = function(t, e) {
              try {
                this.target.postMessage(t, e);
              } catch (s) {
                this.target.postMessage(t);
              }
            });
        },
        {}
      ],
      86: [
        function(require, module, exports) {
          "use strict";
          function sameOrigin(e) {
            var t = document.createElement("a");
            return (
              (t.href = e),
              t.protocol === document.location.protocol &&
                t.host === document.location.host
            );
          }
          (exports.getJSON = function(e, t) {
            var n = new XMLHttpRequest();
            return (
              n.open("GET", e, !0),
              n.setRequestHeader("Accept", "application/json"),
              (n.onerror = function(e) {
                t(e);
              }),
              (n.onload = function() {
                if (n.status >= 200 && n.status < 300 && n.response) {
                  var e;
                  try {
                    e = JSON.parse(n.response);
                  } catch (r) {
                    return t(r);
                  }
                  t(null, e);
                } else t(new Error(n.statusText));
              }),
              n.send(),
              n
            );
          }),
            (exports.getArrayBuffer = function(e, t) {
              var n = new XMLHttpRequest();
              return (
                n.open("GET", e, !0),
                (n.responseType = "arraybuffer"),
                (n.onerror = function(e) {
                  t(e);
                }),
                (n.onload = function() {
                  n.status >= 200 && n.status < 300 && n.response
                    ? t(null, n.response)
                    : t(new Error(n.statusText));
                }),
                n.send(),
                n
              );
            }),
            (exports.getImage = function(e, t) {
              return exports.getArrayBuffer(e, function(e, n) {
                if (e) return t(e);
                var r = new Image();
                r.onload = function() {
                  t(null, r),
                    (window.URL || window.webkitURL).revokeObjectURL(r.src);
                };
                var o = new Blob([new Uint8Array(n)], { type: "image/png" });
                return (
                  (r.src = (window.URL || window.webkitURL).createObjectURL(o)),
                  (r.getData = function() {
                    var e = document.createElement("canvas"),
                      t = e.getContext("2d");
                    return (
                      (e.width = r.width),
                      (e.height = r.height),
                      t.drawImage(r, 0, 0),
                      t.getImageData(0, 0, r.width, r.height).data
                    );
                  }),
                  r
                );
              });
            }),
            (exports.getVideo = function(e, t) {
              var n = document.createElement("video");
              n.onloadstart = function() {
                t(null, n);
              };
              for (var r = 0; r < e.length; r++) {
                var o = document.createElement("source");
                sameOrigin(e[r]) || (n.crossOrigin = "Anonymous"),
                  (o.src = e[r]),
                  n.appendChild(o);
              }
              return (
                (n.getData = function() {
                  return n;
                }),
                n
              );
            });
        },
        {}
      ],
      87: [
        function(require, module, exports) {
          "use strict";
          var Canvas = require("./canvas"),
            frame =
              window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame;
          exports.frame = function(e) {
            return frame(e);
          };
          var cancel =
            window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.msCancelAnimationFrame;
          (exports.cancelFrame = function(e) {
            cancel(e);
          }),
            (exports.timed = function(e, r, t) {
              function n(a) {
                o ||
                  (window.performance || (a = Date.now()),
                  a >= i + r
                    ? e.call(t, 1)
                    : (e.call(t, (a - i) / r), exports.frame(n)));
              }
              if (!r) return e.call(t, 1), null;
              var o = !1,
                i = window.performance ? window.performance.now() : Date.now();
              return (
                exports.frame(n),
                function() {
                  o = !0;
                }
              );
            }),
            (exports.supported = function(e) {
              for (
                var r = [
                    function() {
                      return "undefined" != typeof window;
                    },
                    function() {
                      return "undefined" != typeof document;
                    },
                    function() {
                      return !!(
                        Array.prototype &&
                        Array.prototype.every &&
                        Array.prototype.filter &&
                        Array.prototype.forEach &&
                        Array.prototype.indexOf &&
                        Array.prototype.lastIndexOf &&
                        Array.prototype.map &&
                        Array.prototype.some &&
                        Array.prototype.reduce &&
                        Array.prototype.reduceRight &&
                        Array.isArray
                      );
                    },
                    function() {
                      return !(
                        !Function.prototype ||
                        !Function.prototype.bind ||
                        !(
                          Object.keys &&
                          Object.create &&
                          Object.getPrototypeOf &&
                          Object.getOwnPropertyNames &&
                          Object.isSealed &&
                          Object.isFrozen &&
                          Object.isExtensible &&
                          Object.getOwnPropertyDescriptor &&
                          Object.defineProperty &&
                          Object.defineProperties &&
                          Object.seal &&
                          Object.freeze &&
                          Object.preventExtensions
                        )
                      );
                    },
                    function() {
                      return (
                        ("JSON" in window) &&
                        ("parse" in JSON) &&
                        ("stringify" in JSON)
                      );
                    },
                    function() {
                      return new Canvas().supportsWebGLContext(
                        (e && e.failIfMajorPerformanceCaveat) || !1
                      );
                    },
                    function() {
                      return ("Worker" in window);
                    }
                  ],
                  t = 0;
                t < r.length;
                t++
              )
                if (!r[t]()) return !1;
              return !0;
            }),
            (exports.hardwareConcurrency = navigator.hardwareConcurrency || 8),
            Object.defineProperty(exports, "devicePixelRatio", {
              get: function() {
                return window.devicePixelRatio;
              }
            }),
            (exports.supportsWebp = !1);
          var webpImgTest = document.createElement("img");
          (webpImgTest.onload = function() {
            exports.supportsWebp = !0;
          }),
            (webpImgTest.src =
              "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=");
        },
        { "./canvas": 88 }
      ],
      88: [
        function(require, module, exports) {
          "use strict";
          function Canvas(t, e) {
            (this.canvas = document.createElement("canvas")),
              t &&
                e &&
                ((this.canvas.style.position = "absolute"),
                this.canvas.classList.add("mapboxgl-canvas"),
                this.canvas.addEventListener(
                  "webglcontextlost",
                  t._contextLost.bind(t),
                  !1
                ),
                this.canvas.addEventListener(
                  "webglcontextrestored",
                  t._contextRestored.bind(t),
                  !1
                ),
                this.canvas.setAttribute("tabindex", 0),
                e.appendChild(this.canvas));
          }
          var util = require("../util");
          (module.exports = Canvas),
            (Canvas.prototype.resize = function(t, e) {
              var a = window.devicePixelRatio || 1;
              (this.canvas.width = a * t),
                (this.canvas.height = a * e),
                (this.canvas.style.width = t + "px"),
                (this.canvas.style.height = e + "px");
            });
          var requiredContextAttributes = {
            antialias: !1,
            alpha: !0,
            stencil: !0,
            depth: !0
          };
          (Canvas.prototype.getWebGLContext = function(t) {
            return (
              (t = util.extend({}, t, requiredContextAttributes)),
              this.canvas.getContext("webgl", t) ||
                this.canvas.getContext("experimental-webgl", t)
            );
          }),
            (Canvas.prototype.supportsWebGLContext = function(t) {
              var e = util.extend(
                { failIfMajorPerformanceCaveat: t },
                requiredContextAttributes
              );
              return "probablySupportsContext" in this.canvas
                ? this.canvas.probablySupportsContext("webgl", e) ||
                    this.canvas.probablySupportsContext("experimental-webgl", e)
                : "supportsContext" in this.canvas
                ? this.canvas.supportsContext("webgl", e) ||
                  this.canvas.supportsContext("experimental-webgl", e)
                : !!window.WebGLRenderingContext && !!this.getWebGLContext(t);
            }),
            (Canvas.prototype.getElement = function() {
              return this.canvas;
            });
        },
        { "../util": 98 }
      ],
      89: [
        function(require, module, exports) {
          "use strict";
          function Dispatcher(r, t) {
            (this.actors = []), (this.currentActor = 0);
            for (var e = 0; r > e; e++) {
              var o = new WebWorkify(require("../../source/worker")),
                s = new Actor(o, t);
              (s.name = "Worker " + e), this.actors.push(s);
            }
          }
          var Actor = require("../actor"),
            WebWorkify = require("webworkify");
          (module.exports = Dispatcher),
            (Dispatcher.prototype = {
              broadcast: function(r, t) {
                for (var e = 0; e < this.actors.length; e++)
                  this.actors[e].send(r, t);
              },
              send: function(r, t, e, o, s) {
                return (
                  ("number" != typeof o || isNaN(o)) &&
                    (o = this.currentActor =
                      (this.currentActor + 1) % this.actors.length),
                  this.actors[o].send(r, t, e, s),
                  o
                );
              },
              remove: function() {
                for (var r = 0; r < this.actors.length; r++)
                  this.actors[r].target.terminate();
                this.actors = [];
              }
            });
        },
        { "../../source/worker": 38, "../actor": 85, webworkify: 143 }
      ],
      90: [
        function(require, module, exports) {
          "use strict";
          function testProp(e) {
            for (var t = 0; t < e.length; t++)
              if (e[t] in docStyle) return e[t];
          }
          function suppressClick(e) {
            e.preventDefault(),
              e.stopPropagation(),
              window.removeEventListener("click", suppressClick, !0);
          }
          var Point = require("point-geometry");
          exports.create = function(e, t, r) {
            var o = document.createElement(e);
            return t && (o.className = t), r && r.appendChild(o), o;
          };
          var docStyle = document.documentElement.style,
            selectProp = testProp([
              "userSelect",
              "MozUserSelect",
              "WebkitUserSelect",
              "msUserSelect"
            ]),
            userSelect;
          (exports.disableDrag = function() {
            selectProp &&
              ((userSelect = docStyle[selectProp]),
              (docStyle[selectProp] = "none"));
          }),
            (exports.enableDrag = function() {
              selectProp && (docStyle[selectProp] = userSelect);
            });
          var transformProp = testProp(["transform", "WebkitTransform"]);
          (exports.setTransform = function(e, t) {
            e.style[transformProp] = t;
          }),
            (exports.suppressClick = function() {
              window.addEventListener("click", suppressClick, !0),
                window.setTimeout(function() {
                  window.removeEventListener("click", suppressClick, !0);
                }, 0);
            }),
            (exports.mousePos = function(e, t) {
              var r = e.getBoundingClientRect();
              return (
                (t = t.touches ? t.touches[0] : t),
                new Point(
                  t.clientX - r.left - e.clientLeft,
                  t.clientY - r.top - e.clientTop
                )
              );
            });
        },
        { "point-geometry": 133 }
      ],
      91: [
        function(require, module, exports) {
          "use strict";
          module.exports = {
            API_URL: "https://api.mapbox.com",
            REQUIRE_ACCESS_TOKEN: !0
          };
        },
        {}
      ],
      92: [
        function(require, module, exports) {
          "use strict";
          var util = require("./util"),
            Evented = {
              on: function(t, e) {
                return (
                  (this._events = this._events || {}),
                  (this._events[t] = this._events[t] || []),
                  this._events[t].push(e),
                  this
                );
              },
              off: function(t, e) {
                if (!t) return delete this._events, this;
                if (!this.listens(t)) return this;
                if (e) {
                  var s = this._events[t].indexOf(e);
                  s >= 0 && this._events[t].splice(s, 1),
                    this._events[t].length || delete this._events[t];
                } else delete this._events[t];
                return this;
              },
              once: function(t, e) {
                var s = function(i) {
                  this.off(t, s), e.call(this, i);
                }.bind(this);
                return this.on(t, s), this;
              },
              fire: function(t, e) {
                if (!this.listens(t)) return this;
                (e = util.extend({}, e)),
                  util.extend(e, { type: t, target: this });
                for (var s = this._events[t].slice(), i = 0; i < s.length; i++)
                  s[i].call(this, e);
                return this;
              },
              listens: function(t) {
                return !(!this._events || !this._events[t]);
              }
            };
          module.exports = Evented;
        },
        { "./util": 98 }
      ],
      93: [
        function(require, module, exports) {
          "use strict";
          function Glyphs(a, e) {
            this.stacks = a.readFields(readFontstacks, [], e);
          }
          function readFontstacks(a, e, r) {
            if (1 === a) {
              var t = r.readMessage(readFontstack, { glyphs: {} });
              e.push(t);
            }
          }
          function readFontstack(a, e, r) {
            if (1 === a) e.name = r.readString();
            else if (2 === a) e.range = r.readString();
            else if (3 === a) {
              var t = r.readMessage(readGlyph, {});
              e.glyphs[t.id] = t;
            }
          }
          function readGlyph(a, e, r) {
            1 === a
              ? (e.id = r.readVarint())
              : 2 === a
              ? (e.bitmap = r.readBytes())
              : 3 === a
              ? (e.width = r.readVarint())
              : 4 === a
              ? (e.height = r.readVarint())
              : 5 === a
              ? (e.left = r.readSVarint())
              : 6 === a
              ? (e.top = r.readSVarint())
              : 7 === a && (e.advance = r.readVarint());
          }
          module.exports = Glyphs;
        },
        {}
      ],
      94: [
        function(require, module, exports) {
          "use strict";
          function interpolate(t, e, n) {
            return t * (1 - n) + e * n;
          }
          (module.exports = interpolate),
            (interpolate.number = interpolate),
            (interpolate.vec2 = function(t, e, n) {
              return [interpolate(t[0], e[0], n), interpolate(t[1], e[1], n)];
            }),
            (interpolate.color = function(t, e, n) {
              return [
                interpolate(t[0], e[0], n),
                interpolate(t[1], e[1], n),
                interpolate(t[2], e[2], n),
                interpolate(t[3], e[3], n)
              ];
            }),
            (interpolate.array = function(t, e, n) {
              return t.map(function(t, r) {
                return interpolate(t, e[r], n);
              });
            });
        },
        {}
      ],
      95: [
        function(require, module, exports) {
          "use strict";
          function normalizeURL(e, r, o) {
            if (
              ((o = o || config.ACCESS_TOKEN),
              !o && config.REQUIRE_ACCESS_TOKEN)
            )
              throw new Error(
                "An API access token is required to use Mapbox GL. See https://www.mapbox.com/developers/api/#access-tokens"
              );
            if (
              ((e = e.replace(/^mapbox:\/\//, config.API_URL + r)),
              (e +=
                -1 !== e.indexOf("?") ? "&access_token=" : "?access_token="),
              config.REQUIRE_ACCESS_TOKEN)
            ) {
              if ("s" === o[0])
                throw new Error(
                  "Use a public access token (pk.*) with Mapbox GL JS, not a secret access token (sk.*). See https://www.mapbox.com/developers/api/#access-tokens"
                );
              e += o;
            }
            return e;
          }
          var config = require("./config"),
            browser = require("./browser");
          (module.exports.normalizeStyleURL = function(e, r) {
            if (!e.match(/^mapbox:\/\/styles\//)) return e;
            var o = e.split("/"),
              t = o[3],
              s = o[4],
              n = o[5] ? "/draft" : "";
            return normalizeURL(
              "mapbox://" + t + "/" + s + n,
              "/styles/v1/",
              r
            );
          }),
            (module.exports.normalizeSourceURL = function(e, r) {
              return e.match(/^mapbox:\/\//)
                ? normalizeURL(e + ".json", "/v4/", r) + "&secure"
                : e;
            }),
            (module.exports.normalizeGlyphsURL = function(e, r) {
              if (!e.match(/^mapbox:\/\//)) return e;
              var o = e.split("/")[3];
              return normalizeURL(
                "mapbox://" + o + "/{fontstack}/{range}.pbf",
                "/fonts/v1/",
                r
              );
            }),
            (module.exports.normalizeSpriteURL = function(e, r, o, t) {
              if (!e.match(/^mapbox:\/\/sprites\//)) return e + r + o;
              var s = e.split("/"),
                n = s[3],
                a = s[4],
                i = s[5] ? "/draft" : "";
              return normalizeURL(
                "mapbox://" + n + "/" + a + i + "/sprite" + r + o,
                "/styles/v1/",
                t
              );
            }),
            (module.exports.normalizeTileURL = function(e, r) {
              if (!r || !r.match(/^mapbox:\/\//)) return e;
              e = e.replace(
                /([?&]access_token=)tk\.[^&]+/,
                "$1" + config.ACCESS_TOKEN
              );
              var o = browser.supportsWebp ? "webp" : "$1";
              return e.replace(
                /\.((?:png|jpg)\d*)(?=$|\?)/,
                browser.devicePixelRatio >= 2 ? "@2x." + o : "." + o
              );
            });
        },
        { "./browser": 87, "./config": 91 }
      ],
      96: [
        function(require, module, exports) {
          "use strict";
          function MRUCache(t, e) {
            (this.max = t), (this.onRemove = e), this.reset();
          }
          (module.exports = MRUCache),
            (MRUCache.prototype.reset = function() {
              for (var t in this.list) this.onRemove(this.list[t]);
              return (this.list = {}), (this.order = []), this;
            }),
            (MRUCache.prototype.add = function(t, e) {
              if (
                ((this.list[t] = e),
                this.order.push(t),
                this.order.length > this.max)
              ) {
                var i = this.get(this.order[0]);
                i && this.onRemove(i);
              }
              return this;
            }),
            (MRUCache.prototype.has = function(t) {
              return t in this.list;
            }),
            (MRUCache.prototype.keys = function() {
              return this.order;
            }),
            (MRUCache.prototype.get = function(t) {
              if (!this.has(t)) return null;
              var e = this.list[t];
              return (
                delete this.list[t],
                this.order.splice(this.order.indexOf(t), 1),
                e
              );
            });
        },
        {}
      ],
      97: [
        function(require, module, exports) {
          "use strict";
          function resolveTokens(e, n) {
            return n.replace(/{([^{}()\[\]<>$=:;.,^]+)}/g, function(n, r) {
              return r in e ? e[r] : "";
            });
          }
          module.exports = resolveTokens;
        },
        {}
      ],
      98: [
        function(require, module, exports) {
          "use strict";
          var UnitBezier = require("unitbezier"),
            Coordinate = require("../geo/coordinate");
          (exports.easeCubicInOut = function(n) {
            if (0 >= n) return 0;
            if (n >= 1) return 1;
            var t = n * n,
              r = t * n;
            return 4 * (0.5 > n ? r : 3 * (n - t) + r - 0.75);
          }),
            (exports.bezier = function(n, t, r, e) {
              var o = new UnitBezier(n, t, r, e);
              return function(n) {
                return o.solve(n);
              };
            }),
            (exports.ease = exports.bezier(0.25, 0.1, 0.25, 1)),
            (exports.premultiply = function(n, t) {
              if (!n) return null;
              var r = n[3] * t;
              return [n[0] * r, n[1] * r, n[2] * r, r];
            }),
            (exports.clamp = function(n, t, r) {
              return Math.min(r, Math.max(t, n));
            }),
            (exports.wrap = function(n, t, r) {
              var e = r - t,
                o = ((((n - t) % e) + e) % e) + t;
              return o === t ? r : o;
            }),
            (exports.coalesce = function() {
              for (var n = 0; n < arguments.length; n++) {
                var t = arguments[n];
                if (null !== t && void 0 !== t) return t;
              }
            }),
            (exports.asyncAll = function(n, t, r) {
              if (!n.length) return r(null, []);
              var e = n.length,
                o = new Array(n.length),
                i = null;
              n.forEach(function(n, u) {
                t(n, function(n, t) {
                  n && (i = n), (o[u] = t), 0 === --e && r(i, o);
                });
              });
            }),
            (exports.keysDifference = function(n, t) {
              var r = [];
              for (var e in n) e in t || r.push(e);
              return r;
            }),
            (exports.extend = function(n) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var e in r) n[e] = r[e];
              }
              return n;
            }),
            (exports.extendAll = function(n, t) {
              for (var r in t)
                Object.defineProperty(
                  n,
                  r,
                  Object.getOwnPropertyDescriptor(t, r)
                );
              return n;
            }),
            (exports.inherit = function(n, t) {
              var r = "function" == typeof n ? n.prototype : n,
                e = Object.create(r);
              return exports.extendAll(e, t), e;
            }),
            (exports.pick = function(n, t) {
              for (var r = {}, e = 0; e < t.length; e++) {
                var o = t[e];
                o in n && (r[o] = n[o]);
              }
              return r;
            });
          var id = 1;
          (exports.uniqueId = function() {
            return id++;
          }),
            (exports.throttle = function(n, t, r) {
              var e, o, i, u;
              return (
                (u = function() {
                  (e = !1), o && (i.apply(r, o), (o = !1));
                }),
                (i = function() {
                  e
                    ? (o = arguments)
                    : (n.apply(r, arguments), setTimeout(u, t), (e = !0));
                })
              );
            }),
            (exports.debounce = function(n, t) {
              var r, e;
              return function() {
                (e = arguments),
                  clearTimeout(r),
                  (r = setTimeout(function() {
                    n.apply(null, e);
                  }, t));
              };
            }),
            (exports.bindAll = function(n, t) {
              n.forEach(function(n) {
                t[n] = t[n].bind(t);
              });
            }),
            (exports.bindHandlers = function(n) {
              for (var t in n)
                "function" == typeof n[t] &&
                  0 === t.indexOf("_on") &&
                  (n[t] = n[t].bind(n));
            }),
            (exports.setOptions = function(n, t) {
              n.hasOwnProperty("options") ||
                (n.options = n.options ? Object.create(n.options) : {});
              for (var r in t) n.options[r] = t[r];
              return n.options;
            }),
            (exports.getCoordinatesCenter = function(n) {
              for (
                var t = 1 / 0, r = 1 / 0, e = -(1 / 0), o = -(1 / 0), i = 0;
                i < n.length;
                i++
              )
                (t = Math.min(t, n[i].column)),
                  (r = Math.min(r, n[i].row)),
                  (e = Math.max(e, n[i].column)),
                  (o = Math.max(o, n[i].row));
              var u = e - t,
                a = o - r,
                s = Math.max(u, a);
              return new Coordinate((t + e) / 2, (r + o) / 2, 0).zoomTo(
                Math.floor(-Math.log(s) / Math.LN2)
              );
            }),
            (exports.endsWith = function(n, t) {
              return -1 !== n.indexOf(t, n.length - t.length);
            }),
            (exports.startsWith = function(n, t) {
              return 0 === n.indexOf(t);
            }),
            (exports.mapObject = function(n, t, r) {
              var e = {};
              for (var o in n) e[o] = t.call(r || this, n[o], o, n);
              return e;
            });
        },
        { "../geo/coordinate": 9, unitbezier: 137 }
      ],
      99: [
        function(require, module, exports) {
          "function" == typeof Object.create
            ? (module.exports = function(t, e) {
                (t.super_ = e),
                  (t.prototype = Object.create(e.prototype, {
                    constructor: {
                      value: t,
                      enumerable: !1,
                      writable: !0,
                      configurable: !0
                    }
                  }));
              })
            : (module.exports = function(t, e) {
                t.super_ = e;
                var o = function() {};
                (o.prototype = e.prototype),
                  (t.prototype = new o()),
                  (t.prototype.constructor = t);
              });
        },
        {}
      ],
      100: [
        function(require, module, exports) {
          (function(process) {
            function normalizeArray(r, t) {
              for (var e = 0, n = r.length - 1; n >= 0; n--) {
                var s = r[n];
                "." === s
                  ? r.splice(n, 1)
                  : ".." === s
                  ? (r.splice(n, 1), e++)
                  : e && (r.splice(n, 1), e--);
              }
              if (t) for (; e--; e) r.unshift("..");
              return r;
            }
            function filter(r, t) {
              if (r.filter) return r.filter(t);
              for (var e = [], n = 0; n < r.length; n++)
                t(r[n], n, r) && e.push(r[n]);
              return e;
            }
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
              splitPath = function(r) {
                return splitPathRe.exec(r).slice(1);
              };
            (exports.resolve = function() {
              for (
                var r = "", t = !1, e = arguments.length - 1;
                e >= -1 && !t;
                e--
              ) {
                var n = e >= 0 ? arguments[e] : process.cwd();
                if ("string" != typeof n)
                  throw new TypeError(
                    "Arguments to path.resolve must be strings"
                  );
                n && ((r = n + "/" + r), (t = "/" === n.charAt(0)));
              }
              return (
                (r = normalizeArray(
                  filter(r.split("/"), function(r) {
                    return !!r;
                  }),
                  !t
                ).join("/")),
                (t ? "/" : "") + r || "."
              );
            }),
              (exports.normalize = function(r) {
                var t = exports.isAbsolute(r),
                  e = "/" === substr(r, -1);
                return (
                  (r = normalizeArray(
                    filter(r.split("/"), function(r) {
                      return !!r;
                    }),
                    !t
                  ).join("/")),
                  r || t || (r = "."),
                  r && e && (r += "/"),
                  (t ? "/" : "") + r
                );
              }),
              (exports.isAbsolute = function(r) {
                return "/" === r.charAt(0);
              }),
              (exports.join = function() {
                var r = Array.prototype.slice.call(arguments, 0);
                return exports.normalize(
                  filter(r, function(r, t) {
                    if ("string" != typeof r)
                      throw new TypeError(
                        "Arguments to path.join must be strings"
                      );
                    return r;
                  }).join("/")
                );
              }),
              (exports.relative = function(r, t) {
                function e(r) {
                  for (var t = 0; t < r.length && "" === r[t]; t++);
                  for (var e = r.length - 1; e >= 0 && "" === r[e]; e--);
                  return t > e ? [] : r.slice(t, e - t + 1);
                }
                (r = exports.resolve(r).substr(1)),
                  (t = exports.resolve(t).substr(1));
                for (
                  var n = e(r.split("/")),
                    s = e(t.split("/")),
                    i = Math.min(n.length, s.length),
                    o = i,
                    u = 0;
                  i > u;
                  u++
                )
                  if (n[u] !== s[u]) {
                    o = u;
                    break;
                  }
                for (var l = [], u = o; u < n.length; u++) l.push("..");
                return (l = l.concat(s.slice(o))), l.join("/");
              }),
              (exports.sep = "/"),
              (exports.delimiter = ":"),
              (exports.dirname = function(r) {
                var t = splitPath(r),
                  e = t[0],
                  n = t[1];
                return e || n
                  ? (n && (n = n.substr(0, n.length - 1)), e + n)
                  : ".";
              }),
              (exports.basename = function(r, t) {
                var e = splitPath(r)[2];
                return (
                  t &&
                    e.substr(-1 * t.length) === t &&
                    (e = e.substr(0, e.length - t.length)),
                  e
                );
              }),
              (exports.extname = function(r) {
                return splitPath(r)[3];
              });
            var substr =
              "b" === "ab".substr(-1)
                ? function(r, t, e) {
                    return r.substr(t, e);
                  }
                : function(r, t, e) {
                    return 0 > t && (t = r.length + t), r.substr(t, e);
                  };
          }.call(this, require("_process")));
        },
        { _process: 101 }
      ],
      101: [
        function(require, module, exports) {
          function cleanUpNextTick() {
            (draining = !1),
              currentQueue.length
                ? (queue = currentQueue.concat(queue))
                : (queueIndex = -1),
              queue.length && drainQueue();
          }
          function drainQueue() {
            if (!draining) {
              var e = setTimeout(cleanUpNextTick);
              draining = !0;
              for (var n = queue.length; n; ) {
                for (currentQueue = queue, queue = []; ++queueIndex < n; )
                  currentQueue && currentQueue[queueIndex].run();
                (queueIndex = -1), (n = queue.length);
              }
              (currentQueue = null), (draining = !1), clearTimeout(e);
            }
          }
          function Item(e, n) {
            (this.fun = e), (this.array = n);
          }
          function noop() {}
          var process = (module.exports = {}),
            queue = [],
            draining = !1,
            currentQueue,
            queueIndex = -1;
          (process.nextTick = function(e) {
            var n = new Array(arguments.length - 1);
            if (arguments.length > 1)
              for (var r = 1; r < arguments.length; r++)
                n[r - 1] = arguments[r];
            queue.push(new Item(e, n)),
              1 !== queue.length || draining || setTimeout(drainQueue, 0);
          }),
            (Item.prototype.run = function() {
              this.fun.apply(null, this.array);
            }),
            (process.title = "browser"),
            (process.browser = !0),
            (process.env = {}),
            (process.argv = []),
            (process.version = ""),
            (process.versions = {}),
            (process.on = noop),
            (process.addListener = noop),
            (process.once = noop),
            (process.off = noop),
            (process.removeListener = noop),
            (process.removeAllListeners = noop),
            (process.emit = noop),
            (process.binding = function(e) {
              throw new Error("process.binding is not supported");
            }),
            (process.cwd = function() {
              return "/";
            }),
            (process.chdir = function(e) {
              throw new Error("process.chdir is not supported");
            }),
            (process.umask = function() {
              return 0;
            });
        },
        {}
      ],
      102: [
        function(require, module, exports) {
          module.exports = function(o) {
            return (
              o &&
              "object" == typeof o &&
              "function" == typeof o.copy &&
              "function" == typeof o.fill &&
              "function" == typeof o.readUInt8
            );
          };
        },
        {}
      ],
      103: [
        function(require, module, exports) {
          (function(process, global) {
            function inspect(e, r) {
              var t = { seen: [], stylize: stylizeNoColor };
              return (
                arguments.length >= 3 && (t.depth = arguments[2]),
                arguments.length >= 4 && (t.colors = arguments[3]),
                isBoolean(r) ? (t.showHidden = r) : r && exports._extend(t, r),
                isUndefined(t.showHidden) && (t.showHidden = !1),
                isUndefined(t.depth) && (t.depth = 2),
                isUndefined(t.colors) && (t.colors = !1),
                isUndefined(t.customInspect) && (t.customInspect = !0),
                t.colors && (t.stylize = stylizeWithColor),
                formatValue(t, e, t.depth)
              );
            }
            function stylizeWithColor(e, r) {
              var t = inspect.styles[r];
              return t
                ? "[" +
                    inspect.colors[t][0] +
                    "m" +
                    e +
                    "[" +
                    inspect.colors[t][1] +
                    "m"
                : e;
            }
            function stylizeNoColor(e, r) {
              return e;
            }
            function arrayToHash(e) {
              var r = {};
              return (
                e.forEach(function(e, t) {
                  r[e] = !0;
                }),
                r
              );
            }
            function formatValue(e, r, t) {
              if (
                e.customInspect &&
                r &&
                isFunction(r.inspect) &&
                r.inspect !== exports.inspect &&
                (!r.constructor || r.constructor.prototype !== r)
              ) {
                var n = r.inspect(t, e);
                return isString(n) || (n = formatValue(e, n, t)), n;
              }
              var i = formatPrimitive(e, r);
              if (i) return i;
              var o = Object.keys(r),
                s = arrayToHash(o);
              if (
                (e.showHidden && (o = Object.getOwnPropertyNames(r)),
                isError(r) &&
                  (o.indexOf("message") >= 0 || o.indexOf("description") >= 0))
              )
                return formatError(r);
              if (0 === o.length) {
                if (isFunction(r)) {
                  var u = r.name ? ": " + r.name : "";
                  return e.stylize("[Function" + u + "]", "special");
                }
                if (isRegExp(r))
                  return e.stylize(RegExp.prototype.toString.call(r), "regexp");
                if (isDate(r))
                  return e.stylize(Date.prototype.toString.call(r), "date");
                if (isError(r)) return formatError(r);
              }
              var a = "",
                c = !1,
                l = ["{", "}"];
              if ((isArray(r) && ((c = !0), (l = ["[", "]"])), isFunction(r))) {
                var p = r.name ? ": " + r.name : "";
                a = " [Function" + p + "]";
              }
              if (
                (isRegExp(r) && (a = " " + RegExp.prototype.toString.call(r)),
                isDate(r) && (a = " " + Date.prototype.toUTCString.call(r)),
                isError(r) && (a = " " + formatError(r)),
                0 === o.length && (!c || 0 == r.length))
              )
                return l[0] + a + l[1];
              if (0 > t)
                return isRegExp(r)
                  ? e.stylize(RegExp.prototype.toString.call(r), "regexp")
                  : e.stylize("[Object]", "special");
              e.seen.push(r);
              var f;
              return (
                (f = c
                  ? formatArray(e, r, t, s, o)
                  : o.map(function(n) {
                      return formatProperty(e, r, t, s, n, c);
                    })),
                e.seen.pop(),
                reduceToSingleString(f, a, l)
              );
            }
            function formatPrimitive(e, r) {
              if (isUndefined(r)) return e.stylize("undefined", "undefined");
              if (isString(r)) {
                var t =
                  "'" +
                  JSON.stringify(r)
                    .replace(/^"|"$/g, "")
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"') +
                  "'";
                return e.stylize(t, "string");
              }
              return isNumber(r)
                ? e.stylize("" + r, "number")
                : isBoolean(r)
                ? e.stylize("" + r, "boolean")
                : isNull(r)
                ? e.stylize("null", "null")
                : void 0;
            }
            function formatError(e) {
              return "[" + Error.prototype.toString.call(e) + "]";
            }
            function formatArray(e, r, t, n, i) {
              for (var o = [], s = 0, u = r.length; u > s; ++s)
                hasOwnProperty(r, String(s))
                  ? o.push(formatProperty(e, r, t, n, String(s), !0))
                  : o.push("");
              return (
                i.forEach(function(i) {
                  i.match(/^\d+$/) || o.push(formatProperty(e, r, t, n, i, !0));
                }),
                o
              );
            }
            function formatProperty(e, r, t, n, i, o) {
              var s, u, a;
              if (
                ((a = Object.getOwnPropertyDescriptor(r, i) || { value: r[i] }),
                a.get
                  ? (u = a.set
                      ? e.stylize("[Getter/Setter]", "special")
                      : e.stylize("[Getter]", "special"))
                  : a.set && (u = e.stylize("[Setter]", "special")),
                hasOwnProperty(n, i) || (s = "[" + i + "]"),
                u ||
                  (e.seen.indexOf(a.value) < 0
                    ? ((u = isNull(t)
                        ? formatValue(e, a.value, null)
                        : formatValue(e, a.value, t - 1)),
                      u.indexOf("\n") > -1 &&
                        (u = o
                          ? u
                              .split("\n")
                              .map(function(e) {
                                return "  " + e;
                              })
                              .join("\n")
                              .substr(2)
                          : "\n" +
                            u
                              .split("\n")
                              .map(function(e) {
                                return "   " + e;
                              })
                              .join("\n")))
                    : (u = e.stylize("[Circular]", "special"))),
                isUndefined(s))
              ) {
                if (o && i.match(/^\d+$/)) return u;
                (s = JSON.stringify("" + i)),
                  s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)
                    ? ((s = s.substr(1, s.length - 2)),
                      (s = e.stylize(s, "name")))
                    : ((s = s
                        .replace(/'/g, "\\'")
                        .replace(/\\"/g, '"')
                        .replace(/(^"|"$)/g, "'")),
                      (s = e.stylize(s, "string")));
              }
              return s + ": " + u;
            }
            function reduceToSingleString(e, r, t) {
              var n = 0,
                i = e.reduce(function(e, r) {
                  return (
                    n++,
                    r.indexOf("\n") >= 0 && n++,
                    e + r.replace(/\u001b\[\d\d?m/g, "").length + 1
                  );
                }, 0);
              return i > 60
                ? t[0] +
                    ("" === r ? "" : r + "\n ") +
                    " " +
                    e.join(",\n  ") +
                    " " +
                    t[1]
                : t[0] + r + " " + e.join(", ") + " " + t[1];
            }
            function isArray(e) {
              return Array.isArray(e);
            }
            function isBoolean(e) {
              return "boolean" == typeof e;
            }
            function isNull(e) {
              return null === e;
            }
            function isNullOrUndefined(e) {
              return null == e;
            }
            function isNumber(e) {
              return "number" == typeof e;
            }
            function isString(e) {
              return "string" == typeof e;
            }
            function isSymbol(e) {
              return "symbol" == typeof e;
            }
            function isUndefined(e) {
              return void 0 === e;
            }
            function isRegExp(e) {
              return isObject(e) && "[object RegExp]" === objectToString(e);
            }
            function isObject(e) {
              return "object" == typeof e && null !== e;
            }
            function isDate(e) {
              return isObject(e) && "[object Date]" === objectToString(e);
            }
            function isError(e) {
              return (
                isObject(e) &&
                ("[object Error]" === objectToString(e) || e instanceof Error)
              );
            }
            function isFunction(e) {
              return "function" == typeof e;
            }
            function isPrimitive(e) {
              return (
                null === e ||
                "boolean" == typeof e ||
                "number" == typeof e ||
                "string" == typeof e ||
                "symbol" == typeof e ||
                "undefined" == typeof e
              );
            }
            function objectToString(e) {
              return Object.prototype.toString.call(e);
            }
            function pad(e) {
              return 10 > e ? "0" + e.toString(10) : e.toString(10);
            }
            function timestamp() {
              var e = new Date(),
                r = [
                  pad(e.getHours()),
                  pad(e.getMinutes()),
                  pad(e.getSeconds())
                ].join(":");
              return [e.getDate(), months[e.getMonth()], r].join(" ");
            }
            function hasOwnProperty(e, r) {
              return Object.prototype.hasOwnProperty.call(e, r);
            }
            var formatRegExp = /%[sdj%]/g;
            (exports.format = function(e) {
              if (!isString(e)) {
                for (var r = [], t = 0; t < arguments.length; t++)
                  r.push(inspect(arguments[t]));
                return r.join(" ");
              }
              for (
                var t = 1,
                  n = arguments,
                  i = n.length,
                  o = String(e).replace(formatRegExp, function(e) {
                    if ("%%" === e) return "%";
                    if (t >= i) return e;
                    switch (e) {
                      case "%s":
                        return String(n[t++]);
                      case "%d":
                        return Number(n[t++]);
                      case "%j":
                        try {
                          return JSON.stringify(n[t++]);
                        } catch (r) {
                          return "[Circular]";
                        }
                      default:
                        return e;
                    }
                  }),
                  s = n[t];
                i > t;
                s = n[++t]
              )
                o += isNull(s) || !isObject(s) ? " " + s : " " + inspect(s);
              return o;
            }),
              (exports.deprecate = function(e, r) {
                function t() {
                  if (!n) {
                    if (process.throwDeprecation) throw new Error(r);
                    process.traceDeprecation
                      ? console.trace(r)
                      : console.error(r),
                      (n = !0);
                  }
                  return e.apply(this, arguments);
                }
                if (isUndefined(global.process))
                  return function() {
                    return exports.deprecate(e, r).apply(this, arguments);
                  };
                if (process.noDeprecation === !0) return e;
                var n = !1;
                return t;
              });
            var debugs = {},
              debugEnviron;
            (exports.debuglog = function(e) {
              if (
                (isUndefined(debugEnviron) &&
                  (debugEnviron = process.env.NODE_DEBUG || ""),
                (e = e.toUpperCase()),
                !debugs[e])
              )
                if (new RegExp("\\b" + e + "\\b", "i").test(debugEnviron)) {
                  var r = process.pid;
                  debugs[e] = function() {
                    var t = exports.format.apply(exports, arguments);
                    console.error("%s %d: %s", e, r, t);
                  };
                } else debugs[e] = function() {};
              return debugs[e];
            }),
              (exports.inspect = inspect),
              (inspect.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
              }),
              (inspect.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
              }),
              (exports.isArray = isArray),
              (exports.isBoolean = isBoolean),
              (exports.isNull = isNull),
              (exports.isNullOrUndefined = isNullOrUndefined),
              (exports.isNumber = isNumber),
              (exports.isString = isString),
              (exports.isSymbol = isSymbol),
              (exports.isUndefined = isUndefined),
              (exports.isRegExp = isRegExp),
              (exports.isObject = isObject),
              (exports.isDate = isDate),
              (exports.isError = isError),
              (exports.isFunction = isFunction),
              (exports.isPrimitive = isPrimitive),
              (exports.isBuffer = require("./support/isBuffer"));
            var months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ];
            (exports.log = function() {
              console.log(
                "%s - %s",
                timestamp(),
                exports.format.apply(exports, arguments)
              );
            }),
              (exports.inherits = require("inherits")),
              (exports._extend = function(e, r) {
                if (!r || !isObject(r)) return e;
                for (var t = Object.keys(r), n = t.length; n--; )
                  e[t[n]] = r[t[n]];
                return e;
              });
          }.call(
            this,
            require("_process"),
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        { "./support/isBuffer": 102, _process: 101, inherits: 99 }
      ],
      104: [
        function(require, module, exports) {
          function clamp_css_byte(e) {
            return (e = Math.round(e)), 0 > e ? 0 : e > 255 ? 255 : e;
          }
          function clamp_css_float(e) {
            return 0 > e ? 0 : e > 1 ? 1 : e;
          }
          function parse_css_int(e) {
            return clamp_css_byte(
              "%" === e[e.length - 1]
                ? (parseFloat(e) / 100) * 255
                : parseInt(e)
            );
          }
          function parse_css_float(e) {
            return clamp_css_float(
              "%" === e[e.length - 1] ? parseFloat(e) / 100 : parseFloat(e)
            );
          }
          function css_hue_to_rgb(e, r, l) {
            return (
              0 > l ? (l += 1) : l > 1 && (l -= 1),
              1 > 6 * l
                ? e + (r - e) * l * 6
                : 1 > 2 * l
                ? r
                : 2 > 3 * l
                ? e + (r - e) * (2 / 3 - l) * 6
                : e
            );
          }
          function parseCSSColor(e) {
            var r = e.replace(/ /g, "").toLowerCase();
            if (r in kCSSColorTable) return kCSSColorTable[r].slice();
            if ("#" === r[0]) {
              if (4 === r.length) {
                var l = parseInt(r.substr(1), 16);
                return l >= 0 && 4095 >= l
                  ? [
                      ((3840 & l) >> 4) | ((3840 & l) >> 8),
                      (240 & l) | ((240 & l) >> 4),
                      (15 & l) | ((15 & l) << 4),
                      1
                    ]
                  : null;
              }
              if (7 === r.length) {
                var l = parseInt(r.substr(1), 16);
                return l >= 0 && 16777215 >= l
                  ? [(16711680 & l) >> 16, (65280 & l) >> 8, 255 & l, 1]
                  : null;
              }
              return null;
            }
            var a = r.indexOf("("),
              t = r.indexOf(")");
            if (-1 !== a && t + 1 === r.length) {
              var n = r.substr(0, a),
                s = r.substr(a + 1, t - (a + 1)).split(","),
                o = 1;
              switch (n) {
                case "rgba":
                  if (4 !== s.length) return null;
                  o = parse_css_float(s.pop());
                case "rgb":
                  return 3 !== s.length
                    ? null
                    : [
                        parse_css_int(s[0]),
                        parse_css_int(s[1]),
                        parse_css_int(s[2]),
                        o
                      ];
                case "hsla":
                  if (4 !== s.length) return null;
                  o = parse_css_float(s.pop());
                case "hsl":
                  if (3 !== s.length) return null;
                  var i = (((parseFloat(s[0]) % 360) + 360) % 360) / 360,
                    u = parse_css_float(s[1]),
                    g = parse_css_float(s[2]),
                    d = 0.5 >= g ? g * (u + 1) : g + u - g * u,
                    c = 2 * g - d;
                  return [
                    clamp_css_byte(255 * css_hue_to_rgb(c, d, i + 1 / 3)),
                    clamp_css_byte(255 * css_hue_to_rgb(c, d, i)),
                    clamp_css_byte(255 * css_hue_to_rgb(c, d, i - 1 / 3)),
                    o
                  ];
                default:
                  return null;
              }
            }
            return null;
          }
          var kCSSColorTable = {
            transparent: [0, 0, 0, 0],
            aliceblue: [240, 248, 255, 1],
            antiquewhite: [250, 235, 215, 1],
            aqua: [0, 255, 255, 1],
            aquamarine: [127, 255, 212, 1],
            azure: [240, 255, 255, 1],
            beige: [245, 245, 220, 1],
            bisque: [255, 228, 196, 1],
            black: [0, 0, 0, 1],
            blanchedalmond: [255, 235, 205, 1],
            blue: [0, 0, 255, 1],
            blueviolet: [138, 43, 226, 1],
            brown: [165, 42, 42, 1],
            burlywood: [222, 184, 135, 1],
            cadetblue: [95, 158, 160, 1],
            chartreuse: [127, 255, 0, 1],
            chocolate: [210, 105, 30, 1],
            coral: [255, 127, 80, 1],
            cornflowerblue: [100, 149, 237, 1],
            cornsilk: [255, 248, 220, 1],
            crimson: [220, 20, 60, 1],
            cyan: [0, 255, 255, 1],
            darkblue: [0, 0, 139, 1],
            darkcyan: [0, 139, 139, 1],
            darkgoldenrod: [184, 134, 11, 1],
            darkgray: [169, 169, 169, 1],
            darkgreen: [0, 100, 0, 1],
            darkgrey: [169, 169, 169, 1],
            darkkhaki: [189, 183, 107, 1],
            darkmagenta: [139, 0, 139, 1],
            darkolivegreen: [85, 107, 47, 1],
            darkorange: [255, 140, 0, 1],
            darkorchid: [153, 50, 204, 1],
            darkred: [139, 0, 0, 1],
            darksalmon: [233, 150, 122, 1],
            darkseagreen: [143, 188, 143, 1],
            darkslateblue: [72, 61, 139, 1],
            darkslategray: [47, 79, 79, 1],
            darkslategrey: [47, 79, 79, 1],
            darkturquoise: [0, 206, 209, 1],
            darkviolet: [148, 0, 211, 1],
            deeppink: [255, 20, 147, 1],
            deepskyblue: [0, 191, 255, 1],
            dimgray: [105, 105, 105, 1],
            dimgrey: [105, 105, 105, 1],
            dodgerblue: [30, 144, 255, 1],
            firebrick: [178, 34, 34, 1],
            floralwhite: [255, 250, 240, 1],
            forestgreen: [34, 139, 34, 1],
            fuchsia: [255, 0, 255, 1],
            gainsboro: [220, 220, 220, 1],
            ghostwhite: [248, 248, 255, 1],
            gold: [255, 215, 0, 1],
            goldenrod: [218, 165, 32, 1],
            gray: [128, 128, 128, 1],
            green: [0, 128, 0, 1],
            greenyellow: [173, 255, 47, 1],
            grey: [128, 128, 128, 1],
            honeydew: [240, 255, 240, 1],
            hotpink: [255, 105, 180, 1],
            indianred: [205, 92, 92, 1],
            indigo: [75, 0, 130, 1],
            ivory: [255, 255, 240, 1],
            khaki: [240, 230, 140, 1],
            lavender: [230, 230, 250, 1],
            lavenderblush: [255, 240, 245, 1],
            lawngreen: [124, 252, 0, 1],
            lemonchiffon: [255, 250, 205, 1],
            lightblue: [173, 216, 230, 1],
            lightcoral: [240, 128, 128, 1],
            lightcyan: [224, 255, 255, 1],
            lightgoldenrodyellow: [250, 250, 210, 1],
            lightgray: [211, 211, 211, 1],
            lightgreen: [144, 238, 144, 1],
            lightgrey: [211, 211, 211, 1],
            lightpink: [255, 182, 193, 1],
            lightsalmon: [255, 160, 122, 1],
            lightseagreen: [32, 178, 170, 1],
            lightskyblue: [135, 206, 250, 1],
            lightslategray: [119, 136, 153, 1],
            lightslategrey: [119, 136, 153, 1],
            lightsteelblue: [176, 196, 222, 1],
            lightyellow: [255, 255, 224, 1],
            lime: [0, 255, 0, 1],
            limegreen: [50, 205, 50, 1],
            linen: [250, 240, 230, 1],
            magenta: [255, 0, 255, 1],
            maroon: [128, 0, 0, 1],
            mediumaquamarine: [102, 205, 170, 1],
            mediumblue: [0, 0, 205, 1],
            mediumorchid: [186, 85, 211, 1],
            mediumpurple: [147, 112, 219, 1],
            mediumseagreen: [60, 179, 113, 1],
            mediumslateblue: [123, 104, 238, 1],
            mediumspringgreen: [0, 250, 154, 1],
            mediumturquoise: [72, 209, 204, 1],
            mediumvioletred: [199, 21, 133, 1],
            midnightblue: [25, 25, 112, 1],
            mintcream: [245, 255, 250, 1],
            mistyrose: [255, 228, 225, 1],
            moccasin: [255, 228, 181, 1],
            navajowhite: [255, 222, 173, 1],
            navy: [0, 0, 128, 1],
            oldlace: [253, 245, 230, 1],
            olive: [128, 128, 0, 1],
            olivedrab: [107, 142, 35, 1],
            orange: [255, 165, 0, 1],
            orangered: [255, 69, 0, 1],
            orchid: [218, 112, 214, 1],
            palegoldenrod: [238, 232, 170, 1],
            palegreen: [152, 251, 152, 1],
            paleturquoise: [175, 238, 238, 1],
            palevioletred: [219, 112, 147, 1],
            papayawhip: [255, 239, 213, 1],
            peachpuff: [255, 218, 185, 1],
            peru: [205, 133, 63, 1],
            pink: [255, 192, 203, 1],
            plum: [221, 160, 221, 1],
            powderblue: [176, 224, 230, 1],
            purple: [128, 0, 128, 1],
            red: [255, 0, 0, 1],
            rosybrown: [188, 143, 143, 1],
            royalblue: [65, 105, 225, 1],
            saddlebrown: [139, 69, 19, 1],
            salmon: [250, 128, 114, 1],
            sandybrown: [244, 164, 96, 1],
            seagreen: [46, 139, 87, 1],
            seashell: [255, 245, 238, 1],
            sienna: [160, 82, 45, 1],
            silver: [192, 192, 192, 1],
            skyblue: [135, 206, 235, 1],
            slateblue: [106, 90, 205, 1],
            slategray: [112, 128, 144, 1],
            slategrey: [112, 128, 144, 1],
            snow: [255, 250, 250, 1],
            springgreen: [0, 255, 127, 1],
            steelblue: [70, 130, 180, 1],
            tan: [210, 180, 140, 1],
            teal: [0, 128, 128, 1],
            thistle: [216, 191, 216, 1],
            tomato: [255, 99, 71, 1],
            turquoise: [64, 224, 208, 1],
            violet: [238, 130, 238, 1],
            wheat: [245, 222, 179, 1],
            white: [255, 255, 255, 1],
            whitesmoke: [245, 245, 245, 1],
            yellow: [255, 255, 0, 1],
            yellowgreen: [154, 205, 50, 1]
          };
          try {
            exports.parseCSSColor = parseCSSColor;
          } catch (e) {}
        },
        {}
      ],
      105: [
        function(require, module, exports) {
          "use strict";
          function infix(t) {
            return function(n, r, i) {
              return "$type" === r
                ? "t" + t + VectorTileFeatureTypes.indexOf(i)
                : "p[" + JSON.stringify(r) + "]" + t + JSON.stringify(i);
            };
          }
          function strictInfix(t) {
            var n = infix(t);
            return function(t, r, i) {
              return "$type" === r
                ? n(t, r, i)
                : "typeof(p[" +
                    JSON.stringify(r) +
                    "]) === typeof(" +
                    JSON.stringify(i) +
                    ") && " +
                    n(t, r, i);
            };
          }
          function compile(t) {
            return operators[t[0]].apply(t, t);
          }
          function truth() {
            return !0;
          }
          var VectorTileFeatureTypes = [
              "Unknown",
              "Point",
              "LineString",
              "Polygon"
            ],
            operators = {
              "==": infix("==="),
              "!=": infix("!=="),
              ">": strictInfix(">"),
              "<": strictInfix("<"),
              "<=": strictInfix("<="),
              ">=": strictInfix(">="),
              in: function(t, n) {
                return (
                  "(function(){" +
                  Array.prototype.slice
                    .call(arguments, 2)
                    .map(function(r) {
                      return (
                        "if (" + operators["=="](t, n, r) + ") return true;"
                      );
                    })
                    .join("") +
                  "return false;})()"
                );
              },
              "!in": function() {
                return "!(" + operators["in"].apply(this, arguments) + ")";
              },
              any: function() {
                return (
                  Array.prototype.slice
                    .call(arguments, 1)
                    .map(function(t) {
                      return "(" + compile(t) + ")";
                    })
                    .join("||") || "false"
                );
              },
              all: function() {
                return (
                  Array.prototype.slice
                    .call(arguments, 1)
                    .map(function(t) {
                      return "(" + compile(t) + ")";
                    })
                    .join("&&") || "true"
                );
              },
              none: function() {
                return "!(" + operators.any.apply(this, arguments) + ")";
              }
            };
          module.exports = function(t) {
            if (!t) return truth;
            var n =
              "var p = f.properties || f.tags || {}, t = f.type; return " +
              compile(t) +
              ";";
            return new Function("f", n);
          };
        },
        {}
      ],
      106: [
        function(require, module, exports) {
          "use strict";
          function clip(e, n, t, r, l, u, i, s) {
            if (((t /= n), (r /= n), i >= t && r >= s)) return e;
            if (i > r || t > s) return null;
            for (var p = [], h = 0; h < e.length; h++) {
              var c,
                a,
                o = e[h],
                f = o.geometry,
                g = o.type;
              if (((c = o.min[l]), (a = o.max[l]), c >= t && r >= a)) p.push(o);
              else if (!(c > r || t > a)) {
                var m =
                  1 === g
                    ? clipPoints(f, t, r, l)
                    : clipGeometry(f, t, r, l, u, 3 === g);
                m.length &&
                  p.push({
                    geometry: m,
                    type: g,
                    tags: e[h].tags || null,
                    min: o.min,
                    max: o.max
                  });
              }
            }
            return p.length ? p : null;
          }
          function clipPoints(e, n, t, r) {
            for (var l = [], u = 0; u < e.length; u++) {
              var i = e[u],
                s = i[r];
              s >= n && t >= s && l.push(i);
            }
            return l;
          }
          function clipGeometry(e, n, t, r, l, u) {
            for (var i = [], s = 0; s < e.length; s++) {
              var p,
                h,
                c,
                a = 0,
                o = 0,
                f = null,
                g = e[s],
                m = g.area,
                v = g.dist,
                w = g.length,
                y = [];
              for (h = 0; w - 1 > h; h++)
                (p = f || g[h]),
                  (f = g[h + 1]),
                  (a = o || p[r]),
                  (o = f[r]),
                  n > a
                    ? o > t
                      ? (y.push(l(p, f, n), l(p, f, t)),
                        u || (y = newSlice(i, y, m, v)))
                      : o >= n && y.push(l(p, f, n))
                    : a > t
                    ? n > o
                      ? (y.push(l(p, f, t), l(p, f, n)),
                        u || (y = newSlice(i, y, m, v)))
                      : t >= o && y.push(l(p, f, t))
                    : (y.push(p),
                      n > o
                        ? (y.push(l(p, f, n)), u || (y = newSlice(i, y, m, v)))
                        : o > t &&
                          (y.push(l(p, f, t)),
                          u || (y = newSlice(i, y, m, v))));
              (p = g[w - 1]),
                (a = p[r]),
                a >= n && t >= a && y.push(p),
                (c = y[y.length - 1]),
                u &&
                  c &&
                  (y[0][0] !== c[0] || y[0][1] !== c[1]) &&
                  y.push(y[0]),
                newSlice(i, y, m, v);
            }
            return i;
          }
          function newSlice(e, n, t, r) {
            return n.length && ((n.area = t), (n.dist = r), e.push(n)), [];
          }
          module.exports = clip;
        },
        {}
      ],
      107: [
        function(require, module, exports) {
          "use strict";
          function convert(e, t) {
            var r = [];
            if ("FeatureCollection" === e.type)
              for (var o = 0; o < e.features.length; o++)
                convertFeature(r, e.features[o], t);
            else
              "Feature" === e.type
                ? convertFeature(r, e, t)
                : convertFeature(r, { geometry: e }, t);
            return r;
          }
          function convertFeature(e, t, r) {
            var o,
              n,
              a,
              i = t.geometry,
              c = i.type,
              l = i.coordinates,
              u = t.properties;
            if ("Point" === c) e.push(create(u, 1, [projectPoint(l)]));
            else if ("MultiPoint" === c) e.push(create(u, 1, project(l)));
            else if ("LineString" === c) e.push(create(u, 2, [project(l, r)]));
            else if ("MultiLineString" === c || "Polygon" === c) {
              for (a = [], o = 0; o < l.length; o++) a.push(project(l[o], r));
              e.push(create(u, "Polygon" === c ? 3 : 2, a));
            } else if ("MultiPolygon" === c) {
              for (a = [], o = 0; o < l.length; o++)
                for (n = 0; n < l[o].length; n++) a.push(project(l[o][n], r));
              e.push(create(u, 3, a));
            } else {
              if ("GeometryCollection" !== c)
                throw new Error("Input data is not a valid GeoJSON object.");
              for (o = 0; o < i.geometries.length; o++)
                convertFeature(
                  e,
                  { geometry: i.geometries[o], properties: u },
                  r
                );
            }
          }
          function create(e, t, r) {
            var o = {
              geometry: r,
              type: t,
              tags: e || null,
              min: [2, 1],
              max: [-1, 0]
            };
            return calcBBox(o), o;
          }
          function project(e, t) {
            for (var r = [], o = 0; o < e.length; o++)
              r.push(projectPoint(e[o]));
            return t && (simplify(r, t), calcSize(r)), r;
          }
          function projectPoint(e) {
            var t = Math.sin((e[1] * Math.PI) / 180),
              r = e[0] / 360 + 0.5,
              o = 0.5 - (0.25 * Math.log((1 + t) / (1 - t))) / Math.PI;
            return (o = -1 > o ? -1 : o > 1 ? 1 : o), [r, o, 0];
          }
          function calcSize(e) {
            for (var t, r, o = 0, n = 0, a = 0; a < e.length - 1; a++)
              (t = r || e[a]),
                (r = e[a + 1]),
                (o += t[0] * r[1] - r[0] * t[1]),
                (n += Math.abs(r[0] - t[0]) + Math.abs(r[1] - t[1]));
            (e.area = Math.abs(o / 2)), (e.dist = n);
          }
          function calcBBox(e) {
            var t = e.geometry,
              r = e.min,
              o = e.max;
            if (1 === e.type) calcRingBBox(r, o, t);
            else for (var n = 0; n < t.length; n++) calcRingBBox(r, o, t[n]);
            return e;
          }
          function calcRingBBox(e, t, r) {
            for (var o, n = 0; n < r.length; n++)
              (o = r[n]),
                (e[0] = Math.min(o[0], e[0])),
                (t[0] = Math.max(o[0], t[0])),
                (e[1] = Math.min(o[1], e[1])),
                (t[1] = Math.max(o[1], t[1]));
          }
          module.exports = convert;
          var simplify = require("./simplify");
        },
        { "./simplify": 109 }
      ],
      108: [
        function(require, module, exports) {
          "use strict";
          function geojsonvt(e, t) {
            return new GeoJSONVT(e, t);
          }
          function GeoJSONVT(e, t) {
            t = this.options = extend(Object.create(this.options), t);
            var i = t.debug;
            i && console.time("preprocess data");
            var o = 1 << t.maxZoom,
              n = convert(e, t.tolerance / (o * t.extent));
            (this.tiles = {}),
              (this.tileCoords = []),
              i &&
                (console.timeEnd("preprocess data"),
                console.log(
                  "index: maxZoom: %d, maxPoints: %d",
                  t.indexMaxZoom,
                  t.indexMaxPoints
                ),
                console.time("generate tiles"),
                (this.stats = {}),
                (this.total = 0)),
              (n = wrap(n, t.buffer / t.extent, intersectX)),
              n.length && this.splitTile(n, 0, 0, 0),
              i &&
                (n.length &&
                  console.log(
                    "features: %d, points: %d",
                    this.tiles[0].numFeatures,
                    this.tiles[0].numPoints
                  ),
                console.timeEnd("generate tiles"),
                console.log(
                  "tiles generated:",
                  this.total,
                  JSON.stringify(this.stats)
                ));
          }
          function toID(e, t, i) {
            return 32 * ((1 << e) * i + t) + e;
          }
          function intersectX(e, t, i) {
            return [i, ((i - e[0]) * (t[1] - e[1])) / (t[0] - e[0]) + e[1], 1];
          }
          function intersectY(e, t, i) {
            return [((i - e[1]) * (t[0] - e[0])) / (t[1] - e[1]) + e[0], i, 1];
          }
          function extend(e, t) {
            for (var i in t) e[i] = t[i];
            return e;
          }
          function isClippedSquare(e, t, i) {
            var o = e.source;
            if (1 !== o.length) return !1;
            var n = o[0];
            if (3 !== n.type || n.geometry.length > 1) return !1;
            var r = n.geometry[0].length;
            if (5 !== r) return !1;
            for (var s = 0; r > s; s++) {
              var l = transform.point(n.geometry[0][s], t, e.z2, e.x, e.y);
              if (
                (l[0] !== -i && l[0] !== t + i) ||
                (l[1] !== -i && l[1] !== t + i)
              )
                return !1;
            }
            return !0;
          }
          module.exports = geojsonvt;
          var convert = require("./convert"),
            transform = require("./transform"),
            clip = require("./clip"),
            wrap = require("./wrap"),
            createTile = require("./tile");
          (GeoJSONVT.prototype.options = {
            maxZoom: 14,
            indexMaxZoom: 5,
            indexMaxPoints: 1e5,
            solidChildren: !1,
            tolerance: 3,
            extent: 4096,
            buffer: 64,
            debug: 0
          }),
            (GeoJSONVT.prototype.splitTile = function(e, t, i, o, n, r, s) {
              for (
                var l = [e, t, i, o], a = this.options, u = a.debug, c = null;
                l.length;

              ) {
                (o = l.pop()), (i = l.pop()), (t = l.pop()), (e = l.pop());
                var p = 1 << t,
                  d = toID(t, i, o),
                  m = this.tiles[d],
                  f = t === a.maxZoom ? 0 : a.tolerance / (p * a.extent);
                if (
                  !m &&
                  (u > 1 && console.time("creation"),
                  (m = this.tiles[d] = createTile(
                    e,
                    p,
                    i,
                    o,
                    f,
                    t === a.maxZoom
                  )),
                  this.tileCoords.push({ z: t, x: i, y: o }),
                  u)
                ) {
                  u > 1 &&
                    (console.log(
                      "tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",
                      t,
                      i,
                      o,
                      m.numFeatures,
                      m.numPoints,
                      m.numSimplified
                    ),
                    console.timeEnd("creation"));
                  var h = "z" + t;
                  (this.stats[h] = (this.stats[h] || 0) + 1), this.total++;
                }
                if (((m.source = e), n)) {
                  if (t === a.maxZoom || t === n) continue;
                  var x = 1 << (n - t);
                  if (i !== Math.floor(r / x) || o !== Math.floor(s / x))
                    continue;
                } else if (
                  t === a.indexMaxZoom ||
                  m.numPoints <= a.indexMaxPoints
                )
                  continue;
                if (
                  a.solidChildren ||
                  !isClippedSquare(m, a.extent, a.buffer)
                ) {
                  (m.source = null), u > 1 && console.time("clipping");
                  var g,
                    v,
                    M,
                    T,
                    b,
                    y,
                    S = (0.5 * a.buffer) / a.extent,
                    Z = 0.5 - S,
                    q = 0.5 + S,
                    w = 1 + S;
                  (g = v = M = T = null),
                    (b = clip(
                      e,
                      p,
                      i - S,
                      i + q,
                      0,
                      intersectX,
                      m.min[0],
                      m.max[0]
                    )),
                    (y = clip(
                      e,
                      p,
                      i + Z,
                      i + w,
                      0,
                      intersectX,
                      m.min[0],
                      m.max[0]
                    )),
                    b &&
                      ((g = clip(
                        b,
                        p,
                        o - S,
                        o + q,
                        1,
                        intersectY,
                        m.min[1],
                        m.max[1]
                      )),
                      (v = clip(
                        b,
                        p,
                        o + Z,
                        o + w,
                        1,
                        intersectY,
                        m.min[1],
                        m.max[1]
                      ))),
                    y &&
                      ((M = clip(
                        y,
                        p,
                        o - S,
                        o + q,
                        1,
                        intersectY,
                        m.min[1],
                        m.max[1]
                      )),
                      (T = clip(
                        y,
                        p,
                        o + Z,
                        o + w,
                        1,
                        intersectY,
                        m.min[1],
                        m.max[1]
                      ))),
                    u > 1 && console.timeEnd("clipping"),
                    g && l.push(g, t + 1, 2 * i, 2 * o),
                    v && l.push(v, t + 1, 2 * i, 2 * o + 1),
                    M && l.push(M, t + 1, 2 * i + 1, 2 * o),
                    T && l.push(T, t + 1, 2 * i + 1, 2 * o + 1);
                } else n && (c = t);
              }
              return c;
            }),
            (GeoJSONVT.prototype.getTile = function(e, t, i) {
              var o = this.options,
                n = o.extent,
                r = o.debug,
                s = 1 << e;
              t = ((t % s) + s) % s;
              var l = toID(e, t, i);
              if (this.tiles[l]) return transform.tile(this.tiles[l], n);
              r > 1 && console.log("drilling down to z%d-%d-%d", e, t, i);
              for (var a, u = e, c = t, p = i; !a && u > 0; )
                u--,
                  (c = Math.floor(c / 2)),
                  (p = Math.floor(p / 2)),
                  (a = this.tiles[toID(u, c, p)]);
              if (!a || !a.source) return null;
              if (
                (r > 1 && console.log("found parent tile z%d-%d-%d", u, c, p),
                isClippedSquare(a, n, o.buffer))
              )
                return transform.tile(a, n);
              r > 1 && console.time("drilling down");
              var d = this.splitTile(a.source, u, c, p, e, t, i);
              if ((r > 1 && console.timeEnd("drilling down"), null !== d)) {
                var m = 1 << (e - d);
                l = toID(d, Math.floor(t / m), Math.floor(i / m));
              }
              return this.tiles[l] ? transform.tile(this.tiles[l], n) : null;
            });
        },
        {
          "./clip": 106,
          "./convert": 107,
          "./tile": 110,
          "./transform": 111,
          "./wrap": 112
        }
      ],
      109: [
        function(require, module, exports) {
          "use strict";
          function simplify(t, i) {
            var e,
              p,
              r,
              s,
              o = i * i,
              f = t.length,
              u = 0,
              n = f - 1,
              g = [];
            for (t[u][2] = 1, t[n][2] = 1; n; ) {
              for (p = 0, e = u + 1; n > e; e++)
                (r = getSqSegDist(t[e], t[u], t[n])),
                  r > p && ((s = e), (p = r));
              p > o
                ? ((t[s][2] = p), g.push(u), g.push(s), (u = s))
                : ((n = g.pop()), (u = g.pop()));
            }
          }
          function getSqSegDist(t, i, e) {
            var p = i[0],
              r = i[1],
              s = e[0],
              o = e[1],
              f = t[0],
              u = t[1],
              n = s - p,
              g = o - r;
            if (0 !== n || 0 !== g) {
              var l = ((f - p) * n + (u - r) * g) / (n * n + g * g);
              l > 1
                ? ((p = s), (r = o))
                : l > 0 && ((p += n * l), (r += g * l));
            }
            return (n = f - p), (g = u - r), n * n + g * g;
          }
          module.exports = simplify;
        },
        {}
      ],
      110: [
        function(require, module, exports) {
          "use strict";
          function createTile(e, n, t, m, i, u) {
            for (
              var r = {
                  features: [],
                  numPoints: 0,
                  numSimplified: 0,
                  numFeatures: 0,
                  source: null,
                  x: t,
                  y: m,
                  z2: n,
                  transformed: !1,
                  min: [2, 1],
                  max: [-1, 0]
                },
                a = 0;
              a < e.length;
              a++
            ) {
              r.numFeatures++, addFeature(r, e[a], i, u);
              var s = e[a].min,
                l = e[a].max;
              s[0] < r.min[0] && (r.min[0] = s[0]),
                s[1] < r.min[1] && (r.min[1] = s[1]),
                l[0] > r.max[0] && (r.max[0] = l[0]),
                l[1] > r.max[1] && (r.max[1] = l[1]);
            }
            return r;
          }
          function addFeature(e, n, t, m) {
            var i,
              u,
              r,
              a,
              s = n.geometry,
              l = n.type,
              o = [],
              f = t * t;
            if (1 === l)
              for (i = 0; i < s.length; i++)
                o.push(s[i]), e.numPoints++, e.numSimplified++;
            else
              for (i = 0; i < s.length; i++)
                if (
                  ((r = s[i]),
                  m || !((2 === l && r.dist < t) || (3 === l && r.area < f)))
                ) {
                  var d = [];
                  for (u = 0; u < r.length; u++)
                    (a = r[u]),
                      (m || a[2] > f) && (d.push(a), e.numSimplified++),
                      e.numPoints++;
                  o.push(d);
                } else e.numPoints += r.length;
            o.length &&
              e.features.push({ geometry: o, type: l, tags: n.tags || null });
          }
          module.exports = createTile;
        },
        {}
      ],
      111: [
        function(require, module, exports) {
          "use strict";
          function transformTile(r, t) {
            if (r.transformed) return r;
            var n,
              e,
              o,
              f = r.z2,
              a = r.x,
              s = r.y;
            for (n = 0; n < r.features.length; n++) {
              var i = r.features[n],
                u = i.geometry,
                m = i.type;
              if (1 === m)
                for (e = 0; e < u.length; e++)
                  u[e] = transformPoint(u[e], t, f, a, s);
              else
                for (e = 0; e < u.length; e++) {
                  var l = u[e];
                  for (o = 0; o < l.length; o++)
                    l[o] = transformPoint(l[o], t, f, a, s);
                }
            }
            return (r.transformed = !0), r;
          }
          function transformPoint(r, t, n, e, o) {
            var f = Math.round(t * (r[0] * n - e)),
              a = Math.round(t * (r[1] * n - o));
            return [f, a];
          }
          (exports.tile = transformTile), (exports.point = transformPoint);
        },
        {}
      ],
      112: [
        function(require, module, exports) {
          "use strict";
          function wrap(r, t, e) {
            var o = r,
              a = clip(r, 1, -1 - t, t, 0, e, -1, 2),
              s = clip(r, 1, 1 - t, 2 + t, 0, e, -1, 2);
            return (
              (a || s) &&
                ((o = clip(r, 1, -t, 1 + t, 0, e, -1, 2)),
                a && (o = shiftFeatureCoords(a, 1).concat(o)),
                s && (o = o.concat(shiftFeatureCoords(s, -1)))),
              o
            );
          }
          function shiftFeatureCoords(r, t) {
            for (var e = [], o = 0; o < r.length; o++) {
              var a,
                s = r[o],
                i = s.type;
              if (1 === i) a = shiftCoords(s.geometry, t);
              else {
                a = [];
                for (var n = 0; n < s.geometry.length; n++)
                  a.push(shiftCoords(s.geometry[n], t));
              }
              e.push({
                geometry: a,
                type: i,
                tags: s.tags,
                min: [s.min[0] + t, s.min[1]],
                max: [s.max[0] + t, s.max[1]]
              });
            }
            return e;
          }
          function shiftCoords(r, t) {
            var e = [];
            (e.area = r.area), (e.dist = r.dist);
            for (var o = 0; o < r.length; o++)
              e.push([r[o][0] + t, r[o][1], r[o][2]]);
            return e;
          }
          var clip = require("./clip");
          module.exports = wrap;
        },
        { "./clip": 106 }
      ],
      113: [
        function(require, module, exports) {
          (exports.glMatrix = require("./gl-matrix/common.js")),
            (exports.mat2 = require("./gl-matrix/mat2.js")),
            (exports.mat2d = require("./gl-matrix/mat2d.js")),
            (exports.mat3 = require("./gl-matrix/mat3.js")),
            (exports.mat4 = require("./gl-matrix/mat4.js")),
            (exports.quat = require("./gl-matrix/quat.js")),
            (exports.vec2 = require("./gl-matrix/vec2.js")),
            (exports.vec3 = require("./gl-matrix/vec3.js")),
            (exports.vec4 = require("./gl-matrix/vec4.js"));
        },
        {
          "./gl-matrix/common.js": 114,
          "./gl-matrix/mat2.js": 115,
          "./gl-matrix/mat2d.js": 116,
          "./gl-matrix/mat3.js": 117,
          "./gl-matrix/mat4.js": 118,
          "./gl-matrix/quat.js": 119,
          "./gl-matrix/vec2.js": 120,
          "./gl-matrix/vec3.js": 121,
          "./gl-matrix/vec4.js": 122
        }
      ],
      114: [
        function(require, module, exports) {
          var glMatrix = {};
          (glMatrix.EPSILON = 1e-6),
            (glMatrix.ARRAY_TYPE =
              "undefined" != typeof Float32Array ? Float32Array : Array),
            (glMatrix.RANDOM = Math.random),
            (glMatrix.setMatrixArrayType = function(r) {
              GLMAT_ARRAY_TYPE = r;
            });
          var degree = Math.PI / 180;
          (glMatrix.toRadian = function(r) {
            return r * degree;
          }),
            (module.exports = glMatrix);
        },
        {}
      ],
      115: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            mat2 = {};
          (mat2.create = function() {
            var t = new glMatrix.ARRAY_TYPE(4);
            return (t[0] = 1), (t[1] = 0), (t[2] = 0), (t[3] = 1), t;
          }),
            (mat2.clone = function(t) {
              var n = new glMatrix.ARRAY_TYPE(4);
              return (
                (n[0] = t[0]), (n[1] = t[1]), (n[2] = t[2]), (n[3] = t[3]), n
              );
            }),
            (mat2.copy = function(t, n) {
              return (
                (t[0] = n[0]), (t[1] = n[1]), (t[2] = n[2]), (t[3] = n[3]), t
              );
            }),
            (mat2.identity = function(t) {
              return (t[0] = 1), (t[1] = 0), (t[2] = 0), (t[3] = 1), t;
            }),
            (mat2.transpose = function(t, n) {
              if (t === n) {
                var r = n[1];
                (t[1] = n[2]), (t[2] = r);
              } else (t[0] = n[0]), (t[1] = n[2]), (t[2] = n[1]), (t[3] = n[3]);
              return t;
            }),
            (mat2.invert = function(t, n) {
              var r = n[0],
                a = n[1],
                u = n[2],
                o = n[3],
                e = r * o - u * a;
              return e
                ? ((e = 1 / e),
                  (t[0] = o * e),
                  (t[1] = -a * e),
                  (t[2] = -u * e),
                  (t[3] = r * e),
                  t)
                : null;
            }),
            (mat2.adjoint = function(t, n) {
              var r = n[0];
              return (
                (t[0] = n[3]), (t[1] = -n[1]), (t[2] = -n[2]), (t[3] = r), t
              );
            }),
            (mat2.determinant = function(t) {
              return t[0] * t[3] - t[2] * t[1];
            }),
            (mat2.multiply = function(t, n, r) {
              var a = n[0],
                u = n[1],
                o = n[2],
                e = n[3],
                i = r[0],
                m = r[1],
                c = r[2],
                f = r[3];
              return (
                (t[0] = a * i + o * m),
                (t[1] = u * i + e * m),
                (t[2] = a * c + o * f),
                (t[3] = u * c + e * f),
                t
              );
            }),
            (mat2.mul = mat2.multiply),
            (mat2.rotate = function(t, n, r) {
              var a = n[0],
                u = n[1],
                o = n[2],
                e = n[3],
                i = Math.sin(r),
                m = Math.cos(r);
              return (
                (t[0] = a * m + o * i),
                (t[1] = u * m + e * i),
                (t[2] = a * -i + o * m),
                (t[3] = u * -i + e * m),
                t
              );
            }),
            (mat2.scale = function(t, n, r) {
              var a = n[0],
                u = n[1],
                o = n[2],
                e = n[3],
                i = r[0],
                m = r[1];
              return (
                (t[0] = a * i),
                (t[1] = u * i),
                (t[2] = o * m),
                (t[3] = e * m),
                t
              );
            }),
            (mat2.fromRotation = function(t, n) {
              var r = Math.sin(n),
                a = Math.cos(n);
              return (t[0] = a), (t[1] = r), (t[2] = -r), (t[3] = a), t;
            }),
            (mat2.fromScaling = function(t, n) {
              return (t[0] = n[0]), (t[1] = 0), (t[2] = 0), (t[3] = n[1]), t;
            }),
            (mat2.str = function(t) {
              return (
                "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
              );
            }),
            (mat2.frob = function(t) {
              return Math.sqrt(
                Math.pow(t[0], 2) +
                  Math.pow(t[1], 2) +
                  Math.pow(t[2], 2) +
                  Math.pow(t[3], 2)
              );
            }),
            (mat2.LDU = function(t, n, r, a) {
              return (
                (t[2] = a[2] / a[0]),
                (r[0] = a[0]),
                (r[1] = a[1]),
                (r[3] = a[3] - t[2] * r[1]),
                [t, n, r]
              );
            }),
            (module.exports = mat2);
        },
        { "./common.js": 114 }
      ],
      116: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            mat2d = {};
          (mat2d.create = function() {
            var t = new glMatrix.ARRAY_TYPE(6);
            return (
              (t[0] = 1),
              (t[1] = 0),
              (t[2] = 0),
              (t[3] = 1),
              (t[4] = 0),
              (t[5] = 0),
              t
            );
          }),
            (mat2d.clone = function(t) {
              var n = new glMatrix.ARRAY_TYPE(6);
              return (
                (n[0] = t[0]),
                (n[1] = t[1]),
                (n[2] = t[2]),
                (n[3] = t[3]),
                (n[4] = t[4]),
                (n[5] = t[5]),
                n
              );
            }),
            (mat2d.copy = function(t, n) {
              return (
                (t[0] = n[0]),
                (t[1] = n[1]),
                (t[2] = n[2]),
                (t[3] = n[3]),
                (t[4] = n[4]),
                (t[5] = n[5]),
                t
              );
            }),
            (mat2d.identity = function(t) {
              return (
                (t[0] = 1),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 1),
                (t[4] = 0),
                (t[5] = 0),
                t
              );
            }),
            (mat2d.invert = function(t, n) {
              var r = n[0],
                a = n[1],
                o = n[2],
                u = n[3],
                e = n[4],
                i = n[5],
                m = r * u - a * o;
              return m
                ? ((m = 1 / m),
                  (t[0] = u * m),
                  (t[1] = -a * m),
                  (t[2] = -o * m),
                  (t[3] = r * m),
                  (t[4] = (o * i - u * e) * m),
                  (t[5] = (a * e - r * i) * m),
                  t)
                : null;
            }),
            (mat2d.determinant = function(t) {
              return t[0] * t[3] - t[1] * t[2];
            }),
            (mat2d.multiply = function(t, n, r) {
              var a = n[0],
                o = n[1],
                u = n[2],
                e = n[3],
                i = n[4],
                m = n[5],
                c = r[0],
                d = r[1],
                f = r[2],
                l = r[3],
                M = r[4],
                h = r[5];
              return (
                (t[0] = a * c + u * d),
                (t[1] = o * c + e * d),
                (t[2] = a * f + u * l),
                (t[3] = o * f + e * l),
                (t[4] = a * M + u * h + i),
                (t[5] = o * M + e * h + m),
                t
              );
            }),
            (mat2d.mul = mat2d.multiply),
            (mat2d.rotate = function(t, n, r) {
              var a = n[0],
                o = n[1],
                u = n[2],
                e = n[3],
                i = n[4],
                m = n[5],
                c = Math.sin(r),
                d = Math.cos(r);
              return (
                (t[0] = a * d + u * c),
                (t[1] = o * d + e * c),
                (t[2] = a * -c + u * d),
                (t[3] = o * -c + e * d),
                (t[4] = i),
                (t[5] = m),
                t
              );
            }),
            (mat2d.scale = function(t, n, r) {
              var a = n[0],
                o = n[1],
                u = n[2],
                e = n[3],
                i = n[4],
                m = n[5],
                c = r[0],
                d = r[1];
              return (
                (t[0] = a * c),
                (t[1] = o * c),
                (t[2] = u * d),
                (t[3] = e * d),
                (t[4] = i),
                (t[5] = m),
                t
              );
            }),
            (mat2d.translate = function(t, n, r) {
              var a = n[0],
                o = n[1],
                u = n[2],
                e = n[3],
                i = n[4],
                m = n[5],
                c = r[0],
                d = r[1];
              return (
                (t[0] = a),
                (t[1] = o),
                (t[2] = u),
                (t[3] = e),
                (t[4] = a * c + u * d + i),
                (t[5] = o * c + e * d + m),
                t
              );
            }),
            (mat2d.fromRotation = function(t, n) {
              var r = Math.sin(n),
                a = Math.cos(n);
              return (
                (t[0] = a),
                (t[1] = r),
                (t[2] = -r),
                (t[3] = a),
                (t[4] = 0),
                (t[5] = 0),
                t
              );
            }),
            (mat2d.fromScaling = function(t, n) {
              return (
                (t[0] = n[0]),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = n[1]),
                (t[4] = 0),
                (t[5] = 0),
                t
              );
            }),
            (mat2d.fromTranslation = function(t, n) {
              return (
                (t[0] = 1),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 1),
                (t[4] = n[0]),
                (t[5] = n[1]),
                t
              );
            }),
            (mat2d.str = function(t) {
              return (
                "mat2d(" +
                t[0] +
                ", " +
                t[1] +
                ", " +
                t[2] +
                ", " +
                t[3] +
                ", " +
                t[4] +
                ", " +
                t[5] +
                ")"
              );
            }),
            (mat2d.frob = function(t) {
              return Math.sqrt(
                Math.pow(t[0], 2) +
                  Math.pow(t[1], 2) +
                  Math.pow(t[2], 2) +
                  Math.pow(t[3], 2) +
                  Math.pow(t[4], 2) +
                  Math.pow(t[5], 2) +
                  1
              );
            }),
            (module.exports = mat2d);
        },
        { "./common.js": 114 }
      ],
      117: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            mat3 = {};
          (mat3.create = function() {
            var t = new glMatrix.ARRAY_TYPE(9);
            return (
              (t[0] = 1),
              (t[1] = 0),
              (t[2] = 0),
              (t[3] = 0),
              (t[4] = 1),
              (t[5] = 0),
              (t[6] = 0),
              (t[7] = 0),
              (t[8] = 1),
              t
            );
          }),
            (mat3.fromMat4 = function(t, n) {
              return (
                (t[0] = n[0]),
                (t[1] = n[1]),
                (t[2] = n[2]),
                (t[3] = n[4]),
                (t[4] = n[5]),
                (t[5] = n[6]),
                (t[6] = n[8]),
                (t[7] = n[9]),
                (t[8] = n[10]),
                t
              );
            }),
            (mat3.clone = function(t) {
              var n = new glMatrix.ARRAY_TYPE(9);
              return (
                (n[0] = t[0]),
                (n[1] = t[1]),
                (n[2] = t[2]),
                (n[3] = t[3]),
                (n[4] = t[4]),
                (n[5] = t[5]),
                (n[6] = t[6]),
                (n[7] = t[7]),
                (n[8] = t[8]),
                n
              );
            }),
            (mat3.copy = function(t, n) {
              return (
                (t[0] = n[0]),
                (t[1] = n[1]),
                (t[2] = n[2]),
                (t[3] = n[3]),
                (t[4] = n[4]),
                (t[5] = n[5]),
                (t[6] = n[6]),
                (t[7] = n[7]),
                (t[8] = n[8]),
                t
              );
            }),
            (mat3.identity = function(t) {
              return (
                (t[0] = 1),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 1),
                (t[5] = 0),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 1),
                t
              );
            }),
            (mat3.transpose = function(t, n) {
              if (t === n) {
                var r = n[1],
                  a = n[2],
                  o = n[5];
                (t[1] = n[3]),
                  (t[2] = n[6]),
                  (t[3] = r),
                  (t[5] = n[7]),
                  (t[6] = a),
                  (t[7] = o);
              } else
                (t[0] = n[0]),
                  (t[1] = n[3]),
                  (t[2] = n[6]),
                  (t[3] = n[1]),
                  (t[4] = n[4]),
                  (t[5] = n[7]),
                  (t[6] = n[2]),
                  (t[7] = n[5]),
                  (t[8] = n[8]);
              return t;
            }),
            (mat3.invert = function(t, n) {
              var r = n[0],
                a = n[1],
                o = n[2],
                u = n[3],
                m = n[4],
                e = n[5],
                i = n[6],
                c = n[7],
                f = n[8],
                l = f * m - e * c,
                M = -f * u + e * i,
                v = c * u - m * i,
                h = r * l + a * M + o * v;
              return h
                ? ((h = 1 / h),
                  (t[0] = l * h),
                  (t[1] = (-f * a + o * c) * h),
                  (t[2] = (e * a - o * m) * h),
                  (t[3] = M * h),
                  (t[4] = (f * r - o * i) * h),
                  (t[5] = (-e * r + o * u) * h),
                  (t[6] = v * h),
                  (t[7] = (-c * r + a * i) * h),
                  (t[8] = (m * r - a * u) * h),
                  t)
                : null;
            }),
            (mat3.adjoint = function(t, n) {
              var r = n[0],
                a = n[1],
                o = n[2],
                u = n[3],
                m = n[4],
                e = n[5],
                i = n[6],
                c = n[7],
                f = n[8];
              return (
                (t[0] = m * f - e * c),
                (t[1] = o * c - a * f),
                (t[2] = a * e - o * m),
                (t[3] = e * i - u * f),
                (t[4] = r * f - o * i),
                (t[5] = o * u - r * e),
                (t[6] = u * c - m * i),
                (t[7] = a * i - r * c),
                (t[8] = r * m - a * u),
                t
              );
            }),
            (mat3.determinant = function(t) {
              var n = t[0],
                r = t[1],
                a = t[2],
                o = t[3],
                u = t[4],
                m = t[5],
                e = t[6],
                i = t[7],
                c = t[8];
              return (
                n * (c * u - m * i) + r * (-c * o + m * e) + a * (i * o - u * e)
              );
            }),
            (mat3.multiply = function(t, n, r) {
              var a = n[0],
                o = n[1],
                u = n[2],
                m = n[3],
                e = n[4],
                i = n[5],
                c = n[6],
                f = n[7],
                l = n[8],
                M = r[0],
                v = r[1],
                h = r[2],
                p = r[3],
                s = r[4],
                w = r[5],
                d = r[6],
                R = r[7],
                g = r[8];
              return (
                (t[0] = M * a + v * m + h * c),
                (t[1] = M * o + v * e + h * f),
                (t[2] = M * u + v * i + h * l),
                (t[3] = p * a + s * m + w * c),
                (t[4] = p * o + s * e + w * f),
                (t[5] = p * u + s * i + w * l),
                (t[6] = d * a + R * m + g * c),
                (t[7] = d * o + R * e + g * f),
                (t[8] = d * u + R * i + g * l),
                t
              );
            }),
            (mat3.mul = mat3.multiply),
            (mat3.translate = function(t, n, r) {
              var a = n[0],
                o = n[1],
                u = n[2],
                m = n[3],
                e = n[4],
                i = n[5],
                c = n[6],
                f = n[7],
                l = n[8],
                M = r[0],
                v = r[1];
              return (
                (t[0] = a),
                (t[1] = o),
                (t[2] = u),
                (t[3] = m),
                (t[4] = e),
                (t[5] = i),
                (t[6] = M * a + v * m + c),
                (t[7] = M * o + v * e + f),
                (t[8] = M * u + v * i + l),
                t
              );
            }),
            (mat3.rotate = function(t, n, r) {
              var a = n[0],
                o = n[1],
                u = n[2],
                m = n[3],
                e = n[4],
                i = n[5],
                c = n[6],
                f = n[7],
                l = n[8],
                M = Math.sin(r),
                v = Math.cos(r);
              return (
                (t[0] = v * a + M * m),
                (t[1] = v * o + M * e),
                (t[2] = v * u + M * i),
                (t[3] = v * m - M * a),
                (t[4] = v * e - M * o),
                (t[5] = v * i - M * u),
                (t[6] = c),
                (t[7] = f),
                (t[8] = l),
                t
              );
            }),
            (mat3.scale = function(t, n, r) {
              var a = r[0],
                o = r[1];
              return (
                (t[0] = a * n[0]),
                (t[1] = a * n[1]),
                (t[2] = a * n[2]),
                (t[3] = o * n[3]),
                (t[4] = o * n[4]),
                (t[5] = o * n[5]),
                (t[6] = n[6]),
                (t[7] = n[7]),
                (t[8] = n[8]),
                t
              );
            }),
            (mat3.fromTranslation = function(t, n) {
              return (
                (t[0] = 1),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 1),
                (t[5] = 0),
                (t[6] = n[0]),
                (t[7] = n[1]),
                (t[8] = 1),
                t
              );
            }),
            (mat3.fromRotation = function(t, n) {
              var r = Math.sin(n),
                a = Math.cos(n);
              return (
                (t[0] = a),
                (t[1] = r),
                (t[2] = 0),
                (t[3] = -r),
                (t[4] = a),
                (t[5] = 0),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 1),
                t
              );
            }),
            (mat3.fromScaling = function(t, n) {
              return (
                (t[0] = n[0]),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = n[1]),
                (t[5] = 0),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 1),
                t
              );
            }),
            (mat3.fromMat2d = function(t, n) {
              return (
                (t[0] = n[0]),
                (t[1] = n[1]),
                (t[2] = 0),
                (t[3] = n[2]),
                (t[4] = n[3]),
                (t[5] = 0),
                (t[6] = n[4]),
                (t[7] = n[5]),
                (t[8] = 1),
                t
              );
            }),
            (mat3.fromQuat = function(t, n) {
              var r = n[0],
                a = n[1],
                o = n[2],
                u = n[3],
                m = r + r,
                e = a + a,
                i = o + o,
                c = r * m,
                f = a * m,
                l = a * e,
                M = o * m,
                v = o * e,
                h = o * i,
                p = u * m,
                s = u * e,
                w = u * i;
              return (
                (t[0] = 1 - l - h),
                (t[3] = f - w),
                (t[6] = M + s),
                (t[1] = f + w),
                (t[4] = 1 - c - h),
                (t[7] = v - p),
                (t[2] = M - s),
                (t[5] = v + p),
                (t[8] = 1 - c - l),
                t
              );
            }),
            (mat3.normalFromMat4 = function(t, n) {
              var r = n[0],
                a = n[1],
                o = n[2],
                u = n[3],
                m = n[4],
                e = n[5],
                i = n[6],
                c = n[7],
                f = n[8],
                l = n[9],
                M = n[10],
                v = n[11],
                h = n[12],
                p = n[13],
                s = n[14],
                w = n[15],
                d = r * e - a * m,
                R = r * i - o * m,
                g = r * c - u * m,
                x = a * i - o * e,
                y = a * c - u * e,
                A = o * c - u * i,
                Y = f * p - l * h,
                T = f * s - M * h,
                j = f * w - v * h,
                q = l * s - M * p,
                E = l * w - v * p,
                P = M * w - v * s,
                _ = d * P - R * E + g * q + x * j - y * T + A * Y;
              return _
                ? ((_ = 1 / _),
                  (t[0] = (e * P - i * E + c * q) * _),
                  (t[1] = (i * j - m * P - c * T) * _),
                  (t[2] = (m * E - e * j + c * Y) * _),
                  (t[3] = (o * E - a * P - u * q) * _),
                  (t[4] = (r * P - o * j + u * T) * _),
                  (t[5] = (a * j - r * E - u * Y) * _),
                  (t[6] = (p * A - s * y + w * x) * _),
                  (t[7] = (s * g - h * A - w * R) * _),
                  (t[8] = (h * y - p * g + w * d) * _),
                  t)
                : null;
            }),
            (mat3.str = function(t) {
              return (
                "mat3(" +
                t[0] +
                ", " +
                t[1] +
                ", " +
                t[2] +
                ", " +
                t[3] +
                ", " +
                t[4] +
                ", " +
                t[5] +
                ", " +
                t[6] +
                ", " +
                t[7] +
                ", " +
                t[8] +
                ")"
              );
            }),
            (mat3.frob = function(t) {
              return Math.sqrt(
                Math.pow(t[0], 2) +
                  Math.pow(t[1], 2) +
                  Math.pow(t[2], 2) +
                  Math.pow(t[3], 2) +
                  Math.pow(t[4], 2) +
                  Math.pow(t[5], 2) +
                  Math.pow(t[6], 2) +
                  Math.pow(t[7], 2) +
                  Math.pow(t[8], 2)
              );
            }),
            (module.exports = mat3);
        },
        { "./common.js": 114 }
      ],
      118: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            mat4 = {};
          (mat4.create = function() {
            var t = new glMatrix.ARRAY_TYPE(16);
            return (
              (t[0] = 1),
              (t[1] = 0),
              (t[2] = 0),
              (t[3] = 0),
              (t[4] = 0),
              (t[5] = 1),
              (t[6] = 0),
              (t[7] = 0),
              (t[8] = 0),
              (t[9] = 0),
              (t[10] = 1),
              (t[11] = 0),
              (t[12] = 0),
              (t[13] = 0),
              (t[14] = 0),
              (t[15] = 1),
              t
            );
          }),
            (mat4.clone = function(t) {
              var a = new glMatrix.ARRAY_TYPE(16);
              return (
                (a[0] = t[0]),
                (a[1] = t[1]),
                (a[2] = t[2]),
                (a[3] = t[3]),
                (a[4] = t[4]),
                (a[5] = t[5]),
                (a[6] = t[6]),
                (a[7] = t[7]),
                (a[8] = t[8]),
                (a[9] = t[9]),
                (a[10] = t[10]),
                (a[11] = t[11]),
                (a[12] = t[12]),
                (a[13] = t[13]),
                (a[14] = t[14]),
                (a[15] = t[15]),
                a
              );
            }),
            (mat4.copy = function(t, a) {
              return (
                (t[0] = a[0]),
                (t[1] = a[1]),
                (t[2] = a[2]),
                (t[3] = a[3]),
                (t[4] = a[4]),
                (t[5] = a[5]),
                (t[6] = a[6]),
                (t[7] = a[7]),
                (t[8] = a[8]),
                (t[9] = a[9]),
                (t[10] = a[10]),
                (t[11] = a[11]),
                (t[12] = a[12]),
                (t[13] = a[13]),
                (t[14] = a[14]),
                (t[15] = a[15]),
                t
              );
            }),
            (mat4.identity = function(t) {
              return (
                (t[0] = 1),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = 1),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 0),
                (t[9] = 0),
                (t[10] = 1),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                t
              );
            }),
            (mat4.transpose = function(t, a) {
              if (t === a) {
                var r = a[1],
                  n = a[2],
                  o = a[3],
                  e = a[6],
                  i = a[7],
                  u = a[11];
                (t[1] = a[4]),
                  (t[2] = a[8]),
                  (t[3] = a[12]),
                  (t[4] = r),
                  (t[6] = a[9]),
                  (t[7] = a[13]),
                  (t[8] = n),
                  (t[9] = e),
                  (t[11] = a[14]),
                  (t[12] = o),
                  (t[13] = i),
                  (t[14] = u);
              } else
                (t[0] = a[0]),
                  (t[1] = a[4]),
                  (t[2] = a[8]),
                  (t[3] = a[12]),
                  (t[4] = a[1]),
                  (t[5] = a[5]),
                  (t[6] = a[9]),
                  (t[7] = a[13]),
                  (t[8] = a[2]),
                  (t[9] = a[6]),
                  (t[10] = a[10]),
                  (t[11] = a[14]),
                  (t[12] = a[3]),
                  (t[13] = a[7]),
                  (t[14] = a[11]),
                  (t[15] = a[15]);
              return t;
            }),
            (mat4.invert = function(t, a) {
              var r = a[0],
                n = a[1],
                o = a[2],
                e = a[3],
                i = a[4],
                u = a[5],
                M = a[6],
                m = a[7],
                h = a[8],
                c = a[9],
                f = a[10],
                s = a[11],
                l = a[12],
                v = a[13],
                p = a[14],
                w = a[15],
                g = r * u - n * i,
                P = r * M - o * i,
                R = r * m - e * i,
                x = n * M - o * u,
                I = n * m - e * u,
                S = o * m - e * M,
                d = h * v - c * l,
                q = h * p - f * l,
                E = h * w - s * l,
                O = c * p - f * v,
                b = c * w - s * v,
                T = f * w - s * p,
                Y = g * T - P * b + R * O + x * E - I * q + S * d;
              return Y
                ? ((Y = 1 / Y),
                  (t[0] = (u * T - M * b + m * O) * Y),
                  (t[1] = (o * b - n * T - e * O) * Y),
                  (t[2] = (v * S - p * I + w * x) * Y),
                  (t[3] = (f * I - c * S - s * x) * Y),
                  (t[4] = (M * E - i * T - m * q) * Y),
                  (t[5] = (r * T - o * E + e * q) * Y),
                  (t[6] = (p * R - l * S - w * P) * Y),
                  (t[7] = (h * S - f * R + s * P) * Y),
                  (t[8] = (i * b - u * E + m * d) * Y),
                  (t[9] = (n * E - r * b - e * d) * Y),
                  (t[10] = (l * I - v * R + w * g) * Y),
                  (t[11] = (c * R - h * I - s * g) * Y),
                  (t[12] = (u * q - i * O - M * d) * Y),
                  (t[13] = (r * O - n * q + o * d) * Y),
                  (t[14] = (v * P - l * x - p * g) * Y),
                  (t[15] = (h * x - c * P + f * g) * Y),
                  t)
                : null;
            }),
            (mat4.adjoint = function(t, a) {
              var r = a[0],
                n = a[1],
                o = a[2],
                e = a[3],
                i = a[4],
                u = a[5],
                M = a[6],
                m = a[7],
                h = a[8],
                c = a[9],
                f = a[10],
                s = a[11],
                l = a[12],
                v = a[13],
                p = a[14],
                w = a[15];
              return (
                (t[0] =
                  u * (f * w - s * p) -
                  c * (M * w - m * p) +
                  v * (M * s - m * f)),
                (t[1] = -(
                  n * (f * w - s * p) -
                  c * (o * w - e * p) +
                  v * (o * s - e * f)
                )),
                (t[2] =
                  n * (M * w - m * p) -
                  u * (o * w - e * p) +
                  v * (o * m - e * M)),
                (t[3] = -(
                  n * (M * s - m * f) -
                  u * (o * s - e * f) +
                  c * (o * m - e * M)
                )),
                (t[4] = -(
                  i * (f * w - s * p) -
                  h * (M * w - m * p) +
                  l * (M * s - m * f)
                )),
                (t[5] =
                  r * (f * w - s * p) -
                  h * (o * w - e * p) +
                  l * (o * s - e * f)),
                (t[6] = -(
                  r * (M * w - m * p) -
                  i * (o * w - e * p) +
                  l * (o * m - e * M)
                )),
                (t[7] =
                  r * (M * s - m * f) -
                  i * (o * s - e * f) +
                  h * (o * m - e * M)),
                (t[8] =
                  i * (c * w - s * v) -
                  h * (u * w - m * v) +
                  l * (u * s - m * c)),
                (t[9] = -(
                  r * (c * w - s * v) -
                  h * (n * w - e * v) +
                  l * (n * s - e * c)
                )),
                (t[10] =
                  r * (u * w - m * v) -
                  i * (n * w - e * v) +
                  l * (n * m - e * u)),
                (t[11] = -(
                  r * (u * s - m * c) -
                  i * (n * s - e * c) +
                  h * (n * m - e * u)
                )),
                (t[12] = -(
                  i * (c * p - f * v) -
                  h * (u * p - M * v) +
                  l * (u * f - M * c)
                )),
                (t[13] =
                  r * (c * p - f * v) -
                  h * (n * p - o * v) +
                  l * (n * f - o * c)),
                (t[14] = -(
                  r * (u * p - M * v) -
                  i * (n * p - o * v) +
                  l * (n * M - o * u)
                )),
                (t[15] =
                  r * (u * f - M * c) -
                  i * (n * f - o * c) +
                  h * (n * M - o * u)),
                t
              );
            }),
            (mat4.determinant = function(t) {
              var a = t[0],
                r = t[1],
                n = t[2],
                o = t[3],
                e = t[4],
                i = t[5],
                u = t[6],
                M = t[7],
                m = t[8],
                h = t[9],
                c = t[10],
                f = t[11],
                s = t[12],
                l = t[13],
                v = t[14],
                p = t[15],
                w = a * i - r * e,
                g = a * u - n * e,
                P = a * M - o * e,
                R = r * u - n * i,
                x = r * M - o * i,
                I = n * M - o * u,
                S = m * l - h * s,
                d = m * v - c * s,
                q = m * p - f * s,
                E = h * v - c * l,
                O = h * p - f * l,
                b = c * p - f * v;
              return w * b - g * O + P * E + R * q - x * d + I * S;
            }),
            (mat4.multiply = function(t, a, r) {
              var n = a[0],
                o = a[1],
                e = a[2],
                i = a[3],
                u = a[4],
                M = a[5],
                m = a[6],
                h = a[7],
                c = a[8],
                f = a[9],
                s = a[10],
                l = a[11],
                v = a[12],
                p = a[13],
                w = a[14],
                g = a[15],
                P = r[0],
                R = r[1],
                x = r[2],
                I = r[3];
              return (
                (t[0] = P * n + R * u + x * c + I * v),
                (t[1] = P * o + R * M + x * f + I * p),
                (t[2] = P * e + R * m + x * s + I * w),
                (t[3] = P * i + R * h + x * l + I * g),
                (P = r[4]),
                (R = r[5]),
                (x = r[6]),
                (I = r[7]),
                (t[4] = P * n + R * u + x * c + I * v),
                (t[5] = P * o + R * M + x * f + I * p),
                (t[6] = P * e + R * m + x * s + I * w),
                (t[7] = P * i + R * h + x * l + I * g),
                (P = r[8]),
                (R = r[9]),
                (x = r[10]),
                (I = r[11]),
                (t[8] = P * n + R * u + x * c + I * v),
                (t[9] = P * o + R * M + x * f + I * p),
                (t[10] = P * e + R * m + x * s + I * w),
                (t[11] = P * i + R * h + x * l + I * g),
                (P = r[12]),
                (R = r[13]),
                (x = r[14]),
                (I = r[15]),
                (t[12] = P * n + R * u + x * c + I * v),
                (t[13] = P * o + R * M + x * f + I * p),
                (t[14] = P * e + R * m + x * s + I * w),
                (t[15] = P * i + R * h + x * l + I * g),
                t
              );
            }),
            (mat4.mul = mat4.multiply),
            (mat4.translate = function(t, a, r) {
              var n,
                o,
                e,
                i,
                u,
                M,
                m,
                h,
                c,
                f,
                s,
                l,
                v = r[0],
                p = r[1],
                w = r[2];
              return (
                a === t
                  ? ((t[12] = a[0] * v + a[4] * p + a[8] * w + a[12]),
                    (t[13] = a[1] * v + a[5] * p + a[9] * w + a[13]),
                    (t[14] = a[2] * v + a[6] * p + a[10] * w + a[14]),
                    (t[15] = a[3] * v + a[7] * p + a[11] * w + a[15]))
                  : ((n = a[0]),
                    (o = a[1]),
                    (e = a[2]),
                    (i = a[3]),
                    (u = a[4]),
                    (M = a[5]),
                    (m = a[6]),
                    (h = a[7]),
                    (c = a[8]),
                    (f = a[9]),
                    (s = a[10]),
                    (l = a[11]),
                    (t[0] = n),
                    (t[1] = o),
                    (t[2] = e),
                    (t[3] = i),
                    (t[4] = u),
                    (t[5] = M),
                    (t[6] = m),
                    (t[7] = h),
                    (t[8] = c),
                    (t[9] = f),
                    (t[10] = s),
                    (t[11] = l),
                    (t[12] = n * v + u * p + c * w + a[12]),
                    (t[13] = o * v + M * p + f * w + a[13]),
                    (t[14] = e * v + m * p + s * w + a[14]),
                    (t[15] = i * v + h * p + l * w + a[15])),
                t
              );
            }),
            (mat4.scale = function(t, a, r) {
              var n = r[0],
                o = r[1],
                e = r[2];
              return (
                (t[0] = a[0] * n),
                (t[1] = a[1] * n),
                (t[2] = a[2] * n),
                (t[3] = a[3] * n),
                (t[4] = a[4] * o),
                (t[5] = a[5] * o),
                (t[6] = a[6] * o),
                (t[7] = a[7] * o),
                (t[8] = a[8] * e),
                (t[9] = a[9] * e),
                (t[10] = a[10] * e),
                (t[11] = a[11] * e),
                (t[12] = a[12]),
                (t[13] = a[13]),
                (t[14] = a[14]),
                (t[15] = a[15]),
                t
              );
            }),
            (mat4.rotate = function(t, a, r, n) {
              var o,
                e,
                i,
                u,
                M,
                m,
                h,
                c,
                f,
                s,
                l,
                v,
                p,
                w,
                g,
                P,
                R,
                x,
                I,
                S,
                d,
                q,
                E,
                O,
                b = n[0],
                T = n[1],
                Y = n[2],
                y = Math.sqrt(b * b + T * T + Y * Y);
              return Math.abs(y) < glMatrix.EPSILON
                ? null
                : ((y = 1 / y),
                  (b *= y),
                  (T *= y),
                  (Y *= y),
                  (o = Math.sin(r)),
                  (e = Math.cos(r)),
                  (i = 1 - e),
                  (u = a[0]),
                  (M = a[1]),
                  (m = a[2]),
                  (h = a[3]),
                  (c = a[4]),
                  (f = a[5]),
                  (s = a[6]),
                  (l = a[7]),
                  (v = a[8]),
                  (p = a[9]),
                  (w = a[10]),
                  (g = a[11]),
                  (P = b * b * i + e),
                  (R = T * b * i + Y * o),
                  (x = Y * b * i - T * o),
                  (I = b * T * i - Y * o),
                  (S = T * T * i + e),
                  (d = Y * T * i + b * o),
                  (q = b * Y * i + T * o),
                  (E = T * Y * i - b * o),
                  (O = Y * Y * i + e),
                  (t[0] = u * P + c * R + v * x),
                  (t[1] = M * P + f * R + p * x),
                  (t[2] = m * P + s * R + w * x),
                  (t[3] = h * P + l * R + g * x),
                  (t[4] = u * I + c * S + v * d),
                  (t[5] = M * I + f * S + p * d),
                  (t[6] = m * I + s * S + w * d),
                  (t[7] = h * I + l * S + g * d),
                  (t[8] = u * q + c * E + v * O),
                  (t[9] = M * q + f * E + p * O),
                  (t[10] = m * q + s * E + w * O),
                  (t[11] = h * q + l * E + g * O),
                  a !== t &&
                    ((t[12] = a[12]),
                    (t[13] = a[13]),
                    (t[14] = a[14]),
                    (t[15] = a[15])),
                  t);
            }),
            (mat4.rotateX = function(t, a, r) {
              var n = Math.sin(r),
                o = Math.cos(r),
                e = a[4],
                i = a[5],
                u = a[6],
                M = a[7],
                m = a[8],
                h = a[9],
                c = a[10],
                f = a[11];
              return (
                a !== t &&
                  ((t[0] = a[0]),
                  (t[1] = a[1]),
                  (t[2] = a[2]),
                  (t[3] = a[3]),
                  (t[12] = a[12]),
                  (t[13] = a[13]),
                  (t[14] = a[14]),
                  (t[15] = a[15])),
                (t[4] = e * o + m * n),
                (t[5] = i * o + h * n),
                (t[6] = u * o + c * n),
                (t[7] = M * o + f * n),
                (t[8] = m * o - e * n),
                (t[9] = h * o - i * n),
                (t[10] = c * o - u * n),
                (t[11] = f * o - M * n),
                t
              );
            }),
            (mat4.rotateY = function(t, a, r) {
              var n = Math.sin(r),
                o = Math.cos(r),
                e = a[0],
                i = a[1],
                u = a[2],
                M = a[3],
                m = a[8],
                h = a[9],
                c = a[10],
                f = a[11];
              return (
                a !== t &&
                  ((t[4] = a[4]),
                  (t[5] = a[5]),
                  (t[6] = a[6]),
                  (t[7] = a[7]),
                  (t[12] = a[12]),
                  (t[13] = a[13]),
                  (t[14] = a[14]),
                  (t[15] = a[15])),
                (t[0] = e * o - m * n),
                (t[1] = i * o - h * n),
                (t[2] = u * o - c * n),
                (t[3] = M * o - f * n),
                (t[8] = e * n + m * o),
                (t[9] = i * n + h * o),
                (t[10] = u * n + c * o),
                (t[11] = M * n + f * o),
                t
              );
            }),
            (mat4.rotateZ = function(t, a, r) {
              var n = Math.sin(r),
                o = Math.cos(r),
                e = a[0],
                i = a[1],
                u = a[2],
                M = a[3],
                m = a[4],
                h = a[5],
                c = a[6],
                f = a[7];
              return (
                a !== t &&
                  ((t[8] = a[8]),
                  (t[9] = a[9]),
                  (t[10] = a[10]),
                  (t[11] = a[11]),
                  (t[12] = a[12]),
                  (t[13] = a[13]),
                  (t[14] = a[14]),
                  (t[15] = a[15])),
                (t[0] = e * o + m * n),
                (t[1] = i * o + h * n),
                (t[2] = u * o + c * n),
                (t[3] = M * o + f * n),
                (t[4] = m * o - e * n),
                (t[5] = h * o - i * n),
                (t[6] = c * o - u * n),
                (t[7] = f * o - M * n),
                t
              );
            }),
            (mat4.fromTranslation = function(t, a) {
              return (
                (t[0] = 1),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = 1),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 0),
                (t[9] = 0),
                (t[10] = 1),
                (t[11] = 0),
                (t[12] = a[0]),
                (t[13] = a[1]),
                (t[14] = a[2]),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromScaling = function(t, a) {
              return (
                (t[0] = a[0]),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = a[1]),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 0),
                (t[9] = 0),
                (t[10] = a[2]),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromRotation = function(t, a, r) {
              var n,
                o,
                e,
                i = r[0],
                u = r[1],
                M = r[2],
                m = Math.sqrt(i * i + u * u + M * M);
              return Math.abs(m) < glMatrix.EPSILON
                ? null
                : ((m = 1 / m),
                  (i *= m),
                  (u *= m),
                  (M *= m),
                  (n = Math.sin(a)),
                  (o = Math.cos(a)),
                  (e = 1 - o),
                  (t[0] = i * i * e + o),
                  (t[1] = u * i * e + M * n),
                  (t[2] = M * i * e - u * n),
                  (t[3] = 0),
                  (t[4] = i * u * e - M * n),
                  (t[5] = u * u * e + o),
                  (t[6] = M * u * e + i * n),
                  (t[7] = 0),
                  (t[8] = i * M * e + u * n),
                  (t[9] = u * M * e - i * n),
                  (t[10] = M * M * e + o),
                  (t[11] = 0),
                  (t[12] = 0),
                  (t[13] = 0),
                  (t[14] = 0),
                  (t[15] = 1),
                  t);
            }),
            (mat4.fromXRotation = function(t, a) {
              var r = Math.sin(a),
                n = Math.cos(a);
              return (
                (t[0] = 1),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = n),
                (t[6] = r),
                (t[7] = 0),
                (t[8] = 0),
                (t[9] = -r),
                (t[10] = n),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromYRotation = function(t, a) {
              var r = Math.sin(a),
                n = Math.cos(a);
              return (
                (t[0] = n),
                (t[1] = 0),
                (t[2] = -r),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = 1),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = r),
                (t[9] = 0),
                (t[10] = n),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromZRotation = function(t, a) {
              var r = Math.sin(a),
                n = Math.cos(a);
              return (
                (t[0] = n),
                (t[1] = r),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = -r),
                (t[5] = n),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 0),
                (t[9] = 0),
                (t[10] = 1),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromRotationTranslation = function(t, a, r) {
              var n = a[0],
                o = a[1],
                e = a[2],
                i = a[3],
                u = n + n,
                M = o + o,
                m = e + e,
                h = n * u,
                c = n * M,
                f = n * m,
                s = o * M,
                l = o * m,
                v = e * m,
                p = i * u,
                w = i * M,
                g = i * m;
              return (
                (t[0] = 1 - (s + v)),
                (t[1] = c + g),
                (t[2] = f - w),
                (t[3] = 0),
                (t[4] = c - g),
                (t[5] = 1 - (h + v)),
                (t[6] = l + p),
                (t[7] = 0),
                (t[8] = f + w),
                (t[9] = l - p),
                (t[10] = 1 - (h + s)),
                (t[11] = 0),
                (t[12] = r[0]),
                (t[13] = r[1]),
                (t[14] = r[2]),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromRotationTranslationScale = function(t, a, r, n) {
              var o = a[0],
                e = a[1],
                i = a[2],
                u = a[3],
                M = o + o,
                m = e + e,
                h = i + i,
                c = o * M,
                f = o * m,
                s = o * h,
                l = e * m,
                v = e * h,
                p = i * h,
                w = u * M,
                g = u * m,
                P = u * h,
                R = n[0],
                x = n[1],
                I = n[2];
              return (
                (t[0] = (1 - (l + p)) * R),
                (t[1] = (f + P) * R),
                (t[2] = (s - g) * R),
                (t[3] = 0),
                (t[4] = (f - P) * x),
                (t[5] = (1 - (c + p)) * x),
                (t[6] = (v + w) * x),
                (t[7] = 0),
                (t[8] = (s + g) * I),
                (t[9] = (v - w) * I),
                (t[10] = (1 - (c + l)) * I),
                (t[11] = 0),
                (t[12] = r[0]),
                (t[13] = r[1]),
                (t[14] = r[2]),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromRotationTranslationScaleOrigin = function(t, a, r, n, o) {
              var e = a[0],
                i = a[1],
                u = a[2],
                M = a[3],
                m = e + e,
                h = i + i,
                c = u + u,
                f = e * m,
                s = e * h,
                l = e * c,
                v = i * h,
                p = i * c,
                w = u * c,
                g = M * m,
                P = M * h,
                R = M * c,
                x = n[0],
                I = n[1],
                S = n[2],
                d = o[0],
                q = o[1],
                E = o[2];
              return (
                (t[0] = (1 - (v + w)) * x),
                (t[1] = (s + R) * x),
                (t[2] = (l - P) * x),
                (t[3] = 0),
                (t[4] = (s - R) * I),
                (t[5] = (1 - (f + w)) * I),
                (t[6] = (p + g) * I),
                (t[7] = 0),
                (t[8] = (l + P) * S),
                (t[9] = (p - g) * S),
                (t[10] = (1 - (f + v)) * S),
                (t[11] = 0),
                (t[12] = r[0] + d - (t[0] * d + t[4] * q + t[8] * E)),
                (t[13] = r[1] + q - (t[1] * d + t[5] * q + t[9] * E)),
                (t[14] = r[2] + E - (t[2] * d + t[6] * q + t[10] * E)),
                (t[15] = 1),
                t
              );
            }),
            (mat4.fromQuat = function(t, a) {
              var r = a[0],
                n = a[1],
                o = a[2],
                e = a[3],
                i = r + r,
                u = n + n,
                M = o + o,
                m = r * i,
                h = n * i,
                c = n * u,
                f = o * i,
                s = o * u,
                l = o * M,
                v = e * i,
                p = e * u,
                w = e * M;
              return (
                (t[0] = 1 - c - l),
                (t[1] = h + w),
                (t[2] = f - p),
                (t[3] = 0),
                (t[4] = h - w),
                (t[5] = 1 - m - l),
                (t[6] = s + v),
                (t[7] = 0),
                (t[8] = f + p),
                (t[9] = s - v),
                (t[10] = 1 - m - c),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                t
              );
            }),
            (mat4.frustum = function(t, a, r, n, o, e, i) {
              var u = 1 / (r - a),
                M = 1 / (o - n),
                m = 1 / (e - i);
              return (
                (t[0] = 2 * e * u),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = 2 * e * M),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = (r + a) * u),
                (t[9] = (o + n) * M),
                (t[10] = (i + e) * m),
                (t[11] = -1),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = i * e * 2 * m),
                (t[15] = 0),
                t
              );
            }),
            (mat4.perspective = function(t, a, r, n, o) {
              var e = 1 / Math.tan(a / 2),
                i = 1 / (n - o);
              return (
                (t[0] = e / r),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = e),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 0),
                (t[9] = 0),
                (t[10] = (o + n) * i),
                (t[11] = -1),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 2 * o * n * i),
                (t[15] = 0),
                t
              );
            }),
            (mat4.perspectiveFromFieldOfView = function(t, a, r, n) {
              var o = Math.tan((a.upDegrees * Math.PI) / 180),
                e = Math.tan((a.downDegrees * Math.PI) / 180),
                i = Math.tan((a.leftDegrees * Math.PI) / 180),
                u = Math.tan((a.rightDegrees * Math.PI) / 180),
                M = 2 / (i + u),
                m = 2 / (o + e);
              return (
                (t[0] = M),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = m),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = -((i - u) * M * 0.5)),
                (t[9] = (o - e) * m * 0.5),
                (t[10] = n / (r - n)),
                (t[11] = -1),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = (n * r) / (r - n)),
                (t[15] = 0),
                t
              );
            }),
            (mat4.ortho = function(t, a, r, n, o, e, i) {
              var u = 1 / (a - r),
                M = 1 / (n - o),
                m = 1 / (e - i);
              return (
                (t[0] = -2 * u),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 0),
                (t[4] = 0),
                (t[5] = -2 * M),
                (t[6] = 0),
                (t[7] = 0),
                (t[8] = 0),
                (t[9] = 0),
                (t[10] = 2 * m),
                (t[11] = 0),
                (t[12] = (a + r) * u),
                (t[13] = (o + n) * M),
                (t[14] = (i + e) * m),
                (t[15] = 1),
                t
              );
            }),
            (mat4.lookAt = function(t, a, r, n) {
              var o,
                e,
                i,
                u,
                M,
                m,
                h,
                c,
                f,
                s,
                l = a[0],
                v = a[1],
                p = a[2],
                w = n[0],
                g = n[1],
                P = n[2],
                R = r[0],
                x = r[1],
                I = r[2];
              return Math.abs(l - R) < glMatrix.EPSILON &&
                Math.abs(v - x) < glMatrix.EPSILON &&
                Math.abs(p - I) < glMatrix.EPSILON
                ? mat4.identity(t)
                : ((h = l - R),
                  (c = v - x),
                  (f = p - I),
                  (s = 1 / Math.sqrt(h * h + c * c + f * f)),
                  (h *= s),
                  (c *= s),
                  (f *= s),
                  (o = g * f - P * c),
                  (e = P * h - w * f),
                  (i = w * c - g * h),
                  (s = Math.sqrt(o * o + e * e + i * i)),
                  s
                    ? ((s = 1 / s), (o *= s), (e *= s), (i *= s))
                    : ((o = 0), (e = 0), (i = 0)),
                  (u = c * i - f * e),
                  (M = f * o - h * i),
                  (m = h * e - c * o),
                  (s = Math.sqrt(u * u + M * M + m * m)),
                  s
                    ? ((s = 1 / s), (u *= s), (M *= s), (m *= s))
                    : ((u = 0), (M = 0), (m = 0)),
                  (t[0] = o),
                  (t[1] = u),
                  (t[2] = h),
                  (t[3] = 0),
                  (t[4] = e),
                  (t[5] = M),
                  (t[6] = c),
                  (t[7] = 0),
                  (t[8] = i),
                  (t[9] = m),
                  (t[10] = f),
                  (t[11] = 0),
                  (t[12] = -(o * l + e * v + i * p)),
                  (t[13] = -(u * l + M * v + m * p)),
                  (t[14] = -(h * l + c * v + f * p)),
                  (t[15] = 1),
                  t);
            }),
            (mat4.str = function(t) {
              return (
                "mat4(" +
                t[0] +
                ", " +
                t[1] +
                ", " +
                t[2] +
                ", " +
                t[3] +
                ", " +
                t[4] +
                ", " +
                t[5] +
                ", " +
                t[6] +
                ", " +
                t[7] +
                ", " +
                t[8] +
                ", " +
                t[9] +
                ", " +
                t[10] +
                ", " +
                t[11] +
                ", " +
                t[12] +
                ", " +
                t[13] +
                ", " +
                t[14] +
                ", " +
                t[15] +
                ")"
              );
            }),
            (mat4.frob = function(t) {
              return Math.sqrt(
                Math.pow(t[0], 2) +
                  Math.pow(t[1], 2) +
                  Math.pow(t[2], 2) +
                  Math.pow(t[3], 2) +
                  Math.pow(t[4], 2) +
                  Math.pow(t[5], 2) +
                  Math.pow(t[6], 2) +
                  Math.pow(t[7], 2) +
                  Math.pow(t[8], 2) +
                  Math.pow(t[9], 2) +
                  Math.pow(t[10], 2) +
                  Math.pow(t[11], 2) +
                  Math.pow(t[12], 2) +
                  Math.pow(t[13], 2) +
                  Math.pow(t[14], 2) +
                  Math.pow(t[15], 2)
              );
            }),
            (module.exports = mat4);
        },
        { "./common.js": 114 }
      ],
      119: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            mat3 = require("./mat3.js"),
            vec3 = require("./vec3.js"),
            vec4 = require("./vec4.js"),
            quat = {};
          (quat.create = function() {
            var t = new glMatrix.ARRAY_TYPE(4);
            return (t[0] = 0), (t[1] = 0), (t[2] = 0), (t[3] = 1), t;
          }),
            (quat.rotationTo = (function() {
              var t = vec3.create(),
                a = vec3.fromValues(1, 0, 0),
                e = vec3.fromValues(0, 1, 0);
              return function(r, u, n) {
                var c = vec3.dot(u, n);
                return -0.999999 > c
                  ? (vec3.cross(t, a, u),
                    vec3.length(t) < 1e-6 && vec3.cross(t, e, u),
                    vec3.normalize(t, t),
                    quat.setAxisAngle(r, t, Math.PI),
                    r)
                  : c > 0.999999
                  ? ((r[0] = 0), (r[1] = 0), (r[2] = 0), (r[3] = 1), r)
                  : (vec3.cross(t, u, n),
                    (r[0] = t[0]),
                    (r[1] = t[1]),
                    (r[2] = t[2]),
                    (r[3] = 1 + c),
                    quat.normalize(r, r));
              };
            })()),
            (quat.setAxes = (function() {
              var t = mat3.create();
              return function(a, e, r, u) {
                return (
                  (t[0] = r[0]),
                  (t[3] = r[1]),
                  (t[6] = r[2]),
                  (t[1] = u[0]),
                  (t[4] = u[1]),
                  (t[7] = u[2]),
                  (t[2] = -e[0]),
                  (t[5] = -e[1]),
                  (t[8] = -e[2]),
                  quat.normalize(a, quat.fromMat3(a, t))
                );
              };
            })()),
            (quat.clone = vec4.clone),
            (quat.fromValues = vec4.fromValues),
            (quat.copy = vec4.copy),
            (quat.set = vec4.set),
            (quat.identity = function(t) {
              return (t[0] = 0), (t[1] = 0), (t[2] = 0), (t[3] = 1), t;
            }),
            (quat.setAxisAngle = function(t, a, e) {
              e = 0.5 * e;
              var r = Math.sin(e);
              return (
                (t[0] = r * a[0]),
                (t[1] = r * a[1]),
                (t[2] = r * a[2]),
                (t[3] = Math.cos(e)),
                t
              );
            }),
            (quat.add = vec4.add),
            (quat.multiply = function(t, a, e) {
              var r = a[0],
                u = a[1],
                n = a[2],
                c = a[3],
                q = e[0],
                o = e[1],
                s = e[2],
                i = e[3];
              return (
                (t[0] = r * i + c * q + u * s - n * o),
                (t[1] = u * i + c * o + n * q - r * s),
                (t[2] = n * i + c * s + r * o - u * q),
                (t[3] = c * i - r * q - u * o - n * s),
                t
              );
            }),
            (quat.mul = quat.multiply),
            (quat.scale = vec4.scale),
            (quat.rotateX = function(t, a, e) {
              e *= 0.5;
              var r = a[0],
                u = a[1],
                n = a[2],
                c = a[3],
                q = Math.sin(e),
                o = Math.cos(e);
              return (
                (t[0] = r * o + c * q),
                (t[1] = u * o + n * q),
                (t[2] = n * o - u * q),
                (t[3] = c * o - r * q),
                t
              );
            }),
            (quat.rotateY = function(t, a, e) {
              e *= 0.5;
              var r = a[0],
                u = a[1],
                n = a[2],
                c = a[3],
                q = Math.sin(e),
                o = Math.cos(e);
              return (
                (t[0] = r * o - n * q),
                (t[1] = u * o + c * q),
                (t[2] = n * o + r * q),
                (t[3] = c * o - u * q),
                t
              );
            }),
            (quat.rotateZ = function(t, a, e) {
              e *= 0.5;
              var r = a[0],
                u = a[1],
                n = a[2],
                c = a[3],
                q = Math.sin(e),
                o = Math.cos(e);
              return (
                (t[0] = r * o + u * q),
                (t[1] = u * o - r * q),
                (t[2] = n * o + c * q),
                (t[3] = c * o - n * q),
                t
              );
            }),
            (quat.calculateW = function(t, a) {
              var e = a[0],
                r = a[1],
                u = a[2];
              return (
                (t[0] = e),
                (t[1] = r),
                (t[2] = u),
                (t[3] = Math.sqrt(Math.abs(1 - e * e - r * r - u * u))),
                t
              );
            }),
            (quat.dot = vec4.dot),
            (quat.lerp = vec4.lerp),
            (quat.slerp = function(t, a, e, r) {
              var u,
                n,
                c,
                q,
                o,
                s = a[0],
                i = a[1],
                v = a[2],
                l = a[3],
                f = e[0],
                h = e[1],
                M = e[2],
                m = e[3];
              return (
                (n = s * f + i * h + v * M + l * m),
                0 > n && ((n = -n), (f = -f), (h = -h), (M = -M), (m = -m)),
                1 - n > 1e-6
                  ? ((u = Math.acos(n)),
                    (c = Math.sin(u)),
                    (q = Math.sin((1 - r) * u) / c),
                    (o = Math.sin(r * u) / c))
                  : ((q = 1 - r), (o = r)),
                (t[0] = q * s + o * f),
                (t[1] = q * i + o * h),
                (t[2] = q * v + o * M),
                (t[3] = q * l + o * m),
                t
              );
            }),
            (quat.sqlerp = (function() {
              var t = quat.create(),
                a = quat.create();
              return function(e, r, u, n, c, q) {
                return (
                  quat.slerp(t, r, c, q),
                  quat.slerp(a, u, n, q),
                  quat.slerp(e, t, a, 2 * q * (1 - q)),
                  e
                );
              };
            })()),
            (quat.invert = function(t, a) {
              var e = a[0],
                r = a[1],
                u = a[2],
                n = a[3],
                c = e * e + r * r + u * u + n * n,
                q = c ? 1 / c : 0;
              return (
                (t[0] = -e * q),
                (t[1] = -r * q),
                (t[2] = -u * q),
                (t[3] = n * q),
                t
              );
            }),
            (quat.conjugate = function(t, a) {
              return (
                (t[0] = -a[0]), (t[1] = -a[1]), (t[2] = -a[2]), (t[3] = a[3]), t
              );
            }),
            (quat.length = vec4.length),
            (quat.len = quat.length),
            (quat.squaredLength = vec4.squaredLength),
            (quat.sqrLen = quat.squaredLength),
            (quat.normalize = vec4.normalize),
            (quat.fromMat3 = function(t, a) {
              var e,
                r = a[0] + a[4] + a[8];
              if (r > 0)
                (e = Math.sqrt(r + 1)),
                  (t[3] = 0.5 * e),
                  (e = 0.5 / e),
                  (t[0] = (a[5] - a[7]) * e),
                  (t[1] = (a[6] - a[2]) * e),
                  (t[2] = (a[1] - a[3]) * e);
              else {
                var u = 0;
                a[4] > a[0] && (u = 1), a[8] > a[3 * u + u] && (u = 2);
                var n = (u + 1) % 3,
                  c = (u + 2) % 3;
                (e = Math.sqrt(a[3 * u + u] - a[3 * n + n] - a[3 * c + c] + 1)),
                  (t[u] = 0.5 * e),
                  (e = 0.5 / e),
                  (t[3] = (a[3 * n + c] - a[3 * c + n]) * e),
                  (t[n] = (a[3 * n + u] + a[3 * u + n]) * e),
                  (t[c] = (a[3 * c + u] + a[3 * u + c]) * e);
              }
              return t;
            }),
            (quat.str = function(t) {
              return (
                "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
              );
            }),
            (module.exports = quat);
        },
        {
          "./common.js": 114,
          "./mat3.js": 117,
          "./vec3.js": 121,
          "./vec4.js": 122
        }
      ],
      120: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            vec2 = {};
          (vec2.create = function() {
            var n = new glMatrix.ARRAY_TYPE(2);
            return (n[0] = 0), (n[1] = 0), n;
          }),
            (vec2.clone = function(n) {
              var e = new glMatrix.ARRAY_TYPE(2);
              return (e[0] = n[0]), (e[1] = n[1]), e;
            }),
            (vec2.fromValues = function(n, e) {
              var r = new glMatrix.ARRAY_TYPE(2);
              return (r[0] = n), (r[1] = e), r;
            }),
            (vec2.copy = function(n, e) {
              return (n[0] = e[0]), (n[1] = e[1]), n;
            }),
            (vec2.set = function(n, e, r) {
              return (n[0] = e), (n[1] = r), n;
            }),
            (vec2.add = function(n, e, r) {
              return (n[0] = e[0] + r[0]), (n[1] = e[1] + r[1]), n;
            }),
            (vec2.subtract = function(n, e, r) {
              return (n[0] = e[0] - r[0]), (n[1] = e[1] - r[1]), n;
            }),
            (vec2.sub = vec2.subtract),
            (vec2.multiply = function(n, e, r) {
              return (n[0] = e[0] * r[0]), (n[1] = e[1] * r[1]), n;
            }),
            (vec2.mul = vec2.multiply),
            (vec2.divide = function(n, e, r) {
              return (n[0] = e[0] / r[0]), (n[1] = e[1] / r[1]), n;
            }),
            (vec2.div = vec2.divide),
            (vec2.min = function(n, e, r) {
              return (
                (n[0] = Math.min(e[0], r[0])), (n[1] = Math.min(e[1], r[1])), n
              );
            }),
            (vec2.max = function(n, e, r) {
              return (
                (n[0] = Math.max(e[0], r[0])), (n[1] = Math.max(e[1], r[1])), n
              );
            }),
            (vec2.scale = function(n, e, r) {
              return (n[0] = e[0] * r), (n[1] = e[1] * r), n;
            }),
            (vec2.scaleAndAdd = function(n, e, r, t) {
              return (n[0] = e[0] + r[0] * t), (n[1] = e[1] + r[1] * t), n;
            }),
            (vec2.distance = function(n, e) {
              var r = e[0] - n[0],
                t = e[1] - n[1];
              return Math.sqrt(r * r + t * t);
            }),
            (vec2.dist = vec2.distance),
            (vec2.squaredDistance = function(n, e) {
              var r = e[0] - n[0],
                t = e[1] - n[1];
              return r * r + t * t;
            }),
            (vec2.sqrDist = vec2.squaredDistance),
            (vec2.length = function(n) {
              var e = n[0],
                r = n[1];
              return Math.sqrt(e * e + r * r);
            }),
            (vec2.len = vec2.length),
            (vec2.squaredLength = function(n) {
              var e = n[0],
                r = n[1];
              return e * e + r * r;
            }),
            (vec2.sqrLen = vec2.squaredLength),
            (vec2.negate = function(n, e) {
              return (n[0] = -e[0]), (n[1] = -e[1]), n;
            }),
            (vec2.inverse = function(n, e) {
              return (n[0] = 1 / e[0]), (n[1] = 1 / e[1]), n;
            }),
            (vec2.normalize = function(n, e) {
              var r = e[0],
                t = e[1],
                c = r * r + t * t;
              return (
                c > 0 &&
                  ((c = 1 / Math.sqrt(c)),
                  (n[0] = e[0] * c),
                  (n[1] = e[1] * c)),
                n
              );
            }),
            (vec2.dot = function(n, e) {
              return n[0] * e[0] + n[1] * e[1];
            }),
            (vec2.cross = function(n, e, r) {
              var t = e[0] * r[1] - e[1] * r[0];
              return (n[0] = n[1] = 0), (n[2] = t), n;
            }),
            (vec2.lerp = function(n, e, r, t) {
              var c = e[0],
                u = e[1];
              return (
                (n[0] = c + t * (r[0] - c)), (n[1] = u + t * (r[1] - u)), n
              );
            }),
            (vec2.random = function(n, e) {
              e = e || 1;
              var r = 2 * glMatrix.RANDOM() * Math.PI;
              return (n[0] = Math.cos(r) * e), (n[1] = Math.sin(r) * e), n;
            }),
            (vec2.transformMat2 = function(n, e, r) {
              var t = e[0],
                c = e[1];
              return (
                (n[0] = r[0] * t + r[2] * c), (n[1] = r[1] * t + r[3] * c), n
              );
            }),
            (vec2.transformMat2d = function(n, e, r) {
              var t = e[0],
                c = e[1];
              return (
                (n[0] = r[0] * t + r[2] * c + r[4]),
                (n[1] = r[1] * t + r[3] * c + r[5]),
                n
              );
            }),
            (vec2.transformMat3 = function(n, e, r) {
              var t = e[0],
                c = e[1];
              return (
                (n[0] = r[0] * t + r[3] * c + r[6]),
                (n[1] = r[1] * t + r[4] * c + r[7]),
                n
              );
            }),
            (vec2.transformMat4 = function(n, e, r) {
              var t = e[0],
                c = e[1];
              return (
                (n[0] = r[0] * t + r[4] * c + r[12]),
                (n[1] = r[1] * t + r[5] * c + r[13]),
                n
              );
            }),
            (vec2.forEach = (function() {
              var n = vec2.create();
              return function(e, r, t, c, u, v) {
                var a, i;
                for (
                  r || (r = 2),
                    t || (t = 0),
                    i = c ? Math.min(c * r + t, e.length) : e.length,
                    a = t;
                  i > a;
                  a += r
                )
                  (n[0] = e[a]),
                    (n[1] = e[a + 1]),
                    u(n, n, v),
                    (e[a] = n[0]),
                    (e[a + 1] = n[1]);
                return e;
              };
            })()),
            (vec2.str = function(n) {
              return "vec2(" + n[0] + ", " + n[1] + ")";
            }),
            (module.exports = vec2);
        },
        { "./common.js": 114 }
      ],
      121: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            vec3 = {};
          (vec3.create = function() {
            var n = new glMatrix.ARRAY_TYPE(3);
            return (n[0] = 0), (n[1] = 0), (n[2] = 0), n;
          }),
            (vec3.clone = function(n) {
              var t = new glMatrix.ARRAY_TYPE(3);
              return (t[0] = n[0]), (t[1] = n[1]), (t[2] = n[2]), t;
            }),
            (vec3.fromValues = function(n, t, e) {
              var r = new glMatrix.ARRAY_TYPE(3);
              return (r[0] = n), (r[1] = t), (r[2] = e), r;
            }),
            (vec3.copy = function(n, t) {
              return (n[0] = t[0]), (n[1] = t[1]), (n[2] = t[2]), n;
            }),
            (vec3.set = function(n, t, e, r) {
              return (n[0] = t), (n[1] = e), (n[2] = r), n;
            }),
            (vec3.add = function(n, t, e) {
              return (
                (n[0] = t[0] + e[0]),
                (n[1] = t[1] + e[1]),
                (n[2] = t[2] + e[2]),
                n
              );
            }),
            (vec3.subtract = function(n, t, e) {
              return (
                (n[0] = t[0] - e[0]),
                (n[1] = t[1] - e[1]),
                (n[2] = t[2] - e[2]),
                n
              );
            }),
            (vec3.sub = vec3.subtract),
            (vec3.multiply = function(n, t, e) {
              return (
                (n[0] = t[0] * e[0]),
                (n[1] = t[1] * e[1]),
                (n[2] = t[2] * e[2]),
                n
              );
            }),
            (vec3.mul = vec3.multiply),
            (vec3.divide = function(n, t, e) {
              return (
                (n[0] = t[0] / e[0]),
                (n[1] = t[1] / e[1]),
                (n[2] = t[2] / e[2]),
                n
              );
            }),
            (vec3.div = vec3.divide),
            (vec3.min = function(n, t, e) {
              return (
                (n[0] = Math.min(t[0], e[0])),
                (n[1] = Math.min(t[1], e[1])),
                (n[2] = Math.min(t[2], e[2])),
                n
              );
            }),
            (vec3.max = function(n, t, e) {
              return (
                (n[0] = Math.max(t[0], e[0])),
                (n[1] = Math.max(t[1], e[1])),
                (n[2] = Math.max(t[2], e[2])),
                n
              );
            }),
            (vec3.scale = function(n, t, e) {
              return (n[0] = t[0] * e), (n[1] = t[1] * e), (n[2] = t[2] * e), n;
            }),
            (vec3.scaleAndAdd = function(n, t, e, r) {
              return (
                (n[0] = t[0] + e[0] * r),
                (n[1] = t[1] + e[1] * r),
                (n[2] = t[2] + e[2] * r),
                n
              );
            }),
            (vec3.distance = function(n, t) {
              var e = t[0] - n[0],
                r = t[1] - n[1],
                c = t[2] - n[2];
              return Math.sqrt(e * e + r * r + c * c);
            }),
            (vec3.dist = vec3.distance),
            (vec3.squaredDistance = function(n, t) {
              var e = t[0] - n[0],
                r = t[1] - n[1],
                c = t[2] - n[2];
              return e * e + r * r + c * c;
            }),
            (vec3.sqrDist = vec3.squaredDistance),
            (vec3.length = function(n) {
              var t = n[0],
                e = n[1],
                r = n[2];
              return Math.sqrt(t * t + e * e + r * r);
            }),
            (vec3.len = vec3.length),
            (vec3.squaredLength = function(n) {
              var t = n[0],
                e = n[1],
                r = n[2];
              return t * t + e * e + r * r;
            }),
            (vec3.sqrLen = vec3.squaredLength),
            (vec3.negate = function(n, t) {
              return (n[0] = -t[0]), (n[1] = -t[1]), (n[2] = -t[2]), n;
            }),
            (vec3.inverse = function(n, t) {
              return (n[0] = 1 / t[0]), (n[1] = 1 / t[1]), (n[2] = 1 / t[2]), n;
            }),
            (vec3.normalize = function(n, t) {
              var e = t[0],
                r = t[1],
                c = t[2],
                a = e * e + r * r + c * c;
              return (
                a > 0 &&
                  ((a = 1 / Math.sqrt(a)),
                  (n[0] = t[0] * a),
                  (n[1] = t[1] * a),
                  (n[2] = t[2] * a)),
                n
              );
            }),
            (vec3.dot = function(n, t) {
              return n[0] * t[0] + n[1] * t[1] + n[2] * t[2];
            }),
            (vec3.cross = function(n, t, e) {
              var r = t[0],
                c = t[1],
                a = t[2],
                u = e[0],
                v = e[1],
                i = e[2];
              return (
                (n[0] = c * i - a * v),
                (n[1] = a * u - r * i),
                (n[2] = r * v - c * u),
                n
              );
            }),
            (vec3.lerp = function(n, t, e, r) {
              var c = t[0],
                a = t[1],
                u = t[2];
              return (
                (n[0] = c + r * (e[0] - c)),
                (n[1] = a + r * (e[1] - a)),
                (n[2] = u + r * (e[2] - u)),
                n
              );
            }),
            (vec3.hermite = function(n, t, e, r, c, a) {
              var u = a * a,
                v = u * (2 * a - 3) + 1,
                i = u * (a - 2) + a,
                o = u * (a - 1),
                s = u * (3 - 2 * a);
              return (
                (n[0] = t[0] * v + e[0] * i + r[0] * o + c[0] * s),
                (n[1] = t[1] * v + e[1] * i + r[1] * o + c[1] * s),
                (n[2] = t[2] * v + e[2] * i + r[2] * o + c[2] * s),
                n
              );
            }),
            (vec3.bezier = function(n, t, e, r, c, a) {
              var u = 1 - a,
                v = u * u,
                i = a * a,
                o = v * u,
                s = 3 * a * v,
                f = 3 * i * u,
                M = i * a;
              return (
                (n[0] = t[0] * o + e[0] * s + r[0] * f + c[0] * M),
                (n[1] = t[1] * o + e[1] * s + r[1] * f + c[1] * M),
                (n[2] = t[2] * o + e[2] * s + r[2] * f + c[2] * M),
                n
              );
            }),
            (vec3.random = function(n, t) {
              t = t || 1;
              var e = 2 * glMatrix.RANDOM() * Math.PI,
                r = 2 * glMatrix.RANDOM() - 1,
                c = Math.sqrt(1 - r * r) * t;
              return (
                (n[0] = Math.cos(e) * c),
                (n[1] = Math.sin(e) * c),
                (n[2] = r * t),
                n
              );
            }),
            (vec3.transformMat4 = function(n, t, e) {
              var r = t[0],
                c = t[1],
                a = t[2],
                u = e[3] * r + e[7] * c + e[11] * a + e[15];
              return (
                (u = u || 1),
                (n[0] = (e[0] * r + e[4] * c + e[8] * a + e[12]) / u),
                (n[1] = (e[1] * r + e[5] * c + e[9] * a + e[13]) / u),
                (n[2] = (e[2] * r + e[6] * c + e[10] * a + e[14]) / u),
                n
              );
            }),
            (vec3.transformMat3 = function(n, t, e) {
              var r = t[0],
                c = t[1],
                a = t[2];
              return (
                (n[0] = r * e[0] + c * e[3] + a * e[6]),
                (n[1] = r * e[1] + c * e[4] + a * e[7]),
                (n[2] = r * e[2] + c * e[5] + a * e[8]),
                n
              );
            }),
            (vec3.transformQuat = function(n, t, e) {
              var r = t[0],
                c = t[1],
                a = t[2],
                u = e[0],
                v = e[1],
                i = e[2],
                o = e[3],
                s = o * r + v * a - i * c,
                f = o * c + i * r - u * a,
                M = o * a + u * c - v * r,
                h = -u * r - v * c - i * a;
              return (
                (n[0] = s * o + h * -u + f * -i - M * -v),
                (n[1] = f * o + h * -v + M * -u - s * -i),
                (n[2] = M * o + h * -i + s * -v - f * -u),
                n
              );
            }),
            (vec3.rotateX = function(n, t, e, r) {
              var c = [],
                a = [];
              return (
                (c[0] = t[0] - e[0]),
                (c[1] = t[1] - e[1]),
                (c[2] = t[2] - e[2]),
                (a[0] = c[0]),
                (a[1] = c[1] * Math.cos(r) - c[2] * Math.sin(r)),
                (a[2] = c[1] * Math.sin(r) + c[2] * Math.cos(r)),
                (n[0] = a[0] + e[0]),
                (n[1] = a[1] + e[1]),
                (n[2] = a[2] + e[2]),
                n
              );
            }),
            (vec3.rotateY = function(n, t, e, r) {
              var c = [],
                a = [];
              return (
                (c[0] = t[0] - e[0]),
                (c[1] = t[1] - e[1]),
                (c[2] = t[2] - e[2]),
                (a[0] = c[2] * Math.sin(r) + c[0] * Math.cos(r)),
                (a[1] = c[1]),
                (a[2] = c[2] * Math.cos(r) - c[0] * Math.sin(r)),
                (n[0] = a[0] + e[0]),
                (n[1] = a[1] + e[1]),
                (n[2] = a[2] + e[2]),
                n
              );
            }),
            (vec3.rotateZ = function(n, t, e, r) {
              var c = [],
                a = [];
              return (
                (c[0] = t[0] - e[0]),
                (c[1] = t[1] - e[1]),
                (c[2] = t[2] - e[2]),
                (a[0] = c[0] * Math.cos(r) - c[1] * Math.sin(r)),
                (a[1] = c[0] * Math.sin(r) + c[1] * Math.cos(r)),
                (a[2] = c[2]),
                (n[0] = a[0] + e[0]),
                (n[1] = a[1] + e[1]),
                (n[2] = a[2] + e[2]),
                n
              );
            }),
            (vec3.forEach = (function() {
              var n = vec3.create();
              return function(t, e, r, c, a, u) {
                var v, i;
                for (
                  e || (e = 3),
                    r || (r = 0),
                    i = c ? Math.min(c * e + r, t.length) : t.length,
                    v = r;
                  i > v;
                  v += e
                )
                  (n[0] = t[v]),
                    (n[1] = t[v + 1]),
                    (n[2] = t[v + 2]),
                    a(n, n, u),
                    (t[v] = n[0]),
                    (t[v + 1] = n[1]),
                    (t[v + 2] = n[2]);
                return t;
              };
            })()),
            (vec3.angle = function(n, t) {
              var e = vec3.fromValues(n[0], n[1], n[2]),
                r = vec3.fromValues(t[0], t[1], t[2]);
              vec3.normalize(e, e), vec3.normalize(r, r);
              var c = vec3.dot(e, r);
              return c > 1 ? 0 : Math.acos(c);
            }),
            (vec3.str = function(n) {
              return "vec3(" + n[0] + ", " + n[1] + ", " + n[2] + ")";
            }),
            (module.exports = vec3);
        },
        { "./common.js": 114 }
      ],
      122: [
        function(require, module, exports) {
          var glMatrix = require("./common.js"),
            vec4 = {};
          (vec4.create = function() {
            var e = new glMatrix.ARRAY_TYPE(4);
            return (e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0), e;
          }),
            (vec4.clone = function(e) {
              var n = new glMatrix.ARRAY_TYPE(4);
              return (
                (n[0] = e[0]), (n[1] = e[1]), (n[2] = e[2]), (n[3] = e[3]), n
              );
            }),
            (vec4.fromValues = function(e, n, t, r) {
              var c = new glMatrix.ARRAY_TYPE(4);
              return (c[0] = e), (c[1] = n), (c[2] = t), (c[3] = r), c;
            }),
            (vec4.copy = function(e, n) {
              return (
                (e[0] = n[0]), (e[1] = n[1]), (e[2] = n[2]), (e[3] = n[3]), e
              );
            }),
            (vec4.set = function(e, n, t, r, c) {
              return (e[0] = n), (e[1] = t), (e[2] = r), (e[3] = c), e;
            }),
            (vec4.add = function(e, n, t) {
              return (
                (e[0] = n[0] + t[0]),
                (e[1] = n[1] + t[1]),
                (e[2] = n[2] + t[2]),
                (e[3] = n[3] + t[3]),
                e
              );
            }),
            (vec4.subtract = function(e, n, t) {
              return (
                (e[0] = n[0] - t[0]),
                (e[1] = n[1] - t[1]),
                (e[2] = n[2] - t[2]),
                (e[3] = n[3] - t[3]),
                e
              );
            }),
            (vec4.sub = vec4.subtract),
            (vec4.multiply = function(e, n, t) {
              return (
                (e[0] = n[0] * t[0]),
                (e[1] = n[1] * t[1]),
                (e[2] = n[2] * t[2]),
                (e[3] = n[3] * t[3]),
                e
              );
            }),
            (vec4.mul = vec4.multiply),
            (vec4.divide = function(e, n, t) {
              return (
                (e[0] = n[0] / t[0]),
                (e[1] = n[1] / t[1]),
                (e[2] = n[2] / t[2]),
                (e[3] = n[3] / t[3]),
                e
              );
            }),
            (vec4.div = vec4.divide),
            (vec4.min = function(e, n, t) {
              return (
                (e[0] = Math.min(n[0], t[0])),
                (e[1] = Math.min(n[1], t[1])),
                (e[2] = Math.min(n[2], t[2])),
                (e[3] = Math.min(n[3], t[3])),
                e
              );
            }),
            (vec4.max = function(e, n, t) {
              return (
                (e[0] = Math.max(n[0], t[0])),
                (e[1] = Math.max(n[1], t[1])),
                (e[2] = Math.max(n[2], t[2])),
                (e[3] = Math.max(n[3], t[3])),
                e
              );
            }),
            (vec4.scale = function(e, n, t) {
              return (
                (e[0] = n[0] * t),
                (e[1] = n[1] * t),
                (e[2] = n[2] * t),
                (e[3] = n[3] * t),
                e
              );
            }),
            (vec4.scaleAndAdd = function(e, n, t, r) {
              return (
                (e[0] = n[0] + t[0] * r),
                (e[1] = n[1] + t[1] * r),
                (e[2] = n[2] + t[2] * r),
                (e[3] = n[3] + t[3] * r),
                e
              );
            }),
            (vec4.distance = function(e, n) {
              var t = n[0] - e[0],
                r = n[1] - e[1],
                c = n[2] - e[2],
                u = n[3] - e[3];
              return Math.sqrt(t * t + r * r + c * c + u * u);
            }),
            (vec4.dist = vec4.distance),
            (vec4.squaredDistance = function(e, n) {
              var t = n[0] - e[0],
                r = n[1] - e[1],
                c = n[2] - e[2],
                u = n[3] - e[3];
              return t * t + r * r + c * c + u * u;
            }),
            (vec4.sqrDist = vec4.squaredDistance),
            (vec4.length = function(e) {
              var n = e[0],
                t = e[1],
                r = e[2],
                c = e[3];
              return Math.sqrt(n * n + t * t + r * r + c * c);
            }),
            (vec4.len = vec4.length),
            (vec4.squaredLength = function(e) {
              var n = e[0],
                t = e[1],
                r = e[2],
                c = e[3];
              return n * n + t * t + r * r + c * c;
            }),
            (vec4.sqrLen = vec4.squaredLength),
            (vec4.negate = function(e, n) {
              return (
                (e[0] = -n[0]),
                (e[1] = -n[1]),
                (e[2] = -n[2]),
                (e[3] = -n[3]),
                e
              );
            }),
            (vec4.inverse = function(e, n) {
              return (
                (e[0] = 1 / n[0]),
                (e[1] = 1 / n[1]),
                (e[2] = 1 / n[2]),
                (e[3] = 1 / n[3]),
                e
              );
            }),
            (vec4.normalize = function(e, n) {
              var t = n[0],
                r = n[1],
                c = n[2],
                u = n[3],
                a = t * t + r * r + c * c + u * u;
              return (
                a > 0 &&
                  ((a = 1 / Math.sqrt(a)),
                  (e[0] = t * a),
                  (e[1] = r * a),
                  (e[2] = c * a),
                  (e[3] = u * a)),
                e
              );
            }),
            (vec4.dot = function(e, n) {
              return e[0] * n[0] + e[1] * n[1] + e[2] * n[2] + e[3] * n[3];
            }),
            (vec4.lerp = function(e, n, t, r) {
              var c = n[0],
                u = n[1],
                a = n[2],
                v = n[3];
              return (
                (e[0] = c + r * (t[0] - c)),
                (e[1] = u + r * (t[1] - u)),
                (e[2] = a + r * (t[2] - a)),
                (e[3] = v + r * (t[3] - v)),
                e
              );
            }),
            (vec4.random = function(e, n) {
              return (
                (n = n || 1),
                (e[0] = glMatrix.RANDOM()),
                (e[1] = glMatrix.RANDOM()),
                (e[2] = glMatrix.RANDOM()),
                (e[3] = glMatrix.RANDOM()),
                vec4.normalize(e, e),
                vec4.scale(e, e, n),
                e
              );
            }),
            (vec4.transformMat4 = function(e, n, t) {
              var r = n[0],
                c = n[1],
                u = n[2],
                a = n[3];
              return (
                (e[0] = t[0] * r + t[4] * c + t[8] * u + t[12] * a),
                (e[1] = t[1] * r + t[5] * c + t[9] * u + t[13] * a),
                (e[2] = t[2] * r + t[6] * c + t[10] * u + t[14] * a),
                (e[3] = t[3] * r + t[7] * c + t[11] * u + t[15] * a),
                e
              );
            }),
            (vec4.transformQuat = function(e, n, t) {
              var r = n[0],
                c = n[1],
                u = n[2],
                a = t[0],
                v = t[1],
                i = t[2],
                o = t[3],
                f = o * r + v * u - i * c,
                s = o * c + i * r - a * u,
                l = o * u + a * c - v * r,
                M = -a * r - v * c - i * u;
              return (
                (e[0] = f * o + M * -a + s * -i - l * -v),
                (e[1] = s * o + M * -v + l * -a - f * -i),
                (e[2] = l * o + M * -i + f * -v - s * -a),
                (e[3] = n[3]),
                e
              );
            }),
            (vec4.forEach = (function() {
              var e = vec4.create();
              return function(n, t, r, c, u, a) {
                var v, i;
                for (
                  t || (t = 4),
                    r || (r = 0),
                    i = c ? Math.min(c * t + r, n.length) : n.length,
                    v = r;
                  i > v;
                  v += t
                )
                  (e[0] = n[v]),
                    (e[1] = n[v + 1]),
                    (e[2] = n[v + 2]),
                    (e[3] = n[v + 3]),
                    u(e, e, a),
                    (n[v] = e[0]),
                    (n[v + 1] = e[1]),
                    (n[v + 2] = e[2]),
                    (n[v + 3] = e[3]);
                return n;
              };
            })()),
            (vec4.str = function(e) {
              return (
                "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")"
              );
            }),
            (module.exports = vec4);
        },
        { "./common.js": 114 }
      ],
      123: [
        function(require, module, exports) {
          "use strict";
          function constant(r) {
            return function() {
              return r;
            };
          }
          function interpolateNumber(r, t, n) {
            return r * (1 - n) + t * n;
          }
          function interpolateArray(r, t, n) {
            for (var e = [], o = 0; o < r.length; o++)
              e[o] = interpolateNumber(r[o], t[o], n);
            return e;
          }
          (exports.interpolated = function(r) {
            if (!r.stops) return constant(r);
            var t = r.stops,
              n = r.base || 1,
              e = Array.isArray(t[0][1]) ? interpolateArray : interpolateNumber;
            return function(r) {
              for (var o, a, i = 0; i < t.length; i++) {
                var u = t[i];
                if ((u[0] <= r && (o = u), u[0] > r)) {
                  a = u;
                  break;
                }
              }
              if (o && a) {
                var s = a[0] - o[0],
                  f = r - o[0],
                  p =
                    1 === n
                      ? f / s
                      : (Math.pow(n, f) - 1) / (Math.pow(n, s) - 1);
                return e(o[1], a[1], p);
              }
              return o ? o[1] : a ? a[1] : void 0;
            };
          }),
            (exports["piecewise-constant"] = function(r) {
              if (!r.stops) return constant(r);
              var t = r.stops;
              return function(r) {
                for (var n = 0; n < t.length; n++)
                  if (t[n][0] > r) return t[0 === n ? 0 : n - 1][1];
                return t[t.length - 1][1];
              };
            });
        },
        {}
      ],
      124: [
        function(require, module, exports) {
          "use strict";
          var reference = require("../../reference/latest.min.js"),
            validate = require("./parsed");
          module.exports = function(e) {
            return validate(e, reference);
          };
        },
        { "../../reference/latest.min.js": 127, "./parsed": 125 }
      ],
      125: [
        function(require, module, exports) {
          "use strict";
          function typeof_(e) {
            return e instanceof Number
              ? "number"
              : e instanceof String
              ? "string"
              : e instanceof Boolean
              ? "boolean"
              : Array.isArray(e)
              ? "array"
              : null === e
              ? "null"
              : typeof e;
          }
          function unbundle(e) {
            return e instanceof Number ||
              e instanceof String ||
              e instanceof Boolean
              ? e.valueOf()
              : e;
          }
          var parseCSSColor = require("csscolorparser").parseCSSColor,
            format = require("util").format;
          module.exports = function(e, t) {
            function r(e, t) {
              var r = {
                message:
                  (e ? e + ": " : "") +
                  format.apply(format, Array.prototype.slice.call(arguments, 2))
              };
              null !== t && void 0 !== t && t.__line__ && (r.line = t.__line__),
                s.push(r);
            }
            function n(e, o, i) {
              var s = typeof_(o);
              if ("string" === s && "@" === o[0]) {
                if (t.$version > 7)
                  return r(e, o, "constants have been deprecated as of v8");
                if (!(o in a)) return r(e, o, 'constant "%s" not found', o);
                (o = a[o]), (s = typeof_(o));
              }
              if (i["function"] && "object" === s)
                return n["function"](e, o, i);
              if (i.type) {
                var u = n[i.type];
                if (u) return u(e, o, i);
                i = t[i.type];
              }
              n.object(e, o, i);
            }
            function o(e) {
              return function(t, n, o) {
                var a = typeof_(n);
                a !== e && r(t, n, "%s expected, %s found", e, a),
                  "minimum" in o &&
                    n < o.minimum &&
                    r(
                      t,
                      n,
                      "%s is less than the minimum value %s",
                      n,
                      o.minimum
                    ),
                  "maximum" in o &&
                    n > o.maximum &&
                    r(
                      t,
                      n,
                      "%s is greater than the maximum value %s",
                      n,
                      o.maximum
                    );
              };
            }
            var a = e.constants || {},
              i = {},
              s = [];
            return (
              (n.constants = function(e, n) {
                if (t.$version > 7) {
                  if (n)
                    return r(e, n, "constants have been deprecated as of v8");
                } else {
                  var o = typeof_(n);
                  if ("object" !== o)
                    return r(e, n, "object expected, %s found", o);
                  for (var a in n)
                    "@" !== a[0] &&
                      r(e + "." + a, n[a], 'constants must start with "@"');
                }
              }),
              (n.source = function(e, o) {
                if (!o.type) return void r(e, o, '"type" is required');
                var a = unbundle(o.type);
                switch (a) {
                  case "vector":
                  case "raster":
                    if ((n.object(e, o, t.source_tile), "url" in o))
                      for (var i in o)
                        ["type", "url", "tileSize"].indexOf(i) < 0 &&
                          r(
                            e + "." + i,
                            o[i],
                            'a source with a "url" property may not include a "%s" property',
                            i
                          );
                    break;
                  case "geojson":
                    n.object(e, o, t.source_geojson);
                    break;
                  case "video":
                    n.object(e, o, t.source_video);
                    break;
                  case "image":
                    n.object(e, o, t.source_image);
                    break;
                  default:
                    n["enum"](e + ".type", o.type, {
                      values: ["vector", "raster", "geojson", "video", "image"]
                    });
                }
              }),
              (n.layer = function(o, a) {
                a.type ||
                  a.ref ||
                  r(o, a, 'either "type" or "ref" is required');
                var s = unbundle(a.type),
                  u = unbundle(a.ref);
                if (
                  (a.id &&
                    (i[a.id]
                      ? r(
                          o,
                          a.id,
                          'duplicate layer id "%s", previously used at line %d',
                          a.id,
                          i[a.id]
                        )
                      : (i[a.id] = a.id.__line__)),
                  "ref" in a)
                ) {
                  [
                    "type",
                    "source",
                    "source-layer",
                    "filter",
                    "layout"
                  ].forEach(function(e) {
                    e in a &&
                      r(o, a[e], '"%s" is prohibited for ref layers', e);
                  });
                  var c;
                  e.layers.forEach(function(e) {
                    e.id == u && (c = e);
                  }),
                    c
                      ? c.ref
                        ? r(o, a.ref, "ref cannot reference another ref layer")
                        : (s = c.type)
                      : r(o, a.ref, 'ref layer "%s" not found', u);
                } else if ("background" !== s)
                  if (a.source) {
                    var f = e.sources[a.source];
                    f
                      ? "vector" == f.type && "raster" == s
                        ? r(
                            o,
                            a.source,
                            'layer "%s" requires a raster source',
                            a.id
                          )
                        : "raster" == f.type && "raster" != s
                        ? r(
                            o,
                            a.source,
                            'layer "%s" requires a vector source',
                            a.id
                          )
                        : "vector" != f.type ||
                          a["source-layer"] ||
                          r(
                            o,
                            a,
                            'layer "%s" must specify a "source-layer"',
                            a.id
                          )
                      : r(o, a.source, 'source "%s" not found', a.source);
                  } else r(o, a, 'missing required property "source"');
                n.object(o, a, t.layer, {
                  filter: n.filter,
                  layout: function(e, r) {
                    var o = t["layout_" + s];
                    return s && o && n(e, r, o);
                  },
                  paint: function(e, r) {
                    var o = t["paint_" + s];
                    return s && o && n(e, r, o);
                  }
                });
              }),
              (n.object = function(e, o, a, i) {
                i = i || {};
                var s = typeof_(o);
                if ("object" !== s)
                  return r(e, o, "object expected, %s found", s);
                for (var u in o) {
                  var c = u.split(".")[0],
                    f = a[c] || a["*"],
                    l = c.match(/^(.*)-transition$/);
                  f
                    ? (i[c] || n)((e ? e + "." : e) + u, o[u], f)
                    : l && a[l[1]] && a[l[1]].transition
                    ? n((e ? e + "." : e) + u, o[u], t.transition)
                    : "" !== e &&
                      1 !== e.split(".").length &&
                      r(e, o[u], 'unknown property "%s"', u);
                }
                for (var p in a)
                  a[p].required &&
                    void 0 === a[p]["default"] &&
                    void 0 === o[p] &&
                    r(e, o, 'missing required property "%s"', p);
              }),
              (n.array = function(t, o, a, i) {
                if ("array" !== typeof_(o))
                  return r(t, o, "array expected, %s found", typeof_(o));
                if (a.length && o.length !== a.length)
                  return r(
                    t,
                    o,
                    "array length %d expected, length %d found",
                    a.length,
                    o.length
                  );
                if (a["min-length"] && o.length < a["min-length"])
                  return r(
                    t,
                    o,
                    "array length at least %d expected, length %d found",
                    a["min-length"],
                    o.length
                  );
                var s = { type: a.value };
                e.version < 7 && (s["function"] = a["function"]),
                  "object" === typeof_(a.value) && (s = a.value);
                for (var u = 0; u < o.length; u++)
                  (i || n)(t + "[" + u + "]", o[u], s);
              }),
              (n.filter = function(e, o) {
                var a;
                if ("array" !== typeof_(o))
                  return r(e, o, "array expected, %s found", typeof_(o));
                if (o.length < 1)
                  return r(e, o, "filter array must have at least 1 element");
                switch (
                  (n["enum"](e + "[0]", o[0], t.filter_operator),
                  unbundle(o[0]))
                ) {
                  case "<":
                  case "<=":
                  case ">":
                  case ">=":
                    o.length >= 2 &&
                      "$type" == o[1] &&
                      r(e, o, '"$type" cannot be use with operator "%s"', o[0]);
                  case "==":
                  case "!=":
                    3 != o.length &&
                      r(
                        e,
                        o,
                        'filter array for operator "%s" must have 3 elements',
                        o[0]
                      );
                  case "in":
                  case "!in":
                    o.length >= 2 &&
                      ((a = typeof_(o[1])),
                      "string" !== a
                        ? r(e + "[1]", o[1], "string expected, %s found", a)
                        : "@" === o[1][0] &&
                          r(
                            e + "[1]",
                            o[1],
                            "filter key cannot be a constant"
                          ));
                    for (var i = 2; i < o.length; i++)
                      (a = typeof_(o[i])),
                        "$type" == o[1]
                          ? n["enum"](e + "[" + i + "]", o[i], t.geometry_type)
                          : "string" === a && "@" === o[i][0]
                          ? r(
                              e + "[" + i + "]",
                              o[i],
                              "filter value cannot be a constant"
                            )
                          : "string" !== a &&
                            "number" !== a &&
                            "boolean" !== a &&
                            r(
                              e + "[" + i + "]",
                              o[i],
                              "string, number, or boolean expected, %s found",
                              a
                            );
                    break;
                  case "any":
                  case "all":
                  case "none":
                    for (i = 1; i < o.length; i++)
                      n.filter(e + "[" + i + "]", o[i]);
                }
              }),
              (n["function"] = function(e, o, a) {
                n.object(e, o, t["function"], {
                  stops: function(e, t, o) {
                    var i = -(1 / 0);
                    n.array(e, t, o, function(e, t) {
                      return "array" !== typeof_(t)
                        ? r(e, t, "array expected, %s found", typeof_(t))
                        : 2 !== t.length
                        ? r(
                            e,
                            t,
                            "array length %d expected, length %d found",
                            2,
                            t.length
                          )
                        : (n(e + "[0]", t[0], { type: "number" }),
                          n(e + "[1]", t[1], a),
                          void (
                            "number" === typeof_(t[0]) &&
                            ("piecewise-constant" === a["function"] &&
                              t[0] % 1 !== 0 &&
                              r(
                                e + "[0]",
                                t[0],
                                "zoom level for piecewise-constant functions must be an integer"
                              ),
                            t[0] <= i &&
                              r(
                                e + "[0]",
                                t[0],
                                "array stops must appear in ascending order and have no duplicates"
                              ),
                            (i = t[0]))
                          ));
                    }),
                      "array" === typeof_(t) &&
                        0 === t.length &&
                        r(e, t, "array must have at least one stop");
                  }
                });
              }),
              (n["enum"] = function(e, t, n) {
                -1 === n.values.indexOf(unbundle(t)) &&
                  r(
                    e,
                    t,
                    "expected one of [%s], %s found",
                    n.values.join(", "),
                    t
                  );
              }),
              (n.color = function(e, t) {
                var n = typeof_(t);
                return "string" !== n
                  ? r(e, t, "color expected, %s found", n)
                  : null === parseCSSColor(t)
                  ? r(e, t, 'color expected, "%s" found', t)
                  : void 0;
              }),
              (n.number = o("number")),
              (n.string = o("string")),
              (n["boolean"] = o("boolean")),
              (n["*"] = function() {}),
              n("", e, t.$root),
              t.$version > 7 &&
                e.constants &&
                n.constants("constants", e.constants),
              s.sort(function(e, t) {
                return e.line - t.line;
              }),
              s
            );
          };
        },
        { csscolorparser: 104, util: 103 }
      ],
      126: [
        function(require, module, exports) {
          module.exports = require("./v8.json");
        },
        { "./v8.json": 128 }
      ],
      127: [
        function(require, module, exports) {
          module.exports = require("./v8.min.json");
        },
        { "./v8.min.json": 129 }
      ],
      128: [
        function(require, module, exports) {
          module.exports = {
            $version: 8,
            $root: {
              version: {
                required: true,
                type: "enum",
                values: [8],
                doc: "Stylesheet version number. Must be 8.",
                example: 8
              },
              name: {
                type: "string",
                doc: "A human-readable name for the style.",
                example: "Bright"
              },
              metadata: {
                type: "*",
                doc:
                  "Arbitrary properties useful to track with the stylesheet, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'."
              },
              center: {
                type: "array",
                value: "number",
                doc:
                  "Default map center in longitude and latitude.  The style center will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                example: [-73.9749, 40.7736]
              },
              zoom: {
                type: "number",
                doc:
                  "Default zoom level.  The style zoom will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                example: 12.5
              },
              bearing: {
                type: "number",
                default: 0,
                period: 360,
                units: "degrees",
                doc:
                  "Default bearing, in degrees.  The style bearing will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                example: 29
              },
              pitch: {
                type: "number",
                default: 0,
                units: "degrees",
                doc:
                  "Default pitch, in degrees. Zero is perpendicular to the surface.  The style pitch will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                example: 50
              },
              sources: {
                required: true,
                type: "sources",
                doc: "Data source specifications.",
                example: {
                  "mapbox-streets": {
                    type: "vector",
                    url: "mapbox://mapbox.mapbox-streets-v6"
                  }
                }
              },
              sprite: {
                type: "string",
                doc:
                  "A base URL for retrieving the sprite image and metadata. The extensions `.png`, `.json` and scale factor `@2x.png` will be automatically appended.",
                example: "mapbox://sprites/mapbox/bright-v8"
              },
              glyphs: {
                type: "string",
                doc:
                  "A URL template for loading signed-distance-field glyph sets in PBF format. Valid tokens are {fontstack} and {range}.",
                example: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
              },
              transition: {
                type: "transition",
                doc:
                  "A global transition definition to use as a default across properties.",
                example: { duration: 300, delay: 0 }
              },
              layers: {
                required: true,
                type: "array",
                value: "layer",
                doc: "Layers will be drawn in the order of this array.",
                example: [
                  {
                    id: "water",
                    source: "mapbox-streets",
                    "source-layer": "water",
                    type: "fill",
                    paint: { "fill-color": "#00ffff" }
                  }
                ]
              }
            },
            sources: {
              "*": {
                type: "source",
                doc:
                  "Specification of a data source. For vector and raster sources, either TileJSON or a URL to a TileJSON must be provided. For GeoJSON and video sources, a URL must be provided."
              }
            },
            source: [
              "source_tile",
              "source_geojson",
              "source_video",
              "source_image"
            ],
            source_tile: {
              type: {
                required: true,
                type: "enum",
                values: ["vector", "raster"],
                doc: "The data type of the tile source."
              },
              url: {
                type: "string",
                doc:
                  "A URL to a TileJSON resource. Supported protocols are `http:`, `https:`, and `mapbox://<mapid>`."
              },
              tiles: {
                type: "array",
                value: "string",
                doc:
                  "An array of one or more tile source URLs, as in the TileJSON spec."
              },
              minzoom: {
                type: "number",
                default: 0,
                doc:
                  "Minimum zoom level for which tiles are available, as in the TileJSON spec."
              },
              maxzoom: {
                type: "number",
                default: 22,
                doc:
                  "Maximum zoom level for which tiles are available, as in the TileJSON spec. Data from tiles at the maxzoom are used when displaying the map at higher zoom levels."
              },
              tileSize: {
                type: "number",
                default: 512,
                units: "pixels",
                doc:
                  "The minimum visual size to display tiles for this layer. Only configurable for raster layers."
              },
              "*": {
                type: "*",
                doc: "Other keys to configure the data source."
              }
            },
            source_geojson: {
              type: {
                required: true,
                type: "enum",
                values: ["geojson"],
                doc: "The data type of the GeoJSON source."
              },
              data: {
                type: "*",
                doc: "A URL to a GeoJSON file, or inline GeoJSON."
              },
              maxzoom: {
                type: "number",
                default: 14,
                doc:
                  "Maximum zoom level at which to create vector tiles (higher means greater detail at high zoom levels)."
              },
              buffer: {
                type: "number",
                default: 64,
                doc:
                  "Tile buffer size on each side (higher means fewer rendering artifacts near tile edges but slower performance)."
              },
              tolerance: {
                type: "number",
                default: 3,
                doc:
                  "Douglas-Peucker simplification tolerance (higher means simpler geometries and faster performance)."
              },
              cluster: {
                type: "boolean",
                default: false,
                doc:
                  "If the data is a collection of point features, setting this to true clusters the points by radius into groups."
              },
              clusterRadius: {
                type: "number",
                default: 400,
                doc:
                  "Radius of each cluster when clustering points, relative to 4096 tile."
              },
              clusterMaxZoom: {
                type: "number",
                doc:
                  "Max zoom to cluster points on. Defaults to one zoom less than maxzoom (so that last zoom features are not clustered)."
              }
            },
            source_video: {
              type: {
                required: true,
                type: "enum",
                values: ["video"],
                doc: "The data type of the video source."
              },
              urls: {
                required: true,
                type: "array",
                value: "string",
                doc: "URLs to video content in order of preferred format."
              },
              coordinates: {
                required: true,
                doc: "Corners of video specified in longitude, latitude pairs.",
                type: "array",
                length: 4,
                value: {
                  type: "array",
                  length: 2,
                  value: "number",
                  doc: "A single longitude, latitude pair."
                }
              }
            },
            source_image: {
              type: {
                required: true,
                type: "enum",
                values: ["image"],
                doc: "The data type of the image source."
              },
              url: {
                required: true,
                type: "string",
                doc: "URL that points to an image"
              },
              coordinates: {
                required: true,
                doc: "Corners of image specified in longitude, latitude pairs.",
                type: "array",
                length: 4,
                value: {
                  type: "array",
                  length: 2,
                  value: "number",
                  doc: "A single longitude, latitude pair."
                }
              }
            },
            layer: {
              id: { type: "string", doc: "Unique layer name.", required: true },
              type: {
                type: "enum",
                values: [
                  "fill",
                  "line",
                  "symbol",
                  "circle",
                  "raster",
                  "background"
                ],
                doc: "Rendering type of this layer."
              },
              metadata: {
                type: "*",
                doc:
                  "Arbitrary properties useful to track with the layer, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'."
              },
              ref: {
                type: "string",
                doc:
                  "References another layer to copy `type`, `source`, `source-layer`, `minzoom`, `maxzoom`, `filter`, and `layout` properties from. This allows the layers to share processing and be more efficient."
              },
              source: {
                type: "string",
                doc: "Name of a source description to be used for this layer."
              },
              "source-layer": {
                type: "string",
                doc:
                  "Layer to use from a vector tile source. Required if the source supports multiple layers."
              },
              minzoom: {
                type: "number",
                minimum: 0,
                maximum: 22,
                doc:
                  "The minimum zoom level on which the layer gets parsed and appears on."
              },
              maxzoom: {
                type: "number",
                minimum: 0,
                maximum: 22,
                doc:
                  "The maximum zoom level on which the layer gets parsed and appears on."
              },
              interactive: {
                type: "boolean",
                doc:
                  "Enable querying of feature data from this layer for interactivity.",
                default: false
              },
              filter: {
                type: "filter",
                doc:
                  "A expression specifying conditions on source features. Only features that match the filter are displayed."
              },
              layout: {
                type: "layout",
                doc: "Layout properties for the layer."
              },
              paint: {
                type: "paint",
                doc: "Default paint properties for this layer."
              },
              "paint.*": {
                type: "paint",
                doc:
                  "Class-specific paint properties for this layer. The class name is the part after the first dot."
              }
            },
            layout: [
              "layout_fill",
              "layout_line",
              "layout_circle",
              "layout_symbol",
              "layout_raster",
              "layout_background"
            ],
            layout_background: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible",
                doc: "The display of this layer. `none` hides this layer."
              }
            },
            layout_fill: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible",
                doc: "The display of this layer. `none` hides this layer."
              }
            },
            layout_circle: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible",
                doc: "The display of this layer. `none` hides this layer."
              }
            },
            layout_line: {
              "line-cap": {
                type: "enum",
                function: "piecewise-constant",
                values: ["butt", "round", "square"],
                default: "butt",
                doc: "The display of line endings."
              },
              "line-join": {
                type: "enum",
                function: "piecewise-constant",
                values: ["bevel", "round", "miter"],
                default: "miter",
                doc: "The display of lines when joining."
              },
              "line-miter-limit": {
                type: "number",
                default: 2,
                function: "interpolated",
                doc:
                  "Used to automatically convert miter joins to bevel joins for sharp angles.",
                requires: [{ "line-join": "miter" }]
              },
              "line-round-limit": {
                type: "number",
                default: 1.05,
                function: "interpolated",
                doc:
                  "Used to automatically convert round joins to miter joins for shallow angles.",
                requires: [{ "line-join": "round" }]
              },
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible",
                doc: "The display of this layer. `none` hides this layer."
              }
            },
            layout_symbol: {
              "symbol-placement": {
                type: "enum",
                function: "piecewise-constant",
                values: ["point", "line"],
                default: "point",
                doc:
                  "Label placement relative to its geometry. `line` can only be used on LineStrings and Polygons."
              },
              "symbol-spacing": {
                type: "number",
                default: 250,
                minimum: 1,
                function: "interpolated",
                units: "pixels",
                doc: "Distance between two symbol anchors.",
                requires: [{ "symbol-placement": "line" }]
              },
              "symbol-avoid-edges": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, the symbols will not cross tile edges to avoid mutual collisions. Recommended in layers that don't have enough padding in the vector tile to prevent collisions, or if it is a point symbol layer placed after a line symbol layer."
              },
              "icon-allow-overlap": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, the icon will be visible even if it collides with other previously drawn symbols.",
                requires: ["icon-image"]
              },
              "icon-ignore-placement": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, other symbols can be visible even if they collide with the icon.",
                requires: ["icon-image"]
              },
              "icon-optional": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, text will display without their corresponding icons when the icon collides with other symbols and the text does not.",
                requires: ["icon-image", "text-field"]
              },
              "icon-rotation-alignment": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "viewport",
                doc: "Orientation of icon when map is rotated.",
                requires: ["icon-image"]
              },
              "icon-size": {
                type: "number",
                default: 1,
                minimum: 0,
                function: "interpolated",
                doc:
                  "Scale factor for icon. 1 is original size, 3 triples the size.",
                requires: ["icon-image"]
              },
              "icon-image": {
                type: "string",
                function: "piecewise-constant",
                doc:
                  "A string with {tokens} replaced, referencing the data property to pull from.",
                tokens: true
              },
              "icon-rotate": {
                type: "number",
                default: 0,
                period: 360,
                function: "interpolated",
                units: "degrees",
                doc: "Rotates the icon clockwise.",
                requires: ["icon-image"]
              },
              "icon-padding": {
                type: "number",
                default: 2,
                minimum: 0,
                function: "interpolated",
                units: "pixels",
                doc:
                  "Size of the additional area around the icon bounding box used for detecting symbol collisions.",
                requires: ["icon-image"]
              },
              "icon-keep-upright": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, the icon may be flipped to prevent it from being rendered upside-down.",
                requires: [
                  "icon-image",
                  { "icon-rotation-alignment": "map" },
                  { "symbol-placement": "line" }
                ]
              },
              "icon-offset": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                doc:
                  "Offset distance of icon from its anchor. Positive values indicate right and down, while negative values indicate left and up.",
                requires: ["icon-image"]
              },
              "text-rotation-alignment": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "viewport",
                doc: "Orientation of text when map is rotated.",
                requires: ["text-field"]
              },
              "text-field": {
                type: "string",
                function: "piecewise-constant",
                default: "",
                tokens: true,
                doc:
                  "Value to use for a text label. Feature properties are specified using tokens like {field_name}."
              },
              "text-font": {
                type: "array",
                value: "string",
                function: "piecewise-constant",
                default: ["Open Sans Regular", "Arial Unicode MS Regular"],
                doc: "Font stack to use for displaying text.",
                requires: ["text-field"]
              },
              "text-size": {
                type: "number",
                default: 16,
                minimum: 0,
                units: "pixels",
                function: "interpolated",
                doc: "Font size.",
                requires: ["text-field"]
              },
              "text-max-width": {
                type: "number",
                default: 10,
                minimum: 0,
                units: "em",
                function: "interpolated",
                doc: "The maximum line width for text wrapping.",
                requires: ["text-field"]
              },
              "text-line-height": {
                type: "number",
                default: 1.2,
                units: "em",
                function: "interpolated",
                doc: "Text leading value for multi-line text.",
                requires: ["text-field"]
              },
              "text-letter-spacing": {
                type: "number",
                default: 0,
                units: "em",
                function: "interpolated",
                doc: "Text tracking amount.",
                requires: ["text-field"]
              },
              "text-justify": {
                type: "enum",
                function: "piecewise-constant",
                values: ["left", "center", "right"],
                default: "center",
                doc: "Text justification options.",
                requires: ["text-field"]
              },
              "text-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: [
                  "center",
                  "left",
                  "right",
                  "top",
                  "bottom",
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right"
                ],
                default: "center",
                doc: "Part of the text placed closest to the anchor.",
                requires: ["text-field"]
              },
              "text-max-angle": {
                type: "number",
                default: 45,
                units: "degrees",
                function: "interpolated",
                doc: "Maximum angle change between adjacent characters.",
                requires: ["text-field", { "symbol-placement": "line" }]
              },
              "text-rotate": {
                type: "number",
                default: 0,
                period: 360,
                units: "degrees",
                function: "interpolated",
                doc: "Rotates the text clockwise.",
                requires: ["text-field"]
              },
              "text-padding": {
                type: "number",
                default: 2,
                minimum: 0,
                units: "pixels",
                function: "interpolated",
                doc:
                  "Size of the additional area around the text bounding box used for detecting symbol collisions.",
                requires: ["text-field"]
              },
              "text-keep-upright": {
                type: "boolean",
                function: "piecewise-constant",
                default: true,
                doc:
                  "If true, the text may be flipped vertically to prevent it from being rendered upside-down.",
                requires: [
                  "text-field",
                  { "text-rotation-alignment": "map" },
                  { "symbol-placement": "line" }
                ]
              },
              "text-transform": {
                type: "enum",
                function: "piecewise-constant",
                values: ["none", "uppercase", "lowercase"],
                default: "none",
                doc:
                  "Specifies how to capitalize text, similar to the CSS `text-transform` property.",
                requires: ["text-field"]
              },
              "text-offset": {
                type: "array",
                doc:
                  "Offset distance of text from its anchor. Positive values indicate right and down, while negative values indicate left and up.",
                value: "number",
                units: "ems",
                function: "interpolated",
                length: 2,
                default: [0, 0],
                requires: ["text-field"]
              },
              "text-allow-overlap": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, the text will be visible even if it collides with other previously drawn symbols.",
                requires: ["text-field"]
              },
              "text-ignore-placement": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, other symbols can be visible even if they collide with the text.",
                requires: ["text-field"]
              },
              "text-optional": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                doc:
                  "If true, icons will display without their corresponding text when the text collides with other symbols and the icon does not.",
                requires: ["text-field", "icon-image"]
              },
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible",
                doc: "The display of this layer. `none` hides this layer."
              }
            },
            layout_raster: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible",
                doc: "The display of this layer. `none` hides this layer."
              }
            },
            filter: {
              type: "array",
              value: "*",
              doc: "A filter selects specific features from a layer."
            },
            filter_operator: {
              type: "enum",
              values: [
                "==",
                "!=",
                ">",
                ">=",
                "<",
                "<=",
                "in",
                "!in",
                "all",
                "any",
                "none"
              ],
              doc: "The filter operator."
            },
            geometry_type: {
              type: "enum",
              values: ["Point", "LineString", "Polygon"],
              doc: "The geometry type for the filter to select."
            },
            color_operation: {
              type: "enum",
              values: ["lighten", "saturate", "spin", "fade", "mix"],
              doc: "A color operation to apply."
            },
            function: {
              stops: {
                type: "array",
                required: true,
                doc: "An array of stops.",
                value: "function_stop"
              },
              base: {
                type: "number",
                default: 1,
                minimum: 0,
                doc:
                  "The exponential base of the interpolation curve. It controls the rate at which the result increases. Higher values make the result increase more towards the high end of the range. With `1` the stops are interpolated linearly."
              }
            },
            function_stop: {
              type: "array",
              minimum: 0,
              maximum: 22,
              value: ["number", "color"],
              length: 2,
              doc: "Zoom level and value pair."
            },
            paint: [
              "paint_fill",
              "paint_line",
              "paint_circle",
              "paint_symbol",
              "paint_raster",
              "paint_background"
            ],
            paint_fill: {
              "fill-antialias": {
                type: "boolean",
                function: "piecewise-constant",
                default: true,
                doc: "Whether or not the fill should be antialiased."
              },
              "fill-opacity": {
                type: "number",
                function: "interpolated",
                default: 1,
                minimum: 0,
                maximum: 1,
                doc: "The opacity given to the fill color.",
                transition: true
              },
              "fill-color": {
                type: "color",
                default: "#000000",
                doc: "The color of the fill.",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "fill-pattern" }]
              },
              "fill-outline-color": {
                type: "color",
                doc:
                  "The outline color of the fill. Matches the value of `fill-color` if unspecified.",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "fill-pattern" }, { "fill-antialias": true }]
              },
              "fill-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc:
                  "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
              },
              "fill-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                doc:
                  "Control whether the translation is relative to the map (north) or viewport (screen)",
                default: "map",
                requires: ["fill-translate"]
              },
              "fill-pattern": {
                type: "string",
                function: "piecewise-constant",
                transition: true,
                doc:
                  "Name of image in sprite to use for drawing image fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512)."
              }
            },
            paint_line: {
              "line-opacity": {
                type: "number",
                doc: "The opacity at which the line will be drawn.",
                function: "interpolated",
                default: 1,
                minimum: 0,
                maximum: 1,
                transition: true
              },
              "line-color": {
                type: "color",
                doc: "The color with which the line will be drawn.",
                default: "#000000",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "line-pattern" }]
              },
              "line-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc:
                  "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
              },
              "line-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                doc:
                  "Control whether the translation is relative to the map (north) or viewport (screen)",
                default: "map",
                requires: ["line-translate"]
              },
              "line-width": {
                type: "number",
                default: 1,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc: "Stroke thickness."
              },
              "line-gap-width": {
                type: "number",
                default: 0,
                minimum: 0,
                doc:
                  "Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap.",
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "line-offset": {
                type: "number",
                default: 0,
                doc:
                  'The line\'s offset perpendicular to its direction. Values may be positive or negative, where positive indicates "rightwards" (if you were moving in the direction of the line) and negative indicates "leftwards."',
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "line-blur": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc: "Blur applied to the line, in pixels."
              },
              "line-dasharray": {
                type: "array",
                value: "number",
                function: "piecewise-constant",
                doc:
                  "Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width.",
                minimum: 0,
                transition: true,
                units: "line widths",
                requires: [{ "!": "line-pattern" }]
              },
              "line-pattern": {
                type: "string",
                function: "piecewise-constant",
                transition: true,
                doc:
                  "Name of image in sprite to use for drawing image lines. For seamless patterns, image width must be a factor of two (2, 4, 8, ..., 512)."
              }
            },
            paint_circle: {
              "circle-radius": {
                type: "number",
                default: 5,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc: "Circle radius."
              },
              "circle-color": {
                type: "color",
                default: "#000000",
                doc: "The color of the circle.",
                function: "interpolated",
                transition: true
              },
              "circle-blur": {
                type: "number",
                default: 0,
                doc:
                  "Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.",
                function: "interpolated",
                transition: true
              },
              "circle-opacity": {
                type: "number",
                doc: "The opacity at which the circle will be drawn.",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "circle-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc:
                  "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
              },
              "circle-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                doc:
                  "Control whether the translation is relative to the map (north) or viewport (screen)",
                default: "map",
                requires: ["circle-translate"]
              }
            },
            paint_symbol: {
              "icon-opacity": {
                doc: "The opacity at which the icon will be drawn.",
                type: "number",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true,
                requires: ["icon-image"]
              },
              "icon-color": {
                type: "color",
                default: "#000000",
                function: "interpolated",
                transition: true,
                doc:
                  "The color of the icon. This can only be used with sdf icons.",
                requires: ["icon-image"]
              },
              "icon-halo-color": {
                type: "color",
                default: "rgba(0, 0, 0, 0)",
                function: "interpolated",
                transition: true,
                doc:
                  "The color of the icon's halo. Icon halos can only be used with sdf icons.",
                requires: ["icon-image"]
              },
              "icon-halo-width": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc: "Distance of halo to the icon outline.",
                requires: ["icon-image"]
              },
              "icon-halo-blur": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc: "Fade out the halo towards the outside.",
                requires: ["icon-image"]
              },
              "icon-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc:
                  "Distance that the icon's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.",
                requires: ["icon-image"]
              },
              "icon-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                doc:
                  "Control whether the translation is relative to the map (north) or viewport (screen).",
                default: "map",
                requires: ["icon-image", "icon-translate"]
              },
              "text-opacity": {
                type: "number",
                doc: "The opacity at which the text will be drawn.",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true,
                requires: ["text-field"]
              },
              "text-color": {
                type: "color",
                doc: "The color with which the text will be drawn.",
                default: "#000000",
                function: "interpolated",
                transition: true,
                requires: ["text-field"]
              },
              "text-halo-color": {
                type: "color",
                default: "rgba(0, 0, 0, 0)",
                function: "interpolated",
                transition: true,
                doc:
                  "The color of the text's halo, which helps it stand out from backgrounds.",
                requires: ["text-field"]
              },
              "text-halo-width": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc:
                  "Distance of halo to the font outline. Max text halo width is 1/4 of the font-size.",
                requires: ["text-field"]
              },
              "text-halo-blur": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc: "The halo's fadeout distance towards the outside.",
                requires: ["text-field"]
              },
              "text-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels",
                doc:
                  "Distance that the text's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.",
                requires: ["text-field"]
              },
              "text-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                doc:
                  "Control whether the translation is relative to the map (north) or viewport (screen).",
                default: "map",
                requires: ["text-field", "text-translate"]
              }
            },
            paint_raster: {
              "raster-opacity": {
                type: "number",
                doc: "The opacity at which the image will be drawn.",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "raster-hue-rotate": {
                type: "number",
                default: 0,
                period: 360,
                function: "interpolated",
                transition: true,
                units: "degrees",
                doc: "Rotates hues around the color wheel."
              },
              "raster-brightness-min": {
                type: "number",
                function: "interpolated",
                doc:
                  "Increase or reduce the brightness of the image. The value is the minimum brightness.",
                default: 0,
                minimum: 0,
                maximum: 1,
                transition: true
              },
              "raster-brightness-max": {
                type: "number",
                function: "interpolated",
                doc:
                  "Increase or reduce the brightness of the image. The value is the maximum brightness.",
                default: 1,
                minimum: 0,
                maximum: 1,
                transition: true
              },
              "raster-saturation": {
                type: "number",
                doc: "Increase or reduce the saturation of the image.",
                default: 0,
                minimum: -1,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "raster-contrast": {
                type: "number",
                doc: "Increase or reduce the contrast of the image.",
                default: 0,
                minimum: -1,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "raster-fade-duration": {
                type: "number",
                default: 300,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "milliseconds",
                doc: "Fade duration when a new tile is added."
              }
            },
            paint_background: {
              "background-color": {
                type: "color",
                default: "#000000",
                doc: "The color with which the background will be drawn.",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "background-pattern" }]
              },
              "background-pattern": {
                type: "string",
                function: "piecewise-constant",
                transition: true,
                doc:
                  "Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512)."
              },
              "background-opacity": {
                type: "number",
                default: 1,
                minimum: 0,
                maximum: 1,
                doc: "The opacity at which the background will be drawn.",
                function: "interpolated",
                transition: true
              }
            },
            transition: {
              duration: {
                type: "number",
                default: 300,
                minimum: 0,
                units: "milliseconds",
                doc: "Time allotted for transitions to complete."
              },
              delay: {
                type: "number",
                default: 0,
                minimum: 0,
                units: "milliseconds",
                doc: "Length of time before a transition begins."
              }
            }
          };
        },
        {}
      ],
      129: [
        function(require, module, exports) {
          module.exports = {
            $version: 8,
            $root: {
              version: { required: true, type: "enum", values: [8] },
              name: { type: "string" },
              metadata: { type: "*" },
              center: { type: "array", value: "number" },
              zoom: { type: "number" },
              bearing: {
                type: "number",
                default: 0,
                period: 360,
                units: "degrees"
              },
              pitch: { type: "number", default: 0, units: "degrees" },
              sources: { required: true, type: "sources" },
              sprite: { type: "string" },
              glyphs: { type: "string" },
              transition: { type: "transition" },
              layers: { required: true, type: "array", value: "layer" }
            },
            sources: { "*": { type: "source" } },
            source: [
              "source_tile",
              "source_geojson",
              "source_video",
              "source_image"
            ],
            source_tile: {
              type: {
                required: true,
                type: "enum",
                values: ["vector", "raster"]
              },
              url: { type: "string" },
              tiles: { type: "array", value: "string" },
              minzoom: { type: "number", default: 0 },
              maxzoom: { type: "number", default: 22 },
              tileSize: { type: "number", default: 512, units: "pixels" },
              "*": { type: "*" }
            },
            source_geojson: {
              type: { required: true, type: "enum", values: ["geojson"] },
              data: { type: "*" },
              maxzoom: { type: "number", default: 14 },
              buffer: { type: "number", default: 64 },
              tolerance: { type: "number", default: 3 },
              cluster: { type: "boolean", default: false },
              clusterRadius: { type: "number", default: 400 },
              clusterMaxZoom: { type: "number" }
            },
            source_video: {
              type: { required: true, type: "enum", values: ["video"] },
              urls: { required: true, type: "array", value: "string" },
              coordinates: {
                required: true,
                type: "array",
                length: 4,
                value: { type: "array", length: 2, value: "number" }
              }
            },
            source_image: {
              type: { required: true, type: "enum", values: ["image"] },
              url: { required: true, type: "string" },
              coordinates: {
                required: true,
                type: "array",
                length: 4,
                value: { type: "array", length: 2, value: "number" }
              }
            },
            layer: {
              id: { type: "string", required: true },
              type: {
                type: "enum",
                values: [
                  "fill",
                  "line",
                  "symbol",
                  "circle",
                  "raster",
                  "background"
                ]
              },
              metadata: { type: "*" },
              ref: { type: "string" },
              source: { type: "string" },
              "source-layer": { type: "string" },
              minzoom: { type: "number", minimum: 0, maximum: 22 },
              maxzoom: { type: "number", minimum: 0, maximum: 22 },
              interactive: { type: "boolean", default: false },
              filter: { type: "filter" },
              layout: { type: "layout" },
              paint: { type: "paint" },
              "paint.*": { type: "paint" }
            },
            layout: [
              "layout_fill",
              "layout_line",
              "layout_circle",
              "layout_symbol",
              "layout_raster",
              "layout_background"
            ],
            layout_background: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible"
              }
            },
            layout_fill: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible"
              }
            },
            layout_circle: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible"
              }
            },
            layout_line: {
              "line-cap": {
                type: "enum",
                function: "piecewise-constant",
                values: ["butt", "round", "square"],
                default: "butt"
              },
              "line-join": {
                type: "enum",
                function: "piecewise-constant",
                values: ["bevel", "round", "miter"],
                default: "miter"
              },
              "line-miter-limit": {
                type: "number",
                default: 2,
                function: "interpolated",
                requires: [{ "line-join": "miter" }]
              },
              "line-round-limit": {
                type: "number",
                default: 1.05,
                function: "interpolated",
                requires: [{ "line-join": "round" }]
              },
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible"
              }
            },
            layout_symbol: {
              "symbol-placement": {
                type: "enum",
                function: "piecewise-constant",
                values: ["point", "line"],
                default: "point"
              },
              "symbol-spacing": {
                type: "number",
                default: 250,
                minimum: 1,
                function: "interpolated",
                units: "pixels",
                requires: [{ "symbol-placement": "line" }]
              },
              "symbol-avoid-edges": {
                type: "boolean",
                function: "piecewise-constant",
                default: false
              },
              "icon-allow-overlap": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                requires: ["icon-image"]
              },
              "icon-ignore-placement": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                requires: ["icon-image"]
              },
              "icon-optional": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                requires: ["icon-image", "text-field"]
              },
              "icon-rotation-alignment": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "viewport",
                requires: ["icon-image"]
              },
              "icon-size": {
                type: "number",
                default: 1,
                minimum: 0,
                function: "interpolated",
                requires: ["icon-image"]
              },
              "icon-image": {
                type: "string",
                function: "piecewise-constant",
                tokens: true
              },
              "icon-rotate": {
                type: "number",
                default: 0,
                period: 360,
                function: "interpolated",
                units: "degrees",
                requires: ["icon-image"]
              },
              "icon-padding": {
                type: "number",
                default: 2,
                minimum: 0,
                function: "interpolated",
                units: "pixels",
                requires: ["icon-image"]
              },
              "icon-keep-upright": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                requires: [
                  "icon-image",
                  { "icon-rotation-alignment": "map" },
                  { "symbol-placement": "line" }
                ]
              },
              "icon-offset": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                requires: ["icon-image"]
              },
              "text-rotation-alignment": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "viewport",
                requires: ["text-field"]
              },
              "text-field": {
                type: "string",
                function: "piecewise-constant",
                default: "",
                tokens: true
              },
              "text-font": {
                type: "array",
                value: "string",
                function: "piecewise-constant",
                default: ["Open Sans Regular", "Arial Unicode MS Regular"],
                requires: ["text-field"]
              },
              "text-size": {
                type: "number",
                default: 16,
                minimum: 0,
                units: "pixels",
                function: "interpolated",
                requires: ["text-field"]
              },
              "text-max-width": {
                type: "number",
                default: 10,
                minimum: 0,
                units: "em",
                function: "interpolated",
                requires: ["text-field"]
              },
              "text-line-height": {
                type: "number",
                default: 1.2,
                units: "em",
                function: "interpolated",
                requires: ["text-field"]
              },
              "text-letter-spacing": {
                type: "number",
                default: 0,
                units: "em",
                function: "interpolated",
                requires: ["text-field"]
              },
              "text-justify": {
                type: "enum",
                function: "piecewise-constant",
                values: ["left", "center", "right"],
                default: "center",
                requires: ["text-field"]
              },
              "text-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: [
                  "center",
                  "left",
                  "right",
                  "top",
                  "bottom",
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right"
                ],
                default: "center",
                requires: ["text-field"]
              },
              "text-max-angle": {
                type: "number",
                default: 45,
                units: "degrees",
                function: "interpolated",
                requires: ["text-field", { "symbol-placement": "line" }]
              },
              "text-rotate": {
                type: "number",
                default: 0,
                period: 360,
                units: "degrees",
                function: "interpolated",
                requires: ["text-field"]
              },
              "text-padding": {
                type: "number",
                default: 2,
                minimum: 0,
                units: "pixels",
                function: "interpolated",
                requires: ["text-field"]
              },
              "text-keep-upright": {
                type: "boolean",
                function: "piecewise-constant",
                default: true,
                requires: [
                  "text-field",
                  { "text-rotation-alignment": "map" },
                  { "symbol-placement": "line" }
                ]
              },
              "text-transform": {
                type: "enum",
                function: "piecewise-constant",
                values: ["none", "uppercase", "lowercase"],
                default: "none",
                requires: ["text-field"]
              },
              "text-offset": {
                type: "array",
                value: "number",
                units: "ems",
                function: "interpolated",
                length: 2,
                default: [0, 0],
                requires: ["text-field"]
              },
              "text-allow-overlap": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                requires: ["text-field"]
              },
              "text-ignore-placement": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                requires: ["text-field"]
              },
              "text-optional": {
                type: "boolean",
                function: "piecewise-constant",
                default: false,
                requires: ["text-field", "icon-image"]
              },
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible"
              }
            },
            layout_raster: {
              visibility: {
                type: "enum",
                function: "piecewise-constant",
                values: ["visible", "none"],
                default: "visible"
              }
            },
            filter: { type: "array", value: "*" },
            filter_operator: {
              type: "enum",
              values: [
                "==",
                "!=",
                ">",
                ">=",
                "<",
                "<=",
                "in",
                "!in",
                "all",
                "any",
                "none"
              ]
            },
            geometry_type: {
              type: "enum",
              values: ["Point", "LineString", "Polygon"]
            },
            color_operation: {
              type: "enum",
              values: ["lighten", "saturate", "spin", "fade", "mix"]
            },
            function: {
              stops: { type: "array", required: true, value: "function_stop" },
              base: { type: "number", default: 1, minimum: 0 }
            },
            function_stop: {
              type: "array",
              minimum: 0,
              maximum: 22,
              value: ["number", "color"],
              length: 2
            },
            paint: [
              "paint_fill",
              "paint_line",
              "paint_circle",
              "paint_symbol",
              "paint_raster",
              "paint_background"
            ],
            paint_fill: {
              "fill-antialias": {
                type: "boolean",
                function: "piecewise-constant",
                default: true
              },
              "fill-opacity": {
                type: "number",
                function: "interpolated",
                default: 1,
                minimum: 0,
                maximum: 1,
                transition: true
              },
              "fill-color": {
                type: "color",
                default: "#000000",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "fill-pattern" }]
              },
              "fill-outline-color": {
                type: "color",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "fill-pattern" }, { "fill-antialias": true }]
              },
              "fill-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "fill-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "map",
                requires: ["fill-translate"]
              },
              "fill-pattern": {
                type: "string",
                function: "piecewise-constant",
                transition: true
              }
            },
            paint_line: {
              "line-opacity": {
                type: "number",
                function: "interpolated",
                default: 1,
                minimum: 0,
                maximum: 1,
                transition: true
              },
              "line-color": {
                type: "color",
                default: "#000000",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "line-pattern" }]
              },
              "line-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "line-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "map",
                requires: ["line-translate"]
              },
              "line-width": {
                type: "number",
                default: 1,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "line-gap-width": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "line-offset": {
                type: "number",
                default: 0,
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "line-blur": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "line-dasharray": {
                type: "array",
                value: "number",
                function: "piecewise-constant",
                minimum: 0,
                transition: true,
                units: "line widths",
                requires: [{ "!": "line-pattern" }]
              },
              "line-pattern": {
                type: "string",
                function: "piecewise-constant",
                transition: true
              }
            },
            paint_circle: {
              "circle-radius": {
                type: "number",
                default: 5,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "circle-color": {
                type: "color",
                default: "#000000",
                function: "interpolated",
                transition: true
              },
              "circle-blur": {
                type: "number",
                default: 0,
                function: "interpolated",
                transition: true
              },
              "circle-opacity": {
                type: "number",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "circle-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels"
              },
              "circle-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "map",
                requires: ["circle-translate"]
              }
            },
            paint_symbol: {
              "icon-opacity": {
                type: "number",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true,
                requires: ["icon-image"]
              },
              "icon-color": {
                type: "color",
                default: "#000000",
                function: "interpolated",
                transition: true,
                requires: ["icon-image"]
              },
              "icon-halo-color": {
                type: "color",
                default: "rgba(0, 0, 0, 0)",
                function: "interpolated",
                transition: true,
                requires: ["icon-image"]
              },
              "icon-halo-width": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                requires: ["icon-image"]
              },
              "icon-halo-blur": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                requires: ["icon-image"]
              },
              "icon-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels",
                requires: ["icon-image"]
              },
              "icon-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "map",
                requires: ["icon-image", "icon-translate"]
              },
              "text-opacity": {
                type: "number",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true,
                requires: ["text-field"]
              },
              "text-color": {
                type: "color",
                default: "#000000",
                function: "interpolated",
                transition: true,
                requires: ["text-field"]
              },
              "text-halo-color": {
                type: "color",
                default: "rgba(0, 0, 0, 0)",
                function: "interpolated",
                transition: true,
                requires: ["text-field"]
              },
              "text-halo-width": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                requires: ["text-field"]
              },
              "text-halo-blur": {
                type: "number",
                default: 0,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "pixels",
                requires: ["text-field"]
              },
              "text-translate": {
                type: "array",
                value: "number",
                length: 2,
                default: [0, 0],
                function: "interpolated",
                transition: true,
                units: "pixels",
                requires: ["text-field"]
              },
              "text-translate-anchor": {
                type: "enum",
                function: "piecewise-constant",
                values: ["map", "viewport"],
                default: "map",
                requires: ["text-field", "text-translate"]
              }
            },
            paint_raster: {
              "raster-opacity": {
                type: "number",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "raster-hue-rotate": {
                type: "number",
                default: 0,
                period: 360,
                function: "interpolated",
                transition: true,
                units: "degrees"
              },
              "raster-brightness-min": {
                type: "number",
                function: "interpolated",
                default: 0,
                minimum: 0,
                maximum: 1,
                transition: true
              },
              "raster-brightness-max": {
                type: "number",
                function: "interpolated",
                default: 1,
                minimum: 0,
                maximum: 1,
                transition: true
              },
              "raster-saturation": {
                type: "number",
                default: 0,
                minimum: -1,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "raster-contrast": {
                type: "number",
                default: 0,
                minimum: -1,
                maximum: 1,
                function: "interpolated",
                transition: true
              },
              "raster-fade-duration": {
                type: "number",
                default: 300,
                minimum: 0,
                function: "interpolated",
                transition: true,
                units: "milliseconds"
              }
            },
            paint_background: {
              "background-color": {
                type: "color",
                default: "#000000",
                function: "interpolated",
                transition: true,
                requires: [{ "!": "background-pattern" }]
              },
              "background-pattern": {
                type: "string",
                function: "piecewise-constant",
                transition: true
              },
              "background-opacity": {
                type: "number",
                default: 1,
                minimum: 0,
                maximum: 1,
                function: "interpolated",
                transition: true
              }
            },
            transition: {
              duration: {
                type: "number",
                default: 300,
                minimum: 0,
                units: "milliseconds"
              },
              delay: {
                type: "number",
                default: 0,
                minimum: 0,
                units: "milliseconds"
              }
            }
          };
        },
        {}
      ],
      130: [
        function(require, module, exports) {
          "use strict";
          function Buffer(t) {
            var e;
            t && t.length && ((e = t), (t = e.length));
            var r = new Uint8Array(t || 0);
            return (
              e && r.set(e),
              (r.readUInt32LE = BufferMethods.readUInt32LE),
              (r.writeUInt32LE = BufferMethods.writeUInt32LE),
              (r.readInt32LE = BufferMethods.readInt32LE),
              (r.writeInt32LE = BufferMethods.writeInt32LE),
              (r.readFloatLE = BufferMethods.readFloatLE),
              (r.writeFloatLE = BufferMethods.writeFloatLE),
              (r.readDoubleLE = BufferMethods.readDoubleLE),
              (r.writeDoubleLE = BufferMethods.writeDoubleLE),
              (r.toString = BufferMethods.toString),
              (r.write = BufferMethods.write),
              (r.slice = BufferMethods.slice),
              (r.copy = BufferMethods.copy),
              (r._isBuffer = !0),
              r
            );
          }
          function encodeString(t) {
            for (var e, r, n = t.length, i = [], o = 0; n > o; o++) {
              if (((e = t.charCodeAt(o)), e > 55295 && 57344 > e)) {
                if (!r) {
                  e > 56319 || o + 1 === n ? i.push(239, 191, 189) : (r = e);
                  continue;
                }
                if (56320 > e) {
                  i.push(239, 191, 189), (r = e);
                  continue;
                }
                (e = ((r - 55296) << 10) | (e - 56320) | 65536), (r = null);
              } else r && (i.push(239, 191, 189), (r = null));
              128 > e
                ? i.push(e)
                : 2048 > e
                ? i.push((e >> 6) | 192, (63 & e) | 128)
                : 65536 > e
                ? i.push((e >> 12) | 224, ((e >> 6) & 63) | 128, (63 & e) | 128)
                : i.push(
                    (e >> 18) | 240,
                    ((e >> 12) & 63) | 128,
                    ((e >> 6) & 63) | 128,
                    (63 & e) | 128
                  );
            }
            return i;
          }
          module.exports = Buffer;
          var ieee754 = require("ieee754"),
            BufferMethods,
            lastStr,
            lastStrEncoded;
          (BufferMethods = {
            readUInt32LE: function(t) {
              return (
                (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                16777216 * this[t + 3]
              );
            },
            writeUInt32LE: function(t, e) {
              (this[e] = t),
                (this[e + 1] = t >>> 8),
                (this[e + 2] = t >>> 16),
                (this[e + 3] = t >>> 24);
            },
            readInt32LE: function(t) {
              return (
                (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                (this[t + 3] << 24)
              );
            },
            readFloatLE: function(t) {
              return ieee754.read(this, t, !0, 23, 4);
            },
            readDoubleLE: function(t) {
              return ieee754.read(this, t, !0, 52, 8);
            },
            writeFloatLE: function(t, e) {
              return ieee754.write(this, t, e, !0, 23, 4);
            },
            writeDoubleLE: function(t, e) {
              return ieee754.write(this, t, e, !0, 52, 8);
            },
            toString: function(t, e, r) {
              var n = "",
                i = "";
              (e = e || 0), (r = Math.min(this.length, r || this.length));
              for (var o = e; r > o; o++) {
                var u = this[o];
                127 >= u
                  ? ((n += decodeURIComponent(i) + String.fromCharCode(u)),
                    (i = ""))
                  : (i += "%" + u.toString(16));
              }
              return (n += decodeURIComponent(i));
            },
            write: function(t, e) {
              for (
                var r = t === lastStr ? lastStrEncoded : encodeString(t), n = 0;
                n < r.length;
                n++
              )
                this[e + n] = r[n];
            },
            slice: function(t, e) {
              return this.subarray(t, e);
            },
            copy: function(t, e) {
              e = e || 0;
              for (var r = 0; r < this.length; r++) t[e + r] = this[r];
            }
          }),
            (BufferMethods.writeInt32LE = BufferMethods.writeUInt32LE),
            (Buffer.byteLength = function(t) {
              return (
                (lastStr = t),
                (lastStrEncoded = encodeString(t)),
                lastStrEncoded.length
              );
            }),
            (Buffer.isBuffer = function(t) {
              return !(!t || !t._isBuffer);
            });
        },
        { ieee754: 132 }
      ],
      131: [
        function(require, module, exports) {
          (function(global) {
            "use strict";
            function Pbf(t) {
              (this.buf = Buffer.isBuffer(t) ? t : new Buffer(t || 0)),
                (this.pos = 0),
                (this.length = this.buf.length);
            }
            function writePackedVarint(t, i) {
              for (var e = 0; e < t.length; e++) i.writeVarint(t[e]);
            }
            function writePackedSVarint(t, i) {
              for (var e = 0; e < t.length; e++) i.writeSVarint(t[e]);
            }
            function writePackedFloat(t, i) {
              for (var e = 0; e < t.length; e++) i.writeFloat(t[e]);
            }
            function writePackedDouble(t, i) {
              for (var e = 0; e < t.length; e++) i.writeDouble(t[e]);
            }
            function writePackedBoolean(t, i) {
              for (var e = 0; e < t.length; e++) i.writeBoolean(t[e]);
            }
            function writePackedFixed32(t, i) {
              for (var e = 0; e < t.length; e++) i.writeFixed32(t[e]);
            }
            function writePackedSFixed32(t, i) {
              for (var e = 0; e < t.length; e++) i.writeSFixed32(t[e]);
            }
            function writePackedFixed64(t, i) {
              for (var e = 0; e < t.length; e++) i.writeFixed64(t[e]);
            }
            function writePackedSFixed64(t, i) {
              for (var e = 0; e < t.length; e++) i.writeSFixed64(t[e]);
            }
            module.exports = Pbf;
            var Buffer = global.Buffer || require("./buffer");
            (Pbf.Varint = 0),
              (Pbf.Fixed64 = 1),
              (Pbf.Bytes = 2),
              (Pbf.Fixed32 = 5);
            var SHIFT_LEFT_32 = 4294967296,
              SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32,
              POW_2_63 = Math.pow(2, 63);
            Pbf.prototype = {
              destroy: function() {
                this.buf = null;
              },
              readFields: function(t, i, e) {
                for (e = e || this.length; this.pos < e; ) {
                  var r = this.readVarint(),
                    s = r >> 3,
                    n = this.pos;
                  t(s, i, this), this.pos === n && this.skip(r);
                }
                return i;
              },
              readMessage: function(t, i) {
                return this.readFields(t, i, this.readVarint() + this.pos);
              },
              readFixed32: function() {
                var t = this.buf.readUInt32LE(this.pos);
                return (this.pos += 4), t;
              },
              readSFixed32: function() {
                var t = this.buf.readInt32LE(this.pos);
                return (this.pos += 4), t;
              },
              readFixed64: function() {
                var t =
                  this.buf.readUInt32LE(this.pos) +
                  this.buf.readUInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                return (this.pos += 8), t;
              },
              readSFixed64: function() {
                var t =
                  this.buf.readUInt32LE(this.pos) +
                  this.buf.readInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                return (this.pos += 8), t;
              },
              readFloat: function() {
                var t = this.buf.readFloatLE(this.pos);
                return (this.pos += 4), t;
              },
              readDouble: function() {
                var t = this.buf.readDoubleLE(this.pos);
                return (this.pos += 8), t;
              },
              readVarint: function() {
                var t,
                  i,
                  e,
                  r,
                  s,
                  n,
                  o = this.buf;
                if (((e = o[this.pos++]), 128 > e)) return e;
                if (((e = 127 & e), (r = o[this.pos++]), 128 > r))
                  return e | (r << 7);
                if (((r = (127 & r) << 7), (s = o[this.pos++]), 128 > s))
                  return e | r | (s << 14);
                if (((s = (127 & s) << 14), (n = o[this.pos++]), 128 > n))
                  return e | r | s | (n << 21);
                if (
                  ((t = e | r | s | ((127 & n) << 21)),
                  (i = o[this.pos++]),
                  (t += 268435456 * (127 & i)),
                  128 > i)
                )
                  return t;
                if (
                  ((i = o[this.pos++]), (t += 34359738368 * (127 & i)), 128 > i)
                )
                  return t;
                if (
                  ((i = o[this.pos++]),
                  (t += 4398046511104 * (127 & i)),
                  128 > i)
                )
                  return t;
                if (
                  ((i = o[this.pos++]),
                  (t += 562949953421312 * (127 & i)),
                  128 > i)
                )
                  return t;
                if (
                  ((i = o[this.pos++]),
                  (t += 72057594037927940 * (127 & i)),
                  128 > i)
                )
                  return t;
                if (
                  ((i = o[this.pos++]),
                  (t += 0x8000000000000000 * (127 & i)),
                  128 > i)
                )
                  return t;
                throw new Error("Expected varint not more than 10 bytes");
              },
              readVarint64: function() {
                var t = this.pos,
                  i = this.readVarint();
                if (POW_2_63 > i) return i;
                for (var e = this.pos - 2; 255 === this.buf[e]; ) e--;
                t > e && (e = t), (i = 0);
                for (var r = 0; e - t + 1 > r; r++) {
                  var s = 127 & ~this.buf[t + r];
                  i += 4 > r ? s << (7 * r) : s * Math.pow(2, 7 * r);
                }
                return -i - 1;
              },
              readSVarint: function() {
                var t = this.readVarint();
                return t % 2 === 1 ? (t + 1) / -2 : t / 2;
              },
              readBoolean: function() {
                return Boolean(this.readVarint());
              },
              readString: function() {
                var t = this.readVarint() + this.pos,
                  i = this.buf.toString("utf8", this.pos, t);
                return (this.pos = t), i;
              },
              readBytes: function() {
                var t = this.readVarint() + this.pos,
                  i = this.buf.slice(this.pos, t);
                return (this.pos = t), i;
              },
              readPackedVarint: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readVarint());
                return i;
              },
              readPackedSVarint: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readSVarint());
                return i;
              },
              readPackedBoolean: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readBoolean());
                return i;
              },
              readPackedFloat: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readFloat());
                return i;
              },
              readPackedDouble: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readDouble());
                return i;
              },
              readPackedFixed32: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readFixed32());
                return i;
              },
              readPackedSFixed32: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readSFixed32());
                return i;
              },
              readPackedFixed64: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readFixed64());
                return i;
              },
              readPackedSFixed64: function() {
                for (
                  var t = this.readVarint() + this.pos, i = [];
                  this.pos < t;

                )
                  i.push(this.readSFixed64());
                return i;
              },
              skip: function(t) {
                var i = 7 & t;
                if (i === Pbf.Varint) for (; this.buf[this.pos++] > 127; );
                else if (i === Pbf.Bytes)
                  this.pos = this.readVarint() + this.pos;
                else if (i === Pbf.Fixed32) this.pos += 4;
                else {
                  if (i !== Pbf.Fixed64)
                    throw new Error("Unimplemented type: " + i);
                  this.pos += 8;
                }
              },
              writeTag: function(t, i) {
                this.writeVarint((t << 3) | i);
              },
              realloc: function(t) {
                for (var i = this.length || 16; i < this.pos + t; ) i *= 2;
                if (i !== this.length) {
                  var e = new Buffer(i);
                  this.buf.copy(e), (this.buf = e), (this.length = i);
                }
              },
              finish: function() {
                return (
                  (this.length = this.pos),
                  (this.pos = 0),
                  this.buf.slice(0, this.length)
                );
              },
              writeFixed32: function(t) {
                this.realloc(4),
                  this.buf.writeUInt32LE(t, this.pos),
                  (this.pos += 4);
              },
              writeSFixed32: function(t) {
                this.realloc(4),
                  this.buf.writeInt32LE(t, this.pos),
                  (this.pos += 4);
              },
              writeFixed64: function(t) {
                this.realloc(8),
                  this.buf.writeInt32LE(-1 & t, this.pos),
                  this.buf.writeUInt32LE(
                    Math.floor(t * SHIFT_RIGHT_32),
                    this.pos + 4
                  ),
                  (this.pos += 8);
              },
              writeSFixed64: function(t) {
                this.realloc(8),
                  this.buf.writeInt32LE(-1 & t, this.pos),
                  this.buf.writeInt32LE(
                    Math.floor(t * SHIFT_RIGHT_32),
                    this.pos + 4
                  ),
                  (this.pos += 8);
              },
              writeVarint: function(t) {
                if (((t = +t), 127 >= t))
                  this.realloc(1), (this.buf[this.pos++] = t);
                else if (16383 >= t)
                  this.realloc(2),
                    (this.buf[this.pos++] = ((t >>> 0) & 127) | 128),
                    (this.buf[this.pos++] = (t >>> 7) & 127);
                else if (2097151 >= t)
                  this.realloc(3),
                    (this.buf[this.pos++] = ((t >>> 0) & 127) | 128),
                    (this.buf[this.pos++] = ((t >>> 7) & 127) | 128),
                    (this.buf[this.pos++] = (t >>> 14) & 127);
                else if (268435455 >= t)
                  this.realloc(4),
                    (this.buf[this.pos++] = ((t >>> 0) & 127) | 128),
                    (this.buf[this.pos++] = ((t >>> 7) & 127) | 128),
                    (this.buf[this.pos++] = ((t >>> 14) & 127) | 128),
                    (this.buf[this.pos++] = (t >>> 21) & 127);
                else {
                  for (var i = this.pos; t >= 128; )
                    this.realloc(1),
                      (this.buf[this.pos++] = (255 & t) | 128),
                      (t /= 128);
                  if (
                    (this.realloc(1),
                    (this.buf[this.pos++] = 0 | t),
                    this.pos - i > 10)
                  )
                    throw new Error("Given varint doesn't fit into 10 bytes");
                }
              },
              writeSVarint: function(t) {
                this.writeVarint(0 > t ? 2 * -t - 1 : 2 * t);
              },
              writeBoolean: function(t) {
                this.writeVarint(Boolean(t));
              },
              writeString: function(t) {
                t = String(t);
                var i = Buffer.byteLength(t);
                this.writeVarint(i),
                  this.realloc(i),
                  this.buf.write(t, this.pos),
                  (this.pos += i);
              },
              writeFloat: function(t) {
                this.realloc(4),
                  this.buf.writeFloatLE(t, this.pos),
                  (this.pos += 4);
              },
              writeDouble: function(t) {
                this.realloc(8),
                  this.buf.writeDoubleLE(t, this.pos),
                  (this.pos += 8);
              },
              writeBytes: function(t) {
                var i = t.length;
                this.writeVarint(i), this.realloc(i);
                for (var e = 0; i > e; e++) this.buf[this.pos++] = t[e];
              },
              writeRawMessage: function(t, i) {
                this.pos++;
                var e = this.pos;
                t(i, this);
                var r = this.pos - e,
                  s =
                    127 >= r
                      ? 1
                      : 16383 >= r
                      ? 2
                      : 2097151 >= r
                      ? 3
                      : 268435455 >= r
                      ? 4
                      : Math.ceil(Math.log(r) / (7 * Math.LN2));
                if (s > 1) {
                  this.realloc(s - 1);
                  for (var n = this.pos - 1; n >= e; n--)
                    this.buf[n + s - 1] = this.buf[n];
                }
                (this.pos = e - 1), this.writeVarint(r), (this.pos += r);
              },
              writeMessage: function(t, i, e) {
                this.writeTag(t, Pbf.Bytes), this.writeRawMessage(i, e);
              },
              writePackedVarint: function(t, i) {
                this.writeMessage(t, writePackedVarint, i);
              },
              writePackedSVarint: function(t, i) {
                this.writeMessage(t, writePackedSVarint, i);
              },
              writePackedBoolean: function(t, i) {
                this.writeMessage(t, writePackedBoolean, i);
              },
              writePackedFloat: function(t, i) {
                this.writeMessage(t, writePackedFloat, i);
              },
              writePackedDouble: function(t, i) {
                this.writeMessage(t, writePackedDouble, i);
              },
              writePackedFixed32: function(t, i) {
                this.writeMessage(t, writePackedFixed32, i);
              },
              writePackedSFixed32: function(t, i) {
                this.writeMessage(t, writePackedSFixed32, i);
              },
              writePackedFixed64: function(t, i) {
                this.writeMessage(t, writePackedFixed64, i);
              },
              writePackedSFixed64: function(t, i) {
                this.writeMessage(t, writePackedSFixed64, i);
              },
              writeBytesField: function(t, i) {
                this.writeTag(t, Pbf.Bytes), this.writeBytes(i);
              },
              writeFixed32Field: function(t, i) {
                this.writeTag(t, Pbf.Fixed32), this.writeFixed32(i);
              },
              writeSFixed32Field: function(t, i) {
                this.writeTag(t, Pbf.Fixed32), this.writeSFixed32(i);
              },
              writeFixed64Field: function(t, i) {
                this.writeTag(t, Pbf.Fixed64), this.writeFixed64(i);
              },
              writeSFixed64Field: function(t, i) {
                this.writeTag(t, Pbf.Fixed64), this.writeSFixed64(i);
              },
              writeVarintField: function(t, i) {
                this.writeTag(t, Pbf.Varint), this.writeVarint(i);
              },
              writeSVarintField: function(t, i) {
                this.writeTag(t, Pbf.Varint), this.writeSVarint(i);
              },
              writeStringField: function(t, i) {
                this.writeTag(t, Pbf.Bytes), this.writeString(i);
              },
              writeFloatField: function(t, i) {
                this.writeTag(t, Pbf.Fixed32), this.writeFloat(i);
              },
              writeDoubleField: function(t, i) {
                this.writeTag(t, Pbf.Fixed64), this.writeDouble(i);
              },
              writeBooleanField: function(t, i) {
                this.writeVarintField(t, Boolean(i));
              }
            };
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        { "./buffer": 130 }
      ],
      132: [
        function(require, module, exports) {
          (exports.read = function(a, o, t, r, h) {
            var M,
              p,
              w = 8 * h - r - 1,
              f = (1 << w) - 1,
              e = f >> 1,
              i = -7,
              N = t ? h - 1 : 0,
              n = t ? -1 : 1,
              s = a[o + N];
            for (
              N += n, M = s & ((1 << -i) - 1), s >>= -i, i += w;
              i > 0;
              M = 256 * M + a[o + N], N += n, i -= 8
            );
            for (
              p = M & ((1 << -i) - 1), M >>= -i, i += r;
              i > 0;
              p = 256 * p + a[o + N], N += n, i -= 8
            );
            if (0 === M) M = 1 - e;
            else {
              if (M === f) return p ? NaN : (s ? -1 : 1) * (1 / 0);
              (p += Math.pow(2, r)), (M -= e);
            }
            return (s ? -1 : 1) * p * Math.pow(2, M - r);
          }),
            (exports.write = function(a, o, t, r, h, M) {
              var p,
                w,
                f,
                e = 8 * M - h - 1,
                i = (1 << e) - 1,
                N = i >> 1,
                n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                s = r ? 0 : M - 1,
                u = r ? 1 : -1,
                l = 0 > o || (0 === o && 0 > 1 / o) ? 1 : 0;
              for (
                o = Math.abs(o),
                  isNaN(o) || o === 1 / 0
                    ? ((w = isNaN(o) ? 1 : 0), (p = i))
                    : ((p = Math.floor(Math.log(o) / Math.LN2)),
                      o * (f = Math.pow(2, -p)) < 1 && (p--, (f *= 2)),
                      (o += p + N >= 1 ? n / f : n * Math.pow(2, 1 - N)),
                      o * f >= 2 && (p++, (f /= 2)),
                      p + N >= i
                        ? ((w = 0), (p = i))
                        : p + N >= 1
                        ? ((w = (o * f - 1) * Math.pow(2, h)), (p += N))
                        : ((w = o * Math.pow(2, N - 1) * Math.pow(2, h)),
                          (p = 0)));
                h >= 8;
                a[t + s] = 255 & w, s += u, w /= 256, h -= 8
              );
              for (
                p = (p << h) | w, e += h;
                e > 0;
                a[t + s] = 255 & p, s += u, p /= 256, e -= 8
              );
              a[t + s - u] |= 128 * l;
            });
        },
        {}
      ],
      133: [
        function(require, module, exports) {
          "use strict";
          function Point(t, n) {
            (this.x = t), (this.y = n);
          }
          (module.exports = Point),
            (Point.prototype = {
              clone: function() {
                return new Point(this.x, this.y);
              },
              add: function(t) {
                return this.clone()._add(t);
              },
              sub: function(t) {
                return this.clone()._sub(t);
              },
              mult: function(t) {
                return this.clone()._mult(t);
              },
              div: function(t) {
                return this.clone()._div(t);
              },
              rotate: function(t) {
                return this.clone()._rotate(t);
              },
              matMult: function(t) {
                return this.clone()._matMult(t);
              },
              unit: function() {
                return this.clone()._unit();
              },
              perp: function() {
                return this.clone()._perp();
              },
              round: function() {
                return this.clone()._round();
              },
              mag: function() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
              },
              equals: function(t) {
                return this.x === t.x && this.y === t.y;
              },
              dist: function(t) {
                return Math.sqrt(this.distSqr(t));
              },
              distSqr: function(t) {
                var n = t.x - this.x,
                  i = t.y - this.y;
                return n * n + i * i;
              },
              angle: function() {
                return Math.atan2(this.y, this.x);
              },
              angleTo: function(t) {
                return Math.atan2(this.y - t.y, this.x - t.x);
              },
              angleWith: function(t) {
                return this.angleWithSep(t.x, t.y);
              },
              angleWithSep: function(t, n) {
                return Math.atan2(
                  this.x * n - this.y * t,
                  this.x * t + this.y * n
                );
              },
              _matMult: function(t) {
                var n = t[0] * this.x + t[1] * this.y,
                  i = t[2] * this.x + t[3] * this.y;
                return (this.x = n), (this.y = i), this;
              },
              _add: function(t) {
                return (this.x += t.x), (this.y += t.y), this;
              },
              _sub: function(t) {
                return (this.x -= t.x), (this.y -= t.y), this;
              },
              _mult: function(t) {
                return (this.x *= t), (this.y *= t), this;
              },
              _div: function(t) {
                return (this.x /= t), (this.y /= t), this;
              },
              _unit: function() {
                return this._div(this.mag()), this;
              },
              _perp: function() {
                var t = this.y;
                return (this.y = this.x), (this.x = -t), this;
              },
              _rotate: function(t) {
                var n = Math.cos(t),
                  i = Math.sin(t),
                  s = n * this.x - i * this.y,
                  r = i * this.x + n * this.y;
                return (this.x = s), (this.y = r), this;
              },
              _round: function() {
                return (
                  (this.x = Math.round(this.x)),
                  (this.y = Math.round(this.y)),
                  this
                );
              }
            }),
            (Point.convert = function(t) {
              return t instanceof Point
                ? t
                : Array.isArray(t)
                ? new Point(t[0], t[1])
                : t;
            });
        },
        {}
      ],
      134: [
        function(require, module, exports) {
          !(function() {
            "use strict";
            function t(i, n) {
              return this instanceof t
                ? ((this._maxEntries = Math.max(4, i || 9)),
                  (this._minEntries = Math.max(
                    2,
                    Math.ceil(0.4 * this._maxEntries)
                  )),
                  n && this._initFormat(n),
                  void this.clear())
                : new t(i, n);
            }
            function i(t, i) {
              t.bbox = n(t, 0, t.children.length, i);
            }
            function n(t, i, n, r) {
              for (var o, a = e(), s = i; n > s; s++)
                (o = t.children[s]), h(a, t.leaf ? r(o) : o.bbox);
              return a;
            }
            function e() {
              return [1 / 0, 1 / 0, -(1 / 0), -(1 / 0)];
            }
            function h(t, i) {
              return (
                (t[0] = Math.min(t[0], i[0])),
                (t[1] = Math.min(t[1], i[1])),
                (t[2] = Math.max(t[2], i[2])),
                (t[3] = Math.max(t[3], i[3])),
                t
              );
            }
            function r(t, i) {
              return t.bbox[0] - i.bbox[0];
            }
            function o(t, i) {
              return t.bbox[1] - i.bbox[1];
            }
            function a(t) {
              return (t[2] - t[0]) * (t[3] - t[1]);
            }
            function s(t) {
              return t[2] - t[0] + (t[3] - t[1]);
            }
            function l(t, i) {
              return (
                (Math.max(i[2], t[2]) - Math.min(i[0], t[0])) *
                (Math.max(i[3], t[3]) - Math.min(i[1], t[1]))
              );
            }
            function u(t, i) {
              var n = Math.max(t[0], i[0]),
                e = Math.max(t[1], i[1]),
                h = Math.min(t[2], i[2]),
                r = Math.min(t[3], i[3]);
              return Math.max(0, h - n) * Math.max(0, r - e);
            }
            function f(t, i) {
              return (
                t[0] <= i[0] && t[1] <= i[1] && i[2] <= t[2] && i[3] <= t[3]
              );
            }
            function c(t, i) {
              return (
                i[0] <= t[2] && i[1] <= t[3] && i[2] >= t[0] && i[3] >= t[1]
              );
            }
            function d(t, i, n, e, h) {
              for (var r, o = [i, n]; o.length; )
                (n = o.pop()),
                  (i = o.pop()),
                  e >= n - i ||
                    ((r = i + Math.ceil((n - i) / e / 2) * e),
                    x(t, i, n, r, h),
                    o.push(i, r, r, n));
            }
            function x(t, i, n, e, h) {
              for (var r, o, a, s, l, u, f, c, d; n > i; ) {
                for (
                  n - i > 600 &&
                    ((r = n - i + 1),
                    (o = e - i + 1),
                    (a = Math.log(r)),
                    (s = 0.5 * Math.exp((2 * a) / 3)),
                    (l =
                      0.5 *
                      Math.sqrt((a * s * (r - s)) / r) *
                      (0 > o - r / 2 ? -1 : 1)),
                    (u = Math.max(i, Math.floor(e - (o * s) / r + l))),
                    (f = Math.min(n, Math.floor(e + ((r - o) * s) / r + l))),
                    x(t, u, f, e, h)),
                    c = t[e],
                    o = i,
                    d = n,
                    p(t, i, e),
                    h(t[n], c) > 0 && p(t, i, n);
                  d > o;

                ) {
                  for (p(t, o, d), o++, d--; h(t[o], c) < 0; ) o++;
                  for (; h(t[d], c) > 0; ) d--;
                }
                0 === h(t[i], c) ? p(t, i, d) : (d++, p(t, d, n)),
                  e >= d && (i = d + 1),
                  d >= e && (n = d - 1);
              }
            }
            function p(t, i, n) {
              var e = t[i];
              (t[i] = t[n]), (t[n] = e);
            }
            (t.prototype = {
              all: function() {
                return this._all(this.data, []);
              },
              search: function(t) {
                var i = this.data,
                  n = [],
                  e = this.toBBox;
                if (!c(t, i.bbox)) return n;
                for (var h, r, o, a, s = []; i; ) {
                  for (h = 0, r = i.children.length; r > h; h++)
                    (o = i.children[h]),
                      (a = i.leaf ? e(o) : o.bbox),
                      c(t, a) &&
                        (i.leaf
                          ? n.push(o)
                          : f(t, a)
                          ? this._all(o, n)
                          : s.push(o));
                  i = s.pop();
                }
                return n;
              },
              collides: function(t) {
                var i = this.data,
                  n = this.toBBox;
                if (!c(t, i.bbox)) return !1;
                for (var e, h, r, o, a = []; i; ) {
                  for (e = 0, h = i.children.length; h > e; e++)
                    if (
                      ((r = i.children[e]),
                      (o = i.leaf ? n(r) : r.bbox),
                      c(t, o))
                    ) {
                      if (i.leaf || f(t, o)) return !0;
                      a.push(r);
                    }
                  i = a.pop();
                }
                return !1;
              },
              load: function(t) {
                if (!t || !t.length) return this;
                if (t.length < this._minEntries) {
                  for (var i = 0, n = t.length; n > i; i++) this.insert(t[i]);
                  return this;
                }
                var e = this._build(t.slice(), 0, t.length - 1, 0);
                if (this.data.children.length)
                  if (this.data.height === e.height)
                    this._splitRoot(this.data, e);
                  else {
                    if (this.data.height < e.height) {
                      var h = this.data;
                      (this.data = e), (e = h);
                    }
                    this._insert(e, this.data.height - e.height - 1, !0);
                  }
                else this.data = e;
                return this;
              },
              insert: function(t) {
                return t && this._insert(t, this.data.height - 1), this;
              },
              clear: function() {
                return (
                  (this.data = {
                    children: [],
                    height: 1,
                    bbox: e(),
                    leaf: !0
                  }),
                  this
                );
              },
              remove: function(t) {
                if (!t) return this;
                for (
                  var i,
                    n,
                    e,
                    h,
                    r = this.data,
                    o = this.toBBox(t),
                    a = [],
                    s = [];
                  r || a.length;

                ) {
                  if (
                    (r ||
                      ((r = a.pop()),
                      (n = a[a.length - 1]),
                      (i = s.pop()),
                      (h = !0)),
                    r.leaf && ((e = r.children.indexOf(t)), -1 !== e))
                  )
                    return (
                      r.children.splice(e, 1),
                      a.push(r),
                      this._condense(a),
                      this
                    );
                  h || r.leaf || !f(r.bbox, o)
                    ? n
                      ? (i++, (r = n.children[i]), (h = !1))
                      : (r = null)
                    : (a.push(r),
                      s.push(i),
                      (i = 0),
                      (n = r),
                      (r = r.children[0]));
                }
                return this;
              },
              toBBox: function(t) {
                return t;
              },
              compareMinX: function(t, i) {
                return t[0] - i[0];
              },
              compareMinY: function(t, i) {
                return t[1] - i[1];
              },
              toJSON: function() {
                return this.data;
              },
              fromJSON: function(t) {
                return (this.data = t), this;
              },
              _all: function(t, i) {
                for (var n = []; t; )
                  t.leaf
                    ? i.push.apply(i, t.children)
                    : n.push.apply(n, t.children),
                    (t = n.pop());
                return i;
              },
              _build: function(t, n, e, h) {
                var r,
                  o = e - n + 1,
                  a = this._maxEntries;
                if (a >= o)
                  return (
                    (r = {
                      children: t.slice(n, e + 1),
                      height: 1,
                      bbox: null,
                      leaf: !0
                    }),
                    i(r, this.toBBox),
                    r
                  );
                h ||
                  ((h = Math.ceil(Math.log(o) / Math.log(a))),
                  (a = Math.ceil(o / Math.pow(a, h - 1)))),
                  (r = { children: [], height: h, bbox: null, leaf: !1 });
                var s,
                  l,
                  u,
                  f,
                  c = Math.ceil(o / a),
                  x = c * Math.ceil(Math.sqrt(a));
                for (d(t, n, e, x, this.compareMinX), s = n; e >= s; s += x)
                  for (
                    u = Math.min(s + x - 1, e),
                      d(t, s, u, c, this.compareMinY),
                      l = s;
                    u >= l;
                    l += c
                  )
                    (f = Math.min(l + c - 1, u)),
                      r.children.push(this._build(t, l, f, h - 1));
                return i(r, this.toBBox), r;
              },
              _chooseSubtree: function(t, i, n, e) {
                for (var h, r, o, s, u, f, c, d; ; ) {
                  if ((e.push(i), i.leaf || e.length - 1 === n)) break;
                  for (c = d = 1 / 0, h = 0, r = i.children.length; r > h; h++)
                    (o = i.children[h]),
                      (u = a(o.bbox)),
                      (f = l(t, o.bbox) - u),
                      d > f
                        ? ((d = f), (c = c > u ? u : c), (s = o))
                        : f === d && c > u && ((c = u), (s = o));
                  i = s;
                }
                return i;
              },
              _insert: function(t, i, n) {
                var e = this.toBBox,
                  r = n ? t.bbox : e(t),
                  o = [],
                  a = this._chooseSubtree(r, this.data, i, o);
                for (
                  a.children.push(t), h(a.bbox, r);
                  i >= 0 && o[i].children.length > this._maxEntries;

                )
                  this._split(o, i), i--;
                this._adjustParentBBoxes(r, o, i);
              },
              _split: function(t, n) {
                var e = t[n],
                  h = e.children.length,
                  r = this._minEntries;
                this._chooseSplitAxis(e, r, h);
                var o = this._chooseSplitIndex(e, r, h),
                  a = {
                    children: e.children.splice(o, e.children.length - o),
                    height: e.height,
                    bbox: null,
                    leaf: !1
                  };
                e.leaf && (a.leaf = !0),
                  i(e, this.toBBox),
                  i(a, this.toBBox),
                  n ? t[n - 1].children.push(a) : this._splitRoot(e, a);
              },
              _splitRoot: function(t, n) {
                (this.data = {
                  children: [t, n],
                  height: t.height + 1,
                  bbox: null,
                  leaf: !1
                }),
                  i(this.data, this.toBBox);
              },
              _chooseSplitIndex: function(t, i, e) {
                var h, r, o, s, l, f, c, d;
                for (f = c = 1 / 0, h = i; e - i >= h; h++)
                  (r = n(t, 0, h, this.toBBox)),
                    (o = n(t, h, e, this.toBBox)),
                    (s = u(r, o)),
                    (l = a(r) + a(o)),
                    f > s
                      ? ((f = s), (d = h), (c = c > l ? l : c))
                      : s === f && c > l && ((c = l), (d = h));
                return d;
              },
              _chooseSplitAxis: function(t, i, n) {
                var e = t.leaf ? this.compareMinX : r,
                  h = t.leaf ? this.compareMinY : o,
                  a = this._allDistMargin(t, i, n, e),
                  s = this._allDistMargin(t, i, n, h);
                s > a && t.children.sort(e);
              },
              _allDistMargin: function(t, i, e, r) {
                t.children.sort(r);
                var o,
                  a,
                  l = this.toBBox,
                  u = n(t, 0, i, l),
                  f = n(t, e - i, e, l),
                  c = s(u) + s(f);
                for (o = i; e - i > o; o++)
                  (a = t.children[o]),
                    h(u, t.leaf ? l(a) : a.bbox),
                    (c += s(u));
                for (o = e - i - 1; o >= i; o--)
                  (a = t.children[o]),
                    h(f, t.leaf ? l(a) : a.bbox),
                    (c += s(f));
                return c;
              },
              _adjustParentBBoxes: function(t, i, n) {
                for (var e = n; e >= 0; e--) h(i[e].bbox, t);
              },
              _condense: function(t) {
                for (var n, e = t.length - 1; e >= 0; e--)
                  0 === t[e].children.length
                    ? e > 0
                      ? ((n = t[e - 1].children), n.splice(n.indexOf(t[e]), 1))
                      : this.clear()
                    : i(t[e], this.toBBox);
              },
              _initFormat: function(t) {
                var i = ["return a", " - b", ";"];
                (this.compareMinX = new Function("a", "b", i.join(t[0]))),
                  (this.compareMinY = new Function("a", "b", i.join(t[1]))),
                  (this.toBBox = new Function(
                    "a",
                    "return [a" + t.join(", a") + "];"
                  ));
              }
            }),
              "function" == typeof define && define.amd
                ? define("rbush", function() {
                    return t;
                  })
                : "undefined" != typeof module
                ? (module.exports = t)
                : "undefined" != typeof self
                ? (self.rbush = t)
                : (window.rbush = t);
          })();
        },
        {}
      ],
      135: [
        function(require, module, exports) {
          void (function(e, r) {
            "function" == typeof define && define.amd
              ? define(r)
              : "object" == typeof exports
              ? (module.exports = r())
              : (e.resolveUrl = r());
          })(this, function() {
            function e() {
              var e = arguments.length;
              if (0 === e)
                throw new Error(
                  "resolveUrl requires at least one argument; got none."
                );
              var r = document.createElement("base");
              if (((r.href = arguments[0]), 1 === e)) return r.href;
              var t = document.getElementsByTagName("head")[0];
              t.insertBefore(r, t.firstChild);
              for (var n, o = document.createElement("a"), f = 1; e > f; f++)
                (o.href = arguments[f]), (n = o.href), (r.href = n);
              return t.removeChild(r), n;
            }
            return e;
          });
        },
        {}
      ],
      136: [
        function(require, module, exports) {
          "use strict";
          function supercluster(t) {
            return new SuperCluster(t);
          }
          function SuperCluster(t) {
            (this.options = extend(Object.create(this.options), t)),
              this._initTrees();
          }
          function toBBox(t) {
            return [t.x, t.y, t.x, t.y];
          }
          function compareMinX(t, e) {
            return t.x - e.x;
          }
          function compareMinY(t, e) {
            return t.y - e.y;
          }
          function createCluster(t, e) {
            return {
              x: t,
              y: e,
              wx: t,
              wy: e,
              zoom: 1 / 0,
              point: null,
              numPoints: 1
            };
          }
          function createPointCluster(t) {
            var e = t.geometry.coordinates,
              o = createCluster(lngX(e[0]), latY(e[1]));
            return (o.point = t), o;
          }
          function getClusterJSON(t) {
            return t.point
              ? t.point
              : {
                  type: "Feature",
                  properties: getClusterProperties(t),
                  geometry: {
                    type: "Point",
                    coordinates: [xLng(t.wx), yLat(t.wy)]
                  }
                };
          }
          function getClusterProperties(t) {
            var e = t.numPoints,
              o =
                e >= 1e4
                  ? Math.round(e / 1e3) + "k"
                  : e >= 1e3
                  ? Math.round(e / 100) / 10 + "k"
                  : e;
            return { cluster: !0, point_count: e, point_count_abbreviated: o };
          }
          function lngX(t) {
            return t / 360 + 0.5;
          }
          function latY(t) {
            var e = Math.sin((t * Math.PI) / 180),
              o = 0.5 - (0.25 * Math.log((1 + e) / (1 - e))) / Math.PI;
            return 0 > o ? 0 : o > 1 ? 1 : o;
          }
          function xLng(t) {
            return 360 * (t - 0.5);
          }
          function yLat(t) {
            var e = ((180 - 360 * t) * Math.PI) / 180;
            return (360 * Math.atan(Math.exp(e))) / Math.PI - 90;
          }
          function distSq(t, e) {
            var o = t.wx - e.wx,
              n = t.wy - e.wy;
            return o * o + n * n;
          }
          function extend(t, e) {
            for (var o in e) t[o] = e[o];
            return t;
          }
          var rbush = require("rbush");
          (module.exports = supercluster),
            (SuperCluster.prototype = {
              options: {
                minZoom: 0,
                maxZoom: 16,
                radius: 40,
                extent: 512,
                nodeSize: 16,
                log: !1
              },
              load: function(t) {
                var e = this.options.log;
                e && console.time("total time");
                var o = "prepare " + t.length + " points";
                e && console.time(o);
                var n = t.map(createPointCluster);
                e && console.timeEnd(o);
                for (
                  var r = this.options.maxZoom;
                  r >= this.options.minZoom;
                  r--
                ) {
                  var i = +Date.now();
                  this.trees[r + 1].load(n),
                    (n = this._cluster(n, r)),
                    e &&
                      console.log(
                        "z%d: %d clusters in %dms",
                        r,
                        n.length,
                        +Date.now() - i
                      );
                }
                return (
                  this.trees[this.options.minZoom].load(n),
                  e && console.timeEnd("total time"),
                  this
                );
              },
              getClusters: function(t, e) {
                var o = [lngX(t[0]), latY(t[3]), lngX(t[2]), latY(t[1])],
                  n = Math.max(
                    this.options.minZoom,
                    Math.min(e, this.options.maxZoom + 1)
                  ),
                  r = this.trees[n].search(o);
                return r.map(getClusterJSON);
              },
              getTile: function(t, e, o) {
                var n = Math.pow(2, t),
                  r = this.options.extent,
                  i = this.options.radius / r,
                  s = this.trees[t].search([
                    (e - i) / n,
                    (o - i) / n,
                    (e + 1 + i) / n,
                    (o + 1 + i) / n
                  ]);
                if (!s.length) return null;
                for (var u = { features: [] }, a = 0; a < s.length; a++) {
                  var h = s[a],
                    p = {
                      type: 1,
                      geometry: [
                        [
                          Math.round(r * (h.wx * n - e)),
                          Math.round(r * (h.wy * n - o))
                        ]
                      ],
                      tags: h.point
                        ? h.point.properties
                        : getClusterProperties(h)
                    };
                  u.features.push(p);
                }
                return u;
              },
              _initTrees: function() {
                this.trees = [];
                for (var t = 0; t <= this.options.maxZoom + 1; t++)
                  (this.trees[t] = rbush(this.options.nodeSize)),
                    (this.trees[t].toBBox = toBBox),
                    (this.trees[t].compareMinX = compareMinX),
                    (this.trees[t].compareMinY = compareMinY);
              },
              _cluster: function(t, e) {
                for (
                  var o = [],
                    n =
                      this.options.radius /
                      (this.options.extent * Math.pow(2, e)),
                    r = [0, 0, 0, 0],
                    i = 0;
                  i < t.length;
                  i++
                ) {
                  var s = t[i];
                  if (!(s.zoom <= e)) {
                    (s.zoom = e),
                      (r[0] = s.wx - n),
                      (r[1] = s.wy - n),
                      (r[2] = s.wx + n),
                      (r[3] = s.wy + n);
                    for (
                      var u = this.trees[e + 1].search(r),
                        a = !1,
                        h = s.numPoints,
                        p = s.wx * h,
                        l = s.wy * h,
                        c = 0;
                      c < u.length;
                      c++
                    ) {
                      var m = u[c];
                      e < m.zoom &&
                        distSq(s, m) <= n * n &&
                        ((a = !0),
                        (m.zoom = e),
                        (p += m.wx * m.numPoints),
                        (l += m.wy * m.numPoints),
                        (h += m.numPoints));
                    }
                    if (a) {
                      var x = createCluster(s.x, s.y);
                      (x.numPoints = h),
                        (x.wx = p / h),
                        (x.wy = l / h),
                        o.push(x);
                    } else o.push(s);
                  }
                }
                return o;
              }
            });
        },
        { rbush: 134 }
      ],
      137: [
        function(require, module, exports) {
          function UnitBezier(t, i, e, r) {
            (this.cx = 3 * t),
              (this.bx = 3 * (e - t) - this.cx),
              (this.ax = 1 - this.cx - this.bx),
              (this.cy = 3 * i),
              (this.by = 3 * (r - i) - this.cy),
              (this.ay = 1 - this.cy - this.by),
              (this.p1x = t),
              (this.p1y = r),
              (this.p2x = e),
              (this.p2y = r);
          }
          (module.exports = UnitBezier),
            (UnitBezier.prototype.sampleCurveX = function(t) {
              return ((this.ax * t + this.bx) * t + this.cx) * t;
            }),
            (UnitBezier.prototype.sampleCurveY = function(t) {
              return ((this.ay * t + this.by) * t + this.cy) * t;
            }),
            (UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
              return (3 * this.ax * t + 2 * this.bx) * t + this.cx;
            }),
            (UnitBezier.prototype.solveCurveX = function(t, i) {
              "undefined" == typeof i && (i = 1e-6);
              var e, r, s, h, n;
              for (s = t, n = 0; 8 > n; n++) {
                if (((h = this.sampleCurveX(s) - t), Math.abs(h) < i)) return s;
                var u = this.sampleCurveDerivativeX(s);
                if (Math.abs(u) < 1e-6) break;
                s -= h / u;
              }
              if (((e = 0), (r = 1), (s = t), e > s)) return e;
              if (s > r) return r;
              for (; r > e; ) {
                if (((h = this.sampleCurveX(s)), Math.abs(h - t) < i)) return s;
                t > h ? (e = s) : (r = s), (s = 0.5 * (r - e) + e);
              }
              return s;
            }),
            (UnitBezier.prototype.solve = function(t, i) {
              return this.sampleCurveY(this.solveCurveX(t, i));
            });
        },
        {}
      ],
      138: [
        function(require, module, exports) {
          (module.exports.VectorTile = require("./lib/vectortile.js")),
            (module.exports.VectorTileFeature = require("./lib/vectortilefeature.js")),
            (module.exports.VectorTileLayer = require("./lib/vectortilelayer.js"));
        },
        {
          "./lib/vectortile.js": 139,
          "./lib/vectortilefeature.js": 140,
          "./lib/vectortilelayer.js": 141
        }
      ],
      139: [
        function(require, module, exports) {
          "use strict";
          function VectorTile(e, r) {
            this.layers = e.readFields(readTile, {}, r);
          }
          function readTile(e, r, i) {
            if (3 === e) {
              var t = new VectorTileLayer(i, i.readVarint() + i.pos);
              t.length && (r[t.name] = t);
            }
          }
          var VectorTileLayer = require("./vectortilelayer");
          module.exports = VectorTile;
        },
        { "./vectortilelayer": 141 }
      ],
      140: [
        function(require, module, exports) {
          "use strict";
          function VectorTileFeature(e, t, r, i, o) {
            (this.properties = {}),
              (this.extent = r),
              (this.type = 0),
              (this._pbf = e),
              (this._geometry = -1),
              (this._keys = i),
              (this._values = o),
              e.readFields(readFeature, this, t);
          }
          function readFeature(e, t, r) {
            1 == e
              ? (t._id = r.readVarint())
              : 2 == e
              ? readTag(r, t)
              : 3 == e
              ? (t.type = r.readVarint())
              : 4 == e && (t._geometry = r.pos);
          }
          function readTag(e, t) {
            for (var r = e.readVarint() + e.pos; e.pos < r; ) {
              var i = t._keys[e.readVarint()],
                o = t._values[e.readVarint()];
              t.properties[i] = o;
            }
          }
          var Point = require("point-geometry");
          (module.exports = VectorTileFeature),
            (VectorTileFeature.types = [
              "Unknown",
              "Point",
              "LineString",
              "Polygon"
            ]),
            (VectorTileFeature.prototype.loadGeometry = function() {
              var e = this._pbf;
              e.pos = this._geometry;
              for (
                var t,
                  r = e.readVarint() + e.pos,
                  i = 1,
                  o = 0,
                  a = 0,
                  n = 0,
                  s = [];
                e.pos < r;

              ) {
                if (!o) {
                  var p = e.readVarint();
                  (i = 7 & p), (o = p >> 3);
                }
                if ((o--, 1 === i || 2 === i))
                  (a += e.readSVarint()),
                    (n += e.readSVarint()),
                    1 === i && (t && s.push(t), (t = [])),
                    t.push(new Point(a, n));
                else {
                  if (7 !== i) throw new Error("unknown command " + i);
                  t && t.push(t[0].clone());
                }
              }
              return t && s.push(t), s;
            }),
            (VectorTileFeature.prototype.bbox = function() {
              var e = this._pbf;
              e.pos = this._geometry;
              for (
                var t = e.readVarint() + e.pos,
                  r = 1,
                  i = 0,
                  o = 0,
                  a = 0,
                  n = 1 / 0,
                  s = -(1 / 0),
                  p = 1 / 0,
                  h = -(1 / 0);
                e.pos < t;

              ) {
                if (!i) {
                  var u = e.readVarint();
                  (r = 7 & u), (i = u >> 3);
                }
                if ((i--, 1 === r || 2 === r))
                  (o += e.readSVarint()),
                    (a += e.readSVarint()),
                    n > o && (n = o),
                    o > s && (s = o),
                    p > a && (p = a),
                    a > h && (h = a);
                else if (7 !== r) throw new Error("unknown command " + r);
              }
              return [n, p, s, h];
            }),
            (VectorTileFeature.prototype.toGeoJSON = function(e, t, r) {
              for (
                var i = this.extent * Math.pow(2, r),
                  o = this.extent * e,
                  a = this.extent * t,
                  n = this.loadGeometry(),
                  s = VectorTileFeature.types[this.type],
                  p = 0;
                p < n.length;
                p++
              )
                for (var h = n[p], u = 0; u < h.length; u++) {
                  var d = h[u],
                    l = 180 - (360 * (d.y + a)) / i;
                  h[u] = [
                    (360 * (d.x + o)) / i - 180,
                    (360 / Math.PI) * Math.atan(Math.exp((l * Math.PI) / 180)) -
                      90
                  ];
                }
              "Point" === s && 1 === n.length
                ? (n = n[0][0])
                : "Point" === s
                ? ((n = n[0]), (s = "MultiPoint"))
                : "LineString" === s && 1 === n.length
                ? (n = n[0])
                : "LineString" === s && (s = "MultiLineString");
              var y = {
                type: "Feature",
                geometry: { type: s, coordinates: n },
                properties: this.properties
              };
              return "_id" in this && (y.id = this._id), y;
            });
        },
        { "point-geometry": 142 }
      ],
      141: [
        function(require, module, exports) {
          "use strict";
          function VectorTileLayer(e, t) {
            (this.version = 1),
              (this.name = null),
              (this.extent = 4096),
              (this.length = 0),
              (this._pbf = e),
              (this._keys = []),
              (this._values = []),
              (this._features = []),
              e.readFields(readLayer, this, t),
              (this.length = this._features.length);
          }
          function readLayer(e, t, r) {
            15 === e
              ? (t.version = r.readVarint())
              : 1 === e
              ? (t.name = r.readString())
              : 5 === e
              ? (t.extent = r.readVarint())
              : 2 === e
              ? t._features.push(r.pos)
              : 3 === e
              ? t._keys.push(r.readString())
              : 4 === e && t._values.push(readValueMessage(r));
          }
          function readValueMessage(e) {
            for (var t = null, r = e.readVarint() + e.pos; e.pos < r; ) {
              var a = e.readVarint() >> 3;
              t =
                1 === a
                  ? e.readString()
                  : 2 === a
                  ? e.readFloat()
                  : 3 === a
                  ? e.readDouble()
                  : 4 === a
                  ? e.readVarint64()
                  : 5 === a
                  ? e.readVarint()
                  : 6 === a
                  ? e.readSVarint()
                  : 7 === a
                  ? e.readBoolean()
                  : null;
            }
            return t;
          }
          var VectorTileFeature = require("./vectortilefeature.js");
          (module.exports = VectorTileLayer),
            (VectorTileLayer.prototype.feature = function(e) {
              if (0 > e || e >= this._features.length)
                throw new Error("feature index out of bounds");
              this._pbf.pos = this._features[e];
              var t = this._pbf.readVarint() + this._pbf.pos;
              return new VectorTileFeature(
                this._pbf,
                t,
                this.extent,
                this._keys,
                this._values
              );
            });
        },
        { "./vectortilefeature.js": 140 }
      ],
      142: [
        function(require, module, exports) {
          arguments[4][133][0].apply(exports, arguments);
        },
        { dup: 133 }
      ],
      143: [
        function(require, module, exports) {
          var bundleFn = arguments[3],
            sources = arguments[4],
            cache = arguments[5],
            stringify = JSON.stringify;
          module.exports = function(r) {
            for (
              var e, t = Object.keys(cache), n = 0, o = t.length;
              o > n;
              n++
            ) {
              var a = t[n],
                i = cache[a].exports;
              if (i === r || i["default"] === r) {
                e = a;
                break;
              }
            }
            if (!e) {
              e = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
              for (var s = {}, n = 0, o = t.length; o > n; n++) {
                var a = t[n];
                s[a] = a;
              }
              sources[e] = [
                Function(["require", "module", "exports"], "(" + r + ")(self)"),
                s
              ];
            }
            var u = Math.floor(Math.pow(16, 8) * Math.random()).toString(16),
              f = {};
            (f[e] = e),
              (sources[u] = [
                Function(
                  ["require"],
                  "var f = require(" +
                    stringify(e) +
                    ");(f.default ? f.default : f)(self);"
                ),
                f
              ]);
            var c =
                "(" +
                bundleFn +
                ")({" +
                Object.keys(sources)
                  .map(function(r) {
                    return (
                      stringify(r) +
                      ":[" +
                      sources[r][0] +
                      "," +
                      stringify(sources[r][1]) +
                      "]"
                    );
                  })
                  .join(",") +
                "},{},[" +
                stringify(u) +
                "])",
              l =
                window.URL || window.webkitURL || window.mozURL || window.msURL;
            return new Worker(
              l.createObjectURL(new Blob([c], { type: "text/javascript" }))
            );
          };
        },
        {}
      ]
    },
    {},
    [14]
  )(14);
});

//# sourceMappingURL=mapbox-gl.js.map
