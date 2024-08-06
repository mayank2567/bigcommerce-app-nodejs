import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';
import db from '../../../lib/db';
export default async function user(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {user} = await getSession(req);
        let updatedUser = req.body;
        console.log(`user: in user functrii ${JSON.stringify(updatedUser)}`);
        db.setUser(updatedUser);
        res.json(updatedUser);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
