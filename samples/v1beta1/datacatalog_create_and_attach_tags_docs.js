'use strict';

async function main() {
  // -------------------------------
  // Import required modules.
  // -------------------------------
  const datacatalog = require('@google-cloud/datacatalog').v1beta1;

  // Common fields.
  let request;
  let responses; 

  // -------------------------------
  // Set your Google Cloud Platform project ID.
  // -------------------------------
  const projectId = 'uat-env-1';

  // -------------------------------
  // Currently, Data Catalog stores metadata in the 
  // us-central1 region.
  // -------------------------------
  const location = 'us-central1';

  // -------------------------------
  // Use Application Default Credentials to create a new
  // Data Catalog client. GOOGLE_APPLICATION_CREDENTIALS
  // environment variable must be set with the location
  // of a service account key file.
  // -------------------------------
  const client = new datacatalog.DataCatalogClient();

  // Create Fields.
  const fieldSource = {
    displayName: 'Source of data asset',
    type: {
      primitiveType: 'STRING',
    },
  };

  const fieldNumRows = {
    displayName: 'Number of rows in data asset',
    type: {
      primitiveType: 'DOUBLE',
    },
  };

  const fieldHasPII = {
    displayName: 'Has PII',
    type: {
      primitiveType: 'BOOL',
    },
  };

  const fieldPIIType = {
    displayName: 'PII type',
    type: {
      enumType: {
        allowedValues: [
          {
            displayName: 'EMAIL',
          },
          {
            displayName: 'SOCIAL SECURITY NUMBER',
          },
          {
            displayName: 'NONE',
          },
        ],
      },
    },
  };

  // -------------------------------
  // Create Tag Template.
  // -------------------------------
  const tagTemplateId = 'demo_tag_template';

  const tagTemplate = {
    displayName: 'Demo Tag Template',
    fields: {
      source: fieldSource,
      num_rows: fieldNumRows,
      has_pii: fieldHasPII,
      pii_type: fieldPIIType,
    },
  };

  const tagTemplatePath = client.tagTemplatePath(
    projectId,
    location,
    tagTemplateId,
  );

  // Delete any pre-existing Template with the same name.
  try {
    request = {
      name: tagTemplatePath,
      force: true,
    };
    await client.deleteTagTemplate(request);
    console.log(`Deleted template: ${tagTemplatePath}`);
  } catch (error) {
    console.log(`Cannot delete template: ${tagTemplatePath}`);
  }

  // Create the Tag Template request.
  const locationPath = client.locationPath(projectId, location);

  request = {
    parent: locationPath,
    tagTemplateId: tagTemplateId,
    tagTemplate: tagTemplate,
  };  

  // Execute the request.
  responses = await client.createTagTemplate(request);
  const createdTagTemplate = responses[0];
  console.log(`Created template: ${createdTagTemplate.name}`);

  // -------------------------------
  // Lookup Data Catalog's Entry referring to the table.
  // -------------------------------  
  responses = await client
    .lookupEntry({ linkedResource: `//bigquery.googleapis.com/projects/${projectId}/datasets/demo_dataset/tables/trips` });
  const entry = responses[0];
  console.log(`Entry name: ${entry.name}`);
  console.log(`Entry type: ${entry.type}`);
  console.log(`Linked resource: ${entry.linkedResource}`);

  // -------------------------------
  // Attach a Tag to the table.
  // -------------------------------
  const tag = {
    name: entry.name,
    template: createdTagTemplate.name,
    fields: {
      source: {
        stringValue: 'Copied from tlc_yellow_trips_2017',
      },
      num_rows: {
        doubleValue: 113496874,
      },
      has_pii: {
        boolValue: false,
      },
      pii_type: {
        enumValue: {
          displayName: 'NONE',
        }
      },
    }
  };

  const attachTagRequest = {
    parent: entry.name,
    tag: tag,
  };

  // Create the Tag.
  await client.createTag(attachTagRequest)
  console.log(`Tag created for entry: ${entry.name}`);
}

main();
