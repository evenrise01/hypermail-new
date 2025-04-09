import { KBarResults, useMatches } from "kbar";
import ResultItem from "./Result-item";

export default function RenderResults() {
  const { results, rootActionId } = useMatches();

  console.log("Results:", results); // Keeping original debug logging

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-gray-50/80 dark:bg-gray-800/60 text-blue-500 dark:text-blue-400 border-b border-gray-100 dark:border-gray-800">
            {item}
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ""}
          />
        )
      }
    />
  );
}