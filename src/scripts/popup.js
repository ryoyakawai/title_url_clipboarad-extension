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
  const _BITLY_ = config.bitly;
  const _STORAGE_ = config.storagename;
  const _TEXT_ = config.text;
  var _STATE_ = false;

  main();

  async function main() {
    const key_icon = document.querySelector('#key_icon');
    const reload_icon = document.querySelector('#reload_icon');

    key_icon.addEventListener('mousedown', updateSetting, false);

    reload_icon.addEventListener('mousedown', async function(event) {
      _STATE_ = !_STATE_;
      updateUrl(_STATE_);
    }, false);

    let use_shorturl = await cutils.storageGet(_STORAGE_._USE_SHORTURL_);
    _STATE_ = use_shorturl;
    updateUrl(use_shorturl);

    const access_token = await cutils.storageGet(_STORAGE_._TOKEN_);
    var set_access_token = false;
    if(access_token != null) {
      set_access_token = true;
    }
    toggleReloadIcon(set_access_token);
  }

  function toggleReloadIcon(mode) {
    let reload_icon = document.querySelector('#reload_icon');
    reload_icon.classList.remove('display_none');
    if ( mode === false ) {
      reload_icon.classList.add('display_none');
    }
  }

  async function updateUrl(use_shorturl) {
    let use_custom_delimiter = await cutils.storageGet(_STORAGE_._USE_CUSTOM_DELIMITER_);
    const access_token = await cutils.storageGet(_STORAGE_._TOKEN_);
    const title_div = document.querySelector('#title');
    const url_div = document.querySelector('#url');

    let info = await getTabTitleURL();
    info.url_use = info.URL;
    if(info.URL.match(/^http*/)!==null
       && use_shorturl===true
       && access_token != null) {
      let request_url = _BITLY_.shorten_url.replace('%%ACCESS_TOKEN%%', access_token);
      request_url = request_url.replace('%%LONGURL%%', info.URL);
      info.url_use =
        info.short_url = (JSON.parse(await fetchData(request_url))).data.url;
    }
    const clipped_div = document.querySelector('#clipped');
    let length = {
      title: Math.floor(6 * info.TITLE.length),
      url: Math.floor(6 * info.url_use.length),
      max: _TEXT_.elem_max_length
    };
    let delimiter = ' ';
    console.log(use_custom_delimiter);
    if(use_custom_delimiter.type === 'custom') {
      delimiter = (use_custom_delimiter.text).toString();
    } else {
      delimiter = '\n';
    }

    let copy_string = ([`[${info.TITLE}]`, info.url_use]).join(delimiter);
    copy_string =  copy_string + '\n';
    copyToClipboard(copy_string);
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

  async function fetchData(url) {
    const header = {method: 'POST', mode: 'cors'};
    const data = await fetch(url, header);
    return data.text();
  }

  function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  async function getTabTitleURL() {
    return new Promise( (resolve, reject) => {
      chrome.tabs.getSelected(null, tab => {
        resolve({URL: tab.url, TITLE: tab.title});
      });
    });
  }

}());

