import{o,c as e,w as s,F as t,f as n,a,l as r,d as l,p as c,b as i,r as d,e as m,v as p,g as u,h,t as g,i as f,j as v,k as w}from"./vendor.81cd6342.js";!function(o=".",e="__import__"){try{self[e]=new Function("u","return import(u)")}catch(s){const t=new URL(o,location),n=o=>{URL.revokeObjectURL(o.src),o.remove()};self[e]=o=>new Promise(((s,a)=>{const r=new URL(o,t);if(self[e].moduleMap[r])return s(self[e].moduleMap[r]);const l=new Blob([`import * as m from '${r}';`,`${e}.moduleMap['${r}']=m;`],{type:"text/javascript"}),c=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(l),onerror(){a(new Error(`Failed to import: ${o}`)),n(c)},onload(){s(self[e].moduleMap[r]),n(c)}});document.head.appendChild(c)})),self[e].moduleMap={}}}("/assets/");const b={name:"AlarmSignal",props:{name:String,state:String},computed:{css(){return{[this.name]:!0,on:"on"===this.state}}},methods:{toggle(){const o=new URL(window.location.href);o.pathname=`/${this.name}`,"http://localhost:3000"===o.origin&&(o.port="8080"),fetch(o,{method:"on"===this.state?"DELETE":"PUT"})}}},y=s("data-v-167ffe52")(((s,t,n,a,r,l)=>(o(),e("div",{class:["signal",l.css],onClick:t[1]||(t[1]=(...o)=>l.toggle&&l.toggle(...o))},null,2))));b.render=y,b.__scopeId="data-v-167ffe52";t.appIcons={faDoorOpen:n,faDoorClosed:a},r.add(Object.values(t.appIcons)),l.watch();const $={name:"Door",components:{"v-icon":t},props:{name:String,state:String,severity:String},computed:{css(){return console.log(`${this.name} is now ${this.severity}`),{[this.severity||"normal"]:!0}},iconObj(){return console.log(`${this.name} should show door-${this.state}`),["fas","open"===this.state?"door-open":"door-closed"]}}},j=s("data-v-5b5828ee");c("data-v-5b5828ee");const R=u("br",null,null,-1);i();const L=j(((s,t,n,a,r,l)=>{const c=d("v-icon");return o(),e("div",{class:["door",l.css]},[m(u("span",null,[u(c,{class:"icon",icon:"door-closed"})],512),[[p,"closed"===n.state]]),m(u("span",null,[u(c,{class:"icon",icon:"door-open"})],512),[[p,"open"===n.state]]),R,h(" "+g(n.name)+": "+g(n.state),1)],2)}));$.render=L,$.__scopeId="data-v-5b5828ee";const O={name:"App",components:{"alarm-signal":b,door:$},data:()=>({alarms:{general:"off",co2:"on"},doors:{ER:"closed",ECR:"closed"}}),created(){const o=window.location;new WebSocket(`ws://${o.host}:${o.poort}/subscribe`).onmessage=o=>{try{const e=JSON.parse(o.data);for(const o in e){const s=e[o];"on"===s||"off"===s?this.alarms[o]=s:"open"!==s&&"closed"!==s||(console.log(`${o} is now ${s}`),this.doors[o]=s)}}catch(e){console.warn(e)}}},methods:{severity(o){return console.log(`recomputing severity for ${o}..`),"open"===this.doors[o]?Object.values(this.doors).filter((o=>"open"===o)).length>1?"danger":"warning":"normal"}}},S={class:"layout"},U={class:"signal-column"};O.render=function(s,t,n,a,r,l){const c=d("alarm-signal"),i=d("door");return o(),e("div",S,[u("div",U,[(o(!0),e(f,null,v(r.alarms,((s,t)=>(o(),e(c,{key:t,name:t,state:s},null,8,["name","state"])))),128))]),(o(!0),e(f,null,v(r.doors,((s,t)=>(o(),e(i,{class:"door",key:t,name:t,state:s,severity:l.severity(t)},null,8,["name","state","severity"])))),128))])},w(O).mount("#app");
