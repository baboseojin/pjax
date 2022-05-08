let domain = 'https://slangpost.net';
let exception = ['/sign/in', '/sign/up', '/web/error/404', '/event/03', '/group/outGroup', '/profile/view', '/project/view'];
let preView = {};

let beforeLoad = function(url){consoleLog(`%cLOG %c(web/js/load.js)%c ${url}로 이동`);  let loadBar = document.createElement('div'); loadBar.classList.add('loadBar', 'loadBarWidth'); document.body.appendChild(loadBar); try{document.getElementsByClassName('contextMenu')[0].remove();}catch(error){} try{document.getElementsByClassName('menuBarContainer')[0].classList.remove('hide');document.getElementsByClassName('mainContainer')[0].classList.remove('inviteContainer');document.getElementsByClassName('sideBarContainer')[0].classList.remove('hide');}catch(error){}}; 
let afterLoad = function(){};
let afterSuccess = function(){setTimeout(function(){try{document.getElementsByClassName('preView')[0].remove();}catch(error){}}, 4500);
        document.body.scrollTop = 0; setTimeout(function(){try{document.getElementsByClassName('loadBar')[0].classList.add('loadBarOpacity');}catch(error){}setTimeout(function(){try{document.getElementsByClassName('loadBar')[0].remove();}catch(error){} }, 1000);}, 500);};

function readyToOnClick(){
    Object.values(document.getElementsByTagName('amazing-click')).forEach(function(item){
    item.onclick = function(event){
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
      load(item.getAttribute('href'));
    };
    });
    Object.values(document.getElementsByTagName('a')).forEach(function(item){
        item.onclick = function(event){
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
      if(Array.from(item.classList).indexOf('exception') == -1){
          load(item.href);
      }else{
          location.href = item.href;
      }
        
        };
    });
    Object.values(document.getElementsByTagName('crazy-click')).forEach(function(item){
        item.onclick = function(event){
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
      if(Array.from(item.classList).indexOf('exception') == -1){
          load(item.innerText);
      }else{
          location.href = item.innerText;
      }
        
        };
    });
    Object.values(document.getElementsByClassName('doNothing')).forEach(function(item){
        item.onclick = function(event){
            event.stopPropagation();
            event.preventDefault();
            event.stopImmediatePropagation();
            eval(item.getAttribute('onclick'));
        };
    });
}

function changeHTML (url, htmlText){
    let newDom = new DOMParser().parseFromString(htmlText, 'text/html');
    Object.values(newDom.getElementsByTagName('canonical')).forEach(function(item){item.remove()});
    let newTitle = newDom.getElementsByTagName('title')[0];
    document.getElementsByTagName('title')[0].innerText = newTitle.innerText;
    
    let newBody = newDom.getElementsByTagName('slang-post')[0];
    document.getElementsByTagName('body')[0].replaceChild(newBody, document.getElementsByTagName('slang-post')[0]);

    if(document.getElementsByTagName('meta').length > 12){
        let metaRemove = 0;
        while(metaRemove < document.getElementsByTagName('meta').length - 12){
            try{document.getElementsByTagName('meta')[0].remove();}catch(error){}
            metaRemove++;
        }
    }
    Object.values(document.getElementsByTagName('script')).forEach(function(scriptItem){
        try{eval(scriptItem.innerHTML);}catch(error){consoleLog(`%cERROR %c(web/js/load.js)%c eval 도중 에러 던져짐...쇽!`); console.error(error)}
        });
        readyToOnClick();
    try{document.getElementsByClassName('mainContainer')[0].scrollIntoView({behavior: "auto", block: "start"});}catch(error){}
}
    
function load(url){
    try{document.getElementsByClassName('preView')[0].remove();}catch(error){}
    if(preView[url] !== undefined){
        //let preViewElement = document.createElement('div');
        //preViewElement.classList.add('preView');
        //preViewElement.innerHTML = preView[url];
        //document.getElementsByTagName('body')[0].prepend(preViewElement);
        setTimeout(function(){window.scrollTo(0,0);}, 25);
    }
    try{preView[location.href] = document.getElementsByClassName('mainContainer')[0].innerHTML;}catch(error){}
  beforeLoad(url);
  let loadUrl = new URL(url);
  let loadStatus;
  if (loadUrl.origin === domain && exception.indexOf(loadUrl.pathname) === -1){
        fetch(url, {headers: {'Slangpost-Load-Mode': 'fetch'}, redirect: 'follow'})
        .then(function(response){
            if(!response.ok){
            consoleLog('%cERROR %c(web/js/load.js)%c fetch 문제로 새 도큐멘트 렌더링 불러오기 실패');
            loadStatus = 'failed';
            return;
            }else if(response.redirected === true){
            loadStatus = 'redirected';
            return response.url;
            }else{
            loadStatus = 'succeed';
            return response.text();
            }
        })
        .then(function(returnValue){
            afterLoad();
            if(loadStatus === 'succeed'){
                history.pushState({pathname:new URL(url).pathname}, '', url);
                changeHTML(url, returnValue);
                afterSuccess();
            }else if(loadStatus === 'redirected'){
                load(returnValue);
            }else if(loadStatus === 'failed'){
                location.href = url;
            }
        });
  }else{
    if(loadUrl.origin != domain){
        window.open(url);
    }else{
        location.href = url;
    }
  }
}

window.onpopstate = function(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    load('https://slangpost.net'+event.state.pathname.replaceAll('///', '/'));
};

readyToOnClick();
setInterval(function(){readyToOnClick();}, 100);