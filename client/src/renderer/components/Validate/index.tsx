import { toast } from "react-toastify";

const ERROR: {[key: string]: any} = {
  require: "Vui lòng nhập ",
  choose: "Vui lòng chọn ",
  illegal: "Giá trị nhập vào không hợp lệ",
  indispensable:"Tên nhóm là bắt buộc",
  obligatory:"Tên ngày lễ là bắt buộc"
};

function validateEmail(email: string) {
  email = (email==null)? "":email;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isZenSpace(str: string){
  str = (str==null)? "":str;
  if(str.match(/^\s+/)){
    return true;
  }else{
    return false;
  }
}

const useridName = "ID User";
const passwordName = "Mật khẩu";
const passwordConfirmName = "Mật khẩu (Xác nhận)";
const realnameName = "Họ và tên";
const userGroupName = "Nhóm";
const authorityName = "Quyền truy cập";

type paraUser = {
  olduserid: string,
  userid: string,
  password: string,
  password_confirm: string,
  passwordNew: string,
  realname: string,
  authority: string,
  user_group: string,
}

export const isValidUser = ({...paraUser}, olduserid: string) => {
  if(!paraUser.userid) {
    toast.error(ERROR['require'] + useridName + "!");
    return false;
  } else if(isZenSpace(paraUser.userid)) {
    toast.error("Giá trị nhập vào "+ useridName +" không hợp lệ.");
    return false;
  }

  if(olduserid) {
    toast.error(useridName + " đã tồn tại!");
    return false;
  }

  if(!paraUser.userid) {
    toast.error(ERROR['require'] + useridName + "!");
    return false;
  } else if(isZenSpace(paraUser.userid)) {
    toast.error("Giá trị nhập vào "+ useridName +" không hợp lệ.");
    return false;
  }

  if(!paraUser.password) {
    toast.error(ERROR['require'] + passwordName + "!");
    return false;
  } else if(isZenSpace(paraUser.password)) {
    toast.error("Giá trị nhập vào "+ passwordName +" không hợp lệ.");
    return false;
  }

  if(paraUser.password_confirm != paraUser.password) {
    toast.error(passwordConfirmName + " không khớp.");
    return false;
  }

  if(!paraUser.realname) {
    toast.error(ERROR['require'] + realnameName + "!");
    return false;
  }

  if(!paraUser.user_group || paraUser.user_group == '-1') {
    toast.error(ERROR['choose'] + userGroupName + "!");
    return false;
  }

  if(!paraUser.authority || paraUser.authority == '-1') {
    toast.error(ERROR['choose'] + authorityName + "!");
    return false;
  }

  return true;
}

/* ============================= User Edit ==============================* */
type selectedValue = {
  authority: string,
  user_group: string,
}
export const isValidUserEdit = ({...paraUser}, {...selectedValue}, password: string, password_confirm: string) => {
  if(isZenSpace(password)) {
    toast.error("Giá trị nhập vào "+ passwordName +" không hợp lệ.");
    return false;
  }

  if(password != password_confirm) {
    toast.error(passwordConfirmName + " không khớp.");
    return false;
  }

  if(!paraUser.realname) {
    toast.error(ERROR['require'] + realnameName + "!");
    return false;
  }

  if(!selectedValue.user_group || selectedValue.user_group == '-1') {
    toast.error(ERROR['choose'] + userGroupName + "!");
    return false;
  }

  if(selectedValue.authority){
    if(!selectedValue.authority || selectedValue.authority == '-1') {
      toast.error(ERROR['choose'] + authorityName + "!");
      return false;
    }
  }

  return true;
}

/* =======================================================================* */

const groupName = "Tên nhóm";
type paraGroup = {
  group_name: string;
}

export const isValidGroupEdit = ({...paraGroup}) => {
  if(!paraGroup.group_name) {
    toast.error(ERROR['indispensable'] + "!");
    return false;
  }
  return true;
}

export const isValidGroup = ({...paraGroup}) => {
  if(!paraGroup.group_name) {
    toast.error(ERROR['require'] + groupName +  "!");
    return false;
  } 
  return true;
}

/* =======================================================================* */

const names = "tên ngày lễ";
type paraTimecardsholidays = {
  name: string;
  names: string;
}

export const isValidTimecardsholidaysEdit = ({...paraTimecardsholidays}) => {
  if(!paraTimecardsholidays.name) {
    toast.error(ERROR['obligatory'] + "!");
    return false;
  }
  return true;
}

export const isValidTimecardsholidays = ({...paraTimecardsholidays}) => {
  if(!paraTimecardsholidays.names) {
    toast.error(ERROR['require'] + names +  "!");
    return false;
  }
  return true;
}
