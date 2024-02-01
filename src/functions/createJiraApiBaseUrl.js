export default function createJiraApiBaseUrl() {
  if (!window.location) {
    return;
  }

  const location = window.location;
  const apiString = "/rest/api/latest";
  const apiUrl = `${location.protocol}//${location.host}${apiString}`;

  return apiUrl;
}
