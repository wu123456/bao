# bao
a personal JavaScript frame

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
