
window.getLinks = function(){
    for(let el of document.getElementsByTagName("ytd-video-secondary-info-renderer")[0].getElementsByTagName("yt-formatted-string"))
        if(el.className === "content style-scope ytd-video-secondary-info-renderer"){
            let links = {};
            links["classLinks"] = [];
            links["classQuestions"] = [];
            links["thaLinks"] = [];
            links["otherLinks"] = [];

            // check if any tha is given
            const haveTHA = (el.innerText.toLowerCase().indexOf("tha") > -1);
            let thaFound = false;

            // If program should search only for questions
            let questionOnly = false;

            // traverse through the description
            for(let child of el.childNodes)
                // when there is any link
                if (child.tagName === "A") {
                    let link = {};
                    link['url'] = child.href;

                    // check if the link is of a question
                    if (child.innerText.toLowerCase().indexOf("leetcode") > -1 || child.innerText.toLowerCase().indexOf("geeksforgeeks") > -1)
                        if (haveTHA)
                            if (thaFound)
                                links["thaLinks"].push(link);
                            else
                                links["classQuestions"].push(link);
                        else
                            links["classQuestions"].push(link);
                    else if (!questionOnly)
                        if (haveTHA)
                            if (thaFound)
                                links["otherLinks"].push(link);
                            else
                                links["classLinks"].push(link);
                        else
                            links["otherLinks"].push(link);
                }
                else if (child.tagName === "SPAN")
                    if(child.innerText.toLowerCase().indexOf("tha") > -1)
                        thaFound = true;
                    else if(child.innerText.toLowerCase().indexOf("github") > -1)
                        questionOnly = true;
                    else if(child.innerText.toLowerCase().indexOf("discord") > -1)
                        questionOnly = true;
                    else if(child.innerText.toLowerCase().indexOf("notion") > -1)
                        questionOnly = true;

            return links;
        }
}

// open video description
document.getElementById("more").click();
