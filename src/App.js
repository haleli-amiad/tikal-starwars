import { apiService } from './services/api-service';

function App() {
  apiService.getData('planets', 'residents')
  apiService.getData('vehicles', 'pilots')
  return (
    <div className="App">

    </div>
  );
}

export default App;
