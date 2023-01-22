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
    <main className="flex justify-center p-10 ">
      <div className="w-full p-4">
        <img
          alt="vizir"
          src="/vizirs/mj_military_vizir.png"
          className="w-full mx-auto border-4 border-white rounded-full shadow-xl shadow-green-500/30"
        />
        <div className="py-3 my-4">
          I am trained on the{' '}
          <a href="https://scroll.bibliothecadao.xyz/">Master Scroll</a>. Ask me
          anything about Loot, Realms, Eternum or BibliothecaDAO.
        </div>
        {!data && !loading && (
          <>
            <TextInput
              placeholder="What do you want to know?"
              value={inputValue.logline}
              onChange={handleChange}
              className="w-full p-5 mt-8 text-2xl text-white shadow-inner bg-gray-300/20 placeholder:italic placeholder:text-slate-100 focus:ring-0 rounded-3xl"
            />

            <div className="my-4">
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
          </>
        )}

        {data && !loading && (
          <>
            <div className="p-5 mb-4 text-2xl border-4 shadow-inner bg-black/20 rounded-3xl">
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
          </>
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
