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

`git clone https://gitlab.socs.uoguelph.ca/w22_cis3760_team6/team6.git`  

or  

`git clone git@gitlab.socs.uoguelph.ca:w22_cis3760_team6/team6.git`

### 2. Checkout to 'sprint6' branch

`git checkout sprint6`

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

## Installation and setup of NGINX

1. Run the install script to install NGINX
2. Navigate to the etc folder - `cd /etc`
3. Obtain the hostname - `cat /hostname`
4. Open an editor to copy the hostname into /etc/hosts - `sudo nano hosts`
    - Important to use sudo in order to be able to write
5. Copy the ip address of the localhost and write your hostname alongside it
    - (e.g.) 127.0.0.1    localhost
             127.0.0.1    your_hostname
6. Navigate to the sites-available folder - `cd /etc/nginx/sites-available`
7. Create a file called flask-api - `sudo nano flask-api`
8. Copy the following into the file - 
server {
    server_name 131.104.49.106;
    root /home/sysadmin/sprint-1/webapp/build;
    index index.html;
   
    location / {
        try_files $uri /index.html;
    }
}

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
