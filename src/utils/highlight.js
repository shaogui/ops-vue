import Vue from 'vue'

import hljs from "highlight.js"
// import 'highlight.js/styles/default.css';
import 'highlight.js/styles/monokai-sublime.css'
// 定义自定义指令 highlight 代码高亮
Vue.directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})

export default hljs