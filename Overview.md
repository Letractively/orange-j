## With jQuery ##
It is important to note this documentation makes a distinction between jQuery _**methods**_ and _**functions**_.

A _**method**_ is used when matching elements in jQuery and called like so _"$(cssExpr).**method**()"_

A _**function**_ is used just like a regular Javascript function that's been hung off the jQuery object. _"$.**function**()"_


### METHOD REFERENCE ###
$("#elementID").listen(inConfig)
$("#elementID").snippet(snippetName, data) <- (name of snippet stored in jQuery, properly formatted data object)
$("#elementID").snippetString(snippetString, data) <- (the actual snippet, properly formatted data object)

### FUNCTION REFERENCE ###
$.setSnippetLib(inSnippetHash) <- (a js Object where each named attribute is a snippet)
> sets the snippets for this library.  Good if you have a lot of snippets and want to keep them handy
$.snippetString(snippetString, data) <- (the actual snippet, properly formatted data object)
> > returns the filled snippet
$.getSnippets(inURL) <- (inURL, the url of a file containing multiple snippets)

$.getSnippets(inURLHash) <- (inURLHash:a js Object where each named attribute is the url to a single snippet)

> so this function will retrieve snippets from a server and store them in the orange snippet library.
> they can then be used by calling snippet with the name the url was associated with in the original js object
> js Object. like so:
> > $.loadURLSnippets({"my\_tpl":"http://supernoggies.com/js_snippets/my_snippet.html",
> > > "your\_tpl":"/js\_snippets/u\_snippet.html"})

> > $("#target").snippet("my\_tpl", data);

$.ofd(inElementIDArray, inPrefix) <- Creates a Javascript Object from html form elements with the
$.fillForm(inObj, inPrefix)
$.inspect(inObj, inConfig)