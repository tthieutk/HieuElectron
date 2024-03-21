import { useEffect, useState } from "react";
import DatePicker from 'react-multi-date-picker';

export const ExpenseReport = () => {
    const [date, setDate] = useState(new Date());
    const [rows, setRows] = useState([{ id: 0, values: ['', ''] }]);
    const [total, setTotal] = useState(0);
    const [priceNotTax, setPriceNotTax] = useState(0);
    const [priceTax, setPriceTax] = useState(0);

    const handleLeaveDateChange = () => {
        const newRows = [...rows];
        setRows(newRows);
    };
    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
        const inputValue = event.target.value;
        const sanitizedValue = inputValue.replace(/,/g, '');
        const newValue = parseInt(sanitizedValue, 10);
        const newRows = [...rows];
        newRows[rowIndex].values[columnIndex] = isNaN(newValue) ? '' : newValue.toLocaleString();
        setRows(newRows);
    };

    // thêm 
    const addRow = () => {
        const newRow = { id: rows.length, values: ['', ''] };
        setRows([...rows, newRow]);
    };


    useEffect(() => {
        calculateTotal();
    }, [rows]);

    let calculateTotal = () => {
        let total = 0;
        let subtotalNotTax = 0;
        let subtotalTax = 0;
        rows.forEach(row => {
            const notTax = parseInt(row.values[0].replace(/,/g, ''), 10);
            const tax = parseInt(row.values[1].replace(/,/g, ''), 10);

            subtotalNotTax += isNaN(notTax) ? 0 : notTax;
            subtotalTax += isNaN(tax) ? 0 : tax;
        });
        total = subtotalNotTax + subtotalTax;
        setTotal(total);
        calculatePriceNotTax();
        calculatePriceTax();
    };

    let calculatePriceTax = () => {
        let subtotal = 0;
        rows.forEach(row => {
            const number = parseInt(row.values[1].replace(/,/g, ''), 10);
            if (!isNaN(number)) {
                subtotal += number;
            }
        });
        setPriceTax(subtotal);
    }

    let calculatePriceNotTax = () => {
        let subtotal = 0;
        rows.forEach(row => {
            const number = parseInt(row.values[0].replace(/,/g, ''), 10);
            if (!isNaN(number)) {
                subtotal += number;
            }
        });
        setPriceNotTax(subtotal);
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
                                <th>支払先</th>
                                <th>金額（税抜）</th>
                                <th>消費税</th>
                                <th>軽減税率</th>
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
                                    <td><input className="numberInput" type="text" placeholder="税率を入力" value={row.values[0]} onChange={(e) => handleNumberChange(e, index, 0)} /></td>
                                    <td><input className="numberInput" type="text" placeholder="消費税額を入力" value={row.values[1]} onChange={(e) => handleNumberChange(e, index, 1)} /></td>
                                    <td className='tdCheckbox'>	<input type="checkbox" id={`checkbox-${index}`} />  <label htmlFor={`checkbox-${index}`}></label></td>
                                    <td><input type="text" placeholder='入力してください' /></td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                    <p onClick={addRow} className='plus-row'> 行を追加する</p>
                </div>


                <div className='tbl_custom--04 table_custom'>
                    <table>
                        <tbody>
                            <tr>
                                <th className='rowspan'>小計</th>
                                <td>{priceNotTax.toLocaleString()}</td>
                                <td>{priceTax.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th className='rowspan'>合計（税込）</th>
                                <td colSpan={2}>{total.toLocaleString()}</td>

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

}