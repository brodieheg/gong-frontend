import { useState, useEffect } from 'react';
import './App.css';
import {jwtDecode} from 'jwt-decode';
import Deals from './Deals';

function App() {
  const [user, setUser] = useState({});
  const [unRungDeals, setUnRungDeals] = useState([]);
  const [userDeals, setuserDeals] = useState([])

  const handleCallBackResponse = (response) => {
    const userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    localStorage.setItem("gongUser", response.credential);
    setuserDeals(unRungDeals.filter(deal => deal.repEmail === userObject.email))
  };

  const handleSignOut = () => {
    setUser({}); 
    localStorage.removeItem("gongUser")
    console.log('User signed out');
  };

  const getUnrungDeals = async () => {
    try {
      const URL = 'https://brodieheg.pythonanywhere.com/unrung-deals';
      const response = await fetch(URL);
      const res = await response.json();
      setUnRungDeals(res);
      console.log(res);
      return;
    } catch {
      console.log('Could not fetch');
    }
    return;
  };

  useEffect(() => {
    getUnrungDeals();
  }, []);

  useEffect(() => {
    if(localStorage.getItem("gongUser")) {
      const userObject = jwtDecode(localStorage.getItem("gongUser"));
      setUser(userObject);
    }}, [])
  
  useEffect(() => {
    if(!user.email)
      {
        /* global google */
        google.accounts.id.initialize({
          client_id: '968739805873-h7iqm1m0qpkestn3u9ii15o3cqvmi1me.apps.googleusercontent.com',
          callback: handleCallBackResponse,
        });
        
        google.accounts.id.renderButton(
          document.getElementById('signInDiv'),
          { theme: 'outline', size: 'large' }
        );
      }
  }, [user]);

    return (
      <>
        <div>
          {user.email ? 
            (
            <>
            <p>
              Welcome, {user.name}!
            </p>
              <Deals userDeals={userDeals}></Deals>
             <button onClick={handleSignOut} style={{ marginLeft: '10px' }}>
              Sign Out
              </button>
            </>
          ) : <div id = 'signInDiv'></div>

          
        }
          
        </div>
      </>
    );
  } 


export default App;
