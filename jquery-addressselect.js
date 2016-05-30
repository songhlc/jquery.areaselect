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
    $.fn.arealikeselect = function(options){
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
            }
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
            selectedDatas.ids.push(data.id);
            selectedDatas.names.push(data.name);
            for(var i=selectedDatas.ids.length-1;i>curindex;i--){
                selectedDatas.ids.pop();
                selectedDatas.names.pop();
            }
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
                //ajax查数据
                settings.loadData(selectedData,function(datalist){
                    if(datalist&&datalist.length>0){

                        //先看当前是第几条数据
                        var index=$(this).parents("ul").index();
                        //test
                        //if(index>2){
                        //    settings.onok(selectedDatas);
                        //    element.find("input").val(selectedDatas.fullname);
                        //    return
                        //}
                        $(".as-content ul").each(function(i){
                            if(i>index){
                                $(this).addClass("j-remove");
                            }
                        });
                        $(".as-tabs a").each(function(i){
                            if(i>index){
                                $(this).addClass("j-remove");
                            }
                        });
                        $(".area-select .j-remove").remove();
                        //如果有数据
                        //默认选中
                        $(".as-tabs-item").removeClass("as-tabs-item-current");
                        $(".as-content>ul").addClass("as-hidden");
                        $(".as-tabs a").eq(index).html($(this).html());
                        //添加tab
                        $(".as-tabs").append(parseTabTemplate(selectedData));
                        //添加ctn
                        $(".as-content").append(parseItemTemplate(datalist));
                        pushSelectedData(index,selectedData);
                    }
                    else{
                        settings.onok(selectedDatas);
                        element.find("input").val(selectedDatas.fullname);
                    }
                }.bind(this));

            });
            element.delegate(".as-tabs a","click",function() {
                var index = $(this).index();
                $(".as-tabs-item").removeClass("as-tabs-item-current").eq(index).addClass("as-tabs-item-current");
                $(".as-content ul").addClass("as-hidden").eq(index).removeClass("as-hidden");
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
        function init(){
            if(settings.initData){
                var linkelement = settings.type=="link"?'<a class="as-linkle">'+settings.linktext+'</a>':'<input placeholder="'+settings.linktext+'" class="as-linkle" type="text">';
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
                element.append(tpl);
            }
            else{
                console.log("error initData");
            }
        }
        bindEvents();
        init();
    }
})(jQuery);