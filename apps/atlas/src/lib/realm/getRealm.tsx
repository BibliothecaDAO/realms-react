export async function getRealm(id) {
  try {
    const res = await fetch(
      'https://dev-indexer-gu226.ondigitalocean.app/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
                  query getRealm($id: Float!) {
                      realm(id: $id) {
                          realmId
                          realmId
                          owner
                          bridgedOwner
                          ownerL2
                          settledOwner
                          name
                          rarityRank
                          rarityScore
                          orderType
                          wonder
                          lastAttacked
                          lastClaimTime
                          lastVaultTime
                          longitude
                          latitude
                          resources {
                            resourceId
                            resourceName
                            level
                            upgrades
                          }
                          traits {
                            type
                            qty
                          }
                        
                          relic {
                            realmId
                            heldByRealm
                          }
                          relicsOwned {
                            realmId
                            heldByRealm
                          }
                      }
                  }
              `,
          variables: { id: parseFloat(id) },
        }),
      }
    );
    const response = await res.json();
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
