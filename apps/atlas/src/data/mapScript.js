const realms = require('./realms.json');
const realms_data = require('./continents.js');
const fs = require('fs');

const mappedRealms = {
  type: 'FeatureCollection',
  features: realms.features.map((a) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          (a.geometry.coordinates[0] * 10000).toFixed(),
          (a.geometry.coordinates[1] * 10000).toFixed(),
        ],
      },
      properties: {
        tokenId: a.properties.tokenId,
        environment: a.properties.environment,
      },
    };
  }),
};

fs.writeFile('coords.json', JSON.stringify(mappedRealms), (err) => {
  if (err) {
    console.error(err);
  }
});
