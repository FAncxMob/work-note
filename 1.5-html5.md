# HTML5
<!-- TOC -->

- [HTML5](#html5)
    - [**新增标签与属性**](#新增标签与属性)
    - [**attr&prop**](#attrprop)
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
        - [**单像素操作**](#单像素操作)
        - [**全局透明度的设置**](#全局透明度的设置)
        - [**覆盖合成**](#覆盖合成)
        - [将画布导出为图像](#将画布导出为图像)
        - [事件操作](#事件操作)
        - [**实现签名**](#实现签名)
        - [**实现时钟**](#实现时钟)
        - [**飞鸟动画**](#飞鸟动画)
        - [**实现马赛克**](#实现马赛克)
        - [**刮刮卡**](#刮刮卡)
    - [**音视频**](#音视频)
        - [**音频&视频**](#音频视频)
        - [**音视频标签**](#音视频标签)
        - [video标签的属性](#video标签的属性)
        - [audio标签的属性](#audio标签的属性)
        - [音视频js相关属性](#音视频js相关属性)
        - [音视频js相关函数](#音视频js相关函数)
        - [js相关事件](#js相关事件)
        - [class操作函数](#class操作函数)
        - [全屏实现](#全屏实现)
        - [video写法](#video写法)
    - [其他新增标签与属性](#其他新增标签与属性)
        - [状态标签](#状态标签)
        - [列表标签](#列表标签)
        - [注释标签](#注释标签)
        - [标记标签](#标记标签)
    - [疯狂的表单](#疯狂的表单)
        - [新增表单控件](#新增表单控件)
        - [新增表单属性](#新增表单属性)
        - [表单验证反馈](#表单验证反馈)
        - [关闭验证](#关闭验证)

<!-- /TOC -->
##	**新增标签与属性**
- **DOCTYPE和浏览器渲染模式**
    -	DOCTYPE，或者称为 Document Type Declaration（文档类型声明，缩写 DTD）
    -	通常情况下，DOCTYPE 位于一个 HTML 文档的最前面的位置，位于根元素 HTML 的起始标签之前。因为浏览器必须在解析 HTML 文档正文之前就确定当前文档的类型，以决定其需要采用的渲染模式，不同的渲染模式会影响到浏览器对于 CSS 代码甚至 JavaScript 脚本的解析
    -	到目前为止，各浏览器主要包含了三种模式。在 HTML5 草案中，更加明确的规定了模式的定义：
    -	在现代主流浏览器中，其实怪异模式的渲染和标准与几乎标准间没有太大的差别（ie9+ 谷歌 火狐 ...）
    -	ie5.5之前都是ie自己的渲染模式，怪异模式
    -	ie6才开始慢慢支持标准，标准模式，在ie6 中怪异和标准模式的区别最大
    -	ie7 8 9都是基于标准模式升级的，他们理论上存在怪异模式
    -	HTML5提供的<DOCTYPE html>是标准模式，向后兼容的,等同于开启了标准模式，那么浏览器就得老老实实的按照W3C的 标准解析渲染页面
        -	一个不含任何 DOCTYPE 的网页将会以 怪异(quirks) 模式渲染。
-  **DTD**
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
- **新增的语义化标签**
    -   `<hgroup></hgroup>`
        -    hgroup元素代表 网页 或 section 的标题，当元素有多个层级时，该元素可以将h1到h6元素放在其内，譬如文章的主标题和副标题的组合
        -   hgroup使用注意：
			如果只需要一个h1-h6标签就不用hgroup
			如果有连续多个h1-h6标签就用hgroup
			如果有连续多个标题和其他文章数据，h1-h6标签就用hgroup包住，和其他文章元数据一起放入header标签
    -   `<header></header>`
        -   header 元素代表 网页 或 section 的页眉。
        -   header使用注意：
			可以是“网页”或任意“section”的头部部分
			没有个数限制。
			如果hgroup或h1-h6自己就能工作的很好，那就不要用header。
    -    `<nav></nav>`
         -   nav元素代表页面的导航链接区域。用于定义页面的主要导航部分。
         -   nav使用注意：
			用在整个页面主要导航部分上，不合适就不要用nav元素；
    -   `<section></section>`
        -   section元素代表文档中的 节 或 段，段可以是指一篇文章里按照主题的分段；节可以是指一个页面里的分组。
        -   section使用注意：
			section不是一般意义上的容器元素，如果想作为样式展示和脚本的便利，可以用div。
			article、nav、aside可以理解为特殊的section，
			所以如果可以用article、nav、aside就不要用section，没实际意义的就用div
    -   `<article></article>`
        -    article元素最容易跟section和div容易混淆，其实article代表一个在文档，页面或者网站中自成一体的内容
        -   article使用注意：
            -	独立文章：用article
            -	单独的模块：用section
            -	没有语义的：用div
    -   `<aside></aside>`
        -   aside元素被包含在article元素中作为主要内容的附属信息部分，其中的内容可以是与当前文章有关的相关资料、标签、名次解释等
        -   aside使用总结：
			aside在article内表示主要内容的附属信息，
			在article之外则可做侧边栏
			如果是广告，其他日志链接或者其他分类导航也可以用
    -   `<footer></footer>`
        -   footer元素代表 网页 或 section 的页脚，通常含有该节的一些基本信息，譬如：作者，相关文档链接，版权资料。
        -   footer使用注意：
			可以是 网页 或任意 section 的底部部分；
			没有个数限制，除了包裹的内容不一样，其他跟header类似。
            
- **什么是Html5**
    -	HTML5 是定义 HTML 标准的最新的版本。 该术语表示两个不同的概念：
        -	它是一个新版本的HTML语言，具有新的元素，属性和行为，
        -	它有更大的技术集，允许更多样化和强大的网站和应用程序。
        -	这个集合有时称为HTML5和朋友，通常缩写为HTML5。
        
    -	**HTML5     约等于     HTML + CSS + JS**
            
- **Html5优势**
    -	跨平台(实际上是跨浏览器):唯一一个通吃PC MAC Iphone Android等主流平台的跨平台语言
    -	快速迭代
    -	降低成本
    -	导流入口多
    -	分发效率高
- **H5中的根元素**
    -	`<html></html>`
- **MIME类型**
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
    -	`<meta charset="UTF-8">:`告诉浏览器你应该使用哪种编码来解析网页
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
-   ctx.putImageData(imgdata,x,y)
-	ctx.createImageData(w,h)
	-	返回的是imgdata对象 默认像素点的信息是rgba(0,0,0,0)
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
### **单像素操作**
-   获取单像素的颜色
    <pre>
    <code>
    function setPxInfo(imgdata,x,y,color){
        var data = imgdata.data;
        var w = imgdata.width;
        var h = imgdata.height;
        
        //(x,y)  x*w+y   x:多少列  y：多少行
        //r
        data[(y*w+x)*4]=color[0];
        //g
        data[(y*w+x)*4+1]=color[1];
        //b
        data[(y*w+x)*4+2]=color[2];
        //a
        data[(y*w+x)*4+3]=color[3];
    }
    </code>
    </pre>
-   设置单像素的颜色
    <pre>
    <code>
    function getPxInfo(imgdata,x,y){
		var color = [];
		
		var data = imgdata.data;
		var w = imgdata.width;
		var h = imgdata.height;
		
		//(x,y)  y*w+x
		//r
		color[0]=data[(y*w+x)*4];
		//g
		color[1]=data[(y*w+x)*4+1];
		//b
		color[2]=data[(y*w+x)*4+2];
		//a
		color[3]=data[(y*w+x)*4+3];
		
		return color;
			}
    </code>
    </pre>
### **全局透明度的设置**
	globalAlpha = value
		这个属性影响到 canvas 里所有图形的透明度，
		有效的值范围是 0.0 （完全透明）到 1.0（完全不透明）
		默认是 1.0
		
### **覆盖合成**
	source:新的图像(源)
	destination:已经绘制过的图形(目标)

	globalCompositeOperation
		source-over(默认值):源在上面,新的图像层级比较高
		source-in  :只留下源与目标的重叠部分(源的那一部分)
		source-out :只留下源超过目标的部分
		source-atop:砍掉源溢出的部分
		
		destination-over:目标在上面,旧的图像层级比较高
		destination-in:只留下源与目标的重叠部分(目标的那一部分)
		destination-out:只留下目标超过源的部分
		destination-atop:砍掉目标溢出的部分  
### 将画布导出为图像
-	toDataURL(注意是canvas元素接口上的方法)
### 事件操作
-	ctx.isPointInPath(x, y)
	-	判断在当前路径中是否包含检测点
		-	x:检测点的X坐标
		-	y:检测点的Y坐标
	
	注意，此方法只作用于最新画出的canvas图像
###	**实现签名**
-   [签名.html](http://localhost:63342/%E2%88%9A%E5%B0%9A%E7%A1%85%E8%B0%B7HTML5%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E6%95%99%E7%A8%8B/HTML5%E6%A0%B8%E5%BF%83%E8%AF%BE%E4%BB%B6%E3%80%81%E8%B5%84%E6%96%99%E3%80%81%E6%BA%90%E7%A0%81/code/day10/canvas/03_%E7%BB%98%E5%88%B6%E8%B7%AF%E5%BE%84/08_%E7%AD%BE%E5%90%8D.html?_ijt=2fuqq5ip38qhf0879uot0d1fe8)
###	**实现时钟**
-   结合了所有基础api
-   [时钟.html](http://localhost:63342/%E2%88%9A%E5%B0%9A%E7%A1%85%E8%B0%B7HTML5%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E6%95%99%E7%A8%8B/HTML5%E6%A0%B8%E5%BF%83%E8%AF%BE%E4%BB%B6%E3%80%81%E8%B5%84%E6%96%99%E3%80%81%E6%BA%90%E7%A0%81/code/day09/canvas/06_%E6%97%B6%E9%92%9F/FCXcanvas%E6%97%B6%E9%92%9F.html?_ijt=9il6b07hnlct5hq15s7n66942)
###	**飞鸟动画**
-   结合图片创建动画
-   [飞鸟动画.html](http://localhost:63342/%E2%88%9A%E5%B0%9A%E7%A1%85%E8%B0%B7HTML5%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E6%95%99%E7%A8%8B/HTML5%E6%A0%B8%E5%BF%83%E8%AF%BE%E4%BB%B6%E3%80%81%E8%B5%84%E6%96%99%E3%80%81%E6%BA%90%E7%A0%81/code/day10/canvas/08_%E9%A3%9E%E9%B8%9F/bird.html?_ijt=hpne8j2h3v6h0kr5hemco61kkj)
### **实现马赛克**
-   像素操作
-   选取一个马赛克矩形
-   从马赛克矩形中随机抽出一个像素点的信息(rgba)
-   将整个马赛克矩形中的像素点信息统一调成随机抽出的那个
-   [马赛克.html](http://localhost:63342/%E2%88%9A%E5%B0%9A%E7%A1%85%E8%B0%B7HTML5%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E6%95%99%E7%A8%8B/HTML5%E6%A0%B8%E5%BF%83%E8%AF%BE%E4%BB%B6%E3%80%81%E8%B5%84%E6%96%99%E3%80%81%E6%BA%90%E7%A0%81/code/day10/canvas/10_%E5%83%8F%E7%B4%A0%E6%93%8D%E4%BD%9C/04_%E9%A9%AC%E8%B5%9B%E5%85%8B.html?_ijt=8vb5gart9m2p9ffo6heim6jnst)
### **刮刮卡**
-   合成+像素操作
-   [刮刮卡.html](http://localhost:63342/%E2%88%9A%E5%B0%9A%E7%A1%85%E8%B0%B7HTML5%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E6%95%99%E7%A8%8B/HTML5%E6%A0%B8%E5%BF%83%E8%AF%BE%E4%BB%B6%E3%80%81%E8%B5%84%E6%96%99%E3%80%81%E6%BA%90%E7%A0%81/code/day10/canvas/11_%E5%90%88%E6%88%90/04_%E5%88%AE%E5%88%AE%E5%8D%A1(%E4%BC%98%E5%8C%96).html?_ijt=jc8eeabdd114pqkoccut7lm5fi)
##	**音视频**

### **音频&视频**
	大家都有在网页中浏览视频的经历，但在Html5之前，对视频乃至音频都还没有一个标准
	因此在网页中看到的视频，都是通过第三插件的方式嵌入的，可能是QuickTime，也可能是
	RealPlayer 或者 Flash。浏览器很好的整合了这些插件，你完全意识不到它们的存在
	
	在介绍Html5中的音视频标签前，需要了解一些概念

-	容器

	    大多数人会认为视频文件就是 .avi .mp4,但事实上 avi和mp4仅仅是容器的格式，
	    它只决定怎么将视频存储起来，而不关系存储的内容。有点类似于.zip
		不管是音频文件或视频文件，实际上都只是一个容器文件。这点类似于压缩了一组文件的ZIP文件
		视频文件（视频容器）包含了音频轨道、视频轨道和其他一些元数据。
		视频播放的时候，音频轨道和视频轨道是绑定在一起的。
		元数据包含了视频的封面、标题、子标题、字幕等相关信息。
    
        主流的视频文件格式(容器格式)                       主流的音频文件格式
			MPEG-4:            通常以.mp4为扩展名          MPEG-3  	.mp3
			Flash视频:         通常以.flv为扩展名          Acc音频   .acc
			Ogg:               通常以.ogv为扩展名          Ogg音频 	.ogg
			WebM:              通常以.webm为扩展名
			音频视频交错: 通常以.avi为扩展名
							
-   编解码器
		
        音频和视频编码/解码是一组算法，用来对一段特定音频或视频进行解码和编码，以便
		音频和视频能够播放。原始的媒体文件体积非常巨大，如果不对其进行编码，那么数据量是
		非常惊人的，在互联网上传播则要耗费无法忍受的时间；如果不对其进行解码，就无法将编
		码后的数据重组为原始的媒体数据
		
		      视频编解码器                        音频编解码器			 
				H.264                            AAC
				VP8                              MPEG-3
				Ogg Theora                       Ogg Vorbis
			
			H.264： 别名 MPEG-4的第十部分,由MPEG研发并于2003年标准化
				它的目的支持一切设备，无论是低带宽低cpu，还是高带宽高cpu 或者是两者之间。
				要做到这一点，H.264标准被分成不同的几种配置。高配置使用了更多特性，
				这会导致在解码过程中更加消耗CPU，但视频文件本身会更小，视频效果也更好 
								  
				苹果iphone手机         基本配置(BaseLine)
				正常的电视机支持        基本配置(BaseLine) 和 主配置(Main)两种
				正常的电脑支持          基本配置(BaseLine) 和 主配置(Main) 高级配置(high)三种
								   
			
		当然有一些编解码器受专利的保护，有一些则是免费的，例如Ogg的Vorbis音频编解码器。
		Ogg的Theora视频编解码器也是可以免费使用的。而想使用H.264的话就需要支付相关的费用了
		
		现在的视频编解码器会使用各种技巧减少从一帧到另一帧过程中传递的信息数量，它们不会存储每一帧的
		所有信息，而只是存储两帧之间的差异信息。
		编码器也分有损和无损，无损视频文件一般太大，在网页中没有优势，所以我们重点研究有损编解码器。
		有损编解码器中，信息在编码过程中丢失是无法避免的，反复的对视频编码会导致其画面不均匀。
		
-   浏览器对于容器和编解码器支持的情况

		Browser						MP4(H.264 + AAC)	WebM(VP8 + Vorbis )		Ogg(Theora + Vorbis)
		Internet Explorer 9				YES						NO					NO
		Firefox 4.0						NO						YES					YES
		Google Chrome 					YES						YES					YES
		Apple Safari 5					YES						NO					NO
		Opera 10.6						NO						YES					YES
		
		http://www.html5videoplayer.net/html5video/html5-video-browser-compatibility/
		目前还没有一种编解码和容器的组合能应用于所有的浏览器中！！！
		
-   处理视频的一个流程

		1. 制作一个Ogg容器中使用Theora视频和Vorbis音频的版本
		2. 制作另外一个版本，使用WebM视频容器（VP8 + Vorbis）
		3. 再制作一个版本，使用MP4视频容器，并使用H.264基本配置的视频和ACC低配的音频
		4. 链接上面3个文件到同一个video元素，并向后兼容基于Flash的视频播放器	
		
		
-   格式转化

		用 FFmpeg 制作MP4 视频
			ffmpeg -i test.mp4 -c:v libx264 -s 1280x720 -b:v 1500k -profile:v high -level 3.1 -c:a aac -ac 2 -b:a 160k -movflags faststart OUTPUT.mp4
		
		用 FFmpeg 制作 WebM 视频
			ffmpeg -i test.mp4 -c:v libvpx -s 1280x720 -b:v 1500k -c:a libvorbis -ac 2 -b:a 160k OUTPUT.webm
		
		FFmpeg 制作 Ogg 视频
			ffmpeg -i test.mp4 -c:v libtheora -s 1280x720 -b:v 1500k -c:a libvorbis -ac 2 -b:a 160k OUTPUT.ogv
		
		FFmpeg 制作Mp3音频
			ffmpeg -i test.mp3 -c:a libmp3lame -ac 2 -b:a 160k OUTPUT.mp3
			
		FFmpeg 制作Ogg音频
			ffmpeg -i test.mp3 -c:a libvorbis -ac 2 -b:a 160k OUTPUT.ogg
		
		FFmpeg 制作ACC音频	
			ffmpeg -i test.mp3 -c:a aac -ac 2 -b:a 160k OUTPUT.aac


### **音视频标签**

	<video>:Html5提供的播放视频的标签
		src:资源地址
		controls:该属性定义是显示还是隐藏用户控制界面
		
	<audio>:Html5提供的播放音频的标签
		src:资源地址
		controls:该属性定义是显示还是隐藏用户控制界面
		
	<source>
		视频：
		type='video/webm; codecs="vp8, vorbis"'
		type='video/ogg; codecs="theora, vorbis"'
		type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
		
		音频：
		type='audio/ogg; codecs="vorbis"'
		type='audio/aac; codecs="aac"'
		type='audio/mpeg'
		
### video标签的属性

	width  :视频显示区域的宽度，单位是CSS像素
	height :视频展示区域的高度，单位是CSS像素
	poster :一个海报帧的URL，用于在用户播放或者跳帧之前展示
	
	src       :  要嵌到页面的视频的URL
	controls  :  显示或隐藏用户控制界面
	autoplay  :  媒体是否自动播放
	loop  	  :  媒体是否循环播放
	muted  	  :  是否静音
	preload   :  该属性旨在告诉浏览器作者认为达到最佳的用户体验的方式是什么
					none: 提示作者认为用户不需要查看该视频，服务器也想要最小化访问流量；
						      换句话说就是提示浏览器该视频不需要缓存。
					metadata: 提示尽管作者认为用户不需要查看该视频，
							     不过抓取元数据（比如：长度）还是很合理的。
					auto: 用户需要这个视频优先加载；换句话说就是提示：如果需要的话，
						     可以下载整个视频，即使用户并不一定会用它。
					空字符串：也就代指 auto 值。
					
### audio标签的属性	

	src		  
	controls  
	autoplay  
	loop  	  
	muted  	  
	preload   
	
	
### 音视频js相关属性

	duration    :  媒体总时间(只读)
	currentTime :  开始播放到现在所用的时间(可读写)
	muted       :  是否静音(可读写,相比于volume优先级要高)
	volume      :  0.0-1.0的音量相对值(可读写)
	paused      :  媒体是否暂停(只读)
	ended       :  媒体是否播放完毕(只读)
	error       :  媒体发生错误的时候，返回错误代码 (只读)
	currentSrc  :  以字符串的形式返回媒体地址(只读)
	
	
	视频多的部分:
		poster  :   视频播放前的预览图片(读写)
		width、height  :   设置视频的尺寸(读写)
		videoWidth、 videoHeight  :   视频的实际尺寸(只读)


### 音视频js相关函数

	play()  :  媒体播放
	pause()  :  媒体暂停
	load()  :  重新加载媒体

### js相关事件

	视频:
		abort	 在播放被终止时触发,例如, 当播放中的视频重新开始播放时会触发这个事件。
		canplay	在媒体数据已经有足够的数据（至少播放数帧）可供播放时触发。这个事件对应CAN_PLAY的readyState。
		canplaythrough	在媒体的readyState变为CAN_PLAY_THROUGH时触发，表明媒体可以在保持当前的下载速度的情况下不被中断地播放完毕。注意：手动设置currentTime会使得firefox触发一次canplaythrough事件，其他浏览器或许不会如此。
		durationchange	元信息已载入或已改变，表明媒体的长度发生了改变。例如，在媒体已被加载足够的长度从而得知总长度时会触发这个事件。
		emptied	媒体被清空（初始化）时触发。
		ended	播放结束时触发。
		error	在发生错误时触发。元素的error属性会包含更多信息。参阅Error handling获得详细信息。
		loadeddata	媒体的第一帧已经加载完毕。
		loadedmetadata	媒体的元数据已经加载完毕，现在所有的属性包含了它们应有的有效信息。
		loadstart	在媒体开始加载时触发。
		mozaudioavailable	当音频数据缓存并交给音频层处理时
		pause	播放暂停时触发。
		play	在媒体回放被暂停后再次开始时触发。即，在一次暂停事件后恢复媒体回放。
		playing	在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。
		progress	告知媒体相关部分的下载进度时周期性地触发。有关媒体当前已下载总计的信息可以在元素的buffered属性中获取到。
		ratechange	在回放速率变化时触发。
		seeked	在跳跃操作完成时触发。
		seeking	在跳跃操作开始时触发。
		stalled	在尝试获取媒体数据，但数据不可用时触发。
		suspend	在媒体资源加载终止时触发，这可能是因为下载已完成或因为其他原因暂停。
		timeupdate	元素的currentTime属性表示的时间已经改变。
		volumechange	在音频音量改变时触发（既可以是volume属性改变，也可以是muted属性改变）.。
		waiting	在一个待执行的操作（如回放）因等待另一个操作（如跳跃或下载）被延迟时触发

	音频:
		abort	 在播放被终止时触发,例如, 当播放中的视频重新开始播放时会触发这个事件。
		canplay	在媒体数据已经有足够的数据（至少播放数帧）可供播放时触发。这个事件对应CAN_PLAY的readyState。
		canplaythrough	在媒体的readyState变为CAN_PLAY_THROUGH时触发，表明媒体可以在保持当前的下载速度的情况下不被中断地播放完毕。注意：手动设置currentTime会使得firefox触发一次canplaythrough事件，其他浏览器或许不会如此。
		durationchange	元信息已载入或已改变，表明媒体的长度发生了改变。例如，在媒体已被加载足够的长度从而得知总长度时会触发这个事件。
		emptied	媒体被清空（初始化）时触发。
		ended	播放结束时触发。
		error	在发生错误时触发。元素的error属性会包含更多信息。参阅Error handling获得详细信息。
		loadeddata	媒体的第一帧已经加载完毕。
		loadedmetadata	媒体的元数据已经加载完毕，现在所有的属性包含了它们应有的有效信息。
		loadstart	在媒体开始加载时触发。
		mozaudioavailable	当音频数据缓存并交给音频层处理时
		pause	播放暂停时触发。
		play	在媒体回放被暂停后再次开始时触发。即，在一次暂停事件后恢复媒体回放。
		playing	在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。
		progress	告知媒体相关部分的下载进度时周期性地触发。有关媒体当前已下载总计的信息可以在元素的buffered属性中获取到。
		ratechange	在回放速率变化时触发。
		seeked	在跳跃操作完成时触发。
		seeking	在跳跃操作开始时触发。
		stalled	在尝试获取媒体数据，但数据不可用时触发。
		suspend	在媒体资源加载终止时触发，这可能是因为下载已完成或因为其他原因暂停。
		timeupdate	元素的currentTime属性表示的时间已经改变。
		volumechange	在音频音量改变时触发（既可以是volume属性改变，也可以是muted属性改变）.。
		waiting	在一个待执行的操作（如回放）因等待另一个操作（如跳跃或下载）被延迟时触发
-	**实现播放器**	
    -  功能点逻辑
    
            播放按钮点击时:
                切换播放按钮的样式
                控制视频的播放暂停
                    播放:控制进度条的前进(通过开启定时器来实现)
                    暂停:要关闭定时器不让进度条前进
                    
            停止按钮点击时
                切换播放按钮的样式
                控制视频暂停
                    暂停:要关闭定时器不让进度条前进
                进度条重置为0
                视频时间调整为0
                
            拖拽时根据拖拽距离控制视频时间
            
            点击进度条时,根据点击位置控制视频时间
                点击进度条时,默认就应该是播放操作
                切换播放按钮的样式
                控制视频的播放
                    :控制进度条的前进:通过开启定时器来实现
### class操作函数
<pre>
<code>
	function addClass(node,className){
		var reg=new RegExp("\\b"+className+"\\b");
		if(!reg.test(node.className)){
			node.className +=(" "+className); 
		}
	}
	function removeClass(node,className){
		if(node.className){
			var reg=new RegExp("\\b"+className+"\\b");
			var classes = node.className;
			node.className=classes.replace(reg,"");
			if(/^\s*$/g.test(node.className)){
				node.removeAttribute("class");
			}
		}else{
			node.removeAttribute("class");
		}
	}
</code>
</pre>
### 全屏实现
<pre>
<code>
full.onclick=function() {
    if(isFullScreen) {
        isFullScreen = false
        if (document.exitFullscreen) {  
            document.exitFullscreen();  
        }  
        else if (document.mozCancelFullScreen) {  
            document.mozCancelFullScreen();  
        }  
        else if (document.webkitCancelFullScreen) {  
            document.webkitCancelFullScreen();  
        }
        else if (document.msExitFullscreen) {
                document.msExitFullscreen();
        }
    } else {
        isFullScreen = true
        var docElm = document.documentElement;
        //W3C  
        if (docElm.requestFullscreen) {  
            docElm.requestFullscreen();  
        }
        //FireFox  
        else if (docElm.mozRequestFullScreen) {  
            docElm.mozRequestFullScreen();  
        }
        //Chrome等  
        else if (docElm.webkitRequestFullScreen) {  
            docElm.webkitRequestFullScreen();  
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    }
}
</code>
</pre>
### video写法
    <video width="800" height="">
		<source src="myvideo.mp4" type="video/mp4"></source>
		<source src="myvideo.ogv" type="video/ogg"></source>
		<source src="myvideo.webm" type="video/webm"></source>
		<object width="" height="" type="application/x-shockwave-flash" data="myvideo.swf">
			<param name="movie" value="myvideo.swf" />
			<param name="flashvars" value="autostart=true&amp;file=myvideo.swf" />
		</object>
		当前浏览器不支持 video直接播放，点击这里下载视频： <a href="myvideo.webm">下载视频</a>
	</video>
## 其他新增标签与属性
### 状态标签
-	meter:用来显示已知范围的标量值或者分数值。
		value:当前的数值。
		min:值域的最小边界值。如果设置了，它必须比最大值要小。如果没设置，默认为0
		max:值域的上限边界值。如果设置了，它必须比最小值要大。如果没设置，默认为1
		low:定义了低值区间的上限值,如果设置了，它必须比最小值属性大，并且不能超过high值和最大值。未设置或者比最小值还要小时，其值即为最小值。
		high:定义了高值区间的下限值。如果设置了，它必须小于最大值，同时必须大于low值和最小值。如果没有设置，或者比最大值还大，其值即为最大值。
		optimum:这个属性用来指示最优/最佳取值。

-	progress:用来显示一项任务的完成进度
		max:该属性描述了这个progress元素所表示的任务一共需要完成多少工作.
		value：该属性用来指定该进度条已完成的工作量.
				如果没有value属性,则该进度条的进度为"不确定",
				也就是说,进度条不会显示任何进度,你无法估计当前的工作会在何时完成

### 列表标签
-	datalist:datalist会包含一组option元素，这些元素表示其表单控件的可选值
				它的id必须要和input中的list一致
	
-	details: 一个ui小部件，用户可以从其中检索附加信息。
			open属性来控制附加信息的显示与隐藏
-	summary:用作 一个`<details>`元素的一个内容摘要（标题）
	
### 注释标签
	ruby
	rt: 展示文字注音或字符注释。
	
### 标记标签
	marK:着重
## 疯狂的表单
	Html5 Forms概述,在Html5中:
		1.表单仍然使用<form>元素作为容器,我们可以在其中设置基本的提交特性
			form的action指向一个服务器地址（接口）
		2.当用户或开发人员提交页面时,表单仍然用于向服务端发送表单中控件的值
			注意表单项的name属性必须有值，服务器才能获取表单
		3.所有之前的表单控件都保持不变
		4.仍然可以使用脚本操作表单控件
		5.Htnl5之前的表单
			标签为input
				type:text:文本框
				type:password:密码框
				type:radio:单选按钮
					注意以name分组，确保单选关系，也为了后台能成功获取
					必须有value属性，为了后台获取后的识别（不写统一为on）
					checked属性,选中控制
				type:checkbox:复选框
					注意以name分组，确保为一组，也为了后台能成功获取
					必须有value属性，为了后台获取后的识别（不写统一为on）
					checked属性,选中控制
				type:submit:提交按钮
				type:reset:重置按钮
				type:button:普通按钮
			
			标签为select:下拉框
				name属性在select标签上
				multiple:可选多项
				子项可以通过optgroup来进行分组
					label属性用来定义组名
					子项为option标签
						selected属性,选中控制
						必须有value属性,为了后台获取后的识别
			
			标签为textarea:文本域
			
			标签为button:按钮
				type:submit:提交按钮
				type:reset:重置按钮
				type:button:普通按钮
				
			标签为lable:控制文本与表单的关系
				for属性指向一个input的id
				
			标签fieldset 标签legend:来为表单分组	
					
		6.attr & prop
		7.Html5 新增
		
### 新增表单控件
		1.type:email :email地址类型
			当格式不符合email格式时，提交是不会成功的，会出现提示；只有当格式相符时，提交才会通过
			在移动端获焦的时候会切换到英文键盘
			
		2.type:tel :电话类型
			在移动端获焦的时候会切换到数字键盘
		
		3.type:url :url类型
			当格式不符合url格式时，提交是不会成功的，会出现提示；只有当格式相符时，提交才会通过
			
		4.type:search :搜索类型
			有清空文本的按钮
			
		5.type:range  :  特定范围内的数值选择器
			属性:min、max、step
		
		6.
		  type:number          :  只能包含数字的输入框
		  type:color  	       		:  颜色选择器
		  type:datetime        	 :  显示完整日期(移动端浏览器支持)
		  type:datetime-local  :  显示完整日期，不含时区
		  type:time            :  显示时间，不含时区
		  type:date            :  显示日期
		  type:week            :  显示周
		  type:month           :  显示月

			
### 新增表单属性
		placeholder  :  输入框提示信息
			适用于form,以及type为text,search,url,tel,email,password类型的input
			
		autofocus  :  指定表单获取输入焦点
		
		required  :  此项必填，不能为空
		
		pattern : 正则验证  pattern="\d{1,5}
		
		formaction 在submit里定义提交地址
		
		list和datalist  :  为输入框构造一个选择列表
							list值为datalist标签的id
		
		
		
### 表单验证反馈
	validity对象，通过下面的valid可以查看验证是否通过，如果八种验证都通过返回true，一种验证失败返回false
	node.addEventListener("invalid",fn1,false);
	
	valueMissing  	 :  输入值为空时返回true
	typeMismatch 	 :  控件值与预期类型不匹配返回true
	patternMismatch  :  输入值不满足pattern正则返回true
	
	tooLong  		 :  超过maxLength最大限制返回true
	rangeUnderflow   :  验证的range最小值返回true
	rangeOverflow    :  验证的range最大值返回true
	stepMismatch     :  验证range 的当前值 是否符合min、max及step的规则返回true
	
	customError 不符合自定义验证返回true
		setCustomValidity
### 关闭验证
	-	formnovalidate属性
		
		

		
	


