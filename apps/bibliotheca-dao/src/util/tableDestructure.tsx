const total = 0;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function tableDestruct(tableData: any, lordsTotal?: any) {
  // Eth calcultion
  const ethPrice = tableData.ETH.price.rate;
  const ethBalance = tableData.ETH.balance;
  const ethInUSD = ethPrice * ethBalance;

  const { address, ETH, countTxs, tokens } = tableData;
  const tokArr: any = [];
  let total = 0;
  tokens.forEach((token: any) => {
    const { tokenInfo, balance } = token;
    const Balance = balance / Math.pow(10, tokenInfo.decimals);
    const inUSD = Balance * tokenInfo.price.rate;
    total = total + inUSD;
  });
  total += ethInUSD;
  total += lordsTotal;

  tokens.forEach((token: any) => {
    const { tokenInfo, balance } = token;
    const Balance = balance / Math.pow(10, tokenInfo.decimals);
    const inUSD = Balance * tokenInfo.price.rate;

    const percentage = ((inUSD / total) * 100).toFixed(3);

    const tok: any = {};
    tok.name = tokenInfo.name;

    tok.balance = formatter.format(Balance).substring(1);
    tok.inUsd = formatter.format(inUSD);
    tokArr.push(tok);

    tok.percent = percentage;
  });
  const tokEth: any = {};
  tokEth.name = 'ETH';
  tokEth.balance = formatter.format(ethBalance.toFixed(2)).substring(1);
  tokEth.inUsd = formatter.format(ethInUSD);
  const ethPercentage = ((ethInUSD / total) * 100).toFixed(3);
  tokEth.percent = ethPercentage;
  tokArr.push(tokEth);

  tokArr.sort((a: any, b: any) => {
    return b.percent - a.percent;
  });
  return { tokArr, total };
}

function TotalAssest(data: any) {
  const tablebalances = data;
  let sum = 0;

  tablebalances.forEach((balance: any) => {
    let value = balance.inUsd;
    value = value.slice(1);
    value = value.replace(',', '');

    const val = parseFloat(value);
    sum += val;
  });
  return [sum];
}

export { tableDestruct, TotalAssest };
