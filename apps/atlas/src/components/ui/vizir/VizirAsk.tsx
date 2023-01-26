import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useEffect, useState } from 'react';
import useQuestion from '@/hooks/vizir/useQuestion';
import TextInput from './textarea';

export default function VizirAsk() {
  const { fetchData, data, loading, clear } = useQuestion();
  const [inputValue, setInputValue] = useState({ logline: '' });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue({ logline: event.target.value });
  };

  return (
    <main className="flex justify-center">
      <div className="w-full p-4">
        <div className="flex justify-center mb-8 text-3xl">Vizir AI</div>
        <div className="flex items-center">
          <img
            alt="vizir"
            src="/vizirs/mj_military_vizir.png"
            className="object-cover w-32 h-32 mr-8 border border-yellow-900 rounded-xl"
          />
          <div className="text-lg">
            Greetings, my Lord! Ask me anything about Loot, Realms, Eternum or
            BibliothecaDAO.
            <br /> I am trained on the{' '}
            <a
              target={'_blank'}
              className="underline"
              href="https://scroll.bibliothecadao.xyz/"
              rel="noreferrer"
            >
              Master Scroll
            </a>{' '}
            and can anwer your questions.
          </div>
        </div>

        {!data && !loading && (
          <div className="flex flex-col items-center justify-center">
            <TextInput
              placeholder="What do you want to know?"
              value={inputValue.logline}
              onChange={handleChange}
              className="w-full p-5 mt-8 text-2xl font-bold leading-tight tracking-widest transition-all duration-300 rounded-lg shadow-md appearance-none focus:outline-none bg-gray-800/40 hover:bg-gray-300/20"
            />

            <div className="mx-auto my-4">
              <Button
                disabled={inputValue.logline === ''}
                variant="primary"
                onClick={() =>
                  fetchData({
                    input: inputValue.logline,
                  })
                }
              >
                Search the Scroll
              </Button>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col items-center justify-center">
            <div className="p-5 mt-8 mb-4 text-2xl shadow-inner bg-gray-800/40 rounded-3xl">
              {' '}
              {data.item_id}
            </div>
            <Button
              disabled={inputValue.logline === ''}
              onClick={() => {
                clear();
                setInputValue({ logline: '' });
              }}
            >
              Try again?
            </Button>
          </div>
        )}
        {loading && (
          <div className="flex justify-center mx-auto my-4">
            <svg
              width="120"
              height="30"
              viewBox="0 0 120 30"
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
            >
              <circle cx="15" cy="15" r="15">
                <animate
                  attributeName="r"
                  from="15"
                  to="15"
                  begin="0s"
                  dur="0.8s"
                  values="15;9;15"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  from="1"
                  to="1"
                  begin="0s"
                  dur="0.8s"
                  values="1;.5;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="60" cy="15" r="9" fillOpacity="0.3">
                <animate
                  attributeName="r"
                  from="9"
                  to="9"
                  begin="0s"
                  dur="0.8s"
                  values="9;15;9"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  from="0.5"
                  to="0.5"
                  begin="0s"
                  dur="0.8s"
                  values=".5;1;.5"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="105" cy="15" r="15">
                <animate
                  attributeName="r"
                  from="15"
                  to="15"
                  begin="0s"
                  dur="0.8s"
                  values="15;9;15"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  from="1"
                  to="1"
                  begin="0s"
                  dur="0.8s"
                  values="1;.5;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
      </div>
    </main>
  );
}
