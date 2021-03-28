import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import InitPage from "./routes/Initpage";
import Main from "./routes/Main";

function App() {
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={InitPage} />
            <Route exact path="/main" component={Main} />
         </Switch>
      </Router>
   );
}

export default App;
