/**
 * Copyright 2018 Ryoya Kawai
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import ChromeUtils from './chromeutils.js';
import config from './config.js';

(async function(){

  const cutils = new ChromeUtils();
  const usecustomdelimiter_radio = document.getElementsByName('use-delimiter');
  const cd_text_01 = document.querySelector('#delimiter-text-01');
  const _STORAGE_ = config.storagename;

  init();

  for(let i in usecustomdelimiter_radio) {
    if( typeof usecustomdelimiter_radio[i].addEventListener !== 'undefined') {
      usecustomdelimiter_radio[i].addEventListener('change', event => {
        let text = cd_text_01.value;
        updateDelimiterFormat( { type:event.target.value, elem_id:usecustomdelimiter_radio[i].id, text: text } );
      });
    }
  }

  cd_text_01.addEventListener('mousedown', event => {
    document.querySelector('#use-custom-delimiter-01').checked = true;
  });
  cd_text_01.addEventListener('change', async (event) => {
    let param = await cutils.storageGet(_STORAGE_._USE_CUSTOM_DELIMITER_);
    param.text = event.target.value;
    updateDelimiterFormat( param );
  });

  async function updateDelimiterFormat(param) {
    await cutils.storageSet(_STORAGE_._USE_CUSTOM_DELIMITER_, param);
  }

  async function init() {
    await checkDelimiterSetting();
  }

  async function checkDelimiterSetting() {
    let d_s = await cutils.storageGet(_STORAGE_._USE_CUSTOM_DELIMITER_);
    if(d_s === null) {
      d_s = {elem_id: "use-custom-delimiter-00", text: " - ", type: "return"};
      updateDelimiterFormat(d_s);
    }
    document.querySelector('#' + d_s.elem_id).checked = true;
    cd_text_01.value = d_s.text;
  }

}());
