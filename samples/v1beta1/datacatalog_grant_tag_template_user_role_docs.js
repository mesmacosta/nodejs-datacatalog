'use strict';

// This application demonstrates how to grant a project member
// the Tag Template User role for a given template.

// For more information, see the README.md under /datacatalog and the
// documentation at https://cloud.google.com/data-catalog/docs.

async function grantTagTemplateUserRole() {
  // -------------------------------
  // Import required modules.
  // -------------------------------
  const { DataCatalogClient } = require('@google-cloud/datacatalog').v1beta1;
  const datacatalog = new DataCatalogClient();

  // -------------------------------
  // Set your Project, Template and Member.
  // -------------------------------
  // TODO(developer): Uncomment the following lines before running the sample.
  // const projectId = 'my-project';
  // const templateId = 'my-template';
  // const memberId = 'user:member@gmail.com';

  // Currently, Data Catalog stores metadata in the us-central1 region.
  const location = "us-central1";

  // Format the Template name.
  const templateName = datacatalog.tagTemplatePath(
    projectId,
    location,
    templateId,
  );

  // Retrieve Template's current IAM Policy.
  const responses = await datacatalog.getIamPolicy({ resource: templateName });
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
  await datacatalog.setIamPolicy(request);
}

grantTagTemplateUserRole();
