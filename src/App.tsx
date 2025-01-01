import { useState, useEffect } from 'react';
import './App.css';
import {jwtDecode} from 'jwt-decode';
import Deals from './Deals';

function App() {
  const [user, setUser] = useState({});
  const [unRungDeals, setUnRungDeals] = useState([]);
  const [userDeals, setuserDeals] = useState([])
  // Function to handle fetch request in child component. It is here because it needs to change userDeals
  const handleClick = (e) => {
    const id = e.target.closest('p').id
    
    fetch("https://brodieheg.pythonanywhere.com/ring", {
        method: "PUT",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => {
        if(response.status != 200) 
            {alert('Unable to ring for this deal.') 
                return}
        setuserDeals(userDeals.filter(deal => deal.id != id))
            })
      ;
}

  const handleCallBackResponse = (response) => {
    const userObject = jwtDecode(response.credential);
    setUser(userObject);
    localStorage.setItem("gongUser", response.credential);
    setuserDeals(unRungDeals.filter(deal => deal.repEmail === userObject.email))
  };

  const handleSignOut = () => {
    setUser({}); 
    localStorage.removeItem("gongUser")
  };

  const getUnrungDeals = async () => {
    try {
      const URL = 'https://brodieheg.pythonanywhere.com/unrung-deals';
      const response = await fetch(URL);
      const res = await response.json();
      setUnRungDeals(res);
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
              <Deals handleClick={handleClick} userDeals={userDeals}></Deals>
             <button onClick={handleSignOut} style={{ marginLeft: '10px' }}>
              Sign Out
              </button>
            </>
          ) : 
          <>
          <h4>Let's celebrate! Sign in to see your recent recent wins!</h4>
          <div id = 'signInDiv'></div>
          </>

          
        }
          
        </div>
      </>
    );
  } 


export default App;
