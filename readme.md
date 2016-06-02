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

###自定义数据格式

    默认数据格式是{id:"id",name:"name"}
    如果需要自定义数据格式,改成如下即可{keyid:"ProID",keyname:"ProName",data:{ProID:"ProID",ProName:"ProName"}},
    initData和loadData里返回的都按这种格式传入即可

    一个小例子:

    $("#areabelong").areaselect({
        //默认第一页签的数据
        initData:{keyid:"ProID",keyname:"ProName",data:province},
        //点击节点时的加载函数和callback
        loadData:function(selectedData,callback,index){
            if(index ==0){
                viewModel.province_code(selectedData.id);
                callback({keyid:"CityID",keyname:"CityName",data:viewModel.cities()});
            }
            else if(index==1){
                viewModel.city_code(selectedData.id);
                callback({keyid:"DisCode",keyname:"DisName",data:viewModel.districts()});
            }
            else{
                viewModel.county_code(selectedData.id);
                callback(null);
            }
        },
        //当调用callback(null)之后会触发onok方法,返回选中的id集合 name集合 fullname
        onok:function(selectedDatas){
            viewModel.province_code(selectedDatas.ids[0]);
            viewModel.areafullname(selectedDatas.fullname);
        },
        type:"input",
        linktext:"请选择收货地区",
        defaultFullname:viewModel.areafullname()
    })


