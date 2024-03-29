import createJiraApiBaseUrl from "./createJiraApiBaseUrl";

export default async function postJiraIssues(issueData) {
  const jiraApiBaseUrl = createJiraApiBaseUrl();
  const apiUrl = `${jiraApiBaseUrl}/issue/bulk`;
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issueUpdates: issueData }),
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
