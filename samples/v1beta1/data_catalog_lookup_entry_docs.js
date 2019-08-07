'use strict';

// This application demonstrates how to perform lookup operations with the
// Cloud Data Catalog API.

// For more information, see the README.md under /datacatalog and the
// documentation at https://cloud.google.com/data-catalog/docs.

const datacatalog = require('@google-cloud/datacatalog').v1beta1;

/**
 * Lookup Entry
 *
 * @param resourceName {string} The full name of the Google Cloud Platform resource the Data Catalog
 * entry represents.
 * See: https://cloud.google.com/apis/design/resource_names#full_resource_name
 * Examples:
 * //bigquery.googleapis.com/projects/bigquery-public-data/datasets/new_york_taxi_trips/tables/taxi_zone_geom
 * //pubsub.googleapis.com/projects/pubsub-public-data/topics/taxirides-realtime
 */
function lookupEntry(resourceName) {
  const client = new datacatalog.DataCatalogClient();

  client
    .lookupEntry({linkedResource: resourceName})
    .then(responses => {
      const response = responses[0];
      const entry = response;
      console.log(`Entry name: ${entry.name}`);
      console.log(`Entry type: ${entry.type}`);
      console.log(`Linked resource: ${entry.linkedResource}`);
    })
    .catch(err => {
      console.error(err);
    });
}

const argv = require(`yargs`).option('resource_name', {
  string: true,
  demandOption: 'Your Resource Name',
}).argv;

lookupEntry(argv.resource_name);
