#jquery.areaselect
###基于jquery的地区选择空间,有别于传统的多个下拉框的选择方式(仿京东地区选择交互)

###使用方式(how to use)
    $(".area-select").arealikeselect({
            initData:[{id:2,name:"ttt"},{id:3,name:"ggg"}],
            loadData:function(selectedData,callback){//selectedData={id:10,name:"ee"};
                //use selectedData to queryajax
                //ajax
                //success:function()
                callback([{id:2,name:"ttt"},{id:3,name:"ggg"}]);
                //callback(null) or callback([]) to stop choose to trigger onok function
            },
            onok:function(selectedDatas){
                alert(JSON.stringify(selectedDatas));
            },
            type:"input",//type 分为link 和 input两种
            linktext:"请选择收货地区"

        });
###对应data数据格式(data format)

    var data = [
		{id:2,name:"北京"},{id:5,name:"上海"},
		{id:4,name:"天津"},{id:6,name:"成都"}
    ];
