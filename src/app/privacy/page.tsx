export const metadata = {
  title: 'Privacy Policy | Brian Muema',
  description: 'Privacy Policy for Brian Muema\'s portfolio and data consulting services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        
        <h2>1. Information Collection</h2>
        <p>
          I collect information you provide directly to me when you use the contact form or communicate with me via email. 
          This may include your name, email address, and the contents of your messages.
        </p>

        <h2>2. Use of Information</h2>
        <p>
          The information collected is used solely for the purpose of responding to your inquiries, discussing potential projects, 
          and providing data consulting services. I do not sell, rent, or share your personal information with third parties.
        </p>

        <h2>3. Cookies and Analytics</h2>
        <p>
          This website may use cookies and basic analytics to understand site traffic and improve user experience. 
          You can choose to disable cookies through your browser settings.
        </p>

        <h2>4. Data Security</h2>
        <p>
          I take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
        </p>

        <h2>5. Contact Me</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact me at: <a href="mailto:brianmuema928@gmail.com" className="text-primary hover:underline">brianmuema928@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
