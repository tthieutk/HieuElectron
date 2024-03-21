import './MenuDropdown.scss'
import { useEffect, useState } from 'react';

const MenuDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return(
        <div className='box-menu'>
            <button className="box-menu__dropdown" onClick={toggleDropdown}>[...]</button>
            {isDropdownOpen && (
            <ul className='list-menu'>
                <li className='list-menu__item'><a href="#">Sửa giờ</a></li>
                <li className='list-menu__item'><a href="#">Ghi chú</a></li>
                <li className='list-menu__item'><a href="#">Thông tin chi tiết</a></li>
                <li className='list-menu__item'><a href="#">Xác nhận nghỉ phép</a></li>
                <li className='list-menu__item'><a href="#">Hủy nghỉ phép</a></li>
            </ul>
            )}
        </div>
    )
}
export default MenuDropdown;