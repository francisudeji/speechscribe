import Head from "next/head";
import { Inter } from "@next/font/google";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import Typed from "typed.js";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string>("");
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let typed: Typed;
    if (data.length > 0) {
      console.log({ data });
      typed = new Typed(transcriptRef.current, {
        strings: [data],
        typeSpeed: 10,
        loop: false,
        showCursor: false,
      });
    }

    return () => {
      if (typed) typed.destroy();
    };
  }, [data]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setFile(file);
      setAudioURL(URL.createObjectURL(file));
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const blob = new Blob([reader.result as ArrayBuffer], {
          type: file.type,
        });
        setAudioBlob(blob);
      });

      reader.readAsArrayBuffer(file);
    }
  }

  // function seekAudio(position: "forward" | "backward") {
  //   const audioElement = audioRef.current;
  //   console.log(audioElement?.currentTime);
  //   if (!audioElement) return;

  //   if (position === "forward") {
  //     audioElement.currentTime += 5;
  //   } else {
  //     audioElement.currentTime -= 5;
  //   }
  // }

  function playAudio() {
    const audioElement = audioRef.current;

    if (!audioElement) return;
    audioElement.addEventListener("ended", () => setAudioPlaying(false));

    if (audioElement && audioPlaying) {
      audioElement.pause();
      setAudioPlaying(false);
      return;
    }

    audioElement.play();
    setAudioPlaying(true);
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={inter.style}
        className="flex flex-col h-screen max-w-5xl mx-auto"
      >
        <header className="h-16 border-b border-gray-100 flex items-center justify-center font-semibold text-2xl text-slate-800">
          <Link href="/">Speechscribe</Link>
        </header>
        <main className="h-[50vh]">
          <section className="grid grid-cols-2 h-full divide-x divide-gray-100 py-4 border border-gray-100 rounded-md">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = new FormData();
                formData.append("audio", audioBlob as Blob, file?.name);

                if (prompt.length) {
                  formData.append("prompt", prompt);
                }
                if (language.length) {
                  formData.append("language", language);
                }

                try {
                  const response = await fetch(`api/transcribe`, {
                    method: "POST",
                    body: formData,
                  });
                  const { data } = await response.json();
                  setData(data.text);
                } catch (error) {
                  console.error({ error });
                }
              }}
              className="flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-sm text-slate-500 overflow-x-hidden">
                {file ? (
                  <p>{file.name}</p>
                ) : (
                  <>
                    <h2 className="">Upload an audio file to get started</h2>
                    <button
                      type="button"
                      className="flex items-center py-2 px-4 space-x-2 rounded-full text-sm text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-800 focus:ring-offset-2 focus:ring-2 focus:ring-blue-700"
                      onClick={() => fileRef.current?.click()}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </span>
                      <span>Upload file</span>
                    </button>
                  </>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  name="file"
                  id="file"
                  aria-label="Choose audio file"
                  className="hidden mt-2 file:ml-10 text-sm text-slate-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
                  onChange={handleFileChange}
                />
                <audio hidden src={audioURL} ref={audioRef} />
              </div>

              {file && (
                <div className="px-4 space-y-4 flex flex-col">
                  <select
                    name="language"
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 py-2 text-sm self-end border border-slate-200 rounded-md"
                  >
                    <option value="">Choose audio language</option>
                    <option value="af">Afrikaans</option>
                    <option value="ar">Arabic</option>
                    <option value="hy">Armenian</option>
                    <option value="az">Azerbaijani</option>
                    <option value="be">Belarusian</option>
                    <option value="bs">Bosnian</option>
                    <option value="bg">Bulgarian</option>
                    <option value="ca">Catalan</option>
                    <option value="zh">Chinese</option>
                    <option value="hr">Croatian</option>
                    <option value="cs">Czech</option>
                    <option value="da">Danish</option>
                    <option value="nl">Dutch</option>
                    <option value="en">English</option>
                    <option value="et">Estonian</option>
                    <option value="fi">Finnish</option>
                    <option value="fr">French</option>
                    <option value="gl">Galician</option>
                    <option value="de">German</option>
                    <option value="el">Greek</option>
                    <option value="he">Hebrew</option>
                    <option value="hi">Hindi</option>
                    <option value="hu">Hungarian</option>
                    <option value="is">Icelandic</option>
                    <option value="id">Indonesian</option>
                    <option value="it">Italian</option>
                    <option value="ja">Japanese</option>
                    <option value="kn">Kannada</option>
                    <option value="kk">Kazakh</option>
                    <option value="ko">Korean</option>
                    <option value="lv">Latvian</option>
                    <option value="lt">Lithuanian</option>
                    <option value="mk">Macedonian</option>
                    <option value="ms">Malay</option>
                    <option value="mr">Marathi</option>
                    <option value="mi">Maori</option>
                    <option value="ne">Nepali</option>
                    <option value="no">Norwegian</option>
                    <option value="fa">Persian</option>
                    <option value="pl">Polish</option>
                    <option value="pt">Portuguese</option>
                    <option value="ro">Romanian</option>
                    <option value="ru">Russian</option>
                    <option value="sr">Serbian</option>
                    <option value="sk">Slovak</option>
                    <option value="sl">Slovenian</option>
                    <option value="es">Spanish</option>
                    <option value="sw">Swahili</option>
                    <option value="sv">Swedish</option>
                    <option value="tl">Tagalog</option>
                    <option value="ta">Tamil</option>
                    <option value="th">Thai</option>
                    <option value="tr">Turkish</option>
                    <option value="uk">Ukrainian</option>
                    <option value="ur">Urdu</option>
                    <option value="vi">Vietnamese</option>
                    <option value="cy">Welsh</option>
                  </select>
                  <textarea
                    name="prompt"
                    id="prompt"
                    placeholder="Improve your transcription with a prompt"
                    className="w-full h-20 text-sm resize-none p-4 text-slate-500 border border-slate-200 rounded-md"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                  ></textarea>
                  <div className="flex justify-between justify-self-end">
                    <button
                      type="button"
                      className="flex items-center py-2 px-4 space-x-2 rounded-full text-sm text-slate-700 bg-slate-100 active:bg-slate-700 focus:ring-offset-2 focus:ring-2 focus:ring-slate-700"
                      onClick={() => fileRef.current?.click()}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </span>
                      <span>Upload file</span>
                    </button>
                    <button
                      type="submit"
                      className="flex items-center py-2 px-4 space-x-2 rounded-full text-sm text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-800 focus:ring-offset-2 focus:ring-2 focus:ring-blue-700"
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                          />
                        </svg>
                      </span>
                      <span>Transcribe</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
            <div
              id="transcript"
              ref={transcriptRef}
              placeholder="Your transcriptions will appear here..."
              className={`w-full h-full resize-none p-4 text-slate-500 text-sm ${
                !data.length && "flex items-center justify-center"
              }`}
            >
              Your transcriptions will appear here...
            </div>
          </section>
        </main>
        {file && (
          <footer className="border-t border-slate-200 h-32 hidden items-center justify-center justify-self-end space-x-4">
            <button
              onClick={() => {
                playAudio();
              }}
              className="flex items-center justify-center h-20 w-20 text-center space-x-2 rounded-full text-sm text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-800 focus:ring-offset-2 focus:ring-2 focus:ring-blue-700"
            >
              <span>
                {audioPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-10 h-10 ml-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                )}
              </span>
            </button>
          </footer>
        )}
      </div>
    </>
  );
}
