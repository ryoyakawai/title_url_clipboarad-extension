'use strict';

import ChromeUtils from './chromeutils.js';

const cutils = new ChromeUtils();
const config = {
  storagename: {
    _USE_CUSTOM_DELIMITER_: 'use_custom_delimiter'
  },
  text: {
    max_length : 30,
    elem_max_length: 350
  }
};

export default config;
