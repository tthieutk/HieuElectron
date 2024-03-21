import { Heading2 } from "../../components/Heading";
import { InputQuantity } from "../../components/InputQuantity";
import { Search } from "../../components/Search";
import { CTable } from "../../components/Table/CTable";
import { CTableHead } from "../../components/Table/CTableHead";
import { useEffect, useState } from "react";
import ButtonAdd from "../../components/Button/ButtonAdd";
import ButtonEdit from "../../components/Button/ButtonEdit";
import ButtonDelete from "../../components/Button/ButtonDelete";
import Modaldelete from "../../components/Modal/Modaldelete";
import { Pagination } from "../../components/Pagination";
import { NavLink } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function Members() {
  const axiosPrivate = useAxiosPrivate();
  const [isTableUpdated, setIsTableUpdated] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /*
  * LẤY DANH SÁCH THÀNH VIÊN
  */
  type FieldUsers = {
    id: number,
    realname: string,
    group_name: string,
    authority_name: string,
    userid: string,
  }
  const [listOfUsers, setListOfUsers] = useState<FieldUsers[] | []>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('users');
        setListOfUsers(response.data);
        setIsTableUpdated(false);
        response.data.length ? setEmpty(false) : setEmpty(true);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      }
    }
    getUsers();
  }, [isTableUpdated])

  /*
  * LẤY TẤT CẢ NHÓM
  */
  const [listOfGroups, setListOfGroups] = useState<FieldGroups[] | []>([]);
  type FieldGroups = {
    id: string,
    group_name: string,
  }
  useEffect(() => {
    axiosPrivate.get('groups').then((response) => {
      setListOfGroups(response.data);
      setIsTableUpdated(false);
    }).catch(error => console.error('Lỗi khi lấy dữ liệu:', error))
  }, [isTableUpdated])

  /*
  * LẤY DANH SÁCH USER THEO NHÓM
  */
  const [selectedGroup, setSelectedGroup] = useState('');
  const fetchMembersByGroup = async ($groupid: string) => {
    const groupid = { groupid: $groupid };
    const res = await axiosPrivate.get("users/groups/" + $groupid);
    setListOfUsers(res.data);
  };
  useEffect(() => {
    if (selectedGroup) {
      fetchMembersByGroup(selectedGroup);
      setIsTableUpdated(false);

    }

    setCurrentPage(1);
  }, [selectedGroup, isTableUpdated]);

  /*
  * XÓA USER
  */
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalid, setDeleteModalId] = useState(0);
  const handleDelete = async ($id: number) => {
    const formData = { id: $id }
    const res = await axiosPrivate.post("users/delete", formData);
    setIsTableUpdated(true);
    closeModal();
  }

  const openModal = ($id: number) => {
    setModalOpen(true);
    setDeleteModalId($id)
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  let DataTable: FieldUsers[] = [];
  const [currentPage, setCurrentPage] = useState(1);

  // Tính tổng số trang
  const totalPages = Math.ceil(listOfUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = listOfUsers.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);

  };

  return (
    <>
      <Heading2 text="Thông tin thành viên" />
      <div className="box-group box-group--second">
        <div className="box-group__item">
          <div className="select__box group">
            <div className="select__box--title">
              <p>Nhóm:</p>
            </div>
            <div className="select__box--flex grid-row select-dropdown">
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="-1">Tất cả</option>
                {listOfGroups.map((value, index) => (
                  <option value={value.id} key={index}>{value.group_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="box-group__item">
          <InputQuantity total={listOfUsers.length} onItemsPerPageChange={handleItemsPerPageChange} />
        </div>
        {/* <div className="box-group__item">
          <Search />
        </div> */}
      </div>
      <ButtonAdd path_add="/members/add" />
      {(empty === true) ? <div className="box-bg --full mt30 mb20"><p className="bg bg-red">Không có thành viên nào để hiển thị</p></div> : ''}
      <CTable>
        <CTableHead heads={["Họ và tên", "Nhóm", "Quyền truy cập", "Hành động"]} />
        <tbody>
          {displayedUsers.length > 0 ? (
            displayedUsers.map((data, index) => (
              <tr key={index}>
                <td>
                  <NavLink to={"/users/detail/" + data.userid} className="acount__name">
                    {data.realname}
                  </NavLink>
                </td>
                <td>{data.group_name}</td>
                <td>{data.authority_name}</td>
                <td>
                  <ButtonEdit href={"/members/edit/" + data.id} />
                  {(data.userid === "admin") ? '' : <ButtonDelete onButtonClick={() => openModal(data.id)} />}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </CTable>

      {(totalPages !== 1) ? <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} /> : ''}


      <Modaldelete isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>Bạn có chắc chắn muốn xóa không?</h2>
        <div className='wrp-button'>
          <button className='btn btn--green' onClick={() => handleDelete(isDeleteModalid)}>Đồng ý</button>
          <button className='btn btn--orange' onClick={closeModal}>Hủy</button>
        </div>
      </Modaldelete>
    </>
  )
};

export default Members;
