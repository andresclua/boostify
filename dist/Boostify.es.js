const E = { background: "#065205", color: "#bada55", padding: "3px", marginTop: "10px" };
function p(a) {
  return Object.entries(a).map(([e, t]) => `${e}: ${t}`).join("; ");
}
function w({ url: a, inlineScript: e, attributes: t = [] }) {
  const s = document.createElement("script");
  return a && (s.src = a), e && (s.textContent = e), y(s, t), s;
}
function y(a, e) {
  e.forEach((t) => {
    const [s, i] = t.includes("=") ? t.split("=") : [t, !0];
    a.setAttribute(s, i === !0 ? "" : i.replace(/"/g, ""));
  });
}
function v(a, e) {
  let t;
  if (e === "head" || e === "body")
    t = document[e];
  else if (typeof e == "string") {
    if (t = document.querySelector(e), !t)
      throw console.error("No element matches the selector: " + e), new Error("No element matches the selector: " + e);
  } else
    e instanceof Element ? t = e : t = document.head;
  t.appendChild(a);
}
function k({ url: a, inlineStyle: e, attributes: t = [] }) {
  let s;
  if (a)
    s = document.createElement("link"), s.rel = "stylesheet", s.href = a;
  else if (e)
    s = document.createElement("style"), s.textContent = e;
  else
    throw new Error('Either "url" or "inlineStyle" must be provided.');
  return y(s, t), s;
}
const m = {
  brand: "BoostifyJs",
  license_approved: "Boostify License Approved",
  license_declined: "Boostify License Declined",
  productId: "aMIIxUtC_O7lbjSFXH5eWQ==",
  APIvalidate: "https://api.gumroad.com/v2/licenses/verify",
  errorValidate: "Error: while validing the license"
}, u = {
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
}, x = {
  debugDefault: "Boostify js - Execution on click event"
}, b = {
  debugDefault: "Boostify - Execution - On Scroll at",
  debugDefaultSecond: "from the top of the page"
}, g = {
  noElement: "ObserverEvent: Provided 'element' is neither a valid DOM element nor a NodeList.",
  noCallback: "ObserverEvent: Provided 'callback' is not a function.",
  noObserver: "ObserverEvent: No observer was found for the provided element."
};
class l {
  /**
   * Handle an error with consistent logging
   * @param {String} context - The context where the error occurred
   * @param {String} message - Error message
   * @param {Error} error - Error object
   * @param {Boolean} debug - Whether to show additional debug info
   * @returns {Error} - The error object
   */
  static handleError(e, t, s, i = !1) {
    return console.error(`[${e}] ${t}`, s), i && console.error(`[${e}] Stack trace:`, s.stack), s;
  }
  /**
   * Throw a new error with consistent formatting
   * @param {String} context - The context where the error occurred
   * @param {String} message - Error message
   * @throws {Error}
   */
  static throwError(e, t) {
    const s = new Error(`[${e}] ${t}`);
    throw console.error(s), s;
  }
  /**
   * Assert that a condition is true, throw an error if not
   * @param {Boolean} condition - Condition to check
   * @param {String} context - The context where the assertion is made
   * @param {String} message - Error message if assertion fails
   * @throws {Error} - If condition is false
   */
  static assertCondition(e, t, s) {
    e || this.throwError(t, s);
  }
}
class f {
  constructor(e) {
    this.debug = e.debug || !1, this.callbackFn = e.callback || null, this.type = this.constructor.name, this.init();
  }
  /**
   * Initialization method that child classes can override
   */
  init() {
    this.debug && this.logDebug(`${this.type} initialized`);
  }
  /**
   * Execute callback with context
   * @param {Object} eventData - Data to pass to the callback
   * @returns {Boolean} - Whether the callback was executed
   */
  executeCallback(e) {
    return typeof this.callbackFn == "function" ? (this.callbackFn(e), !0) : !1;
  }
  /**
   * Log debug message if debug mode is enabled
   * @param {String} message - Message to log
   */
  logDebug(e) {
    this.debug && console.log(`%c${e}`, this.getDebugStyle());
  }
  /**
   * Log error message
   * @param {String} message - Error message
   * @param {Error} error - Error object
   */
  logError(e, t) {
    console.error(`${e}`, t);
  }
  /**
   * Get debug style for console logging
   * Child classes should override this to provide their own styling
   * @returns {String} - CSS style string
   */
  getDebugStyle() {
    return "background: #333; color: #fff; padding: 3px;";
  }
  /**
   * Base destroy method that child classes must implement
   * Used for cleanup (removing event listeners, etc.)
   */
  destroy() {
    this.logDebug(`${this.type} destroyed`);
  }
}
class S extends f {
  constructor(e) {
    super(e), this.selector = e.selector || "script[type='text/boostify']", this.wereScriptsExecuted = !1, this.maxTime = e.maxTime || 600, this.eventsHandler = e.eventsHandler || ["mousemove", "load", "scroll", "touchstart"], this._handleScroll = this._handleScroll.bind(this), this._mouseMove = this._mouseMove.bind(this), this._touchStart = this._touchStart.bind(this), this.setupTimeout(), this.setupEvents();
  }
  init() {
    this.logDebug(`${u.debugDefault} ${this.selector} on ${this.eventsHandler} after ${this.maxTime}s`);
  }
  getDebugStyle() {
    return "background: #b8eba9; color: #444; padding: 3px;";
  }
  setupTimeout() {
    this.timeoutId = setTimeout(() => {
      this.wereScriptsExecuted || (this.wereScriptsExecuted = !0, this.fire().then(() => {
        this.executeCallback({ event: "onload" }), this.logDebug(u.events.load.positive);
      }).catch((e) => {
        this.logError(u.events.load.negative, e);
      }));
    }, this.maxTime);
  }
  setupEvents() {
    this.eventsHandler.forEach((e) => {
      e === "scroll" ? window.addEventListener("scroll", this._handleScroll) : e === "mousemove" ? window.addEventListener("mousemove", this._mouseMove) : e === "touchstart" && window.addEventListener("touchstart", this._touchStart);
    });
  }
  _handleScroll() {
    this.triggerLoad("scroll", u.events.scroll);
  }
  _mouseMove() {
    this.triggerLoad("mousemove", u.events.mousemove);
  }
  _touchStart() {
    this.triggerLoad("touchstart", u.events.touchstart);
  }
  triggerLoad(e, t) {
    this.wereScriptsExecuted || (this.wereScriptsExecuted = !0, this.fire().then(() => {
      this.executeCallback({ event: e }), this.logDebug(t.positive);
    }).catch((s) => {
      this.logError(t.negative, s);
    }));
  }
  fire() {
    return new Promise((e, t) => {
      const s = document.querySelectorAll(this.selector);
      if (s.length === 0) {
        l.throwError("OnLoad.fire", `No scripts with ${this.selector} found.`);
        return;
      }
      const i = Array.from(s);
      let r = 0;
      const o = (c) => {
        if (c.src) {
          const h = document.createElement("script");
          h.src = c.src, h.onload = () => {
            r++, this.logDebug(`${u.scriptLoaded} ${c.src}`), r === i.length && e();
          }, h.onerror = () => {
            t(new Error(`${u.scriptNotLoaded}${c.src}`));
          }, document.body.appendChild(h);
        } else
          try {
            const h = document.createElement("script");
            h.text = c.innerText, document.body.appendChild(h), r++, r === i.length && e();
          } catch (h) {
            t(h);
          }
      }, n = i.filter((c) => c.src), d = i.filter((c) => !c.src);
      n.forEach(o), n.length === 0 ? d.forEach(o) : this.externalScriptsCheckIntervalId = setInterval(() => {
        r >= n.length && (clearInterval(this.externalScriptsCheckIntervalId), d.forEach(o));
      }, 100);
    });
  }
  destroy() {
    this.timeoutId && clearTimeout(this.timeoutId), this.externalScriptsCheckIntervalId && clearInterval(this.externalScriptsCheckIntervalId), this.eventsHandler.forEach((e) => {
      e === "scroll" ? window.removeEventListener("scroll", this._handleScroll) : e === "mousemove" ? window.removeEventListener("mousemove", this._mouseMove) : e === "touchstart" && window.removeEventListener("touchstart", this._touchStart);
    }), super.destroy();
  }
}
class I extends f {
  constructor(e) {
    super(e), l.assertCondition(
      e.element instanceof Element,
      "ClickEvnt",
      "Element is required and must be a valid DOM element"
    ), this.element = e.element, this.clickHandler = this.clickHandler.bind(this), this.element.addEventListener("click", this.clickHandler);
  }
  init() {
    this.logDebug(x.debugDefault);
  }
  getDebugStyle() {
    return "background: #7cc28d; color: #444; padding: 3px;";
  }
  clickHandler(e) {
    e.preventDefault(), this.executeCallback({
      event: "click",
      element: this.element
    });
  }
  destroy() {
    this.element.removeEventListener("click", this.clickHandler), super.destroy();
  }
}
class C extends f {
  constructor(e) {
    super(e), this.distance = e.distance, this.name = e.name || `scroll-${this.distance}`, this.wasScrollExecuted = !1, this.scrollHandler = this.scrollHandler.bind(this), window.addEventListener("scroll", this.scrollHandler);
  }
  init() {
    this.logDebug(`${b.debugDefault} ${this.distance} ${b.debugDefaultSecond}`);
  }
  getDebugStyle() {
    return "background: #065205; color: #bada55; padding: 3px; marginTop: 10px;";
  }
  scrollHandler() {
    !this.wasScrollExecuted && window.scrollY >= this.distance && (this.wasScrollExecuted = !0, this.executeCallback({
      event: "scroll",
      distance: this.distance,
      name: this.name
    }));
  }
  destroy() {
    window.removeEventListener("scroll", this.scrollHandler), super.destroy();
  }
}
class D extends f {
  constructor(e) {
    super(e), l.assertCondition(
      e.element instanceof Element || NodeList.prototype.isPrototypeOf(e.element),
      "ObserverEvent",
      "Element is required and must be a valid DOM element or NodeList"
    ), this.element = e.element, this.options = e.options || {
      root: null,
      rootMargin: "0px",
      threshold: 0.01
    }, this.observers = [], this.setupObservers();
  }
  init() {
    this.logDebug("Observer initialized");
  }
  getDebugStyle() {
    return "background: #444444; color: #bada55; padding: 3px; marginTop: 10px;";
  }
  setupObservers() {
    NodeList.prototype.isPrototypeOf(this.element) ? this.element.forEach((e) => this.observeElement(e)) : this.element instanceof Element ? this.observeElement(this.element) : this.logError(g.noElement);
  }
  observeElement(e) {
    const t = new IntersectionObserver((s, i) => {
      s.forEach((r) => {
        r.isIntersecting && this.executeCallback(r, i);
      });
    }, this.options);
    t.observe(e), this.observers.push({ element: e, observer: t }), this.logDebug(`Observing element: ${e.tagName}${e.id ? "#" + e.id : ""}`);
  }
  destroy(e) {
    if (e && e.element) {
      const t = e.element, s = this.observers.findIndex((i) => i.element === t);
      s !== -1 ? (this.observers[s].observer.disconnect(), this.observers.splice(s, 1), this.logDebug(`Observer for element ${t.tagName}${t.id ? "#" + t.id : ""} destroyed`)) : this.logError(g.noObserver);
    } else
      this.observers.forEach((t) => {
        t.observer.disconnect(), this.logDebug(`Observer for element ${t.element.tagName}${t.element.id ? "#" + t.element.id : ""} destroyed`);
      }), this.observers = [];
    super.destroy();
  }
}
class $ {
  constructor({ idleTime: e = 3e3, events: t = ["mousemove", "scroll", "keydown"], callback: s, debug: i = !1 }) {
    this.idleTime = e, this.events = t, this.callback = s, this.debug = i, this.lastActivityTime = Date.now(), this.checkingInactivity = !1, this.boundResetIdleTimer = this.resetIdleTimer.bind(this), this.init();
  }
  init() {
    this.events.forEach((e) => {
      window.addEventListener(e, this.boundResetIdleTimer);
    }), this.startChecking(), this.debug && console.log("Inactivity event initialized with idle time:", this.idleTime);
  }
  resetIdleTimer() {
    this.lastActivityTime = Date.now(), this.debug && console.log("Activity detected, timer reset");
  }
  startChecking() {
    this.checkingInactivity = !0, this.checkIdleState();
  }
  checkIdleState() {
    if (!this.checkingInactivity)
      return;
    const t = Date.now() - this.lastActivityTime;
    t >= this.idleTime && (this.debug && console.log("Idle state detected after", t, "ms"), this.callback(), this.lastActivityTime = Date.now()), "requestIdleCallback" in window ? requestIdleCallback(() => this.checkIdleState()) : setTimeout(() => this.checkIdleState(), 1e3);
  }
  destroy() {
    this.checkingInactivity = !1, this.events.forEach((e) => {
      window.removeEventListener(e, this.boundResetIdleTimer);
    }), this.debug && console.log("Inactivity event destroyed");
  }
}
function L(a, e) {
  const t = "https://api.gumroad.com/v2/licenses/verify";
  return new Promise((s, i) => {
    const r = new FormData();
    r.append("product_id", a), r.append("license_key", e), fetch(t, {
      method: "POST",
      body: r
    }).then((o) => o.json()).then((o) => {
      s(o);
    }).catch((o) => {
      i(o);
    });
  });
}
class B {
  constructor(e) {
    l.assertCondition(
      e && e.license,
      "Boostify",
      "License is required"
    ), this.productID = "aMIIxUtC_O7lbjSFXH5eWQ==", this.license = e.license, this.debug = e.debug || !1, this.events = [], this.init();
  }
  /**
   * Initialize Boostify and validate license
   */
  async init() {
    try {
      (await L(this.productID, this.license)).success ? this.debug && console.log(
        `%c${m.brand} - ${m.license_approved}`,
        p(E)
      ) : (setTimeout(() => this.destroyNoMatterWhat(), 1200), this.wm());
    } catch (e) {
      l.handleError("Boostify.init", m.errorValidate, e, this.debug);
    }
  }
  /**
   * Register an event in the events array
   * @param {String} type - Event type
   * @param {Object} instance - Event instance
   * @param {Object} metadata - Additional metadata
   * @returns {Object} - The registered event object
   */
  registerEvent(e, t, s = {}) {
    const i = {
      type: e,
      instance: t,
      ...s
    };
    return this.events.push(i), i;
  }
  /**
   * Create a load event
   * @param {Object} payload - Configuration options
   * @returns {OnLoad} - The created OnLoad instance
   */
  onload(e = {}) {
    const t = new S({
      debug: this.debug,
      maxTime: e.maxTime || 600,
      selector: e.selector || "script[type='text/boostify']",
      eventsHandler: e.eventsHandler || ["mousemove", "load", "scroll", "touchstart"],
      callback: e.callback || null
    });
    return this.registerEvent("onload", t), t;
  }
  /**
   * Create a click event
   * @param {Object} payload - Configuration options
   * @returns {ClickEvnt} - The created ClickEvnt instance
   */
  click(e = {}) {
    const t = e.element || document.querySelector(".js--click-boostify");
    l.assertCondition(
      t instanceof Element,
      "Boostify.click",
      "Element is required and must be a valid DOM element"
    );
    const s = new I({
      debug: this.debug,
      element: t,
      callback: e.callback || null
    });
    return this.registerEvent("click", s), s;
  }
  /**
   * Destroy a click event
   * @param {Object} payload - Configuration options
   * @returns {Boolean} - Whether the event was destroyed
   */
  destroyclick(e = {}) {
    const t = e.element || document.querySelector(".js--click-boostify");
    return this.destroyEventByCondition(
      (s) => s.type === "click" && s.instance.element === t
    );
  }
  /**
   * Create a scroll event
   * @param {Object} payload - Configuration options
   * @returns {ScrollEvnt} - The created ScrollEvnt instance
   */
  scroll(e = {}) {
    l.assertCondition(
      typeof e.distance == "number",
      "Boostify.scroll",
      "Distance is required and must be a number"
    );
    const t = e.name || `scroll-${e.distance}`, s = new C({
      debug: this.debug,
      distance: e.distance,
      callback: e.callback || null,
      name: t
    });
    return this.registerEvent("scroll", s, { name: t }), s;
  }
  /**
   * Destroy a scroll event
   * @param {Object} payload - Configuration options
   * @returns {Boolean} - Whether the event was destroyed
   */
  destroyscroll(e = {}) {
    const t = e.name || `scroll-${e.distance}`;
    return this.destroyEventByCondition(
      (s) => s.type === "scroll" && s.name === t
    );
  }
  /**
   * Create an observer event
   * @param {Object} payload - Configuration options
   * @returns {ObserverEvent} - The created ObserverEvent instance
   */
  observer(e = {}) {
    const t = e.element || document.querySelector(".js--observer-boostify");
    l.assertCondition(
      t instanceof Element || NodeList.prototype.isPrototypeOf(t),
      "Boostify.observer",
      "Element is required and must be a valid DOM element or NodeList"
    );
    const i = { ...{
      root: null,
      rootMargin: "0px",
      threshold: 0.01
    }, ...e.options }, r = new D({
      debug: this.debug,
      element: t,
      options: i,
      callback: e.callback || null
    }), o = t instanceof NodeList ? [...t] : [t];
    return this.registerEvent("observer", r, { elements: o }), r;
  }
  /**
   * Refresh observer events
   * @param {Object} payload - Configuration options
   */
  refreshobserver({ element: e } = {}) {
    this.events.filter(
      (s) => s.type === "observer" && (!e || s.elements.includes(e))
    ).forEach((s) => {
      s.instance.observers.forEach((i) => {
        if (!e || i.element === e) {
          i.observer.disconnect();
          const r = s.instance.observers.indexOf(i);
          r > -1 && s.instance.observers.splice(r, 1), e && document.contains(e) && s.instance.observeElement(e);
        }
      }), e || (s.instance.observers = [], Array.isArray(s.elements) && s.elements.forEach((i) => {
        document.contains(i) && s.instance.observeElement(i);
      }));
    });
  }
  /**
   * Destroy an observer event
   * @param {Object} payload - Configuration options
   */
  destroyobserver(e = {}) {
    if (!e.element)
      return !1;
    const t = e.element instanceof NodeList ? [...e.element] : [e.element];
    let s = !1;
    return t.forEach((i) => {
      const r = this.events.findIndex(
        (o) => o.type === "observer" && Array.isArray(o.elements) && o.elements.includes(i)
      );
      r !== -1 ? (this.events[r].instance.destroy({ element: i }), this.events[r].instance.observers.length === 0 && this.events.splice(r, 1), s = !0) : this.debug && console.warn("Observer event not found for element:", i);
    }), s;
  }
  /**
   * Create an inactivity event
   * @param {Object} payload - Configuration options
   * @returns {InactivityEvnt} - The created InactivityEvnt instance
   */
  inactivity(e = {}) {
    l.assertCondition(
      typeof e.callback == "function",
      "Boostify.inactivity",
      "Callback is required and must be a function"
    );
    const t = e.name || `inactivity-${Date.now()}`, s = new $({
      debug: this.debug,
      idleTime: e.idleTime || 3e3,
      events: e.events || ["mousemove", "scroll", "keydown"],
      callback: e.callback
    });
    return this.registerEvent("inactivity", s, { name: t }), s;
  }
  /**
   * Destroy an inactivity event
   * @param {Object} payload - Configuration options
   * @returns {Boolean} - Whether the event was destroyed
   */
  destroyinactivity(e = {}) {
    const t = e.name;
    if (t)
      return this.destroyEventByCondition(
        (s) => s.type === "inactivity" && s.name === t
      );
    {
      let s = !1;
      return [...this.events].forEach((i, r) => {
        if (i.type === "inactivity")
          try {
            i.instance.destroy(), this.events.splice(r, 1), s = !0;
          } catch (o) {
            l.handleError(
              "Boostify.destroyinactivity",
              "Error destroying inactivity event",
              o,
              this.debug
            );
          }
      }), s;
    }
  }
  /**
   * Destroy an event by condition
   * @param {Function} condition - Condition function to match the event
   * @returns {Boolean} - Whether the event was destroyed
   */
  destroyEventByCondition(e) {
    const t = this.events.findIndex(e);
    if (t !== -1)
      try {
        return this.events[t].instance.destroy(), this.events.splice(t, 1), !0;
      } catch (s) {
        l.handleError(
          "Boostify.destroyEventByCondition",
          "Error destroying event",
          s,
          this.debug
        );
      }
    return !1;
  }
  /**
   * Create a video player
   * 
   * Usage examples:
   * 
   * // Basic usage
   * const video = bstf.videoPlayer({
   *     url: {                                         // Required: Object containing video URLs
   *         mp4: 'path/to/video.mp4',                  // Optional: MP4 video source
   *         ogg: 'path/to/video.ogg'                   // Optional: OGG video source
   *     },
   *     attributes: {                                  // Optional: HTML attributes for the video element
   *         autoplay: true,                            // Optional: Autoplay the video
   *         controls: true,                            // Optional: Show video controls
   *         loop: false,                               // Optional: Loop the video
   *         muted: true,                               // Optional: Mute the video
   *         class: 'my-video-class'                    // Optional: CSS class for the video
   *     },
   *     appendTo: 'video-container',                   // Required: ID or element where to append the video
   *     style: {                                       // Optional: CSS styles for the video element
   *         height: '400px',                           // Optional: Height of the video
   *         objectFit: 'cover'                         // Optional: Object-fit property
   *     }
   * });
   * 
   * @param {Object} config - Configuration options
   * @returns {HTMLVideoElement} - The created video element
   */
  videoPlayer(e) {
    try {
      const { url: { ogg: t, mp4: s }, attributes: i, appendTo: r, style: o } = e, n = document.createElement("video");
      n.style.width = "100%", n.style.height = o && o.height ? o.height : "auto", o && Object.keys(o).forEach((c) => {
        n.style[c] = o[c];
      });
      for (let c in i)
        c === "class" ? n.className = i[c] : c === "muted" ? n.muted = i[c] : n.setAttribute(c, i[c]);
      if (t) {
        const c = document.createElement("source");
        c.setAttribute("src", t), c.setAttribute("type", "video/ogg"), n.appendChild(c);
      }
      if (s) {
        const c = document.createElement("source");
        c.setAttribute("src", s), c.setAttribute("type", "video/mp4"), n.appendChild(c);
      }
      let d;
      return typeof r == "string" ? d = document.getElementById(r) || document.querySelector(r) : r instanceof Element && (d = r), l.assertCondition(
        d,
        "Boostify.videoPlayer",
        "Append target not found"
      ), d.appendChild(n), n;
    } catch (t) {
      l.handleError(
        "Boostify.videoPlayer",
        "Error creating video player",
        t,
        this.debug
      );
    }
  }
  /**
   * Create a video embed (iframe) for external videos like YouTube or Vimeo
   * 
   * Usage examples:
   * 
   * // Basic usage
   * const iframe = bstf.videoEmbed({
   *     url: 'https://www.youtube.com/embed/VIDEO_ID', // Required: URL of the video to embed
   *     autoplay: true,                                // Optional: Whether to autoplay the video (default: false)
   *     appendTo: 'video-container',                   // Required: ID or element where to append the iframe
   *     style: {                                       // Optional: CSS styles for the iframe
   *         height: '400px',                           // Optional: Height of the iframe
   *         borderRadius: '10px'                       // Optional: Additional CSS properties
   *     }
   * });
   * 
   * // Embed a Vimeo video
   * bstf.videoEmbed({
   *     url: 'https://player.vimeo.com/video/VIDEO_ID',
   *     appendTo: document.getElementById('vimeo-container')
   * });
   * 
   * @param {Object} config - Configuration options
   * @param {string} config.url - URL of the video to embed
   * @param {boolean} [config.autoplay=false] - Whether to autoplay the video
   * @param {string|Element} config.appendTo - ID or element where to append the iframe
   * @param {Object} [config.style] - CSS styles for the iframe
   * @returns {HTMLIFrameElement} - The created iframe element
   */
  videoEmbed({ url: e, autoplay: t = !1, appendTo: s, style: i }) {
    try {
      l.assertCondition(
        e,
        "Boostify.videoEmbed",
        "URL is required"
      ), l.assertCondition(
        s,
        "Boostify.videoEmbed",
        "appendTo is required"
      );
      const r = document.createElement("iframe");
      r.setAttribute("frameborder", "0"), r.setAttribute("allowfullscreen", ""), r.style.width = "100%", r.style.height = i && i.height ? i.height : "100%", i && Object.keys(i).forEach((d) => {
        r.style[d] = i[d];
      });
      let o = e;
      t && (o += `${e.includes("?") ? "&" : "?"}autoplay=1`, e.includes("youtube.com") || e.includes("youtu.be") ? o += "&mute=1" : e.includes("vimeo.com") && (o += "&muted=1")), r.src = o;
      let n;
      return typeof s == "string" ? n = document.getElementById(s) || document.querySelector(s) : s instanceof Element && (n = s), l.assertCondition(
        n,
        "Boostify.videoEmbed",
        "Append target not found"
      ), n.innerHTML = "", n.appendChild(r), r;
    } catch (r) {
      l.handleError(
        "Boostify.videoEmbed",
        "Error creating video embed",
        r,
        this.debug
      );
    }
  }
  /**
   * Load a script
   * @param {Object} config - Configuration options
   * @returns {Promise} - Promise that resolves when the script is loaded
   */
  async loadScript({ url: e = "", attributes: t = [], appendTo: s = "head", inlineScript: i = "" }) {
    return new Promise((r, o) => {
      try {
        l.assertCondition(
          e || i,
          "Boostify.loadScript",
          'Either "url" or "inlineScript" must be provided'
        );
        const n = w({ url: e, inlineScript: i, attributes: t });
        n.onload = () => {
          this.debug && console.log(`${e} script loaded successfully`), r();
        }, n.onerror = () => {
          const d = new Error(`Script load error for ${e}`);
          l.handleError(
            "Boostify.loadScript",
            "Error loading script",
            d,
            this.debug
          ), o(d);
        }, v(n, s), i && !e && r();
      } catch (n) {
        l.handleError(
          "Boostify.loadScript",
          "Error creating script element",
          n,
          this.debug
        ), o(n);
      }
    });
  }
  /**
   * Load a stylesheet
   * @param {Object} config - Configuration options
   * @returns {Promise} - Promise that resolves when the stylesheet is loaded
   */
  async loadStyle({ url: e = "", attributes: t = [], appendTo: s = "head", inlineStyle: i = "" }) {
    return new Promise((r, o) => {
      try {
        l.assertCondition(
          e || i,
          "Boostify.loadStyle",
          'Either "url" or "inlineStyle" must be provided'
        );
        const n = k({ url: e, inlineStyle: i, attributes: t });
        n.onload = () => {
          this.debug && console.log(`${e} stylesheet loaded successfully`), r();
        }, n.onerror = () => {
          const d = new Error(`Stylesheet load error for ${e}`);
          l.handleError(
            "Boostify.loadStyle",
            "Error loading stylesheet",
            d,
            this.debug
          ), o(d);
        }, v(n, s), (i || !e) && r();
      } catch (n) {
        l.handleError(
          "Boostify.loadStyle",
          "Error creating style element",
          n,
          this.debug
        ), o(n);
      }
    });
  }
  /**
   * Destroy all events
   */
  destroyNoMatterWhat() {
    console.log("destroyNoMatterWhat"), [...this.events].forEach((e) => {
      try {
        e.instance && typeof e.instance.destroy == "function" && (e.type === "click" || e.type === "scroll" ? e.instance.destroy() : e.type === "observer" ? (console.log("destroy observer"), e.instance.destroy()) : e.type === "onload" ? e.instance.destroy() : e.type === "inactivity" && (console.log("destroy inactivity"), e.instance.destroy()));
      } catch (t) {
        l.handleError(
          "Boostify.destroyNoMatterWhat",
          `Error destroying ${e.type} event`,
          t,
          this.debug
        );
      }
    }), this.events = [];
  }
  /**
   * Display watermark for invalid license
   * This method is intentionally left as is to ensure failures for invalid licenses
   */
  wm() {
    var e = document.createElement("div");
    e.className = m.brand;
    var t = document.createElement("h2");
    t.textContent = m.brand;
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
