# redux-source-annotation
redux源码中文注解，[redux教程](http://www.redux.org.cn/)

* redux版本为4.0.4
* 细节直接看 src 下的文件

## 要点
1. store.subscribe，订阅的事件都push在nextListeners中，而执行订阅时拷贝到currentListeners，这样新添加的事件不会影响正在执行监听列表

2. applyMiddleware，应该是最复杂的部分，巧妙的利用了函数式编程的compose，[详细](src/applyMiddleware.js)
