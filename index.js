void (function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else factory()
}(this, function () {
  var DETAILS = 'details'
  var SUMMARY = 'summary'

  var supported = checkSupport()
  if (supported) return

  // Regist Element.closest()
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // Add a classname
  document.documentElement.className += ' no-details'

  window.addEventListener('click', handler)
  window.addEventListener('keydown', keydownHandler)

  injectStyle('details-polyfill-style',
    'html.no-details ' + DETAILS + ' { display: block; }\n' +              
    'html.no-details ' + DETAILS + ':not([open]) > :not(' + SUMMARY + ') { display: none; }\n' +
    'html.no-details ' + DETAILS + ' > ' + SUMMARY + ':before { content: "\u25b6"; display: inline-block; font-size: .8em; width: 1.5em; }\n' +
    'html.no-details ' + DETAILS + '[open] > ' + SUMMARY + ':before { content: "\u25bc"; }')

  /*
   * Click handler for `<summary>` tags
   */

  function handler (e) {
    if (e.target.closest(DETAILS) !== null) {
      var details = e.target.closest(DETAILS)
      if (!details) return

      if (details.getAttribute('open')) {
        details.open = false
        details.removeAttribute('open')
      } else {
        details.open = true
        details.setAttribute('open', 'open')
      }
    }
  }

  /*
   * Keydown handler for `<summary>` tags
   */

  function keydownHandler (e) {
    if (e.keyCode === 13) {
      handler(e)
    }
  }

  /*
   * Checks for support for `<details>`
   */

  function checkSupport () {
    var el = document.createElement(DETAILS)
    if (!('open' in el)) return false

    el.innerHTML = '<' + SUMMARY + '>a</' + SUMMARY + '>b'
    document.body.appendChild(el)

    var diff = el.offsetHeight
    el.open = true
    var result = (diff != el.offsetHeight)

    document.body.removeChild(el)
    return result
  }

  /*
   * Injects styles (idempotent)
   */

  function injectStyle (id, style) {
    if (document.getElementById(id)) return

    var el = document.createElement('style')
    el.id = id
    el.innerHTML = style

    document.getElementsByTagName('head')[0].appendChild(el)
  }
})); // eslint-disable-line semi
