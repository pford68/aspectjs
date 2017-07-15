A simple AOP implementation for Node.  It works either with standalone functions or with object methods.  It can be used
on the client-side with Browserify too.

![Build Status](https://travis-ci.org/pford68/aspectjs.svg?branch=master)
[![npm version](https://badge.fury.io/js/aspectjs.svg)](https://badge.fury.io/js/aspectjs)

Example

```javascript
aspectjs.after(myGreatObject, "someMethod").add(myGreatAdvice, "someOtherMethod");

// Thereafter whenever myGreatObject.someMethod is called, 
// myGreatAdvice.someOtherMethod will be called automatically afterward.
```

## API Documentation
All of the following methods of aspectjs return an "advice object" that contains an `add()` method,
which applies the advice setup in after(), before(), or around().

### Methods of aspectjs

#### before(joinpoint, [methodname])
Will add advice before the specified join point, once `add()` is called.  The join point can be either a function 
or an object followed by a method name.  Returns the advice object.

#### after(joinpoint, [methodname])
Will the advice in the Advice object after the specified join point, once `add()` is called.  
The join point can be either a function or an object followed by a method name.  
Returns the he advice object.


#### around(joinpoint, [methodname])
Adds the advice in the Advice object around the specified join point,  once `add()` is called.  
The join point can be either a function or an object followed by a method name.  
Returns the advice object.

These method requires an advice function/method that takes an Invocation object.  Within the advice body,
invocation.proceed() should be called where the joinpoint should occur.  The advice is 
applied only after `add()` is called on the returned advice object.


```javascript

// Example advice object for around advice
adviser = {adviseFunction: function(invocation){
    // Some code goes here.
    invocation.proceed();   // Calls the original function.
    // Some more code goes here.
}};

```


### Methods of the advice object
#### add([thisArg,] function|string)
Returns the new function that wraps the original function passed to before(), after(), or around().





## Usage
### Standalone functions
Both the advice and joinpoints can be standalone functions:  

``aspectjs.before(joinpoint).add(advice).``

Or the advice can be an object method, while the joinpoint is standalone: 

``aspectjs..after(joinpoint).add(advice, 'methodname')``

### Object methods
Both the advice and joinpoint can be object methods: 

``aspectjs.before(joinpointObj, 'methodname').add(adviceObj, 'methodname')``


## Examples

### Before advice
``` javascript
const before = require('aspectjs').before;
let addAdvice = require("aspectjs").addAdvice;

let advised, adviser, result;
advised = {
   add: function(increment){this.left += increment; }, 
   id: 'test', 
   left: 32, 
   top: 43
};
adviser = {
   override: function(increment){ advised.left = increment; }
};

before(advised, "add").add(adviser, "override");
advised.add(2);  // Should equal 4.        
```

### Around advice
```javascript
const around = require('aspectjs').around;
let advised, adviser, result;
advised = {
   add: function(increment){
       this.left += increment; 
   }, 
   id: 'test', 
   left: 32, 
   top: 43
};

// The advice function/method should take an Invocation object as input.
// Then invocation.proceed() should be called where the joinpoint occurs.
adviser = {
   override: function(invocation){
       advised.left += 5; // 37
       invocation.proceed(); // 39
       advised.left -= 19;
   }
};

around(advised, "add").add(adviser, "override");

```

## Links
* NPM:  https://www.npmjs.com/package/aspectjs/

