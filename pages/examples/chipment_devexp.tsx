import { TestElement, Chipmint } from "../_chipmint_lib";
// import {IFrameElement} from ""

function App() {
  return (
    <div className="App">
      <h3>Iframes Loaded Below</h3>
      <iframe src="http://localhost:8000/_chipmint_iframe?needAuth=true&msgQty=100" className="w-full h-96"></iframe>
    </div>
  );
}

function Page() {
  
  return <div className="p-4">
    <TestElement />
    <div id="chipmintSection">
      <div id="Chipmint" >
        <Chipmint />
      </div>
    </div>
  </div>
}

export default App;
