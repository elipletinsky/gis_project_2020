const config = require("../config");
const CosmosClient = require("@azure/cosmos").CosmosClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query) { 
        const client = new CosmosClient({ endpoint: config.endpoint, key: config.key });

        const database = client.database(config.databaseId);
        const container = database.container(config.containerId);

        const querySpec = {
            query: "select * from (SELECT c.id, c.location, c.name, ST_DISTANCE(c.location, {'type': 'Point', 'coordinates':"
                + "[@lon  , @lat]}) as distance FROM c) as a WHERE a.distance < @distanceValue",
            parameters: [
                {name: "@lat", value: new Number(req.query.lat)},
                {name: "@lon", value: new Number(req.query.lon)},
                {name: "@distanceValue", value: new Number(req.query.distance)}
            ]           
          };
          
          // read all items in the Items container
        const r = await container.items
            .query(querySpec)
            .fetchAll();


        if (r.resources.length == 0)
        {
            context.res = {
                status: 404
            };
        }   
        else
        {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: r.resources
            };            
        } 

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};