var { JSDOM } = require('jsdom');

module.exports = function(markup) {
  markup = markup || '<html><body></body></html>'
  const { window } = new JSDOM(markup);
  global.document = window.document;
  global.window = window;
  global.fetch = function(){}
  global.navigator = {
    userAgent: 'node.js'
  }
};