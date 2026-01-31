function y({ url: h, inlineScript: e, attributes: t = [] }) {
  const i = document.createElement("script");
  return h && (i.src = h), e && (i.textContent = e), p(i, t), i;
}
function p(h, e) {
  e.forEach((t) => {
    const [i, s] = t.includes("=") ? t.split("=") : [t, !0];
    h.setAttribute(i, s === !0 ? "" : s.replace(/"/g, ""));
  });
}
function g(h, e) {
  let t;
  if (e === "head" || e === "body")
    t = document[e];
  else if (typeof e == "string") {
    if (t = document.querySelector(e), !t)
      throw console.error("No element matches the selector: " + e), new Error("No element matches the selector: " + e);
  } else
    e instanceof Element ? t = e : t = document.head;
  t.appendChild(h);
}
function E({ url: h, inlineStyle: e, attributes: t = [] }) {
  let i;
  if (h)
    i = document.createElement("link"), i.rel = "stylesheet", i.href = h;
  else if (e)
    i = document.createElement("style"), i.textContent = e;
  else
    throw new Error('Either "url" or "inlineStyle" must be provided.');
  return p(i, t), i;
}
const k = {
  brand: "BoostifyJs"
}, f = {
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
}, v = {
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
class m {
  constructor(e) {
    this.debug = e.debug || !1, this.callbackFn = e.callback || null, this.type = this.constructor.name, this.init();
  }
  /**
   * Initialization method that child classes can override
   */
  init() {
    this.debug && this.logDebug("initialized");
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
    if (this.debug) {
      const { emoji: t, style: i } = this.getDebugConfig();
      console.log(`%c${t} ${this.type}: ${e}`, i);
    }
  }
  /**
   * Log error message
   * @param {String} message - Error message
   * @param {Error} error - Error object
   */
  logError(e, t) {
    console.error(`❌ ${this.type}: ${e}`, t);
  }
  /**
   * Get debug configuration for console logging
   * Child classes should override this to provide their own styling
   * @returns {Object} - { emoji, style }
   */
  getDebugConfig() {
    return {
      emoji: "🔧",
      style: "background: #333; color: #fff; padding: 3px 6px; border-radius: 3px;"
    };
  }
  /**
   * Base destroy method that child classes must implement
   * Used for cleanup (removing event listeners, etc.)
   */
  destroy() {
    this.logDebug("destroyed");
  }
}
class w extends m {
  constructor(e) {
    super(e), this.selector = e.selector || "script[type='text/boostify']", this.wereScriptsExecuted = !1, this.maxTime = e.maxTime || 600, this.eventsHandler = e.eventsHandler || ["mousemove", "load", "scroll", "touchstart"], this.worker = e.worker || !1, this.workerInstance = null, this._handleScroll = this._handleScroll.bind(this), this._mouseMove = this._mouseMove.bind(this), this._touchStart = this._touchStart.bind(this), this.setupTimeout(), this.setupEvents(), this.logDebug(`${f.debugDefault} "${this.selector}" on [${this.eventsHandler.join(", ")}] after ${this.maxTime}ms${this.worker ? " (worker mode)" : ""}`);
  }
  getDebugConfig() {
    return {
      emoji: "⚡",
      style: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
    };
  }
  setupTimeout() {
    this.timeoutId = setTimeout(() => {
      if (!this.wereScriptsExecuted) {
        this.wereScriptsExecuted = !0;
        const e = performance.now();
        this.fire().then((t) => {
          t.loadTime = Math.round(performance.now() - e), this.executeCallback(t), this.logDebug(f.events.load.positive);
        }).catch((t) => {
          this.executeCallback({ success: !1, error: t.message }), this.logError(f.events.load.negative, t);
        });
      }
    }, this.maxTime);
  }
  setupEvents() {
    this.eventsHandler.forEach((e) => {
      e === "scroll" ? window.addEventListener("scroll", this._handleScroll) : e === "mousemove" ? window.addEventListener("mousemove", this._mouseMove) : e === "touchstart" && window.addEventListener("touchstart", this._touchStart);
    });
  }
  _handleScroll() {
    this.triggerLoad("scroll", f.events.scroll);
  }
  _mouseMove() {
    this.triggerLoad("mousemove", f.events.mousemove);
  }
  _touchStart() {
    this.triggerLoad("touchstart", f.events.touchstart);
  }
  triggerLoad(e, t) {
    if (!this.wereScriptsExecuted) {
      this.wereScriptsExecuted = !0;
      const i = performance.now();
      this.fire().then((s) => {
        s.loadTime = Math.round(performance.now() - i), s.triggeredBy = e, this.executeCallback(s), this.logDebug(t.positive);
      }).catch((s) => {
        this.executeCallback({ success: !1, error: s.message, triggeredBy: e }), this.logError(t.negative, s);
      });
    }
  }
  fire() {
    return this.worker && typeof Worker < "u" ? this.fireWithWorker() : this.fireTraditional();
  }
  fireTraditional() {
    return new Promise((e, t) => {
      const i = document.querySelectorAll(this.selector);
      if (i.length === 0) {
        l.throwError("OnLoad.fire", `No scripts with ${this.selector} found.`);
        return;
      }
      const s = Array.from(i);
      let n = 0;
      const o = [], r = (d) => {
        if (d.src) {
          const u = document.createElement("script");
          u.src = d.src, u.onload = () => {
            n++, o.push({ url: d.src, success: !0, type: "external" }), this.logDebug(`${f.scriptLoaded} ${d.src}`), n === s.length && e({ success: !0, method: "traditional", scripts: o });
          }, u.onerror = () => {
            o.push({ url: d.src, success: !1, type: "external" }), t(new Error(`${f.scriptNotLoaded}${d.src}`));
          }, document.body.appendChild(u);
        } else
          try {
            const u = document.createElement("script");
            u.text = d.innerText, document.body.appendChild(u), n++, o.push({ success: !0, type: "inline" }), n === s.length && e({ success: !0, method: "traditional", scripts: o });
          } catch (u) {
            o.push({ success: !1, type: "inline", error: u.message }), t(u);
          }
      }, a = s.filter((d) => d.src), c = s.filter((d) => !d.src);
      a.forEach(r), a.length === 0 ? c.forEach(r) : this.externalScriptsCheckIntervalId = setInterval(() => {
        n >= a.length && (clearInterval(this.externalScriptsCheckIntervalId), c.forEach(r));
      }, 100);
    });
  }
  fireWithWorker() {
    return new Promise((e, t) => {
      const i = document.querySelectorAll(this.selector);
      if (i.length === 0) {
        l.throwError("OnLoad.fire", `No scripts with ${this.selector} found.`);
        return;
      }
      this.logDebug("Loading scripts via Web Worker + Proxy");
      const s = [...i].filter((r) => r.src), n = [...i].filter((r) => !r.src), o = s.map((r) => r.src);
      if (o.length === 0) {
        const r = this.executeInlineScripts(n);
        e({ success: !0, method: "worker", scripts: r });
        return;
      }
      try {
        this.workerInstance = new Worker(
          new URL("/assets/ScriptLoader-a90db4eb.js", self.location)
        );
      } catch {
        return this.logError("Worker creation failed, falling back to traditional loading"), this.fireTraditional().then(e).catch(t);
      }
      this.workerInstance.onmessage = ({ data: r }) => {
        if (r.success) {
          const a = [];
          r.results.forEach((d) => {
            if (d.success) {
              const u = document.createElement("script");
              u.text = d.content, document.body.appendChild(u), a.push({ url: d.url, success: !0, type: "external", proxied: d.proxied }), this.logDebug(`${f.scriptLoaded} (via Worker) ${d.url}`);
            } else
              a.push({ url: d.url, success: !1, type: "external", error: d.error }), this.logError(`Failed to load: ${d.url} - ${d.error}`);
          });
          const c = this.executeInlineScripts(n);
          a.push(...c), e({ success: !0, method: "worker", scripts: a });
        } else
          t(new Error(r.error));
        this.workerInstance.terminate(), this.workerInstance = null;
      }, this.workerInstance.onerror = (r) => {
        this.logError("Worker error, falling back to traditional loading"), this.workerInstance.terminate(), this.workerInstance = null, this.fireTraditional().then(e).catch(t);
      }, this.workerInstance.postMessage({
        urls: o,
        id: Date.now()
      });
    });
  }
  executeInlineScripts(e) {
    const t = [];
    return e.forEach((i) => {
      try {
        const s = document.createElement("script");
        s.text = i.innerText, document.body.appendChild(s), t.push({ success: !0, type: "inline" });
      } catch (s) {
        t.push({ success: !1, type: "inline", error: s.message });
      }
    }), t;
  }
  destroy() {
    this.timeoutId && clearTimeout(this.timeoutId), this.externalScriptsCheckIntervalId && clearInterval(this.externalScriptsCheckIntervalId), this.workerInstance && (this.workerInstance.terminate(), this.workerInstance = null), this.eventsHandler.forEach((e) => {
      e === "scroll" ? window.removeEventListener("scroll", this._handleScroll) : e === "mousemove" ? window.removeEventListener("mousemove", this._mouseMove) : e === "touchstart" && window.removeEventListener("touchstart", this._touchStart);
    }), super.destroy();
  }
}
class I extends m {
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
  getDebugConfig() {
    return {
      emoji: "👆",
      style: "background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
    };
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
class C extends m {
  constructor(e) {
    super(e), this.distance = e.distance, this.name = e.name || `scroll-${this.distance}`, this.wasScrollExecuted = !1, this.scrollHandler = this.scrollHandler.bind(this), window.addEventListener("scroll", this.scrollHandler);
  }
  init() {
    this.logDebug(`${b.debugDefault} ${this.distance} ${b.debugDefaultSecond}`);
  }
  getDebugConfig() {
    return {
      emoji: "📜",
      style: "background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
    };
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
class T extends m {
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
  getDebugConfig() {
    return {
      emoji: "👁️",
      style: "background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
    };
  }
  setupObservers() {
    NodeList.prototype.isPrototypeOf(this.element) ? this.element.forEach((e) => this.observeElement(e)) : this.element instanceof Element ? this.observeElement(this.element) : this.logError(v.noElement);
  }
  observeElement(e) {
    const t = new IntersectionObserver((i, s) => {
      i.forEach((n) => {
        n.isIntersecting && this.executeCallback(n, s);
      });
    }, this.options);
    t.observe(e), this.observers.push({ element: e, observer: t }), this.logDebug(`Observing element: ${e.tagName}${e.id ? "#" + e.id : ""}`);
  }
  destroy(e) {
    if (e && e.element) {
      const t = e.element, i = this.observers.findIndex((s) => s.element === t);
      i !== -1 ? (this.observers[i].observer.disconnect(), this.observers.splice(i, 1), this.logDebug(`Observer for element ${t.tagName}${t.id ? "#" + t.id : ""} destroyed`)) : this.logError(v.noObserver);
    } else
      this.observers.forEach((t) => {
        t.observer.disconnect(), this.logDebug(`Observer for element ${t.element.tagName}${t.element.id ? "#" + t.element.id : ""} destroyed`);
      }), this.observers = [];
    super.destroy();
  }
}
class S {
  constructor({ idleTime: e, maxTime: t = 2e3, events: i = ["mousemove", "scroll", "keydown", "mousedown", "mouseup", "click", "touchstart", "touchend"], callback: s, debug: n = !1 }) {
    this.idleTime = e, this.maxTime = t, this.events = i, this.callback = s, this.debug = n, this.lastActivityTime = Date.now(), this.checkingInactivity = !1, this.idleCallbackId = null, this.userIdleTimeoutId = null, this.boundResetIdleTimer = this.resetIdleTimer.bind(this), this.idleTime !== void 0 && this.idleTime >= this.maxTime && (this.debug && console.warn("%c⚠️ InactivityEvnt: idleTime debe ser menor que maxTime. Ajustando idleTime a " + (this.maxTime - 100), "background: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px;"), this.idleTime = this.maxTime - 100), this.init();
  }
  init() {
    if (this.events !== "none" && this.idleTime !== void 0 && this.events.forEach((e) => {
      window.addEventListener(e, this.boundResetIdleTimer, { passive: !0 });
    }), this.startChecking(), this.debug) {
      const e = this.idleTime !== void 0 ? "user idle" : "native idle";
      console.log(`%c💤 InactivityEvnt: initialized in ${e} mode, maxTime: ${this.maxTime}`, "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
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
      this.checkingInactivity && (this.debug && console.log("%c💤 InactivityEvnt: Browser idle detected", "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;"), this.executeCallback());
    }, { timeout: this.maxTime }) : this.idleCallbackId = setTimeout(() => {
      this.checkingInactivity && (this.debug && console.log("%c💤 InactivityEvnt: Timeout reached (no requestIdleCallback)", "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;"), this.executeCallback());
    }, this.maxTime));
  }
  // User idle mode: check user activity with maxTime as safety net
  scheduleUserIdleCheck() {
    this.checkingInactivity && (this.userIdleTimeoutId = setTimeout(() => {
      this.checkingInactivity && (this.debug && console.log(`%c💤 InactivityEvnt: User idle detected after ${this.idleTime}ms`, "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;"), this.executeCallback());
    }, this.idleTime), "requestIdleCallback" in window ? this.idleCallbackId = requestIdleCallback(() => {
      this.checkingInactivity && Date.now() - this.lastActivityTime >= this.idleTime && (this.debug && console.log("%c💤 InactivityEvnt: User idle confirmed by requestIdleCallback", "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;"), this.executeCallback());
    }, { timeout: this.maxTime }) : this.idleCallbackId = setTimeout(() => {
      this.checkingInactivity && (this.debug && console.log("%c💤 InactivityEvnt: Max timeout reached", "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;"), this.executeCallback());
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
    }), this.debug && console.log("%c💤 InactivityEvnt: destroyed", "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
  }
}
class $ {
  constructor(e = {}) {
    this.debug = e.debug || !1, this.events = [], this.init();
  }
  /**
   * Initialize Boostify
   */
  init() {
    this.debug && console.log(`%c🚀 ${k.brand} - Initialized`, "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 14px;");
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
   * @param {boolean} [payload.worker=false] - Use Web Worker + Proxy for loading scripts
   * @returns {OnLoad} - The created OnLoad instance
   */
  onload(e = {}) {
    const t = new w({
      debug: this.debug,
      maxTime: e.maxTime || 600,
      selector: e.selector || "script[type='text/boostify']",
      eventsHandler: e.eventsHandler || ["mousemove", "load", "scroll", "touchstart"],
      callback: e.callback || null,
      worker: e.worker || !1
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
    const i = new I({
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
    const t = e.name || `scroll-${e.distance}`, i = new C({
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
    }, ...e.options }, n = new T({
      debug: this.debug,
      element: t,
      options: s,
      callback: e.callback || null
    }), o = t instanceof NodeList ? [...t] : [t];
    return this.registerEvent("observer", n, { elements: o }), n;
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
          const n = i.instance.observers.indexOf(s);
          n > -1 && i.instance.observers.splice(n, 1), e && document.contains(e) && i.instance.observeElement(e);
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
      const n = this.events.findIndex(
        (o) => o.type === "observer" && Array.isArray(o.elements) && o.elements.includes(s)
      );
      n !== -1 ? (this.events[n].instance.destroy({ element: s }), this.events[n].instance.observers.length === 0 && this.events.splice(n, 1), i = !0) : this.debug && console.warn("Observer event not found for element:", s);
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
    const t = e.name || `inactivity-${Date.now()}`, i = new S({
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
      const { url: { ogg: t, mp4: i }, attributes: s, appendTo: n, style: o } = e, r = document.createElement("video");
      r.style.width = "100%", r.style.height = o && o.height ? o.height : "auto", o && Object.keys(o).forEach((c) => {
        r.style[c] = o[c];
      });
      for (let c in s)
        c === "class" ? r.className = s[c] : c === "muted" ? r.muted = s[c] : c === "autoplay" ? r.autoplay = s[c] : c === "controls" ? r.controls = s[c] : r.setAttribute(c, s[c]);
      if (t) {
        const c = document.createElement("source");
        c.setAttribute("src", t), c.setAttribute("type", "video/ogg"), r.appendChild(c);
      }
      if (i) {
        const c = document.createElement("source");
        c.setAttribute("src", i), c.setAttribute("type", "video/mp4"), r.appendChild(c);
      }
      let a;
      return typeof n == "string" ? a = document.getElementById(n) || document.querySelector(n) : n instanceof Element && (a = n), l.assertCondition(
        a,
        "Boostify.videoPlayer",
        "Append target not found"
      ), a.appendChild(r), r;
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
      const n = document.createElement("iframe");
      n.setAttribute("frameborder", "0"), n.setAttribute("allowfullscreen", ""), n.style.width = "100%", n.style.height = s && s.height ? s.height : "100%", s && Object.keys(s).forEach((a) => {
        n.style[a] = s[a];
      });
      let o = e;
      t && (o += `${e.includes("?") ? "&" : "?"}autoplay=1`, e.includes("youtube.com") || e.includes("youtu.be") ? o += "&mute=1" : e.includes("vimeo.com") && (o += "&muted=1")), n.src = o;
      let r;
      return typeof i == "string" ? r = document.getElementById(i) || document.querySelector(i) : i instanceof Element && (r = i), l.assertCondition(
        r,
        "Boostify.videoEmbed",
        "Append target not found"
      ), r.innerHTML = "", r.appendChild(n), n;
    } catch (n) {
      l.handleError(
        "Boostify.videoEmbed",
        "Error creating video embed",
        n,
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
    return new Promise((n, o) => {
      try {
        l.assertCondition(
          e || s,
          "Boostify.loadScript",
          'Either "url" or "inlineScript" must be provided'
        );
        const r = y({ url: e, inlineScript: s, attributes: t });
        r.onload = () => {
          this.debug && console.log(`%c📦 Script: ${e} loaded`, "background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;"), n();
        }, r.onerror = () => {
          const a = new Error(`Script load error for ${e}`);
          l.handleError(
            "Boostify.loadScript",
            "Error loading script",
            a,
            this.debug
          ), o(a);
        }, g(r, i), s && !e && n();
      } catch (r) {
        l.handleError(
          "Boostify.loadScript",
          "Error creating script element",
          r,
          this.debug
        ), o(r);
      }
    });
  }
  /**
   * Load a stylesheet
   * @param {Object} config - Configuration options
   * @returns {Promise} - Promise that resolves when the stylesheet is loaded
   */
  async loadStyle({ url: e = "", attributes: t = [], appendTo: i = "head", inlineStyle: s = "" }) {
    return new Promise((n, o) => {
      try {
        l.assertCondition(
          e || s,
          "Boostify.loadStyle",
          'Either "url" or "inlineStyle" must be provided'
        );
        const r = E({ url: e, inlineStyle: s, attributes: t });
        r.onload = () => {
          this.debug && console.log(`%c🎨 Style: ${e} loaded`, "background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;"), n();
        }, r.onerror = () => {
          const a = new Error(`Stylesheet load error for ${e}`);
          l.handleError(
            "Boostify.loadStyle",
            "Error loading stylesheet",
            a,
            this.debug
          ), o(a);
        }, g(r, i), (s || !e) && n();
      } catch (r) {
        l.handleError(
          "Boostify.loadStyle",
          "Error creating style element",
          r,
          this.debug
        ), o(r);
      }
    });
  }
  /**
   * Destroy all events
   */
  destroyAll() {
    [...this.events].forEach((e) => {
      try {
        e.instance && typeof e.instance.destroy == "function" && e.instance.destroy();
      } catch (t) {
        l.handleError(
          "Boostify.destroyAll",
          `Error destroying ${e.type} event`,
          t,
          this.debug
        );
      }
    }), this.events = [];
  }
}
export {
  $ as default
};
