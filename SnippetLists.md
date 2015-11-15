# Introduction #

Lists, defined by  are Orange-J's way of iterating over Javascript arrays (and Javascript Objects you want to treat as arrays)


## List Tag Attributes ##
  * **cycleName** _ex:{somename[.md](.md) cycleName=class odd|even|moreodd}_
    * Within the markup of 'somename' the tag {class} will be replaced with 'odd', 'even', or 'moreodd'. It is possible to have as many values separated by '|' as you like.
    * If the current object has an attribute 'class' it's value will replace the cycleName value.

## the listInc and arrayInc tags ##
These are special tags that work only within lists. They are the list/array index
the snippet is currently on.

**Functions & if statements with listInc and arrayInc tags** are a little different. Because functions and if statements are represented within their own structure in the template, to address listInc and arrayInc you need to say 'this.parent.listInc' and 'this.parent.arrayInc' within {#if and {#func and {function()

**Difference between the two** If you pass an object to a template element expecting a list, the 'listInc' will give you the current numeric index (just as if the object were a list)
while 'arrayInc' will give you the actual property name or 'key' for the current attribute/index.