# Introduction #

The value tag is the most basic snippet tag, "{val}". While easy to use, this page will go over some of the options you can add to this tag to help keep your html running smoothly

## Value Tag Options ##
  * **maxlen=x** the maximum length of a value
> > ex:
```
                snippet: "{val maxlen=4}"
                json:    "{asdfs}"
                output:  "asdf"
```
  * **maxend="somestring"** if 'maxlen' is arrived at, maxend will be appended to the end of the tag's output string
> > ex:
```
                snippet: "{val maxlen=4 maxend="..."}"
                json:    "{asdfs}"
                output:  "asdf..."
```
  * **maxchop=x** if 'maxlen' is arrived at, max chop is the number of ADDITIONAL characters to remove. The strings length would become maxlen - maxchop + maxend.length.
> > ex:
```
                snippet: "{val maxlen=4 maxchop=1}"
                json:    "{asdfs}"
                output:  "asd" 
```
  * **htmlentities** translates basic html tags into corresponding html entity codes. (helps with rendering items inside input elements and textareas, or in preventing XXS attacks when rendering untrusted user generated input)
> > _note htmlentities does not escape 'maxend' values_
> > ex:
```
                snippet:"{val htmlentities}"
                json:   "me & my dog"
                output: "me &amp; my dog"
```
> > ex2:
```
                snippet:"{val htmlentities maxlen=5 maxend="...&" maxchop=1}"
                json:   "me & my dog"
                output: "me &amp;...&" 
```
  * **default** the default value for an element if there is no value for it.


> ex:
```
                snippet:'{val default="bug"}'
```

  * **maxwords** when truncating with maxlen, truncate to the nearest whitespace character before the 'maxlen' length.

> ex:
```
                snippet:'{val maxlen="30" maxwords}'
```

  * **uppercase** transforms a string value to all uppercase

> ex:
```
                snippet:'{val uppercase}'
```

  * **lowercase** transforms a string value to all lowercase

> ex:
```
                snippet:'{val lowercase}'
```

  * **uppercaseFirst** transforms a string value to all lowercase with the first character uppercased.

> ex:
```
                snippet:'{val uppercaseFirst}'
```