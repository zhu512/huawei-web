var root=window.location.host ;
var tmp;
$(function(){
	  tmp=[];
	$(".ruleTable").dataTable({
		"sPaginationType": "full_numbers",
	      "oLanguage": {//语言设置
	            /*  "sLengthMenu": "每页显示  _MENU_ 条记录",  
	              "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
	              "oPaginate": {
	                  "sFirst": "首页",
	                  "sPrevious": "前一页",
	                  "sNext": "后一页",
	                  "sLast": "尾页"
	                  },*/
	              "sZeroRecords": "Sorry,Not Found",
	              "sInfoEmpty": "No Data"
	            },
	     "bAutoWidth": true,
	  	"bLengthChange": true, //是否启用设置每页显示记录数 
	     "bSort":false,
	     "bProcessing": false, //当datatable获取数据时候是否显示正在处理提示信息。
	    // "bServerSide": true, //客户端处理分页
	     "sAjaxSource": "http://"+root+"/webdemo/servlet/rules?type=5&&"+ new Date().getTime(), //ajax请求地址
	     'bStateSave': true,
	     "fnRowCallback":function(nRow,aData){
	    	 if(aData[5]=="enable"){console.log(nRow)
	    		nRow.style.background="#33CCFF";;
	    	 }
	     },
	     "aoColumns": [{
	                      //"aaData": "Rule Name",
                          "sTitle":"Rule Name",
                          "sDefaultContent":"",
                           "fnRender": function(Obj, sVal) {
                                return '<input type="checkbox" id="s' + Obj.iDataRow + '" title="' + Obj.aData[0] + '" onclick="check(this,'+Obj.iDataRow+')" name="check' + sVal + '" />'+'&nbsp;&nbsp;&nbsp;'+sVal;
                           }
	                  },{
	                      //"aaData": "Description",
                          "sTitle":"Description",
                          "sDefaultContent":""
	                  },{
	                      //"aaData": "Start Time",
                          "sTitle":"Start Time",
                          "sDefaultContent":""
	                  },{
	                      //"aaData": "End Time",
                          "sTitle":"End Time",
                          "sDefaultContent":""
	                  },{
	                      //"aaData": "MaxUtlization",
                          "sTitle":"MaxUtlization",
                          "sDefaultContent":""
	                  },{
	                      //"aaData": "Status",
                          "sTitle":"Status",
                          "sDefaultContent":"",
	                  },{
	                      //"aaData": "Operation",
                          "sTitle":"Operation",
                          "sDefaultContent":"",
                          "fnRender":function(data){
                        	  result='<a class="btn btn-danger" href="javascript:void(0)" id="t'+data.iDataRow+'" onclick="deleteRule(this,'+data.iDataRow+')" name="'+data.iDataRow+'">Delete</a>'
                        	  return result;
                          }
	                  }]
	});
	//var url=root+"webdemo/servlet/rules?type=5&&"+ new Date().getTime();
	//$.get(url);
	//console.log(ruleTable.fnSettings());
    $('#sdatetimepicker').datetimepicker({
        language:  'en',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0,
		minuteStep:1
      });
    $('#edatetimepicker').datetimepicker({
        language:  'en',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0,
		minuteStep:1
      });
    var color1='#238E23';
    var color2='#00BFFF';
    var color3='#FF8000';
    if($.cookie("frequency")){
    	var obj,index;
    	for(var i=1;i<=4;i++){
			obj=$("#collapse"+i)[0].getElementsByTagName('select')[2];
		    index=JSON.parse($.cookie("frequency")).length; //序号，取当前选中选项的序号
		    obj.options[index].selected=true;
			obj=$("#collapse"+i)[0].getElementsByTagName('select')[3];
		    index=JSON.parse($.cookie("frequency")).unit; //序号，取当前选中选项的序号
		    obj.options[index].selected=true;
    	}
    }else {
    	$.cookie("frequency",'{"length":2,"unit":0,"value":3}');
    }
    if($.cookie("consv")){
    	color1=JSON.parse($.cookie("consv")).color;
    	var obj,index;
			obj=$("#collapse1")[0].getElementsByTagName('select')[0];
		    index=JSON.parse($.cookie("consv")).length; //序号，取当前选中选项的序号
		    obj.options[index].selected=true;
			disable(obj,$(obj).find("option:selected").text());
			obj=$("#collapse1")[0].getElementsByTagName('select')[1];
		    index=JSON.parse($.cookie("consv")).unit; //序号，取当前选中选项的序号
		    obj.options[index].selected=true;
    }else {
    	$.cookie("consv",'{"color":"#238E23","length":1,"unit":1}');
    }
    if($.cookie("consp")){
    	color2=JSON.parse($.cookie("consp")).color;
    	var obj,index;
		obj=$("#collapse2")[0].getElementsByTagName('select')[0];
	    index=JSON.parse($.cookie("consp")).length; //序号，取当前选中选项的序号
	    obj.options[index].selected=true;
		disable(obj,$(obj).find("option:selected").text());
		obj=$("#collapse2")[0].getElementsByTagName('select')[1];
	    index=JSON.parse($.cookie("consp")).unit; //序号，取当前选中选项的序号
	    obj.options[index].selected=true;
    } else {
    	$.cookie("consp",'{"color":"#00BFFF","length":1,"unit":1}');
    }
    if($.cookie("utilization")){
    	var obj,index;
		obj=$("#collapse3")[0].getElementsByTagName('select')[0];
	    index=JSON.parse($.cookie("utilization")).length; //序号，取当前选中选项的序号
	    obj.options[index].selected=true;
		disable(obj,$(obj).find("option:selected").text());
		obj=$("#collapse3")[0].getElementsByTagName('select')[1];
	    index=JSON.parse($.cookie("utilization")).unit; //序号，取当前选中选项的序号
	    obj.options[index].selected=true;
    } else {
    	$.cookie("utilization",'{"length":1,"unit":1}');
    }
    if($.cookie("traffic")){
    	color3=JSON.parse($.cookie("traffic")).color;
    	var obj,index;
		obj=$("#collapse4")[0].getElementsByTagName('select')[0];
	    index=JSON.parse($.cookie("traffic")).length; //序号，取当前选中选项的序号
	    obj.options[index].selected=true;
		disable(obj,$(obj).find("option:selected").text());
		obj=$("#collapse4")[0].getElementsByTagName('select')[1];
	    index=JSON.parse($.cookie("traffic")).unit; //序号，取当前选中选项的序号
	    obj.options[index].selected=true;
    } else {
    	$.cookie("traffic",'{"color":"#FF8000","length":1,"unit":1}');
    }
    $("#color1").spectrum({
    	color:color1,
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
    });
    $("#color2").spectrum({
    	color:color2,
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
    });
    $("#color3").spectrum({
    	color:color3,
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
    });
	$("#cr").css("display","none");
	$("#psr").css("display","none");
	$("#ps").css("display","none");
	var hash;
	hash = (!window.location.hash)?"#psr":window.location.hash;
	window.location.hash = hash; 
    $(hash).css("display","block");
    $(".sidebar a").each(function(){
        if($(this).attr("href")==hash){
        	$(this).parent().addClass("active");
        }
  
});
	if(hash=="#cr"){
	//document.forms[0].start.placeholder=new Date().getHours()+":"+new Date().getMinutes();
	//document.forms[0].end.placeholder=new Date().getHours()+":"+new Date().getMinutes();
	document.forms[1].link.value="50";
	$("#form1").validation({icon:true}); 
	}
});
var ruleTable;
$(".flag").on("change","select",function(){
	for(var i=0;i<4;i++){
		$(this).parent().next().children('select')[0].options[i].disabled=false;
	}
	disable(this,$(this).find("option:selected").text());
});
$(".fre").on("change","select",function(){
	for(var i=0;i<8;i+=2){
		if($(this).parent().next()[0]){
			$(".fre").find('select')[i].options[$(this).find("option:selected").index()].selected=true;
			$(".fre").find('select')[i+1].options[$(this).parent().next().find('select').find("option:selected").index()].selected=true;
		}
		else if($(this).parent().prev()[0]){
			$(".fre").find('select')[i+1].options[$(this).find("option:selected").index()].selected=true;
			$(".fre").find('select')[i].options[$(this).parent().prev().find('select').find("option:selected").index()].selected=true;
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
function initDelRules(el){
	$("#cr").css("display","none");
	$("#ps").css("display","none");
	$("#psr").css("display","block");
	$(".active").removeClass("active");
	$(el).parent().addClass("active");
}
function initSetting(el){
	$("#cr").css("display","none");
	$("#psr").css("display","none");
	$("#ps").css("display","block");
	$(".active").removeClass("active");
	$(el).parent().addClass("active");
}
window.onhashchange=function(){
	$("#cr").css("display","none");
	$("#psr").css("display","none");
	$("#ps").css("display","none");
	var hash=window.location.hash;
    $(hash).css("display","block");
    $(".navbar-left")[0].getElementsByTagName("li")[1].className="active";
};

function initCreateRule(){
	window.location.hash = "#cr"; 
	document.forms[0].start.placeholder=new Date().getHours()+":"+new Date().getMinutes();
	document.forms[0].end.placeholder=new Date().getHours()+":"+new Date().getMinutes();
	document.forms[1].link.value="50";
	$("#form1").validation({icon:true});
	/*$("#cr").css("display","block");
	$("#psr").css("display","none");*/
	
}
/*function check(el,index){
	if(el.value==""){
		$(".mark")[index].style.visibility="visible";
	}else{
		$(".mark")[index].style.visibility="hidden";//alert($(".button")[1].children[0].className.split(" "))
		if($(".button")[1].children[0].className.split(" ")[2]=="disabled"){
			$(".button")[1].children[0].className="btn btn-success";
		}
	}
}*/
function saveRule(el){
	$(el).addClass("disabled");
	var sname=document.forms[0].name.value;
	var sdes=document.forms[0].description.value;
	var sstart=document.forms[0].start.value;
	var send=document.forms[0].end.value;
	var slink=document.forms[1].link.value;
	var obj={
			"aaData":[sname,sdes,sstart,send,slink,"disable"]
	};
	if(sname&&sdes){
	var url="http://"+root+"/webdemo/servlet/rules?type=1&&name="+sname+"&&description="+sdes+"&&startTime="+sstart+"&&endTime="+send+"&&maxLinkUtilize="+slink+"&&"+ new Date().getTime();
	//alert(url);
	$.get(url);
		ruleTable=$('.ruleTable').dataTable();
		window.location.hash = "#psr";
		ruleTable.fnAddData(obj["aaData"]);
		ruleTable.fnPageChange("last");
		$(el).removeClass("disabled");
	/*	url="./arrays.txt?"+new Date().getTime();
		setTimeout(function(){
		$.getJSON(url,function(obj){//alert(status);
		//clearInterval(interval);
		ruleTable=$('.ruleTable').DataTable();
		window.location.hash = "#psr";
		var len=obj["aaData"].length;
		ruleTable.fnAddData(obj["aaData"][len-1]);
		ruleTable.fnPageChange("last");
		$(el).removeClass("disabled");
	});
		},10000);*/
	}else{
		$(el).removeClass("disabled");
	}
	/*$.get(url);
	//var interval;
	setTimeout(function(){
		var ruleTable=$('.ruleTable').DataTable();
		window.location.hash = "#psr";
		/*$.ajax({

		        url:url,

		        datatype:"json",

		        type:'get',

		        success:function(obj)
		        {   //成功后回调

					var len=obj["aaData"].length;//alert(obj["aaData"][len-1]);
					ruleTable.fnAddData(obj["aaData"][len-1]);
					ruleTable.fnPageChange(0);
		        },

		        error:function(e){   //失败后回调

		            alert(e);

		        }

		});*/

	/*	$.getJSON("./arrays.txt",function(obj){
			//clearInterval(interval);
			var len=obj["aaData"].length;//alert(obj["aaData"][len-1]);
			ruleTable.fnAddData(obj["aaData"][len-1]);
			ruleTable.fnPageChange(0);
		});
    	//$(el).css("disabled","disabled");*/
		/*$(el).removeClass("disabled");
		//$("#cr").css("display","none");
		//$("#psr").css("display","block");
	},5000);*/

}
function quitRule(el){
	$.confirm({
		'title'		: '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Cancel Confirmation',
		'message'	: 'You are about to cancel this item. <br />It cannot be restored at a later time! Continue?',
		'buttons'	: {
			'Yes'	: {
				'class'	: 'blue',
				'action': function(){
					window.location.hash = "#psr";
				}
			},
			'No'	: {
				'class'	: 'gray',
				'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
			}
		}
	});
}
var aInput=[];
var bInput=[];
var aenableInput=[];
var nameString="";
var bnameString="";
function check(el,iDataRow){
	//var actionId=$("#s"+iDataRow)[0].title;//alert($(el).prop('checked'));
    //if($(el).prop('checked')){
	//aInput.push(el);
	//nameString+= nameString==""? actionId : "-"+actionId;
  //  } else{
   // bnameString+= bnameString==""? actionId : "-"+actionId;	
   // }
}
function deleteRule(el,iDataRow){
	var actionId=$("#s"+iDataRow)[0].title;
	ruleTable=$('.ruleTable').dataTable();//console.log(ruleTable.fnDeleteRow($(el).parent()[0].parentNode));
	//alert(actionId);
	var url="http://"+root+"/webdemo/servlet/rules?type=2&&name="+actionId+"&&"+ new Date().getTime();
	$.confirm({
		'title'		: '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Delete Confirmation',
		'message'	: 'You are about to delete this item. <br />It cannot be restored at a later time! Continue?',
		'buttons'	: {
			'Yes'	: {
				'class'	: 'blue',
				'action': function(){
					ruleTable.fnDeleteRow($(el).parent()[0].parentNode);
					ruleTable.fnDraw();
					$.get(url,function(obj){
						console.log(1);

					});
				}
			},
			'No'	: {
				'class'	: 'gray',
				'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
			}
		}
	});
	//ruleTable
   // .row( $(el).parents('tr') )
    //.remove()
   // .draw();
	//ruleTable.fnClearTable();
	}
function startRule(){
	ruleTable=$('.ruleTable').dataTable();
	$("table.ruleTable input:checkbox:checked").each(function(){
    var actionId=$(this)[0].title;
	nameString+= nameString==""? actionId : "-"+actionId;
	});
	var url="http://"+root+"/webdemo/servlet/rules?type=3&&name="+nameString+"&&"+ new Date().getTime();
	$.confirm({
		'title'		: '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Start Confirmation',
		'message'	: 'You are about to start the selected rules. <br />Continue?',
		'buttons'	: {
			'Yes'	: {
				'class'	: 'blue',
				'action': function(){
					$.get(url);
						$("table.ruleTable input:checkbox:checked").each(function(){
							$(this).parent().parent()[0].children[5].innerHTML="enable";
							$(this).parent().parent()[0].style.background="#33CCFF";
							$(this).attr("checked", false); 
						    nameString="";
						/*for(var i=0;i<aInput.length;i++){
							$(aInput[i]).parent().parent()[0].children[4].innerHTML="enable";
							$(aInput[i]).parent().parent()[0].style.background="#33CCFF";
							$(aInput[i]).attr("checked", false); 
							aenableInput.push(aInput[i]);
						}
						aInput=[];
						nameString="";*/
					});
				}
			},
			'No'	: {
				'class'	: 'gray',
				'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
			}
		}
	});
}
function disableRule(){
	ruleTable=$('.ruleTable').dataTable();
	$("table.ruleTable input:checkbox:checked").each(function(){
    var actionId=$(this)[0].title;
	nameString+= nameString==""? actionId : "-"+actionId;
	});
	var url="http://"+root+"/webdemo/servlet/rules?type=4&&name="+nameString+"&&"+ new Date().getTime();
	$.confirm({
		'title'		: '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Disable Confirmation',
		'message'	: 'You are about to disable the selected rules. <br />Continue?',
		'buttons'	: {
			'Yes'	: {
				'class'	: 'blue',
				'action': function(){
					$.get(url);
						$("table.ruleTable input:checkbox:checked").each(function(){
							$(this).parent().parent()[0].children[5].innerHTML="disable";
							$(this).parent().parent()[0].style.background="";
							$(this).attr("checked", false); 
						});
						nameString="";
						/*for(var i=0;i<aInput.length;i++){
							$(aInput[i]).parent().parent()[0].children[4].innerHTML="enable";
							$(aInput[i]).parent().parent()[0].style.background="#33CCFF";
							$(aInput[i]).attr("checked", false); 
							aenableInput.push(aInput[i]);
						}
						aInput=[];
						nameString="";*/
				}
			},
			'No'	: {
				'class'	: 'gray',
				'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
			}
		}
	});
}	

function saveSetting(el){
	var color1= $("#color1").spectrum("get");
	var color2= $("#color2").spectrum("get");
	var color3= $("#color3").spectrum("get");
	$.confirm({
		'title'		: '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Modify Confirmation',
		'message'	: 'You are about to modify this item. <br />The prevous status cannot be restored at a later time! Continue?',
		'buttons'	: {
			'Yes'	: {
				'class'	: 'blue',
				'action': function(){
					var index=new Array(8);
					var obj,sid;
					for(var i=1;i<8;i+=2){
						sid="#collapse"+((i+1)/2);
						obj=$(sid)[0].getElementsByTagName('select')[0];
					    index[i-1]=obj.selectedIndex; //序号，取当前选中选项的序号
						obj=$(sid)[0].getElementsByTagName('select')[1];
					    index[i]=obj.selectedIndex; //序号，取当前选中选项的序号
					}
					obj=$("#collapse2")[0].getElementsByTagName('select')[2];
				    var a=obj.selectedIndex; //序号，取当前选中选项的序号
				    var valuea=obj[obj.selectedIndex].text;
					obj=$("#collapse2")[0].getElementsByTagName('select')[3];
					var b=obj.selectedIndex; //序号，取当前选中选项的序号
					$.cookie("consv",'{"color":"'+color1+'","length":'+index[0]+',"unit":'+index[1]+'}');
					$.cookie("consp",'{"color":"'+color2+'","length":'+index[2]+',"unit":'+index[3]+'}');
					$.cookie("utilization",'{"length":'+index[4]+',"unit":'+index[5]+'}');
					$.cookie("traffic",'{"color":"'+color3+'","length":'+index[6]+',"unit":'+index[7]+'}');
					$.cookie("frequency",'{"length":'+a+',"unit":'+b+',"value":'+valuea+'}');
					//window.location.href = "index.html?consv="+color1+"&consp="+color2+"&flow="+color3;
					window.location.href = "index.html";
				}
			},
			'No'	: {
				'class'	: 'gray',
				'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
			}
		}
	});
	//var sdes=document.forms[3].description.value;
	//var sstart=document.forms[4].start.value;
	//var send=document.forms[5].end.value;
}
function quitSetting(el){
	$.confirm({
		'title'		: '<i class="icon-info-sign"></i>&nbsp;&nbsp;&nbsp;Cancel Confirmation',
		'message'	: 'You are about to cancel this item. <br />It cannot be restored at a later time! Continue?',
		'buttons'	: {
			'Yes'	: {
				'class'	: 'blue',
				'action': function(){
					window.location.href = "index.html";
				}
			},
			'No'	: {
				'class'	: 'gray',
				'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
			}
		}
	});
}