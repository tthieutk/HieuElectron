import { useEffect, useRef, useState } from "react";
import DatePicker from 'react-multi-date-picker';


export const PriceBusinessReport = () => {
    const [rows, setRows] = useState([{ id: 0, values: ['', '', '', '', ''] }]);
    const [date, setDate] = useState(new Date());
    const [selectedFileName, setSelectedFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDomestic, setDomestic] = useState(true);
    const [isForeign, setForeign] = useState(false);
    const [totalColumnSum, setTotalColumnSum] = useState<number>(0);

    const [inputValue, setInputValue] = useState<number>(0);
    const [inputDate, setInputDate] = useState<number>(0);
    // const [totalPriceDate, setPriceDate] = useState<number>(0);


    const handleDomesticCheck = () => {
        setDomestic(!isDomestic);
        if (isForeign) setForeign(false); // Deselect early leave if late is selected
    };

    const handleForeignCheck = () => {
        setForeign(!isForeign);
        if (isDomestic) setDomestic(false); // Deselect late if early leave is selected
    };

    // thêm 
    const addRow = () => {
        const newRow = { id: rows.length, values: ['', '', '', '', ''] };
        setRows([...rows, newRow]);
    };
    const handleLeaveDateChange = () => {
        const newRows = [...rows];
        setRows(newRows);
    };
    const handleFileChange = () => {
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0]; // Lấy tệp đầu tiên từ danh sách các tệp được chọn
            setSelectedFileName(file.name); // Lấy tên của tệp và cập nhật vào state
        }
    };
    const handleBtnFile = () => {
        // Kích hoạt sự kiện click trên input file
        const fileInput = fileInputRef.current;
        if (fileInput) {
            fileInput.click();
        }
    };
    const handleClearBtnFile = () => {
        setSelectedFileName(""); // Xóa tên file
    };


    // ham changed and reda
    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
        const inputValue = event.target.value;
        const sanitizedValue = inputValue.replace(/,/g, '');
        const newValue = parseInt(sanitizedValue, 10);
        const newRows = [...rows];
        newRows[rowIndex].values[columnIndex] = isNaN(newValue) ? '' : newValue.toLocaleString();
        setRows(newRows);
    };

    const formatNumberWithCommas = (value: number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const calculateRowSum = (row: { values: string[] }) => {
        return row.values.reduce((acc, curr) => {
            const value = parseInt(curr.replace(/,/g, ''), 10);
            return isNaN(value) ? acc : acc + value;
        }, 0);
    };

    const handleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value.replace(/,/g, ''));
        setInputValue(isNaN(newValue) ? 0 : newValue);

    };
    const handleInputPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue1 = parseFloat(event.target.value.replace(/,/g, ''));
        setInputDate(isNaN(newValue1) ? 0 : newValue1);

    };

    useEffect(() => {
        // Tính tổng của tất cả các cột khi rows thay đổi và cập nhật giá trị của biến state
        const sum = rows.reduce((acc, currRow) => acc + calculateRowSum(currRow), 0);
        setTotalColumnSum(sum);
    }, [rows]);


    // tính tổng
    const calculatedPrice = inputDate * 3000;
    const finalPayment = totalColumnSum - inputValue;

    const finalTotalPrice = finalPayment + calculatedPrice;
    return (
        <>
            <h2 className="hdglv2"><span>出張旅費清算書</span></h2>
            <p className="txt-lead">下記の通り申請致します。</p>

            <table className='tb-from'>
                <tbody>
                    <tr>
                        <th><div className='tb-from--th'>用途<span className='txt-red'>（必須）</span></div></th>
                        <td>
                            <div className='tb-from--td'>
                                <div className='tb-from--checkbox'>
                                    <label><input type="checkbox" name="checkbox" checked={isDomestic} onChange={handleDomesticCheck} /><span></span>遅刻</label>
                                </div>
                                <div className='tb-from--checkbox'>
                                    <label><input type="checkbox" name="checkbox" checked={isForeign} onChange={handleForeignCheck} /><span></span>早退</label>
                                </div>
                                <input type="text" className='tb-from--input' />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th><div className='tb-from--th'>期間<span className='txt-red'>（必須）</span></div></th>
                        <td>
                            <div className='tb-from--td'>
                                <div className='tb-from--times'>
                                    <span> <DatePicker onChange={(_date) => handleLeaveDateChange()} value={date} format="DD-MM" /></span>
                                    <span> <DatePicker onChange={(_date) => handleLeaveDateChange()} value={date} format="DD-MM" /></span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th><div className='tb-from--th'>行先<span className='txt-red'>（必須）</span></div></th>
                        <td>
                            <div className='tb-from--td tb-from--file'>
                                <input type="file" id="fileInput" className='tb-from--fileInput' onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                                <input type="text" id="fileInputText" className='tb-from--input' value={selectedFileName} placeholder="ファイルを選択してください" disabled
                                />
                                <button className="tb-from--button" onClick={handleBtnFile}>ファイル選択</button>
                                <button className="tb-from--button tb-from--button__red" onClick={handleClearBtnFile}>キャンセル</button>
                                <p>※全てのデータをひとつのフォルダにまとめてzipファイルに圧縮してからアップロードしてください。</p>
                            </div>
                        </td>
                    </tr>
                </tbody>

            </table>

            <div className="table tbl_custom">
                <div className='tbl_custom--03'>
                    <table>
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th>項目</th>
                                <th>交通費</th>
                                <th>宿泊費</th>
                                <th>交際費</th>
                                <th>食費</th>
                                <th>その他</th>
                                <th>合計</th>
                                <th>備考</th>

                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td> <DatePicker onChange={(_date) => handleLeaveDateChange()} value={date} format="DD-MM" /> </td>
                                    <td><input type="text" placeholder='入力してください' /></td>
                                    <td><input className="numberInput" type="text" placeholder="税率を入力" value={row.values[0]} onChange={(e) => handleNumberChange(e, index, 0)} /></td>
                                    <td><input className="numberInput" type="text" placeholder="税率を入力" value={row.values[1]} onChange={(e) => handleNumberChange(e, index, 1)} /></td>
                                    <td><input className="numberInput" type="text" placeholder="税率を入力" value={row.values[2]} onChange={(e) => handleNumberChange(e, index, 2)} /></td>
                                    <td><input className="numberInput" type="text" placeholder="税率を入力" value={row.values[3]} onChange={(e) => handleNumberChange(e, index, 3)} /></td>
                                    <td><input className="numberInput" type="text" placeholder="税率を入力" value={row.values[4]} onChange={(e) => handleNumberChange(e, index, 4)} /></td>
                                    <td>{formatNumberWithCommas(calculateRowSum(row))}</td>
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
                                <th>仮払金差引合計</th>
                                <td>{formatNumberWithCommas(finalPayment)}</td>
                            </tr>
                            <tr>
                                <th>仮払金</th>
                                <td><input className='input_noboder numberInput' type="text" placeholder='金額を入力' value={formatNumberWithCommas(inputValue)} onChange={handleInputValueChange} /></td>
                            </tr>
                            <tr>
                                <th>出張手当</th>
                                <td><span>日当 3,000 × </span><input className='input_noboder w100 numberInput' type="text" placeholder='日数を入力' value={inputDate} onChange={handleInputPrice} /><span>日</span><span className="price">{formatNumberWithCommas(calculatedPrice)}</span> </td>
                            </tr>
                            <tr>
                                <th>精算額</th>
                                <td>{formatNumberWithCommas(finalTotalPrice)}</td>
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