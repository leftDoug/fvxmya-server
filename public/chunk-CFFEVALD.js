import{fa as L,ga as E}from"./chunk-4QDCCIOF.js";import{Ha as d,La as k,Na as D,j as P,o as N,t as b}from"./chunk-IKJW6TPM.js";import{Ab as r,Bb as l,Cb as y,Mb as I,Nb as $,Ua as C,Vb as w,W as p,X as c,aa as g,ac as h,bc as B,fb as a,gb as f,ia as S,ja as o,jb as u,qb as s,rb as m,sb as v,tb as z,ub as F,vb as j}from"./chunk-HNFCKW2U.js";var x=["*"],A=({dt:e})=>`
.p-divider-horizontal {
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    margin: ${e("divider.horizontal.margin")};
    padding: ${e("divider.horizontal.padding")};
}

.p-divider-horizontal:before {
    position: absolute;
    display: block;
    inset-block-start: 50%;
    inset-inline-start: 0;
    width: 100%;
    content: "";
    border-block-start: 1px solid ${e("divider.border.color")};
}

.p-divider-horizontal .p-divider-content {
    padding: ${e("divider.horizontal.content.padding")};
}

.p-divider-vertical {
    min-height: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    margin: ${e("divider.vertical.margin")};
    padding: ${e("divider.vertical.padding")};
}

.p-divider-vertical:before {
    position: absolute;
    display: block;
    inset-block-start: 0;
    inset-inline-start: 50%;
    height: 100%;
    content: "";
    border-inline-start: 1px solid ${e("divider.border.color")};
}

.p-divider.p-divider-vertical .p-divider-content {
    padding: ${e("divider.vertical.content.padding")};
}

.p-divider-content {
    z-index: 1;
    background: ${e("divider.content.background")};
    color: ${e("divider.content.color")};
}

.p-divider-solid.p-divider-horizontal:before {
    border-block-start-style: solid;
}

.p-divider-solid.p-divider-vertical:before {
    border-inline-start-style: solid;
}

.p-divider-dashed.p-divider-horizontal:before {
    border-block-start-style: dashed;
}

.p-divider-dashed.p-divider-vertical:before {
    border-inline-start-style: dashed;
}

.p-divider-dotted.p-divider-horizontal:before {
    border-block-start-style: dotted;
}

.p-divider-dotted.p-divider-vertical:before {
    border-inline-start-style: dotted;
}

.p-divider-left:dir(rtl),
.p-divider-right:dir(rtl) {
    flex-direction: row-reverse;
}
`,J={root:({props:e})=>({justifyContent:e.layout==="horizontal"?e.align==="center"||e.align===null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align===null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null})},K={root:({props:e})=>["p-divider p-component","p-divider-"+e.layout,"p-divider-"+e.type,{"p-divider-left":e.layout==="horizontal"&&(!e.align||e.align==="left")},{"p-divider-center":e.layout==="horizontal"&&e.align==="center"},{"p-divider-right":e.layout==="horizontal"&&e.align==="right"},{"p-divider-top":e.layout==="vertical"&&e.align==="top"},{"p-divider-center":e.layout==="vertical"&&(!e.align||e.align==="center")},{"p-divider-bottom":e.layout==="vertical"&&e.align==="bottom"}],content:"p-divider-content"},W=(()=>{class e extends k{name="divider";theme=A;classes=K;inlineStyles=J;static \u0275fac=(()=>{let t;return function(i){return(t||(t=o(e)))(i||e)}})();static \u0275prov=p({token:e,factory:e.\u0275fac})}return e})();var O=(()=>{class e extends D{style;styleClass;layout="horizontal";type="solid";align;_componentStyle=g(W);get hostClass(){return this.styleClass}static \u0275fac=(()=>{let t;return function(i){return(t||(t=o(e)))(i||e)}})();static \u0275cmp=a({type:e,selectors:[["p-divider"]],hostVars:33,hostBindings:function(n,i){n&2&&(s("aria-orientation",i.layout)("data-pc-name","divider")("role","separator"),j(i.hostClass),v("justify-content",i.layout==="horizontal"?i.align==="center"||i.align===void 0?"center":i.align==="left"?"flex-start":i.align==="right"?"flex-end":null:null)("align-items",i.layout==="vertical"?i.align==="center"||i.align===void 0?"center":i.align==="top"?"flex-start":i.align==="bottom"?"flex-end":null:null),z("p-divider",!0)("p-component",!0)("p-divider-horizontal",i.layout==="horizontal")("p-divider-vertical",i.layout==="vertical")("p-divider-solid",i.type==="solid")("p-divider-dashed",i.type==="dashed")("p-divider-dotted",i.type==="dotted")("p-divider-left",i.layout==="horizontal"&&(!i.align||i.align==="left"))("p-divider-center",i.layout==="horizontal"&&i.align==="center"||i.layout==="vertical"&&(!i.align||i.align==="center"))("p-divider-right",i.layout==="horizontal"&&i.align==="right")("p-divider-top",i.layout==="vertical"&&i.align==="top")("p-divider-bottom",i.layout==="vertical"&&i.align==="bottom"))},inputs:{style:"style",styleClass:"styleClass",layout:"layout",type:"type",align:"align"},features:[h([W]),u],ngContentSelectors:x,decls:2,vars:0,consts:[[1,"p-divider-content"]],template:function(n,i){n&1&&(I(),r(0,"div",0),$(1),l())},dependencies:[b,d],encapsulation:2,changeDetection:0})}return e})(),de=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=f({type:e});static \u0275inj=c({imports:[O]})}return e})();var Q=({dt:e})=>`
.p-progressspinner {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    display: inline-block;
}

.p-progressspinner::before {
    content: "";
    display: block;
    padding-top: 100%;
}

.p-progressspinner-spin {
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: p-progressspinner-rotate 2s linear infinite;
}

.p-progressspinner-circle {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: 0;
    stroke: ${e("progressspinner.color.1")};
    animation: p-progressspinner-dash 1.5s ease-in-out infinite, p-progressspinner-color 6s ease-in-out infinite;
    stroke-linecap: round;
}

@keyframes p-progressspinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}
@keyframes p-progressspinner-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
@keyframes p-progressspinner-color {
    100%,
    0% {
        stroke: ${e("progressspinner.color.1")};
    }
    40% {
        stroke: ${e("progressspinner.color.2")};
    }
    66% {
        stroke: ${e("progressspinner.color.3")};
    }
    80%,
    90% {
        stroke: ${e("progressspinner.color.4")};
    }
}
`,R={root:"p-progressspinner",spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},T=(()=>{class e extends k{name="progressspinner";theme=Q;classes=R;static \u0275fac=(()=>{let t;return function(i){return(t||(t=o(e)))(i||e)}})();static \u0275prov=p({token:e,factory:e.\u0275fac})}return e})();var M=(()=>{class e extends D{styleClass;style;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;_componentStyle=g(T);static \u0275fac=(()=>{let t;return function(i){return(t||(t=o(e)))(i||e)}})();static \u0275cmp=a({type:e,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],inputs:{styleClass:"styleClass",style:"style",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[h([T]),u],decls:3,vars:11,consts:[["role","progressbar",1,"p-progressspinner",3,"ngStyle","ngClass"],["viewBox","25 25 50 50",1,"p-progressspinner-spin"],["cx","50","cy","50","r","20","stroke-miterlimit","10",1,"p-progressspinner-circle"]],template:function(n,i){n&1&&(r(0,"div",0),S(),r(1,"svg",1),y(2,"circle",2),l()()),n&2&&(m("ngStyle",i.style)("ngClass",i.styleClass),s("aria-label",i.ariaLabel)("aria-busy",!0)("data-pc-name","progressspinner")("data-pc-section","root"),C(),v("animation-duration",i.animationDuration),s("data-pc-section","root"),C(),s("fill",i.fill)("stroke-width",i.strokeWidth))},dependencies:[b,P,N,d],encapsulation:2,changeDetection:0})}return e})(),H=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=f({type:e});static \u0275inj=c({imports:[M,d,d]})}return e})();var X=()=>({width:"13rem",height:"13rem"}),G=class e{static \u0275fac=function(t){return new(t||e)};static \u0275cmp=a({type:e,selectors:[["app-loading"]],decls:6,vars:5,consts:[[3,"visible","closable"],[1,"card","flex","justify-content-center"],[1,"flex","flex-column"],["strokeWidth","5"],[1,"text-lg","font-medium","text-primary"]],template:function(t,n){t&1&&(r(0,"p-dialog",0)(1,"div",1)(2,"div",2),y(3,"p-progressSpinner",3),r(4,"div",4),w(5,"Cargando..."),l()()()()),t&2&&(F(B(4,X)),m("visible",!0)("closable",!1))},dependencies:[H,M,E,L],encapsulation:2})};export{O as a,de as b,G as c};
