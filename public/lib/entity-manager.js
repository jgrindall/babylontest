(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ensy = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/*!
 * ensy - Entity System JavaScript Library v1.3.0
 *
 * A JavaScript implementation of the Entity System model as described by
 * Adam Martin in http://t-machine.org/index.php/2009/10/26/entity-systems-are-the-future-of-mmos-part-5/
 *
 * @author Adrian Gaudebert - adrian@gaudebert.fr
 * @license MIT license.
 * @documentation https://entity-system-js.readthedocs.io/
 *
 */

/*!
 * Return a clone of an object.
 * From https://stackoverflow.com/questions/728360
 */
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj))) return obj;

    var copy = void 0;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
}

/*!
 * Return true if the parameter is a function.
 * From https://stackoverflow.com/questions/5999998
 */
function isFunction(thingToCheck) {
    return thingToCheck && {}.toString.call(thingToCheck) === '[object Function]';
}

/**
 * @class EntityManager
 *
 * Implement the Entity System model and provide tools to easily
 * create and manipulate Entities, Components and Processors.
 */

var EntityManager = function () {
    function EntityManager(listener) {
        classCallCheck(this, EntityManager);

        this.listener = null;
        if (listener && isFunction(listener.emit)) {
            this.listener = listener;
        }

        // A list of entity IDs, each being a simple integer.
        this.entities = [];

        // A dictionary of components, where keys are the name of each
        // component. Components are objects containing:
        //  * metadata (name, description)
        //  * the initial set of data that defines the default state of a
        //    newly instanciated component
        this.components = {};

        // A dictionary of assemblages, where keys are the name of each
        // assemblage. Assemblages are objects containing:
        //  * metadata (name, description)
        //  * a list of components to add to the entity
        //  * an initial state for some components, to override the defaults
        this.assemblages = {};

        /*!
         * A relational-like list of entity states. There is one line for
         * each entity - component association.
         *
         * To optimize the access time to this data, it is stored in a
         * dictionary of dictionaries of this form:
         * {
         *   "componentId": {
         *     "entityId": {
         *       ...
         *       here comes the state of this entity for this component
         *       ...
         *     }
         *   }
         * }
         *
         * This way, getting the data of one entity for one component is:
         *   this.entityComponentData[componentId][entityId]
         * and getting all entities for one component is:
         *   this.entityComponentData[componentId]
         */
        this.entityComponentData = {};

        // The ordered list of processors known by this manager.
        this.processors = [];

        // The next unique identifier.
        this.uid = 0;
    }

    /**
     * Return an identifier unique to this system.
     *
     * @return {int} - Unique identifier.
     */


    createClass(EntityManager, [{
        key: 'getUid',
        value: function getUid() {
            return this.uid++;
        }

        //=========================================================================
        // ENTITIES

        /**
         * Create a new entity in the system by creating a new instance of each of
         * its components.
         *
         * @param {array} componentIds - List of identifiers of the components that compose the new entity.
         * @param {int} entityId - Optional. Unique identifier of the entity. If passed, no new id will be generated.
         * @return {int} - Unique identifier of the new entity.
         */

    }, {
        key: 'createEntity',
        value: function createEntity(componentIds, entityId) {
            if (typeof entityId === 'undefined' || entityId === null) {
                entityId = this.getUid();
            } else if (entityId > this.uid) {
                // Make sure another entity with the same ID won't be created in the future.
                this.uid = entityId;
            }

            this.addComponentsToEntity(componentIds, entityId);
            if (!this.entities.includes(entityId)) {
                this.entities.push(entityId);
            }
            if (this.listener) {
                // Signal the creation of a new entity.
                this.listener.emit('entityCreated', entityId);
            }
            return entityId;
        }

        /**
         * Remove an entity and its instanciated components from the system.
         *
         * @param {int} id - Unique identifier of the entity.
         * @return {object} - this
         */

    }, {
        key: 'removeEntity',
        value: function removeEntity(id) {
            // Remove all data for this entity.
            for (var comp in this.entityComponentData) {
                if (this.entityComponentData.hasOwnProperty(comp)) {
                    if (this.entityComponentData[comp][id]) {
                        delete this.entityComponentData[comp][id];
                    }
                }
            }

            // Remove the entity from the list of known entities.
            this.entities.splice(this.entities.indexOf(id), 1);

            if (this.listener) {
                // Signal the removal of an entity.
                this.listener.emit('entityCreated', id);
            }

            return this;
        }

        //=========================================================================
        // COMPONENTS

        /**
         * Add a component to the list of known components.
         *
         * @param {string} id - Unique identifier of the component.
         * @param {object} component - Object containing the metadata and data of the component.
         * @return {object} - this
         */

    }, {
        key: 'addComponent',
        value: function addComponent(id, component) {
            this.components[id] = component;
            return this;
        }

        /**
         * Remove a component from the list of known components.
         *
         * @param {string} id - Unique identifier of the component.
         * @return {object} - this
         */

    }, {
        key: 'removeComponent',
        value: function removeComponent(id) {
            delete this.components[id];
            delete this.entityComponentData[id];
            return this;
        }

        /**
         * Get the list of components this instance knows.
         *
         * @return {array} - List of names of components.
         */

    }, {
        key: 'getComponentsList',
        value: function getComponentsList() {
            return Object.keys(this.components);
        }

        /**
         * Create a new instance of each listed component and associate them
         * with the entity.
         *
         * @param {array} componentIds - List of identifiers of the components to add to the entity.
         * @param {int} entityId - Unique identifier of the entity.
         * @return {object} - this
         */

    }, {
        key: 'addComponentsToEntity',
        value: function addComponentsToEntity(componentIds, entityId) {
            var _this = this;

            var self = this;

            // First verify that all the components exist, and throw an error
            // if any is unknown.
            componentIds.forEach(function (comp) {
                if (!_this.components[comp]) {
                    throw new Error('Trying to use unknown component: ' + comp);
                }
            });

            // Now we know that this request is correct, let's create the new
            // entity and instanciate the component's states.
            componentIds.forEach(function (comp) {
                if (!_this.entityComponentData[comp]) {
                    _this.entityComponentData[comp] = {};
                }

                var newCompState = null;

                // If the manager has a listener, we want to create getters
                // and setters so that we can emit state changes. But if it does
                // not have one, there is no need to add the overhead.
                if (_this.listener) {
                    newCompState = {};
                    (function (newCompState, comp) {
                        var state = clone(self.components[comp].state);

                        // Create a setter for each state attribute, so we can emit an
                        // event whenever the state of this component changes.
                        for (var property in state) {
                            if (state.hasOwnProperty(property)) {
                                (function (property) {
                                    Object.defineProperty(newCompState, property, {
                                        enumerable: true,
                                        get: function get() {
                                            return state[property];
                                        },
                                        set: function set(val) {
                                            state[property] = val;
                                            self.listener.emit('entityComponentUpdated', entityId, comp);
                                        }
                                    });
                                })(property);
                            }
                        }
                    })(newCompState, comp);
                } else {
                    newCompState = clone(self.components[comp].state);
                }

                // Store the entity's ID so it's easier to find other components for that entity.
                newCompState.__id = entityId;

                _this.entityComponentData[comp][entityId] = newCompState;

                if (_this.listener) {
                    // Signal the addition of a new component to the entity.
                    _this.listener.emit('entityComponentAdded', entityId, comp);
                }
            });

            return this;
        }

        /**
         * De-associate a list of components from the entity.
         *
         * @param {array} componentIds - List of identifiers of the components to remove from the entity.
         * @param {int} entityId - Unique identifier of the entity.
         * @return {object} - this
         */

    }, {
        key: 'removeComponentsFromEntity',
        value: function removeComponentsFromEntity(componentIds, entityId) {
            var _this2 = this;

            // First verify that all the components exist, and throw an error
            // if any is unknown.
            componentIds.forEach(function (comp) {
                if (!_this2.components[comp]) {
                    throw new Error('Trying to use unknown component: ' + comp);
                }
            });

            // Now we know that this request is correct, let's remove all the
            // components' states for that entity.
            componentIds.forEach(function (comp) {
                if (_this2.entityComponentData[comp]) {
                    if (_this2.entityComponentData[comp][entityId]) {
                        delete _this2.entityComponentData[comp][entityId];
                        if (_this2.listener) {
                            // Signal the creation of a new entity.
                            _this2.listener.emit('entityComponentRemoved', entityId, comp);
                        }
                    }
                }
            });

            return this;
        }

        /**
         * Return a reference to an object that contains the data of an
         * instanciated component of an entity.
         *
         * @param {int} entityId - Unique identifier of the entity.
         * @param {string} componentId - Unique identifier of the component.
         * @return {object} - Component data of one entity.
         */

    }, {
        key: 'getComponentDataForEntity',
        value: function getComponentDataForEntity(componentId, entityId) {
            if (!(componentId in this.components)) {
                throw new Error('Trying to use unknown component: ' + componentId);
            }

            if (!this.entityComponentData.hasOwnProperty(componentId) || !this.entityComponentData[componentId].hasOwnProperty(entityId)) {
                throw new Error('No data for component ' + componentId + ' and entity ' + entityId);
            }

            return this.entityComponentData[componentId][entityId];
        }

        /**
         * Update the state of a component, many keys at once.
         *
         * @param {int} entityId - Unique identifier of the entity.
         * @param {string} componentId - Unique identifier of the component.
         * @param {object} newState - Object containing the new state to apply.
         * @return {object} - this
         */

    }, {
        key: 'updateComponentDataForEntity',
        value: function updateComponentDataForEntity(componentId, entityId, newState) {
            var compState = this.getComponentDataForEntity(componentId, entityId);

            for (var key in newState) {
                if (newState.hasOwnProperty(key) && compState.hasOwnProperty(key)) {
                    compState[key] = newState[key];
                }
            }

            return this;
        }

        /**
         * Return a list of objects containing the data of all of a given component.
         *
         * @param {string} componentId - Unique identifier of the component.
         * @return {array} - List of component data for one component.
         */

    }, {
        key: 'getComponentsData',
        value: function getComponentsData(componentId) {
            if (!(componentId in this.components)) {
                throw new Error('Trying to use unknown component: ' + componentId);
            }

            if (!this.entityComponentData.hasOwnProperty(componentId)) {
                return [];
            }

            return this.entityComponentData[componentId];
        }

        /**
         * Return true if the entity has the component.
         *
         * @param {int} entityId - Unique identifier of the entity.
         * @param {string} componentId - Unique identifier of the component.
         * @return {boolean} - True if the entity has the component.
         */

    }, {
        key: 'entityHasComponent',
        value: function entityHasComponent(entityId, componentId) {
            if (!(componentId in this.components)) {
                return false;
            }

            return this.entityComponentData.hasOwnProperty(componentId) && this.entityComponentData[componentId].hasOwnProperty(entityId);
        }

        //=========================================================================
        // ASSEMBLAGES

        /**
         * Add an assemblage to the list of known assemblages.
         *
         * @param {string} id - Unique identifier of the assemblage.
         * @param {object} assemblage - An instance of an assemblage to add.
         * @return {object} - this
         */

    }, {
        key: 'addAssemblage',
        value: function addAssemblage(id, assemblage) {
            this.assemblages[id] = assemblage;
            return this;
        }

        /**
         * Remove an assemblage from the list of known assemblages.
         *
         * @param {string} id - Unique identifier of the assemblage.
         * @return {object} - this
         */

    }, {
        key: 'removeAssemblage',
        value: function removeAssemblage(id) {
            delete this.assemblages[id];
            return this;
        }

        /**
         * Create a new entity in the system by creating a new instance of each of
         * its components and setting their initial state, using an assemblage.
         *
         * @param {string} assemblageId - Id of the assemblage to create the entity from.
         * @return {int} - Unique identifier of the new entity.
         */

    }, {
        key: 'createEntityFromAssemblage',
        value: function createEntityFromAssemblage(assemblageId) {
            if (!(assemblageId in this.assemblages)) {
                throw new Error('Trying to use unknown assemblage: ' + assemblageId);
            }

            var assemblage = this.assemblages[assemblageId];
            var entity = this.createEntity(assemblage.components);

            for (var comp in assemblage.initialState) {
                if (assemblage.initialState.hasOwnProperty(comp)) {
                    var newState = assemblage.initialState[comp];
                    this.updateComponentDataForEntity(comp, entity, newState);
                }
            }

            return entity;
        }

        //=========================================================================
        // PROCESSORS

        /**
         * Add a processor to the list of known processors.
         *
         * @param {object} processor - An instance of a processor to manage.
         * @return {object} - this
         */

    }, {
        key: 'addProcessor',
        value: function addProcessor(processor) {
            this.processors.push(processor);
            return this;
        }

        /**
         * Remove a processor from the list of known processors.
         *
         * @param {object} processor - An instance of a processor to remove.
         * @return {object} - this
         */

    }, {
        key: 'removeProcessor',
        value: function removeProcessor(processor) {
            this.processors.splice(this.processors.indexOf(processor), 1);
            return this;
        }

        /**
         * Update all the known processors.
         *
         * @param {int} dt - The time delta since the last call to update. Will be passed as an argument to all processor's `update` method.
         * @return {object} - this
         */

    }, {
        key: 'update',
        value: function update(dt) {
            this.processors.forEach(function (processor) {
                return processor.update(dt);
            });
            return this;
        }
    }]);
    return EntityManager;
}();

return EntityManager;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbInNyYy9lbnRpdHktbWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGVuc3kgLSBFbnRpdHkgU3lzdGVtIEphdmFTY3JpcHQgTGlicmFyeSB2MS4zLjBcbiAqXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIEVudGl0eSBTeXN0ZW0gbW9kZWwgYXMgZGVzY3JpYmVkIGJ5XG4gKiBBZGFtIE1hcnRpbiBpbiBodHRwOi8vdC1tYWNoaW5lLm9yZy9pbmRleC5waHAvMjAwOS8xMC8yNi9lbnRpdHktc3lzdGVtcy1hcmUtdGhlLWZ1dHVyZS1vZi1tbW9zLXBhcnQtNS9cbiAqXG4gKiBAYXV0aG9yIEFkcmlhbiBHYXVkZWJlcnQgLSBhZHJpYW5AZ2F1ZGViZXJ0LmZyXG4gKiBAbGljZW5zZSBNSVQgbGljZW5zZS5cbiAqIEBkb2N1bWVudGF0aW9uIGh0dHBzOi8vZW50aXR5LXN5c3RlbS1qcy5yZWFkdGhlZG9jcy5pby9cbiAqXG4gKi9cblxuLyohXG4gKiBSZXR1cm4gYSBjbG9uZSBvZiBhbiBvYmplY3QuXG4gKiBGcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzcyODM2MFxuICovXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICAvLyBIYW5kbGUgdGhlIDMgc2ltcGxlIHR5cGVzLCBhbmQgbnVsbCBvciB1bmRlZmluZWRcbiAgICBpZiAobnVsbCA9PSBvYmogfHwgJ29iamVjdCcgIT0gdHlwZW9mIG9iaikgcmV0dXJuIG9iajtcblxuICAgIGxldCBjb3B5O1xuXG4gICAgLy8gSGFuZGxlIERhdGVcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBjb3B5ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29weS5zZXRUaW1lKG9iai5nZXRUaW1lKCkpO1xuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgQXJyYXlcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgY29weSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjb3B5W2ldID0gY2xvbmUob2JqW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgT2JqZWN0XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBjb3B5ID0ge307XG4gICAgICAgIGZvciAobGV0IGF0dHIgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGF0dHIpKSBjb3B5W2F0dHJdID0gY2xvbmUob2JqW2F0dHJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59XG5cbi8qIVxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uLlxuICogRnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81OTk5OTk4XG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odGhpbmdUb0NoZWNrKSB7XG4gICAgcmV0dXJuIHRoaW5nVG9DaGVjayAmJiAoe30pLnRvU3RyaW5nLmNhbGwodGhpbmdUb0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBAY2xhc3MgRW50aXR5TWFuYWdlclxuICpcbiAqIEltcGxlbWVudCB0aGUgRW50aXR5IFN5c3RlbSBtb2RlbCBhbmQgcHJvdmlkZSB0b29scyB0byBlYXNpbHlcbiAqIGNyZWF0ZSBhbmQgbWFuaXB1bGF0ZSBFbnRpdGllcywgQ29tcG9uZW50cyBhbmQgUHJvY2Vzc29ycy5cbiAqL1xuY2xhc3MgRW50aXR5TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lciA9IG51bGw7XG4gICAgICAgIGlmIChsaXN0ZW5lciAmJiBpc0Z1bmN0aW9uKGxpc3RlbmVyLmVtaXQpKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBIGxpc3Qgb2YgZW50aXR5IElEcywgZWFjaCBiZWluZyBhIHNpbXBsZSBpbnRlZ2VyLlxuICAgICAgICB0aGlzLmVudGl0aWVzID0gW107XG5cbiAgICAgICAgLy8gQSBkaWN0aW9uYXJ5IG9mIGNvbXBvbmVudHMsIHdoZXJlIGtleXMgYXJlIHRoZSBuYW1lIG9mIGVhY2hcbiAgICAgICAgLy8gY29tcG9uZW50LiBDb21wb25lbnRzIGFyZSBvYmplY3RzIGNvbnRhaW5pbmc6XG4gICAgICAgIC8vICAqIG1ldGFkYXRhIChuYW1lLCBkZXNjcmlwdGlvbilcbiAgICAgICAgLy8gICogdGhlIGluaXRpYWwgc2V0IG9mIGRhdGEgdGhhdCBkZWZpbmVzIHRoZSBkZWZhdWx0IHN0YXRlIG9mIGFcbiAgICAgICAgLy8gICAgbmV3bHkgaW5zdGFuY2lhdGVkIGNvbXBvbmVudFxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7fTtcblxuICAgICAgICAvLyBBIGRpY3Rpb25hcnkgb2YgYXNzZW1ibGFnZXMsIHdoZXJlIGtleXMgYXJlIHRoZSBuYW1lIG9mIGVhY2hcbiAgICAgICAgLy8gYXNzZW1ibGFnZS4gQXNzZW1ibGFnZXMgYXJlIG9iamVjdHMgY29udGFpbmluZzpcbiAgICAgICAgLy8gICogbWV0YWRhdGEgKG5hbWUsIGRlc2NyaXB0aW9uKVxuICAgICAgICAvLyAgKiBhIGxpc3Qgb2YgY29tcG9uZW50cyB0byBhZGQgdG8gdGhlIGVudGl0eVxuICAgICAgICAvLyAgKiBhbiBpbml0aWFsIHN0YXRlIGZvciBzb21lIGNvbXBvbmVudHMsIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xuICAgICAgICB0aGlzLmFzc2VtYmxhZ2VzID0ge307XG5cbiAgICAgICAgLyohXG4gICAgICAgICAqIEEgcmVsYXRpb25hbC1saWtlIGxpc3Qgb2YgZW50aXR5IHN0YXRlcy4gVGhlcmUgaXMgb25lIGxpbmUgZm9yXG4gICAgICAgICAqIGVhY2ggZW50aXR5IC0gY29tcG9uZW50IGFzc29jaWF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUbyBvcHRpbWl6ZSB0aGUgYWNjZXNzIHRpbWUgdG8gdGhpcyBkYXRhLCBpdCBpcyBzdG9yZWQgaW4gYVxuICAgICAgICAgKiBkaWN0aW9uYXJ5IG9mIGRpY3Rpb25hcmllcyBvZiB0aGlzIGZvcm06XG4gICAgICAgICAqIHtcbiAgICAgICAgICogICBcImNvbXBvbmVudElkXCI6IHtcbiAgICAgICAgICogICAgIFwiZW50aXR5SWRcIjoge1xuICAgICAgICAgKiAgICAgICAuLi5cbiAgICAgICAgICogICAgICAgaGVyZSBjb21lcyB0aGUgc3RhdGUgb2YgdGhpcyBlbnRpdHkgZm9yIHRoaXMgY29tcG9uZW50XG4gICAgICAgICAqICAgICAgIC4uLlxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKiAgIH1cbiAgICAgICAgICogfVxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIHdheSwgZ2V0dGluZyB0aGUgZGF0YSBvZiBvbmUgZW50aXR5IGZvciBvbmUgY29tcG9uZW50IGlzOlxuICAgICAgICAgKiAgIHRoaXMuZW50aXR5Q29tcG9uZW50RGF0YVtjb21wb25lbnRJZF1bZW50aXR5SWRdXG4gICAgICAgICAqIGFuZCBnZXR0aW5nIGFsbCBlbnRpdGllcyBmb3Igb25lIGNvbXBvbmVudCBpczpcbiAgICAgICAgICogICB0aGlzLmVudGl0eUNvbXBvbmVudERhdGFbY29tcG9uZW50SWRdXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmVudGl0eUNvbXBvbmVudERhdGEgPSB7fTtcblxuICAgICAgICAvLyBUaGUgb3JkZXJlZCBsaXN0IG9mIHByb2Nlc3NvcnMga25vd24gYnkgdGhpcyBtYW5hZ2VyLlxuICAgICAgICB0aGlzLnByb2Nlc3NvcnMgPSBbXTtcblxuICAgICAgICAvLyBUaGUgbmV4dCB1bmlxdWUgaWRlbnRpZmllci5cbiAgICAgICAgdGhpcy51aWQgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhbiBpZGVudGlmaWVyIHVuaXF1ZSB0byB0aGlzIHN5c3RlbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ludH0gLSBVbmlxdWUgaWRlbnRpZmllci5cbiAgICAgKi9cbiAgICBnZXRVaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVpZCsrO1xuICAgIH1cblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEVOVElUSUVTXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgZW50aXR5IGluIHRoZSBzeXN0ZW0gYnkgY3JlYXRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgZWFjaCBvZlxuICAgICAqIGl0cyBjb21wb25lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHthcnJheX0gY29tcG9uZW50SWRzIC0gTGlzdCBvZiBpZGVudGlmaWVycyBvZiB0aGUgY29tcG9uZW50cyB0aGF0IGNvbXBvc2UgdGhlIG5ldyBlbnRpdHkuXG4gICAgICogQHBhcmFtIHtpbnR9IGVudGl0eUlkIC0gT3B0aW9uYWwuIFVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBlbnRpdHkuIElmIHBhc3NlZCwgbm8gbmV3IGlkIHdpbGwgYmUgZ2VuZXJhdGVkLlxuICAgICAqIEByZXR1cm4ge2ludH0gLSBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgbmV3IGVudGl0eS5cbiAgICAgKi9cbiAgICBjcmVhdGVFbnRpdHkoY29tcG9uZW50SWRzLCBlbnRpdHlJZCkge1xuICAgICAgICBpZiAodHlwZW9mIGVudGl0eUlkID09PSAndW5kZWZpbmVkJyB8fCBlbnRpdHlJZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZW50aXR5SWQgPSB0aGlzLmdldFVpZCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGVudGl0eUlkID4gdGhpcy51aWQpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBhbm90aGVyIGVudGl0eSB3aXRoIHRoZSBzYW1lIElEIHdvbid0IGJlIGNyZWF0ZWQgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgICAgIHRoaXMudWlkID0gZW50aXR5SWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudHNUb0VudGl0eShjb21wb25lbnRJZHMsIGVudGl0eUlkKTtcbiAgICAgICAgaWYgKCF0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGVudGl0eUlkKSkge1xuICAgICAgICAgICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eUlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcikge1xuICAgICAgICAgICAgLy8gU2lnbmFsIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBlbnRpdHkuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyLmVtaXQoJ2VudGl0eUNyZWF0ZWQnLCBlbnRpdHlJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVudGl0eUlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBlbnRpdHkgYW5kIGl0cyBpbnN0YW5jaWF0ZWQgY29tcG9uZW50cyBmcm9tIHRoZSBzeXN0ZW0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2ludH0gaWQgLSBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgZW50aXR5LlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSB0aGlzXG4gICAgICovXG4gICAgcmVtb3ZlRW50aXR5KGlkKSB7XG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZGF0YSBmb3IgdGhpcyBlbnRpdHkuXG4gICAgICAgIGZvciAobGV0IGNvbXAgaW4gdGhpcy5lbnRpdHlDb21wb25lbnREYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbnRpdHlDb21wb25lbnREYXRhLmhhc093blByb3BlcnR5KGNvbXApKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW50aXR5Q29tcG9uZW50RGF0YVtjb21wXVtpZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZW50aXR5Q29tcG9uZW50RGF0YVtjb21wXVtpZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBlbnRpdHkgZnJvbSB0aGUgbGlzdCBvZiBrbm93biBlbnRpdGllcy5cbiAgICAgICAgdGhpcy5lbnRpdGllcy5zcGxpY2UodGhpcy5lbnRpdGllcy5pbmRleE9mKGlkKSwgMSk7XG5cbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgICAgICAgIC8vIFNpZ25hbCB0aGUgcmVtb3ZhbCBvZiBhbiBlbnRpdHkuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyLmVtaXQoJ2VudGl0eUNyZWF0ZWQnLCBpZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBDT01QT05FTlRTXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb21wb25lbnQgdG8gdGhlIGxpc3Qgb2Yga25vd24gY29tcG9uZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBvbmVudCAtIE9iamVjdCBjb250YWluaW5nIHRoZSBtZXRhZGF0YSBhbmQgZGF0YSBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSB0aGlzXG4gICAgICovXG4gICAgYWRkQ29tcG9uZW50KGlkLCBjb21wb25lbnQpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzW2lkXSA9IGNvbXBvbmVudDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY29tcG9uZW50IGZyb20gdGhlIGxpc3Qgb2Yga25vd24gY29tcG9uZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQHJldHVybiB7b2JqZWN0fSAtIHRoaXNcbiAgICAgKi9cbiAgICByZW1vdmVDb21wb25lbnQoaWQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuY29tcG9uZW50c1tpZF07XG4gICAgICAgIGRlbGV0ZSB0aGlzLmVudGl0eUNvbXBvbmVudERhdGFbaWRdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxpc3Qgb2YgY29tcG9uZW50cyB0aGlzIGluc3RhbmNlIGtub3dzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7YXJyYXl9IC0gTGlzdCBvZiBuYW1lcyBvZiBjb21wb25lbnRzLlxuICAgICAqL1xuICAgIGdldENvbXBvbmVudHNMaXN0KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb21wb25lbnRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgZWFjaCBsaXN0ZWQgY29tcG9uZW50IGFuZCBhc3NvY2lhdGUgdGhlbVxuICAgICAqIHdpdGggdGhlIGVudGl0eS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGNvbXBvbmVudElkcyAtIExpc3Qgb2YgaWRlbnRpZmllcnMgb2YgdGhlIGNvbXBvbmVudHMgdG8gYWRkIHRvIHRoZSBlbnRpdHkuXG4gICAgICogQHBhcmFtIHtpbnR9IGVudGl0eUlkIC0gVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGVudGl0eS5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IC0gdGhpc1xuICAgICAqL1xuICAgIGFkZENvbXBvbmVudHNUb0VudGl0eShjb21wb25lbnRJZHMsIGVudGl0eUlkKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIEZpcnN0IHZlcmlmeSB0aGF0IGFsbCB0aGUgY29tcG9uZW50cyBleGlzdCwgYW5kIHRocm93IGFuIGVycm9yXG4gICAgICAgIC8vIGlmIGFueSBpcyB1bmtub3duLlxuICAgICAgICBjb21wb25lbnRJZHMuZm9yRWFjaChjb21wID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzW2NvbXBdKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gdXNlIHVua25vd24gY29tcG9uZW50OiAnICsgY29tcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE5vdyB3ZSBrbm93IHRoYXQgdGhpcyByZXF1ZXN0IGlzIGNvcnJlY3QsIGxldCdzIGNyZWF0ZSB0aGUgbmV3XG4gICAgICAgIC8vIGVudGl0eSBhbmQgaW5zdGFuY2lhdGUgdGhlIGNvbXBvbmVudCdzIHN0YXRlcy5cbiAgICAgICAgY29tcG9uZW50SWRzLmZvckVhY2goY29tcCA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZW50aXR5Q29tcG9uZW50RGF0YVtjb21wXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5Q29tcG9uZW50RGF0YVtjb21wXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbmV3Q29tcFN0YXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIG1hbmFnZXIgaGFzIGEgbGlzdGVuZXIsIHdlIHdhbnQgdG8gY3JlYXRlIGdldHRlcnNcbiAgICAgICAgICAgIC8vIGFuZCBzZXR0ZXJzIHNvIHRoYXQgd2UgY2FuIGVtaXQgc3RhdGUgY2hhbmdlcy4gQnV0IGlmIGl0IGRvZXNcbiAgICAgICAgICAgIC8vIG5vdCBoYXZlIG9uZSwgdGhlcmUgaXMgbm8gbmVlZCB0byBhZGQgdGhlIG92ZXJoZWFkLlxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBuZXdDb21wU3RhdGUgPSB7fTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKG5ld0NvbXBTdGF0ZSwgY29tcCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhdGUgPSBjbG9uZShzZWxmLmNvbXBvbmVudHNbY29tcF0uc3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIHNldHRlciBmb3IgZWFjaCBzdGF0ZSBhdHRyaWJ1dGUsIHNvIHdlIGNhbiBlbWl0IGFuXG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW50IHdoZW5ldmVyIHRoZSBzdGF0ZSBvZiB0aGlzIGNvbXBvbmVudCBjaGFuZ2VzLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld0NvbXBTdGF0ZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3Byb3BlcnR5XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3RlbmVyLmVtaXQoJ2VudGl0eUNvbXBvbmVudFVwZGF0ZWQnLCBlbnRpdHlJZCwgY29tcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KShwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KShuZXdDb21wU3RhdGUsIGNvbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3Q29tcFN0YXRlID0gY2xvbmUoc2VsZi5jb21wb25lbnRzW2NvbXBdLnN0YXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGVudGl0eSdzIElEIHNvIGl0J3MgZWFzaWVyIHRvIGZpbmQgb3RoZXIgY29tcG9uZW50cyBmb3IgdGhhdCBlbnRpdHkuXG4gICAgICAgICAgICBuZXdDb21wU3RhdGUuX19pZCA9IGVudGl0eUlkO1xuXG4gICAgICAgICAgICB0aGlzLmVudGl0eUNvbXBvbmVudERhdGFbY29tcF1bZW50aXR5SWRdID0gbmV3Q29tcFN0YXRlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIC8vIFNpZ25hbCB0aGUgYWRkaXRpb24gb2YgYSBuZXcgY29tcG9uZW50IHRvIHRoZSBlbnRpdHkuXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lci5lbWl0KCdlbnRpdHlDb21wb25lbnRBZGRlZCcsIGVudGl0eUlkLCBjb21wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGUtYXNzb2NpYXRlIGEgbGlzdCBvZiBjb21wb25lbnRzIGZyb20gdGhlIGVudGl0eS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGNvbXBvbmVudElkcyAtIExpc3Qgb2YgaWRlbnRpZmllcnMgb2YgdGhlIGNvbXBvbmVudHMgdG8gcmVtb3ZlIGZyb20gdGhlIGVudGl0eS5cbiAgICAgKiBAcGFyYW0ge2ludH0gZW50aXR5SWQgLSBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgZW50aXR5LlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSB0aGlzXG4gICAgICovXG4gICAgcmVtb3ZlQ29tcG9uZW50c0Zyb21FbnRpdHkoY29tcG9uZW50SWRzLCBlbnRpdHlJZCkge1xuICAgICAgICAvLyBGaXJzdCB2ZXJpZnkgdGhhdCBhbGwgdGhlIGNvbXBvbmVudHMgZXhpc3QsIGFuZCB0aHJvdyBhbiBlcnJvclxuICAgICAgICAvLyBpZiBhbnkgaXMgdW5rbm93bi5cbiAgICAgICAgY29tcG9uZW50SWRzLmZvckVhY2goY29tcCA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50c1tjb21wXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHVzZSB1bmtub3duIGNvbXBvbmVudDogJyArIGNvbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBOb3cgd2Uga25vdyB0aGF0IHRoaXMgcmVxdWVzdCBpcyBjb3JyZWN0LCBsZXQncyByZW1vdmUgYWxsIHRoZVxuICAgICAgICAvLyBjb21wb25lbnRzJyBzdGF0ZXMgZm9yIHRoYXQgZW50aXR5LlxuICAgICAgICBjb21wb25lbnRJZHMuZm9yRWFjaChjb21wID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVudGl0eUNvbXBvbmVudERhdGFbY29tcF0pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbnRpdHlDb21wb25lbnREYXRhW2NvbXBdW2VudGl0eUlkXSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5lbnRpdHlDb21wb25lbnREYXRhW2NvbXBdW2VudGl0eUlkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpZ25hbCB0aGUgY3JlYXRpb24gb2YgYSBuZXcgZW50aXR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lci5lbWl0KCdlbnRpdHlDb21wb25lbnRSZW1vdmVkJywgZW50aXR5SWQsIGNvbXApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIHJlZmVyZW5jZSB0byBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0YSBvZiBhblxuICAgICAqIGluc3RhbmNpYXRlZCBjb21wb25lbnQgb2YgYW4gZW50aXR5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtpbnR9IGVudGl0eUlkIC0gVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGVudGl0eS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50SWQgLSBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSBDb21wb25lbnQgZGF0YSBvZiBvbmUgZW50aXR5LlxuICAgICAqL1xuICAgIGdldENvbXBvbmVudERhdGFGb3JFbnRpdHkoY29tcG9uZW50SWQsIGVudGl0eUlkKSB7XG4gICAgICAgIGlmICghKGNvbXBvbmVudElkIGluIHRoaXMuY29tcG9uZW50cykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHVzZSB1bmtub3duIGNvbXBvbmVudDogJyArIGNvbXBvbmVudElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmVudGl0eUNvbXBvbmVudERhdGEuaGFzT3duUHJvcGVydHkoY29tcG9uZW50SWQpIHx8XG4gICAgICAgICAgICAhdGhpcy5lbnRpdHlDb21wb25lbnREYXRhW2NvbXBvbmVudElkXS5oYXNPd25Qcm9wZXJ0eShlbnRpdHlJZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRhdGEgZm9yIGNvbXBvbmVudCAnICsgY29tcG9uZW50SWQgKyAnIGFuZCBlbnRpdHkgJyArIGVudGl0eUlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0eUNvbXBvbmVudERhdGFbY29tcG9uZW50SWRdW2VudGl0eUlkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlIG9mIGEgY29tcG9uZW50LCBtYW55IGtleXMgYXQgb25jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aW50fSBlbnRpdHlJZCAtIFVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBlbnRpdHkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudElkIC0gVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbmV3U3RhdGUgLSBPYmplY3QgY29udGFpbmluZyB0aGUgbmV3IHN0YXRlIHRvIGFwcGx5LlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSB0aGlzXG4gICAgICovXG4gICAgdXBkYXRlQ29tcG9uZW50RGF0YUZvckVudGl0eShjb21wb25lbnRJZCwgZW50aXR5SWQsIG5ld1N0YXRlKSB7XG4gICAgICAgIGNvbnN0IGNvbXBTdGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50RGF0YUZvckVudGl0eShjb21wb25lbnRJZCwgZW50aXR5SWQpO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBuZXdTdGF0ZSkge1xuICAgICAgICAgICAgaWYgKG5ld1N0YXRlLmhhc093blByb3BlcnR5KGtleSkgJiYgY29tcFN0YXRlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb21wU3RhdGVba2V5XSA9IG5ld1N0YXRlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBsaXN0IG9mIG9iamVjdHMgY29udGFpbmluZyB0aGUgZGF0YSBvZiBhbGwgb2YgYSBnaXZlbiBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50SWQgLSBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEByZXR1cm4ge2FycmF5fSAtIExpc3Qgb2YgY29tcG9uZW50IGRhdGEgZm9yIG9uZSBjb21wb25lbnQuXG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50c0RhdGEoY29tcG9uZW50SWQpIHtcbiAgICAgICAgaWYgKCEoY29tcG9uZW50SWQgaW4gdGhpcy5jb21wb25lbnRzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gdXNlIHVua25vd24gY29tcG9uZW50OiAnICsgY29tcG9uZW50SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmVudGl0eUNvbXBvbmVudERhdGEuaGFzT3duUHJvcGVydHkoY29tcG9uZW50SWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdHlDb21wb25lbnREYXRhW2NvbXBvbmVudElkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgZW50aXR5IGhhcyB0aGUgY29tcG9uZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtpbnR9IGVudGl0eUlkIC0gVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGVudGl0eS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50SWQgLSBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gVHJ1ZSBpZiB0aGUgZW50aXR5IGhhcyB0aGUgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGVudGl0eUhhc0NvbXBvbmVudChlbnRpdHlJZCwgY29tcG9uZW50SWQpIHtcbiAgICAgICAgaWYgKCEoY29tcG9uZW50SWQgaW4gdGhpcy5jb21wb25lbnRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuZW50aXR5Q29tcG9uZW50RGF0YS5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnRJZCkgJiZcbiAgICAgICAgICAgIHRoaXMuZW50aXR5Q29tcG9uZW50RGF0YVtjb21wb25lbnRJZF0uaGFzT3duUHJvcGVydHkoZW50aXR5SWQpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gQVNTRU1CTEFHRVNcblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBhc3NlbWJsYWdlIHRvIHRoZSBsaXN0IG9mIGtub3duIGFzc2VtYmxhZ2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGFzc2VtYmxhZ2UuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFzc2VtYmxhZ2UgLSBBbiBpbnN0YW5jZSBvZiBhbiBhc3NlbWJsYWdlIHRvIGFkZC5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IC0gdGhpc1xuICAgICAqL1xuICAgIGFkZEFzc2VtYmxhZ2UoaWQsIGFzc2VtYmxhZ2UpIHtcbiAgICAgICAgdGhpcy5hc3NlbWJsYWdlc1tpZF0gPSBhc3NlbWJsYWdlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gYXNzZW1ibGFnZSBmcm9tIHRoZSBsaXN0IG9mIGtub3duIGFzc2VtYmxhZ2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGFzc2VtYmxhZ2UuXG4gICAgICogQHJldHVybiB7b2JqZWN0fSAtIHRoaXNcbiAgICAgKi9cbiAgICByZW1vdmVBc3NlbWJsYWdlKGlkKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmFzc2VtYmxhZ2VzW2lkXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGVudGl0eSBpbiB0aGUgc3lzdGVtIGJ5IGNyZWF0aW5nIGEgbmV3IGluc3RhbmNlIG9mIGVhY2ggb2ZcbiAgICAgKiBpdHMgY29tcG9uZW50cyBhbmQgc2V0dGluZyB0aGVpciBpbml0aWFsIHN0YXRlLCB1c2luZyBhbiBhc3NlbWJsYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFzc2VtYmxhZ2VJZCAtIElkIG9mIHRoZSBhc3NlbWJsYWdlIHRvIGNyZWF0ZSB0aGUgZW50aXR5IGZyb20uXG4gICAgICogQHJldHVybiB7aW50fSAtIFVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBuZXcgZW50aXR5LlxuICAgICAqL1xuICAgIGNyZWF0ZUVudGl0eUZyb21Bc3NlbWJsYWdlKGFzc2VtYmxhZ2VJZCkge1xuICAgICAgICBpZiAoIShhc3NlbWJsYWdlSWQgaW4gdGhpcy5hc3NlbWJsYWdlcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHVzZSB1bmtub3duIGFzc2VtYmxhZ2U6ICcgKyBhc3NlbWJsYWdlSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXNzZW1ibGFnZSA9IHRoaXMuYXNzZW1ibGFnZXNbYXNzZW1ibGFnZUlkXTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5jcmVhdGVFbnRpdHkoYXNzZW1ibGFnZS5jb21wb25lbnRzKTtcblxuICAgICAgICBmb3IgKGxldCBjb21wIGluIGFzc2VtYmxhZ2UuaW5pdGlhbFN0YXRlKSB7XG4gICAgICAgICAgICBpZiAoYXNzZW1ibGFnZS5pbml0aWFsU3RhdGUuaGFzT3duUHJvcGVydHkoY29tcCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGFzc2VtYmxhZ2UuaW5pdGlhbFN0YXRlW2NvbXBdO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50RGF0YUZvckVudGl0eShjb21wLCBlbnRpdHksIG5ld1N0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gUFJPQ0VTU09SU1xuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJvY2Vzc29yIHRvIHRoZSBsaXN0IG9mIGtub3duIHByb2Nlc3NvcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvY2Vzc29yIC0gQW4gaW5zdGFuY2Ugb2YgYSBwcm9jZXNzb3IgdG8gbWFuYWdlLlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSB0aGlzXG4gICAgICovXG4gICAgYWRkUHJvY2Vzc29yKHByb2Nlc3Nvcikge1xuICAgICAgICB0aGlzLnByb2Nlc3NvcnMucHVzaChwcm9jZXNzb3IpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBwcm9jZXNzb3IgZnJvbSB0aGUgbGlzdCBvZiBrbm93biBwcm9jZXNzb3JzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHByb2Nlc3NvciAtIEFuIGluc3RhbmNlIG9mIGEgcHJvY2Vzc29yIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IC0gdGhpc1xuICAgICAqL1xuICAgIHJlbW92ZVByb2Nlc3Nvcihwcm9jZXNzb3IpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3JzLnNwbGljZSh0aGlzLnByb2Nlc3NvcnMuaW5kZXhPZihwcm9jZXNzb3IpLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGFsbCB0aGUga25vd24gcHJvY2Vzc29ycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aW50fSBkdCAtIFRoZSB0aW1lIGRlbHRhIHNpbmNlIHRoZSBsYXN0IGNhbGwgdG8gdXBkYXRlLiBXaWxsIGJlIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byBhbGwgcHJvY2Vzc29yJ3MgYHVwZGF0ZWAgbWV0aG9kLlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSB0aGlzXG4gICAgICovXG4gICAgdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IudXBkYXRlKGR0KSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRW50aXR5TWFuYWdlcjtcbiJdLCJuYW1lcyI6WyJjbG9uZSIsIm9iaiIsImNvcHkiLCJEYXRlIiwic2V0VGltZSIsImdldFRpbWUiLCJBcnJheSIsImkiLCJsZW4iLCJsZW5ndGgiLCJPYmplY3QiLCJhdHRyIiwiaGFzT3duUHJvcGVydHkiLCJpc0Z1bmN0aW9uIiwidGhpbmdUb0NoZWNrIiwidG9TdHJpbmciLCJjYWxsIiwiRW50aXR5TWFuYWdlciIsImxpc3RlbmVyIiwiZW1pdCIsImVudGl0aWVzIiwiY29tcG9uZW50cyIsImFzc2VtYmxhZ2VzIiwiZW50aXR5Q29tcG9uZW50RGF0YSIsInByb2Nlc3NvcnMiLCJ1aWQiLCJjb21wb25lbnRJZHMiLCJlbnRpdHlJZCIsImdldFVpZCIsImFkZENvbXBvbmVudHNUb0VudGl0eSIsImluY2x1ZGVzIiwicHVzaCIsImlkIiwiY29tcCIsInNwbGljZSIsImluZGV4T2YiLCJjb21wb25lbnQiLCJrZXlzIiwic2VsZiIsImZvckVhY2giLCJFcnJvciIsIm5ld0NvbXBTdGF0ZSIsInN0YXRlIiwicHJvcGVydHkiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbCIsIl9faWQiLCJjb21wb25lbnRJZCIsIm5ld1N0YXRlIiwiY29tcFN0YXRlIiwiZ2V0Q29tcG9uZW50RGF0YUZvckVudGl0eSIsImtleSIsImFzc2VtYmxhZ2UiLCJhc3NlbWJsYWdlSWQiLCJlbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJpbml0aWFsU3RhdGUiLCJ1cGRhdGVDb21wb25lbnREYXRhRm9yRW50aXR5IiwicHJvY2Vzc29yIiwiZHQiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxTQUFTQSxLQUFULENBQWVDLEdBQWYsRUFBb0I7O1FBRVosUUFBUUEsR0FBUixJQUFlLG9CQUFtQkEsR0FBbkIseUNBQW1CQSxHQUFuQixFQUFuQixFQUEyQyxPQUFPQSxHQUFQOztRQUV2Q0MsYUFBSjs7O1FBR0lELGVBQWVFLElBQW5CLEVBQXlCO2VBQ2QsSUFBSUEsSUFBSixFQUFQO2FBQ0tDLE9B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
