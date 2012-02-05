/*
 * Projekt Orange - Orange-J -
 * Orange Extension for jQuery
 * Bringing even more advanced coding laziness to the developer
 * Version 2.4.2 - beta
 * author: Donovan Walker
 */
function SnippetLib(a){this.snippets={};this.isSnippetLib=true;this.reg={};this.reg.tagOpen=/\{#snippet name="([a-z]|[A-Z]|[0-9]|_)+" *\}/;if(typeof a=="object"||typeof a=="string"){this.add(a)}}SnippetLib.prototype.has=function(a){if(this.snippets.hasOwnProperty(a)){return(this.snippets[a])}return(false)};SnippetLib.prototype.add=function(a,f){if(typeof a=="object"){for(var e in a){if(a.hasOwnProperty(e)){this.snippets[e]=new Snippet(a[e],this)}}}else{if(typeof f=="string"){this.snippets[a]=new Snippet(f,this)}else{var d=a;while(true){var c=this.reg.tagOpen.exec(d);if(c==null){break}var b=c[0].substring(16,c[0].length-2);d=d.substring(d.indexOf(c[0])+c[0].length);this.snippets[b]=new Snippet(d.substring(0,d.indexOf("{/snippet}")),this);d=d.substring(d.indexOf("{/snippet}")+"{/snippet}".length)}}}};SnippetLib.prototype.fill=function(c,b,d){if(!this.snippets.hasOwnProperty(c)){var e="SnippetLib Error: snippet '"+c+"' not set";jQuery.log(e);return(false)}if(typeof d=="object"){if(d.hasOwnProperty("parent")){this.snippets[c].parent=d.parent;var a=this.snippets[c].fill(b);this.snippets[c].parent=false;return(a)}}return(this.snippets[c].fill(b))};SnippetLib.prototype.fillString=function(c,d){var b=new Snippet(c,this);var a=b.fill(d);delete (b);return(a)};function Snippet(c,n,j){var a,d;this.isSnippet=true;this.config={caseConvert:false,chopTo:false,collapsewhite:false,dateFormat:false,htmlentities:false,maxend:"",maxchop:0,maxlen:false,maxnohtml:false,maxwords:false,numberFormat:false};this.cycleInc=0;this.cycleName=false;this.cycleValues=[];this.defaultVal="";this.includeSnippet=false;this.inputString=c;this.key=null;this.listInc=0;this.listPos=0;this.parent=false;this.sLib=false;this.tag=null;this.type="";this.elements=[];if(typeof(j)=="object"&&j.isSnippet){this.parent=j}if(typeof(n)=="object"&&n.isSnippetLib){this.sLib=n}d=this.tagOpen.exec(c);if(!this.parent){this.tag="root{}";this.type=this.tagType(this.tag)}else{if(d===null){throw"Snippet Error: bad open tag"}this.tag=d[0].substring(1,d[0].length-1);this.type=this.tagType(this.tag);c=c.substring(d[0].length-1);switch(this.type){case"if":break;case"function":if(this.tag=="#func"){this.parseConfig(c.substring(1))}else{this.parseConfig(c.substring(1,c.indexOf("}}")))}c=c.substring(c.indexOf("}}")+2);break;default:this.parseConfig(c.substring(1,c.indexOf("}")));c=c.substring(c.indexOf("}")+1)}}if(this.type=="if"){this.key="";this.constructIf(c)}else{if(this.type=="elseif"){}else{if(this.type=="object"||this.type=="array"||this.type=="function"){if(this.type=="#func"){return(this)}this.key=this.tag.substring(0,this.tag.length-2);var l=null;var k=null;var m=c;var e=null;var g=0;while(true){d=this.tagOpen.exec(m);if(d==null){break}this.elements.push(m.substring(0,d.index));m=m.substring(d.index);k=d[0];var o=k.substring(1,k.length-1);l=this.tagType(o);switch(l){case"object":case"array":case"function":case"if":e=this.getCloseTag(o);var h=m.indexOf(k,k.length);var f=m.indexOf(e);if(f==-1){throw"Snippet Error: no close for '"+this.tagType(o)+"' "+o}var b=0;while(h<f&&h>-1){h=m.indexOf(k,h+k.length);f=m.indexOf(e,f+e.length);if(f==-1&&h==-1){throw"Snippet Error, no close for '"+this.tagType(o)+" "+o+"' iteration:"+b}b++}a=new Snippet(this.rework(o,l,m,f),this.sLib,this);this.elements.push(a);m=m.substring(f+e.length);break;case"literal":e="{/lit}";f=m.indexOf(e);if(f==-1){throw"Snippet Error: no close for '"+this.tagType(o)+"'"}this.elements.push(m.substring(6,f));m=m.substring(f+e.length);f=m.indexOf(e,f+e.length);break;default:f=m.indexOf("}");if(f==-1){throw"Snippet Error: no close for '"+o+"' near '"+c.substring(0,10)+"...'"}a=new Snippet(this.rework(o,l,m,f+1),this.sLib,this);this.elements.push(a);m=m.substring(f+1)}g++}this.elements.push(m)}else{this.key=this.tag}}}return(this)}Snippet.prototype.getCloseTag=function(d){var b,a,c;if(d.indexOf("#")==0){b=d.substring(1);if(d=="#func"){a="}}"}else{a="{/"+b+"}"}}else{c=d.substring(d.length-2);b=d.substring(0,d.length-2);a="{"+c+b+"}"}delete b,c;return a};Snippet.prototype.listLength=function(){return this.getObjValue("listLen")};Snippet.prototype.listPos=function(){return this.getObjValue("listPos")};Snippet.prototype.listIndex=function(){return this.getObjValue("listInc")};Snippet.prototype.arrayIndex=function(){return this.getObjValue("arrayInc")};Snippet.prototype.rework=function(b,e,a,d){var c="",h="";var g=a.substring(0,d);var f=b.split(".");if(b.indexOf(".")>0){switch(e){case"value":a=g.split(".");g=a.shift()+"{}}";g+="{"+a.join(".");break;case"object":case"array":g=g.substring(b.length+1);h+="{"+f.shift()+"{}}";while(f.length>1){c="{{}"+f[0]+"}"+c;h+="{"+f.shift()+"{}}"}g=h+"{"+f[0]+""+g+this.getCloseTag(f[0])+c}}return g};Snippet.prototype.reg={htmltag:/<(?:.|\s)*?>/,whitespaceG:/\s+/g,nbspG:/&nbsp;/g};Snippet.prototype.collapseWhite=function(a){a=a.replace(this.reg.nbspG," ");return a.replace(this.reg.whitespaceG," ")};Snippet.prototype.constructIf=function(c){var d=new Snippet("{#elseif"+c.substring(0,c.indexOf("}")+1),this.sLib,this.parent);var q=null;var h=null;var n=null;var e=null;var m=null;var o=c.substring(c.indexOf("}")+1);var p=null;var f=null;var j=0;while(true){e=this.tagOpen.exec(o);if(e==null){break}d.elements.push(o.substring(0,e.index));o=o.substring(e.index);m=e[0];if(m=="{#else"){q=m.substring(1)}else{q=m.substring(1,m.length-1)}n=this.tagType(q);switch(n){case"elseif":this.elements.push(d);d=new Snippet(o.substring(0,o.indexOf("}")+1),this.sLib,this.parent);o=o.substring(o.indexOf("}")+1);break;case"else":this.elements.push(d);d=new Snippet("{#elseif true}",this.sLib,this.parent);o=o.substring(o.indexOf("}")+1);break;case"object":case"array":case"function":case"if":f=this.getCloseTag(q);var l=o.indexOf(m,m.length);var g=o.indexOf(f);if(g==-1){throw"Snippet Error: no close for "+this.tagType(q)+" "+q}var b=0;while(l<g&&l>-1){l=o.indexOf(m,l+m.length);g=o.indexOf(f,g+f.length);if(g==-1&&l==-1){throw ("Snippet Error: no close for "+this.tagType(q)+" "+q+" iteration:"+b)}b++}var a=new Snippet(o.substring(0,g),this.sLib,this);d.elements.push(a);o=o.substring(g+f.length);break;default:g=o.indexOf("}");var k=o.substring(0,g+1);if(q!="#if"){var a=new Snippet(this.rework(q,n,o,g+1),this.sLib,this)}d.elements.push(a);o=o.substring(g+1)}j++}d.elements.push(o);this.elements.push(d)};Snippet.prototype.tagOpen=/{(#template |#lit\}|#func |#if |#elseif |#else|#include |([0-9]|[a-z]|[A-Z]|_)+(\.([0-9]|[a-z]|[A-Z]|_)+)*((\{\})|(\[\]|\(\)))*( |\}))/;Snippet.prototype.tagOpenCloseBrace=/(^|[^\\])}/;Snippet.prototype.tagType=function(b){var a="";if(b.substring((b.length-2))=="[]"){a+="array"}else{if(b.substring((b.length-2))=="{}"){a+="object"}else{if(b.substring((b.length-2))=="()"){a+="function"}else{if(b=="#func"){a+="function"}else{if(b=="#template"){a+="template"}else{if(b=="#if"){a+="if"}else{if(b=="#elseif"){a+="elseif"}else{if(b=="#else"){a+="else"}else{if(b=="#include"){a+="include"}else{if(b=="#func"){a+="func"}else{if(b=="#lit"){a+="literal"}else{a+="value"}}}}}}}}}}}return a};Snippet.prototype.fill=function(f){var c="";var h="";var g=typeof f;this.obj=f;if(g=="undefined"||f==null){f=this.getDefaultValue();g=typeof f}switch(this.type){case"value":f=(f!=null)?f.toString():"";if(this.config.striphtml){f=this.stripHTML(f)}if(this.config.maxlen&&(f.length>this.config.maxlen)){if(this.config.maxwords){var e=f.substring(0,(this.config.chopTo)+1).lastIndexOf(" ");var b=f.substring(0,this.config.chopTo+6).lastIndexOf("&nbsp;");if(e==this.config.chopTo-1||b==this.config.chopTo-1){f=f.substring(0,this.config.chopTo)}else{if(e>b&&e>0){f=f.substring(0,e)}else{if(b>0){f=f.substring(0,b)}else{f=f.substring(0,this.config.chopTo)}}}}else{f=f.substring(0,this.config.chopTo)}f=(this.config.htmlentities)?this.htmlentities(f)+this.config.maxend:f+this.config.maxend}else{if(this.config.htmlentities){f=this.htmlentities(f)}}if(this.config.numberFormat){f=f.toString().split(".");if(f[0].charAt(0)=="-"){c="-";f[0]=f[0].substring(1)}c+=this.config.numberFormat.intMask.substring(0,(this.config.numberFormat.intMask.length-f[0].length))+f[0];if(this.config.numberFormat.precisionMask){if(f.hasOwnProperty(1)){c+="."+(f[1].substring(0,this.config.numberFormat.precisionMask.length)+this.config.numberFormat.precisionMask).substring(0,this.config.numberFormat.precisionMask.length)}else{c+="."+this.config.numberFormat.precisionMask}}f=c}if(this.config.dateFormat){if(!isNaN(f-0)){this.dateConverter.setTime(f)}else{this.dateConverter.setTime(Date.parse(f))}f=this.dateConverter.format(this.config.dateFormat)}if(typeof this.config.caseConvert=="string"){switch(this.config.caseConvert){case"uppercase":f=f.toUpperCase();break;case"lowercase":f=f.toLowerCase();break;case"uppercaseFirst":f=f.substr(0,1).toUpperCase()+f.substring(1);break}}if(this.config.collapsewhite){f=this.collapseWhite(f)}return f;case"include":if(!this.sLib){throw"Snippet Error: cannot use include when not using SnippetLib";return("")}return this.sLib.fill(this.includeSnippet,f,{parent:this});case"function":h=this.myFunction.call(this.parent,f);if(this.tag=="#func"&&typeof(h)!="undefined"){return h.toString()}if(typeof(h)=="undefined"||h===false){return""}if(typeof(h)=="string"||typeof(h)=="number"){return(h)}return this.fillSnippets(f);case"if":for(var d=0;d<this.elements.length;d++){h=this.elements[d].fill(f);if(typeof h=="string"){c+=h;d=this.elements.length}}break;case"elseif":if(!this.myFunction.call(this.parent,f)){return false}return this.fillSnippets(f);case"object":if(this.tag=="root{}"){if(g=="number"||g=="string"){return this.fillSnippets({val:f})}else{if(g=="object"&&!(f instanceof Array)){return this.fillSnippets(f)}}}else{return this.fillSnippets(f)}case"array":this.cycleInc=this.arrayInc=this.listInc=0;this.listPos=1;if(!(f instanceof Array)){if(typeof(f)=="object"){this.listLen=jQuery.len(f);for(var a in f){if(f.hasOwnProperty(a)){this.arrayInc=a;if(this.cycleInc>=this.cycleValues.length){this.cycleInc=0}if(typeof(f[a])=="string"||typeof(f[a])=="boolean"||typeof(f[a])=="number"){c+=this.fillSnippets({val:f[a]})}else{c+=this.fillSnippets(f[a])}this.listInc++;this.listPos=this.listInc+1;this.cycleInc++}}}else{return(c+f)}}else{this.listLen=f.length;for(var a=0;a<f.length;a++){if(!this.config.maxlen||this.config.maxlen>a){this.arrayInc=this.listInc=a;this.listPos=this.listInc+1;if(this.cycleInc>=this.cycleValues.length){this.cycleInc=0}if(typeof(f[a])=="string"||typeof(f[a])=="boolean"||typeof(f[a])=="number"){c+=this.fillSnippets({val:f[a]})}else{c+=this.fillSnippets(f[a])}this.cycleInc++}else{c+=this.config.maxend;a=f.length}}}}this.obj=null;delete (this.obj);return(c)};Snippet.prototype.fillSnippets=function(d){var a="";var c=null;for(var b=0;b<this.elements.length;b++){c=this.elements[b];if(typeof(c)=="string"){a+=c}else{if(this.cycleName&&this.cycleName==c.tag){a+=c.fill(this.cycleValues[this.cycleInc])}else{switch(c.type){case"function":case"if":case"include":a+=c.fill(d);break;default:if(d!==null){if(typeof d[c.key]=="function"){a+=c.fill(d[c.key]())}else{a+=c.fill(d[c.key])}}}}}}return(a)};Snippet.prototype.getDefaultValue=function(){if(this.defaultVal.length==0&&this.parent){return(this.parent.getObjValue(this.key))}else{return(this.defaultVal)}};Snippet.prototype.getObjValue=function(a){if(typeof(this.obj)!="undefined"){if(this.type=="array"){if(this.obj.hasOwnProperty(this.arrayInc)&&this.obj[this.arrayInc]!==null&&this.obj[this.arrayInc].hasOwnProperty(a)){return this.obj[this.arrayInc][a]}}if(this.obj!=null&&this.obj.hasOwnProperty(a)){return(this.obj[a])}else{if(this.type=="array"){switch(a){case"arrayInc":return this.arrayInc;case"listInc":return this.listInc;case"listPos":return this.listPos;case"listLen":return this.listLen;case this.cycleName:return this.cycleValues[this.cycleInc]}}}return this.parentValue(a)}if(typeof this.parent!="undefined"){return this.parentValue(a)}return("")};Snippet.prototype.htmlentities=function(a){return a.replace(/&/gmi,"&amp;").replace(/"/gmi,"&quot;").replace(/>/gmi,"&gt;").replace(/</gmi,"&lt;")};Snippet.prototype.parentValue=function(b,a){if(this.parent){if(typeof a=="undefined"){return(this.parent.getObjValue(b))}else{alert("snippet-setting parent value not implemented!");this.parent.setObjValue(b,a)}}return("")};Snippet.prototype.parseConfig=function(inString){switch(this.type){case"function":inString=inString.substring(1);eval("this.myFunction = function(obj) {"+inString+"}");break;case"elseif":eval("this.myFunction = function(obj) { return("+inString+");}");break;case"include":inString=inString.substring(inString.indexOf('"')+1);this.includeSnippet=inString.substring(0,inString.indexOf('"'));break;default:var temp="";var index=inString.indexOf('default="');if(index>-1){temp=inString.substring(index+9);this.defaultVal=temp.substring(0,temp.indexOf('"'));inString=inString.replace('default="'+this.defaultVal+'"',"")}index=inString.indexOf('maxend="');if(index>-1){temp=inString.substring(index+8);this.config.maxend=temp.substring(0,temp.indexOf('"'));inString=inString.replace('maxend="'+this.defaultVal+'"',"")}index=inString.indexOf("cycleName=");if(index>-1){temp=inString.substring(index+10);this.cycleName=temp.substring(0,temp.indexOf(" "));temp=temp.substring(this.cycleName.length+1);temp=temp.substring(0,(temp.indexOf(" ")>0)?temp.indexOf(" "):temp.length);this.cycleValues=temp.split("|");inString=inString.replace("cycleName="+this.cycleName+" "+temp+"","")}index=inString.indexOf('numberFormat="');if(index>-1){temp=inString.substring(index+14);temp=temp.substring(0,temp.indexOf('"'));inString=inString.replace("numberFormat="+temp,"");temp=temp.split(".");this.config.numberFormat={intMask:temp[0],precisionMask:false};if(temp.length>1){this.config.numberFormat.precisionMask=temp[1]}}index=inString.indexOf('dateFormat="');if(index>-1){temp=inString.substring(index+12);temp=temp.substring(0,temp.indexOf('"'));if(typeof Date.prototype.format=="function"){this.config.dateFormat=temp;this.dateConverter=new Date()}inString=inString.replace("dateFormat="+temp,'"')}index=inString.indexOf("maxlen=");if(index>-1){temp=inString.substring(index+7);temp=temp.substring(0,(temp.indexOf(" ")>0)?temp.indexOf(" "):temp.length);this.config.maxlen=parseInt(temp);this.config.chopTo=this.config.maxlen;inString=inString.replace("maxlen="+temp,"")}index=inString.indexOf("maxwords");if(index>-1){this.config.maxwords=true;inString=inString.replace("maxwords")}index=inString.indexOf("maxchop=");if(index>-1){temp=inString.substring(index+8);temp=temp.substring(0,(temp.indexOf(" ")>0)?temp.indexOf(" "):temp.length);this.config.maxchop=parseInt(temp);if(this.config.maxlen){this.config.chopTo=this.config.maxlen-this.config.maxchop}inString=inString.replace("maxchop="+temp,"")}index=inString.indexOf("htmlentities");if(index>-1){temp=inString.substr(index,12);this.config.htmlentities=true;inString=inString.replace("htmlentities","")}index=inString.indexOf("striphtml");if(index>-1){temp=inString.substr(index,9);this.config.striphtml=true;inString=inString.replace("striphtml","")}index=inString.indexOf("collapsewhite");if(index>-1){temp=inString.substr(index,13);this.config.collapsewhite=true;inString=inString.replace("collapsewhite","")}index=inString.indexOf("maxnohtml");if(index>-1){this.config.maxnohtml=true;inString=inString.replace("maxnohtml","")}index=inString.indexOf("uppercaseFirst");if(index>-1){this.config.caseConvert="uppercaseFirst";inString=inString.replace("uppercaseFirst","")}index=inString.indexOf("uppercase");if(index>-1){this.config.caseConvert="uppercase";inString=inString.replace("uppercase","")}index=inString.indexOf("lowercase");if(index>-1){this.config.caseConvert="lowercase";inString=inString.replace("lowercase","")}}};Snippet.prototype.stripHTML=function(a){return a.replace(/(<([^>]+)>)/ig,"")};function KeyListener(a){this.delayedAction=false;this.config=a;if(!this.config.hasOwnProperty("keyCode")||!this.config.keyCode){this.config.keyCode=false}else{if(!this.config.keyCode.hasOwnProperty("onMatch")){this.config.keyCode.onMatch=false}if(!this.config.keyCode.hasOwnProperty("onMatchDelay")){this.config.keyCode.onMatchDelay=false}if(!this.config.keyCode.hasOwnProperty("onMatchPreventDefault")){this.config.keyCode.onMatchPreventDefault=false}if(!this.config.keyCode.hasOwnProperty("onFailed")){this.config.keyCode.onFailed=false}if(!this.config.keyCode.hasOwnProperty("onFailedPreventDefault")){this.config.keyCode.onFailedPreventDefault=false}}if(!this.config.hasOwnProperty("chars")||!this.config.chars){this.config.chars=false}else{if(!this.config.chars.hasOwnProperty("onMatch")){this.config.chars.onMatch=false}if(!this.config.chars.hasOwnProperty("onMatchDelay")){this.config.chars.onMatchDelay=false}if(!this.config.chars.hasOwnProperty("onMatchPreventDefault")){this.config.chars.onMatchPreventDefault=false}if(!this.config.chars.hasOwnProperty("onFailed")){this.config.chars.onFailed=false}if(!this.config.chars.hasOwnProperty("onFailedPreventDefault")){this.config.chars.onFailedPreventDefault=false}}if(!this.config.hasOwnProperty("regEx")||!this.config.regEx){this.config.regEx=false}else{if(!this.config.regEx.hasOwnProperty("expr")){alert("listener:ERROR: config.regEx.expr is missing. Regular expression actions disabled;");this.config.regEx=false}if(!this.config.hasOwnProperty("element")){alert("listener:WARNING: config.regEx requires config.element be  the listened DOM element (use document.getElementById )")}if(!this.config.regEx.hasOwnProperty("onMatch")){this.config.regEx.onMatch=false}if(!this.config.regEx.hasOwnProperty("onMatchDelay")){this.config.regEx.onMatchDelay=false}if(!this.config.regEx.hasOwnProperty("onMatchPreventDefault")){this.config.regEx.onMatchPreventDefault=false}if(!this.config.regEx.hasOwnProperty("onFailed")){this.config.regEx.onFailed=false}if(!this.config.regEx.hasOwnProperty("onFailedPreventDefault")){this.config.regEx.onFailedPreventDefault=false}}if(!this.config.hasOwnProperty("defaultAction")||!this.config.defaultAction){this.config.defaultAction=false}}KeyListener.prototype.executeAction=function(e,inAction){switch(typeof(inAction)){case"string":eval(inAction);break;case"function":inAction.call(this,e);break}};KeyListener.prototype.processKey=function(g){clearTimeout(this.delayedAction);var d=false;var i=false;var j=(g.keyCode)?g.keyCode:g.which;var f=String.fromCharCode(j);var b=false;var h=false;if(this.config.keyCode){if(this.config.keyCode.hasOwnProperty(j)){b=true;if(this.config.keyCode.onMatch){d=this.config.keyCode.onMatch}switch(typeof this.config.keyCode[j]){case"string":case"function":d=this.config.keyCode[j];break;case"boolean":if(!this.config.keyCode[j]){d=false}}i=this.config.keyCode.onMatchDelay;h=this.config.keyCode.onMatchPreventDefault}else{d=this.config.keyCode.onFailed;h=this.config.keyCode.onFailedPreventDefault}}if(!b&&this.config.chars){if(this.config.chars.hasOwnProperty(f)){b=true;if(this.config.keyCode.onMatch){d=this.config.keyCode.onMatch}switch(typeof this.config.keyCode[j]){case"string":case"function":d=this.config.keyCode[j];break;case"boolean":if(!this.config.keyCode[j]){d=false}}i=this.config.chars.onMatchDelay;h=this.config.chars.onMatchPreventDefault}else{d=this.config.chars.onFailed;h=this.config.chars.onFailedPreventDefault}}if(!b&&this.config.regEx){var a=this.config.element.value.substring(0,this.config.element.selectionStart);a+=f;a+=this.config.element.value.substring(this.config.element.selectionEnd);if(this.config.regEx.expr.test(a)){d=this.config.regEx.onMatch;i=this.config.regEx.onMatchDelay;h=this.config.regEx.onMatchPreventDefault}else{if(this.config.regEx.onFailed){d=this.config.regEx.onFailed}if(this.config.regEx.onFailedPreventDefault){h=this.config.regEx.onFailedPreventDefault}}delete a}if(!b&&this.config.defaultAction){d=this.config.defaultAction}if(h){if(g.preventDefault){g.preventDefault()}if(g.stopPropagation){g.stopPropagation()}}if(d){if(!i){this.executeAction(g,d)}else{var c=this;this.delayedAction=setTimeout(function(){c.executeAction(g,d)},i)}}delete b,d,i,j,f,h};KeyListener.prototype.prevent=function(b,a){switch(a){case"both":case"default":if(b.preventDefault){b.preventDefault()}if(a!="both"){break}case"propagation":if(b.stopPropagation){b.stopPropagation()}}};if(typeof(jQuery)=="function"){jQuery.oj={vars:{regex:{email:/^([A-Za-z0-9_\+\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/},slReady:false},sl:new SnippetLib(),snippet:function(b,a){return(jQuery.oj.sl.fill(b,a))},snippetString:function(b,a){return(jQuery.oj.sl.fillString(b,a))},hasSnippet:function(a){return(jQuery.oj.sl.has(a))},snippetReady:function(a){if(jQuery.oj.vars.slReady){a()}else{setTimeout(function(){jQuery.snippetReady(a)},250)}},setSnippetLib:function(a){jQuery.oj.sl.add(a)},addSnippet:function(a,b){jQuery.oj.sl.add(a,b)},getSnippets:function(inSnippetURLs,getSnippetCB){if(typeof inSnippetURLs=="object"){for(var i in inSnippetURLs){if(inSnippetURLs.hasOwnProperty(i)){eval("jQuery.ajax({type:'GET', url:inSnippetURLs[i], success: function(snippet) { jQuery.oj.sl.add(\""+i+"\", snippet); if(typeof getSnippetCB == 'function') getSnippetCB(\""+i+"\")}, error: function(XMLHttpRequest, textStatus, errorThrown){ if(typeof getSnippetCB == 'function') getSnippetCB(\""+i+"\", false); jQuery.log('error:' + textStatus + ' ' + errorThrown);}});")}}}else{jQuery.oj.vars.slReady=false;jQuery.ajax({type:"GET",url:inSnippetURLs,success:function(snippet){jQuery.oj.sl.add(snippet);if(typeof getSnippetCB=="function"){getSnippetCB()}},error:function(XMLHttpRequest,textStatus,errorThrown){if(typeof getSnippetCB=="function"){getSnippetCB(false)}jQuery.log("error:"+textStatus+" "+errorThrown)}})}},attrList:function(b,c){var d=[];for(var a in b){if(b.hasOwnProperty(a)){d.push(a)}}delete a;return(d)},fillForm:function(e,a,b){var d=(typeof(a)!="undefined")?a:"";var f=(typeof(b)!="undefined")?b:"";for(var c in e){if(e.hasOwnProperty(c)){jQuery("#"+d+c+f).val(e[c])}}delete c,d},objFromDom:function(a,b,d){var c={DOMPrefix:"",DOMSuffix:"",stripPrefix:true,stripSuffix:true};if(typeof b=="object"){jQuery.extend(c,b)}else{if(typeof b=="string"){c.DOMPrefix=b}if(typeof d=="string"){c.DOMSuffix=d}}var f={};c.stripPrefix=(c.stripPrefix)?"":c.DOMPrefix;c.stripSuffix=(c.stripSuffix)?"":c.DOMSuffix;for(var e in a){if(a.hasOwnProperty(e)){f[c.stripPrefix+a[e]+c.stripSuffix]=jQuery("#"+c.DOMPrefix+a[e]+c.DOMSuffix).val()}}return(f)},ofd:function(a,b,c){return(jQuery.oj.objFromDom(a,b,c))},log:function(){if(typeof(console)!="undefined"){if(typeof(console.log)=="function"){for(var a=0;a<arguments.length;a++){console.log(arguments[a])}return true}}return false},urlParam:function(b,a){return this.urlArg(window.location.href,b,a)},urlArg:function(a,c,b){a=jQuery.oj.urlParse(a);if(typeof c=="undefined"){return a}if(a.hasOwnProperty(c)){return a[c]}if(typeof b!="undefined"){return b}return false},urlParse:function(c){var b,a=c.split("?");a.args={};if(a.length==1){a.shift("")}if(a[1].indexOf("#")>-1){a.args["#"]=a[1].substring(a[1].indexOf("#")+1);a[1]=a[1].slice(0,a[1].indexOf("#"))}a.argList=a[1].split("&");for(var d in a.argList){if(a.argList.hasOwnProperty(d)){a.argList[d]=a.argList[d].split("=");if(a.argList[d][0].indexOf("[]")==a.argList[d][0].length-2){b=a.argList[d][0].substring(0,a.argList[d][0].length-2);if(!a.args.hasOwnProperty(b)){a.args[b]=[]}if(a.argList[d].length>1){a.args[b].push(a.argList[d][1])}}else{a.args[a.argList[d][0]]="";if(a.argList[d].length>1){a.args[a.argList[d][0]]=a.argList[d][1]}}}}return a.args},len:function(g,h){var d=jQuery.extend({all:false,getArray:false,filterOut:["function"]},h);var c=[];var b,e,a,f;for(e in g){if(d.all||g.hasOwnProperty(e)){a=typeof g[e];f=true;for(b=0;b<d.filterOut.length;b++){if(a==d.filterOut[b]){f=false;break}}if(f){c.push(g[e])}}}if(d.getArray){return c}return c.length},ro:function(a,c,b){var d={ok:true,data:"",message:""};if(typeof b=="string"){d.message=b}if(typeof c!="undefined"){d.data=c}switch(typeof a){case"undefined":return d;case"boolean":d.ok=a;return d;default:d.data=a;return d}},validate:function(b,a){if(typeof(a)=="string"){if(jQuery.oj.vars.regex.hasOwnProperty(b)){return(jQuery.oj.vars.regex[b].test(a))}}if(typeof(a)!="undefined"&&a.constructor==RegExp){jQuery.oj.vars.regex[b]=a;return(true)}return(false)}};jQuery.fn.urlParse=function(b){var a=window.location.href;if($(this).length>0){if(typeof attr==="undefined"){a=$(this).attr("href")}else{a=$(this).attr(b)}}else{if(typeof this.selector=="string"&&this.selector.length>0){a=this.selector}}return jQuery.oj.urlParse(a)};jQuery.fn.listen=function(b){if(!b.hasOwnProperty("element")){b.element=this}var a=new KeyListener(b);switch(b.keystroke){case"keydown":this.keydown(function(c){a.processKey(c)});break;case"keyup":this.keyup(function(c){a.processKey(c)});break;case"keypress":default:this.keypress(function(c){a.processKey(c)})}return(this)};jQuery.fn.validate=function(a){if(typeof(a)=="string"){if(jQuery.oj.vars.regex.hasOwnProperty(a)){if(jQuery.oj.vars.regex[a].test(this.val())){return(this.val())}}return(false)}return(false)};jQuery.fn.addSnippet=function(a){this.each(function(b,c){if(typeof a=="string"){jQuery.oj.sl.add(a,c.innerHTML)}else{jQuery.oj.sl.add(c.innerHTML)}});return(this)};jQuery.fn.snippet=function(c,a){var b=jQuery.oj.sl.fill(c,a);this.each(function(d,e){if(e.tagName.toLowerCase()=="input"||e.tagName.toLowerCase()=="textarea"){e.value=b}else{e.innerHTML=b}});return(this)};jQuery.fn.snippetAfter=function(c,a){var b=jQuery.oj.sl.fill(c,a);this.after(b);return(this)};jQuery.fn.snippetAppend=function(c,a){var b=jQuery.oj.sl.fill(c,a);this.append(b);return(this)};jQuery.fn.snippetBefore=function(c,a){var b=jQuery.oj.sl.fill(c,a);this.before(b);return(this)};jQuery.fn.snippetPrepend=function(c,a){var b=jQuery.oj.sl.fill(c,a);this.prepend(b);return(this)};jQuery.fn.snippetString=function(b,a){this.html(jQuery.oj.sl.fillString(b,a));return(this)};for(var ojfunc in jQuery.oj){if(jQuery.oj.hasOwnProperty(ojfunc)&&typeof(jQuery.oj[ojfunc])=="function"){if(jQuery.hasOwnProperty(ojfunc)&&(ojfunc!="serialize")){jQuery.oj.log("jQuery already has function: "+ojfunc)}else{switch(ojfunc){case"serialize":jQuery.serializeObj=jQuery.oj[ojfunc];break;default:jQuery[ojfunc]=jQuery.oj[ojfunc]}}}}}else{sl=new SnippetLib()}Date.prototype.format=function(e){var d="";var c=Date.replaceChars;for(var b=0;b<e.length;b++){var a=e.charAt(b);if(b-1>=0&&e.charAt(b-1)=="\\"){d+=a}else{if(c[a]){d+=c[a].call(this)}else{if(a!="\\"){d+=a}}}}return d};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?"st":(this.getDate()%10==2&&this.getDate()!=12?"nd":(this.getDate()%10==3&&this.getDate()!=13?"rd":"th")))},w:function(){return this.getDay()},z:function(){var a=new Date(this.getFullYear(),0,1);return Math.ceil((this-a)/86400000)},W:function(){var a=new Date(this.getFullYear(),0,1);return Math.ceil((((this-a)/86400000)+a.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var a=new Date();return new Date(a.getFullYear(),a.getMonth(),0).getDate()},L:function(){var a=this.getFullYear();return(a%400==0||(a%100!=0&&a%4==0))},o:function(){var a=new Date(this.valueOf());a.setDate(a.getDate()-((this.getDay()+6)%7)+3);return a.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor((((this.getUTCHours()+1)%24)+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1000/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var a=this.getMilliseconds();return(a<10?"00":(a<100?"0":""))+a},e:function(){return"Not Yet Supported"},I:function(){return"Not Yet Supported"},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+(Math.abs(this.getTimezoneOffset()/60))+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+(Math.abs(this.getTimezoneOffset()/60))+":00"},T:function(){var b=this.getMonth();this.setMonth(0);var a=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(b);return a},Z:function(){return -this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1000}};