import * as React from 'react';
import { useState } from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'


import '../css/mainstyles.css'

const Search = () => {

    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: 'UoG', value: '1' },
        { name: 'McGill', value: '2' },
    ];

    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="/query">
                    <img src="webapp/src/images/logo.png" width="30" height="30" class="d-inline-block align-top" alt="" />
                    Team 6
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end nav-pills" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-item nav-link" href="/query">Query</a>
                        <a class="nav-item nav-link active" href="/search">Search</a>
                    </div>
                </div>
            </nav>

            <br />

            <Container>
                <Row className="justify-content-md-center">
                    <Col md={{ span: 6 }}>
                        <Stack gap={3}>

                            <h1 className="text-center">Search for a course</h1>

                            <ButtonGroup>
                                {radios.map((radio, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant={idx % 2 ? 'outline-info' : 'outline-info'}
                                        name="radio"
                                        value={radio.value}
                                        checked={radioValue === radio.value}
                                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                                    >
                                        {radio.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="text" placeholder="Enter Course code,name" />
                                </Form.Group>
                                <div class="text-center d-grid">
                                    <Button variant="info" type="submit" class="text-center">
                                        Search
                                    </Button>
                                </div>
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

export default Search