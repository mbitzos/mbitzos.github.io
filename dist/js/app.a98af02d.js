(function(e){function t(t){for(var n,u,a=t[0],i=t[1],f=t[2],p=0,b=[];p<a.length;p++)u=a[p],Object.prototype.hasOwnProperty.call(c,u)&&c[u]&&b.push(c[u][0]),c[u]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);l&&l(t);while(b.length)b.shift()();return o.push.apply(o,f||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,a=1;a<r.length;a++){var i=r[a];0!==c[i]&&(n=!1)}n&&(o.splice(t--,1),e=u(u.s=r[0]))}return e}var n={},c={app:0},o=[];function u(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,u),r.l=!0,r.exports}u.m=e,u.c=n,u.d=function(e,t,r){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(u.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)u.d(r,n,function(t){return e[t]}.bind(null,n));return r},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],i=a.push.bind(a);a.push=t,a=a.slice();for(var f=0;f<a.length;f++)t(a[f]);var l=i;o.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},"091a":function(e,t,r){"use strict";r("ecff")},cd49:function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("7a23");function c(e,t){var r=Object(n["q"])("router-view");return Object(n["m"])(),Object(n["c"])(r)}r("091a");const o={};o.render=c;var u=o,a=r("6c02"),i={class:"body"};function f(e,t,r,c,o,u){var a=Object(n["q"])("headerr"),f=Object(n["q"])("about");return Object(n["m"])(),Object(n["c"])("div",null,[Object(n["d"])(a),Object(n["d"])("div",i,[Object(n["d"])(f)])])}function l(e,t,r,c,o,u){return Object(n["m"])(),Object(n["c"])("div",null,"test")}var p=Object(n["e"])({name:"Header"});p.render=l;var b=p;function d(e,t,r,c,o,u){return Object(n["m"])(),Object(n["c"])("div",null,"test")}var s=Object(n["e"])({});s.render=d;var O=s,v=Object(n["e"])({name:"Home",components:{Headerr:b,About:O}});v.render=f;var j=v,h=[{path:"/",name:"home",component:j},{path:"/:pathMatch(.*)",name:"redirect",redirect:{name:"home"}}],m=Object(a["a"])({history:Object(a["b"])(),routes:h}),y=m;Object(n["b"])(u).use(y).mount("#app")},ecff:function(e,t,r){}});
//# sourceMappingURL=app.a98af02d.js.map