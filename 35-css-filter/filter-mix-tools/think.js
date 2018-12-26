jQuery(function($){

    var $target= $(".pic img");
    var $filters=$(".filters");
    var $filter=$(".filter");
    $filters.on('input',onInput);
    $filter.each(function(){
      var $this,value,name;
      $this = $(this);
      $this.filterName = $this.attr('filter');
      $this.filterDes = $this.closest('label').find('span');
      $this.filterValue = getFilterProperty($this);
      $this.filterStr = $this.filterName+'('+$this.filterValue+')';
      setFilterValueText($this);
    });

    function onInput(e){
      var $target = $(e.target)
      var name = $target.attr('filter');
      var value = getFilterProperty($target);
      filter_map[name] = value;
      setFilterProperty();
    }
    function getFilterProperty($filter){
      var res;
      if($filter.filterName!='drop-shadow'){
        res = $filter[0].value + $filter.attr('unit');
      }else{

      }
      return res;
    }
    function setFilterProperty(){
      var i,value="";
      for(i in filter_map){
        value += ' '+setFilterValueText()
      }
      console.log(value);
    }
    function setFilterValueText($filter){
      $filter.filterDes.text($filter.filterStr);
    }
    function getFilterStr(filter,value){

    }
});
