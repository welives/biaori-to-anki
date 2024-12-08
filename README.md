## 用法

先去把[标日的Anki卡牌](https://zhuanlan.zhihu.com/p/58139619)全部下载下来, 然后导出进[Anki](https://apps.ankiweb.net/)

因为原作者的这套练习卡牌没有做填空练习,我给卡牌加了个填空字段后导出

再用脚本来填充**填空字段**的内容,接着再导回Anki更新对应卡牌组

## 模板

### 假名到释义

- 正面

```html
<a>【第 {{课号}} 课】</a><br />

<span class="jp">{{kana:日文}}</span> {{词性}} {{音频}} {{type:cloze:填空}}

<p><a>说明：</a>多个答案时请用英文状态的逗号加空格分隔</p>
```

- 背面

```html
<span class="jp">{{furigana:日文}}</span>

<hr id="answer" />

{{cloze:填空}} {{词性}}

<div class="result">
  <p>答案对比 👇</p>
  {{FrontSide:type:填空}}
</div>
```

- 样式

```css
@font-face {
  font-family: IPAexMincho;
  src: url('_ipaexm.ttf');
}

.jp {
  font-family: IPAexMincho;
  color: #a78bfa;
  font-weight: bold;
}

.card {
  font-family: arial;
  font-size: 20px;
  text-align: center;
  color: black;
  background-color: white;
}

.cloze {
  font-weight: bold;
  color: #3b82f6;
}

.result {
  text-align: left;
  color: #00f;
}
p {
  color: #d946ef;
}
a {
  color: red;
}

code#typeans {
  color: #00f;
  font-size: 1.2em;
  font-family: IPAexMincho;
  font-weight: bold;
}

/*拼写错误时的文字样式*/
/*没有拼写出来的文字样式*/
.typeBad,
.typeMissed {
  background-color: #ff0;
  color: red;
  font-weight: bold;
}

code#typeans::before {
  content: '你的答案：';
  color: #33c;
}

/*隐藏anki生成的箭头，该箭头包含在一个id为typearrow的span中*/
#typearrow {
  display: none;
}

#typearrow + br + *::before {
  content: '正确答案：';
  color: #33c;
  -webkit-text-stroke: 0em;
}
```

### 释义到日文

- 正面

```html
<a>【第 {{课号}} 课】</a><br />

{{释义}} {{音频}} {{type:cloze:填空}}

<p><a>说明：</a>多个答案时请用英文状态的逗号加空格分隔</p>
```

- 背面

```html
<span class="jp">{{furigana:日文}}</span><br />

{{释义}} {{词性}}

<hr id="answer" />

<div class="result">
  <p>答案对比 👇</p>
  {{FrontSide:type:填空}}
</div>
```

- 样式

```css
@font-face {
  font-family: IPAexMincho;
  src: url('_ipaexm.ttf');
}

.jp {
  font-family: IPAexMincho;
  color: #a78bfa;
  font-weight: bold;
}

.card {
  font-family: arial;
  font-size: 20px;
  text-align: center;
  color: black;
  background-color: white;
}

.cloze {
  font-weight: bold;
  color: #3b82f6;
}

.result {
  text-align: left;
  color: #00f;
}
p {
  color: #d946ef;
}
a {
  color: red;
}

code#typeans {
  color: #00f;
  font-size: 1.2em;
  font-family: IPAexMincho;
  font-weight: bold;
}

/*拼写错误时的文字样式*/
/*没有拼写出来的文字样式*/
.typeBad,
.typeMissed {
  background-color: #ff0;
  color: red;
  font-weight: bold;
}

code#typeans::before {
  content: '你的答案：';
  color: #33c;
}

/*隐藏anki生成的箭头，该箭头包含在一个id为typearrow的span中*/
#typearrow {
  display: none;
}

#typearrow + br + *::before {
  content: '正确答案：';
  color: #33c;
  -webkit-text-stroke: 0em;
}
```
