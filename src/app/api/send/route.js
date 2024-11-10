 "use client"
import { NextResponse } from "next/server";
import { Resend } from "resend";
import ReactDOMServer from "react-dom/server";  // Needed for converting JSX to HTML

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

export async function POST(req) {
  try {
    const { email, subject, message } = await req.json();
    console.log("Received data:", email, subject, message);

    // Convert JSX to HTML using ReactDOMServer
    const htmlContent = ReactDOMServer.renderToString(
      <>
        <h1>{subject}</h1>
        <p>Thank you for contacting us!</p>
        <p>New message submitted:</p>
        <p>{message}</p>
      </>
    );

    const data = await resend.emails.send({
      from: fromEmail,
      to: [fromEmail, email],
      subject: subject,
      html: htmlContent,  // Send HTML instead of JSX
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send the email. Please try again later." });
  }
}
