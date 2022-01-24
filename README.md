# UoG Course Finder

A program to search and filter course offerings at the University of Guelph.

## Description

An in-depth paragraph about your project and overview of use.

## Getting Started

### Dependencies

* Chromium (if you're using a linux-based system, `sudo apt-get install chromium`)
* Node 14 or higher
    * Playwright
* Python 3
    * pip3
    * pytest

# Installation 

## 1. Clone this repository using HTTPS or SSH

`git clone https://gitlab.socs.uoguelph.ca/w22_cis3760_team6/sprint-1.git`  

or  

`git clone git@gitlab.socs.uoguelph.ca:w22_cis3760_team6/sprint-1.git`

## 2. Checkout to 'sprint1' branch

`git checkout sprint1`

## 3. Navgiate to the 'scraper' directory, install dependencies and run the scraper

`npm install`  
`node ./index.js`

**If `node ./index.js` throws an error, make sure chromium is installed on your system and make sure your Node version is >= 14**

After running the node script, a directory named 'json' should appear with all course data.

## 4. (OPTIONAL) if you want to run unit tests for the search program

**Make sure you have pip3 installed before continuing!**  
Install dependencies (pytest) - `pip3 install -r requirements.txt `

# Program Execution

* Be sure to use a bash shell to execute the program!

Help menu - `python3 courseSearch.py`  

List all programs - `python3 courseSearch.py lp`  
Search by course code - `python3 courseSearch.py cc {course code, i,e ACCT*1220}`  
Search by program code - `python3 courseSearch.py pc {program code, i,e ACCT}`  
Search by course weight and season - `python3 courseSearch.py cw {course weight, i.e 0.25}, {season (optional), i.e, S}`  

# Running tests

*COMPLETE STEP 4 OF INSTALLATION BEFORE CONTINUING*

In the 'search' directory - `python3 -m pytest`



## Authors

* Farid Hamid
* Harsh Topiwala
* Jainil Patel
* Lourenco Velez
* Nicholas Baker
