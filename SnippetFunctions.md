# Introduction #

Embedding functions inside snippets are a powerful way to add intelligent behavior to your snippets.


## Declaring ##

Functions are declared one of two ways.
  1. **block style** In this example we see a classic Orange-J open and close block where the function is included in the opening tag. _Of primary interest is the way the snippet treats return values._ In the example below, if the function within returns boolean (true) the example will output 'I am zippy'. If the function returns false the snippet will output an empty string. If the function returns anything other than a boolean the snippet will output the returned value in place of the text within the function's block.
```
//Snippet
{functionName() { 
  if(obj.name == "george") return true;
  else if(obj.name == "frank") return false;
  else return obj.name;
}}
  I am zippy 
{()functionName}

//Javascript
$.snippet({name:"george"}); //outputs "I am zippy"
$.snippet({name:"frank"}); //outputs ""
$.snippet({name:"bill"}); //outputs "bill"

```
  1. **operator style**  Here we see the functions implemented with the operator tag {#func { somecode }} In this case the function's return value (if there is one) will always be used as output.
```
//Snippet
{#func { 
  if(obj.name == "george") return true;
  else if(obj.name == "frank") return false;
  else return obj.name.substring(5);
}}

//Javascript
$.snippet({name:"george"}); //outputs "true"
$.snippet({name:"frank"}); //outputs "false"
$.snippet({name:"bill zarquon"}); //outputs "zarquon"

```
## Scope and Accessible Variables ##

_section still being written_

As with #if conditionals, functions are passed the current level JSON object as 'obj' and are executed via 'call' off the current snippet element. That means you have access to all the Snippet functions and attributes via 'this.<function name>()'

**snippet**
```
{func1() {
}}
{()func1}
{aList[]}
 {func2() {}}{()func2}
{[]aList}
```
**Javascript object/json**
```
{
  aList:["Obama","Loves","You", "No, really."], 
  affiliation:"Democrat"
}
```


### call and 'this' ###

Using call gives the 'this' reference some rather useful properties.

this.parentValue('

&lt;name&gt;

')

### obj ###

## Peculiarities ##
Javascript function syntax pushes JSON pretty hard. It is useful to wrap your return statment in parens () to avoid errors when your templates are coming over the wire.
Similarly, adding carriage returns and spaces a the beginning of a function declaration and just before the closing double braces '}}' can help clear up other inexplicable problems.