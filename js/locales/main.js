 var clock=0;
 var sclock=0;
 var track = 0;
 var stop=[0,0,0,0,0,0,0];//(前进后退按钮。点后退的时候portal图是停止的，stop记录下暂停的时间点，当点击刷新按钮时，portal运行当前时间运行。) 
 var update_enable=[0,0,0,0,0,0,0,0];
 var update=0;
 var cur=[0,0,0,0,0,0,0];//回退按钮记录当前回退到那个时间点。
 var total=2016;
 var btn=[0,0,0,0,0,0,0,0];
 function createDialog(){//创建开始的那三个按钮，实现可拖拽。
	 if($( "#operationdialog" ).css("display")=="none"){//设置和返回第一个匹配元素的css属性。
		 $( "#operationdialog" ).css("display","block");
		 $( "#operationdialog" ).draggable();
	 } else{
		 $( "#operationdialog" ).css("display","none");
	 }
 }
 function startSimulation(){
	update_enable=[1,1,1,1,1,1,1,1];//这里是什么意思？把所有图都设置到开始。即使没有显示的图也需要置为1
	update=1;
	$("#play-button").attr("disabled",true);
	$("#pause-button").attr("disabled",false);
	$("#stop-button").attr("disabled",true);
 }
 function countTimer(){
		var tick=5*clock+5;
		if(tick<10)//小于10就是00.0+当前显示数字，以下 雷同
		$('#timer').html("00:0"+tick);
		else if(tick>=10&&tick<60)
		$('#timer').html("00:"+tick);
		else if(tick>=60){
			var a=Math.floor(tick/60);//对60求整，计算小时
			var c="";
			if(a>=24){
			    c=Math.floor(a/24);//计算天数，求余是小时
				a=a%24;
			}
			var b=tick%60;
			var tmpa= a<10? '0'+a:a;//格式输出
			var tmpb=  b<10? '0'+b:b;
			c > 0 ? (c > 1 ?$('#timer').html(c+"days"+tmpa+":"+tmpb):$('#timer').html(c+"day"+tmpa+":"+tmpb)):$('#timer').html(tmpa+":"+tmpb);

		} 
 }
 function pauseSimulation(){//暂停按钮在jquery中可以使用attr()函数修改按钮的disable属性$(“#test”).attr(‘disabled’,false);
	 
	$("#play-button").attr("disabled",false);
	$("#pause-button").attr("disabled",true);
	$("#stop-button").attr("disabled",true); 
	update_enable=[0,0,0,0,0,0,0];
	update=0;
 }
 function stopSimulation(){//这个不用管
		$("#play-button").attr("disabled",false);
		$("#pause-button").attr("disabled",false);
		$("#stop-button").attr("disabled",true); 
		update_enable=0;
		clock=0;
		sclock=0;
		tick=0;
		update_enable=[0,0,0,0,0,0,0];
		update=0;
	 }
 function refreshData(dir,number,id,index){//dir是什么？dir是第几个portal图。。这个函数的功能是画出需要回退的portal图
	 var time=number*5*60*1000;//5分钟的刷新间隔
	time= dir==1?time:-time;
	var name=$("#"+id).highcharts();//得到对应的图
	var data=JSON.parse(localStorage.getItem(id));//通过getItem获取id的值，localStorage对象可以将数据长期保存在客户端，直到人为清除。
		            var start=[];//JSON.parse(data) 将数据解析成对象，返回解析后的对象
		            var len=name.series.length;
		            for(var i=0;i<len;i++){
		  				start[i] =name.series[0].data[0].x+time;
		  				name.series[0].remove();
		            }
		    		if(id=="saving"){
		    			for(var i = 0; i < data.series.length; i++)
		    			{
		    				var data_series = new Array(number/aver);
		    				for(var j = aver;j <= number;j+=aver)
		    				{
		    					var x = start[i] + (j-aver)*300000;
		    					if(dir==-1){
		    						if(cur[index] + (2*number-j)*dir-aver>=0)
			    					var y=(data.series[i].data[(cur[index] + (2*number-j)*dir)%(total+1)][0]-data.series[i].data[(cur[index] + (2*number-j)*dir-aver)%(total+1)][0])/(data.series[i].data[(cur[index] + (2*number-j)*dir)%(total+1)][1]-data.series[i].data[(cur[index] + (2*number-j)*dir-aver)%(total+1)][1]);
		    						else
		    						var	y=null;

		    					}
		    					else
			    			    var y=(data.series[i].data[(cur[index]+j)%(total+1)][0]-data.series[i].data[(cur[index]+j-aver)%(total+1)][0])/(data.series[i].data[(cur[index]+j)%(total+1)][1]-data.series[i].data[(cur[index]+j-aver)%(total+1)][1]);
		    					y*=100;
		    					data_series[j/aver-1] = [x,y];
		    				}
		    				name.addSeries(
		    				{
		    					name: data.series[i].name,
		    					data: data_series
		    				},false);
		    			}
		    		}else{
		    			for(var i = 0; i < data.series.length; i++)
		    			{
		    				var data_series = new Array(number);
		    				for(var j = 0;j < number;j++)
		    				{
		    					var x = (start[i] + j*300000);
		    					if(dir==-1){
		    						if(cur[index] + (2*number-j)*dir+1>=0)
		    						var y = data.series[i].data[(cur[index] + (2*number-j)*dir+1)%total];
		    						else
		    							y=null;
		    					}
		    					else
		    				     y = data.series[i].data[(cur[index]+j+1)%total];
		    					data_series[j] = [x,y];
		    				}
		    				name.addSeries(
		    				{
		    					name: data.series[i].name,
		    					data: data_series
		    				},false);
		    			}
		    		}	    	

	    			cur[index]+=number*dir;    //这下面是什么意思？？        
					if(cur[index]+number*dir<0) {
						$("#"+id).find("button").first().attr("disabled",true);	
						$("#"+id).find("button").last().attr("disabled",false);	
					}
					else {
						$("#"+id).find("button").first().attr("disabled",false);
						$("#"+id).find("button").last().attr("disabled",false);}
					if (cur[index]>=stop[index]){
						$("#"+id).find("button").last().attr("disabled",true);}
					name.redraw();	
					name=null;
					data=null;
 }
 function displayHistory(el,number,index,dir){//定位是需要回退的portal图，并把它update设置为0，暂停运行
	 update_enable[index]=0;
   switch(el.id){
	 case "traffic":
		 refreshData(dir,number,el.id,2);
		 break;
	 case "saving":
		 refreshData(dir,number,el.id,1);
		 break;
	 case "consumption":
		 refreshData(dir,number,el.id,0);
		 break;
	 case "utilization":
		 refreshData(dir,number,el.id,3);
		 break;
	 case "delay":
		 refreshData(dir,number,el.id,4);
		 break;
	 case "jitter":
		 refreshData(dir,number,el.id,5);
		 break;
	 case "loss":
		 refreshData(dir,number,el.id,6);
		 break;
	 }
   el=null;
 }
 function drawChart(file,render_to,color,type,number,index,file2){//这个函数画的是初始图，静态的图，fecthchaw画的是动态的图。当点击开始按钮时画出的动态图
	 //就是fecthchaw画出来的。当运行一段时间以后，打开新的portal也是有运行的相应时间段的图是通过drawchat画的，因为它放在setinterval里面了
	var text,flag=true,min=null;
	if(render_to=="traffic"){
		text="Gbit/sec";
		min=50;
	} else if(render_to=="delay"){
		text="100ns";
	}else if(render_to=="loss"){
		text="";
	}else if(render_to=="utilization"||render_to=="saving"){
		text="%";
	}else if(render_to=="jitter"){
		text="us";
	} else{
		text="Watts";
	}
	if(render_to=="utilization") {
		flag=false;
	}
	 switch(number){
	 case 12:
		 gap=1;
		 break;
	 case 72:
		 gap=6;
		 break;
	 case 144:
		 gap=12;
		 break;
	 case 288:
		 gap=36;
		 break;
	 case 2016:
		 gap=288;
		 break;
	 case 1:
		gap=2016;
		 break;
		 
	 }
	 if(number==1) number=2016;
	var multi= file=="saving.json"? 0:1;
    var options = {
	chart: {
			renderTo: render_to,
			type: type,
			animation: false,
			marginTop:50,
			backgroundColor: 'rgba(0,0,0,0)',

		},
        title: {
          text: ''
        	
          },
         subtitle: {
        	  text: '<button  onclick="displayHistory('+render_to+','+number+','+index+',-1);"><i class="icon-caret-left icon-2x" ></i></button><button  onclick="displayHistory('+render_to+','+number+','+index+',1);"><i class="icon-caret-right icon-2x"></i></button>',
              useHTML:true,
              align: 'right',
              x: 5,
              y: 23,
              style: {                      // 9.20xg
                   fontSize: "9px",
              }
          },
          credits: {
            enabled:false
          },
		colors:color,
        legend: {
            backgroundColor: '#FFFFFF',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
           
            x:40,
            y:0,
            
            shadow: true,
            itemDistance:7
        },
        tooltip:{ 
        	pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f}'+text+'</b> <br>', 
        	shared: true  ,
        	
        	},
		xAxis: {
			type: 'datetime',
			title: {
				text: 'Time'
			},
			tickInterval: gap* 300000,
			//tickAmount: number/12,
            labels: {
                style: {
                    color: 'red'
                }
            },
			dateTimeLabelFormats: {
				millisecond: '%H:%M:%S.%L',
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%e. %b',
				week: '%e. %b',
				month: '%b \'%y',
				year: '%Y'
			}
			
		},
		yAxis: {
			title: {
				text: text,
                style: {
                    color: 'red'
                }
			},
            labels: {
                enabled:flag,
                style: {
                    color: 'red'
                }
                },
            min:min
		},
		exporting: {
			enabled: false
		},
		plotOptions: {
			area: {
				stacking: 'normal',
				lineWidth: 0,
				marker: {
					enabled: false
				},
				animation: false
			}
		},
		series: []
	};
	var chart={};
	
	
	var _data= {};
      $.ajaxSettings.async = false;
    if(file2)
	{
		 $.getJSON("./files/"+file2+"?id="+new Date().getTime(),function(data){
	
			 _data = data;
			 data = null;
		 });
		 
	}
	 $.getJSON("./files/"+file+"?id="+new Date().getTime(),function(data){
		if(file2)
		{
			if(_data){
				for(var i = 0; i < _data.series.length; i++)
				{
					data.series.push(_data.series[i]);
				}
			}
			_data = null;
		}
		
		localStorage.setItem(render_to,JSON.stringify(data));//以JSON字符串的格式存储到localStorage里面
		chart = new Highcharts.Chart(options);
		$("#"+render_to).find("button").attr("disabled",true);
		var Ctime=clock;
		var rec = track;
		if(file=="saving.json"){//saving图要单独画
			for(var i = 0; i < data.series.length; i++)
			{
				var data_series = new Array(number/aver);
				if(btn[index]) {
				   Ctime = sclock;
				} else {
				    Ctime = sclock-aver;
				    rec = track - aver;
				    
				}
				stop[index]=cur[index]=Ctime;
				var start=Date.UTC(2010, 7,21, 0, 0) -number*300000+track*300000;
				for(var j = aver-1;j < number;j+=aver)
				{
					var x = start + (j+1-aver)*300000;
                    var y;
					 if(((number-j-1)+aver)<= Ctime &&   Ctime >= 0){
					 var tmpa = data.series[i].data[(Ctime - (number-j-1))%(total+1)][0];
					 var tmpb = data.series[i].data[(Ctime -(number-j-1)-aver)%(total+1)][0];
					 var tmpc = data.series[i].data[(Ctime - (number-j-1))%(total+1)][1];
					 var tmpd = data.series[i].data[(Ctime-(number-j-1)-aver)%(total+1)][1];
					 y=(tmpa-tmpb)/(tmpc-tmpd);
					 y*=100;
					 } else {
						 y=null;
					 }
					data_series[(j+1)/aver-1] = [x,y];
				}
				chart.addSeries(
				{
					name: data.series[i].name,
					data: data_series
				},false);
			}
		}else{//console.log(render_to+","+data.series.length);
			for(var i = 0; i < data.series.length; i++)
			{
				var data_series = new Array(number);
				if(btn[index]) {
				  Ctime = clock;
				} else {
				    Ctime = clock-1;
				}
				rec=stop[index]=cur[index]=Ctime;
				var start=Date.UTC(2010, 7,21, 0, 0) -number*300000+clock*300000;
				for(var j=0;j<number;j++)
				{
					var x=start+(j+1)*300000;
					var y = ((number-j-1) <= Ctime &&  Ctime>=0) ? data.series[i].data[(Ctime - (number-j-1))%total] : null;
					data_series[j] = [x,y];
				}
				chart.addSeries(
				{
					name: data.series[i].name,
					data: data_series
				},false);
			}
		}
		if(rec+multi>number)//后退前进按钮，图是通过redraw重新画的
			$("#"+render_to).find("button").first().attr("disabled",false);
		chart.redraw();	
		chart=null;
		 options = null;
		});
	 
   $.ajaxSettings.async = true;
 }
 
 
 function fetchChart(render_to,index,number){//画动态图需要
		var chart = $("#"+render_to).highcharts();
		btn[index]=1;
		if(chart){
		var series = chart.series;
		var data=JSON.parse(localStorage.getItem(render_to));
		if(update_enable[index] == 0)
				return;
		stop[index]=cur[index]=clock;
		for(var i = 0;i <series.length;i++)
			{
				var x = series[i].data[0].x+number*5*60*1000;
				var y = data.series[i].data[clock%total];
				series[i].addPoint([x,y], false,true,true);
			}
			if(clock >= number)
			 $("#"+render_to).find("button").first().attr("disabled",false);
			chart.redraw();
			series=null;
			data=null;
		}
		chart=null;
}
function fetchSChart(render_to,index,number){
		var chart = $("#"+render_to).highcharts();
		btn[index]=1;
		if(chart){
		var series = chart.series;
		var data=JSON.parse(localStorage.getItem(render_to));
		if(number==1) number=2016;
		if(update_enable[index] == 0)
				return;
		stop[index]=cur[index]=sclock;
		for(var i = 0;i <series.length;i++)
			{
				var x = series[i].data[0].x+number*5*60*1000;
				var tmpa = data.series[i].data[sclock%(total+1)][0];
				var tmpb = data.series[i].data[(sclock-aver)%(total+1)][0];
				var tmpc = data.series[i].data[sclock%(total+1)][1];
				var tmpd = data.series[i].data[(sclock-aver)%(total+1)][1];
				var y =(tmpa-tmpb)/(tmpc-tmpd);
				y*=100;
                series[i].addPoint([x,y], false,true,true);
			}
			if(track>number)
			$("#"+render_to).find("button").first().attr("disabled",false);
			chart.redraw();
			series=null;
			data=null;
			}
		chart=null;
}
//画拓扑图
    var energyNodes=[],
        nodes=[],
        wrapnodes=[];
    var pos=[
             {
            	 "x":45/894,
             	 "y":20/345
             },
             {
            	 "x":200/894,
             	 "y":130/345
             },
             {
            	 "x":470/894,
             	 "y":160/345
             },
             {
            	 "x":580/894,
             	 "y":115/345
             },
             {
            	 "x":820/894,
             	 "y":100/345
             },
             {
            	 "x":780/894,
             	 "y":150/345
             },
             {
            	 "x":680/894,
             	 "y":220/345
             },
             {
            	 "x":480/894,
             	 "y":280/345
             },
             {
            	 "x":70/894,
             	 "y":200/345
             },
             ];
          function drawTopo(lfile,rfile,stage,scene,number){
        	var q=stage.width;
        	energyNodes=[];
        	nodes=[];
        	wrapnodes=[];
            for(var i=0; i<9; i++){
            addNode("DUT"+(i+1),pos[i].x*q,pos[i].y*stage.height);//修改ＤＵＴ（ｉ）为ＤＵＴ（ｉ）ＫＡＮＳ．增加拓扑节点
            addEnergyNode("100%",pos[i].x*q+20,pos[i].y*stage.height+22);//节点下面的能量柱
            addFillNode(pos[i].x*q+20,pos[i].y*stage.height+22);//能量柱填充比例
            /*if(i==2){
            	addNode("DUT3(KANS)",pos[i].x*q,pos[i].y*stage.height);//修改ＤＵＴ（ｉ）为ＤＵＴ（ｉ）ＫＡＮＳ．
                addEnergyNode("100%",pos[i].x*q+20,pos[i].y*stage.height+22);
                addFillNode(pos[i].x*q+20,pos[i].y*stage.height+22);
                }*/
           
            }//下面做的相应修改。
            newLink(stage.find('node[text="DUT1"]')[0],stage.find('node[text="DUT2"]')[0],"10");
            newLink(stage.find('node[text="DUT1"]')[0],stage.find('node[text="DUT9"]')[0],"1");//
            newLink(stage.find('node[text="DUT2"]')[0],stage.find('node[text="DUT3"]')[0],"6");
            newLink(stage.find('node[text="DUT2"]')[0],stage.find('node[text="DUT9"]')[0],"8");
            newLink(stage.find('node[text="DUT3"]')[0],stage.find('node[text="DUT4"]')[0],"4");
            newLink(stage.find('node[text="DUT3"]')[0],stage.find('node[text="DUT8"]')[0],"12");//
            newLink(stage.find('node[text="DUT4"]')[0],stage.find('node[text="DUT5"]')[0],"11");
            newLink(stage.find('node[text="DUT4"]')[0],stage.find('node[text="DUT6"]')[0],"0");//
            newLink(stage.find('node[text="DUT4"]')[0],stage.find('node[text="DUT7"]')[0],"5");//
            newLink(stage.find('node[text="DUT5"]')[0],stage.find('node[text="DUT6"]')[0],"9");
            newLink(stage.find('node[text="DUT6"]')[0],stage.find('node[text="DUT7"]')[0],"2");
            newLink(stage.find('node[text="DUT7"]')[0],stage.find('node[text="DUT8"]')[0],"3");
            newLink(stage.find('node[text="DUT8"]')[0],stage.find('node[text="DUT9"]')[0],"7");
			if(btn[7]) {
				  var Ctime = clock;
				} else {
				    Ctime = clock-1;
				}
            var url;
            url="./files/"+lfile+"?id="+new Date().getTime() ;//通过读取文件得到链路关闭显示
            $.getJSON(url,function(data){		
            	localStorage.setItem(lfile.split('.')[0],JSON.stringify(data));
            	if(Ctime>=0){
                    var link=stage.find("link");
                    for(var i=0;i<link.length;i++){
                    link[i].strokeColor='0,255,0';
                    }
                 	   for(i=0;i<data["series"][Ctime%number]["data"].length;i++){
                            var tmp=data["series"][Ctime %number]["data"][i].toString();
                            link=scene.findElements(function(e){return e.text==tmp; });
                            link[0].strokeColor='255,0,0';
                       }
            	}
            });
            url="./files/"+rfile+"?id="+new Date().getTime() ;//通过数据得到能量节点显示的百分比
            $.getJSON(url,function(data){
            	localStorage.setItem(rfile.split('.')[0],JSON.stringify(data));
            	if(Ctime>=0){
                 	if(data["series"].length!=0){
                        for(var i=0;i<energyNodes.length;i++){
                        	 wrapnodes[i].text="";
                     	   var x=(data["series"][Ctime%number]["data"][i]*30/100);
                     	   energyNodes[i].setSize(x, 10);
                     	   //energyNodes[i].scaleX=0.8;
                     	   wrapnodes[i].text=(data["series"][Ctime%number]["data"][i]).toFixed(2)+"%";
                        }
                     	} else{//其他显示为100%
                             for(i=0;i<energyNodes.length;i++){
                             energyNodes[i].setSize(30, 10);
                             wrapnodes[i].text="100%";
                             }
                     	}
            	}

            });
           
           function addNode(text, x , y){//
                 var node = new JTopo.Node(text);
                node.fontColor = '255,0,0';
                node.setLocation(x, y);
                node.setImage('./images/router.png', true);
                scene.add(node);
                
                node.mouseover(function(event){
                var url="./files/cardstatus" ;
                url=url+this.text+".json";
                var that=this; 
                if(update_enable[7]==1){ 
                $.getJSON(url,function(data){
                $("#contextmenu").css({
	
                top:that.y,
				left: that.x,
				zIndex:1
					}).show(showdata());	//9.14号修改
                function showdata() {
                	for(var i=0;i<data["series"][clock%number].length;i++){//alert($("#contextmenu p")[0].innerHTML);
        				
    					
    					for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
    					
    						if(data["series"][clock%number][i]["data"][j]!= 2){
    							for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
    								if(data["series"][clock%number][i]["data"][j]==1)
    									$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :on<br/>";
    								else if(data["series"][clock%number][i]["data"][j]==0||data["series"][clock%number][i]["data"][j]==2)
    									$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :off<br/>";
    							}
    						}else{
    							for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
    								$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :off<br/>";	
    							}
    							$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+" :off<br/>";
    					}
    					}
    						
    					}
                }
					/*for(var i=0;i<data["series"][clock%number].length;i++){//alert($("#contextmenu p")[0].innerHTML);
				
					
					for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
					
						if(data["series"][clock%number][i]["data"][j]!= 2){
							for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
								if(data["series"][clock%number][i]["data"][j]==1)
									$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :on<br/>";
								else if(data["series"][clock%number][i]["data"][j]==0||data["series"][clock%number][i]["data"][j]==2)
									$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :off<br/>";
							}
						}else{
							for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
								$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :off<br/>";	
							}
							$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+" :off<br/>";
					}
					}
						
					}*/
				
					
					/*for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
						
				if(data["series"][clock%number][i]["data"][j]==1)
			    $("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :on<br/>";
			    else if(data["series"][clock%number][i]["data"][j]==0)
			    $("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :off<br/>";
				
				}*/
					
             
                });
                }
                });
                node.mouseout(function(){
                	$("#contextmenu")[0].innerHTML="";
                    $("#contextmenu").hide();
                });
                nodes.push(node);
                return node;
              }
           function addEnergyNode(text,x,y){
            var defaultNode = new JTopo.Node();
            defaultNode.text = text;
            defaultNode.textOffsetY = -10;
            defaultNode.textOffsetX = 5;
            defaultNode.font ="6px";
            defaultNode.fontColor ="0,0,0";
            //defaultNode.textPosition = 'Left';
            defaultNode.setLocation(x, y); 
            defaultNode.setSize(30, 10);  
            defaultNode.borderRadius = 3; 
            //defaultNode.borderWidth = 2;
            //defaultNode.borderColor = '250,250,250';  
            defaultNode.fillColor='192,192,192';
            defaultNode.alpha = 0.4;
            scene.add(defaultNode);
            wrapnodes.push(defaultNode);
            return defaultNode;
           }
            function addFillNode(x,y){
            var defaultNode = new JTopo.Node(); 
            defaultNode.setLocation(x, y); 
            defaultNode.setSize(30, 10); 
            defaultNode.borderRadius = 3; 
            defaultNode.fillColor="0,250, 0";
            scene.add(defaultNode);
            energyNodes.push(defaultNode);
            return defaultNode;
           }
            function newFoldLink(nodeA, nodeZ, text, dashedPattern){//alert(nodeA.text);
                var link = new JTopo.FlexionalLink(nodeA, nodeZ, text);
                link.arrowsRadius = 0;
                link.lineWidth = 3; 
                link.offsetGap = 30;
                link.bundleGap = 15; 
                link.textOffsetY = 10; 
               // link.strokeColor = JTopo.util.randomColor(); 
                link.strokeColor='0,255,0';
                link.dashedPattern = dashedPattern; 
                scene.add(link);
                return link;
            }
            function newLink(nodeA, nodeZ, text,dashedPattern){
                var link = new JTopo.Link(nodeA, nodeZ, text);        
                link.lineWidth = 3; 
                link.bundleOffset = 60; 
                link.bundleGap = 20; 
                link.text="";
                link.flag=text;
                //link.textOffsetY = 3; 
               // link.strokeColor = JTopo.util.randomColor(); 
                link.strokeColor='0,255,0';
                link.dashedPattern = dashedPattern; 
                scene.add(link);
                return link;
                }
             /*  setInterval( function(){alert(1);

            
            },1000);*/
          }
          function fetchTopo(lfile,rfile,stage,scene,number){
        	  btn[7]=1;
        	  if(stage){
			 if(update_enable[7] == 0)
				 return;
              var ldata,rdata,link,i;
          	   ldata=JSON.parse(localStorage.getItem(lfile.split('.')[0]));
               link=stage.find("link");
               for(i=0;i<link.length;i++){
               link[i].strokeColor='0,255,0';
               }
            	   for(i=0;i<ldata["series"][clock%number]["data"].length;i++){
                       var tmp=ldata["series"][clock %number]["data"][i].toString();
                       link=scene.findElements(function(e){return e.flag==tmp; });
                       link[0].strokeColor='255,0,0';
                  }
           	   rdata=JSON.parse(localStorage.getItem(rfile.split('.')[0]));
            	if(rdata["series"].length!=0){
               for(i=0;i<energyNodes.length;i++){
            	   wrapnodes[i].text="";
            	   var x=(rdata["series"][clock%number]["data"][i]*30/100);
            	   energyNodes[i].setSize(x, 10);
            	   //energyNodes[i].scaleX=0.8;
            	   wrapnodes[i].text=(rdata["series"][clock%number]["data"][i]).toFixed(2)+"%";
               }
            	} else{
                    for(i=0;i<energyNodes.length;i++){
                    energyNodes[i].setSize(30, 10);
                    wrapnodes[i].text="100%";
                    }
            	}
        	  }
              }
          
          
       /*   function saveCookie(){
          	 $.cookie("record",'{"code":'+update+',"update":['+update_enable+'],"clock":['+cur+'],"total":'+clock+'}');
          }*/
          
          
          
         //dom loaded
          var swidth,childrenarr,frequency=0,aver=1;
    	  var unit=[//当修改时间粒度时，数字和单位组成了一个二维数组，它所对应的图需要画几个点是由这个映射得到。
    	            [0,144,2016,1],//例如，选择3小时，对应是数组1、1位置上的数值288
    	            [0,288,0,0],
    	            [12,0,0,0],
    	            [72,0,0,0]
    	            ];
         $(document).ready(function(){
        	 $("#play-button").attr("disabled",false);
        	 $("#pause-button").attr("disabled",true);
        	 $("#stop-button").attr("disabled",true);
             var canvas=$("#topology")[0];
             swidth=$("#traffic")[0].offsetWidth;
             canvas.width=swidth;
             var stage = new JTopo.Stage(canvas); 
             var scene = new JTopo.Scene();
             scene.background = "./images/topo.jpg";
             stage.add(scene);
        	    if(!$.cookie("consv")){//saving图初始化值，3小时，对应于数组中横坐标length为1纵坐标unit为1.
        	    	$.cookie("consv",'{"color":"#238E23","length":1,"unit":1}');
        	    }
        	    if(!$.cookie("consp")){
        	    	$.cookie("consp",'{"color":"#00BFFF","length":1,"unit":1}');
        	    }
        	    if(!$.cookie("traffic")){
        	    	$.cookie("traffic",'{"color":"#FF8000","length":1,"unit":1}');
        	    }
        	    if(!$.cookie("utilization")){
        	    	$.cookie("utilization",'{"length":1,"unit":1}');
        	    }
        	    if(!$.cookie("frequency")){//与上面类似
        	    	$.cookie("frequency",'{"length":2,"unit":0,"value":3}');
        	    }
        	    frequency=timeChange(JSON.parse($.cookie("frequency")));
        	    function timeChange(x){
        	    	var y=3000;
            		switch(x.unit){//刷新频率的改变引起时间的改变
            		case 0:
                        y=x.value*1000;
            			break;
            		case 1:
            			y=x.value*60*1000;
            			break;
            		case 2:
                        y=x.value*60*60*1000;
            			break;
            		case 3:
                        y=x.value*24*60*60*1000;
            			break;
            		}	
            		return y;
        	    }
        		 switch(unit[JSON.parse($.cookie("consv")).length][JSON.parse($.cookie("consv")).unit]){
        		 case 12://saving图画出的条形图的数量。
        			 aver=1;
        			 break;
        		 case 72:
        			 aver=6;
        			 break;
        		 case 144:
        			 aver=12;
        			 break;
        		 case 288:
        			 aver=36;
        			 break;
        		 case 2016:
        			 aver=288;
        			 break;
        		 case 1:
        			 aver=2016;
        			 break;
        			 
        		 }
             sclock=aver;
             track=aver;//初始化四张图
             drawTopo("turnofflinks.json","deviceratio.json",stage,scene,total);
        	 drawChart("matrix.json","traffic",[JSON.parse($.cookie("traffic")).color],"line",unit[JSON.parse($.cookie("traffic")).length][JSON.parse($.cookie("traffic")).unit],2);
        	 drawChart("energy.json","consumption",[JSON.parse($.cookie("consp")).color,'#058DC7'],"line",unit[JSON.parse($.cookie("consp")).length][JSON.parse($.cookie("consp")).unit],0,"energyNoUsing.json");
             drawChart("linkutil.json","utilization",['#058DC7', '#50B432', '#ED561B','#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#EE82EE','#FF00FF','#0000CD','#8A2BE2'],"area",unit[JSON.parse($.cookie("utilization")).length][JSON.parse($.cookie("utilization")).unit],3);
        	 $( "#timer" ).css("display","block");//块元素的感觉。
        	 $( "#timer" ).draggable();
			 setInterval(function(){
			 if(update===0)
			 return;//这里是什么作用
			 fetchChart("consumption",0,unit[JSON.parse($.cookie("consp")).length][JSON.parse($.cookie("consp")).unit]);
			 fetchChart("traffic",2,unit[JSON.parse($.cookie("traffic")).length][JSON.parse($.cookie("traffic")).unit]);
			 fetchChart("utilization",3,unit[JSON.parse($.cookie("utilization")).length][JSON.parse($.cookie("utilization")).unit]);
			 fetchChart("delay",4,288);
			 fetchChart("jitter",5,288);
			 fetchChart("loss",6,288);
             fetchTopo("turnofflinks.json","deviceratio.json",stage,scene,total);
			 if((clock+1)%aver===0){
				 fetchSChart("saving",1,unit[JSON.parse($.cookie("consv")).length][JSON.parse($.cookie("consv")).unit]);
				 if(sclock%(total+1)==2016) sclock+=1;
				 sclock+=aver;
				 track+=aver;
				 btn[1]=0;
			 }
			 countTimer();
			 clock = clock + 1;
			 for(var i=0;i<btn.length;i++){
				 if(i!=1)
					 btn[i]=0; 
			 }

		    },frequency);
          });
           $(window).resize(function(){
        	   var arr=["consumption","traffic","utilization","delay","saving","jitter","loss"];
        	   for(var i=0;i<arr.length;i++){
        		   if($("#"+arr[i])[0]){
                       swidth=$("#"+arr[i])[0].offsetWidth;
                       break;
        		   }
        		   if($("#topology")[0]){
                       $("#topology")[0].width=swidth;
                       for(i=0;i<energyNodes.length;i++){
                          nodes[i].setLocation(pos[i].x*swidth,pos[i].y*345);
                    	  energyNodes[i].setLocation(pos[i].x*swidth+20,pos[i].y*345+22);
                       	  wrapnodes[i].setLocation(pos[i].x*swidth+20,pos[i].y*345+22);
                          }
        		   }
        	   }

               
           });
           
          //layout 以下大部分为事件绑定，均已调节好
            var layoutThree = $(".layout-three"),layoutTwo = $(".layout-two"),
            modalContent = $("#modal-content"),modalItems = [];
            modalItems = [].slice.call(modalContent[0].getElementsByTagName("div"),0);
         layoutThree.click(function(e){
            var count = modalItems.length,
                    rect = modalContent[0].getBoundingClientRect(),width = rect.width;
            var itemWidth,frag = document.createDocumentFragment();
            for(var i= 0;i<count;i++){
                frag.appendChild(modalItems[i]);
            }
            itemWidth = Math.floor((width - 20*4 )/3);
            modalItems.forEach(function(item){
                item.style.width = itemWidth + "px";
            })
            modalContent[0].appendChild(frag);
        });
        layoutTwo.click(function(){
            var count = modalItems.length,
                    rect = modalContent[0].getBoundingClientRect(),width = rect.width;
            var itemWidth,frag = document.createDocumentFragment();
            for(var i= 0;i<count;i++){
                frag.appendChild(modalItems[i]);
            }
            itemWidth = Math.floor((width - 20*3 )/2);
            modalItems.forEach(function(item){
                item.style.width = itemWidth + "px";
            });
            modalContent[0].appendChild(frag);
        });
        
        //remove some portal
          var mainContent,mainItems = [];
          $("#modal-content").on("click",".icon-minus",function(){
              var ids=$(this).parent().prev()[0].innerHTML.toLowerCase().split(" ");
              var id=ids[ids.length-1];
              var index=commonFun(id).index;
           mainContent= $(".row-fluid");
           mainItems = [].slice.call(mainContent[0].getElementsByTagName("div"),0);
          $(this).removeClass("icon-minus");
          $(this).addClass("icon-plus");//alert($(this).prop("className")); 
          var count = mainItems.length;
         var tmp = $(this).parent().prev()[0].innerHTML.trim();
            for(var i= 0;i<count;){
            if(tmp==mainItems[i].getElementsByTagName("h3")[0].innerHTML.trim()){
               // mainContent[0].removeChild(mainItems[i]); 
            	$(mainItems[i]).remove();
                break;
                }
             if(mainItems[i].getElementsByTagName("h3")[0].innerHTML.trim()=="Topology")
             i+=5;
             else
             i+=6;
            }
           // var s=[].slice.call(mainContent[0].getElementsByTagName("div"),0);
           // inspect(s,s.length);
          });
          
          
          $("#modal-content").on("click",".icon-plus",function(){
          mainContent= $(".row-fluid");
          mainItems = [].slice.call(mainContent[0].getElementsByTagName("div"),0);
          $(this).removeClass("icon-plus");
          $(this).addClass("icon-minus");
          l=mainItems.length;
        /*  var ids=mainItems[0].getElementsByTagName("h3")[0].innerHTML.toLowerCase().split(" ");
          var sid=ids[ids.length-1];
          if(l==5){
          	$(mainItems[0]).removeClass('col-md-10 col-md-offset-1');
        	$(mainItems[0]).addClass('col-md-6');
            mainItems[0].getElementsByTagName("canvas")[0].width=swidth;
            mainItems[0].getElementsByTagName("canvas")[0].height="345";
            mainItems[0].getElementsByTagName("i")[2].className="icon-check-empty";
            for(var i=0;i<energyNodes.length;i++){
                nodes[i].setLocation(pos[i].x*swidth,pos[i].y*345);
         	     energyNodes[i].setLocation(pos[i].x*swidth+20,pos[i].y*345+22);
            	  wrapnodes[i].setLocation(pos[i].x*swidth+20,pos[i].y*345+22);
               }
            }
            else if(l==6){
             $(mainItems[0]).removeClass('col-md-10 col-md-offset-1');
            $(mainItems[0]).addClass('col-md-6');
             mainItems[4].style.height="350px";
             mainItems[0].getElementsByTagName("i")[2].className="icon-check-empty";
             $("#"+sid).highcharts().reflow();
            }	*/
          var frag = document.createDocumentFragment();
          var div1=document.createElement("div");
          div1.className="col-md-6";
          var div2=document.createElement("div");
          div2.className="widget-item";
          var div3=document.createElement("div");
          div3.className="widget-header";
          var i1=document.createElement("i");
          i1.className="icon-bar-chart";
          div3.appendChild(i1);
          var h=document.createElement("h3");
          h.innerHTML=$(this).parent().prev()[0].innerHTML.trim();;
          div3.appendChild(h);
          var i2=document.createElement("i");
          i2.className="icon-remove";
          div3.appendChild(i2);
          var i3=document.createElement("i");
          i3.className="icon-check-empty";
          div3.appendChild(i3);
          var ids=h.innerHTML.toLowerCase().split(" ");
          var sid=ids[ids.length-1];
          if(sid!="topology"){
              var i4=document.createElement("i");
              i4.className="icon-refresh";
              div3.appendChild(i4);  
          }
          div2.appendChild(div3);
          var div4=document.createElement("div");
          div4.className="widget-content";
          if(sid=="topology"){
          var canvas=document.createElement("canvas");
          canvas.id=sid;
          canvas.className="chart-holder";
          canvas.height="345";
          canvas.width=swidth;
          var div5=document.createElement("div");
          div5.id="contextmenu";
          for(var i=0;i<2;i++ )
          div5.appendChild(document.createElement("p"));
          div4.appendChild(div5);
          div4.appendChild(canvas);
          }
          else if(sid=="consumption"){
          var canvas=document.createElement("div");
          canvas.id=sid;
          canvas.className="chart-holder";
          canvas.style.height="350px";
          canvas.style.width="100%";
          div4.appendChild(canvas);
          }
          else if(sid=="saving"){
          var canvas=document.createElement("div");
          canvas.id=sid;
          canvas.className="chart-holder";
          canvas.style.height="350px";
          canvas.style.width="100%";
          div4.appendChild(canvas);
          }
          else if(sid=="utilization"){
          var canvas=document.createElement("div");
          canvas.id=sid;
          canvas.className="chart-holder";
          canvas.style.height="350px";
          canvas.style.width="100%";
          div4.appendChild(canvas);
          }
          else if(sid=="delay"){
          var canvas=document.createElement("div");
          canvas.id=sid;
          canvas.className="chart-holder";
          canvas.style.height="350px";
          canvas.style.width="100%";
          div4.appendChild(canvas);
          }
          else if(sid=="jitter"){
	          var canvas=document.createElement("div");
	          canvas.id=sid;
	          canvas.className="chart-holder";
	          canvas.style.height="350px";
	          canvas.style.width="100%";
	          div4.appendChild(canvas);
          }
         else if(sid=="loss"){
	          var canvas=document.createElement("div");
	          canvas.id=sid;
	          canvas.className="chart-holder";
	          canvas.style.height="350px";
	          canvas.style.width="100%";
	          div4.appendChild(canvas);
          }
         else if(sid=="traffic"){
	          var canvas=document.createElement("div");
	          canvas.id=sid;
	          canvas.className="chart-holder";
	          canvas.style.height="350px";
	          canvas.style.width="100%";
	          div4.appendChild(canvas);
         }
          div2.appendChild(div4);
          div1.appendChild(div2);
          frag.appendChild(div1);
          mainContent[0].appendChild(frag);
          var s=[].slice.call(mainContent[0].getElementsByTagName("div"),0);
         // inspect(s,s.length);
          if(sid=="topology"){
          var canvas=$("#topology")[0];
          canvas.width=swidth;
          var stage = new JTopo.Stage(canvas); 
          var scene = new JTopo.Scene();
          scene.background = "./images/topo.jpg";
          stage.add(scene);
          drawTopo("turnofflinks.json","deviceratio.json",stage,scene,total);
          }
         else if(sid=="consumption"){
        	 drawChart("energy.json","consumption",[JSON.parse($.cookie("consp")).color,'#058DC7'],"line",unit[JSON.parse($.cookie("consp")).length][JSON.parse($.cookie("consp")).unit],0,"NoUsing.json");
         }
         else if(sid=="saving"){ 
         	 drawChart("saving.json","saving",[JSON.parse($.cookie("consv")).color],"column",unit[JSON.parse($.cookie("consv")).length][JSON.parse($.cookie("consv")).unit],1);
         } 
         else if(sid=="utilization"){
          canvas=document.getElementById("utilization"); 
          drawChart("linkutil.json","utilization",['#058DC7', '#50B432', '#ED561B','#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#EE82EE','#FF00FF','#0000CD','#8A2BE2'],"area",unit[JSON.parse($.cookie("utilization")).length][JSON.parse($.cookie("utilization")).unit],3);
         } 
         else if(sid=="delay"){
             drawChart("latency.json","delay",["#7f0450",'#058DC7'],"line",288,4,"energyNoUsing.json");
         } 
         else if(sid=="jitter"){
        	 drawChart("jitter.json","jitter",["#5f0000",'#058DC7'],"line",288,5,"energyNoUsing.json");
         } 
         else if(sid=="loss"){
        	 drawChart("loss.json","loss",["#546000",'#058DC7'],"line",288,6,"energyNoUsing.json");
         } 
         else if(sid=="traffic"){
        	 drawChart("matrix.json","traffic",[JSON.parse($.cookie("traffic")).color],"line",unit[JSON.parse($.cookie("traffic")).length][JSON.parse($.cookie("traffic")).unit],2);
            } 
          });
          
          
          
          
          
          $(".main").on("click",".icon-remove",function(){
          var ids=$(this).prevAll("h3")[0].innerHTML.toLowerCase().split(" ");
           var id=ids[ids.length-1];
           var index=commonFun(id).index;
           $(this).parents(".col-md-6")[0] ? $(this).parents(".col-md-6").remove():$(this).parents(".col-md-10").remove(); 
           for(var i= 0;i<modalItems.length;i++){
                if($(this).prev("h3")[0].innerHTML.trim()===modalItems[i].getElementsByTagName("dt")[0].innerHTML.trim()) {
                 modalItems[i].getElementsByTagName("a")[0].className="icon-plus";
                }
            }
           mainContent= $(".row-fluid");
          // var s=[].slice.call(mainContent[0].getElementsByTagName("div"),0);
           //inspect(s,s.length);
          });
          
          
          
          
          
          
          $(".main").on("click",".icon-check-empty",function(){
        	  var arr=[];
        	  childrenarr=[];
        	  mainContent= $(".row-fluid");
        	  mainItems = [].slice.call(mainContent[0].getElementsByTagName("div"),0);
                for(var i= 0;i<mainItems.length;){
                	childrenarr.push(mainItems[i]);
                     if($(this).prevAll("h3")[0].innerHTML.trim()!=mainItems[i].getElementsByTagName("h3")[0].innerHTML.trim()) {
                    	 arr.push(mainItems[i]);
                     }
                     if(mainItems[i].getElementsByTagName("h3")[0].innerHTML.trim()=="Topology")
                         i+=5;
                         else
                         i+=6;
                 }
                for(var i=0;i<arr.length;i++){
                	//mainContent[0].removeChild(arr[i]);
                	$(arr[i]).remove();
                }
                var s=[].slice.call(mainContent[0].getElementsByTagName("div"),0);
                inspect(s,s.length);
               // $(this).removeClass("icon-check-empty");
              //  $(this).addClass("icon-share-alt");
                for(var i= 0;i<modalItems.length;i++){
                    if($(this).prevAll("h3")[0].innerHTML.trim()!=modalItems[i].getElementsByTagName("dt")[0].innerHTML.trim()) {
                     modalItems[i].getElementsByTagName("a")[0].className="icon-plus";
                    }
                }
               });
          
          
          
          
          $(".main").on("click",".icon-share-alt",function(){
        	  mainContent= $(".row-fluid");
        	  mainItems = [].slice.call(mainContent[0].getElementsByTagName("div"),0);
              var frag = document.createDocumentFragment();
              var name=mainItems[0].getElementsByTagName("h3")[0].innerHTML.trim();
              for(var i=0;i<childrenarr.length;i++){
            	if(childrenarr[i].getElementsByTagName("h3")[0].innerHTML.trim()===name){
            		var tmp=[].slice.call(childrenarr[i].getElementsByTagName("div"),0),
            		l=tmp.length;
                    if(l==4){
                        //$(childrenarr[i]).removeClass('col-md-offset-3');
                    	$(childrenarr[i]).removeClass('col-md-10 col-md-offset-1');
                    	$(childrenarr[i]).addClass('col-md-6');
                    	childrenarr[i].getElementsByTagName("canvas")[0].width=swidth;
                        childrenarr[i].getElementsByTagName("canvas")[0].height="345";
                        }
                        else if(l==5){
                         var ids=childrenarr[i].getElementsByTagName("h3")[0].innerHTML.toLowerCase().split(" ");
                         var sid=ids[ids.length-1];
                         //$(childrenarr[i]).removeClass('col-md-offset-3');
                         $(childrenarr[i]).removeClass('col-md-10 col-md-offset-1');
                         $(childrenarr[i]).addClass('col-md-6');
                         tmp[3].style.height="350px";
                         $("#"+sid).highcharts().reflow();
                        }
                    //mainContent[0].removeChild(mainItems[0]);
                    $(mainItems[0]).remove();
            	}
                $(this).removeClass("icon-share-alt");
                $(this).addClass("icon-check-empty");
              	frag.appendChild(childrenarr[i]);
              }
              mainContent[0].appendChild(frag);
               for(i=0;i<energyNodes.length;i++){
              nodes[i].setLocation(pos[i].x*swidth,pos[i].y*345);
       	     energyNodes[i].setLocation(pos[i].x*swidth+20,pos[i].y*345+22);
          	  wrapnodes[i].setLocation(pos[i].x*swidth+20,pos[i].y*345+22);
             }
              for(var i= 0;i<modalItems.length;i++){
            	  for(var j=0;j<childrenarr.length;j++){
                  if(childrenarr[j].getElementsByTagName("h3")[0].innerHTML.trim()===modalItems[i].getElementsByTagName("dt")[0].innerHTML.trim()){
                  if($(this).prevAll("h3")[0].innerHTML.trim()!=modalItems[i].getElementsByTagName("dt")[0].innerHTML.trim()) {
                   modalItems[i].getElementsByTagName("a")[0].className="icon-minus";
                  }
            	  }
            	  }
              }
        	  childrenarr=[];
               });
          
          
          
          $(".main").on("click",".icon-refresh",function(){//alert($(this).prevAll("h3")[0].innerHTML)

        	 var ids=$(this).prevAll("h3")[0].innerHTML.toLowerCase().split(" ");
        	 var id=ids[ids.length-1];
        	 var index=7,number=288;
        	 index=commonFun(id).index;
        	 number=commonFun(id).number;
        	var name=$("#"+id).highcharts();
        	if(number === 1) number=2016;
       	 if(!update_enable[index]){
       		var data=JSON.parse(localStorage.getItem(id));
            var len=name.series.length;
            for(var i=0;i<len;i++){
  				name.series[0].remove();
            }
            var multi= id==="saving"? 0:1;
			$("#"+id).find("button").last().attr("disabled",true);
			var Ctime;
			var rec = track;
    						if(id=="saving"){
    							for(var i = 0; i < data.series.length; i++)
    							{
    								var data_series = new Array(number/aver);
    								if(btn[index]) {
    								   Ctime = sclock;
    								} else {
    								    Ctime = sclock-aver;
    								    rec = track - aver;
    								}
        							cur[index]=stop[index]=Ctime;
    								var start=Date.UTC(2010, 7,21, 0, 0) -number*300000+track*300000;
    								for(var j = aver-1;j < number;j+=aver)
    								{
    									var x = start + (j+1-aver)*300000;
    				                    var y;
    									 if(((number-j-1)+aver)<= Ctime &&   Ctime >= 0){
    									 var tmpa = data.series[i].data[(Ctime - (number-j-1))%(total+1)][0];
    									 var tmpb = data.series[i].data[(Ctime -(number-j-1)-aver)%(total+1)][0];
    									 var tmpc = data.series[i].data[(Ctime - (number-j-1))%(total+1)][1];
    									 var tmpd = data.series[i].data[(Ctime-(number-j-1)-aver)%(total+1)][1];
    									 y=(tmpa-tmpb)/(tmpc-tmpd);
    									 y*=100;
    									 } else {
    										 y=null;
    									 }
    									data_series[(j+1)/aver-1] = [x,y];
    								}
    								name.addSeries(
    								{
    									name: data.series[i].name,
    									data: data_series
    								},false);
    							}
    						}else{
    						for(var i = 0; i < data.series.length; i++)
    						{
    							var data_series = new Array(number);
    							if(btn[index]) {
    							    Ctime = clock;
    							} else {
    							    Ctime = clock-1;
    							}
    							rec=cur[index]=stop[index]=Ctime;
    							var start=Date.UTC(2010, 7,21, 0, 0) -number*300000+clock*300000;
    							for(var j=0;j<number;j++)
    							{
    								var x=start+(j+1)*300000;
    								var y = ((number-j-1) <= Ctime &&  Ctime>=0) ? data.series[i].data[(Ctime - (number-j-1))%total] : null;
    								data_series[j] = [x,y];
    							}
    								name.addSeries(
    								{
    									name: data.series[i].name,
    									data: data_series
    								},false);
    							}
    						}
    						name.redraw();
    						name=null;
    						data=null;
    						if(rec+multi>=number)
   							 $("#"+id).find("button").first().attr("disabled",false);
        	if(	$("#play-button").prop("disabled")==true){
            	update_enable[index]=1;
        	}
        	 }

          });
          
          function commonFun(id){
          	switch(id){
          	case "traffic":
          		return{
          		index : 2,
          		number : unit[JSON.parse($.cookie("traffic")).length][JSON.parse($.cookie("traffic")).unit]
          	};
       		 break;
             case "saving":
            	 return{
           		index : 1,
           		number : unit[JSON.parse($.cookie("consv")).length][JSON.parse($.cookie("consv")).unit]
           	};
       		 break;
             case "consumption":
                 return{
            		index : 0,
            		number : unit[JSON.parse($.cookie("consp")).length][JSON.parse($.cookie("consp")).unit]
            	};
       		 break;
             case "utilization":
                 return{
            		index : 3,
            		number :  number=unit[JSON.parse($.cookie("utilization")).length][JSON.parse($.cookie("utilization")).unit]
            	};
       		 break;
   	    	 case "delay":
   	             return{
            		index : 4,
            		number : 288
            	};
       		 break;
   	    	 case "jitter":
   	             return{
            		index : 5,
            		number:288
            	};
       		 break;
   	    	 case "loss":
   	             return{
            		index : 6,
            		number:288
            	};
       		 break;
   	    	 case "topology":
   	             return{
            		index : 7,
            		number:total
            	};
       		 break;
        	} 
          }
          //inspect the number of portal
          function inspect(s,l){
          if(l==5){
          $(s[0]).removeClass('col-md-6');
          $(s[0]).addClass('col-md-10 col-md-offset-1');
          //$(s[0]).addClass('col-md-offset-3');
          s[0].getElementsByTagName("canvas")[0].width=1512/1920*document.body.clientWidth ;//alert(document.body.clientWidth)
          s[0].getElementsByTagName("canvas")[0].height=document.documentElement.clientHeight-200;
          s[0].getElementsByTagName("i")[2].className="icon-share-alt";
          for(var i=0;i<energyNodes.length;i++){
           nodes[i].setLocation(pos[i].x*1512/1920*document.body.clientWidth+20,pos[i].y*s[0].getElementsByTagName("canvas")[0].height);
       	   energyNodes[i].setLocation(pos[i].x*1512/1920*document.body.clientWidth+40,pos[i].y*s[0].getElementsByTagName("canvas")[0].height+22);
        	wrapnodes[i].setLocation(pos[i].x*1512/1920*document.body.clientWidth+40,pos[i].y*s[0].getElementsByTagName("canvas")[0].height+22);
          }
          }
          else if(l==6){
           $(s[0]).removeClass('col-md-6');
           $(s[0]).addClass('col-md-10 col-md-offset-1');
          // $(s[0]).addClass('col-md-offset-3');
           var ids=s[0].getElementsByTagName("h3")[0].innerHTML.toLowerCase().split(" ");
           var sid=ids[ids.length-1];
           $("#"+sid).css("height",document.documentElement.clientHeight-200);
           s[0].getElementsByTagName("i")[2].className="icon-share-alt";
           $("#"+sid).highcharts().reflow();
          }
          }
          
          /*lm 在home界面改变折线颜色和单位间隔以及更新频率~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
          //如何在modal中添加立即显示的函数,答案：show.bs.modal
  $(function() {
  	$("#psModal").on('show.bs.modal', function(e) {
  		var color1 = '#238E23';
  		var color2 = '#00BFFF';
  		var color3 = '#FF8000';
  		if ($.cookie("frequency")) {
  			var obj, index;
  			for (var i = 1; i <= 4; i++) {
  				obj = $("#collapse" + i)[0].getElementsByTagName('select')[2];//就是对应的频率和单位的选择
  				index = JSON.parse($.cookie("frequency")).length; // ��ţ�ȡ��ǰѡ��ѡ������
  				obj.options[index].selected = true;
  				obj = $("#collapse" + i)[0].getElementsByTagName('select')[3];
  				index = JSON.parse($.cookie("frequency")).unit; // ��ţ�ȡ��ǰѡ��ѡ������
  				obj.options[index].selected = true;
  			}
  		} else {
  			$.cookie("frequency", '{"length":2,"unit":0,"value":3}');//默认出事频率是3s
  		}
  		if ($.cookie("consv")) {
  			color1 = JSON.parse($.cookie("consv")).color;
  			var obj, index;
  			obj = $("#collapse1")[0].getElementsByTagName('select')[0];
  			index = JSON.parse($.cookie("consv")).length; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  			disable(obj, $(obj).find("option:selected").text());
  			obj = $("#collapse1")[0].getElementsByTagName('select')[1];
  			index = JSON.parse($.cookie("consv")).unit; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  		} else {
  			$.cookie("consv", '{"color":"#238E23","length":1,"unit":1}');
  		}
  		if ($.cookie("consp")) {
  			color2 = JSON.parse($.cookie("consp")).color;
  			var obj, index;
  			obj = $("#collapse2")[0].getElementsByTagName('select')[0];
  			index = JSON.parse($.cookie("consp")).length; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  			disable(obj, $(obj).find("option:selected").text());
  			obj = $("#collapse2")[0].getElementsByTagName('select')[1];
  			index = JSON.parse($.cookie("consp")).unit; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  		} else {
  			$.cookie("consp", '{"color":"#00BFFF","length":1,"unit":1}');
  		}
  		if ($.cookie("utilization")) {
  			var obj, index;
  			obj = $("#collapse3")[0].getElementsByTagName('select')[0];
  			index = JSON.parse($.cookie("utilization")).length; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  			disable(obj, $(obj).find("option:selected").text());
  			obj = $("#collapse3")[0].getElementsByTagName('select')[1];
  			index = JSON.parse($.cookie("utilization")).unit; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  		} else {
  			$.cookie("utilization", '{"length":1,"unit":1}');
  		}
  		if ($.cookie("traffic")) {
  			color3 = JSON.parse($.cookie("traffic")).color;
  			var obj, index;
  			obj = $("#collapse4")[0].getElementsByTagName('select')[0];
  			index = JSON.parse($.cookie("traffic")).length; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  			disable(obj, $(obj).find("option:selected").text());
  			obj = $("#collapse4")[0].getElementsByTagName('select')[1];
  			index = JSON.parse($.cookie("traffic")).unit; // ��ţ�ȡ��ǰѡ��ѡ������
  			obj.options[index].selected = true;
  		} else {
  			$.cookie("traffic", '{"color":"#FF8000","length":1,"unit":1}');
  		}
  		$("#color1").spectrum({
  			color : color1,
  			preferredFormat : "hex",
  			showInput : true,
  			showPalette : true,
  		});
  		$("#color2").spectrum({
  			color : color2,
  			preferredFormat : "hex",
  			showInput : true,
  			showPalette : true,
  		});
  		$("#color3").spectrum({
  			color : color3,
  			preferredFormat : "hex",
  			showInput : true,
  			showPalette : true,
  		});
  	})
  })

  //如何在一个模态框中持续运行一个函数：触发调用就好了

  function disable(el, x) {
  	switch (x) {
  	case "3":
  		$(el).parent().next().children('select')[0].options[0].disabled = true;
  		$(el).parent().next().children('select')[0].options[2].disabled = true;
  		$(el).parent().next().children('select')[0].options[3].disabled = true;
  		$(el).parent().next().children('select')[0].options[1].selected = true;
  		break;
  	case "1":
  		$(el).parent().next().children('select')[0].options[0].disabled = true;
  		$(el).parent().next().children('select')[0].options[1].selected = true;
  		$(el).parent().next().children('select')[0].options[1].disabled = false;
  		$(el).parent().next().children('select')[0].options[2].disabled = false;
  		$(el).parent().next().children('select')[0].options[3].disabled = false;
  		break;
  	case "5":
  		$(el).parent().next().children('select')[0].options[1].disabled = true;
  		$(el).parent().next().children('select')[0].options[2].disabled = true;
  		$(el).parent().next().children('select')[0].options[3].disabled = true;
  		$(el).parent().next().children('select')[0].options[0].selected = true;
  		break;
  	case "30":
  		$(el).parent().next().children('select')[0].options[1].disabled = true;
  		$(el).parent().next().children('select')[0].options[2].disabled = true;
  		$(el).parent().next().children('select')[0].options[3].disabled = true;
  		$(el).parent().next().children('select')[0].options[0].selected = true;
  		break;
  	}
  }

  function saveSetting(el) {
  	var color1 = $("#color1").spectrum("get");
  	var color2 = $("#color2").spectrum("get");
  	var color3 = $("#color3").spectrum("get");
  	$
  			.confirm({
  				'title' : '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Modify Confirmation',
  				'message' : 'You are about to modify this item. <br />The prevous status cannot be restored at a later time! Continue?',
  				'buttons' : {
  					'Yes' : {
  						'class' : 'blue',
  						'action' : function() {
  							
//  							/*清除缓存*/
//  							var chart1 = $("#saving").highcharts();
//  							var chart2 = $("#traffic").highcharts();
//  							var chart3 = $("#consumption").highcharts();
//  							var chart4 = $("#utilization").highcharts();
//  							if(chart1)
//  							chart1.series=null;
//  							if(chart2)
//  							chart2.series=null;
//  							if(chart3)
//  							chart3.series=null;
//  							if(chart4)
//  							chart4.series=null;
  							
  							
  							
  							pauseSimulation();/*暂停*/
  							var index = new Array(8);
  							var obj, sid;
  							for (var i = 1; i < 8; i += 2) {
  								sid = "#collapse" + ((i + 1) / 2);
  								obj = $(sid)[0].getElementsByTagName('select')[0];
  								index[i - 1] = obj.selectedIndex; //��ţ�ȡ��ǰѡ��ѡ������
  								obj = $(sid)[0].getElementsByTagName('select')[1];
  								index[i] = obj.selectedIndex; //��ţ�ȡ��ǰѡ��ѡ������
  							}
  							obj = $("#collapse2")[0]
  									.getElementsByTagName('select')[2];
  							var a = obj.selectedIndex; //��ţ�ȡ��ǰѡ��ѡ������
  							var valuea = obj[obj.selectedIndex].text;
  							obj = $("#collapse2")[0]
  									.getElementsByTagName('select')[3];
  							var b = obj.selectedIndex; //��ţ�ȡ��ǰѡ��ѡ������
  							$.cookie("consv", '{"color":"' + color1
  									+ '","length":' + index[0] + ',"unit":'
  									+ index[1] + '}');
  							$.cookie("consp", '{"color":"' + color2
  									+ '","length":' + index[2] + ',"unit":'
  									+ index[3] + '}');
  							$.cookie("utilization", '{"length":' + index[4]
  									+ ',"unit":' + index[5] + '}');
  							$.cookie("traffic", '{"color":"' + color3
  									+ '","length":' + index[6] + ',"unit":'
  									+ index[7] + '}');
  							$.cookie("frequency", '{"length":' + a + ',"unit":'
  									+ b + ',"value":' + valuea + '}');
  							//window.location.href = "index.html?consv="+color1+"&consp="+color2+"&flow="+color3;
  							//window.location.href = "index.html";
  							//加一个判断，
  							drawChart(
  									"matrix.json",
  									"traffic",
  									[ JSON.parse($.cookie("traffic")).color ],
  									"line",
  									unit[JSON.parse($.cookie("traffic")).length][JSON
  											.parse($.cookie("traffic")).unit],
  									2);/*画traffic，（file,render_to,color,type,number,index）*/
  							drawChart("energy.json", "consumption", [
  									JSON.parse($.cookie("consp")).color,
  									'#058DC7' ], "line", unit[JSON.parse($
  									.cookie("consp")).length][JSON.parse($
  									.cookie("consp")).unit], 0, "energyNoUsing.json");/*画consumption*/
  							drawChart("linkutil.json", "utilization", [
  									'#058DC7', '#50B432', '#ED561B', '#DDDF00',
  									'#24CBE5', '#64E572', '#FF9655', '#FFF263',
  									'#6AF9C4', '#EE82EE', '#FF00FF', '#0000CD',
  									'#8A2BE2' ], "area", unit[JSON.parse($
  									.cookie("utilization")).length][JSON
  									.parse($.cookie("utilization")).unit], 3);/*画utilization*/
  							switch (unit[JSON.parse($.cookie("consv")).length][JSON
  	       									.parse($.cookie("consv")).unit]) {
  	       							case 12:
  	       								aver = 1;/*终于找到aver，这个是x轴单位时间跨度为五分钟（5分钟共收集12个点），实际运行为3秒，图上共显示12个点*/
  	       								break;
  	       							case 72:
  	       								aver = 6;/*x轴单位时间跨度为30分钟 ，共显示72个点*/
  	       								break;
  	       							case 144:
  	       								aver = 12;/*x轴单位时间跨度1小时，共显示144个点*/
  	       								break;
  	       							case 288:
  	       								aver = 36;/*x轴单位时间跨度3小时，共显示288个点*/
  	       								break;
  	       							case 2016:
  	       								aver = 288;/*x轴单位时间跨度1天，共显示2016个点*/
  	       								break;
  	       							case 1:
  	       								aver = 2016;/*时间单位跨度为一周*/
  	       								break;
  	       							}
  						    drawChart("saving.json","saving",[JSON.parse($.cookie("consv")).color],"column",unit[JSON.parse($.cookie("consv")).length][JSON.parse($.cookie("consv")).unit],1);//draw saving

  					
  							

//  							fetchChart("consumption", 0, unit[JSON.parse($
//  									.cookie("consp")).length][JSON.parse($
//  									.cookie("consp")).unit]);
//  							fetchChart("traffic", 2, unit[JSON.parse($
//  									.cookie("traffic")).length][JSON.parse($
//  									.cookie("traffic")).unit]);
//  							fetchChart("utilization", 3, unit[JSON.parse($
//  									.cookie("utilization")).length][JSON
//  									.parse($.cookie("utilization")).unit]);
  							
  						
  //saving
//  							switch (unit[JSON.parse($.cookie("consv")).length][JSON
//  									.parse($.cookie("consv")).unit]) {
//  							case 12:
//  								aver = 1;/*终于找到aver，这个是x轴单位时间跨度为五分钟（5分钟共收集12个点），实际运行为3秒，图上共显示12个点*/
//  								break;
//  							case 72:
//  								aver = 6;/*x轴单位时间跨度为30分钟（6个五分钟，一共30分钟） ，共显示72个点*/
//  								break;
//  							case 144:
//  								aver = 12;/*x轴单位时间跨度1小时，共显示144个点*/
//  								break;
//  							case 288:
//  								aver = 36;/*x轴单位时间跨度3小时，共显示288个点*/
//  								break;
//  							case 2016:
//  								aver = 288;/*x轴单位时间跨度1天，共显示2016个点*/
//  								break;
//  							case 1:
//  								aver = 2016;/*时间单位跨度为一周*/
//  								break;
//  							}
//  							sclock=aver;
//  				            track=aver;
//  							 if((clock+1)%aver===0){
//  								 fetchSChart("saving",1,unit[JSON.parse($.cookie("consv")).length][JSON.parse($.cookie("consv")).unit]);
//  								 console.log("huatu");
//  								 if(sclock%(total+1)==2016) sclock+=1;
//  								 sclock+=aver;
//  								 track+=aver;
//  								 btn[1]=0;
//  							 }
  							$('#psModal').modal('hide');
  							startSimulation();

  						}
  					},
  					'No' : {
  						'class' : 'gray',
  						'action' : function() {
  						} // Nothing to do in this case. You can as well omit the action property.
  					}
  				}
  			});
  	//var sdes=document.forms[3].description.value;
  	//var sstart=document.forms[4].start.value;
  	//var send=document.forms[5].end.value;
  }

  function quitSetting(el) {
  	$
  			.confirm({
  				'title' : '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Cancel Confirmation',
  				'message' : 'You are about to cancel this item. <br />It cannot be restored at a later time! Continue?',
  				'buttons' : {
  					'Yes' : {
  						'class' : 'blue',
  						'action' : function() {
  							//window.location.href = "index.html";
  							$('#psModal').modal('hide');
  						}
  					},
  					'No' : {
  						'class' : 'gray',
  						'action' : function() {
  						} // Nothing to do in this case. You can as well omit the action property.
  					}
  				}
  			});
  
}