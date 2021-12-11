import { apiService } from './services/api-service';
import { useEffect, useState } from 'react';
import Table from './components/Table';

function App() {
  const [data, setData] = useState(null)
  useEffect(() => {
    getData()
    return () => {
    }
  }, [])

  const getData = async () => {
    try {
      var res = await apiService.initSwapi()
    } catch (error) {
      console.log(error)
    } finally {
      setData(res)
    }
  }

  return (data &&
    <div className="App">
      <Table data={data} />
    </div>
  );
}

export default App;
