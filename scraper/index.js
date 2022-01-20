// Import the playwright library into our scraper.
const playwright = require('playwright');

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
    }

    // Turn off the browser to clean up after ourselves.
    await browser.close();
}

main();