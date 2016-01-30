$(function(){
    $(document).on('selectstart',function(){
        return false;
    });
    $(document).on("mousedown",function(e){
        var target = e.target;
        var ox = e.offsetX;
        var oy = e.offsetY;
        $(document).on('mousemove',function(e){
            var px = e.clientX;
            var py = e.clientY;
            $(target).trigger('drag',{left:px-ox,top:py-oy});
        });

        $(document).on("mouseup",function(){
            $(document).off('mousemove');
            $(document).off('mouseup');
        });
    });
    $(document).delegate(".apptitle","drag",function(e,data){
        $(this).parent().css({
            left:data.left,
            top:data.top
        })
    });
    var box = $('.box');
    var copy = $(".copy");
    var canvas = $("canvas");
    var cobj =canvas[0].getContext("2d");
    canvas.attr({
        width:copy.width(),
        height:copy.height()
    });

    $('.container').css({
        left:($(window).width()-$('.container').width())/2,
        top:($(window).height()-$('.container').height())/2
    });


    $(".hasson").hover(function(){
        $('.hasson').find('.son').hide();
        $(this).find(".son").finish();
        $(this).find(".son").fadeIn(200);
    },function(){
        $(this).find(".son").fadeOut(200);
    })
    var obj=new shape(copy[0],canvas[0],cobj);

    copy.mousemove(function(e){
        $('.statx').text(e.offsetX);
        $('.staty').text(e.offsetY);
        $('.mode').text(obj.type);
        $('.sp').text(obj.shapes);
        $('.lw').text(obj.lineWidth+'px');
        $('.bc').text(obj.borderColor);
        $('.fc').text(obj.bgcolor);
    });
    copy.mousemove();


    /*形状*/
    $(".shapes li").click(function(){
        obj.history.push(obj.cobj.getImageData(0,0,obj.width,obj.height));
        $('.selectArea').css('display','none');
        obj.temp = null;
        obj.shapes = $(this).attr("data-role");
        if(obj.shapes!='pen'){
            obj.draw();
        }else{
            obj.pen();
        }

    });

    /*绘图模式*/

    $(".type li").click(function(){

        obj.history.push(obj.cobj.getImageData(0,0,obj.width,obj.height));
        $('.selectArea').css('display','none');
        obj.temp = null;

        obj.type = $(this).attr("data-role");
        obj.draw();
    });

    /*边框的颜色*/
    $('#lineColor').change(function(){
        obj.borderColor = $(this).val();
        if(obj.shapes!='pen'){
            obj.draw();
        }else{
            obj.pen();
        }
    });
    /*背景颜色*/
    $('#fillColor').change(function(){
        obj.bgcolor = $(this).val();
        obj.draw();
    });

    /*线条粗细*/
    $(".linewidth li").click(function(){
        obj.history.push(obj.cobj.getImageData(0,0,obj.width,obj.height));
        $('.selectArea').css('display','none');
        obj.temp = null;

        obj.lineWidth = $(this).attr("data-role");
        if(obj.shapes!='pen'){
            obj.draw();
        }else{
            obj.pen();
        }
    });

    $('.xpsize li').click(function(){

        obj.history.push(obj.cobj.getImageData(0,0,obj.width,obj.height));
        $('.selectArea').css('display','none');
        obj.temp = null;

        $('.xp').css({
            width:$(this).attr('data-role'),
            height:$(this).attr('data-role')
        });
        obj.xp($('.xp'),$(this).attr('data-role'));
    });

    $('.sel').click(function(){
        obj.selectFlag = true;
        obj.select($('.selectArea'));
    });

    /*文件*/
    $('.file li').click(function(){
        var index = $(this).index();
        switch (index){
            case 0:
                if(obj.history.length!=0){
                    var ask = window.confirm('你还没有保存，是否保存？');
                    if(ask){
                        location.href=(obj.canvas1.toDataURL().replace('data:image/png','data:stream/octet'));
                    }
                }
                obj.history = [];
                obj.cobj.clearRect(0,0,obj.width,obj.height);
            break;
            case 1:
                if(obj.history.length>0){
                    obj.history.pop();
                    if(obj.history.length>0){
                        obj.cobj.putImageData(obj.history[obj.history.length-1],0,0);
                    }else{
                        obj.cobj.clearRect(0,0,obj.width,obj.height);
                    }
                }
                break;
            case 2:
                location.href=(obj.canvas1.toDataURL().replace('data:image/png','data:stream/octet'));
                break;
            default:
                obj.history = [];
                obj.cobj.clearRect(0,0,obj.width,obj.height);
        }
    });

});
