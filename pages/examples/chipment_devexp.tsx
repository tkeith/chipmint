import { TestElement, Chipmint } from "../_chipmint_lib";

function App() {
  return (
    <div className="App">
      <h3>Iframes Loaded Below</h3>
      <iframe src={"http://localhost:8000/_chipmint_iframe?" +
        "needAuth=true&" + 
        "qty=100&" +
        "durationDays=365&" +
        "sender=0x23D9E89D457404dB99b6addC8638cc0e4368Bb5b"
        // + "&user=0x108C9FCd65e80c9999B34F85888861B4E20AA54d"
      }
        className="w-full h-96"
      ></iframe>
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
