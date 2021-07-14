import Head from 'next/head'
import { connectToDatabase } from '../util/couchbase'

export default function Home({ isConnected, rows }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js with Couchbase!</a>
        </h1>

        {isConnected ? (
          <h2 className="subtitle green">You are connected to Couchbase</h2>
        ) : (
          <>
            <h2 className="subtitle red">
              You are NOT connected to Couchbase. Try refreshing the page,
              and if this error persists check the <code>README.md</code>{' '}for instructions.
            </h2>
            <em className="center">Note: you might have to re-start the app if the database was recently started (if using dev mode) for changes to take effect.</em>
          </>
        )}

        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>

        <h2>Querying travel-sample to test connection:</h2>
        <table style={{textAlign: "left", marginTop: "20px"}}>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Callsign</th>
            <th>ICAO</th>
            <th>ID</th>
            <th>Type</th>
          </tr>
          {!!rows && rows.map((item) => {
            return (
                <tr key={item['travel-sample'].id}>
                  <td>{item['travel-sample'].name}</td>
                  <td>{item['travel-sample'].country}</td>
                  <td>{item['travel-sample'].callsign}</td>
                  <td>{item['travel-sample'].icao}</td>
                  <td>{item['travel-sample'].id}</td>
                  <td>{item['travel-sample'].type}</td>
                </tr>
            )
          })}
        </table>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        td, th {
          padding: 2px 30px;
        }

        table, th, td {
          border: 1px solid #aaa;
        }

        .red, .error {
          color: indianred;
        }

        .green, .success {
          color: lightseagreen;
        }

        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}


export async function getServerSideProps(context) {
  let connection = await connectToDatabase();

  const { isConnected, cluster } = connection;

  let result, rows = null;
  if (isConnected) { //  TODO: this? && bucketKey === 'travel-sample'
    // TODO: add a flag for when bucketKey !== travel-sample and put a prop/message accordingly;
    //  we can prob replace the isConnected with something about the bucketKey

    let qs = `SELECT * FROM \`travel-sample\` WHERE type = "airline" LIMIT 5;`
    try {
      result = await cluster.query(qs);
      rows = result.rows;
    } catch(e) {
      console.log('Error Querying: \n', e);
    }
  } else {
    rows = null;
  }

  return {
    props: { isConnected, rows },
  }
}
