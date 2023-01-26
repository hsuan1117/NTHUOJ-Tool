$("#overview tbody > tr").each((i,elem)=>{
    const prob = $(elem).find("td").eq(0).text()
    fetch(`https://acm.cs.nthu.edu.tw/status/?username=${$('#name-text').text()}&pid=${prob}&cid=&status=AC`).then(res=>res.text()).then(data=>{
        if(data.indexOf("No submissions found for the given query!") > -1) {
            $(elem).find("td").css("background-color", "#f2dede")
        } else {
            $(elem).find("td").css("background-color", "#dff0d8")
        }
    })
})