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

'.' stay here. no traversal

3. Functions now always begin with '{#func '.
But they may still be used to output true/false/string if you so desire. If you
wish to have it always output the response of the function, the closing of a
function is now '}/}'. if you wish to encapsulate a collection of sub-templates
you would close the function with '}}' and then close the sub template with
{/func}
**please note, 'func' is now a reserved name

4. Template tags are now accessed by putting a star at the beginning ex:'*tagname'


 */

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
function Snippet(src) {
  /* var i, openTag, src;

	this.children	= [];
	this.parent		= false,
   this.lib			= false,
	this.src			= ''

	if(typeof src == 'string') {
		if(arguments.length > 1) {
			this.lib = arguments[1];
		}
		this.src = src;
		this.tag = {
         open:'{#{}}',
         key:'#',
			type:'object',
			options:false,
			traverse:0
      }
	} else {
		this.lib = src.lib;
		this.src = src.src;
		this.parent = src.parent;
		this.tag = src.tag;
	}
	if(this.tag.traverse) {
		for(i = this.tag.traverse; i > 0; i--) {
			if(this.parent.parent) {
				this.parent = this.parent.parent;
			}
		}
	}

	src = this.src;

	while(src.length > 0) {
		openTag = this.openTag(src);
		if(!openTag) {
			this.children.push(src);
		} else {


			//find child snippets and static strings from source
		}
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

/**this needs to output the configuration as an object**/
Snippet.prototype.openTag = function (src) {
   var cfg = {
      close:false,      //the close tag, if one is needed
      open:this.r.tagOpen.exec(src), //the actual open tag
      openIndex:false,  //where the tag starts in the source string
      fullKey:false,    //gives you enough to determine the path, and the attribute you should be getting data from, but not the type
      key:false,        //just the attribute you should be getting data from
      optionStr:false,  //logic, options, etc (modifiers for this key)
      tag:false,        //tag can be everything but the '{', '[options/logic]}'
      traverse:true,    //should we traverse up the tree if the current context has no value?
      type:false     //what kind of Snippet should it be? (function, value, etc)
   };

   //determine openTagOpening
   if(cfg.open === null) return false;
   console.log('cfg.open:', cfg.open)
   cfg.openIndex  = cfg.open.index;
   cfg.open       = cfg.open[0]
   cfg.tag        = cfg.open.substring(1);
   cfg.fullKey    = cfg.tag;
   cfg.optionStr  = src.substring(cfg.openIndex + cfg.open.length);//;
   console.log('cfg.optionStr', cfg.optionStr)
   cfg.type       = this.tagType(cfg.tag);
   console.log(':)', cfg.type)

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
		console.log("cfg.optionStr", cfg.optionStr)
      cfg.close = this.r.tagClose.exec(cfg.optionStr);
		console.log('cfg', cfg)
      console.log('cfg.optionStr', cfg.optionStr)
      console.log('this.r.tagClose', this.r.tagClose)
      console.log('cfg.close', cfg.close)
      cfg.optionStr = cfg.optionStr.substring(0, cfg.close.index + 1).replace(this.r.whitespaceLeading, '');
      console.log(cfg.openIndex, cfg.close.index)
      cfg.open = src.substring(cfg.openIndex, (cfg.openIndex + cfg.open.length + cfg.close.index + cfg.close[0].length));
      cfg.close = false;
   }

   console.log('cfg.optionStr - post trim', '"' + cfg.optionStr + '"')

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
         cfg.close = '{{}' + cfg.fullKey + '}';
         break;

      case this.LIST :
         cfg.open = cfg.open[0];
         cfg.fullKey = cfg.tag(0, cfg.tag.length -3)
         cfg.close = '{[]' + cfg.fullKey + '}';
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

   /*if((cfg.type != this.FUNCTION)) {
      cfg.optionStr = cfg.optionStr.substring(0, cfg.optionStr.indexOf('}'));
   }*/
   console.log('cfg:', cfg)
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
	tagOpen: /{((((\*|#)([a-z]|[A-Z])+)|(((\.\/)|(\.\.\/)*)([0-9]|[a-z]|[A-Z]|_)+(\.([0-9]|[a-z]|[A-Z]|_)+)*))((\{\})|(\[\]))?)/, //this tag recognizes all matches above (and more)
   parentG: /\.\.\//g,
   tagCloseFunction:/}\/}|}}/,
   tagClose: /^}|[^\\]}/
}

Snippet.prototype.TC_FUNC_MULTI = "}}";
Snippet.prototype.TC_FUNC_VAL = "}/}";
Snippet.prototype.LIST      = 'LIST';
Snippet.prototype.OBJECT    = 'OBJECT';
Snippet.prototype.FUNCTION  = 'FUNCTION';
Snippet.prototype.FUNCTION_CLOSE = '{/func}';
Snippet.prototype.IF        = 'IF';
Snippet.prototype.IF_CLOSE  = "{/if}"
Snippet.prototype.ELSEIF    = 'ELSEIF';
Snippet.prototype.ELSE      = 'ELSE';
Snippet.prototype.INCLUDE   = 'INCLUDE';
Snippet.prototype.LITERAL   = 'LITERAL';
Snippet.prototype.LITERAL_CLOSE = 'LITERAL_CLOSE';
Snippet.prototype.VALUE     = 'VALUE';
Snippet.prototype.VAR       = 'VAR';

//{#func {'some code' }/} {/func}

//next tackle simple value tags in a snippet. (see the snippet structure @ the end.