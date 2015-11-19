var M = {
	mapContainerId:'map',
	Labels:{},
	map:null,
	data_url_head:'http://d1.weather.com.cn/webgis', //ajax数据头
	// data_url_head:'http://ljy.weather.com.cn/webgis_baidu/d/webgis', //ajax数据头
	maxZoom:14,
	minZoom:4,
	poiAreaType:'p',
	dataType:'t',
	isSkOrFo:'sk',//预报fo 实况sk
	_init:function(){
		M.map = new BMap.Map(M.mapContainerId,{minZoom:M.minZoom,maxZoom:M.maxZoom,enableMapClick:false});
		//初始位置 北京   加载成功wgeo定位后 改变位置
		// var point = new BMap.Point(116.417854,39.921988);
		//百度ip定位
		new BMap.LocalCity().get(function(result){
			var cityName = result.name;
			// M.map.setCenter(cityName);
			// M.map.centerAndZoom(cityName, 12);
			M.map.centerAndZoom(cityName, 4);
 			// M._setRainList();
			// M._setRain24H();
			// M._setAjaxDataImages();
			// M._setAjaxDataPoi();
			//M._setLeidaImages();
			$("#console_wea li[data-type=radar]").click();
			
		});

		//地图左上角控件  缩放控件
		// M.map.addControl(new BMap.NavigationControl());
		//地图右上角控件  2D|卫星|三维 
 		// M.map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));

 		var bounds = M.map.getBounds();
 		
		
		// M.map.addEventListener("click",function(x){	
  //   		console.log(x.point.lat,x.point.lng)
		// })
		
		// if (!M.tempImagesUrls.length) {
		// 	// M._setAjaxDataImages('http://d1.weather.com.cn/webgis/radar/radar_list.json');
		// }else{
		// 	// M._setImage(M.tempImagesUrls);
		// };
		//加载测距模块
		M.distance = new BMapLib.DistanceTool(M.map);
		//M._openDistance();   M._closeDistance();
		//
		$('#btn').click(function(){
			M._openDistance();
		})	
		$('#btn1').click(function(){
			M._closeDistance();
		})	

		//缩放动作监听 放大缩小按钮效果
		M.map.addEventListener("zoomend",listenerZoomend)
		function listenerZoomend(){
			var zoom = M.map.getZoom();
    		if (zoom >= M.maxZoom) {
    			$('#setzoom_big').css('opacity','0.5')
    		}else if (zoom <= M.minZoom) {
    			$('#setzoom_small').css('opacity','0.5')
    		}else{
    			$('#setzoom_big,#setzoom_small').css('opacity','1')
    		};	
    		// setPointer()
		}
    	
		//拖动动作监听
  //   	M.map.addEventListener("moveend",function(x){		
  //   		// setPointer()
		// })
    	
	},
	
	//鼠标测距
	distance:null,
	_openDistance:function(){//开启鼠标测距
		M.distance.open();
	},
	_closeDistance:function(){//关闭鼠标测距
		M.distance.close();
	},
	
	_leidaTimer:function(){

	},
	//播放效果定时器 容器
	playerTimer:null,
	//加载顶部时间轴  
	_setTopTimer:function(arrTime){
		var $cutLine = $('.cutLine').empty();
		var $timeCon = $('.time .con');
		var cutLineWidth = $timeCon.width();
		var len = arrTime.length;
		var width = cutLineWidth/len;
		var strLi = "";
		var hour = '';
		for (var i = 0; i < len; i++) {
			var style = '';
			if (M.dataType=="radar") {//雷达
				if (i==(len-1)){
					var hour = arrTime[i];
				}else if(!parseInt(arrTime[i].split(':')[1])) {
					if (arrTime[i].split(' ').length>1) {
						var hour = arrTime[i].split(' ')[0];
						arrTime[i] = arrTime[i].split(' ')[1];
					}else{
						var hour = arrTime[i].split(':')[0]+"时";
					};
				}else{
					var hour = '';
				};
			}else if (M.dataType.length<3) {//实况
				var hour = arrTime[i];
				if (hour.match(/\d+日/)) {
					var hour = hour.match(/\d+日/)[0];

					arrTime[i] = arrTime[i].split(' ')[1];
					var style = 'style="font-weight:bold"';
				};
				if (hour.split(':')[1]=="00") {
					var hour = hour.split(':')[0];
				}
			}else if (M.dataType.length==3) {//3小时预报
				var hour = arrTime[i];

				if (hour.split(':')[1]=="00") {
					var hour = hour.split(':')[0];
				}
			}else if (M.dataType.length==7) {//24小时预报
				var hour = arrTime[i];
			};
			strLi += '<li class="on" '+style+' data-t="'+arrTime[i]+'" data-n="'+i+'" style="width:'+(width-2)+'px"><span>'+hour+'</span><i></i></li>'

		};
		$cutLine.append(strLi);
		var $poiNote= $('.poi,.note').css('left',(len-0.5)*width+'px');
		var $note = $('.note').text(arrTime[0]);
		var $con_font = $(".con_font").text(arrTime[0]);
		var $cutLine_li = $cutLine.find('li').live('mouseenter',function(){
			var $this = $(this);
			var index = $this.index();
			$note.text($this.attr('data-t'))
			$con_font.text($this.attr('data-t'))
			pointer = index;
			$cutLine.find('li').removeClass('on').filter('li:lt('+(index+1)+')').addClass('on')
			$poiNote.css('left',(index+0.5)*width+'px')

			if(M.poiAreaType == "p"){
				if (M.isSkOrFo == "sk") {//实况
					if ($this.index()==($cutLine_li.length-1)) {
						M.hour = "";
					}else{
						M.hour = $this.attr("data-t").split(':')[0];
					};
				}else{//预报
					M.hIndex =  23-$this.attr('data-n');
				};
				M.topTimePointer_IsLoad = 1;
				M._setAjaxDataPoi();
			}else{
				//显示某一层图片
				M._imgsShowNumber(index);
			}

		})
		$(".cutLine span,.cutLine i,.poi").live('mouseenter mouseleave',function(event){
			// $('.radar .con').live('mouseenter mouseleave',function(event){
			if (event.type == 'mouseenter') {
				$('.playbtn').removeClass('stop');
				if (M.dataType.length<7) {
					$note.show();
				};
				//停止播放器
				clearInterval(M.playerTimer);
			}else{
				$note.hide();
				//启动播放器
				// T.playerTimer = setInterval(setPlay,500)
			}
		})
		//
		var $openCloseBtn = $(".time .openclosebtn").live('click',function(){
			var $this = $(this);
			if ($this.hasClass('close')) {
				$('#console_time_radar').width(805);
				$('.time .con').show();
				$con_font.hide();

				$this.removeClass('close');
			}else{
				$this.addClass('close');
				$('#console_time_radar').width(95);
				$('.time .con').hide();
				$con_font.show();
			};
		})
		//定时播放
		var pointer = 0;
		function setPlay(){
			pointer++;
			if(pointer>=arrTime.length){
				pointer = 0;
			}
			$cutLine_li.filter('[data-n="'+pointer+'"]').mouseenter();
		}
		$('.playbtn').unbind('click').bind ('click',function(){
			var $this = $(this);
			if ($this.hasClass('stop')) {
				$this.removeClass('stop');
				//停止播放器
				clearInterval(M.playerTimer);
			}else{
				$this.addClass('stop');
				M.playerTimer = setInterval(setPlay,200)
			};
		})

	},
	//加载顶部雷达时间轴
	_setTopTimer_radar:function(arrTime){
		var $F = $('#console_timer').addClass('radar')

		var $cutLine = $('.cutLine').empty();
		var $timeCon = $('.time .con');
		var cutLineWidth = $timeCon.width();
		var len = arrTime.length;
		var width = cutLineWidth/len;
		var strLi = "";
		var hour = '';
		for (var i = 0; i < len; i++) {
			var style = '';
			if (M.dataType=="radar") {//雷达
				if (i==(len-1)){
					var hour = arrTime[i];
				}else if(!parseInt(arrTime[i].split(':')[1])) {
					if (arrTime[i].split(' ').length>1) {
						var hour = arrTime[i].split(' ')[0];
						arrTime[i] = arrTime[i].split(' ')[1];
					}else{
						var hour = arrTime[i].split(':')[0]+"时";
					};
				}else{
					var hour = '';
				};
			}else if (M.dataType.length<3) {//实况
				var hour = arrTime[i];
				if (hour.match(/\d+日/)) {
					var hour = hour.match(/\d+日/)[0];

					arrTime[i] = arrTime[i].split(' ')[1];
					var style = 'style="font-weight:bold"';
				};
				if (hour.split(':')[1]=="00") {
					var hour = hour.split(':')[0];
				}
			}else if (M.dataType.length==3) {//3小时预报
				var hour = arrTime[i];

				if (hour.split(':')[1]=="00") {
					var hour = hour.split(':')[0];
				}
			}else if (M.dataType.length==7) {//24小时预报
				var hour = arrTime[i];
			};
			strLi += '<li class="on" '+style+' data-t="'+arrTime[i]+'" data-n="'+i+'" style="width:'+(width-2)+'px"><span>'+hour+'</span><i></i></li>'

		};
		$cutLine.append(strLi);
		var $poiNote= $('.poi,.note').css('left',(len-0.5)*width+'px');
		var $note = $('.note').text(arrTime[0]);
		var $con_font = $(".con_font").text(arrTime[0]);
		var $cutLine_li = $cutLine.find('li').live('mouseenter',function(){
			var $this = $(this);
			var index = $this.index();
			$note.text($this.attr('data-t'))
			$con_font.text($this.attr('data-t'))
			pointer = index;
			$cutLine.find('li').removeClass('on').filter('li:lt('+(index+1)+')').addClass('on')
			$poiNote.css('left',(index+0.5)*width+'px')

			if(M.poiAreaType == "p"){
				if (M.isSkOrFo == "sk") {//实况
					if ($this.index()==($cutLine_li.length-1)) {
						M.hour = "";
					}else{
						M.hour = $this.attr("data-t").split(':')[0];
					};
				}else{//预报
					M.hIndex =  23-$this.attr('data-n');
				};
				M.topTimePointer_IsLoad = 1;
				M._setAjaxDataPoi();
			}else{
				//显示某一层图片
				M._imgsShowNumber(index);
			}

		})
		$(".cutLine span,.cutLine i,.poi").live('mouseenter mouseleave',function(event){
			// $('.radar .con').live('mouseenter mouseleave',function(event){
			if (event.type == 'mouseenter') {
				$('.playbtn').removeClass('stop');
				if (M.dataType.length<7) {
					$note.show();
				};
				//停止播放器
				clearInterval(M.playerTimer);
			}else{
				$note.hide();
				//启动播放器
				// T.playerTimer = setInterval(setPlay,500)
			}
		})
		//
		var $openCloseBtn = $(".time .openclosebtn").live('click',function(){
			var $this = $(this);
			if ($this.hasClass('close')) {
				$('#console_time_radar').width(805);
				$('.time .con').show();
				$con_font.hide();

				$this.removeClass('close');
			}else{
				$this.addClass('close');
				$('#console_time_radar').width(95);
				$('.time .con').hide();
				$con_font.show();
			};
		})
		//定时播放
		var pointer = 0;
		function setPlay(){
			pointer++;
			if(pointer>=arrTime.length){
				pointer = 0;
			}
			$cutLine_li.filter('[data-n="'+pointer+'"]').mouseenter();
		}
		$('.playbtn').unbind('click').bind ('click',function(){
			var $this = $(this);
			if ($this.hasClass('stop')) {
				$this.removeClass('stop');
				//停止播放器
				clearInterval(M.playerTimer);
			}else{
				$this.addClass('stop');
				M.playerTimer = setInterval(setPlay,200)
			};
		})

	},
    //获取打印雷达图片数据
	// tempImagesUrls:[],
	_setLeidaImages:function(){
		$('#console_time_radar .playbtn').show();
		var ajaxDataUrl = M.data_url_head + '/radar/radar_list.json';
		var picFile = M.data_url_head + '/radar/QR/';
		$('#poi_area_change').hide();
		$.ajax({
			type: "get",
			url: ajaxDataUrl,
			dataType: "jsonp",
			jsonpCallback: "getData",
			success: function(jsonp) {
				$('#loading_icon').hide();
				var picpaths = [];
				var pictimes = [];

				for(var i = jsonp.time.length-1; i>=0;i--){
					var arrTime = jsonp.time;
					var day = "";
					if ( arrTime[i].m[0].split(':')[0]=="00") {
						var day = arrTime[i].d.match(/\d+日/)+" ";
					};
					for(var j = 0; j<arrTime[i].picPath.length;j++){						
						picpaths.push(picFile + arrTime[i].picPath[j]);
						// var t = jsonp.time[i].m[j];
						// var hour = '';
						// if (i==0){
			   //      		var hour = t;
			   //      	}else if(!parseInt(t.split(':')[1])) {
			   //      		var hour = t.split(':')[0]+"时";
			   //      	}
			        	pictimes.push(day+arrTime[i].m[j]);
					}
				}
				//向地图中打印所有图片
				M._setImage(picpaths);
				//打印时间轴
				M._setTopTimer(pictimes);
						
			}
		});
	},
	_setAjaxDataImages:function(){
		$('#console_time_radar .playbtn').show();
		var ajaxDataUrl = M.data_url_head+'/'+M.isSkOrFo+'/json/'+M.dataType+'_list.json';
		$.ajax({
			type:'get',
			dataType:'jsonp',
			jsonpCallback:'getData',
			url:ajaxDataUrl,
			success:function(jsonp){
				$('#loading_icon').hide();
				var tempImagesUrls = [];
				var pictimes = [];
			
				var objWeek = {'1':'周一','2':'周二','3':'周三','4':'周四','5':'周五','6':'周六','0':'周日'};
		
				//拼合图片地址 建立图片地址数组 && 建立时间轴数组
				var arr = jsonp.datas;
				for (var i = arr.length - 1; i >= 0; i--) {
					var imgUrl = 'http://d1.weather.com.cn/webgis/'+M.isSkOrFo+'/images/'+M.dataType+'/'+arr[i].picPath;
					tempImagesUrls = tempImagesUrls.concat(imgUrl);
					if (M.dataType.length==7) {//24小时预报
						var data = arr[i].dt+"";
						var arrDate = [data.substr(0,4),data.substr(4,2),data.substr(6,2)];
						var week = objWeek[new Date(arrDate.join('/')).getDay()];
						pictimes.unshift(week+" "+(arr[i].dt+"").substr(4,2)+'月'+(arr[i].dt+"").substr(6,2)+'日');
					}else{//
						var data = arr[i].dt+"";
						if (data.substr(8,2)=="00") {
							pictimes.push(data.substr(6,2)+"日 "+data.substr(8,2)+':00');
						}else{
							pictimes.push(data.substr(8,2)+':00');
						};
						
					};
					
				};
				//向地图中打印所有图片
				M._setImage(tempImagesUrls);
				//打印时间轴
				M._setTopTimer(pictimes)
			}
		})

	},
	imagesLays:[], //图层缓存
	//获取一组图片  建一组图片层 
	_setImage:function(imgs){
		//清除所有图片层
		M._clearOverlays();
		
		if (M.isAddListener) {
			//清除缩放动作监听
	    	M.map.removeEventListener("zoomend",M._ListenFunSetPoi)
			//清除拖动动作监听
	    	M.map.removeEventListener("moveend",M._ListenFunSetPoi)
	    	//赋值监听状态 表示已经解除地图上打点的监听动作
	    	M.isAddListener = false;
		};
			

		// 西南角和东北角
		var SW = new BMap.Point(70.411,11.849);
    	var NE = new BMap.Point(137.818,56.969);
		var groundOverlayOptions = {
			opacity: "0",
			// url:"i/201509161130.PNG"
			// displayOnMinLevel: 10,
			// displayOnMaxLevel: 14
		}
		// 初始化GroundOverlay
  		M.imagesLays = [];//重置imagesLays图层缓存
  		for (var i = 0; i <imgs.length; i++) {
  			var imageLay = new BMap.GroundOverlay(new BMap.Bounds(SW, NE), groundOverlayOptions);
  			// 设置GroundOverlay的图片地址
 			imageLay.setImageURL(imgs[i]);
			// imageLay.setOpacity("0");
			M.imagesLays.push(imageLay);
			M.map.addOverlay(imageLay);
  		};
  		// var aa = M.map.getOverlays()
  		M._imgsShowNumber(0)
	},
	//显示某一张图片所在层
	_imgsShowNumber:function(n){
		
		$.each(M.imagesLays,function(i,v){
			v.setOpacity("0")
		})
		if (n<M.imagesLays.length) {
			M.imagesLays[n].setOpacity("0.5")
		};
		
	},
	_removeImages:function(){
		for (var i = M.imagesLays.length - 1; i >= 0; i--) {
			M.map.removeOverlay(M.imagesLays[i]);
		};
	},
	tempJsonpPoiData:null,//jsonp点数据缓存
	hour:"",
	hIndex:0,//逐三小时 24组点数据 指针
	topTimePointer_IsLoad:0,
	// topTimeIsLoad_fo:0,
	PointerDataIsLoad:1,
	currentAjax:null,
	_setAjaxDataPoi:function(){
		// if(M.currentAjax) {
		// 	M.currentAjax.abort();
		// }

		$('#console_time_radar .playbtn').hide();
		// var ajaxUrl = 'd/'+M.isSkOrFo+'/p_h.json';
		var urlChangePack = "" ;
		if(M.isSkOrFo == 'sk'){//加载实况点数据
			if (!M.hour) {
				urlChangePack = '';
			} else {
				urlChangePack = '/' + M.hour;
			}
			var dataUrl = M.data_url_head +'/'+ M.isSkOrFo + urlChangePack + '/'+'p_' + M.dataType + '.json';
		}else{//加载预报点数据
			
			if(M.dataType.length == 3){
				//逐3小时预报
				urlChangePack = '/' + M.hIndex;
				var dataUrl = M.data_url_head +'/'+ M.isSkOrFo + urlChangePack + '/'+'p_' + M.dataType.substr(0,1) + '.json';
			}else{
				//24小时最高温、最低温预报
				urlChangePack = '/t24h/' + M.hIndex 
				var dataUrl = M.data_url_head +'/'+ M.isSkOrFo + urlChangePack + '/' + M.dataType + '.json';
			}
		}
		M.currentAjax = $.ajax({
			type:'get',
			dataType:'jsonp',
			jsonpCallback:'webgisDot',
			url:dataUrl,
			success:function(jsonp){console.log(jsonp)
				$('#loading_icon').hide();
				//数据请求成功
				M.PointerDataIsLoad = 1;
				//获取的jsonp数据做缓存
				M.tempJsonpPoiData = jsonp;

				M._setPoi();
				// M._setIcon(jsonp);
				//缩放动作监听
		    	M.map.addEventListener("zoomend",M._ListenFunSetPoi)
				//拖动动作监听
		    	M.map.addEventListener("moveend",M._ListenFunSetPoi)
		    	//更新地图监听状态
		    	M.isAddListener = true;

				//时间轴加载状态
				if (M.topTimePointer_IsLoad) {
					return;
				};
		    	//时间轴部分
		    	var arr = jsonp.d4;
		    	var pictimes = [];
		    	for (var i = arr.length - 1; i >= 0; i--) {
		    		if (M.dataType.length==7) {
		    			var objWeek = {'1':'周一','2':'周二','3':'周三','4':'周四','5':'周五','6':'周六','0':'周日'};
		
						//拼合图片地址 建立图片地址数组 && 建立时间轴数组
						var data = arr[i];
						var arrDate = [data.substr(0,4),data.substr(4,2),data.substr(6,2)];
						var week = objWeek[new Date(arrDate.join('/')).getDay()];
						pictimes.unshift(week+" "+arrDate[1]+'月'+arrDate[2]+'日');
		    		}else{
		    			if (i==0) {
			    			pictimes.push(jsonp.d3.substr(8,2)+':'+jsonp.d3.substr(10,2));
			    		}else{
			    			var time = arr[i]+"";
			    			if (time.substr(8,2)=="00") {
			    				pictimes.push(time.substr(6,2)+"日 "+time.substr(8,2)+":00");
			    			}else{
			    				pictimes.push(time.substr(8,2)+":00");
			    			};
			    		};
		    		};
			    		
				};
		    	M._setTopTimer(pictimes);
			}
		})
	},
	//地图是否正在监听打点动作
	isAddListener:false,//监听状态 false：解除了打点的监听事件
	//监听执行时 赋值isAddListener为真 再执行打点操作
	_ListenFunSetPoi:function(){
		M.isAddListener = true;
		M._setPoi();
	},
	_setPoi:function(){
		//清除图层
		M._clearOverlays();

		//判断站点是在地图可视区域内 才加载 
		var bounds = M.map.getBounds();
		var zoom = M.map.getZoom();
		//地图7级以下显示省 10级以下显示到市 14级以下显示到区
		var showPoiZoom = zoom<7 && 1 || zoom<10 && 2 || 3;
		//双重条件（站点级别、在可视区内）满足后 执行打点
		var arr = M.tempJsonpPoiData.data;
		 
		
		for (var i = arr.length - 1; i >= 0; i--) {
			var d = arr[i];
			if(d.g <= showPoiZoom && bounds.we<d.y && d.y<bounds.re && bounds.xe<d.x && d.x<bounds.se){
				var label = new BMap.Label(d.v,{position:new BMap.Point(d.x,$.trim(d.y))});
				//级别不用文字背景色不同 设置文字背景色
				var font = M._setFontCol(d.v);
				label.setStyle({
					color : "#"+font.fontCol,
					background:"#"+font.fontBgCol,
					border:'none',
					cursor:"pointer",
					padding:"4px",
					borderRadius:'5px'
				})
				M.map.addOverlay(label);
			}
		};
	},
	_setIcon:function(jsonp){
		//判断站点是在地图可视区域内 才加载 
		var bounds = M.map.getBounds();
		var zoom = M.map.getZoom();
		//地图7级以下显示省 10级以下显示到市 14级以下显示到区
		var showPoiZoom = zoom<7 && 1 || zoom<10 && 2 || 3;
		//双重条件（站点级别、在可视区内）满足后 执行打点
		var arr = jsonp.data;

		for (var i = arr.length - 1; i >= 0; i--) {
			var d = arr[i];

			if(d.g <= showPoiZoom && bounds.we<d.x && d.x<bounds.re && bounds.ve<d.y && d.y<bounds.qe){
				var icon = new BMap.Icon("i/wind_1.png", new BMap.Size(50,50),{
   					anchor: new BMap.Size(20, 15)});

				var marker = new BMap.Marker(new BMap.Point(d.x,$.trim(d.y)),{icon:icon})
				M.map.addOverlay(marker);
			}
		};
	},
	_setRainList:function(){
M.tempAjaxRain24Url = "http://ljy.weather.com.cn/webt/d/24rain/rr072908_024(2).json"
		M._setRain24H();
		return;
		$.ajax({
			type: "get",
			dataType: "jsonp",
			jsonpCallback: "getData",
			url:"http://d1.weather.com.cn/webgis_test/fo/json/r24hJson_list.json",
			success:function(jsonp){console.log(jsonp)
				M.tempAjaxRain24Url = "http://d1.weather.com.cn/webgis_test/24r/data_jsonp/"+jsonp.datas[2].picPath
				
				M._setRain24H();

			}
		})
	},
	tempAjaxRain24Url:"",
	_setRain24H:function(){
		

		$.ajax({
			type: "get",
			dataType: "jsonp",
			jsonpCallback: "getData",
			url:M.tempAjaxRain24Url,
			success:function(json){console.log(json)
				$('#loading_icon').hide();
				//先清除图层
				M._clearOverlays();
				//
				var arrAll = json.features;
				var color = {"0":"#A4F391","10":"#3CA405","25":"#5BBBF7","50":"#0203F8","100":"#FA02F9","250":"#720208"}
				for (var i = 0; i <= arrAll.length - 1; i++) {
					var arr = arrAll[i].geometry.rings[0];console.log(arr)
					var polygonArr = [];
					for (var j = arr.length - 1; j >= 0; j--) {
						polygonArr.push(new BMap.Point(arr[j][0],arr[j][1]))
					};
					var theFillColor = color[arrAll[i].attributes.Value];
					var polygon = new BMap.Polygon(polygonArr,{fillColor:theFillColor,strokeWeight:"none",strokeColor:theFillColor, fillOpacity:0.4})
					M.map.addOverlay(polygon);
				};
			}
		})
	},
	_clearOverlays:function(){
		M.map.clearOverlays();
	}, 

	
	_setFontCol:function(val){
		if (M.dataType.substr(0,1) == 't') { //温度
			var fontBgCol = val <= -30 && '231c8e' || val < -25 && '0705ec' || val < -20 && '4059f1' || val < -15 && '3e88eb' || val < -10 && '76b7e7' || val < -5 && '89dfef' || val < 0 && 'abeffc' || val < 5 && 'b0e690' || val <= 10 && 'd6e66d' || val < 15 && 'f8dc3b' || val < 20 && 'fbb92e' || val < 25 && 'fc9b35' || val < 30 && 'ff7a19' || val < 35 && 'fd5e00' || val < 40 && 'e71308' || val < 45 && 'd10f06' || val < 50 && '9f033a' || '';
			var fontCol = val >= 35 && 'fff' || val < -15 && 'fff' || '252525';
		} else if (M.dataType.substr(0,1) == 'r') { //降水
			var fontBgCol = val < 1 && 'b4d6a4' || val < 2 && '79cf62' || val < 4 && '35bb34' || val < 6 && '5bb9f9' || val < 8 && '0000fa' || val < 10 && '007249' || val < 20 && 'ff00f2' || val < 50 && 'eb4900' || '740402';
			var fontCol = (val >= 6 && val < 10) && 'fff' || val >= 50 && 'fff' || '252525';
		} else if (M.dataType.substr(0,1) == 'w') { //风
			var fontBgCol = val <= 3 && 'e6a96e' || val < 5 && 'f7dc3b' || val < 7 && 'baf894' || val < 9 && '89dfef' || val < 12 && '3e87eb' || val >= 12 && '0541ec' || 'fff';
			var fontCol = val >= 9 && 'fff' || '252525';
		
		} else if (M.dataType.substr(0,1) == 'h') { //相对湿度
			var fontBgCol = val < 10 && '973100' || val < 20 && 'ea7116' || val < 30 && 'ff992a' || val < 40 && 'fec34f' || val < 50 && 'fee48f' || val < 60 && 'bddef0' || val < 70 && '7fbad9' || val < 80 && '4394c3' || val < 90 && '1f63ac' || val <= 100 && '053160';
			var fontCol = val < 10 && 'fff' || val >= 80 && 'fff' || '252525';
		}
		return {'fontCol':fontCol,'fontBgCol':fontBgCol};
	},
	_resetView:function(){
		// M.map.reset();
		
		var point = new BMap.Point(104.66601,38.37970);
		M.map.centerAndZoom(point, 4);
	},
}

M._init(); 