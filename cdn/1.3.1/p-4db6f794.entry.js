import{h as t,r as i}from"./p-878bd889.js";import{o as s,O as e,i as a,a as o,t as r,S as n,f as M,W as h,C as u}from"./p-189a6ab1.js";import{s as c}from"./p-1c3cb269.js";import{a as d}from"./p-b0f56eea.js";const l={leading:!0,trailing:!1};const g=({data:i})=>t("li",{class:"twit","data-id":i.IDStr},t("img",{class:"avatar",title:i.User.Name,src:i.User.ProfileImageURLHttps}),t("div",{class:"body"},t("div",{class:"user"},t("div",null,i.User.Name),i.User.Verified?t("div",{class:"verified"}):null,t("div",{class:"handler"},"@",i.User.ScreenName)),t("div",{class:"msg"},i.Text),t("div",{class:"time"},i.CreatedAt),i.Source?t("div",{class:"source"},t("span",null,"Source:"),t("span",{innerHTML:i.Source})):null));let w=class{constructor(t){i(this,t),this.logger=d("twitter"),this.subscriptions=new n,this.host="xxxxxxxxxx.apps.anadyme.com",this.locale="en",this.translations=null,this.debug=!1,this.useCache=!0,this.namespace="twitter",this.connection=null,this.format="binary",this.encoding="msgpack",this.apiKey="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",this.size=void 0,this.data=[],this.throttle=1e3,this.autoconnect=!0}connect(t,i){this.autoconnect&&i?this.log("could not subscribe to events"):(this.subscriptions.add(this.connection.channelStream(this.channel).pipe(M((t=>t.type===u.CLIENT_CONNECTED))).subscribe((t=>{this.log("client connected",t.value.client_id),void 0===this.size&&(this.size=t.value.channel_size)}))),this.subscriptions.add(this.connection.channelStream(this.channel).pipe(M((t=>t.type===u.DATA)),function(t,i=o,n=l){const M=r(t,i);return function(t,i=l){return s(((s,o)=>{const{leading:r,trailing:n}=i;let M=!1,h=null,u=null,c=!1;const d=()=>{null==u||u.unsubscribe(),u=null,n&&(w(),c&&o.complete())},l=()=>{u=null,c&&o.complete()},g=i=>u=a(t(i)).subscribe(new e(o,d,l)),w=()=>{if(M){M=!1;const t=h;h=null,o.next(t),!c&&g(t)}};s.subscribe(new e(o,(t=>{M=!0,h=t,(!u||u.closed)&&(r?w():g(t))}),(()=>{c=!0,(!(n&&M&&u)||u.closed)&&o.complete()})))}))}((()=>M),n)}(this.throttle)).subscribe((t=>{this.saveTwit(t.value)}))))}async log(...t){this.debug&&this.logger.log(...t)}connectedCallback(){this.log("widget attached",this.size,"xyz"),this.loadTwits(),this.autoconnect&&(this.connection=new h({host:this.host,format:this.format,encoding:this.encoding,channels:this.channel?[this.channel]:[],apiKey:this.apiKey}),this.subscriptions.add(this.connection.connect()))}loadTwits(){if(this.useCache){const t=c.namespace(this.namespace);this.data=t.get(this.channel,this.data)}}saveTwit(t){this.data=[t,...this.data.slice(0,this.size-1)],this.useCache&&c.namespace(this.namespace).set(this.channel,this.data)}disconnectedCallback(){this.subscriptions.unsubscribe()}render(){return t("div",{"data-size":this.size},t("div",{class:"twitr"},t("ul",{class:"twits"},this.data.map((i=>t(g,{data:i}))))),t("div",{class:"powered-by"},"Powered by Twitter"))}static get watchers(){return{connection:["connect"]}}};w.style=':host{--display:flex;--flex-direction:column;--font:14px Roboto, Helvetica, Arial, Tahoma, sans-serif;--grid-template-columns:auto;--grid-template-rows:auto;--grid-gap:0;--twit-margin:0 0 20px 0;--twit-min-width:500px;--twit-max-width:500px;font:var(--font)}:host .powered-by{font-size:0.6rem;font-family:"monospace";opacity:0.5;padding:2px 0}:host .twitr{font:inherit}:host .twitr .twits{font:inherit;padding-left:0;list-style:none;display:var(--display);flex-direction:var(--flex-direction);grid-gap:var(--grid-gap);grid-template-rows:var(--grid-template-rows);grid-template-columns:var(--grid-template-columns)}:host .twitr .twits .twit{display:flex;margin:var(--twit-margin);max-width:var(--twit-max-width);min-width:var(--twit-min-width);padding:15px;border-radius:4px;box-sizing:border-box;border:1px solid rgba(160, 200, 220, 0.12)}:host .twitr .twits .twit .avatar{height:32px;width:32px;border-radius:4px}:host .twitr .twits .twit .body{margin-left:10px}:host .twitr .twits .twit .body .user{font-size:1rem;font-weight:700;line-height:18px;display:flex}:host .twitr .twits .twit .body .user .verified{opacity:1;cursor:default;display:inline-block;width:1em;height:1.25em;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA3MiI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGg2NHY3MkgweiIvPjxwYXRoIGZpbGw9IiM4OGM5ZjkiIGQ9Ik0zIDM3LjMxNWMwIDQuMTI1IDIuMTYyIDcuNzI2IDUuMzYzIDkuNjI0LS4wNTYuNDY3LS4wOS45MzctLjA5IDEuNDIgMCA2LjEwMyA0LjcyIDExLjA0NSAxMC41NDYgMTEuMDQ1IDEuMjk1IDAgMi41NDItLjIzNCAzLjY4Ny0uNjg2QzI0LjIyIDYyLjQgMjcuODI3IDY0LjkzIDMyIDY0LjkzYzQuMTc0IDAgNy43ODItMi41MyA5LjQ5LTYuMjEzIDEuMTQ4LjQ1IDIuMzkuNjg1IDMuNjkuNjg1IDUuODI2IDAgMTAuNTQ2LTQuOTQgMTAuNTQ2LTExLjA0NSAwLS40ODMtLjAzNy0uOTUzLS4wOTMtMS40MkM1OC44MyA0NS4wNCA2MSA0MS40NCA2MSAzNy4zMTRjMC00LjM3LTIuNDItOC4xNS01LjkzMy05Ljk0Ni40MjctMS4yMDMuNjU4LTIuNS42NTgtMy44NjUgMC02LjEwNC00LjcyLTExLjA0NS0xMC41NDUtMTEuMDQ1LTEuMzAyIDAtMi41NDMuMjMyLTMuNjkuNjg4LTEuNzA3LTMuNjg1LTUuMzE1LTYuMjE2LTkuNDktNi4yMTYtNC4xNzMgMC03Ljc3OCAyLjUzLTkuNDkyIDYuMjE2LTEuMTQ2LS40NTUtMi4zOTMtLjY4OC0zLjY4OC0uNjg4LTUuODI3IDAtMTAuNTQ1IDQuOTQtMTAuNTQ1IDExLjA0NSAwIDEuMzY0LjIzIDIuNjYyLjY1NiAzLjg2NEM1LjQyIDI5LjE2MyAzIDMyLjk0NCAzIDM3LjMxNHoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTcuODcgMzkuMDhsNy4wMTUgNi45NzhjLjU4NS41ODIgMS4zNS44NzMgMi4xMTYuODczLjc3IDAgMS41NDItLjI5NCAyLjEyNy0uODgzLjM0NC0uMzQ2IDE1Ljk4LTE1Ljk3NCAxNS45OC0xNS45NzQgMS4xNzItMS4xNzIgMS4xNzItMy4wNyAwLTQuMjQzLTEuMTctMS4xNy0zLjA3LTEuMTcyLTQuMjQyIDBsLTEzLjg3IDEzLjg2My00Ljg5Mi00Ljg2OGMtMS4xNzQtMS4xNjgtMy4wNzQtMS4xNjQtNC4yNDIuMDEtMS4xNjggMS4xNzYtMS4xNjMgMy4wNzUuMDEgNC4yNDR6Ii8+PC9zdmc+")}:host .twitr .twits .twit .body .user .handler{margin-left:5px;font-size:0.9rem;line-height:18px;font-weight:300;color:#8899A6}:host .twitr .twits .twit .body .msg{font-size:1.1rem;line-height:24px;font-weight:300}:host .twitr .twits .twit .body .time{margin-top:5px;font-size:0.8rem;font-weight:500;opacity:0.6}:host .twitr .twits .twit .body .source{color:#8899A6;font-size:0.7rem;margin-top:5px;font-weight:300}:host .twitr .twits .twit .body .source span{margin-right:5px}:host .twitr .twits .twit .body .source span a{color:#808080;opacity:0.8}';export{w as lv_twitter}