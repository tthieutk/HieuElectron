

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-multi-date-picker';


export const TravelExpenses = () => {
    const [date, setDate] = useState(new Date());
    const [number, setNumber] = useState('');
    const [rows, setRows] = useState([{ id: 0, number: '' }]);
    const [total, setTotal] = useState(0);

    const handleLeaveDateChange = () => {
        const newRows = [...rows];
        setRows(newRows);
    };
    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const inputValue = event.target.value;
        const sanitizedValue = inputValue.replace(/,/g, '');
        const newValue = parseInt(sanitizedValue, 10);
        const newRows = [...rows];
        newRows[index].number = isNaN(newValue) ? '' : newValue.toLocaleString();
        setRows(newRows);
    };

    // thêm 
    const addRow = () => {
        const newRow = { id: rows.length, number: '' };
        setRows([...rows, newRow]);
    };


    useEffect(() => {
        calculateTotal();
    }, [rows]);

    const calculateTotal = () => {
        let total = 0;
        rows.forEach(row => {
            const number = parseInt(row.number.replace(/,/g, ''), 10);
            if (!isNaN(number)) {
                total += number;
            }
        });
        setTotal(total);
    };

    return (
        <>
            <h2 className="hdglv2"><span>交通費清算書</span></h2>
            <p className="txt-lead">下記の通り申請致します。</p>

            <div className="table tbl_custom">
                <div className='tbl_custom--03'>
                    <table>
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th>路線</th>
                                <th>乗車駅</th>
                                <th>下車駅</th>
                                <th>金額</th>
                                <th>食費</th>
                                <th>備考</th>

                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td> <DatePicker onChange={(_date) => handleLeaveDateChange()} value={date} format="DD-MM" />
                                    </td>
                                    <td><input type="text" placeholder='入力してください' /></td>
                                    <td><input type="text" placeholder='入力してください' /></td>
                                    <td><input type="text" placeholder='入力してください' /></td>
                                    <td><input type="text" placeholder='入力してください' /></td>
                                    <td><input className="numberInput" type="text" value={row.number} onChange={(e) => handleNumberChange(e, index)} /></td>
                                    <td><input type="text" placeholder='入力してください' /></td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                    <p onClick={addRow} className='plus-row'> 行を追加する</p>
                </div>

                <div className='tbl_custom--04 tbl_width tbl_right'>
                    <table>
                        <tbody>
                            <tr>
                                <th>合計金額</th>
                                <td>{total.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='box-router'>
                <div className='box-router__title'>承認ルート</div>
                <div className='grid-row box-router__grid'>
                    <div className='box-router__name'>
                        <p>承認者: </p> <p>齋藤社長</p>
                    </div>
                    <div className='box-router__name'>
                        <p>共有者: </p> <p>総務</p>
                    </div>

                </div>
                <div className='box-router__edit'>
                    <p className='plus-row box-router__edit--content'>承認ルートを編集</p>
                </div>
            </div>
            <div className="wrp-button"><button className="btn btn--from btn--gray">下書き保存</button><button className="btn btn--from btn--blue">申請する</button></div>
        </>
    )

};