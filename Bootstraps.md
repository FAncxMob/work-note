### Bootstrap栅格系统&源码分析
- **grid.less(bootstrap的入口)**
	- **固体容器**
	<pre>
	<code>
	.container {
		.container-fixed();//调用mixin文件夹下的grid.less混合,定义了固体容器和流体容器的公共样式
		@media (min-width: @screen-sm-min) {
			width: @container-sm;
		}
		@media (min-width: @screen-md-min) {
			width: @container-md;
		}
		@media (min-width: @screen-lg-min) {
			width: @container-lg;
		}
	}
	</code>
	</pre>
	
	- **流体容器**
	<pre>
	<code>
	.container-fluid {
		.container-fixed();//同固体容器，调用mixin文件夹下的grid.less混合,定义了固体容器和流体容器的公共样式
	}
	</code>
	</pre>
	- **行**
	<pre>
	<code>
	.row {
		.make-row();//同固体，流体容器，调用mixin文件夹下的grid.less混合
	}
	</code>
	</pre>
	- **列**
	<pre>
	<code>
	.make-grid-columns();//调用mixin文件夹下的grid-framework.less
	</code>
	</pre>
	- **移动端优先**
	<pre>
	<code>
	// 移动优先	
	.make-grid(xs);
	@media (min-width: @screen-sm-min) {
	.make-grid(sm);
	}
	@media (min-width: @screen-md-min) {
	.make-grid(md);
	}
	@media (min-width: @screen-lg-min) {
	.make-grid(lg);
	}
	</code>
	</pre>

- **variables.less**
	- 存放变量
-	**mixin文件夹中**
	-	grid.less
		- **固体和流体容器的公共样式(.container-fixed 有15px的padding)**
		<pre>
		<code>
		// 固定和流体容器的公共样式
		//@grid-gutter-widt：槽宽(30px)
		.container-fixed(@gutter: @grid-gutter-width) {
			margin-right: auto;
			margin-left: auto;
			padding-left:  floor((@gutter / 2));//向上取整,槽宽的一半
			padding-right: ceil((@gutter / 2));//向下取整,槽宽的一半
			&:extend(.clearfix all);//清除浮动
		}
		</pre>
		</code>
		- **行(.make-row  有-15px的margin)**
		<pre>
		<code>
		.make-row(@gutter: @grid-gutter-width) {
			margin-left:  ceil((@gutter / -2));//负的槽宽的一半
			margin-right: floor((@gutter / -2));//负的槽宽的一半
			&:extend(.clearfix all);//清除浮动
		}
		</code>
		</pre>

		- **grid-framework.less(整个文件都是用来定义列的)**
			- 第一步：(为每个列加15px的padding)
			<code>
			<pre>
			// 列第一步
			.make-grid-columns() {
			//.col(2,".col-xs-1, .col-sm-1, .col-md-1, .col-lg-1")
			.col(@index) { 
				@item: ~".col-xs-@{index}, .col-sm-@{index}, .col-md-@{index}, .col-lg-@{index}";
				.col((@index + 1), @item);
			}
				/*  递归
					.col(3,".col-xs-1, .col-sm-1, .col-md-1, .col-lg-1,.col-xs-2, .col-sm-2, .col-md-2, .col-lg-2")
						....
					.col(13,str)
						str:
							.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1,
							.col-xs-2, .col-sm-2, .col-md-2, .col-lg-2,
							...
							.col-xs-12, .col-sm-12, .col-md-12, .col-lg-12
				*/
			.col(@index, @list) when (@index =< @grid-columns) { 
				@item: ~".col-xs-@{index}, .col-sm-@{index}, .col-md-@{index}, .col-lg-@{index}";
				.col((@index + 1), ~"@{list}, @{item}");//递归
			}
				/*
					.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1,
					.col-xs-2, .col-sm-2, .col-md-2, .col-lg-2,
					...
					.col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{
					position: relative;
					min-height: 1px;
					padding-left: 15px;
					padding-right: 15px;
					}
				*/
			.col(@index, @list) when (@index > @grid-columns) {
				@{list} {//把最终递归完成获得的变量当做选择器来用
				position: relative;
				min-height: 1px;
				padding-left:  ceil((@grid-gutter-width / 2));
				padding-right: floor((@grid-gutter-width / 2));
				}
			}
			.col(1); 
			}
				</code>
				</pre>
			- 第二步：
			<pre>
			<code>
			// 列第二步
				.make-grid(@class) {
					//2.1
					.float-grid-columns(@class);//向左浮动
					//2.2
					.loop-grid-columns(@grid-columns, @class, width);//根据所占的列数为columns分配width
					//2.3(列排序)
					.loop-grid-columns(@grid-columns, @class, pull);//根据所占的列数为columns分配left
					.loop-grid-columns(@grid-columns, @class, push);//根据所占的列数为columns分配right
					//2.4(列偏移)
					.loop-grid-columns(@grid-columns, @class, offset);//根据所占的列数为columns分配margin
				}
				//2.1
				/*
				* .col-xs-1,.col-xs-2,.col-xs-3,.col-xs-4,...col-xs-12{
				*     float: left;
				* }
				* */
				.float-grid-columns(@class) {
				.col(@index) { 
					@item: ~".col-@{class}-@{index}";
					.col((@index + 1), @item);
				}
				.col(@index, @list) when (@index =< @grid-columns) { // general
					@item: ~".col-@{class}-@{index}";
					.col((@index + 1), ~"@{list}, @{item}");
				}
				.col(@index, @list) when (@index > @grid-columns) { // terminal
					@{list} {
					float: left;
					}
				}
				.col(1); 
				}
				//2.2（width） 2.3（pull push） 2.4（offset）的入口
				.loop-grid-columns(@index, @class, @type) when (@index >= 0) {
					.calc-grid-column(@index, @class, @type);
					.loop-grid-columns((@index - 1), @class, @type);
				}
				// 2.2
				/*
				* .col-xs-12{
				*     width:12/12;
				* }
				* .col-xs-11{
				*     width:11/12;
				* }
				* ...
				* .col-xs-1{
				*     width:1/12;
				* } 
				* */
				.calc-grid-column(@index, @class, @type) when (@type = width) and (@index > 0) {
					.col-@{class}-@{index} {
						width: percentage((@index / @grid-columns));
					}
				}
				//2.3
				/*push                  pull:
				* .col-xs-push-12{         .col-xs-pull-12{      
				*     left:12/12;              right:12/12;
				* }                        }
				* .col-xs-push-11{
				*     left:11/12;
				* }
				* ...                      ...
				* .col-xs-push-1{
				*     left:1/12;
				* } 
				* .col-xs-push-0{           .col-xs-pull-0{
				*     left:auto;               right:auto;
				* }                         }
				* */
				.calc-grid-column(@index, @class, @type) when (@type = push) and (@index > 0) {
					.col-@{class}-push-@{index} {
						left: percentage((@index / @grid-columns));
					}
				}
				.calc-grid-column(@index, @class, @type) when (@type = push) and (@index = 0) {
					.col-@{class}-push-0 {
						left: auto;
					}
				}
				.calc-grid-column(@index, @class, @type) when (@type = pull) and (@index > 0) {
					.col-@{class}-pull-@{index} {
						right: percentage((@index / @grid-columns));
					}
				}
				.calc-grid-column(@index, @class, @type) when (@type = pull) and (@index = 0) {
					.col-@{class}-pull-0 {
						right: auto;
					}
				}
				//2.4
				/*
				* .col-xs-offset-12{
				*     margin-left:12/12;
				* }
				* .col-xs-offset-11{
				*     margin-left:11/12;
				* }
				* ...
				* .col-xs-offset-1{
				*     margin-left:1/12;
				* } 
				* .col-xs-offset-0{
				*     margin-left:0;
				* } 
				* */
				.calc-grid-column(@index, @class, @type) when (@type = offset) {
					.col-@{class}-offset-@{index} {
						margin-left: percentage((@index / @grid-columns));
					}
				}
				</code>
				</pre>
	- **clearfix.less**
		<pre>
		<code>
		.clearfix() {//清除浮动
			&:before,
			&:after {
				content: " "; // 1
				display: table; // 2
			}
			&:after {
				clear: both;
			}
		}
		</pre>
		</code>



- 简洁、直观、强悍的前端开发框架，让web开发更迅速、简单
	- 中文网 ： http://www.bootcss.com/
	- 英文网  :  http://getbootstrap.com/
- **容器**
	- 流体布局容器
		-  容器的width为\n，只是两边加了15px的padding。
	- 固定布局
		- 容器的width会随设备分辨率的不同而生产变化
			- 分辨率阈值
			<pre>
			<code>
			w >=1200	 	容器的width为1170   左右padding为15 （注意是borderBox）
			1200>w >=992		容器的width为970     左右padding为15 （注意是borderBox）
			992 > w >=768		容器的width为750     左右padding为15  （注意是borderBox）
			768 > w >=992		容器的width为\n    左右padding为15  （注意是borderBox）
			</code>
			</pre>
			- 行
				- 两侧-15px margin
			- 列的公共样式
				- 两侧有15px 的padding
				- 相对定位
- **栅格系统**
	- col-lg-x    
	- col-md-x
	- col-sm-x
	- col-xs-x
	- x默认拥有12个等级
-	**列偏移**
	- 调整的是margin-left，分13个等级（0到12）
			0时为0%
- **列排序**
	- push的时候调整的是left，分13个等级（0到12）
			0时为\n
			
	- pull的时候调整的是right，分13个等级（0到12）
			0时为\n
- [Bootstrap 栅格系统的精妙之处](https://segmentfault.com/a/1190000000743553)
	- **CONTAINER:**
		- Container 有两个作用：
			- 在随时可能的宽度变化(响应式)中提供宽度限制。当页面宽度变化，container 的宽度也随之变化。并且其中的 column 的宽度是基于百分比，所以他们的值不需要变化。
			- 提供一个水平方向的 padding，使其内部的内容不会接触到浏览器的边界，大小为15px，就是图片中粉红色的部分，作用会在下面说。
		- 注意，不需要也不应该在 container 中嵌套另一个 container。
		- ![container](http://www.helloerik.com/wp-content/uploads/image-1.png)
	- **ROW**
		- Row 是 column 直接存在的容器，按照文档描述 row 中最多可有12个 column，不过可以通过 nesting 的方式灵活扩展。同时作为都是左浮动的 column 的 wrapper，自带 clearfix 的性质。
		- 同时 row 还有一个很特殊的地方，就是左右各有 －15px 的 margin，就是图片中的蓝色部分。这样也就抵消了上面提到的 container 中15px的 padding
		- 注意：千万记住要把 row 放到 container 的内部，这样才能保证正常。
		- ![container](http://www.helloerik.com/wp-content/uploads/image-2.png)
	- **COLUMN**
		- 每个column 也会有15px的水平方向的 padding，也就是图片中黄色的部分
		- colunmn 只能在 row 中生存，由于 row 的 margin 为－15px，那么位于两边的 column 就碰到了 container 的边界。但是 colunmn 本身又有 15px 的 padding 使得它其中的内容并不会碰到 container，同时 不同column的内容之间就有了30px的槽
		- 注意：一定要把 column 放到 row 里使用。
		- ![container](http://www.helloerik.com/wp-content/uploads/image-3.png)
	- **NESTING**
		- 把上面一系列的 container, row, column 都设置好，就可以通过 nesting 扩展它的栅格系统了，也就是在 column 中直接嵌套 row，而不需要再套一层 container
		- ![container](http://www.helloerik.com/wp-content/uploads/image-5.png)
		- container 和 column 都有15px的 padding ，当 nesting 的时候 column 的作用也相当于 container 了，这样就可以实现任意的嵌套了。
		- ![container](http://www.helloerik.com/wp-content/uploads/image-6.png)
---
