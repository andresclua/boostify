const E = { background: "#065205", color: "#bada55", padding: "3px", marginTop: "10px" };
function p(a) {
  return Object.entries(a).map(([e, t]) => `${e}: ${t}`).join("; ");
}
function k({ url: a, inlineScript: e, attributes: t = [] }) {
  const i = document.createElement("script");
  return a && (i.src = a), e && (i.textContent = e), y(i, t), i;
}
function y(a, e) {
  e.forEach((t) => {
    const [i, s] = t.includes("=") ? t.split("=") : [t, !0];
    a.setAttribute(i, s === !0 ? "" : s.replace(/"/g, ""));
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
function I({ url: a, inlineStyle: e, attributes: t = [] }) {
  let i;
  if (a)
    i = document.createElement("link"), i.rel = "stylesheet", i.href = a;
  else if (e)
    i = document.createElement("style"), i.textContent = e;
  else
    throw new Error('Either "url" or "inlineStyle" must be provided.');
  return y(i, t), i;
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
  static handleError(e, t, i, s = !1) {
    return console.error(`[${e}] ${t}`, i), s && console.error(`[${e}] Stack trace:`, i.stack), i;
  }
  /**
   * Throw a new error with consistent formatting
   * @param {String} context - The context where the error occurred
   * @param {String} message - Error message
   * @throws {Error}
   */
  static throwError(e, t) {
    const i = new Error(`[${e}] ${t}`);
    throw console.error(i), i;
  }
  /**
   * Assert that a condition is true, throw an error if not
   * @param {Boolean} condition - Condition to check
   * @param {String} context - The context where the assertion is made
   * @param {String} message - Error message if assertion fails
   * @throws {Error} - If condition is false
   */
  static assertCondition(e, t, i) {
    e || this.throwError(t, i);
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
class w extends f {
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
    }).catch((i) => {
      this.logError(t.negative, i);
    }));
  }
  fire() {
    return new Promise((e, t) => {
      const i = document.querySelectorAll(this.selector);
      if (i.length === 0) {
        l.throwError("OnLoad.fire", `No scripts with ${this.selector} found.`);
        return;
      }
      const s = Array.from(i);
      let r = 0;
      const n = (c) => {
        if (c.src) {
          const h = document.createElement("script");
          h.src = c.src, h.onload = () => {
            r++, this.logDebug(`${u.scriptLoaded} ${c.src}`), r === s.length && e();
          }, h.onerror = () => {
            t(new Error(`${u.scriptNotLoaded}${c.src}`));
          }, document.body.appendChild(h);
        } else
          try {
            const h = document.createElement("script");
            h.text = c.innerText, document.body.appendChild(h), r++, r === s.length && e();
          } catch (h) {
            t(h);
          }
      }, o = s.filter((c) => c.src), d = s.filter((c) => !c.src);
      o.forEach(n), o.length === 0 ? d.forEach(n) : this.externalScriptsCheckIntervalId = setInterval(() => {
        r >= o.length && (clearInterval(this.externalScriptsCheckIntervalId), d.forEach(n));
      }, 100);
    });
  }
  destroy() {
    this.timeoutId && clearTimeout(this.timeoutId), this.externalScriptsCheckIntervalId && clearInterval(this.externalScriptsCheckIntervalId), this.eventsHandler.forEach((e) => {
      e === "scroll" ? window.removeEventListener("scroll", this._handleScroll) : e === "mousemove" ? window.removeEventListener("mousemove", this._mouseMove) : e === "touchstart" && window.removeEventListener("touchstart", this._touchStart);
    }), super.destroy();
  }
}
class C extends f {
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
class T extends f {
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
class S extends f {
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
    const t = new IntersectionObserver((i, s) => {
      i.forEach((r) => {
        r.isIntersecting && this.executeCallback(r, s);
      });
    }, this.options);
    t.observe(e), this.observers.push({ element: e, observer: t }), this.logDebug(`Observing element: ${e.tagName}${e.id ? "#" + e.id : ""}`);
  }
  destroy(e) {
    if (e && e.element) {
      const t = e.element, i = this.observers.findIndex((s) => s.element === t);
      i !== -1 ? (this.observers[i].observer.disconnect(), this.observers.splice(i, 1), this.logDebug(`Observer for element ${t.tagName}${t.id ? "#" + t.id : ""} destroyed`)) : this.logError(g.noObserver);
    } else
      this.observers.forEach((t) => {
        t.observer.disconnect(), this.logDebug(`Observer for element ${t.element.tagName}${t.element.id ? "#" + t.element.id : ""} destroyed`);
      }), this.observers = [];
    super.destroy();
  }
}
class D {
  constructor({ idleTime: e, maxTime: t = 2e3, events: i = ["mousemove", "scroll", "keydown", "mousedown", "mouseup", "click", "touchstart", "touchend"], callback: s, debug: r = !1 }) {
    this.idleTime = e, this.maxTime = t, this.events = i, this.callback = s, this.debug = r, this.lastActivityTime = Date.now(), this.checkingInactivity = !1, this.idleCallbackId = null, this.userIdleTimeoutId = null, this.boundResetIdleTimer = this.resetIdleTimer.bind(this), this.idleTime !== void 0 && this.idleTime >= this.maxTime && (this.debug && console.warn("InactivityEvnt: idleTime debe ser menor que maxTime. Ajustando idleTime a", this.maxTime - 100), this.idleTime = this.maxTime - 100), this.init();
  }
  init() {
    if (this.events !== "none" && this.idleTime !== void 0 && this.events.forEach((e) => {
      window.addEventListener(e, this.boundResetIdleTimer, { passive: !0 });
    }), this.startChecking(), this.debug) {
      const e = this.idleTime !== void 0 ? "user idle" : "native idle";
      console.log(`Inactivity event initialized in ${e} mode, maxTime: ${this.maxTime}`);
    }
  }
  resetIdleTimer() {
    this.lastActivityTime = Date.now(), this.idleTime !== void 0 && this.userIdleTimeoutId && (clearTimeout(this.userIdleTimeoutId), this.scheduleUserIdleCheck());
  }
  startChecking() {
    this.checkingInactivity = !0, this.lastActivityTime = Date.now(), this.idleTime !== void 0 ? this.scheduleUserIdleCheck() : this.scheduleNativeIdleCheck();
  }
  // Native idle mode: use requestIdleCallback with maxTime as timeout
  scheduleNativeIdleCheck() {
    this.checkingInactivity && ("requestIdleCallback" in window ? this.idleCallbackId = requestIdleCallback(() => {
      this.checkingInactivity && (this.debug && console.log("Browser idle detected"), this.executeCallback());
    }, { timeout: this.maxTime }) : this.idleCallbackId = setTimeout(() => {
      this.checkingInactivity && (this.debug && console.log("Timeout reached (no requestIdleCallback)"), this.executeCallback());
    }, this.maxTime));
  }
  // User idle mode: check user activity with maxTime as safety net
  scheduleUserIdleCheck() {
    this.checkingInactivity && (this.userIdleTimeoutId = setTimeout(() => {
      this.checkingInactivity && (this.debug && console.log("User idle detected after", this.idleTime, "ms"), this.executeCallback());
    }, this.idleTime), "requestIdleCallback" in window ? this.idleCallbackId = requestIdleCallback(() => {
      this.checkingInactivity && Date.now() - this.lastActivityTime >= this.idleTime && (this.debug && console.log("User idle confirmed by requestIdleCallback"), this.executeCallback());
    }, { timeout: this.maxTime }) : this.idleCallbackId = setTimeout(() => {
      this.checkingInactivity && (this.debug && console.log("Max timeout reached"), this.executeCallback());
    }, this.maxTime));
  }
  executeCallback() {
    this.clearAllTimers(), this.callback(), this.checkingInactivity && (this.lastActivityTime = Date.now(), this.startChecking());
  }
  clearAllTimers() {
    this.userIdleTimeoutId && (clearTimeout(this.userIdleTimeoutId), this.userIdleTimeoutId = null), this.idleCallbackId && ("requestIdleCallback" in window && typeof cancelIdleCallback == "function" ? cancelIdleCallback(this.idleCallbackId) : clearTimeout(this.idleCallbackId), this.idleCallbackId = null);
  }
  destroy() {
    this.checkingInactivity = !1, this.clearAllTimers(), this.events !== "none" && this.idleTime !== void 0 && this.events.forEach((e) => {
      window.removeEventListener(e, this.boundResetIdleTimer);
    }), this.debug && console.log("Inactivity event destroyed");
  }
}
function $(a, e) {
  const t = "https://api.gumroad.com/v2/licenses/verify";
  return new Promise((i, s) => {
    const r = new FormData();
    r.append("product_id", a), r.append("license_key", e), fetch(t, {
      method: "POST",
      body: r
    }).then((n) => n.json()).then((n) => {
      i(n);
    }).catch((n) => {
      s(n);
    });
  });
}
class L {
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
  init() {
    const e = async () => {
      try {
        (await $(this.productID, this.license)).success ? this.debug && console.log(
          `%c${m.brand} - ${m.license_approved}`,
          p(E)
        ) : (setTimeout(() => this.destroyNoMatterWhat(), 1200), this.wm());
      } catch (t) {
        l.handleError("Boostify.init", m.errorValidate, t, this.debug);
      }
    };
    "requestIdleCallback" in window ? requestIdleCallback(e, { timeout: 1e4 }) : setTimeout(e, 1e4);
  }
  /**
   * Register an event in the events array
   * @param {String} type - Event type
   * @param {Object} instance - Event instance
   * @param {Object} metadata - Additional metadata
   * @returns {Object} - The registered event object
   */
  registerEvent(e, t, i = {}) {
    const s = {
      type: e,
      instance: t,
      ...i
    };
    return this.events.push(s), s;
  }
  /**
   * Create a load event
   * @param {Object} payload - Configuration options
   * @returns {OnLoad} - The created OnLoad instance
   */
  onload(e = {}) {
    const t = new w({
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
    const i = new C({
      debug: this.debug,
      element: t,
      callback: e.callback || null
    });
    return this.registerEvent("click", i), i;
  }
  /**
   * Destroy a click event
   * @param {Object} payload - Configuration options
   * @returns {Boolean} - Whether the event was destroyed
   */
  destroyclick(e = {}) {
    const t = e.element || document.querySelector(".js--click-boostify");
    return this.destroyEventByCondition(
      (i) => i.type === "click" && i.instance.element === t
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
    const t = e.name || `scroll-${e.distance}`, i = new T({
      debug: this.debug,
      distance: e.distance,
      callback: e.callback || null,
      name: t
    });
    return this.registerEvent("scroll", i, { name: t }), i;
  }
  /**
   * Destroy a scroll event
   * @param {Object} payload - Configuration options
   * @returns {Boolean} - Whether the event was destroyed
   */
  destroyscroll(e = {}) {
    const t = e.name || `scroll-${e.distance}`;
    return this.destroyEventByCondition(
      (i) => i.type === "scroll" && i.name === t
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
    const s = { ...{
      root: null,
      rootMargin: "0px",
      threshold: 0.01
    }, ...e.options }, r = new S({
      debug: this.debug,
      element: t,
      options: s,
      callback: e.callback || null
    }), n = t instanceof NodeList ? [...t] : [t];
    return this.registerEvent("observer", r, { elements: n }), r;
  }
  /**
   * Refresh observer events
   * @param {Object} payload - Configuration options
   */
  refreshobserver({ element: e } = {}) {
    this.events.filter(
      (i) => i.type === "observer" && (!e || i.elements.includes(e))
    ).forEach((i) => {
      i.instance.observers.forEach((s) => {
        if (!e || s.element === e) {
          s.observer.disconnect();
          const r = i.instance.observers.indexOf(s);
          r > -1 && i.instance.observers.splice(r, 1), e && document.contains(e) && i.instance.observeElement(e);
        }
      }), e || (i.instance.observers = [], Array.isArray(i.elements) && i.elements.forEach((s) => {
        document.contains(s) && i.instance.observeElement(s);
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
    let i = !1;
    return t.forEach((s) => {
      const r = this.events.findIndex(
        (n) => n.type === "observer" && Array.isArray(n.elements) && n.elements.includes(s)
      );
      r !== -1 ? (this.events[r].instance.destroy({ element: s }), this.events[r].instance.observers.length === 0 && this.events.splice(r, 1), i = !0) : this.debug && console.warn("Observer event not found for element:", s);
    }), i;
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
    const t = e.name || `inactivity-${Date.now()}`, i = new D({
      debug: this.debug,
      idleTime: e.idleTime,
      // CHANGE: Pass idleTime (default 1500 in class)
      maxTime: e.maxTime,
      // CHANGE: Pass maxTime (default 2000 in class)
      events: e.events || ["mousemove", "scroll", "keydown", "mousedown", "mouseup", "click", "touchstart", "touchend"],
      callback: e.callback
    });
    return this.registerEvent("inactivity", i, { name: t }), i;
  }
  /**
   * Destroy an inactivity event
   * @param {Object} payload - Configuration options with required name
   * @returns {Boolean} - Whether the event was destroyed
   */
  destroyinactivity(e = {}) {
    l.assertCondition(
      e.name,
      "Boostify.destroyinactivity",
      "Name is required to destroy an inactivity event"
    );
    const t = e.name, i = this.events.findIndex(
      (s) => s.type === "inactivity" && s.name === t
    );
    l.assertCondition(
      i !== -1,
      "Boostify.destroyinactivity",
      `Inactivity event with name "${t}" not found`
    );
    try {
      return this.events[i].instance.destroy(), this.events.splice(i, 1), !0;
    } catch (s) {
      return l.handleError(
        "Boostify.destroyinactivity",
        `Error destroying inactivity event "${t}"`,
        s,
        this.debug
      ), !1;
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
      } catch (i) {
        l.handleError(
          "Boostify.destroyEventByCondition",
          "Error destroying event",
          i,
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
      const { url: { ogg: t, mp4: i }, attributes: s, appendTo: r, style: n } = e, o = document.createElement("video");
      o.style.width = "100%", o.style.height = n && n.height ? n.height : "auto", n && Object.keys(n).forEach((c) => {
        o.style[c] = n[c];
      });
      for (let c in s)
        c === "class" ? o.className = s[c] : c === "muted" ? o.muted = s[c] : c === "autoplay" ? o.autoplay = s[c] : c === "controls" ? o.controls = s[c] : o.setAttribute(c, s[c]);
      if (t) {
        const c = document.createElement("source");
        c.setAttribute("src", t), c.setAttribute("type", "video/ogg"), o.appendChild(c);
      }
      if (i) {
        const c = document.createElement("source");
        c.setAttribute("src", i), c.setAttribute("type", "video/mp4"), o.appendChild(c);
      }
      let d;
      return typeof r == "string" ? d = document.getElementById(r) || document.querySelector(r) : r instanceof Element && (d = r), l.assertCondition(
        d,
        "Boostify.videoPlayer",
        "Append target not found"
      ), d.appendChild(o), o;
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
  videoEmbed({ url: e, autoplay: t = !1, appendTo: i, style: s }) {
    try {
      l.assertCondition(
        e,
        "Boostify.videoEmbed",
        "URL is required"
      ), l.assertCondition(
        i,
        "Boostify.videoEmbed",
        "appendTo is required"
      );
      const r = document.createElement("iframe");
      r.setAttribute("frameborder", "0"), r.setAttribute("allowfullscreen", ""), r.style.width = "100%", r.style.height = s && s.height ? s.height : "100%", s && Object.keys(s).forEach((d) => {
        r.style[d] = s[d];
      });
      let n = e;
      t && (n += `${e.includes("?") ? "&" : "?"}autoplay=1`, e.includes("youtube.com") || e.includes("youtu.be") ? n += "&mute=1" : e.includes("vimeo.com") && (n += "&muted=1")), r.src = n;
      let o;
      return typeof i == "string" ? o = document.getElementById(i) || document.querySelector(i) : i instanceof Element && (o = i), l.assertCondition(
        o,
        "Boostify.videoEmbed",
        "Append target not found"
      ), o.innerHTML = "", o.appendChild(r), r;
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
  async loadScript({ url: e = "", attributes: t = [], appendTo: i = "head", inlineScript: s = "" }) {
    return new Promise((r, n) => {
      try {
        l.assertCondition(
          e || s,
          "Boostify.loadScript",
          'Either "url" or "inlineScript" must be provided'
        );
        const o = k({ url: e, inlineScript: s, attributes: t });
        o.onload = () => {
          this.debug && console.log(`${e} script loaded successfully`), r();
        }, o.onerror = () => {
          const d = new Error(`Script load error for ${e}`);
          l.handleError(
            "Boostify.loadScript",
            "Error loading script",
            d,
            this.debug
          ), n(d);
        }, v(o, i), s && !e && r();
      } catch (o) {
        l.handleError(
          "Boostify.loadScript",
          "Error creating script element",
          o,
          this.debug
        ), n(o);
      }
    });
  }
  /**
   * Load a stylesheet
   * @param {Object} config - Configuration options
   * @returns {Promise} - Promise that resolves when the stylesheet is loaded
   */
  async loadStyle({ url: e = "", attributes: t = [], appendTo: i = "head", inlineStyle: s = "" }) {
    return new Promise((r, n) => {
      try {
        l.assertCondition(
          e || s,
          "Boostify.loadStyle",
          'Either "url" or "inlineStyle" must be provided'
        );
        const o = I({ url: e, inlineStyle: s, attributes: t });
        o.onload = () => {
          this.debug && console.log(`${e} stylesheet loaded successfully`), r();
        }, o.onerror = () => {
          const d = new Error(`Stylesheet load error for ${e}`);
          l.handleError(
            "Boostify.loadStyle",
            "Error loading stylesheet",
            d,
            this.debug
          ), n(d);
        }, v(o, i), (s || !e) && r();
      } catch (o) {
        l.handleError(
          "Boostify.loadStyle",
          "Error creating style element",
          o,
          this.debug
        ), n(o);
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
    function i() {
      Object.assign(e.style, {
        position: "fixed",
        right: "10px",
        padding: "5px",
        bottom: "10px",
        background: "grey",
        zIndex: "1000"
      }), t.style.fontSize = "11px";
    }
    i(), e.appendChild(t), document.body.appendChild(e), setInterval(i, 1e3);
  }
}
export {
  L as default
};
