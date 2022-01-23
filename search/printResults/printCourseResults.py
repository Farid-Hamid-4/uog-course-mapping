#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Imports
import json
import os.path

# Program Information
__author__ = "Harsh Topiwala, Jainil Patel, Andrew Heft, Nicholas Baker, Lourenco Velez, Farid Hamid"
__version__ = "1.0.0"
__maintainer__ = "Harsh Topiwala"
__email__ = "htopiwal@uoguelph.ca"
__status__ = "Development"

"""
Formats a list of course results, returns a string.
Last Updated: 1/22/2022, by Harsh Topiwala
"""

def formattedInfo(courseInfo):
    """
    Formats course data, seperating by newline
    :param p1: string (containing course data)
    :return: string (an easy-to-digest block of course information)
    """ 

    lines = courseInfo.split('\*')
    res = []
    for line in lines:
        res.append(line)
    return '\n'.join(res)

def printIfExists(courseData):
    """
    Returns "None" if certain course data isn't present
    :param p1: courseData (dictionary containing course data)
    :return: string (None or the course data if it exists)
    """ 

    return "None" if len(courseData) == 0 else courseData

def printCourseResults(course):
    """
    Prints course results in a formatted manner.
    :param p1: course (dictionary containing course data)
    :return: string (an easy-to-digest block of course information)
    """ 

    courseName = '{} - {} - {}\*'.format(course['cCode'], course['name'], course['cCred'])
    description = 'Description: {}\*'.format(printIfExists(course['dDes']))
    prerequisites = 'Prerequisite(s): {}\*'.format(printIfExists(course['pPre']))
    offerings = 'Offering(s): {}\*'.format(printIfExists(course['oOff']))
    restrictions = 'Restriction(s): {}\*'.format(printIfExists(course['rRes']))
    equates = 'Equate(s): {}\*'.format(printIfExists(course['eEqu']))
    department = 'Department(s): {}\*'.format(printIfExists(course['dDep']))
    locations = 'Location(s): {}\*'.format(printIfExists(course['lLoc']))

    unformattedString = courseName + description + prerequisites + offerings + restrictions + equates + department + locations    
    return formattedInfo(unformattedString)
