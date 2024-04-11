var S = Object.defineProperty;
var $ = (r, e, t) => e in r ? S(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var m = (r, e, t) => ($(r, typeof e != "symbol" ? e + "" : e, t), t);
const b = { background: "#b8eba9", color: "#444", padding: "3px" }, D = { background: "#7cc28d", color: "#444", padding: "3px" }, w = { background: "#065205", color: "#bada55", padding: "3px", marginTop: "10px" };
function u(r) {
  return Object.entries(r).map(([e, t]) => `${e}: ${t}`).join("; ");
}
function I({ url: r, inlineScript: e, attributes: t }) {
  const s = document.createElement("script");
  return r && (s.src = r), e && (s.textContent = e), k(s, t), s;
}
function k(r, e) {
  e.forEach((t) => {
    const [s, o] = t.includes("=") ? t.split("=") : [t, !0];
    r.setAttribute(s, o === !0 ? "" : o.replace(/"/g, ""));
  });
}
function p(r, e) {
  let t;
  if (console.log("appendTo:", e), e === "head" || e === "body")
    t = document[e], console.log(`Appending to document.${e}`);
  else if (typeof e == "string") {
    if (t = document.querySelector(e), !t)
      throw console.error("No element matches the selector: " + e), new Error("No element matches the selector: " + e);
  } else
    e instanceof Element ? t = e : (t = document.head, console.log("Default append to head"));
  t.appendChild(r);
}
function O({ url: r, inlineStyle: e, attributes: t }) {
  let s;
  if (r)
    s = document.createElement("link"), s.rel = "stylesheet", s.href = r;
  else if (e)
    s = document.createElement("style"), s.textContent = e;
  else
    throw new Error('Either "url" or "inlineStyle" must be provided.');
  return k(s, t), s;
}
async function E({ url: r, apiKey: e, strategy: t }) {
  const s = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(r)}&key=${e}&strategy=${t}&category=performance&category=accessibility&category=seo&category=best-practices`, o = await fetch(s);
  if (!o.ok)
    throw new Error("Network response was not ok");
  return o.json();
}
async function A(r, e) {
  try {
    const [t, s] = await Promise.all([
      E({ url: r, apiKey: e, strategy: "mobile" }),
      E({ url: r, apiKey: e, strategy: "desktop" })
    ]);
    return {
      performance: {
        mobile: t.lighthouseResult.categories.performance.score * 100,
        desktop: s.lighthouseResult.categories.performance.score * 100
      },
      accessibility: {
        mobile: t.lighthouseResult.categories.accessibility.score * 100,
        desktop: s.lighthouseResult.categories.accessibility.score * 100
      },
      seo: {
        mobile: t.lighthouseResult.categories.seo.score * 100,
        desktop: s.lighthouseResult.categories.seo.score * 100
      },
      bestPractices: {
        mobile: t.lighthouseResult.categories["best-practices"].score * 100,
        desktop: s.lighthouseResult.categories["best-practices"].score * 100
      }
    };
  } catch (t) {
    throw console.error("There was a problem fetching PageSpeed scores:", t), t;
  }
}
function x() {
  let r = document.getElementById("pageSpeedResultDiv");
  return r || (r = document.createElement("div"), r.id = "pageSpeedResultDiv", r.style.position = "fixed", r.style.bottom = "0", r.style.left = "0", r.style.backgroundColor = "rgba(0, 0, 0, 0.9)", r.style.color = "white", r.style.padding = "10px", r.style.zIndex = "1000", r.style.fontSize = "12px", r.style.borderRadius = "0 10px 10px 0", document.body.appendChild(r)), r;
}
function C(r) {
  const e = x();
  e.innerHTML = r;
}
function L(r) {
  return r >= 90 ? "#0f0" : r >= 51 ? "#ff0" : "#f00";
}
function M(r, e) {
  const t = x(), s = (n, i) => {
    var d;
    const c = Math.round(((d = r[n]) == null ? void 0 : d[i]) ?? 0);
    return `<span style="color: ${L(c)};">${i.charAt(0).toUpperCase() + i.slice(1)} ${c}</span>`;
  }, o = `
        <strong>Boostify Report: ${e}</strong><br>
        <strong>Performance:</strong> ${s("performance", "desktop")} / ${s("performance", "mobile")}<br>
        <strong>Accessibility:</strong> ${s("accessibility", "desktop")} / ${s("accessibility", "mobile")}<br>
        <strong>Best Practices:</strong> ${s("bestPractices", "desktop")} / ${s("bestPractices", "mobile")}<br>
        <strong>SEO:</strong> ${s("seo", "desktop")} / ${s("seo", "mobile")}<br>`;
  t.innerHTML = o;
}
const v = (r) => r.map((e) => String.fromCharCode(e)).join(""), f = {
  brand: [66, 111, 111, 115, 116, 105, 102, 121, 74, 115],
  // BoostifyJs
  license_approved: [66, 111, 111, 115, 116, 105, 102, 121, 32, 76, 105, 99, 101, 110, 115, 101, 32, 65, 112, 112, 114, 111, 118, 101, 100],
  // Boostify License Approved
  license_declined: [66, 111, 111, 115, 116, 105, 102, 121, 32, 76, 105, 99, 101, 110, 115, 101, 32, 68, 101, 99, 108, 105, 110, 101, 100],
  // Boostify License Declined
  productId: [97, 77, 73, 73, 120, 85, 116, 67, 95, 79, 55, 108, 98, 106, 83, 70, 88, 72, 53, 101, 87, 81, 61, 61],
  APIvalidate: [104, 116, 116, 112, 115, 58, 47, 47, 97, 112, 105, 46, 103, 117, 109, 114, 111, 97, 100, 46, 99, 111, 109, 47, 118, 50, 47, 108, 105, 99, 101, 110, 115, 101, 115, 47, 118, 101, 114, 105, 102, 121],
  errorValidate: [69, 114, 114, 111, 114, 58]
}, a = {
  debugDefault: "Execution - On Page Load - Will load delay scripts with attribute",
  scriptLoaded: "Script loaded",
  scriptNotLoaded: "Script not loaded",
  events: {
    load: {
      positive: "All scripts were executed on load",
      negative: "Error executing scripts on load"
    },
    scroll: {
      positive: "All scripts were executed on scroll",
      negative: "Error executing scripts on scroll"
    },
    mousemove: {
      positive: "All scripts were executed on mousemove",
      negative: "Error executing scripts on mousemove"
    },
    touchstart: {
      positive: "All scripts were executed on touchstart",
      negative: "Error executing scripts on touchstart"
    }
  }
}, P = {
  debugDefault: "Boostify js - Execution on click event"
}, y = {
  debugDefault: "Boostify - Execution - On Scroll at",
  debugDefaultSecond: "from the top of the page"
}, g = {
  noElement: "ObserverEvent: Provided 'element' is neither a valid DOM element nor a NodeList.",
  noCallback: "ObserverEvent: Provided 'callback' is not a function.",
  noObserver: "ObserverEvent: No observer was found for the provided element."
};
class N {
  constructor(e) {
    m(this, "_handleScroll", () => {
      this.wereScriptsExecuted || (this.wereScriptsExecuted = !0, this.fire().then(() => {
        typeof this.callback == "function" && this.callback({ event: "scroll" }), this.debug && console.log(`%c ${a.events.scroll.positive}`, u(b));
      }).catch((e) => {
        this.debug && console.error(` ${a.events.scroll.negative}`, e);
      }));
    });
    m(this, "_mouseMove", () => {
      this.wereScriptsExecuted || (this.wereScriptsExecuted = !0, this.fire().then(() => {
        typeof this.callback == "function" && this.callback({ event: "mousemove" }), this.debug && console.log(`%c ${a.events.mousemove.positive}`, u(b));
      }).catch((e) => {
        this.debug && console.error(`${a.events.mousemove.negative}`, e);
      }));
    });
    m(this, "_touchStart", () => {
      this.wereScriptsExecuted || (this.wereScriptsExecuted = !0, this.fire().then(() => {
        typeof this.callback == "function" && this.callback({ event: "touchstart" }), this.debug && console.log(`%c ${a.events.touchstart.positive}`, u(b));
      }).catch((e) => {
        this.debug && console.error(`${a.events.touchstart.negative}`, e);
      }));
    });
    this.debug = e.debug, this.selector = "script[type='text/boostify']", this.wereScriptsExecuted = !1, this.maxTime = e.maxTime, this.eventsHandler = e.eventsHandler, this.callback = e.callback, this.init(), this.events();
  }
  init() {
    this.debug && console.log(`%c ${a.debugDefault}  ${this.selector} on ${this.eventsHandler} after ${this.maxTime}s`, u(b)), setTimeout(() => {
      this.wereScriptsExecuted || (this.wereScriptsExecuted = !0, this.fire().then(() => {
        typeof this.callback == "function" && this.callback({ event: "onload" }), this.debug && console.log(`%c ${a.events.load.positive} `, u(b));
      }).catch((e) => {
        this.debug && console.error(`${a.events.load.negative}`, e);
      }));
    }, this.maxTime);
  }
  events() {
    this.eventsHandler.forEach((e) => {
      e === "scroll" ? window.addEventListener("scroll", this._handleScroll) : e === "mousemove" ? window.addEventListener("mousemove", this._mouseMove) : e === "touchstart" && window.addEventListener("touchstart", this._touchStart);
    });
  }
  fire() {
    return new Promise((e, t) => {
      const s = document.querySelectorAll(this.selector);
      if (s.length === 0) {
        t(new Error("No scripts with script[type='text/boostify'] found."));
        return;
      }
      const o = Array.from(s);
      let n = 0;
      const i = (l) => {
        if (l.src) {
          const h = document.createElement("script");
          h.src = l.src, h.onload = () => {
            n++, this.debug && console.log(`${a.scriptLoaded} ${l.src}`), n === o.length && e();
          }, h.onerror = () => {
            t(new Error(`${a.scriptNotLoaded}${l.src}`));
          }, document.body.appendChild(h);
        } else
          try {
            const h = document.createElement("script");
            h.text = l.innerText, document.body.appendChild(h), n++, n === o.length && e();
          } catch (h) {
            t(h);
          }
      }, c = o.filter((l) => l.src), d = o.filter((l) => !l.src);
      if (c.forEach(i), c.length === 0)
        d.forEach(i);
      else {
        const l = setInterval(() => {
          n >= c.length && (clearInterval(l), d.forEach(i));
        }, 100);
      }
    });
  }
}
class R {
  constructor(e) {
    this.debug = e.debug, this.DOM = {
      element: e.element
    }, this.callback = e.callback, this.fireInit = this.fireInit.bind(this), this.init();
  }
  init() {
    this.DOM.element.addEventListener("click", this.fireInit);
  }
  fireInit(e) {
    e.preventDefault(), this.debug && console.log(`%c ${P.debugDefault} `, u(D)), typeof this.callback == "function" && this.callback({ event: "click" });
  }
  destroy() {
    this.DOM.element.removeEventListener("click", this.fireInit);
  }
}
class H {
  constructor(e) {
    m(this, "scrollHandler", () => {
      !this.wasScrollExecuted && window.scrollY >= this.distance && (this.wasScrollExecuted = !0, typeof this.callbackFn == "function" && this.callbackFn({ event: "scroll" }));
    });
    this.debug = e.debug, this.distance = e.distance, this.callbackFn = e.callback, this.name = e.name, this.wasScrollExecuted = !1, this.events();
  }
  events() {
    this.debug && console.log(`%c ${y.debugDefault} ${this.distance} ${y.debugDefaultSecond}`, u(w)), window.addEventListener("scroll", this.scrollHandler);
  }
  destroy() {
    window.removeEventListener("scroll", this.scrollHandler);
  }
}
class _ {
  constructor(e) {
    this.debug = e.debug, this.DOM = {
      element: e.element
    }, this.element = e.element, this.callback = e.callback, this.options = e.options, this.observers = [], this.events();
  }
  events() {
    NodeList.prototype.isPrototypeOf(this.element) ? this.element.forEach((e) => this.observeElement(e)) : this.element instanceof Element ? this.observeElement(this.element) : console.error(`${g.noElement}`);
  }
  observeElement(e) {
    const t = new IntersectionObserver((s, o) => {
      s.forEach((n) => {
        n.isIntersecting && (typeof this.callback == "function" ? this.callback(n, o) : console.error(`${g.noCallback}`));
      });
    }, this.options);
    t.observe(e), this.observers.push({ element: e, observer: t });
  }
  destroy(e) {
    const { element: t } = e, s = this.observers.findIndex((o) => o.element === t);
    s !== -1 ? (this.observers[s].observer.disconnect(), this.observers.splice(s, 1)) : console.error(`${g.noObserver}`);
  }
}
function T(r, e) {
  const t = "https://api.gumroad.com/v2/licenses/verify";
  return new Promise((s, o) => {
    const n = new FormData();
    n.append("product_id", r), n.append("license_key", e), fetch(t, {
      method: "POST",
      body: n
    }).then((i) => i.json()).then((i) => {
      s(i);
    }).catch((i) => {
      o(i);
    });
  });
}
class B {
  constructor(e) {
    if (!e || !e.license)
      throw new Error("License is required");
    this.productID = v(f.productId), this.license = e.license, this.debug = e.debug || !1, this.events = [], this.vl();
  }
  async vl() {
    try {
      var e = await T(this.productID, this.license);
      e.success ? this.debug && console.log(`%c${v(f.brand)} - ${v(f.license_approved)} `, u(w)) : (setTimeout(() => {
        this.destroyNoMatterWhat();
      }, 1200), this.wm());
    } catch (t) {
      console.error(v(f.errorValidate), t);
    }
  }
  /**
   * LOAD EVENT
  */
  onload(e) {
    this.onload = new N({
      debug: this.debug,
      maxTime: e.maxTime ? e.maxTime : 600,
      // max time to load
      selectors: e.selector !== void 0 ? e.selector : "type='text/boostify'",
      // selector to load
      eventsHandler: e.eventsHandler ? e.eventsHandler : ["mousemove", "load", "scroll", "touchstart"],
      // events to lisen on load
      callback: e.callback ? e.callback : null
    });
    var t = {
      instance: this.onload,
      type: "onload"
    };
    this.events.push(t);
  }
  // destroy on load is not needed
  /**
   * CLICK EVENT
  */
  click(e) {
    this.clickEvnt = new R({
      debug: this.debug,
      element: e.element ? e.element : document.querySelector(".js--click-boostify"),
      callback: e.callback ? e.callback : null
    });
    var t = {
      instance: this.clickEvnt,
      type: "click"
    };
    this.events.push(t);
  }
  destroyclick(e) {
    const t = e.element || document.querySelector(".js--click-boostify"), s = this.events.findIndex((o) => {
      var n, i;
      return ((i = (n = o.instance) == null ? void 0 : n.DOM) == null ? void 0 : i.element) === t && o.type === "click";
    });
    s !== -1 ? (this.events[s].instance.destroy(), this.events.splice(s, 1)) : console.log("Click event not found for element:", t);
  }
  /**
   * SCROLL EVENT
  */
  scroll(e) {
    const t = e.name || `scroll-${e.distance}`;
    this.scrollEvent = new H({
      debug: this.debug,
      distance: e.distance,
      callback: e.callback,
      name: t
      // Pass the name to the ScrollEvnt
    });
    var s = {
      name: t,
      // Use the unique eventName here
      instance: this.scrollEvent,
      type: "scroll"
    };
    this.events.push(s);
  }
  destroyscroll(e) {
    const t = e.name || `scroll-${e.distance}`, s = this.events.findIndex((o) => o.type === "scroll" && o.name === t);
    s !== -1 ? (this.events[s].instance.destroy(), this.events.splice(s, 1)) : console.warn("Scroll event not found for name:", t);
  }
  /**
   * OBSERVER EVENT
  */
  observer(e) {
    var t = e.element;
    if (!(t instanceof Element))
      throw new Error(`${f.brand}: Provided 'element' is not a valid DOM element.`);
    var s = {
      root: null,
      rootMargin: "0px",
      threshold: 0.01
    }, o = { ...s, ...e.options };
    this.observerEvent = new _({
      options: o,
      debug: this.debug,
      // debugger
      element: e.element ? e.element : document.querySelector(".js--observer-boostify"),
      callback: e.callback
    });
    var n = {
      instance: this.observerEvent,
      type: "observer",
      elements: e.element instanceof NodeList ? [...e.element] : [e.element]
    };
    this.events.push(n);
  }
  // bstf.refreshObserverEvents({element: document.querySelector('.classObserver')});
  refreshobserver({ element: e } = {}) {
    this.events.filter((s) => s.type === "observer" && (!e || s.elements.includes(e))).forEach((s) => {
      s.instance.observers.forEach((o) => {
        if (!e || o.element === e) {
          o.observer.disconnect();
          const n = s.instance.observers.indexOf(o);
          n > -1 && s.instance.observers.splice(n, 1), e && document.contains(e) && s.instance.observeElement(e);
        }
      }), e || (s.instance.observers = [], Array.isArray(s.elements) && s.elements.forEach((o) => {
        document.contains(o) && s.instance.observeElement(o);
      }));
    });
  }
  destroyobserver(e) {
    (e.element instanceof NodeList ? [...e.element] : [e.element]).forEach((s) => {
      const o = this.events.findIndex((n) => n.type === "observer" && Array.isArray(n.elements) && n.elements.includes(s));
      o !== -1 ? (this.events[o].instance.destroy({ element: s }), this.events[o].instance.observers.length === 0 && this.events.splice(o, 1)) : console.warn("Observer event not found for element:", s);
    });
  }
  videoPlayer(e) {
    const { url: { ogg: t, mp4: s }, attributes: o, appendTo: n, style: i } = e, c = document.createElement("video");
    c.style.width = "100%", c.style.height = i && i.height ? i.height : "auto", i && Object.keys(i).forEach((l) => {
      c.style[l] = i[l];
    });
    for (let l in o)
      l === "class" ? c.className = o[l] : ["loop", "muted", "controls", "autoplay"].includes(l) ? c[l] = o[l] : c.setAttribute(l, o[l]);
    if (t) {
      const l = document.createElement("source");
      l.setAttribute("src", t), l.setAttribute("type", "video/ogg"), c.appendChild(l);
    }
    if (s) {
      const l = document.createElement("source");
      l.setAttribute("src", s), l.setAttribute("type", "video/mp4"), c.appendChild(l);
    }
    let d;
    if (typeof n == "string" ? d = document.getElementById(n) || document.querySelector(n) : n instanceof Element && (d = n), !d)
      throw new Error("Append target not found.");
    d.appendChild(c);
  }
  videoEmbed({ url: e, autoplay: t = !1, appendTo: s, style: o }) {
    const n = document.createElement("iframe");
    n.setAttribute("frameborder", "0"), n.setAttribute("allowfullscreen", ""), n.style.width = "100%", n.style.height = o && o.height ? o.height : "100%", o && Object.keys(o).forEach((c) => {
      n.style[c] = o[c];
    }), t && (e += `${e.includes("?") ? "&" : "?"}autoplay=1`, e.includes("youtube.com") || e.includes("youtu.be") ? e += "&mute=1" : e.includes("vimeo.com") && (e += "&muted=1")), n.src = e;
    let i;
    if (typeof s == "string" ? i = document.getElementById(s) || document.querySelector(s) : s instanceof Element && (i = s), !i) {
      console.error("Append target not found.");
      return;
    }
    i.innerHTML = "", i.appendChild(n);
  }
  async loadScript({ url: e = "", attributes: t = [], appendTo: s = "head", inlineScript: o = "" }) {
    return new Promise((n, i) => {
      if (!e && !o) {
        i(new Error('Either "url" or "inlineScript" must be provided.'));
        return;
      }
      try {
        const c = I({ url: e, inlineScript: o, attributes: t });
        c.onload = () => {
          this.debug && console.log(`${e} script loaded successfully`), n();
        }, c.onerror = () => i(new Error(`Script load error for ${e}`)), p(c, s), o && !e && n();
      } catch (c) {
        i(c);
      }
    });
  }
  async loadStyle({ url: e = "", attributes: t = [], appendTo: s = "head", inlineStyle: o = "" }) {
    return new Promise((n, i) => {
      try {
        const c = O({ url: e, inlineStyle: o, attributes: t });
        c.onload = () => {
          this.debug && console.log(`${e} stylesheet loaded successfully`), n();
        }, c.onerror = () => i(new Error(`Stylesheet load error for ${e}`)), p(c, s), (o || !e) && n();
      } catch (c) {
        i(c);
      }
    });
  }
  async scores(e) {
    const { url: t, apiKey: s, showOnPage: o } = e;
    if (!t)
      throw new Error("URL is required");
    if (!s)
      throw new Error("API key is required");
    try {
      o && C(`Boostify Loading data from ${t}`);
      const n = await A(t, s);
      return o && M(n, t), n;
    } catch (n) {
      throw console.error("There was a problem within BSTF scores method:", n), n;
    }
  }
  destroyNoMatterWhat() {
    console.log("destroyNoMatterWhat");
    for (let e = 0; e < this.events.length; e++) {
      let t = this.events[e];
      t.type === "click" && this.clickEvnt.destroy({ element: t.instance.DOM.element }), t.type === "scroll" && this.scrollEvent.destroy({ distance: t.instance.distance }), t.type === "observer" && (console.log("destroy observer"), this.observerEvent.destroy({ element: t.instance.element }));
    }
  }
  wm() {
    var e = document.createElement("div");
    e.className = f.brand;
    var t = document.createElement("h2");
    t.textContent = f.brand;
    function s() {
      Object.assign(e.style, {
        position: "fixed",
        right: "10px",
        padding: "5px",
        bottom: "10px",
        background: "grey",
        zIndex: "1000"
      }), t.style.fontSize = "11px";
    }
    s(), e.appendChild(t), document.body.appendChild(e), setInterval(s, 1e3);
  }
}
export {
  B as default
};
