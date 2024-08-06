import React, { useEffect, useState } from 'react';
import { useSession } from "../../context/session";
import { Button } from "@mui/material";
import { getUser } from "../../lib/hooks";

const Settings = () => {
  const encodedContext = useSession()?.context;
  const user = getUser();
    console.log(user);
    async function updateUser(user) {
      let updatedUser = { ...user, charCount: 50 };
      let response = await fetch(`/api/user/${user.email}?context=${encodedContext}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      response = await response.json();
      console.log(response);
    }
    return (
        <div>
            <h1>Settings</h1>
            <h2>User: {user?.email}</h2>
            <Button onClick={() => updateUser(user)}>Update User</Button>
        </div>
    );
}

export default Settings;
