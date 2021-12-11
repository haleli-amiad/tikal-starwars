import { apiService } from './services/api-service';
import { useEffect, useState } from 'react';
import Table from './components/Table';
import Chart from './components/Chart';

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
      <Chart data={data} />
    </div>
  );
}

export default App;
