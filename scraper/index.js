/* ----------------- Import the required libraries ----------------- */
const playwright = require('playwright');
const fs = require('fs');

/**
 * Program Information
 * @author Harsh Topwala, Jainil Patel, Nicholas Baker, Lourenco Velez, Farid Hamid
 * @version "1.0.0"
 * @maintainer "Nicholas Baker, Jainil Patel" 
 * @email "nbaker05@uoguelph.ca, jainil@uoguelph.ca" 
 * @status "Development"
 */

/* ----------------- Arrays to store courses for each semester ----------------- */
let wWin = [];
let fFal = [];
let sSum = [];

/**
 * @name getTextFrom
 * @description This fucntion will split the spt value in the str string
 * @param {string} str This string holds the information we want
 * @param {string} spt This string holds what we want to take away from str
 * @returns {string} With only information we want
 */
let getTextFrom = (str, spt) => {
    ret = str.split(spt); // Split the string
    return ret[1].trim();
}

/**
 * @name getSem
 * @description This function will go though the given string and determine which semesters are within
 * @param {string} str This string holds the information we want
 * @returns {string} With the semesters the course is in
 */
let getSem = (str) => {

    let ret = "";

    if (str.includes("Summer")) { // Checks for Summer
        ret += "S";
    }
    if (str.includes("Fall")) { // Checks for Fall
        ret += "F";
    }
    if (str.includes("Winter")) { // Checks for Winter
        ret += "W";
    }
    if (str.includes("Unspecified")) { // Checks for Unspecified
        ret += "U";
    }

    return ret;
}

/**
 * @name getJSON
 * @description This fucntion will make an array of courses
 * @param {string} inTxt is all the text within the current program
 * @returns {Object array} This will hold all the courses within the current program  
 */
let getJSON = (inTxt) => {

    let j;
    let objPage = [];
    let str = inTxt.split('\n'); //Splits the text so it will go line by line

    for (let i = 0; i < str.length; i++) { // for loop to get each line
        if (str[i] != '') { // Grabs only if not empty

            /* ----------------- Declare Variables ----------------- */
            let tmp1 = str[i].trim(); //Get full course tittle
            let tmp = tmp1.split(/\s{2}/);
            let name = tmp[1];
            let cCode = str[i].substring(0, 9).trim(); //Get the course code
            let cCred = str[i].substring(str[i].length - 7, str[i].length - 3).trim(); //Get the course credit
            let sSem = getSem(str[i]); // Runs through the get semester function
            let dDes = '';
            let pPre = '';
            let eEqu = '';
            let oOff = '';
            let rRes = '';
            let dDep = '';
            let lLoc = '';
            let temp = 0;
            let fLoc = 0;

            if (str[i].charAt(2) == '*' || str[i].charAt(3) == '*' || str[i].charAt(4) == "*") { // This makes sure to grab only the title


                if (i + 2 != str.length) { // This skips the first two empty lines on each course
                    j = i + 2;
                }

                while (j < (str.length) && temp < 2 && fLoc != 1 && (str[j].charAt(3) != '*' || str[j].charAt(4) != "*")) { // This while grabs all the course information from the string

                    /* ----------------- Main functionality grabing the information from courses ----------------- */
                    if (str[j] == "") { // Skips empty
                        temp++;
                        j++
                    }
                    if (str[j].includes("Offering(s):")) { // Grabs offerings
                        oOff = getTextFrom(str[j], "Offering(s):");
                    } else if (str[j].includes("Restriction(s):")) { // Grabs restrictions
                        rRes = getTextFrom(str[j], "Restriction(s):");
                    } else if (str[j].includes("Equate(s):")) { // Grabs Equates
                        eEqu = getTextFrom(str[j], "Equate(s):");
                    } else if (str[j].includes("Department(s):")) { // Grabs departments
                        dDep = getTextFrom(str[j], "Department(s):");
                    } else if (str[j].includes("Location(s):") && fLoc == 0) { // Grabs locations
                        lLoc = getTextFrom(str[j], "Location(s):");
                        fLoc == 1;
                    } else if (str[j].includes("Prerequisite(s):")) { // Grabs prerequisites
                        pPre = getTextFrom(str[j], "Prerequisite(s):");
                    } else { // Grabs descriptions
                        dDes = str[j].trim();
                    }
                    j++; // Increment
                }

                /* ----------------- Create the object to hold the course information ----------------- */
                let obj = {
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

                /* ----------------- Add each course to the appropriate semester array ----------------- */
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
            }
        }
    }
    return objPage;
}

/**
 * @name getJSONFile
 * @description This fucntion will print all the courses for json files
 * @param {Object array} aProg is all the programs
 */
let getJSONFile = (aProg) => {
    if (!fs.existsSync("./JSON")) { // Checks to see if the folder exists
        fs.mkdir("./JSON", (err) => {
            if (err) {
                throw err;
            }
        });
    }
    fs.writeFile('./JSON/AllCourses.json', JSON.stringify(aProg, null, '\t'), (err) => {
        if (err) {
            throw err;
        }
    });
    fs.writeFile('./JSON/Winter.json', JSON.stringify(wWin, null, '\t'), (err) => {
        if (err) {
            throw err;
        }
    });
    fs.writeFile('./JSON/Fall.json', JSON.stringify(fFal, null, '\t'), (err) => {
        if (err) {
            throw err;
        }
    });
    fs.writeFile('./JSON/Summer.json', JSON.stringify(sSum, null, '\t'), (err) => {
        if (err) {
            throw err;
        }
    });
}

/**
 * @name main
 * @description This is the main for the program
 */
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
        "hist", "hort", "htm", "hk", "hrob", "humn", "ies", "indg", "ibio", "iaef", "ips", "iss", "univ", "idev", "ital", "jls", "larc", "lat", "ling",
        "mgmt", "mcs", "math", "micr", "mcb", "mbg", "musc", "nano", "neur", "nutr", "oneh", "oagr", "path", "phil", "phys", "pbio", "pols", "popm", "port", "psyc",
        "real", "soc", "soan", "span", "stat", "sart", "thst", "tox", "vetm", "wmst", "zoo"];

    // console.log(programCodes.length);

    let aProg = [];


    // Tell the tab to navigate to the various program topic pages.
    for (let i = 0; i < programCodes.length; i++) {

        // Go to the programs page
        let url = calendarURL.concat(programCodes[i]).concat("/");
        await page.goto(url);

        // get the full program name
        let title = await page.textContent('h1.page-title');
        tPtr = title.split('(');

        // Get the program name and code
        let pName = tPtr[0].trim();
        let pCode;

        // Grab the program code from the title
        if (tPtr[1] != null && (tPtr[1].length == 5)) {
            pCode = tPtr[1].substring(0, 4);
        } else if (tPtr[1] != null && (tPtr[1].length == 4)) {
            pCode = tPtr[1].substring(0, 3);
        } else if (tPtr[1] != null && (tPtr[1].length == 3)) {
            pCode = tPtr[1].substring(0, 2);
        }

        // Get all the text within the program page
        let inTxt = await page.innerText('div.sc_sccoursedescs'); // Grabs a string from that page

        // Program object
        let obj = {
            pName: pName,
            pCode: pCode,
            pCour: getJSON(inTxt) // Get the object array from that string
        };

        // Add to the overall 
        aProg.push(obj);
    }

    // Print the courses to a JSON folder
    getJSONFile(aProg);

    // Turn off the browser to clean up after ourselves.
    await browser.close();
}

main();