## Methods ##
  * **$(** _html ID_ **).validate(** _regEx_ **)** For input elements! Matches the first elment only! The input element's value is evaluated by _regular expression_ for a match. Returns the value if it matches, false on fail.

## Functions ##
  * **$.log(** _obj, `[`inspect`]`_ **)** If firebug is installed, writes _obj_ to firebug's log console.
    * _obj_ mixed
    * _inspect_ boolean. If true, writes _$.inspect(obj)_ to the console
  * **$.log(** _obj, `[`title`, `[`inspect`]`]`_ **)** If firebug is installed, writes _obj_ to firebug's log console.
    * _obj_ mixed
    * _title_ string. prints _title_ at the top of the log entry
  * **$.log(** _obj, `[`config`]`_ **)** If firebug is installed, writes _$.inspect(obj)_ to firebug's log console.
    * _obj_ mixed
    * _config_ object. Takes all the parameters of  _$.inspect_'s config with the addtion of the property 'title'.
  * **$.urlParam(** _param, `[`defaultVal`]`_ **)** Gets the parameter _param_ from the page's url. If the parameter doesn't exist returns _defaultVal_ (if passed in) or false.
  * **$.len(** _obj, `[`config`]`_ **)** <sup>version 2.3</sup> Counts the number of elements in _obj_.
```
//config, and all arguments of config are optional. defaults are listed in the example below.
config:{
  all:false, //if true include 'prototype' properties
  getArray:false, //if true return an array of matched properties
  filterOut:["function"], //do not include properties of these types when counting or constructing return information
}
```