function t(t){return"function"==typeof t}function e(t){const e=t((t=>{Error.call(t),t.stack=(new Error).stack}));return e.prototype=Object.create(Error.prototype),e.prototype.constructor=e,e}const n=e((t=>function(e){t(this),this.message=e?`${e.length} errors occurred during unsubscription:\n${e.map(((t,e)=>`${e+1}) ${t.toString()}`)).join("\n  ")}`:"",this.name="UnsubscriptionError",this.errors=e}));function i(t,e){if(t){const n=t.indexOf(e);0<=n&&t.splice(n,1)}}class r{constructor(t){this.initialTeardown=t,this.closed=!1,this._parentage=null,this._teardowns=null}unsubscribe(){let e;if(!this.closed){this.closed=!0;const{_parentage:i}=this;if(i)if(this._parentage=null,Array.isArray(i))for(const t of i)t.remove(this);else i.remove(this);const{initialTeardown:r}=this;if(t(r))try{r()}catch(t){e=t instanceof n?t.errors:[t]}const{_teardowns:s}=this;if(s){this._teardowns=null;for(const t of s)try{h(t)}catch(t){e=null!=e?e:[],t instanceof n?e=[...e,...t.errors]:e.push(t)}}if(e)throw new n(e)}}add(t){var e;if(t&&t!==this)if(this.closed)h(t);else{if(t instanceof r){if(t.closed||t._hasParent(this))return;t._addParent(this)}(this._teardowns=null!==(e=this._teardowns)&&void 0!==e?e:[]).push(t)}}_hasParent(t){const{_parentage:e}=this;return e===t||Array.isArray(e)&&e.includes(t)}_addParent(t){const{_parentage:e}=this;this._parentage=Array.isArray(e)?(e.push(t),e):e?[e,t]:t}_removeParent(t){const{_parentage:e}=this;e===t?this._parentage=null:Array.isArray(e)&&i(e,t)}remove(t){const{_teardowns:e}=this;e&&i(e,t),t instanceof r&&t._removeParent(this)}}r.EMPTY=(()=>{const t=new r;return t.closed=!0,t})();const s=r.EMPTY;function o(e){return e instanceof r||e&&"closed"in e&&t(e.remove)&&t(e.add)&&t(e.unsubscribe)}function h(e){t(e)?e():e.unsubscribe()}const c={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1},u={setTimeout(...t){const{delegate:e}=u;return((null==e?void 0:e.setTimeout)||setTimeout)(...t)},clearTimeout(t){const{delegate:e}=u;return((null==e?void 0:e.clearTimeout)||clearTimeout)(t)},delegate:void 0};function a(t){u.setTimeout((()=>{const{onUnhandledError:e}=c;if(!e)throw t;e(t)}))}function f(){}const l=d("C",void 0,void 0);function d(t,e,n){return{kind:t,value:e,error:n}}function w(t){t()}class v extends r{constructor(t){super(),this.isStopped=!1,t?(this.destination=t,o(t)&&t.add(this)):this.destination=g}static create(t,e,n){return new y(t,e,n)}next(t){this.isStopped?m(function(t){return d("N",t,void 0)}(t),this):this._next(t)}error(t){this.isStopped?m(d("E",void 0,t),this):(this.isStopped=!0,this._error(t))}complete(){this.isStopped?m(l,this):(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe(),this.destination=null)}_next(t){this.destination.next(t)}_error(t){try{this.destination.error(t)}finally{this.unsubscribe()}}_complete(){try{this.destination.complete()}finally{this.unsubscribe()}}}class y extends v{constructor(e,n,i){let r;if(super(),t(e))r=e;else if(e){let t;({next:r,error:n,complete:i}=e),this&&c.useDeprecatedNextContext?(t=Object.create(e),t.unsubscribe=()=>this.unsubscribe()):t=e,r=null==r?void 0:r.bind(t),n=null==n?void 0:n.bind(t),i=null==i?void 0:i.bind(t)}this.destination={next:r?p(r):f,error:p(null!=n?n:b),complete:i?p(i):f}}}function p(t){return(...e)=>{try{t(...e)}catch(t){a(t)}}}function b(t){throw t}function m(t,e){const{onStoppedNotification:n}=c;n&&u.setTimeout((()=>n(t,e)))}const g={closed:!0,next:f,error:b,complete:f},S="function"==typeof Symbol&&Symbol.observable||"@@observable";function x(t){return t}class _{constructor(t){t&&(this._subscribe=t)}lift(t){const e=new _;return e.source=this,e.operator=t,e}subscribe(e,n,i){const r=(s=e)&&s instanceof v||function(e){return e&&t(e.next)&&t(e.error)&&t(e.complete)}(s)&&o(s)?e:new y(e,n,i);var s;return w((()=>{const{operator:t,source:e}=this;r.add(t?t.call(r,e):e?this._subscribe(r):this._trySubscribe(r))})),r}_trySubscribe(t){try{return this._subscribe(t)}catch(e){t.error(e)}}forEach(t,e){return new(e=E(e))(((e,n)=>{const i=new y({next:e=>{try{t(e)}catch(t){n(t),i.unsubscribe()}},error:n,complete:e});this.subscribe(i)}))}_subscribe(t){var e;return null===(e=this.source)||void 0===e?void 0:e.subscribe(t)}[S](){return this}pipe(...t){return(0===(e=t).length?x:1===e.length?e[0]:function(t){return e.reduce(((t,e)=>e(t)),t)})(this);var e}toPromise(t){return new(t=E(t))(((t,e)=>{let n;this.subscribe((t=>n=t),(t=>e(t)),(()=>t(n)))}))}}function E(t){var e;return null!==(e=null!=t?t:c.Promise)&&void 0!==e?e:Promise}function T(e){return n=>{if(function(e){return t(null==e?void 0:e.lift)}(n))return n.lift((function(t){try{return e(t,this)}catch(t){this.error(t)}}));throw new TypeError("Unable to lift unknown Observable type")}}_.create=t=>new _(t);class A extends v{constructor(t,e,n,i,r){super(t),this.onFinalize=r,this._next=e?function(n){try{e(n)}catch(e){t.error(e)}}:super._next,this._error=i?function(e){try{i(e)}catch(e){t.error(e)}finally{this.unsubscribe()}}:super._error,this._complete=n?function(){try{n()}catch(e){t.error(e)}finally{this.unsubscribe()}}:super._complete}unsubscribe(){var t;const{closed:e}=this;super.unsubscribe(),!e&&(null===(t=this.onFinalize)||void 0===t||t.call(this))}}const I=e((t=>function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}));class U extends _{constructor(){super(),this.closed=!1,this.observers=[],this.isStopped=!1,this.hasError=!1,this.thrownError=null}lift(t){const e=new C(this,this);return e.operator=t,e}_throwIfClosed(){if(this.closed)throw new I}next(t){w((()=>{if(this._throwIfClosed(),!this.isStopped){const e=this.observers.slice();for(const n of e)n.next(t)}}))}error(t){w((()=>{if(this._throwIfClosed(),!this.isStopped){this.hasError=this.isStopped=!0,this.thrownError=t;const{observers:e}=this;for(;e.length;)e.shift().error(t)}}))}complete(){w((()=>{if(this._throwIfClosed(),!this.isStopped){this.isStopped=!0;const{observers:t}=this;for(;t.length;)t.shift().complete()}}))}unsubscribe(){this.isStopped=this.closed=!0,this.observers=null}get observed(){var t;return(null===(t=this.observers)||void 0===t?void 0:t.length)>0}_trySubscribe(t){return this._throwIfClosed(),super._trySubscribe(t)}_subscribe(t){return this._throwIfClosed(),this._checkFinalizedStatuses(t),this._innerSubscribe(t)}_innerSubscribe(t){const{hasError:e,isStopped:n,observers:o}=this;return e||n?s:(o.push(t),new r((()=>i(o,t))))}_checkFinalizedStatuses(t){const{hasError:e,thrownError:n,isStopped:i}=this;e?t.error(n):i&&t.complete()}asObservable(){const t=new _;return t.source=this,t}}U.create=(t,e)=>new C(t,e);class C extends U{constructor(t,e){super(),this.destination=t,this.source=e}next(t){var e,n;null===(n=null===(e=this.destination)||void 0===e?void 0:e.next)||void 0===n||n.call(e,t)}error(t){var e,n;null===(n=null===(e=this.destination)||void 0===e?void 0:e.error)||void 0===n||n.call(e,t)}complete(){var t,e;null===(e=null===(t=this.destination)||void 0===t?void 0:t.complete)||void 0===e||e.call(t)}_subscribe(t){var e,n;return null!==(n=null===(e=this.source)||void 0===e?void 0:e.subscribe(t))&&void 0!==n?n:s}}const O={now:()=>(O.delegate||Date).now(),delegate:void 0};class k extends U{constructor(t=1/0,e=1/0,n=O){super(),this._bufferSize=t,this._windowTime=e,this._timestampProvider=n,this._buffer=[],this._infiniteTimeWindow=!0,this._infiniteTimeWindow=e===1/0,this._bufferSize=Math.max(1,t),this._windowTime=Math.max(1,e)}next(t){const{isStopped:e,_buffer:n,_infiniteTimeWindow:i,_timestampProvider:r,_windowTime:s}=this;e||(n.push(t),!i&&n.push(r.now()+s)),this._trimBuffer(),super.next(t)}_subscribe(t){this._throwIfClosed(),this._trimBuffer();const e=this._innerSubscribe(t),{_infiniteTimeWindow:n,_buffer:i}=this,r=i.slice();for(let e=0;e<r.length&&!t.closed;e+=n?1:2)t.next(r[e]);return this._checkFinalizedStatuses(t),e}_trimBuffer(){const{_bufferSize:t,_timestampProvider:e,_buffer:n,_infiniteTimeWindow:i}=this,r=(i?1:2)*t;if(t<1/0&&r<n.length&&n.splice(0,n.length-r),!i){const t=e.now();let i=0;for(let e=1;e<n.length&&n[e]<=t;e+=2)i=e;i&&n.splice(0,i+1)}}}class D extends r{constructor(t,e){super()}schedule(t,e=0){return this}}const N={setInterval(...t){const{delegate:e}=N;return((null==e?void 0:e.setInterval)||setInterval)(...t)},clearInterval(t){const{delegate:e}=N;return((null==e?void 0:e.clearInterval)||clearInterval)(t)},delegate:void 0};class P{constructor(t,e=P.now){this.schedulerActionCtor=t,this.now=e}schedule(t,e=0,n){return new this.schedulerActionCtor(this,t).schedule(n,e)}}P.now=O.now;const R=new class extends P{constructor(t,e=P.now){super(t,e),this.actions=[],this._active=!1,this._scheduled=void 0}flush(t){const{actions:e}=this;if(this._active)return void e.push(t);let n;this._active=!0;do{if(n=t.execute(t.state,t.delay))break}while(t=e.shift());if(this._active=!1,n){for(;t=e.shift();)t.unsubscribe();throw n}}}(class extends D{constructor(t,e){super(t,e),this.scheduler=t,this.work=e,this.pending=!1}schedule(t,e=0){if(this.closed)return this;this.state=t;const n=this.id,i=this.scheduler;return null!=n&&(this.id=this.recycleAsyncId(i,n,e)),this.pending=!0,this.delay=e,this.id=this.id||this.requestAsyncId(i,this.id,e),this}requestAsyncId(t,e,n=0){return N.setInterval(t.flush.bind(t,this),n)}recycleAsyncId(t,e,n=0){if(null!=n&&this.delay===n&&!1===this.pending)return e;N.clearInterval(e)}execute(t,e){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;const n=this._execute(t,e);if(n)return n;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(t,e){let n,i=!1;try{this.work(t)}catch(t){i=!0,n=t||new Error("Scheduled action threw falsy error")}if(i)return this.unsubscribe(),n}unsubscribe(){if(!this.closed){const{id:t,scheduler:e}=this,{actions:n}=e;this.work=this.state=this.scheduler=null,this.pending=!1,i(n,this),null!=t&&(this.id=this.recycleAsyncId(e,t,null)),this.delay=null,super.unsubscribe()}}}),j=R;function $(t){return this instanceof $?(this.v=t,this):new $(t)}function L(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i,r=n.apply(t,e||[]),s=[];return i={},o("next"),o("throw"),o("return"),i[Symbol.asyncIterator]=function(){return this},i;function o(t){r[t]&&(i[t]=function(e){return new Promise((function(n,i){s.push([t,e,n,i])>1||h(t,e)}))})}function h(t,e){try{(n=r[t](e)).value instanceof $?Promise.resolve(n.value.v).then(c,u):a(s[0][2],n)}catch(t){a(s[0][3],t)}var n}function c(t){h("next",t)}function u(t){h("throw",t)}function a(t,e){t(e),s.shift(),s.length&&h(s[0][0],s[0][1])}}function z(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,n=t[Symbol.asyncIterator];return n?n.call(t):(t=function(t){var e="function"==typeof Symbol&&Symbol.iterator,n=e&&t[e],i=0;if(n)return n.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&i>=t.length&&(t=void 0),{value:t&&t[i++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}(t),e={},i("next"),i("throw"),i("return"),e[Symbol.asyncIterator]=function(){return this},e);function i(n){e[n]=t[n]&&function(e){return new Promise((function(i,r){!function(t,e,n,i){Promise.resolve(i).then((function(e){t({value:e,done:n})}),e)}(i,r,(e=t[n](e)).done,e.value)}))}}}const B="function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator";function M(e){if(e instanceof _)return e;if(null!=e){if(function(e){return t(e[S])}(e))return h=e,new _((e=>{const n=h[S]();if(t(n.subscribe))return n.subscribe(e);throw new TypeError("Provided object does not correctly implement Symbol.observable")}));if((o=e)&&"number"==typeof o.length&&"function"!=typeof o)return s=e,new _((t=>{for(let e=0;e<s.length&&!t.closed;e++)t.next(s[e]);t.complete()}));if(t(null==(r=e)?void 0:r.then))return i=e,new _((t=>{i.then((e=>{t.closed||(t.next(e),t.complete())}),(e=>t.error(e))).then(null,a)}));if(function(e){return Symbol.asyncIterator&&t(null==e?void 0:e[Symbol.asyncIterator])}(e))return W(e);if(function(e){return t(null==e?void 0:e[B])}(e))return n=e,new _((t=>{for(const e of n)if(t.next(e),t.closed)return;t.complete()}));if(function(e){return t(null==e?void 0:e.getReader)}(e))return W(function(t){return L(this,arguments,(function*(){const e=t.getReader();try{for(;;){const{value:t,done:n}=yield $(e.read());if(n)return yield $(void 0);yield yield $(t)}}finally{e.releaseLock()}}))}(e))}var n,i,r,s,o,h;throw function(t){return new TypeError(`You provided ${null!==t&&"object"==typeof t?"an invalid object":`'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)}(e)}function W(t){return new _((e=>{(function(t,e){var n,i,r,s,o,h,c,u;return o=this,h=void 0,u=function*(){try{for(n=z(t);!(i=yield n.next()).done;)if(e.next(i.value),e.closed)return}catch(t){r={error:t}}finally{try{i&&!i.done&&(s=n.return)&&(yield s.call(n))}finally{if(r)throw r.error}}e.complete()},new((c=void 0)||(c=Promise))((function(t,e){function n(t){try{r(u.next(t))}catch(t){e(t)}}function i(t){try{r(u.throw(t))}catch(t){e(t)}}function r(e){var r;e.done?t(e.value):(r=e.value,r instanceof c?r:new c((function(t){t(r)}))).then(n,i)}r((u=u.apply(o,h||[])).next())}))})(t,e).catch((t=>e.error(t)))}))}function V(t,e){return T(((n,i)=>{let r=0;n.subscribe(new A(i,(n=>{i.next(t.call(e,n,r++))})))}))}function J(e,n,i=1/0){return t(n)?J(((t,i)=>V(((e,r)=>n(t,e,i,r)))(M(e(t,i)))),i):("number"==typeof n&&(i=n),T(((t,n)=>function(t,e,n,i){const r=[];let s=0,o=0,h=!1;const c=()=>{!h||r.length||s||e.complete()},u=t=>s<i?a(t):r.push(t),a=t=>{s++;let h=!1;M(n(t,o++)).subscribe(new A(e,(t=>{e.next(t)}),(()=>{h=!0}),void 0,(()=>{if(h)try{for(s--;r.length&&s<i;){const t=r.shift();a(t)}c()}catch(t){e.error(t)}})))};return t.subscribe(new A(e,u,(()=>{h=!0,c()}))),()=>{}}(t,n,e,i))))}function K(e=0,n,i=j){let r=-1;var s;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */return null!=n&&((s=n)&&t(s.schedule)?i=n:r=n),new _((t=>{let n=function(t){return t instanceof Date&&!isNaN(t)}(e)?+e-i.now():e;n<0&&(n=0);let s=0;return i.schedule((function(){t.closed||(t.next(s++),0<=r?this.schedule(void 0,r):t.complete())}),n)}))}function q(t,e){return T(((n,i)=>{let r=0;n.subscribe(new A(i,(n=>t.call(e,n,r++)&&i.next(n))))}))}const F={url:"",deserializer:t=>JSON.parse(t.data),serializer:t=>JSON.stringify(t)};class Y extends C{constructor(t,e){if(super(),this._socket=null,t instanceof _)this.destination=e,this.source=t;else{const e=this._config=Object.assign({},F);if(this._output=new U,"string"==typeof t)e.url=t;else for(const n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);if(!e.WebSocketCtor&&WebSocket)e.WebSocketCtor=WebSocket;else if(!e.WebSocketCtor)throw new Error("no WebSocket constructor can be found");this.destination=new k}}lift(t){const e=new Y(this._config,this.destination);return e.operator=t,e.source=this,e}_resetState(){this._socket=null,this.source||(this.destination=new k),this._output=new U}multiplex(t,e,n){const i=this;return new _((r=>{try{i.next(t())}catch(t){r.error(t)}const s=i.subscribe((t=>{try{n(t)&&r.next(t)}catch(t){r.error(t)}}),(t=>r.error(t)),(()=>r.complete()));return()=>{try{i.next(e())}catch(t){r.error(t)}s.unsubscribe()}}))}_connectSocket(){const{WebSocketCtor:t,protocol:e,url:n,binaryType:i}=this._config,s=this._output;let o=null;try{o=e?new t(n,e):new t(n),this._socket=o,i&&(this._socket.binaryType=i)}catch(t){return void s.error(t)}const h=new r((()=>{this._socket=null,o&&1===o.readyState&&o.close()}));o.onopen=t=>{const{_socket:e}=this;if(!e)return o.close(),void this._resetState();const{openObserver:n}=this._config;n&&n.next(t);const i=this.destination;this.destination=v.create((t=>{if(1===o.readyState)try{const{serializer:e}=this._config;o.send(e(t))}catch(t){this.destination.error(t)}}),(t=>{const{closingObserver:e}=this._config;e&&e.next(void 0),t&&t.code?o.close(t.code,t.reason):s.error(new TypeError("WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }")),this._resetState()}),(()=>{const{closingObserver:t}=this._config;t&&t.next(void 0),o.close(),this._resetState()})),i&&i instanceof k&&h.add(i.subscribe(this.destination))},o.onerror=t=>{this._resetState(),s.error(t)},o.onclose=t=>{o===this._socket&&this._resetState();const{closeObserver:e}=this._config;e&&e.next(t),t.wasClean?s.complete():s.error(t)},o.onmessage=t=>{try{const{deserializer:e}=this._config;s.next(e(t))}catch(t){s.error(t)}}}_subscribe(t){const{source:e}=this;return e?e.subscribe(t):(this._socket||this._connectSocket(),this._output.subscribe(t),t.add((()=>{const{_socket:t}=this;0===this._output.observers.length&&(!t||1!==t.readyState&&0!==t.readyState||t.close(),this._resetState())})),t)}unsubscribe(){const{_socket:t}=this;!t||1!==t.readyState&&0!==t.readyState||t.close(),this._resetState(),super.unsubscribe()}}function G(t,e){return 4294967296*t.getInt32(e)+t.getUint32(e+4)}var H=("undefined"==typeof process||"never"!==process.env.TEXT_ENCODING)&&"undefined"!=typeof TextEncoder&&"undefined"!=typeof TextDecoder;function Q(t,e,n){for(var i=e,r=i+n,s=[],o="";i<r;){var h=t[i++];if(0==(128&h))s.push(h);else if(192==(224&h)){var c=63&t[i++];s.push((31&h)<<6|c)}else if(224==(240&h)){c=63&t[i++];var u=63&t[i++];s.push((31&h)<<12|c<<6|u)}else if(240==(248&h)){var a=(7&h)<<18|(c=63&t[i++])<<12|(u=63&t[i++])<<6|63&t[i++];a>65535&&(s.push((a-=65536)>>>10&1023|55296),a=56320|1023&a),s.push(a)}else s.push(h);s.length>=4096&&(o+=String.fromCharCode.apply(String,s),s.length=0)}return s.length>0&&(o+=String.fromCharCode.apply(String,s)),o}H&&new TextEncoder,!H||"undefined"!=typeof process&&process;var X,Z=H?new TextDecoder:null,tt=H?"undefined"!=typeof process&&"force"!==process.env.TEXT_DECODER?200:0:4294967295,et=function(t,e){this.type=t,this.data=e},nt=(X=function(t,e){return(X=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}X(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),it=function(t){function e(n){var i=t.call(this,n)||this,r=Object.create(e.prototype);return Object.setPrototypeOf(i,r),Object.defineProperty(i,"name",{configurable:!0,enumerable:!1,value:e.name}),i}return nt(e,t),e}(Error);var rt={type:-1,encode:function(t){var e,n,i,r;return t instanceof Date?function(t){var e,n=t.sec,i=t.nsec;if(n>=0&&i>=0&&n<=17179869183){if(0===i&&n<=4294967295){var r=new Uint8Array(4);return(e=new DataView(r.buffer)).setUint32(0,n),r}var s=n/4294967296,o=4294967295&n;return r=new Uint8Array(8),(e=new DataView(r.buffer)).setUint32(0,i<<2|3&s),e.setUint32(4,o),r}return r=new Uint8Array(12),(e=new DataView(r.buffer)).setUint32(0,i),function(t,e,n){var i=Math.floor(n/4294967296),r=n;t.setUint32(4,i),t.setUint32(8,r)}(e,0,n),r}((i=1e6*((e=t.getTime())-1e3*(n=Math.floor(e/1e3))),{sec:n+(r=Math.floor(i/1e9)),nsec:i-1e9*r})):null},decode:function(t){var e=function(t){var e=new DataView(t.buffer,t.byteOffset,t.byteLength);switch(t.byteLength){case 4:return{sec:e.getUint32(0),nsec:0};case 8:var n=e.getUint32(0);return{sec:4294967296*(3&n)+e.getUint32(4),nsec:n>>>2};case 12:return{sec:G(e,4),nsec:e.getUint32(0)};default:throw new it("Unrecognized data size for timestamp (expected 4, 8, or 12): "+t.length)}}(t);return new Date(1e3*e.sec+e.nsec/1e6)}},st=function(){function t(){this.builtInEncoders=[],this.builtInDecoders=[],this.encoders=[],this.decoders=[],this.register(rt)}return t.prototype.register=function(t){var e=t.type,n=t.encode,i=t.decode;if(e>=0)this.encoders[e]=n,this.decoders[e]=i;else{var r=1+e;this.builtInEncoders[r]=n,this.builtInDecoders[r]=i}},t.prototype.tryToEncode=function(t,e){for(var n=0;n<this.builtInEncoders.length;n++)if(null!=(i=this.builtInEncoders[n])&&null!=(r=i(t,e)))return new et(-1-n,r);for(n=0;n<this.encoders.length;n++){var i,r;if(null!=(i=this.encoders[n])&&null!=(r=i(t,e)))return new et(n,r)}return t instanceof et?t:null},t.prototype.decode=function(t,e,n){var i=e<0?this.builtInDecoders[-1-e]:this.decoders[e];return i?i(t,e,n):new et(e,t)},t.defaultCodec=new t,t}();function ot(t){return t instanceof Uint8Array?t:ArrayBuffer.isView(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):t instanceof ArrayBuffer?new Uint8Array(t):Uint8Array.from(t)}function ht(t){return(t<0?"-":"")+"0x"+Math.abs(t).toString(16).padStart(2,"0")}var ct=function(){function t(t,e){void 0===t&&(t=16),void 0===e&&(e=16),this.maxKeyLength=t,this.maxLengthPerKey=e,this.hit=0,this.miss=0,this.caches=[];for(var n=0;n<this.maxKeyLength;n++)this.caches.push([])}return t.prototype.canBeCached=function(t){return t>0&&t<=this.maxKeyLength},t.prototype.find=function(t,e,n){t:for(var i=0,r=this.caches[n-1];i<r.length;i++){for(var s=r[i],o=s.bytes,h=0;h<n;h++)if(o[h]!==t[e+h])continue t;return s.str}return null},t.prototype.store=function(t,e){var n=this.caches[t.length-1],i={bytes:t,str:e};n.length>=this.maxLengthPerKey?n[Math.random()*n.length|0]=i:n.push(i)},t.prototype.decode=function(t,e,n){var i=this.find(t,e,n);if(null!=i)return this.hit++,i;this.miss++;var r=Q(t,e,n),s=Uint8Array.prototype.slice.call(t,e,e+n);return this.store(s,r),r},t}(),ut=function(t,e){var n,i,r,s,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return s={next:h(0),throw:h(1),return:h(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function h(s){return function(h){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,i&&(r=2&s[0]?i.return:s[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,s[1])).done)return r;switch(i=0,r&&(s=[2&s[0],r.value]),s[0]){case 0:case 1:r=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,i=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!((r=(r=o.trys).length>0&&r[r.length-1])||6!==s[0]&&2!==s[0])){o=0;continue}if(3===s[0]&&(!r||s[1]>r[0]&&s[1]<r[3])){o.label=s[1];break}if(6===s[0]&&o.label<r[1]){o.label=r[1],r=s;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(s);break}r[2]&&o.ops.pop(),o.trys.pop();continue}s=e.call(t,o)}catch(t){s=[6,t],i=0}finally{n=r=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,h])}}},at=function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,n=t[Symbol.asyncIterator];return n?n.call(t):(t="function"==typeof __values?__values(t):t[Symbol.iterator](),e={},i("next"),i("throw"),i("return"),e[Symbol.asyncIterator]=function(){return this},e);function i(n){e[n]=t[n]&&function(e){return new Promise((function(i,r){!function(t,e,n,i){Promise.resolve(i).then((function(e){t({value:e,done:n})}),e)}(i,r,(e=t[n](e)).done,e.value)}))}}},ft=function(t){return this instanceof ft?(this.v=t,this):new ft(t)},lt=function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i,r=n.apply(t,e||[]),s=[];return i={},o("next"),o("throw"),o("return"),i[Symbol.asyncIterator]=function(){return this},i;function o(t){r[t]&&(i[t]=function(e){return new Promise((function(n,i){s.push([t,e,n,i])>1||h(t,e)}))})}function h(t,e){try{(n=r[t](e)).value instanceof ft?Promise.resolve(n.value.v).then(c,u):a(s[0][2],n)}catch(t){a(s[0][3],t)}var n}function c(t){h("next",t)}function u(t){h("throw",t)}function a(t,e){t(e),s.shift(),s.length&&h(s[0][0],s[0][1])}},dt=new DataView(new ArrayBuffer(0)),wt=new Uint8Array(dt.buffer),vt=function(){try{dt.getInt8(0)}catch(t){return t.constructor}throw new Error("never reached")}(),yt=new vt("Insufficient data"),pt=new ct,bt=function(){function t(t,e,n,i,r,s,o,h){void 0===t&&(t=st.defaultCodec),void 0===e&&(e=void 0),void 0===n&&(n=4294967295),void 0===i&&(i=4294967295),void 0===r&&(r=4294967295),void 0===s&&(s=4294967295),void 0===o&&(o=4294967295),void 0===h&&(h=pt),this.extensionCodec=t,this.context=e,this.maxStrLength=n,this.maxBinLength=i,this.maxArrayLength=r,this.maxMapLength=s,this.maxExtLength=o,this.keyDecoder=h,this.totalPos=0,this.pos=0,this.view=dt,this.bytes=wt,this.headByte=-1,this.stack=[]}return t.prototype.reinitializeState=function(){this.totalPos=0,this.headByte=-1,this.stack.length=0},t.prototype.setBuffer=function(t){this.bytes=ot(t),this.view=function(t){if(t instanceof ArrayBuffer)return new DataView(t);var e=ot(t);return new DataView(e.buffer,e.byteOffset,e.byteLength)}(this.bytes),this.pos=0},t.prototype.appendBuffer=function(t){if(-1!==this.headByte||this.hasRemaining(1)){var e=this.bytes.subarray(this.pos),n=ot(t),i=new Uint8Array(e.length+n.length);i.set(e),i.set(n,e.length),this.setBuffer(i)}else this.setBuffer(t)},t.prototype.hasRemaining=function(t){return this.view.byteLength-this.pos>=t},t.prototype.createExtraByteError=function(t){var e=this.view;return new RangeError("Extra "+(e.byteLength-this.pos)+" of "+e.byteLength+" byte(s) found at buffer["+t+"]")},t.prototype.decode=function(t){this.reinitializeState(),this.setBuffer(t);var e=this.doDecodeSync();if(this.hasRemaining(1))throw this.createExtraByteError(this.pos);return e},t.prototype.decodeMulti=function(t){return ut(this,(function(e){switch(e.label){case 0:this.reinitializeState(),this.setBuffer(t),e.label=1;case 1:return this.hasRemaining(1)?[4,this.doDecodeSync()]:[3,3];case 2:return e.sent(),[3,1];case 3:return[2]}}))},t.prototype.decodeAsync=function(t){var e,n,i,r,s,o,h,c;return s=this,o=void 0,c=function(){var s,o,h,c,u,a,f;return ut(this,(function(l){switch(l.label){case 0:s=!1,l.label=1;case 1:l.trys.push([1,6,7,12]),e=at(t),l.label=2;case 2:return[4,e.next()];case 3:if((n=l.sent()).done)return[3,5];if(h=n.value,s)throw this.createExtraByteError(this.totalPos);this.appendBuffer(h);try{o=this.doDecodeSync(),s=!0}catch(t){if(!(t instanceof vt))throw t}this.totalPos+=this.pos,l.label=4;case 4:return[3,2];case 5:return[3,12];case 6:return c=l.sent(),i={error:c},[3,12];case 7:return l.trys.push([7,,10,11]),n&&!n.done&&(r=e.return)?[4,r.call(e)]:[3,9];case 8:l.sent(),l.label=9;case 9:return[3,11];case 10:if(i)throw i.error;return[7];case 11:return[7];case 12:if(s){if(this.hasRemaining(1))throw this.createExtraByteError(this.totalPos);return[2,o]}throw a=(u=this).pos,f=u.totalPos,new RangeError("Insufficient data in parsing "+ht(u.headByte)+" at "+f+" ("+a+" in the current buffer)")}}))},new((h=void 0)||(h=Promise))((function(t,e){function n(t){try{r(c.next(t))}catch(t){e(t)}}function i(t){try{r(c.throw(t))}catch(t){e(t)}}function r(e){var r;e.done?t(e.value):(r=e.value,r instanceof h?r:new h((function(t){t(r)}))).then(n,i)}r((c=c.apply(s,o||[])).next())}))},t.prototype.decodeArrayStream=function(t){return this.decodeMultiAsync(t,!0)},t.prototype.decodeStream=function(t){return this.decodeMultiAsync(t,!1)},t.prototype.decodeMultiAsync=function(t,e){return lt(this,arguments,(function(){var n,i,r,s,o,h,c,u,a;return ut(this,(function(f){switch(f.label){case 0:n=e,i=-1,f.label=1;case 1:f.trys.push([1,13,14,19]),r=at(t),f.label=2;case 2:return[4,ft(r.next())];case 3:if((s=f.sent()).done)return[3,12];if(o=s.value,e&&0===i)throw this.createExtraByteError(this.totalPos);this.appendBuffer(o),n&&(i=this.readArraySize(),n=!1,this.complete()),f.label=4;case 4:f.trys.push([4,9,,10]),f.label=5;case 5:return[4,ft(this.doDecodeSync())];case 6:return[4,f.sent()];case 7:return f.sent(),0==--i?[3,8]:[3,5];case 8:return[3,10];case 9:if(!((h=f.sent())instanceof vt))throw h;return[3,10];case 10:this.totalPos+=this.pos,f.label=11;case 11:return[3,2];case 12:return[3,19];case 13:return c=f.sent(),u={error:c},[3,19];case 14:return f.trys.push([14,,17,18]),s&&!s.done&&(a=r.return)?[4,ft(a.call(r))]:[3,16];case 15:f.sent(),f.label=16;case 16:return[3,18];case 17:if(u)throw u.error;return[7];case 18:return[7];case 19:return[2]}}))}))},t.prototype.doDecodeSync=function(){t:for(;;){var t=this.readHeadByte(),e=void 0;if(t>=224)e=t-256;else if(t<192)if(t<128)e=t;else if(t<144){if(0!=(i=t-128)){this.pushMapState(i),this.complete();continue t}e={}}else if(t<160){if(0!=(i=t-144)){this.pushArrayState(i),this.complete();continue t}e=[]}else e=this.decodeUtf8String(n=t-160,0);else if(192===t)e=null;else if(194===t)e=!1;else if(195===t)e=!0;else if(202===t)e=this.readF32();else if(203===t)e=this.readF64();else if(204===t)e=this.readU8();else if(205===t)e=this.readU16();else if(206===t)e=this.readU32();else if(207===t)e=this.readU64();else if(208===t)e=this.readI8();else if(209===t)e=this.readI16();else if(210===t)e=this.readI32();else if(211===t)e=this.readI64();else if(217===t){var n=this.lookU8();e=this.decodeUtf8String(n,1)}else if(218===t)n=this.lookU16(),e=this.decodeUtf8String(n,2);else if(219===t)n=this.lookU32(),e=this.decodeUtf8String(n,4);else if(220===t){if(0!==(i=this.readU16())){this.pushArrayState(i),this.complete();continue t}e=[]}else if(221===t){if(0!==(i=this.readU32())){this.pushArrayState(i),this.complete();continue t}e=[]}else if(222===t){if(0!==(i=this.readU16())){this.pushMapState(i),this.complete();continue t}e={}}else if(223===t){if(0!==(i=this.readU32())){this.pushMapState(i),this.complete();continue t}e={}}else if(196===t){var i=this.lookU8();e=this.decodeBinary(i,1)}else if(197===t)i=this.lookU16(),e=this.decodeBinary(i,2);else if(198===t)i=this.lookU32(),e=this.decodeBinary(i,4);else if(212===t)e=this.decodeExtension(1,0);else if(213===t)e=this.decodeExtension(2,0);else if(214===t)e=this.decodeExtension(4,0);else if(215===t)e=this.decodeExtension(8,0);else if(216===t)e=this.decodeExtension(16,0);else if(199===t)i=this.lookU8(),e=this.decodeExtension(i,1);else if(200===t)i=this.lookU16(),e=this.decodeExtension(i,2);else{if(201!==t)throw new it("Unrecognized type byte: "+ht(t));i=this.lookU32(),e=this.decodeExtension(i,4)}this.complete();for(var r=this.stack;r.length>0;){var s=r[r.length-1];if(0===s.type){if(s.array[s.position]=e,s.position++,s.position!==s.size)continue t;r.pop(),e=s.array}else{if(1===s.type){if(void 0,"string"!=(o=typeof e)&&"number"!==o)throw new it("The type of key must be string or number but "+typeof e);if("__proto__"===e)throw new it("The key __proto__ is not allowed");s.key=e,s.type=2;continue t}if(s.map[s.key]=e,s.readCount++,s.readCount!==s.size){s.key=null,s.type=1;continue t}r.pop(),e=s.map}}return e}var o},t.prototype.readHeadByte=function(){return-1===this.headByte&&(this.headByte=this.readU8()),this.headByte},t.prototype.complete=function(){this.headByte=-1},t.prototype.readArraySize=function(){var t=this.readHeadByte();switch(t){case 220:return this.readU16();case 221:return this.readU32();default:if(t<160)return t-144;throw new it("Unrecognized array type byte: "+ht(t))}},t.prototype.pushMapState=function(t){if(t>this.maxMapLength)throw new it("Max length exceeded: map length ("+t+") > maxMapLengthLength ("+this.maxMapLength+")");this.stack.push({type:1,size:t,key:null,readCount:0,map:{}})},t.prototype.pushArrayState=function(t){if(t>this.maxArrayLength)throw new it("Max length exceeded: array length ("+t+") > maxArrayLength ("+this.maxArrayLength+")");this.stack.push({type:0,size:t,array:new Array(t),position:0})},t.prototype.decodeUtf8String=function(t,e){var n;if(t>this.maxStrLength)throw new it("Max length exceeded: UTF-8 byte length ("+t+") > maxStrLength ("+this.maxStrLength+")");if(this.bytes.byteLength<this.pos+e+t)throw yt;var i,r=this.pos+e;return i=this.stateIsMapKey()&&(null===(n=this.keyDecoder)||void 0===n?void 0:n.canBeCached(t))?this.keyDecoder.decode(this.bytes,r,t):t>tt?function(t,e,n){var i=t.subarray(e,e+n);return Z.decode(i)}(this.bytes,r,t):Q(this.bytes,r,t),this.pos+=e+t,i},t.prototype.stateIsMapKey=function(){return this.stack.length>0&&1===this.stack[this.stack.length-1].type},t.prototype.decodeBinary=function(t,e){if(t>this.maxBinLength)throw new it("Max length exceeded: bin length ("+t+") > maxBinLength ("+this.maxBinLength+")");if(!this.hasRemaining(t+e))throw yt;var n=this.pos+e,i=this.bytes.subarray(n,n+t);return this.pos+=e+t,i},t.prototype.decodeExtension=function(t,e){if(t>this.maxExtLength)throw new it("Max length exceeded: ext length ("+t+") > maxExtLength ("+this.maxExtLength+")");var n=this.view.getInt8(this.pos+e),i=this.decodeBinary(t,e+1);return this.extensionCodec.decode(i,n,this.context)},t.prototype.lookU8=function(){return this.view.getUint8(this.pos)},t.prototype.lookU16=function(){return this.view.getUint16(this.pos)},t.prototype.lookU32=function(){return this.view.getUint32(this.pos)},t.prototype.readU8=function(){var t=this.view.getUint8(this.pos);return this.pos++,t},t.prototype.readI8=function(){var t=this.view.getInt8(this.pos);return this.pos++,t},t.prototype.readU16=function(){var t=this.view.getUint16(this.pos);return this.pos+=2,t},t.prototype.readI16=function(){var t=this.view.getInt16(this.pos);return this.pos+=2,t},t.prototype.readU32=function(){var t=this.view.getUint32(this.pos);return this.pos+=4,t},t.prototype.readI32=function(){var t=this.view.getInt32(this.pos);return this.pos+=4,t},t.prototype.readU64=function(){var t,e,n=4294967296*(t=this.view).getUint32(e=this.pos)+t.getUint32(e+4);return this.pos+=8,n},t.prototype.readI64=function(){var t=G(this.view,this.pos);return this.pos+=8,t},t.prototype.readF32=function(){var t=this.view.getFloat32(this.pos);return this.pos+=4,t},t.prototype.readF64=function(){var t=this.view.getFloat64(this.pos);return this.pos+=8,t},t}(),mt={};const gt=({maxRetryAttempts:e=3,retryTimeout:n=1e3}={})=>i=>i.pipe(J(((i,r)=>{const s=r+1;return s>e?function(e){const n=t(e)?e:()=>e,i=t=>t.error(n());return new _(i)}((()=>i)):K(s*n)})));class St{constructor(t="lavva",e="padding: 3px;\n            font-size: 10px;\n            font-family: monospace;\n            background-color: rgb(51, 102, 255);\n            color: #fff;\n            border-radius: 3px;"){this.label=t,this.style=e}log(...t){console.log(`%c${this.label}`,this.style,...t)}}class xt{}xt.TYPE="none";class _t extends xt{constructor(t){super(),this.data=t}getType(){return _t.TYPE}}_t.TYPE="message";class Et extends xt{constructor(t){super(),this.data=t}getType(){return Et.TYPE}}Et.TYPE="open";class Tt extends xt{constructor(t){super(),this.data=t}getType(){return Tt.TYPE}}Tt.TYPE="close";class At extends xt{constructor(t){super(),this.data=t}getType(){return At.TYPE}}var It;At.TYPE="error",function(t){t[t.DEFAULT=0]="DEFAULT",t[t.CLIENT_CONNECTED=1]="CLIENT_CONNECTED",t[t.CLIENT_DISCONNECTED=2]="CLIENT_DISCONNECTED",t[t.CLIENT_SUBSCRIBE=3]="CLIENT_SUBSCRIBE",t[t.CLIENT_SUBSCRIBED=4]="CLIENT_SUBSCRIBED",t[t.CLIENT_UNSUBSCRIBE=5]="CLIENT_UNSUBSCRIBE",t[t.CLIENT_UNSUBSCRIBED=6]="CLIENT_UNSUBSCRIBED",t[t.DATA=7]="DATA",t[t.PARTIAL_DATA=8]="PARTIAL_DATA"}(It||(It={}));class Ut{constructor(t){this.raw=t}get timestamp(){return this.raw.tms}get value(){return this.raw.val}get tag(){return this.raw.tag}get key(){return this.raw.key}get channel(){return this.raw.chn}get type(){return this.raw.typ}get category(){var t;return(null===(t=this.raw)||void 0===t?void 0:t.cat)||"default"}}const Ct={maxRetryAttempts:1/0,retryTimeout:1e3};class Ot{constructor({host:t,channels:e,apiKey:n,userId:i="",snapshot:r=!0,format:s="binary",encoding:o="msgpack"}){if(this.userId="",this.snapshot=!0,this.connected=!1,this.channels=new Set,this.events=new U,!t)throw new Error("host parameter is required");if(!e)throw new Error("channels have not been specified");if(0===e.length)throw new Error("channels are empty");if(!n||0===n.length)throw new Error("apiKey parameter is required");this.apiKey=n,this.host=t.startsWith("https://")?t.substring(8):t.startsWith("http://")?t.substring(7):t.startsWith("wss://")?t.substring(6):t.startsWith("ws://")?t.substring(5):t,this.userId=i,this.format=s,this.encoding=o,"msgpack"===this.encoding&&(this.format="binary"),this.snapshot=r,e.forEach((t=>this.channels.add(t)))}getSnapshotEndpoint(){let t=`https://${this.host}/snapshot?channels=`+Array.from(this.channels).map((t=>encodeURIComponent(t))).join(",");return""!==this.userId&&(t+=`&user_id=${encodeURIComponent(this.userId)}`),t+=`&apiKey=${encodeURIComponent(this.apiKey)}`,t}getWebsocketEndpoint(){let t=`wss://${this.host}/ws?channels=`+Array.from(this.channels).map((t=>encodeURIComponent(t))).join(",");return""!==this.userId&&(t+=`&user_id=${encodeURIComponent(this.userId)}`),t+=`&apiKey=${encodeURIComponent(this.apiKey)}`,t+=`&format=${encodeURIComponent(this.format)}`,t+=`&encoding=${encodeURIComponent(this.encoding)}`,t+=`&snapshot=${this.snapshot}`,t}fetchSnapshot(){return fetch(this.getSnapshotEndpoint()).then((t=>t.json())).then((t=>(Object.keys(t.Snapshot).forEach((e=>{t.Snapshot[e].forEach((t=>{this.events.next(new _t(t))}))})),t)))}connect(t=Ct){const e={url:this.getWebsocketEndpoint(),openObserver:{next:t=>{this.connected=!0,this.events.next(new Et(t))}},closeObserver:{next:t=>{this.connected=!1,this.events.next(new Tt(t))}},deserializer:t=>{if("msgpack"===this.encoding)return function(t,e){return void 0===e&&(e=mt),new bt(e.extensionCodec,e.context,e.maxStrLength,e.maxBinLength,e.maxArrayLength,e.maxMapLength,e.maxExtLength).decode(t)}(new Uint8Array(t.data));let e;return e="text"===this.format?JSON.parse(t.data):JSON.parse((new TextDecoder).decode(new Uint8Array(t.data))),e}};var n;return"binary"===this.format&&(e.binaryType="arraybuffer"),new Y(e).pipe(q((t=>this.channels.has(t.chn))),(n=gt({maxRetryAttempts:t.maxRetryAttempts,retryTimeout:t.retryTimeout}),T(((t,e)=>{let i,r,s=!1;const o=()=>{i=t.subscribe(new A(e,void 0,void 0,(t=>{r||(r=new U,n(r).subscribe(new A(e,(()=>i?o():s=!0)))),r&&r.next(t)}))),s&&(i.unsubscribe(),i=null,s=!1,o())};o()})))).subscribe({next:t=>{t.typ===It.CLIENT_CONNECTED&&(this.clientId=t.val.client_id),this.events.next(new _t(new Ut(t)))},error:t=>{this.events.next(new At(t))}})}openConnectionStream(){return this.events.asObservable().pipe(q((t=>t.getType()===Et.TYPE)),V((t=>t)))}dataConnectionStream(){return this.events.asObservable().pipe(q((t=>t.getType()===_t.TYPE)),V((t=>t)))}errorConnectionStream(){return this.events.asObservable().pipe(q((t=>t.getType()===At.TYPE)),V((t=>t)))}closeConnectionStream(){return this.events.asObservable().pipe(q((t=>t.getType()===Tt.TYPE)),V((t=>t)))}channelStream(...t){const e={};return t&&0!==t.length?t.forEach((t=>{e[t]=!0})):this.channels.forEach((t=>{e[t]=!0})),this.dataConnectionStream().pipe(q((t=>e.hasOwnProperty(t.data.channel))),V((t=>t.data)))}getUserId(){return this.userId}getClientId(){return this.clientId}isConnected(){return this.connected}}export{It as C,St as L,A as O,r as S,Ot as W,R as a,q as f,M as i,T as o,K as t}