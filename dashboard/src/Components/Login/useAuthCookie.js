import { useState, useEffect} from 'react';
import axios from 'axios';

function useAuthCookie() {

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [profileInfo, setProfileInfo] = useState({});
    

    useEffect(() => {
        axios({
          method: "GET",
          url: "/api/is-logged-in",
          data: {},
        })
          .then((response) => {
            //console.log(response.data.claims);
            setLoggedIn(true);
            setProfileInfo(response.data.claims);
            sessionStorage.setItem('profile', JSON.stringify(response.data.claims))
            //console.log("status " + isLoggedIn);    //updated outside of useEffect
            //console.log(profileInfo)
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
            setLoggedIn(false);
            console.log("status " + isLoggedIn);
          });
    }, [isLoggedIn])

    console.log("status " + isLoggedIn); 
    console.log("In Auth")
    console.log(profileInfo);

    return [isLoggedIn, profileInfo];
        
    

}

export default useAuthCookie;