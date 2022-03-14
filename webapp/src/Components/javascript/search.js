import React, { Component } from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import '../css/mainstyles.css'

class Search extends Component {
    render() {
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a class="navbar-brand" href="/query">
                        {/* This image is not showing up for some reason */}
                        {/* <img src="webapp\public\t6Logo.jpg" width="30" height="30" class="d-inline-block align-top" alt=""></img> */}
                        Team 6
                    </a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-end nav-pills" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            {/* <Button variant="outline-info" onClick={() => history.push('/Query')}>Query</Button>
                            <Button variant="outline-info">Search</Button> */}
                            <a class="nav-item nav-link" href="/query">Query</a>
                            <a class="nav-item nav-link active" href="/search">Search<span class="sr-only">(current)</span></a>
                        </div>
                    </div>
                </nav>

                <Container>
                    <Row>
                        <Col>
                            <h1 class="text-center">Search for a course</h1>
                            <Stack gap={3}>
                                <Container>
                                    <Row>
                                        <ButtonGroup className="mb-2" class="text-center">
                                            <Button variant="info" type="submit" class="text-center">UoG</Button>
                                            <Button variant="info" type="submit" class="text-center">McGill</Button>
                                        </ButtonGroup>
                                    </Row>
                                </Container>

                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control type="email" placeholder="Enter Course code,name" />
                                    </Form.Group>
                                    <Button variant="info" type="submit" class="text-center">
                                        Search
                                    </Button>
                                </Form>

                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>Course 1</td>
                                        </tr>
                                        <tr>
                                            <td>Course 2</td>
                                        </tr>
                                        <tr>
                                            <td>Course 3</td>
                                        </tr>
                                        <tr>
                                            <td>Course 4</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Stack>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Search