A simple AOP implementation for Node.  It works either with standalone functions or with object methods.  It can be used
on the client-side with Browserify too.

Example

```javascript

aspectjs.addAdvice(myGreatAdvice, "someOtherMethod").after(myGreatObject, "someMethod");

// Thereafter whenever myGreatObject.someMethod is called, 
// myGreatAdvice.someOtherMethod will be called automatically afterward.

```

## API Documentation

### Methods of aspectjs

#### addAdvice([thisArg,] function|string)
Takes either a standalone function, or a combination of an object and a string for a method name, that will be used for advice.
Returns an Advice object.

### Methods of the Advice object

#### before(joinpoint, [methodname])
Adds the advice in the Advice object before the specified join point.  The join point can be either a function 
or an object followed by a method name.  Returns the new wrapped function.

#### after(joinpoint, [methodname])
Adds the advice in the Advice object after the specified join point.  The join point can be either a function 
or an object followed by a method name.  Returns the new wrapped function.


#### around(joinpoint, [methodname])
Adds the advice in the Advice object around the specified join point.  The join point can be either a function
or an object followed by a method name.  Returns the new wrapped function.
These method requires an advice function/method that takes an Invocation object.  Within the advice body,
invocation.proceed() should be called where the joinpoint should occur.

```javascript

// Example advice object for around advice
adviser = {adviseFunction: function(invocation){
    // Some code goes here.
    invocation.proceed();   // Calls the original function.
    // Some more code goes here.
}};

```


## Usage
### Standalone functions
Both the advice and joinpoints can be standalone functions:  

``aspectjs.addAdvice(advice).before(joinpoint)``

Or the advice can be an object method, while the joinpoint is standalone: 

``aspectjs.addAdvice(advice, 'methodname').after(joinpoint)``

### Object methods
Both the advice and joinpoint can be object methods: 

``aspectjs.addAdvice(adviceObj, 'methodname').before(joinpointObj, 'methodname')``


## Examples

### Before advice
``` javascript

var addAdvice = require("aspectjs").addAdvice;

var advised, adviser, result;
advised = {
   add: function(increment){this.left += increment; }, 
   id: 'test', 
   left: 32, 
   top: 43
};
adviser = {
   override: function(increment){ advised.left = increment; }
};

addAdvice(adviser, "override").before(advised, "add");
advised.add(2);  // Should equal 4.  
            
```

### Around advice
```javascript

var advised, adviser, result;
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

addAdvice(adviser, "override").around(advised, "add");

````

## Links
* NPM:  https://www.npmjs.com/package/aspectjs/

