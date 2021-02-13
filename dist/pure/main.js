(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\HADEKHA\Desktop\pure\src\main.ts */"zUnb");


/***/ }),

/***/ "5FE4":
/*!****************************************************!*\
  !*** ./src/app/redux/side-effects/auth-effects.ts ***!
  \****************************************************/
/*! exports provided: AuthEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthEffects", function() { return AuthEffects; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/auth-actions */ "DOCJ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/effects */ "9jGm");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/environments/environment */ "AytR");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ "l7P3");













class AuthEffects {
    constructor(actions$, http, router, store) {
        this.actions$ = actions$;
        this.http = http;
        this.router = router;
        this.store = store;
        this.loginStart = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["ofType"])(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["LOGIN_START"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["switchMap"])((action) => {
            let form = { NIM: action.payload.nim, Password: action.payload.password, Role: action.payload.role };
            let loginform = JSON.stringify(form);
            let header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpHeaders"]();
            console.log("effect loginform", loginform);
            header.append('content-type', 'application/json');
            return this.http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].api_url}/login`, loginform, { headers: header })
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])((x) => {
                let id = x["ID"];
                let token = x["Token"];
                let expiresAt = x["ExpiresAt"];
                let role = x["Role"];
                let expiresAtDate = new Date(new Date().getTime() + expiresAt);
                this.saveToLocal(id, token, expiresAtDate, role);
                this.autoLogout(expiresAt);
                return new _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["LoginSuccess"]({ id: id, token: token, expiresAtDate: expiresAtDate, role: role });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(err => {
                console.log("CATCH ERROR LOGIN", err.error);
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(new _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["SendInfo"](err.error));
            }));
        }));
        this.autoLogin = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["ofType"])(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["AUTO_LOGIN"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["switchMap"])((action) => {
            console.log("login success");
            if (localStorage.getItem("userData")) {
                let userData = JSON.parse(localStorage.getItem("userData"));
                let id = userData["ID"];
                let token = userData["Token"];
                let expiresatdate = userData["ExpiresAtDate"];
                let role = userData["Role"];
                console.log("role", role);
                let duration = new Date(expiresatdate).getTime() - new Date().getTime();
                this.autoLogout(duration);
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(new _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["LoginSuccess"]({ id: id, token: token, expiresAtDate: expiresatdate, role: role }));
            }
            else {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])();
            }
        }));
        this.registStart = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["ofType"])(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["REGIST_START"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["switchMap"])((action) => {
            let header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpHeaders"]();
            header.append('content-type', 'application/json');
            let jsonData = JSON.stringify({ Rumah: action.payload["Rumah"], Nama: action.payload["Nama"], NIM: action.payload["NIM"], Password: action.payload["Password"], Role: action.payload["Role"] });
            return this.http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].api_url}/register`, jsonData, { headers: header })
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])((x) => {
                let m = x["MESSAGE"];
                return new _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["SendInfo"](m);
            }, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(new _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["SendInfo"](err.error));
            })));
        }));
        // @Effect({dispatch:false})
        // redirectLogin = this.actions$.pipe(
        //     ofType(fromAuthActions.LOGIN_SUCCESS),
        //     tap(()=>{
        //         alert("executed")
        //         this.router.navigateByUrl("/member/dashboard")
        //     })
        // )
        this.redirectLogout = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["ofType"])(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["LOGOUT_START"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(() => {
            this.removeLocal();
            if (this.logoutTimer) {
                clearTimeout(this.logoutTimer);
            }
            this.router.navigateByUrl("/member/login");
        }));
    }
    saveToLocal(id, token, expiresatdate, role) {
        let userData = {
            ID: id,
            Token: token,
            ExpiresAtDate: expiresatdate,
            Role: role
        };
        localStorage.setItem("userData", JSON.stringify(userData));
    }
    removeLocal() {
        localStorage.removeItem("userData");
    }
    autoLogout(duration) {
        console.log("function called");
        this.logoutTimer = setTimeout(() => {
            console.log("the timer is executed");
            this.store.dispatch(new _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["LogoutStart"]());
        }, duration);
        console.log(duration);
    }
}
AuthEffects.ɵfac = function AuthEffects_Factory(t) { return new (t || AuthEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Actions"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_9__["Store"])); };
AuthEffects.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: AuthEffects, factory: AuthEffects.ɵfac });
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])()
], AuthEffects.prototype, "loginStart", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])()
], AuthEffects.prototype, "autoLogin", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])()
], AuthEffects.prototype, "registStart", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false })
], AuthEffects.prototype, "redirectLogout", void 0);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](AuthEffects, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"]
    }], function () { return [{ type: _ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Actions"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClient"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"] }, { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_9__["Store"] }]; }, { loginStart: [], autoLogin: [], registStart: [], redirectLogout: [] }); })();


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    api_url: "http://localhost:8080"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "BX34":
/*!*********************************************!*\
  !*** ./src/app/shared/nav/nav.component.ts ***!
  \*********************************************/
/*! exports provided: NavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavComponent", function() { return NavComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class NavComponent {
    constructor() { }
    ngOnInit() {
    }
}
NavComponent.ɵfac = function NavComponent_Factory(t) { return new (t || NavComponent)(); };
NavComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NavComponent, selectors: [["app-nav"]], decls: 12, vars: 0, consts: [[1, "navbar", "navbar-expand", "navbar-light", "bg-light", "flex-column", "flex-md-row", "pipe-navbar", "justify-md-content-between"], ["routerLink", "/landing-page", 1, "navbar-brand"], ["src", "https://lngacademy.weebly.com/uploads/2/0/8/5/20853058/editor/lng-academy-logo-only.png?1583571522", "width", "50", "height", "30", 1, "d-inline-block", "align-top"], [1, "navbar-nav-scroll", "ml-md-auto"], [1, "navbar-nav", "pipe-navbar-nav"], [1, "nav-item"], ["routerLink", "/member", "rel", "noopener", 1, "nav-link"], ["routerLink", "/admin", "rel", "noopener", 1, "nav-link"]], template: function NavComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "nav", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Kokesma");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "ul", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "li", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Member");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "li", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Admin");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], styles: [".pipe-navbar[_ngcontent-%COMP%]   .navbar-nav-scroll[_ngcontent-%COMP%] {\r\n    max-width: 100%;\r\n    height: 2.4rem;\r\n\r\n    overflow: hidden;\r\n  }\r\n@media (max-width: 991.98px) {\r\n\r\n\r\n  .pipe-navbar[_ngcontent-%COMP%]   .navbar-nav-scroll[_ngcontent-%COMP%]   .navbar-nav[_ngcontent-%COMP%] {\r\n    padding-bottom: 2rem;\r\n    overflow-x: auto;\r\n    white-space: nowrap;\r\n    -webkit-overflow-scrolling: touch;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  @supports (position:sticky) {\r\n    .pipe-navbar[_ngcontent-%COMP%] {\r\n      position: sticky;\r\n      top: 0;\r\n      z-index: 1071;\r\n\r\n    }\r\n  }\r\n}\r\n@media (max-width: 576px) {\r\n  .navbar-nav-scroll[_ngcontent-%COMP%] {\r\n    overflow-x: auto;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    font-size: 0.875rem;\r\n    -webkit-overflow-scrolling: touch;\r\n    -webkit-box-orient: horizontal;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5hdi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0g7SUFDSSxlQUFlO0lBQ2YsY0FBYzs7SUFFZCxnQkFBZ0I7RUFDbEI7QUFHRjs7O0VBR0U7SUFDRSxvQkFBb0I7SUFDcEIsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixpQ0FBaUM7RUFDbkM7QUFDRjtBQUVBO0VBQ0U7SUFDRTtNQUVFLGdCQUFnQjtNQUNoQixNQUFNO01BQ04sYUFBYTs7SUFFZjtFQUNGO0FBQ0Y7QUFFQTtFQUNFO0lBQ0UsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLGlDQUFpQztJQUNqQyw4QkFBOEI7RUFFaEM7QUFDRiIsImZpbGUiOiJuYXYuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIG5hdiB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4jbWVudSBhIHtcclxuICAgIGNvbG9yOmJsYWNrO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgbWFyZ2luLWxlZnQ6MjBweDtcclxufVxyXG5cclxuI21lbnUgYTpob3ZlcntcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgY29sb3I6d2hpdGU7XHJcbn0gKi9cclxuLnBpcGUtbmF2YmFyIC5uYXZiYXItbmF2LXNjcm9sbCB7XHJcbiAgICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDIuNHJlbTtcclxuXHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIH1cclxuXHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogOTkxLjk4cHgpIHtcclxuXHJcblxyXG4gIC5waXBlLW5hdmJhciAubmF2YmFyLW5hdi1zY3JvbGwgLm5hdmJhci1uYXYge1xyXG4gICAgcGFkZGluZy1ib3R0b206IDJyZW07XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIEBzdXBwb3J0cyAoKHBvc2l0aW9uOiAtd2Via2l0LXN0aWNreSkgb3IgKHBvc2l0aW9uOnN0aWNreSkpIHtcclxuICAgIC5waXBlLW5hdmJhciB7XHJcbiAgICAgIHBvc2l0aW9uOiAtd2Via2l0LXN0aWNreTtcclxuICAgICAgcG9zaXRpb246IHN0aWNreTtcclxuICAgICAgdG9wOiAwO1xyXG4gICAgICB6LWluZGV4OiAxMDcxO1xyXG5cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA1NzZweCkge1xyXG4gIC5uYXZiYXItbmF2LXNjcm9sbCB7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xyXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiBob3Jpem9udGFsO1xyXG4gICAgLXdlYmtpdC1ib3gtZGlyZWN0aW9uOiBub3JtYWw7XHJcbiAgfVxyXG59XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NavComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-nav',
                templateUrl: './nav.component.html',
                styleUrls: ['./nav.component.css']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "CG0s":
/*!******************************************!*\
  !*** ./src/app/error/error.component.ts ***!
  \******************************************/
/*! exports provided: ErrorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorComponent", function() { return ErrorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class ErrorComponent {
    constructor() { }
    ngOnInit() {
    }
}
ErrorComponent.ɵfac = function ErrorComponent_Factory(t) { return new (t || ErrorComponent)(); };
ErrorComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ErrorComponent, selectors: [["app-error"]], decls: 12, vars: 0, consts: [["id", "topimage", 2, "display", "flex", "justify-content", "center", "margin-top", "10px"], ["src", "https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.upp-prod-us.s3.amazonaws.com%2Fb325d2e4-84c3-11e9-b861-54ee436f9768?fit=scale-down&source=next&width=700", 2, "display", "block"], [2, "text-align", "center", "margin-bottom", "25px"], [2, "text-align", "center"], ["routerLink", "/landing-page"]], template: function ErrorComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "picture : Liverpool FC won UEFA Champions League in 2018");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "404");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "tidak ada halaman disini. Silahkan kembali ke landing page");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "kembali ke landing-page");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], styles: ["@media only screen and (max-width:700px){\r\n    #topimage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{\r\n        width:90vw;\r\n    }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9yLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSTtRQUNJLFVBQVU7SUFDZDtBQUNKIiwiZmlsZSI6ImVycm9yLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzAwcHgpe1xyXG4gICAgI3RvcGltYWdlIGltZ3tcclxuICAgICAgICB3aWR0aDo5MHZ3O1xyXG4gICAgfVxyXG59Il19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ErrorComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-error',
                templateUrl: './error.component.html',
                styleUrls: ['./error.component.css']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "DOCJ":
/*!***********************************************!*\
  !*** ./src/app/redux/actions/auth-actions.ts ***!
  \***********************************************/
/*! exports provided: LOGIN_START, LOGIN_SUCCESS, LOGOUT_START, AUTO_LOGIN, REGIST_START, SEND_INFO, DELETE_INFO, DeleteInfo, SendInfo, RegistStart, LoginStart, LoginSuccess, LogoutStart, AutoLogin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGIN_START", function() { return LOGIN_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGIN_SUCCESS", function() { return LOGIN_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGOUT_START", function() { return LOGOUT_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTO_LOGIN", function() { return AUTO_LOGIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGIST_START", function() { return REGIST_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEND_INFO", function() { return SEND_INFO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DELETE_INFO", function() { return DELETE_INFO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteInfo", function() { return DeleteInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendInfo", function() { return SendInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegistStart", function() { return RegistStart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginStart", function() { return LoginStart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginSuccess", function() { return LoginSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogoutStart", function() { return LogoutStart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutoLogin", function() { return AutoLogin; });
const LOGIN_START = "[Auth] LOGIN_START";
const LOGIN_SUCCESS = "[Auth] LOGIN_SUCCESS";
const LOGOUT_START = "[Auth] LOGOUT_START";
const AUTO_LOGIN = "[Auth] AUTO_LOGIN";
const REGIST_START = "[Auth] REGIST_START";
const SEND_INFO = "[Auth] SEND_INFO";
const DELETE_INFO = "[Auth] DELETE_INFO";
class DeleteInfo {
    constructor() {
        this.type = DELETE_INFO;
    }
}
class SendInfo {
    constructor(payload) {
        this.payload = payload;
        this.type = SEND_INFO;
    }
}
class RegistStart {
    constructor(payload) {
        this.payload = payload;
        this.type = REGIST_START;
    }
}
class LoginStart {
    constructor(payload) {
        this.payload = payload;
        this.type = LOGIN_START;
    }
}
class LoginSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOGIN_SUCCESS;
    }
}
class LogoutStart {
    constructor() {
        this.type = LOGOUT_START;
    }
}
class AutoLogin {
    constructor() {
        this.type = AUTO_LOGIN;
    }
}


/***/ }),

/***/ "J0wG":
/*!**********************************************!*\
  !*** ./src/app/redux/reducer/app-reducer.ts ***!
  \**********************************************/
/*! exports provided: appReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appReducer", function() { return appReducer; });
/* harmony import */ var _tomas_reducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tomas-reducer */ "mj5e");
/* harmony import */ var _auth_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth-reducer */ "vzOs");


const appReducer = {
    tomas: _tomas_reducer__WEBPACK_IMPORTED_MODULE_0__["tomasReducer"],
    auth: _auth_reducer__WEBPACK_IMPORTED_MODULE_1__["authReducer"],
};


/***/ }),

/***/ "PCNd":
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _nav_nav_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nav/nav.component */ "BX34");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ "tk/3");







class SharedModule {
}
SharedModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: SharedModule });
SharedModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function SharedModule_Factory(t) { return new (t || SharedModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]
        ], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](SharedModule, { declarations: [_nav_nav_component__WEBPACK_IMPORTED_MODULE_2__["NavComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"],
        _nav_nav_component__WEBPACK_IMPORTED_MODULE_2__["NavComponent"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SharedModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_nav_nav_component__WEBPACK_IMPORTED_MODULE_2__["NavComponent"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]
                ],
                exports: [
                    _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"],
                    _nav_nav_component__WEBPACK_IMPORTED_MODULE_2__["NavComponent"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _redux_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./redux/actions/auth-actions */ "DOCJ");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _shared_nav_nav_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/nav/nav.component */ "BX34");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");






class AppComponent {
    constructor(store) {
        this.store = store;
        this.title = 'pure';
    }
    ngOnInit() {
        console.log("app component init");
        this.store.dispatch(new _redux_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__["AutoLogin"]());
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 2, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-nav");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "router-outlet");
    } }, directives: [_shared_nav_nav_component__WEBPACK_IMPORTED_MODULE_3__["NavComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.css']
            }]
    }], function () { return [{ type: _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"] }]; }, null); })();


/***/ }),

/***/ "X9bQ":
/*!************************************************!*\
  !*** ./src/app/redux/actions/tomas-actions.ts ***!
  \************************************************/
/*! exports provided: TOMAS_ADM_INIT, TOMAS_ADM_SUCCESS, TOMAS_ADD_ITEM, TOMAS_ADD_MEMTOMAS, TOMAS_SEND_INFO, TOMAS_ADD_ADMTOMAS, TOMAS_MEM_INIT, TOMAS_MEM_SUCCESS, TOMAS_ADM_MONITOR, TOMAS_ADM_MONITOR_SUCCESS, TOMAS_ADM_BACKUPRESET, TOMAS_DELETE_INFO, TomasDeleteInfo, TomasAdmBackupReset, TomasAdmMonitor, TomasAdmMonitorSuccess, TomasMemInit, TomasMemSuccess, TomasAddAdmTomas, TomasAddMemTomas, TomasSendInfo, TomasAdmInit, TomasAdmSuccess, TomasAddItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADM_INIT", function() { return TOMAS_ADM_INIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADM_SUCCESS", function() { return TOMAS_ADM_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADD_ITEM", function() { return TOMAS_ADD_ITEM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADD_MEMTOMAS", function() { return TOMAS_ADD_MEMTOMAS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_SEND_INFO", function() { return TOMAS_SEND_INFO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADD_ADMTOMAS", function() { return TOMAS_ADD_ADMTOMAS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_MEM_INIT", function() { return TOMAS_MEM_INIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_MEM_SUCCESS", function() { return TOMAS_MEM_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADM_MONITOR", function() { return TOMAS_ADM_MONITOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADM_MONITOR_SUCCESS", function() { return TOMAS_ADM_MONITOR_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_ADM_BACKUPRESET", function() { return TOMAS_ADM_BACKUPRESET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOMAS_DELETE_INFO", function() { return TOMAS_DELETE_INFO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasDeleteInfo", function() { return TomasDeleteInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAdmBackupReset", function() { return TomasAdmBackupReset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAdmMonitor", function() { return TomasAdmMonitor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAdmMonitorSuccess", function() { return TomasAdmMonitorSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasMemInit", function() { return TomasMemInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasMemSuccess", function() { return TomasMemSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAddAdmTomas", function() { return TomasAddAdmTomas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAddMemTomas", function() { return TomasAddMemTomas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasSendInfo", function() { return TomasSendInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAdmInit", function() { return TomasAdmInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAdmSuccess", function() { return TomasAdmSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasAddItem", function() { return TomasAddItem; });
const TOMAS_ADM_INIT = "[Tomas] TOMAS_ADM_INIT";
const TOMAS_ADM_SUCCESS = "[Tomas] TOMAS_ADM_SUCCESS";
const TOMAS_ADD_ITEM = "[Tomas] TOMAS_ADD_ITEM";
const TOMAS_ADD_MEMTOMAS = "[Tomas] TOMAS_ADD_MEMTOMAS";
const TOMAS_SEND_INFO = "[Tomas] TOMAS_SEND_INFO";
const TOMAS_ADD_ADMTOMAS = "[Tomas] TOMAS_ADD_ADMTOMAS";
const TOMAS_MEM_INIT = "[Tomas] TOMAS_MEM_INIT";
const TOMAS_MEM_SUCCESS = "[Tomas] TOMAS_MEM_SUCCESS";
const TOMAS_ADM_MONITOR = "[Tomas] TOMAS_ADM_MONITOR";
const TOMAS_ADM_MONITOR_SUCCESS = "[Tomas] TOMAS_ADM_MONITOR_SUCCESS";
const TOMAS_ADM_BACKUPRESET = "[Tomas] TOMAS_ADM_BACKUPRESET";
const TOMAS_DELETE_INFO = "[Tomas] TOMAS_DELETE_INFO";
// export const TOMAS_MEM_JOURNAL = "[Tomas] TOMAS_MEM_JOURNAL"
// export const TOMAS_MEM_JOURNAL_SUCCESS = "[Tomas] TOMAS_MEM_JOURNAL_SUCCESS"
// export const TOMAS_ADM_CURSTOCK = "[Tomas] TOMAS_ADM_CURSTOCK"
// export const TOMAS_ADM_CURSTOCK_SUCCESS = "[Tomas] TOMAS_ADM_CURSTOCK_SUCCESS"
// export class TomasAdmCurstock implements Action{
//     readonly type:string = TOMAS_ADM_CURSTOCK
//     constructor(public payload:string){}
// }
// export class TomasAdmCurstockSuccess implements Action{
//     readonly type:string = TOMAS_ADM_CURSTOCK_SUCCESS
//     constructor(public payload:{curstock:Tomas[]}){}
// }
// export class TomasMemJournalSuccess implements Action{
//     readonly type:string = TOMAS_MEM_JOURNAL
//     constructor(public payload:{journal:Tomas[]}){}
// }
// export class TomasMemJournal implements Action{
//     readonly type:string = TOMAS_MEM_JOURNAL
//     constructor(){}
// }
class TomasDeleteInfo {
    constructor() {
        this.type = TOMAS_DELETE_INFO;
    }
}
class TomasAdmBackupReset {
    constructor() {
        this.type = TOMAS_ADM_BACKUPRESET;
    }
}
class TomasAdmMonitor {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_ADM_MONITOR;
    }
}
class TomasAdmMonitorSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_ADM_MONITOR_SUCCESS;
    }
}
class TomasMemInit {
    constructor() {
        this.type = TOMAS_MEM_INIT;
    }
}
class TomasMemSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_MEM_SUCCESS;
    }
}
class TomasAddAdmTomas {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_ADD_ADMTOMAS;
    }
}
class TomasAddMemTomas {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_ADD_MEMTOMAS;
    }
}
class TomasSendInfo {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_SEND_INFO;
    }
}
class TomasAdmInit {
    constructor() {
        this.type = TOMAS_ADM_INIT;
    }
}
class TomasAdmSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_ADM_SUCCESS;
    }
}
class TomasAddItem {
    constructor(payload) {
        this.payload = payload;
        this.type = TOMAS_ADD_ITEM;
    }
}


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/effects */ "9jGm");
/* harmony import */ var _landing_page_landing_page_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./landing-page/landing-page.component */ "mSt+");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shared/shared.module */ "PCNd");
/* harmony import */ var _redux_reducer_app_reducer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./redux/reducer/app-reducer */ "J0wG");
/* harmony import */ var _redux_side_effects_auth_effects__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./redux/side-effects/auth-effects */ "5FE4");
/* harmony import */ var _redux_side_effects_tomas_effects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./redux/side-effects/tomas-effects */ "apNC");
/* harmony import */ var _http_interceptor_auth_interceptor__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./http-interceptor/auth-interceptor */ "x0Ib");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _error_error_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./error/error.component */ "CG0s");

















class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [{ provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_12__["HTTP_INTERCEPTORS"], useClass: _http_interceptor_auth_interceptor__WEBPACK_IMPORTED_MODULE_11__["AuthInterceptorService"], multi: true }], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["StoreModule"].forRoot(_redux_reducer_app_reducer__WEBPACK_IMPORTED_MODULE_8__["appReducer"]),
            _ngrx_effects__WEBPACK_IMPORTED_MODULE_5__["EffectsModule"].forRoot([_redux_side_effects_auth_effects__WEBPACK_IMPORTED_MODULE_9__["AuthEffects"], _redux_side_effects_tomas_effects__WEBPACK_IMPORTED_MODULE_10__["TomasEffects"]]),
            _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _landing_page_landing_page_component__WEBPACK_IMPORTED_MODULE_6__["LandingPageComponent"],
        _error_error_component__WEBPACK_IMPORTED_MODULE_13__["ErrorComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"], _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["StoreRootModule"], _ngrx_effects__WEBPACK_IMPORTED_MODULE_5__["EffectsRootModule"], _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                    _landing_page_landing_page_component__WEBPACK_IMPORTED_MODULE_6__["LandingPageComponent"],
                    _error_error_component__WEBPACK_IMPORTED_MODULE_13__["ErrorComponent"],
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
                    _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["StoreModule"].forRoot(_redux_reducer_app_reducer__WEBPACK_IMPORTED_MODULE_8__["appReducer"]),
                    _ngrx_effects__WEBPACK_IMPORTED_MODULE_5__["EffectsModule"].forRoot([_redux_side_effects_auth_effects__WEBPACK_IMPORTED_MODULE_9__["AuthEffects"], _redux_side_effects_tomas_effects__WEBPACK_IMPORTED_MODULE_10__["TomasEffects"]]),
                    _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
                ],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]],
                providers: [{ provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_12__["HTTP_INTERCEPTORS"], useClass: _http_interceptor_auth_interceptor__WEBPACK_IMPORTED_MODULE_11__["AuthInterceptorService"], multi: true }]
            }]
    }], null, null); })();


/***/ }),

/***/ "apNC":
/*!*****************************************************!*\
  !*** ./src/app/redux/side-effects/tomas-effects.ts ***!
  \*****************************************************/
/*! exports provided: TomasEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TomasEffects", function() { return TomasEffects; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "9jGm");
/* harmony import */ var _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/tomas-actions */ "X9bQ");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/environments/environment */ "AytR");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ "l7P3");













class TomasEffects {
    constructor(actions$, http, router, store) {
        this.actions$ = actions$;
        this.http = http;
        this.router = router;
        this.store = store;
        this.adminInit = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TOMAS_ADM_INIT"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])((action) => {
            return this.http.get(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].api_url}/tomas/init`)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])((x) => {
                let home = x["Home"];
                let name = x["ItemsName"];
                let id = x["Items"];
                return new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasAdmSuccess"]({ admHome: home, admItemName: name, admItemID: id });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](err.error));
            }));
        }));
        this.addItem = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TOMAS_ADD_ITEM"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])((action) => {
            let jsonData = JSON.stringify({ Harga: action.payload["Harga"], Nama: action.payload["Nama"], Image: action.payload["Image"] });
            let header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]();
            header.append('content-type', 'application/json');
            return this.http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].api_url}/tomas/additem`, jsonData, { headers: header })
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])((x) => {
                let message = x["MESSAGE"];
                return new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](message);
            }, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](err.error));
            })));
        }));
        this.addMemTomas = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TOMAS_ADD_MEMTOMAS"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])((action) => {
            let header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]();
            header.append('content-type', 'application/json');
            return this.http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].api_url}/tomas/meminputtomas`, action.payload, { headers: header })
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])((x) => {
                let message = x["MESSAGE"];
                return new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](message);
            }, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](err.error));
            })));
        }));
        this.addAdmTomas = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TOMAS_ADD_ADMTOMAS"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])((action) => {
            let jsonData = JSON.stringify({ House: action.payload["House"], ItemID: action.payload["ItemID"], Batch: action.payload["Batch"], Qty: action.payload["Qty"] });
            let header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]();
            header.append('content-type', 'application/json');
            return this.http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].api_url}/tomas/adminputtomas`, jsonData, { headers: header })
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])((x) => {
                let message = x["MESSAGE"];
                return new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](message);
            }, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](err.error));
            })));
        }));
        this.memInit = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TOMAS_MEM_INIT"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])((action) => {
            return this.http.get(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].api_url}/tomas/meminit`)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])((x) => {
                let nama = x["Nama"];
                let nim = x["NIM"];
                let rumah = x["Rumah"];
                let curstock = x["Curstock"];
                let journal = x["Journal"];
                console.log("meminit", x);
                return new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasMemSuccess"]({ nama: nama, nim: nim, rumah: rumah, curstock: curstock, journal: journal });
            }, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](err.error));
            })));
        }));
        this.monitor = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TOMAS_ADM_MONITOR"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])((action) => {
            let header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]();
            header.append('content-type', 'application/json');
            let housejson = JSON.stringify({ Rumah: action.payload });
            return this.http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].api_url}/tomas/admmonitor`, housejson, { headers: header })
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])((x) => {
                console.log("effect mon", x);
                let monuser = x["User"];
                let monjournal = x["Journal"];
                let moncurstock = x["Curstock"];
                let monstocklist = x["Stock"];
                let sum = x["Sum"];
                return new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasAdmMonitorSuccess"]({ monuser: monuser, monjournal: monjournal, moncurstock: moncurstock, monstocklist: monstocklist, sum: sum });
            }, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](err.error));
            })));
        }));
        this.backupReset = this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TOMAS_ADM_BACKUPRESET"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])((action) => {
            return this.http.get(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].api_url}/tomas/backupreset`)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])((x) => {
                let message = x["MESSAGE"];
                return new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](message);
            }, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])((err) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(new _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_3__["TomasSendInfo"](err.error));
            })));
        }));
    }
}
TomasEffects.ɵfac = function TomasEffects_Factory(t) { return new (t || TomasEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Actions"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_9__["Store"])); };
TomasEffects.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({ token: TomasEffects, factory: TomasEffects.ɵfac });
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
], TomasEffects.prototype, "adminInit", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
], TomasEffects.prototype, "addItem", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
], TomasEffects.prototype, "addMemTomas", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
], TomasEffects.prototype, "addAdmTomas", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
], TomasEffects.prototype, "memInit", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
], TomasEffects.prototype, "monitor", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
], TomasEffects.prototype, "backupReset", void 0);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵsetClassMetadata"](TomasEffects, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_5__["Injectable"]
    }], function () { return [{ type: _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Actions"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"] }, { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_9__["Store"] }]; }, { adminInit: [], addItem: [], addMemTomas: [], addAdmTomas: [], memInit: [], monitor: [], backupReset: [] }); })();


/***/ }),

/***/ "mSt+":
/*!********************************************************!*\
  !*** ./src/app/landing-page/landing-page.component.ts ***!
  \********************************************************/
/*! exports provided: LandingPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandingPageComponent", function() { return LandingPageComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


class LandingPageComponent {
    constructor() { }
    ngOnInit() {
    }
}
LandingPageComponent.ɵfac = function LandingPageComponent_Factory(t) { return new (t || LandingPageComponent)(); };
LandingPageComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LandingPageComponent, selectors: [["app-landing-page"]], decls: 27, vars: 0, consts: [["id", "container"], [2, "text-align", "center", "margin-top", "10vh"], ["id", "topheader"], ["id", "center"], [2, "text-align", "left", "width", "500px"], [2, "color", "rgb(22, 87, 206)", "font-weight", "bolder"], [2, "color", "indianred", "font-weight", "bolder"], [2, "color", "rgb(3, 121, 72)", "font-weight", "bolder"]], template: function LandingPageComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Kokesma LNG Academy");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Kepengurusan 2021/2022");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Misi kami adalah ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "1. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Melaksanakan kerja");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " yang maksimal pada masing-masing bagian dengan mengacu pada hasil evaluasi kerja dari periode ke periode.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "2. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Memberi pelatihan");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, " baik pengelolaan koperasi dagang maupun simpan pinjam dalam bentuk seminar dan practical.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "3. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Membuat kajian lebih lanjut");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " terhadap review negatif yang diaspirasikan oleh anggota terhadap kinerja maupun program kerja demi kemaslahatan bersama.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["#topheader[_ngcontent-%COMP%] {\r\n    margin-top: 5vh;\r\n    text-align: center;\r\n}\r\n\r\n#center[_ngcontent-%COMP%] {\r\n    display: flex;\r\n    justify-content: center;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxhbmRpbmctcGFnZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksZUFBZTtJQUNmLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYix1QkFBdUI7QUFDM0IiLCJmaWxlIjoibGFuZGluZy1wYWdlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjdG9waGVhZGVyIHtcclxuICAgIG1hcmdpbi10b3A6IDV2aDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuI2NlbnRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbn0iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LandingPageComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-landing-page',
                templateUrl: './landing-page.component.html',
                styleUrls: ['./landing-page.component.css']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "mj5e":
/*!************************************************!*\
  !*** ./src/app/redux/reducer/tomas-reducer.ts ***!
  \************************************************/
/*! exports provided: tomasReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tomasReducer", function() { return tomasReducer; });
/* harmony import */ var _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/tomas-actions */ "X9bQ");

const initialState = {
    nama: null,
    nim: null,
    rumah: null,
    journal: null,
    curstocklist: null,
    admHome: null,
    admItemsName: null,
    admItemsID: null,
    info: "null",
    monuser: null,
    monjournal: null,
    moncurstock: null,
    monstocklist: null,
    sum: null,
};
function tomasReducer(state = initialState, action) {
    switch (action.type) {
        // case fromTomasActions.TOMAS_ADM_CURSTOCK:
        //     return state
        // case fromTomasActions.TOMAS_ADM_CURSTOCK_SUCCESS:
        //     return {
        //         ...state,
        //         curstocklist:action.payload["curstock"]
        //     }
        // case fromTomasActions.TOMAS_MEM_JOURNAL:
        //     return state
        // case fromTomasActions.TOMAS_MEM_JOURNAL_SUCCESS:
        //     return {
        //         ...state,
        //         journal:action.payload["journal"]
        //     }
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_DELETE_INFO"]:
            return Object.assign(Object.assign({}, state), { info: "null" });
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADM_BACKUPRESET"]:
            return state;
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADM_MONITOR"]:
            return state;
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADM_MONITOR_SUCCESS"]:
            return Object.assign(Object.assign({}, state), { monuser: action.payload["monuser"], monjournal: action.payload["monjournal"], moncurstock: action.payload["moncurstock"], monstocklist: action.payload["monstocklist"], sum: action.payload["sum"] });
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_MEM_INIT"]:
            return state;
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_MEM_SUCCESS"]:
            return Object.assign(Object.assign({}, state), { nama: action.payload["nama"], nim: action.payload["nim"], rumah: action.payload["rumah"], curstocklist: action.payload["curstock"], journal: action.payload["journal"] });
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADM_INIT"]:
            return state;
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADM_SUCCESS"]:
            return Object.assign(Object.assign({}, state), { admHome: action.payload["admHome"], admItemsName: action.payload["admItemName"], admItemsID: action.payload["admItemID"] });
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADD_ITEM"]:
            return state;
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TomasSendInfo"]:
            return Object.assign(Object.assign({}, state), { info: action.payload });
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADD_MEMTOMAS"]:
            return state;
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_ADD_ADMTOMAS"]:
            return state;
        case _actions_tomas_actions__WEBPACK_IMPORTED_MODULE_0__["TOMAS_SEND_INFO"]:
            return Object.assign(Object.assign({}, state), { info: action.payload });
        default:
            return state;
    }
}


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _error_error_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error/error.component */ "CG0s");
/* harmony import */ var _landing_page_landing_page_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./landing-page/landing-page.component */ "mSt+");






const routes = [
    { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
    { path: 'landing-page', component: _landing_page_landing_page_component__WEBPACK_IMPORTED_MODULE_3__["LandingPageComponent"] },
    { path: 'member', loadChildren: () => {
            return __webpack_require__.e(/*! import() | member-member-module */ "member-member-module").then(__webpack_require__.bind(null, /*! ./member/member.module */ "ScRi")).then(m => { return m.MemberModule; });
        } },
    { path: 'admin', loadChildren: () => {
            return __webpack_require__.e(/*! import() | admin-admin-module */ "admin-admin-module").then(__webpack_require__.bind(null, /*! ./admin/admin.module */ "jkDv")).then(m => m.AdminModule);
        } },
    { path: 'error', component: _error_error_component__WEBPACK_IMPORTED_MODULE_2__["ErrorComponent"] },
    { path: '**', redirectTo: 'error' }
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "vzOs":
/*!***********************************************!*\
  !*** ./src/app/redux/reducer/auth-reducer.ts ***!
  \***********************************************/
/*! exports provided: authReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authReducer", function() { return authReducer; });
/* harmony import */ var _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/auth-actions */ "DOCJ");

const initialState = {
    id: 0,
    token: null,
    role: "MEM",
    expiresAtDate: null,
    info: "null"
};
function authReducer(state = initialState, action) {
    switch (action.type) {
        case _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__["SEND_INFO"]:
            return Object.assign(Object.assign({}, state), { info: action.payload });
        case _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__["DELETE_INFO"]:
            return Object.assign(Object.assign({}, state), { info: 'null' });
        case _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__["REGIST_START"]:
            return state;
        case _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__["LOGIN_START"]:
            return state;
        case _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AUTO_LOGIN"]:
            return state;
        case _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__["LOGIN_SUCCESS"]:
            console.log("payload", action.payload);
            return Object.assign(Object.assign({}, state), { id: action.payload["id"], token: action.payload["token"], expiresAtDate: action.payload["expiresAtDate"], errorMessage: "", role: action.payload["role"] });
        case _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__["LOGOUT_START"]:
            return Object.assign(Object.assign({}, state), { id: 0, token: null, expiresAtDate: null, info: "null" });
        default:
            return state;
    }
}


/***/ }),

/***/ "x0Ib":
/*!******************************************************!*\
  !*** ./src/app/http-interceptor/auth-interceptor.ts ***!
  \******************************************************/
/*! exports provided: AuthInterceptorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthInterceptorService", function() { return AuthInterceptorService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");






class AuthInterceptorService {
    constructor(store) {
        this.store = store;
    }
    addToken(req) {
        return this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])("auth"), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["first"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((state, _) => {
            console.log("state", state);
            if (state.token) {
                let tokenHead = `bearer ${state.token}`;
                let authorizedReq = req.clone({ headers: req.headers.append("Auth", tokenHead) });
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(authorizedReq);
            }
            else {
                console.log("masuk sini");
                Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(req);
            }
        }));
    }
    intercept(req, next) {
        // return this.addToken(req).pipe(
        //   first(),
        //   mergeMap((reqWithToken:HttpRequest<any>)=>{return next.handle(reqWithToken)})
        // )
        let tokenGet = JSON.parse(localStorage.getItem("userData"));
        if (tokenGet == null) {
            console.log("req", req);
            return next.handle(req);
        }
        else {
            let tokenHead = `bearer ${tokenGet["Token"]}`;
            console.log("token");
            let authorizedReq = req.clone({ headers: req.headers.append("Auth", tokenHead) });
            console.log("authorizedReq", authorizedReq);
            return next.handle(authorizedReq);
        }
    }
}
AuthInterceptorService.ɵfac = function AuthInterceptorService_Factory(t) { return new (t || AuthInterceptorService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"])); };
AuthInterceptorService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthInterceptorService, factory: AuthInterceptorService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthInterceptorService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"] }]; }, null); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map