// Import the playwright library into our scraper.
const playwright = require('playwright');
const fs = require('fs');

let wWin = [];
let fFal = [];
let sSum = [];

function getTextFrom(s,t) {
    tmp = s.split(t);
    return tmp[1].trim();
}

function getSem(s) { //This will return simple characters to the object
    if (s.includes("Summer") && s.includes("Fall") && s.includes("Winter")) {
        return "SFW";
    } else if (s.includes("Summer") && s.includes("Fall")){ // Summer and fall
      return "SF";
    } else if (s.includes("Summer") && s.includes("Winter")){ // Summer and winter
      return "SW";
    } else if (s.includes("Fall") && s.includes("Winter")) { // Fall and winter
      return "FW";
    } else if (s.includes("Fall")) { // Fall
      return "F";
    } else if (s.includes("Summer")) { // Summer
      return "S";
    } else if (s.includes("Winter")) { // Winter
      return "W";
    } else {
        return "U";
    }
}
 
/**
 * @name getJSON
 * @description This fucntion will 
 * @param {string} str 
 * @param {boolean} asString 
 * @param {*} seed 
 * 
 * @returns {string} hash
 */
function getJSON(inTxt) { // This will create an array of objects that hold the information of each course
    let j;
    let objPage = [];
    let str = inTxt.split('\n'); //Splits the text so it will go line by line

    for (let i = 0; i < str.length; i++) { // for loop to get each line
        if (str[i] != '') { // Grabs only if not empty

            if (str[i].charAt(3) == '*' || str[i].charAt(4) == "*") { // This makes sure to grab only the title

                let tmp1 = str[i].trim(); //Get full course tittle
                let tmp = tmp1.split(/\s{2}/);
                let name = tmp[1];


                let cCode = str[i].substring(0,9).trim(); //Get the course code
                let cCred = str[i].substring(str[i].length-7,str[i].length-3).trim(); //Get the course credit
                let sSem = getSem(str[i]); // Runs through the get semester function

                // Makes any extra not undefined
                let dDes = '';
                let pPre = '';
                let eEqu = '';
                let oOff = '';
                let rRes = '';
                let dDep = '';
                let lLoc = '';

                if (i+2 != str.length) {
                    j = i+2;
                }

                let temp = 0;

                let fLoc = 0;


                while (j < (str.length) && temp < 2 && fLoc != 1 && (str[j].charAt(3) != '*' || str[j].charAt(4) != "*")  ) { // This while grabs all the course information from the string
                    //console.log(str[j]);
                    
                    if (str[j] == "") { // This grabs the description
                        temp++;
                        j++
                    } 
                    if (str[j].includes("Offering(s):")) {
                        oOff = getTextFrom(str[j],"Offering(s):");
                    } else if (str[j].includes("Restriction(s):")) {
                        rRes = getTextFrom(str[j],"Restriction(s):");
                    } else if (str[j].includes("Equate(s):")) {
                        eEqu = getTextFrom(str[j],"Equate(s):");
                    } else if (str[j].includes("Department(s):")) {
                        dDep = getTextFrom(str[j],"Department(s):");
                    } else if (str[j].includes("Location(s):") && fLoc == 0) {
                        lLoc = getTextFrom(str[j],"Location(s):");
                        fLoc == 1;
                    } else if (str[j].includes("Prerequisite(s):")) {
                        pPre = getTextFrom(str[j],"Prerequisite(s):");
                    } else {
                        dDes = str[j].trim();
                    }
                    j++;
                }

                let obj =  { // Create the object to hold the course information
                    name: name,
                    cCode: cCode,
                    cCred: cCred,
                    sSem: sSem,
                    dDes: dDes,
                    pPre: pPre,
                    oOff: oOff,
                    eEqu: eEqu,
                    rRes: rRes,
                    dDep: dDep,
                    lLoc: lLoc
                };
                if ((obj.sSem).includes("W")) {
                    wWin.push(obj);
                }
                if ((obj.sSem).includes("S")) {
                    sSum.push(obj);
                }
                if ((obj.sSem).includes("F")) {
                    fFal.push(obj);
                } 
                objPage.push(obj); // Add that object to the array of objects
                //console.log(obj);
            }
        }
    }
    //console.log(objPage);
    return objPage;
}

async function main() {
    // Open a Chromium browser. We use headless: false
    // to be able to watch what's going on.
    const browser = await playwright.chromium.launch({
        headless: true
    });
    // Open a new page / tab in the browser.
    const page = await browser.newPage({
        bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
    });

    const calendarURL = "https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/";

    // await page.goto(calendar);

    let programCodes = ["acct", "agr", "ansc", "anth", "arab", "arth", "asci", "bioc", "biol", "biom", "bot", "bus", "chem", "chin", "clas", "coop", "cis", "crop", "cts",
        "econ", "engg", "engl", "edrd", "envm", "envs", "eqn", "euro", "xsen", "frhd", "fin", "food", "fare", "fren", "geog", "germ", "grek",
        "hist", "hort", "htm", "hk", "hrob", "humn", "ies", "indg", "ibio", "ieaf", "ips", "iss", "univ", "idev", "ital", "jls", "larc", "lat", "ling",
        "mgmt", "mcs", "math", "micr", "mcb", "mbg", "musc", "nano", "neur", "nutr", "oneh", "oagr", "path", "phil", "phys", "pbio", "pols", "popm", "port", "psyc",
        "real", "soc", "soan", "span", "stat", "sart", "thst", "tox", "vetm", "wmst", "zoo"];

    // console.log(programCodes.length);

    let aProg = [];


    // Tell the tab to navigate to the various program topic pages.
    for (let i = 0; i < programCodes.length; i++) {
        let url = calendarURL.concat(programCodes[i]).concat("/");
        await page.goto(url);

        let title = await page.textContent('h1.page-title');
        //console.log(title);
        tPtr = title.split('(');

        let pName =  tPtr[0].trim();
        let pCode;

        if (tPtr[1] != null && (tPtr[1].length == 5)) {
            pCode = tPtr[1].substring(0,4);
        } else if (tPtr[1] != null && (tPtr[1].length == 4)) {
            pCode = tPtr[1].substring(0,3);
        }

        // Get all the text within the program page
        let inTxt = await page.innerText('div.sc_sccoursedescs'); // Grabs a string from that page

        let obj =  {
            pName: pName,
            pCode: pCode,
            pCour: getJSON(inTxt) // Get the object array from that string
        };

        aProg.push(obj);        

    }

    fs.writeFile('/JSON/AllCourses.json', JSON.stringify(aProg, null,'\t'), (err) => {
        if (err) {
            throw err;
        }
        //console.log("JSON data is saved.");
    });

    fs.writeFile('/JSON/Winter.json', JSON.stringify(wWin, null,'\t'), (err) => {
        if (err) {
            throw err;
        }
        //console.log("JSON data is saved.");
    });

    fs.writeFile('/JSON/Fall.json', JSON.stringify(fFal, null,'\t'), (err) => {
        if (err) {
            throw err;
        }
        //console.log("JSON data is saved.");
    });

    fs.writeFile('/JSON/Summer.json', JSON.stringify(sSum, null,'\t'), (err) => {
        if (err) {
            throw err;
        }
        //console.log("JSON data is saved.");
    });

    // Turn off the browser to clean up after ourselves.
    await browser.close();
}

main();