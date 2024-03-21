import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const Protected = (props: { Component: any; }) => {
  const naviget = useNavigate();
  const {Component} = props;
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('login');
    if(isLoggedIn === 'false'){
      naviget("/", {replace: true});
    }
  },[]);

  return(
    <Component/>
  );
}

export default Protected;
