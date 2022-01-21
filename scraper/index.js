// Import the playwright library into our scraper.
const playwright = require('playwright');

function getSem(s) { //This will return simple characters to the object
    if (s.includes("Summer") && s.includes("Fall")){ // Summer and fall
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
    }
}
  
function getJSON(inTxt) { // This will create an array of objects that hold the information of each course
    let j;
    let objPage = [];
    let str = inTxt.split('\n'); //Splits the text so it will go line by line

    for (let i = 0; i < str.length; i++) { // for loop to get each line
        if (str[i] != '') { // Grabs only if not empty

            if (str[i].charAt(3) == '*' || str[i].charAt(4) == "*") { // This makes sure to grab only the title

                let name = str[i].trim(); //Get full course tittle
                let cCode = str[i].substring(0,9).trim(); //Get the course code
                let cCred = str[i].substring(str[i].length-7,str[i].length-3).trim(); //Get the course credit
                let sSem = getSem(str[i]); // Runs through the get semester function

                // Makes any extra not undefined
                let dDes = '';
                let pPre = '';
                let oOff = '';
                let rRes = '';
                let dDep = '';
                let lLoc = '';

                if (i+1 != str.length) {
                    j = i+1;
                }

                let temp = 0;
                while (j < (str.length) && (str[j].charAt(3) != '*' || str[j].charAt(4) != "*") ) { // This while grabs all the course information from the string
                if (temp == 0 || temp == 1) { // This grabs the description
                    dDes = str[j].trim();
                    temp++;
                } else if (str[j].includes("Offering(s):")) {
                    oOff = str[j].trim();
                } else if (str[j].includes("Restriction(s):")) {
                    rRes = str[j].trim();
                } else if (str[j].includes("Department(s):")) {
                    dDep = str[j].trim();
                } else if (str[j].includes("Location(s):")) {
                    lLoc = str[j].trim();
                } else if (str[j].includes("Prerequisite(s):")) {
                    pPre = str[j].trim();
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
                    rRes: rRes,
                    dDep: dDep,
                    lLoc: lLoc
                };
                objPage.push(obj); // Add that object to the array of objects
                console.log(obj);
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
        headless: false
    });
    // Open a new page / tab in the browser.
    const page = await browser.newPage({
        bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
    });

    const calendarURL = "https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/";

    // await page.goto(calendar);

    let programCodes = ["acct", "agr", "ansc", "anth", "arab", "arth", "asci", "bioc", "biol", "biom", "bot", "bus", "chem", "chin", "clas", "coop", "cis", "crop", "cts",
        "econ", "engg", "engl", "edrd", "envm", "envs", "eqn", "euro", "xsen", "frhd", "fin", "food", "fare", "fren", "geog", "germ", "grek",
        "hist", "hort", "htm", "hk", "hrob", "humn", "ies", "indg", "ibio", "iaef", "ips", "iss", "univ", "idev", "ital", "jls", "larc", "lat", "ling",
        "mgmt", "mcs", "math", "micr", "mcb", "mbg", "musc", "nano", "neur", "nutr", "oneh", "oagr", "path", "phil", "phys", "pbio", "pols", "popm", "port", "psyc",
        "real", "soc", "soan", "span", "stat", "sart", "thst", "tox", "vetm", "wmst", "zoo"];

    // console.log(programCodes.length);

    // Tell the tab to navigate to the various program topic pages.
    for (let i = 0; i < programCodes.length; i++) {
        let url = calendarURL.concat(programCodes[i]).concat("/");
        await page.goto(url);
        let inTxt = await page.innerText('div.sc_sccoursedescs'); // Grabs a string from that page
        getJSON(inTxt); // Get the object array from that string
    }

    // Turn off the browser to clean up after ourselves.
    await browser.close();
}

main();