var app = Sammy('#main', function() {
  this.use('Mustache');

  this.get('#/ignores', function() {
    this.render("spinner.mustache")
        .swap()
        .load('ignores.json')
        .render('ignores.mustache')
        .then(function() { Menu.selectLink("list-link"); })
        .swap();
  });

  this.get("#/ignores/:driver", function() {
    this.render("spinner.mustache")
        .swap()
        .load('ignores/' + this.params.driver + ".json")
        .render('ignores.mustache')
        .then(function() { Menu.selectLink("list-link"); })
        .swap();
  })

  this.get("#/stats", function(context) {
    this.render("spinner.mustache")
        .swap()
        .load("stats.json").then(function(data) {
          context.render("stats.mustache", data)
                 .swap()
                 .then(function() { Menu.selectLink("stats-link"); })
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