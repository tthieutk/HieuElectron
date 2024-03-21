import React, { ChangeEvent, useState, KeyboardEvent } from 'react';

import './InputQuantity.scss';

type InputQuantityProps = {
  total: number;
  onItemsPerPageChange: (value: number) => void;
};

export const InputQuantity = (props: InputQuantityProps) => {
  const [inputValue, setInputValue] = useState('10');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // Prevent entering '0'
    if (value === '0' || value === '00') {
      value = '10';
    }

    setInputValue(value);
    props.onItemsPerPageChange(Number(value));
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    // Reset to '1' when Backspace or Delete key is pressed
    if (event.key === 'Backspace' || event.key === 'Delete') {
      setInputValue('10');
      props.onItemsPerPageChange(10);
      event.preventDefault();
    }
  };

  // Ensure itemsPerPage is greater than 0
  const itemsPerPage = Math.max(1, Number(inputValue));

  // Calculate totalPages
  const totalPages = Math.ceil(props.total / itemsPerPage);

  return (
    <span className="title-quantity">
      Số Lượng Hiển Thị{' '}
      <span className="input-show">
        <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          type="text"
        />
      </span>
    </span>
  );
};