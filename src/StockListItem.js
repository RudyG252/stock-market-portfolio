import utilities from './Utilities';

function StockListItem(props) {
  
  const { stock } = props;
  const purchaseValueStr = utilities.formatNumber(stock.purchaseValue);
  const currentValueStr = utilities.formatNumber(stock.currentValue);
  
  const purchasePriceStr = utilities.formatNumber(stock.purchasePrice);
  const currentPriceStr = utilities.formatNumber(stock.currentPrice);
  
  const profitStr = utilities.formatNumber(stock.profit);
  const profitClass = stock.profit < 0 ? 'loss' : 'profit';
  
  return (
    <tr>
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
