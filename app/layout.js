import './globals.css';

export const metadata = {
  title: 'GridSentinel Ops | Infrastructure Intelligence',
  description: 'Monitor infrastructure health, investigate incidents, and coordinate maintenance in one operations workspace.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
