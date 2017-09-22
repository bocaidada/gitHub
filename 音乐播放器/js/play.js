window.onload=function(){
	let audio=document.querySelector('audio');
	let previous=document.querySelector('.previous')
	let next=document.querySelector('.next')
	let jind=document.querySelector('.jind')
	let list=document.querySelector('.list')
	let play=document.querySelector('.right>.play')
	let img=document.querySelector('.left>img')
	let song=document.querySelector('.song')
	let begin=document.querySelector('.begin')
	let end=document.querySelector('.end')
	let singer=document.querySelector('.singer')
	let song1=document.querySelector('.song1')
	let singer1=document.querySelector('.singer1')
	let anniu=document.querySelector('.anniu')
	let zhe=document.querySelector('.zhe')
	let up=document.querySelector('.up')
	let lon=document.querySelector('.lon')
	let j=0;
	
	//播放暂停
	play.onclick=function(){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
		play.classList.toggle('pouse')
		
	}
	
	//切歌
	render(database[j]);
	previous.onclick=function(){
		j--;
		if (j<0) {
			j=database.length-1;
		}
		render(database[j]);
	}
	next.onclick=function(){
		++j;
		if (j==database.length-1) {
			j=0;
		}
		render(database[j]);
	}
	
	function render(data){
		song.innerText=data.songs;
		singer.innerText=data.name;
		song1.innerText=data.songs;
		singer1.innerText=data.name;
		end.innerText=data.alltime;
		audio.src=data.src;
		img.src=data.photo;
		list.innerHTML='';
		for(let i=0;i<data.lyrics.length;i++){
		  	list.innerHTML +=`
		  	      <li class=list${i}>${data.lyrics[i].lyric}</li>
		  	`;	    
		 }
	}
	
	audio.ontimeupdate=function(){
		//进度条
		jind.style.width='0';
		let all=audio.duration;     //总时间
		let ct=audio.currentTime;   //播放的时间
		jind.style.width=`${ct/all*100}%`;
	    let minuter=Math.floor(ct/60)>=10?Math.floor(ct/60):`0${Math.floor(ct/60)}`;
		let second=Math.floor(ct%60)>=10?Math.floor(ct%60):`0${Math.floor(ct%60)}`;
		begin.innerText=`${minuter}:${second}`;
	
	    database[j].lyrics.forEach((value,index)=>{
	    	if(value.time==begin.innerText){
	    		let a=index;
		    	if(index<3){
		    		index=0;
		    	}else{
		    		index-=3;
		    	}
		    	list.innerHTML='';
		    	for(let i=index;i<database[j].lyrics.length;i++){
		    		list.innerHTML +=`
			  	      <li class=list${i}>${database[j].lyrics[i].lyric}</li>
			  	`;	
		    	}
		    	let obj=document.querySelector(`.list${a}`);
		    	obj.style.color='red';
	    	}
	    	
	    	
	    })
	}
	
	//声音
	anniu.onmousedown=function(e){
		let ox=e.clientX;
		lon.onmousemove=function(e){
			let cx=e.clientX;
			let lefts=anniu.offsetLeft;
			   lefts=cx-ox+lefts;
			if (lefts<0) {
				lefts=0;
			} 
			if(lefts>this.offsetWidth){
				lefts=this.offsetWidth;
			}
			up.style.width=`${lefts+5}px`;
			anniu.style.left=`${lefts-5}px`;
			audio.valume=`${lefts/100}`;
			console.log(audio.valume)
		}
		anniu.onmouseup=function(){
			lon.onmousemove=null;
			anniu.onmouseup=null;
		}
	}
	
}
