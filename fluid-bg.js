/* fluid-bg.js — Interactive dark background: amber fluid pointer trail, animated film grain, custom square cursor.
 *
 * Plain JS, no dependencies, no external assets. WebGL2 → WebGL1 → static fallback.
 *
 * Usage (declarative):
 *   <div data-fluid-bg data-glow="152,99,0" data-grain="0.32"> ...your content... </div>
 *
 * Usage (programmatic):
 *   const bg = FluidBackground.mount(el, { baseColor:'#090703', glowRGB:[152,99,0], cursorColor:'#c8b89a', grainOpacity:0.32, className:'', cursorToggle:true });
 *   bg.setCursorMode('native');   // or 'custom' — also exposed as a built-in pill button (data-cursor-toggle="false" hides it)
 *   bg.destroy();
 *
 * The element's existing children become the interactive content layer above the canvas.
 */
(function (global) {
  'use strict';

  const DEFAULTS = {
    baseColor: '#090703',
    glowRGB: [152, 99, 0],
    cursorColor: '#c8b89a',
    grainOpacity: 0.32,
    className: '',
    simScale: 0.25,          // internal simulation resolution = CSS px * simScale
    dyeDecay: 0.988,         // per-frame at 60fps ("burn away")
    velDecay: 0.97,
    radius: 0.078,           // splat radius in normalized units (relative to height)
    cursorToggle: true,      // show the built-in custom/native cursor switch
    cursorMode: null,        // "custom" | "native" (null = remembered choice, default custom)
    labels: { custom: "مؤشر مخصص", native: "المؤشر العادي", title: "تبديل شكل المؤشر" },
  };

  /* ---------- styles (injected once) ---------- */
  const CSS = `
.fbg{position:relative;width:100%;height:100%;min-height:inherit;overflow:hidden;isolation:isolate;touch-action:pan-y}
.fbg--standalone{min-height:100svh}
.fbg__canvas{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;pointer-events:none}
.fbg__content{position:relative;z-index:1;min-height:inherit;height:100%}
.fbg__cursor{position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;z-index:2;pointer-events:none;opacity:0;
  background:var(--fbg-cursor,#c8b89a);border-radius:1px;will-change:transform,width,height,opacity;
  transition:width .22s cubic-bezier(.2,.9,.3,1.2),height .22s cubic-bezier(.2,.9,.3,1.2),margin .22s cubic-bezier(.2,.9,.3,1.2),opacity .18s ease}
.fbg__cursor.is-on{opacity:.95}
.fbg__cursor.is-hover{width:20px;height:20px;margin:-10px 0 0 -10px;opacity:.6}
@media (hover:hover) and (pointer:fine){.fbg.fbg--hascursor,.fbg.fbg--hascursor *{cursor:none!important}}
@media not all and (hover:hover){.fbg__cursor,.fbg__toggle{display:none}}
.fbg--native .fbg__cursor{display:none}
.fbg__toggle{position:absolute;z-index:3;bottom:16px;inset-inline-start:16px;display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px 0 10px;border-radius:999px;
  font:600 12.5px/1 system-ui,sans-serif;color:var(--fbg-cursor,#c8b89a);background:rgba(255,255,255,.05);border:1px solid rgba(200,184,154,.28);backdrop-filter:blur(6px);cursor:pointer;
  transition:background-color .2s ease,border-color .2s ease,transform .25s cubic-bezier(.2,.9,.3,1.3)}
.fbg__toggle:hover{background:rgba(255,255,255,.1);border-color:rgba(200,184,154,.5)}
.fbg__toggle:active{transform:scale(.97)}
.fbg__toggle:focus-visible{outline:2px solid var(--fbg-cursor,#c8b89a);outline-offset:3px}
.fbg__toggle i{width:9px;height:9px;background:currentColor;border-radius:1px;display:inline-block}
.fbg--native .fbg__toggle i{border-radius:50%}
`;
  let styleInjected = false;
  function injectStyles() {
    if (styleInjected || typeof document === 'undefined') return;
    const s = document.createElement('style'); s.setAttribute('data-fluid-bg-style', ''); s.textContent = CSS; document.head.appendChild(s); styleInjected = true;
  }

  /* ---------- shaders ---------- */
  const VERT = `
attribute vec2 aPos; varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  // velocity encoded to [0,1]: v = (e - 0.5) * 2 * VMAX ; dye encoded: d = e * DMAX
  const COMMON = `
precision highp float; varying vec2 vUv;
const float VMAX = 1.5; const float DMAX = 4.0;
vec2 decV(vec4 t){ return (t.xy - 0.5) * (2.0 * VMAX); }
vec4 encV(vec2 v){ return vec4(clamp(v / (2.0 * VMAX) + 0.5, 0.0, 1.0), 0.0, 1.0); }
float decD(vec4 t){ return t.r * DMAX; }
vec4 encD(float d){ return vec4(clamp(d / DMAX, 0.0, 1.0), 0.0, 0.0, 1.0); }`;

  // Splat along a capsule between p0 and p1 (aspect-corrected), adds to velocity or dye.
  const SPLAT = COMMON + `
uniform sampler2D uTex; uniform vec2 uP0, uP1; uniform float uRadius, uAspect; uniform vec2 uVel; uniform float uDye; uniform int uMode;
float segDist(vec2 p, vec2 a, vec2 b){ vec2 ab = b - a; float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0); return length(p - (a + ab * t)); }
void main(){
  vec2 p = vec2(vUv.x * uAspect, vUv.y); vec2 a = vec2(uP0.x * uAspect, uP0.y); vec2 b = vec2(uP1.x * uAspect, uP1.y);
  float d = segDist(p, a, b);
  float fall = exp(-(d * d) / (uRadius * uRadius));
  vec4 prev = texture2D(uTex, vUv);
  if (uMode == 0) { vec2 v = decV(prev) + uVel * fall; gl_FragColor = encV(v); }
  else { float d0 = decD(prev); float dy = d0 + uDye * fall * max(0.0, 1.0 - d0 / 2.2); gl_FragColor = encD(dy); }   // soft cap: overlapping strokes never blow out
}`;

  // Semi-Lagrangian advection with dissipation. For dye, a light 5-tap blur gives the smear.
  const ADVECT = COMMON + `
uniform sampler2D uVelTex, uSrc; uniform vec2 uTexel; uniform float uDt, uDissipation, uAspect; uniform int uMode;
void main(){
  vec2 v = decV(texture2D(uVelTex, vUv));
  vec2 back = vUv - uDt * vec2(v.x / uAspect, v.y);
  if (uMode == 0) {
    vec2 nv = decV(texture2D(uSrc, back)) * uDissipation;
    // kill quantisation residue so the field truly settles
    if (length(nv) < 0.004) nv = vec2(0.0);
    gl_FragColor = encV(nv);
  } else {
    float c = decD(texture2D(uSrc, back));
    float n = decD(texture2D(uSrc, back + vec2(uTexel.x, 0.0))) + decD(texture2D(uSrc, back - vec2(uTexel.x, 0.0)))
            + decD(texture2D(uSrc, back + vec2(0.0, uTexel.y))) + decD(texture2D(uSrc, back - vec2(0.0, uTexel.y)));
    float d = mix(c, n * 0.25, 0.35) * uDissipation;
    // drift upward like heat, very slightly
    gl_FragColor = encD(d);
  }
}`;

  // Final composite: smoky base shading + additive amber glow + animated film grain.
  const DISPLAY = COMMON + `
uniform sampler2D uDye; uniform vec3 uBase, uGlow; uniform float uGrain, uTime, uAspect; uniform vec2 uRes;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.7); a *= 0.5; } return s; }
void main(){
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  // slowly drifting smoke shading
  float sm = fbm(p * 2.2 + vec2(uTime * 0.018, -uTime * 0.011));
  float sm2 = fbm(p * 5.0 - vec2(uTime * 0.008, uTime * 0.014));
  float shade = 0.82 + 0.34 * sm + 0.12 * (sm2 - 0.5);
  vec3 col = uBase * shade;
  // vignette keeps edges grounded
  float vig = smoothstep(1.35, 0.35, length(vUv - 0.5) * 1.15);
  col *= 0.75 + 0.25 * vig;
  // amber glow: soft-knee additive so it never saturates to a flat orange
  float dye = decD(texture2D(uDye, vUv));
  float g = 1.0 - exp(-dye * 0.9);
  vec3 hot = vec3(1.0, 0.66, 0.14);                          // gold core near the pointer
  vec3 glow = mix(uGlow * 1.05, hot, pow(g, 2.6)) * g * 0.92;
  col += glow * (0.9 + 0.1 * sm2);
  // film grain, monochrome, per-frame
  float gr = hash(vUv * uRes + fract(uTime * 7.31) * 100.0) - 0.5;
  col += gr * uGrain * (0.22 + 1.1 * g);                     // ember grain lives inside the glow
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

  /* ---------- helpers ---------- */
  function hexToRgb01(hex) {
    const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  function compile(gl, type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const log = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error('Shader: ' + log); }
    return s;
  }
  function program(gl, fs) {
    const p = gl.createProgram(); gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Link: ' + gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p, u };
  }

  /* ---------- component ---------- */
  class FluidBackground {
    constructor(root, opts) {
      injectStyles();
      this.root = root; this.o = Object.assign({}, DEFAULTS, opts || {});
      this.destroyed = false; this.raf = 0; this.last = 0; this.time = 0;
      this.pointer = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, inside: false, moved: false, vx: 0, vy: 0 };
      this.cursor = { x: 0, y: 0, tx: 0, ty: 0, on: false };
      this.reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.fine = global.matchMedia && global.matchMedia('(hover:hover) and (pointer:fine)').matches;
      this._build(); this._gl(); this._bind(); this._resize(); this._loop = this._loop.bind(this); this.raf = requestAnimationFrame(this._loop);
    }

    _build() {
      const r = this.root; r.classList.add('fbg'); if (this.o.className) r.classList.add(...this.o.className.split(/\s+/).filter(Boolean));
      if (this.o.standalone) r.classList.add('fbg--standalone');
      r.style.setProperty('--fbg-cursor', this.o.cursorColor); r.style.background = this.o.baseColor;
      const content = document.createElement('div'); content.className = 'fbg__content';
      while (r.firstChild) content.appendChild(r.firstChild);
      this.canvas = document.createElement('canvas'); this.canvas.className = 'fbg__canvas'; this.canvas.setAttribute('aria-hidden', 'true');
      this.cursorEl = document.createElement('div'); this.cursorEl.className = 'fbg__cursor'; this.cursorEl.setAttribute('aria-hidden', 'true');
      r.appendChild(this.canvas); r.appendChild(content); r.appendChild(this.cursorEl); this.content = content;
      if (this.o.cursorToggle) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'fbg__toggle'; b.title = this.o.labels.title;
        b.innerHTML = '<i aria-hidden="true"></i><span></span>'; b.addEventListener('click', () => this.setCursorMode(this.cursorMode === 'custom' ? 'native' : 'custom'));
        r.appendChild(b); this.toggleEl = b;
      }
      let mode = this.o.cursorMode; if (!mode) { try { mode = localStorage.getItem('fbg-cursor-mode'); } catch {} }
      this.setCursorMode(mode === 'native' ? 'native' : 'custom', false);
    }

    /** Switch between the custom square cursor and the system cursor. */
    setCursorMode(mode, persist = true) {
      this.cursorMode = mode === 'native' ? 'native' : 'custom'; const custom = this.cursorMode === 'custom';
      this.root.classList.toggle('fbg--hascursor', custom && this.fine); this.root.classList.toggle('fbg--native', !custom);
      if (!custom) { this.cursor.on = false; this.cursorEl.classList.remove('is-on'); }
      if (this.toggleEl) { this.toggleEl.querySelector('span').textContent = custom ? this.o.labels.native : this.o.labels.custom; this.toggleEl.setAttribute('aria-pressed', String(custom)); this.toggleEl.setAttribute('aria-label', this.o.labels.title + ': ' + (custom ? this.o.labels.native : this.o.labels.custom)); }
      if (persist) { try { localStorage.setItem('fbg-cursor-mode', this.cursorMode); } catch {} }
      this.root.dispatchEvent(new CustomEvent('fbg:cursormode', { detail: { mode: this.cursorMode } }));
    }

    _gl() {
      const c = this.canvas;
      const attrs = { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' };
      let gl = c.getContext('webgl2', attrs); this.isGL2 = !!gl;
      if (!gl) gl = c.getContext('webgl', attrs) || c.getContext('experimental-webgl', attrs);
      this.gl = gl; if (!gl) { this._staticFallback(); return; }
      // float / half-float render targets when available; otherwise RGBA8 (encoded fields keep the same math)
      let type = gl.UNSIGNED_BYTE, internal = gl.RGBA;
      if (this.isGL2) {
        if (gl.getExtension('EXT_color_buffer_float')) { type = gl.HALF_FLOAT; internal = gl.RGBA16F; }
      } else {
        const hf = gl.getExtension('OES_texture_half_float'); gl.getExtension('OES_texture_half_float_linear');
        if (hf && gl.getExtension('EXT_color_buffer_half_float')) { type = hf.HALF_FLOAT_OES; }
      }
      this.texType = type; this.texInternal = internal;
      // quad
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); this.quad = buf;
      try { this.prSplat = program(gl, SPLAT); this.prAdvect = program(gl, ADVECT); this.prDisplay = program(gl, DISPLAY); }
      catch (e) { console.warn('[fluid-bg]', e.message); this.gl = null; this._staticFallback(); return; }
      gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    }

    _target(w, h) {
      const gl = this.gl; const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.texInternal, w, h, 0, gl.RGBA, this.texType, null);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tex, fb, w, h, ok };
    }
    _pingpong(w, h) {
      let a = this._target(w, h);
      if (!a.ok && this.texType !== this.gl.UNSIGNED_BYTE) { // smooth fallback to 8-bit if float attachments are not renderable
        this._free(a); this.texType = this.gl.UNSIGNED_BYTE; this.texInternal = this.gl.RGBA; a = this._target(w, h);
      }
      const b = this._target(w, h); return { read: a, write: b, swap() { const t = this.read; this.read = this.write; this.write = t; } };
    }
    _free(t) { if (!t) return; this.gl.deleteTexture(t.tex); this.gl.deleteFramebuffer(t.fb); }
    _clear(pp, r, g, b) { const gl = this.gl; for (const t of [pp.read, pp.write]) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb); gl.clearColor(r, g, b, 1); gl.clear(gl.COLOR_BUFFER_BIT); } }

    _resize() {
      const rect = this.root.getBoundingClientRect(); const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
      this.cssW = w; this.cssH = h; this.aspect = w / h;
      const dpr = Math.min(global.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
      if (!this.gl) return;
      const sw = Math.max(16, Math.round(w * this.o.simScale)), sh = Math.max(16, Math.round(h * this.o.simScale));
      if (this.vel) { this._free(this.vel.read); this._free(this.vel.write); this._free(this.dye.read); this._free(this.dye.write); }
      this.vel = this._pingpong(sw, sh); this.dye = this._pingpong(sw, sh);
      this._clear(this.vel, 0.5, 0.5, 0, 1); this._clear(this.dye, 0, 0, 0, 1);
      this.simW = sw; this.simH = sh;
    }

    _bind() {
      const r = this.root;
      this._onMove = (e) => {
        const rect = r.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width, y = 1 - (e.clientY - rect.top) / rect.height;
        const p = this.pointer;
        if (!p.inside) { p.px = x; p.py = y; p.inside = true; }
        p.x = x; p.y = y; p.moved = true;
        this.cursor.tx = e.clientX - rect.left; this.cursor.ty = e.clientY - rect.top;
        if (!this.cursor.on && e.pointerType !== 'touch' && this.cursorMode === 'custom') { this.cursor.on = true; this.cursor.x = this.cursor.tx; this.cursor.y = this.cursor.ty; this.cursorEl.classList.add('is-on'); }
      };
      this._onLeave = () => { this.pointer.inside = false; this.cursor.on = false; this.cursorEl.classList.remove('is-on'); };
      this._onOver = (e) => { const t = e.target.closest && e.target.closest('a,button,[data-cursor],input,select,textarea,[role="button"]'); this.cursorEl.classList.toggle('is-hover', !!t); };
      this._onVis = () => { if (document.hidden) { cancelAnimationFrame(this.raf); this.raf = 0; } else if (!this.raf && !this.destroyed) { this.last = 0; this.raf = requestAnimationFrame(this._loop); } };
      r.addEventListener('pointermove', this._onMove, { passive: true });
      r.addEventListener('pointerdown', this._onMove, { passive: true });
      r.addEventListener('pointerleave', this._onLeave);
      r.addEventListener('pointerover', this._onOver);
      document.addEventListener('visibilitychange', this._onVis);
      this.ro = new ResizeObserver(() => { if (!this.destroyed) this._resize(); }); this.ro.observe(r);
      this._mq = global.matchMedia ? global.matchMedia('(prefers-reduced-motion: reduce)') : null;
      this._onMq = (e) => { this.reduced = e.matches; };
      if (this._mq && this._mq.addEventListener) this._mq.addEventListener('change', this._onMq);
    }

    _staticFallback() {
      // No WebGL: layered radial gradients approximate the smoky base; grain via CSS noise is skipped to avoid assets.
      const b = this.o.baseColor;
      this.root.style.background = `radial-gradient(120% 80% at 70% 20%, rgba(152,99,0,.10), transparent 60%), radial-gradient(90% 70% at 20% 90%, rgba(255,255,255,.04), transparent 60%), ${b}`;
      this.canvas.remove();
    }

    _draw(pr, target) {
      const gl = this.gl; gl.useProgram(pr.p);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
      gl.viewport(0, 0, target ? target.w : this.canvas.width, target ? target.h : this.canvas.height);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad); const loc = gl.getAttribLocation(pr.p, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    _tex(unit, tex, loc) { const gl = this.gl; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(loc, unit); }

    _step(dt) {
      const gl = this.gl, p = this.pointer, o = this.o;
      const dtc = Math.min(dt, 1 / 30);
      // --- splats along the pointer path
      if (p.moved && p.inside && !this.reduced) {
        const dx = p.x - p.px, dy = p.y - p.py; const dist = Math.hypot(dx * this.aspect, dy);
        const speed = dist / Math.max(dtc, 1e-3);                              // uv/s
        const strength = Math.min(1, speed / 1.6);                            // faster → stronger
        const rad = o.radius * (0.75 + 0.6 * strength);
        const velAmt = 0.5 * strength + 0.08, dyeAmt = 0.32 + 0.9 * strength;
        // velocity
        let pr = this.prSplat; gl.useProgram(pr.p);
        this._tex(0, this.vel.read.tex, pr.u.uTex); gl.uniform2f(pr.u.uP0, p.px, p.py); gl.uniform2f(pr.u.uP1, p.x, p.y);
        gl.uniform1f(pr.u.uRadius, rad * 1.4); gl.uniform1f(pr.u.uAspect, this.aspect); gl.uniform1i(pr.u.uMode, 0);
        gl.uniform2f(pr.u.uVel, (dx * this.aspect) * velAmt * 7.0, dy * velAmt * 7.0); gl.uniform1f(pr.u.uDye, 0);
        this._draw(pr, this.vel.write); this.vel.swap();
        // dye
        gl.useProgram(pr.p); this._tex(0, this.dye.read.tex, pr.u.uTex); gl.uniform1i(pr.u.uMode, 1);
        gl.uniform1f(pr.u.uRadius, rad); gl.uniform1f(pr.u.uDye, dyeAmt * Math.min(1, 0.55 + dist * 5.0));
        this._draw(pr, this.dye.write); this.dye.swap();
        p.px = p.x; p.py = p.y; p.moved = false;
      } else if (p.moved) { p.px = p.x; p.py = p.y; p.moved = false; }
      // --- advect velocity then dye
      const f = dtc * 60; // frame-normalised decay
      let pr = this.prAdvect; gl.useProgram(pr.p);
      gl.uniform2f(pr.u.uTexel, 1 / this.simW, 1 / this.simH); gl.uniform1f(pr.u.uDt, dtc); gl.uniform1f(pr.u.uAspect, this.aspect);
      this._tex(0, this.vel.read.tex, pr.u.uVelTex); this._tex(1, this.vel.read.tex, pr.u.uSrc);
      gl.uniform1f(pr.u.uDissipation, Math.pow(o.velDecay, f)); gl.uniform1i(pr.u.uMode, 0);
      this._draw(pr, this.vel.write); this.vel.swap();
      gl.useProgram(pr.p); this._tex(0, this.vel.read.tex, pr.u.uVelTex); this._tex(1, this.dye.read.tex, pr.u.uSrc);
      gl.uniform1f(pr.u.uDissipation, Math.pow(o.dyeDecay, f)); gl.uniform1i(pr.u.uMode, 1);
      this._draw(pr, this.dye.write); this.dye.swap();
      // --- composite
      pr = this.prDisplay; gl.useProgram(pr.p);
      this._tex(0, this.dye.read.tex, pr.u.uDye);
      const base = hexToRgb01(o.baseColor), glow = o.glowRGB.map(v => v / 255);
      gl.uniform3f(pr.u.uBase, base[0], base[1], base[2]); gl.uniform3f(pr.u.uGlow, glow[0], glow[1], glow[2]);
      gl.uniform1f(pr.u.uGrain, o.grainOpacity); gl.uniform1f(pr.u.uTime, this.reduced ? 0 : this.time); gl.uniform1f(pr.u.uAspect, this.aspect);
      gl.uniform2f(pr.u.uRes, this.canvas.width, this.canvas.height);
      this._draw(pr, null);
    }

    _cursorStep(dt) {
      const c = this.cursor; if (!c.on) return;
      const k = this.reduced ? 1 : 1 - Math.pow(0.001, dt * 1.4);   // eased follow
      c.x += (c.tx - c.x) * k; c.y += (c.ty - c.y) * k;
      this.cursorEl.style.transform = `translate3d(${c.x}px,${c.y}px,0)`;
    }

    _loop(t) {
      if (this.destroyed) return;
      const dt = this.last ? Math.min((t - this.last) / 1000, 0.1) : 1 / 60; this.last = t; this.time += dt;
      if (this.gl) this._step(dt);
      this._cursorStep(dt);
      // when reduced motion is requested and nothing is moving, render lazily (one frame every ~1s keeps it static but responsive to resize)
      if (this.reduced && this.gl) { this.raf = 0; this._reducedTimer = setTimeout(() => { if (!this.destroyed) this.raf = requestAnimationFrame(this._loop); }, 1000); return; }
      this.raf = requestAnimationFrame(this._loop);
    }

    /* ----- public ----- */
    setOptions(partial) { Object.assign(this.o, partial || {}); if (partial && partial.cursorColor) this.root.style.setProperty('--fbg-cursor', partial.cursorColor); if (partial && partial.baseColor) this.root.style.background = partial.baseColor; }
    destroy() {
      if (this.destroyed) return; this.destroyed = true;
      cancelAnimationFrame(this.raf); clearTimeout(this._reducedTimer);
      const r = this.root;
      r.removeEventListener('pointermove', this._onMove); r.removeEventListener('pointerdown', this._onMove); r.removeEventListener('pointerleave', this._onLeave); r.removeEventListener('pointerover', this._onOver);
      document.removeEventListener('visibilitychange', this._onVis);
      if (this.ro) this.ro.disconnect(); if (this._mq && this._mq.removeEventListener) this._mq.removeEventListener('change', this._onMq);
      const gl = this.gl;
      if (gl) {
        for (const pp of [this.vel, this.dye]) if (pp) { this._free(pp.read); this._free(pp.write); }
        for (const pr of [this.prSplat, this.prAdvect, this.prDisplay]) if (pr) gl.deleteProgram(pr.p);
        gl.deleteBuffer(this.quad); const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      }
      // unwrap content back into root
      while (this.content.firstChild) r.appendChild(this.content.firstChild);
      this.content.remove(); this.canvas.remove(); this.cursorEl.remove(); if (this.toggleEl) this.toggleEl.remove();
      r.classList.remove('fbg', 'fbg--hascursor', 'fbg--standalone', 'fbg--native'); r.style.removeProperty('--fbg-cursor');
    }

    static mount(el, opts) { return new FluidBackground(el, opts); }
    static autoInit(scope) {
      const list = (scope || document).querySelectorAll('[data-fluid-bg]:not([data-fluid-ready])'); const out = [];
      list.forEach(el => {
        const d = el.dataset; const opts = {};
        if (d.base) opts.baseColor = d.base; if (d.glow) opts.glowRGB = d.glow.split(',').map(Number); if (d.cursor) opts.cursorColor = d.cursor;
        if (d.grain) opts.grainOpacity = parseFloat(d.grain); if (d.class) opts.className = d.class; if ('standalone' in d) opts.standalone = true; if (d.cursorToggle === 'false') opts.cursorToggle = false; if (d.cursorMode) opts.cursorMode = d.cursorMode;
        el.setAttribute('data-fluid-ready', ''); out.push(FluidBackground.mount(el, opts));
      });
      return out;
    }
  }

  global.FluidBackground = FluidBackground;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => FluidBackground.autoInit()); else FluidBackground.autoInit();
  }
})(typeof window !== 'undefined' ? window : this);
