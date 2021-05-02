import { BrowserRouter as Router, Route } from "react-router-dom";
import InitPage from "./routes/Initpage";
import Main from "./routes/Main";

function App() {
   return (
      <Router>
         <Route exact path="/" component={InitPage} />
         <Route path="/main" component={Main} />
      </Router>
   );
}

export default App;
