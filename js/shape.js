function shape(canvas,canvas1,cobj){
    this.canvas=canvas;
    this.canvas1=canvas1;
    this.cobj=cobj;
    this.bgcolor="#000";
    this.borderColor="#000";
    this.lineWidth=1;
    this.type="stroke";
    this.shapes="line";
    this.width = canvas1.width;
    this.height = canvas1.height;
    this.history = [];
    this.selectFlag = true;
}
shape.prototype={
    init:function(){
        this.cobj.fillStyle=this.bgcolor;
        this.cobj.strokeStyle=this.borderColor;
        this.cobj.lineWidth=this.lineWidth;
    },
    draw:function(){
        var that=this;
        that.canvas.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.canvas.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                that[that.shapes](startx,starty,endx,endy);
            };
            that.canvas.onmouseup=function(){
                var data = that.cobj.getImageData(0,0,that.width,that.height);
                that.history.push(data);
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            };
        }
    },
    line:function(x,y,x1,y1){
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.stroke();
        that.cobj.closePath();
    },
    rect:function(x,y,x1,y1){
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    arc:function(x,y,x1,y1){
        var that=this;
        var r=Math.sqrt((x1-x)*(x1-x1)+(y1-y)*(y1-y));
        that.init();
        that.cobj.beginPath();
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    pen:function(){
        var that=this;
        that.canvas.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.canvas.onmousemove=function(e){
                console.log(1);
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            };
            that.canvas.onmouseup=function(){
                that.cobj.closePath();
                var data = that.cobj.getImageData(0,0,that.width,that.height);
                that.history.push(data);
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            };
        }
    },
    star:function(x,y,x1,y1){
        var that=this;
        that.init();
        var rOuter = Math.sqrt((x1-x)*(x1-x1)+(y1-y)*(y1-y));
        var rInner = rOuter/2;
        that.cobj.beginPath();
        that.cobj.moveTo(x+rOuter,y);
        for(var i = 0 ; i<10 ; i++){
            if(i%2==0){
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*rOuter,y+Math.sin(i*36*Math.PI/180)*rOuter);
            }else{
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*rInner,y+Math.sin(i*36*Math.PI/180)*rInner);
            }
        }
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    xp:function(xpObj,w){
        var that = this;
        that.init();
        that.canvas.onmousemove = function(e){
            xpObj.css({display:"block",width:w,height:w});
            var ox = e.offsetX;
            var oy = e.offsetY;
            var left = ox-w/2;
            var top = oy-w/2;
            if(left<0){
                left=0;
            }
            if(left>that.width-w){
                left = that.width-w;
            }
            if(top<0){
                top=0;
            }
            if(top>that.height-w){
                top=that.height-w;
            }
            xpObj.css({
                top:top,
                left:left
            });
        };
        that.canvas.onmousedown = function(){
            that.init();
            that.canvas.onmousemove = function(e){
                var ox = e.offsetX;
                var oy = e.offsetY;
                var left = ox-w/2;
                var top = oy-w/2;
                if(left<0){
                    left=0;
                }
                if(left>that.width-w){
                    left = that.width-w;
                }
                if(top<0){
                    top=0;
                }
                if(top>that.height-w){
                    top=that.height-w;
                }
                xpObj.css({
                    display:'block',
                    top:top,
                    left:left
                });
                that.cobj.clearRect(left,top,w,w);
            };
            that.canvas.onmouseup = function(){
                xpObj.css('display','none');
                var data = that.cobj.getImageData(0,0,that.width,that.height);
                that.history.push(data);
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            };
        };
    },
    select:function(AreaEl){
        var that = this;
        that.canvas.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            var minx,miny, w,h;
            that.canvas.onmousemove=function(e){
                var endx = e.offsetX;
                var endy = e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                AreaEl.css({
                    display:'block',
                    left:minx,
                    top:miny,
                    width:w,
                    height:h
                });
            };
            that.canvas.onmouseup=function(){
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
                that.temp = that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                var data = that.cobj.getImageData(0,0,that.width,that.height);
                that.history.push(data);
                console.log(that.history);
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(AreaEl,minx,miny,w,h);
            };
        }
    },
    drag:function(AreaEl,x,y,w,h){
        var that = this;
        var cx,cy;
        that.canvas.onmousemove = function(e){
            var ox = e.offsetX;
            var oy = e.offsetY;
            cx = ox-x;
            cy = oy-y;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                console.log(2);
                AreaEl.css({
                    cursor:'move'
                });
            }else{
                AreaEl.css({
                    cursor:'default'
                });
                return;
            }
        };
        that.canvas.onmousedown = function(){
            that.canvas.onmousemove = function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                that.cobj.putImageData(that.history[that.history.length-1],0,0);
                var endx = e.offsetX;
                var endy = e.offsetY;
                var left=endx - cx;
                var top=endy - cy;
                AreaEl.css({
                    left:left,
                    top:top
                });
                x = left;
                y = top;
                that.cobj.putImageData(that.temp,left,top);
            };
            that.canvas.onmouseup = function(){
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            };
        }
    }
};
