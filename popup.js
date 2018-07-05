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

(async function(){
    const _MAX_LENGTH_ = 50;
    let info = await getTabTitleURL();
    let clipped_div = document.querySelector('#clipped');
    let title_div = document.querySelector('#title');
    let url_div = document.querySelector('#url');
    let length = {
        title: Math.floor(5 * info.TITLE.length),
        url: Math.floor(5 * info.URL.length),
        max: 350
    };
    let len = (length.title < length.url ? length.url : length.title);
    console.log(len, length.title < length.url);
    len = (len > length.max ? length.max : len);
    console.log(len, length);
    function cutText(text) {
        if(text.length > _MAX_LENGTH_) {
            text = text.substr(0, parseInt(_MAX_LENGTH_) - 1) + ' ...';
        }
        return text;
    }
    
    clipped_div.style.width
        = title_div.style.width
        = url_div.style.width
        = len + 'px';

    title_div.innerHTML = '['+  cutText(info.TITLE) + ']';
    url_div.innerHTML = cutText(info.URL);

    let copy_string = `[${info.TITLE}]\n${info.URL}\n`;
    copyToClipboard(copy_string);
    
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

