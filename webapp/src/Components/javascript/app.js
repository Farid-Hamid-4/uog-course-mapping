import React, { Component } from 'react'
import { useState } from 'react';
import ReactFlow from 'react-flow-renderer';
import Routes from './router';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes />
      </div>
    )
  }
}

export default App
