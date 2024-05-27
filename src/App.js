import { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import sampleData from './sampleData';
import StockList from './StockList';

function App() {
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  
  const [stocks, setStocks] = useState([]);
  const [stockList, setStockList] = useState([]);
  const AWS_API_GATEWAY = "https://3v0khj0oej.execute-api.us-east-1.amazonaws.com/prod";
  const AWS_API_GATEWAY_GET_PORTFOLIO = AWS_API_GATEWAY + "/get-portfolio";
  
  // Retrieve the current stock information when the page first loads
  useEffect(() => {
    // setStocks(sampleData);
    const options = {
      method: 'POST',
      cache: 'default'
    };
    
    fetch(AWS_API_GATEWAY_GET_PORTFOLIO, options)
      .then(function(response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(function(response) {
        response.Items.map(item => {
          item.name = item.name.S;
          item.ticker = item.ticker.S;
          item.purchasePrice = item.purchasePrice.N;
          item.shares = item.shares.N;
          
        });
        setStocks(response.Items);
      })
      .catch(function(error) {
        console.log(error);
      })

  }, []);
  
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
    const enhancedStocks = stocks.map(stock => {
      stock.purchaseValue = stock.shares * stock.purchasePrice;
      stock.currentPrice = Math.random()*200 + 50;
      stock.currentValue = stock.shares * stock.currentPrice;
      stock.profit = stock.currentValue - stock.purchaseValue;
      return stock;
    })
    setStockList(enhancedStocks);
  }, [stocks])
  
  const addStock = evt => {
    console.log('add stock clicked');
  }

  return (
    <div className="App">
      <Card>
        <CardHeader className="card-header-color">
          <h4>{myName}'s Stock Portfolio</h4>
        </CardHeader>
        <CardBody>
          <StockList data={stockList} />
        </CardBody>
        <CardFooter>
          <Button size="sm" onClick={addStock}>Add stock</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;

