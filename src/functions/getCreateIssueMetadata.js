import { jiraUrl, subTaskId } from "../constants";

export default async function getCreateIssueMetadata(projectKey) {
  const apiUrl = `${jiraUrl}/issue/createmeta/${projectKey}/issuetypes/${subTaskId}?startAt=0&maxResults=50`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status}, ${JSON.stringify(errorBody)}`
      );
    }
    return await response.json();
  } catch (error) {
    throw { message: error.message };
  }
}
