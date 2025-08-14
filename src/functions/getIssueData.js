import createJiraApiBaseUrl from "./createJiraApiBaseUrl";

export default async function getIssueData(issueKey) {
  const jiraApiBaseUrl = createJiraApiBaseUrl();
  const apiUrl = `${jiraApiBaseUrl}/issue/${issueKey}`;

  console.log("fetching issuedata for: ", issueKey, "from: ", apiUrl)

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
