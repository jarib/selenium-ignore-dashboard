var Menu = (function() {
  return {
    selectLink: function(id) {
      $(".menu a").each(function(index) {
        console.log(this.id);
        if (this.id == id) {
          $(this).addClass("selected");
        } else {
          $(this).removeClass("selected");
        }
      });
    }
  }
}())