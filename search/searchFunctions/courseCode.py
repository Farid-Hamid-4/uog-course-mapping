#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Imports
import json
import os.path

# Program Information
__author__ = "Harsh Topiwala, Jainil Patel, Andrew Heft, Nicholas Baker, Lourenco Velez, Farid Hamid"
__version__ = "1.0.0"
__maintainer__ = "Farid Hamid"
__email__ = "fhamid@uoguelph.ca"
__status__ = "Development"

"""
Function to find and print a specific course.
Last Updated: 1/22/2022, by Farid Hamid
"""

def courseCodeSearch(courseCode):
    """
    courseCode Function.
    :param p1: courseCode
    :return: N/A
    """ 

    file = open(os.path.dirname(__file__) + '/../../scraper/json/dummy3.json')

    data = json.load(file)

    # Iterate through program courses and match course codes to print information on a specfic course. 
    for i in data:
        for j in i['pCour']:
                if j['cCode'] == courseCode:
                    print("Course Name: " + j['name'])
                    print("Descrption: " + j['dDes'])
                    print("Prerequisite(s): " + j['pPre'])

    file.close()