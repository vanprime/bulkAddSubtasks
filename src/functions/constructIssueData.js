import { subTaskId } from "../constants";

export default function constructIssueData(
  metadata,
  projectKey,
  parentIssueKey,
  tasks,
  reporter
) {
  let issueDataArray = [];
  const requiredFields = metadata?.values.filter((field) => field?.required);

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
          key: parentIssueKey,
        },
        reporter: {
          name: reporter.name,
        },
      },
    };

    for (const field of requiredFields) {
      // Check if the field is not already in issueData
      if (!issueData.fields[field.fieldId]) {
        if (field.allowedValues && field.allowedValues.length > 0) {
          // Add the field to issueData with the first allowed value
          issueData.fields[field.fieldId] = field.allowedValues[0].id;
        } else {
          // Throw an error if the field is required but has no allowed values
          throw new Error(
            `Could not determine value for required field ${field.fieldId}`
          );
        }
      }
    }

    issueDataArray.push(issueData);
  }

  return issueDataArray;
}
