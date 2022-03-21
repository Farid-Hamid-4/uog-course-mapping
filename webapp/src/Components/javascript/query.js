import * as React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

const Query = () => {

    // set states, these will maintain what the current value of the dropdowns are.
    const [University, setUniversity] = React.useState('');
    const [Program, setProgram] = React.useState('');
    const [Credits, setCredits] = React.useState('');
    const [Offering, setOffering] = React.useState('');

    // Search button functionality
    const searchSubmit = (e) => {
        e.preventDefault()

        let parameters = '';
        // Fetch request to api/search which deals with using the parameters to use program to search
        fetch('/api/search/filtered', {
            method: 'POST',
            body: JSON.stringify({
                school: University.toString(),
                program: Program.toString(),
                credit: Credits.toString(),
                offering: Offering.toString()
            }),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Result table is the table that will show our results, empty the table before adding new children
            let table = document.getElementById('resultTable');
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            // Counter for number of rows, insert each search result into the table
            let i = 0;
            for (const course in data) {
                let row = table.insertRow(i);
                let cell = row.insertCell(0);
                cell.innerHTML = data[course]['code'];
                i += 1;
            }
        }, function (rejectionReason) { // Error check
            console.log('Error parsing', rejectionReason);
        });
    }

    // Depending on university onchange event, populate the programs table
    const changeUniversity = (event) => {
        event.preventDefault();

        let university = event.target.value;
        let uniCredits = "";
        if (university == "University of Guelph") {
            university = "uog";
            uniCredits = uogCredits;
        }
        if (university == "McGill University") {
            university = "mcg";
            uniCredits = mcgCredits;
        }

        if (university === University) return;
        //if (university === "McGill University" && University == 'mcg') return;

        setProgram("");
        setCredits("");

        //Set the university
        setUniversity(university);

        //Clear the programs and credits drop down
        let programs = document.getElementById('ProgramSelector')
        for (let i = programs.options.length - 1; i > 0; i--)
            programs.remove(i);

        let credits = document.getElementById('CreditSelector')
        for (let i = credits.options.length - 1; i > 0; i--)
            credits.remove(i);

        console.log(university + " First");
        if (university == "") return;


        // Fetch json formatted with Programs [], Credits[]
        fetch('/api/search/university', {
            method: 'POST',
            body: JSON.stringify({
                school: university,
            }),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (const i in data) {
                programs.options[programs.options.length] = new Option(data[i], data[i]);
            }
        }, function (rejectionReason) { // Error check
            console.log('Error parsing', rejectionReason);
        });

        // Populate Programs and Credits drop down
        // Change this code after receiving information from fetch, populate tables with json contents
        for (let i = 0; i < uniCredits.length; i++)
            credits.options[credits.options.length] = new Option(uniCredits[i], uniCredits[i]);

        // Dynamic change of Credits based on University
    };
    // Schools, credits and offering seasons
    const schools = [
        "University of Guelph",
        "McGill University",
    ];
    const uogCredits = [
        "0.25",
        "0.50",
        "0.75",
        "1.00",
        "1.75",
        "2.00",
        "2.50",
        "2.75",
        "7.50",
    ];
    const mcgCredits = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ];
    const offerings = [
        "Winter",
        "Summer",
        "Fall",
    ];

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-secondary padding">
                <a className="navbar-brand padding" href="/query">
                    <img src={require('../images/Team6_Logo.png')} width="60" height="60" class="d-inline-block align-top" />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end nav-pills" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-item nav-link active" href="/query">Query</a>
                        <a className="nav-item nav-link" href="/search">Search</a>
                        <a className="nav-item nav-link" href="/graph">Graph</a>
                    </div>
                </div>
            </nav>
            <Container>
                <Row>
                    <Col xs={6}>
                        <h1>Filters</h1>

                        <Stack gap={2}>
                            <div className="input-group mb-3">
                                <select className="form-select" id="SchoolSelector" title="School" onChange={changeUniversity}>
                                    <option value=''>School</option>
                                    {schools.map((school) => (<option key={school}>{school}</option>))}
                                </select>
                            </div>

                            <div className="input-group mb-3">
                                <select className="form-select" id="ProgramSelector" title="Program" onChange={(e) => setProgram(e.currentTarget.value)}>
                                    <option value=''>Programs</option>
                                </select>
                            </div>

                            <div className="input-group mb-3">
                                <select className="form-select" id="CreditSelector" title="Credit" onChange={(e) => setCredits(e.currentTarget.value)}>
                                    <option value=''>Credits</option>
                                </select>
                            </div>

                            <div className="input-group mb-3">
                                <select className="form-select" id="inputGroupSelect04" title="Offering" onChange={(e) => setOffering(e.currentTarget.value)}>
                                    <option value=''>Offering</option>
                                    {offerings.map((season) => (<option key={season}>{season}</option>))}
                                </select>
                            </div>
                            <>
                                <Button variant="info" type="submit" onClick={searchSubmit}>Search</Button>{' '}
                            </>
                        </Stack>
                    </Col>
                    <Col xs={6}>
                        <h1>Results</h1>
                        
                        {/* <Table responsive striped bordered hover id="resultTable" maxHeight="120px">
                            <tbody>
                            </tbody>
                        </Table> */}
                        <div class="table-responsive">
                            <table class="table table-striped table-hover" id="resultTable">
                                <tbody>
                                    <tr>
                                        Search results will appear here
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default Query