import { subTaskId } from "../constants";

export default function constructIssueData(
  metadata,
  projectKey,
  parentIssue,
  tasks,
  reporter
) {
  const issueDataArray = [];
  const requiredFields = metadata?.values.filter((field) => field?.required);

  // Find the fieldId for the "Sprint" custom field from the metadata
  const sprintField = metadata?.values.find(
    (field) => field.name.toLowerCase() === "sprint"
  );
  const sprintFieldId = sprintField?.fieldId;

  console.log("getCreateMetadata: ", metadata)

  for (const task of tasks) {
    let issueData = {
      fields: {
        summary: task,
        issuetype: {
          id: subTaskId,
        },
        project: {
          key: projectKey,
        },
        parent: {
          key: parentIssue.key,
        },
      },
    };

    for (const field of requiredFields) {
      // Check if the field is not already in issueData
      if (!issueData.fields[field.fieldId]) {
        if (field.fieldId === "reporter") {
          issueData.fields.reporter = {
            name: reporter.name,
          };
        } else if (field.fieldId === "components") {
          // If components are required, copy them from the parent issue.
          // The API expects an array of objects with 'id' or 'name'.
          if (
            parentIssue.fields &&
            parentIssue.fields.components &&
            parentIssue.fields.components.length > 0
          ) {
            issueData.fields.components = parentIssue.fields.components.map(
              (c) => ({ id: c.id })
            );
          }
        } else if (field.allowedValues && field.allowedValues.length > 0) {
          // Add the field to issueData with the first allowed value
          issueData.fields[field.fieldId] = { id: field.allowedValues[0].id };
        } else {
          // Throw an error if the field is required but has no allowed values
          throw new Error(
            `Could not determine value for required field ${field.fieldId}`
          );
        }
      }
    }
    
    // If the parent is part of a sprint, assign the sub-task to it.
    // This is outside the requiredFields loop as 'sprint' may not be required.
    if (sprintFieldId && parentIssue.fields?.sprint) {
      const sprints = Array.isArray(parentIssue.fields.sprint)
        ? parentIssue.fields.sprint
        : [parentIssue.fields.sprint];

      let sprintToAssign = sprints.find((s) => s.state === "active");

      if (!sprintToAssign && sprints.length > 0) {
        // If no active sprint, find the most recent one by sorting by ID descending.
        sprintToAssign = [...sprints].sort((a, b) => b.id - a.id)[0];
      }

      if (sprintToAssign) {
        issueData.fields[sprintFieldId] = sprintToAssign.id;
      }
    }

    issueDataArray.push(issueData);
  }

  return issueDataArray;
}