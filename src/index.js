import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';
import registerServiceWorker from './registerServiceWorker';
// import Controller from './screens/Controller';

// ReactDOM.render(<Controller />, document.getElementById('root'));

class App extends React.Component {
    render() {
      return <h2>Hello, World!</h2>;
    }
  }
  
  ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
