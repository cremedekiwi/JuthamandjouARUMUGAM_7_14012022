import React, { useState } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom'

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let history = useHistory()

  const changePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          // Body
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
        } else {
          alert("Mot de passe changé");
          history.push('/')
        }
      });
  };

  return (
    <div className="centerVertical toTheLine">
      <h1>Modifier MDP</h1>
      <input
        className="changePassword"
        type="password"
        placeholder="Ancien"
        onChange={(event) => {
          setOldPassword(event.target.value); // Met à jour le state oldPassword
        }}
      />
      <input
        className="changePassword"
        type="password"
        placeholder="Nouveau"
        onChange={(event) => {
          setNewPassword(event.target.value); // Met à jour le state newPassword
        }}
      />
      <button id="modifyChangePassword" onClick={changePassword}> Modifier</button>
    </div>
  );
}

export default ChangePassword;
