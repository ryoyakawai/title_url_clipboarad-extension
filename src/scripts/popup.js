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
  const _STORAGE_ = config.storagename;
  const _TEXT_ = config.text;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  main();

  async function main() {
    const key_icon = document.querySelector('#key_icon');
    key_icon.addEventListener('mousedown', updateSetting, false);

    updateUrl();
  }

  async function updateUrl() {
    let use_custom_delimiter = await cutils.storageGet(_STORAGE_._USE_CUSTOM_DELIMITER_);
    const title_div = document.querySelector('#title');
    const url_div = document.querySelector('#url');

    let info = {URL: tab.url, TITLE: tab.title}
    info.url_use = info.URL;

    let delimiter = ' ';
    if(use_custom_delimiter !== null && use_custom_delimiter.type === 'custom') {
      delimiter = (use_custom_delimiter.text).toString();
    } else {
      delimiter = '\n';
    }

    let copy_string = ([`[${info.TITLE}]`, info.url_use]).join(delimiter);
    copy_string =  copy_string + '\n';
    await copyToClipboard(copy_string);
    title_div.innerHTML = '['+  cutText(info.TITLE, _TEXT_.max_length, ' ...') + ']';
    url_div.innerHTML = cutText(info.url_use, _TEXT_.max_length, ' ...');

    function cutText(text, len, truncation) {
      if (truncation === undefined) { truncation = ''; }
      var text_array = text.split('');
      var count = 0;
      var str = '';
      for (let i = 0; i < text_array.length; i++) {
        var n = escape(text_array[i]);
        if (n.length < 4) count++;
        else count += 2;
        if (count > len) {
          return str + truncation;
        }
        str += text.charAt(i);
      }
      return text;
    }
  }

  function updateSetting(event) {
    event.stopPropagation();
    event.preventDefault();
    cutils.opentab('src/options.html');
  }

  async function copyToClipboard(str) {
    try {
      await navigator.clipboard.writeText(str);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

}());
