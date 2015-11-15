# Introduction #

The 2.2 listener is a radical change from earlier versions of Orange-J. There is no more 'out of the box' default character checking. Event propagation can now be reliably blocked. Matching can be done on keystrokes with chars and keyCodes, or use regular expressions to check the content of the entire line.


# A listener's configuration #
There are 3 main sections to a listener's configuration object. At least one must be present, the others are optional.
  * **chars**
  * **keyCode**
  * **regEx**

They all follow the same format