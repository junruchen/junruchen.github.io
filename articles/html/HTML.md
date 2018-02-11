## HTML基础

1、Doctype作用
>用于告知浏览器解析器采用哪种文档标准解析文档

2、标准模式与兼容模式的区别
>标准模式下的排版和JS运作模式均以浏览器支持的最高标准运行；

>兼容模式下页面以宽松的向后兼容的方式显示，模拟老式浏览器的行为以防止站点无法工作

3、HTML5 为什么只需要写`<!DOCTYPE HTML>`
>HTML5不基于SGML，因此不需要对DTD进行引用，但是需要使用doctype来规范浏览器的行为。

>SGML(Standard Generalized Markup Language) 标准通用标记语言

>DTD(Document Type Definition) 文档类型定义

4、列举常见的块级元素、行内元素以及空(void)元素
>块级元素：div h1-h6 p hr br header footer article aside table tr ul ol li dl dd dt

>行内元素：a span strong i img input textarea select label td th

>空(void)元素: img hr input br mate link col

5、页面导入样式时，link与@import有什么区别
>1）link是XHTML标签，无兼容性问题；除了可以加载css外，还可以定义rss，定义rel连接属性等；@import 由css2.1提出，支持IE5以上，只能用于加载css

>2）页面加载时，link中引入的css会同时被加载，而外部样式文件使用@import引用的css会等到页面被加载完再加载

>3）可以通过JS操作dom的形式插入link标签来改变样式，而@import方式不可以

>4）@import必须写在除@charset外的其他任何css规则之前，否则将被浏览器忽略。如果@import之后还有其他样式，则比如在语句结尾加上分号

>总结：慎用@import方式，可以避免考虑@import的愈发规则和注意事项，避免产生资源下载顺序混乱以及http请求过多的问题

6、对浏览器内核的理解
>分为两部分：渲染引擎和JS引擎。

>渲染引擎主要负责网页的内容，如获取html内容，加入css等

>JS引擎主要用于服务解析和执行javascript来实现网页的动态效果

7、常见的浏览器内核
>Webkit内核: Safari, Google Chrome, Opera, 百度、猎豹等浏览器

>Trident内核: IE浏览器

>Gecko内核: Firefox浏览器

>Presto内核: Opera mini移动端浏览器

8、DOM文档的加载顺序
>1）解析HTML结构

>2）加载外部脚本和样式文件

>3）解析并执行脚本代码

>4）DOM树构建完成(DOMContentLoaded)

>5）加载图片以及外部文件

>6）页面加载完毕(load)

9、浏览器的执行过程
>1）加载，根据请求的URL进行域名解析，向服务器端发送请求，接受响应文件(HTML JS CSS 图片等)

>2）解析，对加载到的资源进行语法解析，构建响应的数据结构(DOM树，CSS样式规则，JS对象属性表等)

>3）渲染，对各个元素进行位置计算、样式计算等，然后根据渲染树完成页面布局

>总结：过程之间会有交叉，不是完全独立

10、script标签的defer与async属性的不同点

![示例图](http://upload-images.jianshu.io/upload_images/1500315-3321dd314dd75034.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>1）无defer或者async属性时，按照文档自上而下解析，当解析到script元素时，立即加载，且等到执行完成后继续解析DOM

>2）defer属性表示会立即异步下载脚本文档，且等到DOM解析完毕，DOMContentLoaded事件触发之前执行脚本

>3）async属性表示会立即异步下载脚本文件，下载完成后，立即停止解析DOM，执行脚本文件，直至执行完毕，继续解析DOM