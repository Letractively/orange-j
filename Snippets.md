# Introduction #

Snippets are tiny (or not so tiny) pieces of html you can use to make your page faster, more dynamic, and keep the layout and the Javascript separate. Orange Snippets are high performance browser-based templates. Most importantly **_snippets are easy_**.

## Snippets are browser based templates ##
Snippets are chucks of clean HTML/Javascript/css with special mark up, very much like Freemarker or Smarty. Like Freemarker and Smarty, we provide the technology, you provide the HTML.

Snippets reside within the browser. They get loaded into the Snippet Library when the page loads, or after (there are several ways of doing this).

Snippets take Javascript Objects, Arrays, Strings, etc as their argument.

Though the focus of Snippets is web-applications that never reload, simple websites can benefit from them greatly as well.


## You should use Snippets because... ##
  * **Snippets make your html legible**, separating your HTML from your Javascript.
  * **Write more intricate HTML** (you only load a snippet ONCE)
  * **Web applications run better** over poor internet connections.
  * **Snippets are powerful**. Snippets support logical operations, default values, inline Javascript and inclusion of other snippets.
  * **Take advantage of HTML5** HTML5 includes a browser database, snippets allow you to use this database to great effect
  * **Snippets are easy** If you know HTML and a little Javascript, Snippets will make writing dynamic web pages and web applications easier, and faster.


# How to use Snippets - quick reference & tutorial - #
## Tags ##
  * **{#snippet name="_mysnippet_"}** (html) markup and snippet tags **{/snippet}** //the wrapper for any snippet
  * **{sometag}** //a simple value tag. Can be a static value, or a function attached to the object you passed in.
  * **{sometag.tagattr}** //an attribute of 'sometag'. This is shorthand for {sometag{}}

  * **{#func { javascript code }}** //an inline javascript function. any returns a value
  * **{#if javascript code}**snippet and htmlcode **{#elseif javascript code}** snippet and html code **{#else}** snippet and html code **{/if}**
  * **{#lit}**html including things like '{tag}'**{/lit}** //literal tags, so you don't need to worry about "**{stuff}**"
  * **{#include "_snippet name_"}** //include a snippet within another snippet

  * **{sometag{}}** markup **{tagattr}** more markup **{tagattrB}** markup **{{}sometag}** //for traversing the passed in objects attributes where {sometag.tagattr} does not suffice
  * **{sometagthatisalist[[.md](.md)]}**snippet and html code that will be iterated over for each item in sometagthatisalist **{[[.md](.md)]sometagthatisalist}**
## Functions, attributes and 'obj' (for use within #func func() & #if) ##
  * **this.parentValue(**

&lt;tagname&gt;

)*****this.getObjValue(

&lt;tagname&gt;

)*****this.htmlentities(

&lt;somestring&gt;

)*****this.stripHTML(

&lt;somestring&gt;

)*****this.collapseWhite(

&lt;somestring&gt;

)*****this.getDefaultValue()*****this.parent*****this.listInc**or**this.listIndex()*****this.cycleInc*****this.arrayInc**or**this.arrayIndex()*****this.listLen**or**this.listLength()*****obj**_//The current level js object_
  ***obj.<attribute name>**_//an attribute/property of current level js object_**Debugger