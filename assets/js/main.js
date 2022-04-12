let valuesObj = {
    '[g]': { 'sliceAmount': 3, 'id': 'a' },
    '[r]': { 'sliceAmount': 3, 'id': 'b' },
    '[b]': { 'sliceAmount': 3, 'id': 'c' },
    '[link]': { 'sliceAmount': 6, 'id': '' },
    '[br]': { 'sliceAmount': 4, 'id': '' },
}

let values = new Map(Object.entries(valuesObj));

function addChar(char, element) {
    element.innerHTML += char;
}

function removeChar(element) {
    element.innerHTML = element.innerHTML.slice(0, element.innerHTML.length - 1);
}

const timer = ms => new Promise(res => setTimeout(res, ms))

async function parseText(textarr) {
    for (let line of textarr) {
        let value = /\[.{1,99}\]/.exec(line);
        if (value == null || value.index != 0) {
            let element = document.getElementById('console');
            for (let char of line) {
                addChar(char, element);
                let randTest = Math.random()*100;
                if(randTest < 30){
                    await timer(30);
                }else{
                    await timer(Math.random() * 10 + 5);
                }
                continue;
            }
            continue;
        } else if (values.has(value[0])) {
            let obj = values.get(value[0]);
            let id = obj.id;
            let style = value[0].slice(1, -1);
            let type = 'span';
            let link = null;
            line = line.slice(obj.sliceAmount);
            if (style == "link") {
                link = /\(.{1,99}\)/.exec(line);
                line = line.slice(link[0].length);
                type = 'a';
            } else if (style == 'br') {
                type = 'br';
            }
            let element = document.createElement(type);
            document.getElementById('console').appendChild(element);
            element.setAttribute('id', id);
            if (link) {
                element.setAttribute('href', link[0].slice(1, link[0].length - 1));
            }
            for (let i = 0; i < line.length; i++) {
                addChar(line[i], element);
                let randTest = Math.random()*100;
                if(randTest < 30){
                    await timer(30);
                }else{
                    await timer(Math.random() * 10 + 5);
                }
                continue;
            }
            window.scrollBy(0, 200);
            continue;
        }
    };
}

async function getFile(file) {
    let textarr;
    function changeText(value){
        textarr = value;
    }
    $.get(file, function(data) {
        changeText(data.split('\r\n'));
    });
    await timer(100);
    await parseText(textarr);
}

async function preFab() {
    await getFile('assets/txt/console.txt');
    await getFile('assets/txt/justanobody.txt');
    await getFile('assets/txt/console.txt');
    await getFile('assets/txt/commands.txt');
    await getFile('assets/txt/console.txt');
}

preFab();

let addedCount = 0;

function addText(key) {
    let element = document.getElementById('console');
    let keyCodes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 32];
    let specialCodes = [13, 8];
    let text;
    if (keyCodes.includes(key.keyCode)) {
        text = key.key;
        addChar(text, element);
        addedCount++;
    } else if (specialCodes.includes(key.keyCode)) {
        if (key.keyCode == 8) {
            if (addedCount > 0) {
                removeChar(element);
                addedCount--;
            }
        } else if (key.keyCode == 13) {
            let command = element.innerHTML.slice(element.innerHTML.length - addedCount, element.innerHTML.length);
            if (command == "help") {
                getFile('assets/txt/help.txt');
                addedCount = 0;
            } else if (command == "matrix") {
                window.open("https://chat.justanobody.live/", "_self");
            } else if (command == "socials") {
                getFile('assets/txt/socials.txt');
                addedCount = 0;
            } else if (command == "portfolio") {
                window.open("https://real.justanobody.live/", "_self");
            } else if (command == "discord") {
                window.open("https://discord.gg/CxtxXUcEfC", "_self");
            } else {
                element.innerHTML += "<br/><br/>Unknown command: " + command + "<br/><br/>";
                getFile('assets/txt/console.txt');
                addedCount = 0;
            }
        }
    }
}

document.onkeydown = addText;