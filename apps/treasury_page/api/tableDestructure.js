let total = 0;

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function tableDestruct(tableData, lordsTotal) {
  // Eth calcultion
  const ethPrice = tableData.ETH.price.rate;
  const ethBalance = tableData.ETH.balance;
  const ethInUSD = ethPrice * ethBalance;

  ({ address, ETH, countTxs, tokens } = tableData);
  tokArr = [];
  let total = 0;
  tokens.forEach((token) => {
    ({ tokenInfo, balance } = token);
    decimal = tokenInfo.decimals;
    Balance = balance / Math.pow(10, decimal);
    RateOfCoin = tokenInfo.price.rate;
    inUSD = Balance * RateOfCoin;
    total = total + inUSD;
  });
  total += ethInUSD;
  total += lordsTotal;

  tokens.forEach((token) => {
    ({ tokenInfo, balance } = token);
    tokenName = tokenInfo.name;
    decimal = tokenInfo.decimals;
    Balance = balance / Math.pow(10, decimal);
    RateOfCoin = tokenInfo.price.rate;
    inUSD = Balance * RateOfCoin;

    percentage = ((inUSD / total) * 100).toFixed(3);

    tok = {};
    tok.name = tokenName;

    tok.balance = formatter.format(Balance.toFixed(2)).substring(1);
    tok.inUsd = formatter.format(inUSD.toFixed(2));
    tokArr.push(tok);

    tok.percent = percentage;
  });
  tokEth = {};
  tokEth.name = 'ETH';
  tokEth.balance = formatter.format(ethBalance.toFixed(2)).substring(1);
  tokEth.inUsd = formatter.format(ethInUSD.toFixed(2));
  const ethPercentage = ((ethInUSD / total) * 100).toFixed(3);
  tokEth.percent = ethPercentage;
  tokArr.push(tokEth);

  tokArr.sort((a, b) => {
    return b.percent - a.percent;
  });
  return { tokArr, total };
}

function TotalAssest(data) {
  const tablebalances = data;
  let sum = 0;

  tablebalances.forEach((balance) => {
    value = balance.inUsd;
    value = value.slice(1);
    value = value.replace(',', '');

    let val = parseFloat(value);
    sum += val;
  });
  return [sum];
}

module.exports = { tableDestruct, TotalAssest };
