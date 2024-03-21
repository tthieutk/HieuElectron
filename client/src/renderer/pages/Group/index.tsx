import { useEffect, useState } from 'react';
import { CTable } from '../../components/Table/CTable';
import { CTableHead } from '../../components/Table/CTableHead';
import CTableBody from '../../components/Table/CTableBody';
import { Heading2 } from '../../components/Heading';
import Modal from '../../components/Modal/Modal';
import Modaldelete from '../../components/Modal/Modaldelete';
import { isValidGroupEdit, isValidGroup } from "../../components/Validate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

interface GroupProps {
  id: string;
  groupName: string;
  update: React.ReactNode;
  delete: React.ReactNode;
}
export const Group = () => {
  const axiosPrivate = useAxiosPrivate();
  type FieldGroups = {
    id: string;
    group_name: string;
    update: React.ReactNode;
    delete: React.ReactNode;
  };
  type FieldUsers = {
    id: number,
    realname: string,
    group_name: string,
    user_email: string,
    user_skype: string,
    user_phone: string,
  };
  const [listOfGroups, setListOfGroups] = useState<FieldGroups[] | []>([]);
  const [isTableUpdated, setIsTableUpdated] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [modalGroupName, setModalGroupName] = useState('');
  const [modalGroupNameid, setModalGroupNameId] = useState('');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteModalid, setDeleteModalId] = useState('');
  const [checkGroup, setCheckGroup] = useState(false);

  useEffect(() => {
    axiosPrivate.get('groups/').then((response) => {
      setListOfGroups(response.data);
      setIsTableUpdated(false); //đặt lại trạng thái khi dữ liệu thay đổi
    });
  }, [isTableUpdated]); // khi state thay đổi useEffect sẽ chạy lại

  let dynamicUpdate = ({ id, groupName, }: { id: string; groupName: string; }) => (
    <>
      <button onClick={() => openModal(groupName, id)}>
        <p className="icon icon--check">
          <img src={require('../../../../assets/icnedit.png')} alt="edit" className="fluid-image" />
        </p>
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {
          <>
            <Heading2 text="Sửa Nhóm" />
            <div className="form-user form">
              <div className="form-content">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Sửa tên nhóm
                        <img src={require('../../../../assets/icn-group.png')} alt="" className="fluid-image" />
                      </label>
                      <input
                        value={modalGroupName}
                        onChange={(e) => setModalGroupName(e.target.value)}
                        className="form-input"
                        type="text"
                        placeholder="Nhập Tên nhóm"
                      />
                    </div>
                    <div className="wrp-button">
                      <button className="btn btn--green" onClick={(event) => handleUpdate(modalGroupNameid, modalGroupName, event)}>Xác nhận</button>
                      <button className="btn btn--orange" onClick={closeModal}>Hủy</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </Modal>
    </>
  );

  const openModal = (initialGroupName: string, initialGroupNameId: string) => {
    setModalGroupName(initialGroupName);
    setModalGroupNameId(initialGroupNameId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDelete = async (groupId: string, event: any) => {
    if (event) {
      event.preventDefault();
      try {
        const payload = { id: groupId };
        let response = await axiosPrivate.delete('groups/delete/', { headers: { 'Content-Type': 'application/json', }, data: payload, });
        toast.success('Xoá Nhóm Thành Công !');
        closeModaldelete();
        setIsTableUpdated(true); //Khi thêm nhóm mới ,cập nhật state mới
      } catch (error) {
        toast.error("Lỗi khi cập nhật trạng thái hàm xoá");
        //  console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    }
  };

  const handleUpdate = async (id: string, group_name: string, event: any) => {
    const validationErrors = isValidGroupEdit({ group_name });
    if (event) {
      event.preventDefault();
      if (validationErrors === true) {
        const isGroupExist = listOfGroups.some((group) => group.group_name.toLowerCase() === group_name.toLowerCase());
        if (isGroupExist !== true) {
          try {
            const dataUpdate = { id, group_name };
            const response = await axiosPrivate.put('groups/update/', dataUpdate, { headers: { 'Content-Type': 'application/json' } });
            toast.success('Cập Nhật Tên Nhóm: ' + group_name + ' Thành công');
            closeModal();
            setIsTableUpdated(true); //Khi thêm nhóm mới ,cập nhật state mới
          } catch (error) { toast.error('Lỗi Cập Nhật Hàm Update'); }
        } else {
          toast.error("Nhóm " + group_name + " đã tồn tại trong bảng !");
        }
      }
    }
  };

  let dynamicDelete = (id: string) => (
    <>
      <button onClick={(event) => { openModaldelete(id); }}>
        <p className="icon icon--check">
          <img src={require('../../../../assets/icndelete.png')} alt="edit" className="fluid-image" />
        </p>
      </button>
    </>
  );

  const openModaldelete = async (groupid: string) => {
    const res = await axiosPrivate.get("users/groups/" + groupid);
    if (res.data.length > 0) {
      setCheckGroup(true)
    }
    else {
      setCheckGroup(false);
    }
    setDeleteModalId(groupid);
    setDeleteModalOpen(true);
  };
  const closeModaldelete = () => {
    setDeleteModalOpen(false);
  };

  let DataTable: FieldGroups[] = [];
  for (let i = 0; i < listOfGroups.length; i++) {

    DataTable.push({
      id: (i + 1).toString(),
      group_name: `${listOfGroups[i].group_name}`,
      update: dynamicUpdate({
        id: listOfGroups[i].id,
        groupName: listOfGroups[i].group_name,
      }),
      delete: dynamicDelete(listOfGroups[i].id),
    });
  }
  const handleSubmint = async () => {
    const group_name = groupName;
    const validationErrors = isValidGroup({ group_name });
    if (validationErrors === true) {
      const isGroupExist = listOfGroups.some((group) => group.group_name.toLowerCase() === group_name.toLowerCase());
      if (isGroupExist !== true) {
        try {
          const group_data = {
            group_name: groupName,
            add_level: 1,
            owner: 'admin',
          };
          setGroupName('');
          const res = await axiosPrivate.post("groups/add/", group_data);
          toast.success('Thêm Nhóm ' + group_name + ' Thành công');
          setIsTableUpdated(true); //Khi thêm nhóm mới ,cập nhật state mới
        }
        catch (error) { toast.error('Lỗi khi thêm Nhóm'); }
      }
      else {
        toast.error("Nhóm " + groupName + " đã tồn tại trong bảng !");
      }
    }
  };

  return (
    <>
      <Heading2 text="Quản lý nhóm" />
      <div className="form-group form-addgroup">
        <label>Tên Nhóm:</label>
        <img src={require('../../../../assets/icn-group.png')} alt="" className="fluid-image form-addgroup__image" />
        <input value={groupName} onChange={(event) => setGroupName(event.target.value)} className="form-input" type="text" placeholder="Tên nhóm muốn thêm" />
        <button className="btn" onClick={handleSubmint}>Thêm</button>
      </div>
      <CTable>
        <CTableHead heads={['STT', 'Tên Nhóm', 'Sửa', 'Xóa']} />
        <CTableBody data={DataTable} path_edit="/group/edit" path_timecard="" />
      </CTable>
      <Modaldelete isOpen={isDeleteModalOpen} onRequestClose={closeModaldelete}>
        {checkGroup ? <h2>Bạn không thể xóa vì nhóm có thành viên đang hoạt động</h2> : <h2>Bạn có chắc chắn muốn xóa không?</h2>}
        <div className='wrp-button'>
          {!checkGroup ? <button className='btn btn--green' onClick={(event) => handleDelete(isDeleteModalid, event)}>Đồng ý</button> : ''
          }
          <button className='btn btn--orange' onClick={closeModaldelete}>Quay lại</button>
        </div>
      </Modaldelete>
    </>
  );
};
