'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ExamContextProps {
  time: number;
  page: number;
  answers: { [key: string]: string };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  changePage: (page: number) => void;
  init: (time: number) => void;
}

// Create a context with the correct type
const ExaminationContext = createContext<ExamContextProps>({
  time: 900,
  page: 0,
  changePage: () => {},
  answers: {},
  handleChange: () => {},
  init: () => {},
  // submit: () => {},
});

interface Props {
  readonly children: ReactNode;
}

// Create a provider component
function ExaminationProvider({ children }: Props) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(0);
  const [time, setTime] = useState(900);
  const handleChangePage = (page: number) => {
    setPage(page);
  };
  // Update handleChange to use the correct type
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setAnswers({
      ...answers,
      [key]: event.target.value,
    });
  };

  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [time]);

  const init = (theTime: number) => {
    setAnswers({});
    setPage(0);
    setTime(theTime);
  };

  const value = {
    time,
    page,
    answers,
    init,
    handleChange,
    changePage: handleChangePage,
  };

  return <ExaminationContext.Provider value={value}>{children}</ExaminationContext.Provider>;
}

export { ExaminationContext, ExaminationProvider };
