const realms = require("./realms.json")
const realms_data = require("./continents.js")
const fs = require('fs')


const mappedRealms = {
    "type": "FeatureCollection", 
    "features": realms.features.map(a => {
        return {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": a.geometry.coordinates
            },
            "properties": {
                "name": a.properties.name,
                "realm_idx": a.properties.realm_idx,
                "order": a.properties.order,
                "resources": realms_data.find(b => b.name === a.properties.realm_idx).resource
            }
        }
    })
}

fs.writeFile('realms.json', JSON.stringify(mappedRealms), err => {
    if (err) {
        console.error(err)
        return
    }
})
