# bao
Bao is a simple JavaScript library with only one hundred lines code.It provides data-reactive components with a simple and flexible API. 

There are still many projects based on Zepto or jQuery even now.And so does my company project.I need a simple and useful JavaScript libaray which provides data-reactive components.The ReactJs and VueJs can almost meet my needs,but they are based on native JavaScript,so they are bigger than my BaoJs.
BaoJs is based on Zepto or jQuery.If your project has already use Zepto or jQuery,it needs only one hundred lines code to use a library which provides data-reactive components.If you are only family with jQuery,just use Bao because it is very kind for a new coder.That's why I wrote it.

The easier code, the better world.

##Examples

Here is the first one to get you started:

```tpl
<script type="text/html" id="tpl">
    <div>Hello {name}</div>
</script>
```

```js
var HelloItem = Bao.createBaoComponent({
    tpl : $("#tpl").html(),
});

Bao.renderBaoComponent(new HelloItem({'props':{'name':'Awu'}}), $("#container"));
```

This example will render "Hello Awu" into a container on the page.

##Installation

The fastest way to get started is to serve JavaScript download the Bao.js.
```html
<!-- The Zepyo library -->
<script src="./js/Zepto.min.js"></script>
<!-- The core Bao library -->
<script src="./js/Bao.js"></script>
```

##Contribute

The main purpose of this repository is to continue to evolve Bao core, making it faster and easier to use. If you're interested in helping with that, then keep reading and contact with me by sending e-mail to 'littlewu3991@foxmail.com'. If you're not interested in helping right now that's ok too. :)
