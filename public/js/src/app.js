// initialize the application
var app = Sammy('#main', function() {
  // include a plugin
  this.use('Mustache');

  // define a 'route'
  this.get('#/ignores', function() {
    // load some data
    this.load('ignores.json')
        // render a template
        .renderEach('ignore.mustache')
        // swap the DOM with the new content
        .swap();
  });

  this.get("#/ignores/:driver", function() {
    this.load('ignores/' + this.params.driver + ".json")
        .renderEach('ignore.mustache')
        .swap();
  })
});

// start the application
app.run('#/ignores');