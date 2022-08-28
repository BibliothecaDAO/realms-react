const realms = require('./loot_bags.json');
const realms_data = require('./continents.js');
const fs = require('fs');

const mappedRealms = {
  type: 'FeatureCollection',
  features: realms.features.map((a) => {
    return {
      coordinates: a.coordinates,
      id: a.properties.bag_id,
    };
  }),
};

fs.writeFile('loot.json', JSON.stringify(mappedRealms), (err) => {
  if (err) {
    console.error(err);
    // eslint-disable-next-line sonarjs/no-redundant-jump
    return;
  }
});
