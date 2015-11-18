function drawLine(data) {
	//曲线贝塞尔算法
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
    // Grab the data
	//横坐标点数
    var labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
    $('#rainLine').empty();
    // Draw
    var width = 270,
        height = 66,
        leftgutter = 0,
        bottomgutter = 0,
        topgutter = 0,
        colorhue = .6 || Math.random(),//多种填充颜色 默认0.6蓝色 
        color = "hsl(" + [colorhue, .5, .5] + ")",
        r = Raphael("rainLine", width, height),
        txt = {font: '12px Helvetica, Arial', fill: "#fff"},
        
        X = (width - leftgutter) / labels.length;
        //max = Math.max.apply(Math, data), //求data数组中最大值
        //Y = (height - bottomgutter - topgutter) / max; 
		
    	
	var bgp = r.path().attr({stroke: "none", opacity: .5, fill: color});

    var p, bgpp;
    for (var i = 0, ii = labels.length; i < ii; i++) {
        //var y = Math.round(height - bottomgutter - Y * data[i]),
        
        var x = Math.round(leftgutter + X * (i + .5)),
			d = data[i],
			y;
		//0-1小雨  1-2.5中雨  2.5-8大雨  8-16暴雨  >16特大暴雨
  		if(d <= 1){
			var y = Math.round(height - bottomgutter - 18 * d);
		}else if(d <= 2.5){
			var y = Math.round(height-18 - bottomgutter - (18/(2.5-1)) * (d-1));
		}else if(d <= 8){
			var y = Math.round(height-36 - bottomgutter - (18/(8-2.5)) * (d-2.5));
		}else if(d <= 50){
			var y = Math.round(height-54 - bottomgutter - (18/(50-8)) * (d-8));
		}
		
		
        if (!i) {
            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0,
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2,
                X2 = Math.round(leftgutter + X * (i + 1.5));
			var d0 = data[i - 1];
			if(d0 <= 1){
				var Y0 = Math.round(height - bottomgutter - 18 * d0);
			}else if(d0 <= 2.5){
				var Y0 = Math.round(height-18 - bottomgutter - (18/(2.5-1)) * (d0-1));
			}else if(d0 <= 8){
				var Y0 = Math.round(height-36 - bottomgutter - (18/(8-2.5)) * (d0-2.5));
			}else if(d0 <= 50){
				var Y0 = Math.round(height-54 - bottomgutter - (18/(50-8)) * (d0-8));
			}
			
			var d2 = data[i + 1];
			if(d2 <= 1){
				var Y2 = Math.round(height - bottomgutter - 18 * d2);
			}else if(d2 <= 2.5){
				var Y2 = Math.round(height-18 - bottomgutter - (18/(2.5-1)) * (d2-1));
			}else if(d2 <= 8){
				var Y2 = Math.round(height-36 - bottomgutter - (18/(8-2.5)) * (d2-2.5));
			}else if(d2 <= 50){
				var Y2 = Math.round(height-54 - bottomgutter - (18/(50-8)) * (d2-8));
			}
			
            var a = getAnchors(X0, Y0, x, y, X2, Y2);
            //p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
      
       
        
    }
    //p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    bgp.attr({path: bgpp});
};