import React, { useEffect } from 'react';
import { Route, useLocation, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import { AUTO_LOGIN } from './redux/authSlice';
import { useDispatch } from 'react-redux';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(AUTO_LOGIN());
  }, [])
  const pathname = useLocation().pathname;
  if(pathname === '/') {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return <Redirect to={"calendar/" + year + "/" + month + "/" + day} />
  }

  return (
    <Route path = "/calendar/:year/:month/:date" exact component={Dashboard}/>
  );
}

export default App;
