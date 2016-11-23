// 'use strict';

// const mock = {};

// require('fs').readdirSync(require('path').join(__dirname + '/mock'))
//   .forEach(function (file) {
//     Object.assign(mock, require('./mock/' + file));
//   });

// module.exports = mock;

module.exports = {
  '/api/(.*)': 'http://localhost:4000',
  '/uploads/*': 'http://badu_nav/',
}
