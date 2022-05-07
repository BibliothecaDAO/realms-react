async function NftListClick(clickedList) {
  let query = {
    list: clickedList,
  };

  const response = await fetch('/api/listclicked', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();

  console.log(data); //this data need to be updated in the app setnft
}

export default NftListClick;
