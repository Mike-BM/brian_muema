export const metadata = {
  title: 'Terms and Conditions | Brian Muema Michael',
  description: 'Terms and Conditions for Brian Muema Michael\'s portfolio and data consulting services.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-lg dark:prose-invert text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Intellectual Property</h2>
        <p>
          The content, features, and functionality found on this website are the exclusive property of Brian Muema Michael, unless otherwise noted. 
          Case studies, data models, and code snippets are for portfolio demonstration purposes and may be subject to individual client agreements.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          The materials on this website are provided on an &apos;as is&apos; basis. Brian Muema Michael makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall Brian Muema Michael be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
        </p>

        <h2>5. Links</h2>
        <p>
          I have not reviewed all of the sites linked to this website and am not responsible for the contents of any such linked site. 
          The inclusion of any link does not imply endorsement by Brian Muema Michael. Use of any such linked website is at the user&apos;s own risk.
        </p>
      </div>
    </div>
  );
}
