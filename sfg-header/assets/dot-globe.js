/*
  Dotted WebGL globe, rebuilt from the iventions.com "produced" section
  (ProducedEarth: three.js points on an icosahedron, detail 64, masked by a
  land texture, OrbitControls with a fixed polar angle and auto-rotate).
  No library: plain WebGL1. Exposes window.DotGlobe(canvas, options).
*/
(function () {
  'use strict';

  // Icosahedron subdivided like THREE.PolyhedronGeometry(detail), projected to the unit sphere.
  function icosphere(detail) {
    var t = (1 + Math.sqrt(5)) / 2;
    var v = [-1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1];
    var f = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
      3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
    var out = [], seen = new Map(), cols = detail + 1;
    function V(i) { return [v[i * 3], v[i * 3 + 1], v[i * 3 + 2]]; }
    function lerp(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
    for (var n = 0; n < f.length; n += 3) {
      var a = V(f[n]), b = V(f[n + 1]), c = V(f[n + 2]);
      for (var i = 0; i <= cols; i++) {
        var aj = lerp(a, c, i / cols), bj = lerp(b, c, i / cols), rows = cols - i;
        for (var j = 0; j <= rows; j++) {
          var p = rows === 0 ? aj : lerp(aj, bj, j / rows);
          var l = Math.hypot(p[0], p[1], p[2]), x = p[0] / l, y = p[1] / l, z = p[2] / l;
          var key = Math.round(x * 1e5) + ',' + Math.round(y * 1e5) + ',' + Math.round(z * 1e5);
          if (seen.has(key)) continue;
          seen.set(key, 1);
          out.push(x, y, z);
        }
      }
    }
    return out;
  }

  // Same mapping as the original's xP(): lat/lng -> position on a sphere.
  function latLng(lat, lng, r) {
    var a = lat * Math.PI / 180, b = lng * Math.PI / 180;
    return [-r * Math.cos(a) * Math.cos(b), r * Math.sin(a), r * Math.cos(a) * Math.sin(b)];
  }

  function perspective(fov, aspect, near, far) {
    var f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  }
  function lookAt(e) { // target = origin, up = +Y
    var zx = e[0], zy = e[1], zz = e[2], zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl;
    var xx = zz, xy = 0, xz = -zx, xl = Math.hypot(xx, xz); xx /= xl; xz /= xl; // up x z
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1];
  }
  function mul(a, b) { // column-major a*b
    var o = new Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++)
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    return o;
  }
  function model(rx, ry, s, ty) { // THREE Euler XYZ: Rx * Ry, then scale, then translate
    var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    return [cy * s, sx * sy * s, -cx * sy * s, 0, 0, cx * s, sx * s, 0, sy * s, -sx * cy * s, cx * cy * s, 0, 0, ty, 0, 1];
  }
  function xform(m, p) {
    return [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
      m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14], m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15]];
  }

  var VS = 'attribute vec3 position;uniform mat4 mv;uniform mat4 proj;uniform float u_size;uniform float u_dpr;' +
    'varying float vOpacity;void main(){vec4 p=mv*vec4(position,1.);vOpacity=length(p.xyz)-.7;' +
    'gl_PointSize=u_size*(30.*vOpacity/-p.z)*u_dpr;gl_Position=proj*p;}';
  var FS = 'precision mediump float;uniform vec3 u_color;uniform float u_alpha;varying float vOpacity;' +
    'float circle(vec2 st,float r){vec2 d=st-vec2(.5);return 1.-smoothstep(.99*r,1.01*r,dot(d,d)*4.);}' +
    'void main(){float d=circle(gl_PointCoord.xy,.7);if(d<.5)discard;gl_FragColor=vec4(u_color,clamp(d*vOpacity,0.,1.)*u_alpha);}';

  function hex(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16) / 255, parseInt(c.slice(2, 4), 16) / 255, parseInt(c.slice(4, 6), 16) / 255]; }

  window.DotGlobe = function (canvas, o) {
    o = Object.assign({
      maskSrc: '', color: '#f2f2f2', alpha: 1, detail: 64, size: 0.125, scale: 2.8, offsetY: 0,
      distance: 9, fov: 40, polar: Math.PI / 2.8, start: { lat: 29.278913, lng: 31.267533 },
      autoRotateSpeed: 0.65, interactive: true, drag: true, parallax: true, markers: [], onFrame: null
    }, o || {});
    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) return null;

    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    var U = {}; ['mv', 'proj', 'u_size', 'u_dpr', 'u_color', 'u_alpha'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
    var aPos = gl.getAttribLocation(prog, 'position'), buf = gl.createBuffer(), count = 0;
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);

    // Keep only the points that land on the mask's dark (land) pixels: mask = 1 - step(0.4, r).
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      var x = c.getContext('2d'); x.drawImage(img, 0, 0);
      var d = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height;
      var all = icosphere(o.detail), keep = [];
      for (var i = 0; i < all.length; i += 3) {
        var X = all[i], Y = all[i + 1], Z = all[i + 2];
        var u = Math.atan2(Z, -X) / (2 * Math.PI) + 0.5;
        var v = 0.5 - Math.atan2(Y, Math.hypot(X, Z)) / Math.PI;
        var px = Math.min(W - 1, Math.floor(u * W)), py = Math.min(H - 1, Math.floor(v * H));
        if (d[(py * W + px) * 4] < 102) keep.push(X, Y, Z);
      }
      count = keep.length / 3;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(keep), gl.STATIC_DRAW);
    };
    img.src = o.maskSrc;

    var s0 = latLng(o.start.lat, o.start.lng, 1);
    var state = {
      theta: Math.atan2(s0[0], s0[2]), dTheta: 0, rx: 0, ry: 0,
      autoRotate: true, mouse: [0, 0], dpr: 1, w: 1, h: 1, cam: [0, 0, o.distance]
    };

    function resize() {
      var r = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = Math.max(1, r.width); state.h = Math.max(1, r.height);
      canvas.width = Math.round(state.w * state.dpr); canvas.height = Math.round(state.h * state.dpr);
    }

    if (o.interactive && o.drag) { // OrbitControls: horizontal drag only (polar angle is locked), damped
      var drag = null;
      canvas.style.touchAction = 'none';
      canvas.addEventListener('pointerdown', function (e) { drag = e.clientX; canvas.setPointerCapture(e.pointerId); });
      canvas.addEventListener('pointermove', function (e) {
        if (drag === null) return;
        state.dTheta -= 2 * Math.PI * (e.clientX - drag) / state.h; drag = e.clientX;
      });
      ['pointerup', 'pointercancel'].forEach(function (t) { canvas.addEventListener(t, function () { drag = null; }); });
    }
    if (o.parallax) window.addEventListener('pointermove', function (e) { state.mouse = [e.clientX, e.clientY]; }, { passive: true });

    var api = { state: state, resize: resize, running: true, markers: [],
      setColor: function (c) { o.color = c.trim() || o.color; } };

    function frame() {
      if (state.autoRotate && o.interactive) state.dTheta -= 2 * Math.PI / 60 / 60 * o.autoRotateSpeed;
      state.theta += state.dTheta * 0.05; state.dTheta *= 0.95;
      if (o.parallax) {
        state.rx += (2.5e-4 * state.mouse[1] - state.rx) * 0.05;
        state.ry += (-2.5e-4 * state.mouse[0] - state.ry) * 0.05;
      }
      var cam = o.interactive
        ? [o.distance * Math.sin(o.polar) * Math.sin(state.theta), o.distance * Math.cos(o.polar), o.distance * Math.sin(o.polar) * Math.cos(state.theta)]
        : [0, 0, o.distance];
      state.cam = cam;
      var view = lookAt(cam), M = model(state.rx, state.ry, o.scale, o.offsetY), mv = mul(view, M);
      var proj = perspective(o.fov * Math.PI / 180, state.w / state.h, 0.1, 1000);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (count) {
        gl.uniformMatrix4fv(U.mv, false, mv); gl.uniformMatrix4fv(U.proj, false, proj);
        gl.uniform1f(U.u_size, o.size); gl.uniform1f(U.u_dpr, state.dpr);
        gl.uniform3fv(U.u_color, hex(o.color)); gl.uniform1f(U.u_alpha, o.alpha);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0); gl.drawArrays(gl.POINTS, 0, count);
      }
      // Marker projection, like drei <Html distanceFactor={6}>: screen position, scale, front-facing test.
      var tanH = 2 * Math.tan(o.fov * Math.PI / 360);
      api.markers = o.markers.map(function (m) {
        var local = latLng(m.lat, m.lng, 1.025), w = xform(M, local), e = xform(mv, local), c = xform(proj, e);
        var sx = (c[0] / c[3] * 0.5 + 0.5) * state.w, sy = (-c[1] / c[3] * 0.5 + 0.5) * state.h;
        var dx = w[0] - cam[0], dy = w[1] - cam[1], dz = w[2] - cam[2], dl = Math.hypot(dx, dy, dz);
        var nl = Math.hypot(w[0], w[1], w[2]);
        var facing = (dx * w[0] + dy * w[1] + dz * w[2]) / (dl * nl) < -0.45;
        return { x: sx, y: sy, scale: 6 / (tanH * dl), front: facing };
      });
      if (o.onFrame) o.onFrame(api.markers);
    }
    function loop() { if (api.running) frame(); requestAnimationFrame(loop); }
    api.renderOnce = frame;
    resize(); window.addEventListener('resize', resize);
    requestAnimationFrame(loop);
    return api;
  };
})();
