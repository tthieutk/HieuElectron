import { ChangeEvent, ReactElement, useState } from 'react';
import { BoxApprove } from '../../components/Box/Box';
import { ButtonBack } from '../../components/Button/ButtonBack';
import { HeadingLv2 } from '../../components/Heading';
import { TableFrom } from '../../components/Table/Table';
import { TextLead, TextRight } from '../../components/TextGroup';

export const FromOut = () => {
  const [inputs, setInputs] = useState<ReactElement[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);

  const handleCreateInput = () => {
    const newInputs = [
      ...inputs,
      <input
        key={inputs.length}
        type="text"
        onChange={(e) => handleInputChanges(e, inputs.length)}
      />,
    ];
    setInputs(newInputs);
  };

  const handleInputChanges = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Định kiểu cho event và index
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleLogValues = () => {
    console.log(inputValues);
  };
  return (
    <>
      <button className="btn a" onClick={handleCreateInput}>
        Click để tạo input
      </button>
      <button className="b" onClick={handleLogValues}>
        Log giá trị của các input
      </button>
      {/* Hiển thị các input được tạo ra */}
      {inputs.map((input, index) => (
        <div key={index}>{input}</div>
      ))}
    </>
  );
};
