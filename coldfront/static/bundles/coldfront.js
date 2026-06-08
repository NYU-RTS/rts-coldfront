import{$,D as DataTable}from"./c3.js";import{a as getElementsByQueryGenerator,d as drawGauges,g as getCookie}from"./util.js";var top="top",bottom="bottom",right="right",left="left",auto="auto",basePlacements=[top,bottom,right,left],start="start",end="end",clippingParents="clippingParents",viewport="viewport",popper="popper",reference="reference",variationPlacements=basePlacements.reduce(function(n,t){return n.concat([t+"-"+start,t+"-"+end])},[]),placements=[].concat(basePlacements,[auto]).reduce(function(n,t){return n.concat([t,t+"-"+start,t+"-"+end])},[]),beforeRead="beforeRead",read="read",afterRead="afterRead",beforeMain="beforeMain",main="main",afterMain="afterMain",beforeWrite="beforeWrite",write="write",afterWrite="afterWrite",modifierPhases=[beforeRead,read,afterRead,beforeMain,main,afterMain,beforeWrite,write,afterWrite];function getNodeName(n){return n?(n.nodeName||"").toLowerCase():null}function getWindow(n){if(n==null)return window;if(n.toString()!=="[object Window]"){var t=n.ownerDocument;return t&&t.defaultView||window}return n}function isElement$1(n){var t=getWindow(n).Element;return n instanceof t||n instanceof Element}function isHTMLElement(n){var t=getWindow(n).HTMLElement;return n instanceof t||n instanceof HTMLElement}function isShadowRoot(n){if(typeof ShadowRoot>"u")return!1;var t=getWindow(n).ShadowRoot;return n instanceof t||n instanceof ShadowRoot}function applyStyles(n){var t=n.state;Object.keys(t.elements).forEach(function(e){var r=t.styles[e]||{},i=t.attributes[e]||{},a=t.elements[e];!isHTMLElement(a)||!getNodeName(a)||(Object.assign(a.style,r),Object.keys(i).forEach(function(o){var c=i[o];c===!1?a.removeAttribute(o):a.setAttribute(o,c===!0?"":c)}))})}function effect$2(n){var t=n.state,e={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,e.popper),t.styles=e,t.elements.arrow&&Object.assign(t.elements.arrow.style,e.arrow),function(){Object.keys(t.elements).forEach(function(r){var i=t.elements[r],a=t.attributes[r]||{},o=Object.keys(t.styles.hasOwnProperty(r)?t.styles[r]:e[r]),c=o.reduce(function(u,f){return u[f]="",u},{});!isHTMLElement(i)||!getNodeName(i)||(Object.assign(i.style,c),Object.keys(a).forEach(function(u){i.removeAttribute(u)}))})}}const applyStyles$1={name:"applyStyles",enabled:!0,phase:"write",fn:applyStyles,effect:effect$2,requires:["computeStyles"]};function getBasePlacement(n){return n.split("-")[0]}var max=Math.max,min=Math.min,round=Math.round;function getUAString(){var n=navigator.userAgentData;return n!=null&&n.brands&&Array.isArray(n.brands)?n.brands.map(function(t){return t.brand+"/"+t.version}).join(" "):navigator.userAgent}function isLayoutViewport(){return!/^((?!chrome|android).)*safari/i.test(getUAString())}function getBoundingClientRect(n,t,e){t===void 0&&(t=!1),e===void 0&&(e=!1);var r=n.getBoundingClientRect(),i=1,a=1;t&&isHTMLElement(n)&&(i=n.offsetWidth>0&&round(r.width)/n.offsetWidth||1,a=n.offsetHeight>0&&round(r.height)/n.offsetHeight||1);var o=isElement$1(n)?getWindow(n):window,c=o.visualViewport,u=!isLayoutViewport()&&e,f=(r.left+(u&&c?c.offsetLeft:0))/i,h=(r.top+(u&&c?c.offsetTop:0))/a,m=r.width/i,E=r.height/a;return{width:m,height:E,top:h,right:f+m,bottom:h+E,left:f,x:f,y:h}}function getLayoutRect(n){var t=getBoundingClientRect(n),e=n.offsetWidth,r=n.offsetHeight;return Math.abs(t.width-e)<=1&&(e=t.width),Math.abs(t.height-r)<=1&&(r=t.height),{x:n.offsetLeft,y:n.offsetTop,width:e,height:r}}function contains(n,t){var e=t.getRootNode&&t.getRootNode();if(n.contains(t))return!0;if(e&&isShadowRoot(e)){var r=t;do{if(r&&n.isSameNode(r))return!0;r=r.parentNode||r.host}while(r)}return!1}function getComputedStyle$1(n){return getWindow(n).getComputedStyle(n)}function isTableElement(n){return["table","td","th"].indexOf(getNodeName(n))>=0}function getDocumentElement(n){return((isElement$1(n)?n.ownerDocument:n.document)||window.document).documentElement}function getParentNode(n){return getNodeName(n)==="html"?n:n.assignedSlot||n.parentNode||(isShadowRoot(n)?n.host:null)||getDocumentElement(n)}function getTrueOffsetParent(n){return!isHTMLElement(n)||getComputedStyle$1(n).position==="fixed"?null:n.offsetParent}function getContainingBlock(n){var t=/firefox/i.test(getUAString()),e=/Trident/i.test(getUAString());if(e&&isHTMLElement(n)){var r=getComputedStyle$1(n);if(r.position==="fixed")return null}var i=getParentNode(n);for(isShadowRoot(i)&&(i=i.host);isHTMLElement(i)&&["html","body"].indexOf(getNodeName(i))<0;){var a=getComputedStyle$1(i);if(a.transform!=="none"||a.perspective!=="none"||a.contain==="paint"||["transform","perspective"].indexOf(a.willChange)!==-1||t&&a.willChange==="filter"||t&&a.filter&&a.filter!=="none")return i;i=i.parentNode}return null}function getOffsetParent(n){for(var t=getWindow(n),e=getTrueOffsetParent(n);e&&isTableElement(e)&&getComputedStyle$1(e).position==="static";)e=getTrueOffsetParent(e);return e&&(getNodeName(e)==="html"||getNodeName(e)==="body"&&getComputedStyle$1(e).position==="static")?t:e||getContainingBlock(n)||t}function getMainAxisFromPlacement(n){return["top","bottom"].indexOf(n)>=0?"x":"y"}function within(n,t,e){return max(n,min(t,e))}function withinMaxClamp(n,t,e){var r=within(n,t,e);return r>e?e:r}function getFreshSideObject(){return{top:0,right:0,bottom:0,left:0}}function mergePaddingObject(n){return Object.assign({},getFreshSideObject(),n)}function expandToHashMap(n,t){return t.reduce(function(e,r){return e[r]=n,e},{})}var toPaddingObject=function(t,e){return t=typeof t=="function"?t(Object.assign({},e.rects,{placement:e.placement})):t,mergePaddingObject(typeof t!="number"?t:expandToHashMap(t,basePlacements))};function arrow(n){var t,e=n.state,r=n.name,i=n.options,a=e.elements.arrow,o=e.modifiersData.popperOffsets,c=getBasePlacement(e.placement),u=getMainAxisFromPlacement(c),f=[left,right].indexOf(c)>=0,h=f?"height":"width";if(!(!a||!o)){var m=toPaddingObject(i.padding,e),E=getLayoutRect(a),_=u==="y"?top:left,y=u==="y"?bottom:right,g=e.rects.reference[h]+e.rects.reference[u]-o[u]-e.rects.popper[h],A=o[u]-e.rects.reference[u],O=getOffsetParent(a),N=O?u==="y"?O.clientHeight||0:O.clientWidth||0:0,D=g/2-A/2,S=m[_],P=N-E[h]-m[y],I=N/2-E[h]/2+D,L=within(S,I,P),V=u;e.modifiersData[r]=(t={},t[V]=L,t.centerOffset=L-I,t)}}function effect$1(n){var t=n.state,e=n.options,r=e.element,i=r===void 0?"[data-popper-arrow]":r;i!=null&&(typeof i=="string"&&(i=t.elements.popper.querySelector(i),!i)||contains(t.elements.popper,i)&&(t.elements.arrow=i))}const arrow$1={name:"arrow",enabled:!0,phase:"main",fn:arrow,effect:effect$1,requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function getVariation(n){return n.split("-")[1]}var unsetSides={top:"auto",right:"auto",bottom:"auto",left:"auto"};function roundOffsetsByDPR(n,t){var e=n.x,r=n.y,i=t.devicePixelRatio||1;return{x:round(e*i)/i||0,y:round(r*i)/i||0}}function mapToStyles(n){var t,e=n.popper,r=n.popperRect,i=n.placement,a=n.variation,o=n.offsets,c=n.position,u=n.gpuAcceleration,f=n.adaptive,h=n.roundOffsets,m=n.isFixed,E=o.x,_=E===void 0?0:E,y=o.y,g=y===void 0?0:y,A=typeof h=="function"?h({x:_,y:g}):{x:_,y:g};_=A.x,g=A.y;var O=o.hasOwnProperty("x"),N=o.hasOwnProperty("y"),D=left,S=top,P=window;if(f){var I=getOffsetParent(e),L="clientHeight",V="clientWidth";if(I===getWindow(e)&&(I=getDocumentElement(e),getComputedStyle$1(I).position!=="static"&&c==="absolute"&&(L="scrollHeight",V="scrollWidth")),I=I,i===top||(i===left||i===right)&&a===end){S=bottom;var B=m&&I===P&&P.visualViewport?P.visualViewport.height:I[L];g-=B-r.height,g*=u?1:-1}if(i===left||(i===top||i===bottom)&&a===end){D=right;var F=m&&I===P&&P.visualViewport?P.visualViewport.width:I[V];_-=F-r.width,_*=u?1:-1}}var K=Object.assign({position:c},f&&unsetSides),G=h===!0?roundOffsetsByDPR({x:_,y:g},getWindow(e)):{x:_,y:g};if(_=G.x,g=G.y,u){var H;return Object.assign({},K,(H={},H[S]=N?"0":"",H[D]=O?"0":"",H.transform=(P.devicePixelRatio||1)<=1?"translate("+_+"px, "+g+"px)":"translate3d("+_+"px, "+g+"px, 0)",H))}return Object.assign({},K,(t={},t[S]=N?g+"px":"",t[D]=O?_+"px":"",t.transform="",t))}function computeStyles(n){var t=n.state,e=n.options,r=e.gpuAcceleration,i=r===void 0?!0:r,a=e.adaptive,o=a===void 0?!0:a,c=e.roundOffsets,u=c===void 0?!0:c,f={placement:getBasePlacement(t.placement),variation:getVariation(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:i,isFixed:t.options.strategy==="fixed"};t.modifiersData.popperOffsets!=null&&(t.styles.popper=Object.assign({},t.styles.popper,mapToStyles(Object.assign({},f,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:o,roundOffsets:u})))),t.modifiersData.arrow!=null&&(t.styles.arrow=Object.assign({},t.styles.arrow,mapToStyles(Object.assign({},f,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:u})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})}const computeStyles$1={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:computeStyles,data:{}};var passive={passive:!0};function effect(n){var t=n.state,e=n.instance,r=n.options,i=r.scroll,a=i===void 0?!0:i,o=r.resize,c=o===void 0?!0:o,u=getWindow(t.elements.popper),f=[].concat(t.scrollParents.reference,t.scrollParents.popper);return a&&f.forEach(function(h){h.addEventListener("scroll",e.update,passive)}),c&&u.addEventListener("resize",e.update,passive),function(){a&&f.forEach(function(h){h.removeEventListener("scroll",e.update,passive)}),c&&u.removeEventListener("resize",e.update,passive)}}const eventListeners={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect,data:{}};var hash$1={left:"right",right:"left",bottom:"top",top:"bottom"};function getOppositePlacement(n){return n.replace(/left|right|bottom|top/g,function(t){return hash$1[t]})}var hash={start:"end",end:"start"};function getOppositeVariationPlacement(n){return n.replace(/start|end/g,function(t){return hash[t]})}function getWindowScroll(n){var t=getWindow(n),e=t.pageXOffset,r=t.pageYOffset;return{scrollLeft:e,scrollTop:r}}function getWindowScrollBarX(n){return getBoundingClientRect(getDocumentElement(n)).left+getWindowScroll(n).scrollLeft}function getViewportRect(n,t){var e=getWindow(n),r=getDocumentElement(n),i=e.visualViewport,a=r.clientWidth,o=r.clientHeight,c=0,u=0;if(i){a=i.width,o=i.height;var f=isLayoutViewport();(f||!f&&t==="fixed")&&(c=i.offsetLeft,u=i.offsetTop)}return{width:a,height:o,x:c+getWindowScrollBarX(n),y:u}}function getDocumentRect(n){var t,e=getDocumentElement(n),r=getWindowScroll(n),i=(t=n.ownerDocument)==null?void 0:t.body,a=max(e.scrollWidth,e.clientWidth,i?i.scrollWidth:0,i?i.clientWidth:0),o=max(e.scrollHeight,e.clientHeight,i?i.scrollHeight:0,i?i.clientHeight:0),c=-r.scrollLeft+getWindowScrollBarX(n),u=-r.scrollTop;return getComputedStyle$1(i||e).direction==="rtl"&&(c+=max(e.clientWidth,i?i.clientWidth:0)-a),{width:a,height:o,x:c,y:u}}function isScrollParent(n){var t=getComputedStyle$1(n),e=t.overflow,r=t.overflowX,i=t.overflowY;return/auto|scroll|overlay|hidden/.test(e+i+r)}function getScrollParent(n){return["html","body","#document"].indexOf(getNodeName(n))>=0?n.ownerDocument.body:isHTMLElement(n)&&isScrollParent(n)?n:getScrollParent(getParentNode(n))}function listScrollParents(n,t){var e;t===void 0&&(t=[]);var r=getScrollParent(n),i=r===((e=n.ownerDocument)==null?void 0:e.body),a=getWindow(r),o=i?[a].concat(a.visualViewport||[],isScrollParent(r)?r:[]):r,c=t.concat(o);return i?c:c.concat(listScrollParents(getParentNode(o)))}function rectToClientRect(n){return Object.assign({},n,{left:n.x,top:n.y,right:n.x+n.width,bottom:n.y+n.height})}function getInnerBoundingClientRect(n,t){var e=getBoundingClientRect(n,!1,t==="fixed");return e.top=e.top+n.clientTop,e.left=e.left+n.clientLeft,e.bottom=e.top+n.clientHeight,e.right=e.left+n.clientWidth,e.width=n.clientWidth,e.height=n.clientHeight,e.x=e.left,e.y=e.top,e}function getClientRectFromMixedType(n,t,e){return t===viewport?rectToClientRect(getViewportRect(n,e)):isElement$1(t)?getInnerBoundingClientRect(t,e):rectToClientRect(getDocumentRect(getDocumentElement(n)))}function getClippingParents(n){var t=listScrollParents(getParentNode(n)),e=["absolute","fixed"].indexOf(getComputedStyle$1(n).position)>=0,r=e&&isHTMLElement(n)?getOffsetParent(n):n;return isElement$1(r)?t.filter(function(i){return isElement$1(i)&&contains(i,r)&&getNodeName(i)!=="body"}):[]}function getClippingRect(n,t,e,r){var i=t==="clippingParents"?getClippingParents(n):[].concat(t),a=[].concat(i,[e]),o=a[0],c=a.reduce(function(u,f){var h=getClientRectFromMixedType(n,f,r);return u.top=max(h.top,u.top),u.right=min(h.right,u.right),u.bottom=min(h.bottom,u.bottom),u.left=max(h.left,u.left),u},getClientRectFromMixedType(n,o,r));return c.width=c.right-c.left,c.height=c.bottom-c.top,c.x=c.left,c.y=c.top,c}function computeOffsets(n){var t=n.reference,e=n.element,r=n.placement,i=r?getBasePlacement(r):null,a=r?getVariation(r):null,o=t.x+t.width/2-e.width/2,c=t.y+t.height/2-e.height/2,u;switch(i){case top:u={x:o,y:t.y-e.height};break;case bottom:u={x:o,y:t.y+t.height};break;case right:u={x:t.x+t.width,y:c};break;case left:u={x:t.x-e.width,y:c};break;default:u={x:t.x,y:t.y}}var f=i?getMainAxisFromPlacement(i):null;if(f!=null){var h=f==="y"?"height":"width";switch(a){case start:u[f]=u[f]-(t[h]/2-e[h]/2);break;case end:u[f]=u[f]+(t[h]/2-e[h]/2);break}}return u}function detectOverflow(n,t){t===void 0&&(t={});var e=t,r=e.placement,i=r===void 0?n.placement:r,a=e.strategy,o=a===void 0?n.strategy:a,c=e.boundary,u=c===void 0?clippingParents:c,f=e.rootBoundary,h=f===void 0?viewport:f,m=e.elementContext,E=m===void 0?popper:m,_=e.altBoundary,y=_===void 0?!1:_,g=e.padding,A=g===void 0?0:g,O=mergePaddingObject(typeof A!="number"?A:expandToHashMap(A,basePlacements)),N=E===popper?reference:popper,D=n.rects.popper,S=n.elements[y?N:E],P=getClippingRect(isElement$1(S)?S:S.contextElement||getDocumentElement(n.elements.popper),u,h,o),I=getBoundingClientRect(n.elements.reference),L=computeOffsets({reference:I,element:D,placement:i}),V=rectToClientRect(Object.assign({},D,L)),B=E===popper?V:I,F={top:P.top-B.top+O.top,bottom:B.bottom-P.bottom+O.bottom,left:P.left-B.left+O.left,right:B.right-P.right+O.right},K=n.modifiersData.offset;if(E===popper&&K){var G=K[i];Object.keys(F).forEach(function(H){var J=[right,bottom].indexOf(H)>=0?1:-1,Z=[top,bottom].indexOf(H)>=0?"y":"x";F[H]+=G[Z]*J})}return F}function computeAutoPlacement(n,t){t===void 0&&(t={});var e=t,r=e.placement,i=e.boundary,a=e.rootBoundary,o=e.padding,c=e.flipVariations,u=e.allowedAutoPlacements,f=u===void 0?placements:u,h=getVariation(r),m=h?c?variationPlacements:variationPlacements.filter(function(y){return getVariation(y)===h}):basePlacements,E=m.filter(function(y){return f.indexOf(y)>=0});E.length===0&&(E=m);var _=E.reduce(function(y,g){return y[g]=detectOverflow(n,{placement:g,boundary:i,rootBoundary:a,padding:o})[getBasePlacement(g)],y},{});return Object.keys(_).sort(function(y,g){return _[y]-_[g]})}function getExpandedFallbackPlacements(n){if(getBasePlacement(n)===auto)return[];var t=getOppositePlacement(n);return[getOppositeVariationPlacement(n),t,getOppositeVariationPlacement(t)]}function flip(n){var t=n.state,e=n.options,r=n.name;if(!t.modifiersData[r]._skip){for(var i=e.mainAxis,a=i===void 0?!0:i,o=e.altAxis,c=o===void 0?!0:o,u=e.fallbackPlacements,f=e.padding,h=e.boundary,m=e.rootBoundary,E=e.altBoundary,_=e.flipVariations,y=_===void 0?!0:_,g=e.allowedAutoPlacements,A=t.options.placement,O=getBasePlacement(A),N=O===A,D=u||(N||!y?[getOppositePlacement(A)]:getExpandedFallbackPlacements(A)),S=[A].concat(D).reduce(function(ee,Q){return ee.concat(getBasePlacement(Q)===auto?computeAutoPlacement(t,{placement:Q,boundary:h,rootBoundary:m,padding:f,flipVariations:y,allowedAutoPlacements:g}):Q)},[]),P=t.rects.reference,I=t.rects.popper,L=new Map,V=!0,B=S[0],F=0;F<S.length;F++){var K=S[F],G=getBasePlacement(K),H=getVariation(K)===start,J=[top,bottom].indexOf(G)>=0,Z=J?"width":"height",z=detectOverflow(t,{placement:K,boundary:h,rootBoundary:m,altBoundary:E,padding:f}),U=J?H?right:left:H?bottom:top;P[Z]>I[Z]&&(U=getOppositePlacement(U));var ie=getOppositePlacement(U),ne=[];if(a&&ne.push(z[G]<=0),c&&ne.push(z[U]<=0,z[ie]<=0),ne.every(function(ee){return ee})){B=K,V=!1;break}L.set(K,ne)}if(V)for(var ae=y?3:1,X=function(Q){var M=S.find(function(k){var Y=L.get(k);if(Y)return Y.slice(0,Q).every(function(ce){return ce})});if(M)return B=M,"break"},W=ae;W>0;W--){var re=X(W);if(re==="break")break}t.placement!==B&&(t.modifiersData[r]._skip=!0,t.placement=B,t.reset=!0)}}const flip$1={name:"flip",enabled:!0,phase:"main",fn:flip,requiresIfExists:["offset"],data:{_skip:!1}};function getSideOffsets(n,t,e){return e===void 0&&(e={x:0,y:0}),{top:n.top-t.height-e.y,right:n.right-t.width+e.x,bottom:n.bottom-t.height+e.y,left:n.left-t.width-e.x}}function isAnySideFullyClipped(n){return[top,right,bottom,left].some(function(t){return n[t]>=0})}function hide(n){var t=n.state,e=n.name,r=t.rects.reference,i=t.rects.popper,a=t.modifiersData.preventOverflow,o=detectOverflow(t,{elementContext:"reference"}),c=detectOverflow(t,{altBoundary:!0}),u=getSideOffsets(o,r),f=getSideOffsets(c,i,a),h=isAnySideFullyClipped(u),m=isAnySideFullyClipped(f);t.modifiersData[e]={referenceClippingOffsets:u,popperEscapeOffsets:f,isReferenceHidden:h,hasPopperEscaped:m},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":h,"data-popper-escaped":m})}const hide$1={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:hide};function distanceAndSkiddingToXY(n,t,e){var r=getBasePlacement(n),i=[left,top].indexOf(r)>=0?-1:1,a=typeof e=="function"?e(Object.assign({},t,{placement:n})):e,o=a[0],c=a[1];return o=o||0,c=(c||0)*i,[left,right].indexOf(r)>=0?{x:c,y:o}:{x:o,y:c}}function offset(n){var t=n.state,e=n.options,r=n.name,i=e.offset,a=i===void 0?[0,0]:i,o=placements.reduce(function(h,m){return h[m]=distanceAndSkiddingToXY(m,t.rects,a),h},{}),c=o[t.placement],u=c.x,f=c.y;t.modifiersData.popperOffsets!=null&&(t.modifiersData.popperOffsets.x+=u,t.modifiersData.popperOffsets.y+=f),t.modifiersData[r]=o}const offset$1={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:offset};function popperOffsets(n){var t=n.state,e=n.name;t.modifiersData[e]=computeOffsets({reference:t.rects.reference,element:t.rects.popper,placement:t.placement})}const popperOffsets$1={name:"popperOffsets",enabled:!0,phase:"read",fn:popperOffsets,data:{}};function getAltAxis(n){return n==="x"?"y":"x"}function preventOverflow(n){var t=n.state,e=n.options,r=n.name,i=e.mainAxis,a=i===void 0?!0:i,o=e.altAxis,c=o===void 0?!1:o,u=e.boundary,f=e.rootBoundary,h=e.altBoundary,m=e.padding,E=e.tether,_=E===void 0?!0:E,y=e.tetherOffset,g=y===void 0?0:y,A=detectOverflow(t,{boundary:u,rootBoundary:f,padding:m,altBoundary:h}),O=getBasePlacement(t.placement),N=getVariation(t.placement),D=!N,S=getMainAxisFromPlacement(O),P=getAltAxis(S),I=t.modifiersData.popperOffsets,L=t.rects.reference,V=t.rects.popper,B=typeof g=="function"?g(Object.assign({},t.rects,{placement:t.placement})):g,F=typeof B=="number"?{mainAxis:B,altAxis:B}:Object.assign({mainAxis:0,altAxis:0},B),K=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,G={x:0,y:0};if(I){if(a){var H,J=S==="y"?top:left,Z=S==="y"?bottom:right,z=S==="y"?"height":"width",U=I[S],ie=U+A[J],ne=U-A[Z],ae=_?-V[z]/2:0,X=N===start?L[z]:V[z],W=N===start?-V[z]:-L[z],re=t.elements.arrow,ee=_&&re?getLayoutRect(re):{width:0,height:0},Q=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:getFreshSideObject(),M=Q[J],k=Q[Z],Y=within(0,L[z],ee[z]),ce=D?L[z]/2-ae-Y-M-F.mainAxis:X-Y-M-F.mainAxis,Oe=D?-L[z]/2+ae+Y+k+F.mainAxis:W+Y+k+F.mainAxis,de=t.elements.arrow&&getOffsetParent(t.elements.arrow),fe=de?S==="y"?de.clientTop||0:de.clientLeft||0:0,Ae=(H=K?.[S])!=null?H:0,Ne=U+ce-Ae-fe,Se=U+Oe-Ae,Ce=within(_?min(ie,Ne):ie,U,_?max(ne,Se):ne);I[S]=Ce,G[S]=Ce-U}if(c){var ve,Te=S==="x"?top:left,he=S==="x"?bottom:right,se=I[P],pe=P==="y"?"height":"width",_e=se+A[Te],me=se-A[he],ge=[top,left].indexOf(O)!==-1,ue=(ve=K?.[P])!=null?ve:0,De=ge?_e:se-L[pe]-V[pe]-ue+F.altAxis,ye=ge?se+L[pe]+V[pe]-ue-F.altAxis:me,we=_&&ge?withinMaxClamp(De,se,ye):within(_?De:_e,se,_?ye:me);I[P]=we,G[P]=we-se}t.modifiersData[r]=G}}const preventOverflow$1={name:"preventOverflow",enabled:!0,phase:"main",fn:preventOverflow,requiresIfExists:["offset"]};function getHTMLElementScroll(n){return{scrollLeft:n.scrollLeft,scrollTop:n.scrollTop}}function getNodeScroll(n){return n===getWindow(n)||!isHTMLElement(n)?getWindowScroll(n):getHTMLElementScroll(n)}function isElementScaled(n){var t=n.getBoundingClientRect(),e=round(t.width)/n.offsetWidth||1,r=round(t.height)/n.offsetHeight||1;return e!==1||r!==1}function getCompositeRect(n,t,e){e===void 0&&(e=!1);var r=isHTMLElement(t),i=isHTMLElement(t)&&isElementScaled(t),a=getDocumentElement(t),o=getBoundingClientRect(n,i,e),c={scrollLeft:0,scrollTop:0},u={x:0,y:0};return(r||!r&&!e)&&((getNodeName(t)!=="body"||isScrollParent(a))&&(c=getNodeScroll(t)),isHTMLElement(t)?(u=getBoundingClientRect(t,!0),u.x+=t.clientLeft,u.y+=t.clientTop):a&&(u.x=getWindowScrollBarX(a))),{x:o.left+c.scrollLeft-u.x,y:o.top+c.scrollTop-u.y,width:o.width,height:o.height}}function order(n){var t=new Map,e=new Set,r=[];n.forEach(function(a){t.set(a.name,a)});function i(a){e.add(a.name);var o=[].concat(a.requires||[],a.requiresIfExists||[]);o.forEach(function(c){if(!e.has(c)){var u=t.get(c);u&&i(u)}}),r.push(a)}return n.forEach(function(a){e.has(a.name)||i(a)}),r}function orderModifiers(n){var t=order(n);return modifierPhases.reduce(function(e,r){return e.concat(t.filter(function(i){return i.phase===r}))},[])}function debounce$1(n){var t;return function(){return t||(t=new Promise(function(e){Promise.resolve().then(function(){t=void 0,e(n())})})),t}}function mergeByName(n){var t=n.reduce(function(e,r){var i=e[r.name];return e[r.name]=i?Object.assign({},i,r,{options:Object.assign({},i.options,r.options),data:Object.assign({},i.data,r.data)}):r,e},{});return Object.keys(t).map(function(e){return t[e]})}var DEFAULT_OPTIONS={placement:"bottom",modifiers:[],strategy:"absolute"};function areValidElements(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return!t.some(function(r){return!(r&&typeof r.getBoundingClientRect=="function")})}function popperGenerator(n){n===void 0&&(n={});var t=n,e=t.defaultModifiers,r=e===void 0?[]:e,i=t.defaultOptions,a=i===void 0?DEFAULT_OPTIONS:i;return function(c,u,f){f===void 0&&(f=a);var h={placement:"bottom",orderedModifiers:[],options:Object.assign({},DEFAULT_OPTIONS,a),modifiersData:{},elements:{reference:c,popper:u},attributes:{},styles:{}},m=[],E=!1,_={state:h,setOptions:function(O){var N=typeof O=="function"?O(h.options):O;g(),h.options=Object.assign({},a,h.options,N),h.scrollParents={reference:isElement$1(c)?listScrollParents(c):c.contextElement?listScrollParents(c.contextElement):[],popper:listScrollParents(u)};var D=orderModifiers(mergeByName([].concat(r,h.options.modifiers)));return h.orderedModifiers=D.filter(function(S){return S.enabled}),y(),_.update()},forceUpdate:function(){if(!E){var O=h.elements,N=O.reference,D=O.popper;if(areValidElements(N,D)){h.rects={reference:getCompositeRect(N,getOffsetParent(D),h.options.strategy==="fixed"),popper:getLayoutRect(D)},h.reset=!1,h.placement=h.options.placement,h.orderedModifiers.forEach(function(F){return h.modifiersData[F.name]=Object.assign({},F.data)});for(var S=0;S<h.orderedModifiers.length;S++){if(h.reset===!0){h.reset=!1,S=-1;continue}var P=h.orderedModifiers[S],I=P.fn,L=P.options,V=L===void 0?{}:L,B=P.name;typeof I=="function"&&(h=I({state:h,options:V,name:B,instance:_})||h)}}}},update:debounce$1(function(){return new Promise(function(A){_.forceUpdate(),A(h)})}),destroy:function(){g(),E=!0}};if(!areValidElements(c,u))return _;_.setOptions(f).then(function(A){!E&&f.onFirstUpdate&&f.onFirstUpdate(A)});function y(){h.orderedModifiers.forEach(function(A){var O=A.name,N=A.options,D=N===void 0?{}:N,S=A.effect;if(typeof S=="function"){var P=S({state:h,name:O,instance:_,options:D}),I=function(){};m.push(P||I)}})}function g(){m.forEach(function(A){return A()}),m=[]}return _}}var defaultModifiers=[eventListeners,popperOffsets$1,computeStyles$1,applyStyles$1,offset$1,flip$1,preventOverflow$1,arrow$1,hide$1],createPopper=popperGenerator({defaultModifiers});const Popper=Object.freeze(Object.defineProperty({__proto__:null,afterMain,afterRead,afterWrite,applyStyles:applyStyles$1,arrow:arrow$1,auto,basePlacements,beforeMain,beforeRead,beforeWrite,bottom,clippingParents,computeStyles:computeStyles$1,createPopper,detectOverflow,end,eventListeners,flip:flip$1,hide:hide$1,left,main,modifierPhases,offset:offset$1,placements,popper,popperGenerator,popperOffsets:popperOffsets$1,preventOverflow:preventOverflow$1,read,reference,right,start,top,variationPlacements,viewport,write},Symbol.toStringTag,{value:"Module"}));const elementMap=new Map,Data={set(n,t,e){elementMap.has(n)||elementMap.set(n,new Map);const r=elementMap.get(n);if(!r.has(t)&&r.size!==0){console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(r.keys())[0]}.`);return}r.set(t,e)},get(n,t){return elementMap.has(n)&&elementMap.get(n).get(t)||null},remove(n,t){if(!elementMap.has(n))return;const e=elementMap.get(n);e.delete(t),e.size===0&&elementMap.delete(n)}},MAX_UID=1e6,MILLISECONDS_MULTIPLIER=1e3,TRANSITION_END="transitionend",parseSelector=n=>(n&&window.CSS&&window.CSS.escape&&(n=n.replace(/#([^\s"#']+)/g,(t,e)=>`#${CSS.escape(e)}`)),n),toType=n=>n==null?`${n}`:Object.prototype.toString.call(n).match(/\s([a-z]+)/i)[1].toLowerCase(),getUID=n=>{do n+=Math.floor(Math.random()*MAX_UID);while(document.getElementById(n));return n},getTransitionDurationFromElement=n=>{if(!n)return 0;let{transitionDuration:t,transitionDelay:e}=window.getComputedStyle(n);const r=Number.parseFloat(t),i=Number.parseFloat(e);return!r&&!i?0:(t=t.split(",")[0],e=e.split(",")[0],(Number.parseFloat(t)+Number.parseFloat(e))*MILLISECONDS_MULTIPLIER)},triggerTransitionEnd=n=>{n.dispatchEvent(new Event(TRANSITION_END))},isElement=n=>!n||typeof n!="object"?!1:(typeof n.jquery<"u"&&(n=n[0]),typeof n.nodeType<"u"),getElement=n=>isElement(n)?n.jquery?n[0]:n:typeof n=="string"&&n.length>0?document.querySelector(parseSelector(n)):null,isVisible=n=>{if(!isElement(n)||n.getClientRects().length===0)return!1;const t=getComputedStyle(n).getPropertyValue("visibility")==="visible",e=n.closest("details:not([open])");if(!e)return t;if(e!==n){const r=n.closest("summary");if(r&&r.parentNode!==e||r===null)return!1}return t},isDisabled=n=>!n||n.nodeType!==Node.ELEMENT_NODE||n.classList.contains("disabled")?!0:typeof n.disabled<"u"?n.disabled:n.hasAttribute("disabled")&&n.getAttribute("disabled")!=="false",findShadowRoot=n=>{if(!document.documentElement.attachShadow)return null;if(typeof n.getRootNode=="function"){const t=n.getRootNode();return t instanceof ShadowRoot?t:null}return n instanceof ShadowRoot?n:n.parentNode?findShadowRoot(n.parentNode):null},noop=()=>{},reflow=n=>{n.offsetHeight},getjQuery=()=>window.jQuery&&!document.body.hasAttribute("data-bs-no-jquery")?window.jQuery:null,DOMContentLoadedCallbacks=[],onDOMContentLoaded=n=>{document.readyState==="loading"?(DOMContentLoadedCallbacks.length||document.addEventListener("DOMContentLoaded",()=>{for(const t of DOMContentLoadedCallbacks)t()}),DOMContentLoadedCallbacks.push(n)):n()},isRTL=()=>document.documentElement.dir==="rtl",defineJQueryPlugin=n=>{onDOMContentLoaded(()=>{const t=getjQuery();if(t){const e=n.NAME,r=t.fn[e];t.fn[e]=n.jQueryInterface,t.fn[e].Constructor=n,t.fn[e].noConflict=()=>(t.fn[e]=r,n.jQueryInterface)}})},execute=(n,t=[],e=n)=>typeof n=="function"?n.call(...t):e,executeAfterTransition=(n,t,e=!0)=>{if(!e){execute(n);return}const i=getTransitionDurationFromElement(t)+5;let a=!1;const o=({target:c})=>{c===t&&(a=!0,t.removeEventListener(TRANSITION_END,o),execute(n))};t.addEventListener(TRANSITION_END,o),setTimeout(()=>{a||triggerTransitionEnd(t)},i)},getNextActiveElement=(n,t,e,r)=>{const i=n.length;let a=n.indexOf(t);return a===-1?!e&&r?n[i-1]:n[0]:(a+=e?1:-1,r&&(a=(a+i)%i),n[Math.max(0,Math.min(a,i-1))])},namespaceRegex=/[^.]*(?=\..*)\.|.*/,stripNameRegex=/\..*/,stripUidRegex=/::\d+$/,eventRegistry={};let uidEvent=1;const customEvents={mouseenter:"mouseover",mouseleave:"mouseout"},nativeEvents=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function makeEventUid(n,t){return t&&`${t}::${uidEvent++}`||n.uidEvent||uidEvent++}function getElementEvents(n){const t=makeEventUid(n);return n.uidEvent=t,eventRegistry[t]=eventRegistry[t]||{},eventRegistry[t]}function bootstrapHandler(n,t){return function e(r){return hydrateObj(r,{delegateTarget:n}),e.oneOff&&EventHandler.off(n,r.type,t),t.apply(n,[r])}}function bootstrapDelegationHandler(n,t,e){return function r(i){const a=n.querySelectorAll(t);for(let{target:o}=i;o&&o!==this;o=o.parentNode)for(const c of a)if(c===o)return hydrateObj(i,{delegateTarget:o}),r.oneOff&&EventHandler.off(n,i.type,t,e),e.apply(o,[i])}}function findHandler(n,t,e=null){return Object.values(n).find(r=>r.callable===t&&r.delegationSelector===e)}function normalizeParameters(n,t,e){const r=typeof t=="string",i=r?e:t||e;let a=getTypeEvent(n);return nativeEvents.has(a)||(a=n),[r,i,a]}function addHandler(n,t,e,r,i){if(typeof t!="string"||!n)return;let[a,o,c]=normalizeParameters(t,e,r);t in customEvents&&(o=(y=>function(g){if(!g.relatedTarget||g.relatedTarget!==g.delegateTarget&&!g.delegateTarget.contains(g.relatedTarget))return y.call(this,g)})(o));const u=getElementEvents(n),f=u[c]||(u[c]={}),h=findHandler(f,o,a?e:null);if(h){h.oneOff=h.oneOff&&i;return}const m=makeEventUid(o,t.replace(namespaceRegex,"")),E=a?bootstrapDelegationHandler(n,e,o):bootstrapHandler(n,o);E.delegationSelector=a?e:null,E.callable=o,E.oneOff=i,E.uidEvent=m,f[m]=E,n.addEventListener(c,E,a)}function removeHandler(n,t,e,r,i){const a=findHandler(t[e],r,i);a&&(n.removeEventListener(e,a,!!i),delete t[e][a.uidEvent])}function removeNamespacedHandlers(n,t,e,r){const i=t[e]||{};for(const[a,o]of Object.entries(i))a.includes(r)&&removeHandler(n,t,e,o.callable,o.delegationSelector)}function getTypeEvent(n){return n=n.replace(stripNameRegex,""),customEvents[n]||n}const EventHandler={on(n,t,e,r){addHandler(n,t,e,r,!1)},one(n,t,e,r){addHandler(n,t,e,r,!0)},off(n,t,e,r){if(typeof t!="string"||!n)return;const[i,a,o]=normalizeParameters(t,e,r),c=o!==t,u=getElementEvents(n),f=u[o]||{},h=t.startsWith(".");if(typeof a<"u"){if(!Object.keys(f).length)return;removeHandler(n,u,o,a,i?e:null);return}if(h)for(const m of Object.keys(u))removeNamespacedHandlers(n,u,m,t.slice(1));for(const[m,E]of Object.entries(f)){const _=m.replace(stripUidRegex,"");(!c||t.includes(_))&&removeHandler(n,u,o,E.callable,E.delegationSelector)}},trigger(n,t,e){if(typeof t!="string"||!n)return null;const r=getjQuery(),i=getTypeEvent(t),a=t!==i;let o=null,c=!0,u=!0,f=!1;a&&r&&(o=r.Event(t,e),r(n).trigger(o),c=!o.isPropagationStopped(),u=!o.isImmediatePropagationStopped(),f=o.isDefaultPrevented());const h=hydrateObj(new Event(t,{bubbles:c,cancelable:!0}),e);return f&&h.preventDefault(),u&&n.dispatchEvent(h),h.defaultPrevented&&o&&o.preventDefault(),h}};function hydrateObj(n,t={}){for(const[e,r]of Object.entries(t))try{n[e]=r}catch{Object.defineProperty(n,e,{configurable:!0,get(){return r}})}return n}function normalizeData(n){if(n==="true")return!0;if(n==="false")return!1;if(n===Number(n).toString())return Number(n);if(n===""||n==="null")return null;if(typeof n!="string")return n;try{return JSON.parse(decodeURIComponent(n))}catch{return n}}function normalizeDataKey(n){return n.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`)}const Manipulator={setDataAttribute(n,t,e){n.setAttribute(`data-bs-${normalizeDataKey(t)}`,e)},removeDataAttribute(n,t){n.removeAttribute(`data-bs-${normalizeDataKey(t)}`)},getDataAttributes(n){if(!n)return{};const t={},e=Object.keys(n.dataset).filter(r=>r.startsWith("bs")&&!r.startsWith("bsConfig"));for(const r of e){let i=r.replace(/^bs/,"");i=i.charAt(0).toLowerCase()+i.slice(1),t[i]=normalizeData(n.dataset[r])}return t},getDataAttribute(n,t){return normalizeData(n.getAttribute(`data-bs-${normalizeDataKey(t)}`))}};class Config{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(t){return t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t}_mergeConfigObj(t,e){const r=isElement(e)?Manipulator.getDataAttribute(e,"config"):{};return{...this.constructor.Default,...typeof r=="object"?r:{},...isElement(e)?Manipulator.getDataAttributes(e):{},...typeof t=="object"?t:{}}}_typeCheckConfig(t,e=this.constructor.DefaultType){for(const[r,i]of Object.entries(e)){const a=t[r],o=isElement(a)?"element":toType(a);if(!new RegExp(i).test(o))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${r}" provided type "${o}" but expected type "${i}".`)}}}const VERSION="5.3.8";class BaseComponent extends Config{constructor(t,e){super(),t=getElement(t),t&&(this._element=t,this._config=this._getConfig(e),Data.set(this._element,this.constructor.DATA_KEY,this))}dispose(){Data.remove(this._element,this.constructor.DATA_KEY),EventHandler.off(this._element,this.constructor.EVENT_KEY);for(const t of Object.getOwnPropertyNames(this))this[t]=null}_queueCallback(t,e,r=!0){executeAfterTransition(t,e,r)}_getConfig(t){return t=this._mergeConfigObj(t,this._element),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}static getInstance(t){return Data.get(getElement(t),this.DATA_KEY)}static getOrCreateInstance(t,e={}){return this.getInstance(t)||new this(t,typeof e=="object"?e:null)}static get VERSION(){return VERSION}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(t){return`${t}${this.EVENT_KEY}`}}const getSelector=n=>{let t=n.getAttribute("data-bs-target");if(!t||t==="#"){let e=n.getAttribute("href");if(!e||!e.includes("#")&&!e.startsWith("."))return null;e.includes("#")&&!e.startsWith("#")&&(e=`#${e.split("#")[1]}`),t=e&&e!=="#"?e.trim():null}return t?t.split(",").map(e=>parseSelector(e)).join(","):null},SelectorEngine={find(n,t=document.documentElement){return[].concat(...Element.prototype.querySelectorAll.call(t,n))},findOne(n,t=document.documentElement){return Element.prototype.querySelector.call(t,n)},children(n,t){return[].concat(...n.children).filter(e=>e.matches(t))},parents(n,t){const e=[];let r=n.parentNode.closest(t);for(;r;)e.push(r),r=r.parentNode.closest(t);return e},prev(n,t){let e=n.previousElementSibling;for(;e;){if(e.matches(t))return[e];e=e.previousElementSibling}return[]},next(n,t){let e=n.nextElementSibling;for(;e;){if(e.matches(t))return[e];e=e.nextElementSibling}return[]},focusableChildren(n){const t=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(e=>`${e}:not([tabindex^="-"])`).join(",");return this.find(t,n).filter(e=>!isDisabled(e)&&isVisible(e))},getSelectorFromElement(n){const t=getSelector(n);return t&&SelectorEngine.findOne(t)?t:null},getElementFromSelector(n){const t=getSelector(n);return t?SelectorEngine.findOne(t):null},getMultipleElementsFromSelector(n){const t=getSelector(n);return t?SelectorEngine.find(t):[]}},enableDismissTrigger=(n,t="hide")=>{const e=`click.dismiss${n.EVENT_KEY}`,r=n.NAME;EventHandler.on(document,e,`[data-bs-dismiss="${r}"]`,function(i){if(["A","AREA"].includes(this.tagName)&&i.preventDefault(),isDisabled(this))return;const a=SelectorEngine.getElementFromSelector(this)||this.closest(`.${r}`);n.getOrCreateInstance(a)[t]()})},NAME$f="alert",DATA_KEY$a="bs.alert",EVENT_KEY$b=`.${DATA_KEY$a}`,EVENT_CLOSE=`close${EVENT_KEY$b}`,EVENT_CLOSED=`closed${EVENT_KEY$b}`,CLASS_NAME_FADE$5="fade",CLASS_NAME_SHOW$8="show";class Alert extends BaseComponent{static get NAME(){return NAME$f}close(){if(EventHandler.trigger(this._element,EVENT_CLOSE).defaultPrevented)return;this._element.classList.remove(CLASS_NAME_SHOW$8);const e=this._element.classList.contains(CLASS_NAME_FADE$5);this._queueCallback(()=>this._destroyElement(),this._element,e)}_destroyElement(){this._element.remove(),EventHandler.trigger(this._element,EVENT_CLOSED),this.dispose()}static jQueryInterface(t){return this.each(function(){const e=Alert.getOrCreateInstance(this);if(typeof t=="string"){if(e[t]===void 0||t.startsWith("_")||t==="constructor")throw new TypeError(`No method named "${t}"`);e[t](this)}})}}enableDismissTrigger(Alert,"close");defineJQueryPlugin(Alert);const NAME$e="button",DATA_KEY$9="bs.button",EVENT_KEY$a=`.${DATA_KEY$9}`,DATA_API_KEY$6=".data-api",CLASS_NAME_ACTIVE$3="active",SELECTOR_DATA_TOGGLE$5='[data-bs-toggle="button"]',EVENT_CLICK_DATA_API$6=`click${EVENT_KEY$a}${DATA_API_KEY$6}`;class Button extends BaseComponent{static get NAME(){return NAME$e}toggle(){this._element.setAttribute("aria-pressed",this._element.classList.toggle(CLASS_NAME_ACTIVE$3))}static jQueryInterface(t){return this.each(function(){const e=Button.getOrCreateInstance(this);t==="toggle"&&e[t]()})}}EventHandler.on(document,EVENT_CLICK_DATA_API$6,SELECTOR_DATA_TOGGLE$5,n=>{n.preventDefault();const t=n.target.closest(SELECTOR_DATA_TOGGLE$5);Button.getOrCreateInstance(t).toggle()});defineJQueryPlugin(Button);const NAME$d="swipe",EVENT_KEY$9=".bs.swipe",EVENT_TOUCHSTART=`touchstart${EVENT_KEY$9}`,EVENT_TOUCHMOVE=`touchmove${EVENT_KEY$9}`,EVENT_TOUCHEND=`touchend${EVENT_KEY$9}`,EVENT_POINTERDOWN=`pointerdown${EVENT_KEY$9}`,EVENT_POINTERUP=`pointerup${EVENT_KEY$9}`,POINTER_TYPE_TOUCH="touch",POINTER_TYPE_PEN="pen",CLASS_NAME_POINTER_EVENT="pointer-event",SWIPE_THRESHOLD=40,Default$c={endCallback:null,leftCallback:null,rightCallback:null},DefaultType$c={endCallback:"(function|null)",leftCallback:"(function|null)",rightCallback:"(function|null)"};class Swipe extends Config{constructor(t,e){super(),this._element=t,!(!t||!Swipe.isSupported())&&(this._config=this._getConfig(e),this._deltaX=0,this._supportPointerEvents=!!window.PointerEvent,this._initEvents())}static get Default(){return Default$c}static get DefaultType(){return DefaultType$c}static get NAME(){return NAME$d}dispose(){EventHandler.off(this._element,EVENT_KEY$9)}_start(t){if(!this._supportPointerEvents){this._deltaX=t.touches[0].clientX;return}this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX)}_end(t){this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX-this._deltaX),this._handleSwipe(),execute(this._config.endCallback)}_move(t){this._deltaX=t.touches&&t.touches.length>1?0:t.touches[0].clientX-this._deltaX}_handleSwipe(){const t=Math.abs(this._deltaX);if(t<=SWIPE_THRESHOLD)return;const e=t/this._deltaX;this._deltaX=0,e&&execute(e>0?this._config.rightCallback:this._config.leftCallback)}_initEvents(){this._supportPointerEvents?(EventHandler.on(this._element,EVENT_POINTERDOWN,t=>this._start(t)),EventHandler.on(this._element,EVENT_POINTERUP,t=>this._end(t)),this._element.classList.add(CLASS_NAME_POINTER_EVENT)):(EventHandler.on(this._element,EVENT_TOUCHSTART,t=>this._start(t)),EventHandler.on(this._element,EVENT_TOUCHMOVE,t=>this._move(t)),EventHandler.on(this._element,EVENT_TOUCHEND,t=>this._end(t)))}_eventIsPointerPenTouch(t){return this._supportPointerEvents&&(t.pointerType===POINTER_TYPE_PEN||t.pointerType===POINTER_TYPE_TOUCH)}static isSupported(){return"ontouchstart"in document.documentElement||navigator.maxTouchPoints>0}}const NAME$c="carousel",DATA_KEY$8="bs.carousel",EVENT_KEY$8=`.${DATA_KEY$8}`,DATA_API_KEY$5=".data-api",ARROW_LEFT_KEY$1="ArrowLeft",ARROW_RIGHT_KEY$1="ArrowRight",TOUCHEVENT_COMPAT_WAIT=500,ORDER_NEXT="next",ORDER_PREV="prev",DIRECTION_LEFT="left",DIRECTION_RIGHT="right",EVENT_SLIDE=`slide${EVENT_KEY$8}`,EVENT_SLID=`slid${EVENT_KEY$8}`,EVENT_KEYDOWN$1=`keydown${EVENT_KEY$8}`,EVENT_MOUSEENTER$1=`mouseenter${EVENT_KEY$8}`,EVENT_MOUSELEAVE$1=`mouseleave${EVENT_KEY$8}`,EVENT_DRAG_START=`dragstart${EVENT_KEY$8}`,EVENT_LOAD_DATA_API$3=`load${EVENT_KEY$8}${DATA_API_KEY$5}`,EVENT_CLICK_DATA_API$5=`click${EVENT_KEY$8}${DATA_API_KEY$5}`,CLASS_NAME_CAROUSEL="carousel",CLASS_NAME_ACTIVE$2="active",CLASS_NAME_SLIDE="slide",CLASS_NAME_END="carousel-item-end",CLASS_NAME_START="carousel-item-start",CLASS_NAME_NEXT="carousel-item-next",CLASS_NAME_PREV="carousel-item-prev",SELECTOR_ACTIVE=".active",SELECTOR_ITEM=".carousel-item",SELECTOR_ACTIVE_ITEM=SELECTOR_ACTIVE+SELECTOR_ITEM,SELECTOR_ITEM_IMG=".carousel-item img",SELECTOR_INDICATORS=".carousel-indicators",SELECTOR_DATA_SLIDE="[data-bs-slide], [data-bs-slide-to]",SELECTOR_DATA_RIDE='[data-bs-ride="carousel"]',KEY_TO_DIRECTION={[ARROW_LEFT_KEY$1]:DIRECTION_RIGHT,[ARROW_RIGHT_KEY$1]:DIRECTION_LEFT},Default$b={interval:5e3,keyboard:!0,pause:"hover",ride:!1,touch:!0,wrap:!0},DefaultType$b={interval:"(number|boolean)",keyboard:"boolean",pause:"(string|boolean)",ride:"(boolean|string)",touch:"boolean",wrap:"boolean"};class Carousel extends BaseComponent{constructor(t,e){super(t,e),this._interval=null,this._activeElement=null,this._isSliding=!1,this.touchTimeout=null,this._swipeHelper=null,this._indicatorsElement=SelectorEngine.findOne(SELECTOR_INDICATORS,this._element),this._addEventListeners(),this._config.ride===CLASS_NAME_CAROUSEL&&this.cycle()}static get Default(){return Default$b}static get DefaultType(){return DefaultType$b}static get NAME(){return NAME$c}next(){this._slide(ORDER_NEXT)}nextWhenVisible(){!document.hidden&&isVisible(this._element)&&this.next()}prev(){this._slide(ORDER_PREV)}pause(){this._isSliding&&triggerTransitionEnd(this._element),this._clearInterval()}cycle(){this._clearInterval(),this._updateInterval(),this._interval=setInterval(()=>this.nextWhenVisible(),this._config.interval)}_maybeEnableCycle(){if(this._config.ride){if(this._isSliding){EventHandler.one(this._element,EVENT_SLID,()=>this.cycle());return}this.cycle()}}to(t){const e=this._getItems();if(t>e.length-1||t<0)return;if(this._isSliding){EventHandler.one(this._element,EVENT_SLID,()=>this.to(t));return}const r=this._getItemIndex(this._getActive());if(r===t)return;const i=t>r?ORDER_NEXT:ORDER_PREV;this._slide(i,e[t])}dispose(){this._swipeHelper&&this._swipeHelper.dispose(),super.dispose()}_configAfterMerge(t){return t.defaultInterval=t.interval,t}_addEventListeners(){this._config.keyboard&&EventHandler.on(this._element,EVENT_KEYDOWN$1,t=>this._keydown(t)),this._config.pause==="hover"&&(EventHandler.on(this._element,EVENT_MOUSEENTER$1,()=>this.pause()),EventHandler.on(this._element,EVENT_MOUSELEAVE$1,()=>this._maybeEnableCycle())),this._config.touch&&Swipe.isSupported()&&this._addTouchEventListeners()}_addTouchEventListeners(){for(const r of SelectorEngine.find(SELECTOR_ITEM_IMG,this._element))EventHandler.on(r,EVENT_DRAG_START,i=>i.preventDefault());const e={leftCallback:()=>this._slide(this._directionToOrder(DIRECTION_LEFT)),rightCallback:()=>this._slide(this._directionToOrder(DIRECTION_RIGHT)),endCallback:()=>{this._config.pause==="hover"&&(this.pause(),this.touchTimeout&&clearTimeout(this.touchTimeout),this.touchTimeout=setTimeout(()=>this._maybeEnableCycle(),TOUCHEVENT_COMPAT_WAIT+this._config.interval))}};this._swipeHelper=new Swipe(this._element,e)}_keydown(t){if(/input|textarea/i.test(t.target.tagName))return;const e=KEY_TO_DIRECTION[t.key];e&&(t.preventDefault(),this._slide(this._directionToOrder(e)))}_getItemIndex(t){return this._getItems().indexOf(t)}_setActiveIndicatorElement(t){if(!this._indicatorsElement)return;const e=SelectorEngine.findOne(SELECTOR_ACTIVE,this._indicatorsElement);e.classList.remove(CLASS_NAME_ACTIVE$2),e.removeAttribute("aria-current");const r=SelectorEngine.findOne(`[data-bs-slide-to="${t}"]`,this._indicatorsElement);r&&(r.classList.add(CLASS_NAME_ACTIVE$2),r.setAttribute("aria-current","true"))}_updateInterval(){const t=this._activeElement||this._getActive();if(!t)return;const e=Number.parseInt(t.getAttribute("data-bs-interval"),10);this._config.interval=e||this._config.defaultInterval}_slide(t,e=null){if(this._isSliding)return;const r=this._getActive(),i=t===ORDER_NEXT,a=e||getNextActiveElement(this._getItems(),r,i,this._config.wrap);if(a===r)return;const o=this._getItemIndex(a),c=_=>EventHandler.trigger(this._element,_,{relatedTarget:a,direction:this._orderToDirection(t),from:this._getItemIndex(r),to:o});if(c(EVENT_SLIDE).defaultPrevented||!r||!a)return;const f=!!this._interval;this.pause(),this._isSliding=!0,this._setActiveIndicatorElement(o),this._activeElement=a;const h=i?CLASS_NAME_START:CLASS_NAME_END,m=i?CLASS_NAME_NEXT:CLASS_NAME_PREV;a.classList.add(m),reflow(a),r.classList.add(h),a.classList.add(h);const E=()=>{a.classList.remove(h,m),a.classList.add(CLASS_NAME_ACTIVE$2),r.classList.remove(CLASS_NAME_ACTIVE$2,m,h),this._isSliding=!1,c(EVENT_SLID)};this._queueCallback(E,r,this._isAnimated()),f&&this.cycle()}_isAnimated(){return this._element.classList.contains(CLASS_NAME_SLIDE)}_getActive(){return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM,this._element)}_getItems(){return SelectorEngine.find(SELECTOR_ITEM,this._element)}_clearInterval(){this._interval&&(clearInterval(this._interval),this._interval=null)}_directionToOrder(t){return isRTL()?t===DIRECTION_LEFT?ORDER_PREV:ORDER_NEXT:t===DIRECTION_LEFT?ORDER_NEXT:ORDER_PREV}_orderToDirection(t){return isRTL()?t===ORDER_PREV?DIRECTION_LEFT:DIRECTION_RIGHT:t===ORDER_PREV?DIRECTION_RIGHT:DIRECTION_LEFT}static jQueryInterface(t){return this.each(function(){const e=Carousel.getOrCreateInstance(this,t);if(typeof t=="number"){e.to(t);return}if(typeof t=="string"){if(e[t]===void 0||t.startsWith("_")||t==="constructor")throw new TypeError(`No method named "${t}"`);e[t]()}})}}EventHandler.on(document,EVENT_CLICK_DATA_API$5,SELECTOR_DATA_SLIDE,function(n){const t=SelectorEngine.getElementFromSelector(this);if(!t||!t.classList.contains(CLASS_NAME_CAROUSEL))return;n.preventDefault();const e=Carousel.getOrCreateInstance(t),r=this.getAttribute("data-bs-slide-to");if(r){e.to(r),e._maybeEnableCycle();return}if(Manipulator.getDataAttribute(this,"slide")==="next"){e.next(),e._maybeEnableCycle();return}e.prev(),e._maybeEnableCycle()});EventHandler.on(window,EVENT_LOAD_DATA_API$3,()=>{const n=SelectorEngine.find(SELECTOR_DATA_RIDE);for(const t of n)Carousel.getOrCreateInstance(t)});defineJQueryPlugin(Carousel);const NAME$b="collapse",DATA_KEY$7="bs.collapse",EVENT_KEY$7=`.${DATA_KEY$7}`,DATA_API_KEY$4=".data-api",EVENT_SHOW$6=`show${EVENT_KEY$7}`,EVENT_SHOWN$6=`shown${EVENT_KEY$7}`,EVENT_HIDE$6=`hide${EVENT_KEY$7}`,EVENT_HIDDEN$6=`hidden${EVENT_KEY$7}`,EVENT_CLICK_DATA_API$4=`click${EVENT_KEY$7}${DATA_API_KEY$4}`,CLASS_NAME_SHOW$7="show",CLASS_NAME_COLLAPSE="collapse",CLASS_NAME_COLLAPSING="collapsing",CLASS_NAME_COLLAPSED="collapsed",CLASS_NAME_DEEPER_CHILDREN=`:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`,CLASS_NAME_HORIZONTAL="collapse-horizontal",WIDTH="width",HEIGHT="height",SELECTOR_ACTIVES=".collapse.show, .collapse.collapsing",SELECTOR_DATA_TOGGLE$4='[data-bs-toggle="collapse"]',Default$a={parent:null,toggle:!0},DefaultType$a={parent:"(null|element)",toggle:"boolean"};class Collapse extends BaseComponent{constructor(t,e){super(t,e),this._isTransitioning=!1,this._triggerArray=[];const r=SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);for(const i of r){const a=SelectorEngine.getSelectorFromElement(i),o=SelectorEngine.find(a).filter(c=>c===this._element);a!==null&&o.length&&this._triggerArray.push(i)}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return Default$a}static get DefaultType(){return DefaultType$a}static get NAME(){return NAME$b}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let t=[];if(this._config.parent&&(t=this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(c=>c!==this._element).map(c=>Collapse.getOrCreateInstance(c,{toggle:!1}))),t.length&&t[0]._isTransitioning||EventHandler.trigger(this._element,EVENT_SHOW$6).defaultPrevented)return;for(const c of t)c.hide();const r=this._getDimension();this._element.classList.remove(CLASS_NAME_COLLAPSE),this._element.classList.add(CLASS_NAME_COLLAPSING),this._element.style[r]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const i=()=>{this._isTransitioning=!1,this._element.classList.remove(CLASS_NAME_COLLAPSING),this._element.classList.add(CLASS_NAME_COLLAPSE,CLASS_NAME_SHOW$7),this._element.style[r]="",EventHandler.trigger(this._element,EVENT_SHOWN$6)},o=`scroll${r[0].toUpperCase()+r.slice(1)}`;this._queueCallback(i,this._element,!0),this._element.style[r]=`${this._element[o]}px`}hide(){if(this._isTransitioning||!this._isShown()||EventHandler.trigger(this._element,EVENT_HIDE$6).defaultPrevented)return;const e=this._getDimension();this._element.style[e]=`${this._element.getBoundingClientRect()[e]}px`,reflow(this._element),this._element.classList.add(CLASS_NAME_COLLAPSING),this._element.classList.remove(CLASS_NAME_COLLAPSE,CLASS_NAME_SHOW$7);for(const i of this._triggerArray){const a=SelectorEngine.getElementFromSelector(i);a&&!this._isShown(a)&&this._addAriaAndCollapsedClass([i],!1)}this._isTransitioning=!0;const r=()=>{this._isTransitioning=!1,this._element.classList.remove(CLASS_NAME_COLLAPSING),this._element.classList.add(CLASS_NAME_COLLAPSE),EventHandler.trigger(this._element,EVENT_HIDDEN$6)};this._element.style[e]="",this._queueCallback(r,this._element,!0)}_isShown(t=this._element){return t.classList.contains(CLASS_NAME_SHOW$7)}_configAfterMerge(t){return t.toggle=!!t.toggle,t.parent=getElement(t.parent),t}_getDimension(){return this._element.classList.contains(CLASS_NAME_HORIZONTAL)?WIDTH:HEIGHT}_initializeChildren(){if(!this._config.parent)return;const t=this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);for(const e of t){const r=SelectorEngine.getElementFromSelector(e);r&&this._addAriaAndCollapsedClass([e],this._isShown(r))}}_getFirstLevelChildren(t){const e=SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN,this._config.parent);return SelectorEngine.find(t,this._config.parent).filter(r=>!e.includes(r))}_addAriaAndCollapsedClass(t,e){if(t.length)for(const r of t)r.classList.toggle(CLASS_NAME_COLLAPSED,!e),r.setAttribute("aria-expanded",e)}static jQueryInterface(t){const e={};return typeof t=="string"&&/show|hide/.test(t)&&(e.toggle=!1),this.each(function(){const r=Collapse.getOrCreateInstance(this,e);if(typeof t=="string"){if(typeof r[t]>"u")throw new TypeError(`No method named "${t}"`);r[t]()}})}}EventHandler.on(document,EVENT_CLICK_DATA_API$4,SELECTOR_DATA_TOGGLE$4,function(n){(n.target.tagName==="A"||n.delegateTarget&&n.delegateTarget.tagName==="A")&&n.preventDefault();for(const t of SelectorEngine.getMultipleElementsFromSelector(this))Collapse.getOrCreateInstance(t,{toggle:!1}).toggle()});defineJQueryPlugin(Collapse);const NAME$a="dropdown",DATA_KEY$6="bs.dropdown",EVENT_KEY$6=`.${DATA_KEY$6}`,DATA_API_KEY$3=".data-api",ESCAPE_KEY$2="Escape",TAB_KEY$1="Tab",ARROW_UP_KEY$1="ArrowUp",ARROW_DOWN_KEY$1="ArrowDown",RIGHT_MOUSE_BUTTON=2,EVENT_HIDE$5=`hide${EVENT_KEY$6}`,EVENT_HIDDEN$5=`hidden${EVENT_KEY$6}`,EVENT_SHOW$5=`show${EVENT_KEY$6}`,EVENT_SHOWN$5=`shown${EVENT_KEY$6}`,EVENT_CLICK_DATA_API$3=`click${EVENT_KEY$6}${DATA_API_KEY$3}`,EVENT_KEYDOWN_DATA_API=`keydown${EVENT_KEY$6}${DATA_API_KEY$3}`,EVENT_KEYUP_DATA_API=`keyup${EVENT_KEY$6}${DATA_API_KEY$3}`,CLASS_NAME_SHOW$6="show",CLASS_NAME_DROPUP="dropup",CLASS_NAME_DROPEND="dropend",CLASS_NAME_DROPSTART="dropstart",CLASS_NAME_DROPUP_CENTER="dropup-center",CLASS_NAME_DROPDOWN_CENTER="dropdown-center",SELECTOR_DATA_TOGGLE$3='[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)',SELECTOR_DATA_TOGGLE_SHOWN=`${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`,SELECTOR_MENU=".dropdown-menu",SELECTOR_NAVBAR=".navbar",SELECTOR_NAVBAR_NAV=".navbar-nav",SELECTOR_VISIBLE_ITEMS=".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",PLACEMENT_TOP=isRTL()?"top-end":"top-start",PLACEMENT_TOPEND=isRTL()?"top-start":"top-end",PLACEMENT_BOTTOM=isRTL()?"bottom-end":"bottom-start",PLACEMENT_BOTTOMEND=isRTL()?"bottom-start":"bottom-end",PLACEMENT_RIGHT=isRTL()?"left-start":"right-start",PLACEMENT_LEFT=isRTL()?"right-start":"left-start",PLACEMENT_TOPCENTER="top",PLACEMENT_BOTTOMCENTER="bottom",Default$9={autoClose:!0,boundary:"clippingParents",display:"dynamic",offset:[0,2],popperConfig:null,reference:"toggle"},DefaultType$9={autoClose:"(boolean|string)",boundary:"(string|element)",display:"string",offset:"(array|string|function)",popperConfig:"(null|object|function)",reference:"(string|element|object)"};class Dropdown extends BaseComponent{constructor(t,e){super(t,e),this._popper=null,this._parent=this._element.parentNode,this._menu=SelectorEngine.next(this._element,SELECTOR_MENU)[0]||SelectorEngine.prev(this._element,SELECTOR_MENU)[0]||SelectorEngine.findOne(SELECTOR_MENU,this._parent),this._inNavbar=this._detectNavbar()}static get Default(){return Default$9}static get DefaultType(){return DefaultType$9}static get NAME(){return NAME$a}toggle(){return this._isShown()?this.hide():this.show()}show(){if(isDisabled(this._element)||this._isShown())return;const t={relatedTarget:this._element};if(!EventHandler.trigger(this._element,EVENT_SHOW$5,t).defaultPrevented){if(this._createPopper(),"ontouchstart"in document.documentElement&&!this._parent.closest(SELECTOR_NAVBAR_NAV))for(const r of[].concat(...document.body.children))EventHandler.on(r,"mouseover",noop);this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.add(CLASS_NAME_SHOW$6),this._element.classList.add(CLASS_NAME_SHOW$6),EventHandler.trigger(this._element,EVENT_SHOWN$5,t)}}hide(){if(isDisabled(this._element)||!this._isShown())return;const t={relatedTarget:this._element};this._completeHide(t)}dispose(){this._popper&&this._popper.destroy(),super.dispose()}update(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()}_completeHide(t){if(!EventHandler.trigger(this._element,EVENT_HIDE$5,t).defaultPrevented){if("ontouchstart"in document.documentElement)for(const r of[].concat(...document.body.children))EventHandler.off(r,"mouseover",noop);this._popper&&this._popper.destroy(),this._menu.classList.remove(CLASS_NAME_SHOW$6),this._element.classList.remove(CLASS_NAME_SHOW$6),this._element.setAttribute("aria-expanded","false"),Manipulator.removeDataAttribute(this._menu,"popper"),EventHandler.trigger(this._element,EVENT_HIDDEN$5,t)}}_getConfig(t){if(t=super._getConfig(t),typeof t.reference=="object"&&!isElement(t.reference)&&typeof t.reference.getBoundingClientRect!="function")throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);return t}_createPopper(){if(typeof Popper>"u")throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)");let t=this._element;this._config.reference==="parent"?t=this._parent:isElement(this._config.reference)?t=getElement(this._config.reference):typeof this._config.reference=="object"&&(t=this._config.reference);const e=this._getPopperConfig();this._popper=createPopper(t,this._menu,e)}_isShown(){return this._menu.classList.contains(CLASS_NAME_SHOW$6)}_getPlacement(){const t=this._parent;if(t.classList.contains(CLASS_NAME_DROPEND))return PLACEMENT_RIGHT;if(t.classList.contains(CLASS_NAME_DROPSTART))return PLACEMENT_LEFT;if(t.classList.contains(CLASS_NAME_DROPUP_CENTER))return PLACEMENT_TOPCENTER;if(t.classList.contains(CLASS_NAME_DROPDOWN_CENTER))return PLACEMENT_BOTTOMCENTER;const e=getComputedStyle(this._menu).getPropertyValue("--bs-position").trim()==="end";return t.classList.contains(CLASS_NAME_DROPUP)?e?PLACEMENT_TOPEND:PLACEMENT_TOP:e?PLACEMENT_BOTTOMEND:PLACEMENT_BOTTOM}_detectNavbar(){return this._element.closest(SELECTOR_NAVBAR)!==null}_getOffset(){const{offset:t}=this._config;return typeof t=="string"?t.split(",").map(e=>Number.parseInt(e,10)):typeof t=="function"?e=>t(e,this._element):t}_getPopperConfig(){const t={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"offset",options:{offset:this._getOffset()}}]};return(this._inNavbar||this._config.display==="static")&&(Manipulator.setDataAttribute(this._menu,"popper","static"),t.modifiers=[{name:"applyStyles",enabled:!1}]),{...t,...execute(this._config.popperConfig,[void 0,t])}}_selectMenuItem({key:t,target:e}){const r=SelectorEngine.find(SELECTOR_VISIBLE_ITEMS,this._menu).filter(i=>isVisible(i));r.length&&getNextActiveElement(r,e,t===ARROW_DOWN_KEY$1,!r.includes(e)).focus()}static jQueryInterface(t){return this.each(function(){const e=Dropdown.getOrCreateInstance(this,t);if(typeof t=="string"){if(typeof e[t]>"u")throw new TypeError(`No method named "${t}"`);e[t]()}})}static clearMenus(t){if(t.button===RIGHT_MOUSE_BUTTON||t.type==="keyup"&&t.key!==TAB_KEY$1)return;const e=SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);for(const r of e){const i=Dropdown.getInstance(r);if(!i||i._config.autoClose===!1)continue;const a=t.composedPath(),o=a.includes(i._menu);if(a.includes(i._element)||i._config.autoClose==="inside"&&!o||i._config.autoClose==="outside"&&o||i._menu.contains(t.target)&&(t.type==="keyup"&&t.key===TAB_KEY$1||/input|select|option|textarea|form/i.test(t.target.tagName)))continue;const c={relatedTarget:i._element};t.type==="click"&&(c.clickEvent=t),i._completeHide(c)}}static dataApiKeydownHandler(t){const e=/input|textarea/i.test(t.target.tagName),r=t.key===ESCAPE_KEY$2,i=[ARROW_UP_KEY$1,ARROW_DOWN_KEY$1].includes(t.key);if(!i&&!r||e&&!r)return;t.preventDefault();const a=this.matches(SELECTOR_DATA_TOGGLE$3)?this:SelectorEngine.prev(this,SELECTOR_DATA_TOGGLE$3)[0]||SelectorEngine.next(this,SELECTOR_DATA_TOGGLE$3)[0]||SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3,t.delegateTarget.parentNode),o=Dropdown.getOrCreateInstance(a);if(i){t.stopPropagation(),o.show(),o._selectMenuItem(t);return}o._isShown()&&(t.stopPropagation(),o.hide(),a.focus())}}EventHandler.on(document,EVENT_KEYDOWN_DATA_API,SELECTOR_DATA_TOGGLE$3,Dropdown.dataApiKeydownHandler);EventHandler.on(document,EVENT_KEYDOWN_DATA_API,SELECTOR_MENU,Dropdown.dataApiKeydownHandler);EventHandler.on(document,EVENT_CLICK_DATA_API$3,Dropdown.clearMenus);EventHandler.on(document,EVENT_KEYUP_DATA_API,Dropdown.clearMenus);EventHandler.on(document,EVENT_CLICK_DATA_API$3,SELECTOR_DATA_TOGGLE$3,function(n){n.preventDefault(),Dropdown.getOrCreateInstance(this).toggle()});defineJQueryPlugin(Dropdown);const NAME$9="backdrop",CLASS_NAME_FADE$4="fade",CLASS_NAME_SHOW$5="show",EVENT_MOUSEDOWN=`mousedown.bs.${NAME$9}`,Default$8={className:"modal-backdrop",clickCallback:null,isAnimated:!1,isVisible:!0,rootElement:"body"},DefaultType$8={className:"string",clickCallback:"(function|null)",isAnimated:"boolean",isVisible:"boolean",rootElement:"(element|string)"};class Backdrop extends Config{constructor(t){super(),this._config=this._getConfig(t),this._isAppended=!1,this._element=null}static get Default(){return Default$8}static get DefaultType(){return DefaultType$8}static get NAME(){return NAME$9}show(t){if(!this._config.isVisible){execute(t);return}this._append();const e=this._getElement();this._config.isAnimated&&reflow(e),e.classList.add(CLASS_NAME_SHOW$5),this._emulateAnimation(()=>{execute(t)})}hide(t){if(!this._config.isVisible){execute(t);return}this._getElement().classList.remove(CLASS_NAME_SHOW$5),this._emulateAnimation(()=>{this.dispose(),execute(t)})}dispose(){this._isAppended&&(EventHandler.off(this._element,EVENT_MOUSEDOWN),this._element.remove(),this._isAppended=!1)}_getElement(){if(!this._element){const t=document.createElement("div");t.className=this._config.className,this._config.isAnimated&&t.classList.add(CLASS_NAME_FADE$4),this._element=t}return this._element}_configAfterMerge(t){return t.rootElement=getElement(t.rootElement),t}_append(){if(this._isAppended)return;const t=this._getElement();this._config.rootElement.append(t),EventHandler.on(t,EVENT_MOUSEDOWN,()=>{execute(this._config.clickCallback)}),this._isAppended=!0}_emulateAnimation(t){executeAfterTransition(t,this._getElement(),this._config.isAnimated)}}const NAME$8="focustrap",DATA_KEY$5="bs.focustrap",EVENT_KEY$5=`.${DATA_KEY$5}`,EVENT_FOCUSIN$2=`focusin${EVENT_KEY$5}`,EVENT_KEYDOWN_TAB=`keydown.tab${EVENT_KEY$5}`,TAB_KEY="Tab",TAB_NAV_FORWARD="forward",TAB_NAV_BACKWARD="backward",Default$7={autofocus:!0,trapElement:null},DefaultType$7={autofocus:"boolean",trapElement:"element"};class FocusTrap extends Config{constructor(t){super(),this._config=this._getConfig(t),this._isActive=!1,this._lastTabNavDirection=null}static get Default(){return Default$7}static get DefaultType(){return DefaultType$7}static get NAME(){return NAME$8}activate(){this._isActive||(this._config.autofocus&&this._config.trapElement.focus(),EventHandler.off(document,EVENT_KEY$5),EventHandler.on(document,EVENT_FOCUSIN$2,t=>this._handleFocusin(t)),EventHandler.on(document,EVENT_KEYDOWN_TAB,t=>this._handleKeydown(t)),this._isActive=!0)}deactivate(){this._isActive&&(this._isActive=!1,EventHandler.off(document,EVENT_KEY$5))}_handleFocusin(t){const{trapElement:e}=this._config;if(t.target===document||t.target===e||e.contains(t.target))return;const r=SelectorEngine.focusableChildren(e);r.length===0?e.focus():this._lastTabNavDirection===TAB_NAV_BACKWARD?r[r.length-1].focus():r[0].focus()}_handleKeydown(t){t.key===TAB_KEY&&(this._lastTabNavDirection=t.shiftKey?TAB_NAV_BACKWARD:TAB_NAV_FORWARD)}}const SELECTOR_FIXED_CONTENT=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",SELECTOR_STICKY_CONTENT=".sticky-top",PROPERTY_PADDING="padding-right",PROPERTY_MARGIN="margin-right";class ScrollBarHelper{constructor(){this._element=document.body}getWidth(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}hide(){const t=this.getWidth();this._disableOverFlow(),this._setElementAttributes(this._element,PROPERTY_PADDING,e=>e+t),this._setElementAttributes(SELECTOR_FIXED_CONTENT,PROPERTY_PADDING,e=>e+t),this._setElementAttributes(SELECTOR_STICKY_CONTENT,PROPERTY_MARGIN,e=>e-t)}reset(){this._resetElementAttributes(this._element,"overflow"),this._resetElementAttributes(this._element,PROPERTY_PADDING),this._resetElementAttributes(SELECTOR_FIXED_CONTENT,PROPERTY_PADDING),this._resetElementAttributes(SELECTOR_STICKY_CONTENT,PROPERTY_MARGIN)}isOverflowing(){return this.getWidth()>0}_disableOverFlow(){this._saveInitialAttribute(this._element,"overflow"),this._element.style.overflow="hidden"}_setElementAttributes(t,e,r){const i=this.getWidth(),a=o=>{if(o!==this._element&&window.innerWidth>o.clientWidth+i)return;this._saveInitialAttribute(o,e);const c=window.getComputedStyle(o).getPropertyValue(e);o.style.setProperty(e,`${r(Number.parseFloat(c))}px`)};this._applyManipulationCallback(t,a)}_saveInitialAttribute(t,e){const r=t.style.getPropertyValue(e);r&&Manipulator.setDataAttribute(t,e,r)}_resetElementAttributes(t,e){const r=i=>{const a=Manipulator.getDataAttribute(i,e);if(a===null){i.style.removeProperty(e);return}Manipulator.removeDataAttribute(i,e),i.style.setProperty(e,a)};this._applyManipulationCallback(t,r)}_applyManipulationCallback(t,e){if(isElement(t)){e(t);return}for(const r of SelectorEngine.find(t,this._element))e(r)}}const NAME$7="modal",DATA_KEY$4="bs.modal",EVENT_KEY$4=`.${DATA_KEY$4}`,DATA_API_KEY$2=".data-api",ESCAPE_KEY$1="Escape",EVENT_HIDE$4=`hide${EVENT_KEY$4}`,EVENT_HIDE_PREVENTED$1=`hidePrevented${EVENT_KEY$4}`,EVENT_HIDDEN$4=`hidden${EVENT_KEY$4}`,EVENT_SHOW$4=`show${EVENT_KEY$4}`,EVENT_SHOWN$4=`shown${EVENT_KEY$4}`,EVENT_RESIZE$1=`resize${EVENT_KEY$4}`,EVENT_CLICK_DISMISS=`click.dismiss${EVENT_KEY$4}`,EVENT_MOUSEDOWN_DISMISS=`mousedown.dismiss${EVENT_KEY$4}`,EVENT_KEYDOWN_DISMISS$1=`keydown.dismiss${EVENT_KEY$4}`,EVENT_CLICK_DATA_API$2=`click${EVENT_KEY$4}${DATA_API_KEY$2}`,CLASS_NAME_OPEN="modal-open",CLASS_NAME_FADE$3="fade",CLASS_NAME_SHOW$4="show",CLASS_NAME_STATIC="modal-static",OPEN_SELECTOR$1=".modal.show",SELECTOR_DIALOG=".modal-dialog",SELECTOR_MODAL_BODY=".modal-body",SELECTOR_DATA_TOGGLE$2='[data-bs-toggle="modal"]',Default$6={backdrop:!0,focus:!0,keyboard:!0},DefaultType$6={backdrop:"(boolean|string)",focus:"boolean",keyboard:"boolean"};class Modal extends BaseComponent{constructor(t,e){super(t,e),this._dialog=SelectorEngine.findOne(SELECTOR_DIALOG,this._element),this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._isShown=!1,this._isTransitioning=!1,this._scrollBar=new ScrollBarHelper,this._addEventListeners()}static get Default(){return Default$6}static get DefaultType(){return DefaultType$6}static get NAME(){return NAME$7}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||this._isTransitioning||EventHandler.trigger(this._element,EVENT_SHOW$4,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._isTransitioning=!0,this._scrollBar.hide(),document.body.classList.add(CLASS_NAME_OPEN),this._adjustDialog(),this._backdrop.show(()=>this._showElement(t)))}hide(){!this._isShown||this._isTransitioning||EventHandler.trigger(this._element,EVENT_HIDE$4).defaultPrevented||(this._isShown=!1,this._isTransitioning=!0,this._focustrap.deactivate(),this._element.classList.remove(CLASS_NAME_SHOW$4),this._queueCallback(()=>this._hideModal(),this._element,this._isAnimated()))}dispose(){EventHandler.off(window,EVENT_KEY$4),EventHandler.off(this._dialog,EVENT_KEY$4),this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}handleUpdate(){this._adjustDialog()}_initializeBackDrop(){return new Backdrop({isVisible:!!this._config.backdrop,isAnimated:this._isAnimated()})}_initializeFocusTrap(){return new FocusTrap({trapElement:this._element})}_showElement(t){document.body.contains(this._element)||document.body.append(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0;const e=SelectorEngine.findOne(SELECTOR_MODAL_BODY,this._dialog);e&&(e.scrollTop=0),reflow(this._element),this._element.classList.add(CLASS_NAME_SHOW$4);const r=()=>{this._config.focus&&this._focustrap.activate(),this._isTransitioning=!1,EventHandler.trigger(this._element,EVENT_SHOWN$4,{relatedTarget:t})};this._queueCallback(r,this._dialog,this._isAnimated())}_addEventListeners(){EventHandler.on(this._element,EVENT_KEYDOWN_DISMISS$1,t=>{if(t.key===ESCAPE_KEY$1){if(this._config.keyboard){this.hide();return}this._triggerBackdropTransition()}}),EventHandler.on(window,EVENT_RESIZE$1,()=>{this._isShown&&!this._isTransitioning&&this._adjustDialog()}),EventHandler.on(this._element,EVENT_MOUSEDOWN_DISMISS,t=>{EventHandler.one(this._element,EVENT_CLICK_DISMISS,e=>{if(!(this._element!==t.target||this._element!==e.target)){if(this._config.backdrop==="static"){this._triggerBackdropTransition();return}this._config.backdrop&&this.hide()}})})}_hideModal(){this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._backdrop.hide(()=>{document.body.classList.remove(CLASS_NAME_OPEN),this._resetAdjustments(),this._scrollBar.reset(),EventHandler.trigger(this._element,EVENT_HIDDEN$4)})}_isAnimated(){return this._element.classList.contains(CLASS_NAME_FADE$3)}_triggerBackdropTransition(){if(EventHandler.trigger(this._element,EVENT_HIDE_PREVENTED$1).defaultPrevented)return;const e=this._element.scrollHeight>document.documentElement.clientHeight,r=this._element.style.overflowY;r==="hidden"||this._element.classList.contains(CLASS_NAME_STATIC)||(e||(this._element.style.overflowY="hidden"),this._element.classList.add(CLASS_NAME_STATIC),this._queueCallback(()=>{this._element.classList.remove(CLASS_NAME_STATIC),this._queueCallback(()=>{this._element.style.overflowY=r},this._dialog)},this._dialog),this._element.focus())}_adjustDialog(){const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._scrollBar.getWidth(),r=e>0;if(r&&!t){const i=isRTL()?"paddingLeft":"paddingRight";this._element.style[i]=`${e}px`}if(!r&&t){const i=isRTL()?"paddingRight":"paddingLeft";this._element.style[i]=`${e}px`}}_resetAdjustments(){this._element.style.paddingLeft="",this._element.style.paddingRight=""}static jQueryInterface(t,e){return this.each(function(){const r=Modal.getOrCreateInstance(this,t);if(typeof t=="string"){if(typeof r[t]>"u")throw new TypeError(`No method named "${t}"`);r[t](e)}})}}EventHandler.on(document,EVENT_CLICK_DATA_API$2,SELECTOR_DATA_TOGGLE$2,function(n){const t=SelectorEngine.getElementFromSelector(this);["A","AREA"].includes(this.tagName)&&n.preventDefault(),EventHandler.one(t,EVENT_SHOW$4,i=>{i.defaultPrevented||EventHandler.one(t,EVENT_HIDDEN$4,()=>{isVisible(this)&&this.focus()})});const e=SelectorEngine.findOne(OPEN_SELECTOR$1);e&&Modal.getInstance(e).hide(),Modal.getOrCreateInstance(t).toggle(this)});enableDismissTrigger(Modal);defineJQueryPlugin(Modal);const NAME$6="offcanvas",DATA_KEY$3="bs.offcanvas",EVENT_KEY$3=`.${DATA_KEY$3}`,DATA_API_KEY$1=".data-api",EVENT_LOAD_DATA_API$2=`load${EVENT_KEY$3}${DATA_API_KEY$1}`,ESCAPE_KEY="Escape",CLASS_NAME_SHOW$3="show",CLASS_NAME_SHOWING$1="showing",CLASS_NAME_HIDING="hiding",CLASS_NAME_BACKDROP="offcanvas-backdrop",OPEN_SELECTOR=".offcanvas.show",EVENT_SHOW$3=`show${EVENT_KEY$3}`,EVENT_SHOWN$3=`shown${EVENT_KEY$3}`,EVENT_HIDE$3=`hide${EVENT_KEY$3}`,EVENT_HIDE_PREVENTED=`hidePrevented${EVENT_KEY$3}`,EVENT_HIDDEN$3=`hidden${EVENT_KEY$3}`,EVENT_RESIZE=`resize${EVENT_KEY$3}`,EVENT_CLICK_DATA_API$1=`click${EVENT_KEY$3}${DATA_API_KEY$1}`,EVENT_KEYDOWN_DISMISS=`keydown.dismiss${EVENT_KEY$3}`,SELECTOR_DATA_TOGGLE$1='[data-bs-toggle="offcanvas"]',Default$5={backdrop:!0,keyboard:!0,scroll:!1},DefaultType$5={backdrop:"(boolean|string)",keyboard:"boolean",scroll:"boolean"};class Offcanvas extends BaseComponent{constructor(t,e){super(t,e),this._isShown=!1,this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._addEventListeners()}static get Default(){return Default$5}static get DefaultType(){return DefaultType$5}static get NAME(){return NAME$6}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){if(this._isShown||EventHandler.trigger(this._element,EVENT_SHOW$3,{relatedTarget:t}).defaultPrevented)return;this._isShown=!0,this._backdrop.show(),this._config.scroll||new ScrollBarHelper().hide(),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.classList.add(CLASS_NAME_SHOWING$1);const r=()=>{(!this._config.scroll||this._config.backdrop)&&this._focustrap.activate(),this._element.classList.add(CLASS_NAME_SHOW$3),this._element.classList.remove(CLASS_NAME_SHOWING$1),EventHandler.trigger(this._element,EVENT_SHOWN$3,{relatedTarget:t})};this._queueCallback(r,this._element,!0)}hide(){if(!this._isShown||EventHandler.trigger(this._element,EVENT_HIDE$3).defaultPrevented)return;this._focustrap.deactivate(),this._element.blur(),this._isShown=!1,this._element.classList.add(CLASS_NAME_HIDING),this._backdrop.hide();const e=()=>{this._element.classList.remove(CLASS_NAME_SHOW$3,CLASS_NAME_HIDING),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._config.scroll||new ScrollBarHelper().reset(),EventHandler.trigger(this._element,EVENT_HIDDEN$3)};this._queueCallback(e,this._element,!0)}dispose(){this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}_initializeBackDrop(){const t=()=>{if(this._config.backdrop==="static"){EventHandler.trigger(this._element,EVENT_HIDE_PREVENTED);return}this.hide()},e=!!this._config.backdrop;return new Backdrop({className:CLASS_NAME_BACKDROP,isVisible:e,isAnimated:!0,rootElement:this._element.parentNode,clickCallback:e?t:null})}_initializeFocusTrap(){return new FocusTrap({trapElement:this._element})}_addEventListeners(){EventHandler.on(this._element,EVENT_KEYDOWN_DISMISS,t=>{if(t.key===ESCAPE_KEY){if(this._config.keyboard){this.hide();return}EventHandler.trigger(this._element,EVENT_HIDE_PREVENTED)}})}static jQueryInterface(t){return this.each(function(){const e=Offcanvas.getOrCreateInstance(this,t);if(typeof t=="string"){if(e[t]===void 0||t.startsWith("_")||t==="constructor")throw new TypeError(`No method named "${t}"`);e[t](this)}})}}EventHandler.on(document,EVENT_CLICK_DATA_API$1,SELECTOR_DATA_TOGGLE$1,function(n){const t=SelectorEngine.getElementFromSelector(this);if(["A","AREA"].includes(this.tagName)&&n.preventDefault(),isDisabled(this))return;EventHandler.one(t,EVENT_HIDDEN$3,()=>{isVisible(this)&&this.focus()});const e=SelectorEngine.findOne(OPEN_SELECTOR);e&&e!==t&&Offcanvas.getInstance(e).hide(),Offcanvas.getOrCreateInstance(t).toggle(this)});EventHandler.on(window,EVENT_LOAD_DATA_API$2,()=>{for(const n of SelectorEngine.find(OPEN_SELECTOR))Offcanvas.getOrCreateInstance(n).show()});EventHandler.on(window,EVENT_RESIZE,()=>{for(const n of SelectorEngine.find("[aria-modal][class*=show][class*=offcanvas-]"))getComputedStyle(n).position!=="fixed"&&Offcanvas.getOrCreateInstance(n).hide()});enableDismissTrigger(Offcanvas);defineJQueryPlugin(Offcanvas);const ARIA_ATTRIBUTE_PATTERN=/^aria-[\w-]*$/i,DefaultAllowlist={"*":["class","dir","id","lang","role",ARIA_ATTRIBUTE_PATTERN],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],dd:[],div:[],dl:[],dt:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},uriAttributes=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),SAFE_URL_PATTERN=/^(?!(?:javascript|vbscript):)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i,allowedAttribute=(n,t)=>{const e=n.nodeName.toLowerCase();return t.includes(e)?uriAttributes.has(e)?!!SAFE_URL_PATTERN.test(n.nodeValue):!0:t.filter(r=>r instanceof RegExp).some(r=>r.test(e))};function sanitizeHtml(n,t,e){if(!n.length)return n;if(e&&typeof e=="function")return e(n);const i=new window.DOMParser().parseFromString(n,"text/html"),a=[].concat(...i.body.querySelectorAll("*"));for(const o of a){const c=o.nodeName.toLowerCase();if(!Object.keys(t).includes(c)){o.remove();continue}const u=[].concat(...o.attributes),f=[].concat(t["*"]||[],t[c]||[]);for(const h of u)allowedAttribute(h,f)||o.removeAttribute(h.nodeName)}return i.body.innerHTML}const NAME$5="TemplateFactory",Default$4={allowList:DefaultAllowlist,content:{},extraClass:"",html:!1,sanitize:!0,sanitizeFn:null,template:"<div></div>"},DefaultType$4={allowList:"object",content:"object",extraClass:"(string|function)",html:"boolean",sanitize:"boolean",sanitizeFn:"(null|function)",template:"string"},DefaultContentType={entry:"(string|element|function|null)",selector:"(string|element)"};class TemplateFactory extends Config{constructor(t){super(),this._config=this._getConfig(t)}static get Default(){return Default$4}static get DefaultType(){return DefaultType$4}static get NAME(){return NAME$5}getContent(){return Object.values(this._config.content).map(t=>this._resolvePossibleFunction(t)).filter(Boolean)}hasContent(){return this.getContent().length>0}changeContent(t){return this._checkContent(t),this._config.content={...this._config.content,...t},this}toHtml(){const t=document.createElement("div");t.innerHTML=this._maybeSanitize(this._config.template);for(const[i,a]of Object.entries(this._config.content))this._setContent(t,a,i);const e=t.children[0],r=this._resolvePossibleFunction(this._config.extraClass);return r&&e.classList.add(...r.split(" ")),e}_typeCheckConfig(t){super._typeCheckConfig(t),this._checkContent(t.content)}_checkContent(t){for(const[e,r]of Object.entries(t))super._typeCheckConfig({selector:e,entry:r},DefaultContentType)}_setContent(t,e,r){const i=SelectorEngine.findOne(r,t);if(i){if(e=this._resolvePossibleFunction(e),!e){i.remove();return}if(isElement(e)){this._putElementInTemplate(getElement(e),i);return}if(this._config.html){i.textContent=e;return}i.textContent=e}}_maybeSanitize(t){return this._config.sanitize?sanitizeHtml(t,this._config.allowList,this._config.sanitizeFn):t}_resolvePossibleFunction(t){return execute(t,[void 0,this])}_putElementInTemplate(t,e){if(this._config.html){e.innerHTML="",e.append(t);return}e.textContent=t.textContent}}const NAME$4="tooltip",DISALLOWED_ATTRIBUTES=new Set(["sanitize","allowList","sanitizeFn"]),CLASS_NAME_FADE$2="fade",CLASS_NAME_MODAL="modal",CLASS_NAME_SHOW$2="show",SELECTOR_TOOLTIP_INNER=".tooltip-inner",SELECTOR_MODAL=`.${CLASS_NAME_MODAL}`,EVENT_MODAL_HIDE="hide.bs.modal",TRIGGER_HOVER="hover",TRIGGER_FOCUS="focus",TRIGGER_CLICK="click",TRIGGER_MANUAL="manual",EVENT_HIDE$2="hide",EVENT_HIDDEN$2="hidden",EVENT_SHOW$2="show",EVENT_SHOWN$2="shown",EVENT_INSERTED="inserted",EVENT_CLICK$1="click",EVENT_FOCUSIN$1="focusin",EVENT_FOCUSOUT$1="focusout",EVENT_MOUSEENTER="mouseenter",EVENT_MOUSELEAVE="mouseleave",AttachmentMap={AUTO:"auto",TOP:"top",RIGHT:isRTL()?"left":"right",BOTTOM:"bottom",LEFT:isRTL()?"right":"left"},Default$3={allowList:DefaultAllowlist,animation:!0,boundary:"clippingParents",container:!1,customClass:"",delay:0,fallbackPlacements:["top","right","bottom","left"],html:!1,offset:[0,6],placement:"top",popperConfig:null,sanitize:!0,sanitizeFn:null,selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',title:"",trigger:"hover focus"},DefaultType$3={allowList:"object",animation:"boolean",boundary:"(string|element)",container:"(string|element|boolean)",customClass:"(string|function)",delay:"(number|object)",fallbackPlacements:"array",html:"boolean",offset:"(array|string|function)",placement:"(string|function)",popperConfig:"(null|object|function)",sanitize:"boolean",sanitizeFn:"(null|function)",selector:"(string|boolean)",template:"string",title:"(string|element|function)",trigger:"string"};class Tooltip extends BaseComponent{constructor(t,e){if(typeof Popper>"u")throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org/docs/v2/)");super(t,e),this._isEnabled=!0,this._timeout=0,this._isHovered=null,this._activeTrigger={},this._popper=null,this._templateFactory=null,this._newContent=null,this.tip=null,this._setListeners(),this._config.selector||this._fixTitle()}static get Default(){return Default$3}static get DefaultType(){return DefaultType$3}static get NAME(){return NAME$4}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}toggleEnabled(){this._isEnabled=!this._isEnabled}toggle(){if(this._isEnabled){if(this._isShown()){this._leave();return}this._enter()}}dispose(){clearTimeout(this._timeout),EventHandler.off(this._element.closest(SELECTOR_MODAL),EVENT_MODAL_HIDE,this._hideModalHandler),this._element.getAttribute("data-bs-original-title")&&this._element.setAttribute("title",this._element.getAttribute("data-bs-original-title")),this._disposePopper(),super.dispose()}show(){if(this._element.style.display==="none")throw new Error("Please use show on visible elements");if(!(this._isWithContent()&&this._isEnabled))return;const t=EventHandler.trigger(this._element,this.constructor.eventName(EVENT_SHOW$2)),r=(findShadowRoot(this._element)||this._element.ownerDocument.documentElement).contains(this._element);if(t.defaultPrevented||!r)return;this._disposePopper();const i=this._getTipElement();this._element.setAttribute("aria-describedby",i.getAttribute("id"));const{container:a}=this._config;if(this._element.ownerDocument.documentElement.contains(this.tip)||(a.append(i),EventHandler.trigger(this._element,this.constructor.eventName(EVENT_INSERTED))),this._popper=this._createPopper(i),i.classList.add(CLASS_NAME_SHOW$2),"ontouchstart"in document.documentElement)for(const c of[].concat(...document.body.children))EventHandler.on(c,"mouseover",noop);const o=()=>{EventHandler.trigger(this._element,this.constructor.eventName(EVENT_SHOWN$2)),this._isHovered===!1&&this._leave(),this._isHovered=!1};this._queueCallback(o,this.tip,this._isAnimated())}hide(){if(!this._isShown()||EventHandler.trigger(this._element,this.constructor.eventName(EVENT_HIDE$2)).defaultPrevented)return;if(this._getTipElement().classList.remove(CLASS_NAME_SHOW$2),"ontouchstart"in document.documentElement)for(const i of[].concat(...document.body.children))EventHandler.off(i,"mouseover",noop);this._activeTrigger[TRIGGER_CLICK]=!1,this._activeTrigger[TRIGGER_FOCUS]=!1,this._activeTrigger[TRIGGER_HOVER]=!1,this._isHovered=null;const r=()=>{this._isWithActiveTrigger()||(this._isHovered||this._disposePopper(),this._element.removeAttribute("aria-describedby"),EventHandler.trigger(this._element,this.constructor.eventName(EVENT_HIDDEN$2)))};this._queueCallback(r,this.tip,this._isAnimated())}update(){this._popper&&this._popper.update()}_isWithContent(){return!!this._getTitle()}_getTipElement(){return this.tip||(this.tip=this._createTipElement(this._newContent||this._getContentForTemplate())),this.tip}_createTipElement(t){const e=this._getTemplateFactory(t).toHtml();if(!e)return null;e.classList.remove(CLASS_NAME_FADE$2,CLASS_NAME_SHOW$2),e.classList.add(`bs-${this.constructor.NAME}-auto`);const r=getUID(this.constructor.NAME).toString();return e.setAttribute("id",r),this._isAnimated()&&e.classList.add(CLASS_NAME_FADE$2),e}setContent(t){this._newContent=t,this._isShown()&&(this._disposePopper(),this.show())}_getTemplateFactory(t){return this._templateFactory?this._templateFactory.changeContent(t):this._templateFactory=new TemplateFactory({...this._config,content:t,extraClass:this._resolvePossibleFunction(this._config.customClass)}),this._templateFactory}_getContentForTemplate(){return{[SELECTOR_TOOLTIP_INNER]:this._getTitle()}}_getTitle(){return this._resolvePossibleFunction(this._config.title)||this._element.getAttribute("data-bs-original-title")}_initializeOnDelegatedTarget(t){return this.constructor.getOrCreateInstance(t.delegateTarget,this._getDelegateConfig())}_isAnimated(){return this._config.animation||this.tip&&this.tip.classList.contains(CLASS_NAME_FADE$2)}_isShown(){return this.tip&&this.tip.classList.contains(CLASS_NAME_SHOW$2)}_createPopper(t){const e=execute(this._config.placement,[this,t,this._element]),r=AttachmentMap[e.toUpperCase()];return createPopper(this._element,t,this._getPopperConfig(r))}_getOffset(){const{offset:t}=this._config;return typeof t=="string"?t.split(",").map(e=>Number.parseInt(e,10)):typeof t=="function"?e=>t(e,this._element):t}_resolvePossibleFunction(t){return execute(t,[this._element,this._element])}_getPopperConfig(t){const e={placement:t,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:`.${this.constructor.NAME}-arrow`}},{name:"preSetPlacement",enabled:!0,phase:"beforeMain",fn:r=>{this._getTipElement().setAttribute("data-popper-placement",r.state.placement)}}]};return{...e,...execute(this._config.popperConfig,[void 0,e])}}_setListeners(){const t=this._config.trigger.split(" ");for(const e of t)if(e==="click")EventHandler.on(this._element,this.constructor.eventName(EVENT_CLICK$1),this._config.selector,r=>{const i=this._initializeOnDelegatedTarget(r);i._activeTrigger[TRIGGER_CLICK]=!(i._isShown()&&i._activeTrigger[TRIGGER_CLICK]),i.toggle()});else if(e!==TRIGGER_MANUAL){const r=e===TRIGGER_HOVER?this.constructor.eventName(EVENT_MOUSEENTER):this.constructor.eventName(EVENT_FOCUSIN$1),i=e===TRIGGER_HOVER?this.constructor.eventName(EVENT_MOUSELEAVE):this.constructor.eventName(EVENT_FOCUSOUT$1);EventHandler.on(this._element,r,this._config.selector,a=>{const o=this._initializeOnDelegatedTarget(a);o._activeTrigger[a.type==="focusin"?TRIGGER_FOCUS:TRIGGER_HOVER]=!0,o._enter()}),EventHandler.on(this._element,i,this._config.selector,a=>{const o=this._initializeOnDelegatedTarget(a);o._activeTrigger[a.type==="focusout"?TRIGGER_FOCUS:TRIGGER_HOVER]=o._element.contains(a.relatedTarget),o._leave()})}this._hideModalHandler=()=>{this._element&&this.hide()},EventHandler.on(this._element.closest(SELECTOR_MODAL),EVENT_MODAL_HIDE,this._hideModalHandler)}_fixTitle(){const t=this._element.getAttribute("title");t&&(!this._element.getAttribute("aria-label")&&!this._element.textContent.trim()&&this._element.setAttribute("aria-label",t),this._element.setAttribute("data-bs-original-title",t),this._element.removeAttribute("title"))}_enter(){if(this._isShown()||this._isHovered){this._isHovered=!0;return}this._isHovered=!0,this._setTimeout(()=>{this._isHovered&&this.show()},this._config.delay.show)}_leave(){this._isWithActiveTrigger()||(this._isHovered=!1,this._setTimeout(()=>{this._isHovered||this.hide()},this._config.delay.hide))}_setTimeout(t,e){clearTimeout(this._timeout),this._timeout=setTimeout(t,e)}_isWithActiveTrigger(){return Object.values(this._activeTrigger).includes(!0)}_getConfig(t){const e=Manipulator.getDataAttributes(this._element);for(const r of Object.keys(e))DISALLOWED_ATTRIBUTES.has(r)&&delete e[r];return t={...e,...typeof t=="object"&&t?t:{}},t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t.container=t.container===!1?document.body:getElement(t.container),typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),typeof t.title=="number"&&(t.title=t.title.toString()),typeof t.content=="number"&&(t.content=t.content.toString()),t}_getDelegateConfig(){const t={};for(const[e,r]of Object.entries(this._config))this.constructor.Default[e]!==r&&(t[e]=r);return t.selector=!1,t.trigger="manual",t}_disposePopper(){this._popper&&(this._popper.destroy(),this._popper=null),this.tip&&(this.tip.remove(),this.tip=null)}static jQueryInterface(t){return this.each(function(){const e=Tooltip.getOrCreateInstance(this,t);if(typeof t=="string"){if(typeof e[t]>"u")throw new TypeError(`No method named "${t}"`);e[t]()}})}}defineJQueryPlugin(Tooltip);const NAME$3="popover",SELECTOR_TITLE=".popover-header",SELECTOR_CONTENT=".popover-body",Default$2={...Tooltip.Default,content:"",offset:[0,8],placement:"right",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',trigger:"click"},DefaultType$2={...Tooltip.DefaultType,content:"(null|string|element|function)"};class Popover extends Tooltip{static get Default(){return Default$2}static get DefaultType(){return DefaultType$2}static get NAME(){return NAME$3}_isWithContent(){return this._getTitle()||this._getContent()}_getContentForTemplate(){return{[SELECTOR_TITLE]:this._getTitle(),[SELECTOR_CONTENT]:this._getContent()}}_getContent(){return this._resolvePossibleFunction(this._config.content)}static jQueryInterface(t){return this.each(function(){const e=Popover.getOrCreateInstance(this,t);if(typeof t=="string"){if(typeof e[t]>"u")throw new TypeError(`No method named "${t}"`);e[t]()}})}}defineJQueryPlugin(Popover);const NAME$2="scrollspy",DATA_KEY$2="bs.scrollspy",EVENT_KEY$2=`.${DATA_KEY$2}`,DATA_API_KEY=".data-api",EVENT_ACTIVATE=`activate${EVENT_KEY$2}`,EVENT_CLICK=`click${EVENT_KEY$2}`,EVENT_LOAD_DATA_API$1=`load${EVENT_KEY$2}${DATA_API_KEY}`,CLASS_NAME_DROPDOWN_ITEM="dropdown-item",CLASS_NAME_ACTIVE$1="active",SELECTOR_DATA_SPY='[data-bs-spy="scroll"]',SELECTOR_TARGET_LINKS="[href]",SELECTOR_NAV_LIST_GROUP=".nav, .list-group",SELECTOR_NAV_LINKS=".nav-link",SELECTOR_NAV_ITEMS=".nav-item",SELECTOR_LIST_ITEMS=".list-group-item",SELECTOR_LINK_ITEMS=`${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`,SELECTOR_DROPDOWN=".dropdown",SELECTOR_DROPDOWN_TOGGLE$1=".dropdown-toggle",Default$1={offset:null,rootMargin:"0px 0px -25%",smoothScroll:!1,target:null,threshold:[.1,.5,1]},DefaultType$1={offset:"(number|null)",rootMargin:"string",smoothScroll:"boolean",target:"element",threshold:"array"};class ScrollSpy extends BaseComponent{constructor(t,e){super(t,e),this._targetLinks=new Map,this._observableSections=new Map,this._rootElement=getComputedStyle(this._element).overflowY==="visible"?null:this._element,this._activeTarget=null,this._observer=null,this._previousScrollData={visibleEntryTop:0,parentScrollTop:0},this.refresh()}static get Default(){return Default$1}static get DefaultType(){return DefaultType$1}static get NAME(){return NAME$2}refresh(){this._initializeTargetsAndObservables(),this._maybeEnableSmoothScroll(),this._observer?this._observer.disconnect():this._observer=this._getNewObserver();for(const t of this._observableSections.values())this._observer.observe(t)}dispose(){this._observer.disconnect(),super.dispose()}_configAfterMerge(t){return t.target=getElement(t.target)||document.body,t.rootMargin=t.offset?`${t.offset}px 0px -30%`:t.rootMargin,typeof t.threshold=="string"&&(t.threshold=t.threshold.split(",").map(e=>Number.parseFloat(e))),t}_maybeEnableSmoothScroll(){this._config.smoothScroll&&(EventHandler.off(this._config.target,EVENT_CLICK),EventHandler.on(this._config.target,EVENT_CLICK,SELECTOR_TARGET_LINKS,t=>{const e=this._observableSections.get(t.target.hash);if(e){t.preventDefault();const r=this._rootElement||window,i=e.offsetTop-this._element.offsetTop;if(r.scrollTo){r.scrollTo({top:i,behavior:"smooth"});return}r.scrollTop=i}}))}_getNewObserver(){const t={root:this._rootElement,threshold:this._config.threshold,rootMargin:this._config.rootMargin};return new IntersectionObserver(e=>this._observerCallback(e),t)}_observerCallback(t){const e=o=>this._targetLinks.get(`#${o.target.id}`),r=o=>{this._previousScrollData.visibleEntryTop=o.target.offsetTop,this._process(e(o))},i=(this._rootElement||document.documentElement).scrollTop,a=i>=this._previousScrollData.parentScrollTop;this._previousScrollData.parentScrollTop=i;for(const o of t){if(!o.isIntersecting){this._activeTarget=null,this._clearActiveClass(e(o));continue}const c=o.target.offsetTop>=this._previousScrollData.visibleEntryTop;if(a&&c){if(r(o),!i)return;continue}!a&&!c&&r(o)}}_initializeTargetsAndObservables(){this._targetLinks=new Map,this._observableSections=new Map;const t=SelectorEngine.find(SELECTOR_TARGET_LINKS,this._config.target);for(const e of t){if(!e.hash||isDisabled(e))continue;const r=SelectorEngine.findOne(decodeURI(e.hash),this._element);isVisible(r)&&(this._targetLinks.set(decodeURI(e.hash),e),this._observableSections.set(e.hash,r))}}_process(t){this._activeTarget!==t&&(this._clearActiveClass(this._config.target),this._activeTarget=t,t.classList.add(CLASS_NAME_ACTIVE$1),this._activateParents(t),EventHandler.trigger(this._element,EVENT_ACTIVATE,{relatedTarget:t}))}_activateParents(t){if(t.classList.contains(CLASS_NAME_DROPDOWN_ITEM)){SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1,t.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);return}for(const e of SelectorEngine.parents(t,SELECTOR_NAV_LIST_GROUP))for(const r of SelectorEngine.prev(e,SELECTOR_LINK_ITEMS))r.classList.add(CLASS_NAME_ACTIVE$1)}_clearActiveClass(t){t.classList.remove(CLASS_NAME_ACTIVE$1);const e=SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`,t);for(const r of e)r.classList.remove(CLASS_NAME_ACTIVE$1)}static jQueryInterface(t){return this.each(function(){const e=ScrollSpy.getOrCreateInstance(this,t);if(typeof t=="string"){if(e[t]===void 0||t.startsWith("_")||t==="constructor")throw new TypeError(`No method named "${t}"`);e[t]()}})}}EventHandler.on(window,EVENT_LOAD_DATA_API$1,()=>{for(const n of SelectorEngine.find(SELECTOR_DATA_SPY))ScrollSpy.getOrCreateInstance(n)});defineJQueryPlugin(ScrollSpy);const NAME$1="tab",DATA_KEY$1="bs.tab",EVENT_KEY$1=`.${DATA_KEY$1}`,EVENT_HIDE$1=`hide${EVENT_KEY$1}`,EVENT_HIDDEN$1=`hidden${EVENT_KEY$1}`,EVENT_SHOW$1=`show${EVENT_KEY$1}`,EVENT_SHOWN$1=`shown${EVENT_KEY$1}`,EVENT_CLICK_DATA_API=`click${EVENT_KEY$1}`,EVENT_KEYDOWN=`keydown${EVENT_KEY$1}`,EVENT_LOAD_DATA_API=`load${EVENT_KEY$1}`,ARROW_LEFT_KEY="ArrowLeft",ARROW_RIGHT_KEY="ArrowRight",ARROW_UP_KEY="ArrowUp",ARROW_DOWN_KEY="ArrowDown",HOME_KEY="Home",END_KEY="End",CLASS_NAME_ACTIVE="active",CLASS_NAME_FADE$1="fade",CLASS_NAME_SHOW$1="show",CLASS_DROPDOWN="dropdown",SELECTOR_DROPDOWN_TOGGLE=".dropdown-toggle",SELECTOR_DROPDOWN_MENU=".dropdown-menu",NOT_SELECTOR_DROPDOWN_TOGGLE=`:not(${SELECTOR_DROPDOWN_TOGGLE})`,SELECTOR_TAB_PANEL='.list-group, .nav, [role="tablist"]',SELECTOR_OUTER=".nav-item, .list-group-item",SELECTOR_INNER=`.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`,SELECTOR_DATA_TOGGLE='[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',SELECTOR_INNER_ELEM=`${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`,SELECTOR_DATA_TOGGLE_ACTIVE=`.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;class Tab extends BaseComponent{constructor(t){super(t),this._parent=this._element.closest(SELECTOR_TAB_PANEL),this._parent&&(this._setInitialAttributes(this._parent,this._getChildren()),EventHandler.on(this._element,EVENT_KEYDOWN,e=>this._keydown(e)))}static get NAME(){return NAME$1}show(){const t=this._element;if(this._elemIsActive(t))return;const e=this._getActiveElem(),r=e?EventHandler.trigger(e,EVENT_HIDE$1,{relatedTarget:t}):null;EventHandler.trigger(t,EVENT_SHOW$1,{relatedTarget:e}).defaultPrevented||r&&r.defaultPrevented||(this._deactivate(e,t),this._activate(t,e))}_activate(t,e){if(!t)return;t.classList.add(CLASS_NAME_ACTIVE),this._activate(SelectorEngine.getElementFromSelector(t));const r=()=>{if(t.getAttribute("role")!=="tab"){t.classList.add(CLASS_NAME_SHOW$1);return}t.removeAttribute("tabindex"),t.setAttribute("aria-selected",!0),this._toggleDropDown(t,!0),EventHandler.trigger(t,EVENT_SHOWN$1,{relatedTarget:e})};this._queueCallback(r,t,t.classList.contains(CLASS_NAME_FADE$1))}_deactivate(t,e){if(!t)return;t.classList.remove(CLASS_NAME_ACTIVE),t.blur(),this._deactivate(SelectorEngine.getElementFromSelector(t));const r=()=>{if(t.getAttribute("role")!=="tab"){t.classList.remove(CLASS_NAME_SHOW$1);return}t.setAttribute("aria-selected",!1),t.setAttribute("tabindex","-1"),this._toggleDropDown(t,!1),EventHandler.trigger(t,EVENT_HIDDEN$1,{relatedTarget:e})};this._queueCallback(r,t,t.classList.contains(CLASS_NAME_FADE$1))}_keydown(t){if(![ARROW_LEFT_KEY,ARROW_RIGHT_KEY,ARROW_UP_KEY,ARROW_DOWN_KEY,HOME_KEY,END_KEY].includes(t.key))return;t.stopPropagation(),t.preventDefault();const e=this._getChildren().filter(i=>!isDisabled(i));let r;if([HOME_KEY,END_KEY].includes(t.key))r=e[t.key===HOME_KEY?0:e.length-1];else{const i=[ARROW_RIGHT_KEY,ARROW_DOWN_KEY].includes(t.key);r=getNextActiveElement(e,t.target,i,!0)}r&&(r.focus({preventScroll:!0}),Tab.getOrCreateInstance(r).show())}_getChildren(){return SelectorEngine.find(SELECTOR_INNER_ELEM,this._parent)}_getActiveElem(){return this._getChildren().find(t=>this._elemIsActive(t))||null}_setInitialAttributes(t,e){this._setAttributeIfNotExists(t,"role","tablist");for(const r of e)this._setInitialAttributesOnChild(r)}_setInitialAttributesOnChild(t){t=this._getInnerElement(t);const e=this._elemIsActive(t),r=this._getOuterElement(t);t.setAttribute("aria-selected",e),r!==t&&this._setAttributeIfNotExists(r,"role","presentation"),e||t.setAttribute("tabindex","-1"),this._setAttributeIfNotExists(t,"role","tab"),this._setInitialAttributesOnTargetPanel(t)}_setInitialAttributesOnTargetPanel(t){const e=SelectorEngine.getElementFromSelector(t);e&&(this._setAttributeIfNotExists(e,"role","tabpanel"),t.id&&this._setAttributeIfNotExists(e,"aria-labelledby",`${t.id}`))}_toggleDropDown(t,e){const r=this._getOuterElement(t);if(!r.classList.contains(CLASS_DROPDOWN))return;const i=(a,o)=>{const c=SelectorEngine.findOne(a,r);c&&c.classList.toggle(o,e)};i(SELECTOR_DROPDOWN_TOGGLE,CLASS_NAME_ACTIVE),i(SELECTOR_DROPDOWN_MENU,CLASS_NAME_SHOW$1),r.setAttribute("aria-expanded",e)}_setAttributeIfNotExists(t,e,r){t.hasAttribute(e)||t.setAttribute(e,r)}_elemIsActive(t){return t.classList.contains(CLASS_NAME_ACTIVE)}_getInnerElement(t){return t.matches(SELECTOR_INNER_ELEM)?t:SelectorEngine.findOne(SELECTOR_INNER_ELEM,t)}_getOuterElement(t){return t.closest(SELECTOR_OUTER)||t}static jQueryInterface(t){return this.each(function(){const e=Tab.getOrCreateInstance(this);if(typeof t=="string"){if(e[t]===void 0||t.startsWith("_")||t==="constructor")throw new TypeError(`No method named "${t}"`);e[t]()}})}}EventHandler.on(document,EVENT_CLICK_DATA_API,SELECTOR_DATA_TOGGLE,function(n){["A","AREA"].includes(this.tagName)&&n.preventDefault(),!isDisabled(this)&&Tab.getOrCreateInstance(this).show()});EventHandler.on(window,EVENT_LOAD_DATA_API,()=>{for(const n of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE))Tab.getOrCreateInstance(n)});defineJQueryPlugin(Tab);const NAME="toast",DATA_KEY="bs.toast",EVENT_KEY=`.${DATA_KEY}`,EVENT_MOUSEOVER=`mouseover${EVENT_KEY}`,EVENT_MOUSEOUT=`mouseout${EVENT_KEY}`,EVENT_FOCUSIN=`focusin${EVENT_KEY}`,EVENT_FOCUSOUT=`focusout${EVENT_KEY}`,EVENT_HIDE=`hide${EVENT_KEY}`,EVENT_HIDDEN=`hidden${EVENT_KEY}`,EVENT_SHOW=`show${EVENT_KEY}`,EVENT_SHOWN=`shown${EVENT_KEY}`,CLASS_NAME_FADE="fade",CLASS_NAME_HIDE="hide",CLASS_NAME_SHOW="show",CLASS_NAME_SHOWING="showing",DefaultType={animation:"boolean",autohide:"boolean",delay:"number"},Default={animation:!0,autohide:!0,delay:5e3};class Toast extends BaseComponent{constructor(t,e){super(t,e),this._timeout=null,this._hasMouseInteraction=!1,this._hasKeyboardInteraction=!1,this._setListeners()}static get Default(){return Default}static get DefaultType(){return DefaultType}static get NAME(){return NAME}show(){if(EventHandler.trigger(this._element,EVENT_SHOW).defaultPrevented)return;this._clearTimeout(),this._config.animation&&this._element.classList.add(CLASS_NAME_FADE);const e=()=>{this._element.classList.remove(CLASS_NAME_SHOWING),EventHandler.trigger(this._element,EVENT_SHOWN),this._maybeScheduleHide()};this._element.classList.remove(CLASS_NAME_HIDE),reflow(this._element),this._element.classList.add(CLASS_NAME_SHOW,CLASS_NAME_SHOWING),this._queueCallback(e,this._element,this._config.animation)}hide(){if(!this.isShown()||EventHandler.trigger(this._element,EVENT_HIDE).defaultPrevented)return;const e=()=>{this._element.classList.add(CLASS_NAME_HIDE),this._element.classList.remove(CLASS_NAME_SHOWING,CLASS_NAME_SHOW),EventHandler.trigger(this._element,EVENT_HIDDEN)};this._element.classList.add(CLASS_NAME_SHOWING),this._queueCallback(e,this._element,this._config.animation)}dispose(){this._clearTimeout(),this.isShown()&&this._element.classList.remove(CLASS_NAME_SHOW),super.dispose()}isShown(){return this._element.classList.contains(CLASS_NAME_SHOW)}_maybeScheduleHide(){this._config.autohide&&(this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout(()=>{this.hide()},this._config.delay)))}_onInteraction(t,e){switch(t.type){case"mouseover":case"mouseout":{this._hasMouseInteraction=e;break}case"focusin":case"focusout":{this._hasKeyboardInteraction=e;break}}if(e){this._clearTimeout();return}const r=t.relatedTarget;this._element===r||this._element.contains(r)||this._maybeScheduleHide()}_setListeners(){EventHandler.on(this._element,EVENT_MOUSEOVER,t=>this._onInteraction(t,!0)),EventHandler.on(this._element,EVENT_MOUSEOUT,t=>this._onInteraction(t,!1)),EventHandler.on(this._element,EVENT_FOCUSIN,t=>this._onInteraction(t,!0)),EventHandler.on(this._element,EVENT_FOCUSOUT,t=>this._onInteraction(t,!1))}_clearTimeout(){clearTimeout(this._timeout),this._timeout=null}static jQueryInterface(t){return this.each(function(){const e=Toast.getOrCreateInstance(this,t);if(typeof t=="string"){if(typeof e[t]>"u")throw new TypeError(`No method named "${t}"`);e[t](this)}})}}enableDismissTrigger(Toast);defineJQueryPlugin(Toast);const bootstrap=Object.freeze(Object.defineProperty({__proto__:null,Alert,Button,Carousel,Collapse,Dropdown,Modal,Offcanvas,Popover,ScrollSpy,Tab,Toast,Tooltip},Symbol.toStringTag,{value:"Module"}));(function(){const htmx={onLoad:null,process:null,on:null,off:null,trigger:null,ajax:null,find:null,findAll:null,closest:null,values:function(n,t){return getInputValues(n,t||"post").values},remove:null,addClass:null,removeClass:null,toggleClass:null,takeClass:null,swap:null,defineExtension:null,removeExtension:null,logAll:null,logNone:null,logger:null,config:{historyEnabled:!0,historyCacheSize:10,refreshOnHistoryMiss:!1,defaultSwapStyle:"innerHTML",defaultSwapDelay:0,defaultSettleDelay:20,includeIndicatorStyles:!0,indicatorClass:"htmx-indicator",requestClass:"htmx-request",addedClass:"htmx-added",settlingClass:"htmx-settling",swappingClass:"htmx-swapping",allowEval:!0,allowScriptTags:!0,inlineScriptNonce:"",inlineStyleNonce:"",attributesToSettle:["class","style","width","height"],withCredentials:!1,timeout:0,wsReconnectDelay:"full-jitter",wsBinaryType:"blob",disableSelector:"[hx-disable], [data-hx-disable]",scrollBehavior:"instant",defaultFocusScroll:!1,getCacheBusterParam:!1,globalViewTransitions:!1,methodsThatUseUrlParams:["get","delete"],selfRequestsOnly:!0,ignoreTitle:!1,scrollIntoViewOnBoost:!0,triggerSpecsCache:null,disableInheritance:!1,responseHandling:[{code:"204",swap:!1},{code:"[23]..",swap:!0},{code:"[45]..",swap:!1,error:!0}],allowNestedOobSwaps:!0,historyRestoreAsHxRequest:!0,reportValidityOfForms:!1},parseInterval:null,location,_:null,version:"2.0.10"};htmx.onLoad=onLoadHelper,htmx.process=processNode,htmx.on=addEventListenerImpl,htmx.off=removeEventListenerImpl,htmx.trigger=triggerEvent,htmx.ajax=ajaxHelper,htmx.find=find,htmx.findAll=findAll,htmx.closest=closest,htmx.remove=removeElement,htmx.addClass=addClassToElement,htmx.removeClass=removeClassFromElement,htmx.toggleClass=toggleClassOnElement,htmx.takeClass=takeClassForElement,htmx.swap=swap,htmx.defineExtension=defineExtension,htmx.removeExtension=removeExtension,htmx.logAll=logAll,htmx.logNone=logNone,htmx.parseInterval=parseInterval,htmx._=internalEval;const internalAPI={addTriggerHandler,bodyContains,canAccessLocalStorage,findThisElement,filterValues,swap,hasAttribute,getAttributeValue,getClosestAttributeValue,getClosestMatch,getExpressionVars,getHeaders,getInputValues,getInternalData,getSwapSpecification,getTriggerSpecs,getTarget,makeFragment,mergeObjects,makeSettleInfo,oobSwap,querySelectorExt,settleImmediately,shouldCancel,triggerEvent,triggerErrorEvent,withExtensions},VERBS=["get","post","put","delete","patch"],VERB_SELECTOR=VERBS.map(function(n){return"[hx-"+n+"], [data-hx-"+n+"]"}).join(", ");function parseInterval(n){if(n==null)return;let t=NaN;return n.slice(-2)=="ms"?t=parseFloat(n.slice(0,-2)):n.slice(-1)=="s"?t=parseFloat(n.slice(0,-1))*1e3:n.slice(-1)=="m"?t=parseFloat(n.slice(0,-1))*1e3*60:t=parseFloat(n),isNaN(t)?void 0:t}function getRawAttribute(n,t){return n instanceof Element&&n.getAttribute(t)}function hasAttribute(n,t){return!!n.hasAttribute&&(n.hasAttribute(t)||n.hasAttribute("data-"+t))}function getAttributeValue(n,t){return getRawAttribute(n,t)||getRawAttribute(n,"data-"+t)}function parentElt(n){const t=n.parentElement;return!t&&n.parentNode instanceof ShadowRoot?n.parentNode:t}function getDocument(){return document}function getRootNode(n,t){return n.getRootNode?n.getRootNode({composed:t}):getDocument()}function getClosestMatch(n,t){for(;n&&!t(n);)n=parentElt(n);return n||null}function getAttributeValueWithDisinheritance(n,t,e){const r=getAttributeValue(t,e),i=getAttributeValue(t,"hx-disinherit");var a=getAttributeValue(t,"hx-inherit");if(n!==t){if(htmx.config.disableInheritance)return a&&(a==="*"||a.split(" ").indexOf(e)>=0)?r:null;if(i&&(i==="*"||i.split(" ").indexOf(e)>=0))return"unset"}return r}function getClosestAttributeValue(n,t){let e=null;if(getClosestMatch(n,function(r){return!!(e=getAttributeValueWithDisinheritance(n,asElement(r),t))}),e!=="unset")return e}function matches(n,t){return n instanceof Element&&n.matches(t)}function getStartTag(n){const e=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i.exec(n);return e?e[1].toLowerCase():""}function parseHTML(n){return"parseHTMLUnsafe"in Document?Document.parseHTMLUnsafe(n):new DOMParser().parseFromString(n,"text/html")}function takeChildrenFor(n,t){for(;t.childNodes.length>0;)n.append(t.childNodes[0])}function duplicateScript(n){const t=getDocument().createElement("script");return forEach(n.attributes,function(e){t.setAttribute(e.name,e.value)}),t.textContent=n.textContent,t.async=!1,htmx.config.inlineScriptNonce&&(t.nonce=htmx.config.inlineScriptNonce),t}function isJavaScriptScriptNode(n){return n.matches("script")&&(n.type==="text/javascript"||n.type==="module"||n.type==="")}function normalizeScriptTags(n){Array.from(n.querySelectorAll("script")).forEach(t=>{if(isJavaScriptScriptNode(t)){const e=duplicateScript(t),r=t.parentNode;try{r.insertBefore(e,t)}catch(i){logError(i)}finally{t.remove()}}})}function makeFragment(n){const t=n.replace(/<head(\s[^>]*)?>[\s\S]*?<\/head>/i,""),e=getStartTag(t);let r;if(e==="html"){r=new DocumentFragment;const a=parseHTML(n);takeChildrenFor(r,a.body),r.title=a.title}else if(e==="body"){r=new DocumentFragment;const a=parseHTML(t);takeChildrenFor(r,a.body),r.title=a.title}else{const a=parseHTML('<body><template class="internal-htmx-wrapper">'+t+"</template></body>");r=a.querySelector("template").content,r.title=a.title;var i=r.querySelector("title");i&&i.parentNode===r&&(i.remove(),r.title=i.innerText)}return r&&(htmx.config.allowScriptTags?normalizeScriptTags(r):r.querySelectorAll("script").forEach(a=>a.remove())),r}function maybeCall(n){n&&n()}function isType(n,t){return Object.prototype.toString.call(n)==="[object "+t+"]"}function isFunction(n){return typeof n=="function"}function isRawObject(n){return isType(n,"Object")}function getInternalData(n){const t="htmx-internal-data";let e=n[t];return e||(e=n[t]={}),e}function toArray(n){const t=[];if(n)for(let e=0;e<n.length;e++)t.push(n[e]);return t}function forEach(n,t){if(n)for(let e=0;e<n.length;e++)t(n[e])}function isScrolledIntoView(n){const t=n.getBoundingClientRect(),e=t.top,r=t.bottom;return e<window.innerHeight&&r>=0}function bodyContains(n){return n.getRootNode({composed:!0})===document}function splitOnWhitespace(n){return n.trim().split(/\s+/)}function mergeObjects(n,t){for(const e in t)t.hasOwnProperty(e)&&(n[e]=t[e]);return n}function parseJSON(n){try{return JSON.parse(n)}catch(t){return logError(t),null}}function canAccessLocalStorage(){const n="htmx:sessionStorageTest";try{return sessionStorage.setItem(n,n),sessionStorage.removeItem(n),!0}catch{return!1}}function normalizePath(n){try{const t=new URL(n,window.location.href);n=t.pathname+t.search}catch{}return n!="/"&&(n=n.replace(/\/+$/,"")),n}function internalEval(str){return maybeEval(getDocument().body,function(){return eval(str)})}function onLoadHelper(n){return htmx.on("htmx:load",function(e){n(e.detail.elt)})}function logAll(){htmx.logger=function(n,t,e){console&&console.log(t,n,e)}}function logNone(){htmx.logger=null}function find(n,t){return typeof n!="string"?n.querySelector(t):find(getDocument(),n)}function findAll(n,t){return typeof n!="string"?n.querySelectorAll(t):findAll(getDocument(),n)}function getWindow(){return window}function removeElement(n,t){n=resolveTarget(n),t?getWindow().setTimeout(function(){removeElement(n),n=null},t):parentElt(n).removeChild(n)}function asElement(n){return n instanceof Element?n:null}function asHtmlElement(n){return n instanceof HTMLElement?n:null}function asString(n){return typeof n=="string"?n:null}function asParentNode(n){return n instanceof Element||n instanceof Document||n instanceof DocumentFragment?n:null}function addClassToElement(n,t,e){n=asElement(resolveTarget(n)),n&&(e?getWindow().setTimeout(function(){addClassToElement(n,t),n=null},e):n.classList&&n.classList.add(t))}function removeClassFromElement(n,t,e){let r=asElement(resolveTarget(n));r&&(e?getWindow().setTimeout(function(){removeClassFromElement(r,t),r=null},e):r.classList&&(r.classList.remove(t),r.classList.length===0&&r.removeAttribute("class")))}function toggleClassOnElement(n,t){n=resolveTarget(n),n.classList.toggle(t)}function takeClassForElement(n,t){n=resolveTarget(n),forEach(n.parentElement.children,function(e){removeClassFromElement(e,t)}),addClassToElement(asElement(n),t)}function closest(n,t){return n=asElement(resolveTarget(n)),n?n.closest(t):null}function startsWith(n,t){return n.substring(0,t.length)===t}function endsWith(n,t){return n.substring(n.length-t.length)===t}function normalizeSelector(n){const t=n.trim();return startsWith(t,"<")&&endsWith(t,"/>")?t.substring(1,t.length-2):t}function querySelectorAllExt(n,t,e){if(t.indexOf("global ")===0)return querySelectorAllExt(n,t.slice(7),!0);n=resolveTarget(n);const r=[];{let o=0,c=0;for(let u=0;u<t.length;u++){const f=t[u];if(f===","&&o===0){r.push(t.substring(c,u)),c=u+1;continue}f==="<"?o++:f==="/"&&u<t.length-1&&t[u+1]===">"&&o--}c<t.length&&r.push(t.substring(c))}const i=[],a=[];for(;r.length>0;){const o=normalizeSelector(r.shift());let c;o.indexOf("closest ")===0?c=closest(asElement(n),normalizeSelector(o.slice(8))):o.indexOf("find ")===0?c=find(asParentNode(n),normalizeSelector(o.slice(5))):o==="next"||o==="nextElementSibling"?c=asElement(n).nextElementSibling:o.indexOf("next ")===0?c=scanForwardQuery(n,normalizeSelector(o.slice(5)),!!e):o==="previous"||o==="previousElementSibling"?c=asElement(n).previousElementSibling:o.indexOf("previous ")===0?c=scanBackwardsQuery(n,normalizeSelector(o.slice(9)),!!e):o==="document"?c=document:o==="window"?c=window:o==="body"?c=document.body:o==="root"?c=getRootNode(n,!!e):o==="host"?c=n.getRootNode().host:a.push(o),c&&i.push(c)}if(a.length>0){const o=a.join(","),c=asParentNode(getRootNode(n,!!e));i.push(...toArray(c.querySelectorAll(o)))}return i}var scanForwardQuery=function(n,t,e){const r=asParentNode(getRootNode(n,e)).querySelectorAll(t);for(let i=0;i<r.length;i++){const a=r[i];if(a.compareDocumentPosition(n)===Node.DOCUMENT_POSITION_PRECEDING)return a}},scanBackwardsQuery=function(n,t,e){const r=asParentNode(getRootNode(n,e)).querySelectorAll(t);for(let i=r.length-1;i>=0;i--){const a=r[i];if(a.compareDocumentPosition(n)===Node.DOCUMENT_POSITION_FOLLOWING)return a}};function querySelectorExt(n,t){return typeof n!="string"?querySelectorAllExt(n,t)[0]:querySelectorAllExt(getDocument().body,n)[0]}function resolveTarget(n,t){return typeof n=="string"?find(asParentNode(t)||document,n):n}function processEventArgs(n,t,e,r){return isFunction(t)?{target:getDocument().body,event:asString(n),listener:t,options:e}:{target:resolveTarget(n),event:asString(t),listener:e,options:r}}function addEventListenerImpl(n,t,e,r){return ready(function(){const a=processEventArgs(n,t,e,r);a.target.addEventListener(a.event,a.listener,a.options)}),isFunction(t)?t:e}function removeEventListenerImpl(n,t,e){return ready(function(){const r=processEventArgs(n,t,e);r.target.removeEventListener(r.event,r.listener)}),isFunction(t)?t:e}const DUMMY_ELT=getDocument().createElement("output");function findAttributeTargets(n,t){const e=getClosestAttributeValue(n,t);if(e){if(e==="this")return[findThisElement(n,t)];{const r=querySelectorAllExt(n,e);if(/(^|,)(\s*)inherit(\s*)($|,)/.test(e)){const a=asElement(getClosestMatch(n,function(o){return o!==n&&hasAttribute(asElement(o),t)}));a&&r.push(...findAttributeTargets(a,t))}return r.length===0?(logError('The selector "'+e+'" on '+t+" returned no matches!"),[DUMMY_ELT]):r}}}function findThisElement(n,t){return asElement(getClosestMatch(n,function(e){return getAttributeValue(asElement(e),t)!=null}))}function getTarget(n){const t=getClosestAttributeValue(n,"hx-target");return t?t==="this"?findThisElement(n,"hx-target"):querySelectorExt(n,t):getInternalData(n).boosted?getDocument().body:n}function shouldSettleAttribute(n){return htmx.config.attributesToSettle.includes(n)}function cloneAttributes(n,t){forEach(Array.from(n.attributes),function(e){!t.hasAttribute(e.name)&&shouldSettleAttribute(e.name)&&n.removeAttribute(e.name)}),forEach(t.attributes,function(e){shouldSettleAttribute(e.name)&&n.setAttribute(e.name,e.value)})}function isInlineSwap(n,t){const e=getExtensions(t);for(let r=0;r<e.length;r++){const i=e[r];try{if(i.isInlineSwap(n))return!0}catch(a){logError(a)}}return n==="outerHTML"}function oobSwap(n,t,e,r){r=r||getDocument();let i="#"+CSS.escape(getRawAttribute(t,"id")),a="outerHTML";n==="true"||(n.indexOf(":")>0?(a=n.substring(0,n.indexOf(":")),i=n.substring(n.indexOf(":")+1)):a=n),t.removeAttribute("hx-swap-oob"),t.removeAttribute("data-hx-swap-oob");const o=querySelectorAllExt(r,i,!1);return o.length?(forEach(o,function(c){let u;const f=t.cloneNode(!0);u=getDocument().createDocumentFragment(),u.appendChild(f),isInlineSwap(a,c)||(u=asParentNode(f));const h={shouldSwap:!0,target:c,fragment:u};triggerEvent(c,"htmx:oobBeforeSwap",h)&&(c=h.target,h.shouldSwap&&(handlePreservedElements(u),swapWithStyle(a,c,c,u,e),restorePreservedElements()),forEach(e.elts,function(m){triggerEvent(m,"htmx:oobAfterSwap",h)}))}),t.parentNode.removeChild(t)):(t.parentNode.removeChild(t),triggerErrorEvent(getDocument().body,"htmx:oobErrorNoTarget",{content:t,target:i})),n}function restorePreservedElements(){const n=find("#--htmx-preserve-pantry--");if(n){for(const t of[...n.children]){const e=find("#"+t.id);e.parentNode.moveBefore(t,e),e.remove()}n.remove()}}function handlePreservedElements(n){forEach(findAll(n,"[hx-preserve], [data-hx-preserve]"),function(t){const e=getAttributeValue(t,"id"),r=getDocument().getElementById(e);if(r!=null)if(t.moveBefore){let i=find("#--htmx-preserve-pantry--");i==null&&(getDocument().body.insertAdjacentHTML("afterend","<div id='--htmx-preserve-pantry--'></div>"),i=find("#--htmx-preserve-pantry--")),i.moveBefore(r,null)}else t.parentNode.replaceChild(r,t)})}function handleAttributes(n,t,e){forEach(t.querySelectorAll("[id]"),function(r){const i=getRawAttribute(r,"id");if(i&&i.length>0){const a=asParentNode(n),o=a&&a.querySelector(CSS.escape(r.tagName)+"#"+CSS.escape(i));if(o&&o!==a){const c=r.cloneNode();cloneAttributes(r,o),e.tasks.push(function(){cloneAttributes(r,c)})}}})}function makeAjaxLoadTask(n){return function(){removeClassFromElement(n,htmx.config.addedClass),processNode(asElement(n)),processFocus(asParentNode(n)),triggerEvent(n,"htmx:load")}}function processFocus(n){const t="[autofocus]",e=asHtmlElement(matches(n,t)?n:n.querySelector(t));e?.focus()}function insertNodesBefore(n,t,e,r){for(handleAttributes(n,e,r);e.childNodes.length>0;){const i=e.firstChild;addClassToElement(asElement(i),htmx.config.addedClass),n.insertBefore(i,t),i.nodeType!==Node.TEXT_NODE&&i.nodeType!==Node.COMMENT_NODE&&r.tasks.push(makeAjaxLoadTask(i))}}function stringHash(n,t){let e=0;for(;e<n.length;)t=(t<<5)-t+n.charCodeAt(e++)|0;return t}function attributeHash(n){let t=0;for(let e=0;e<n.attributes.length;e++){const r=n.attributes[e];r.value&&(t=stringHash(r.name,t),t=stringHash(r.value,t))}return t}function deInitOnHandlers(n){const t=getInternalData(n);if(t.onHandlers){for(let e=0;e<t.onHandlers.length;e++){const r=t.onHandlers[e];removeEventListenerImpl(n,r.event,r.listener)}delete t.onHandlers}}function deInitNode(n){const t=getInternalData(n);t.timeout&&clearTimeout(t.timeout),t.listenerInfos&&forEach(t.listenerInfos,function(e){e.on&&removeEventListenerImpl(e.on,e.trigger,e.listener)}),deInitOnHandlers(n),forEach(Object.keys(t),function(e){e!=="firstInitCompleted"&&delete t[e]})}function cleanUpElement(n){triggerEvent(n,"htmx:beforeCleanupElement"),deInitNode(n),forEach(n.children,function(t){cleanUpElement(t)})}function swapOuterHTML(n,t,e){if(n.tagName==="BODY")return swapInnerHTML(n,t,e);let r;const i=n.previousSibling,a=parentElt(n);if(a){for(insertNodesBefore(a,n,t,e),i==null?r=a.firstChild:r=i.nextSibling,e.elts=e.elts.filter(function(o){return o!==n});r&&r!==n;)r instanceof Element&&e.elts.push(r),r=r.nextSibling;cleanUpElement(n),n.remove()}}function swapAfterBegin(n,t,e){return insertNodesBefore(n,n.firstChild,t,e)}function swapBeforeBegin(n,t,e){return insertNodesBefore(parentElt(n),n,t,e)}function swapBeforeEnd(n,t,e){return insertNodesBefore(n,null,t,e)}function swapAfterEnd(n,t,e){return insertNodesBefore(parentElt(n),n.nextSibling,t,e)}function swapDelete(n){cleanUpElement(n);const t=parentElt(n);if(t)return t.removeChild(n)}function swapInnerHTML(n,t,e){const r=n.firstChild;if(insertNodesBefore(n,r,t,e),r){for(;r.nextSibling;)cleanUpElement(r.nextSibling),n.removeChild(r.nextSibling);cleanUpElement(r),n.removeChild(r)}}function swapWithStyle(n,t,e,r,i){switch(n){case"none":return;case"outerHTML":swapOuterHTML(e,r,i);return;case"afterbegin":swapAfterBegin(e,r,i);return;case"beforebegin":swapBeforeBegin(e,r,i);return;case"beforeend":swapBeforeEnd(e,r,i);return;case"afterend":swapAfterEnd(e,r,i);return;case"delete":swapDelete(e);return;default:var a=getExtensions(t);for(let o=0;o<a.length;o++){const c=a[o];try{const u=c.handleSwap(n,e,r,i);if(u){if(Array.isArray(u))for(let f=0;f<u.length;f++){const h=u[f];h.nodeType!==Node.TEXT_NODE&&h.nodeType!==Node.COMMENT_NODE&&i.tasks.push(makeAjaxLoadTask(h))}return}}catch(u){logError(u)}}n==="innerHTML"?swapInnerHTML(e,r,i):swapWithStyle(htmx.config.defaultSwapStyle,t,e,r,i)}}function findAndSwapOobElements(n,t,e){var r=findAll(n,"[hx-swap-oob], [data-hx-swap-oob]");return forEach(r,function(i){if(htmx.config.allowNestedOobSwaps||i.parentElement===null){const a=getAttributeValue(i,"hx-swap-oob");a!=null&&oobSwap(a,i,t,e)}else i.removeAttribute("hx-swap-oob"),i.removeAttribute("data-hx-swap-oob")}),r.length>0}function swap(n,t,e,r){r||(r={});let i=null,a=null,o=function(){maybeCall(r.beforeSwapCallback),n=resolveTarget(n);const f=r.contextElement?getRootNode(r.contextElement,!1):getDocument(),h=document.activeElement;let m={};m={elt:h,start:h?h.selectionStart:null,end:h?h.selectionEnd:null};const E=makeSettleInfo(n);if(e.swapStyle==="textContent")n.textContent=t;else{let y=makeFragment(t);if(E.title=r.title||y.title,r.historyRequest&&(y=y.querySelector("[hx-history-elt],[data-hx-history-elt]")||y),r.selectOOB){const g=r.selectOOB.split(",");for(let A=0;A<g.length;A++){const O=g[A].split(":",2);let N=O[0].trim();N.indexOf("#")===0&&(N=N.substring(1));const D=O[1]||"true",S=y.querySelector("#"+N);S&&oobSwap(D,S,E,f)}}if(findAndSwapOobElements(y,E,f),forEach(findAll(y,"template"),function(g){g.content&&findAndSwapOobElements(g.content,E,f)&&g.remove()}),r.select){const g=getDocument().createDocumentFragment();forEach(y.querySelectorAll(r.select),function(A){g.appendChild(A)}),y=g}handlePreservedElements(y),swapWithStyle(e.swapStyle,r.contextElement,n,y,E),restorePreservedElements()}if(m.elt&&!bodyContains(m.elt)&&getRawAttribute(m.elt,"id")){const y=document.getElementById(getRawAttribute(m.elt,"id")),g={preventScroll:e.focusScroll!==void 0?!e.focusScroll:!htmx.config.defaultFocusScroll};if(y){if(m.start&&y.setSelectionRange)try{y.setSelectionRange(m.start,m.end)}catch{}y.focus(g)}}removeClassFromElement(n,htmx.config.swappingClass),forEach(E.elts,function(y){y.classList&&addClassToElement(y,htmx.config.settlingClass),triggerEvent(y,"htmx:afterSwap",r.eventInfo)}),maybeCall(r.afterSwapCallback),e.ignoreTitle||handleTitle(E.title);const _=function(){if(forEach(E.tasks,function(y){y.call()}),forEach(E.elts,function(y){y.classList&&removeClassFromElement(y,htmx.config.settlingClass),triggerEvent(y,"htmx:afterSettle",r.eventInfo)}),r.anchor){const y=asElement(resolveTarget("#"+r.anchor));y&&y.scrollIntoView({block:"start",behavior:"auto"})}updateScrollState(E.elts,e),maybeCall(r.afterSettleCallback),maybeCall(i)};e.settleDelay>0?getWindow().setTimeout(_,e.settleDelay):_()},c=htmx.config.globalViewTransitions;e.hasOwnProperty("transition")&&(c=e.transition);const u=r.contextElement||getDocument();if(c&&triggerEvent(u,"htmx:beforeTransition",r.eventInfo)&&typeof Promise<"u"&&document.startViewTransition){const f=new Promise(function(m,E){i=m,a=E}),h=o;o=function(){document.startViewTransition(function(){return h(),f})}}try{e?.swapDelay&&e.swapDelay>0?getWindow().setTimeout(o,e.swapDelay):o()}catch(f){throw triggerErrorEvent(u,"htmx:swapError",r.eventInfo),maybeCall(a),f}}function handleTriggerHeader(n,t,e){const r=n.getResponseHeader(t);if(r.indexOf("{")===0){const i=parseJSON(r);for(const a in i)if(i.hasOwnProperty(a)){let o=i[a];isRawObject(o)?e=o.target!==void 0?o.target:e:o={value:o},triggerEvent(e,a,o)}}else{const i=r.split(",");for(let a=0;a<i.length;a++)triggerEvent(e,i[a].trim(),[])}}const WHITESPACE_OR_COMMA=/[\s,]/,SYMBOL_START=/[_$a-zA-Z]/,SYMBOL_CONT=/[_$a-zA-Z0-9]/,STRINGISH_START=['"',"'","/"],NOT_WHITESPACE=/[^\s]/,COMBINED_SELECTOR_START=/[{(]/,COMBINED_SELECTOR_END=/[})]/;function tokenizeString(n){const t=[];let e=0;for(;e<n.length;){if(SYMBOL_START.exec(n.charAt(e))){for(var r=e;SYMBOL_CONT.exec(n.charAt(e+1));)e++;t.push(n.substring(r,e+1))}else if(STRINGISH_START.indexOf(n.charAt(e))!==-1){const i=n.charAt(e);var r=e;for(e++;e<n.length&&n.charAt(e)!==i;)n.charAt(e)==="\\"&&e++,e++;t.push(n.substring(r,e+1))}else{const i=n.charAt(e);t.push(i)}e++}return t}function isPossibleRelativeReference(n,t,e){return SYMBOL_START.exec(n.charAt(0))&&n!=="true"&&n!=="false"&&n!=="this"&&n!==e&&t!=="."}function maybeGenerateConditional(n,t,e){if(t[0]==="["){t.shift();let r=1,i=" return (function("+e+"){ return (",a=null;for(;t.length>0;){const o=t[0];if(o==="]"){if(r--,r===0){a===null&&(i=i+"true"),t.shift(),i+=")})";try{const c=maybeEval(n,function(){return Function(i)()},function(){return!0});return c.source=i,c}catch(c){return triggerErrorEvent(getDocument().body,"htmx:syntax:error",{error:c,source:i}),null}}}else o==="["&&r++;isPossibleRelativeReference(o,a,e)?i+="(("+e+"."+o+") ? ("+e+"."+o+") : (window."+o+"))":i=i+o,a=t.shift()}}}function consumeUntil(n,t){let e="";for(;n.length>0&&!t.test(n[0]);)e+=n.shift();return e}function consumeCSSSelector(n){let t;return n.length>0&&COMBINED_SELECTOR_START.test(n[0])?(n.shift(),t=consumeUntil(n,COMBINED_SELECTOR_END).trim(),n.shift()):t=consumeUntil(n,WHITESPACE_OR_COMMA),t}const INPUT_SELECTOR="input, textarea, select";function parseAndCacheTrigger(n,t,e){const r=[],i=tokenizeString(t);do{consumeUntil(i,NOT_WHITESPACE);const c=i.length,u=consumeUntil(i,/[,\[\s]/);if(u!=="")if(u==="every"){const f={trigger:"every"};consumeUntil(i,NOT_WHITESPACE),f.pollInterval=parseInterval(consumeUntil(i,/[,\[\s]/)),consumeUntil(i,NOT_WHITESPACE);var a=maybeGenerateConditional(n,i,"event");a&&(f.eventFilter=a),r.push(f)}else{const f={trigger:u};var a=maybeGenerateConditional(n,i,"event");for(a&&(f.eventFilter=a),consumeUntil(i,NOT_WHITESPACE);i.length>0&&i[0]!==",";){const m=i.shift();if(m==="changed")f.changed=!0;else if(m==="once")f.once=!0;else if(m==="consume")f.consume=!0;else if(m==="delay"&&i[0]===":")i.shift(),f.delay=parseInterval(consumeUntil(i,WHITESPACE_OR_COMMA));else if(m==="from"&&i[0]===":"){if(i.shift(),COMBINED_SELECTOR_START.test(i[0]))var o=consumeCSSSelector(i);else{var o=consumeUntil(i,WHITESPACE_OR_COMMA);if(o==="closest"||o==="find"||o==="next"||o==="previous"){i.shift();const _=consumeCSSSelector(i);_.length>0&&(o+=" "+_)}}f.from=o}else m==="target"&&i[0]===":"?(i.shift(),f.target=consumeCSSSelector(i)):m==="throttle"&&i[0]===":"?(i.shift(),f.throttle=parseInterval(consumeUntil(i,WHITESPACE_OR_COMMA))):m==="queue"&&i[0]===":"?(i.shift(),f.queue=consumeUntil(i,WHITESPACE_OR_COMMA)):m==="root"&&i[0]===":"?(i.shift(),f[m]=consumeCSSSelector(i)):m==="threshold"&&i[0]===":"?(i.shift(),f[m]=consumeUntil(i,WHITESPACE_OR_COMMA)):triggerErrorEvent(n,"htmx:syntax:error",{token:i.shift()});consumeUntil(i,NOT_WHITESPACE)}r.push(f)}i.length===c&&triggerErrorEvent(n,"htmx:syntax:error",{token:i.shift()}),consumeUntil(i,NOT_WHITESPACE)}while(i[0]===","&&i.shift());return e&&(e[t]=r),r}function getTriggerSpecs(n){const t=getAttributeValue(n,"hx-trigger");let e=[];if(t){const r=htmx.config.triggerSpecsCache;e=r&&r[t]||parseAndCacheTrigger(n,t,r)}return e.length>0?e:matches(n,"form")?[{trigger:"submit"}]:matches(n,'input[type="button"], input[type="submit"]')?[{trigger:"click"}]:matches(n,INPUT_SELECTOR)?[{trigger:"change"}]:[{trigger:"click"}]}function cancelPolling(n){getInternalData(n).cancelled=!0}function processPolling(n,t,e){const r=getInternalData(n);r.timeout=getWindow().setTimeout(function(){bodyContains(n)&&r.cancelled!==!0&&(maybeFilterEvent(e,n,makeEvent("hx:poll:trigger",{triggerSpec:e,target:n}))||t(n),processPolling(n,t,e))},e.pollInterval)}function isLocalLink(n){return location.hostname===n.hostname&&getRawAttribute(n,"href")&&getRawAttribute(n,"href").indexOf("#")!==0}function eltIsDisabled(n){return closest(n,htmx.config.disableSelector)}function boostElement(n,t,e){if(n instanceof HTMLAnchorElement&&isLocalLink(n)&&(n.target===""||n.target==="_self")||n.tagName==="FORM"&&String(getRawAttribute(n,"method")).toLowerCase()!=="dialog"){t.boosted=!0;let r,i;if(n.tagName==="A")r="get",i=getRawAttribute(n,"href");else{const a=getRawAttribute(n,"method");r=a?a.toLowerCase():"get",i=getRawAttribute(n,"action"),(i==null||i==="")&&(i=location.href),r==="get"&&i.includes("?")&&(i=i.replace(/\?[^#]+/,""))}e.forEach(function(a){addEventListener(n,function(o,c){const u=asElement(o);if(eltIsDisabled(u)){cleanUpElement(u);return}issueAjaxRequest(r,i,u,c)},t,a,!0)})}}function shouldCancel(n,t){if(n.type==="submit"&&t.tagName==="FORM")return!0;if(n.type==="click"){const e=t.closest('input[type="submit"], button');if(e&&e.form&&e.type==="submit")return!0;const r=t.closest("a"),i=/^#.+/;if(r&&r.href&&!i.test(r.getAttribute("href")))return!0}return!1}function ignoreBoostedAnchorCtrlClick(n,t){return getInternalData(n).boosted&&n instanceof HTMLAnchorElement&&t.type==="click"&&(t.ctrlKey||t.metaKey)}function maybeFilterEvent(n,t,e){const r=n.eventFilter;if(r)try{return r.call(t,e)!==!0}catch(i){const a=r.source;return triggerErrorEvent(getDocument().body,"htmx:eventFilter:error",{error:i,source:a}),!0}return!1}function addEventListener(n,t,e,r,i){const a=getInternalData(n);let o;r.from?o=querySelectorAllExt(n,r.from):o=[n],r.changed&&("lastValue"in a||(a.lastValue=new WeakMap),o.forEach(function(c){a.lastValue.has(r)||a.lastValue.set(r,new WeakMap),a.lastValue.get(r).set(c,c.value)})),forEach(o,function(c){const u=function(f){if(!bodyContains(n)){c.removeEventListener(r.trigger,u);return}if(ignoreBoostedAnchorCtrlClick(n,f)||((i||shouldCancel(f,c))&&f.preventDefault(),maybeFilterEvent(r,n,f)))return;const h=getInternalData(f);if(h.triggerSpec=r,h.handledFor==null&&(h.handledFor=[]),h.handledFor.indexOf(n)<0){if(h.handledFor.push(n),r.consume&&f.stopPropagation(),r.target&&f.target&&!matches(asElement(f.target),r.target))return;if(r.once){if(a.triggeredOnce)return;a.triggeredOnce=!0}if(r.changed){const m=f.target,E=m.value,_=a.lastValue.get(r);if(_.has(m)&&_.get(m)===E)return;_.set(m,E)}if(a.delayed&&clearTimeout(a.delayed),a.throttle)return;r.throttle>0?a.throttle||(triggerEvent(n,"htmx:trigger"),t(n,f),a.throttle=getWindow().setTimeout(function(){a.throttle=null},r.throttle)):r.delay>0?a.delayed=getWindow().setTimeout(function(){triggerEvent(n,"htmx:trigger"),t(n,f)},r.delay):(triggerEvent(n,"htmx:trigger"),t(n,f))}};e.listenerInfos==null&&(e.listenerInfos=[]),e.listenerInfos.push({trigger:r.trigger,listener:u,on:c}),c.addEventListener(r.trigger,u)})}let windowIsScrolling=!1,scrollHandler=null;function initScrollHandler(){scrollHandler||(scrollHandler=function(){windowIsScrolling=!0},window.addEventListener("scroll",scrollHandler),window.addEventListener("resize",scrollHandler),setInterval(function(){windowIsScrolling&&(windowIsScrolling=!1,forEach(getDocument().querySelectorAll("[hx-trigger*='revealed'],[data-hx-trigger*='revealed']"),function(n){maybeReveal(n)}))},200))}function maybeReveal(n){!hasAttribute(n,"data-hx-revealed")&&isScrolledIntoView(n)&&(n.setAttribute("data-hx-revealed","true"),getInternalData(n).initHash?triggerEvent(n,"revealed"):n.addEventListener("htmx:afterProcessNode",function(){triggerEvent(n,"revealed")},{once:!0}))}function loadImmediately(n,t,e,r){const i=function(){e.loaded||(e.loaded=!0,triggerEvent(n,"htmx:trigger"),t(n))};r>0?getWindow().setTimeout(i,r):i()}function processVerbs(n,t,e){let r=!1;return forEach(VERBS,function(i){if(hasAttribute(n,"hx-"+i)){const a=getAttributeValue(n,"hx-"+i);r=!0,t.path=a,t.verb=i,e.forEach(function(o){addTriggerHandler(n,o,t,function(c,u){const f=asElement(c);if(eltIsDisabled(f)){cleanUpElement(f);return}issueAjaxRequest(i,a,f,u)})})}}),r}function addTriggerHandler(n,t,e,r){if(t.trigger==="revealed")initScrollHandler(),addEventListener(n,r,e,t),maybeReveal(asElement(n));else if(t.trigger==="intersect"){const i={};t.root&&(i.root=querySelectorExt(n,t.root)),t.threshold&&(i.threshold=parseFloat(t.threshold)),new IntersectionObserver(function(o){for(let c=0;c<o.length;c++)if(o[c].isIntersecting){triggerEvent(n,"intersect");break}},i).observe(asElement(n)),addEventListener(asElement(n),r,e,t)}else!e.firstInitCompleted&&t.trigger==="load"?maybeFilterEvent(t,n,makeEvent("load",{elt:n}))||loadImmediately(asElement(n),r,e,t.delay):t.pollInterval>0?(e.polling=!0,processPolling(asElement(n),r,t)):addEventListener(n,r,e,t)}function shouldProcessHxOn(n){const t=asElement(n);if(!t)return!1;const e=t.attributes;for(let r=0;r<e.length;r++){const i=e[r].name;if(startsWith(i,"hx-on:")||startsWith(i,"data-hx-on:")||startsWith(i,"hx-on-")||startsWith(i,"data-hx-on-"))return!0}return!1}const HX_ON_QUERY=new XPathEvaluator().createExpression('.//*[@*[ starts-with(name(), "hx-on:") or starts-with(name(), "data-hx-on:") or starts-with(name(), "hx-on-") or starts-with(name(), "data-hx-on-") ]]');function processHXOnRoot(n,t){shouldProcessHxOn(n)&&t.push(asElement(n));const e=HX_ON_QUERY.evaluate(n);let r=null;for(;r=e.iterateNext();)t.push(asElement(r))}function findHxOnWildcardElements(n){const t=[];if(n instanceof DocumentFragment)for(const e of n.childNodes)processHXOnRoot(e,t);else processHXOnRoot(n,t);return t}function findElementsToProcess(n){if(n.querySelectorAll){const e=", [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost]",r=[];for(const a in extensions){const o=extensions[a];if(o.getSelectors){var t=o.getSelectors();t&&r.push(t)}}return n.querySelectorAll(VERB_SELECTOR+e+", form, [type='submit'], [hx-ext], [data-hx-ext], [hx-trigger], [data-hx-trigger]"+r.flat().map(a=>", "+a).join(""))}else return[]}function maybeSetLastButtonClicked(n){const t=getTargetButton(n.target),e=getRelatedFormData(n);e&&(e.lastButtonClicked=t)}function maybeUnsetLastButtonClicked(n){const t=getRelatedFormData(n);t&&(t.lastButtonClicked=null)}function getTargetButton(n){return closest(asElement(n),"button, input[type='submit']")}function getRelatedForm(n){return n.form||closest(n,"form")}function getRelatedFormData(n){const t=getTargetButton(n.target);if(!t)return;const e=getRelatedForm(t);if(e)return getInternalData(e)}function initButtonTracking(n){n.addEventListener("click",maybeSetLastButtonClicked),n.addEventListener("focusin",maybeSetLastButtonClicked),n.addEventListener("focusout",maybeUnsetLastButtonClicked)}function addHxOnEventHandler(n,t,e){const r=getInternalData(n);Array.isArray(r.onHandlers)||(r.onHandlers=[]);let i;const a=function(o){maybeEval(n,function(){eltIsDisabled(n)||(i||(i=new Function("event",e)),i.call(n,o))})};n.addEventListener(t,a),r.onHandlers.push({event:t,listener:a})}function processHxOnWildcard(n){deInitOnHandlers(n);for(let t=0;t<n.attributes.length;t++){const e=n.attributes[t].name,r=n.attributes[t].value;if(startsWith(e,"hx-on")||startsWith(e,"data-hx-on")){const i=e.indexOf("-on")+3,a=e.slice(i,i+1);if(a==="-"||a===":"){let o=e.slice(i+1);startsWith(o,":")?o="htmx"+o:startsWith(o,"-")?o="htmx:"+o.slice(1):startsWith(o,"htmx-")&&(o="htmx:"+o.slice(5)),addHxOnEventHandler(n,o,r)}}}}function initNode(n){triggerEvent(n,"htmx:beforeProcessNode");const t=getInternalData(n),e=getTriggerSpecs(n);processVerbs(n,t,e)||(getClosestAttributeValue(n,"hx-boost")==="true"?boostElement(n,t,e):hasAttribute(n,"hx-trigger")&&e.forEach(function(i){addTriggerHandler(n,i,t,function(){})})),(n.tagName==="FORM"||getRawAttribute(n,"type")==="submit"&&hasAttribute(n,"form"))&&initButtonTracking(n),t.firstInitCompleted=!0,triggerEvent(n,"htmx:afterProcessNode")}function maybeDeInitAndHash(n){if(!(n instanceof Element))return!1;const t=getInternalData(n),e=attributeHash(n);return t.initHash!==e?(deInitNode(n),t.initHash=e,!0):!1}function processNode(n){if(n=resolveTarget(n),eltIsDisabled(n)){cleanUpElement(n);return}const t=[];maybeDeInitAndHash(n)&&t.push(n),forEach(findElementsToProcess(n),function(e){if(eltIsDisabled(e)){cleanUpElement(e);return}maybeDeInitAndHash(e)&&t.push(e)}),forEach(findHxOnWildcardElements(n),processHxOnWildcard),forEach(t,initNode)}function kebabEventName(n){return n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}function makeEvent(n,t){return new CustomEvent(n,{bubbles:!0,cancelable:!0,composed:!0,detail:t})}function triggerErrorEvent(n,t,e){triggerEvent(n,t,mergeObjects({error:t},e))}function ignoreEventForLogging(n){return n==="htmx:afterProcessNode"}function withExtensions(n,t,e){forEach(getExtensions(n,[],e),function(r){try{t(r)}catch(i){logError(i)}})}function logError(n){console.error(n)}function triggerEvent(n,t,e){n=resolveTarget(n),e==null&&(e={}),e.elt=n;const r=makeEvent(t,e);htmx.logger&&!ignoreEventForLogging(t)&&htmx.logger(n,t,e),e.error&&(logError(e.error+(e.target?", "+e.target:"")),triggerEvent(n,"htmx:error",{errorInfo:e}));let i=n.dispatchEvent(r);const a=kebabEventName(t);if(i&&a!==t){const o=makeEvent(a,r.detail);i=i&&n.dispatchEvent(o)}return withExtensions(asElement(n),function(o){i=i&&o.onEvent(t,r)!==!1&&!r.defaultPrevented}),i}let currentPathForHistory;function setCurrentPathForHistory(n){currentPathForHistory=n,canAccessLocalStorage()&&sessionStorage.setItem("htmx-current-path-for-history",n)}setCurrentPathForHistory(location.pathname+location.search);function getHistoryElement(){return getDocument().querySelector("[hx-history-elt],[data-hx-history-elt]")||getDocument().body}function saveToHistoryCache(n,t){if(!canAccessLocalStorage())return;const e=cleanInnerHtmlForHistory(t),r=getDocument().title,i=window.scrollY;if(htmx.config.historyCacheSize<=0){sessionStorage.removeItem("htmx-history-cache");return}n=normalizePath(n);const a=parseJSON(sessionStorage.getItem("htmx-history-cache"))||[];for(let c=0;c<a.length;c++)if(a[c].url===n){a.splice(c,1);break}const o={url:n,content:e,title:r,scroll:i};for(triggerEvent(getDocument().body,"htmx:historyItemCreated",{item:o,cache:a}),a.push(o);a.length>htmx.config.historyCacheSize;)a.shift();for(;a.length>0;)try{sessionStorage.setItem("htmx-history-cache",JSON.stringify(a));break}catch(c){triggerErrorEvent(getDocument().body,"htmx:historyCacheError",{cause:c,cache:a}),a.shift()}}function getCachedHistory(n){if(!canAccessLocalStorage())return null;n=normalizePath(n);const t=parseJSON(sessionStorage.getItem("htmx-history-cache"))||[];for(let e=0;e<t.length;e++)if(t[e].url===n)return t[e];return null}function cleanInnerHtmlForHistory(n){const t=htmx.config.requestClass,e=n.cloneNode(!0);return forEach(findAll(e,"."+t),function(r){removeClassFromElement(r,t)}),forEach(findAll(e,"[data-disabled-by-htmx]"),function(r){r.removeAttribute("disabled")}),e.innerHTML}function saveCurrentPageToHistory(){const n=getHistoryElement();let t=currentPathForHistory;canAccessLocalStorage()&&(t=sessionStorage.getItem("htmx-current-path-for-history")),t=t||location.pathname+location.search,getDocument().querySelector('[hx-history="false" i],[data-hx-history="false" i]')||(triggerEvent(getDocument().body,"htmx:beforeHistorySave",{path:t,historyElt:n}),saveToHistoryCache(t,n)),htmx.config.historyEnabled&&history.replaceState({htmx:!0},getDocument().title,location.href)}function pushUrlIntoHistory(n){htmx.config.getCacheBusterParam&&(n=n.replace(/org\.htmx\.cache-buster=[^&]*&?/,""),(endsWith(n,"&")||endsWith(n,"?"))&&(n=n.slice(0,-1))),htmx.config.historyEnabled&&history.pushState({htmx:!0},"",n),setCurrentPathForHistory(n)}function replaceUrlInHistory(n){htmx.config.historyEnabled&&history.replaceState({htmx:!0},"",n),setCurrentPathForHistory(n)}function settleImmediately(n){forEach(n,function(t){t.call(void 0)})}function loadHistoryFromServer(n){const t=new XMLHttpRequest,e={swapStyle:"innerHTML",swapDelay:0,settleDelay:0},r={path:n,xhr:t,historyElt:getHistoryElement(),swapSpec:e};t.open("GET",n,!0),htmx.config.historyRestoreAsHxRequest&&t.setRequestHeader("HX-Request","true"),t.setRequestHeader("HX-History-Restore-Request","true"),t.setRequestHeader("HX-Current-URL",location.href),t.onload=function(){this.status>=200&&this.status<400?(r.response=this.response,triggerEvent(getDocument().body,"htmx:historyCacheMissLoad",r),swap(r.historyElt,r.response,e,{contextElement:r.historyElt,historyRequest:!0}),setCurrentPathForHistory(r.path),triggerEvent(getDocument().body,"htmx:historyRestore",{path:n,cacheMiss:!0,serverResponse:r.response})):triggerErrorEvent(getDocument().body,"htmx:historyCacheMissLoadError",r)},triggerEvent(getDocument().body,"htmx:historyCacheMiss",r)&&t.send()}function restoreHistory(n){saveCurrentPageToHistory(),n=n||location.pathname+location.search;const t=getCachedHistory(n);if(t){const e={swapStyle:"innerHTML",swapDelay:0,settleDelay:0,scroll:t.scroll},r={path:n,item:t,historyElt:getHistoryElement(),swapSpec:e};triggerEvent(getDocument().body,"htmx:historyCacheHit",r)&&(swap(r.historyElt,t.content,e,{contextElement:r.historyElt,title:t.title}),setCurrentPathForHistory(r.path),triggerEvent(getDocument().body,"htmx:historyRestore",r))}else htmx.config.refreshOnHistoryMiss?htmx.location.reload(!0):loadHistoryFromServer(n)}function addRequestIndicatorClasses(n){let t=findAttributeTargets(n,"hx-indicator");return t==null&&(t=[n]),forEach(t,function(e){const r=getInternalData(e);r.requestCount=(r.requestCount||0)+1,addClassToElement(e,htmx.config.requestClass)}),t}function disableElements(n){let t=findAttributeTargets(n,"hx-disabled-elt");return t==null&&(t=[]),forEach(t,function(e){const r=getInternalData(e);r.requestCount=(r.requestCount||0)+1,e.hasAttribute("disabled")||(e.setAttribute("disabled",""),e.setAttribute("data-disabled-by-htmx",""))}),t}function removeRequestIndicators(n,t){forEach(n.concat(t),function(e){const r=getInternalData(e);r.requestCount=(r.requestCount||1)-1}),forEach(n,function(e){getInternalData(e).requestCount===0&&removeClassFromElement(e,htmx.config.requestClass)}),forEach(t,function(e){getInternalData(e).requestCount===0&&e.hasAttribute("data-disabled-by-htmx")&&(e.removeAttribute("disabled"),e.removeAttribute("data-disabled-by-htmx"))})}function haveSeenNode(n,t){for(let e=0;e<n.length;e++)if(n[e].isSameNode(t))return!0;return!1}function shouldInclude(n){const t=n;return t.name===""||t.name==null||t.disabled||closest(t,"fieldset[disabled]")||t.type==="button"||t.type==="submit"||t.tagName==="image"||t.tagName==="reset"||t.tagName==="file"?!1:t.type==="checkbox"||t.type==="radio"?t.checked:!0}function addValueToFormData(n,t,e){n!=null&&t!=null&&(Array.isArray(t)?t.forEach(function(r){e.append(n,r)}):e.append(n,t))}function removeValueFromFormData(n,t,e){if(n!=null&&t!=null){let r=e.getAll(n);Array.isArray(t)?r=r.filter(i=>t.indexOf(i)<0):r=r.filter(i=>i!==t),e.delete(n),forEach(r,i=>e.append(n,i))}}function getValueFromInput(n){return n instanceof HTMLSelectElement&&n.multiple?toArray(n.querySelectorAll("option:checked")).map(function(t){return t.value}):n instanceof HTMLInputElement&&n.files?toArray(n.files):n.value}function processInputValue(n,t,e,r,i){if(!(r==null||haveSeenNode(n,r))){if(n.push(r),shouldInclude(r)){const a=getRawAttribute(r,"name");addValueToFormData(a,getValueFromInput(r),t),i&&validateElement(r,e)}r instanceof HTMLFormElement&&(forEach(r.elements,function(a){n.indexOf(a)>=0?removeValueFromFormData(a.name,getValueFromInput(a),t):n.push(a),i&&validateElement(a,e)}),new FormData(r).forEach(function(a,o){a instanceof File&&a.name===""||addValueToFormData(o,a,t)}))}}function validateElement(n,t){const e=n;e.willValidate&&(triggerEvent(e,"htmx:validation:validate"),e.checkValidity()||(triggerEvent(e,"htmx:validation:failed",{message:e.validationMessage,validity:e.validity})&&!t.length&&htmx.config.reportValidityOfForms&&e.reportValidity(),t.push({elt:e,message:e.validationMessage,validity:e.validity})))}function overrideFormData(n,t){for(const e of t.keys())n.delete(e);return t.forEach(function(e,r){n.append(r,e)}),n}function getInputValues(n,t){const e=[],r=new FormData,i=new FormData,a=[],o=getInternalData(n);o.lastButtonClicked&&!bodyContains(o.lastButtonClicked)&&(o.lastButtonClicked=null);let c=n instanceof HTMLFormElement&&n.noValidate!==!0||getAttributeValue(n,"hx-validate")==="true";if(o.lastButtonClicked&&(c=c&&o.lastButtonClicked.formNoValidate!==!0),t!=="get"&&processInputValue(e,i,a,getRelatedForm(n),c),processInputValue(e,r,a,n,c),o.lastButtonClicked||n.tagName==="BUTTON"||n.tagName==="INPUT"&&getRawAttribute(n,"type")==="submit"){const f=o.lastButtonClicked||n,h=getRawAttribute(f,"name");addValueToFormData(h,f.value,i)}const u=findAttributeTargets(n,"hx-include");return forEach(u,function(f){processInputValue(e,r,a,asElement(f),c),matches(f,"form")||forEach(asParentNode(f).querySelectorAll(INPUT_SELECTOR),function(h){processInputValue(e,r,a,h,c)})}),overrideFormData(r,i),{errors:a,formData:r,values:formDataProxy(r)}}function appendParam(n,t,e){n!==""&&(n+="&"),String(e)==="[object Object]"&&(e=JSON.stringify(e));const r=encodeURIComponent(e);return n+=encodeURIComponent(t)+"="+r,n}function urlEncode(n){n=formDataFromObject(n);let t="";return n.forEach(function(e,r){t=appendParam(t,r,e)}),t}function getHeaders(n,t,e){const r={"HX-Request":"true","HX-Trigger":getRawAttribute(n,"id"),"HX-Trigger-Name":getRawAttribute(n,"name"),"HX-Target":getAttributeValue(t,"id"),"HX-Current-URL":location.href};return getValuesForElement(n,"hx-headers",!1,r),e!==void 0&&(r["HX-Prompt"]=e),getInternalData(n).boosted&&(r["HX-Boosted"]="true"),r}function filterValues(n,t){const e=getClosestAttributeValue(t,"hx-params");if(e){if(e==="none")return new FormData;if(e==="*")return n;if(e.indexOf("not ")===0)return forEach(e.slice(4).split(","),function(r){r=r.trim(),n.delete(r)}),n;{const r=new FormData;return forEach(e.split(","),function(i){i=i.trim(),n.has(i)&&n.getAll(i).forEach(function(a){r.append(i,a)})}),r}}else return n}function isAnchorLink(n){return!!getRawAttribute(n,"href")&&getRawAttribute(n,"href").indexOf("#")>=0}function getSwapSpecification(n,t){const e=t||getClosestAttributeValue(n,"hx-swap"),r={swapStyle:getInternalData(n).boosted?"innerHTML":htmx.config.defaultSwapStyle,swapDelay:htmx.config.defaultSwapDelay,settleDelay:htmx.config.defaultSettleDelay};if(htmx.config.scrollIntoViewOnBoost&&getInternalData(n).boosted&&!isAnchorLink(n)&&(r.show="top"),e){const o=splitOnWhitespace(e);if(o.length>0)for(let c=0;c<o.length;c++){const u=o[c];if(u.indexOf("swap:")===0)r.swapDelay=parseInterval(u.slice(5));else if(u.indexOf("settle:")===0)r.settleDelay=parseInterval(u.slice(7));else if(u.indexOf("transition:")===0)r.transition=u.slice(11)==="true";else if(u.indexOf("ignoreTitle:")===0)r.ignoreTitle=u.slice(12)==="true";else if(u.indexOf("scroll:")===0){var i=u.slice(7).split(":");const h=i.pop();var a=i.length>0?i.join(":"):null;r.scroll=h,r.scrollTarget=a}else if(u.indexOf("show:")===0){var i=u.slice(5).split(":");const m=i.pop();var a=i.length>0?i.join(":"):null;r.show=m,r.showTarget=a}else if(u.indexOf("focus-scroll:")===0){const f=u.slice(13);r.focusScroll=f=="true"}else c==0?r.swapStyle=u:logError("Unknown modifier in hx-swap: "+u)}}return r}function usesFormData(n){return getClosestAttributeValue(n,"hx-encoding")==="multipart/form-data"||matches(n,"form")&&getRawAttribute(n,"enctype")==="multipart/form-data"}function encodeParamsForBody(n,t,e){let r=null;return withExtensions(t,function(i){r==null&&(r=i.encodeParameters(n,e,t))}),r??(usesFormData(t)?overrideFormData(new FormData,formDataFromObject(e)):urlEncode(e))}function makeSettleInfo(n){return{tasks:[],elts:[n]}}function updateScrollState(n,t){const e=n[0],r=n[n.length-1];if(t.scroll){var i=null;t.scrollTarget&&(i=asElement(querySelectorExt(e,t.scrollTarget))),t.scroll==="top"&&(e||i)&&(i=i||e,i.scrollTop=0),t.scroll==="bottom"&&(r||i)&&(i=i||r,i.scrollTop=i.scrollHeight),typeof t.scroll=="number"&&getWindow().setTimeout(function(){window.scrollTo(0,t.scroll)},0)}if(t.show){var i=null;if(t.showTarget){let o=t.showTarget;t.showTarget==="window"&&(o="body"),i=asElement(querySelectorExt(e,o))}t.show==="top"&&(e||i)&&(i=i||e,i.scrollIntoView({block:"start",behavior:htmx.config.scrollBehavior})),t.show==="bottom"&&(r||i)&&(i=i||r,i.scrollIntoView({block:"end",behavior:htmx.config.scrollBehavior}))}}function getValuesForElement(n,t,e,r,i){if(r==null&&(r={}),n==null)return r;const a=getAttributeValue(n,t);if(a){let o=a.trim(),c=e;if(o==="unset")return null;o.indexOf("javascript:")===0?(o=o.slice(11),c=!0):o.indexOf("js:")===0&&(o=o.slice(3),c=!0),o.indexOf("{")!==0&&(o="{"+o+"}");let u;c?u=maybeEval(n,function(){return i?Function("event","return ("+o+")").call(n,i):Function("return ("+o+")").call(n)},{}):u=parseJSON(o);for(const f in u)u.hasOwnProperty(f)&&r[f]==null&&(r[f]=u[f])}return getValuesForElement(asElement(parentElt(n)),t,e,r,i)}function maybeEval(n,t,e){return htmx.config.allowEval?t():(triggerErrorEvent(n,"htmx:evalDisallowedError"),e)}function getHXVarsForElement(n,t,e){return getValuesForElement(n,"hx-vars",!0,e,t)}function getHXValsForElement(n,t,e){return getValuesForElement(n,"hx-vals",!1,e,t)}function getExpressionVars(n,t){return mergeObjects(getHXVarsForElement(n,t),getHXValsForElement(n,t))}function safelySetHeaderValue(n,t,e){if(e!==null)try{n.setRequestHeader(t,e)}catch{n.setRequestHeader(t,encodeURIComponent(e)),n.setRequestHeader(t+"-URI-AutoEncoded","true")}}function getPathFromResponse(n){if(n.responseURL)try{const t=new URL(n.responseURL);return t.pathname+t.search}catch{triggerErrorEvent(getDocument().body,"htmx:badResponseUrl",{url:n.responseURL})}}function hasHeader(n,t){return t.test(n.getAllResponseHeaders())}function ajaxHelper(n,t,e){if(n=n.toLowerCase(),e){if(e instanceof Element||typeof e=="string")return issueAjaxRequest(n,t,null,null,{targetOverride:resolveTarget(e)||DUMMY_ELT,returnPromise:!0});{let r=resolveTarget(e.target);return(e.target&&!r||e.source&&!r&&!resolveTarget(e.source))&&(r=DUMMY_ELT),issueAjaxRequest(n,t,resolveTarget(e.source),e.event,{handler:e.handler,headers:e.headers,values:e.values,targetOverride:r,swapOverride:e.swap,select:e.select,returnPromise:!0,push:e.push,replace:e.replace,selectOOB:e.selectOOB})}}else return issueAjaxRequest(n,t,null,null,{returnPromise:!0})}function hierarchyForElt(n){const t=[];for(;n;)t.push(n),n=n.parentElement;return t}function verifyPath(n,t,e){const r=new URL(t,location.protocol!=="about:"?location.href:window.origin),a=(location.protocol!=="about:"?location.origin:window.origin)===r.origin;return htmx.config.selfRequestsOnly&&!a?!1:triggerEvent(n,"htmx:validateUrl",mergeObjects({url:r,sameHost:a},e))}function formDataFromObject(n){if(n instanceof FormData)return n;const t=new FormData;for(const e in n)n.hasOwnProperty(e)&&(n[e]&&typeof n[e].forEach=="function"?n[e].forEach(function(r){t.append(e,r)}):typeof n[e]=="object"&&!(n[e]instanceof Blob)?t.append(e,JSON.stringify(n[e])):t.append(e,n[e]));return t}function formDataArrayProxy(n,t,e){return new Proxy(e,{get:function(r,i){return typeof i=="number"?r[i]:i==="length"?r.length:i==="push"?function(a){r.push(a),n.append(t,a)}:typeof r[i]=="function"?function(){r[i].apply(r,arguments),n.delete(t),r.forEach(function(a){n.append(t,a)})}:r[i]&&r[i].length===1?r[i][0]:r[i]},set:function(r,i,a){return r[i]=a,n.delete(t),r.forEach(function(o){n.append(t,o)}),!0}})}function formDataProxy(n){return new Proxy(n,{get:function(t,e){if(typeof e=="symbol"){const i=Reflect.get(t,e);return typeof i=="function"?function(){return i.apply(n,arguments)}:i}if(e==="toJSON")return()=>Object.fromEntries(n);if(e in t&&typeof t[e]=="function")return function(){return n[e].apply(n,arguments)};const r=n.getAll(e);if(r.length!==0)return r.length===1?r[0]:formDataArrayProxy(t,e,r)},set:function(t,e,r){return typeof e!="string"?!1:(t.delete(e),r&&typeof r.forEach=="function"?r.forEach(function(i){t.append(e,i)}):typeof r=="object"&&!(r instanceof Blob)?t.append(e,JSON.stringify(r)):t.append(e,r),!0)},deleteProperty:function(t,e){return typeof e=="string"&&t.delete(e),!0},ownKeys:function(t){return Reflect.ownKeys(Object.fromEntries(t))},getOwnPropertyDescriptor:function(t,e){return Reflect.getOwnPropertyDescriptor(Object.fromEntries(t),e)}})}function issueAjaxRequest(n,t,e,r,i,a){let o=null,c=null;if(i=i??{},i.returnPromise&&typeof Promise<"u")var u=new Promise(function(M,k){o=M,c=k});e==null&&(e=getDocument().body);const f=i.handler||handleAjaxResponse,h=i.select||null;if(!bodyContains(e))return maybeCall(o),u;const m=i.targetOverride||asElement(getTarget(e));if(m==null||m==DUMMY_ELT)return triggerErrorEvent(e,"htmx:targetError",{target:getClosestAttributeValue(e,"hx-target")}),maybeCall(c),u;let E=getInternalData(e);const _=E.lastButtonClicked;if(_){const M=getRawAttribute(_,"formaction");M!=null&&(t=M);const k=getRawAttribute(_,"formmethod");if(k!=null)if(VERBS.includes(k.toLowerCase()))n=k;else return maybeCall(o),u}const y=getClosestAttributeValue(e,"hx-confirm");if(a===void 0&&triggerEvent(e,"htmx:confirm",{target:m,elt:e,path:t,verb:n,triggeringEvent:r,etc:i,issueRequest:function(Y){return issueAjaxRequest(n,t,e,r,i,!!Y)},question:y})===!1)return maybeCall(o),u;let g=e,A=getClosestAttributeValue(e,"hx-sync"),O=null,N=!1;if(A){const M=A.split(":"),k=M[0].trim();if(k==="this"?g=findThisElement(e,"hx-sync"):g=asElement(querySelectorExt(e,k)),A=(M[1]||"drop").trim(),E=getInternalData(g),A==="drop"&&E.xhr&&E.abortable!==!0)return maybeCall(o),u;if(A==="abort"){if(E.xhr)return maybeCall(o),u;N=!0}else A==="replace"?triggerEvent(g,"htmx:abort"):A.indexOf("queue")===0&&(O=(A.split(" ")[1]||"last").trim())}if(E.xhr)if(E.abortable)triggerEvent(g,"htmx:abort");else{if(O==null){if(r){const M=getInternalData(r);M&&M.triggerSpec&&M.triggerSpec.queue&&(O=M.triggerSpec.queue)}O==null&&(O="last")}return E.queuedRequests==null&&(E.queuedRequests=[]),O==="first"&&E.queuedRequests.length===0?E.queuedRequests.push(function(){issueAjaxRequest(n,t,e,r,i)}):O==="all"?E.queuedRequests.push(function(){issueAjaxRequest(n,t,e,r,i)}):O==="last"&&(E.queuedRequests=[],E.queuedRequests.push(function(){issueAjaxRequest(n,t,e,r,i)})),maybeCall(o),u}const D=new XMLHttpRequest;E.xhr=D,E.abortable=N;const S=function(){E.xhr=null,E.abortable=!1,E.queuedRequests!=null&&E.queuedRequests.length>0&&E.queuedRequests.shift()()},P=getClosestAttributeValue(e,"hx-prompt");if(P){var I=prompt(P);if(I===null||!triggerEvent(e,"htmx:prompt",{prompt:I,target:m}))return maybeCall(o),S(),u}if(y&&!a&&!confirm(y))return maybeCall(o),S(),u;let L=getHeaders(e,m,I);n!=="get"&&!usesFormData(e)&&(L["Content-Type"]="application/x-www-form-urlencoded"),i.headers&&(L=mergeObjects(L,i.headers));const V=getInputValues(e,n);let B=V.errors;const F=V.formData;i.values&&overrideFormData(F,formDataFromObject(i.values));const K=formDataFromObject(getExpressionVars(e,r)),G=overrideFormData(F,K);let H=filterValues(G,e);htmx.config.getCacheBusterParam&&n==="get"&&H.set("org.htmx.cache-buster",getRawAttribute(m,"id")||"true"),(t==null||t==="")&&(t=location.href);const J=getValuesForElement(e,"hx-request"),Z=getInternalData(e).boosted;let z=htmx.config.methodsThatUseUrlParams.indexOf(n)>=0;const U={boosted:Z,useUrlParams:z,formData:H,parameters:formDataProxy(H),unfilteredFormData:G,unfilteredParameters:formDataProxy(G),headers:L,elt:e,target:m,verb:n,errors:B,withCredentials:i.credentials||J.credentials||htmx.config.withCredentials,timeout:i.timeout||J.timeout||htmx.config.timeout,path:t,triggeringEvent:r};if(!triggerEvent(e,"htmx:configRequest",U))return maybeCall(o),S(),u;if(t=U.path,n=U.verb,L=U.headers,H=formDataFromObject(U.parameters),B=U.errors,z=U.useUrlParams,B&&B.length>0)return triggerEvent(e,"htmx:validation:halted",U),maybeCall(o),S(),u;const ie=t.split("#"),ne=ie[0],ae=ie[1];let X=t;if(z&&(X=ne,!H.keys().next().done&&(X.indexOf("?")<0?X+="?":X+="&",X+=urlEncode(H),ae&&(X+="#"+ae))),!verifyPath(e,X,U))return triggerErrorEvent(e,"htmx:invalidPath",U),maybeCall(c),S(),u;if(D.open(n.toUpperCase(),X,!0),D.overrideMimeType("text/html"),D.withCredentials=U.withCredentials,D.timeout=U.timeout,!J.noHeaders){for(const M in L)if(L.hasOwnProperty(M)){const k=L[M];safelySetHeaderValue(D,M,k)}}const W={xhr:D,target:m,requestConfig:U,etc:i,boosted:Z,select:h,pathInfo:{requestPath:t,finalRequestPath:X,responsePath:null,anchor:ae}};if(D.onload=function(){try{const M=hierarchyForElt(e);if(W.pathInfo.responsePath=getPathFromResponse(D),f(e,W),W.keepIndicators!==!0&&removeRequestIndicators(re,ee),triggerEvent(e,"htmx:afterRequest",W),triggerEvent(e,"htmx:afterOnLoad",W),!bodyContains(e)){let k=null;for(;M.length>0&&k==null;){const Y=M.shift();bodyContains(Y)&&(k=Y)}k&&(triggerEvent(k,"htmx:afterRequest",W),triggerEvent(k,"htmx:afterOnLoad",W))}maybeCall(o)}catch(M){throw triggerErrorEvent(e,"htmx:onLoadError",mergeObjects({error:M},W)),M}finally{S()}},D.onerror=function(){removeRequestIndicators(re,ee),triggerErrorEvent(e,"htmx:afterRequest",W),triggerErrorEvent(e,"htmx:sendError",W),maybeCall(c),S()},D.onabort=function(){removeRequestIndicators(re,ee),triggerErrorEvent(e,"htmx:afterRequest",W),triggerErrorEvent(e,"htmx:sendAbort",W),maybeCall(c),S()},D.ontimeout=function(){removeRequestIndicators(re,ee),triggerErrorEvent(e,"htmx:afterRequest",W),triggerErrorEvent(e,"htmx:timeout",W),maybeCall(c),S()},!triggerEvent(e,"htmx:beforeRequest",W))return maybeCall(o),S(),u;var re=addRequestIndicatorClasses(e),ee=disableElements(e);forEach(["loadstart","loadend","progress","abort"],function(M){forEach([D,D.upload],function(k){k.addEventListener(M,function(Y){triggerEvent(e,"htmx:xhr:"+M,{lengthComputable:Y.lengthComputable,loaded:Y.loaded,total:Y.total})})})}),triggerEvent(e,"htmx:beforeSend",W);const Q=z?null:encodeParamsForBody(D,e,H);return D.send(Q),u}function determineHistoryUpdates(n,t){const e=t.xhr;let r=null,i=null;if(hasHeader(e,/HX-Push:/i)?(r=e.getResponseHeader("HX-Push"),i="push"):hasHeader(e,/HX-Push-Url:/i)?(r=e.getResponseHeader("HX-Push-Url"),i="push"):hasHeader(e,/HX-Replace-Url:/i)&&(r=e.getResponseHeader("HX-Replace-Url"),i="replace"),r)return r==="false"?{}:{type:i,path:r};const a=t.pathInfo.finalRequestPath,o=t.pathInfo.responsePath;let c=t.etc.push||getClosestAttributeValue(n,"hx-push-url"),u=t.etc.replace||getClosestAttributeValue(n,"hx-replace-url");c==="false"&&(c=null),u==="false"&&(u=null);const f=getInternalData(n).boosted;let h=null,m=null;return c?(h="push",m=c):u?(h="replace",m=u):f&&(h="push",m=o||a),m?(m==="true"&&(m=o||a),t.pathInfo.anchor&&m.indexOf("#")===-1&&(m=m+"#"+t.pathInfo.anchor),{type:h,path:m}):{}}function codeMatches(n,t){var e=new RegExp(n.code);return e.test(t.toString(10))}function resolveResponseHandling(n){for(var t=0;t<htmx.config.responseHandling.length;t++){var e=htmx.config.responseHandling[t];if(codeMatches(e,n.status))return e}return{swap:!1}}function handleTitle(n){if(n){const t=find("title");t?t.textContent=n:window.document.title=n}}function resolveRetarget(n,t){if(t==="this")return n;const e=asElement(querySelectorExt(n,t));if(e==null)throw triggerErrorEvent(n,"htmx:targetError",{target:t}),new Error(`Invalid re-target ${t}`);return e}function handleAjaxResponse(n,t){const e=t.xhr;let r=t.target;const i=t.etc,a=t.select;if(!triggerEvent(n,"htmx:beforeOnLoad",t))return;if(hasHeader(e,/HX-Trigger:/i)&&handleTriggerHeader(e,"HX-Trigger",n),hasHeader(e,/HX-Location:/i)){let N=e.getResponseHeader("HX-Location");var o={};N.indexOf("{")===0&&(o=parseJSON(N),N=o.path,delete o.path),o.push=o.push??"true",ajaxHelper("get",N,o);return}const c=hasHeader(e,/HX-Refresh:/i)&&e.getResponseHeader("HX-Refresh")==="true";if(hasHeader(e,/HX-Redirect:/i)){t.keepIndicators=!0,htmx.location.href=e.getResponseHeader("HX-Redirect"),c&&htmx.location.reload();return}if(c){t.keepIndicators=!0,htmx.location.reload();return}const u=determineHistoryUpdates(n,t),f=resolveResponseHandling(e),h=f.swap;let m=!!f.error,E=htmx.config.ignoreTitle||f.ignoreTitle,_=f.select;f.target&&(t.target=resolveRetarget(n,f.target));var y=i.swapOverride;y==null&&f.swapOverride&&(y=f.swapOverride),hasHeader(e,/HX-Retarget:/i)&&(t.target=resolveRetarget(n,e.getResponseHeader("HX-Retarget"))),hasHeader(e,/HX-Reswap:/i)&&(y=e.getResponseHeader("HX-Reswap"));var g=e.response,A=mergeObjects({shouldSwap:h,serverResponse:g,isError:m,ignoreTitle:E,selectOverride:_,swapOverride:y},t);if(!(f.event&&!triggerEvent(r,f.event,A))&&triggerEvent(r,"htmx:beforeSwap",A)){if(r=A.target,g=A.serverResponse,m=A.isError,E=A.ignoreTitle,_=A.selectOverride,y=A.swapOverride,t.target=r,t.failed=m,t.successful=!m,A.shouldSwap){e.status===286&&cancelPolling(n),withExtensions(n,function(S){g=S.transformResponse(g,e,n)}),u.type&&saveCurrentPageToHistory();var O=getSwapSpecification(n,y);O.hasOwnProperty("ignoreTitle")||(O.ignoreTitle=E),addClassToElement(r,htmx.config.swappingClass),a&&(_=a),hasHeader(e,/HX-Reselect:/i)&&(_=e.getResponseHeader("HX-Reselect"));const N=i.selectOOB||getClosestAttributeValue(n,"hx-select-oob"),D=getClosestAttributeValue(n,"hx-select");swap(r,g,O,{select:_==="unset"?null:_||D,selectOOB:N,eventInfo:t,anchor:t.pathInfo.anchor,contextElement:n,afterSwapCallback:function(){if(hasHeader(e,/HX-Trigger-After-Swap:/i)){let S=n;bodyContains(n)||(S=getDocument().body),handleTriggerHeader(e,"HX-Trigger-After-Swap",S)}},afterSettleCallback:function(){if(hasHeader(e,/HX-Trigger-After-Settle:/i)){let S=n;bodyContains(n)||(S=getDocument().body),handleTriggerHeader(e,"HX-Trigger-After-Settle",S)}},beforeSwapCallback:function(){u.type&&(triggerEvent(getDocument().body,"htmx:beforeHistoryUpdate",mergeObjects({history:u},t)),u.type==="push"?(pushUrlIntoHistory(u.path),triggerEvent(getDocument().body,"htmx:pushedIntoHistory",{path:u.path})):(replaceUrlInHistory(u.path),triggerEvent(getDocument().body,"htmx:replacedInHistory",{path:u.path})))}})}m&&triggerErrorEvent(n,"htmx:responseError",mergeObjects({error:"Response Status Error Code "+e.status+" from "+t.pathInfo.requestPath},t))}}const extensions={};function extensionBase(){return{init:function(n){return null},getSelectors:function(){return null},onEvent:function(n,t){return!0},transformResponse:function(n,t,e){return n},isInlineSwap:function(n){return!1},handleSwap:function(n,t,e,r){return!1},encodeParameters:function(n,t,e){return null}}}function defineExtension(n,t){t.init&&t.init(internalAPI),extensions[n]=mergeObjects(extensionBase(),t)}function removeExtension(n){delete extensions[n]}function getExtensions(n,t,e){if(t==null&&(t=[]),n==null)return t;e==null&&(e=[]);const r=getAttributeValue(n,"hx-ext");return r&&forEach(r.split(","),function(i){if(i=i.replace(/ /g,""),i.slice(0,7)=="ignore:"){e.push(i.slice(7));return}if(e.indexOf(i)<0){const a=extensions[i];a&&t.indexOf(a)<0&&t.push(a)}}),getExtensions(asElement(parentElt(n)),t,e)}var isReady=!1;getDocument().addEventListener("DOMContentLoaded",function(){isReady=!0});function ready(n){isReady||getDocument().readyState==="complete"?n():getDocument().addEventListener("DOMContentLoaded",n)}function insertIndicatorStyles(){if(htmx.config.includeIndicatorStyles!==!1){const n=htmx.config.inlineStyleNonce?` nonce="${htmx.config.inlineStyleNonce}"`:"",t=htmx.config.indicatorClass,e=htmx.config.requestClass;getDocument().head.insertAdjacentHTML("beforeend",`<style${n}>.${t}{opacity:0;visibility: hidden} .${e} .${t}, .${e}.${t}{opacity:1;visibility: visible;transition: opacity 200ms ease-in}</style>`)}}function getMetaConfig(){const n=getDocument().querySelector('meta[name="htmx-config"]');return n?parseJSON(n.content):null}function mergeMetaConfig(){const n=getMetaConfig();n&&(htmx.config=mergeObjects(htmx.config,n))}return ready(function(){mergeMetaConfig(),insertIndicatorStyles();let n=getDocument().body;processNode(n);const t=getDocument().querySelectorAll("[hx-trigger='restored'],[data-hx-trigger='restored']");n.addEventListener("htmx:abort",function(r){const i=r.detail.elt||r.target,a=getInternalData(i);a&&a.xhr&&a.xhr.abort()});const e=window.onpopstate?window.onpopstate.bind(window):null;window.onpopstate=function(r){r.state&&r.state.htmx?(restoreHistory(),forEach(t,function(i){triggerEvent(i,"htmx:restored",{document:getDocument(),triggerEvent})})):e&&e(r)},getWindow().setTimeout(function(){triggerEvent(n,"htmx:load",{}),n=null},0)}),htmx})();var HOOKS=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],defaults={_disable:[],allowInput:!1,allowInvalidPreload:!1,altFormat:"F j, Y",altInput:!1,altInputClass:"form-control input",animate:typeof window=="object"&&window.navigator.userAgent.indexOf("MSIE")===-1,ariaDateFormat:"F j, Y",autoFillDefaultTime:!0,clickOpens:!0,closeOnSelect:!0,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:!1,enableSeconds:!1,enableTime:!1,errorHandler:function(n){return typeof console<"u"&&console.warn(n)},getWeek:function(n){var t=new Date(n.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var e=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-e.getTime())/864e5-3+(e.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:!1,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:!1,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:!1,showMonths:1,static:!1,time_24hr:!1,weekNumbers:!1,wrap:!1},english={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(n){var t=n%100;if(t>3&&t<21)return"th";switch(t%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:!1},pad=function(n,t){return t===void 0&&(t=2),("000"+n).slice(t*-1)},int=function(n){return n===!0?1:0};function debounce(n,t){var e;return function(){var r=this,i=arguments;clearTimeout(e),e=setTimeout(function(){return n.apply(r,i)},t)}}var arrayify=function(n){return n instanceof Array?n:[n]};function toggleClass(n,t,e){if(e===!0)return n.classList.add(t);n.classList.remove(t)}function createElement(n,t,e){var r=window.document.createElement(n);return t=t||"",e=e||"",r.className=t,e!==void 0&&(r.textContent=e),r}function clearNode(n){for(;n.firstChild;)n.removeChild(n.firstChild)}function findParent(n,t){if(t(n))return n;if(n.parentNode)return findParent(n.parentNode,t)}function createNumberInput(n,t){var e=createElement("div","numInputWrapper"),r=createElement("input","numInput "+n),i=createElement("span","arrowUp"),a=createElement("span","arrowDown");if(navigator.userAgent.indexOf("MSIE 9.0")===-1?r.type="number":(r.type="text",r.pattern="\\d*"),t!==void 0)for(var o in t)r.setAttribute(o,t[o]);return e.appendChild(r),e.appendChild(i),e.appendChild(a),e}function getEventTarget(n){try{if(typeof n.composedPath=="function"){var t=n.composedPath();return t[0]}return n.target}catch{return n.target}}var doNothing=function(){},monthToStr=function(n,t,e){return e.months[t?"shorthand":"longhand"][n]},revFormat={D:doNothing,F:function(n,t,e){n.setMonth(e.months.longhand.indexOf(t))},G:function(n,t){n.setHours((n.getHours()>=12?12:0)+parseFloat(t))},H:function(n,t){n.setHours(parseFloat(t))},J:function(n,t){n.setDate(parseFloat(t))},K:function(n,t,e){n.setHours(n.getHours()%12+12*int(new RegExp(e.amPM[1],"i").test(t)))},M:function(n,t,e){n.setMonth(e.months.shorthand.indexOf(t))},S:function(n,t){n.setSeconds(parseFloat(t))},U:function(n,t){return new Date(parseFloat(t)*1e3)},W:function(n,t,e){var r=parseInt(t),i=new Date(n.getFullYear(),0,2+(r-1)*7,0,0,0,0);return i.setDate(i.getDate()-i.getDay()+e.firstDayOfWeek),i},Y:function(n,t){n.setFullYear(parseFloat(t))},Z:function(n,t){return new Date(t)},d:function(n,t){n.setDate(parseFloat(t))},h:function(n,t){n.setHours((n.getHours()>=12?12:0)+parseFloat(t))},i:function(n,t){n.setMinutes(parseFloat(t))},j:function(n,t){n.setDate(parseFloat(t))},l:doNothing,m:function(n,t){n.setMonth(parseFloat(t)-1)},n:function(n,t){n.setMonth(parseFloat(t)-1)},s:function(n,t){n.setSeconds(parseFloat(t))},u:function(n,t){return new Date(parseFloat(t))},w:doNothing,y:function(n,t){n.setFullYear(2e3+parseFloat(t))}},tokenRegex={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},formats={Z:function(n){return n.toISOString()},D:function(n,t,e){return t.weekdays.shorthand[formats.w(n,t,e)]},F:function(n,t,e){return monthToStr(formats.n(n,t,e)-1,!1,t)},G:function(n,t,e){return pad(formats.h(n,t,e))},H:function(n){return pad(n.getHours())},J:function(n,t){return t.ordinal!==void 0?n.getDate()+t.ordinal(n.getDate()):n.getDate()},K:function(n,t){return t.amPM[int(n.getHours()>11)]},M:function(n,t){return monthToStr(n.getMonth(),!0,t)},S:function(n){return pad(n.getSeconds())},U:function(n){return n.getTime()/1e3},W:function(n,t,e){return e.getWeek(n)},Y:function(n){return pad(n.getFullYear(),4)},d:function(n){return pad(n.getDate())},h:function(n){return n.getHours()%12?n.getHours()%12:12},i:function(n){return pad(n.getMinutes())},j:function(n){return n.getDate()},l:function(n,t){return t.weekdays.longhand[n.getDay()]},m:function(n){return pad(n.getMonth()+1)},n:function(n){return n.getMonth()+1},s:function(n){return n.getSeconds()},u:function(n){return n.getTime()},w:function(n){return n.getDay()},y:function(n){return String(n.getFullYear()).substring(2)}},createDateFormatter=function(n){var t=n.config,e=t===void 0?defaults:t,r=n.l10n,i=r===void 0?english:r,a=n.isMobile,o=a===void 0?!1:a;return function(c,u,f){var h=f||i;return e.formatDate!==void 0&&!o?e.formatDate(c,u,h):u.split("").map(function(m,E,_){return formats[m]&&_[E-1]!=="\\"?formats[m](c,h,e):m!=="\\"?m:""}).join("")}},createDateParser=function(n){var t=n.config,e=t===void 0?defaults:t,r=n.l10n,i=r===void 0?english:r;return function(a,o,c,u){if(!(a!==0&&!a)){var f=u||i,h,m=a;if(a instanceof Date)h=new Date(a.getTime());else if(typeof a!="string"&&a.toFixed!==void 0)h=new Date(a);else if(typeof a=="string"){var E=o||(e||defaults).dateFormat,_=String(a).trim();if(_==="today")h=new Date,c=!0;else if(e&&e.parseDate)h=e.parseDate(a,E);else if(/Z$/.test(_)||/GMT$/.test(_))h=new Date(a);else{for(var y=void 0,g=[],A=0,O=0,N="";A<E.length;A++){var D=E[A],S=D==="\\",P=E[A-1]==="\\"||S;if(tokenRegex[D]&&!P){N+=tokenRegex[D];var I=new RegExp(N).exec(a);I&&(y=!0)&&g[D!=="Y"?"push":"unshift"]({fn:revFormat[D],val:I[++O]})}else S||(N+=".")}h=!e||!e.noCalendar?new Date(new Date().getFullYear(),0,1,0,0,0,0):new Date(new Date().setHours(0,0,0,0)),g.forEach(function(L){var V=L.fn,B=L.val;return h=V(h,B,f)||h}),h=y?h:void 0}}if(!(h instanceof Date&&!isNaN(h.getTime()))){e.errorHandler(new Error("Invalid date provided: "+m));return}return c===!0&&h.setHours(0,0,0,0),h}}};function compareDates(n,t,e){return e===void 0&&(e=!0),e!==!1?new Date(n.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):n.getTime()-t.getTime()}var isBetween=function(n,t,e){return n>Math.min(t,e)&&n<Math.max(t,e)},calculateSecondsSinceMidnight=function(n,t,e){return n*3600+t*60+e},parseSeconds=function(n){var t=Math.floor(n/3600),e=(n-t*3600)/60;return[t,e,n-t*3600-e*60]},duration={DAY:864e5};function getDefaultHours(n){var t=n.defaultHour,e=n.defaultMinute,r=n.defaultSeconds;if(n.minDate!==void 0){var i=n.minDate.getHours(),a=n.minDate.getMinutes(),o=n.minDate.getSeconds();t<i&&(t=i),t===i&&e<a&&(e=a),t===i&&e===a&&r<o&&(r=n.minDate.getSeconds())}if(n.maxDate!==void 0){var c=n.maxDate.getHours(),u=n.maxDate.getMinutes();t=Math.min(t,c),t===c&&(e=Math.min(u,e)),t===c&&e===u&&(r=n.maxDate.getSeconds())}return{hours:t,minutes:e,seconds:r}}typeof Object.assign!="function"&&(Object.assign=function(n){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e];if(!n)throw TypeError("Cannot convert undefined or null to object");for(var r=function(c){c&&Object.keys(c).forEach(function(u){return n[u]=c[u]})},i=0,a=t;i<a.length;i++){var o=a[i];r(o)}return n});var __assign=function(){return __assign=Object.assign||function(n){for(var t,e=1,r=arguments.length;e<r;e++){t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n},__assign.apply(this,arguments)},__spreadArrays=function(){for(var n=0,t=0,e=arguments.length;t<e;t++)n+=arguments[t].length;for(var r=Array(n),i=0,t=0;t<e;t++)for(var a=arguments[t],o=0,c=a.length;o<c;o++,i++)r[i]=a[o];return r},DEBOUNCED_CHANGE_MS=300;function FlatpickrInstance(n,t){var e={config:__assign(__assign({},defaults),flatpickr.defaultConfig),l10n:english};e.parseDate=createDateParser({config:e.config,l10n:e.l10n}),e._handlers=[],e.pluginElements=[],e.loadedPlugins=[],e._bind=g,e._setHoursFromDate=E,e._positionCalendar=he,e.changeMonth=X,e.changeYear=k,e.clear=W,e.close=re,e.onMouseOver=fe,e._createElement=createElement,e.createDay=I,e.destroy=ee,e.isEnabled=Y,e.jumpToDate=N,e.updateValue=le,e.open=Ne,e.redraw=_e,e.set=De,e.setDate=we,e.toggle=Ve;function r(){e.utils={getDaysInMonth:function(s,l){return s===void 0&&(s=e.currentMonth),l===void 0&&(l=e.currentYear),s===1&&(l%4===0&&l%100!==0||l%400===0)?29:e.l10n.daysInMonth[s]}}}function i(){e.element=e.input=n,e.isOpen=!1,Ce(),Te(),ke(),He(),r(),e.isMobile||P(),O(),(e.selectedDates.length||e.config.noCalendar)&&(e.config.enableTime&&E(e.config.noCalendar?e.latestSelectedDateObj:void 0),le(!1)),c();var s=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!e.isMobile&&s&&he(),q("onReady")}function a(){var s;return((s=e.calendarContainer)===null||s===void 0?void 0:s.getRootNode()).activeElement||document.activeElement}function o(s){return s.bind(e)}function c(){var s=e.config;s.weekNumbers===!1&&s.showMonths===1||s.noCalendar!==!0&&window.requestAnimationFrame(function(){if(e.calendarContainer!==void 0&&(e.calendarContainer.style.visibility="hidden",e.calendarContainer.style.display="block"),e.daysContainer!==void 0){var l=(e.days.offsetWidth+1)*s.showMonths;e.daysContainer.style.width=l+"px",e.calendarContainer.style.width=l+(e.weekWrapper!==void 0?e.weekWrapper.offsetWidth:0)+"px",e.calendarContainer.style.removeProperty("visibility"),e.calendarContainer.style.removeProperty("display")}})}function u(s){if(e.selectedDates.length===0){var l=e.config.minDate===void 0||compareDates(new Date,e.config.minDate)>=0?new Date:new Date(e.config.minDate.getTime()),d=getDefaultHours(e.config);l.setHours(d.hours,d.minutes,d.seconds,l.getMilliseconds()),e.selectedDates=[l],e.latestSelectedDateObj=l}s!==void 0&&s.type!=="blur"&&je(s);var p=e._input.value;m(),le(),e._input.value!==p&&e._debouncedChange()}function f(s,l){return s%12+12*int(l===e.l10n.amPM[1])}function h(s){switch(s%24){case 0:case 12:return 12;default:return s%12}}function m(){if(!(e.hourElement===void 0||e.minuteElement===void 0)){var s=(parseInt(e.hourElement.value.slice(-2),10)||0)%24,l=(parseInt(e.minuteElement.value,10)||0)%60,d=e.secondElement!==void 0?(parseInt(e.secondElement.value,10)||0)%60:0;e.amPM!==void 0&&(s=f(s,e.amPM.textContent));var p=e.config.minTime!==void 0||e.config.minDate&&e.minDateHasTime&&e.latestSelectedDateObj&&compareDates(e.latestSelectedDateObj,e.config.minDate,!0)===0,v=e.config.maxTime!==void 0||e.config.maxDate&&e.maxDateHasTime&&e.latestSelectedDateObj&&compareDates(e.latestSelectedDateObj,e.config.maxDate,!0)===0;if(e.config.maxTime!==void 0&&e.config.minTime!==void 0&&e.config.minTime>e.config.maxTime){var b=calculateSecondsSinceMidnight(e.config.minTime.getHours(),e.config.minTime.getMinutes(),e.config.minTime.getSeconds()),x=calculateSecondsSinceMidnight(e.config.maxTime.getHours(),e.config.maxTime.getMinutes(),e.config.maxTime.getSeconds()),T=calculateSecondsSinceMidnight(s,l,d);if(T>x&&T<b){var R=parseSeconds(b);s=R[0],l=R[1],d=R[2]}}else{if(v){var C=e.config.maxTime!==void 0?e.config.maxTime:e.config.maxDate;s=Math.min(s,C.getHours()),s===C.getHours()&&(l=Math.min(l,C.getMinutes())),l===C.getMinutes()&&(d=Math.min(d,C.getSeconds()))}if(p){var w=e.config.minTime!==void 0?e.config.minTime:e.config.minDate;s=Math.max(s,w.getHours()),s===w.getHours()&&l<w.getMinutes()&&(l=w.getMinutes()),l===w.getMinutes()&&(d=Math.max(d,w.getSeconds()))}}_(s,l,d)}}function E(s){var l=s||e.latestSelectedDateObj;l&&l instanceof Date&&_(l.getHours(),l.getMinutes(),l.getSeconds())}function _(s,l,d){e.latestSelectedDateObj!==void 0&&e.latestSelectedDateObj.setHours(s%24,l,d||0,0),!(!e.hourElement||!e.minuteElement||e.isMobile)&&(e.hourElement.value=pad(e.config.time_24hr?s:(12+s)%12+12*int(s%12===0)),e.minuteElement.value=pad(l),e.amPM!==void 0&&(e.amPM.textContent=e.l10n.amPM[int(s>=12)]),e.secondElement!==void 0&&(e.secondElement.value=pad(d)))}function y(s){var l=getEventTarget(s),d=parseInt(l.value)+(s.delta||0);(d/1e3>1||s.key==="Enter"&&!/[^\d]/.test(d.toString()))&&k(d)}function g(s,l,d,p){if(l instanceof Array)return l.forEach(function(v){return g(s,v,d,p)});if(s instanceof Array)return s.forEach(function(v){return g(v,l,d,p)});s.addEventListener(l,d,p),e._handlers.push({remove:function(){return s.removeEventListener(l,d,p)}})}function A(){q("onChange")}function O(){if(e.config.wrap&&["open","close","toggle","clear"].forEach(function(d){Array.prototype.forEach.call(e.element.querySelectorAll("[data-"+d+"]"),function(p){return g(p,"click",e[d])})}),e.isMobile){Fe();return}var s=debounce(Ae,50);if(e._debouncedChange=debounce(A,DEBOUNCED_CHANGE_MS),e.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&g(e.daysContainer,"mouseover",function(d){e.config.mode==="range"&&fe(getEventTarget(d))}),g(e._input,"keydown",de),e.calendarContainer!==void 0&&g(e.calendarContainer,"keydown",de),!e.config.inline&&!e.config.static&&g(window,"resize",s),window.ontouchstart!==void 0?g(window.document,"touchstart",M):g(window.document,"mousedown",M),g(window.document,"focus",M,{capture:!0}),e.config.clickOpens===!0&&(g(e._input,"focus",e.open),g(e._input,"click",e.open)),e.daysContainer!==void 0&&(g(e.monthNav,"click",Ue),g(e.monthNav,["keyup","increment"],y),g(e.daysContainer,"click",ge)),e.timeContainer!==void 0&&e.minuteElement!==void 0&&e.hourElement!==void 0){var l=function(d){return getEventTarget(d).select()};g(e.timeContainer,["increment"],u),g(e.timeContainer,"blur",u,{capture:!0}),g(e.timeContainer,"click",D),g([e.hourElement,e.minuteElement],["focus","click"],l),e.secondElement!==void 0&&g(e.secondElement,"focus",function(){return e.secondElement&&e.secondElement.select()}),e.amPM!==void 0&&g(e.amPM,"click",function(d){u(d)})}e.config.allowInput&&g(e._input,"blur",Oe)}function N(s,l){var d=s!==void 0?e.parseDate(s):e.latestSelectedDateObj||(e.config.minDate&&e.config.minDate>e.now?e.config.minDate:e.config.maxDate&&e.config.maxDate<e.now?e.config.maxDate:e.now),p=e.currentYear,v=e.currentMonth;try{d!==void 0&&(e.currentYear=d.getFullYear(),e.currentMonth=d.getMonth())}catch(b){b.message="Invalid date supplied: "+d,e.config.errorHandler(b)}l&&e.currentYear!==p&&(q("onYearChange"),H()),l&&(e.currentYear!==p||e.currentMonth!==v)&&q("onMonthChange"),e.redraw()}function D(s){var l=getEventTarget(s);~l.className.indexOf("arrow")&&S(s,l.classList.contains("arrowUp")?1:-1)}function S(s,l,d){var p=s&&getEventTarget(s),v=d||p&&p.parentNode&&p.parentNode.firstChild,b=xe("increment");b.delta=l,v&&v.dispatchEvent(b)}function P(){var s=window.document.createDocumentFragment();if(e.calendarContainer=createElement("div","flatpickr-calendar"),e.calendarContainer.tabIndex=-1,!e.config.noCalendar){if(s.appendChild(z()),e.innerContainer=createElement("div","flatpickr-innerContainer"),e.config.weekNumbers){var l=ae(),d=l.weekWrapper,p=l.weekNumbers;e.innerContainer.appendChild(d),e.weekNumbers=p,e.weekWrapper=d}e.rContainer=createElement("div","flatpickr-rContainer"),e.rContainer.appendChild(ie()),e.daysContainer||(e.daysContainer=createElement("div","flatpickr-days"),e.daysContainer.tabIndex=-1),G(),e.rContainer.appendChild(e.daysContainer),e.innerContainer.appendChild(e.rContainer),s.appendChild(e.innerContainer)}e.config.enableTime&&s.appendChild(U()),toggleClass(e.calendarContainer,"rangeMode",e.config.mode==="range"),toggleClass(e.calendarContainer,"animate",e.config.animate===!0),toggleClass(e.calendarContainer,"multiMonth",e.config.showMonths>1),e.calendarContainer.appendChild(s);var v=e.config.appendTo!==void 0&&e.config.appendTo.nodeType!==void 0;if((e.config.inline||e.config.static)&&(e.calendarContainer.classList.add(e.config.inline?"inline":"static"),e.config.inline&&(!v&&e.element.parentNode?e.element.parentNode.insertBefore(e.calendarContainer,e._input.nextSibling):e.config.appendTo!==void 0&&e.config.appendTo.appendChild(e.calendarContainer)),e.config.static)){var b=createElement("div","flatpickr-wrapper");e.element.parentNode&&e.element.parentNode.insertBefore(b,e.element),b.appendChild(e.element),e.altInput&&b.appendChild(e.altInput),b.appendChild(e.calendarContainer)}!e.config.static&&!e.config.inline&&(e.config.appendTo!==void 0?e.config.appendTo:window.document.body).appendChild(e.calendarContainer)}function I(s,l,d,p){var v=Y(l,!0),b=createElement("span",s,l.getDate().toString());return b.dateObj=l,b.$i=p,b.setAttribute("aria-label",e.formatDate(l,e.config.ariaDateFormat)),s.indexOf("hidden")===-1&&compareDates(l,e.now)===0&&(e.todayDateElem=b,b.classList.add("today"),b.setAttribute("aria-current","date")),v?(b.tabIndex=-1,Ie(l)&&(b.classList.add("selected"),e.selectedDateElem=b,e.config.mode==="range"&&(toggleClass(b,"startRange",e.selectedDates[0]&&compareDates(l,e.selectedDates[0],!0)===0),toggleClass(b,"endRange",e.selectedDates[1]&&compareDates(l,e.selectedDates[1],!0)===0),s==="nextMonthDay"&&b.classList.add("inRange")))):b.classList.add("flatpickr-disabled"),e.config.mode==="range"&&Be(l)&&!Ie(l)&&b.classList.add("inRange"),e.weekNumbers&&e.config.showMonths===1&&s!=="prevMonthDay"&&p%7===6&&e.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+e.config.getWeek(l)+"</span>"),q("onDayCreate",b),b}function L(s){s.focus(),e.config.mode==="range"&&fe(s)}function V(s){for(var l=s>0?0:e.config.showMonths-1,d=s>0?e.config.showMonths:-1,p=l;p!=d;p+=s)for(var v=e.daysContainer.children[p],b=s>0?0:v.children.length-1,x=s>0?v.children.length:-1,T=b;T!=x;T+=s){var R=v.children[T];if(R.className.indexOf("hidden")===-1&&Y(R.dateObj))return R}}function B(s,l){for(var d=s.className.indexOf("Month")===-1?s.dateObj.getMonth():e.currentMonth,p=l>0?e.config.showMonths:-1,v=l>0?1:-1,b=d-e.currentMonth;b!=p;b+=v)for(var x=e.daysContainer.children[b],T=d-e.currentMonth===b?s.$i+l:l<0?x.children.length-1:0,R=x.children.length,C=T;C>=0&&C<R&&C!=(l>0?R:-1);C+=v){var w=x.children[C];if(w.className.indexOf("hidden")===-1&&Y(w.dateObj)&&Math.abs(s.$i-C)>=Math.abs(l))return L(w)}e.changeMonth(v),F(V(v),0)}function F(s,l){var d=a(),p=ce(d||document.body),v=s!==void 0?s:p?d:e.selectedDateElem!==void 0&&ce(e.selectedDateElem)?e.selectedDateElem:e.todayDateElem!==void 0&&ce(e.todayDateElem)?e.todayDateElem:V(l>0?1:-1);v===void 0?e._input.focus():p?B(v,l):L(v)}function K(s,l){for(var d=(new Date(s,l,1).getDay()-e.l10n.firstDayOfWeek+7)%7,p=e.utils.getDaysInMonth((l-1+12)%12,s),v=e.utils.getDaysInMonth(l,s),b=window.document.createDocumentFragment(),x=e.config.showMonths>1,T=x?"prevMonthDay hidden":"prevMonthDay",R=x?"nextMonthDay hidden":"nextMonthDay",C=p+1-d,w=0;C<=p;C++,w++)b.appendChild(I("flatpickr-day "+T,new Date(s,l-1,C),C,w));for(C=1;C<=v;C++,w++)b.appendChild(I("flatpickr-day",new Date(s,l,C),C,w));for(var j=v+1;j<=42-d&&(e.config.showMonths===1||w%7!==0);j++,w++)b.appendChild(I("flatpickr-day "+R,new Date(s,l+1,j%v),j,w));var oe=createElement("div","dayContainer");return oe.appendChild(b),oe}function G(){if(e.daysContainer!==void 0){clearNode(e.daysContainer),e.weekNumbers&&clearNode(e.weekNumbers);for(var s=document.createDocumentFragment(),l=0;l<e.config.showMonths;l++){var d=new Date(e.currentYear,e.currentMonth,1);d.setMonth(e.currentMonth+l),s.appendChild(K(d.getFullYear(),d.getMonth()))}e.daysContainer.appendChild(s),e.days=e.daysContainer.firstChild,e.config.mode==="range"&&e.selectedDates.length===1&&fe()}}function H(){if(!(e.config.showMonths>1||e.config.monthSelectorType!=="dropdown")){var s=function(p){return e.config.minDate!==void 0&&e.currentYear===e.config.minDate.getFullYear()&&p<e.config.minDate.getMonth()?!1:!(e.config.maxDate!==void 0&&e.currentYear===e.config.maxDate.getFullYear()&&p>e.config.maxDate.getMonth())};e.monthsDropdownContainer.tabIndex=-1,e.monthsDropdownContainer.innerHTML="";for(var l=0;l<12;l++)if(s(l)){var d=createElement("option","flatpickr-monthDropdown-month");d.value=new Date(e.currentYear,l).getMonth().toString(),d.textContent=monthToStr(l,e.config.shorthandCurrentMonth,e.l10n),d.tabIndex=-1,e.currentMonth===l&&(d.selected=!0),e.monthsDropdownContainer.appendChild(d)}}}function J(){var s=createElement("div","flatpickr-month"),l=window.document.createDocumentFragment(),d;e.config.showMonths>1||e.config.monthSelectorType==="static"?d=createElement("span","cur-month"):(e.monthsDropdownContainer=createElement("select","flatpickr-monthDropdown-months"),e.monthsDropdownContainer.setAttribute("aria-label",e.l10n.monthAriaLabel),g(e.monthsDropdownContainer,"change",function(x){var T=getEventTarget(x),R=parseInt(T.value,10);e.changeMonth(R-e.currentMonth),q("onMonthChange")}),H(),d=e.monthsDropdownContainer);var p=createNumberInput("cur-year",{tabindex:"-1"}),v=p.getElementsByTagName("input")[0];v.setAttribute("aria-label",e.l10n.yearAriaLabel),e.config.minDate&&v.setAttribute("min",e.config.minDate.getFullYear().toString()),e.config.maxDate&&(v.setAttribute("max",e.config.maxDate.getFullYear().toString()),v.disabled=!!e.config.minDate&&e.config.minDate.getFullYear()===e.config.maxDate.getFullYear());var b=createElement("div","flatpickr-current-month");return b.appendChild(d),b.appendChild(p),l.appendChild(b),s.appendChild(l),{container:s,yearElement:v,monthElement:d}}function Z(){clearNode(e.monthNav),e.monthNav.appendChild(e.prevMonthNav),e.config.showMonths&&(e.yearElements=[],e.monthElements=[]);for(var s=e.config.showMonths;s--;){var l=J();e.yearElements.push(l.yearElement),e.monthElements.push(l.monthElement),e.monthNav.appendChild(l.container)}e.monthNav.appendChild(e.nextMonthNav)}function z(){return e.monthNav=createElement("div","flatpickr-months"),e.yearElements=[],e.monthElements=[],e.prevMonthNav=createElement("span","flatpickr-prev-month"),e.prevMonthNav.innerHTML=e.config.prevArrow,e.nextMonthNav=createElement("span","flatpickr-next-month"),e.nextMonthNav.innerHTML=e.config.nextArrow,Z(),Object.defineProperty(e,"_hidePrevMonthArrow",{get:function(){return e.__hidePrevMonthArrow},set:function(s){e.__hidePrevMonthArrow!==s&&(toggleClass(e.prevMonthNav,"flatpickr-disabled",s),e.__hidePrevMonthArrow=s)}}),Object.defineProperty(e,"_hideNextMonthArrow",{get:function(){return e.__hideNextMonthArrow},set:function(s){e.__hideNextMonthArrow!==s&&(toggleClass(e.nextMonthNav,"flatpickr-disabled",s),e.__hideNextMonthArrow=s)}}),e.currentYearElement=e.yearElements[0],$e(),e.monthNav}function U(){e.calendarContainer.classList.add("hasTime"),e.config.noCalendar&&e.calendarContainer.classList.add("noCalendar");var s=getDefaultHours(e.config);e.timeContainer=createElement("div","flatpickr-time"),e.timeContainer.tabIndex=-1;var l=createElement("span","flatpickr-time-separator",":"),d=createNumberInput("flatpickr-hour",{"aria-label":e.l10n.hourAriaLabel});e.hourElement=d.getElementsByTagName("input")[0];var p=createNumberInput("flatpickr-minute",{"aria-label":e.l10n.minuteAriaLabel});if(e.minuteElement=p.getElementsByTagName("input")[0],e.hourElement.tabIndex=e.minuteElement.tabIndex=-1,e.hourElement.value=pad(e.latestSelectedDateObj?e.latestSelectedDateObj.getHours():e.config.time_24hr?s.hours:h(s.hours)),e.minuteElement.value=pad(e.latestSelectedDateObj?e.latestSelectedDateObj.getMinutes():s.minutes),e.hourElement.setAttribute("step",e.config.hourIncrement.toString()),e.minuteElement.setAttribute("step",e.config.minuteIncrement.toString()),e.hourElement.setAttribute("min",e.config.time_24hr?"0":"1"),e.hourElement.setAttribute("max",e.config.time_24hr?"23":"12"),e.hourElement.setAttribute("maxlength","2"),e.minuteElement.setAttribute("min","0"),e.minuteElement.setAttribute("max","59"),e.minuteElement.setAttribute("maxlength","2"),e.timeContainer.appendChild(d),e.timeContainer.appendChild(l),e.timeContainer.appendChild(p),e.config.time_24hr&&e.timeContainer.classList.add("time24hr"),e.config.enableSeconds){e.timeContainer.classList.add("hasSeconds");var v=createNumberInput("flatpickr-second");e.secondElement=v.getElementsByTagName("input")[0],e.secondElement.value=pad(e.latestSelectedDateObj?e.latestSelectedDateObj.getSeconds():s.seconds),e.secondElement.setAttribute("step",e.minuteElement.getAttribute("step")),e.secondElement.setAttribute("min","0"),e.secondElement.setAttribute("max","59"),e.secondElement.setAttribute("maxlength","2"),e.timeContainer.appendChild(createElement("span","flatpickr-time-separator",":")),e.timeContainer.appendChild(v)}return e.config.time_24hr||(e.amPM=createElement("span","flatpickr-am-pm",e.l10n.amPM[int((e.latestSelectedDateObj?e.hourElement.value:e.config.defaultHour)>11)]),e.amPM.title=e.l10n.toggleTitle,e.amPM.tabIndex=-1,e.timeContainer.appendChild(e.amPM)),e.timeContainer}function ie(){e.weekdayContainer?clearNode(e.weekdayContainer):e.weekdayContainer=createElement("div","flatpickr-weekdays");for(var s=e.config.showMonths;s--;){var l=createElement("div","flatpickr-weekdaycontainer");e.weekdayContainer.appendChild(l)}return ne(),e.weekdayContainer}function ne(){if(e.weekdayContainer){var s=e.l10n.firstDayOfWeek,l=__spreadArrays(e.l10n.weekdays.shorthand);s>0&&s<l.length&&(l=__spreadArrays(l.splice(s,l.length),l.splice(0,s)));for(var d=e.config.showMonths;d--;)e.weekdayContainer.children[d].innerHTML=`
      <span class='flatpickr-weekday'>
        `+l.join("</span><span class='flatpickr-weekday'>")+`
      </span>
      `}}function ae(){e.calendarContainer.classList.add("hasWeeks");var s=createElement("div","flatpickr-weekwrapper");s.appendChild(createElement("span","flatpickr-weekday",e.l10n.weekAbbreviation));var l=createElement("div","flatpickr-weeks");return s.appendChild(l),{weekWrapper:s,weekNumbers:l}}function X(s,l){l===void 0&&(l=!0);var d=l?s:s-e.currentMonth;d<0&&e._hidePrevMonthArrow===!0||d>0&&e._hideNextMonthArrow===!0||(e.currentMonth+=d,(e.currentMonth<0||e.currentMonth>11)&&(e.currentYear+=e.currentMonth>11?1:-1,e.currentMonth=(e.currentMonth+12)%12,q("onYearChange"),H()),G(),q("onMonthChange"),$e())}function W(s,l){if(s===void 0&&(s=!0),l===void 0&&(l=!0),e.input.value="",e.altInput!==void 0&&(e.altInput.value=""),e.mobileInput!==void 0&&(e.mobileInput.value=""),e.selectedDates=[],e.latestSelectedDateObj=void 0,l===!0&&(e.currentYear=e._initialDate.getFullYear(),e.currentMonth=e._initialDate.getMonth()),e.config.enableTime===!0){var d=getDefaultHours(e.config),p=d.hours,v=d.minutes,b=d.seconds;_(p,v,b)}e.redraw(),s&&q("onChange")}function re(){e.isOpen=!1,e.isMobile||(e.calendarContainer!==void 0&&e.calendarContainer.classList.remove("open"),e._input!==void 0&&e._input.classList.remove("active")),q("onClose")}function ee(){e.config!==void 0&&q("onDestroy");for(var s=e._handlers.length;s--;)e._handlers[s].remove();if(e._handlers=[],e.mobileInput)e.mobileInput.parentNode&&e.mobileInput.parentNode.removeChild(e.mobileInput),e.mobileInput=void 0;else if(e.calendarContainer&&e.calendarContainer.parentNode)if(e.config.static&&e.calendarContainer.parentNode){var l=e.calendarContainer.parentNode;if(l.lastChild&&l.removeChild(l.lastChild),l.parentNode){for(;l.firstChild;)l.parentNode.insertBefore(l.firstChild,l);l.parentNode.removeChild(l)}}else e.calendarContainer.parentNode.removeChild(e.calendarContainer);e.altInput&&(e.input.type="text",e.altInput.parentNode&&e.altInput.parentNode.removeChild(e.altInput),delete e.altInput),e.input&&(e.input.type=e.input._type,e.input.classList.remove("flatpickr-input"),e.input.removeAttribute("readonly")),["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach(function(d){try{delete e[d]}catch{}})}function Q(s){return e.calendarContainer.contains(s)}function M(s){if(e.isOpen&&!e.config.inline){var l=getEventTarget(s),d=Q(l),p=l===e.input||l===e.altInput||e.element.contains(l)||s.path&&s.path.indexOf&&(~s.path.indexOf(e.input)||~s.path.indexOf(e.altInput)),v=!p&&!d&&!Q(s.relatedTarget),b=!e.config.ignoredFocusElements.some(function(x){return x.contains(l)});v&&b&&(e.config.allowInput&&e.setDate(e._input.value,!1,e.config.altInput?e.config.altFormat:e.config.dateFormat),e.timeContainer!==void 0&&e.minuteElement!==void 0&&e.hourElement!==void 0&&e.input.value!==""&&e.input.value!==void 0&&u(),e.close(),e.config&&e.config.mode==="range"&&e.selectedDates.length===1&&e.clear(!1))}}function k(s){if(!(!s||e.config.minDate&&s<e.config.minDate.getFullYear()||e.config.maxDate&&s>e.config.maxDate.getFullYear())){var l=s,d=e.currentYear!==l;e.currentYear=l||e.currentYear,e.config.maxDate&&e.currentYear===e.config.maxDate.getFullYear()?e.currentMonth=Math.min(e.config.maxDate.getMonth(),e.currentMonth):e.config.minDate&&e.currentYear===e.config.minDate.getFullYear()&&(e.currentMonth=Math.max(e.config.minDate.getMonth(),e.currentMonth)),d&&(e.redraw(),q("onYearChange"),H())}}function Y(s,l){var d;l===void 0&&(l=!0);var p=e.parseDate(s,void 0,l);if(e.config.minDate&&p&&compareDates(p,e.config.minDate,l!==void 0?l:!e.minDateHasTime)<0||e.config.maxDate&&p&&compareDates(p,e.config.maxDate,l!==void 0?l:!e.maxDateHasTime)>0)return!1;if(!e.config.enable&&e.config.disable.length===0)return!0;if(p===void 0)return!1;for(var v=!!e.config.enable,b=(d=e.config.enable)!==null&&d!==void 0?d:e.config.disable,x=0,T=void 0;x<b.length;x++){if(T=b[x],typeof T=="function"&&T(p))return v;if(T instanceof Date&&p!==void 0&&T.getTime()===p.getTime())return v;if(typeof T=="string"){var R=e.parseDate(T,void 0,!0);return R&&R.getTime()===p.getTime()?v:!v}else if(typeof T=="object"&&p!==void 0&&T.from&&T.to&&p.getTime()>=T.from.getTime()&&p.getTime()<=T.to.getTime())return v}return!v}function ce(s){return e.daysContainer!==void 0?s.className.indexOf("hidden")===-1&&s.className.indexOf("flatpickr-disabled")===-1&&e.daysContainer.contains(s):!1}function Oe(s){var l=s.target===e._input,d=e._input.value.trimEnd()!==Le();l&&d&&!(s.relatedTarget&&Q(s.relatedTarget))&&e.setDate(e._input.value,!0,s.target===e.altInput?e.config.altFormat:e.config.dateFormat)}function de(s){var l=getEventTarget(s),d=e.config.wrap?n.contains(l):l===e._input,p=e.config.allowInput,v=e.isOpen&&(!p||!d),b=e.config.inline&&d&&!p;if(s.keyCode===13&&d){if(p)return e.setDate(e._input.value,!0,l===e.altInput?e.config.altFormat:e.config.dateFormat),e.close(),l.blur();e.open()}else if(Q(l)||v||b){var x=!!e.timeContainer&&e.timeContainer.contains(l);switch(s.keyCode){case 13:x?(s.preventDefault(),u(),me()):ge(s);break;case 27:s.preventDefault(),me();break;case 8:case 46:d&&!e.config.allowInput&&(s.preventDefault(),e.clear());break;case 37:case 39:if(!x&&!d){s.preventDefault();var T=a();if(e.daysContainer!==void 0&&(p===!1||T&&ce(T))){var R=s.keyCode===39?1:-1;s.ctrlKey?(s.stopPropagation(),X(R),F(V(1),0)):F(void 0,R)}}else e.hourElement&&e.hourElement.focus();break;case 38:case 40:s.preventDefault();var C=s.keyCode===40?1:-1;e.daysContainer&&l.$i!==void 0||l===e.input||l===e.altInput?s.ctrlKey?(s.stopPropagation(),k(e.currentYear-C),F(V(1),0)):x||F(void 0,C*7):l===e.currentYearElement?k(e.currentYear-C):e.config.enableTime&&(!x&&e.hourElement&&e.hourElement.focus(),u(s),e._debouncedChange());break;case 9:if(x){var w=[e.hourElement,e.minuteElement,e.secondElement,e.amPM].concat(e.pluginElements).filter(function(te){return te}),j=w.indexOf(l);if(j!==-1){var oe=w[j+(s.shiftKey?-1:1)];s.preventDefault(),(oe||e._input).focus()}}else!e.config.noCalendar&&e.daysContainer&&e.daysContainer.contains(l)&&s.shiftKey&&(s.preventDefault(),e._input.focus());break}}if(e.amPM!==void 0&&l===e.amPM)switch(s.key){case e.l10n.amPM[0].charAt(0):case e.l10n.amPM[0].charAt(0).toLowerCase():e.amPM.textContent=e.l10n.amPM[0],m(),le();break;case e.l10n.amPM[1].charAt(0):case e.l10n.amPM[1].charAt(0).toLowerCase():e.amPM.textContent=e.l10n.amPM[1],m(),le();break}(d||Q(l))&&q("onKeyDown",s)}function fe(s,l){if(l===void 0&&(l="flatpickr-day"),!(e.selectedDates.length!==1||s&&(!s.classList.contains(l)||s.classList.contains("flatpickr-disabled")))){for(var d=s?s.dateObj.getTime():e.days.firstElementChild.dateObj.getTime(),p=e.parseDate(e.selectedDates[0],void 0,!0).getTime(),v=Math.min(d,e.selectedDates[0].getTime()),b=Math.max(d,e.selectedDates[0].getTime()),x=!1,T=0,R=0,C=v;C<b;C+=duration.DAY)Y(new Date(C),!0)||(x=x||C>v&&C<b,C<p&&(!T||C>T)?T=C:C>p&&(!R||C<R)&&(R=C));var w=Array.from(e.rContainer.querySelectorAll("*:nth-child(-n+"+e.config.showMonths+") > ."+l));w.forEach(function(j){var oe=j.dateObj,te=oe.getTime(),be=T>0&&te<T||R>0&&te>R;if(be){j.classList.add("notAllowed"),["inRange","startRange","endRange"].forEach(function(Ee){j.classList.remove(Ee)});return}else if(x&&!be)return;["startRange","inRange","endRange","notAllowed"].forEach(function(Ee){j.classList.remove(Ee)}),s!==void 0&&(s.classList.add(d<=e.selectedDates[0].getTime()?"startRange":"endRange"),p<d&&te===p?j.classList.add("startRange"):p>d&&te===p&&j.classList.add("endRange"),te>=T&&(R===0||te<=R)&&isBetween(te,p,d)&&j.classList.add("inRange"))})}}function Ae(){e.isOpen&&!e.config.static&&!e.config.inline&&he()}function Ne(s,l){if(l===void 0&&(l=e._positionElement),e.isMobile===!0){if(s){s.preventDefault();var d=getEventTarget(s);d&&d.blur()}e.mobileInput!==void 0&&(e.mobileInput.focus(),e.mobileInput.click()),q("onOpen");return}else if(e._input.disabled||e.config.inline)return;var p=e.isOpen;e.isOpen=!0,p||(e.calendarContainer.classList.add("open"),e._input.classList.add("active"),q("onOpen"),he(l)),e.config.enableTime===!0&&e.config.noCalendar===!0&&e.config.allowInput===!1&&(s===void 0||!e.timeContainer.contains(s.relatedTarget))&&setTimeout(function(){return e.hourElement.select()},50)}function Se(s){return function(l){var d=e.config["_"+s+"Date"]=e.parseDate(l,e.config.dateFormat),p=e.config["_"+(s==="min"?"max":"min")+"Date"];d!==void 0&&(e[s==="min"?"minDateHasTime":"maxDateHasTime"]=d.getHours()>0||d.getMinutes()>0||d.getSeconds()>0),e.selectedDates&&(e.selectedDates=e.selectedDates.filter(function(v){return Y(v)}),!e.selectedDates.length&&s==="min"&&E(d),le()),e.daysContainer&&(_e(),d!==void 0?e.currentYearElement[s]=d.getFullYear().toString():e.currentYearElement.removeAttribute(s),e.currentYearElement.disabled=!!p&&d!==void 0&&p.getFullYear()===d.getFullYear())}}function Ce(){var s=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],l=__assign(__assign({},JSON.parse(JSON.stringify(n.dataset||{}))),t),d={};e.config.parseDate=l.parseDate,e.config.formatDate=l.formatDate,Object.defineProperty(e.config,"enable",{get:function(){return e.config._enable},set:function(w){e.config._enable=Re(w)}}),Object.defineProperty(e.config,"disable",{get:function(){return e.config._disable},set:function(w){e.config._disable=Re(w)}});var p=l.mode==="time";if(!l.dateFormat&&(l.enableTime||p)){var v=flatpickr.defaultConfig.dateFormat||defaults.dateFormat;d.dateFormat=l.noCalendar||p?"H:i"+(l.enableSeconds?":S":""):v+" H:i"+(l.enableSeconds?":S":"")}if(l.altInput&&(l.enableTime||p)&&!l.altFormat){var b=flatpickr.defaultConfig.altFormat||defaults.altFormat;d.altFormat=l.noCalendar||p?"h:i"+(l.enableSeconds?":S K":" K"):b+(" h:i"+(l.enableSeconds?":S":"")+" K")}Object.defineProperty(e.config,"minDate",{get:function(){return e.config._minDate},set:Se("min")}),Object.defineProperty(e.config,"maxDate",{get:function(){return e.config._maxDate},set:Se("max")});var x=function(w){return function(j){e.config[w==="min"?"_minTime":"_maxTime"]=e.parseDate(j,"H:i:S")}};Object.defineProperty(e.config,"minTime",{get:function(){return e.config._minTime},set:x("min")}),Object.defineProperty(e.config,"maxTime",{get:function(){return e.config._maxTime},set:x("max")}),l.mode==="time"&&(e.config.noCalendar=!0,e.config.enableTime=!0),Object.assign(e.config,d,l);for(var T=0;T<s.length;T++)e.config[s[T]]=e.config[s[T]]===!0||e.config[s[T]]==="true";HOOKS.filter(function(w){return e.config[w]!==void 0}).forEach(function(w){e.config[w]=arrayify(e.config[w]||[]).map(o)}),e.isMobile=!e.config.disableMobile&&!e.config.inline&&e.config.mode==="single"&&!e.config.disable.length&&!e.config.enable&&!e.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(var T=0;T<e.config.plugins.length;T++){var R=e.config.plugins[T](e)||{};for(var C in R)HOOKS.indexOf(C)>-1?e.config[C]=arrayify(R[C]).map(o).concat(e.config[C]):typeof l[C]>"u"&&(e.config[C]=R[C])}l.altInputClass||(e.config.altInputClass=ve().className+" "+e.config.altInputClass),q("onParseConfig")}function ve(){return e.config.wrap?n.querySelector("[data-input]"):n}function Te(){typeof e.config.locale!="object"&&typeof flatpickr.l10ns[e.config.locale]>"u"&&e.config.errorHandler(new Error("flatpickr: invalid locale "+e.config.locale)),e.l10n=__assign(__assign({},flatpickr.l10ns.default),typeof e.config.locale=="object"?e.config.locale:e.config.locale!=="default"?flatpickr.l10ns[e.config.locale]:void 0),tokenRegex.D="("+e.l10n.weekdays.shorthand.join("|")+")",tokenRegex.l="("+e.l10n.weekdays.longhand.join("|")+")",tokenRegex.M="("+e.l10n.months.shorthand.join("|")+")",tokenRegex.F="("+e.l10n.months.longhand.join("|")+")",tokenRegex.K="("+e.l10n.amPM[0]+"|"+e.l10n.amPM[1]+"|"+e.l10n.amPM[0].toLowerCase()+"|"+e.l10n.amPM[1].toLowerCase()+")";var s=__assign(__assign({},t),JSON.parse(JSON.stringify(n.dataset||{})));s.time_24hr===void 0&&flatpickr.defaultConfig.time_24hr===void 0&&(e.config.time_24hr=e.l10n.time_24hr),e.formatDate=createDateFormatter(e),e.parseDate=createDateParser({config:e.config,l10n:e.l10n})}function he(s){if(typeof e.config.position=="function")return void e.config.position(e,s);if(e.calendarContainer!==void 0){q("onPreCalendarPosition");var l=s||e._positionElement,d=Array.prototype.reduce.call(e.calendarContainer.children,(function(Qe,Je){return Qe+Je.offsetHeight}),0),p=e.calendarContainer.offsetWidth,v=e.config.position.split(" "),b=v[0],x=v.length>1?v[1]:null,T=l.getBoundingClientRect(),R=window.innerHeight-T.bottom,C=b==="above"||b!=="below"&&R<d&&T.top>d,w=window.pageYOffset+T.top+(C?-d-2:l.offsetHeight+2);if(toggleClass(e.calendarContainer,"arrowTop",!C),toggleClass(e.calendarContainer,"arrowBottom",C),!e.config.inline){var j=window.pageXOffset+T.left,oe=!1,te=!1;x==="center"?(j-=(p-T.width)/2,oe=!0):x==="right"&&(j-=p-T.width,te=!0),toggleClass(e.calendarContainer,"arrowLeft",!oe&&!te),toggleClass(e.calendarContainer,"arrowCenter",oe),toggleClass(e.calendarContainer,"arrowRight",te);var be=window.document.body.offsetWidth-(window.pageXOffset+T.right),Ee=j+p>window.document.body.offsetWidth,Ye=be+p>window.document.body.offsetWidth;if(toggleClass(e.calendarContainer,"rightMost",Ee),!e.config.static)if(e.calendarContainer.style.top=w+"px",!Ee)e.calendarContainer.style.left=j+"px",e.calendarContainer.style.right="auto";else if(!Ye)e.calendarContainer.style.left="auto",e.calendarContainer.style.right=be+"px";else{var Me=se();if(Me===void 0)return;var We=window.document.body.offsetWidth,qe=Math.max(0,We/2-p/2),Ke=".flatpickr-calendar.centerMost:before",Ge=".flatpickr-calendar.centerMost:after",ze=Me.cssRules.length,Xe="{left:"+T.left+"px;right:auto;}";toggleClass(e.calendarContainer,"rightMost",!1),toggleClass(e.calendarContainer,"centerMost",!0),Me.insertRule(Ke+","+Ge+Xe,ze),e.calendarContainer.style.left=qe+"px",e.calendarContainer.style.right="auto"}}}}function se(){for(var s=null,l=0;l<document.styleSheets.length;l++){var d=document.styleSheets[l];if(d.cssRules){try{d.cssRules}catch{continue}s=d;break}}return s??pe()}function pe(){var s=document.createElement("style");return document.head.appendChild(s),s.sheet}function _e(){e.config.noCalendar||e.isMobile||(H(),$e(),G())}function me(){e._input.focus(),window.navigator.userAgent.indexOf("MSIE")!==-1||navigator.msMaxTouchPoints!==void 0?setTimeout(e.close,0):e.close()}function ge(s){s.preventDefault(),s.stopPropagation();var l=function(w){return w.classList&&w.classList.contains("flatpickr-day")&&!w.classList.contains("flatpickr-disabled")&&!w.classList.contains("notAllowed")},d=findParent(getEventTarget(s),l);if(d!==void 0){var p=d,v=e.latestSelectedDateObj=new Date(p.dateObj.getTime()),b=(v.getMonth()<e.currentMonth||v.getMonth()>e.currentMonth+e.config.showMonths-1)&&e.config.mode!=="range";if(e.selectedDateElem=p,e.config.mode==="single")e.selectedDates=[v];else if(e.config.mode==="multiple"){var x=Ie(v);x?e.selectedDates.splice(parseInt(x),1):e.selectedDates.push(v)}else e.config.mode==="range"&&(e.selectedDates.length===2&&e.clear(!1,!1),e.latestSelectedDateObj=v,e.selectedDates.push(v),compareDates(v,e.selectedDates[0],!0)!==0&&e.selectedDates.sort(function(w,j){return w.getTime()-j.getTime()}));if(m(),b){var T=e.currentYear!==v.getFullYear();e.currentYear=v.getFullYear(),e.currentMonth=v.getMonth(),T&&(q("onYearChange"),H()),q("onMonthChange")}if($e(),G(),le(),!b&&e.config.mode!=="range"&&e.config.showMonths===1?L(p):e.selectedDateElem!==void 0&&e.hourElement===void 0&&e.selectedDateElem&&e.selectedDateElem.focus(),e.hourElement!==void 0&&e.hourElement!==void 0&&e.hourElement.focus(),e.config.closeOnSelect){var R=e.config.mode==="single"&&!e.config.enableTime,C=e.config.mode==="range"&&e.selectedDates.length===2&&!e.config.enableTime;(R||C)&&me()}A()}}var ue={locale:[Te,ne],showMonths:[Z,c,ie],minDate:[N],maxDate:[N],positionElement:[Pe],clickOpens:[function(){e.config.clickOpens===!0?(g(e._input,"focus",e.open),g(e._input,"click",e.open)):(e._input.removeEventListener("focus",e.open),e._input.removeEventListener("click",e.open))}]};function De(s,l){if(s!==null&&typeof s=="object"){Object.assign(e.config,s);for(var d in s)ue[d]!==void 0&&ue[d].forEach(function(p){return p()})}else e.config[s]=l,ue[s]!==void 0?ue[s].forEach(function(p){return p()}):HOOKS.indexOf(s)>-1&&(e.config[s]=arrayify(l));e.redraw(),le(!0)}function ye(s,l){var d=[];if(s instanceof Array)d=s.map(function(p){return e.parseDate(p,l)});else if(s instanceof Date||typeof s=="number")d=[e.parseDate(s,l)];else if(typeof s=="string")switch(e.config.mode){case"single":case"time":d=[e.parseDate(s,l)];break;case"multiple":d=s.split(e.config.conjunction).map(function(p){return e.parseDate(p,l)});break;case"range":d=s.split(e.l10n.rangeSeparator).map(function(p){return e.parseDate(p,l)});break}else e.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(s)));e.selectedDates=e.config.allowInvalidPreload?d:d.filter(function(p){return p instanceof Date&&Y(p,!1)}),e.config.mode==="range"&&e.selectedDates.sort(function(p,v){return p.getTime()-v.getTime()})}function we(s,l,d){if(l===void 0&&(l=!1),d===void 0&&(d=e.config.dateFormat),s!==0&&!s||s instanceof Array&&s.length===0)return e.clear(l);ye(s,d),e.latestSelectedDateObj=e.selectedDates[e.selectedDates.length-1],e.redraw(),N(void 0,l),E(),e.selectedDates.length===0&&e.clear(!1),le(l),l&&q("onChange")}function Re(s){return s.slice().map(function(l){return typeof l=="string"||typeof l=="number"||l instanceof Date?e.parseDate(l,void 0,!0):l&&typeof l=="object"&&l.from&&l.to?{from:e.parseDate(l.from,void 0),to:e.parseDate(l.to,void 0)}:l}).filter(function(l){return l})}function He(){e.selectedDates=[],e.now=e.parseDate(e.config.now)||new Date;var s=e.config.defaultDate||((e.input.nodeName==="INPUT"||e.input.nodeName==="TEXTAREA")&&e.input.placeholder&&e.input.value===e.input.placeholder?null:e.input.value);s&&ye(s,e.config.dateFormat),e._initialDate=e.selectedDates.length>0?e.selectedDates[0]:e.config.minDate&&e.config.minDate.getTime()>e.now.getTime()?e.config.minDate:e.config.maxDate&&e.config.maxDate.getTime()<e.now.getTime()?e.config.maxDate:e.now,e.currentYear=e._initialDate.getFullYear(),e.currentMonth=e._initialDate.getMonth(),e.selectedDates.length>0&&(e.latestSelectedDateObj=e.selectedDates[0]),e.config.minTime!==void 0&&(e.config.minTime=e.parseDate(e.config.minTime,"H:i")),e.config.maxTime!==void 0&&(e.config.maxTime=e.parseDate(e.config.maxTime,"H:i")),e.minDateHasTime=!!e.config.minDate&&(e.config.minDate.getHours()>0||e.config.minDate.getMinutes()>0||e.config.minDate.getSeconds()>0),e.maxDateHasTime=!!e.config.maxDate&&(e.config.maxDate.getHours()>0||e.config.maxDate.getMinutes()>0||e.config.maxDate.getSeconds()>0)}function ke(){if(e.input=ve(),!e.input){e.config.errorHandler(new Error("Invalid input element specified"));return}e.input._type=e.input.type,e.input.type="text",e.input.classList.add("flatpickr-input"),e._input=e.input,e.config.altInput&&(e.altInput=createElement(e.input.nodeName,e.config.altInputClass),e._input=e.altInput,e.altInput.placeholder=e.input.placeholder,e.altInput.disabled=e.input.disabled,e.altInput.required=e.input.required,e.altInput.tabIndex=e.input.tabIndex,e.altInput.type="text",e.input.setAttribute("type","hidden"),!e.config.static&&e.input.parentNode&&e.input.parentNode.insertBefore(e.altInput,e.input.nextSibling)),e.config.allowInput||e._input.setAttribute("readonly","readonly"),Pe()}function Pe(){e._positionElement=e.config.positionElement||e._input}function Fe(){var s=e.config.enableTime?e.config.noCalendar?"time":"datetime-local":"date";e.mobileInput=createElement("input",e.input.className+" flatpickr-mobile"),e.mobileInput.tabIndex=1,e.mobileInput.type=s,e.mobileInput.disabled=e.input.disabled,e.mobileInput.required=e.input.required,e.mobileInput.placeholder=e.input.placeholder,e.mobileFormatStr=s==="datetime-local"?"Y-m-d\\TH:i:S":s==="date"?"Y-m-d":"H:i:S",e.selectedDates.length>0&&(e.mobileInput.defaultValue=e.mobileInput.value=e.formatDate(e.selectedDates[0],e.mobileFormatStr)),e.config.minDate&&(e.mobileInput.min=e.formatDate(e.config.minDate,"Y-m-d")),e.config.maxDate&&(e.mobileInput.max=e.formatDate(e.config.maxDate,"Y-m-d")),e.input.getAttribute("step")&&(e.mobileInput.step=String(e.input.getAttribute("step"))),e.input.type="hidden",e.altInput!==void 0&&(e.altInput.type="hidden");try{e.input.parentNode&&e.input.parentNode.insertBefore(e.mobileInput,e.input.nextSibling)}catch{}g(e.mobileInput,"change",function(l){e.setDate(getEventTarget(l).value,!1,e.mobileFormatStr),q("onChange"),q("onClose")})}function Ve(s){if(e.isOpen===!0)return e.close();e.open(s)}function q(s,l){if(e.config!==void 0){var d=e.config[s];if(d!==void 0&&d.length>0)for(var p=0;d[p]&&p<d.length;p++)d[p](e.selectedDates,e.input.value,e,l);s==="onChange"&&(e.input.dispatchEvent(xe("change")),e.input.dispatchEvent(xe("input")))}}function xe(s){var l=document.createEvent("Event");return l.initEvent(s,!0,!0),l}function Ie(s){for(var l=0;l<e.selectedDates.length;l++){var d=e.selectedDates[l];if(d instanceof Date&&compareDates(d,s)===0)return""+l}return!1}function Be(s){return e.config.mode!=="range"||e.selectedDates.length<2?!1:compareDates(s,e.selectedDates[0])>=0&&compareDates(s,e.selectedDates[1])<=0}function $e(){e.config.noCalendar||e.isMobile||!e.monthNav||(e.yearElements.forEach(function(s,l){var d=new Date(e.currentYear,e.currentMonth,1);d.setMonth(e.currentMonth+l),e.config.showMonths>1||e.config.monthSelectorType==="static"?e.monthElements[l].textContent=monthToStr(d.getMonth(),e.config.shorthandCurrentMonth,e.l10n)+" ":e.monthsDropdownContainer.value=d.getMonth().toString(),s.value=d.getFullYear().toString()}),e._hidePrevMonthArrow=e.config.minDate!==void 0&&(e.currentYear===e.config.minDate.getFullYear()?e.currentMonth<=e.config.minDate.getMonth():e.currentYear<e.config.minDate.getFullYear()),e._hideNextMonthArrow=e.config.maxDate!==void 0&&(e.currentYear===e.config.maxDate.getFullYear()?e.currentMonth+1>e.config.maxDate.getMonth():e.currentYear>e.config.maxDate.getFullYear()))}function Le(s){var l=s||(e.config.altInput?e.config.altFormat:e.config.dateFormat);return e.selectedDates.map(function(d){return e.formatDate(d,l)}).filter(function(d,p,v){return e.config.mode!=="range"||e.config.enableTime||v.indexOf(d)===p}).join(e.config.mode!=="range"?e.config.conjunction:e.l10n.rangeSeparator)}function le(s){s===void 0&&(s=!0),e.mobileInput!==void 0&&e.mobileFormatStr&&(e.mobileInput.value=e.latestSelectedDateObj!==void 0?e.formatDate(e.latestSelectedDateObj,e.mobileFormatStr):""),e.input.value=Le(e.config.dateFormat),e.altInput!==void 0&&(e.altInput.value=Le(e.config.altFormat)),s!==!1&&q("onValueUpdate")}function Ue(s){var l=getEventTarget(s),d=e.prevMonthNav.contains(l),p=e.nextMonthNav.contains(l);d||p?X(d?-1:1):e.yearElements.indexOf(l)>=0?l.select():l.classList.contains("arrowUp")?e.changeYear(e.currentYear+1):l.classList.contains("arrowDown")&&e.changeYear(e.currentYear-1)}function je(s){s.preventDefault();var l=s.type==="keydown",d=getEventTarget(s),p=d;e.amPM!==void 0&&d===e.amPM&&(e.amPM.textContent=e.l10n.amPM[int(e.amPM.textContent===e.l10n.amPM[0])]);var v=parseFloat(p.getAttribute("min")),b=parseFloat(p.getAttribute("max")),x=parseFloat(p.getAttribute("step")),T=parseInt(p.value,10),R=s.delta||(l?s.which===38?1:-1:0),C=T+x*R;if(typeof p.value<"u"&&p.value.length===2){var w=p===e.hourElement,j=p===e.minuteElement;C<v?(C=b+C+int(!w)+(int(w)&&int(!e.amPM)),j&&S(void 0,-1,e.hourElement)):C>b&&(C=p===e.hourElement?C-b-int(!e.amPM):v,j&&S(void 0,1,e.hourElement)),e.amPM&&w&&(x===1?C+T===23:Math.abs(C-T)>x)&&(e.amPM.textContent=e.l10n.amPM[int(e.amPM.textContent===e.l10n.amPM[0])]),p.value=pad(C)}}return i(),e}function _flatpickr(n,t){for(var e=Array.prototype.slice.call(n).filter(function(o){return o instanceof HTMLElement}),r=[],i=0;i<e.length;i++){var a=e[i];try{if(a.getAttribute("data-fp-omit")!==null)continue;a._flatpickr!==void 0&&(a._flatpickr.destroy(),a._flatpickr=void 0),a._flatpickr=FlatpickrInstance(a,t||{}),r.push(a._flatpickr)}catch(o){console.error(o)}}return r.length===1?r[0]:r}typeof HTMLElement<"u"&&typeof HTMLCollection<"u"&&typeof NodeList<"u"&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(n){return _flatpickr(this,n)},HTMLElement.prototype.flatpickr=function(n){return _flatpickr([this],n)});var flatpickr=function(n,t){return typeof n=="string"?_flatpickr(window.document.querySelectorAll(n),t):n instanceof Node?_flatpickr([n],t):_flatpickr(n,t)};flatpickr.defaultConfig={};flatpickr.l10ns={en:__assign({},english),default:__assign({},english)};flatpickr.localize=function(n){flatpickr.l10ns.default=__assign(__assign({},flatpickr.l10ns.default),n)};flatpickr.setDefaults=function(n){flatpickr.defaultConfig=__assign(__assign({},flatpickr.defaultConfig),n)};flatpickr.parseDate=createDateParser({});flatpickr.formatDate=createDateFormatter({});flatpickr.compareDates=compareDates;typeof jQuery<"u"&&typeof jQuery.fn<"u"&&(jQuery.fn.flatpickr=function(n){return _flatpickr(this,n)});Date.prototype.fp_incr=function(n){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+(typeof n=="string"?parseInt(n,10):n))};typeof window<"u"&&(window.flatpickr=flatpickr);function initDateSelector(){flatpickr(".datepicker",{allowInput:!0})}const src=`/*!
 * Select2 4.1.0-rc.0
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        }
        else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
} (function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by \`banner.start.js\`) in a function that
  // returns the AMD loader references.
  var S2 =(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

S2.define('select2/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
      var superMethod = superMethods[m];

      DecoratedClass.prototype[superMethod] =
        SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
      params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
      params.push({});
    }

    // Set the \`_type\` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
      '\\\\': '&#92;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\\'': '&#39;',
      '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
      return markup;
    }

    return String(markup).replace(/[&<>"'\\/\\\\]/g, function (match) {
      return replaceMap[match];
    });
  };

  // Cache objects in Utils.__cache instead of $.data (see #4346)
  Utils.__cache = {};

  var id = 0;
  Utils.GetUniqueElementId = function (element) {
    // Get a unique element Id. If element has no id,
    // creates a new unique number, stores it in the id
    // attribute and returns the new id with a prefix.
    // If an id already exists, it simply returns it with a prefix.

    var select2Id = element.getAttribute('data-select2-id');

    if (select2Id != null) {
      return select2Id;
    }

    // If element has id, use it.
    if (element.id) {
      select2Id = 'select2-data-' + element.id;
    } else {
      select2Id = 'select2-data-' + (++id).toString() +
        '-' + Utils.generateChars(4);
    }

    element.setAttribute('data-select2-id', select2Id);

    return select2Id;
  };

  Utils.StoreData = function (element, name, value) {
    // Stores an item in the cache for a specified element.
    // name is the cache key.
    var id = Utils.GetUniqueElementId(element);
    if (!Utils.__cache[id]) {
      Utils.__cache[id] = {};
    }

    Utils.__cache[id][name] = value;
  };

  Utils.GetData = function (element, name) {
    // Retrieves a value from the cache by its key (name)
    // name is optional. If no name specified, return
    // all cache items for the specified element.
    // and for a specified element.
    var id = Utils.GetUniqueElementId(element);
    if (name) {
      if (Utils.__cache[id]) {
        if (Utils.__cache[id][name] != null) {
          return Utils.__cache[id][name];
        }
        return $(element).data(name); // Fallback to HTML5 data attribs.
      }
      return $(element).data(name); // Fallback to HTML5 data attribs.
    } else {
      return Utils.__cache[id];
    }
  };

  Utils.RemoveData = function (element) {
    // Removes all cached items for a specified element.
    var id = Utils.GetUniqueElementId(element);
    if (Utils.__cache[id] != null) {
      delete Utils.__cache[id];
    }

    element.removeAttribute('data-select2-id');
  };

  Utils.copyNonInternalCssClasses = function (dest, src) {
    var classes;

    var destinationClasses = dest.getAttribute('class').trim().split(/\\s+/);

    destinationClasses = destinationClasses.filter(function (clazz) {
      // Save all Select2 classes
      return clazz.indexOf('select2-') === 0;
    });

    var sourceClasses = src.getAttribute('class').trim().split(/\\s+/);

    sourceClasses = sourceClasses.filter(function (clazz) {
      // Only copy non-Select2 classes
      return clazz.indexOf('select2-') !== 0;
    });

    var replacements = destinationClasses.concat(sourceClasses);

    dest.setAttribute('class', replacements.join(' '));
  };

  return Utils;
});

S2.define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="listbox"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="alert" aria-live="assertive"' +
      ' class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.append(
      escapeMarkup(
        message(params.args)
      )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
  };

  Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var $options = this.$results
      .find('.select2-results__option--selectable');

    var $selected = $options.filter('.select2-results__option--selected');

    // Check if there are any selected options
    if ($selected.length > 0) {
      // If there are selected options, highlight the first
      $selected.first().trigger('mouseenter');
    } else {
      // If there are no selected options, highlight the first option
      // in the dropdown
      $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = selected.map(function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option--selectable');

      $options.each(function () {
        var $option = $(this);

        var item = Utils.GetData(this, 'data');

        // id needs to be converted to a string when comparing
        var id = '' + item.id;

        if ((item.element != null && item.element.selected) ||
            (item.element == null && selectedIds.indexOf(id) > -1)) {
          this.classList.add('select2-results__option--selected');
          $option.attr('aria-selected', 'true');
        } else {
          this.classList.remove('select2-results__option--selected');
          $option.attr('aria-selected', 'false');
        }
      });

    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.classList.add('select2-results__option');
    option.classList.add('select2-results__option--selectable');

    var attrs = {
      'role': 'option'
    };

    var matches = window.Element.prototype.matches ||
      window.Element.prototype.msMatchesSelector ||
      window.Element.prototype.webkitMatchesSelector;

    if ((data.element != null && matches.call(data.element, ':disabled')) ||
        (data.element == null && data.disabled)) {
      attrs['aria-disabled'] = 'true';

      option.classList.remove('select2-results__option--selectable');
      option.classList.add('select2-results__option--disabled');
    }

    if (data.id == null) {
      option.classList.remove('select2-results__option--selectable');
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs.role = 'group';
      attrs['aria-label'] = data.text;

      option.classList.remove('select2-results__option--selectable');
      option.classList.add('select2-results__option--group');
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested',
        'role': 'none'
      });

      $childrenContainer.append($children);

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    Utils.StoreData(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
        self.highlightFirstItem();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.hideMessages();
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get('scrollAfterSelect')) {
        self.highlightFirstItem();
      }
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get('scrollAfterSelect')) {
        self.highlightFirstItem();
      }
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = Utils.GetData($highlighted[0], 'data');

      if ($highlighted.hasClass('select2-results__option--selected')) {
        self.trigger('close', {});
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('.select2-results__option--selectable');

      var currentIndex = $options.index($highlighted);

      // If we are already at the top, don't move further
      // If no options, currentIndex will be -1
      if (currentIndex <= 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('.select2-results__option--selectable');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element[0].classList.add('select2-results__option--highlighted');
      params.element[0].setAttribute('aria-selected', 'true');
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option--selectable',
      function (evt) {
      var $this = $(this);

      var data = Utils.GetData(this, 'data');

      if ($this.hasClass('select2-results__option--selected')) {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close', {});
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option--selectable',
      function (evt) {
      var data = Utils.GetData(this, 'data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted')
          .attr('aria-selected', 'false');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('.select2-results__option--selectable');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');
    var escapeMarkup = this.options.get('escapeMarkup');

    var content = template(result, container);

    if (content == null) {
      container.style.display = 'none';
    } else if (typeof content === 'string') {
      container.innerHTML = escapeMarkup(content);
    } else {
      $(container).append(content);
    }
  };

  return Results;
});

S2.define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" role="combobox" ' +
      ' aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    this._tabindex = 0;

    if (Utils.GetData(this.$element[0], 'old-tabindex') != null) {
      this._tabindex = Utils.GetData(this.$element[0], 'old-tabindex');
    } else if (this.$element.attr('tabindex') != null) {
      this._tabindex = this.$element.attr('tabindex');
    }

    $selection.attr('title', this.$element.attr('title'));
    $selection.attr('tabindex', this._tabindex);
    $selection.attr('aria-disabled', 'false');

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.on('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');
      self.$selection.attr('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');
      self.$selection.removeAttr('aria-owns');

      self.$selection.trigger('focus');

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', self._tabindex);
      self.$selection.attr('aria-disabled', 'false');
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
      self.$selection.attr('aria-disabled', 'true');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger \`blur\` if the focus is still in the selection
      if (
        (document.activeElement == self.$selection[0]) ||
        ($.contains(self.$selection[0], document.activeElement))
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        if (this == $select[0]) {
          return;
        }

        var $element = Utils.GetData(this, 'element');

        $element.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The \`update\` method must be defined in child classes.');
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  BaseSelection.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  BaseSelection.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  return BaseSelection;
});

S2.define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection[0].classList.add('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered')
      .attr('id', id)
      .attr('role', 'textbox')
      .attr('aria-readonly', 'true');
    this.$selection.attr('aria-labelledby', id);
    this.$selection.attr('aria-controls', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.trigger('focus');
      }
    });
  };

  SingleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title'); // clear tooltip on empty
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);

    var title = selection.title || selection.text;

    if (title) {
      $rendered.attr('title', title);
    } else {
      $rendered.removeAttr('title');
    }
  };

  return SingleSelection;
});

S2.define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection[0].classList.add('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';
    this.$selection.find('.select2-selection__rendered').attr('id', id);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.isDisabled()) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = Utils.GetData($selection[0], 'data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );

    this.$selection.on(
      'keydown',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.isDisabled()) {
          return;
        }

        evt.stopPropagation();
      }
    );
  };

  MultipleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title');
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<button type="button" class="select2-selection__choice__remove" ' +
        'tabindex="-1">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '<span class="select2-selection__choice__display"></span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    var selectionIdPrefix = this.$selection.find('.select2-selection__rendered')
      .attr('id') + '-choice-';

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      var selectionId = selectionIdPrefix + Utils.generateChars(4) + '-';

      if (selection.id) {
        selectionId += selection.id;
      } else {
        selectionId += Utils.generateChars(4);
      }

      $selection.find('.select2-selection__choice__display')
        .append(formatted)
        .attr('id', selectionId);

      var title = selection.title || selection.text;

      if (title) {
        $selection.attr('title', title);
      }

      var removeItem = this.options.get('translations').get('removeItem');

      var $remove = $selection.find('.select2-selection__choice__remove');

      $remove.attr('title', removeItem());
      $remove.attr('aria-label', removeItem());
      $remove.attr('aria-describedby', selectionId);

      Utils.StoreData($selection[0], 'data', selection);

      $selections.push($selection);
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    $rendered.append($selections);
  };

  return MultipleSelection;
});

S2.define('select2/selection/placeholder',[

], function () {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder[0].classList.add('select2-selection__placeholder');
    $placeholder[0].classList.remove('select2-selection__choice');

    var placeholderTitle = placeholder.title ||
      placeholder.text ||
      $placeholder.text();

    this.$selection.find('.select2-selection__rendered').attr(
      'title',
      placeholderTitle
    );

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

S2.define('select2/selection/allowClear',[
  'jquery',
  '../keys',
  '../utils'
], function ($, KEYS, Utils) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
      if (this.options.get('debug') && window.console && console.error) {
        console.error(
          'Select2: The \`allowClear\` option should be used in combination ' +
          'with the \`placeholder\` option.'
        );
      }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        self._handleClear(evt);
    });

    container.on('keypress', function (evt) {
      self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.isDisabled()) {
      return;
    }

    var $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
      return;
    }

    evt.stopPropagation();

    var data = Utils.GetData($clear[0], 'data');

    var previousVal = this.$element.val();
    this.$element.val(this.placeholder.id);

    var unselectData = {
      data: data
    };
    this.trigger('clear', unselectData);
    if (unselectData.prevented) {
      this.$element.val(previousVal);
      return;
    }

    for (var d = 0; d < data.length; d++) {
      unselectData = {
        data: data[d]
      };

      // Trigger the \`unselect\` event, so people can prevent it from being
      // cleared.
      this.trigger('unselect', unselectData);

      // If the event was prevented, don't clear it out.
      if (unselectData.prevented) {
        this.$element.val(previousVal);
        return;
      }
    }

    this.$element.trigger('input').trigger('change');

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
      return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
      this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    this.$selection.find('.select2-selection__clear').remove();
    this.$selection[0].classList.remove('select2-selection--clearable');

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var selectionId = this.$selection.find('.select2-selection__rendered')
      .attr('id');

    var removeAll = this.options.get('translations').get('removeAllItems');

    var $remove = $(
      '<button type="button" class="select2-selection__clear" tabindex="-1">' +
        '<span aria-hidden="true">&times;</span>' +
      '</button>'
    );
    $remove.attr('title', removeAll());
    $remove.attr('aria-label', removeAll());
    $remove.attr('aria-describedby', selectionId);
    Utils.StoreData($remove[0], 'data', data);

    this.$selection.prepend($remove);
    this.$selection[0].classList.add('select2-selection--clearable');
  };

  return AllowClear;
});

S2.define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var searchLabel = this.options.get('translations').get('search');
    var $search = $(
      '<span class="select2-search select2-search--inline">' +
        '<textarea class="select2-search__field"'+
        ' type="search" tabindex="-1"' +
        ' autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" >' +
        '</textarea>' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('textarea');

    this.$search.prop('autocomplete', this.options.get('autocomplete'));
    this.$search.attr('aria-label', searchLabel());

    var $rendered = decorated.call(this);

    this._transferTabIndex();
    $rendered.append(this.$searchContainer);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var resultsId = container.id + '-results';
    var selectionId = container.id + '-container';

    decorated.call(this, container, $container);

    self.$search.attr('aria-describedby', selectionId);

    container.on('open', function () {
      self.$search.attr('aria-controls', resultsId);
      self.$search.trigger('focus');
    });

    container.on('close', function () {
      self.$search.val('');
      self.resizeSearch();
      self.$search.removeAttr('aria-controls');
      self.$search.removeAttr('aria-activedescendant');
      self.$search.trigger('focus');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);

      self._transferTabIndex();
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    container.on('focus', function (evt) {
      self.$search.trigger('focus');
    });

    container.on('results:focus', function (params) {
      if (params.data._resultId) {
        self.$search.attr('aria-activedescendant', params.data._resultId);
      } else {
        self.$search.removeAttr('aria-activedescendant');
      }
    });

    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$selection
          .find('.select2-selection__choice').last();

        if ($previousChoice.length > 0) {
          var item = Utils.GetData($previousChoice[0], 'data');

          self.searchRemoveChoice(item);

          evt.preventDefault();
        }
      }
    });

    this.$selection.on('click', '.select2-search--inline', function (evt) {
      if (self.$search.val()) {
        evt.stopPropagation();
      }
    });

    // Try to detect the IE version should the \`documentMode\` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the \`input\` event
    // This will prevent double-triggering of events for browsers which support
    // both the \`keyup\` and \`input\` events.
    this.$selection.on(
      'input.searchcheck',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the \`input\` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // \`input\` events in IE and keep using \`keyup\`.
        if (disableInputEvents) {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        // Unbind the duplicated \`keyup\` event
        self.$selection.off('keyup.search');
      }
    );

    this.$selection.on(
      'keyup.search input.search',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the \`input\` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // \`input\` events in IE and keep using \`keyup\`.
        if (disableInputEvents && evt.type === 'input') {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        var key = evt.which;

        // We can freely ignore events from modifier keys
        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
          return;
        }

        // Tabbing will be handled during the \`keydown\` phase
        if (key == KEYS.TAB) {
          return;
        }

        self.handleSearch(evt);
      }
    );
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
    this.$selection.attr('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.$search[0] == document.activeElement;

    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.resizeSearch();
    if (searchHadFocus) {
      this.$search.trigger('focus');
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.$search.val(item.text);
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '100%';

    if (this.$search.attr('placeholder') === '') {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

S2.define('select2/selection/selectionCss',[
  '../utils'
], function (Utils) {
  function SelectionCSS () { }

  SelectionCSS.prototype.render = function (decorated) {
    var $selection = decorated.call(this);

    var selectionCssClass = this.options.get('selectionCssClass') || '';

    if (selectionCssClass.indexOf(':all:') !== -1) {
      selectionCssClass = selectionCssClass.replace(':all:', '');

      Utils.copyNonInternalCssClasses($selection[0], this.$element[0]);
    }

    $selection.addClass(selectionCssClass);

    return $selection;
  };

  return SelectionCSS;
});

S2.define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting',
      'clear', 'clearing'
    ];

    var preventableEvents = [
      'opening', 'closing', 'selecting', 'unselecting', 'clearing'
    ];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if (relayEvents.indexOf(name) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if (preventableEvents.indexOf(name) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

S2.define('select2/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('select2/diacritics',[

], function () {
  var diacritics = {
    '\\u24B6': 'A',
    '\\uFF21': 'A',
    '\\u00C0': 'A',
    '\\u00C1': 'A',
    '\\u00C2': 'A',
    '\\u1EA6': 'A',
    '\\u1EA4': 'A',
    '\\u1EAA': 'A',
    '\\u1EA8': 'A',
    '\\u00C3': 'A',
    '\\u0100': 'A',
    '\\u0102': 'A',
    '\\u1EB0': 'A',
    '\\u1EAE': 'A',
    '\\u1EB4': 'A',
    '\\u1EB2': 'A',
    '\\u0226': 'A',
    '\\u01E0': 'A',
    '\\u00C4': 'A',
    '\\u01DE': 'A',
    '\\u1EA2': 'A',
    '\\u00C5': 'A',
    '\\u01FA': 'A',
    '\\u01CD': 'A',
    '\\u0200': 'A',
    '\\u0202': 'A',
    '\\u1EA0': 'A',
    '\\u1EAC': 'A',
    '\\u1EB6': 'A',
    '\\u1E00': 'A',
    '\\u0104': 'A',
    '\\u023A': 'A',
    '\\u2C6F': 'A',
    '\\uA732': 'AA',
    '\\u00C6': 'AE',
    '\\u01FC': 'AE',
    '\\u01E2': 'AE',
    '\\uA734': 'AO',
    '\\uA736': 'AU',
    '\\uA738': 'AV',
    '\\uA73A': 'AV',
    '\\uA73C': 'AY',
    '\\u24B7': 'B',
    '\\uFF22': 'B',
    '\\u1E02': 'B',
    '\\u1E04': 'B',
    '\\u1E06': 'B',
    '\\u0243': 'B',
    '\\u0182': 'B',
    '\\u0181': 'B',
    '\\u24B8': 'C',
    '\\uFF23': 'C',
    '\\u0106': 'C',
    '\\u0108': 'C',
    '\\u010A': 'C',
    '\\u010C': 'C',
    '\\u00C7': 'C',
    '\\u1E08': 'C',
    '\\u0187': 'C',
    '\\u023B': 'C',
    '\\uA73E': 'C',
    '\\u24B9': 'D',
    '\\uFF24': 'D',
    '\\u1E0A': 'D',
    '\\u010E': 'D',
    '\\u1E0C': 'D',
    '\\u1E10': 'D',
    '\\u1E12': 'D',
    '\\u1E0E': 'D',
    '\\u0110': 'D',
    '\\u018B': 'D',
    '\\u018A': 'D',
    '\\u0189': 'D',
    '\\uA779': 'D',
    '\\u01F1': 'DZ',
    '\\u01C4': 'DZ',
    '\\u01F2': 'Dz',
    '\\u01C5': 'Dz',
    '\\u24BA': 'E',
    '\\uFF25': 'E',
    '\\u00C8': 'E',
    '\\u00C9': 'E',
    '\\u00CA': 'E',
    '\\u1EC0': 'E',
    '\\u1EBE': 'E',
    '\\u1EC4': 'E',
    '\\u1EC2': 'E',
    '\\u1EBC': 'E',
    '\\u0112': 'E',
    '\\u1E14': 'E',
    '\\u1E16': 'E',
    '\\u0114': 'E',
    '\\u0116': 'E',
    '\\u00CB': 'E',
    '\\u1EBA': 'E',
    '\\u011A': 'E',
    '\\u0204': 'E',
    '\\u0206': 'E',
    '\\u1EB8': 'E',
    '\\u1EC6': 'E',
    '\\u0228': 'E',
    '\\u1E1C': 'E',
    '\\u0118': 'E',
    '\\u1E18': 'E',
    '\\u1E1A': 'E',
    '\\u0190': 'E',
    '\\u018E': 'E',
    '\\u24BB': 'F',
    '\\uFF26': 'F',
    '\\u1E1E': 'F',
    '\\u0191': 'F',
    '\\uA77B': 'F',
    '\\u24BC': 'G',
    '\\uFF27': 'G',
    '\\u01F4': 'G',
    '\\u011C': 'G',
    '\\u1E20': 'G',
    '\\u011E': 'G',
    '\\u0120': 'G',
    '\\u01E6': 'G',
    '\\u0122': 'G',
    '\\u01E4': 'G',
    '\\u0193': 'G',
    '\\uA7A0': 'G',
    '\\uA77D': 'G',
    '\\uA77E': 'G',
    '\\u24BD': 'H',
    '\\uFF28': 'H',
    '\\u0124': 'H',
    '\\u1E22': 'H',
    '\\u1E26': 'H',
    '\\u021E': 'H',
    '\\u1E24': 'H',
    '\\u1E28': 'H',
    '\\u1E2A': 'H',
    '\\u0126': 'H',
    '\\u2C67': 'H',
    '\\u2C75': 'H',
    '\\uA78D': 'H',
    '\\u24BE': 'I',
    '\\uFF29': 'I',
    '\\u00CC': 'I',
    '\\u00CD': 'I',
    '\\u00CE': 'I',
    '\\u0128': 'I',
    '\\u012A': 'I',
    '\\u012C': 'I',
    '\\u0130': 'I',
    '\\u00CF': 'I',
    '\\u1E2E': 'I',
    '\\u1EC8': 'I',
    '\\u01CF': 'I',
    '\\u0208': 'I',
    '\\u020A': 'I',
    '\\u1ECA': 'I',
    '\\u012E': 'I',
    '\\u1E2C': 'I',
    '\\u0197': 'I',
    '\\u24BF': 'J',
    '\\uFF2A': 'J',
    '\\u0134': 'J',
    '\\u0248': 'J',
    '\\u24C0': 'K',
    '\\uFF2B': 'K',
    '\\u1E30': 'K',
    '\\u01E8': 'K',
    '\\u1E32': 'K',
    '\\u0136': 'K',
    '\\u1E34': 'K',
    '\\u0198': 'K',
    '\\u2C69': 'K',
    '\\uA740': 'K',
    '\\uA742': 'K',
    '\\uA744': 'K',
    '\\uA7A2': 'K',
    '\\u24C1': 'L',
    '\\uFF2C': 'L',
    '\\u013F': 'L',
    '\\u0139': 'L',
    '\\u013D': 'L',
    '\\u1E36': 'L',
    '\\u1E38': 'L',
    '\\u013B': 'L',
    '\\u1E3C': 'L',
    '\\u1E3A': 'L',
    '\\u0141': 'L',
    '\\u023D': 'L',
    '\\u2C62': 'L',
    '\\u2C60': 'L',
    '\\uA748': 'L',
    '\\uA746': 'L',
    '\\uA780': 'L',
    '\\u01C7': 'LJ',
    '\\u01C8': 'Lj',
    '\\u24C2': 'M',
    '\\uFF2D': 'M',
    '\\u1E3E': 'M',
    '\\u1E40': 'M',
    '\\u1E42': 'M',
    '\\u2C6E': 'M',
    '\\u019C': 'M',
    '\\u24C3': 'N',
    '\\uFF2E': 'N',
    '\\u01F8': 'N',
    '\\u0143': 'N',
    '\\u00D1': 'N',
    '\\u1E44': 'N',
    '\\u0147': 'N',
    '\\u1E46': 'N',
    '\\u0145': 'N',
    '\\u1E4A': 'N',
    '\\u1E48': 'N',
    '\\u0220': 'N',
    '\\u019D': 'N',
    '\\uA790': 'N',
    '\\uA7A4': 'N',
    '\\u01CA': 'NJ',
    '\\u01CB': 'Nj',
    '\\u24C4': 'O',
    '\\uFF2F': 'O',
    '\\u00D2': 'O',
    '\\u00D3': 'O',
    '\\u00D4': 'O',
    '\\u1ED2': 'O',
    '\\u1ED0': 'O',
    '\\u1ED6': 'O',
    '\\u1ED4': 'O',
    '\\u00D5': 'O',
    '\\u1E4C': 'O',
    '\\u022C': 'O',
    '\\u1E4E': 'O',
    '\\u014C': 'O',
    '\\u1E50': 'O',
    '\\u1E52': 'O',
    '\\u014E': 'O',
    '\\u022E': 'O',
    '\\u0230': 'O',
    '\\u00D6': 'O',
    '\\u022A': 'O',
    '\\u1ECE': 'O',
    '\\u0150': 'O',
    '\\u01D1': 'O',
    '\\u020C': 'O',
    '\\u020E': 'O',
    '\\u01A0': 'O',
    '\\u1EDC': 'O',
    '\\u1EDA': 'O',
    '\\u1EE0': 'O',
    '\\u1EDE': 'O',
    '\\u1EE2': 'O',
    '\\u1ECC': 'O',
    '\\u1ED8': 'O',
    '\\u01EA': 'O',
    '\\u01EC': 'O',
    '\\u00D8': 'O',
    '\\u01FE': 'O',
    '\\u0186': 'O',
    '\\u019F': 'O',
    '\\uA74A': 'O',
    '\\uA74C': 'O',
    '\\u0152': 'OE',
    '\\u01A2': 'OI',
    '\\uA74E': 'OO',
    '\\u0222': 'OU',
    '\\u24C5': 'P',
    '\\uFF30': 'P',
    '\\u1E54': 'P',
    '\\u1E56': 'P',
    '\\u01A4': 'P',
    '\\u2C63': 'P',
    '\\uA750': 'P',
    '\\uA752': 'P',
    '\\uA754': 'P',
    '\\u24C6': 'Q',
    '\\uFF31': 'Q',
    '\\uA756': 'Q',
    '\\uA758': 'Q',
    '\\u024A': 'Q',
    '\\u24C7': 'R',
    '\\uFF32': 'R',
    '\\u0154': 'R',
    '\\u1E58': 'R',
    '\\u0158': 'R',
    '\\u0210': 'R',
    '\\u0212': 'R',
    '\\u1E5A': 'R',
    '\\u1E5C': 'R',
    '\\u0156': 'R',
    '\\u1E5E': 'R',
    '\\u024C': 'R',
    '\\u2C64': 'R',
    '\\uA75A': 'R',
    '\\uA7A6': 'R',
    '\\uA782': 'R',
    '\\u24C8': 'S',
    '\\uFF33': 'S',
    '\\u1E9E': 'S',
    '\\u015A': 'S',
    '\\u1E64': 'S',
    '\\u015C': 'S',
    '\\u1E60': 'S',
    '\\u0160': 'S',
    '\\u1E66': 'S',
    '\\u1E62': 'S',
    '\\u1E68': 'S',
    '\\u0218': 'S',
    '\\u015E': 'S',
    '\\u2C7E': 'S',
    '\\uA7A8': 'S',
    '\\uA784': 'S',
    '\\u24C9': 'T',
    '\\uFF34': 'T',
    '\\u1E6A': 'T',
    '\\u0164': 'T',
    '\\u1E6C': 'T',
    '\\u021A': 'T',
    '\\u0162': 'T',
    '\\u1E70': 'T',
    '\\u1E6E': 'T',
    '\\u0166': 'T',
    '\\u01AC': 'T',
    '\\u01AE': 'T',
    '\\u023E': 'T',
    '\\uA786': 'T',
    '\\uA728': 'TZ',
    '\\u24CA': 'U',
    '\\uFF35': 'U',
    '\\u00D9': 'U',
    '\\u00DA': 'U',
    '\\u00DB': 'U',
    '\\u0168': 'U',
    '\\u1E78': 'U',
    '\\u016A': 'U',
    '\\u1E7A': 'U',
    '\\u016C': 'U',
    '\\u00DC': 'U',
    '\\u01DB': 'U',
    '\\u01D7': 'U',
    '\\u01D5': 'U',
    '\\u01D9': 'U',
    '\\u1EE6': 'U',
    '\\u016E': 'U',
    '\\u0170': 'U',
    '\\u01D3': 'U',
    '\\u0214': 'U',
    '\\u0216': 'U',
    '\\u01AF': 'U',
    '\\u1EEA': 'U',
    '\\u1EE8': 'U',
    '\\u1EEE': 'U',
    '\\u1EEC': 'U',
    '\\u1EF0': 'U',
    '\\u1EE4': 'U',
    '\\u1E72': 'U',
    '\\u0172': 'U',
    '\\u1E76': 'U',
    '\\u1E74': 'U',
    '\\u0244': 'U',
    '\\u24CB': 'V',
    '\\uFF36': 'V',
    '\\u1E7C': 'V',
    '\\u1E7E': 'V',
    '\\u01B2': 'V',
    '\\uA75E': 'V',
    '\\u0245': 'V',
    '\\uA760': 'VY',
    '\\u24CC': 'W',
    '\\uFF37': 'W',
    '\\u1E80': 'W',
    '\\u1E82': 'W',
    '\\u0174': 'W',
    '\\u1E86': 'W',
    '\\u1E84': 'W',
    '\\u1E88': 'W',
    '\\u2C72': 'W',
    '\\u24CD': 'X',
    '\\uFF38': 'X',
    '\\u1E8A': 'X',
    '\\u1E8C': 'X',
    '\\u24CE': 'Y',
    '\\uFF39': 'Y',
    '\\u1EF2': 'Y',
    '\\u00DD': 'Y',
    '\\u0176': 'Y',
    '\\u1EF8': 'Y',
    '\\u0232': 'Y',
    '\\u1E8E': 'Y',
    '\\u0178': 'Y',
    '\\u1EF6': 'Y',
    '\\u1EF4': 'Y',
    '\\u01B3': 'Y',
    '\\u024E': 'Y',
    '\\u1EFE': 'Y',
    '\\u24CF': 'Z',
    '\\uFF3A': 'Z',
    '\\u0179': 'Z',
    '\\u1E90': 'Z',
    '\\u017B': 'Z',
    '\\u017D': 'Z',
    '\\u1E92': 'Z',
    '\\u1E94': 'Z',
    '\\u01B5': 'Z',
    '\\u0224': 'Z',
    '\\u2C7F': 'Z',
    '\\u2C6B': 'Z',
    '\\uA762': 'Z',
    '\\u24D0': 'a',
    '\\uFF41': 'a',
    '\\u1E9A': 'a',
    '\\u00E0': 'a',
    '\\u00E1': 'a',
    '\\u00E2': 'a',
    '\\u1EA7': 'a',
    '\\u1EA5': 'a',
    '\\u1EAB': 'a',
    '\\u1EA9': 'a',
    '\\u00E3': 'a',
    '\\u0101': 'a',
    '\\u0103': 'a',
    '\\u1EB1': 'a',
    '\\u1EAF': 'a',
    '\\u1EB5': 'a',
    '\\u1EB3': 'a',
    '\\u0227': 'a',
    '\\u01E1': 'a',
    '\\u00E4': 'a',
    '\\u01DF': 'a',
    '\\u1EA3': 'a',
    '\\u00E5': 'a',
    '\\u01FB': 'a',
    '\\u01CE': 'a',
    '\\u0201': 'a',
    '\\u0203': 'a',
    '\\u1EA1': 'a',
    '\\u1EAD': 'a',
    '\\u1EB7': 'a',
    '\\u1E01': 'a',
    '\\u0105': 'a',
    '\\u2C65': 'a',
    '\\u0250': 'a',
    '\\uA733': 'aa',
    '\\u00E6': 'ae',
    '\\u01FD': 'ae',
    '\\u01E3': 'ae',
    '\\uA735': 'ao',
    '\\uA737': 'au',
    '\\uA739': 'av',
    '\\uA73B': 'av',
    '\\uA73D': 'ay',
    '\\u24D1': 'b',
    '\\uFF42': 'b',
    '\\u1E03': 'b',
    '\\u1E05': 'b',
    '\\u1E07': 'b',
    '\\u0180': 'b',
    '\\u0183': 'b',
    '\\u0253': 'b',
    '\\u24D2': 'c',
    '\\uFF43': 'c',
    '\\u0107': 'c',
    '\\u0109': 'c',
    '\\u010B': 'c',
    '\\u010D': 'c',
    '\\u00E7': 'c',
    '\\u1E09': 'c',
    '\\u0188': 'c',
    '\\u023C': 'c',
    '\\uA73F': 'c',
    '\\u2184': 'c',
    '\\u24D3': 'd',
    '\\uFF44': 'd',
    '\\u1E0B': 'd',
    '\\u010F': 'd',
    '\\u1E0D': 'd',
    '\\u1E11': 'd',
    '\\u1E13': 'd',
    '\\u1E0F': 'd',
    '\\u0111': 'd',
    '\\u018C': 'd',
    '\\u0256': 'd',
    '\\u0257': 'd',
    '\\uA77A': 'd',
    '\\u01F3': 'dz',
    '\\u01C6': 'dz',
    '\\u24D4': 'e',
    '\\uFF45': 'e',
    '\\u00E8': 'e',
    '\\u00E9': 'e',
    '\\u00EA': 'e',
    '\\u1EC1': 'e',
    '\\u1EBF': 'e',
    '\\u1EC5': 'e',
    '\\u1EC3': 'e',
    '\\u1EBD': 'e',
    '\\u0113': 'e',
    '\\u1E15': 'e',
    '\\u1E17': 'e',
    '\\u0115': 'e',
    '\\u0117': 'e',
    '\\u00EB': 'e',
    '\\u1EBB': 'e',
    '\\u011B': 'e',
    '\\u0205': 'e',
    '\\u0207': 'e',
    '\\u1EB9': 'e',
    '\\u1EC7': 'e',
    '\\u0229': 'e',
    '\\u1E1D': 'e',
    '\\u0119': 'e',
    '\\u1E19': 'e',
    '\\u1E1B': 'e',
    '\\u0247': 'e',
    '\\u025B': 'e',
    '\\u01DD': 'e',
    '\\u24D5': 'f',
    '\\uFF46': 'f',
    '\\u1E1F': 'f',
    '\\u0192': 'f',
    '\\uA77C': 'f',
    '\\u24D6': 'g',
    '\\uFF47': 'g',
    '\\u01F5': 'g',
    '\\u011D': 'g',
    '\\u1E21': 'g',
    '\\u011F': 'g',
    '\\u0121': 'g',
    '\\u01E7': 'g',
    '\\u0123': 'g',
    '\\u01E5': 'g',
    '\\u0260': 'g',
    '\\uA7A1': 'g',
    '\\u1D79': 'g',
    '\\uA77F': 'g',
    '\\u24D7': 'h',
    '\\uFF48': 'h',
    '\\u0125': 'h',
    '\\u1E23': 'h',
    '\\u1E27': 'h',
    '\\u021F': 'h',
    '\\u1E25': 'h',
    '\\u1E29': 'h',
    '\\u1E2B': 'h',
    '\\u1E96': 'h',
    '\\u0127': 'h',
    '\\u2C68': 'h',
    '\\u2C76': 'h',
    '\\u0265': 'h',
    '\\u0195': 'hv',
    '\\u24D8': 'i',
    '\\uFF49': 'i',
    '\\u00EC': 'i',
    '\\u00ED': 'i',
    '\\u00EE': 'i',
    '\\u0129': 'i',
    '\\u012B': 'i',
    '\\u012D': 'i',
    '\\u00EF': 'i',
    '\\u1E2F': 'i',
    '\\u1EC9': 'i',
    '\\u01D0': 'i',
    '\\u0209': 'i',
    '\\u020B': 'i',
    '\\u1ECB': 'i',
    '\\u012F': 'i',
    '\\u1E2D': 'i',
    '\\u0268': 'i',
    '\\u0131': 'i',
    '\\u24D9': 'j',
    '\\uFF4A': 'j',
    '\\u0135': 'j',
    '\\u01F0': 'j',
    '\\u0249': 'j',
    '\\u24DA': 'k',
    '\\uFF4B': 'k',
    '\\u1E31': 'k',
    '\\u01E9': 'k',
    '\\u1E33': 'k',
    '\\u0137': 'k',
    '\\u1E35': 'k',
    '\\u0199': 'k',
    '\\u2C6A': 'k',
    '\\uA741': 'k',
    '\\uA743': 'k',
    '\\uA745': 'k',
    '\\uA7A3': 'k',
    '\\u24DB': 'l',
    '\\uFF4C': 'l',
    '\\u0140': 'l',
    '\\u013A': 'l',
    '\\u013E': 'l',
    '\\u1E37': 'l',
    '\\u1E39': 'l',
    '\\u013C': 'l',
    '\\u1E3D': 'l',
    '\\u1E3B': 'l',
    '\\u017F': 'l',
    '\\u0142': 'l',
    '\\u019A': 'l',
    '\\u026B': 'l',
    '\\u2C61': 'l',
    '\\uA749': 'l',
    '\\uA781': 'l',
    '\\uA747': 'l',
    '\\u01C9': 'lj',
    '\\u24DC': 'm',
    '\\uFF4D': 'm',
    '\\u1E3F': 'm',
    '\\u1E41': 'm',
    '\\u1E43': 'm',
    '\\u0271': 'm',
    '\\u026F': 'm',
    '\\u24DD': 'n',
    '\\uFF4E': 'n',
    '\\u01F9': 'n',
    '\\u0144': 'n',
    '\\u00F1': 'n',
    '\\u1E45': 'n',
    '\\u0148': 'n',
    '\\u1E47': 'n',
    '\\u0146': 'n',
    '\\u1E4B': 'n',
    '\\u1E49': 'n',
    '\\u019E': 'n',
    '\\u0272': 'n',
    '\\u0149': 'n',
    '\\uA791': 'n',
    '\\uA7A5': 'n',
    '\\u01CC': 'nj',
    '\\u24DE': 'o',
    '\\uFF4F': 'o',
    '\\u00F2': 'o',
    '\\u00F3': 'o',
    '\\u00F4': 'o',
    '\\u1ED3': 'o',
    '\\u1ED1': 'o',
    '\\u1ED7': 'o',
    '\\u1ED5': 'o',
    '\\u00F5': 'o',
    '\\u1E4D': 'o',
    '\\u022D': 'o',
    '\\u1E4F': 'o',
    '\\u014D': 'o',
    '\\u1E51': 'o',
    '\\u1E53': 'o',
    '\\u014F': 'o',
    '\\u022F': 'o',
    '\\u0231': 'o',
    '\\u00F6': 'o',
    '\\u022B': 'o',
    '\\u1ECF': 'o',
    '\\u0151': 'o',
    '\\u01D2': 'o',
    '\\u020D': 'o',
    '\\u020F': 'o',
    '\\u01A1': 'o',
    '\\u1EDD': 'o',
    '\\u1EDB': 'o',
    '\\u1EE1': 'o',
    '\\u1EDF': 'o',
    '\\u1EE3': 'o',
    '\\u1ECD': 'o',
    '\\u1ED9': 'o',
    '\\u01EB': 'o',
    '\\u01ED': 'o',
    '\\u00F8': 'o',
    '\\u01FF': 'o',
    '\\u0254': 'o',
    '\\uA74B': 'o',
    '\\uA74D': 'o',
    '\\u0275': 'o',
    '\\u0153': 'oe',
    '\\u01A3': 'oi',
    '\\u0223': 'ou',
    '\\uA74F': 'oo',
    '\\u24DF': 'p',
    '\\uFF50': 'p',
    '\\u1E55': 'p',
    '\\u1E57': 'p',
    '\\u01A5': 'p',
    '\\u1D7D': 'p',
    '\\uA751': 'p',
    '\\uA753': 'p',
    '\\uA755': 'p',
    '\\u24E0': 'q',
    '\\uFF51': 'q',
    '\\u024B': 'q',
    '\\uA757': 'q',
    '\\uA759': 'q',
    '\\u24E1': 'r',
    '\\uFF52': 'r',
    '\\u0155': 'r',
    '\\u1E59': 'r',
    '\\u0159': 'r',
    '\\u0211': 'r',
    '\\u0213': 'r',
    '\\u1E5B': 'r',
    '\\u1E5D': 'r',
    '\\u0157': 'r',
    '\\u1E5F': 'r',
    '\\u024D': 'r',
    '\\u027D': 'r',
    '\\uA75B': 'r',
    '\\uA7A7': 'r',
    '\\uA783': 'r',
    '\\u24E2': 's',
    '\\uFF53': 's',
    '\\u00DF': 's',
    '\\u015B': 's',
    '\\u1E65': 's',
    '\\u015D': 's',
    '\\u1E61': 's',
    '\\u0161': 's',
    '\\u1E67': 's',
    '\\u1E63': 's',
    '\\u1E69': 's',
    '\\u0219': 's',
    '\\u015F': 's',
    '\\u023F': 's',
    '\\uA7A9': 's',
    '\\uA785': 's',
    '\\u1E9B': 's',
    '\\u24E3': 't',
    '\\uFF54': 't',
    '\\u1E6B': 't',
    '\\u1E97': 't',
    '\\u0165': 't',
    '\\u1E6D': 't',
    '\\u021B': 't',
    '\\u0163': 't',
    '\\u1E71': 't',
    '\\u1E6F': 't',
    '\\u0167': 't',
    '\\u01AD': 't',
    '\\u0288': 't',
    '\\u2C66': 't',
    '\\uA787': 't',
    '\\uA729': 'tz',
    '\\u24E4': 'u',
    '\\uFF55': 'u',
    '\\u00F9': 'u',
    '\\u00FA': 'u',
    '\\u00FB': 'u',
    '\\u0169': 'u',
    '\\u1E79': 'u',
    '\\u016B': 'u',
    '\\u1E7B': 'u',
    '\\u016D': 'u',
    '\\u00FC': 'u',
    '\\u01DC': 'u',
    '\\u01D8': 'u',
    '\\u01D6': 'u',
    '\\u01DA': 'u',
    '\\u1EE7': 'u',
    '\\u016F': 'u',
    '\\u0171': 'u',
    '\\u01D4': 'u',
    '\\u0215': 'u',
    '\\u0217': 'u',
    '\\u01B0': 'u',
    '\\u1EEB': 'u',
    '\\u1EE9': 'u',
    '\\u1EEF': 'u',
    '\\u1EED': 'u',
    '\\u1EF1': 'u',
    '\\u1EE5': 'u',
    '\\u1E73': 'u',
    '\\u0173': 'u',
    '\\u1E77': 'u',
    '\\u1E75': 'u',
    '\\u0289': 'u',
    '\\u24E5': 'v',
    '\\uFF56': 'v',
    '\\u1E7D': 'v',
    '\\u1E7F': 'v',
    '\\u028B': 'v',
    '\\uA75F': 'v',
    '\\u028C': 'v',
    '\\uA761': 'vy',
    '\\u24E6': 'w',
    '\\uFF57': 'w',
    '\\u1E81': 'w',
    '\\u1E83': 'w',
    '\\u0175': 'w',
    '\\u1E87': 'w',
    '\\u1E85': 'w',
    '\\u1E98': 'w',
    '\\u1E89': 'w',
    '\\u2C73': 'w',
    '\\u24E7': 'x',
    '\\uFF58': 'x',
    '\\u1E8B': 'x',
    '\\u1E8D': 'x',
    '\\u24E8': 'y',
    '\\uFF59': 'y',
    '\\u1EF3': 'y',
    '\\u00FD': 'y',
    '\\u0177': 'y',
    '\\u1EF9': 'y',
    '\\u0233': 'y',
    '\\u1E8F': 'y',
    '\\u00FF': 'y',
    '\\u1EF7': 'y',
    '\\u1E99': 'y',
    '\\u1EF5': 'y',
    '\\u01B4': 'y',
    '\\u024F': 'y',
    '\\u1EFF': 'y',
    '\\u24E9': 'z',
    '\\uFF5A': 'z',
    '\\u017A': 'z',
    '\\u1E91': 'z',
    '\\u017C': 'z',
    '\\u017E': 'z',
    '\\u1E93': 'z',
    '\\u1E95': 'z',
    '\\u01B6': 'z',
    '\\u0225': 'z',
    '\\u0240': 'z',
    '\\u2C6C': 'z',
    '\\uA763': 'z',
    '\\u0386': '\\u0391',
    '\\u0388': '\\u0395',
    '\\u0389': '\\u0397',
    '\\u038A': '\\u0399',
    '\\u03AA': '\\u0399',
    '\\u038C': '\\u039F',
    '\\u038E': '\\u03A5',
    '\\u03AB': '\\u03A5',
    '\\u038F': '\\u03A9',
    '\\u03AC': '\\u03B1',
    '\\u03AD': '\\u03B5',
    '\\u03AE': '\\u03B7',
    '\\u03AF': '\\u03B9',
    '\\u03CA': '\\u03B9',
    '\\u0390': '\\u03B9',
    '\\u03CC': '\\u03BF',
    '\\u03CD': '\\u03C5',
    '\\u03CB': '\\u03C5',
    '\\u03B0': '\\u03C5',
    '\\u03CE': '\\u03C9',
    '\\u03C2': '\\u03C3',
    '\\u2019': '\\''
  };

  return diacritics;
});

S2.define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The \`current\` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The \`query\` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

S2.define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var self = this;

    var data = Array.prototype.map.call(
      this.$element[0].querySelectorAll(':checked'),
      function (selectedElement) {
        return self.item($(selectedElement));
      }
    );

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if (
      data.element != null && data.element.tagName.toLowerCase() === 'option'
    ) {
      data.element.selected = true;

      this.$element.trigger('input').trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          var id = data[d].id;

          if (val.indexOf(id) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('input').trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger('input').trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    data.selected = false;

    if (
      data.element != null &&
      data.element.tagName.toLowerCase() === 'option'
    ) {
      data.element.selected = false;

      this.$element.trigger('input').trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        var id = currentData[d].id;

        if (id !== data.id && val.indexOf(id) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('input').trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      Utils.RemoveData(this);
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      if (
        this.tagName.toLowerCase() !== 'option' &&
        this.tagName.toLowerCase() !== 'optgroup'
      ) {
        return;
      }

      var $option = $(this);

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.addOptions = function ($options) {
    this.$element.append($options);
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');

      if (option.textContent !== undefined) {
        option.textContent = data.text;
      } else {
        option.innerText = data.text;
      }
    }

    if (data.id !== undefined) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    if (data.title) {
      option.title = data.title;
    }

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    Utils.StoreData(option, 'data', normalizedData);

    return $(option);
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = Utils.GetData($option[0], 'data');

    if (data != null) {
      return data;
    }

    var option = $option[0];

    if (option.tagName.toLowerCase() === 'option') {
      data = {
        id: $option.val(),
        text: $option.text(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected'),
        title: $option.prop('title')
      };
    } else if (option.tagName.toLowerCase() === 'optgroup') {
      data = {
        text: $option.prop('label'),
        children: [],
        title: $option.prop('title')
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    Utils.StoreData($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (item !== Object(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

S2.define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    this._dataToConvert = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.bind = function (container, $container) {
    ArrayAdapter.__super__.bind.call(this, container, $container);

    this.addOptions(this.convertToOptions(this._dataToConvert));
  };

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
      return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
      $option = this.option(data);

      this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if (existingIds.indexOf(item.id) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, item, existingData);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        $option.append($children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(failure);

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if (typeof this._request.abort === 'function') {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request () {
      var $request = options.transport(options, function (data) {
        var results = self.processResults(data, params);

        if (self.options.get('debug') && window.console && console.error) {
          // Check to make sure that the response included a \`results\` key.
          if (!results || !results.results || !Array.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '\`results\` key of the response.'
            );
          }
        }

        callback(results);
      }, function () {
        // Attempt to detect if a request was aborted
        // Only works if the transport exposes a status property
        if ('status' in $request &&
            ($request.status === 0 || $request.status === '0')) {
          return;
        }

        self.trigger('results:message', {
          message: 'errorLoading'
        });
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

S2.define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    var insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
        this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if (Array.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var optionText = (option.text || '').toUpperCase();
        var paramsTerm = (params.term || '').toUpperCase();

        var checkText = optionText === paramsTerm;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', 'true');

        self.addOptions([$option]);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    if (params.term == null) {
      return null;
    }

    var term = params.term.trim();

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

S2.define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect (data) {
      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);

      // Check if the data object already exists as a tag
      // Select it if it doesn't
      var $existingOptions = self.$element.find('option').filter(function () {
        return $(this).val() === item.id;
      });

      // If an existing option wasn't found for it, create the option
      if (!$existingOptions.length) {
        var $option = self.option(item);
        $option.attr('data-select2-tag', true);

        self._removeOldTags();
        self.addOptions([$option]);
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select (data) {
      self.trigger('select', {
        data: data
      });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.trigger('focus');
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if (separators.indexOf(termChar) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

S2.define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

S2.define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          maximum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

S2.define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.bind =
    function (decorated, container, $container) {
      var self = this;

      decorated.call(this, container, $container);

      container.on('select', function () {
        self._checkIfMaximumSelected();
      });
  };

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this._checkIfMaximumSelected(function () {
        decorated.call(self, params, callback);
      });
  };

  MaximumSelectionLength.prototype._checkIfMaximumSelected =
    function (_, successCallback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }

        if (successCallback) {
          successCallback();
        }
      });
  };

  return MaximumSelectionLength;
});

S2.define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});

S2.define('select2/dropdown/search',[
  'jquery'
], function ($) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);
    var searchLabel = this.options.get('translations').get('search');

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    this.$search.prop('autocomplete', this.options.get('autocomplete'));
    this.$search.attr('aria-label', searchLabel());

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    // Workaround for browsers which do not support the \`input\` event
    // This will prevent double-triggering of events for browsers which support
    // both the \`keyup\` and \`input\` events.
    this.$search.on('input', function (evt) {
      // Unbind the duplicated \`keyup\` event
      $(this).off('keyup');
    });

    this.$search.on('keyup input', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);
      self.$search.attr('aria-controls', resultsId);

      self.$search.trigger('focus');

      window.setTimeout(function () {
        self.$search.trigger('focus');
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);
      self.$search.removeAttr('aria-controls');
      self.$search.removeAttr('aria-activedescendant');

      self.$search.val('');
      self.$search.trigger('blur');
    });

    container.on('focus', function () {
      if (!container.isOpen()) {
        self.$search.trigger('focus');
      }
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer[0].classList.remove('select2-search--hide');
        } else {
          self.$searchContainer[0].classList.add('select2-search--hide');
        }
      }
    });

    container.on('results:focus', function (params) {
      if (params.data._resultId) {
        self.$search.attr('aria-activedescendant', params.data._resultId);
      } else {
        self.$search.removeAttr('aria-activedescendant');
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

S2.define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

S2.define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
      this.loadMoreIfNeeded();
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', this.loadMoreIfNeeded.bind(this));
  };

  InfiniteScroll.prototype.loadMoreIfNeeded = function () {
    var isLoadMoreVisible = $.contains(
      document.documentElement,
      this.$loadingMore[0]
    );

    if (this.loading || !isLoadMoreVisible) {
      return;
    }

    var currentOffset = this.$results.offset().top +
      this.$results.outerHeight(false);
    var loadingMoreOffset = this.$loadingMore.offset().top +
      this.$loadingMore.outerHeight(false);

    if (currentOffset + 50 >= loadingMoreOffset) {
      this.loadMore();
    }
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li ' +
      'class="select2-results__option select2-results__option--load-more"' +
      'role="option" aria-disabled="true"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

S2.define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = $(options.get('dropdownParent') || document.body);

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      // Must bind after the results handlers to ensure correct sizing
      self._bindContainerResultHandlers(container);
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown[0].classList.remove('select2');
    $dropdown[0].classList.add('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._bindContainerResultHandlers =
      function (decorated, container) {

    // These should only be bound once
    if (this._containerResultsHandlersBound) {
      return;
    }

    var self = this;

    container.on('results:all', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:append', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:message', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('select', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('unselect', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    this._containerResultsHandlersBound = true;
  };

  AttachBody.prototype._attachPositioningHandler =
      function (decorated, container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      Utils.StoreData(this, 'select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = Utils.GetData(this, 'select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler =
      function (decorated, container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown[0].classList
      .contains('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown[0].classList
      .contains('select2-dropdown--below');

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    // Determine what the parent element is to use for calculating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positioned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
      $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = {
      top: 0,
      left: 0
    };

    if (
      $.contains(document.body, $offsetParent[0]) ||
      $offsetParent[0].isConnected
      ) {
      parentOffset = $offsetParent.offset();
    }

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown[0].classList.remove('select2-dropdown--below');
      this.$dropdown[0].classList.remove('select2-dropdown--above');
      this.$dropdown[0].classList.add('select2-dropdown--' + newDirection);

      this.$container[0].classList.remove('select2-container--below');
      this.$container[0].classList.remove('select2-container--above');
      this.$container[0].classList.add('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
      width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
      css.minWidth = css.width;
      css.position = 'relative';
      css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

S2.define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    var count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    if (this.minimumResultsForSearch < 0) {
      this.minimumResultsForSearch = Infinity;
    }

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

S2.define('select2/dropdown/selectOnClose',[
  '../utils'
], function (Utils) {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (params) {
      self._handleSelectOnClose(params);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
    if (params && params.originalSelect2Event != null) {
      var event = params.originalSelect2Event;

      // Don't select an item if the close event was triggered from a select or
      // unselect event
      if (event._type === 'select' || event._type === 'unselect') {
        return;
      }
    }

    var $highlightedResults = this.getHighlightedResults();

    // Only select highlighted results
    if ($highlightedResults.length < 1) {
      return;
    }

    var data = Utils.GetData($highlightedResults[0], 'data');

    // Don't re-select already selected resulte
    if (
      (data.element != null && data.element.selected) ||
      (data.element == null && data.selected)
    ) {
      return;
    }

    this.trigger('select', {
        data: data
    });
  };

  return SelectOnClose;
});

S2.define('select2/dropdown/closeOnSelect',[

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
      self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey)) {
      return;
    }

    this.trigger('close', {
      originalEvent: originalEvent,
      originalSelect2Event: evt
    });
  };

  return CloseOnSelect;
});

S2.define('select2/dropdown/dropdownCss',[
  '../utils'
], function (Utils) {
  function DropdownCSS () { }

  DropdownCSS.prototype.render = function (decorated) {
    var $dropdown = decorated.call(this);

    var dropdownCssClass = this.options.get('dropdownCssClass') || '';

    if (dropdownCssClass.indexOf(':all:') !== -1) {
      dropdownCssClass = dropdownCssClass.replace(':all:', '');

      Utils.copyNonInternalCssClasses($dropdown[0], this.$element[0]);
    }

    $dropdown.addClass(dropdownCssClass);

    return $dropdown;
  };

  return DropdownCSS;
});

S2.define('select2/dropdown/tagsSearchHighlight',[
  '../utils'
], function (Utils) {
  function TagsSearchHighlight () { }

  TagsSearchHighlight.prototype.highlightFirstItem = function (decorated) {
    var $options = this.$results
    .find(
      '.select2-results__option--selectable' +
      ':not(.select2-results__option--selected)'
    );

    if ($options.length > 0) {
      var $firstOption = $options.first();
      var data = Utils.GetData($firstOption[0], 'data');
      var firstElement = data.element;

      if (firstElement && firstElement.getAttribute) {
        if (firstElement.getAttribute('data-select2-tag') === 'true') {
          $firstOption.trigger('mouseenter');

          return;
        }
      }
    }

    decorated.call(this);
  };

  return TagsSearchHighlight;
});

S2.define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    },
    removeAllItems: function () {
      return 'Remove all items';
    },
    removeItem: function () {
      return 'Remove item';
    },
    search: function() {
      return 'Search';
    }
  };
});

S2.define('select2/defaults',[
  'jquery',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/selectionCss',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',
  './dropdown/dropdownCss',
  './dropdown/tagsSearchHighlight',

  './i18n/en'
], function ($,

             ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, SelectionCSS, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,
             DropdownCSS, TagsSearchHighlight,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }

      if (options.tags) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          TagsSearchHighlight
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch !== 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      if (options.closeOnSelect) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          CloseOnSelect
        );
      }

      if (options.dropdownCssClass != null) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          DropdownCSS
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }

      if (options.allowClear) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          AllowClear
        );
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      if (options.selectionCssClass != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionCSS
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    // If the defaults were not previously applied from an element, it is
    // possible for the language option to have not been resolved
    options.language = this._resolveLanguage(options.language);

    // Always fall back to English since it will always be complete
    options.language.push('en');

    var uniqueLanguages = [];

    for (var l = 0; l < options.language.length; l++) {
      var language = options.language[l];

      if (uniqueLanguages.indexOf(language) === -1) {
        uniqueLanguages.push(language);
      }
    }

    options.language = uniqueLanguages;

    options.translations = this._processTranslations(
      options.language,
      options.debug
    );

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\\u0000-\\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if (params.term == null || params.term.trim() === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdLanguageBase: './i18n/',
      autocomplete: 'off',
      closeOnSelect: true,
      debug: false,
      dropdownAutoWidth: false,
      escapeMarkup: Utils.escapeMarkup,
      language: {},
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      scrollAfterSelect: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.applyFromElement = function (options, $element) {
    var optionLanguage = options.language;
    var defaultLanguage = this.defaults.language;
    var elementLanguage = $element.prop('lang');
    var parentLanguage = $element.closest('[lang]').prop('lang');

    var languages = Array.prototype.concat.call(
      this._resolveLanguage(elementLanguage),
      this._resolveLanguage(optionLanguage),
      this._resolveLanguage(defaultLanguage),
      this._resolveLanguage(parentLanguage)
    );

    options.language = languages;

    return options;
  };

  Defaults.prototype._resolveLanguage = function (language) {
    if (!language) {
      return [];
    }

    if ($.isEmptyObject(language)) {
      return [];
    }

    if ($.isPlainObject(language)) {
      return [language];
    }

    var languages;

    if (!Array.isArray(language)) {
      languages = [language];
    } else {
      languages = language;
    }

    var resolvedLanguages = [];

    for (var l = 0; l < languages.length; l++) {
      resolvedLanguages.push(languages[l]);

      if (typeof languages[l] === 'string' && languages[l].indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = languages[l].split('-');
        var baseLanguage = languageParts[0];

        resolvedLanguages.push(baseLanguage);
      }
    }

    return resolvedLanguages;
  };

  Defaults.prototype._processTranslations = function (languages, debug) {
    var translations = new Translation();

    for (var l = 0; l < languages.length; l++) {
      var languageData = new Translation();

      var language = languages[l];

      if (typeof language === 'string') {
        try {
          // Try to load it with the original name
          languageData = Translation.loadPath(language);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            language = this.defaults.amdLanguageBase + language;
            languageData = Translation.loadPath(language);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files
            if (debug && window.console && console.warn) {
              console.warn(
                'Select2: The language file for "' + language + '" could ' +
                'not be automatically loaded. A fallback will be used instead.'
              );
            }
          }
        }
      } else if ($.isPlainObject(language)) {
        languageData = new Translation(language);
      } else {
        languageData = language;
      }

      translations.extend(languageData);
    }

    return translations;
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(true, this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('select2/options',[
  'jquery',
  './defaults',
  './utils'
], function ($, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    if ($element != null) {
      this.options = Defaults.applyFromElement(this.options, $element);
    }

    this.options = Defaults.apply(this.options);
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.autocomplete == null && $e.prop('autocomplete')) {
      this.options.autocomplete = $e.prop('autocomplete');
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if (Utils.GetData($e[0], 'select2Tags')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The \`data-select2-tags\` attribute has been changed to ' +
          'use the \`data-data\` and \`data-tags="true"\` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      Utils.StoreData($e[0], 'data', Utils.GetData($e[0], 'select2Tags'));
      Utils.StoreData($e[0], 'tags', true);
    }

    if (Utils.GetData($e[0], 'ajaxUrl')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The \`data-ajax-url\` attribute has been changed to ' +
          '\`data-ajax--url\` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.attr('ajax--url', Utils.GetData($e[0], 'ajaxUrl'));
      Utils.StoreData($e[0], 'ajax-Url', Utils.GetData($e[0], 'ajaxUrl'));
    }

    var dataset = {};

    function upperCaseLetter(_, letter) {
      return letter.toUpperCase();
    }

    // Pre-load all of the attributes which are prefixed with \`data-\`
    for (var attr = 0; attr < $e[0].attributes.length; attr++) {
      var attributeName = $e[0].attributes[attr].name;
      var prefix = 'data-';

      if (attributeName.substr(0, prefix.length) == prefix) {
        // Get the contents of the attribute after \`data-\`
        var dataName = attributeName.substring(prefix.length);

        // Get the data contents from the consistent source
        // This is more than likely the jQuery data helper
        var dataValue = Utils.GetData($e[0], dataName);

        // camelCase the attribute name to match the spec
        var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);

        // Store the data attribute contents into the dataset since
        dataset[camelDataName] = dataValue;
      }
    }

    // Prefer the element's \`dataset\` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
      dataset = $.extend(true, {}, $e[0].dataset, dataset);
    }

    // Prefer our internal data cache if it exists
    var data = $.extend(true, {}, Utils.GetData($e[0]), dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if (excludedData.indexOf(key) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if (Utils.GetData($element[0], 'select2') != null) {
      Utils.GetData($element[0], 'select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = $element.attr('tabindex') || 0;
    Utils.StoreData($element[0], 'old-tabindex', tabindex);
    $element.attr('tabindex', '-1');

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element[0].classList.add('select2-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    Utils.StoreData($element[0], 'select2', this);

    // Ensure backwards compatibility with $element.data('select2').
    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\\.|\\[|\\]|,)/g, '');
    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
        var attr = attrs[i].replace(/\\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    if (method == 'computedstyle') {
      var computedStyle = window.getComputedStyle($element[0]);

      return computedStyle.width;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.dataAdapter.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.$element.on('focus.select2', function (evt) {
      self.trigger('focus', evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    this._observer = new window.MutationObserver(function (mutations) {
      self._syncA();
      self._syncS(mutations);
    });
    this._observer.observe(this.$element[0], {
      attributes: true,
      childList: true,
      subtree: false
    });
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle', 'focus'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('focus', function (params) {
      self.focus(params);
    });

    this.selection.on('*', function (name, params) {
      if (nonRelayEvents.indexOf(name) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container[0].classList.add('select2-container--open');
    });

    this.on('close', function () {
      self.$container[0].classList.remove('select2-container--open');
    });

    this.on('enable', function () {
      self.$container[0].classList.remove('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container[0].classList.add('select2-container--disabled');
    });

    this.on('blur', function () {
      self.$container[0].classList.remove('select2-container--focus');
    });

    this.on('query', function (params) {
      if (!self.isOpen()) {
        self.trigger('open', {});
      }

      this.dataAdapter.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.dataAdapter.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('keypress', function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ESC || (key === KEYS.UP && evt.altKey)) {
          self.close(evt);

          evt.preventDefault();
        } else if (key === KEYS.ENTER || key === KEYS.TAB) {
          self.trigger('results:select', {});

          evt.preventDefault();
        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
          self.trigger('results:toggle', {});

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous', {});

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next', {});

          evt.preventDefault();
        }
      } else {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            (key === KEYS.DOWN && evt.altKey)) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.isDisabled()) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable', {});
    } else {
      this.trigger('enable', {});
    }
  };

  Select2.prototype._isChangeMutation = function (mutations) {
    var self = this;

    if (mutations.addedNodes && mutations.addedNodes.length > 0) {
      for (var n = 0; n < mutations.addedNodes.length; n++) {
        var node = mutations.addedNodes[n];

        if (node.selected) {
          return true;
        }
      }
    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
      return true;
    } else if (Array.isArray(mutations)) {
      return mutations.some(function (mutation) {
        return self._isChangeMutation(mutation);
      });
    }

    return false;
  };

  Select2.prototype._syncSubtree = function (mutations) {
    var changed = this._isChangeMutation(mutations);
    var self = this;

    // Only re-pull the data if we think there is a change
    if (changed) {
      this.dataAdapter.current(function (currentData) {
        self.trigger('selection:update', {
          data: currentData
        });
      });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting',
      'clear': 'clearing'
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.isDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    if (this.isDisabled()) {
      return;
    }

    this.trigger('query', {});
  };

  Select2.prototype.close = function (evt) {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close', { originalEvent : evt });
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  Select2.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  Select2.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  Select2.prototype.isOpen = function () {
    return this.$container[0].classList.contains('select2-container--open');
  };

  Select2.prototype.hasFocus = function () {
    return this.$container[0].classList.contains('select2-container--focus');
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
      return;
    }

    this.$container[0].classList.add('select2-container--focus');
    this.trigger('focus', {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The \`select2("enable")\` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args == null || args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.data = function () {
    if (this.options.get('debug') &&
        arguments.length > 0 && window.console && console.warn) {
      console.warn(
        'Select2: Data can no longer be set using \`select2("data")\`. You ' +
        'should consider setting the value instead using \`$element.val()\`.'
      );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
      data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The \`select2("val")\` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args == null || args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if (Array.isArray(newVal)) {
      newVal = newVal.map(function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('input').trigger('change');
  };

  Select2.prototype.destroy = function () {
    Utils.RemoveData(this.$container[0]);
    this.$container.remove();

    this._observer.disconnect();
    this._observer = null;

    this._syncA = null;
    this._syncS = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex',
    Utils.GetData(this.$element[0], 'old-tabindex'));

    this.$element[0].classList.remove('select2-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    Utils.RemoveData(this.$element[0]);
    this.$element.removeData('select2');

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container[0].classList
      .add('select2-container--' + this.options.get('theme'));

    Utils.StoreData($container[0], 'element', this.$element);

    return $container;
  };

  return Select2;
});

S2.define('jquery-mousewheel',[
  'jquery'
], function ($) {
  // Used to shim jQuery.mousewheel for non-full builds.
  return $;
});

S2.define('jquery.select2',[
  'jquery',
  'jquery-mousewheel',

  './select2/core',
  './select2/defaults',
  './select2/utils'
], function ($, _, Select2, Defaults, Utils) {
  if ($.fn.select2 == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = Utils.GetData(this, 'select2');

          if (instance == null && window.console && console.error) {
            console.error(
              'The select2(\\'' + options + '\\') method was called on an ' +
              'element that is not using Select2.'
            );
          }

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning \`this\`
        if (thisMethods.indexOf(options) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));
`;new Function("module","require","window","jQuery",src)({},()=>$,window,$);function initSelect2(){$(".fos-select2").select2({placeholder:"Select a fos"})}function initForm(){$(document).on("click","#form_reset_button",function(){resetForm($("#filter_form"))});const n=[["selectAll","attributeform-"],["selectAllAllocations","allocationform-"],["selectAll","userform-"],["selectAll","users"],["selectAll","noteform-"],["selectAll","grantform-"],["selectAll","pubform-"],["selectAll","grantdownloadform-"]];for(const t of n)$("#"+t[0]).click(function(){$("input[name^='"+t[1]+"']").prop("checked",$(this).prop("checked"))}),$("input[name^='"+t[1]+"']").click(function(){$(this).attr("id")!=t[0]&&$("#"+t[0]).prop("checked",!1)})}function resetForm(n){n.find("input:text, input:password, input:file, select, textarea").val(""),n.find("input:radio, input:checkbox").removeAttr("checked").removeAttr("selected")}function initDataTable(){const n=document.querySelectorAll("div.table-responsive > table.datatable");for(const e of n)e!==null&&new DataTable(e,{pageLength:10,orderClasses:!1,order:[[1,"desc"]]});const t=document.querySelectorAll("div.table-responsive > table.datatable-long");for(const e of t)e!==null&&new DataTable(e,{pageLength:50,orderClasses:!1,order:[[1,"desc"]]})}function buildNativeHelpText(n){const t=n.getAttribute("title")||n.dataset.bsTitle||"",e=n.dataset.bsContent||"";return t&&e&&t!==e?`${t}: ${e}`:e||t||null}function initBootstrap(){for(const n of getElementsByQueryGenerator('[data-bs-toggle="tooltip"], [data-bs-toggle="popover"]')){const t=buildNativeHelpText(n);t&&(n.setAttribute("title",t),n.setAttribute("aria-label",t))}}Object.assign(window,{getCookie:function(n){getCookie(n)},drawGauges:function(n){drawGauges(n)},$,jQuery:$,bootstrap});function initDocument(){for(const n of[initDateSelector,initSelect2,initForm,initDataTable,initBootstrap])n()}document.readyState!=="loading"?initDocument():document.addEventListener("DOMContentLoaded",initDocument);
