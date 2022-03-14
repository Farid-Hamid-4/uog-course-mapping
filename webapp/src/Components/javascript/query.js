import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import * as React from "react";

const Query = () => {

    // set states, these will maintain what the current value of the dropdowns are.
    const [University, setUniversity] = React.useState('');
    const [Program, setProgram] = React.useState('');
    const [Credits, setCredits] = React.useState('');
    const [Offering, setOffering] = React.useState('');

    // Search button functionality
    const searchSubmit = (e) => {
        e.preventDefault()
        // params will be used in the future, it is a json to be sent to backend
        const params = { University, Program, Credits, Offering }

        // Once we have params, we can then reset values
        setUniversity('');
        setProgram('');
        setCredits('');
        setOffering('');

        // Fetch request to api/search which deals with using the parameters to use program to search
        fetch('/api/search', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            // Result table is the table that will show our results, empty the table before adding new children
            let table = document.getElementById('resultTable');
            while (table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }
            // Counter for number of rows, insert each search result into the table
            let i = 0;
            for (const course in data){
                console.log(JSON.stringify(course))
                let row = table.insertRow(i);
                let cell = row.insertCell(0)
                cell.innerHTML = data[course];
                i += 1;
            }
        }, function (rejectionReason) { // Error check
            console.log('Error parsing', rejectionReason);
        });

    }

    // Depending on university onchange event, populate the programs table
    const changeUniversity = (event) => {
        setUniversity(event.target.value);
        let university = event.target.value;
        // Don't populate table if it's school or if it is equal to what it previously was
        if (university === "School" || university === University) // Hide the elements
            return;

        // Program Selector is the program drop down
        let programs = document.getElementById('ProgramSelector')
        if (university === "University of Guelph") // Remove previous programs before adding the new ones
        {
            for (let i = programs.options.length-1; i > 0; i--)
                programs.remove(i);

            for (let i = 0; i < GuelphPrograms.length; i++)
                programs.options[programs.options.length] = new Option(GuelphPrograms[i], "Guelph " + GuelphPrograms[i]);
        }
        if (university === "McGill") // Remove previous programs before adding the new ones
        {
            for (let i = programs.options.length-1; i > 0; i--)
                programs.remove(i);

            for (let i = 0; i < McGillPrograms.length; i++)
                programs.options[programs.options.length] = new Option(McGillPrograms[i], "McGill " + McGillPrograms[i]);
        }
    };
    // Current accepted schools
    const schools = [
        "University of Guelph",
        "McGill",
    ];

    // Need to receive values from back-end or hard code them in
    const GuelphPrograms = [
        "Computer Science",
        "Biology",
        "Physics",
    ];
    const McGillPrograms = [
        "Biology",
        "CS",
        "Chemistry",
    ];
    const mockCredits = [
        "0.5",
        "1",
        "1.5",
    ];
    const offerings = [
        "Winter",
        "Summer",
        "Fall",
    ];

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/query">
                    {/* This image is not showing up for some reason */}
                    {/* <img src="webapp\public\t6Logo.jpg" width="30" height="30" class="d-inline-block align-top" alt=""></img> */}
                    Team 6
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end nav-pills" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {/* <Button variant="outline-info">Query</Button>
                        <Button variant="outline-info">Search</Button> */}
                        <a className="nav-item nav-link active" href="/query">Query<span className="sr-only">(current)</span></a>
                        <a className="nav-item nav-link" href="/search">Search</a>
                    </div>
                </div>
            </nav>
            <Container>
                <Row>
                    <Col>
                        <h1>Filters</h1>

                        <Stack gap={2}>
                            <div className="input-group mb-3">
                                <select className="form-select" id="SchoolSelector" title="School" onChange={changeUniversity}>
                                    <option defaultValue={"No School Selected"}>School</option>
                                    {schools.map((school) => (<option key={school}>{school}</option>))}
                                </select>
                            </div>

                            <div className="input-group mb-3">
                                <select className="form-select" id="ProgramSelector" title="Program" name="Program" onChange={(e) => setProgram(e.currentTarget.value)}>
                                    <option defaultValue={"No Program Selected"}>Programs</option>
                                </select>
                            </div>

                            <div className="input-group mb-3">
                                <select className="form-select" id="inputGroupSelect03" title="Credit" onChange={(e) => setCredits(e.currentTarget.value)}>
                                    <option defaultValue={"No Credits Selected"}>Credits</option>
                                    {mockCredits.map((credit) => (<option key={credit}>{credit}</option>))}
                                </select>
                            </div>

                            <div className="input-group mb-3">
                                <select className="form-select" id="inputGroupSelect04" title="Offering" onChange={(e) => setOffering(e.currentTarget.value)}>
                                    <option defaultValue={"No Offering selected"}>Offering</option>
                                    {offerings.map((season) => (<option key={season}>{season}</option>))}
                                </select>
                            </div>
                            <>
                                <Button variant="info" type="submit" onClick={searchSubmit}>Search</Button>{' '}
                            </>
                        </Stack>
                    </Col>
                    <Col>
                        <h1>Results</h1>

                        <Table striped bordered hover id="resultTable">
                            <tbody>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default Query