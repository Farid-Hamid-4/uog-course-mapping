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
    :param p1: credit, season
    :return: N/A
    """ 

    file = open(os.path.dirname(__file__) + '/../../scraper/json/dummy3.json')

    data = json.load(file)

    # Iterate thorugh program courses and search by credit weight. Default season is left on All.
    for i in data:
        for j in i['pCour']:
            if season == "ALL" or len(season) == 0:
                if j['cCred'] == credit:
                    print(j['name'])
            else:
                if j['cCred'] == credit and j['sSem'] == season:
                    print(j['name'])
    
    file.close()