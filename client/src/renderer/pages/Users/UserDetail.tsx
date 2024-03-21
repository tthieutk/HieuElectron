import { useEffect, useState } from 'react';
import { Menberdetails } from '../../components/Menberdetails';
import { useParams } from 'react-router-dom';
import axios from "../../api/axios";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export const UserDetail = () => {
  const axiosPrivate = useAxiosPrivate();
  const {userid} = useParams();
  const [formValue, setFormValue] = useState({id: '', userid: '', realname: '', group_name: '', user_address: '', user_phone: '', user_email: '', user_skype: ''});
  useEffect(() => {
    axiosPrivate.get('users/detail/'+userid).then(response => {
      setFormValue(response.data);
    })
  }, [])
  return <Menberdetails id={formValue.id} userid={formValue.userid} realname={formValue.realname} group_name={formValue.group_name} user_address={formValue.user_address} user_phone={formValue.user_phone} user_email={formValue.user_email} user_skype={formValue.user_skype} />;
};
