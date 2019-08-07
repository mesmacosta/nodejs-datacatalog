'use strict';

// This application demonstrates how to grant a project member
// the Tag Template User role for a given template.

// For more information, see the README.md under /datacatalog and the
// documentation at https://cloud.google.com/data-catalog/docs.

const datacatalog = require('@google-cloud/datacatalog').v1beta1;

/**
 * Grants a user the Tag Template User role for a given template.
 */
async function grantTagTemplateUserRole(projectId, templateId, memberId) {
  const client = new datacatalog.DataCatalogClient();

  // Currently, Data Catalog stores metadata in the us-central1 region.
  const location = "us-central1";

  // Format the Template name.
  const templateName = client.tagTemplatePath(
    projectId,
    location,
    templateId,
  );

  // Retrieve Template's current IAM Policy.
  const responses = await client.getIamPolicy({ resource: templateName });
  const policy = responses[0];

  // Add Tag Template User role and member to the policy.
  policy.bindings.push({
    role: 'roles/datacatalog.tagTemplateUser',
    members: [memberId],
  });

  const request = {
    resource: templateName,
    policy: policy,
  }

  // Update Template's policy.
  await client.setIamPolicy(request);
}

const argv = require(`yargs`)
  .option('project_id', {
    demandOption: 'Your Google Cloud project ID',
    string: true,
  })
  .option('template_id', {
    demandOption: 'Your Template ID',
    string: true,
  })
  .option('member_id', {
    demandOption: 'Member who will be granted access, e.g. "user:test-user@gmail.com"',
    string: true,
  }).argv;

grantTagTemplateUserRole(argv.project_id, argv.template_id, argv.member_id);
