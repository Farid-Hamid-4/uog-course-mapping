/* ----------------- Import the required libraries ----------------- */
const playwright = require('playwright');
const fileSystem = require('fs');
const { join } = require('path');
const { match } = require('assert');
const { title } = require('process');

/**
 * Program Information
 * @author Farid Hamid, Harsh Topwala, Jainil Patel, Lourenco Velez, Nicholas Baker
 * @version "1.0.0"
 * @maintainer "Jainil Patel, Nicholas Baker" 
 * @email "jainil@uoguelph.ca, nbaker05@uoguelph.ca" 
 * @status "Development"
 */

/* ----------------- Arrays to store courses for each semester ----------------- */
let winterCoursesArray = [];
let fallCoursesArray = [];
let summerCoursesArray = [];
let majorList = [];

/**
 * @name getTextFrom
 * @description This fucntion will split the keyword in searchString
 * @param {string} searchString This string holds the information we want
 * @param {string} keyword This string holds what we want to take away from searchString
 * @returns {string} With only information we want
 */
let getTextFrom = (searchString, keyword) => {
    ret = searchString.split(keyword); // Split the string
    return ret[1].trim();
}

/**
 * @name getSem
 * @description This function will go through the given string and determine which semesters are within
 * @param {string} courseTitle This string holds the information we want
 * @returns {string} With the semesters the course is in
 */
let getSem = (courseTitle) => {

    let ret = "";

    if (courseTitle.includes("Summer")) { // Checks for Summer
        ret += "S";
    }
    if (courseTitle.includes("Fall")) { // Checks for Fall
        ret += "F";
    }
    if (courseTitle.includes("Winter")) { // Checks for Winter
        ret += "W";
    }
    if (courseTitle.includes("Unspecified")) { // Checks for Unspecified
        ret += "U";
    }

    return ret;
}

/**
 * @name getOf
 * @description This function will go though the given string and determine which semesters are within
 * @param {string} prerequisitesSpaceSplit This string holds the course requirements split by spaces. Ex: [CIS*3760] [(1] [of] ...
 * @param {integer} index This integer holds the current prerequisitesSpaceSplit string index being checked that matches course prerequisites
 * @returns {boolean} Returns true or false, true if there is an 'of', and false if there is not
 */
let getOf = (prerequisitesSpaceSplit,index) => {

    let before, after, of;

    for (let i = 0; i < prerequisitesSpaceSplit.length; i++) { // Loops through course prerequisites separated by space and searches for 1 of case. (1 of ...)
        if (prerequisitesSpaceSplit[i].includes("(")) { // Checks for first bracket of case
            before = i; // Keeps track of first bracket index
        } else if (prerequisitesSpaceSplit[i].includes(")")) { // Checks for last bracket of casae
            after = i; // Keeps track of last bracket index
        } else if (prerequisitesSpaceSplit[i].includes("of")) { // Checks for keyword 'of'
            of = i; // Keeps track of 'of' index
        }
        if (before != null && after != null && of != null) { // If all keys are found then check if it meets format
            if ((before < of) && (of < index) && (index <= after)) { // if format is (# of ...) then return true
                return true
            }
        }
    }
    return false
}

/**
 * @name getPreCode
 * @description This function will go though the given string and determine which semesters are within
 * @param {string} prereqStr This string holds the requirements for the current course
 * @returns {Object} courseRequirementGrp holds the requirement groups, or/of cases, and mandatory
 */
let getPreCode = (prereqStr) => {

    let courseRequirementGrp = {
        or_courses: [],
        mandatory: []
    };

    let prerequisitesSpaceSplit = prereqStr.split(" "); // splits the prerequisite string so it can go word by word to find cases, "or" "1 of" "2 of", e.t.c
    let coursePrereqs = prereqStr.match(/[A-Z*]{2,5}[0-9]{4}/g); // splits the prerequisite string and holds the course codes in the string

    if (coursePrereqs != null) {
        if (prereqStr.includes("or") || prereqStr.match(/[(1-9 ]{3}[of]{2}/g) != null) { // If there is an "or" case or a "(# of ...)" case

            /* Loop through the course codes in the prerequisites */
            for (let i = 0; i < coursePrereqs.length; i++) {
                
                /* Loop through all words in prerequisites */
                for (let j = 0; j < prerequisitesSpaceSplit.length; j++) {
                    if (j == 0 && prerequisitesSpaceSplit[j].includes(coursePrereqs[i])) { // Case 1: index 0 is a course code
                        if (prerequisitesSpaceSplit[j+1].includes("or")) { // Check if an "or" comes after course code "CIS*# or ...", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(coursePrereqs[i]);
                        } else { // else it is a mandatory, push to mandatory array
                            courseRequirementGrp.mandatory.push(coursePrereqs[i]);
                        }
                    } else if (j > -1 && j < prerequisitesSpaceSplit.length-1 && prerequisitesSpaceSplit[j].includes(coursePrereqs[i])) { // Case 2: index 1->(length-1)
                        if (prerequisitesSpaceSplit[j+1].includes("or")) { // Check if an "or" comes after course code "CIS*# or ...", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(coursePrereqs[i]);
                        } else if (prerequisitesSpaceSplit[j-1].includes("or")) { // Check if an "or" comes before course code "... or CIS*#", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(coursePrereqs[i]);
                        } else if (getOf(prerequisitesSpaceSplit,j))  { // Check if current course code falls within (# of .course code here..), if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(coursePrereqs[i]);
                        } else { // else it is mandatory, push to mandatory array
                            courseRequirementGrp.mandatory.push(coursePrereqs[i]);
                        }
                    } else if (j <= prerequisitesSpaceSplit.length && prerequisitesSpaceSplit[j].includes(coursePrereqs[i])) { // Case 3: 
                        if (prerequisitesSpaceSplit[j-1].includes("or")) { // Check if or comes after course code "CIS*# or ...", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(coursePrereqs[i]);
                        } else if (getOf(prerequisitesSpaceSplit,j))  { // Check if current course code falls within (# of .course code here..), if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(coursePrereqs[i]);
                        } else { // else it is mandatory, push to mandatory array
                            courseRequirementGrp.mandatory.push(coursePrereqs[i]);
                        }
                    }
                }
            }
        } else if (prereqStr.match(/[1-9 ]{2}[of]{2}/g) != null) { // If it does not have an "or", and it is not a "(# of ...)" case, check if it is a "# of ..." case. No brackets. Then it they are all or cases
            courseRequirementGrp.or_courses = coursePrereqs;
        } else { // If it does not have an "or", it is not a "(# of ...)", and it is not a "# of ..." case, then all course codes are mandatory
            courseRequirementGrp.mandatory = coursePrereqs;
        }
    } 
    return courseRequirementGrp;
}

let getPreCode2 = (prereqStr) => {

    let courseRequirementGrp = {
        or_courses: [],
        mandatory: []
    };

    let coursePrereqs = prereqStr.match(/[A-Z]{4}[ ]{1}[0-9D]{3,5}/g); // splits the prerequisite string and holds the course codes in the string
    
    if (coursePrereqs != null) {
        let tmp = prereqStr.match(/[A-Z]{4}[ ]{1}[0-9D]{3,5}/g);
        for (let i = 0; i < coursePrereqs.length; i++) {
            coursePrereqs[i] = coursePrereqs[i].replace(" ","*");
        }
        for (let i = 0; i < coursePrereqs.length; i++) { // This sets all the matching spaces to stars
            prereqStr = prereqStr.replace(tmp[i],coursePrereqs[i]);
        }

        
        let prerequisitesSpaceSplit = prereqStr.split(" "); // splits the prerequisite string so it can go word by word to find cases, "or" "1 of" "2 of", e.t.c
        if (prereqStr.includes("or") || prereqStr.match(/[(1-9 ]{3}[of]{2}/g) != null) { // If there is an "or" case or a "(# of ...)" case

            /* Loop through the course codes in the prerequisites */
            for (let i = 0; i < coursePrereqs.length; i++) {
                
                /* Loop through all words in prerequisites */
                for (let j = 0; j < prerequisitesSpaceSplit.length; j++) {
                    if (j == 0 && prerequisitesSpaceSplit[j].includes(coursePrereqs[i])) { // Case 1: index 0 is a course code
                        if (prerequisitesSpaceSplit[j+1].includes("or") || prerequisitesSpaceSplit[j+1].includes("OR")) { // Check if an "or" comes after course code "CIS*# or ...", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(tmp[i]);
                        } else if ((prerequisitesSpaceSplit[j+1].includes("and"))) {
                            courseRequirementGrp.mandatory.push(tmp[i]);
                        } else { // else it is a mandatory, push to mandatory array
                            courseRequirementGrp.mandatory.push(tmp[i]);
                        }
                    } else if (j > -1 && j < prerequisitesSpaceSplit.length-1 && prerequisitesSpaceSplit[j].includes(coursePrereqs[i])) { // Case 2: index 1->(length-1)
                        if (prerequisitesSpaceSplit[j+1].includes("or") || prerequisitesSpaceSplit[j+1].includes("OR")) { // Check if an "or" comes after course code "CIS*# or ...", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(tmp[i]);
                        } else if (prerequisitesSpaceSplit[j-1].includes("or") || prerequisitesSpaceSplit[j-1].includes("OR")) { // Check if an "or" comes before course code "... or CIS*#", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(tmp[i]);
                        } else if ((prerequisitesSpaceSplit[j+1].includes("and"))) {
                            courseRequirementGrp.mandatory.push(tmp[i]);
                        } else if ((prerequisitesSpaceSplit[j-1].includes("and"))) {
                            courseRequirementGrp.mandatory.push(tmp[i]);
                        }  else if (getOf(prerequisitesSpaceSplit,j))  { // Check if current course code falls within (# of .course code here..), if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(tmp[i]);
                        } else { // else it is mandatory, push to mandatory array
                            courseRequirementGrp.mandatory.push(tmp[i]);
                        }
                    } else if (j <= prerequisitesSpaceSplit.length && prerequisitesSpaceSplit[j].includes(coursePrereqs[i])) { // Case 3: 
                        if (prerequisitesSpaceSplit[j-1].includes("or") || prerequisitesSpaceSplit[j-1].includes("OR")) { // Check if or comes after course code "CIS*# or ...", if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(tmp[i]);
                        } else if ((prerequisitesSpaceSplit[j-1].includes("and"))) {
                            courseRequirementGrp.mandatory.push(tmp[i]);
                        } else if (getOf(prerequisitesSpaceSplit,j))  { // Check if current course code falls within (# of .course code here..), if true, push to or_courses array
                            courseRequirementGrp.or_courses.push(tmp[i]);
                        } else { // else it is mandatory, push to mandatory array
                            courseRequirementGrp.mandatory.push(tmp[i]);
                        }
                    }
                }
            }
        } else if (prereqStr.match(/[1-9 ]{2}[of]{2}/g) != null) { // If it does not have an "or", and it is not a "(# of ...)" case, check if it is a "# of ..." case. No brackets. Then it they are all or cases
            courseRequirementGrp.or_courses = tmp;
        } else { // If it does not have an "or", it is not a "(# of ...)", and it is not a "# of ..." case, then all course codes are mandatory
            courseRequirementGrp.mandatory = tmp;
        }
    } 
    return courseRequirementGrp;
}

/**
 * @name getJSON
 * @description This fucntion will make an array of courses
 * @param {string} innerText is all the text within the current program
 * @returns {Object array} This will hold all the courses within the current program  
 */
let getJSON = (innerText) => {

    let innerIndex;
    let courseObjectArr = []; //This array will hold all the courses within the program
    let content = innerText.split('\n'); //Splits the text so it will go line by line

    for (let index = 0; index < content.length; index++) { // for loop to get each line

        if (content[index] != '') { // Grabs only if not empty

            /* ----------------- Declare Variables ----------------- */
            let cleanContent = content[index].trim(); //Get full course tittle
            let cleanSplit = cleanContent.split(/\s{2}/); //Split by the hidden characters
            let emptyFlag = 0;
            let locationFlag = 0;

            /* ----------------- Create the object to hold the course information ----------------- */
            let prerequisiteObject = { //This object holds an array of or courses and mandatory courses
                or_courses: [],
                mandatory: []
            }
            
            let courseObject = { //Course object holds all the information for each course
                name: cleanSplit[1],
                code: content[index].substring(0, 9).trim(),
                credit: content[index].substring(content[index].length - 7, content[index].length - 3).trim(),
                semester: getSem(content[index]),
                description: '',
                prerequisites: '',
                offering: '',
                equate: '',
                restriction: '',
                department: '',
                location: '',
                prerequisiteCodes: prerequisiteObject
            };
            
            if (content[index].charAt(2) == '*' || content[index].charAt(3) == '*' || content[index].charAt(4) == "*") { // This makes sure to grab only the title

                if (index + 2 != content.length) { // This skips the first two empty lines on each course
                    innerIndex = index + 2;
                }

                while (innerIndex < (content.length) && emptyFlag < 2 && locationFlag != 1 && (content[innerIndex].charAt(3) != '*' || content[innerIndex].charAt(4) != "*")) { // This while grabs all the course information from the string

                    /* ----------------- Main functionality grabing the information from courses ----------------- */
                    if (content[innerIndex] == "") { // Skips empty strings
                        emptyFlag++;
                        innerIndex++
                    }

                    if (content[innerIndex].includes("Offering(s):")) { // Grabs offerings
                        courseObject.offering = getTextFrom(content[innerIndex], "Offering(s):");
                    } else if (content[innerIndex].includes("Restriction(s):")) { // Grabs restrictions
                        courseObject.restriction = getTextFrom(content[innerIndex], "Restriction(s):");
                    } else if (content[innerIndex].includes("Equate(s):")) { // Grabs Equates
                        courseObject.equate = getTextFrom(content[innerIndex], "Equate(s):");
                    } else if (content[innerIndex].includes("Department(s):")) { // Grabs departments
                        courseObject.department = getTextFrom(content[innerIndex], "Department(s):");
                    } else if (content[innerIndex].includes("Location(s):") && locationFlag == 0) { // Grabs locations
                        courseObject.location = getTextFrom(content[innerIndex], "Location(s):");
                        locationFlag == 1;
                    } else if (content[innerIndex].includes("Prerequisite(s):")) { // Grabs prerequisites
                        courseObject.prerequisites = getTextFrom(content[innerIndex], "Prerequisite(s):");
                        courseObject.prerequisiteCodes = getPreCode(courseObject.prerequisites);
                    } else { // Grabs descriptions
                        courseObject.description = content[innerIndex].trim();
                    }
                    innerIndex++; // Increment
                }
                
                /* ----------------- Add each course to the appropriate semester array ----------------- */
                if ((courseObject.semester).includes("W")) { //Adds the course to winter
                    winterCoursesArray.push(courseObject);
                }
                if ((courseObject.semester).includes("S")) { //Adds the course to summer
                    summerCoursesArray.push(courseObject);
                }
                if ((courseObject.semester).includes("F")) { //Adds the course to fall
                    fallCoursesArray.push(courseObject);
                }
                courseObjectArr.push(courseObject); // Add that object to the array of objects
            }
            
        }
    }
    return courseObjectArr;
}

/**
 * @name getJSONFile
 * @description This fucntion will print all the courses for json files
 * @param {Object array} programArray is all the programs
 */
let getJSONFile = (programArray) => {
    if (!fileSystem.existsSync("./json")) { // Checks to see if the folder exists
        fileSystem.mkdir("./json", (err) => {
            if (err) {
                throw err;
            }
        });
    }

    // Create a json file for all the courses, and for each season
    writeJsonFile('./json/AllCourses.json', programArray);
    writeJsonFile('./json/Summer.json', summerCoursesArray);
    writeJsonFile('./json/Fall.json', fallCoursesArray);
    writeJsonFile('./json/Winter.json', winterCoursesArray);
    writeJsonFile('./json/MajorData.json', majorList);
}

/**
 * @name writeJsonFile
 * @description This function will create/write the files into the json folder
 * @param {file} fileName is name of the file
 * @param {Object array} programArray is all the programs
 */
let writeJsonFile = (fileName, programArray) => {
    fileSystem.writeFile(fileName, JSON.stringify(programArray, null, '\t'), (err) => {
        if (err) {
            throw err;
        }
    });
}

/**
 * @name siteMapRegex
 * @description This function will regex the elements taken from siteMap
 * @param {string} siteString is the string holding the current site, string to be regex'd
 * @return {string} returns siteString after regex
 */
let siteMapRegex = (siteString) => {
    //These lines will rework the string to make it usable as a link
    //The order of these replaces are necessary when building a link
    siteString = siteString.replace(/[of ]{3}|[in ]{3}/g,"");//Gets rid of the of's and in's
    siteString = siteString.replace(".(","-");//Replaces the .( with a -
    siteString = siteString.replace(/[(.,&)]/g,"");//Gets rid of all (.,&) in the string
    siteString = siteString.replace(/[\]\[]/g,"");//Gets rid of square brackets
    siteString = siteString.replace(/  /g," ");//Gets rid of double spaces
    siteString = siteString.replace(/ /g,"-");//Any space becomes a dash
    siteString = siteString.replace(/[:]/g,"-");//Colons become -
    siteString = siteString.toLowerCase();//Lower case so it can be used
    return siteString;
}

/**
 * @name caseRemove
 * @description This function will replace/remove cases in URL strings. Used commonly for occasional "and", "co-op:c", "co-op-c", and removal of them.
 * @param {string} invalidString is the name of the string which needs to be changed
 * @param {string} removeString is the name of the string that is being replaced, "and " "co op ", e.t.c
 * @param {string} replaceString is the name of the string that will be replacing removeString
 * @return {string} returns the string for further usage
 */
let caseRemove = (invalidString, removeString, replaceString) => {
    // Restore spaces that have been regexed for '-'
    invalidString = invalidString.replace(/[-]/g," ");
    if (invalidString.includes(removeString)){
        invalidString = invalidString.replace(removeString,replaceString);
    }
    // Restore '-' in empty spaces to fix url
    invalidString = invalidString.replace(/[ ]/g,"-");

    return invalidString;
}

let printHelpMenu = () => {
    console.log("\nusage: node ./scraper.js [-h] {uog,mcg} ...");
    console.log("\npositional arguments::\n\tuog\tScrape University of Guelph and generate json files\n\tmcg\tScrape Mcgill and generate json files\n");
    console.log("options:\n\t-h, --help\tshow this help message and exit\n");
}

/**
 * @name main
 * @description This is the main for the program
 */
async function main() {

    const commandLine = process.argv;
    if (commandLine.length == 3) {
        if (commandLine[2] == "uog") {
            // Open a Chromium browser. We use headless: true
            // to run the process in the background.
            browser = await playwright.chromium.launch({
                headless: true
            });
            // Open a new page / tab in the browser.
            page = await browser.newPage({
                bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
            });

            const calendarURL = "https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/";

            let programArray = [];

            console.clear();
            await page.goto(calendarURL);
            let innerText = await page.textContent("div.az_sitemap");
            innerText = innerText.replace("#ABCDEFGHIJKLMNOPQRSTUVWXYZ","");
            let programCodes = innerText.match(/[A-Z]{2,4}/g);
            let i = 0, j = 0, k = 0;

            // Convert each character in the program codes to lowercase
            for (i = 0; i < programCodes.length; i++) {
                programCodes[i] = programCodes[i].toLowerCase();

                // The course has a program code of "IAEF" but the url displays it as the following
                // https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/ieaf/
                // In other words, the program code is not consistent with the url "AE" and "EA" respectively.
                if (programCodes[i] == "iaef") {
                    programCodes[i] = "ieaf";
                }
            } 

            // Tell the tab to navigate to the various program topic pages.
            for (i = 0; i < programCodes.length; i++) {
                console.log("\n"+ i + " of " + programCodes.length + " Programs have been scraped\n");
                

                // Go to the programs page
                let url = calendarURL.concat(programCodes[i]).concat("/");
                await page.goto(url);

                // get the full program name
                let title = await page.textContent('h1.page-title');
                tPtr = title.split('(');

                // Get the program name and code
                let programName = tPtr[0].trim();
                let programCode = programCodes[i].toUpperCase();

                // Get all the text within the program page
                let innerText = await page.innerText('div.sc_sccoursedescs'); // Grabs a string from that page

                // Program object
                let programObject = {
                    programName: programName,
                    programCode: programCode,
                    programCourse: getJSON(innerText) // Get the object array from that string
                };

                // Add to the overall 
                programArray.push(programObject);
                console.clear();
            }

            console.log("\nAll the programs have been scraped\nNow scraping Majors\n")

            const degreeUrl = "https://calendar.uoguelph.ca/undergraduate-calendar/degree-programs/";
            const majorUrl = "https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/"

            await page.goto(degreeUrl);

            innerText = await page.innerText("div.sitemap");    
            let newLineText = innerText.split("\n");
            let bachelor = [];
            let programs = [];
            let urlCases = ["and ", "co op:c", "co op ", " hrt"];
            let urlCaseReplace = ["", "co op c", "", " hort"];
            let majorCount = 0;

            // Go into Degree-Programs site and get degree
            for (i = 0; i < newLineText.length; i++) {
                if (!newLineText[i].includes("Indigenous")) {
                    newLineText[i] = newLineText[i].replace(/[and ]{4}/g,"");
                }
                newLineText[i] = siteMapRegex(newLineText[i]);
            }
            
            
            // Go into Degree-Programs site and get Programs from Degree. degreeUrl + degree -> degree is held in newLineText
            for (i = 0; i < newLineText.length; i++) {

                if (newLineText[i].includes("bachelor")) {
                    await page.goto(degreeUrl+newLineText[i]+"/");
                    let checkTxt = await page.textContent("nav#tabs");
                    if (checkTxt.includes("Programs")){
                        newLineText[i] = newLineText[i] + "/#programstext";
                    } else if (checkTxt.includes("Requirements")){
                        newLineText[i] = newLineText[i] + "/#requirementstext"
                    }
                    bachelor.push(newLineText[i]);
                }
            }

            console.clear();
            // go into Degree programs and make array of programs. Navigate to each program in the degree. degreeUrl + degree -> get programs -> majorUrl + program
            for (i = 0; i < bachelor.length; i++){
                console.log("\n"+ i + " of " + bachelor.length + " Degrees have been scraped\n");
                // Go into programs section (This means that there are multiple majors)
                if (bachelor[i].includes("programstext")){
                    await page.goto(degreeUrl+bachelor[i]);
                    innerText = await page.innerText("div.sitemap");
                    newLineText = innerText.split("\n");
                    // Inside degree url in programs section, regex newlinetext which holds sites of programs
                    for (j = 0; j < newLineText.length; j++){
                        newLineText[j] = siteMapRegex(newLineText[j]);
                        // navigate programs, programs is majorUrl + newLineText + #requirementsText
                        await page.goto(majorUrl+newLineText[j]);

                        // check if page was found
                        let title = await page.textContent("h1.page-title");
                        for (let caseCheck = 0; caseCheck < urlCases.length && title.includes("Page Not Found"); caseCheck++){

                            // Before removing "co op" remove the last c from url as there are unique cases where co-op stays in the middle but the -c at the end does not
                            if (caseCheck == 2){
                                if (newLineText[j].slice(-1) == 'c'){
                                    newLineText[j] = newLineText[j].substring(0, newLineText[j].lastIndexOf("-")) + "c";
                                }
                                await page.goto(majorUrl+newLineText[j]);
                                title = await page.textContent("h1.page-title");
                                if (!title.includes("Page Not Found")) break;
                            }
                            
                            newLineText[j] = caseRemove(newLineText[j], urlCases[caseCheck], urlCaseReplace[caseCheck]);
                            // Open page
                            await page.goto(majorUrl+newLineText[j]);
                            title = await page.textContent("h1.page-title");
                        }
                        newLineText[j] = newLineText[j] + "/#requirementstext";
                        
                        // Go to requirements
                        await page.goto(majorUrl+newLineText[j]);
                        

                        // Grab course requirements, Line 455 already puts us in the requirements section of major
                        let checkForMajor = await page.innerText("div#requirementstextcontainer");
                        
                        //If major is included in the text at all
                        if (checkForMajor.includes("Major")) {
                            let majorFlag = 0;
                            checkForMajor = checkForMajor.split("\n");
                            
                            //Create the major object
                            let majorObject = {
                                majorName: '',
                                majorCode: '',
                                majorCourses: []
                            };

                            //Get the header text
                            let majorTitle = await page.innerText("h1.page-title");

                            //Get the major name and code
                            majorObject.majorName = majorTitle.substring(0,majorTitle.indexOf(majorTitle.match(/[ (A-Z:)]{5,9}/g)[0]));
                            majorObject.majorCode = majorTitle.match(/[A-Z:]{2,6}/g)[0];

                            //Loop through the pages line by line
                            for (let k = 0; k < checkForMajor.length; k++) {
                                checkForMajor[k] = checkForMajor[k].trim();
                                
                                //If line holds major or any of these grab info below
                                if (checkForMajor[k] == "Major" || checkForMajor[k] == "Major (Honours Program)" || checkForMajor[k] == "Major Co-op (Honours Program)" ||  checkForMajor[k] == "Schedule of Studies" ||  checkForMajor[k] == "Core Requirements" || checkForMajor[k] == "Major (Honours Program) Co-op") {
                                    majorFlag = 1;
                                }

                                //If line matches these stop grabing info
                                if (checkForMajor[k].includes("Area of Emphasis") || checkForMajor[k] == "Restricted Electives" || checkForMajor[k] == "Minor" || checkForMajor[k] == "Minor (Honours Program)" || checkForMajor[k] == "List A:" || checkForMajor[k] == "Credit Summary") {
                                    majorFlag = 0;
                                }

                                //If the line holds a course code & vredit value & the major flag is checked grab info
                                if (majorFlag == 1 && checkForMajor[k].match(/[0-9]{1}[.]{1}[0-9]{1}[0-9]{1}/g) != null && checkForMajor[k].match(/[A-Z*]{2,5}[0-9]{4}/g) != null && checkForMajor[k].includes("\t")) {
                                    let matchingCodes = checkForMajor[k].match(/[A-Z*]{2,5}[0-9]{4}/g);
                                    checkForMajor[k].indexOf(checkForMajor[k].match(/[A-Z*]{2,5}[0-9]{4}/g)[0])
                                    if (checkForMajor[k].indexOf(matchingCodes[0]) == 0) {
                                        for (let q = 0; q < matchingCodes.length; q++) {
                                            majorObject.majorCourses.push(matchingCodes[q]);
                                        }
                                    }
                                    //If there is an or below grab info
                                    if (k +1 < checkForMajor.length) {
                                        if (checkForMajor[k+1].match(/[A-Z*]{2,5}[0-9]{4}/g) != null && checkForMajor[k+1].indexOf("or") == 0) {
                                            matchingCodes = checkForMajor[k+1].match(/[A-Z*]{2,5}[0-9]{4}/g);
                                            for (let q = 0; q < matchingCodes.length; q++) {
                                                majorObject.majorCourses.push(matchingCodes[q]);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            //Add object to the array and add to count
                            majorList.push(majorObject);
                            majorCount++;
                        }
                    }
                } // else grab required courses
                console.clear();
            }
            console.log("\nAll the programs and degrees have been scraped\n");
            
            // Print the courses to a JSON folder
            getJSONFile(programArray);
            await browser.close();
        } else if (commandLine[2] == "mcg") {
            // Open a Chromium browser. We use headless: true
            // to run the process in the background.
            browser = await playwright.chromium.launch({
                headless: true
            });
            // Open a new page / tab in the browser.
            page = await browser.newPage({
                bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
            });

            // Mcgill scraper
            let searchPage = "https://www.mcgill.ca/study/2021-2022/courses/search?f%5B0%5D=level%3Aundergraduate&page=" // page without number, it will go till the end
            let coursePage = "https://www.mcgill.ca/study/2021-2022/courses/"
            let courseCodes = []; // array holding course codes, first two words of name
            let courseCodeString = ""; // Holds information by spaces
            let loadedPages = 1; // Maintains index of current page, page 0 counts as 1
            let pageExists = "1"; // This isn't in use yet but no worries
            let newLineText; // Keeps text of element

            // Go to first page
            await page.goto(searchPage + 0);
            await page.click('text=Show more');
            let subjects = await page.innerText("ul#facetapi-facet-search-apicourses-block-field-subject-code");
            subjects = subjects.split("\n");
            let allSubjects = [];

            // This is getting all the subject titles
            for (let index = 0; index < subjects.length; index++) {
                if (!subjects[index].includes("Apply")){
                    
                    //subjectSplit = subjects[index].split(" ");
                    let matchingCod = subjects[index].match(/[A-Z1-9 ]{5}/g);
                    let matchingNum = subjects[index].match(/[ (]{2}[0-9]{1,3}[)]{1}/g);
                    // Program object
                    let programObject = {
                        programName: subjects[index].substring(matchingCod[0].length,subjects[index].indexOf(matchingNum[0])),
                        programCode: matchingCod[0].trim(),
                        programCourse: [] // Get the object array from that string
                    };
                    allSubjects.push(programObject);
                }
            }

            for (loadedPages; pageExists.length != 0; loadedPages++){ // 549 is last page, pageExists is trying to find length 0 but wasn't working properly previously.
                pageExists = await page.$$('text=❯');
                innerText = await page.innerText("div.view-content"); // Get text
                newLineText = innerText.split("\n"); // Split by new lines, there are Exactly 2 lines every time, so 0, 2, 4, 6, 8 are all course code names + some extra stuff
                for (i = 0; i < newLineText.length; i += 2) {
                    if (!newLineText[i+1].includes("Not Offered")) {
                        newLineText[i] = newLineText[i].toLowerCase(); //Lower case so it can be used 
                        courseCodeString = newLineText[i].split(" "); // Split by spaces, this way we can grab 0 and 1, the rest are redundant because we want course code letters and then course code numbers
                        courseCodes.push(courseCodeString[0] + "-" + courseCodeString[1]); // push them with a - in the middle to make up the site
                    }
                }
                if (loadedPages % 100 == 0){ // Every 100 pages, reset the browser.... It's bad IK but I couldn't think of anything for the mean time to run through pages
                    await browser.close();
                    browser = await playwright.chromium.launch({
                        headless: true
                    });
                    // Open a new page / tab in the browser.
                    page = await browser.newPage({
                        bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
                    });
                }
                console.clear();
                console.log("loaded pages: "+ loadedPages);
                await page.goto(searchPage + loadedPages);
            }

            let k = 0;
            let indexk = 0;
            for (k; k < 500/*courseCodes.length*/; k++){
                if (loadedPages % 100 == 0){ // Every 100 pages, reset the browser.... It's bad IK but I couldn't think of anything for the mean time to run through pages
                    await browser.close();
                    browser = await playwright.chromium.launch({
                        headless: true
                    });
                    // Open a new page / tab in the browser.
                    page = await browser.newPage({
                        bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
                    });
                }
                await page.goto(coursePage + courseCodes[k]);
                
                let title = await page.innerText("h1#page-title");
                if (title.includes("Page not found")) break;

                let testing1 = title.match(/[A-Z]{4}[ ]{1}[0-9]{3}[ ]{1}/g);
                let testing2 = title.match(/[ (]{2}[1-9.]{1,3}[ ]{1}[c]{1}[r]{1}[e]{1}[d]{1}[i]{1}[t]{1}[s]{1}[)]{1}/g);
                
                let credit = '';
                let name = '';
                let temp = courseCodes[k].split("-");
                if (temp[0].toUpperCase() != allSubjects[indexk].programCode) {
                    indexk++;
                }
                let description = '';
                let prereq = '';

                let content = await page.innerText("div#block-system-main");
                content = content.split("\n");
                for (i = 0; i < content.length; i++) {
                    if (content[i].includes(allSubjects[indexk].programName)) {
                        description = content[i];
                    }
                    if (content[i].includes("Prerequisite")) {
                        content[i] = content[i].replace(".","");
                        if (content[i].includes("Prerequisite(s): ")) {
                            prereq = getTextFrom(content[i],"Prerequisite(s): ");
                        } else if (content[i].includes("Prerequisites: ")) {
                            prereq = getTextFrom(content[i],"Prerequisites: ");
                        } else if (content[i].includes("Prerequisite: ")) {
                            prereq = getTextFrom(content[i],"Prerequisite: ");
                        }
                    }
                }

                if (testing1 == null || testing2 == null) {
                    nameSplit = courseCodes[k].toUpperCase().split("-");
                    name = nameSplit[0];
                } else {
                    name = title.substring(testing1[0].length,title.indexOf(testing2[0]));
                    credit = testing2[0].match(/\d/g)[0];
                }

                sem = await page.innerText("p.catalog-terms");
                sem = getSem(sem);

                let courseObject = { //Course object holds all the information for each course
                    name: name,
                    code: courseCodes[k].toUpperCase().replace("-"," "),
                    credit: credit,
                    semester: sem,
                    description: description,
                    prerequisites: prereq,
                    offering: '',
                    equate: '',
                    restriction: '',
                    department: '',
                    location: '',
                    prerequisiteCodes: getPreCode2(prereq)
                };

                allSubjects[indexk].programCourse.push(courseObject);

                console.clear();
                console.log("loaded pages: "+ loadedPages);
                console.log("Courses Searched: "+ k);
                loadedPages++;
            }
            writeJsonFile("./test.json",allSubjects);
            if (title.includes("Page not found")) console.log("This one was empty " + courseCodes[k]);
            console.log("Went through this many course sites " + k);

            console.log("loaded pages: " + loadedPages);

            console.log("Course Codes Length is " + courseCodes.length);
            // Turn off the browser to clean up after ourselves.
            await browser.close();
        } else if (commandLine[2] == "-h" || commandLine[2] == "--help") {
            printHelpMenu();
        }
    } else {
        printHelpMenu();
    }

    



    
    
}

main();