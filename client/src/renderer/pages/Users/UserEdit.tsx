import { useEffect, useState } from "react";
import { Heading2 } from "../../components/Heading";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { isValidUserEdit } from "../../components/Validate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function UserEdit() {
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const {id} = useParams();
  const [formValue, setFormValue] = useState({
    userid: '',
    password: '',
    realname: '',
    authority: '',
  });
  const [apiData, setApiData] = useState({
    realname: '',
  });
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [selectedValue, setSelectedValue] = useState({
    user_group: '',
  });
  const [apiDataSelect, setApiDataSelect] = useState({
    user_group: '',
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [message, setMessage] = useState('');

  /*
   * GET DATA USER BY ID
  */
  const fetchUsersById = async function () {
    const res = await axiosPrivate.get('users/edit/' + id);
    setFormValue(res.data);
    setApiData(res.data);
    setApiDataSelect(res.data);
    setSelectedValue({...selectedValue, user_group: res.data.user_group})
  };

  useEffect(() => {
    fetchUsersById();
  }, []);

  /*
   * HANDLE INPUT
  */
  const handleInput = (event:any) => {
		setFormValue({...formValue, [event.target.name]:event.target.value})
    const newValue = event.target.value;
    const isInputDifferentFromApi = apiData.realname !== newValue;
    (isInputDifferentFromApi === true) ? setIsDisabled(false) : setIsDisabled(true);
	}

  /*
   * HANDLE SELECT CHANGE
  */
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue({ ...selectedValue, [event.target.name]: event.target.value });
    const { name, value } = event.target;
    switch (name) {
      case "user_group":
        (apiDataSelect.user_group === value) ? setIsDisabled(true) :  setIsDisabled(false);
        break;
      default:
        setIsDisabled(false)
        break;
    }
  }

  /*
   * HANDLE BUTTON CANCEL
  */
  const handleCancel = () => {
    navigate('/users/detail/'+formValue.userid);
  };

  /*
   * HANDLE BUTTON SUBMIT
  */
  const handleSubmit = async(e: { preventDefault: () => void; }) => {
		e.preventDefault();
    const validationErrors = isValidUserEdit({ ...formValue }, {...selectedValue}, passwordNew, passwordConfirm);
    if (validationErrors === true) {
      const formData = {
        id: id,
        userid:formValue.userid,
        password:formValue.password,
        passwordNew:passwordNew,
        realname:formValue.realname,
        authority:formValue.authority,
        user_group:selectedValue.user_group
      }

      const res = await axiosPrivate.post("users/update", formData);
      const res2 = await axiosPrivate.get("users/detail/"+formValue.userid);

      if(res.data.success){
        setMessage(res.data.success);
        setTimeout(() => {
          const isLoggedIn = localStorage.getItem('login');
          const roles = res2.data.authority_name;
          const users = {
            "id": res2.data.id,
            "userid": res2.data.userid,
            "realname": res2.data.realname,
            "roles": res2.data.authority_name,
            "user_group": res2.data.group_name,
            "user_group_id": res2.data.user_group,
          }
          localStorage.setItem('users', JSON.stringify(users));
          setAuth({ isLoggedIn, roles, users });
          navigate('/users/detail/'+formValue.userid);
        }, 2000);
      }
    }
	}

  /*
  * GET DATA FROM AUTHORITY TABLE
  */
	type FieldAuthority = {
		id: string,
		authority_name: string,
	}
	const [listOfAuthority, setListOfAuthority] = useState<FieldAuthority[] | []>([]);

	useEffect(() => {
		axiosPrivate.get('authority/').then((response) => {
			setListOfAuthority(response.data);
		}).catch(error => console.error('Lỗi khi lấy dữ liệu:', error))
	}, [])

	let DataAuthority: FieldAuthority[] = [];
	for (let i = 0; i < listOfAuthority.length; i++) {
		DataAuthority.push({
			id: `${listOfAuthority[i].id}`,
			authority_name: `${listOfAuthority[i].authority_name}`
		});
	}

  /*
  * GET DATA FROM GROUPS TABLE
  */
	type FieldGroups = {
		id: string,
		group_name: string,
	}
	const [listOfGroups, setListOfGroups] = useState<FieldGroups[] | []>([]);

	useEffect(() => {
		axiosPrivate.get('groups/').then((response) => {
			setListOfGroups(response.data);
		}).catch(error => console.error('Lỗi khi lấy dữ liệu:', error))
	}, [])

	let DataGroups: FieldGroups[] = [];
	for (let i = 0; i < listOfGroups.length; i++) {
		DataGroups.push({
			id: `${listOfGroups[i].id}`,
			group_name: `${listOfGroups[i].group_name}`
		});
	}

	return (
		<>
			<Heading2 text="Sửa thành viên" />
			{message=='' ? '' : <div className="box-bg"><p className="bg bg-green">{message}</p></div>}
			<div className="form-user form">
				<div className="form-content">
					<div className="row">
						<div className="col-6">
              <div className="form-group">
                <label>
                  ID User *
                  <img
                    src={require('../../../../assets/icn-id.png')}
                    alt=""
                    className="fluid-image"
                  />
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="userid"
                  value={formValue.userid} readOnly
                />
              </div>
              <div className="form-group">
                <label>
                  Họ và tên *
                  <img
                    src={require('../../../../assets/icon-user.jpg')}
                    alt=""
                    className="fluid-image"
                  />
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="realname"
                  value={formValue.realname} onChange={handleInput}
                />
              </div>
              <div className="form-group">
                <label>
                  Nhóm *
                  <img
                    src={require('../../../../assets/icn-group.png')}
                    alt=""
                    className="fluid-image"
                  />
                </label>
                <div className="select__box group">
                  <select value={selectedValue.user_group} name="user_group" onChange={handleChange}>
                    <option value="-1">--------------------------- Chọn nhóm ---------------------------</option>
                    {DataGroups.map((value, index) => (
                      <option value={value.id} key={index}>{value.group_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <h3 className="hdglv3 left">Thay đổi mật khẩu</h3>
              <div className="form-group">
                <label>
                  Mật khẩu hiện tại
                  <img
                    src={require('../../../../assets/icon-password.jpg')}
                    alt=""
                    className="fluid-image"
                  />
                </label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  value={formValue.password}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>
                  Mật khẩu mới
                  <img
                    src={require('../../../../assets/icon-password.jpg')}
                    alt=""
                    className="fluid-image"
                  />
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="passwordNew"
                  id="passwordNew"
                  value={passwordNew}
                  onChange={(event) => setPasswordNew(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>
                  Mật khẩu (Xác nhận) *
                  <img
                    src={require('../../../../assets/icon-password.jpg')}
                    alt=""
                    className="fluid-image"
                  />
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="password_confirm"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
              <div className="wrp-button">
                <button className="btn btn--green" type="submit" onClick={handleSubmit} disabled={isDisabled}>Xác nhận</button>
                <button className="btn btn--orange" onClick={handleCancel}>Hủy</button>
              </div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
};
