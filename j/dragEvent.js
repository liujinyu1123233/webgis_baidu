var myDrag = {
    wid:'735',
    _popDragEvent:function(elementToDrag,event){
        function getScrollOffsets(w) {
            w = w || window;
            if (w.pageXOffset != null) return {x: w.pageXOffset, y:w.pageYOffset};
            var d = w.document;
            if (document.compatMode == "CSS1Compat")
                return {x:d.documentElement.scrollLeft, y:d.documentElement.scrollTop};
            return { x: d.body.scrollLeft, y: d.body.scrollTop };
        }
        var scroll = getScrollOffsets();  // A utility function from elsewhere
        var startX = event.clientX + scroll.x;
        var origX = elementToDrag.offsetLeft;
        var deltaX = startX - origX;
        if (document.addEventListener) {  // Standard event model
            document.addEventListener("mousemove", moveHandler, true);
            document.addEventListener("mouseup", upHandler, true);
        }
        else if (document.attachEvent) {  // IE Event Model for IE5-8
            elementToDrag.setCapture();
            elementToDrag.attachEvent("onmousemove", moveHandler);
            elementToDrag.attachEvent("onmouseup", upHandler);
            elementToDrag.attachEvent("onlosecapture", upHandler);
        }
        if (event.stopPropagation) event.stopPropagation();  // Standard model
        else event.cancelBubble = true;                      // IE
        if (event.preventDefault) event.preventDefault();   // Standard model
        else event.returnValue = false; // IE
        var cWidth = this.wid;     
        function moveHandler(e) {
            if (!e) e = window.event;  // IE event Model
            var scroll = getScrollOffsets();
          
            var pLeft = e.clientX + scroll.x - deltaX;
           
            if(pLeft<0){
				elementToDrag.style.left =  0 + "px";
				$('.con_note .note')[0].style.left =  0 + "px";
        		$('.map_con .time .line')[0].style.width =  0 + "px";
            }else if(pLeft>cWidth ){ 
				elementToDrag.style.left =  cWidth + "px";
				$('.con_note .note')[0].style.left =  cWidth + "px";
        		$('.map_con .time .line')[0].style.width =  cWidth + "px";
            }else{
            	console.log(pLeft)
				elementToDrag.style.left =  pLeft + "px";
				$('.con_note .note')[0].style.left =  pLeft + "px";
        		$('.map_con .time .line')[0].style.width =  pLeft + "px";
            }
            if (e.stopPropagation) e.stopPropagation();  // Standard
            else e.cancelBubble = true;                  // IE
        }
        function upHandler(e) {
            if (!e) e = window.event;  // IE Event Model
            if (document.removeEventListener) {  // DOM event model
                document.removeEventListener("mouseup", upHandler, true);
                document.removeEventListener("mousemove", moveHandler, true);
            }
            else if (document.detachEvent) {  // IE 5+ Event Model
                elementToDrag.detachEvent("onlosecapture", upHandler);
                elementToDrag.detachEvent("onmouseup", upHandler);
                elementToDrag.detachEvent("onmousemove", moveHandler);
                elementToDrag.releaseCapture();
            }
            if (e.stopPropagation) e.stopPropagation();  // Standard model
            else e.cancelBubble = true;                  // IE
        }
    },
    $dragDom:$('.con_poi .poi,.con_note .note'),
    drag:function(dataN){//dataN数据点
        var _this = this;
        _this.$dragDom.mousedown(function(e){
            // _this._popDragEvent($('.con_poi .poi')[0],e);
            //_this._popDragEvent($('.con_note .note')[0],e,"left");
            // _this._popDragEvent($('.map_con .time .line')[0],e,"width");
        });
      	
       	
    	var $cutLine = $('.cutLine').empty();
    	var cutLineWidth = $cutLine.width();
    	
    	var strLi = "";
    	for (var i = 0; i < dataN; i++) {
    		strLi += '<li data-n="'+i+'" style="width:'+(cutLineWidth/dataN-2)+'px"><span>14时</span><i></i></li>'
    	};
    	$cutLine.append(strLi);
    	var wid = cutLineWidth/dataN;
		$('.poi,.note').css('left',0.5*wid+'px')
    	$cutLine.find('li').live('hover',function(){

    		var index = $(this).index();
    		$cutLine.find('li').removeClass('on').filter('li:lt('+(index+1)+')').addClass('on')
    		$('.poi,.note').css('left',(index+0.5)*wid+'px')
    	})
    }

}
myDrag.drag(20)

