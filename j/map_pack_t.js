var M = {
	_init:function(){
		//页面加载完成后初始化地图
		//实例化地图对象
		var map = new WebtAPI.WMap("mapWrapper");
		 
		//设置地图初始位置
		var lonlat = new OpenLayers.LonLat(116.4074, 39.9046);
		map.setCenterByLonLat(lonlat);
		
		
		//实例化marker对象
		var marker = new WebtAPI.WMarker(lonlat);
		//添加marker到地图中
		//map.markersLayer为地图默认marker图层
		map.markersLayer.addMarker(marker);
		 
		//自定义图标marker
		//calculateOffset用来计算图标相对坐标偏移量。
		var calculateOffset = function(size) {
			return new OpenLayers.Pixel(-(size.w/2), -size.h);
		};
		//marker中图标的实例。
		//WebtAPI.WIcon(url, size, offset, calculateOffset);
		//url            : 图标的图片地址，可以是本地图片，也可以是网络图片。
		//size           : 图标图片的大小，用OpenLayers.Size对象来表示。
		//offset         : 图片的偏移量，和calculateOffset不可同时使用，在calculateOffset存在时，offset属性无效果。
		//calculateOffset: 计算图片的相对偏移量。
		var icon = new WebtAPI.WIcon("../images/marker.png", 
				  new OpenLayers.Size(32, 37), 
				  null, calculateOffset);
		imgMarker = new WebtAPI.WMarker(new OpenLayers.LonLat(116.4154, 39.9166), icon);
		map.markersLayer.addMarker(imgMarker);
	
		
	}
}