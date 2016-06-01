/*!
 * bootstrap-treetable - jQuery plugin for area like tree select and addressselect
 *
 * Copyright (c) 2016 songhlc
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://github.com/songhlc/jquery.areaselect
 *
 * Version:  1.0.0
 *
 */
(function($){
    $.fn.areaselect = function(options){
        var element = this;
        var settings = {
            inputCls:"form-control",
            inputIconCls:"fa fa-angle-down",
            initData:[],
            linktext:"请选择",
            loadData:function(selectedData,callback){
            },
            onok:function(selectedDatas){
                alert(JSON.stringify(selectedDatas));
            },
            defaultFullname:""
        };
        var selectedDatas={
            ids:[],
            names:[],
            fullname:""
        };
        if(options) {
            $.extend(settings, options);
        }
        function pushSelectedData(curindex,data){
            for(var i=selectedDatas.ids.length-1;i>=curindex;i--){
                selectedDatas.ids.pop();
                selectedDatas.names.pop();
            }
            selectedDatas.ids.push(data.id);
            selectedDatas.names.push(data.name);
            selectedDatas.fullname="";
            for(var i=0;i<selectedDatas.names.length;i++){
                selectedDatas.fullname+=selectedDatas.names[i];
            }
        }
        //生成tabitem模板
        function parseTabTemplate(data){
            return  '<a href="javascript:void(0)" data-id="'+
                data.id+'" class="as-tabs-item as-tabs-item-current">请选择</a>';

        }
        //生成内容项模板
        function parseItemTemplate(datalist){
            var template = '';
            for(var i=0;i<datalist.length;i++){
                template+='<li><a href="javascript:void(0)" data-id="'+datalist[i].id+'">'+datalist[i].name+'</a></li>';
            }

            return '<ul>'+template+'</ul>';
        }

        function bindEvents(){

            element.undelegate().delegate(".as-content a","click",function(){
                var selectedData = {id:$(this).attr("data-id"),name:$(this).html()};
                //先看当前是第几条数据
                var index=$(this).parents("ul").index();
                //ajax查数据
                settings.loadData(selectedData,function(datalist){
                    if(datalist&&((datalist.data&&datalist.data.length>0)||datalist.length>0)){
                        if(datalist.keyid){
                            datalist = formatData(datalist.keyid,datalist.keyname,datalist.data);
                        }

                        //test
                        //if(index>2){
                        //    settings.onok(selectedDatas);
                        //    element.find("input").val(selectedDatas.fullname);
                        //    return
                        //}
                        element.find(".as-content ul").each(function(i){
                            if(i>index){
                                $(this).addClass("j-remove");
                            }
                        });
                        element.find(".as-tabs a").each(function(i){
                            if(i>index){
                                $(this).addClass("j-remove");
                            }
                        });
                        element.find(".j-remove").remove();
                        //如果有数据
                        //默认选中
                        element.find(".as-tabs-item").removeClass("as-tabs-item-current");
                        element.find(".as-content>ul").addClass("as-hidden");
                        element.find(".as-tabs a").eq(index).html($(this).html());
                        //添加tab
                        element.find(".as-tabs").append(parseTabTemplate(selectedData));
                        //添加ctn
                        element.find(".as-content").append(parseItemTemplate(datalist));
                        pushSelectedData(index,selectedData);
                    }
                    else{
                        pushSelectedData(index,selectedData);
                        settings.onok(selectedDatas);
                        element.find("input").val(selectedDatas.fullname);
                        $(element).removeClass("as-hover");
                    }
                }.bind(this),index);

            });
            element.delegate(".as-tabs a","click",function() {
                var index = $(this).index();
                element.find(".as-tabs-item").removeClass("as-tabs-item-current").eq(index).addClass("as-tabs-item-current");
                element.find(".as-content ul").addClass("as-hidden").eq(index).removeClass("as-hidden");
            });
            //定时器
            var hovertimeout;
            element.delegate(".as-linkle","mouseenter",function(){
                if(hovertimeout){
                    clearTimeout(hovertimeout);
                }
                $(element).addClass("as-hover");
            });
            element.delegate(".as-linkle","mouseleave",function(){

                hovertimeout = setTimeout(function(){
                    $(element).removeClass("as-hover");
                },300);
            });
            element.delegate(".as-ctn","mouseenter",function(){
                if(hovertimeout){
                    clearTimeout(hovertimeout);
                }
                $(element).addClass("as-hover")
            });
            element.delegate(".as-ctn","mouseleave",function(){
                hovertimeout = setTimeout(function(){
                    $(element).removeClass("as-hover");
                },300);
            });
        }
        function formatData(keyid,keyname,data){
            var datalist = [];
            for(var i=0;i<data.length;i++){
                var dataitem ={};
                dataitem.id = data[i][keyid];
                dataitem.name=data[i][keyname];
                datalist.push(dataitem);
            }
            return datalist;
        }
        function init(){
            if(settings.initData){
                if(settings.initData.keyid){
                    settings.initData =formatData(settings.initData.keyid,settings.initData.keyname,settings.initData.data);
                }
                var linkelement = settings.type=="link"?'<a class="as-linkle">'+settings.linktext+'</a>':'<input disabled="disabled" placeholder="'+settings.linktext+'" class="as-linkle '+settings.inputCls+'" type="text">';
                var tpl = linkelement+
                    '<div class="as-ctn">'+
                    '<div class="as-tabs">'+
                    '<a href="javascript:void(0)" class="as-tabs-item as-tabs-item-current">请选择</a>'+
                    '</div>'+
                    '<div class="clearfix"></div>'+
                    '<div class="as-content">'+
                    parseItemTemplate(settings.initData)+
                    '</div>'+
                    '</div>';
                element.html('').append(tpl);
                if(settings.defaultFullname){
                    element.find("input").val(settings.defaultFullname);
                }
            }
            else{
                console.log("error initData");
            }
        }
        bindEvents();
        init();
    }
})(jQuery);