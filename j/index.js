//地图初始化
// M._init();
//左侧控制台 效果
var $console_wea = $('#console_wea');
var $li_1s = $console_wea.find('.li_1').click(function(){
	$li_1s.removeClass('on');
	$(this).addClass('on').parent();

})
//右侧图例
var $assist_pic = $('#console_assist_pic');
var $assist_open = $("#console_assist_open").click(function(){
	$(this).hide().css('right','-35px');
	$assist_pic.animate({'left':'-107px'});
})
$assist_pic.click(function(){
	$assist_pic.animate({'left':'16px'},function(){
		$assist_open.show().animate({'right':'0'})
	});
	
})

//左侧控制台
var dataTypeLis = $("#console_wea li[data-type]").click(function(){
	$('#loading_icon').show();
	var $this = $(this);
	dataTypeLis.removeClass('hover');
	$this.addClass('hover');

	var dataType = $this.attr('data-type');
	M.dataType = dataType;

	M.topTimePointer_IsLoad = 0;
	//点面切换按钮
	$('#poi_area_change').show();
	//图例部分
	$("#console_assist_pic").find('.tuli_' + M.dataType.substr(0,1)).show().siblings().hide();

	// if (dataType.length==1) {//实况
	// 	M.isSkOrFo = "sk";
	// 	M._setAjaxDataImages();
	// }else if (dataType == 'radar') {//雷达
	// 	M._setLeidaImages();
	// }else if (dataType.length==3) {//3小时预报
	// 	M.isSkOrFo = "fo";
	// 	M._setAjaxDataImages();
	// }else if (dataType.length>3) {//24小时预报
	// 	M.isSkOrFo = "fo";
	// 	M._setAjaxDataImages();
	// };;
	if (dataType == 'radar') {//雷达
		M._setLeidaImages();
	}else if (dataType.length==1) {//实况
		M.isSkOrFo = "sk";
		if (M.poiAreaType == 'p') {
			M._setAjaxDataPoi();
		}else{
			M._setAjaxDataImages();
		};
	}else if (dataType.length>=3) {//3小时、24小时预报
		M.isSkOrFo = "fo";
		if (M.poiAreaType == 'p') {
			M._setAjaxDataPoi();
		}else{
			M._setAjaxDataImages();
		};
	}


	


})
//点面切换
$('#poi_area_change').click(function(){
	$('#loading_icon').show();
	var $this = $(this);
	M.topTimePointer_IsLoad = 0;
	if($this.hasClass('on')){
		//站点
		if (M.poiAreaType != 'p') {
			M.poiAreaType = 'p';
			$this.removeClass('on');
			M._setAjaxDataPoi();
			$('#console_time_radar .playbtn').hide();
		};
		
	}else{
		//区域
		if (M.poiAreaType != 'a') {
			M.poiAreaType = 'a';
			$this.addClass('on');
			if (M.dataType == 'radar') {//雷达图
				M._setLeidaImages();
			}else if (M.dataType=="r24h") {//24小时降水预报图（micaps绘图）
				M._setRain24H();
			}else{//3小时、24小时实况，预报图
				M._setAjaxDataImages();
			};
			$('#console_time_radar .playbtn').show();
		};
		
	}
})

//地图复位
$('#map_reset').click(function(){
	M._resetView();
})
//地图放大缩小
$('#setzoom_big').click(function(){
	var zoom = M.map.getZoom();
	if (zoom<M.maxZoom) {
		M.map.setZoom(zoom+1);
	}
})
$('#setzoom_small').click(function(){
	var zoom = M.map.getZoom();
	if (zoom>M.minZoom) {
		M.map.setZoom(zoom-1);
	}
})