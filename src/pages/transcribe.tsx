import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "src/styles/Home.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Transcribe() {
  const { query } = useRouter();
  console.log({ query });
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>My API</h1>
      </main>
    </>
  );
}

export const getServerSideProps = (context) => {
  console.log(context);
  return {
    props: {},
  };
};