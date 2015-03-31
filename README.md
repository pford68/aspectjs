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

#### addAdvice(advice)
Takes a standalone function that will be used for advice and returns an Advice object

#### addAdvice(adviceObj, methodName)
Takes an object and a string for a method name.  The method will used for advice.  addAdvice() returns an Advice object.

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

## Links
* NPM:  https://www.npmjs.com/package/aspectjs/

