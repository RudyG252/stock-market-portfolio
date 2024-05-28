import utilities from './Utilities';

function StockListTotals(props) {
  
  const { stocks } = props;
  
  const totals = stocks.reduce((summary, stock) => {
    summary.profit += stock.profit;
    summary.purchaseValue += stock.purchaseValue;
    summary.currentValue += stock.currentValue;
    return summary;
  }, {currentValue: 0, purchaseValue: 0, profit: 0});
  const profitClass = totals.profit < 0 ? 'loss' : 'profit';

  return (
    <tr>
      <td></td>
      <th>TOTALS</th>
      <th colSpan="3">&nbsp;</th>
      <th className="money">{utilities.formatNumber(totals.purchaseValue)}</th>
      <th>&nbsp;</th>
      <th className="money">{utilities.formatNumber(totals.currentValue)}</th>
      <th className={"money "+profitClass}>{utilities.formatNumber(totals.profit)}</th>
    </tr>
  );
}

export default StockListTotals;
