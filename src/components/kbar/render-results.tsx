import { KBarResults, useMatches } from "kbar";
import { motion } from "framer-motion";
import ResultItem from "./Result-item";

export default function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <div className="relative overflow-auto max-h-[70vh]">
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === "string" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-2 text-xs font-medium text-gray-400 bg-[#151515]"
            >
              {item}
            </motion.div>
          ) : (
            <ResultItem
              action={item}
              active={active}
              currentRootActionId={rootActionId ?? ""}
            />
          )
        }
      />
    </div>
  );
}