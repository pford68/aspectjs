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


    describe("Advisor", function(){
        'use strict';

        function attemptOverride(advisor){
            try {
                advisor.add = function(){ console.log('Hi!'); };
                fail('We should not reach this point.');
            } catch (e){
                console.log('Success:  was NOT able to edit the add method');
            }
        }

        function attemptOverrideByExtension(advisor){
            try {
                let test = Object.create(advisor);
                test.add = function(){ console.log('Hi!'); };
                fail('We should not reach this point.');
            } catch(e){
                console.log('Success:  was NOT able to edit the add method in a copy of the object');
            }
        }

        function attemptReplace(advisor){
            try {
                advisor.advised = 'gfhgfjhfjghjhgj';
                console.log(advisor.advised);
                fail('We should not reach this point.');
            } catch (e){
                console.log('Success:  was NOT able to edit the advised property');
            }

            try {
                advisor.advisedMethod = 'gfhgfjhfjghjhgj';
                console.log(advisor.advisedMethod);
                fail('We should not reach this point.');
            } catch (e){
                console.log('Success:  was NOT able to edit the advisedMethod property');
            }

            try {
                advisor.type = 'gfhgfjhfjghjhgj';
                console.log(advisor.type);
                fail('We should not reach this point.');
            } catch (e){
                console.log('Success:  was NOT able to edit the type property');
            }
        }

        let advised = {sum: function(increment){this.left += increment; }, id: 'test', left: 32, top: 43};

        it('should not be editable', () => {
            let advisor = before(advised, 'sum');
            expect(Object.isFrozen(advisor)).toBeTruthy();
            expect(Object.isExtensible(advisor)).toBeFalsy();

            attemptReplace(advisor);
        });


        it('should not allow the add() to be changed', () => {
            let advisor = after(advised, 'sum');
            attemptOverride(advisor)
        });

        it('should be totally frozen when returned from any API method:  before, after, or around', () => {
            let afterAdvisor = after(advised, 'sum');
            attemptReplace(afterAdvisor);
            attemptOverride(afterAdvisor);

            let beforeAdvisor = before(advised, 'sum');
            attemptReplace(beforeAdvisor);
            attemptOverride(beforeAdvisor);

            let aroundAdvisor = around(advised, 'sum');
            attemptReplace(aroundAdvisor);
            attemptOverride(aroundAdvisor);
        });

        it('should be final, cannot be overriden in extensions', () => {
            let afterAdvisor = after(advised, 'sum');
            attemptOverrideByExtension(afterAdvisor);

            let beforeAdvisor = before(advised, 'sum');
            attemptOverrideByExtension(beforeAdvisor);

            let aroundAdvisor = around(advised, 'sum');
            attemptOverrideByExtension(aroundAdvisor);
        });
    })

});