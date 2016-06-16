# Interfaces in Javascript

A different kind of approach to implementing interfaces in javascript.

## Example
```
// First, we register interfaces like so
contracts.registerContract({
    name: 'DogInterface',
    methods: ['bark']
});

contracts.registerContract({
    name: 'PersonInterface',
    methods: ['eat', 'drink', 'code']
});

// Register a class and define interfaces it should implement
var Dog = contracts.registerClass(function () {
    this.someBaseMethod = function() {
        console.log(this.name);
    }
}, {implements: ['DogInterface']});

// Create an object from the registered class
var milo = Dog.create({
    name: 'Milo',
    bark: function() {
        return 'Do not tell me what to do, human!';
    }
});

console.log(milo.bark());
milo.someBaseMethod();
```
