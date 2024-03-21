import { RefObject, useRef, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import React from 'react';
import './field.scss';

const Field = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [required, setRequired] = useState(true);
  const [fieldType, setFieldType] = useState('');
  const [forms, setForms] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([]);
  const [err, setErr] = useState<number>();
  const [inputValues, setInputValues] = useState({
    formName: '',
    fieldLable: '',
  });
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };
  const handleCheckboxChange = () => {
    setRequired(!required);
  };
  const handleFieldType = (event: any) => {
    setFieldType(event.target.value);
  };
  const openModal = () => {
    setFieldType('text');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErr(0);
    setFieldType('text');
    setInputValues((prevState) => ({
      ...prevState,
      fieldLable: '',
    }));
    const elements = document.getElementsByClassName('field-content');
    for (let i = 0; i < elements.length; i++) {
      elements[i].innerHTML = '';
    }
  };

  const [items, setItems] = useState([
    {
      id: 0,
      jsx: (
        <div className="item-group" key={0}>
          <div className="item-title">
            <p className="text-error">name group</p>
            <input
              className="form-input input-title"
              placeholder="title group checkbox"
            />
            <button
              className="btn btn--red"
              onClick={() => handleRemoveGroup(0)}
            >
              X
            </button>
          </div>
          <div className="item">
            <input
              className="input-checkbox"
              type="text"
              placeholder="name checkbox"
            />
          </div>
          <div className="wrp-button">
            <button
              className="btn btn--small btn--blue"
              onClick={() => handleAddCheckbox(0)}
            >
              Add
            </button>
            <button
              className="btn btn--small btn--black"
              onClick={() => handleMinusCheckbox(0)}
            >
              Minus
            </button>
          </div>
        </div>
      ),
    },
  ]);

  const inputRefs = useRef<
    (HTMLInputElement | null | RefObject<HTMLInputElement>)[]
  >([]);

  const handleRemoveGroup = (id: number) => {
    setItems((prevItems) => {
      if (prevItems.length <= 1) return prevItems;
      const updatedItems = prevItems.filter((item) => item.id !== id);
      return updatedItems;
    });
  };

  const handleAddCheckbox = (id: number) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const itemIndex = updatedItems.findIndex((item) => item.id === id);
      const item = updatedItems[itemIndex];
      const children = React.Children.toArray(item.jsx.props.children);
      const buttonIndex = children.findIndex(
        (child) =>
          React.isValidElement(child) &&
          child.props &&
          child.props.className === 'wrp-button',
      );
      const newItem = (
        <div className="item" key={id + '-checkbox'}>
          <input
            type="text"
            ref={(ref) => {
              if (ref) inputRefs.current[id] = ref;
            }}
            className="input-checkbox"
            placeholder="name checkbox"
          />
        </div>
      );
      children.splice(buttonIndex, 0, newItem);
      const newGroup = React.cloneElement(item.jsx, {}, ...children);
      updatedItems[itemIndex] = { ...item, jsx: newGroup };
      return updatedItems;
    });
  };

  const handleMinusCheckbox = (id: number) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const itemIndex = updatedItems.findIndex((item) => item.id === id);
      const item = updatedItems[itemIndex];
      const children = React.Children.toArray(item.jsx.props.children);
      const itemsCount = children.filter(
        (child) =>
          React.isValidElement(child) && child.props.className === 'item',
      ).length;
      if (itemsCount <= 1) return prevItems;
      const lastIndex = children.findIndex(
        (child) =>
          React.isValidElement(child) && child.props.className === 'item',
      );
      if (lastIndex !== -1) {
        children.splice(lastIndex, 1);
        const newGroup = React.cloneElement(item.jsx, {}, ...children);
        updatedItems[itemIndex] = { ...item, jsx: newGroup };
      }
      return updatedItems;
    });
  };

  const handleAddGroupCheckbox = () => {
    const newId = items.length;
    setItems((prevItems) => [
      ...prevItems,
      {
        id: newId,
        jsx: (
          <div className="item-group" key={newId}>
            <div className="item-title">
              <p className="text-error">name group</p>
              <input
                className="form-input input-title"
                placeholder="title group checkbox"
              />
              <button
                className="btn btn--red"
                onClick={() => handleRemoveGroup(newId)}
              >
                X
              </button>
            </div>
            <div className="item">
              <input
                className="input-checkbox"
                type="text"
                placeholder="name checkbox"
              />
            </div>
            <div className="wrp-button">
              <button
                className="btn btn--small btn--blue"
                onClick={() => handleAddCheckbox(newId)}
              >
                Add
              </button>
              <button
                className="btn btn--small btn--black"
                onClick={() => handleMinusCheckbox(newId)}
              >
                Minus
              </button>
            </div>
          </div>
        ),
      },
    ]);
  };

  const handleSubmit = () => {
    let result: {}[] = [];
    if (inputValues.fieldLable) {
      if (fieldType == 'checkbox_group') {
        let groups = document.getElementsByClassName('item-group');
        let title = document.getElementsByClassName('input-title');

        let checkboxData: Record<string, { title: string; items: string[] }> =
          {};

        for (let i = 0; i < groups.length; i++) {
          let group = groups[i];
          let items = group.getElementsByClassName('input-checkbox');

          let titleInput = title[i] as HTMLInputElement;
          let groupData = {
            title: titleInput.value,
            items: [] as string[],
          };

          for (let j = 0; j < items.length; j++) {
            let item = items[j] as HTMLInputElement;
            groupData.items.push(item.value);
          }

          checkboxData['checkbox_group_' + i] = groupData;
        }
        let dataWithCheckbox = {
          checkbox_group: {
            required: required,
            ...checkboxData,
          },
        };
        console.log(dataWithCheckbox);
        setForms((prevForms) => [...prevForms, dataWithCheckbox]);
        result = [dataWithCheckbox];
      } else {
        setForms((prevForms) => [
          ...prevForms,
          {
            [fieldType]: {
              required: required,
              fieldLable: inputValues.fieldLable,
            },
          },
        ]);
        result = [
          {
            [fieldType]: {
              required: required,
              fieldLable: inputValues.fieldLable,
            },
          },
        ];
      }

      const outerClassName = Object.keys(
        result[0],
      )[0] as keyof (typeof result)[0];
      function buildCheckboxGroup() {
        return (
          <tr>
            <th>
              <p>
                {Object.keys(result[0])[0][1]}{' '}
                <span className="text-error">(* required)</span>
              </p>
            </th>
            <td></td>
          </tr>
        );
      }
      function buildText() {
        return '<div class="text">...</div>';
      }
      function buildNote() {
        return (
          '<tr><th><p>' +
          result[0][outerClassName].fieldLable +
          (result[0][outerClassName].required
            ? '<span class="text-error">(*required)</span>'
            : '') +
          '</p></th><td>' +
          (result[0][outerClassName].required
            ? ''
            : result[0][outerClassName].fi) +
          '</td></tr>'
        );
      }
      function buildDefault() {
        return '';
      }
      function buildInput_text() {}
      function buildCheckbox() {}
      function buildText_area() {}
      function buildInput_date() {}
      function buildDate() {}
      function buildDate_day() {}
      var content = document
        .getElementsByClassName('field-table')[0]
        .getElementsByTagName('tbody')[0];
      switch (outerClassName) {
        case 'note':
          content.innerHTML += buildNote();
          break;
        case 'input_text':
          content.innerHTML += buildInput_text();
          break;
        case 'checkbox':
          content.innerHTML += buildCheckbox();
          break;
        case 'checkbox_group':
          content.innerHTML += buildCheckboxGroup();
          break;
        case 'text_area':
          content.innerHTML += buildText_area();
          break;
        case 'input_date':
          content.innerHTML += buildInput_date();
          break;
        case 'date':
          content.innerHTML += buildDate();
          break;
        case 'date_day':
          content.innerHTML += buildDate_day();
          break;
        default:
          content.innerHTML += buildText();
          break;
      }
      setModalOpen(false);
    } else {
      setErr(1);
    }
  };
  const handleSave = () => {
    console.log(temp);
    // lặp
    // const outerClassNames: string[] = [];
    // temp.forEach((item) => {
    //   Object.keys(item).forEach((outerClassName) => {
    //     outerClassNames.push(outerClassName);
    //   });
    // });
    // console.log('Các giá trị của lớp ngoài cùng:', outerClassNames);

    // không lặp
    // if (temp.length > 0) {
    //   const outerClassName = Object.keys(temp[0])[0];
    //   console.log('Tên lớp ngoài cùng:', outerClassName);
    // } else {
    //   console.log('Mảng temp không có phần tử.');
    // }
  };

  return (
    <div className="field">
      <h2 className="hdg-lv2">
        <span>Add new form:</span>
        <input
          placeholder="form title"
          type="text"
          className="form-input"
          onChange={handleInputChange}
          value={inputValues.formName}
          name="formName"
        />
      </h2>
      <button
        className="btn"
        onClick={(event) => {
          openModal();
        }}
      >
        Add field +
      </button>
      <div className="preview">
        <h2 className="hdg-lv2 mt50">Preview:</h2>
        <div className="preview-content"></div>
        <table className="field-table">
          <tbody></tbody>
        </table>
      </div>
      <div className="wrp-button">
        <button className="btn btn--from btn--gray">下書き保存</button>
        <button className="btn btn--from btn--blue" onClick={handleSave}>
          申請する
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="modal-field">
          <h2 className="hdg-lv2 center">Add new field</h2>
          <label className="right text-required">
            required{' '}
            <input
              type="checkbox"
              checked={required}
              onChange={handleCheckboxChange}
            />
          </label>
          <table className="field-table">
            <tbody>
              <tr>
                <th>
                  <p>
                    Field Label <span className="text-error">(* required)</span>
                  </p>
                </th>
                <td>
                  <input
                    type="text"
                    className={err == 1 ? 'form-input err-input' : 'form-input'}
                    value={inputValues.fieldLable}
                    name="fieldLable"
                    onChange={handleInputChange}
                  />

                  {err == 1 ? (
                    <p className="text-small text-error">
                      * cannot be left blank
                    </p>
                  ) : (
                    <p className="text-small">
                      * This is the name which will appear on the EDIT page
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <th>
                  <p>
                    Field Type <span className="text-error">(* required)</span>
                  </p>
                </th>
                <td>
                  <select className="form-input" onChange={handleFieldType}>
                    <option value="text">text</option>
                    <option value="note">note</option>
                    <option value="input_text">input text</option>
                    <option value="checkbox">checkbox</option>
                    <option value="checkbox_group">checkbox group</option>
                    <option value="radio">radio</option>
                    <option value="radio_group">radio group</option>
                    <option value="text_area">text area</option>
                    <option value="input_date">input date</option>
                    <option value="date">date (form ~ to)</option>
                    <option value="date_day">
                      date (form ~ to) and number days
                    </option>
                  </select>
                  <div className="field-content">
                    {/* {fieldType == 'text' || fieldType == 'note' || fieldType == 'input-text' ? <><input type="text" placeholder='' /></> : ''} */}
                    {fieldType == 'checkbox' ? '' : ''}
                    {fieldType == 'checkbox_group' ? (
                      <>
                        {items.map((item) => (
                          <React.Fragment key={item.id}>
                            {item.jsx}
                          </React.Fragment>
                        ))}
                        <button
                          className="btn item-btn btn--green"
                          onClick={handleAddGroupCheckbox}
                        >
                          Multiple group checkbox
                        </button>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="wrp-button">
            <button className="btn" onClick={handleSubmit}>
              Xác nhận
            </button>
            <button className="btn btn--orange" onClick={closeModal}>
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Field;
