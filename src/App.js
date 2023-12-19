import "./App.css";
import Main from "./Main";
import { StudentProvider } from "./Context";
function App() {
  return (
    <div className="App">
      <StudentProvider>
        <Main />
      </StudentProvider>
    </div>
  );
}

export default App;
