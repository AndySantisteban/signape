import _ from "lodash";

class Emitter {
  constructor() {
    this.events = {};
  }

  /**
   * This function emits an event and passes arguments to all functions subscribed to that event.
   * @param event - The name of the event being emitted.
   * @param args - args is a rest parameter that allows the function to accept any number of arguments
   * as an array. In this case, it is used to pass any additional arguments to the event listeners when
   * the event is emitted.
   * @returns The `emit` method is returning the instance of the object (`this`) to allow for method
   * chaining.
   */
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((fn) => fn(...args));
    }
    return this;
  }

  /**
   * This function adds an event listener to an object.
   * @param event - A string representing the name of the event to be listened for.
   * @param fn - fn is a function that will be executed when the specified event occurs. It is the
   * callback function that will be added to the array of event listeners for the given event.
   * @returns The object that the `on` method was called on is being returned.
   */
  on(event, fn) {
    if (this.events[event]) this.events[event].push(fn);
    else this.events[event] = [fn];
    return this;
  }

  /**
   * This function removes a specified event listener function from an object's list of event
   * listeners.
   * @param event - The event parameter is a string that represents the name of the event from which
   * the listener needs to be removed.
   * @param fn - fn is a function that needs to be removed from the list of listeners for a particular
   * event.
   * @returns The `off` method is returning the current instance of the object (`this`) to allow for
   * method chaining.
   */
  off(event, fn) {
    if (event && _.isFunction(fn)) {
      const listeners = this.events[event];
      const index = listeners.findIndex((_fn) => _fn === fn);
      listeners.splice(index, 1);
    } else this.events[event] = [];
    return this;
  }
}

export default Emitter;
