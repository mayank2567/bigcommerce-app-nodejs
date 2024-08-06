import React, { useEffect, useState } from 'react';
import { useSession } from "../../context/session";
import { Button } from "@mui/material";
import { getUser } from "../../lib/hooks";

const Settings = () => {
  const encodedContext = useSession()?.context;
  const user = getUser();
    console.log(`User after getuser: ${JSON.stringify(user)}`);
    async function updateUser(user) {
      let updatedUser = { ...user, charCount: 11 };
      let response = await fetch(`/api/user/${user.id}?context=${encodedContext}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: updatedUser }),
      });
      response = await response.json();
    }
    return (
        <div>
            <h1>Settings</h1>
            <h2>User: {user?.email}</h2>
            <h2>Remaining balance: ${user?.charCount/1000000}</h2>
            <h2>ID: {user?.id}</h2>
            <Button onClick={() => updateUser(user)}>Update User</Button>
        </div>
    );
}

export default Settings;
