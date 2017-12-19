require('../css/index.less');

var $ = require("./jquery-3.1.1.js");
var showdown = require("./showdown.js");
var Clipboard = require("./clipboard.min.js");
var CodeTheme = require("./theme/code-theme");
var PageTheme = require("./theme/page-theme");

require("./showdown-plugins/showdown-prettify-for-wechat.js");
require("./showdown-plugins/showdown-github-task-list.js");
require("./showdown-plugins/showdown-footnote.js");

require("./google-code-prettify/run_prettify.js");

// 准备工作 这样才确保webpack打包的style在前 自定义样式在后 才能起效
// $('head').eq(0).append($('<link rel="stylesheet" href="./themes/github-v2.css" id="codeThemeId" />'));
// $('head').eq(0).append($('<link rel="stylesheet" id="pageThemeId" />'));
$('#codeThemeId').appendTo('head');
$('#pageThemeId').appendTo('head');
$('.li-qrcode').on('mouseover', function(){
  $('.qrcode-container').show();
}).on('mouseleave', function(){
  $('.qrcode-container').hide();
});
$('img').each(function(){
  var _this = this;
  var newImg = new Image();
  newImg.onload = function(){
    $(_this).show();
  };
  newImg.src = this.src;
});

// 解析浏览中url中的Path 去除无用的参数
var kv = location.href.split('?')[1];
kv = kv && kv.split('&') || [];
var params = {};
$.each(kv, function(index, item) {
  var m = (item || '').split('=');
  if (m && m[0] && m[1]) {
    params[m[0]]= m[1];
  }
});

// 方便跨域加载资源
if (/\.ironmaxi\.com$/.test(location.hostname)) {
  document.domain = 'ironmaxi.com';
}

// 实例化markdown语法解析对象
var converter =  new showdown.Converter({
  extensions: ['prettify', 'tasklist', 'footnote'],
  tables: true
});

// 实例化微信文章markdown转换器
var WechatMakdowner = {
  currentState: 'edit',
  init: function() {
    var self = this;
    self.load().then(function() {
      self.start()
    }).fail(function(){
      self.start();
    });
  },
  start: function() {
    this.bindEvt();
    this.updateOutput();
    new CodeTheme();
    new PageTheme();
    new Clipboard('.btn');
  },
  load: function() {
    return $.ajax({
      type: 'GET',
      url: params.path || './demo.md',
      dateType: 'text',
      data: {
        _t: new Date() * 1
      },
      timeout: 2000
    }).then(function(data) {
      $('#input').val(data);
    });
  },
  bindEvt: function() {
    var self = this;
    $('#input').on('input keydown paste', self.updateOutput);
    var $copy = $('.copy-button');
    var $convert = $('.convert-button');
    var viewText = $convert.text();
    var editText = '返回编辑'
    $convert.on('click', function() {
      var $this = $(this);
      if (self.currentState === 'preview') {
        self.currentState = 'edit';
        $this.text(viewText);
        $copy.hide();
        $('#input').fadeIn();
        $('#output').hide();
      } else {
        self.currentState = 'preview';
        $this.text(editText);
        $copy.show();
        $('#input').fadeOut();
        $('#output').show();
      }
    });
    if (params.preview) {
      $convert.trigger('click');
    }
  },

  updateOutput: function () {
    var val = converter.makeHtml($('#input').val());
    $('#output .wrapper').html(val);
    PR.prettyPrint();
    $('#outputCtt li').each(function() {
      $(this).html('<span><span>' + $(this).html() + '</span></span>');
    });
  }
};

// 微信文章转换器初始化
WechatMakdowner.init();
