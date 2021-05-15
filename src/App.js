import { HashRouter as Router, Route } from "react-router-dom";
import Login from "./routes/Login";
import Main from "./routes/Main";

function App() {
   return (
      <Router>
         <Route exact path="/" component={Login} />
         <Route path="/main" component={Main} />
      </Router>
   );
}

export default App;
