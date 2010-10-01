
$(document).ready(function () {
  //documentation urls
  var mdc_base = "https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/",
      whatwg_base = "http://www.whatwg.org/specs/web-apps/current-work/multipage/",
      doodle_base = "./",
      //javascript types
      doc_array = mdc_base+"Array",
      doc_bool = mdc_base+"Boolean",
      doc_func = mdc_base+"Function",
      doc_num = mdc_base+"Number",
      doc_obj = mdc_base+"Object",
      doc_string = mdc_base+"String",
      doc_range_err = mdc_base+"RangeError",
      doc_ref_err = mdc_base+"ReferenceError",
      doc_syntax_err = mdc_base+"SyntaxError",
      doc_type_err = mdc_base+"TypeError",
      //html5 elements
      doc_htmlelement = whatwg_base+"elements.html#htmlelement",
      doc_canvas = whatwg_base+"the-canvas-element.html#the-canvas-element",
      doc_context = whatwg_base+"the-canvas-element.html#canvasrenderingcontext2d",
      //doodle types
      doc_display = doodle_base+"display.html",
      doc_elemnode = doodle_base+"elementnode.html",
      doc_evtdisp = doodle_base+"eventdispatcher.html",
      doc_layer = doodle_base+"layer.html",
      doc_node = doodle_base+"node.html",
      doc_sprite = doodle_base+"sprite.html",
      doc_geom_matrix = doodle_base+"matrix.html",
      doc_geom_point = doodle_base+"point.html",
      doc_geom_rect = doodle_base+"rectangle.html",
      //events
      doc_evt = doodle_base+"event.html",
      doc_keyboardevt = doodle_base+"keyboardevent.html",
      doc_mouseevt = doodle_base+"mouseevent.html",
      doc_textevt = doodle_base+"textevent.html",
      doc_touchevt = doodle_base+"touchevent.html",
      doc_uievt = doodle_base+"uievent.html",
      //constants
      doc_gradienttype = doodle_base+"gradienttype.html",
      doc_keyboard = doodle_base+"keyboard.html"
      doc_linecap = doodle_base+"linecap.html",
      doc_linejoin = doodle_base+"linejoin.html",
      doc_pattern = doodle_base+"pattern.html",
      //packages
      doc_utils = doodle_base+"utils.html",
      doc_utils_types = doodle_base+"utils-types.html";

  $('body').html(
    $('body').html()
      //javascript types
      .replace(/:Object/g, ":<a href='"+doc_obj+"'>Object</a>")
      .replace(/:Array/g, ":<a href='"+doc_array+"'>Array</a>")
      .replace(/:Boolean/g, ":<a href='"+doc_bool+"'>Boolean</a>")
      .replace(/\|Boolean/g, "|<a href='"+doc_bool+"'>Boolean</a>")
      .replace(/:Function/g, ":<a href='"+doc_func+"'>Function</a>")
      .replace(/:Number/g, ":<a href='"+doc_num+"'>Number</a>")
      .replace(/:String/g, ":<a href='"+doc_string+"'>String</a>")
      .replace(/\|String/g, "|<a href='"+doc_string+"'>String</a>")
      //html types
      .replace(/:HTMLElement/g, ":<a href='"+doc_htmlelement+"'>HTMLElement</a>")
      .replace(/\|HTMLElement/g, "|<a href='"+doc_htmlelement+"'>HTMLElement</a>")
      .replace(/:HTMLCanvasElement/g, ":<a href='"+doc_canvas+"'>HTMLCanvasElement</a>")
      .replace(/:CanvasRenderingContext2D/g, ":<a href='"+doc_context+"'>CanvasRenderingContext2D</a>")
      //doodle types
      .replace(/:Display/g, ":<a href='"+doc_display+"'>Display</a>")
      .replace(/:ElementNode/g, ":<a href='"+doc_elemnode+"'>ElementNode</a>")
      .replace(/:EventDispatcher/g, ":<a href='"+doc_evtdisp+"'>EventDispatcher</a>")
      .replace(/:Layer/g, ":<a href='"+doc_layer+"'>Layer</a>")
      .replace(/:Node/g, ":<a href='"+doc_node+"'>Node</a>")
      .replace(/:Sprite/g, ":<a href='"+doc_sprite+"'>Sprite</a>")
      .replace(/:Matrix/g, ":<a href='"+doc_geom_matrix+"'>Matrix</a>")
      .replace(/:Point/g, ":<a href='"+doc_geom_point+"'>Point</a>")
      .replace(/:Rectangle/g, ":<a href='"+doc_geom_rect+"'>Rectangle</a>")
      .replace(/:Event/g, ":<a href='"+doc_evt+"'>Event</a>")
      .replace(/:KeyboardEvent/g, ":<a href='"+doc_keyboardevt+"'>KeyboardEvent</a>")
      .replace(/:MouseEvent/g, ":<a href='"+doc_mouseevt+"'>MouseEvent</a>")
      .replace(/:TextEvent/g, ":<a href='"+doc_textevt+"'>TextEvent</a>")
      .replace(/:TouchEvent/g, ":<a href='"+doc_touchevt+"'>TouchEvent</a>")
      .replace(/:UIEvent/g, ":<a href='"+doc_uievt+"'>UIEvent</a>")
      //doodle classes and packages
      .replace(/<li>doodle\.utils<\/li>/g, "<li><a href='"+doc_utils+"'>doodle.utils</a><\/li>")
      .replace(/<li>doodle\.utils\.types<\/li>/g, "<li><a href='"+doc_utils_types+"'>doodle.utils.types</a><\/li>"));

  //replace types in 'Returns' and 'Throws' details section
  $('details ul li').each(function () {
    //swap 'Object' first since some of the urls match the phrase
    $(this).html(
      $(this).html()
        .replace(/Object/g, "<a href='"+doc_obj+"'>Object</a>")
        .replace(/Array/g, "<a href='"+doc_array+"'>Array</a>")
        .replace(/Boolean/g, "<a href='"+doc_bool+"'>Boolean</a>")
        .replace(/Function/g, "<a href='"+doc_func+"'>Function</a>")
        .replace(/Number/g, "<a href='"+doc_num+"'>Number</a>")
        .replace(/String/g, "<a href='"+doc_string+"'>String</a>")
        .replace(/RangeError/g, "<a href='"+doc_range_err+"'>RangeError</a>")
        .replace(/ReferenceError/g, "<a href='"+doc_ref_err+"'>ReferenceError</a>")
        .replace(/SyntaxError/g, "<a href='"+doc_syntax_err+"'>SyntaxError</a>")
        .replace(/TypeError/g, "<a href='"+doc_type_err+"'>TypeError</a>")
        .replace(/HTMLElement/g, "<a href='"+doc_htmlelement+"'>HTMLElement</a>"));
  });

  //navigation menu links
  $('nav ul li').each(function () {
    $(this).html(
      $(this).html()
        .replace(/^Display$/g, "<a href='"+doc_display+"'>Display</a>")
        .replace(/^ElementNode$/g, "<a href='"+doc_elemnode+"'>ElementNode</a>")
        .replace(/^Event$/g, "<a href='"+doc_evt+"'>Event</a>")
        .replace(/^EventDispatcher$/g, "<a href='"+doc_evtdisp+"'>EventDispatcher</a>")
        .replace(/^GradientType$/g, "<a href='"+doc_gradienttype+"'>GradientType</a>")
        .replace(/^Keyboard$/g, "<a href='"+doc_keyboard+"'>Keyboard</a>")
        .replace(/^KeyboardEvent$/g, "<a href='"+doc_keyboardevt+"'>KeyboardEvent</a>")
        .replace(/^Layer$/g, "<a href='"+doc_layer+"'>Layer</a>")
        .replace(/^LineCap$/g, "<a href='"+doc_linecap+"'>LineCap</a>")
        .replace(/^LineJoin$/g, "<a href='"+doc_linejoin+"'>LineJoin</a>")
        .replace(/^Matrix$/g, "<a href='"+doc_geom_matrix+"'>Matrix</a>")
        .replace(/^MouseEvent$/g, "<a href='"+doc_mouseevt+"'>MouseEvent</a>")
        .replace(/^Node$/g, "<a href='"+doc_node+"'>Node</a>")
        .replace(/^Pattern$/g, "<a href='"+doc_pattern+"'>Pattern</a>")
        .replace(/^Point$/g, "<a href='"+doc_geom_point+"'>Point</a>")
        .replace(/^Rectangle$/g, "<a href='"+doc_geom_rect+"'>Rectangle</a>")
        .replace(/^Sprite$/g, "<a href='"+doc_sprite+"'>Sprite</a>")
        .replace(/^TextEvent$/g, "<a href='"+doc_textevt+"'>TextEvent</a>")
        .replace(/^TouchEvent$/g, "<a href='"+doc_touchevt+"'>TouchEvent</a>")
        .replace(/^UIEvent$/g, "<a href='"+doc_uievt+"'>UIEvent</a>")
        .replace(/^utils$/g, "<a href='"+doc_utils+"'>utils</a>")
        .replace(/^utils\.types$/g, "<a href='"+doc_utils_types+"'>utils.types</a>"))
  });
});
