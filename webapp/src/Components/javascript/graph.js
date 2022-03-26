import * as React from 'react';
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Table from 'react-bootstrap/Table'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { useHistory } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { nodes as initialNodes, edges as initialEdges } from './initial-elements';

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const row = {
  display: 'flex'
}

const column = {
  float: 'left'
}

const left = {
  width: '15%',
  background: '#d1d1d1'
}

const right = {
  width: '85%'
}

/*const [searchValue, setSearch] = React.useState('');
const [radioValue, setRadioValue] = React.useState('1');

const searchSubmit = (e) => {
    e.preventDefault()

    console.log(radioValue.toString());
    console.log(searchValue.toString());

    // Fetch request to api/search which deals with using the parameters to use program to search
    fetch('/api/search/bar', {
       method: 'POST',
       body: JSON.stringify({
           school: radioValue.toString(),
           term: searchValue.toString()
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

const radios = [
  { name: 'UoG', value: '1' },
  { name: 'McGill', value: '2' },
];*/



const Graph = () => {

  const [searchValue, setSearch] = React.useState('');
  const [radioValue, setRadioValue] = React.useState('1');

  const searchSubmit = (e) => {
      e.preventDefault()

      console.log(radioValue.toString());
      console.log(searchValue.toString());

      // Fetch request to api/search which deals with using the parameters to use program to search
      fetch('/api/search/bar', {
        method: 'POST',
        body: JSON.stringify({
            school: radioValue.toString(),
            term: searchValue.toString()
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


  const radios = [
    { name: 'UoG', value: '1' },
    { name: 'McGill', value: '2' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  let history = useHistory();

  return (
    <div style={row}>

      <div style={column && left}>
        <Button onClick={() => history.goBack()}>back</Button>
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
          <input class="form-control" type="text" placeholder="Enter Course code, name" onChange={(e) => setSearch(e.target.value)}/>
          <div class="text-center d-grid">
              <Button variant="info" type="submit" onClick={searchSubmit}>Search</Button>{' '}
          </div>
          <Table id="resultTable" striped bordered hover>
              <tbody>
                  <tr>
                      Search results will appear here
                  </tr>
              </tbody>
          </Table>
        </Stack>
      </div>
      
      <div style={column && right}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          style={{width: '100%', height: '100vh'}}
          fitView
          attributionPosition="top-right"
        >

          <MiniMap
            nodeStrokeColor={(n) => {
              if (n.style?.background) return n.style.background;
              if (n.type === 'input') return '#0041d0';
              if (n.type === 'output') return '#ff0072';
              if (n.type === 'default') return '#1a192b';
              return '#eee';
            }}
            nodeColor={(n) => {
              if (n.style?.background) return n.style.background;
              return '#fff';
            }}
            nodeBorderRadius={2}
          />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

    </div>
  );
};

export default Graph;
