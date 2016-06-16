(function () {
    'use strict';
    
    // An object that will contain contracts / interfaces
    var contracts = {};

    // A few helper functions
    function isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }

    function contractExists (contract) {
        return contracts.hasOwnProperty(contract);
    }

    function registerContractMethods (contract, methods) {
        contracts[contract] = methods;
    }

    function getContractMethods (contract) {
        if (isArray(contract)) {
            return contract.reduce(function (curry, current) {
                return curry.concat(getContractMethods(current));
            }, []);
        }

        if (contractExists(contract)) {
            return contracts[contract];
        }

        throw new Error('Interface not found.');
    }

    function checkIfSatisfiesContractMethods (object, methods) {
        for (var i = 0; i < methods.length; i++) {
            if (Object.keys(object).indexOf(methods[i]) < 0) {
                throw new Error(object + ' must implement ' + methods[i]);
            }
        }
    }

    // User API. 
    var c = {
        registerContract: function (contract) {
            if (!contract.name) {
                throw new Error('An interface must have a name property.');
            }

            if (contractExists(contract.name)) {
                throw new Error('You have already registered this interface.');
            }

            if (contract.methods && isArray(contract.methods) ) {
                registerContractMethods(contract.name, contract.methods);
            }
        },

        registerClass: function (constructor, params) {
            // Save the reference
            var parent = constructor;

            // Check if the class implements any contracts
            if (params.hasOwnProperty('implements')) {
                // If so, let's set it as a static property on the constructor
                constructor.implements = params.implements;
            }

            // Add a static method to the class object
            constructor.create = function (obj) {
                if (constructor.hasOwnProperty('implements')) {
                    // Obey some contracts
                    var methods = getContractMethods(params.implements);
                    checkIfSatisfiesContractMethods(obj, methods);
                }

                var child = function() { 
                    parent.apply(this, arguments); 
                    for (var prop in obj) {
                        this[prop] = obj[prop];
                    }
                }
                
                child.prototype = parent.prototype;
                child.prototype.constructor = child;
                
                return new child;
            };

            return constructor;
        }
    };

    window.contracts = c;
})();
