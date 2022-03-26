#!/usr/bin/python3
from helper import *
from urllib import response
from flask import Flask, jsonify, render_template, request
import os.path
import json

app = Flask(__name__)

# test endpoint
@app.route("/api")
def index():
    return """
        Welcome to my website!<br /><br />
        <a href="/hello">Go to hello world</a>
    """

# test endpoint
@app.route("/api/hello")
def hello():
    return """
        Hello World!<br /><br />
        <a href="/api">Back to index</a>
    """

# Input-based search
@app.route("/api/search/bar", methods=['GET', 'POST'])
def searchBar():
    # Getting request parameters
    searchInfo = request.get_json()
    filePath = os.path.dirname(__file__)
    filePath = filePath[:-1] + '../scraper/json/'

    if searchInfo['school'] == '1':
        filePath += 'GuelphAllCourses.json'
    elif searchInfo['school'] == '2':
        filePath += 'McGillAllCourses.json'
    
    file = open(filePath, encoding="utf-8")
    data = json.load(file)
    file.close()

    response = []

    for i in range(len(data)):
        programCourses = data[i]['programCourse']
        for j in range(len(programCourses)):
            term = searchInfo['term']
            if term in programCourses[j]['name'] or term in programCourses[j]['code']:
                response.append(programCourses[j])

    return json.dumps(response)
    
@app.route("/api/search/university", methods=['GET','POST'])
def updateUniversity():
    # Getting request parameters
    filters = request.get_json()
    filePath = os.path.dirname(__file__)
    filePath = filePath[:-1] + '../scraper/json/'

    # Open file
    if filters['school'] == 'uog':
        filePath += 'GuelphAllCourses.json'

    elif filters['school'] == 'mcg':
        filePath += 'McGillAllCourses.json'
    
    else:
        return json.dumps([])
    
    file = open(filePath, encoding="utf-8")
    data = json.load(file)
    file.close()

    response = []

    for i in range(len(data)):
        currentProgramName = data[i]['programName'] 
        response.append(currentProgramName)
    
    return json.dumps(response)

# Filtered search
@app.route("/api/search/filtered", methods=['GET', 'POST'])
def filteredSearch():
    
    # Getting request parameters
    filters = request.get_json()
    filePath = os.path.dirname(__file__)
    filePath = filePath[:-1] + '../scraper/json/'
    
    # Open file
    if filters['school'] == 'uog':
        filePath += 'Guelph'
        if filters['offering'] != '' and filters['program'] == '':
            filePath += (filters['offering'] + '.json')
        else:
            filePath += 'AllCourses.json'

    elif filters['school'] == 'mcg':
        filePath += 'McGillAllCourses.json'
    
    else:
        return json.dumps([])

    file = open(filePath, encoding="utf-8")
    data = json.load(file)
    file.close()

    response = []
    programCourses = []
    
    #populate program courses with json file
    if filters['program'] != '':
        program = filters['program']

        for i in range(len(data)):
            currentProgramName = data[i]['programName'] 
            if currentProgramName == program:
                programCourses = data[i]['programCourse']
                break
        
        for i in range(len(programCourses)):
            if filters['credit'] != '' and programCourses[i]['credit'] != filters['credit']:
                continue
            
            if filters['offering'] != '' and filters['offering'][0] not in programCourses[i]['semester']:
                continue
                
            response.append(programCourses[i])

    elif filters['offering'] == '':
        for i in range(len(data)):
            currentCourse = data[i]['programCourse']
            for j in range(len(currentCourse)):
                if currentCourse[j]['credit'] == filters['credit'] or filters['credit'] == '':
                    response.append(currentCourse[j])
    else:
        if filters['school'] == 'uog':
            for i in range(len(data)):
                if filters['credit'] != '' and data[i]['credit'] != filters['credit']:
                    continue
                
                response.append(data[i])
        elif filters['school'] == 'mcg':
            for i in range(len(data)):
                currentCourse = data[i]['programCourse']
                for j in range(len(currentCourse)):
                    
                    if filters['credit'] != '' and currentCourse[j]['credit'] != filters['credit']:
                        continue
                    if filters['offering'] != '' and filters['offering'][0] not in currentCourse[j]['semester']:
                        continue

                    response.append(currentCourse[j])
    
    return json.dumps(response)


if __name__ == '__main__':
    # Will make the server available externally as well
    app.run(host='0.0.0.0')