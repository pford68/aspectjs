/**
 * Test suite for AspectJS
 *
 */
var addAdvice = require("../../index").addAdvice;

describe("aspectjs", function(){

    describe("before()", function(){
        it("should add new behavior before the original function", function(){
            var advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left = increment; }};

            addAdvice(adviser, "override").before(advised, "add");
            advised.add(2);

            expect(advised.left).toEqual(4);
        });

        it("should pass the result of the new function to the advised function if transfer is false.", function(){
            var advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ return 6 + increment; }};

            addAdvice(adviser, "override", false).before(advised, "add");
            advised.add(4);

            expect(advised.left).toEqual(42);
        });

        it("should work with standalone functions too", function(){
            var obj = {id :3};
            var advised = function(){
                return obj.id - 2;
            };
            var adviser = function(){
                obj.id = 11;
            };
            advised = addAdvice(adviser).before(advised);
            expect(advised()).toEqual(9);
        });

    });

    describe("after()", function(){
        it("should add new behavior after the advised function", function(){
            var advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left = increment; }};

            addAdvice(adviser, "override").after(advised, "add");
            advised.add(2);

            expect(advised.left).toEqual(2);
        });

        it("should pass the advised function's result to the adviser if transfer is false.", function(){
            var advised, adviser, result;
            advised = {add: function(increment){ return this.left + increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left -= increment; }};

            addAdvice(adviser, "override", false).after(advised, "add");
            advised.add(2);

            expect(advised.left).toEqual(-2);
        });

        it("should pass the original arguments to the adviser if transfer is false, but the advised function does not return a result.", function(){
            var advised, adviser, result;
            advised = {add: function(increment){ this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left -= increment; }};

            addAdvice(adviser, "override", false).after(advised, "add");
            advised.add(2);

            expect(advised.left).toEqual(32);
        });
    });


    describe("around()", function(){
        it("should add new behavior before and after the original function", function(){
            var advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(invocation){
                advised.left += 5; // 37
                invocation.proceed(); // 39
                advised.left -= 19;
            }};

            addAdvice(adviser, "override").around(advised, "add");
            advised.add(2);

            expect(advised.left).toEqual(20);

            function error(){
                throw new Error();
            }
            function suppress(proceed, invocation){
                if (proceed === false){
                    invocation.proceed();
                }
            }
            error = addAdvice(suppress).around(error);
            try {
                error();
            } catch(e){
                this.fail("The error should not have been thrown.");
            }
        });
    });

});