var EB = (function () {
    function EventBus() {
        this.events = {}
    }

    EventBus.prototype.on = function on(name, fn) {
        if (this.events[name] && this.events[name].length > 0) {
            this.events[name].push(fn)
        } else {
            this.events[name] = [fn]
        }
    }
    EventBus.prototype.un = function un(name, fn) {
        if (!this.events[name]) {
            return
        }

        const index = this.events[name].findIndex(item => item === fn)

        if (index < 0) {
            return
        }

        this.events[name].splice(index, 1)
    }
    EventBus.prototype.emit = function on(name, data) {
        if (!this.events[name]) {
            return
        }

        this.events[name].forEach(fn => fn(data))
    }

    return new EventBus()
})()