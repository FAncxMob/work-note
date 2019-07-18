### CSS预处理器less
*	**less是一种动态样式语言，属于css预处理器的范畴，它扩展了 CSS 语言，**
	增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展
	**LESS 既可以在 客户端 上运行 ，也可以借助Node.js在服务端运行。**
*	**注释**
	*	以//开头的注释，不会被编译到css文件中
   	*	以/**/包裹的注释会被编译到css文件中  
*	**变量**
	*	**使用@声明变量**
		*	作为普通属性值只来使用：直接使用@pink
		*	作为选择器和属性名：#@{selector的值}的形式
		*	作为URL：@{url}
	<pre>
	<code>
	@color:deeppink;
	@m:margin;
	@selector:#wrap;
	*{
	    @{m}: 0;
	    padding: 0;
	}
	@{selector}{
	    position: relative;
	    width: 300px;
	    height: 400px;
	    border: 1px solid;
	    margin: 0   ;
	    .inner{
	        position: absolute;
	        left: 0;
	        right: 0;
	        top: 0;
	        bottom: 0;
	        margin:   ;
	        background: @color;
	        height: 100px;
	        width: 100px;
	    }
	}
	</code>
	</pre>
	*	**变量是块级作用域**
	*	**变量的延迟加载:**
	<pre>
	<code>
	@var: 0;
	.class {
		@var: 1;
    	.brass {
    		@var: 2;
     		three: @var;//3,他会等当前作用域所有东西解析完再来看@var是谁
      		@var: 3;
    	}
  		one: @var;  //1
	}
	</pre>
	</code>
*	**less中的嵌套规则**
	*	基本嵌套规则
	*	&的使用
		*	**&:平级**
	<pre>
	<code>
	#wrap{
	    position: relative;
	    width: 300px;
	    height: 400px;
	    .inner{
	        position: absolute;
	        left: 0;
	        right: 0;
	        top: 0;
	        bottom: 0;
	        margin:   ;
	        height: 100px;
	        width: 100px;
 		//$代表#wrap .inner
	        &:hover{
	            background: pink;
	        }
	    }
	}
	</pre>
	</code>
*	**混合 mixin**
	*	混合就是将一系列属性从一个规则集引入到另一个规则集的方式（相当于ctrl c+ctrl v）
	*	使用**.**的形式来定义
		*	普通混合(会编译到原生css中的）
		*	不会输出(不会编译到原生css中的）的混合（加双括号）
		*	带参数的混合
		*	带参数并且有默认值的混合
		*	带多个参数的混合
		*	命名参数
		*	匹配模式
			*	
		*	arguments变量

			<pre>
			<code>
			.border(@w,@style,@c){
		    	border: @arguments;
			}
			</pre>
			</code>

	<pre>
	<code>
	.juzhong(@w:10px,@h:10px,@c:pink){
	    background: @c;
	    height: @h;
	    width: @w;
	}
	#wrap{
    position: relative;
    width: 300px;
    height: 400px;
    border: 1px solid;
    margin: 0   ;
	    .inner{
	       .juzhong(100px ,100px,pink);
	    }
	    .inner2{
	       .juzhong();//有默认值
		   .juzhong(@c:black);//命名参数,在传形参的时候指定值
	    }
	}
	</pre>
	</code>
*	**计算**
	*	在less中可以进行加减乘除的运算
	<pre>
	<code>
	@rem:100rem;
	#wrap .sjx{
	   width:(100 + @rem)//200rem，计算双方只需要一方带单位即可
	}
	</pre>
	</code>
*	**继承**
	<pre>
	<code>
	#test{
			&:extend(.father)
	}
	#test:extend(.father){
			
	}
	继承实质上将.father选择器和#test组合成一个选择器，声明块使用.father的
	</code>
	</pre>
	*	性能比混合高
	*	灵活度比混合低
*	**避免编译**
	*	**使用~**
	*	` padding: ~"cacl(100px + 100)";`
---
