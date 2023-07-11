import { Montserrat } from 'next/font/google';
import '../styles/globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={montserrat.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
