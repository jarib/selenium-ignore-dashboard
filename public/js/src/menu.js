var Menu = (function() {
  return {
    selectTab: function(name) {
      var id = "" + name + "-link";

      $(".tabs li").each(function(index) {
        if ($(this).find("#" + id).size() > 0) {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }
      });
    }
  }
}())