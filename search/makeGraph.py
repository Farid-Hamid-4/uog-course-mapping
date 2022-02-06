#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Imports
import argparse
import sys
import json
import os
import pygraphviz as pgv

# Program Information
__author__ = "Harsh Topiwala, Jainil Patel, Andrew Heft, Nicholas Baker, Lourenco Velez, Farid Hamid"
__version__ = "1.0.0"
__maintainer__ = "Harsh Topiwala"
__email__ = "htopiwal@uoguelph.ca"
__status__ = "Development"

"""
A CLI-based program with the purpose of generating a graph to visualize courses and their prerequisties.
Last Updated: 2/3/2022, by Harsh Topiwala
"""

def grabProgramData(programCode):
    """
    Returns program courses if the program exists
    :param p1: programCode (string)
    :return: (Array of objects) program information
    """ 

    # Open file containing all course information for reading
    file = open(os.path.dirname(__file__) + '/../scraper/json/AllCourses.json')
    data = json.load(file)
    courseData = []
    # Traverse through all programs and find program with specified code 
    for program in data:
        if program['programCode'] == programCode:
            courseData = program['programCourse']
            break

    file.close()
    return courseData

def grabMajorData(majorCode):
    """
    Returns a list of courses (objects) that are required for a major
    :param p1: majorCode (string)
    :return: (Array of objects) major information
    """ 

    # Open file containing all course information for reading
    file = open(os.path.dirname(__file__) + '/../scraper/json/MajorData.json')
    data = json.load(file)
    majorData = []
    # Traverse through all programs and find program with specified code 
    for major in data:
        if major['majorCode'] == majorCode:
            for courseCode in major['majorCourses']:
                majorData.append(getCourseData(courseCode))
            
    file.close()
    return majorData

def getCourseData(courseCode):
    """
    Returns data for a singular course 
    :param p1: courseCode (string)
    :return: single object containing course data
    """

    # Open file containing all course information for reading
    file = open(os.path.dirname(__file__) + '/../scraper/json/AllCourses.json')
    data = json.load(file)
    courseObj = {}

    for program in data:
        for course in program['programCourse']:
            if course['code'] == courseCode:
                courseObj = course

    file.close()
    return courseObj

def listAllMajors():
    """
    Prints all majors and their codes
    :return: N/A
    """ 
    # Open file containing all course information for reading
    file = open(os.path.dirname(__file__) + '/../scraper/json/MajorData.json')
    data = json.load(file)
    # Traverse through all programs and find program with specified code 
    print('\n-----------------------------------------------------\n')

    for major in data:
        print('{} - {}'.format(major['majorName'], major['majorCode']))

    print('\n-----------------------------------------------------\n')        
    file.close()


def add_graph_nodes(graph, prereq, currCourse, courseType):
    """
    Adds nodes to graph
    :param p1: graph (graph)
    :param p2: prereq (string)
    :param p3: currCourse (string)
    :return: (String) color of node
    """ 
    graph.add_node(prereq, color=getNodeColor(prereq))
    graph.add_node(currCourse, color=getNodeColor(currCourse))
    if courseType == 'or':
        graph.add_edge(prereq, currCourse, dir='forward', style='dashed')
    else:
        graph.add_edge(prereq, currCourse, dir='forward')
        
    return graph

def getNodeColor(courseCode):
    """
    Returns color of node depending on course level
    :param p1: courseCode (string)
    :return: (String) color of node
    """ 
    courseYear = (courseCode.split('*'))[1][0]
    if courseYear == '1':
        return 'red'
    elif courseYear == '2':
        return 'blue'
    elif courseYear == '3':
        return 'orange'
    
    return 'magenta'

def generateGraph(code, graphType):
    """
    Generates a graph based on program code specified in command.
    :param p1: code (string)
    :param p1: type (string)
    :return: None
    """

    # Grabbing data based on graph type
    data = []
    if graphType == 'major':
        data = grabMajorData(code)
    elif graphType == 'program':
        data = grabProgramData(code)

    if len(data) == 0:
        print('{} with code "{}" does not exist.'.format(graphType.title(), code))
        return
    
    # Initialize empty graph
    graph = pgv.AGraph(ranksep='5')
    
    # Generate graph
    for dataItem in data:
        # Traverse through prerequisites and create nodes and edges
        prereqCodes = dataItem['prerequisiteCodes']
        
        # '1 of' case
        for prereq in prereqCodes['or_courses']:
            graph = add_graph_nodes(graph, prereq, dataItem['code'], 'or')
        
        # 'Mandatory' case
        for prereq in prereqCodes['mandatory']:
            graph = add_graph_nodes(graph, prereq, dataItem['code'], 'mandatory')

    # Layout and export graph
    graph.layout(prog='dot')

    # Check if directory for graphs exists
    if not os.path.exists('graphs'):
        os.makedirs('graphs')

    # Draw graph to directory
    graph.draw('graphs/{}_{}_graph.pdf'.format(code, graphType))


def parseArguments():
    """
    Parses CLI command to get program to generate graph for.
    :return: (String) Result to be displayed back to user.
    """ 
    # Parser initialization
    parser = argparse.ArgumentParser()

    subparsers = parser.add_subparsers(help='Graph Generation Methods')

    # Program code parsing
    prerequisiteParser = subparsers.add_parser('prg', help='Generate prerequisite graph for all courses in a program. e.g python3 makeGraph.py prg CIS ')
    prerequisiteParser.add_argument('[Program Code]')
    prerequisiteParser.set_defaults(which='prg')

    # Major code parsing
    prerequisiteMajorParser = subparsers.add_parser('mrg', help='Generate prerequisite graph for all courses in a major. e.g python3 makeGraph.py mrg CIS ')
    prerequisiteMajorParser.add_argument('[Major Code]')
    prerequisiteMajorParser.set_defaults(which='mrg')

    # Parser for listing majors and their codes
    listMajorsParser = subparsers.add_parser('lm', help='List all majors and their codes, i.e python3 makeGraph.py lp')
    listMajorsParser.set_defaults(which='lm')

    args = vars(parser.parse_args())

    if args['which'] == 'prg':
        generateGraph(args['[Program Code]'], 'program')
    elif args['which'] == 'mrg':
        generateGraph(args['[Major Code]'], 'major')
    else:
        listAllMajors()

def main():
    """
    Main Function.
    :param p1: N/A
    :return: N/A
    """ 

    parseArguments()

if __name__ == "__main__":
    main()
