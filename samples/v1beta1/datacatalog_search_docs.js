// This application demonstrates how to perform search operations with the
// Cloud Data Catalog API.

// For more information, see the README.md under /datacatalog and the
// documentation at https://cloud.google.com/data-catalog/docs.

async function search() {

  // -------------------------------
  // Import required modules.
  // -------------------------------
  const { DataCatalogClient } = require('@google-cloud/datacatalog').v1beta1;
  const datacatalog = new DataCatalogClient();

  // -------------------------------
  // Set your Google Cloud Organization ID.
  // -------------------------------
  // TODO(developer): Uncomment the following line before running the sample.
  // const organizationId = 111111000000;

  // -------------------------------
  // Set your custom query.
  // -------------------------------
  // TODO(developer): Uncomment the following line before running the sample.
  // const query = 'type=dataset'

  // Create request.
  const scope = {
    includeOrgIds: [organizationId],
  };
  const request = {
    scope: scope,
    query: query,
  };

  const [result] = await datacatalog.searchCatalog(request);
  return result;
}

search().then(response => { console.log(response) });