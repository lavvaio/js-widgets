import{r as e,c as s,h as a}from"./p-878bd889.js";import{S as t,f as i,W as l,C as o}from"./p-189a6ab1.js";import{s as n}from"./p-1c3cb269.js";import{a as d,t as u}from"./p-b0f56eea.js";let h=class{constructor(a){e(this,a),this.tradeClick=s(this,"tradeClick",7),this.logger=d("mt-rates"),this.subscriptions=new t,this.host="xxxxxxxxxx.apps.anadyme.com",this.locale="en",this.size="default",this.translations=null,this.tabs=!0,this.names=!0,this.tab="popular",this.groups=[{name:"popular",label:this.translate("popular","Popular"),symbols:[{key:"BTCUSDm",label:"BTC/USD",image:"/build/assets/svg/BTCUSDm.svg"},{key:"XAUUSDm",label:"Gold/USD",image:"/build/assets/svg/XAUUSDm.svg"},{key:"EURUSDm",label:"EUR/USD",image:"/build/assets/svg/EURUSDm.svg"},{key:"USOILm",label:"US Oil",image:"/build/assets/svg/USOILm.svg"},{key:"ETHUSDm",label:"ETH/USD",image:"/build/assets/svg/ETHUSDm.svg"}]},{name:"forex",label:this.translate("forex","Forex"),symbols:[{key:"EURUSDm",label:"EUR/USD",image:"/build/assets/svg/EURUSDm.svg"},{key:"USDJPYm",label:"USD/JPY",image:"/build/assets/svg/USDJPYm.svg"},{key:"GBPUSDm",label:"GBP/USD",image:"/build/assets/svg/GBPUSDm.svg"},{key:"USDCHFm",label:"USD/CHF",image:"/build/assets/svg/USDCHFm.svg"},{key:"USDCADm",label:"USD/CAD",image:"/build/assets/svg/USDCADm.svg"}]},{name:"stocks",label:this.translate("stocks","Stocks"),symbols:[{key:"USTECm",label:"US Tech 100",image:"/build/assets/svg/USTECm.svg"},{key:"UK100m",label:"UK 100 Index",image:"/build/assets/svg/UK100m.svg"},{key:"STOXX50m",label:"EU 50 Index",image:"/build/assets/svg/STOXX50m.svg"},{key:"HK50m",label:"HK 50 Index",image:"/build/assets/svg/HK50m.svg"},{key:"DE30m",label:"DE 30 Index",image:"/build/assets/svg/DE30m.svg"}]},{name:"crypto",label:this.translate("crypto","Crypto"),symbols:[{key:"BTCUSDm",label:"BTC/USD",image:"/build/assets/svg/BTCUSDm.svg"},{key:"BTCJPYm",label:"BTC/JPY",image:"/build/assets/svg/BTCJPYm.svg"},{key:"ETHUSDm",label:"ETH/USD",image:"/build/assets/svg/ETHUSDm.svg"},{key:"LTCUSDm",label:"LTC/USD",image:"/build/assets/svg/LTCUSDm.svg"},{key:"XRPUSDm",label:"XRP/USD",image:"/build/assets/svg/XRPUSDm.svg"}]},{name:"shares",label:this.translate("shares","Shares"),symbols:[{key:"AAPLm",label:"Apple",image:"/build/assets/svg/AAPLm.svg"},{key:"BABAm",label:"AliBaba",image:"/build/assets/svg/BABAm.svg"},{key:"Cm",label:"CitiGroup",image:"/build/assets/svg/Cm.svg"},{key:"KOm",label:"CocaCola",image:"/build/assets/svg/KOm.svg"},{key:"NFLXm",label:"Netflix",image:"/build/assets/svg/NFLXm.svg"}]},{name:"metal",label:this.translate("metal","Metals"),symbols:[{key:"XAUUSDm",label:"Gold/USD",image:"/build/assets/svg/XAUUSDm.svg"},{key:"XAGUSDm",label:"Silver/USD",image:"/build/assets/svg/XAGUSDm.svg"},{key:"XPDUSDm",label:"Palladium/USD",image:"/build/assets/svg/XPDUSDm.svg"},{key:"XPTUSDm",label:"Platinum/USD",image:"/build/assets/svg/XPTUSDm.svg"},{key:"XPTUSDm",label:"Platinum/USD",image:"/build/assets/svg/XPTUSDm.svg"}]}],this.data=[],this.loading=!0,this.storage=new Map,this.format="binary",this.encoding="msgpack",this.apiKey="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",this.snapshot=!0,this.useCache=!0,this.namespace="mt-rates",this.debug=!1,this.autoconnect=!0,this.connection=null}connect(e,s){this.autoconnect&&s?this.log("could not subscribe to events"):(this.subscriptions.add(this.connection.channelStream(this.channel).pipe(i((e=>e.type===o.CLIENT_CONNECTED))).subscribe((e=>{this.log("client connected",e.value.client_id,e)}))),this.subscriptions.add(this.connection.channelStream(this.channel).pipe(i((e=>e.type===o.DATA)),i((e=>"ticks"===e.category))).subscribe((e=>{this.saveQuote(e.value)}))))}async log(...e){this.debug&&this.logger.log(...e)}translate(e,s){return u(e,s,this.translations,this.locale)}selectCategory(e){this.groups=this.groups.map((s=>Object.assign(s,{active:s.name===e.name})))}connectedCallback(){this.log("widget attached",this.tab);const e=this.groups.findIndex((e=>e.name===this.tab));e>=0?this.groups[e].active=!0:this.groups[0].active=!0,this.loadQuotes(),this.autoconnect&&(this.connection=new l({host:this.host,format:this.format,encoding:this.encoding,channels:this.channel?[this.channel]:[],apiKey:this.apiKey}),this.subscriptions.add(this.connection.connect()))}saveQuote(e){this.storage.has(e.Symbol)&&this.storage.get(e.Symbol).Time>e.Time?this.log("detected older quote",e):(this.loading&&(this.loading=!1),this.storage.set(e.Symbol,e),this.data=Array.from(this.storage,(([e,s])=>s)),this.useCache&&n.namespace(this.namespace).set(this.channel,this.data))}loadQuotes(){if(this.log("loading quotes"),this.useCache){const e=n.namespace(this.namespace);this.data=e.get(this.channel,this.data),this.storage=new Map((this.data||[]).map((e=>[e.Symbol,e]))),this.log("cached quotes found",this.storage)}}disconnectedCallback(){this.subscriptions.unsubscribe()}getEmptyRatePlaceholder(){return a("div",{class:"column-values"},a("div",{class:"icon"}," "),this.names&&a("div",{class:"name"}," "),a("div",{class:"sell"}," "),a("div",{class:"buy"}," "),a("div",{class:"spread"}," "),a("div",{class:"change"}," "),a("div",{class:"action"}," "))}getRate(e,s,t){const i=parseFloat(`${e.PerDiff||0}`).toFixed(3);return a("div",{class:"column-values"},a("div",{class:"icon"},a("img",{class:`${s.key} ${t.name}`,src:s.image})),this.names&&a("div",{class:"name"},a("span",null,this.translate(s.key,s.label))),a("div",{class:"sell"},a("span",null,e.Bid)),a("div",{class:"buy"},a("span",null,e.Ask)),a("div",{class:"spread"},a("span",null,e.Spread)),a("div",{class:"change"},a("span",{class:e.PerDiff>0?"up":e.PerDiff<0?"down":""},e.PerDiff>0?"+":"",i,"%")),a("div",{class:"action"},a("button",{onClick:()=>this.tradeClick.emit(s)},this.translate("trade","Trade"))))}renderLoading(){return a("div",{class:"loader"},a("span",{class:"txt"},this.translate("loading","Loading...")))}render(){return a("div",{class:`size-default size-${this.size} ${this.tabs?"with-tabs":"no-tabs"} ${this.names?"with-names":"no-names"}`},this.tabs&&a("div",null,a("div",{class:this.groups[this.groups.length-1].active?"active right-faded":"right-faded"}),a("header",null,a("ul",{class:"categories"},this.groups.map((e=>a("li",{onClick:()=>this.selectCategory(e),class:e.active?`${e.name} active`:e.name},a("span",null,this.translate(e.name,e.label)))))))),a("section",{class:"body"},this.loading&&this.renderLoading(),a("div",{class:"column-names"},a("div",{class:"icon"},a("span",null," ")),this.names&&a("div",{class:"name"},a("span",null,this.translate("name","Name"))),a("div",{class:"sell"},a("span",null,this.translate("sell","Sell"))),a("div",{class:"buy"},a("span",null,this.translate("buy","Buy"))),a("div",{class:"spread"},a("span",null,this.translate("spread","Spread"))),a("div",{class:"change"},a("span",null,this.translate("change","Change"))),a("div",{class:"action"},a("span",null," "))),this.groups.map((e=>a("div",{class:e.active?"symbol-group active":"symbol-group"},e.symbols.map((s=>{if(this.storage.has(s.key)){const a=this.storage.get(s.key);return this.getRate(a,s,e)}return this.getEmptyRatePlaceholder()})))))))}static get assetsDirs(){return["./assets"]}static get watchers(){return{connection:["connect"]}}};h.style=":host{--padding:38px 40px;--border-radius:0;--background-color:rgb(38, 38, 38);--symbol-percent-up:rgb(0, 217, 100);--symbol-percent-down:rgb(255, 0, 0);--symbol-space-between:5px;--tabs-padding:0 25px;--tabs-bottom-border:0.5px solid #535358;--tab-padding:10px 0 6px 0;--tab-color:inherit;--tab-active-color:#FED831;--tab-active-border-bottom:1px solid #FED831;--tab-bg-color:transparent;--tab-active-bg-color:transparent;--data-column-min-height:59px;--data-action-bg-color:#FED831;--data-action-color:#131213;--data-action-border-radius:51px;--data-column-header-bg-color:#1D1D20;--data-column-header-text-color:#9C9CA2;--data-column-value-bg-color:#1D1D20;--data-column-value-text-color:#fff;--data-column-value-hovered-bg-color:#282828;--data-column-value-hovered-text-color:#fff;display:block}:host .size-default{max-width:650px;background:var(--background-color);color:#DADBDF;font-size:14px;border-radius:var(--border-radius);position:relative}:host .size-default .right-faded{position:absolute;top:0;right:0;background:var(--background-color);background:linear-gradient(to right, transparent, var(--background-color));height:31px;width:31px;border-top-right-radius:var(--border-radius)}:host .size-default .right-faded.active{background:linear-gradient(to right, transparent, var(--tab-active-bg-color))}:host .size-default header{overflow-x:hidden}:host .size-default header ul{overflow-x:scroll;-ms-overflow-style:none;scrollbar-width:none;list-style:none;padding:var(--tabs-padding);border-bottom:var(--tabs-bottom-border);display:flex;margin:0}:host .size-default header ul::-webkit-scrollbar{display:none}:host .size-default header ul li{font-weight:400;padding:var(--tab-padding);color:var(--tab-color);cursor:pointer;text-align:center;white-space:nowrap;line-height:15px;flex:1;background-color:var(--tab-bg-color)}@media only screen and (max-width: 550px){:host .size-default header ul li{margin-right:20px;flex:0}}:host .size-default header ul li span{padding-bottom:5px;line-height:inherit;font-size:inherit;user-select:none;border-bottom:1px solid transparent}:host .size-default header ul li.active{color:var(--tab-active-color);background-color:var(--tab-active-bg-color);font-weight:500}:host .size-default header ul li.active span{border-bottom:var(--tab-active-border-bottom)}:host .size-default .body{padding:var(--padding);position:relative}:host .size-default .body .loader{position:absolute;height:100%;width:100%;left:0;top:0;display:flex;align-items:center;justify-content:center;background:rgba(1, 1, 1, 0.5);font-family:inherit;font-size:18px;font-weight:500}:host .size-default .body .loader .txt{opacity:0.8}:host .size-default .body .column-names{background:var(--data-column-header-bg-color);display:flex;justify-content:space-between;align-items:center;font-weight:500}:host .size-default .body .column-names div{line-height:20px;padding:7px 0;text-align:left;color:var(--data-column-header-text-color);flex:1}:host .size-default .body .column-names .name{flex:1.2}:host .size-default .body .column-names .action{flex:1}:host .size-default .body .column-names .buy{flex:0.9}:host .size-default .body .column-names .sell{flex:0.9}:host .size-default .body .column-names .change{flex:0.8}:host .size-default .body .column-names .action{flex:1.2}:host .size-default .body .column-names .spread{display:none}@media only screen and (min-width: 320px) and (max-width: 440px){:host .size-default .body .column-names .change{display:none}:host .size-default .body .column-names .spread{display:none}:host .size-default .body .column-names .buy{display:none}}@media only screen and (min-width: 441px) and (max-width: 500px){:host .size-default .body .column-names .change{display:none}:host .size-default .body .column-names .spread{display:none}}@media only screen and (min-width: 501px) and (max-width: 550px){:host .size-default .body .column-names .change{display:none}:host .size-default .body .column-names .spread{display:none}}@media only screen and (min-width: 551px) and (max-width: 580px){:host .size-default .body .column-names .spread{display:none}}:host .size-default .body .column-values{background:var(--data-column-value-bg-color);display:flex;justify-content:space-between;align-items:center;margin-top:var(--symbol-space-between);color:var(--data-column-value-text-color);min-height:var(--data-column-min-height);box-sizing:border-box}:host .size-default .body .column-values:hover{color:var(--data-column-value-hovered-text-color);background:var(--data-column-value-hovered-bg-color)}:host .size-default .body .column-values div{flex:1}:host .size-default .body .column-values .icon{text-align:center;padding:10px 0;flex:1;display:flex;align-items:center;align-content:center;justify-content:center}:host .size-default .body .column-values .name{flex:1.2}:host .size-default .body .column-values .action{flex:1;text-align:center;user-select:none}:host .size-default .body .column-values .action button{font:inherit;background:var(--data-action-bg-color);color:var(--data-action-color);border:0;width:77px;border-radius:var(--data-action-border-radius);font-size:12px;font-weight:500;padding:7px 5px;cursor:pointer;user-select:none}:host .size-default .body .column-values .change{flex:0.8}:host .size-default .body .column-values .change .up{color:var(--symbol-percent-up)}:host .size-default .body .column-values .change .down{color:var(--symbol-percent-down)}:host .size-default .body .column-values .action{flex:1.2}:host .size-default .body .column-values .buy{flex:0.9}:host .size-default .body .column-values .sell{flex:0.9}:host .size-default .body .column-values .spread{display:none}:host .size-default .body .column-values .icon img{height:20.47px;width:37.39px}:host .size-default .body .column-values .icon img.USOILm,:host .size-default .body .column-values .icon img.indices,:host .size-default .body .column-values .icon img.shares{height:35px;width:35px}@media only screen and (min-width: 320px) and (max-width: 440px){:host .size-default .body .column-values .change{display:none}:host .size-default .body .column-values .spread{display:none}:host .size-default .body .column-values .name{flex:1;font-size:13px}:host .size-default .body .column-values .buy{flex:0.9;display:none;font-size:13px}:host .size-default .body .column-values .sell{flex:0.9;font-size:13px}:host .size-default .body .column-values .icon{flex:1;padding:8px 0}:host .size-default .body .column-values .icon img{min-height:20px;max-height:20px}:host .size-default .body .column-values .action{flex:1;font-size:13px}}@media only screen and (min-width: 441px) and (max-width: 500px){:host .size-default .body .column-values .change{display:none}:host .size-default .body .column-values .spread{display:none}:host .size-default .body .column-values .buy{flex:0.9;font-size:13px}:host .size-default .body .column-values .sell{flex:0.9;font-size:13px}:host .size-default .body .column-values .name{flex:1.2;font-size:13px}:host .size-default .body .column-values .icon{flex:1;padding:8px 0}:host .size-default .body .column-values .icon img{min-height:20px;max-height:20px}:host .size-default .body .column-values .action{flex:1;font-size:13px}}@media only screen and (min-width: 501px) and (max-width: 550px){:host .size-default .body .column-values .change{display:none}:host .size-default .body .column-values .spread{display:none}}:host .size-default .body .symbol-group{display:none}:host .size-default .body .symbol-group.active{display:block}@media only screen and (min-width: 320px) and (max-width: 440px){:host .size-default.no-names .body .column-names .buy{display:block}:host .size-default.no-names .body .column-values .buy{display:block}}:host .size-default.size-large{font-size:17px;max-width:800px}:host .size-default.size-large .right-faded{height:38px}:host .size-default.size-large header ul li{padding-top:14.75px;padding-bottom:8px}:host .size-default.size-large .body{padding:var(--padding)}:host .size-default.size-large .body .column-names div{padding:10.75px 0}:host .size-default.size-large .body .column-values{min-height:73px;margin-top:5.75px}:host .size-default.size-large .body .column-values .icon img{height:25.22px;width:46.02px}:host .size-default.size-large .body .column-values .icon img.USOILm,:host .size-default.size-large .body .column-values .icon img.indices,:host .size-default.size-large .body .column-values .icon img.shares{height:45px;width:45px}:host .size-default.size-large .body .column-values .action button{width:95px;padding:8.5px 5px;line-height:18px;font-weight:500;font-size:14.7857px}@media only screen and (max-width: 720px){:host .size-default.size-large .body .column-values .action button{width:90px;margin:0 10px}}@media only screen and (max-width: 680px){:host .size-default.size-large{font-size:15px}:host .size-default.size-large .body .column-names .action{min-width:110px}:host .size-default.size-large .body .column-values .action{min-width:110px}:host .size-default.size-large .body .column-values .action button{width:80px;margin:0 15px}}@media only screen and (max-width: 618px){:host .size-default.size-large .body .column-names .action{min-width:90px}:host .size-default.size-large .body .column-values .action{min-width:90px}:host .size-default.size-large .body .column-values .action button{width:80px;margin:0}}@media only screen and (max-width: 580px){:host .size-default.size-large{font-size:14px}:host .size-default.size-large .body .column-names .name{font-size:inherit}:host .size-default.size-large .body .column-values .name{font-size:inherit}:host .size-default.size-large .body .column-names .sell{font-size:inherit}:host .size-default.size-large .body .column-values .sell{font-size:inherit}:host .size-default.size-large .body .column-names .buy{font-size:inherit}:host .size-default.size-large .body .column-values .buy{font-size:inherit}:host .size-default.size-large .body .column-names .change{font-size:inherit}:host .size-default.size-large .body .column-values .change{font-size:inherit}}@media only screen and (max-width: 480px){:host .size-default.size-large .body{padding:30px;padding-top:32px}}@media only screen and (max-width: 380px){:host .size-default.size-large{font-size:13px}:host .size-default.size-large .body{padding:28px;padding-top:30px}}@media only screen and (max-width: 340px){:host .size-default.size-large .body{padding:26px;padding-top:28px}}";export{h as mt_rates}