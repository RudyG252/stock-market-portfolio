function StockListHeader() {
  
  return (
    <tr>
      <th>Ticker</th>
      <th>Name</th>
      <th>Shares</th>
      <th className="money">Purchase price</th>
      <th className="money">Purchase value</th>
      <th className="money">Current price</th>
      <th className="money">Current value</th>
      <th className="money">Profit / Loss</th>
    </tr>
  );
}

export default StockListHeader;
