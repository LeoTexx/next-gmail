import { useEffect, useState } from "react";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";

import Logos from "../components/atoms/Logos";
import Card from "../components/organisms/Card";
import GoogleButon from "../components/molecules/GoogleButon";
import Spinner from "../components/atoms/Spinner";
import Button from "../components/atoms/Button";

import styles from "../styles/home.module.css";

const App = (): JSX.Element => {
  const [emails, setEmails] = useState([]);
  const { data, status } = useSession();

  const getMails = async (accessToken: string) => {
    const url = "https://www.googleapis.com/gmail/v1/users/me/messages";
    try {
      const {
        data: { messages },
      } = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { maxResults: 10 },
      });
      const emailData = await Promise.all(
        messages.map(async (message) => {
          const { id } = message;
          const email = await fetch(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          return await email.json();
        })
      );
      return emailData;
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    (async function () {
      if (status === "authenticated") {
        //This value will always exist
        const mails = await getMails(data.accessToken);
        setEmails(mails);
      }
    })();
  }, [status]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <Spinner />
      </div>
    );

  if (status === "authenticated") {
    console.log({ data });
    return (
      <main>
        <header className={styles.header}>
          <h3 className={styles.headerTopTitle}>
            <span className={styles.headerTopTitleVital}>Hello</span> - Leonardo
            Teixeira
          </h3>
          <h1 className={styles.headerTitle}>Your Emails</h1>
          <p className={styles.headerDescription}>
            Now you can check your latest emails from your Gmail account.
          </p>
          <div className={styles.gmailLogoContainer}>
            <Logos.Gmail className={styles.gmailLogo} />
          </div>
        </header>
        <section className={styles.features}>
          {emails.map((email, index) => {
            const subjectHeader = email.payload.headers.find(
              (header) => header.name === "Subject"
            );
            const emailSubject = subjectHeader
              ? subjectHeader.value
              : "Not Available";

            return (
              <div
                key={index}
                className={styles.cardWrapper}
                style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
              >
                <Card title={emailSubject} description={email.snippet} />
              </div>
            );
          })}
        </section>
        <footer className={styles.footer}>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <a href="https://github.com/LeoTexx" className="mt-2 md:mt-0">
            Leonardo Teixeira @ {new Date().getFullYear()}
          </a>
        </footer>
      </main>
    );
  }
  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <GoogleButon />
    </div>
  );
};

export default App;
