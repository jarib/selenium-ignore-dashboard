var Diff = (function() {
  var context = null;

  var loadDiff = function() {
    var drivers = $("select").map(function(idx) {
      return this.value;
    });

    var path = "diff/" + drivers.toArray().join(',') + ".json";

    context.load(path)
           .then(function(data) {
             context.render("ignores.mustache",
              {ignores: data, count: data.length}
             ).replace('#diff');
           })
  };

  return {
    init: function(ctx) {
      context = ctx;
      $("select").change(loadDiff)
    }
  }


})();