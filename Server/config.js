// @ts-check

const config = {
  endpoint: "https://eli-test.documents.azure.com:443/",
  key: "put you cosmos db key here",
  databaseId: "gis",
  containerId: "miklatim",
  partitionKey: { kind: "Hash", paths: ["/partitionKey"] }
};

module.exports = config;