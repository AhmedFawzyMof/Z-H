"use strict";

function _typeof(o) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (o) {
            return typeof o;
          }
        : function (o) {
            return o &&
              "function" == typeof Symbol &&
              o.constructor === Symbol &&
              o !== Symbol.prototype
              ? "symbol"
              : typeof o;
          }),
    _typeof(o)
  );
}
function _regeneratorRuntime() {
  "use strict";
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime =
    function _regeneratorRuntime() {
      return e;
    };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o =
      Object.defineProperty ||
      function (t, e, r) {
        t[e] = r.value;
      },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return (
      Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0,
      }),
      t[e]
    );
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return (t[e] = r);
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return { type: "normal", arg: t.call(e, r) };
    } catch (t) {
      return { type: "throw", arg: t };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g =
    (GeneratorFunctionPrototype.prototype =
    Generator.prototype =
      Object.create(p));
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await")
          ? e.resolve(h.__await).then(
              function (t) {
                invoke("next", t, i, a);
              },
              function (t) {
                invoke("throw", t, i, a);
              }
            )
          : e.resolve(h).then(
              function (t) {
                (u.value = t), i(u);
              },
              function (t) {
                return invoke("throw", t, i, a);
              }
            );
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return (r = r
          ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg)
          : callInvokeWithMethodAndArg());
      },
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return { value: t, done: !0 };
      }
      for (n.method = i, n.arg = a; ; ) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;
        else if ("throw" === n.method) {
          if (o === h) throw ((o = s), n.arg);
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (((o = n.done ? s : l), p.arg === y)) continue;
          return { value: p.arg, done: n.done };
        }
        "throw" === p.type && ((o = s), (n.method = "throw"), (n.arg = p.arg));
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t)
      return (
        (r.delegate = null),
        ("throw" === n &&
          e.iterator["return"] &&
          ((r.method = "return"),
          (r.arg = t),
          maybeInvokeDelegate(e, r),
          "throw" === r.method)) ||
          ("return" !== n &&
            ((r.method = "throw"),
            (r.arg = new TypeError(
              "The iterator does not provide a '" + n + "' method"
            )))),
        y
      );
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type)
      return (r.method = "throw"), (r.arg = i.arg), (r.delegate = null), y;
    var a = i.arg;
    return a
      ? a.done
        ? ((r[e.resultName] = a.value),
          (r.next = e.nextLoc),
          "return" !== r.method && ((r.method = "next"), (r.arg = t)),
          (r.delegate = null),
          y)
        : a
      : ((r.method = "throw"),
        (r.arg = new TypeError("iterator result is not an object")),
        (r.delegate = null),
        y);
  }
  function pushTryEntry(t) {
    var e = { tryLoc: t[0] };
    1 in t && (e.catchLoc = t[1]),
      2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
      this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    (e.type = "normal"), delete e.arg, (t.completion = e);
  }
  function Context(t) {
    (this.tryEntries = [{ tryLoc: "root" }]),
      t.forEach(pushTryEntry, this),
      this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length; )
              if (n.call(e, o))
                return (next.value = e[o]), (next.done = !1), next;
            return (next.value = t), (next.done = !0), next;
          };
        return (i.next = i);
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return (
    (GeneratorFunction.prototype = GeneratorFunctionPrototype),
    o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0,
    }),
    o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0,
    }),
    (GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      u,
      "GeneratorFunction"
    )),
    (e.isGeneratorFunction = function (t) {
      var e = "function" == typeof t && t.constructor;
      return (
        !!e &&
        (e === GeneratorFunction ||
          "GeneratorFunction" === (e.displayName || e.name))
      );
    }),
    (e.mark = function (t) {
      return (
        Object.setPrototypeOf
          ? Object.setPrototypeOf(t, GeneratorFunctionPrototype)
          : ((t.__proto__ = GeneratorFunctionPrototype),
            define(t, u, "GeneratorFunction")),
        (t.prototype = Object.create(g)),
        t
      );
    }),
    (e.awrap = function (t) {
      return { __await: t };
    }),
    defineIteratorMethods(AsyncIterator.prototype),
    define(AsyncIterator.prototype, c, function () {
      return this;
    }),
    (e.AsyncIterator = AsyncIterator),
    (e.async = function (t, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new AsyncIterator(wrap(t, r, n, o), i);
      return e.isGeneratorFunction(r)
        ? a
        : a.next().then(function (t) {
            return t.done ? t.value : a.next();
          });
    }),
    defineIteratorMethods(g),
    define(g, u, "Generator"),
    define(g, a, function () {
      return this;
    }),
    define(g, "toString", function () {
      return "[object Generator]";
    }),
    (e.keys = function (t) {
      var e = Object(t),
        r = [];
      for (var n in e) r.push(n);
      return (
        r.reverse(),
        function next() {
          for (; r.length; ) {
            var t = r.pop();
            if (t in e) return (next.value = t), (next.done = !1), next;
          }
          return (next.done = !0), next;
        }
      );
    }),
    (e.values = values),
    (Context.prototype = {
      constructor: Context,
      reset: function reset(e) {
        if (
          ((this.prev = 0),
          (this.next = 0),
          (this.sent = this._sent = t),
          (this.done = !1),
          (this.delegate = null),
          (this.method = "next"),
          (this.arg = t),
          this.tryEntries.forEach(resetTryEntry),
          !e)
        )
          for (var r in this)
            "t" === r.charAt(0) &&
              n.call(this, r) &&
              !isNaN(+r.slice(1)) &&
              (this[r] = t);
      },
      stop: function stop() {
        this.done = !0;
        var t = this.tryEntries[0].completion;
        if ("throw" === t.type) throw t.arg;
        return this.rval;
      },
      dispatchException: function dispatchException(e) {
        if (this.done) throw e;
        var r = this;
        function handle(n, o) {
          return (
            (a.type = "throw"),
            (a.arg = e),
            (r.next = n),
            o && ((r.method = "next"), (r.arg = t)),
            !!o
          );
        }
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
            a = i.completion;
          if ("root" === i.tryLoc) return handle("end");
          if (i.tryLoc <= this.prev) {
            var c = n.call(i, "catchLoc"),
              u = n.call(i, "finallyLoc");
            if (c && u) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            } else if (c) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            } else {
              if (!u) throw new Error("try statement without catch or finally");
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            }
          }
        }
      },
      abrupt: function abrupt(t, e) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var o = this.tryEntries[r];
          if (
            o.tryLoc <= this.prev &&
            n.call(o, "finallyLoc") &&
            this.prev < o.finallyLoc
          ) {
            var i = o;
            break;
          }
        }
        i &&
          ("break" === t || "continue" === t) &&
          i.tryLoc <= e &&
          e <= i.finallyLoc &&
          (i = null);
        var a = i ? i.completion : {};
        return (
          (a.type = t),
          (a.arg = e),
          i
            ? ((this.method = "next"), (this.next = i.finallyLoc), y)
            : this.complete(a)
        );
      },
      complete: function complete(t, e) {
        if ("throw" === t.type) throw t.arg;
        return (
          "break" === t.type || "continue" === t.type
            ? (this.next = t.arg)
            : "return" === t.type
            ? ((this.rval = this.arg = t.arg),
              (this.method = "return"),
              (this.next = "end"))
            : "normal" === t.type && e && (this.next = e),
          y
        );
      },
      finish: function finish(t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t)
            return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
        }
      },
      catch: function _catch(t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var n = r.completion;
            if ("throw" === n.type) {
              var o = n.arg;
              resetTryEntry(r);
            }
            return o;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(e, r, n) {
        return (
          (this.delegate = { iterator: values(e), resultName: r, nextLoc: n }),
          "next" === this.method && (this.arg = t),
          y
        );
      },
    }),
    e
  );
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
if (localStorage.getItem("Token") === "noToken") {
  var OrderForm = document.getElementById("order");
  var inpDev = OrderForm.querySelector("#name");
  inpDev.className = "input";
  var inplabel = document.createElement("label");
  inplabel.innerText = "الاسم";
  var nameInp = document.createElement("input");
  nameInp.type = "text";
  nameInp.required = true;
  nameInp.name = "name";
  inpDev.append(inplabel, nameInp);
}
var disCount;
if (localStorage.getItem("disCount")) {
  disCount = JSON.parse(localStorage.getItem("disCount"));
} else {
  disCount = {
    code: "",
    value: 0,
  };
}
function calContainer() {
  function getTotal() {
    var temp = cart.map(function (item) {
      return parseFloat(item.price * item.quantity);
    });
    var sum = temp.reduce(function (prev, next) {
      return prev + next;
    }, 0);
    var total;
    if (disCount.code === "cashback") {
      if (disCount.value > sum) {
        var left = disCount.value - sum;
        total = 0;
        amount.value = disCount.value - left;
      } else {
        total = sum - disCount.value;
        amount.value = disCount.value;
      }
    } else {
      total = sum - disCount.value;
    }
    if (total == NaN) {
      total = sum;
    }
    if (disCount.code === "الكيان الملكي") {
      total = sum;
    }
    return total;
  }
  function getItems() {
    var temp = cart
      .map(function (item) {
        return item.name + "  ";
      })
      .join("");
    return temp;
  }
  function ShipingPrice() {
    var Thelocation = document.getElementById("location");
    var TheCity = document.getElementById("theCity").value;
    var shiping = 0;
    if (Thelocation.value !== "الفرع") {
      switch (TheCity) {
        case "الشروق":
          shiping = 20;
          break;
        case "":
          shiping = 20;
          break;
        default:
          shiping = 40;
          break;
      }
    } else {
      shiping = 0;
    }
    if (disCount.code === "الكيان الملكي") {
      shiping = 0;
    }
    return shiping;
  }
  function promoCode() {
    if (location.pathname.includes("/pay/info/cashback")) {
      return "";
    } else if (localStorage.getItem("Token") === "noToken") {
      return "";
    } else {
      return '\n        <form action="/get/promocode" method="post" id="promocode">\n          <input type="hidden" name="id" value=\''.concat(
        token,
        '\' />\n          <input type="text" name="code" placeholder="\u0643\u0648\u062F \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A" />\n          <button type="submit">\u0643\u0648\u062F \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A</button>\n        </form>\n      '
      );
    }
  }
  if (cart.length) {
    var countContainer = document.getElementById("countContainer");
    countContainer.innerHTML = "\n         "
      .concat(
        promoCode(),
        "\n          <p>\u0627\u0644\u0645\u062C\u0645\u0648\u0639: "
      )
      .concat(
        getTotal(),
        " \u062C</p> \n          <p>\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A: ( "
      )
      .concat(
        getItems(),
        " )</p>\n          <p>\u0633\u0639\u0631 \u0627\u0644\u0634\u062D\u0646: "
      )
      .concat(ShipingPrice(), " \u062C</p>\n          ");
  } else {
    var _countContainer = document.getElementById("countContainer");
    _countContainer.innerHTML =
      "<p style=\"\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%,-50%);\n        background: #fff;\n        padding: 5px;\n        width: 95%;\n        display:flex;\n        align-items: center;\n        justify-content: center;\n        text-transform: capitalize;\n        border-radius: 5px;\n        \">\u0639\u0631\u0628\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0641\u0627\u0631\u063A\u0629 <a href='/' style='margin-left: 5px;\n    text-decoration: none;\n    color: #2660ff;'> \u0627\u0630\u0647\u0628 \u0644\u0644\u062A\u0633\u0648\u0642</a> </p>";
  }
}
var myForm = document.getElementById("order");
function ShipingPrice() {
  var TheCity = document.getElementById("theCity").value;
  var shiping = 0;
  if (TheCity === "الشروق") {
    shiping = 20;
  } else {
    shiping = 40;
  }
  return shiping;
}
function getTotal() {
  var temp = cart.map(function (item) {
    return parseFloat(item.price * item.quantity);
  });
  var sum = temp.reduce(function (prev, next) {
    return prev + next;
  }, 0);
  var total;
  if (disCount.code === "cashback") {
    if (disCount.value > sum) {
      var left = disCount.value - sum;
      total = 0;
      amount.value = disCount.value - left;
    } else {
      total = sum - disCount.value;
      amount.value = disCount.value;
    }
  } else {
    total = sum - disCount.value;
  }
  if (total < 0) {
    total = sum;
  } else if (total == NaN) {
    total = sum;
  }
  return total;
}
function notShrouk() {
  calContainer();
  ShipingPrice();
}
function addToOrder() {
  var OrderForm = document.getElementById("order");
  var tokenInp = document.createElement("input");
  tokenInp.type = "hidden";
  tokenInp.name = "user";
  tokenInp.value = JSON.parse(token);
  var cartInp = document.createElement("input");
  cartInp.type = "hidden";
  cartInp.name = "cart";
  cartInp.value = JSON.stringify(cart);
  var disCountInp = document.createElement("input");
  disCountInp.type = "hidden";
  disCountInp.name = "discount";
  disCountInp.value = JSON.stringify(disCount);
  OrderForm.append(tokenInp);
  OrderForm.append(cartInp);
  OrderForm.append(disCountInp);
}
function getLoc() {
  var Thelocation = document.getElementById("location");
  var loc = document.querySelector(".location");
  var st = document.getElementById("st");
  var bu = document.getElementById("bu");
  var fo = document.getElementById("fo");
  if (Thelocation.value === "الفرع") {
    var TheCity = document.getElementById("theCity");
    TheCity.value = "الشروق";
    loc.outerHTML =
      '<div class="location"><i class="bx bx-current-location"></i> <a href="https://maps.google.com/maps?q=30.168442000000002%2C31.647655600000007&z=17&hl=ar" target="_blank">مكان الفرع</a></div>';
    st.value = "100م";
    bu.value = "138م";
    fo.value = "طابق 0";
    st.setAttribute("readonly", true);
    bu.setAttribute("readonly", true);
    fo.setAttribute("readonly", true);
    notShrouk();
  } else {
    notShrouk();
    loc.outerHTML = "<div class='location'></div>";
    st.value = "";
    bu.value = "";
    fo.value = "";
    st.removeAttribute("readonly");
    bu.removeAttribute("readonly");
    fo.removeAttribute("readonly");
  }
}
function autoFill() {
  return _autoFill.apply(this, arguments);
}
function _autoFill() {
  _autoFill = _asyncToGenerator(
    /*#__PURE__*/ _regeneratorRuntime().mark(function _callee() {
      var Token, st, bu, fo, ph, getUsersData, res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1)
          switch ((_context.prev = _context.next)) {
            case 0:
              Token = localStorage.getItem("Token");
              if (!(Token !== "noToken")) {
                _context.next = 17;
                break;
              }
              st = document.getElementById("st");
              bu = document.getElementById("bu");
              fo = document.getElementById("fo");
              ph = document.getElementById("ph");
              _context.next = 8;
              return fetch("/get/User/".concat(Token));
            case 8:
              getUsersData = _context.sent;
              _context.next = 11;
              return getUsersData.json();
            case 11:
              res = _context.sent;
              st.value = res.user.street;
              bu.value = res.user.building;
              fo.value = res.user.floor;
              ph.value = res.user.phone;
              console.log(res);
            case 17:
            case "end":
              return _context.stop();
          }
      }, _callee);
    })
  );
  return _autoFill.apply(this, arguments);
}
autoFill();
window.addEventListener("pageshow", function (event) {
  var historyTraversal =
    event.persisted ||
    (typeof window.performance != "undefined" &&
      window.performance.navigation.type === 2);
  if (historyTraversal) {
    // Handle page restore.
    window.location.reload();
  }
});
