/*
 * Projekt Orange - Orange-J -
 * Orange Extension for jQuery
 * Bringing even more advanced coding laziness to the developer
 * Version 3.1 - alpha
 * author: Donovan Walker
 *
 * At the moment a totally non functional pile o crap
 *
 */
/*
Ok! Updated
Automatic upward traversal is still supported, but there are a couple other
syntax elements added to our tags to make sure you have more precise control over
what you get.

1. anything that begins with a "#" takes 'the current' node in the tree. This is just
something that's become apparent as Orange-J has progressed. Making it a standard
allows us to say '{#}' and have the snippet engine spit out whatever the current
node is without needing to count on the ambiguities of upward traversal.

2. required/specific traversal
'../' go up exactly one level to get your value. These are chainable, so one can
say '../../../' to go up three levels.

'.' perform traversal if begins with this

3. Functions now always begin with '{#func '.
But they may still be used to output true/false/string if you so desire. If you
wish to have it always output the response of the function, the closing of a
function is now '}/}'. if you wish to encapsulate a collection of sub-templates
you would close the function with '}}' and then close the sub template with
{/func}
*??idea??functions are now called off the current object, as are attributes that are functions.
* in both cases they are passed in the current snippet.
**please note, 'func' is now a reserved name

4. Template tags are now accessed by putting a star at the beginning ex:'*tagname'

*??IDEA??
* Put this thing in a closure in such a way that we can update/change the tag enclosure (by default is { and }) so that
* the regular expressions can be 're compiled'

 */
//;(function() {
/**
 * src may be a template string:"", or a configuration object:{}

 * 'root' snippets should only be contstructed with template strings. Configuration objects are for internal use only
 * src:"" - a template string optinally containing special markup indicating lists, values, etc to be populated when the
 * template is 'filled'
 *
 * src:{}
 *		.src		("")				//the containing template string
 *		.parent	(Snippet)		//the parent Snippet
 *		.lib		(SnippetLib)	//the Snippet library
 *		.tag		({})				//containing this Snippet's tag information (see function openTag for more details)
 *			.open			("")		//full open tag up to the }
 *			.options		("")		//options after the key expresion
 *			.key			("")		//the current key (not stripped of '.' sub-children), but stripped of the 'type'
 *			.traverse	(Number)	//number of parents to traverse 'up'
 *			.type			("")		//value, object, list
 */
function Snippet(src, Q) {

  /**/ var i, openTag, src, tmpKey;
   Q = (typeof Q == "number")? Q+1:0
	console.log("New Snippet. Level " + Q);
	console.log(src);
	this.children	= [];
	this.key			= '#';
	this.parent		= false;
   this.lib			= false;
	this.src			= '';
	this.transforms = [];


	if(typeof src == 'string') {
		if(arguments.length > 1) {
			this.lib = arguments[1];
		}
		this.src = src;
		this.tag = {
         open:'{#{}}',
         key:'#',
			fullKey:'#',
			type:'object',
			options:false,
			traverse:0
      }
	} else {
		this.lib = src.lib;
		this.src = src.src;
		this.parent = src.parent;
		this.tag = src;
		console.log(this.tag.fullKey);

		/**TODO
		 * here determine the 'key' src.from fullKey
		 * if the fullKey has dots in it then the key is the string before the first '.'
		 * 1. clone the src
		 * 2. change this snippet's type to 'object'
		 * 3. take the copied src and remove everything upto and including the first '.' from the fullKey
		 * 4. use this modified src to create a new snippet in 'children'
		 * 5. return, skipping the additional child fill process (since there will only be one child)
		 *
		 */

	}

	this.fill = this['fill' + this.tag.type];
	//console.log('fill' + this.tag.type, this['fill' + this.tag.type])

	if(this.tag.up) {
		for(i = this.tag.up; i > 0; i--) {
			if(this.parent.parent) {
				this.parent = this.parent.parent;
			}
		}
	}
	/*
	 * Here we look at full key, generate the current key, and modify the source if there is a dot-syntaxed element
	 */
	tmpKey = this.tag.fullKey.split('.');
	this.tag.key = this.key = tmpKey.shift();
	console.log(this.tag.key + ' (' + this.tag.fullKey + ') [' + tmpKey.join('|') + '] src: ||' + this.src + '||')
	if(tmpKey.length > 0) {

		tmpKey = tmpKey.join('.');
		if(this.tag.traverse) {
			console.log('traverse');
			tmpKey = '.' + tmpKey;
		}
		console.log('tmpKey:[' + tmpKey + ']');
		switch(this.tag.type) {
			case this.OBJECT :
				this.src = '{' + tmpKey  + this.OBJECT_SYMBOL  + ' ' + this.tag.optionStr + '}' + this.src + '{' + this.OBJECT_SYMBOL + tmpKey + '}';
				break;
			case this.LIST :
				this.src = '{' + tmpKey  + this.LIST_SYMBOL  + ' ' + this.tag.optionStr + '}' + this.src + '{' + this.LIST_SYMBOL + tmpKey + '}';
				break;
			case this.VALUE :
				this.src = '{' + tmpKey +' ' + this.tag.optionStr + '}' + this.src;
				break;
		}

		/**
		 * Change this type to object.
		 */
		this.tag.type = this.OBJECT;
	}
	console.log(this.tag.key + ' src: ||' + this.src + '||')


	src = this.src;
	i = 0;
	while(src.length > 0 && i < 100) {
			console.log('i = ', i);
			openTag = this.openTag(src);
			if(!openTag) {
				this.children.push(src);
				src = '';
			} else {
				openTag.parent = this;
				if(openTag.openIndex > 0) {
					this.children.push(src.substring(0, openTag.openIndex));
				}
				//find the closing tag if there is one.
				src = openTag.src;
				if(!openTag.close) {
						openTag.src = '';
				} else {
					//find the correct closing tag
				}
				this.children.push(new Snippet(openTag, Q));
				//find child snippets and static strings from source
			}
			i++
		}

   //var tag //child tag
   /*;
   this.parent = false;
   this.lib = false;
   this.src = src.src;
   if(src.hasOwnProperty('lib') ) {
      this.lib = src.lib;
   }
   if(!src.hasOwnProperty('tag'))  {
      this.tag = {
         open:"{root{}}",
         fullKey:"root{}"
      }
      this.type = this.tagType(this.tag);
   } else {
      this.parent = src.parent;
   }
   this.parseConfig(src.tag.fullKey);
   src = this.src.substring(src.tag.openLength - 1);
   var i = 0;
   while(true && i < 5) {
      i++;
      tag = this.openTag(src);
      if(!tag) break;
      tag.closeIndex = this.closeTagIndex(src, tag);
   }
*/
}

/*
Snippet.prototype.fill = function(obj) {
	return this.render(obj);
	obj = (typeof obj === 'undefined' || obj === null)? '' : obj; //this should be replaced with something more context appropriate.
	switch(this.tag.type) {
		case this.VALUE :
			out = obj.toString();
			for(i = 0; )
		case this.OBJECT :

	}
}*/


Snippet.prototype.fill = function() {
	return '\n Fill for this snippet key:' + this.tag.key + ' type:' + this.tag.type + ' is undefined.\n';
}


Snippet.prototype.fillobject = function(obj) {
	var child, i, out = '';
	this.obj = obj;
	//handle obj begin passed in a null value here
	for(i = 0; i < this.children.length; i++) {
		if(typeof this.children[i] === 'string') {
			out += this.children[i];
		} else {
			child = this.children[i];
			console.log('child', child);
			if(child.tag.tag[0] == '#') {
				out += child.fill(obj);
			} else {
				out += child.fill(obj[child.tag.key]);
			}
		}
	}
	return out;
}


Snippet.prototype.fillvalue = function(obj) {
	console.log('fill ' + this.tag.key + ':', obj);
	var i, out = (obj)? obj.toString() : '';
	for(i = 0; i < this.transforms.length; i++) {
		out = this.transforms[i].call(this, out);
	}
	return out;
}


/**
 * Determines the location and basic properties pf the first opening tag within 'src'.
 * It does NOT determine the location of the closing tag (if there is one)
 * @param {string} src containing a properly formatted tag.
 */
Snippet.prototype.openTag = function (src) {
	//console.log('OPEN TAG');
	//initialize the configuration with appropriate defaults & find the opening of the next tag.
   var cfg = {
      close:false,      //the close tag, if one is needed
      open:this.r.tagOpen.exec(src), //the actual open tag
      openIndex:false,  //where the tag starts in the source string
      fullKey:false,    //gives you enough to determine the path, and the attribute you should be getting data from, but not the type
      key:'#',        //just the attribute you should be getting data from
      optionStr:false,  //logic, options, etc (modifiers for this key)
		src:'',
      tag:false,        //tag can be everything but the '{', '[options/logic]}'
      traverse:false,    //should we traverse up the tree if the current context has no value? traverse should only be true when the tag begins with '.'
      type:false,     //what kind of Snippet should it be? (function, value, etc)
		up:false
   };

	/*
	 *{../asdf.asdf[]}
	 *{[]../asdf.asdf}
	 */
   //if there isn't another tag opening return false to the caller
   if(cfg.open === null) return false;
   //parse configuration values not dependent on tag type.
   cfg.openIndex  = cfg.open.index;
   cfg.open       = cfg.open[0]
   cfg.tag        = cfg.open.substring(1);
   cfg.fullKey    = cfg.tag;
   cfg.optionStr  = src.substring(cfg.openIndex + cfg.open.length); //Might seem a little silly, but to avoid extra closure overhead we're assigning optionStr before we've cut the tail off
   //the tag type will determine how the rest of tagOpen runs (closing tag, configuration, etc)
	cfg.type       = this.tagType(cfg.tag);

	   //find end of opening tag, and give closing tag if appropriate
   if(cfg.type == this.FUNCTION) {
      cfg.close = this.r.tagCloseFunction.exec(cfg.optionStr);
      cfg.optionStr = cfg.optionStr.substring(0, cfg.close.index).replace(this.r.whitespaceLeading, '').substring(1);
      cfg.open = src.substring(cfg.openIndex, cfg.openIndex + cfg.open.length + cfg.close.index + cfg.close[0].length)
      if(cfg.close[0] == this.TC_FUNC_VAL) {
         cfg.close = false;
      } else { //if (match[0] == this.TC_FUNC_VAL) {
         cfg.close = this.FUNCTION_CLOSE;
      }
      cfg.cfgString = src.substring()
   } else {
      cfg.close = this.r.tagClose.exec(cfg.optionStr);
      cfg.optionStr = cfg.optionStr.substring(0, cfg.close.index).replace(this.r.whitespaceLeading, '');
      cfg.open = src.substring(cfg.openIndex, (cfg.openIndex + cfg.open.length + cfg.close.index + cfg.close[0].length));
      cfg.close = false;
		switch(cfg.type) {

		}
   }



   //console.log('cfg.optionStr - post trim', '"' + cfg.optionStr + '"')
	//CLOSE TAG ASSGINMENT FOR NON FUNCTIONS (FUNCTION BLOCK IN PLACE TO SHOW IT WASN'T FORGOTTEN.. PERHAPS SHOULD BE MOVED WITHIN 'ELSE' BLOCK ABOVE
   switch(cfg.type) {
      case this.FUNCTION :
         break;

      case this.IF :
      case this.ELSEIF :
      case this.ELSE :
         //cfg.close = this.r.tagClose.exec(src.substring(cfg.openIndex));
         //cfg.open = src.substring(cfg.openIndex, cfg.openIndex + cfg.close.index + cfg.close[0].length)
         cfg.close = this.IF_CLOSE;
         break;
      case this.OBJECT :
         cfg.open = cfg.open[0];
         cfg.fullKey = cfg.tag(0, cfg.tag.length -3)
         cfg.close = '{' + this.OBJECT_SYMBOL + cfg.fullKey + '}';
         break;

      case this.LIST :
         cfg.open = cfg.open[0];
         cfg.fullKey = cfg.tag(0, cfg.tag.length -3)
         cfg.close = '{' + this.LIST_SYMBOL + cfg.fullKey + '}';
         break;

      case this.LITERAL :
         cfg.open = cfg.open[0];
         cfg.close = this.LITERAL_CLOSE;
         break;

      case this.VAR :
         break;

      case this.VALUE :
//         console.log(cfg.open)
  //       console.log("open: '" + cfg.open[0].substring(cfg.open[0].length -1) + "'")
         /*if(cfg.open.substring(cfg.open.length -1) === " ") {
            cfg.close = this.r.tagClose.exec(src.substring(cfg.openIndex));
            console.log('cfg.close',cfg.close)
            cfg.open = src.substring(cfg.openIndex, cfg.openIndex + cfg.close.index + cfg.close[0].length)
            //cfg.close = false;
         }*/
         break;
   }

	//dermine where the tag is supposed to get it's values from
	cfg.traverse = cfg.fullKey.split('../');
	cfg.up = cfg.traverse.length - 1; //start this number of objects 'up' in the tree.
	cfg.fullKey = cfg.traverse.join('');
	console.log('tagOpen - cfg.fullKey (' + cfg.fullKey + ')');
	if(cfg.fullKey[0] === '.') {
		console.log('traverse for key: ' + cfg.fullKey);
		cfg.traverse = true; //allow upward traversal to get values
		cfg.fullKey = cfg.fullKey.substring(1);
	} else {
		cfg.traverse = false;
	}


	/**
	 * NEXT
	 * Determine traversal here from 'fullKey'
	 * Strip fullKey of traversal component
	 */

	cfg.src = src.substring(cfg.openIndex + cfg.open.length);

   /*if((cfg.type != this.FUNCTION)) {
      cfg.optionStr = cfg.optionStr.substring(0, cfg.optionStr.indexOf('}'));
   }*/
   console.log('cfg: ' + cfg.open + ':', cfg)
   return cfg;
}

Snippet.prototype.parseConfig = function(){}
/*
Snippet.prototype.getKey = function(inTag) {

}

Snippet.prototype.closeTag = function(inTag) {

   var key, closeTag, tagSuffix;
   if(inTag.indexOf("#") == 0) {
      key = inTag.substring(1);
      if(inTag == "#func") {
         closeTag = "}}";
      } else {
         closeTag = "{/" + key + "}";
      }
   } else {
      tagSuffix = inTag.substring(inTag.length - 2);
      key 	= inTag.substring(0, inTag.length - 2);

      closeTag = "{" + tagSuffix + key + "}";
   }
   delete key, tagSuffix;
   console.log('getCloseTag->' + closeTag);
   return closeTag;
}
*/


/**
* Every tag in the template has a type: value, object, list, function, etc...
* This function determines what that type is based on a number of characteristics
* It assumes delimiters '{' and '}' as well as tag options have been removed.
*
*/
Snippet.prototype.tagType = function(inTag) {
   if(inTag.substring((inTag.length - 2)) == "[]") {
      return this.LIST;
   } else if(inTag.substring((inTag.length - 2)) == "{}") {
      return this.OBJECT;
   } else if(inTag.indexOf("#func") === 0) {
      return this.FUNCTION;
   } else if(inTag.indexOf("#if") === 0) {
      return this.IF;
   } else if(inTag.indexOf("#elseif") === 0) {
      return this.ELSEIF;
   } else if(inTag.indexOf("#else") === 0) {
      return this.ELSE;
   } else if(inTag.indexOf("#include") === 0) {
      return this.INCLUDE;
   } else if(inTag.indexOf("#lit") === 0)  {
      return this.LITERAL;
   } else if(inTag.indexOf('*') === 0) {
      return this.VAR;
   }
   return this.VALUE;
}

//CLASS CONSTANTS & 'GLOBALS
Snippet.prototype.r = {
   htmltag:/<(?:.|\s)*?>/,
	whitespaceLeading:/\s+/,
   whitespaceG:/\s+/g,
   nbspG:/&nbsp;/g,
   //tagOpen: /{(#template |#lit\}|#func |#if |#elseif |#else|#include |#\[\]}|#}|(\.\.\/)*(\*([a-z]|[A-Z])+|([0-9]|[a-z]|[A-Z]|_)+(\.([0-9]|[a-z]|[A-Z]|_)+)*((\{\})|(\[\]))*)( |\}))/, //added support for '.' and vars that begin with numbers
	//tagOpen: /{((((\*|#)([a-z]|[A-Z])+)|(((\.\/)|(\.\.\/)*)([0-9]|[a-z]|[A-Z]|_)+(\.([0-9]|[a-z]|[A-Z]|_)+)*))((\{\})|(\[\]))?)/, //this tag recognizes all matches above (and more)
	tagOpen: /{((((\*|#)([a-z]|[A-Z])+)|(((\.\/)|(\.\.\/)*)(\.?([0-9]|[a-z]|[A-Z]|_)+)*))((\{\})|(\[\]))?)/, //this tag recognizes all matches above (and more)
   parentG: /\.\.\//g,
   tagCloseFunction:/}\/}|}}/,
   tagClose: /^}|[^\\]}/
}

Snippet.prototype.TC_FUNC_MULTI	= "}}";
Snippet.prototype.TC_FUNC_VAL		= "}/}";
Snippet.prototype.LIST				= 'list';
Snippet.prototype.LIST_SYMBOL		= '[]';
Snippet.prototype.OBJECT			= 'object';
Snippet.prototype.OBJECT_SYMBOL	= '{}';
Snippet.prototype.FUNCTION			= 'function';
Snippet.prototype.FUNCTION_CLOSE = '{/func}';
Snippet.prototype.IF					= 'if';
Snippet.prototype.IF_CLOSE			= "{/if}"
Snippet.prototype.ELSEIF			= 'elseif';
Snippet.prototype.ELSE				= 'else';
Snippet.prototype.INCLUDE			= 'include';
Snippet.prototype.LITERAL			= 'literal';
Snippet.prototype.LITERAL_CLOSE	= 'literal_close';
Snippet.prototype.STRING			= 'string';
Snippet.prototype.VALUE				= 'value';
Snippet.prototype.VAR				= 'var';

//})();
//{#func {'some code' }/} {/func}

//next tackle simple value tags in a snippet. (see the snippet structure @ the end.