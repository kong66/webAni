jQuery(function($){
  var TDs = $(".threeD"),
      i,
      $item;

  var letters = TDs.text().split("");
  TDs.text("");
  for(i=0;i<letters.length;++i){
    $item = $('<span class="threeD-letter"></span>');
    $item.text(letters[i]);
    $item.attr('letter',letters[i]);
    TDs.append($item);
  }
});
