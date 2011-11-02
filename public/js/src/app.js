/*global Sammy Menu Stats Diff document */

var app = Sammy('#main', function() {
  this.use('Mustache');

  this.get('#/ignores', function() {
    Menu.selectTab("list");

    this.render("spinner.mustache")
        .swap()
        .load('ignores.json')
        .render('ignores.mustache')
        .swap()
    ;
  });

  this.get("#/ignores/:driver", function() {
    Menu.selectTab("list");

    this.render("spinner.mustache")
        .swap()
        .load('ignores/' + this.params.driver + ".json")
        .render('ignores.mustache')
        .swap()
    ;
  });

  this.get("#/stats", function(context) {
    Menu.selectTab("stats");

    this.render("spinner.mustache")
        .swap()
        .load("stats.json")
        .then(function(data) {
          context.render("stats.mustache", data)
                 .swap()
                 .then(function() {
                   var stats = new Stats(data);
                   var line = document.getElementById('line-graph');
                   var column = document.getElementById("column-graph");

                   stats.renderLineGraphTo(line);
                   stats.renderColumnGraphTo(column);
                 });
        })
    ;
  });

  this.get("#/diff", function(context) {
    Menu.selectTab("diff");
    this.load("drivers.json")
        .render("diff.mustache")
        .swap()
        .then(function() { Diff.init(context); })
    ;
  });

  this.get("#/diff/:drivers", function(context) {
    Menu.selectTab("diff");
    this.load("drivers.json")
        .render("diff.mustache")
        .swap()
        .then(function() {
          Diff.init(context);
          Diff.loadDrivers(context.params.drivers.split(","));
        })
    ;
  });

});

app.run('#/ignores');