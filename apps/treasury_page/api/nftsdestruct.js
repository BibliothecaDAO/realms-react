function destructList(data) {
  ({ result } = data);
  listnames = [];

  const getFrequency = (array) => {
    const map = {};
    array.forEach((item) => {
      if (map[item]) {
        map[item]++;
      } else {
        map[item] = 1;
      }
    });
    return map;
  };

  result.forEach((res) => {
    tokenid = res.name;
    listnames.push(tokenid);
  });

  freq = getFrequency(listnames);

  newnftlist = [];

  for (const [key, value] of Object.entries(freq)) {
    map = {};
    map.name = key;
    map.count = value;
    newnftlist.push(map);
  }

  return newnftlist;
}

function nftitems(data) {
  result = data.result;
  arr = [];
  result.forEach((res) => {
    token_id = res.token_id;
    token_name = res.name;
    meta = res.metadata;
    nft = {};
    obj = JSON.parse(meta);
    nft.nftname = obj.name;
    nft.tokenid = token_id;
    nft.tokenname = token_name;
    arr.push(nft);
  });
  return arr;
}

let nfts = null;

function FilterByClickList(listclicked) {
  let filteredList = nfts.filter((nft) => nft.tokenname == listclicked);

  return filteredList;
}

function destruct(nftitem, data) {
  results = data.items;
  nfts = nftitem;
  newarr = [];
  nfts.forEach((nft) => {
    token_id = nft.tokenid;
    results.forEach((result) => {
      restok = result.tokenId;
      if (token_id === restok) {
        url = result.meta.content[0].url;
        nft.imgurl = url;
        newarr.push(nft);
      }
    });
  });
  return nfts;
}

module.exports = { destruct, destructList, nftitems, FilterByClickList };
