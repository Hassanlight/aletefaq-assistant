import Chat from "./Chat.jsx";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#1a365d" }}>
      <h1 style={{ 
        textAlign: "center", 
        color: "#d4af37", 
        fontFamily: "sans-serif",
        borderBottom: "2px solid #d4af37",
        padding: "15px 0",
        margin: "0",
        backgroundColor: "white"
      }}>
        AL ETEFAQ LAWFIRM
      </h1>
      <div style={{ flex: 1, padding: "2rem", display: "flex", justifyContent: "center", overflow: "hidden" }}>
        <Chat />
      </div>
    </div>
  );
}

export default App;