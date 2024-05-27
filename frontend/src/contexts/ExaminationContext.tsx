'use client';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface ExamContextProps {
  time: number;
  page: number;
  second: number;
  numberOfQuestions: number;
  answers: { [key: string]: string };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  changePage: (page: number) => void;
  changeTime: (time: number) => void;
  init: (time: number) => void;
}

// Create a context with the correct type
const ExaminationContext = createContext<ExamContextProps>({
  time: 15,
  second: 900,
  numberOfQuestions: 2,
  page: 0,
  changePage: () => {},
  answers: {},
  changeTime: () => {},
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
  const [numberOfQuestions, setNumberOfQuestions] = useState(2);
  const [time, setTime] = useState(15);
  const [second, setSecond] = useState(900);
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
    if (window.screenX >= 768) {
      setNumberOfQuestions(3);
    }
  }, []);

  useEffect(() => {
    if (second > 0) {
      const timerId = setTimeout(() => setSecond(second - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [second]);

  const init = (theTime: number) => {
    setAnswers({});
    setPage(0);
    setTime(theTime);
    setSecond(theTime * 60);
  };

  const value = {
    numberOfQuestions,
    time,
    second,
    page,
    answers,
    init,
    handleChange,
    changeTime: setTime,
    changePage: handleChangePage,
  };

  return <ExaminationContext.Provider value={value}>{children}</ExaminationContext.Provider>;
}

export { ExaminationContext, ExaminationProvider };
