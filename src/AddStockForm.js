import { useState, useEffect, Input } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import sampleData from './sampleData';
import StockList from './StockList';
import utilities from './Utilities'

function AddStockForm(props) {
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [error, setError] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const AWS_API_GATEWAY = "https://3v0khj0oej.execute-api.us-east-1.amazonaws.com/prod";  
  const AWS_API_GATEWAY_GET_STOCK_PRICE = AWS_API_GATEWAY + "/get-stock-price";
  const AWS_API_GATEWAY_PUT_STOCK = AWS_API_GATEWAY + "/put-stock";

  const onChange = function(setFcn) {
    return function(evt) {
      setFcn(evt.currentTarget.value.toUpperCase());
    }
  }

function onClick2() {
  return props.closeAddStockForm();
}

function onClick() {
  if (isValid) {
    setError(false);
    pushStock(ticker, shares, purchasePrice);
    props.closeAddStockForm();
  }
}

function pushStock(ticker, shares, purchasePrice) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        ticker : ticker,
        shares: shares,
        purchasePrice: purchasePrice
      }
    )
  }
  fetch(AWS_API_GATEWAY_PUT_STOCK, fetchOptions)
    .then(response => {
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response.json());
      props.getPortfolio();
      return response.json();
      })
    .then(data => console.log("success"))
    .catch(error => props.getPortfolio());
  }


useEffect(() => {
  let isValid = (ticker.length > 0);              // ticker isn't blank
  isValid = isValid && (shares.length > 0);       // shares isn't blank
  isValid = isValid && (purchasePrice.length > 0);// purchasePrice isn't blank
  isValid = isValid && !/[^A-Z]/.test(ticker);    // ticker has letters only
  setIsValid(isValid);
}, [ticker, shares, purchasePrice]);

  
  

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
  return (
    <div>
      <Button onClick = {onClick2}/>
      <h2>Ticker: </h2>
      <input
        value = {ticker}
        id = "tickerInput"
        type = "string"
        onChange = {onChange(setTicker)}
      />
      <h2>Shares: </h2>
      <input
        value = {shares}
        id = "sharesInput"
        type = "number"
        onChange = {onChange(setShares)}
      />
      <h2>Purchase Price: </h2>
      <input
        value = {purchasePrice}
        id = "purchasePriceInput"
        type = "number"
        onChange = {onChange(setPurchasePrice)}
      />
      <Button onClick = {onClick}/>
    </div>
  );
}

export default AddStockForm;

