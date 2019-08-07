'use strict';

// This application demonstrates how to perform search operations with the
// Cloud Data Catalog API.

// For more information, see the README.md under /datacatalog and the
// documentation at https://cloud.google.com/data-catalog/docs.

const datacatalog = require('@google-cloud/datacatalog').v1beta1;

/**
 * Search Catalog
 *
 * @param organizationId {string} Your Google Cloud organization ID.
 * @param query {string} Your query string.
 * See: https://cloud.google.com/data-catalog/docs/how-to/search-reference
 * Example: system=bigquery type=dataset
 */
function search(organizationId, query) {
  const client = new datacatalog.DataCatalogClient();

  const includeOrgIds = [organizationId];
  const scope = {
    includeOrgIds: includeOrgIds,
  };
  const request = {
    scope: scope,
    query: query,
  };

  client
    .searchCatalog(request)
    .then(responses => {
      const resources = responses[0];
      for (const resource of resources) {
        console.log(`Result type: ${resource.searchResultType}`);
        console.log(`Result subtype: ${resource.searchResultSubtype}`);
        console.log(`Relative resource name: ${resource.relativeResourceName}`);
        console.log(`Linked resource: ${resource.linkedResource}\n`);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

const argv = require(`yargs`)
  .option('organization_id', {
    demandOption: 'Your Google Cloud organization ID',
    string: true,
  })
  .option('query', {
    demandOption: 'Your custom query',
    string: true,
  }).argv;

search(
  argv.organization_id,
  argv.query
);
