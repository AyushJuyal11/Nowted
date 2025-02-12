import MainSection from "./components/mainSection";
import Sidebar from "./components/sidebar";

function App() {
  return (
    <>
      <div className="h-full flex">
        <Sidebar />
        <MainSection />
      </div>
    </>
  );
}

export default App;
