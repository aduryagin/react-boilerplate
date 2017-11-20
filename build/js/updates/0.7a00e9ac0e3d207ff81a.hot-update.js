exports.id = 0;
exports.modules = {

/***/ "./source/server/router.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom_server__ = __webpack_require__("react-dom/server");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__client_App__ = __webpack_require__("./source/client/App.js");
var _jsxFileName = "/Users/aiduryagin/Desktop/Projects/react-boilerplate/source/server/router.js";




const applicationRouter = Object(__WEBPACK_IMPORTED_MODULE_0_express__["Router"])();
applicationRouter.get('*', (req, res, next) => {
  try {
    res.write('<!doctype html><html lang="en"><head></head><body><div id="app">');
    const stream = __WEBPACK_IMPORTED_MODULE_1_react_dom_server___default.a.renderToNodeStream(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__client_App__["a" /* default */], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 11
      },
      __self: this
    }));
    stream.pipe(res, {
      end: false
    });
    stream.on('end', () => {
      res.write('</div><script src="./js/client.js"></script></body></html>');
      res.end();
    });
  } catch (error) {
    next(error);
  }
});
/* harmony default export */ __webpack_exports__["default"] = (applicationRouter);

/***/ })

};