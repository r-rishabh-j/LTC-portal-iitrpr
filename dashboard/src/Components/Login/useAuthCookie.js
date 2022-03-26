import { useState, useEffect } from 'react';
import axios from 'axios';

function useAuthCookie() {

  const [isLoggedIn, setLoggedIn] = useState({ 'loggedIn': null, 'profileInfo': {} });

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/is-logged-in",
      data: {},
    })
      .then((response) => {
        setLoggedIn({ 'loggedIn': true, 'profileInfo': response.data.claims });
        sessionStorage.setItem('profile', JSON.stringify(response.data.claims));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        setLoggedIn({ 'loggedIn': false, 'profileInfo': {} });
      });
  }, [])

  return [isLoggedIn.loggedIn, isLoggedIn.profileInfo];

}

export default useAuthCookie;