/**
 * Combined by jsDelivr.
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
(function(t, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define(n)
    : (t.versor = n());
})(this, function() {
  "use strict";
  var c = Math.acos,
    n = Math.asin,
    e = Math.atan2,
    s = Math.cos,
    h = Math.max,
    d = Math.min,
    t = Math.PI,
    M = Math.sin,
    l = Math.sqrt,
    m = t / 180,
    r = 180 / t,
    a = function(t) {
      var n = (t[0] / 2) * m,
        e = M(n),
        r = s(n),
        a = (t[1] / 2) * m,
        i = M(a),
        o = s(a),
        u = (t[2] / 2) * m,
        f = M(u),
        c = s(u);
      return [
        r * o * c + e * i * f,
        e * o * c - r * i * f,
        r * i * c + e * o * f,
        r * o * f - e * i * c
      ];
    };
  function p(t, n) {
    return t[0] * n[0] + t[1] * n[1] + t[2] * n[2];
  }
  return (
    (a.cartesian = function(t) {
      var n = t[0] * m,
        e = t[1] * m,
        r = s(e);
      return [r * s(n), r * M(n), M(e)];
    }),
    (a.rotation = function(t) {
      return [
        e(
          2 * (t[0] * t[1] + t[2] * t[3]),
          1 - 2 * (t[1] * t[1] + t[2] * t[2])
        ) * r,
        n(h(-1, d(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * r,
        e(
          2 * (t[0] * t[3] + t[1] * t[2]),
          1 - 2 * (t[2] * t[2] + t[3] * t[3])
        ) * r
      ];
    }),
    (a.delta = function(t, n, e) {
      2 == arguments.length && (e = 1);
      var r,
        a,
        i = ((a = n),
        [
          (r = t)[1] * a[2] - r[2] * a[1],
          r[2] * a[0] - r[0] * a[2],
          r[0] * a[1] - r[1] * a[0]
        ]),
        o = l(p(i, i));
      if (!o) return [1, 0, 0, 0];
      var u = (e * c(h(-1, d(1, p(t, n))))) / 2,
        f = M(u);
      return [s(u), (i[2] / o) * f, (-i[1] / o) * f, (i[0] / o) * f];
    }),
    (a.multiply = function(t, n) {
      return [
        t[0] * n[0] - t[1] * n[1] - t[2] * n[2] - t[3] * n[3],
        t[0] * n[1] + t[1] * n[0] + t[2] * n[3] - t[3] * n[2],
        t[0] * n[2] - t[1] * n[3] + t[2] * n[0] + t[3] * n[1],
        t[0] * n[3] + t[1] * n[2] - t[2] * n[1] + t[3] * n[0]
      ];
    }),
    a
  );
});

(function(t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(
        exports,
        require("d3-drag"),
        require("d3-selection"),
        require("d3-timer"),
        require("versor")
      )
    : "function" == typeof define && define.amd
    ? define(["exports", "d3-drag", "d3-selection", "d3-timer", "versor"], e)
    : e((t.d3 = t.d3 || {}), t.d3, t.d3, t.d3, t.versor);
})(this, function(t, e, i, r, n) {
  "use strict";
  function o(t) {
    var e,
      i,
      r,
      o,
      s,
      d,
      c = t.projection,
      m = a({
        start: function() {
          (e = n.cartesian(c.invert(m.position))),
            (i = c.rotate()),
            (r = n(i)),
            t.start && t.start();
        },
        move: function() {
          var o = c.rotate(i).invert(m.position);
          if (!isNaN(o[0])) {
            var a = n.cartesian(o),
              s = n.multiply(r, n.delta(e, a)),
              d = n.rotation(s);
            t.render(d), t.move && t.move();
          }
        },
        end: function() {
          (o = n.cartesian(
            c.invert(
              m.position.map(function(t, e) {
                return t - m.velocity[e] / 1e3;
              })
            )
          )),
            (d = n(c.rotate())),
            (s = n.cartesian(c.invert(m.position))),
            t.end && t.end();
        },
        render: function(e) {
          var i = n.rotation(n.multiply(d, n.delta(o, s, 1e3 * e)));
          t.render && t.render(i);
        },
        time: t.time
      });
    return m;
  }
  function a(t) {
    var e = t.time || 5e3,
      n = -Math.log(1 - 1 / 1.0001),
      o = {
        start: function() {
          var e = i.mouse(this);
          (o.position = e),
            (o.velocity = [0, 0]),
            o.timer.stop(),
            this.classList.remove("inertia"),
            this.classList.add("dragging"),
            t.start && t.start.call(this, e);
        },
        move: function() {
          var e = i.mouse(this),
            r = performance.now(),
            n = r - o.time,
            a = 1 - Math.exp(-n / 1e3);
          (o.velocity = o.velocity.map(function(t, i) {
            var n = e[i] - o.position[i],
              s = r - o.time;
            return (1e3 * (1 - a) * n) / s + t * a;
          })),
            (o.time = r),
            (o.position = e),
            t.move && t.move.call(this, e);
        },
        end: function() {
          var i = o.velocity;
          if (i[0] * i[0] + i[1] * i[1] < 100)
            return o.timer.stop(), this.classList.remove("inertia");
          this.classList.remove("dragging"),
            this.classList.add("inertia"),
            t.end && t.end();
          var r = this;
          o.timer.restart(function(i) {
            (o.t = 1.0001 * (1 - Math.exp((-n * i) / e))),
              t.render && t.render(o.t),
              o.t > 1 &&
                (o.timer.stop(),
                r.classList.remove("inertia"),
                (o.velocity = [0, 0]),
                (o.t = 1));
          });
        },
        position: [0, 0],
        velocity: [0, 0],
        timer: r.timer(function() {}),
        time: 0
      };
    return o.timer.stop(), o;
  }
  (n = n && n.hasOwnProperty("default") ? n.default : n),
    (t.geoInertiaDragHelper = o),
    (t.geoInertiaDrag = function(t, i, r, n) {
      r || "function" != typeof projection || (r = projection), n || (n = {});
      var a = o({
        projection: r,
        render: function(t) {
          r.rotate(t), i && i();
        },
        start: n.start,
        move: n.move,
        end: n.end,
        time: n.time
      });
      return (
        t.call(
          e
            .drag()
            .on("start", a.start)
            .on("drag", a.move)
            .on("end", a.end)
        ),
        a
      );
    }),
    (t.inertia = a),
    Object.defineProperty(t, "__esModule", { value: !0 });
});
//# sourceMappingURL=/sm/87dfbe014dc569fce88c9fe1ae1f6c1703083bf69d6172edc560e4315871603c.map
