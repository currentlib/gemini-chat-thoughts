const gemini = require("gemini-server");
let fs = require("fs");
let utf8 = require("utf8");




String.prototype.allReplace = function(obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};

// console.log('aabbaabbcc'.allReplace({'a': 'h', 'b': 'o'}));








let options = {
    cert: fs.readFileSync('cert.pem', 'utf8'),
    key: fs.readFileSync('key.pem', 'utf8')
}

let header = fs.readFileSync('./static/header.txt', 'utf8');

let messages = [];

const app = gemini(options);


app.on("/", (req, res) => {
    console.log(req);
    console.log(res);
    res.file("static/test.gmi");
})

app.on("/chat", (req, res) => {
    res.file("static/msgs.gmi");
})

app.on('/send', (req, res) => {
    console.log(req)
    console.log(res)
    if(req.query){
        console.log(req)
        messagesGenerator(req.query);
        res.redirect('/chat')
    }else{
        res.input('Type your message: ');
    }
});

app.on('/chatUpd', gemini.redirect("/chat"));

app.listen(()=>{
    console.log("Listening...")
});

function messagesGenerator(newMsg) {
    let msgs = header;
    // messager.write(header);
    messages.length == 100 ? messages.splice(0, 1) : false;
    let time = new Date();
    time = `${('0' + time.getDate()).slice(-2)}/${('0' + (time.getMonth()+1)).slice(-2)} ${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}:${('0' + time.getSeconds()).slice(-2)}`
    messages.push(`${time} -> ` + decodeURI(newMsg));
    for (let i = messages.length-1; i>=0; i--) {
        msgs+=`

${messages[i].allReplace({
    "%20": " ",
    "%3F": "?",
    "%21": "!",
    "%22": '"',
    "%23": "#",
    "%24": "$",
    "%25": "%",
    "%26": "&",
    "%27": "'",
    "%28": "(",
    "%29": ")"})}
`

/*

.allReplace({
    "%20": " ",
    "%3F": "?",
    "%21": "!",
    "%22": '"',
    "%23": "#",
    "%24": "$",
    "%25": "%",
    "%26": "&",
    "%27": "'",
    "%28": "(",
    "%29": ")",
    "%2a": "*"


*/
    }
    fs.writeFile('static/msgs.gmi', msgs, (err) => {
        if (err) {
            console.log(err)
        }
    })
}
