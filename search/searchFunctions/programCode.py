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
Function to print all courses within a specific program.
Last Updated: 1/22/2022, by Farid Hamid
"""

def programCodeSearch(programCode):
    """
    programCodeSearch Function.
    :param p1: programCode
    :return: N/A
    """ 
    
    file = open(os.path.dirname(__file__) + '/../../scraper/json/dummy3.json')

    data = json.load(file)

    # Iterate through programs and list all courses in that a program. 
    for i in data:
        if i['pCode'] == programCode:
            for j in i['pCour']:
                print(j['name'])

    file.close()