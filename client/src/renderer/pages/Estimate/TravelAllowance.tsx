import { useEffect, useRef, useState } from "react";
import DatePicker from 'react-multi-date-picker';

export const TravelAllowance = () => {

    const [isNew, setNew] = useState(true);
    const [isChange, setChange] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isChangePrice, setChangePrice] = useState(false);
    const [isStartNow, setIsStartNow] = useState(false);
    const [isStartDate, setIsStartDate] = useState(false);

    const handleNewCheck = () => {
        setNew(!isNew);
        if (isChange) setChange(false); // Deselect early leave if late is selected
        if (isChangePrice) setChangePrice(false);
    };

    const handleLeaveDateChange = () => {
        const newRows = [...rows];
        setRows(newRows);
    };

    const handleisChangeCheck = () => {
        setChange(!isChange);
        if (isNew) setNew(false); // Deselect early leave if late is selected
        if (isChangePrice) setChangePrice(false);
    }

    const handleChangePriceCheck = () => {
        setChangePrice(!isChangePrice);
        if (isNew) setNew(false); // Deselect early leave if late is selected
        if (isChange) setChange(false);
    }


    const handleStartNowCheck = () => {
        setIsStartNow(!isStartNow)
        if (isStartDate) setIsStartDate(false);
    }
    const handleStartDateCheck = () => {
        setIsStartDate(!isStartDate)
        if (isStartNow) setIsStartNow(false);
    }


    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
        const inputValue = event.target.value;
        const sanitizedValue = inputValue.replace(/,/g, '');
        const newValue = parseInt(sanitizedValue, 10);
        const newRows = [...rows];
        newRows[rowIndex].values[columnIndex] = isNaN(newValue) ? '' : newValue.toLocaleString();
        setRows(newRows);

        // Tính tổng của cột
        const newTotalColumnSum = [...totalColumnSum];
        let sum = 0;
        newRows.forEach((row) => {
            const value = parseInt(row.values[columnIndex].replace(/,/g, ''), 10);
            if (!isNaN(value)) {
                sum += value;
            }
        });
        newTotalColumnSum[columnIndex] = sum;
        setTotalColumnSum(newTotalColumnSum);
    };

    const formatNumberWithCommas = (value: number) => {
        const formattedValue = value.toLocaleString('en-US', { maximumFractionDigits: 20 });
        // Sau đó, thay thế các dấu phẩy bằng dấu phẩy trong chuỗi đã được định dạng
        return formattedValue.replace(/,/g, ",");
    };



    const [rows, setRows] = useState([{ id: 0, values: ['', ''] }]);
    const [totalColumnSum, setTotalColumnSum] = useState([0, 0]);

    const addRow = () => {
        const newRow = { id: rows.length, values: ['', ''] };
        setRows([...rows, newRow]);
    };
    return (
        <>
            <h2 className="hdglv2"><span>通勤手当申請書</span></h2>
            <p className="txt-lead">下記の通り申請致します。</p>

            <table className='tb-from'>
                <tr>
                    <th><div className='tb-from--th'>用途<span className='txt-red'>（必須）</span></div></th>
                    <td>
                        <div className='tb-from--td'>
                            <div className='tb-from--checkbox'>
                                <label><input type="checkbox" name="checkbox" checked={isNew} onChange={handleNewCheck} /><span></span>遅刻</label>
                            </div>
                            <div className='tb-from--checkbox'>
                                <label><input type="checkbox" name="checkbox" checked={isChange} onChange={handleisChangeCheck} /><span></span>早退</label>
                            </div>
                            <div className='tb-from--checkbox'>
                                <label><input type="checkbox" name="checkbox" checked={isChangePrice} onChange={handleChangePriceCheck} /><span></span>時間外勤務</label>
                            </div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <th><div className='tb-from--th'>行先<span className='txt-red'>（必須）</span></div></th>
                    <td>
                        <div className='tb-from--td'>
                            <input type="text" className='tb-from--input' />
                        </div>
                    </td>
                </tr>
                <tr>
                    <th><div className='tb-from--th'>行先<span className='txt-red'>（必須）</span></div></th>
                    <td>
                        <div className='tb-from--td'>
                            <input type="text" className='tb-from--input' />
                        </div>
                    </td>
                </tr>
                <tr> <th>  <div className="tb-from--th">適用開始年月日<span className="txt-red">（必須）</span>  </div> </th>
                    <td>
                        <div className="tb-from--td">
                            <div className="tb-from--checkbox">
                                <label>
                                    <input type="checkbox" name="checkbox" checked={isStartNow} onChange={handleStartNowCheck} />
                                    <span></span>入社日から適用
                                </label>
                            </div>
                            <div className="tb-from--checkbox">
                                <label>
                                    <input type="checkbox" name="checkbox" checked={isStartDate} onChange={handleStartDateCheck} />
                                    <span></span>
                                    <DatePicker className="tb-from--checkbox__date" onChange={(_date) => handleLeaveDateChange()} value={date} format="DD-MM" />
                                    <p>から適用</p>

                                </label>

                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th><div className='tb-from--th'>行先<span className='txt-red'>（必須）</span></div></th>
                    <td>【時給制の場合】普通運賃の勤務日数分を支給　　【月給制の場合】1ヵ月分の定期券代金を支給</td>
                </tr>
            </table>
            <div className="table ">
                <div className='tbl_custom--03 boder-input'>
                    <table>
                        <thead>
                            <tr>
                                <th>鉄道名</th>
                                <th>路線名</th>
                                <th className='w500'>利用区間</th>
                                <th>1ヵ月の定期代 <br />(普通運賃往復の場合)</th>
                                <th>備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr>
                                    <td><input type="text" /></td>
                                    <td><input type="text" /></td>
                                    <td> <p className='grid-row grid--flex'> <input className='width_auto' type="text" /> ↔ <input className='width_auto' type="text" /></p></td>
                                    <td>
                                        <input className="numberInput" type="text" placeholder="税率を入力" value={row.values[0]} onChange={(e) => handleNumberChange(e, index, 0)} />
                                        <input className="numberInput" type="text" placeholder="税率を入力" value={row.values[1]} onChange={(e) => handleNumberChange(e, index, 1)} />
                                    </td>
                                    <td><input className="input_noboder" placeholder="入力してください" type="text" /></td>
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
                                <th className='rowspan' rowSpan={2}>合計</th>
                                <td>{formatNumberWithCommas(totalColumnSum[0])}</td>
                            </tr>
                            <tr>
                                <td>{formatNumberWithCommas(totalColumnSum[1])}</td>
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