# UoG  McGill Course/Subject Finder and Graph Maker

A program to search and filter course offerings at the University of Guelph.
Graphs majors and programs for University of Guelph, and subjects for McGill.

## Getting Started

### Dependencies

* Chromium (if you're using a linux-based system, `sudo apt-get install chromium`)
* graphviz (if you're using a linux-based system, `sudo apt-get install graphviz graphviz-dev`)
* Node 14 or higher
    * Playwright
* Python 3.9 or higher
    * pip3
    * pygraphviz
    * pytest

## Installation 

### 1. Clone this repository using HTTPS or SSH

`git clone https://gitlab.socs.uoguelph.ca/w22_cis3760_team6/sprint-1.git`  

or  

`git clone git@gitlab.socs.uoguelph.ca:w22_cis3760_team6/sprint-1.git`

### 2. Checkout to 'sprint5' branch

`git checkout sprint5`

### 3. Navigate to the 'scraper' directory, install dependencies and run the scraper

`npm install`  

**To run the scraper use the following commands**

Help menu - `node scraper.js` or `node scraper.js -h`

Generate Guelph json - `node scraper.js uog`
Generate McGill json - `node scraper.js mcg`

**If `node ./index.js` throws an error, make sure chromium is installed on your system and make sure your Node version is >= 14**

After running the node script, a directory named 'json' should appear with all course data.

### 4. Install python dependencies

Naviate to the `search` directory.
**Make sure you have pip3 installed before continuing and make sure python version is >= 3.9!**  
Install dependencies - `pip3 install -r requirements.txt `

### Install Script

To run the install script, enter the following in the terminal

`chmod u+x installScript.sh`

## Program Execution

* Be sure to use a bash shell to execute the program!

Help menu - `python3 courseSearch.py`  

Generate prerequisite graph for McGill subjects - `python3 makeGraph.py sbg {subject code, i.e. all}`
Generate prerequisite graph for a program - `python3 makeGraph.py prg {program code, i.e CIS}`  
Generate prerequisite graph for a major - `python3 makeGraph.py mrg {major code, i.e CS}`  
List all majors (for UoG) - `python3 makeGraph.py lm`  
List all programs (for UoG) - `python3 courseSearch.py lp`
Search by course code - `python3 courseSearch.py cc {course code, i.e ACCT*1220}`  
Search by program code - `python3 courseSearch.py pc {program code, i.e ACCT}`  
Search by course weight and season - `python3 courseSearch.py cw {course weight, i.e 0.25}, {season (optional), i.e S}`  

## Webapp

To run the web server, input `131.104.49.106` in your browser

## Running tests

*COMPLETE STEP 4 OF INSTALLATION BEFORE CONTINUING*

In the 'search' directory - `python3 -m pytest`

## Authors

* Farid Hamid
* Harsh Topiwala
* Jainil Patel
* Lourenco Velez
* Nicholas Baker
