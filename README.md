# bao
Bao is a simple JavaScript library for building user interfaces.

This is based on Zepto or jQuery.
The bao component module looks like a sinple templating engine for JavaScript.In fact,I just want to make the code away from the operation of DOM.I want to operate the BaoComponent object instead of the DOM.

##Examples

Here is the first one to get you started:

```tpl
<script type="text/html" id="tpl">
    <div>Hello {name}</div>
</script>
```

```js
var ChatItem = Bao.createBaoComponent({
    tpl : $("#item_tpl").html(),
});

Bao.renderBaoComponent(new ChatItem({'props':{'name':'Awu'}}), $("#container"));
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
