import{r as i,h as t}from"./p-878bd889.js";import{o as s,O as e,a as n,S as o,f as r,C as l}from"./p-189a6ab1.js";import{s as a}from"./p-1c3cb269.js";import{a as h,c}from"./p-b0f56eea.js";let d=class{constructor(t){i(this,t),this.connection=null,this.dataKey=void 0,this.namespace="own",this.useCache=!0,this.debug=!1,this.logger=h("owm"),this.subscriptions=new o}async log(...i){this.debug&&this.logger.log(...i)}connectedCallback(){if(this.loadWeather(),!this.connection)throw new Error("connection was not found");this.subscriptions.add(this.connection.channelStream(this.channel).pipe(r((i=>i.type===l.CLIENT_CONNECTED))).subscribe((i=>{this.log("client connected",i.value.client_id)}))),this.subscriptions.add(this.connection.channelStream(this.channel).pipe(r((i=>i.type===l.DATA)),r((i=>void 0===this.dataKey||i.key===this.dataKey)),function(i,t=n){return s(((s,n)=>{let o=null,r=null,l=null;const a=()=>{if(o){o.unsubscribe(),o=null;const i=r;r=null,n.next(i)}};function h(){const s=l+i,e=t.now();if(e<s)return o=this.schedule(void 0,s-e),void n.add(o);a()}s.subscribe(new e(n,(s=>{r=s,l=t.now(),o||(o=t.schedule(h,i),n.add(o))}),(()=>{a(),n.complete()}),void 0,(()=>{r=o=null})))}))}(150)).subscribe((i=>{this.saveWeather(i.value)})))}saveWeather(i){this.data=i,this.useCache&&a.namespace(this.namespace).set(this.channel,i)}loadWeather(){if(this.useCache){const i=a.namespace(this.namespace);this.data=i.get(this.channel,this.data)}}disconnectedCallback(){this.subscriptions.unsubscribe()}render(){if(!this.data)return t("span",{class:"loading"},"loading");const i=`weather wi wi-owm-${this.data.current.weather[0].id}`,s=c(this.data.current.weather[0].description);return t("div",null,t("div",{class:"owm"},t("div",{class:"current"},t("label",null,"Today"),t("div",{title:"Temperature",class:"temp"},this.data.current.temp,"°"),t("i",{title:s,class:i}),t("div",{class:"humidity",title:"Humidity"},t("div",null,t("i",{class:"wi wi-humidity"})),t("div",null,this.data.current.humidity," %")),t("div",{class:"pressure",title:"Pressure"},t("div",null,t("i",{class:"wi wi-barometer"})),t("div",null,this.data.current.pressure," hPa"))),this.data.daily.filter(((i,t)=>t>0&&t<7)).map(((i,s)=>t("owm-daily-item",{seq:s,day:i})))),t("div",{class:"powered-by"},"Powered by OpenWeather"))}};d.style='.loading{font-weight:300;font-size:11px;line-height:11px;font-family:"monospace";display:inline-block}.powered-by{font-size:9px;font-family:"monospace";opacity:0.5;padding:2px 0}.owm{display:flex;color:#fff;text-align:center}.owm .current{width:180px;padding:20px;box-sizing:border-box;background:#8bc1d9}.owm .current label{font-size:28px}.owm .current .temp{font-size:40px}.owm .current .weather{font-size:60px;margin:20px 0}.owm .current .humidity{display:flex;font-size:24px;margin:4px 0}.owm .current .humidity .wi{margin-right:5px}.owm .current .pressure{display:flex;font-size:24px;margin:8px 0}.owm .current .pressure .wi{margin-right:5px}';export{d as owm_daily}