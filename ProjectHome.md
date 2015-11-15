A set of lightweight components to enable rich Javascript web applications.
What's new about that? The way we do it, the ease of it all. I promise!

**Version 3.0 in draft state. Some new features are on the docket, as well as updates to the core snippet syntax. Templates will optionally have solid source paths for tags, clearer function syntax, and better name-spacing for snippet generated variables. (And a bug fix or two.)**

Tutorial now available for core Snippet features**http://projektorange.com/tutorials/**

**2.4 released! (more features - see updates)**

**2.4+ compatible with jQuery 1.6**

**2.4.2 - beta available for download! (packed version is 29k!)
> Minor tweaks
> + added
  * $('finder, url, empty').urlParse('attrName') converts the parameters in a url string into an object (now ads in document anchor tag as '#' named attribute)
  * $.urlArg(url, argName, default) which takes a url and argument name, parses the value from the url (incl arrays!)
> - subracted
  * clone (because jQuery has a version of it)
  * serialize (because jQuery has a version of it.. though without prefix, suffix or mask)
  * inspect (because this isn't needed with modern debuggers)**






**Snippet Engine:** Let's you write complete html templates for the browser to render. no more javascript+html mashups!
(supports lists, nested objects, objects as lists, **.** syntax, default values, includes, if statements, embedded Javascript functions, and more!)

**Firebug Log:** if firebug is present, write all your arguments to the console, gives it a pass otherwise.

**Listen:** keyboard event listener to any object that supports key events. Trigger anything on any keystroke. Supports regex matching for input.

**Build Object:** create a JavaScript object from dom values of an id list. Supports prefixes for object grouping

**Object to DOM:** put values from a JavaScript object to the DOM by attribute key.

<a href='http://projektorange.com/page.php?name=j_snippet_debugger'>try the debugger</a>