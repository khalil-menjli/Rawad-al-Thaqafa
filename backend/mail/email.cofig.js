import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port : 465,
  secure: true,
  auth: {
    user:"khalilwardi000@gmail.com",
    pass: "clkl jnyh iixl oqhk"

  }
}); 
export const sender = {
	email: "khalilwardi000@gmail.com",
	name: "khalil",
}; 