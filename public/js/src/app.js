var app = Sammy('#main', function() {
  this.use('Mustache');

  this.get('#/ignores', function() {
    this.swap('<div class="spinner"></div>')
    this.load('ignores.json')
        .render('ignores.mustache')
        .swap();
  });

  this.get("#/ignores/:driver", function() {
    this.swap('<div class="spinner"></div>')
    this.load('ignores/' + this.params.driver + ".json")
        .render('ignores.mustache')
        .swap();
  })

  this.get("#/stats", function(context) {
    this.load("stats.json").then(function(data) {
      context.render("stats.mustache", data)
             .swap()
             .then(function() {
               var stats = new Stats(data);
               var line = document.getElementById('line-graph');
               var column = document.getElementById("column-graph")

               stats.renderLineGraphTo(line);
               stats.renderColumnGraphTo(column);
             });
    });
  })
});

app.run('#/ignores');