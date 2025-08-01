'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ExamContextType {
  examInProgress: boolean;
  startExam: () => void;
  endExam: () => void;
  shouldBlockNavigation: boolean;
  setShouldBlockNavigation: (value: boolean) => void;
}

const defaultContext: ExamContextType = {
  examInProgress: false,
  startExam: () => {},
  endExam: () => {},
  shouldBlockNavigation: false,
  setShouldBlockNavigation: () => {},
};

const ExamContext = createContext<ExamContextType>(defaultContext);

export const useExamContext = () => useContext(ExamContext);

interface ExamProviderProps {
  children: ReactNode;
}

export const ExamProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [examInProgress, setExamInProgress] = useState(false);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);

  const startExam = useCallback(() => {
    setExamInProgress(true);
    setShouldBlockNavigation(true);
    // We could also store this in localStorage/sessionStorage for persistence
    if (typeof window !== 'undefined') {
      // @ts-ignore - Add a global flag that can be checked from anywhere
      window.__EXAM_IN_PROGRESS = true;
    }
  }, []);

  const endExam = useCallback(() => {
    setExamInProgress(false);
    setShouldBlockNavigation(false);
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.__EXAM_IN_PROGRESS = false;
    }
  }, []);

  return (
    <ExamContext.Provider
      value={{
        examInProgress,
        startExam,
        endExam,
        shouldBlockNavigation,
        setShouldBlockNavigation,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export default ExamContext;
