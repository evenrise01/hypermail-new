import { KBarResults, useMatches } from "kbar";
import ResultItem from "./Result-item";

export default function RenderResults() {
  const { results, rootActionId } = useMatches();

  console.log("Results:", results); // Inspect the structure

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-sm uppercase opacity-50 text-gray-600 dark:text-gray-400">
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