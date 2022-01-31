#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Imports
import argparse
import sys
import json
import os.path
import pygraphviz as pgv

# Program Information
__author__ = "Harsh Topiwala, Jainil Patel, Andrew Heft, Nicholas Baker, Lourenco Velez, Farid Hamid"
__version__ = "1.0.0"
__maintainer__ = "Harsh Topiwala"
__email__ = "htopiwal@uoguelph.ca"
__status__ = "Development"


"""
A CLI-based program with the purpose of generating a graph to visualize courses and their prerequisties.
Last Updated: 1/29/2022, by Harsh Topiwala
"""


def grabProgramData(programCode):
    """
    Returns program data if the program exists
    :param p1: programCode (string)
    :return: (Array of objects) program information
    """ 

    # Open file containing all course information for reading
    file = open(os.path.dirname(__file__) + '/../scraper/json/AllCourses.json')
    data = json.load(file)
    
    # Traverse through all programs and find program with specified code 
    for program in data:
        if program['programCode'] == programCode:
            return program['programCourse']

    return []

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

def generateGraph(programCode):
    """
    Generates a graph based on program code specified in command.
    :param p1: programCode (string)
    :return: None
    """ 

    courses = grabProgramData(programCode)
    if len(courses) == 0:
        print('Program with code "{}" does not exist.'.format(programCode))
        return
    
    # Initialize empty graph
    graph = pgv.AGraph(ranksep='5')
    legend = pgv.AGraph(ranksep='2')
    
    # Generate graph
    for course in courses:
        # Traverse through prerequisites and create nodes and edges
        prereqCodes = course['prerequisiteCodes']

        # '1 of' case
        for prereq in prereqCodes['or_courses']:
            # Add nodes and create edge between node
            graph = add_graph_nodes(graph, prereq, course['code'], 'or')
        
        # 'Mandatory' case
        for prereq in prereqCodes['mandatory']:
            graph = add_graph_nodes(graph, prereq, course['code'], 'mandatory')

    # Layout and export graph
    graph.layout(prog='dot')
    graph.draw('{}_graph.pdf'.format(programCode))
        
def parseArguments():

    """
    Parses CLI command to get program to generate graph for.
    :return: (String) Result to be displayed back to user.
    """ 
    # Parser initialization
    parser = argparse.ArgumentParser()
    parser.add_argument('programCode')

    args = vars(parser.parse_args())

    if args['programCode']:
        generateGraph(args['programCode'])

def main():
    """
    Main Function.
    :param p1: N/A
    :return: N/A
    """ 

    parseArguments()


if __name__ == "__main__":
    main()
