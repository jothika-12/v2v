import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap'

function App() {
  return (
    <div className="App">

      <Nav />
      <Home />
    </div>
  );
}

export default App;
