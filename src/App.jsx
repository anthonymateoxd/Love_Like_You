import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Love_Like_You from './StevenUniverse/Love_Like_You';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Love_Like_You />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
