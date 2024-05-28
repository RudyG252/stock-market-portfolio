import utilities from './Utilities';
import { RiDeleteBin2Fill } from "react-icons/ri";
import {getPortfolio} from "./App.js";

function StockListItem(props) {
  
  const { stock } = props;
  const purchaseValueStr = utilities.formatNumber(stock.purchaseValue);
  const currentValueStr = utilities.formatNumber(stock.currentValue);
  
  const purchasePriceStr = utilities.formatNumber(stock.purchasePrice);
  const currentPriceStr = utilities.formatNumber(stock.currentPrice);
  
  const profitStr = utilities.formatNumber(stock.profit);
  const profitClass = stock.profit < 0 ? 'loss' : 'profit';
  
  const AWS_API_GATEWAY = "https://3v0khj0oej.execute-api.us-east-1.amazonaws.com/prod";
  const AWS_API_GATEWAY_DELETE= AWS_API_GATEWAY + "/delete-stock";
  
    const getPortfolio = () => {
      props.getPortfolio()
    }
  
  function deleteStock(evt) {
    let ticker = evt.currentTarget.getAttribute('data-ticker')
    console.log(ticker);
    console.log("stock delete");
    

    return new Promise((resolve, reject) => {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ticker: ticker})
      }
      
      fetch(AWS_API_GATEWAY_DELETE, fetchOptions)
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response was not ok');
          }
          getPortfolio();
          console.log(response);
          return response.json();
        })
        .then(data => console.log("got it!"))
        .catch(error => getPortfolio());
    });
  }
  return (
    <tr>
      <td>
        <div onClick={deleteStock} data-ticker={stock.ticker}>
          <RiDeleteBin2Fill />
        </div>
      </td>
      <td>{stock.ticker}</td>
      <td>{stock.name}</td>
      <td>{stock.shares}</td>
      <td className="money">{purchasePriceStr}</td>
      <td className="money">{purchaseValueStr}</td>
      <td className="money">{currentPriceStr}</td>
      <td className="money">{currentValueStr}</td>
      <td className={"money "+profitClass}>{profitStr}</td>
    </tr>
  );
}

export default StockListItem;
