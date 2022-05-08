let domain;
let exception = [];

let mainBodyName;

let beforeLoad = function(url){}; 
let afterLoad = function(){};
let afterSuccess = function(){};

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
    
    let newBody = newDom.getElementsByTagName(mainBodyName)[0];
    document.getElementsByTagName('body')[0].replaceChild(newBody, document.getElementsByTagName(mainBodyName)[0]);
        
    try{document.querySelector('meta[name=description]').remove();}catch(error){}
    try{document.querySelector("meta[property='og:title']").remove();}catch(error){}
    try{document.querySelector("meta[property='og:description']").remove();}catch(error){}
    try{document.querySelector("meta[property='og:image']").remove();}catch(error){}

    Object.values(document.getElementsByTagName('script')).forEach(function(scriptItem){
        try{eval(scriptItem.innerHTML);}catch(error){console.error(error)}
    });
    readyToOnClick();
}
    
function load(url){
  beforeLoad(url);
  let loadUrl = new URL(url);
  let loadStatus;
  if (loadUrl.origin === domain && exception.indexOf(loadUrl.pathname) === -1){
        fetch(url, {headers: redirect: 'follow'})
        .then(function(response){
            if(!response.ok){
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
    load(domain+event.state.pathname.replaceAll('///', '/'));
};

readyToOnClick();
setInterval(function(){readyToOnClick();}, 100);
