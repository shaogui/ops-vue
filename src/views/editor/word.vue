<template>
  <div class="example">
    <quill-editor
        class="editor"
        ref="myTextEditor"
        :value="content"
        :options="editorOption"
        @change="onEditorChange"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
    />
  </div>
</template>

<script>
/**
 * 富文本vue-quill-editor 组件
 * name wangkai
 *-------------------设置文档----------------
 *---------- 1、toolbar工具栏-模块名----------
 *  background  --------------  背景颜色
 *  bold  --------------------  加粗
 *  color --------------------  颜色
 *  font  --------------------  字体
 *  code  --------------------  内联代码
 *  italic  ------------------  斜体
 *  link  --------------------  链接
 *  size  --------------------  大小
 *  strike  ------------------  删除线
 *  script  ------------------  上标/下标
 *  underline  ---------------  下划线
 *  blockquote  --------------  引用
 *  header  ------------------  标题
 *  indent  ------------------  缩颈
 *  list  --------------------  列表
 *  align  -------------------  文本对齐
 *  direction  ---------------  文本方向
 *  code-block  --------------  代码块
 *  formula  -----------------  公式
 *  image  -------------------  图片
 *  video  -------------------  视频
 *  clean  -------------------  清除字体样式
 */

// import dedent from 'dedent'
import hljs from 'highlight.js'
import debounce from 'lodash/debounce'
import {quillEditor} from 'vue-quill-editor'

// highlight.js style
import 'highlight.js/styles/tomorrow.css'

// import theme style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'quill-example-snow',
  title: 'Theme: snow',
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            [{'size': ['small', false, 'large', 'huge']},{'font': []}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'font': []}],// 字体
            // [{'font': [false, 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial']}],// 字体
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'direction': 'rtl'}],
            [{'color': []}, {'background': []}],
            [{'align': []}],
            ['clean'],
            ['link', 'image', 'video'],
          ],
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      content: ''
    }
  },
  methods: {
    onEditorChange: debounce(function (value) {
      this.content = value.html
    }, 466),
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
  },
  mounted() {
    console.log('this is Quill instance:', this.editor)
  }
}
</script>

<style lang="scss" scoped>
.example {
  display: flex;
  flex-direction: column;

  .editor {
    height: 40rem;
    overflow: hidden;
  }

  .output {
    width: 100%;
    height: 20rem;
    margin: 0;
    border: 1px solid #ccc;
    overflow-y: auto;
    resize: vertical;

    &.code {
      padding: 1rem;
      height: 16rem;
    }

    &.ql-snow {
      border-top: none;
      height: 24rem;
    }
  }

}

</style>
