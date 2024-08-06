import { useSession } from '../context/session';
import fetch from 'node-fetch';

export async function getUser(context) {
    let userresponse = await fetch(`/api/user?context=${context}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    let user = await userresponse.json();
    return user;
}

export async function setUser(context, user) {
    let userresponse = await fetch(`/api/user/${user.id}?context=${context}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
    });
    let updatedUser = await userresponse.json();
    return updatedUser;
}