import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_PASS } from '../config.js';


console.log(GMAIL_USER, GMAIL_PASS);

export const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
});

