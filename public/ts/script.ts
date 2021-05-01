fetch("/", {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: ''
}).then((response) => {
    response.json().then((rows) => {
        let questionCount = 0;
        let thaCount = 0;
        document.createElement("noscript").remove();
        let lastDayDiv = null;

        for(let row of rows){
            let dayDiv = document.createElement("div");
            let video = document.createElement("a");
            video.innerHTML = row.ytitle;
            video.href = row.ylink;
            video.target = "_blank";
            dayDiv.append(video);

            let allLinks = row.links = JSON.parse(row.links);
            console.log(row);

            if(allLinks.classLinks.length > 0){
                let classLinks = allLinks.classLinks;
                let classLinksDiv = document.createElement("div");
                let typeDiv = document.createElement("div");
                classLinksDiv.append(typeDiv);
                typeDiv.innerHTML = "Links Provided For Class";
                for(let classLink of classLinks) {
                    let div = document.createElement("div");
                    let link = document.createElement("a");
                    link.innerHTML = classLink.title;
                    link.href = classLink.url;
                    link.target = "_blank";
                    div.append(link);
                    classLinksDiv.append(div);
                }
                dayDiv.append(classLinksDiv);
            }

            if(allLinks.classQuestions.length > 0){
                let classQuestions = allLinks.classQuestions;
                let classQuestionsDiv = document.createElement("div");
                let typeDiv = document.createElement("div");
                classQuestionsDiv.append(typeDiv);
                typeDiv.innerHTML = "Questions Done In The Class";
                for(let classQuestion of classQuestions) {
                    let div = document.createElement("div");
                    let link = document.createElement("a");
                    link.innerHTML = "Q." + (++questionCount) + " | C." + (questionCount - thaCount) + " | " +
                        classQuestion.title;
                    link.href = classQuestion.url;
                    link.target = "_blank";
                    div.append(link)
                    classQuestionsDiv.append(div);
                }
                dayDiv.append(classQuestionsDiv);
            }

            if(allLinks.thaLinks.length > 0){
                let thaLinks = allLinks.thaLinks;
                let thaLinksDiv = document.createElement("div");
                let typeDiv = document.createElement("div");
                thaLinksDiv.append(typeDiv);
                typeDiv.innerHTML = "THAs Given For Practice";
                for(let thaLink of thaLinks) {
                    let div = document.createElement("div");
                    let link = document.createElement("a");
                    link.innerHTML =  "Q." + (++questionCount) + " | T." + (++thaCount) + " | " +
                        thaLink.title;
                    link.href = thaLink.url;
                    link.target = "_blank";
                    div.append(link);
                    thaLinksDiv.append(div);
                }
                dayDiv.append(thaLinksDiv);
            }
            if(lastDayDiv)
                document.getElementById("linksOutput").insertBefore(dayDiv, lastDayDiv);
            else
                document.getElementById("linksOutput").append(dayDiv);
            lastDayDiv = dayDiv;
        }
    });
});
