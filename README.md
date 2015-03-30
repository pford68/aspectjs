A simple AOP implementation for Node.  It works either with standalone functions or with object methods.

## Usage
### Standalone functions
Both the advice and joinpoints can be standalone functions:  

``aspectjs.addAdvice(advice).before(joinpoint)``

Or the advice can be an object method, while the joinpoint is standalone: 

``aspectjs.addAdvice(obj, 'methodname').after(joinpoint)``

### Object methods
Both the advice and joinpoint can be object methods: 

``aspectjs.addAdvice(obj, 'methodname').before(joinpoint, 'methodname')``


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

