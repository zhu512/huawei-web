 var clock=0;
 var sclock=0;
 var track = 0;
 var stop=[0,0,0,0,0,0,0];
 var update_enable=[0,0,0,0,0,0,0,0];
 var update=0;
 var cur=[0,0,0,0,0,0,0];
 var total=2016;
 var btn=[0,0,0,0,0,0,0,0];
 function createDialog(){
	 if($( "#operationdialog" ).css("display")=="none"){
		 $( "#operationdialog" ).css("display","block");
		 $( "#operationdialog" ).draggable();
	 } else{
		 $( "#operationdialog" ).css("display","none");
	 }
 }
 function startSimulation(){
	for(var i = 0; i<7;i++){
		if(cur[i]<stop[i]) return;
	}
	update_enable=[1,1,1,1,1,1,1,1];
	update=1;
	$("#play-button").attr("disabled",true);
	$("#pause-button").attr("disabled",false);
	$("#stop-button").attr("disabled",true);
 }
 function countTimer(){
		var tick=5*clock+5;
		if(tick<10)
		$('#timer').html("00:0"+tick);
		else if(tick>=10&&tick<60)
		$('#timer').html("00:"+tick);
		else if(tick>=60){
			var a=Math.floor(tick/60);
			var c="";
			if(a>=24){
			    c=Math.floor(a/24);
				a=a%24;
			}
			var b=tick%60;
			var tmpa= a<10? '0'+a:a;
			var tmpb=  b<10? '0'+b:b;
			c > 0 ? (c > 1 ?$('#timer').html(c+"days"+tmpa+":"+tmpb):$('#timer').html(c+"day"+tmpa+":"+tmpb)):$('#timer').html(tmpa+":"+tmpb);

		} 
 }
 function pauseSimulation(){
	 
	$("#play-button").attr("disabled",false);
	$("#pause-button").attr("disabled",true);
	$("#stop-button").attr("disabled",true); 
	update_enable=[0,0,0,0,0,0,0];
	update=0;
 }
 function stopSimulation(){
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
 function refreshData(dir,number,id,index){
	 var time=number*5*60*1000;
	time= dir==1?time:-time;
	var name=$("#"+id).highcharts();
	var data=json_parse(localStorage.getItem(id));
		            var start=[];
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

	    			cur[index]+=number*dir;            
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
 function displayHistory(el,number,index,dir){
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
 function drawChart(file,render_to,color,type,number,index,file2){
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
	var gap = computeAver(number);
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
        	shared: true ,	
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
                    color: '#000000'
                }
            },
			dateTimeLabelFormats: {
				millisecond: '%H:%M:%S.%L',
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%e. %m',
				week: '%e. %m',
				month: '%m \'%y',
				year: '%Y'
			}
			
		},
		yAxis: {
			title: {
				text: text,
                style: {
                    color: '#000000'
                }
			},
            labels: {
                enabled:flag,
                style: {
                    color: '#000000'
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
		
		localStorage.setItem(render_to,JSON.stringify(data));
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
		if(rec+multi>number)
			$("#"+render_to).find("button").first().attr("disabled",false);
		chart.redraw();	
		chart=null;
		 options = null;
		});
	 
   $.ajaxSettings.async = true;
 }
 
 
 function fetchChart(render_to,index,number){
		var chart = $("#"+render_to).highcharts();
		btn[index]=1;
		if(chart){
		chart.yAxis[0].stacks.area = null;
		var series = chart.series;
		var data=json_parse(localStorage.getItem(render_to));
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
		chart.yAxis[0].stacks.area = null;
		var series = chart.series;
		var data=json_parse(localStorage.getItem(render_to));
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
          function drawTopo(lfile,rfile,number){
        	var q=stage.width;
        	ps=['(SEAT)','(SALT)','(KANS)','(CHIC)','(NEWY)','(WASH)','(ATLA)','(HOUS)','(LOSA)']
        	energyNodes=[];
        	nodes=[];
        	wrapnodes=[];
            for(var i=0; i<9; i++){
            addNode("DUT"+(i+1)+ps[i],pos[i].x*q,pos[i].y*stage.height);
            addEnergyNode("100%",pos[i].x*q+20,pos[i].y*stage.height+22);
            addFillNode(pos[i].x*q+20,pos[i].y*stage.height+22);
            /*if(i==2){
            	addNode("DUT3(KANS)",pos[i].x*q,pos[i].y*stage.height);//修改ＤＵＴ（ｉ）为ＤＵＴ（ｉ）ＫＡＮＳ．
                addEnergyNode("100%",pos[i].x*q+20,pos[i].y*stage.height+22);
                addFillNode(pos[i].x*q+20,pos[i].y*stage.height+22);
                }*/
           
            }//下面做的相应修改。
            newLink(stage.find('node[text="DUT1(SEAT)"]')[0],stage.find('node[text="DUT2(SALT)"]')[0],"10");
            newLink(stage.find('node[text="DUT1(SEAT)"]')[0],stage.find('node[text="DUT9(LOSA)"]')[0],"1");//
            newLink(stage.find('node[text="DUT2(SALT)"]')[0],stage.find('node[text="DUT3(KANS)"]')[0],"6");
            newLink(stage.find('node[text="DUT2(SALT)"]')[0],stage.find('node[text="DUT9(LOSA)"]')[0],"8");
            newLink(stage.find('node[text="DUT3(KANS)"]')[0],stage.find('node[text="DUT4(CHIC)"]')[0],"4");
            newLink(stage.find('node[text="DUT3(KANS)"]')[0],stage.find('node[text="DUT8(HOUS)"]')[0],"12");//
            newLink(stage.find('node[text="DUT4(CHIC)"]')[0],stage.find('node[text="DUT5(NEWY)"]')[0],"11");
            newLink(stage.find('node[text="DUT4(CHIC)"]')[0],stage.find('node[text="DUT6(WASH)"]')[0],"0");//
            newLink(stage.find('node[text="DUT4(CHIC)"]')[0],stage.find('node[text="DUT7(ATLA)"]')[0],"5");//
            newLink(stage.find('node[text="DUT5(NEWY)"]')[0],stage.find('node[text="DUT6(WASH)"]')[0],"9");
            newLink(stage.find('node[text="DUT6(WASH)"]')[0],stage.find('node[text="DUT7(ATLA)"]')[0],"2");
            newLink(stage.find('node[text="DUT7(ATLA)"]')[0],stage.find('node[text="DUT8(HOUS)"]')[0],"3");
            newLink(stage.find('node[text="DUT8(HOUS)"]')[0],stage.find('node[text="DUT9(LOSA)"]')[0],"7");
			if(btn[7]) {
				  var Ctime = clock;
				} else {
				    Ctime = clock-1;
				}
            var url;
            url="./files/"+lfile+"?id="+new Date().getTime() ;
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
            url="./files/"+rfile+"?id="+new Date().getTime() ;
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
                node.fontColor = '#000000';
                node.setLocation(x, y);
                node.setImage('./images/router.png', true);
                node.textPosition = 'Bottom_Center';
                scene.add(node);
                
                node.mouseover(function(event){
                var url="./files/cardstatus" ;
                newtext =text.substring(0,3);
                url=url+newtext+".json";
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
        				var flag = true;
    					
    					for(var j=0;j<data["series"][clock%number][i]["data"].length;j++){
    						if(data["series"][clock%number][i]["data"][j]==1){
    							flag = false;
								$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :on<br/>";
    						}
    						else if(data["series"][clock%number][i]["data"][j]==0||data["series"][clock%number][i]["data"][j]==2){
    							if(data["series"][clock%number][i]["data"][j]==0) flag = false;
								$("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+",Card "+j+" :off<br/>";

    						}
    						}
                            if(flag)
                            $("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+" :off<br/>";
                            else
                            $("#contextmenu")[0].innerHTML+="Slot "+data["series"][clock%number][i]["slot"]+" :on<br/>";
                            	
    					}
                	data = null;
    				}
    						
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
            defaultNode.textOffsetY = -35;
            defaultNode.textOffsetX = 5;
            defaultNode.font ="8px";
            defaultNode.fontColor ="255,0,0";
            defaultNode.setLocation(x, y); 
            defaultNode.setSize(30, 10);  
            defaultNode.borderRadius = 3; 
            //defaultNode.borderWidth = 2;
            //defaultNode.borderColor = '250,250,250';  
            defaultNode.fillColor="0,128,0";
            //defaultNode.alpha = 0.4;
            scene.add(defaultNode);
            wrapnodes.push(defaultNode);
            return defaultNode;
           }
            function addFillNode(x,y){
            var defaultNode = new JTopo.Node(); 
            defaultNode.setLocation(x, y); 
            defaultNode.setSize(30, 10); 
            defaultNode.borderRadius = 3; 
            defaultNode.fillColor="255,128, 0";
            //defaultNode.borderColor ="0,128,0"; 
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
          function fetchTopo(lfile,rfile,number){
        	  btn[7]=1;
        	  if(stage){
			 if(update_enable[7] == 0)
				 return;
              var ldata,rdata,link,i;
          	   ldata=json_parse(localStorage.getItem(lfile.split('.')[0]));
               link=stage.find("link");
               for(i=0;i<link.length;i++){
               link[i].strokeColor='0,255,0';
               }
            	for(i=0;i<ldata["series"][clock%number]["data"].length;i++){
                      var tmp=ldata["series"][clock %number]["data"][i].toString();
                      link=scene.findElements(function(e){return e.flag==tmp; });
                      link[0].strokeColor='255,0,0';
                  }
            	ldata = null;
           	   rdata=json_parse(localStorage.getItem(rfile.split('.')[0]));
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
            	rdata = null;
        	  }
              }
          function fetchData(){
	 			 if(update===0)
	 	 			 return;//这里是什么作用
	 	 			 fetchChart("consumption",0,unit[json_parse($.cookie("power")).length][json_parse($.cookie("power")).unit]);
	 	 			 fetchChart("traffic",2,unit[json_parse($.cookie("network")).length][json_parse($.cookie("network")).unit]);
	 	 			 fetchChart("utilization",3,unit[json_parse($.cookie("link")).length][json_parse($.cookie("link")).unit]);
	 	 			 fetchChart("delay",4,288);
	 	 			 fetchChart("jitter",5,288);
	 	 			 fetchChart("loss",6,288);
	 	             fetchTopo("turnofflinks.json","deviceratio.json",total);
	 	 			 if((clock+1)%aver===0){
	 	 				 fetchSChart("saving",1,unit[json_parse($.cookie("energy")).length][json_parse($.cookie("energy")).unit]);
	 	 				 if(sclock%(total+1)==2016) sclock+=1;
	 	 				 sclock+=aver;
	 	 				 track+=aver;
	 	 				 btn[1]=0;
	 	 			 }
	 	 			//Highcharts.charts = null;
	 	 			 countTimer();
	 	 			 clock = clock + 1;
	 	 			 for(var i=0;i<btn.length;i++){
	 	 				 if(i!=1)
	 	 					 btn[i]=0; 
	 	 			 }

	 	 		    }
          function init() {
      	    timer = setInterval(function() {
      	    	fetchData();
      	        clearInterval(timer);
      	        init();                
      	    }, frequency);
      	}
         //dom loaded
          var swidth,childrenarr,frequency=0,aver=1,timer,stage,scene;
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
             stage = new JTopo.Stage(canvas); 
             scene = new JTopo.Scene();
             scene.background = "./images/topo.jpg";
             stage.add(scene);
        	 if(!$.cookie("frequency")){//与上面类似
         	    $.cookie("frequency",'{"length":2,"unit":0,"value":3}');
         	  }
             if($.cookie("energy")){
                modifySetting("energy");
             }else {
             	$.cookie("energy",'{"color":"#238E23","length":1,"unit":1}');
             }
             if($.cookie("power")){
                 modifySetting("power");
             } else {
             	$.cookie("power",'{"color":"#00BFFF","length":1,"unit":1}');
             }
             if($.cookie("link")){
                 modifySetting("link");
             } else {
             	$.cookie("link",'{"length":1,"unit":1}');
             }
             if($.cookie("network")){
                 modifySetting("network");
             } else {
             	$.cookie("network",'{"color":"#FF8000","length":1,"unit":1}');
             }
        	 frequency=timeChange(json_parse($.cookie("frequency")));    	    
             aver = computeAver(unit[json_parse($.cookie("energy")).length][json_parse($.cookie("energy")).unit]);
             sclock=aver;
             track=aver;//初始化四张图
             $("#color1").spectrum({
             	 color: json_parse($.cookie("power")).color,
                 preferredFormat: "hex",
                 showInput: true,
                 showPalette: true,
             });
             $("#color2").spectrum({
             	 color: json_parse($.cookie("network")).color,
                 preferredFormat: "hex",
                 showInput: true,
                 showPalette: true,
             });
             $("#color3").spectrum({
             	 color:json_parse($.cookie("energy")).color,
                 preferredFormat: "hex",
                 showInput: true,
                 showPalette: true,
             });
             drawTopo("turnofflinks.json","deviceratio.json",total);
        	 drawChart("matrix.json","traffic",[json_parse($.cookie("network")).color],"line",unit[json_parse($.cookie("network")).length][json_parse($.cookie("network")).unit],2);
        	 drawChart("energy.json","consumption",[json_parse($.cookie("power")).color,'#058DC7'],"line",unit[json_parse($.cookie("power")).length][json_parse($.cookie("power")).unit],0,"energyNoUsing.json");
             drawChart("linkutil.json","utilization",['#058DC7', '#50B432', '#ED561B','#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#EE82EE','#FF00FF','#0000CD','#8A2BE2'],"area",unit[json_parse($.cookie("link")).length][json_parse($.cookie("link")).unit],3);
        	 $( "#timer" ).css("display","block");//块元素的感觉。
        	 $( "#timer" ).draggable();
			  init();
			  canvas = null;
			
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
            $(".modal-content").on("click",".layout-three",function(){
             var modalContent = $("#modal-content"),modalItems = [];
             modalItems = [].slice.call(modalContent[0].getElementsByTagName("div"),0);
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
            modalContent = null;
            modalItems = null;
            frag = null;
        });
         $(".modal-content").on("click",".layout-two",function(){
            var modalContent = $("#modal-content"),modalItems = [];
            modalItems = [].slice.call(modalContent[0].getElementsByTagName("div"),0);
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
            modalContent = null;
            modalItems = null;
            frag = null;
        });
        
        //remove some portal
          $("#modal-content").on("click",".icon-minus",function(){
              var ids=$(this).parent().prev()[0].innerHTML.toLowerCase().split(" ");
              var id=ids[ids.length-1];
              var index=commonFun(id).index;
              var mainContent,mainItems = [];
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
            mainContent = mainItems = null;
          });
          
          
          $("#modal-content").on("click",".icon-plus",function(){
          var mainContent,mainItems = [];
          mainContent= $(".row-fluid");
          mainItems = [].slice.call(mainContent[0].getElementsByTagName("div"),0);
          $(this).removeClass("icon-plus");
          $(this).addClass("icon-minus");
          l=mainItems.length;
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
          i3.className="icon-fullscreen";
          div3.appendChild(i3);
          var ids = h.innerHTML.toLowerCase().split(" ");
          var eid = ids[0];
          var sid = ids[ids.length-1];
          if(sid!="topology"){
              var i4=document.createElement("i");
              i4.className="icon-refresh";
              div3.appendChild(i4);  
          }
          if(sid == "consumption" || sid == "saving" || sid == "traffic" || sid == "utilization"){
              var i5=document.createElement("i");
              i5.className="icon-cog";
              i5.setAttribute("data-toggle","modal") ;
              i5.setAttribute("data-target","#"+eid); 
              i5.setAttribute("data-backdrop","false");
              div3.appendChild(i5); 
        	  
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
         // for(var i=0;i<2;i++ )
         // div5.appendChild(document.createElement("p"));
          div4.appendChild(div5);
          div4.appendChild(canvas);
          div5 = null;
          }
          else {
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
          stage = new JTopo.Stage(canvas); 
          scene = new JTopo.Scene();
          scene.background = "./images/topo.jpg";
          stage.add(scene);
          drawTopo("turnofflinks.json","deviceratio.json",total);
          }
         else if(sid=="consumption"){
        	 drawChart("energy.json","consumption",[json_parse($.cookie("power")).color,'#058DC7'],"line",unit[json_parse($.cookie("power")).length][json_parse($.cookie("power")).unit],0,"NoUsing.json");
         }
         else if(sid=="saving"){ 
         	 drawChart("saving.json","saving",[json_parse($.cookie("energy")).color],"column",unit[json_parse($.cookie("energy")).length][json_parse($.cookie("energy")).unit],1);
         } 
         else if(sid=="utilization"){
          canvas=document.getElementById("utilization"); 
          drawChart("linkutil.json","utilization",['#058DC7', '#50B432', '#ED561B','#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#EE82EE','#FF00FF','#0000CD','#8A2BE2'],"area",unit[json_parse($.cookie("link")).length][json_parse($.cookie("link")).unit],3);
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
        	 drawChart("matrix.json","traffic",[json_parse($.cookie("network")).color],"line",unit[json_parse($.cookie("network")).length][json_parse($.cookie("network")).unit],2);
            } 
		  mainContent = mainItems = frag = canvas = div1 = div2 = div3 = div4 = i1 = i2 = i3 = h = null;
          });
          
          
          
          
          
          $(".main").on("click",".icon-remove",function(){
              var modalContent = $("#modal-content"),modalItems = [];
              modalItems = [].slice.call(modalContent[0].getElementsByTagName("div"),0);
          var ids=$(this).prevAll("h3")[0].innerHTML.toLowerCase().split(" ");
           var id=ids[ids.length-1];
           var index=commonFun(id).index;
           $(this).parents(".col-md-6")[0] ? $(this).parents(".col-md-6").remove():$(this).parents(".col-md-10").remove(); 
           for(var i= 0;i<modalItems.length;i++){
                if($(this).prev("h3")[0].innerHTML.trim()===modalItems[i].getElementsByTagName("dt")[0].innerHTML.trim()) {
                 modalItems[i].getElementsByTagName("a")[0].className="icon-plus";
                }
            }
           modalContent = modalItems =null;
          });
          
          
          
          
          
          
          $(".main").on("click",".icon-fullscreen",function(){
        	  var arr=[];
        	  childrenarr=[];
              var mainContent,mainItems = [],modalContent = $("#modal-content"),modalItems = [];
              modalItems = [].slice.call(modalContent[0].getElementsByTagName("div"),0);
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
               // $(this).removeClass("icon-fullscreen");
              //  $(this).addClass("icon-resize-small");
                for(var i= 0;i<modalItems.length;i++){
                    if($(this).prevAll("h3")[0].innerHTML.trim()!=modalItems[i].getElementsByTagName("dt")[0].innerHTML.trim()) {
                     modalItems[i].getElementsByTagName("a")[0].className="icon-plus";
                    }
                }
                mainContent = mainItems = modalContent = modalItems = null;
               });
          
          
          
          
          $(".main").on("click",".icon-resize-small",function(){
              var mainContent,mainItems = [],modalContent = $("#modal-content"),modalItems = [];
        	  mainContent= $(".row-fluid");
        	  mainItems = [].slice.call(mainContent[0].getElementsByTagName("div"),0);
              modalItems = [].slice.call(modalContent[0].getElementsByTagName("div"),0);
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
                $(this).removeClass("icon-resize-small");
                $(this).addClass("icon-fullscreen");
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
              mainContent = mainItems =  modalContent = modalItems = frag = null;
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
       		var data=json_parse(localStorage.getItem(id));
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
          
          $(".modal").on("click",".modify-button",function(){
        	  var sid = $(this).parents(".modal")[0].id;
        	  if($(this).parent().prev().find("input")[0])
        	  var color = $(this).parent().prev().find("input")[0].id;
        	  saveSetting(color,sid);
          });
          $(".modal").on("click",".nosaving",function(){
        	  var sid = $(this).parents(".modal")[0].id;
        	  modifySetting(sid);
          });
          
          $(".flag").on("change","select",function(){
        		for(var i=0;i<4;i++){
        			$(this).parent().next().children('select')[0].options[i].disabled=false;
        		}
        		disable(this,$(this).find("option:selected").text());
        	});
          $(".fre").on("change","select",function(){
        	  var arr = ["power","link","network","energy"];
        		for(var i=0;i<arr.length;i++){
        			if($(this).parent().next()[0]){
        				$("#"+arr[i]).find('.fre').find("select")[0].options[$(this).find("option:selected").index()].selected=true;
        				$("#"+arr[i]).find('.fre').find("select")[1].options[$(this).parent().next().find('select').find("option:selected").index()].selected=true;
        			}
        			else if($(this).parent().prev()[0]){
        				$("#"+arr[i]).find('.fre').find("select")[1].options[$(this).find("option:selected").index()].selected=true;
        				$("#"+arr[i]).find('.fre').find("select")[0].options[$(this).parent().prev().find('select').find("option:selected").index()].selected=true;
        			}

        		}
        	});
          
          function disable(el,x){
        	  switch(x){
        	  case "3":
        		  $(el).parent().next().children('select')[0].options[0].disabled=true;
        		  $(el).parent().next().children('select')[0].options[2].disabled=true;
        		  $(el).parent().next().children('select')[0].options[3].disabled=true;
        		  $(el).parent().next().children('select')[0].options[1].selected=true;
        		  break;
        	  case "1":
        		  $(el).parent().next().children('select')[0].options[0].disabled=true;
        		  $(el).parent().next().children('select')[0].options[1].selected=true;
        		  break;
        	  case "5":
        		  $(el).parent().next().children('select')[0].options[1].disabled=true;
        		  $(el).parent().next().children('select')[0].options[2].disabled=true;
        		  $(el).parent().next().children('select')[0].options[3].disabled=true;
        		  $(el).parent().next().children('select')[0].options[0].selected=true;
        		  break;
        	  case "30":
        		  $(el).parent().next().children('select')[0].options[1].disabled=true;
        		  $(el).parent().next().children('select')[0].options[2].disabled=true;
        		  $(el).parent().next().children('select')[0].options[3].disabled=true;
        		  $(el).parent().next().children('select')[0].options[0].selected=true;
        		  break;
        	  }
            }
          function commonFun(id){
          	switch(id){
          	case "traffic":
          		return{
          		index : 2,
          		number : unit[json_parse($.cookie("network")).length][json_parse($.cookie("network")).unit]
          	};
       		 break;
             case "saving":
            	 return{
           		index : 1,
           		number : unit[json_parse($.cookie("energy")).length][json_parse($.cookie("energy")).unit]
           	};
       		 break;
             case "consumption":
                 return{
            		index : 0,
            		number : unit[json_parse($.cookie("power")).length][json_parse($.cookie("power")).unit]
            	};
       		 break;
             case "utilization":
                 return{
            		index : 3,
            		number :  number=unit[json_parse($.cookie("link")).length][json_parse($.cookie("link")).unit]
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
          s[0].getElementsByTagName("i")[2].className="icon-resize-small";
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
           s[0].getElementsByTagName("i")[2].className="icon-resize-small";
           $("#"+sid).highcharts().reflow();
          }
          }
                    
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
          function computeAver(x){
     		 switch(x){
    		 case 12:
    			 return 1;
    			 break;
    		 case 72:
    			 return 6;
    			 break;
    		 case 144:
    			 return 12;
    			 break;
    		 case 288:
    			 return 36;
    			 break;
    		 case 2016:
    			 return 288;
    			 break;
    		 case 1:
    			 return 2016;
    			 break;
    			 
    		 }
          }
          function modifySetting(id){
           	var obj,index;
 			obj=$("#"+id)[0].getElementsByTagName('select')[0];
 		    index=json_parse($.cookie(id)).length; //序号，取当前选中选项的序号
 		    obj.options[index].selected=true;
 			disable(obj,$(obj).find("option:selected").text());
 			obj=$("#"+id)[0].getElementsByTagName('select')[1];
 		    index=json_parse($.cookie(id)).unit; //序号，取当前选中选项的序号
 		    obj.options[index].selected=true;
			obj=$("#"+id)[0].getElementsByTagName('select')[2];
		    index=json_parse($.cookie("frequency")).length; //序号，取当前选中选项的序号
		    obj.options[index].selected=true;
			obj=$("#"+id)[0].getElementsByTagName('select')[3];
		    index=json_parse($.cookie("frequency")).unit; //序号，取当前选中选项的序号
		    obj.options[index].selected=true;
		    obj = null;
          }
          function saveSetting(color,id){
        	  if(color)
        		var color= $("#"+color).spectrum("get");
        		$.confirm({
        			'title'		: '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Modify Confirmation',
        			'message'	: 'You are about to modify this item. <br />The prevous status cannot be restored at a later time! Continue?',
        			'buttons'	: {
        				'Yes'	: {
        					'class'	: 'blue',
        					'action': function(){
        						var index=new Array(2);
        						var obj;
        						obj=$("#"+id)[0].getElementsByTagName('select')[0];
        					    index[0]=obj.selectedIndex; //序号，取当前选中选项的序号
        						obj=$("#"+id)[0].getElementsByTagName('select')[1];
        					    index[1]=obj.selectedIndex; //序号，取当前选中选项的序号
                                
        						obj=$("#"+id)[0].getElementsByTagName('select')[2];
        					    var a=obj.selectedIndex; //序号，取当前选中选项的序号
        					    var valuea=obj[obj.selectedIndex].text;
        						obj=$("#"+id)[0].getElementsByTagName('select')[3];
        						var b=obj.selectedIndex; //序号，取当前选中选项的序号
        						$.cookie(id,'{"color":"'+color+'","length":'+index[0]+',"unit":'+index[1]+'}');
        						$.cookie("frequency",'{"length":'+a+',"unit":'+b+',"value":'+valuea+'}');
        						frequency = timeChange(json_parse($.cookie("frequency")));
        			        	clearInterval(timer);
        			        	var name ;
        			          	switch(id){
        			          	case "power":
            			        	 name=$("#consumption").highcharts();//得到对应的图
             			        	 name.destroy();
                			        drawChart("energy.json","consumption",[json_parse($.cookie("power")).color,'#058DC7'],"line",unit[json_parse($.cookie("power")).length][json_parse($.cookie("power")).unit],0,"energyNoUsing.json");
        			       		 break;
        			             case "link":
             			        	 name=$("#utilization").highcharts();//得到对应的图
             			        	 name.destroy();
        			                 drawChart("linkutil.json","utilization",['#058DC7', '#50B432', '#ED561B','#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#EE82EE','#FF00FF','#0000CD','#8A2BE2'],"area",unit[json_parse($.cookie("link")).length][json_parse($.cookie("link")).unit],3);
        			       		 break;
        			             case "network":
              			        	 name=$("#traffic").highcharts();//得到对应的图
             			        	 name.destroy();
            			        	 drawChart("matrix.json","traffic",[json_parse($.cookie("network")).color],"line",unit[json_parse($.cookie("network")).length][json_parse($.cookie("network")).unit],2);
        			       		 break;
        			             case "energy":
              			        	 name=$("#saving").highcharts();//得到对应的图
             			        	 name.destroy();
            			        	 aver = computeAver(unit[json_parse($.cookie("energy")).length][json_parse($.cookie("energy")).unit]);console.log(clock+","+sclock+","+track);
            			        	 sclock =Math.floor(clock/aver)*aver+aver+Math.floor(clock/total);
            			        	 track = Math.floor(clock/aver)*aver+aver;
            			         	 drawChart("saving.json","saving",[json_parse($.cookie("energy")).color],"column",unit[json_parse($.cookie("energy")).length][json_parse($.cookie("energy")).unit],1);
        			       		 break;
        			        	} 
        			        	init();
        			        	name = null;
        						$('#'+id).modal('hide');
        					}
        				},
        				'No'	: {
        					'class'	: 'gray',
        					'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
        				}
        			}
        		});
        	}