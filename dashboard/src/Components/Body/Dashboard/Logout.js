import React from 'react'

export default function Logout(props) {
  function logOut() {
    axios({
      method: "POST",
      url: "/logout",
    })
      .then((response) => {
        props.token();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }
  return (
    <button onClick={logOut}>Logout</button>
  )
}
