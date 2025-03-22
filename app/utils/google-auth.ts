import {google as googleAuth} from 'googleapis';

const oauth2Client = new googleAuth.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
);

export default oauth2Client;