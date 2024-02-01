import { useState } from "preact/hooks";
import "./index.css";
import ProgressBar from "./components/progressBar";
import { RotateCw } from "lucide-preact";
import getProjectVariables from "./functions/getProjectVariables";
import getCreateIssueMetadata from "./functions/getCreateIssueMetadata";
import getCurrentUserInformation from "./functions/getCurrentUserInformation";
import constructIssueData from "./functions/constructIssueData";
import postJiraIssues from "./functions/postJiraIssues";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [amountSubtasks, setAmountSubtasks] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  function handleInput(e) {
    const value = e.target.value;
    setInputText(value);

    if (value.trim() === "") {
      setAmountSubtasks(0);
    } else {
      const taskArray = value.split(";").filter((task) => task.trim() !== "");
      setTasks(taskArray);
      setAmountSubtasks(taskArray.length);
    }

    setError(null);
  }

  // this is now the chain of functions
  async function handleSubmit() {
    setLoading(true);
    setProgress(0);
    try {
      const { parentIssue, projectKey } = getProjectVariables();
      if (parentIssue && projectKey) {
        setProgress(1);
      }
      const issueMetadata = await getCreateIssueMetadata(projectKey);
      if (issueMetadata) {
        setProgress(2);
      }
      const reporter = await getCurrentUserInformation();
      if (reporter) {
        setProgress(3);
      }
      const issueData = constructIssueData(
        issueMetadata,
        projectKey,
        parentIssue,
        tasks,
        reporter
      );
      if (issueData) {
        setProgress(4);
      }
      const uploadSuccess = await postJiraIssues(issueData);
      if (uploadSuccess) {
        setAmountSubtasks(0);
        setInputText("");
        setProgress(5);
      }
    } catch (error) {
      console.error("Error in getProjectVariables:", error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  function handleUploadComplete() {
    window.location.reload(true);
  }

  return (
    <div
      id="bulkAddingApp"
      className="ml-1 mr-2 my-2 p-4 border space-y-4 rounded"
    >
      <div class="flex space-x-4 items-end">
        <div class="flex flex-col flex-grow">
          <label for="bulkaddingInput" class="text-sm text-slate-700">
            Add Sub-tasks on bulk
          </label>
          <textarea
            id="bulkaddingInput"
            class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="seperate by ;"
            value={inputText}
            onInput={(e) => handleInput(e)}
            autocomplete="off"
            disabled={loading}
          />
        </div>
        <button
          class="min-w-[18ch] h-9 px-4 py-2 bg-muted inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          disabled={loading || error || amountSubtasks === 0}
          onClick={(e) => handleSubmit(e)}
        >
          {loading ? (
            <RotateCw class="h-4 w-4 animate-spin m-auto" />
          ) : (
            <>Add {amountSubtasks} Sub-Tasks</>
          )}
        </button>
      </div>
      {error && (
        <p class="text-destructive m-0 animate-fadeIn">{error.message}</p>
      )}
      <ProgressBar onComplete={handleUploadComplete} max="5" value={progress} />
    </div>
  );
}
