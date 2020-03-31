const ejs = require("ejs");
const nodemailer = require("nodemailer");
const ErrorResponse = require("../Utils/errorsResponse");

function transporterSetup() {
  let transporter;

  if(process.env.NODE_ENV === 'production'){
    transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_DEV_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_DEV_USERNAME,
        pass: process.env.SMTP_DEV_PASSWORD
      }
    });
  }; 

  return transporter;
};

async function mailOptions(opts, req) {
  let data;
  if(!req || !opts){
    throw new Error("expected 2 arguments...");
  };

  const activationURL = `${process.env.FRONTEND_URL}/auth/account_activation/${opts.token}`;
  const pwdResetURL = `${process.env.FRONTEND_URL}/auth/reset_password/${opts.token}`;
  
  if (opts.emailType === "new_order"){
    data = await ejs.renderFile(__dirname + "/orderEmail.ejs", { order: opts.order, customer: opts.customer, orderItems: opts.orderItems });
  };

  const emailTemplate = {
    account_activation: `<h1>Activate your House of Anasa Account</h1><hr>
			<p>You new H.O.A account has been created, however complete the registration process please click on the link below: </p>
			<h4><a href=${activationURL}>Confirm Email to Activate Account</a></h4><br>
			<h5>Thank You.</h5>`,
    password_reset: `<h1>Password Reset</h1><br>
    <p>You are receiving this email because you (or someone else) has requested to reset your password. Please click on the link provided to complete the process: <a href=${pwdResetURL}>Reset Password</a><br>
      <h5>If you didn't request this, please kindly ignore this email and your password will remain unchanged".</h5>`,
    new_order: data
  };

  const messageInfo = {
    to: opts.email,
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    subject: opts.subject,
    html: emailTemplate[opts.emailType]
  };

  return messageInfo;
};

exports.sendEmail = async (options, req, next) => {
  const transporter = transporterSetup();
  const messageInfo = await mailOptions(options, req);
  
  // sendmail
  if (process.env.NODE_ENV !== 'production') {
    try {
      const info = await transporter.sendMail(messageInfo);
      return console.log("Message sent: %s", info.messageId);
    } catch (err) {
      console.log("MAIL ERROR: ", err);
      return next(new ErrorResponse(err.message, 400));
    };
  };
};