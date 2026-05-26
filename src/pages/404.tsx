import Head from "next/head";
import Error from "@/components/error";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Domakin Tennat Quiz</title>
      </Head>
      <Error />
    </>
  );
}
