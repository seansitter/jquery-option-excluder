
(function($) {
    var selects;
    $.fn.optionExclude = function() {
        selects = this;
        selects.change(function(e){
            changeSelect(e); 
        });
        selects.each(function(idx){
            $('option', $(this)).each(function(inIdx, option){
                $(this).data('origIdx', inIdx);
            });
        });
        // update each option item with its original index, 
        // so we can add them back in the right place
        selects.each(function(idx){
            $(this).data('idx', idx);
            var remOptionVal = $('option:selected', $(this)).val();
            removeOptionFromOthers(idx, remOptionVal);
            $(this).data('prevOptVal', $(this).val());
        });
    }
    
    function removeOptionFromOthers(mySelectIdx, optVal) {
        selects.each(function(idx){
            if (mySelectIdx != idx){ // remove every copy of value except from self
                $('option[value="'+optVal+'"]', $(this)).remove();
            }
        });
    }
    
    function addOptionToOthers(mySelectIdx, option) {
        var origIdx = option.data('origIdx');
        selects.each(function(idx){
           var inserted = false;
           if (mySelectIdx != idx){
               $("option", $(this)).each(function() {
                   if (!inserted && (origIdx < $(this).data('origIdx'))) {
                       inserted = true;
                       $(this).before(option.clone(true));
                       return;
                   }
               });
               if (!inserted) {
                   $("option:last", $(this)).after(option.clone(true));
               }
           }
        });
    }
    
    function changeSelect(e) {
        var select = $(e.target);
        removeOptionFromOthers(select.data('idx'), select.val());
        var prevOption = $('option[value="'+select.data('prevOptVal')+'"]', select);
        addOptionToOthers(select.data('idx'), prevOption);
        select.data('prevOptVal', select.val()); // update to new value
    }
})(jQuery);
