/**
 * Configuration:
 * Unless marked '**REQUIRED**' all arguments optional.
 * ** itemLabels and allLabels must be of the same type - csv, stringList, objectList
 * ** if actions.search is a function, function must return same type of elements as passed to itemLabels & allLabels.
 *
 *
 *
 * htmlID:"someUniqueID" - **REQUIRED**
 *                   //theHTMLLabel Container
 *
 * labels: { 
 *             assigned: "a,b,c" / ["a","b"] / [{id:1,name:"a"},{id:24,name:"b", note:"blah"}]
 *                   //labels for this item (can be func/csv/stringList/objectList)
 *
 *             all: "d,e,c" / ["d","e"] / [{id:17,name:"d"},{id:12,name:"e"}]
 *                   //place to get labels, can be either a function or csv, stringList, or objectList
 *
 *             structure:false / {  id:"idAttrName",
 *                                  display:"displayTextAttrName", **REQUIRED**
 *                                  label:"labelTextAttrName",
 *                                  description:"description text attr name"
 *                               }
 *                               //labelStructure is required only if your labels are objects, or if your search functions return objects
 *             separator:false / "str"
 *                   //if the imported item is a character separated string , split on this string.
 *             separatorEnds: false / int / ""
 *                   //Trim this number of chars off the end of the string. Can be a string, but only the 'length' property of the string is used.
 *             returnformat:false / "csv" / "string"
 *                   //specifies the form of output from getAssigned and to the 'save' function (default return is input format)
 *
 * }
 *
 * actions: {
 *             create:false / true / {id:-1, someOtherAttr:""} / function()
 *                   //bool show new label controls allow creation of new labels (default true)
 *                   //*NOTE* If using objects Must be either new label structure
 *                   //(where attr 'displayTextAttrName' is populated with the text in the input box)
 *                   //or a function that returns a fully formed object for import into the label manager
 *                   //(function will pass as 1st argument the text from the input box)
 *
 *             save: false / function()
 *                   //false = hide save button
 *                   //function = show save button and call funciton with all associated items/labels
 *                   //functionCall for saveLabels - if set, will show save button in ui
 *
 *             search: true / function()
 *                   //functionCall for searchLabels
 *
 *             assign: true / false /function()
 *                   //true = allow search and assignment
 *                   //false = do not allow assignment through label mananger
 *                   //function = called when existing label/item is added, or new label/item is created and added.
 *
 *             remove: true / false / function()
 *                   //true   = show controls
 *                   //false  = hide delete label controls
 *                   //function = show controls and call function with passed in deleted item/label
 * }
 *
 * dropdown:{
 *             css:false            //jQuery css object
 *             closeOnAssign:true
 *          }
 *
 * search:  {
 *             onFocus:false
 *             ,onDownArrow:false
 *             ,delay:300
 *             ,minChars:3
 *             ,maxResults:false
 *             ,showAssigned:false
 *             ,disableCache:false
 *          }
 *
 * snippets:{
 *             //Below are examples of snippets. Snippet tags and css classes used in this example are STRONGLY RECOMMENDED for full functionality
 *             label:"{list[]}<div id='{htmlID}' class='labelContainer'><div class='lblText' title='{description htmlentities}'>{display}</div>{#if this.parentValue('del')}<div id='{htmlID}__remove' class='lblCancel'>x</div>{/if}</div>{[]list}"
 *             ,labelPanel:"<div class='labelSearch'><input class='labelSearchInput' type='text' value='' />{#if obj.create}<input type='button' onclick='lMgr.newLabel()' value='add'>{/if}</div><div  class='labelSearchDropdown'>&nbsp;</div><div class='labelList'></div>"
 *             ,autoComplete:"<div id='{htmlIDDropdown}' class='dropdownElm'><input id='{htmlIDDropdown}__checkbox' type='checkbox'>&nbsp;{display htmlentities}</div>"
 *          }
 *          //all snippets are html 'orange-j' snippets and must conform to that grammar.
 */


LabelManager = function(inConfig) {
   var lm = this;
   this.vars = {  //user documented arguments
      htmlID:false,
      labels: {
         assigned:[],
         all:false,
         structure:false,
         separator:false,
         separatorEnds:false
      },

      actions: {
         create:false,
         save: false,
         search: true,
         assign: true,
         remove: true
      },

      search: {
         onFocus:false
         ,
         onDownArrow:false
         ,
         delay:300
         ,
         minChars:3
         ,
         maxResults:false
         ,
         showAssigned:false
         ,
         disableCache:false
      },

      snippets: {
         label:"{list[]}<div id='{htmlID}' class='labelContainer'><div class='lblText' title='{description htmlentities}'>{display}</div>{#if this.parentValue('del')}<div id='{htmlID}__remove' class='lblCancel'>x</div>{/if}</div>{[]list}"
         ,labelPanel:"<div class='labelSearch'><input class='labelSearchInput' type='text' value='' />{#if obj.create}<input type='button' onclick='lMgr.newLabel()' value='add'>{/if}</div><div  class='labelSearchDropdown'>&nbsp;</div><div class='labelList'></div>"
         ,autoComplete:"<div id='{htmlIDDropdown}' class='dropdownElm'><input id='{htmlIDDropdown}__checkbox' type='checkbox'>&nbsp;{display htmlentities}</div>"
      },

      dropDown: {
         css:false,
         closeOnAssign:true
      },

      //system vars
      errPix:6,
      ioMode:"string", //or object
      assigned: {
         byLMID:{},
         byDisplay:{} //yeah this one is kinda weird. it's for strippping out duplicates in search results
      },
      cache: {
         byLMID:{},
         byDisplay:{}
      },

      lmIDInc:0,

      searchLastStr:"",
      searchRespCurrIndex:-1,
      searchRespItems:[],
      searchTimeout:false,

      elms:{
         dropdown:{
            jqElm:false,
            topLeft:{
               x:0,
               y:0
            },
            bottomRight:{
               x:0,
               y:0
            }
         },
         root:{
            jqElm:false,
            topLeft:{
               x:0,
               y:0
            },
            bottomRight:{
               x:0,
               y:0
            }
         },
         input:{
            jqElm:false,
            topLeft:{
               x:0,
               y:0
            },
            bottomRight:{
               x:0,
               y:0
            }
         }
      },
      sel:{
         input:"",
         dropdown:""
      },

      msgHeaders:{
         errNew:"LabelManager ERROR: When creating new label"
      }

   };
   jQuery.extend(true, this.vars, inConfig);
   if(!this.vars.htmlID) {
      alert("htmlID not assigned for label control");
      return false;
   }

   this.vars.sel.input = "#" + this.vars.htmlID + " .labelSearchInput";

   this.vars.sel.dropdown = "#" + this.vars.htmlID + " .labelSearchDropdown";

   if(this.vars.labels.structure) this.vars.ioMode = "object";
   if(this.vars.labels.separator && !this.vars.labels.returnFormat) this.vars.labels.returnFormat = "csv";

   if(this.vars.labels.all)
      this.internalizeLabels(inConfig.labels.all);



   //INITIALIZE THE SNIPPET LIBRARY AND HTML FRAMEWORK
   this.vars.sl = new SnippetLib(this.vars.snippets);
   jQuery(this.vars.htmlID).html(this.vars.sl.fill("labelPanel", this.vars));
   //document.getElementById(this.vars.htmlID).innerHTML = this.vars.sl.fill("labelPanel", this.vars);

   //now that the base html is ready, assign labels
   this.assignLabels(inConfig.labels.assigned);

   //PREP ELEMENT VARIABLES (FOR UI INTERACTION)
   this.vars.elms.root.jqElm = jQuery(this.vars.htmlID);
   this.vars.elms.input.jqElm = jQuery(this.vars.sel.input);
   this.vars.elms.dropdown.jqElm = jQuery(this.vars.sel.dropdown);

   this.updateElmDimensions(this.vars.elms.root);
   this.updateElmDimensions(this.vars.elms.input);
   this.updateElmDimensions(this.vars.elms.dropdown);

   //ASSIGN EVENTS TO UI ELEMENTS
   jQuery("body").click(function(e) {
      lm.hideDropdown(e);
   } );

   jQuery(this.vars.sel.input).listen({
      keyCode:{
         13:function() {
            lm.searchDropdownManager("enter");
         },
         37:function() {
            lm.searchDropdownManager("left");
         },
         38:function() {
            lm.searchDropdownManager("up");
         },
         39:function() {
            lm.searchDropdownManager("right");
         },
         40:function() {
            lm.searchDropdownManager("down");
         },
         27:function() {
            lm.searchDropdownManager("esc");
         },
         onMatch:function() {
            alert("bye!");
         }
      },
   defaultAction:function() {
      clearTimeout(lm.vars.searchTimeout);
      lm.vars.searchTimeout = setTimeout(function() {
         lm.searchLabels();
      }, lm.vars.searchDelay);
   }
   });
if(this.vars.search.onFocus) {
   jQuery(this.vars.sel.input).focus(function() {
      lm.searchLabels({
         lenOverride:true
      });
   });
}
            
            
}

LabelManager.prototype.updateElmDimensions = function(elm) {
   elm.topLeft = {
      x: elm.jqElm.offset().left,
      y: elm.jqElm.offset().top
      };
   elm.bottomRight = {
      x: elm.topLeft.x + elm.jqElm.width(),
      y: elm.topLeft.y + elm.jqElm.height()
   };
}




/**
         *  Creates a new label and adds it to the cache. It will
         *  NOT create a new label if another already exists with the same display name.
         *  returns false on failure.
         */
LabelManager.prototype.newLabel = function() {
   var labelStr = jQuery(this.vars.sel.input ).val();
   var newLabel;

   if(!this.vars.assigned.byDisplay.hasOwnProperty(labelStr)) {
      switch(typeof(this.vars.actions.create)) {
         case "function" :
            newLabel = this.vars.create(labelStr);
            break;
         case "object" :
            if(!(typeof this.vars.labels.structure == "object")) {
               jQuery.log("create is 'object' but labels.structure is not 'object' - ioMode is " + this.vars.ioMode, this.vars.msgHeaders.errNew);
               return false;
            }
            newLabel = jQuery.extend({}, this.vars.create);
            newLabel[this.vars.labels.structure.display] = labelStr;
            break;
         case "boolean" :
            if(!this.vars.create) {
               jQuery.log("create is false. Cannot create label", this.vars.msgHeaders.errNew);
               return false;
            } else if (typeof this.vars.labels.structure == "object") {
               jQuery.log("create is 'boolean' but labels.structure is 'object' - ioMode is " + this.vars.ioMode, this.vars.msgHeaders.errNew);
               return false;
            }
            newLabel = labelStr;
      }
   } else {
      jQuery.log("label with same display name already assigned", this.vars.msgHeaders.errNew);
      return false;
   }

   newLabel = this.internalizeLabels([newLabel])[0];
   this.assignLabels([newLabel.lmID], "lmIDList");

}

/**
          * Passed in labels (inLabels) can be a list of
          *    * Label display names
          *    * If labels.structure has been defined:
          *       * objects conforming to that structure,
          *       * a list of label ids (assuming those labels have already been cached)
          *          (set inType argument to 'idList')
          *       * a list of label manager ids (for internal use only)
          *          (set inType argument to 'lmIDList'
          *
          * inList, (stringList, objList, idList, lmIDList)
          */
LabelManager.prototype.assignLabels = function(inLabels, inType) {
   var assigned = [];
   switch(inType) {
      case "idList" :
         var byID = {};
         for(var i in this.vars.cache.byLMID) if(this.vars.cache.byLMID.hasOwnProperty(i)) {
            if(this.vars.cache.byLMID[i].hasOwnProperty(this.vars.labels.structure.id)) {
               byID[this.vars.cache.byLMID[i][this.vars.labels.structure.id]] = this.vars.cache.byLMID[i];
            }
         }
         for(var i in inLabels) if(inLabels.hasOwnProperty(i)) {
            if(byID.hasOwnProperty(inLabels[i])) {
               assigned.push(byID[inLabels[i]])
            } else {
               jQuery.log("couldn't add label with id:" + i + " label not in cache");
            }
         }
         break;
      case "lmIDList" :
         for(var i in inLabels) if(inLabels.hasOwnProperty(i)) {
            if(this.vars.cache.byLMID.hasOwnProperty(inLabels[i])) {
               assigned.push(this.vars.cache.byLMID[inLabels[i]])
            }
         }
         break;
      default : //handles an array of strings, a single csv string, an array of objects
         if(this.vars.ioMode == typeof inLabels[0])
            assigned = this.internalizeLabels(inLabels);
   }
   var assignedSources = [];
   for(var i in assigned) if(assigned.hasOwnProperty(i)) {
      this.vars.assigned.byDisplay[assigned[i].display] = assigned[i];
      this.vars.assigned.byLMID[assigned[i].lmID] = assigned[i];
      assignedSources.push(assigned[i].sourceLabel);
      $("#" + assigned[i].htmlIDDropdown + "__checkbox").attr("checked", "checked");
   }
   if(assigned.length > 0 && (typeof this.vars.actions.assign == "function")) {
            
      this.vars.actions.assign(assignedSources);
   }
   this.renderLabels();
}

LabelManager.prototype.assignLabelToggle = function(inLMID) {
   if(this.vars.assigned.byLMID.hasOwnProperty(inLMID) ) {
      this.removeLabelByLMID(inLMID);
   } else {
      this.assignLabels([inLMID], "lmIDList");
   }
}


LabelManager.prototype.clearLabels = function() {
   $.log("LabelManager.clearLabels not implemented");
   return false;
}


LabelManager.prototype.drawLabels = function() {
   //var outStr = "";
   return this.vars.sl.fill("label", {
      del:this.vars.actions.remove,
      list:this.vars.assigned.byLMID
      });
}


/**
 * Returns all currently assigned labels.
 * Attempts to return them in their orginal format.
 *
 * ARGUMENTS
 * returnFormat STRING -optional- "string"/"csv"
 *                                  If string will return a list of label strings (probably the same as the displayed text)
 *                                  If csv will concat assigned label display strings with ',' or will use labels.separator (from constructor) as separator and 'labels.separatorEnds' to begin and end the single string.
 */
LabelManager.prototype.getAssigned = function(returnFormat) {
   var labelList = [];
   returnFormat = (typeof returnFormat == "string")? returnFormat : this.vars.labels.returnFormat;
   if(returnFormat == "string" || returnFormat == "csv" || this.vars.labels.separator) {
      for(var i in this.vars.assigned.byLMID) if(this.vars.assigned.byLMID.hasOwnProperty(i)) {
         labelList.push(this.vars.assigned.byLMID[i].label);
      }
      if(returnFormat == "csv") {
         if(this.vars.labels.separator) {
            labelList = labelList.join(this.vars.labels.separator);
            if(typeof this.vars.labels.separatorEnds == "string") {
               labelList = this.vars.labels.separatorEnds + labelList + this.vars.labels.separatorEnds;
            }
         } else {
            labelList = labelList.join(",");
         }
      }
   } else {
      labelList.push(this.vars.assigned.byLMID[i].sourceLabel);
   }
   
   return labelList;
}

/**
         *  Adds all inLabels to the internal cache after formatting for
         *  use within the label manager.
         *
         *  Returns the reformatted labels (not the entire cache)
         *
         */
LabelManager.prototype.internalizeLabels = function(inLabels) {
   var convertedLabels = [];
   var newLabel = {};
   var separatorEndLength;

   switch(typeof inLabels){
      case "string" : //assumed csv
         if(this.vars.labels.separator) {
            if(this.vars.labels.separatorEnds) {
               if(typeof this.vars.labels.separatorEnds == "string")  //convert to an int since all we're doing is chopping the ends off.
                  separatorEndLength = this.vars.labels.separatorEnds.length;
               $.log(inLabels, this.vars.labels.separatorEnds + '=' + separatorEndLength);
               inLabels = inLabels.substring(0, inLabels.length - separatorEndLength)
               $.log(inLabels);
               inLabels = inLabels.substring(separatorEndLength)
               $.log(inLabels);
            }
            inLabels = inLabels.split(this.vars.labels.separator);
         }
      case "object" : //assume it's a list
         if(typeof inLabels[0] == "string") {//List of strings
            for(var i in inLabels) if(inLabels.hasOwnProperty(i)) {
               if(!this.vars.cache.byDisplay.hasOwnProperty(inLabels[i])) {
                  this.vars.lmIDInc++;
                  newLabel = {
                     lmID:this.vars.lmIDInc,
                     htmlID:"labels__" + this.vars.htmlID + "__" + this.vars.lmIDInc,
                     htmlIDDropdown: "labels__" + this.vars.htmlID + "__" + this.vars.lmIDInc + "__dropdown",
                     normalized:inLabels[i].toLowerCase(),
                     label:inLabels[i],
                     display:inLabels[i],
                     description:inLabels[i],
                     sourceLabel:inLabels[i]
                  }
                  this.vars.cache.byDisplay[inLabels[i]] = newLabel;
                  this.vars.cache.byLMID[newLabel.lmID] = newLabel;
               } else {
                  newLabel = this.vars.cache.byDisplay[inLabels[i]];
               }
               convertedLabels.push(newLabel);
            }
         } else if(typeof inLabels[0] == "object" && this.vars.labels.structure) {
            var structure = this.vars.labels.structure;
            for(var i in inLabels) if(inLabels.hasOwnProperty(i)) {
               newLabel = null;
               if(!this.vars.cache.byDisplay.hasOwnProperty(inLabels[i][structure.display])) {
                  this.vars.lmIDInc++;
                  if(!inLabels[i].hasOwnProperty(structure.display)) {
                     jQuery.log(inLabels[i], "internalizeLabels - label missing display property: " + structure.display, true);
                  } else {
                     newLabel = {
                        lmID:this.vars.lmIDInc,
                        htmlID:"labels__" + this.vars.htmlID + "__" + this.vars.lmIDInc,
                        htmlIDDropdown: "labels__" + this.vars.htmlID + "__" + this.vars.lmIDInc + "__dropdown",
                        normalized:(inLabels[i].hasOwnProperty(structure.searchOn))?inLabels[i][structure.searchOn].toLowerCase():inLabels[i][structure.display].toLowerCase(),
                        label: (inLabels[i].hasOwnProperty(structure.label))?inLabels[i][structure.label]:inLabels[i][structure.display],
                        display:inLabels[i][structure.display],
                        description:(inLabels[i].hasOwnProperty(structure.description))?inLabels[i][structure.description]:inLabels[i][structure.display],
                        sourceLabel:inLabels[i]
                     }
                  }
                  if(newLabel != null) {
                     this.vars.cache.byDisplay[inLabels[i][structure.display]] = newLabel;
                     this.vars.cache.byLMID[newLabel.lmID] = newLabel;
                  }
               } else {
                  newLabel = this.vars.cache.byDisplay[inLabels[i][structure.display]];
               }
               if(newLabel != null) convertedLabels.push(newLabel);
            }
         } else {
            jQuery.log("COULDN'T FIGURE OUT HOW TO PARSE LABELS FOR " + this.vars.htmlID);
            if(!this.vars.labels.structure) jQuery.log("labelManager labels.structure is false (wasn't passed in?) This may be part of the problem.")
         }

   }
   delete newLabel, separatorEndLength;
   return convertedLabels;
}


LabelManager.prototype.removeLabelByLMID = function(inID) {
   var label, element;
   if(this.vars.assigned.byLMID.hasOwnProperty(inID)) {
      label = this.vars.assigned.byLMID[inID];
      //LABEL TAB UPDATE
      element = document.getElementById(label.htmlID);
      if(element != undefined) {
         element.parentNode.removeChild(element);
         delete this.vars.assigned.byDisplay[label.display];
         delete this.vars.assigned.byLMID[label.lmID];
         if(typeof this.vars.actions.remove == "function") {
            this.vars.actions.remove(label.sourceLabel);
         }
      }
      //LABEL DROPDOWN
      $("#" + label.htmlIDDropdown + "__checkbox").attr("checked", false);

   }
   delete label, element;
}

LabelManager.prototype.renderLabels = function() {
   var z = this;
   jQuery("#" + this.vars.htmlID + " .labelList").html(this.drawLabels());

   for(var i in this.vars.assigned.byLMID) if(this.vars.assigned.byLMID.hasOwnProperty(i)) {
      var label = this.vars.assigned.byLMID[i];
      eval("jQuery('#" + label.htmlID + "__remove').click(function() {z.removeLabelByLMID(" + label.lmID + ");}, true);");
   }
   delete i, label;
}


/**
          * Called on 'save' button press
          */
LabelManager.prototype.saveLabels = function() {
   if(typeof this.vars.actions.save == "function") {
      return this.vars.funcSaveAll(this.getAssigned());
   }
   jQuery.log("this.vars.actions.save not a defined function");
   return false;
}


/**
          * Called on keypress.
          */
LabelManager.prototype.searchLabels = function(config) {
   config = jQuery.extend({
      lenOverride:false
   }, config);
   //jQuery.log('searching');
   var lm = this;
   var searchVal = $(this.vars.sel.input).val().toLowerCase();
   var searchResp = [];

   if( (searchVal.length < this.vars.search.minChars) && !config.lenOverride) {
      this.vars.searchRespItems = [];
      this.searchDropdownManager();
      return;
   }
   this.vars.searchLastStr = searchVal;
   if(typeof this.vars.actions.search == "function") {
      searchResp = this.vars.actions.search(searchVal, function(respList) {
         var respList = lm.internalizeLabels(respList);
         lm.searchLabels_cb(respList, true);
      });
   } else {
      for(var i in this.vars.cache.byLMID) if(this.vars.cache.byLMID.hasOwnProperty(i)) {
         if(this.vars.cache.byLMID[i].normalized.indexOf(searchVal) > -1) {
            searchResp.push(this.vars.cache.byLMID[i]);
         }
      }
   }

   if(typeof searchResp == "undefined") return;
   if(!this.vars.search.disableCache)
      this.searchLabels_cb(searchResp, false);
}

LabelManager.prototype.searchLabels_cb = function(searchResp) {

   var checkbox;
   var lm = this;
   var searchRespFinal = [];
   var i;
   var count = 1;
   for(i in searchResp) if(searchResp.hasOwnProperty(i)) {
      if(!this.vars.assigned.byLMID.hasOwnProperty(searchResp[i].lmID) || this.vars.search.showAssigned) {
         searchRespFinal.push(searchResp[i]);
         count++;
      }
      if(this.vars.search.maxResults && count > this.vars.search.maxResults)
         break;
   }
   var css = $(this.vars.sel.input).offset();
   css.top += $(this.vars.sel.input).outerHeight();
   css.display = "block";
   this.vars.searchRespItems = searchRespFinal;
   if(searchRespFinal.length > 0) {
      $(this.vars.sel.dropdown).html(this.vars.sl.fill("autoComplete", searchRespFinal)).css(css); //.css("left", offset.left).css;
   } 

   for(i in searchRespFinal) if(searchResp.hasOwnProperty(i)) {
      var checkboxDiv = $("#" + searchResp[i].htmlIDDropdown);
      eval("checkboxDiv.click(function() { lm.assignLabelToggle(" + searchResp[i].lmID + "); });");
               
      checkbox = $("#" + searchResp[i].htmlIDDropdown + "__checkbox");
      if(this.vars.assigned.byLMID.hasOwnProperty(searchResp[i].lmID)) {
         checkbox.attr("checked", "checked");
      }
   }
   this.updateElmDimensions(this.vars.elms.dropdown);
   this.searchDropdownManager();
   if(typeof this.vars.dropdown.css == "object") {
      this.vars.elms.dropdown.jqElm.css(this.vars.dropdown.css);
   }
}

LabelManager.prototype.hideDropdown = function(e) {
   var dim = this.vars.elms.dropdown;
   var errPix = this.vars.errPix;

   //$("body").append("<div style='position:absolute; height:1px; width:1px; background:red; top:" + e.pageY + " ; left:" + e.pageX + ";'>.</div>");
   if((dim.topLeft.x - errPix) < e.pageX
      && (dim.bottomRight.x + errPix) > e.pageX
      && (dim.topLeft.y - errPix) < e.pageY
      && (dim.bottomRight.y + errPix) > e.pageY) {
      return;
   }
   dim = this.vars.elms.input;
   if((dim.topLeft.x - errPix) < e.pageX
      && (dim.bottomRight.x + errPix) > e.pageX
      && (dim.topLeft.y - errPix) < e.pageY
      && (dim.bottomRight.y + errPix) > e.pageY) {
      return;
   }
   jQuery(this.vars.sel.dropdown).css({
      display:"none"
   });
}


LabelManager.prototype.searchDropdownManager = function(inDir) {
   if(this.vars.searchRespItems.length == 0) {
      $(this.vars.sel.dropdown).css({
         display:"none"
      });
   }
   if(typeof inDir == "undefined") {
      this.vars.searchRespCurrIndex = -1;
      inDir = "none";
   }
   if(this.vars.searchRespCurrIndex > -1 && (this.vars.searchRespCurrIndex < this.vars.searchRespItems.length) ) {
      $("#" + this.vars.searchRespItems[this.vars.searchRespCurrIndex].htmlIDDropdown).removeClass("dropdownFocus");
   }
   switch(inDir) {
      case "up" :
         this.vars.searchRespCurrIndex--;
         if(this.vars.searchRespCurrIndex < -1) {
            this.vars.searchRespCurrIndex = this.vars.searchRespItems.length -1;
         } else if (this.vars.searchRespCurrIndex == -1){
            return;
         }
         break;
      case "down" :
         if(jQuery(this.vars.sel.dropdown).css("display") == "none" && this.vars.searchOnDownArrow) { //this search is part 1 of 2 searchondownarrow overrides the length attr
            this.searchLabels({
               lenOverride:true
            });
            this.vars.searchRespCurrIndex = -1;
            return;
         }
         if((this.vars.searchRespCurrIndex + 1) >= this.vars.searchRespItems.length) {
            this.vars.searchRespCurrIndex = -1;
            return;
         }
         this.vars.searchRespCurrIndex++;
         break;
      case "left" :
         break;
      case "enter" :
         if(this.vars.searchRespCurrIndex > -1 && (this.vars.searchRespCurrIndex < this.vars.searchRespItems.length) ) {
            this.assignLabelToggle(this.vars.searchRespItems[this.vars.searchRespCurrIndex].lmID);
            if(this.vars.search.closeOnAssign) {
               this.vars.searchRespCurrIndex = -1;
               $(this.vars.sel.dropdown).css({
                  display:"none"
               });
            }
         }
         break;
      case "right" :
         if(this.vars.searchRespCurrIndex > -1 && (this.vars.searchRespCurrIndex < this.vars.searchRespItems.length) ) {
            $(this.vars.sel.input).val(this.vars.searchRespItems[this.vars.searchRespCurrIndex].label);
         }
         break;
      case "esc" :
         var lm = this;
         if(! ($(this.vars.sel.dropdown).css("display") == "none")) {
            this.vars.searchRespItems = [];
            this.vars.searchRespCurrIndex = - 1;
            $(this.vars.sel.dropdown).css({
               display:"none"
            });
            if( $(this.vars.sel.input).val() != this.vars.searchLastStr ) {
               setTimeout(function() {
                  $(lm.vars.sel.input).val(lm.vars.searchLastStr);
               }, 0);
            }
         } else {
            setTimeout(function() {
               $(lm.vars.sel.input).val("");
            }, 0);
         }
         break;
   }
   if(this.vars.searchRespCurrIndex > -1 && (this.vars.searchRespCurrIndex < this.vars.searchRespItems.length) ) {
      $("#" + this.vars.searchRespItems[this.vars.searchRespCurrIndex].htmlIDDropdown).addClass("dropdownFocus");
   }
}
/* labelObj = [
{
   id:1,
   name:"happy"
},
{
   id:3,
   name:"sad"
},
{
   id:2,
   name:"orange"
},
{
   id:4,
   name:"blue"
},
{
   id:5,
   name:"foo"
},
]

$(document).ready(function() {
   //lMgr = new LabelManager(
   configuration = {
      htmlID:"labelzone",
      actions:{
         create:false
         //,remove:false
      },
      dropdown: {
         css:{
            'max-height':300,
            'min-width':130,
            'max-width':200,
            'overflow-y':'auto'
         }
      },
      search: {
         //disableCache:true,
         maxResults:15,
         onDownArrow:true,
         onFocus:true,
         showAssigned:true
      },
      searchCloseOnAdd:false,
      /*labels : {
         assigned:labelObj,
         all:[
               {
                  name:"green",
                  desc:"the yellow fox jumpt throught the hoop"
               },

               {
                  name:"yellow"
               },

               {
                  name:"blueolocon"
                  ,desc:"the blue fox oranged the orangutan"
               },

               {
                  name:"blue"
               },

               {
                  name:"pink"
               },

               {
                  name:"orange"
               },

               {
                  name:"orangutan"
               },

               {
                  name:"blutonic"
               },

               {
                  name:"blue note"
               },

               {
                  name:"blutoe"
               },

               {
                  name:"blue bimmini"
               },

               {
                  name:"bondo"
               },

               {
                  name:"zillow"
               }
               ],
         structure:{
            display:"name"
            ,description:'desc'
         }
      }* /
      labels: {
         assigned:"'d','e'",
         all:"'a','b','c','d'",
         separator:"','",
         separatorEnds:"'"
      }

   };
   //);
   $("#labelzone").lm(configuration);
});

function getLabels() {
   $.log( lMgr.getAssigned(), true);
}
*/
/**
 * Instantiates and/or returns a label manager instance
 */
jQuery.fn.lm = function(inConfig) {
   jQuery.makeOrangeVars();
   var vars = jQuery.variables.orange;
   if(!vars.hasOwnProperty("labelManager")) vars.labelManager = {};
   if(typeof inConfig != "object") { //if it's not an object we assume they want to get an lm instance
      if(!vars.labelManager.hasOwnProperty(this.selector)) {
         return false;
      }
   } else { //they want to build a label manager
      if(vars.labelManager.hasOwnProperty(this.selector)) { //one already exists
         jQuery.log("Label Manager does not currently support mutiple instances per element", this.selector);
         return false;
      }
      //HERE WE HAVE A POTENTIAL PROBLEM...
      //CURRENTLY LABEL MANAGER IS DESIGEND TO ACCEPT ONLY HTML IDS, POSSIBLE NEED TO SUPPORT A-N-Y EXPRESSION THAT MATCHS ONLY ONE ELEMENT
      if(typeof inConfig.htmlID == "undefined") inConfig.htmlID = this.selector;
      vars.labelManager[this.selector] = new LabelManager(inConfig);
   }
   return vars.labelManager[this.selector];

}
/**
 *
 * Working notes...
 * jQuery Plugin version
 *
 * $('').lm(config); //build a label manager for the specified element and return it.
 * $('').lm(); //return a label manager if assigned (false otherwise)
 * $('').lm['funcName']() call some function on the appropriate label manager item
 */