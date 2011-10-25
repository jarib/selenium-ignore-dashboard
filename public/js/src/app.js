var app = Sammy('#main', function() {
  this.use('Mustache');

  this.get('#/ignores', function() {
    this.load('ignores.json')
        .render('ignores.mustache')
        .swap();
  });

  this.get("#/ignores/:driver", function() {
    this.load('ignores/' + this.params.driver + ".json")
        .render('ignores.mustache')
        .swap();
  })

  this.get("#/stats", function(context) {
    this.load("stats.json").then(function(data) {

      stats = new Stats(data);

      context.render("stats.mustache", data)
             .swap()
             .then(function() {
                stats.renderTo(document.getElementById('graph'));
            });
    });
  })
});

// start the application
app.run('#/ignores');