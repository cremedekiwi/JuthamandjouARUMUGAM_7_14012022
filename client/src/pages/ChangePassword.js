import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };

  return (
    <div>
      <h1>Modifier votre mot de passe</h1>
      <input
        type="password"
        placeholder="Ancien"
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Nouveau"
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}> Modifier</button>
    </div>
  );
}

export default ChangePassword;
