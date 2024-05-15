'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ExamContextProps {
  page: number;
  answers: { [key: string]: string };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  changePage: (page: number) => void;
}

// Create a context with the correct type
const ExaminationContext = createContext<ExamContextProps>({
  page: 0,
  changePage: () => {},
  answers: {},
  handleChange: () => {},
});

interface Props {
  readonly children: ReactNode;
}

// Create a provider component
function ExaminationProvider({ children }: Props) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(0);
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

  const value = {
    page,
    answers,
    handleChange,
    changePage: handleChangePage,
  };

  return <ExaminationContext.Provider value={value}>{children}</ExaminationContext.Provider>;
}

export { ExaminationContext, ExaminationProvider };
