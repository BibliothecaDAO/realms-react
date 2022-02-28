const realms = require("./crypts_all.json")
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
                "tokenId": a.properties.tokenId,
                "environment": a.properties.environment
            }
        }
    })
}

fs.writeFile('crypts_all.json', JSON.stringify(mappedRealms), err => {
    if (err) {
        console.error(err)
        return
    }
})
