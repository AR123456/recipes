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
