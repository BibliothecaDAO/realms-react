import { Disclosure } from '@headlessui/react';

interface FaqObject {
  faqs: Array<Faq>;
}

interface Faq {
  title: string;
  text: string;
}

export const FaqBlock = (props: FaqObject) => {
  return (
    <div className="container flex justify-center mx-auto my-40">
      <div className="w-full">
        {props.faqs.map((a, index) => {
          return (
            <Disclosure key={index}>
              <Disclosure.Button className="w-full px-8 py-4 my-2 text-2xl text-left transition-all duration-300 rounded bg-gray-1000/80 hover:bg-gray-900">
                {a.title}
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 py-4 text-gray-200">
                {a.text}
              </Disclosure.Panel>
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
};
