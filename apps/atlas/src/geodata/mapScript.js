const realms = require('./realms.json');
const resources = require('./continents.js');
const fs = require('fs');

const mappedRealms = {
  type: 'FeatureCollection',
  features: realms.features.map((a) => {
    return {
      xy: a.xy,
      id: a.id,
      resources: resources.find((b) => b.name === a.id).resource,
    };
  }),
};

fs.writeFile('realms_resources.json', JSON.stringify(mappedRealms), (err) => {
  if (err) {
    console.error(err);
    // eslint-disable-next-line sonarjs/no-redundant-jump
    return;
  }
});
