/* Riot.js 0.9.4 | moot.it/riotjs | @license MIT | (c) 2013 Tero Piirainen, Moot Inc, other contributors */
(function(top) {
  'use strict';

  var $ = top.$, // jQuery or Zepto
      pop_event_name = 'popstate',
      empty_string = '',
      slice = [].slice, // A classic pattern for separating concerns
      $win = $(top), // jQueried window object
      pushState = top.history.pushState, //Allow minification when repeated
      locationHash = top.location.hash; //Allow minification when repeated
      
  // avoid multiple execution. popstate should be fired only once etc.
  if ($.riot) return;

  $.riot = '0.9.4';

  $.observable = function(obj) {

    var $el = $('<a/>'); // plain object not working on Zepto

    $.each(['on', 'one', 'trigger', 'off'], function(i, name) {
      obj[name] = function(names, fn) {

        // on, one
        if (i < 2) {
          $el[name](names, function(e) {
            var args = slice.call(arguments, 1);
            if (names.split(' ')[1]) args.unshift(e.type);
            fn.apply(obj, args);
          });

        // trigger
        } else if (i === 2) {
          $el.trigger(names, slice.call(arguments, 1));

        // off
        } else {
          $el.off(names);
        }

        return obj;
      };

    });

    return obj;
  };

  // Change the browser URL or listen to changes on the URL
  $.route = function(to) {

    // listen
    if ($.isFunction(to)) {
      $win.on(pop_event_name, function(e, hash) {
        to(hash || locationHash);
      });

    // fire
    } else if (to != locationHash) {
      if (pushState) pushState(empty_string, empty_string, to);
      $win.trigger(pop_event_name, [to]);
    }

  };

  // emit window.popstate event consistently on page load, on every browser
  //$win.one('load', function() { //Ready as load event is depricated, need to determine if author has solid reason.
  //Otherwise at least simplify using one, rather than a boolean and another event that could keep firing.
  $win.ready(function() {
    $win.trigger(pop_event_name);
  });

})(window);
