// Form.js
import React from 'react';

interface FormProps {
  selectedFields: string[]; // Chỉ định kiểu dữ liệu là một mảng các chuỗi
  onSubmit: (selectedFields: string[]) => void; // Chỉ định kiểu dữ liệu cho hàm onSubmit
}

const Form: React.FC<FormProps> = ({ selectedFields, onSubmit }) => {
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    onSubmit(selectedFields);
  };

  return <></>;
};

export default Form;
