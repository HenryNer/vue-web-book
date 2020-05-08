/* eslint-disable */
Array.prototype.pushWithoutDuplicate = function () { //push时不重复
    for (let i = 0; i < arguments.length; i++) {
        const arg = arguments[i]
        if (this.indexOf(arg) === -1) {
            this.push(arg)
        }
    }
}