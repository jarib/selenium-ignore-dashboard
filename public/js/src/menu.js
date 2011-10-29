var Menu = (function() {
  return {
    selectTab: function(name) {
      var id = "" + name + "-link";

      $(".menu a").each(function(index) {
        if (this.id == id) {
          $(this).addClass("selected");
        } else {
          $(this).removeClass("selected");
        }
      });
    }
  }
}())