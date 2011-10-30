var Diff = (function() {
  var context = null;

  return {
    init: function(ctx) {
      context = ctx;
      $("select").change(function() {
        var drivers = $("select").map(function() { return this.value; });
        context.redirect("#/diff/" + drivers.toArray().join(","));
      });
    },
    
    loadDrivers: function(drivers) {
      var path = "diff/" + drivers.join(',') + ".json";
      
      $(drivers).each(function(index) {
        $('select').get(index).value = this;
      });

      context.render("spinner.mustache")
             .replace("#diff")
             .load(path).then(function(data) {
               context.render("ignores.mustache", {
                ignores: data,
                count: data.length
               }).replace('#diff');
             })
      ;
    }
  };
})();