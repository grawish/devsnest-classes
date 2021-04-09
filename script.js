
window.getLinks = function(){
    for(let el of document.getElementsByTagName("ytd-video-secondary-info-renderer")[0].getElementsByTagName("yt-formatted-string")){
    if(el.className === "content style-scope ytd-video-secondary-info-renderer"){
        let links = {};
        links["classLinks"] = []
        links["classQuestions"] = []
        links["thaLinks"] = []
        links["otherLinks"] = []

        const haveTHA = (el.innerText.toLowerCase().indexOf("tha") > -1);
        let thaFound = false;

        for(let child of el.childNodes){
            if (child.tagName === "A") {
                let link = {};
                link['text'] = child.innerText;
                link['href'] = child.href;
                if(child.innerText.toLowerCase().indexOf("leetcode") > -1){
                    if(haveTHA){
                        if(thaFound)
                            links["thaLinks"].push(link);
                        else
                            links["classQuestions"].push(link);
                    }
                    else
                        links["classQuestions"].push(link);
                }
                else{
                    if(haveTHA){
                        if(thaFound)
                            links["otherLinks"].push(link);
                        else
                            links["classLinks"].push(link);
                    }
                    else
                        links["otherLinks"].push(link);
                }
            }
            else if (child.tagName === "SPAN") {
                if(child.innerText.toLowerCase().indexOf("tha") > -1){
                    thaFound = true;
                }
                if(child.innerText.toLowerCase().indexOf("github") > -1){
                    break;
                }
            }
        }
        return links;
    }}
}

document.getElementById("more").click();
