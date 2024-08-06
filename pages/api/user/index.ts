import { NextApiRequest, NextApiResponse } from 'next';
import { encodePayload, getBCAuth, setSession, getSession } from '../../../lib/auth';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {user} = await getSession(req);
        console.log(user);
        res.json(user);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
