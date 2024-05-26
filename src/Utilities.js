import numeral from 'numeral';

const utilities = {
  formatNumber: m => numeral(m).format('0,0.00')
}

export default utilities;
