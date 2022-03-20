import { useState, useEffect } from 'react';
import axios from 'axios';

function useAuthCookie() {

  const [isLoggedIn, setLoggedIn] = useState({'loggedIn': null, 'profileInfo':{}});
  // const [profileInfo, setProfileInfo] = useState({});

  // var isLoggedIn = false;
  // var profileInfo = {};

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/is-logged-in",
      data: {},
    })
      .then((response) => {
        //console.log(response.data.claims);
        // setLoggedIn(true);
        // setProfileInfo(response.data.claims);
        setLoggedIn({'loggedIn': true, 'profileInfo': response.data.claims});
        sessionStorage.setItem('profile', JSON.stringify(response.data.claims));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        setLoggedIn({'loggedIn': false, 'profileInfo': {}});
      });
  },[])
  // await axios({
  //   method: "GET",
  //   url: "/api/is-logged-in",
  //   data: {},
  // })
  //   .then((response) => {
  //     //console.log(response.data.claims);
  //     // setLoggedIn(true);
  //     // setProfileInfo(response.data.claims);
  //     isLoggedIn = true;
  //     profileInfo = response.data.claims;
  //     console.log("Success", profileInfo);
  //     sessionStorage.setItem('profile', JSON.stringify(response.data.claims))
  //     return [isLoggedIn, profileInfo];
  //     //console.log("status " + isLoggedIn);    //updated outside of useEffect
  //     //console.log(profileInfo)
  //   })
  //   .catch((error) => {
  //     if (error.response) {
  //       console.log(error.response);
  //       console.log(error.response.status);
  //       console.log(error.response.headers);
  //     }
  //     isLoggedIn = false;
  //     console.log("status " + isLoggedIn);
  //   });

  // console.log("status " + isLoggedIn);
  // console.log("In Auth")
  // console.log(profileInfo);

  return [isLoggedIn.loggedIn, isLoggedIn.profileInfo];

}

export default useAuthCookie;