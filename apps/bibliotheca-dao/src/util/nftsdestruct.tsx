function destructList(data: any) {
  const { result } = data;
  const listnames: any = [];

  const getFrequency = (array: any) => {
    const map: any = {};
    array.forEach((item: any) => {
      if (map[item]) {
        map[item]++;
      } else {
        map[item] = 1;
      }
    });
    return map;
  };

  result.forEach((res: any) => {
    listnames.push(res.name);
  });

  const freq = getFrequency(listnames);

  const newnftlist = [];

  for (const [key, value] of Object.entries(freq)) {
    const map: any = {};
    map.name = key;
    map.count = value;
    newnftlist.push(map);
  }

  return newnftlist.filter((nfts) => nfts.name === 'Realms (for Adventurers)');
}

function nftitems(data: any) {
  const { result } = data;
  const arr: any = [];
  result.forEach((res: any) => {
    if (res.name === 'Realms (for Adventurers)') {
      const nft: any = {};
      const obj = JSON.parse(res.metadata);
      nft.nftname = obj?.name;
      nft.tokenid = res.token_id;
      nft.tokenname = res.name;
      arr.push(nft);
    }
  });
  return arr;
}

function FilterByClickList(listclicked: any) {
  const nfts: any = [];
  // eslint-disable-next-line sonarjs/no-empty-collection
  return nfts.filter((nft: any) => nft.tokenname == listclicked);
}

function destruct(nftitem: any, data: any) {
  const newarr: any = [];
  nftitem.forEach((nft: any) => {
    data.items.forEach((result: any) => {
      if (nft.tokenid === result.tokenId) {
        nft.imgurl = result.meta.content[0].url;
        newarr.push(nft);
      }
    });
  });
  return newarr;
}

export { destruct, destructList, nftitems, FilterByClickList };
