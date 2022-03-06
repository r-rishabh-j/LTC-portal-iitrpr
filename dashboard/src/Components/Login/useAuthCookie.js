import { useState } from 'react';
import axios from 'axios';

function useAuthCookie() {

    const [isLoggedIn, setLoggedIn] = useState(false);

    axios({
        method: "GET",
        url: "/api/is-logged-in",
        data: {}
    }).then((response) => {
        console.log(response);
        setLoggedIn(true);
        console.log('status ' + isLoggedIn);
    }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
        setLoggedIn(false);
        console.log('status ' + isLoggedIn);
    });

    return {
        isLoggedIn,
    }

}

export default useAuthCookie;