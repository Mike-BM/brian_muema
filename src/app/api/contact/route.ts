import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { readCredentials } from '@/lib/credentials';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey || 're_placeholder');

export async function POST(request: Request) {
  try {
    if (!rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }

    const formData = await request.formData();
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const honeypot = String(formData.get('website') || '');

    // Bots fill hidden fields; pretend success so they move on
    if (honeypot) {
      return NextResponse.json({ data: { ok: true } }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 200 ||
      name.length > 120 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
    }

    const contactEmail = (await readCredentials()).email || 'brianmuema928@gmail.com';

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: contactEmail,
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      replyTo: email,
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
