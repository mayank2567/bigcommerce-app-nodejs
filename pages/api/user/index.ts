import { NextApiRequest, NextApiResponse } from 'next';
import { encodePayload, getBCAuth, setSession, getSession } from '../../../lib/auth';
import  db  from '../../../lib/db';
export default async function user(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {user} = await getSession(req);
        let getuser = await db.getUser(user.email, user.id);
        getuser.id = user.id;
        if(!getuser.charCount) getuser.charCount = 0;
        res.json(getuser);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
