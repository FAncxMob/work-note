# HTML5
<!-- TOC -->

- [HTML5](#html5)
    - [**attr&prop**](#attrprop)
    - [**DOCTYPE和浏览器渲染模式**](#doctype和浏览器渲染模式)
    - [**DTD**](#dtd)
    - [**新增的语义化标签**](#新增的语义化标签)
    - [**什么是Html5**](#什么是html5)
    - [**Html5优势**](#html5优势)
    - [**H5中的根元素**](#h5中的根元素)
    - [**MIME类型**](#mime类型)
    - [**Canvas**](#canvas)
        - [canvas基本用法](#canvas基本用法)
            - [什么是canvas(画布)](#什么是canvas画布)
            - [替换内容](#替换内容)
            - [canvas标签的两个属性](#canvas标签的两个属性)
            - [注意点](#注意点)
            - [路径容器](#路径容器)
            - [样式容器](#样式容器)
            - [样式栈](#样式栈)
        - [**画布api**](#画布api)
        - [**上下文api**](#上下文api)
        - [**画矩形**](#画矩形)
        - [**绘制圆形**](#绘制圆形)
        - [**绘制圆弧路径**](#绘制圆弧路径)
        - [**画曲线(贝塞尔)**](#画曲线贝塞尔)
        - [**引入图片**](#引入图片)
        - [**使用背景**](#使用背景)
        - [**使用线性渐变**](#使用线性渐变)
        - [**使用径向渐变**](#使用径向渐变)
        - [**绘制文本**](#绘制文本)
        - [**写canvas的时候建议的代码格式套路**](#写canvas的时候建议的代码格式套路)
        - [**像素操作**](#像素操作)
        - [**实现签名**](#实现签名)
        - [**实现时钟**](#实现时钟)
    - [**音视频**](#音视频)
    - [**其他新增标签与属性**](#其他新增标签与属性)

<!-- /TOC -->
## **attr&prop**
-	**什么是attribute?**
	-	html的预定义和自定义属性
-   **什么是property?**
	-	js对象身上的直接属性
-	**什么是布尔值属性，什么是非布尔值属性**
	-	property所对应的属性值是否是布尔类型
-	**attribute和property的同步关系**
	-	非布尔值属性
		-	实时同步
	-	布尔值属性
		-	没有动过property
			-	attribute会同步property
			-	property不会同步attribute
		-	动过property
			-	attribute不会同步property
			-	property不会同步attribute
-	**浏览器认谁，用户操作的是谁**
	-	property
-	**在jQuery中的体现**
	-	attr()
	-	prop()
-	**总结**
	-	布尔值属性最好使用prop方法
	-	非布尔值属性attr方法
## **DOCTYPE和浏览器渲染模式**
-	DOCTYPE，或者称为 Document Type Declaration（文档类型声明，缩写 DTD）
-	通常情况下，DOCTYPE 位于一个 HTML 文档的最前面的位置，位于根元素 HTML 的起始标签之前。因为浏览器必须在解析 HTML 文档正文之前就确定当前文档的类型，以决定其需要采用的渲染模式，不同的渲染模式会影响到浏览器对于 CSS 代码甚至 JavaScript 脚本的解析
-	到目前为止，各浏览器主要包含了三种模式。在 HTML5 草案中，更加明确的规定了模式的定义：
-	在现代主流浏览器中，其实怪异模式的渲染和标准与几乎标准间没有太大的差别（ie9+ 谷歌 火狐 ...）
-	ie5.5之前都是ie自己的渲染模式，怪异模式
-	ie6才开始慢慢支持标准，标准模式，在ie6 中怪异和标准模式的区别最大
-	ie7 8 9都是基于标准模式升级的，他们理论上存在怪异模式
-	HTML5提供的<DOCTYPE html>是标准模式，向后兼容的,等同于开启了标准模式，那么浏览器就得老老实实的按照W3C的 标准解析渲染页面
	-	一个不含任何 DOCTYPE 的网页将会以 怪异(quirks) 模式渲染。
## **DTD**
-	`<!DOCTYPE html><br>`
	-	当 doctype 信息如上时，表明该页面是遵守了 HTML5 规范的，浏览器会选择 Standards Mode，这种 doctype 是最推荐的一种，我们平时设计页面都应该加上这一个 doctype。
	-	HTML5 不基于 SGML,所以不需要引用 DTD,浏览器内部本身有对标签进行解析渲染验证的模块
-	`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`
	-	当 doctype 如上时，浏览器同样会选择 Standards Mode，虽然和第一种 doctype 有一些区别，但是几乎可以认为是一样的。

-	`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">`
	-	当 doctype 如上时，浏览器会选择 Almost Standards Mode，渲染时和标准会有一些区别
	-	当 doctype 缺失的时候，浏览器会选择 Quirks Mode，这是非常不推荐的方式，
	-	当 doctype上面有注释，标签或者空行时，某些浏览器都会认为该页面不具有doctype。
	-	我们应该尽量避免 Quirks Mode，这对一个 web 应用是非常不利的地方。

	-	[每种doctype在浏览器中对应的渲染模式](https://en.wikipedia.org/wiki/Quirks_mode)
## **新增的语义化标签**
-	header
-	footer
-	section
-	nav
## **什么是Html5**
-	HTML5 是定义 HTML 标准的最新的版本。 该术语表示两个不同的概念：
	-	它是一个新版本的HTML语言，具有新的元素，属性和行为，
	-	它有更大的技术集，允许更多样化和强大的网站和应用程序。
		-	这个集合有时称为HTML5和朋友，通常缩写为HTML5。
	
-	**HTML5     约等于     HTML + CSS + JS**
		
## **Html5优势**
-	跨平台(实际上是跨浏览器):唯一一个通吃PC MAC Iphone Android等主流平台的跨平台语言
-	快速迭代
-	降低成本
-	导流入口多
-	分发效率高
## **H5中的根元素**
-	`<html></html>`
## **MIME类型**
-	
		每当浏览器请求一个页面时，web服务器会在发送实际页面内容之前，先发送一些头信息。
		浏览器需要这些信息来决定如何解析随后的页面内容。最重要的是Content-Type
		比如: Content-Type:text/html
		text/html:即这个页面的"内容类型",或者称为MIME类型。这个头信息将唯一确定某个资源的本质是什么
		也决定了它应该如何被呈现。
		图片也有自己的MIME类型	
			jpg:image/jpeg   
			png:image/png
		js也有自己的MIME类型，css也有自己的MIME类型，
			任何资源都有自己的MIME类型，整个web都依靠MIME类型来运作
-	`<meta charset="UTF-8">:`
		告诉浏览器你应该使用哪种编码来解析网页
##   **Canvas**
### canvas基本用法
#### 什么是canvas(画布)
-	`<canvas>` 是 HTML5 新增的元素，可用于通过使用JavaScript中的脚本来绘制图形
例如，它可以用于绘制图形，创建动画。`<canvas> `最早由Apple引入WebKit
我们可以使用`<canvas>`标签来定义一个canvas元素
-	使用`<canvas>`标签时，建议要成对出现，不要使用闭合的形式。
-	**canvas元素默认具有高宽**
	-	`width：  300px`<br>
		`height：150px`<br>
#### 替换内容
-	`<canvas>`很容易定义一些替代内容。由于某些较老的浏览器（尤其是IE9之前的IE浏览器）不支持HTML元素"canvas"，但在这些浏览器上你应该要给用户展示些替代内容。这非常简单：我们只需要在`<canvas>`标签中提供替换内容就可以。
	-	支持`<canvas>`的浏览器将会忽略在容器中包含的内容，并且只是正常渲染canvas。
	-	不支持`<canvas>`的浏览器会显示代替内容
#### canvas标签的两个属性
-	**画布的高宽**
	-	html属性设置width height时只影响画布本身不影画布内容
	-	css属性设置width height时不但会影响画布本身的高宽，还会使画布中的内容等比例缩放（缩放参照于画布默认的尺寸）
-	**渲染上下文**
	-	`<canvas> `元素只是创造了一个固定大小的画布，要想在它上面去绘制内容，我们需要找到它的渲染上下文
	-	`<canvas>` 元素有一个叫做 `getContext()` 的方法，这个方法是用来获得渲染上下文和它的绘画功能。
		-	`getContext()`只有一个参数，上下文的格式
			-	**获取方式**
				<pre>
				<code>
				var canvas = document.getElementById('box');
				var ctx = canvas.getContext('2d');
				//代码...
				</code>
				</pre>
				  
				  
			-	**检查支持性**
				<pre>
				<code>
				var canvas = document.getElementById('tutorial');
				  if (canvas.getContext){
						var ctx = canvas.getContext('2d');
					} 
				</code>
				</pre>
	-	`<canvas>` 看起来和 `<img> `元素很相像，唯一的不同就是它并没有 src 和 alt 属性。
	-	实际上，`<canvas> `标签只有两个属性—— width和height。这些都是可选的。当没有设置宽度和高度的时候，canvas会初始化宽度为300像素和高度为150像素。
#### 注意点
-	canvas图像的渲染有别于html图像的渲染，
	-	**canvas的渲染极快，不会出现代码覆盖后延迟渲染的问题**
	-	**写canvas代码一定要具有同步思想**
	-	在获取上下文时，一定要先判断画布高宽的问题
	-	**画布默认高宽300*150**
	-	**切记一定要使用html的attribute的形式来定义画布的宽高,通过css形式定义会缩放画布内的图像**
-	**绘制矩形的问题**
	-	边框宽度的问题，边框宽度是在偏移量上下分别渲染一半，可能会出现小数边框，
	-	**一旦出现小数边框都会向上取整**
	-	**cnvas的api只支持一种图像的直接渲染：矩形，所有其他的图形的绘制都至少需要生成一条路径**
	-	**我们没法使用选择器来选到canvas中的图像**
#### 路径容器
-	每次调用路径api时,都会往路径容器里做登记
-	调用beginPath时,清空整个路径容器
#### 样式容器
-	每次调用样式api时,都会往样式容器里做登记
-	调用save时候,将样式容器里的状态压入样式栈
-	调用restor时候,将样式栈的栈顶状态弹出到样式样式容器里,进行覆盖
#### 样式栈
-	调用save时候,将样式容器里的状态压入样式栈
-	调用restor时候,将样式栈的栈顶状态弹出到样式样式容器里,进行覆盖
### **画布api**
	oc.getContext("2d");
	oc.width
	oc.height
### **上下文api**
-	ctx.fillRect(x,y,w,h):填充矩形
-	ctx.strokeRect(x,ymwmh):带边框的矩形
-	ctx.clearRect(0,0,oc.width,oc.height):**清除整个画布**。**清楚时注意原点的位置**
-	ctx.fillStyle
	-	设置图形的填充颜色。
-	ctx.strokeStyle
	-	设置图形轮廓的颜色。
	-	默认情况下，线条和填充颜色都是黑色（CSS 颜色值 #000000）
-	ctx.lineWidth
	-	置当前绘线的粗细。属性值必须为正数,默认值是1.0
-	ctx.lineCap	
	-	**指定线段末端的结束方式**。
		-	butt  :线段末端以方形结束。 
		-	round :线段末端以圆形结束
		-	square:线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域
		-	默认值是 butt。
-	ctx.lineJoin
	-	**设定线条与线条间接合处的样式**（默认是 miter）
		-	round : 圆角
		-	bevel : 斜角
		-	miter : 直角
-	ctx.moveTo(x,y):将画笔抬起点到x，y处
-	ctx.lineTo(x,y):将画笔移到x，y处
-	ctx.rect(x,y,w,h)
-	ctx.arc(x,y,r,degS,degE,dir)
-	ctx.arcTo(x1,y1,x2,y2,r):2个坐标，一个半径
	-	结合moveTo(x,y)方法使用，
	-	x,y:起始点
	-	x1,y1：控制点
	-	x2,y2：结束点
-	ctx.quadraticCurveTo(x1,y1,x2,y2)
	-	结合moveTo(x,y)方法使用，
	-	x,y:起始点
	-	x1,y1：控制点
	-	x2,y2：结束点
	-	必须经过起点和终点
-	ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
	-	结合moveTo(x,y)方法使用，
	-	x,y:起始点
	-	x1,y1：控制点
	-	x2,y2：控制点
	-	x3，y3：结束点
	-	必须经过起点和终点
-	ctx.fill()
-	ctx.stroke()
-	ctx.beginpath():清除路径容器
-	ctx.closepath():闭合路径
	-	fill自动闭合
	-	stroke需要手动闭合
-	ctx.save()
	-	将画布当前状态(样式相关 变换相关)压入到样式栈中
-	ctx.restore()
	-	将样式栈中栈顶的元素弹到样式容器中
	-	图像最终渲染依赖于样式容器
-	**变换**
	-	ctx.translate(x,y):将原点按当前坐标轴位移x，y个单位
		-	**在canvas中translate是累加的**
	-	ctx.rotate(弧度):
		-	将坐标轴按顺时针方向进行旋转
		-	旋转的中心点始终是 canvas 的原点，如果要改变它，我们需要用到 translate 方法
		-	**在canvas中rotate是累加的**
	-	ctx.scale(因子):
		-	分别是横轴和纵轴的缩放因子，它们都必须是正值。值比 1.0 小表示缩小，比 1.0 大则表示放大，值为 1.0 时什么效果都没有。
		-	放大：放大画布，画布中的一个css像素所占据的物理面积变大，画布中包含的css像素的个数变少,画布中图像所包含的css像素的个数不变
		-	缩小：缩小画布，画布中的一个css像素所占据的物理面积变小，画布中包含的css像素的个数变多,画布中图像所包含的css像素的个数不变
		-	**在canvas中scale是累称的**
### **画矩形**
-	ctx.fillRect(x, y, width, height);
	-	充矩形
-	ctx.strokeRect(x, y, width, height);
	-	描边矩形
-	clearRect(x, y, width, height)
	-	清除指定矩形区域，让清除部分完全透明，注意原点的位置
### **绘制圆形**
-	ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	-	startAngle，圆弧的起始点， x轴方向开始计算，单位以弧度表示。
	-	endAngle，圆弧的终点， 单位以弧度表示。
	-	anticlockwise 可选的Boolean值 ，如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
### **绘制圆弧路径**
-	ctx.arcTo(x1, y1, x2, y2, radius);
-	根据当前描点与给定的控制点1连接的直线，和控制点1与控制点2连接的直线，作为使用指定半径的圆的切线，画出两条切线之间的弧线路径
### **画曲线(贝塞尔)**
-	**二次贝塞尔**
	-	ctx.quadraticCurveTo(cpx, cpy, x, y)
	-	cp1x,cp1y为一个控制点，x,y为结束点。
	-	起始点为moveto时指定的点
-	**三次贝塞尔**
	-	bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
	-	绘制三次贝塞尔曲线，cp1x,cp1y为控制点一，cp2x,cp2y为控制点二，x,y为结束点。
	-	起始点为moveto时指定的点
### **引入图片**
-	ctx.drawImage(img,x,y,w,h)
	-	在canvas中引入图片一定在图片加载完成之后再去操作
		-	即`img.onload=function(){draw(this);}`，具体的操作写在draw方法中
###	**使用背景**
-	ctx.createPattern(image, repetition);
	-	repetition指定如何重复图像
		-	repeat
		-	repeat-x
		-	repeat-y
		-	no-repeat
-	使用指定的图像 (CanvasImageSource)创建模式的方法。 它通过repetition参数在指定的方向上重复元图像。此方法返回一个CanvasPattern对象。
	<pre>
	<code>
	window.onload=function(){
		var canvas = document.querySelector("#test");
		if(canvas.getContext){
			var ctx = canvas.getContext("2d");
				
			var img = new Image();
			img.src="tg.png";
			img.onload=function(){
				draw();
			}
			function draw(){
				var pattern = ctx.createPattern(img,"no-repeat")
				ctx.fillStyle=pattern;
				ctx.fillRect(0,0,300,300);
			}
			
		}
	}
	</code>
	</pre>
###	**使用线性渐变**
-	ctx.createLinearGradient(x0, y0, x1, y1);
-	使用方法：
<pre>
<code>
window.onload=function(){
	var canvas = document.querySelector("#test");
	if(canvas.getContext){
		var ctx = canvas.getContext("2d");

			var gradient =  ctx.createLinearGradient(0, 0, 200, 200);
			gradient.addColorStop(0,"red");
			gradient.addColorStop(0.5,"yellow");
			gradient.addColorStop(0.7,"pink");
			gradient.addColorStop(1,"green");
			ctx.fillStyle=gradient;
			ctx.fillRect(0,0,300,300);
	}
}
</code>
</pre>
###	**使用径向渐变**
-	ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
-	根据参数确定两个圆的坐标以及半径，绘制放射性渐变的方法，
-	使用方法同线性渐变
###	**绘制文本**
-	ctx.measureText(text)
	-	被测量文本TextMetrics 对象包含的信息（例如它的宽度）
-	ctx.fillText(text, x, y [, maxWidth])
	-	在 (x, y)位置填充文本
-	ctx.strokeText()
	-	在 (x, y)位置给文本描边
-	ctx.font
	-	设置文本字体
-	ctx.textAlign
	-	textAlign的值为center时候文本的居中是基于你在fillText的时候所给的x的值，也就是说文本一半在x的左边，一半在x的右边（**可以理解为计算x的位置时从默认文字的左端，改为文字的中心，因此你只需要考虑x的位置即可**）。所以，**如果你想让文本在整个canvas居中，就需要将fillText的x值设置成canvas的宽度的一半。**
-	ctx.textBaseline
	-	文本的基线
-	shadowOffsetX = float
	-	阴影水平偏移距离
-	shadowOffsetY = float
	-	阴影垂直偏移距离
-	shadowBlur = float
	-	模糊效果程度
-	shadowColor = color(必需项)
	-	注意:只有设置shadowColor属性值为不透明，阴影才会被绘制
### **写canvas的时候建议的代码格式套路**
<pre>
<code>
var canvas = document.querySelector("#test");
	if(canvas.getContext){
		var ctx = canvas.getContext("2d");
		//第一个图
		ctx.save();
		//设置样式的代码
		//save  restore成对出现
		ctx.beginPath();
		//设置路径的代码
		ctx.stroke()//或者ctx.fill()
		ctx.restore();
		//第一个图画完了
		//第二个图				
		ctx.save();
		//设置样式的代码
		ctx.beginPath();
		//设置路径的代码
		ctx.stroke()//或者ctx.fill()
		ctx.restore();
		//第二个图画完了
		}
</code>
</pre>
### **像素操作**
-	ImageData ctx.getImageData(sx, sy, sw, sh);
	-	用来描述canvas区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为sw、高为sh
	-	IndexSizeError如果高度或者宽度变量为0，则抛出错误。
-	imageData
	-	width:横向上像素点的个数
	-	height:纵向上像素点的个数
	-	data:数组,存放每一个像素点的rgba信息
	<pre>
	<code>
	window.onload=function(){
		var canvas = document.querySelector("#test");
		if(canvas.getContext){
			var ctx = canvas.getContext("2d");		
		/*imageData
			width:横向上像素点的个数
			height:纵向上像素点的个数
			data:数组
				每一个像素点的rgba信息
		*/
			//默认创建出来 rgba(0,0,0,0)
			var imageData = ctx.createImageData(100,100);
			for(var i=0;i< imageData.data.length;i++){
				imageData.data[4*i+3]=255;
			}
			ctx.putImageData(imageData,100,100)
		}
	}
	</code>
	</pre>
###	**实现签名**
###	**实现时钟**
##	**音视频**
-	**音视频标签**
-	**实现播放器**	

##	**其他新增标签与属性**
