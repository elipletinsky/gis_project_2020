const config = require("../config");
const CosmosClient = require("@azure/cosmos").CosmosClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body) {
        const client = new CosmosClient({ endpoint: config.endpoint, key: config.key });

        const database = client.database(config.databaseId);
        const container = database.container(config.containerId);

        const querySpec = {
            query: "SELECT * from c"
          };
          
          // read all items in the Items container
        const r = await container.items
            .query(querySpec)
            .fetchAll();

        for (let i =0; i < r.resources.length; i++) {
            let itemData = r.resources[i];
            const item =container.item(itemData.id);

            await item.delete();
        }

        let items = [];
        
        for (let i =0; i < req.body.features.length; i++) {
            const feature = req.body.features[i]; 

            const item = {
                id: "" + (i + 1),
                name: "Shelter " + (i + 1),
                location: feature.geometry
            }

            items.push(item);
            await container.items.create(item);
        }

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: items
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};