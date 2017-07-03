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
