window.onload=function(){
	let canvas=document.querySelector('canvas')
	let mask=document.querySelector('.mask')
	let eraser=document.querySelector('.eraser')
	let clipObj=document.querySelector('.clip')
	let font=document.querySelector('#font')
	let baocun=document.querySelector('.icon-baocun')
	let inputs=document.querySelectorAll('input')
	let bots=document.querySelectorAll('.left>ul:last-child>li')
	let lis=document.querySelectorAll('.left>ul:first-child>li')
	let anniu=document.querySelectorAll('.top>ul>li')
	let now=0;
	let now1=0;
	let now2=0;
	let pale=new palette(canvas,mask);
	//工具
	lis.forEach((element,index)=>{
		element.onclick=function(){
			lis[now].classList.remove('hot')
			element.classList.add('hot')
			now=index;
			if (index == 3) {
				 pale.pencil();
			} else{
				pale.draw(this.id);
			}
			
		}
	})
	
	//样式
	//改变填充 描边颜色
	
	inputs.forEach((element,index)=>{
	   element.onchange=function(){
		    if (index) {
		    	pale.fillStyle=element.value;
		    }else{
		    	pale.strokeStyle=element.value;
		    }
	  }
	})
	//填充   描边
	bots.forEach((ele,index)=>{
		ele.onclick=function(){
   	        bots[now1].classList.remove('hot')
			ele.classList.add('hot')
			now1=index;
			if(index==3){
				pale.style=ele.id;
			}else if(index==5){
				pale.style=ele.id;
			}else if(index==0){
				pale.erasers(eraser);
			}else if(index==1){
				pale.font()
			}
       }
	})
   
   //功能
   anniu.forEach((element,index)=>{
   	element.onclick=function(){
   		anniu[now2].classList.remove('hot');
   		element.classList.add('hot');
   		now2=index;
   		if(index==0){
   			baocun.href=canvas.toDataURL('img/png');  //保存图片
		    	baocun.download='a.png';
   		}else if (index==1) {
   			pale.clip(clipObj)
   		}else if (index==2) {
   			pale.back()
   		} else if(index==3){
   			pale.reverse()
   		}
   	}
   })
}	
