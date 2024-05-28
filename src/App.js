import { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import sampleData from './sampleData';
import StockList from './StockList';
import utilities from './Utilities';
import AddStockForm from './AddStockForm';

function App() {
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  
  const [stocks, setStocks] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [tickerList, setTickerList] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const AWS_API_GATEWAY = "https://3v0khj0oej.execute-api.us-east-1.amazonaws.com/prod";
  const AWS_API_GATEWAY_GET_PORTFOLIO = AWS_API_GATEWAY + "/get-portfolio";
  const AWS_API_GATEWAY_GET_STOCK_PRICE = AWS_API_GATEWAY + "/get-stock-price";
  
  // Retrieve the current stock information when the page first loads
  useEffect(() => {
    // setStocks(sampleData);
    getPortfolio();

  }, []);
  
  useEffect(() => {
    setTickerList(createTickerList(stocks));
  }, [stocks])
  
  useEffect(() => {
    let stockInfoArr = [];
    for (let i = 0; i < stocks.length; i++) {
      let info = {
        ticker: stocks[i].ticker,
        shares: stocks[i].shares,
        purchasePrice: stocks[i].purchasePrice,
      }
      if (stockPrices[stocks[i].ticker] != undefined) {
  
        let stockPriceObj = stockPrices[stocks[i].ticker];
        info = {
          ...info,
          name: stockPriceObj["name"],
          currentPrice: stockPriceObj["price"],
          purchaseValue: (info.purchasePrice * info.shares),
          currentValue: (stockPriceObj["price"] * info.shares),
          profit: (info.shares * (stockPriceObj["price"] - info.purchasePrice)),
          formattedPurchaseValue: utilities.formatNumber(info.purchasePrice * info.shares),
          formattedCurrentValue: utilities.formatNumber(stockPriceObj["price"] * info.shares),
          formattedProfit: utilities.formatNumber(info.shares * (stockPriceObj["price"] - info.purchasePrice))
        };
        // console.log(info);
      }
      stockInfoArr.push(info);
    }
    setPortfolioData(stockInfoArr);
  }, [stocks, stockPrices])
  function getPortfolio() {
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
          item.ticker = item.ticker.S;
          item.purchasePrice = item.purchasePrice.N;
          item.shares = item.shares.N;
          
        });
        setStocks(response.Items);
      })
      .catch(function(error) {
        console.log(error);
      })
  }
  
  
  function createTickerList(portfolioList) {
    let tickerList = [];
    for (let i = 0; i < portfolioList.length; i++) {
      tickerList[i] = portfolioList[i].ticker;
    }
    return tickerList;
  }
  
  function getStockPrice(ticker) {
    return new Promise((resolve, reject) => {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ticker: ticker})
      }
      
      fetch(AWS_API_GATEWAY_GET_STOCK_PRICE, fetchOptions)
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
    let promises = tickerList.map(ticker => getStockPrice(ticker));
    Promise.all(promises)
      .then(stocks => {
        const stockPrices = stocks.reduce((obj, stock) => {
          console.log(stock);
          const info = {
            name: stock.data["Global Quote"] ? stock.data["Global Quote"]["01. symbol"] : null,
            price: stock.data["Global Quote"] ? stock.data['Global Quote']['05. price'] : null
          }
          obj[stock.ticker] = info;
          return obj;
        }, {});
        setStockPrices(stockPrices);
      })
  }, [tickerList])

  
  
  function addStock() {
    setShowAddStockForm(true);
    return;
  }
  
  function closeAddStockForm() {
    console.log("test");
    setShowAddStockForm(false);
  }
  
  if (showAddStockForm) {
    return <AddStockForm closeAddStockForm = {closeAddStockForm} getPortfolio = {getPortfolio}></AddStockForm>
  }
  else {
    return (
      <div className="App">
        <Card>
          <CardHeader className="card-header-color">
            <h4>{myName}'s Stock Portfolio</h4>
          </CardHeader>
          <CardBody>
            <StockList data={portfolioData} getPortfolio = {getPortfolio}/>
          </CardBody>
          <CardFooter>
            <Button size="sm" onClick={function() {setShowAddStockForm(true)}}>Add stock</Button>
          </CardFooter>
        </Card>
      </div>
  );
  }

}

export default App;

