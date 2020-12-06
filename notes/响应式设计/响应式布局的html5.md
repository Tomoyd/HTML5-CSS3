#### HTML5中的语义化标签

`<section>`: 定义文档或者应用文档中的区域或节，可以用来个人信息，新闻动态等   

`<nav>`定义文档的主导航区域

`<article>`用来包括一个独立的内容片段，可以成为一个独立的正文，保证完整的意义

`<aside>`:可以表示与页面主内容相关的部分，侧边栏，如关键字，目录导航，广告等

`<hgroup>`：页面中有一组使用h1-h2-h3 等标签的内容，副标题等可以考虑它将他们包括起来

HTML5的结构大纲算法中就会隐藏次级标题元素

`<header>`:不计入大纲结构，不能用它划分结构目录，用它包括对区域内容的说明等

`<footer>`:和header一样，不计入大纲结构，也不能用户划分内容结构，可以用它包含所在区域的辅助信息

`<address>`:明确的标注距离其最近的主题内容的联系信息，最近的article和body信息

#### 文本语义化标签

`b`标签

`em`标签

`i`标签

#### 遵循WAI-ARIA实现无障碍站点

#### role：

application

banner

complementary：

contentInfo

form

main

navigation

search

#### HTML5中嵌入媒体

#### 视频和音频

响应式视频

#### 离线web应用

读取.manifest文件，下载文件中所罗列的资源文件，并将其在本地缓存以备网络断开使用

`manifest文件`必须以CACHE MANIFEST开头，第二行是注释

CACHE部分：罗列了所有离线使用的文件，这些路径都是相对应offline.manifest而言的

NETWORK：罗列了不需要被缓存的文件

FALLBACK：使用/  定义了offline.html 文件

