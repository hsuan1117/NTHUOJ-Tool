let status = JSON.parse(localStorage.getItem('status') ?? "{}")
const last_time = parseInt(localStorage.getItem("last_fetch_time") ?? Date.now())
const statusEmoji = {
    "AC": "🟢 ",
    "WA": "🔴 "
}
const statusColor = {
    "AC": "green",
    "WA": "red"
}
const need_refetch = []

function writeMain(push = true) {
    $("#overview tbody > tr").each((i,elem)=>{
        const prob = $(elem).find("td").eq(0).text()

        if(prob in status) {
            if(status[prob] === "AC") {
                $(elem).find("td").css("background-color", "#dff0d8")
            } else {
                if(push)need_refetch.push(prob)
                $(elem).find("td").css("background-color", "#f2dede")
            }
        } else{
            if(push)need_refetch.push(prob)
            $(elem).find("td").css("background-color", "#f2dede")
        }
    })
    if(push)fetchData()
}

function fetchData(force = false) {
    const username = $('#name-text')
    if(username.length === 0) return;
    if(Date.now() - last_time < 60 * 1000 && !force) return;
    need_refetch.forEach(prob => {
        fetch(`https://acm.cs.nthu.edu.tw/status/?username=${username.text()}&pid=${prob}&cid=&status=AC`).then(res=>res.text()).then(data=>{
            if(data.indexOf("No submissions found for the given query!") > -1) {
                status[prob] = "WA"
            } else {
                status[prob] = "AC"
            }
            writeDropdown()
            writeMain(false)
            writeStorage()
        })
    })
}

function writeDropdown() {
    $("#contest_tab > li.dropdown > ul > li > a").each((i,elem)=>{
        const prob = /\d+/.exec(elem.href.split("#")[1])[0]
        elem.textContent = statusEmoji[status[prob]] + (elem.textContent.replace("🟢 ", "").replace("🔴 ","") ?? "")
        elem.style.color = statusColor[status[prob]]
    })
}

function writeStorage() {
    localStorage.setItem("status", JSON.stringify(status))
    localStorage.setItem("last_time", Date.now())
}

function makeButton() {
    const li = $("<li></li>")
    li.css("cursor", "pointer")
    li.attr("role", "presentation")
    li.click(()=>{
        alert("refresh")
        fetchData(true)
        writeMain()
        writeDropdown()
    })
    li.append("<a>Refresh</a>")
    $("#contest_tab").append(li)
}

// init
if(location.href.startsWith("https://acm.cs.nthu.edu.tw/contest/")){
    writeMain()
    writeDropdown()
    makeButton()
}