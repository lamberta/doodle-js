
$(document).ready(function () {
  //documentation urls
  var mdc_base = "https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/",
      whatwg_base = "http://www.whatwg.org/specs/web-apps/current-work/multipage/",
      doodle_base = "./",
      type_docs = {
        //javascript types
        'Array': mdc_base+"Array",
        'Boolean': mdc_base+"Boolean",
        'Function': mdc_base+"Function",
        'Number': mdc_base+"Number",
        'Object': mdc_base+"Object",
        'String': mdc_base+"String",
        'Date': mdc_base+"Date",
        'Error': mdc_base+"Error",
        'RangeError': mdc_base+"RangeError",
        'ReferenceError': mdc_base+"ReferenceError",
        'SyntaxError': mdc_base+"SyntaxError",
        'TypeError': mdc_base+"TypeError",
        //html5 elements
        'HTMLElement': whatwg_base+"elements.html#htmlelement",
        'HTMLImageElement': whatwg_base+"embedded-content-1.html#the-img-element",
        'HTMLCanvasElement': whatwg_base+"the-canvas-element.html#the-canvas-element",
        'CanvasRenderingContext2D': whatwg_base+"the-canvas-element.html#canvasrenderingcontext2d",
        //doodle types
        'Display': doodle_base+"display.html",
        'ElementNode': doodle_base+"elementnode.html",
        'EventDispatcher': doodle_base+"eventdispatcher.html",
        'Layer': doodle_base+"layer.html",
        'Node': doodle_base+"node.html",
        'Sprite': doodle_base+"sprite.html",
        'Matrix': doodle_base+"matrix.html",
        'Point': doodle_base+"point.html",
        'Rectangle': doodle_base+"rectangle.html",
        //events
        'Event': doodle_base+"event.html",
        'KeyboardEvent': doodle_base+"keyboardevent.html",
        'MouseEvent': doodle_base+"mouseevent.html",
        'TextEvent': doodle_base+"textevent.html",
        'TouchEvent': doodle_base+"touchevent.html",
        'UIEvent': doodle_base+"uievent.html",
        //constants
        'GradientType': doodle_base+"gradienttype.html",
        'Keyboard': doodle_base+"keyboard.html",
        'LineCap': doodle_base+"linecap.html",
        'LineJoin': doodle_base+"linejoin.html",
        'Pattern': doodle_base+"pattern.html",
        //packages
        'utils': doodle_base+"utils.html",
        'utils.types': doodle_base+"utils-types.html",
        //libs
        'Stats': "http://github.com/mrdoob/stats.js"
      };


  /* Navigation menu items
   */
  $('nav ul li').each(function () {
    var item = $(this),
        txt = item.text(),
        regexp;
    for (var type in type_docs) {
      regexp = new RegExp('^'+type+'$');
      txt = txt.replace(regexp, "<a href='"+ type_docs[type] +"'>"+ type +"</a>");
    }
    item.html(txt);
  });

  /* Description type sig, parameter types
   */
  $('.main dt, .main ol li').each(function () {
    var item = $(this),
        txt = item.html(),
        regexp;
    for (var type in type_docs) {
      regexp = new RegExp(":"+type, 'g');
      if (regexp.test(txt)) {
        txt = txt.replace(regexp, ":<a href='"+ type_docs[type] +"'>"+ type +"</a>");
      }
      regexp = new RegExp("\\|"+type, 'g');
      if (regexp.test(txt)) {
        txt = txt.replace(regexp, "|<a href='"+ type_docs[type] +"'>"+ type +"</a>");
      }
    }
    item.html(txt);
  });

  /* Class description, inherititance list
   * list on single line with arrow between
   */
  $("h3:contains('Inheritance') + ol li").each(function (idx) {
    var item = $(this),
        txt = item.text(),
        regexp;

    for (var type in type_docs) {
      regexp = new RegExp('^'+type+'$');
      txt = txt.replace(regexp, "<a href='"+ type_docs[type] +"'>"+ type +"</a>");
    }
    item.html(txt);

    item.css('display', "inline");
    if (idx > 0) {
      item.html("&#8680; " + item.html());
    }
  });

  /* Example list items
   */
  $("h3:contains('Examples') + ul li").each(function () {
    $(this).css({
      'background-color': '#ededed',
      'margin': '0.6em 0',
      'padding': '0.4em 0.4em',
      'line-height': '1.1em'
    });
  });
  
  /* Property details - returns, throws list items
   */
  var list_returns = ".main details h3:contains('Returns')",
      list_throws = ".main details h3:contains('Throws')";
  $(list_returns +','+ list_throws +' + ul li').each(function () {
    var item = $(this),
        txt = item.text(),
        regexp;
    for (var type in type_docs) {
      regexp = new RegExp('^'+type);
      txt = txt.replace(regexp, "<a href='"+ type_docs[type] +"'>"+ type +"</a>");
      regexp = new RegExp("\\|"+type, 'g');
      if (regexp.test(txt)) {
        txt = txt.replace(regexp, "|<a href='"+ type_docs[type] +"'>"+ type +"</a>");
      }
    }
    item.html(txt);
  });


  /* Add menu collapse button
   */
  $('.main h1, .main section h2, .main section dt').each(function () {
    $(this).html($(this).html() + '<span class="expandButton">[-]</span>');
  });
  //example buttons are closed by default
  $('h3:contains("Examples")').each(function () {
    var example = $(this);
    example.html(example.html() + '<span class="expandButton">[+]</span>');
    example.next('ul').hide();
  });

  /* @return {Boolean} collapse_all
   */
  function toggle_expand_button (button) {
    //toggle character
    if (button.text() === '[-]') {
      button.text('[+]');
      return true;
    } else {
      button.text('[-]');
      return false;
    }
  }

  /* Top-level button next to class name.
   * expand-contract property items
   */
  $('.main h1 .expandButton').click(function () {
    var collapse_all = toggle_expand_button($(this));

    //property descriptions
    $('.main section dd').each(function () {
      $(this).animate({
        'height': collapse_all ? 'hide' : 'show',
        'opacity': collapse_all ? 'hide' : 'show'
      }, { duration: "fast" });
    });
    //button next to property terms
    $('.main section dt .expandButton').each(function () {
      if (collapse_all && $(this).text() === '[+]') {
        return;
      } else if (!collapse_all && $(this).text() === '[-]') {
        return;
      } else {
        toggle_expand_button($(this));
      }
    });
  });
  
  /* Section collapse button
   */
  $('.main section h2 .expandButton').click(function () {
    var button = $(this);
    button.parent().siblings('dl').animate({
      'height': "toggle",
      'opacity': "toggle"
    }, { duration: "slow" });
    toggle_expand_button(button);
  });

  /* Property item collapse button
   */
  $('.main dt .expandButton').each(function () {
    var button = $(this);
    button.click(function () {
      button.parent().next('dd').animate({
        'height': "toggle",
        'opacity': "toggle"
      }, { duration: "fast" });
      toggle_expand_button(button);
    });
  });

  /* Examples collapse button
   */
  $('.main h3:contains("Examples") .expandButton').each(function () {
    var button = $(this);
    button.click(function () {
      button.parent().next('ul').animate({
        'height': "toggle",
        'opacity': "toggle"
      }, { duration: "fast" });
      toggle_expand_button(button);
    });
  });
  
});
