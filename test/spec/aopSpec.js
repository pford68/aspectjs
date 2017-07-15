/**
 * Test suite for AspectJS
 *
 */
const aop = require("../../index");
const before = aop.before;
const after = aop.after;
const around = aop.around;

describe("aspectjs", () => {

    describe("before()", function(){
        it("should add new behavior before the original function", () => {
            let advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left = increment; }};

            before(advised, "add").add(adviser, "override");
            advised.add(2);

            expect(advised.left).toEqual(4);
        });

        it("should pass the result of the new function to the advised function if transfer is false.", () => {
            let advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ return 6 + increment; }};

            before(advised, "add").add(adviser, "override", false);
            advised.add(4);

            expect(advised.left).toEqual(42);
        });

        it("should work with standalone functions too", () => {
            let obj = {id :3};
            let advised = function(){
                return obj.id - 2;
            };
            let adviser = function(){
                obj.id = 11;
            };
            advised = before(advised).add(adviser);
            expect(advised()).toEqual(9);
        });

    });

    describe("after()", () => {
        it("should add new behavior after the advised function", () => {
            let advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left = increment; }};

            after(advised, "add").add(adviser, "override");
            advised.add(2);

            expect(advised.left).toEqual(2);
        });

        it("should pass the advised function's result to the adviser if transfer is false.", () => {
            let advised, adviser, result;
            advised = {add: function(increment){ return this.left + increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left -= increment; }};

            after(advised, "add").add(adviser, "override", false);
            advised.add(2);

            expect(advised.left).toEqual(-2);
        });

        it("should pass the original arguments to the adviser if transfer is false, but the advised function does not return a result.", () => {
            let advised, adviser, result;
            advised = {add: function(increment){ this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(increment){ advised.left -= increment; }};

            after(advised, "add").add(adviser, "override", false);
            advised.add(2);

            expect(advised.left).toEqual(32);
        });
    });


    describe("around()", function(){
        it("should add new behavior before and after the original function", () => {
            let advised, adviser, result;
            advised = {add: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};
            adviser = {override: function(invocation){
                advised.left += 5; // 37
                invocation.proceed(); // 39
                advised.left -= 19;
            }};

            around(advised, "add").add(adviser, "override");
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
            error = around(error).add(suppress);
            try {
                error();
            } catch(e){
                fail("The error should not have been thrown.");
            }
        });
    });

});