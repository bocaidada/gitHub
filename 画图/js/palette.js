/*
 * 属性
 *    线宽   端点   颜色   边    角    橡皮尺寸     width  height  history   ctx  canvas
 * 
 * 方法
 *    画线  画虚线   铅笔   原  多边形    多角型
 * 
 * 工具
 *    橡皮     裁切    文字
 * 
 *    新建   保存     导入
 * 
 * */
function palette(canvas,mask){
	this.mask=mask;
	this.canvas=canvas;
	this.ctx=this.canvas.getContext('2d');
	this.history=[];
	this.cw = this.canvas.width;
	this.ch = this.canvas.height;
	
	//样式
	this.lineWidth='5';
	this.lineCap='butt';
	this.fillStyle='#ff6700';
	this.strokeStyle='#01B5FF';

	//描边  填充
	this.style='fill';
	this.temp;
}
palette.prototype={
	draw:function(type){
		this.mask.onmousedown=function(e){
			let ox=e.offsetX,oy=e.offsetY;
			this.mask.onmousemove=function(e){
				let cx=e.offsetX,cy=e.offsetY;
				let r=Math.sqrt(Math.pow(cx-ox,2)+Math.pow(cy-oy,2));
				this.ctx.clearRect(0,0,this.cw,this.ch);
				this.init();
				if (this.history.length>0) {
					this.ctx.putImageData(this.history[this.history.length-1],0,0);
				}
					 this[type](ox,oy,cx,cy,r,5);
			}.bind(this);
			this.fn();
		}.bind(this);
	},
	init:function(){
		this.ctx.lineWidth=this.lineWidth;
		this.ctx.lineCap=this.lineCap;
		this.ctx.fillStyle=this.fillStyle;
		this.ctx.strokeStyle=this.strokeStyle;
	},
	//实线
	line:function(ox,oy,cx,cy){
		        let that=this;
		        that.ctx.beginPath();
				that.ctx.moveTo(ox,oy);
				that.ctx.setLineDash([9,0])
				that.ctx.lineTo(cx,cy);
				that.ctx.closePath();
				that.ctx.stroke();
	},
	//虚线
	dash:function(ox,oy,cx,cy){
				let that=this;
				that.ctx.beginPath();
			    that.ctx.moveTo(ox,oy);
				that.ctx.setLineDash([9,12])
				that.ctx.lineTo(cx,cy);
				that.ctx.closePath();
				that.ctx.stroke();			
	},
	//铅笔
	pencil:function(){
			let that=this;
			that.mask.onmousedown=function(e){
			let ox=e.offsetX,oy=e.offsetY;
			that.init();
			that.ctx.beginPath();
			that.ctx.moveTo(ox,oy);
			that.mask.onmousemove=function(e){
				let cx=e.offsetX,cy=e.offsetY;
				that.ctx.lineTo(cx,cy);
				that.ctx.stroke();
			}
			  that.fn();
		  }
	},
	//多边形
	pley:function(ox,oy,cx,cy,r,bian){
			let that=this;
			let ang=360/bian/180*Math.PI
			that.ctx.beginPath()
			that.ctx.moveTo(ox+r,oy)
			for (let i=1;i<bian;i++) {
				that.ctx.lineTo(ox+r*Math.cos(ang*i),oy+r*Math.sin(ang*i))
			}
			that.ctx.closePath();	
			that.ctx[that.style]();
	},
	//圆
	circle:function(ox,oy,cx,cy,r){
				let that=this;
				that.ctx.beginPath();
				that.ctx.moveTo(ox+r,oy);
				that.ctx.arc(ox,oy,r,0,2*Math.PI,false);
				that.ctx.closePath();
				that.ctx[that.style]();
	},
	//多角星
	wjx:function(ox,oy,cx,cy,r,jiao){
			let that=this;
			let ang=360/(jiao*2)/180*Math.PI;
			that.ctx.beginPath();
			that.ctx.moveTo(ox+r,oy);
			for (let i=1;i<jiao*2;i++) {
                r=Math.sqrt(Math.pow(cx-ox,2)+Math.pow(cy-oy,2))
				if (i%2) {
					r=r/2;
				} else{
					r=r;	
				}
				that.ctx.lineTo(ox+r*Math.cos(ang*i),oy+r*Math.sin(ang*i))
			}
			that.ctx.closePath();
			that.ctx[that.style]();
	},
	//矩形
	jux:function(ox,oy,cx,cy,r){
			this.ctx.beginPath();
			this.ctx.rect(ox,oy,cx-ox,cy-oy);
			this.ctx[this.style]();
	},
	fn:function(){
		let that=this;
		that.mask.onmouseup=function(){
			that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
			that.mask.onmousemove=null;
			that.mask.onmouseup=null;
		   }
	},
	//橡皮擦
	erasers:function(eraser){
		    let that=this;
    	    that.mask.onmousedown=function(e){
    	    eraser.style.display='block'
    	    e.preventDefault();
	    	let w=eraser.offsetWidth,h=eraser.offsetHeight;
	    	that.mask.onmousemove=function(e){
	    		let ox=e.offsetX,oy=e.offsetY;
	    		let lefts=ox-w/2,tops=oy-h/2;
	    		if (lefts<0) {
	    			lefts=0;
	    		} else if(lefts>that.cw-w){
	    			lefts=that.cw;
	    		}
	    		if (tops<0) {
	    			tops=0;
	    		}else if(tops>that.ch-h){
	    			tops=that.ch;
	    		}
	    		eraser.style.left=`${lefts}px`;
	    		eraser.style.top=`${tops}px`;
	    		that.ctx.clearRect(lefts,tops,w,h);
	    	}
	    	that.mask.onmouseup=function(){
	    		eraser.style.display='none';
	    		that.mask.onmousemove=null;
	    		that.mask.onmouseup=null;
	    		that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));

	    	}
	    }
	},
	//文字
	font:function(){
		let that=this;
	    that.mask.ondblclick=function(e){
	    	let ox=e.offsetX,oy=e.offsetY;
	    	let divs=document.createElement('div');
	    	divs.style.cssText=`
	    	     width:100px;height:30px;border:1px dashed #ff6700;
	    	     position:absolute;left:${ox}px;top:${oy}px;
	    	`;
	    	that.mask.appendChild(divs);
	    	divs.contentEditable='true';
	    	that.mask.onmousedown=null;
	    	let lefts,tops;
	    	divs.onmousedown=function(e){
	    		let ox=e.clientX,oy=e.clientY;
	    		let ol=divs.offsetLeft,ot=divs.offsetTop;
	    		that.mask.onmousemove=function(e){
	    			let cx=e.clientX,cy=e.clientY;
	    			lefts = cx-ox+ol;
	    			tops = cy-oy+ot;
	    			if (lefts<0) {
	    			lefts=0;
		    		} else if(lefts>that.cw){
		    			lefts=that.cw;
		    		}
		    		if (tops<0) {
		    			tops=0;
		    		}else if(tops>that.ch){
		    			tops=that.ch;
		    		}
	    			divs.style.left=`${lefts}px`;
	    			divs.style.top=`${tops}px`;
	    		}
	    		divs.onmouseup=function(){
	    			that.mask.onmousemove=null;
	    			divs.onmouseup=null;
	    		}
	    	}
	    	divs.onblur=function(){
	    		let value=divs.innerText;
	    		that.mask.removeChild(divs);
	    		that.ctx.font='bold 30px sans-serif';
	    		that.ctx.fillText(value,lefts,tops);
	    		that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
	    	}	
	    }
	},
	//撤销
    back:function(){
    	this.history.pop();
			if(this.history.length==0){
				this.ctx.clearRect(0,0,this.cw,this.ch);
			}else{
				this.ctx.putImageData(this.history[this.history.length-1],0,0)
			}
   },
 //裁剪
   clip:function(clipObj){
   	  let that=this;
   	  that.mask.onmousedown=function(e){
   	  	let minX,minY,w,h
   	  	let ox=e.offsetX,oy=e.offsetY;
   	  	that.mask.onmousemove=function(e){
   	  		let cx=e.offsetX,cy=e.offsetY;
   	  		w = Math.abs(ox - cx);
	 		h = Math.abs(oy - cy);
   	  		minX=ox<cx?ox:cx;
   	  		minY=oy<cy?oy:cy;
   	  		clipObj.style.cssText=`
                 display:block;left:${minX}px;
                 top:${minY}px;width:${w}px;
                 height:${h}px;
                 border: 1px dashed #01B5FF;
   	  		`;
   	  	that.mask.onmouseup=function(){
   	  		that.temp=that.ctx.getImageData(minX,minY,w,h)
   	  		that.ctx.clearRect(minX,minY,w,h)
   	  		that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch))
   	  		that.ctx.putImageData(that.temp,minX,minY)
   	  		that.mask.onmousemove=null;
   	  		that.mask.onmouseup=null;
   	  		that.drag(minX,minY,w,h,clipObj);
   	  	}
   	  	}
   	  }
   },
  drag:function(minX,minY,w,h,clipObj){
		 let that = this;
		 this.mask.onmousemove = function(e){
		 	let ow = e.offsetX,oh = e.offsetY;
		 	if(ow>minX && ow< minX+w && oh>minY && oh<minY+h){
		 		that.mask.style.cursor = 'move';
		 	}else{
		 		that.mask.style.cursor = 'default';
		 	}

		 }
		 
		 let lefts,tops;
		 that.mask.onmousedown = function(e){
		 	let ow = e.offsetX,oh = e.offsetY;
		 	that.mask.onmousemove = function(e){
		 		let ew = e.offsetX,eh = e.offsetY;
		 		lefts = minX + (ew-ow);
		 		tops = minY+ (eh-oh);
		 		clipObj.style.left = `${lefts}px`;
		 		clipObj.style.top = `${tops}px`;
		 		that.ctx.clearRect(0,0,that.ow,that.oh);
		 		if(that.history.length>0){
	   	  		that.ctx.putImageData(that.history[that.history.length-1],0,0)
	   	  	    }
		 		that.ctx.putImageData(that.temp,lefts,tops)
		 	}
		 	that.mask.onmouseup = function(){
		 		that.temp=null;
		 		clipObj.style.display='none';
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch))
		 		that.mask.onmousemove = null;
		 		that.mask.onmouseup = null;
		 		that.mask.onmousedown=null;
		 		that.mask.style.cursor = 'default';
		 	}
		 }
	},
    //反向
    reverse:function(){
   	let getData=this.ctx.getImageData(0,0,this.cw,this.ch);
   	let data=getData.data;
   	for (let i=0;i<data.length;i+=4) {
   		data[i]=255-data[i];
   		data[i+1]=255-data[i+1];
   		data[i+2]=255-data[i+2];
   	}
   	this.ctx.putImageData(getData,0,0)
   	this.history.push(this.ctx.getImageData(0,0,this.cw,this.ch))
   }
}

