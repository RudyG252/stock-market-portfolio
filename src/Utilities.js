import numeral from 'numeral';

const utilities = {
  formatNumber: m => {
      if(m == undefined) return "----";
      return numeral(m).format('0,0.00');
  }
}

export default utilities;