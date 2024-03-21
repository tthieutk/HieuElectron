import { useEffect, useState } from "react";
import { Heading2 } from "../../components/Heading";
import { useNavigate } from "react-router-dom";
import { isValidUser } from "../../components/Validate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function MemberAdd() {
  const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

	const [formValue, setFormValue] = useState({ userid: '', password: '', password_confirm: '', realname: '', authority: '', user_group: '' })
	const [message, setMessage] = useState('');

  type FieldUsers = {
    userid: string,
  }
  const [listOfUsers, setListOfUsers] = useState<FieldUsers[] | []>([]);
  let DataUsers: FieldUsers[] = [];
	for (let i = 0; i < listOfUsers.length; i++) {
		DataUsers.push({
			userid: `${listOfUsers[i].userid}`
		});
	}

	const handleInput = (e) => {
		setFormValue({ ...formValue, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
    let oldUserid = "";
    DataUsers.map((data, index) => {
      if(data.userid === formValue.userid){
        oldUserid = data.userid;
        return oldUserid;
      }
    })

		const validationErrors = isValidUser({ ...formValue }, oldUserid);
		e.preventDefault();
		if (validationErrors === true) {
			const formData = { userid: formValue.userid, password: formValue.password, realname: formValue.realname, authority: formValue.authority, user_group: formValue.user_group }
			const res = await axiosPrivate.post("users/add", formData);
			if (res.data.success) {
				setMessage(res.data.success);
				setTimeout(() => {
					navigate('/members');
				}, 2000);
			}
		}
	}

	const handleBack = () => {
		navigate('/members');
	}

	/*
	*
	* GET DATA FROM AUTHORITY TABLE
	*
	*/
	type FieldAuthority = {
		id: string,
		authority_name: string,
	}
	const [listOfAuthority, setListOfAuthority] = useState<FieldAuthority[] | []>([]);

	useEffect(() => {
		axiosPrivate.get('authority').then((response) => {
			setListOfAuthority(response.data);
		})
    axiosPrivate.get('users').then((response) => {
			setListOfUsers(response.data);
		})
    .catch(error => console.error('Lỗi khi lấy dữ liệu:', error))
	}, [])

	let DataAuthority: FieldAuthority[] = [];
	for (let i = 0; i < listOfAuthority.length; i++) {
		DataAuthority.push({
			id: `${listOfAuthority[i].id}`,
			authority_name: `${listOfAuthority[i].authority_name}`
		});
	}

	/*
	*
	* GET DATA FROM GROUPS TABLE
	*
	*/
	type FieldGroups = {
		id: string,
		group_name: string,
	}
	const [listOfGroups, setListOfGroups] = useState<FieldGroups[] | []>([]);

	useEffect(() => {
		axiosPrivate.get('groups').then((response) => {
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
			<Heading2 text="Thêm thành viên" />
			{message == '' ? '' : <div className="box-bg"><p className="bg bg-green">{message}</p></div>}
			<div className="form-user form">
				<div className="form-content">
					<div className="row">
						<div className="col-6">
							<form onSubmit={handleSubmit} method="POST">
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
										value={formValue.userid} onChange={handleInput}
									/>
								</div>
								<div className="form-group">
									<label>
										Mật khẩu *
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
										value={formValue.password} onChange={handleInput}
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
										type="password"
										name="password_confirm"
										value={formValue.password_confirm} onChange={handleInput} placeholder="Nhập lại mật khẩu"
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
										<select name="user_group" value={formValue.user_group} onChange={handleInput}>
											<option value="-1">----------------------- Chọn nhóm -----------------------</option>
											{DataGroups.map((value, index) => (
												<option value={value.id} key={index}>{value.group_name}</option>
											))}
										</select>
									</div>
								</div>
								<div className="form-group">
									<label>
										Quyền truy cập *
										<img
											src={require('../../../../assets/authorization.png')}
											alt=""
											className="fluid-image"
										/>
									</label>
									<div className="select__box group">
										<select name="authority" value={formValue.authority} onChange={handleInput}>
											<option value="-1">---------------- Chọn quyền truy cập ----------------</option>
											{DataAuthority.map((value, index) => (
												<option value={value.id} key={index}>{value.authority_name}</option>
											))}
										</select>
									</div>
								</div>
								<div className="wrp-button">
									<button className="btn btn--green" type="submit">Xác nhận</button>
									<button className="btn btn--orange" onClick={handleBack}>Hủy</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
};

export default MemberAdd;
