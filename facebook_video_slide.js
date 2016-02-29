+function($){

	function Slide(options){
		var default = {
			slide_cache : [],//缓存加载下来的slide,
			start_index : 0,//页面中显示的第一个slide在slide_cache中的索引
			slider_container : "",
			getSlideData : function(){},

		}
	}
	Slide.prototype = {
		init : function(){
			this.slide_cache =[]; //缓存加载下来的slide
		 	this.start_index = 0;//页面中显示的第一个slide在slide_cache中的索引

		 	this.limit = Math.floor(window.innerWidth / 200)+1; //页面显示的slide数量
		 	$(".slider_operate_container").css("width",window.innerWidth);
		 	$("#slider_container").css("width",200 + window.innerWidth);
		 	this.initEvents();
		 	this.getSlideData();
		 },
		 getSlideData : function(){

		 }
	}
	var Slide = {
		init : function(){
			this.slide_cache =[]; //缓存加载下来的slide
		 	this.start_index = 0;//页面中显示的第一个slide在slide_cache中的索引

		 	this.limit = Math.floor(window.innerWidth / 200)+1; //页面显示的slide数量
		 	$(".slider_operate_container").css("width",window.innerWidth);
		 	$("#slider_container").css("width",200 + window.innerWidth);
		 	this.initEvents();
		 	this.getSlideData();
		 },
		 getSlideData : function(){
		 	var self = this;
			$.ajax({
				url:"/slidelist",
				type:"POST",
				data:{limit:self.limit,createtime:createtime},
				success:function(data){
					if (data.data.length == 1) {
	 					$(".slider_operate_container .forward").hide();
	 					alert("没有更多的数据了");
	 					return;
					}
					if (self.slide_cache.length == 0) {
						self.slide_cache = data.data;
					}else{
						self.slide_cache.splice(-1,1);
						self.slide_cache = self.slide_cache.concat(data.data);
					}
					self.renderSlides(data.data);
				}
			});
		 },
		 initEvents : function(){
		 	var self = this;
	 		//前进slide
		 	$(".slider_operate_container").on("click",".forward",function(){
		 		$(".slider_operate_container .back").show();
		 		self.start_index = self.start_index + self.limit -1;
		 		//通过页面显示的第一个slide的index判断是从缓存读取slide还是从服务器获取
		 		if(self.start_index < self.slide_cache.length - self.limit + 1 || self.slide_cache.length - self.start_index > 1  ) {
		 			var data = self.slide_cache.slice(self.start_index,self.start_index + self.limit);
					self.renderSlides(data);
					console.log("forward cache");
			 		return;
		 		}else{
		 			var createtime = +$("#slider_container").find(".slide").last().find(".createtime").val() + 1;
					self.getSlideData(createtime);
					console.log("forward server");
		 		}
		 		
			});

			//后退slide
		 	$(".slider_operate_container").on("click",".back",function(){
		 		$(".slider_operate_container .forward").show();
		 		self.start_index = self.start_index - self.limit + 1;
				self.renderSlides(self.slide_cache.slice(self.start_index,self.start_index + self.limit));
				console.log("back cache");
	 			if (self.start_index == 0) {
		 			$(".slider_operate_container .back").hide();
		 		}
			});

		 	$("#slider_container").on("click",".slide",function(){
				self.getArticleContent($(this).find(".article_name").val());
				$(".cur").removeClass("cur");
				$(this).addClass("cur");
			});
	 	},
	 	renderSlides : function(){
	 		if (data.length < this.limit) {
		 			$(".slider_operate_container .forward").hide();
			}
			$("#slider_container").html(Mustache.render($("#template").html(),{"slides":data}));
	 		$("#slider_container").find(".slide").first().addClass("cur");	
			this.getArticleContent($("#slider_container").find(".slide").first().find(".article_name").val());
	 	},
	 	getArticleContent : function(article){
	 		$.ajax({
				url:"/preview",
				type:"GET",
				data:{article:article},
				success:function(data){
					$("#blog_container").html(data.data);
				}
			});
	 	}
	}
}(jQuery);