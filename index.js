/**
 * A simple AOP implementation for JavaScript
 *
 * @author Philip Ford
 */

function weave(type, advised, advisedFunc, aopProxy) {
    let f, $execute, standalone = false,
        transfer = aopProxy.transfer,
        adviser = aopProxy.adviser;

    if (!advisedFunc) {
        standalone = true;
        $execute = advised;
    } else {
        $execute = advised[advisedFunc].bind(advised);
    }
    aopProxy.advised = $execute;

    switch(type){
        case 'before':
            f = function () {
                let result = adviser.apply(advised, arguments);		    // Invoke the advice.
                result = result && !transfer ? [result] : null;
                return $execute.apply(advised, result || arguments);	// Call the original function.
            };
            break;
        case 'after':
            f = function () {
                let result = $execute.apply(advised, arguments);	// Call the original function and store the result.
                result = result && !transfer ? [result] : null;
                return adviser.apply(advised, result || arguments);				// Invoke the advice.
            };
            break;
        case 'around':
            let invocation = {
                proceed: function () {
                    return this.method.apply(this, this.args);
                }
            };
            f = function () {
                invocation.args = arguments;
                invocation.method = $execute;
                invocation.name = advisedFunc;
                return adviser(invocation);
            };
            break;
        default:
            console.log("AOP Error", "Unsupported advice type:  " + type);
    }

    if (standalone) {
        return (advised = f);
    } else {
        return (advised[advisedFunc] = f);
    }

}




/*
 Advisor class
 */
function Advisor(type, advised, advisedFunc = null){
    this.type = type;
    this.advised = advised;
    this.advisedMethod = advisedFunc;
    Object.freeze(this);
}
/**
 * Applies advice
 *
 * @param adviser
 * @param method
 * @param transfer
 * @returns {*}
 */
Advisor.prototype.add = function(adviser, method = null, transfer = true){

    adviser = method ? adviser[method].bind(adviser) : adviser;
    if (typeof adviser !== 'function') {
        throw new TypeError("[aop] An adviser function is required in addAdvice.");
    }
    return weave(this.type, this.advised, this.advisedMethod, { adviser: adviser, transfer: transfer });
};
Object.freeze(Advisor.prototype);  // Freezing all copies


//======================================================================== Public methods
module.exports = {

    /**
     * Adds before advice to the specified method/function. Returns an object containing an
     * add() method.  Once add() is called, the advice is applied.  The new wrapped function
     * is returned form add().
     *
     * @param advised
     * @param advisedFunc
     * @returns {Advisor}
     */
    before: function (advised, advisedFunc = null) {
        return new Advisor('before', advised, advisedFunc);
    },

    /**
     * Adds after advice to the specified method/function. Returns an object containing an
     * add() method.  Once add() is called, the advice is applied.  The new wrapped function
     * is returned form add().
     *
     * @param advised
     * @param advisedFunc
     * @returns {Advisor}
     */
    after: function (advised, advisedFunc) {
        return new Advisor('after', advised, advisedFunc);
    },

    /**
     * Adds around advice to the specified method/function. Returns an object containing an
     * add() method.  Once add() is called, the advice is applied.  The new wrapped function
     * is returned form add().
     *
     * @param advised
     * @param advisedFunc
     * @returns {Advisor}
     */
    around: function (advised, advisedFunc) {
        return new Advisor('around', advised, advisedFunc);
    }
};

