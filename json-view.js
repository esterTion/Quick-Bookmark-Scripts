(function () {
  var success = 0;
  var stringify = (function () {
    var tab = '    ';
    var urlExpr = /^((http|ftp|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[\w\?\#\%\/\.\=\&\!-]*)?$/;
    var buildPath = function (root, prop) {
      if (/(\-\.)/.test(prop)) {
        return root + '["' + prop.replacae(/"/g, '\\"') + '"]';
      } else if (typeof prop == 'number') {
        return root + '[' + prop + ']';
      } else {
        return root + '.' + prop;
      }
    };
    var objLoop = function (obj, depth, path) {
      var child = [];
      for (var key in obj) {
        child.push('<li><span class="key" title="' + buildPath(path, key) + '">' + key + '</span>: ' + procItem(obj[key], depth + 1, buildPath(path, key)) + '</li>');
      }
      return '{<ul class="object collapsible">' + child.join('') + '</ul>}';
    };
    var arrLoop = function (arr, depth, path) {
      var child = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        child.push('<li>' + procItem(arr[i], depth + 1, buildPath(path, i)) + '</li>');
      }
      return '[<ul class="array collapsible">' + child.join('') + '</ul>]';
    };
    var toString = function (item, depth, path) {
      if ('number' == typeof item) {
        return '<span class="number" title="' + path + '">' + item + '</span>';
      } else if ('boolean' == typeof item) {
        return '<span class="boolean" title="' + path + '">' + item + '</span>';
      } else if ('string' == typeof item) {
        if (urlExpr.test(item))
          return '<a href="' + item + '" target="_blank" title="' + path + '" class="link">' + item + '</a>';
        else
          return '<span class="string" title="' + path + '">"' + item.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"</span>';
      } else {
        return '<span class="null">' + item + '</span>';
      }
    };
    var procItem = function (item, depth, path) {
      if (typeof item == 'object' && item !== null) {
        return '<span class="collapser"></span>' + (Array.isArray(item) ? arrLoop : objLoop)(item, depth, path);
      } else {
        return toString(item, depth, path);
      }
    };
    return function (json) {
      return objLoop(json, 0, '<root>');
    };
  })();
  if (document.body.childNodes.length == 1) {
    if (document.body.childNodes[0].nodeName == 'PRE') {
      var trymatch = document.body.childNodes[0].innerHTML.match(/^(\w+)\((.+)\)[;]?$/);
      if (trymatch != null && trymatch[0] == document.body.childNodes[0].innerHTML) {
        try {
          document.body.innerHTML = "<b>JSONP Callback: " + trymatch[1] + "</b><pre>" + stringify(JSON.parse(trymatch[2])) + "</pre>";
          success = 1
        } catch (e) { }
      } else {
        try {
          document.body.innerHTML = "<pre>" + stringify(JSON.parse(document.body.childNodes[0].innerHTML)) + "</pre>";
          success = 1
        } catch (e) { }
      }
    } else if (document.body.childNodes[0].nodeName == '#text') {
      var trymatch = document.body.innerHTML.match(/^(\w+)\((.+)\)[;]?$/); if (trymatch != null && trymatch[0] == document.body.innerHTML) {
        try {
          document.body.innerHTML = "<b>JSONP Callback: " + trymatch[1] + "</b><pre>" + stringify(JSON.parse(trymatch[2])) + "</pre>";
          success = 1
        } catch (e) { }
      } else {
        try {
          document.body.innerHTML = "<pre>" + stringify(JSON.parse(document.body.innerHTML)) + "</pre>";
          success = 1
        } catch (e) { }
      }
    }
  }
  if (success) {
    var moved = false;
    document.body.addEventListener('touchmove', function () { moved = true; })
    document.body.addEventListener('touchend', function (e) {
      e.preventDefault();
      if (moved) {
        moved = false;
        return;
      }
      var t = e.target;
      var collapser = null;
      var collapsible = null;
      if (t.classList.contains('collapser')) {
        //点在了箭头上
        collapser = t;
        collapsible = collapser.nextSibling.nextSibling;
      } else {
        if (t.className == 'key') t = t.parentNode;
        for (var i = 0, len = t.children.length; i < len; i++) {
          if (t.children[i].classList.contains('collapser')) {
            collapser = t.children[i];
            collapsible = collapser.nextSibling.nextSibling;
            break;
          }
        }
      }
      if (collapser == null) return;
      collapser.classList.contains('collapsed') ?
        (collapser.classList.remove('collapsed'), collapsible.classList.remove('collapsed')) :
        (collapser.classList.add('collapsed'), collapsible.classList.add('collapsed'));
    });
    document.head.innerHTML = '<style>html,body,pre{overflow:auto;-webkit-text-size-adjust:none;-webkit-overflow-scrolling:touch;font-family:Verdana;font-size:13px}pre{white-space:pre}.number,.boolean{color:#00f}.string{color:green}.null{color:red}.key{font-weight:700}ul{list-style:none;margin:0 0 0 2em;padding:0}li{display:inline;position:relative}.collapser{position:absolute;left:-1em;top:-.2em;cursor:pointer;transform:rotate(90deg);transition:transform .2s}.collapser::before{content:"▸";-moz-user-select:none}.collapser.collapsed{transform:rotate(0)}.collapsible.collapsed{height:1.2em;width:1em;display:inline-block;overflow:hidden;vertical-align:top;margin:0}.collapsible.collapsed::before{content:"…";width:1em;margin-left:.2em}ul.array>li,ul.object>li{display:block}ul.array>li:not(:last-of-type):after,ul.object>li:not(:last-of-type):after{content:","}.link:after,.link:before{content:\'"\';width:0;display:inline-block;overflow:hidden}@media screen and (orientation:landscape){html,body,pre{font-size:8px}}</style>'
  }
})()