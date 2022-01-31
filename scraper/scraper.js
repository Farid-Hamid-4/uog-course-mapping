/* ----------------- Import the required libraries ----------------- */
const playwright = require('playwright');
const fileSystem = require('fs');

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
 * @name main
 * @description This is the main for the program
 */
async function main() {
    // Open a Chromium browser. We use headless: true
    // to run the process in the background.
    const browser = await playwright.chromium.launch({
        headless: true
    });
    // Open a new page / tab in the browser.
    const page = await browser.newPage({
        bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
    });

    const calendarURL = "https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/";

    let programArray = [];

    console.clear();
    await page.goto(calendarURL);
    let innerText = await page.textContent("div.az_sitemap");
    innerText = innerText.replace("#ABCDEFGHIJKLMNOPQRSTUVWXYZ","");
    let programCodes = innerText.match(/[A-Z]{2,4}/g);
    let i = 0;
    
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

    // Print the courses to a JSON folder
    getJSONFile(programArray);
    console.log("\nAll the programs have been scraped\n")
    // Turn off the browser to clean up after ourselves.
    await browser.close();
}

main();