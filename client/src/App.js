import React from 'react';
import { Route, useLocation, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

const App = () => {
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
