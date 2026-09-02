import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);
const credentialsPath = path.join(process.cwd(), 'data', 'credentials.json');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let contactEmail = 'brianmuema928@gmail.com';
    try {
      const fileContents = await fs.readFile(credentialsPath, 'utf8');
      const credentials = JSON.parse(fileContents);
      if (credentials.email) {
        contactEmail = credentials.email;
      }
    } catch {
      // Use fallback
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: contactEmail,
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      reply_to: email,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
