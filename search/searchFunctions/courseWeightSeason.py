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
Function to list all courses based on course weight and/or season.
Last Updated: 1/22/2022, by Farid Hamid
"""

def courseWS(credit, season):
    """
    courseWS Function.
    :param p1: credit (string)
    :param p2: season (string)
    :return: N/A
    """ 

    # Reading from file depending on season
    filePath = os.path.dirname(__file__) + '/../../scraper/json/'

    if season == 'F':
        filePath += 'Fall.json'
    elif season == 'S':
        filePath += 'Summer.json'
    elif season == 'W':
        filePath += 'Winter.json'
    else:
        filePath += 'AllCourses.json'

    file = open(filePath)
    data = json.load(file)

    resultCount = 0
    print('\n-----------------------------------------------------\n')

    # Iterate thorugh program courses and search by credit weight. Default season is left on All.
    for i in data:
        if season == 'ALL':
            for j in i['pCour']:
                if j['cCred'] == credit:
                    print('{} - {} - {} \n'.format(j['cCode'], j['name'], j['sSem']))
        else:
            if i['cCred'] == credit:
                print('{} - {} - {} \n'.format(i['cCode'], i['name'], i['sSem']))

    print('-----------------------------------------------------\n')

    file.close()