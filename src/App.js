import { apiService } from './services/api-service';
import { useEffect, useState } from 'react';
import Table from './components/Table';
import Chart from './components/Chart';
import Lottie from "lottie-react";
import Yoda from "./assets/lottie/yoda.json";

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
    <div className="App main-layout">
      <h1>Swapi Challenge</h1>
      <Table data={data} />
      <div className="flex space">
        <Lottie animationData={Yoda} className="lottie" />
        <Chart data={data} />
      </div>
    </div>
  );
}

export default App;
