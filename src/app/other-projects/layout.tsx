import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Other Projects | Brian Muema',
  description: 'A collection of hackathon entries, client websites, and other exploratory projects by Brian Muema.',
};

export default function OtherProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
