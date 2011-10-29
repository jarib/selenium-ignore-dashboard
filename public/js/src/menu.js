var Menu = (function() {
  return {
    selectLink: function(id) {
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