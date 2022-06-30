const realms = require('./geodata/crypts_all.json');

const fs = require('fs');

const mappedRealms = {
  type: 'FeatureCollection',
  features: realms.features.map((a) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: a.geometry.coordinates,
      },
      properties: {
        tokenId: a.properties.tokenId,
        environment: a.properties.environment,
      },
    };
  }),
};

fs.writeFile('crypts_all.json', JSON.stringify(mappedRealms), (err) => {
  if (err) {
    console.error(err);
    // eslint-disable-next-line sonarjs/no-redundant-jump
    return;
  }
});
