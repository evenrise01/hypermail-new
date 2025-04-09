import { motion } from 'framer-motion'
import * as React from "react";
import type { ActionImpl, ActionId } from "kbar";

// Icon components for different actions
const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);

const DraftsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const SentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const DoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const PendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ResultItem = React.forwardRef(
    (
      {
        action,
        active,
        currentRootActionId,
      }: {
        action: ActionImpl;
        active: boolean;
        currentRootActionId: ActionId;
      },
      ref: React.Ref<HTMLDivElement>
    ) => {
      const ancestors = React.useMemo(() => {
        if (!currentRootActionId) return action.ancestors;
        const index = action.ancestors.findIndex(
          (ancestor) => ancestor.id === currentRootActionId
        );
        return action.ancestors.slice(index + 1);
      }, [action.ancestors, currentRootActionId]);
  
      const getActionIcon = () => {
        if (!action.icon) {
          switch (action.id) {
            case "inboxAction":
              return <InboxIcon />;
            case "draftsAction":
              return <DraftsIcon />;
            case "sentAction":
              return <SentIcon />;
            case "pendingAction":
              return <PendingIcon />;
            case "doneAction":
              return <DoneIcon />;
            default:
              return null;
          }
        }
        return action.icon;
      };
    //   console.log(action.id, action.shortcut)
      return (
        <div
          ref={ref}
          className={`px-4 py-3 flex items-center justify-between cursor-pointer relative z-10`}
        >
          {active && (
            <motion.div 
              layoutId="kbar-result-item" 
              className="absolute inset-0 !z-[-1]"
              transition={{
                duration: 0.14,
                type: "spring",
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/80 dark:to-blue-900/20 opacity-80" />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400" />
            </motion.div>
          )}
          <div className="flex gap-3 items-center relative z-10">
            {getActionIcon() && (
              <div className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
                active 
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}>
                {getActionIcon()}
              </div>
            )}
            <div className="flex flex-col">
              <div className={`font-medium ${active ? "text-blue-700 dark:text-blue-300" : ""}`}>
                {ancestors.length > 0 &&
                  ancestors.map((ancestor) => (
                    <React.Fragment key={`${action.id}-ancestor-${ancestor.id}`}>
                      <span className="opacity-50 mr-2">{ancestor.name}</span>
                      <span className="mr-2">&rsaquo;</span>
                    </React.Fragment>
                  ))}
                <span>{action.name}</span>
              </div>
              {action.subtitle && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {action.subtitle}
                </span>
              )}
            </div>
          </div>
          {action.shortcut?.length ? (
            <div className="grid grid-flow-col gap-1 relative z-10">
              {action.shortcut.map((sc, index) => (
                <kbd
                  key={`${action.id}-shortcut-${index}`}
                  className={`px-1.5 py-1 rounded-md text-xs flex items-center transition-all duration-200 ${
                    active 
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" 
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                  } shadow-sm font-medium`}
                >
                  {sc}
                </kbd>
              ))}
            </div>
          ) : null}
        </div>
      );
    }
  );

export default ResultItem;