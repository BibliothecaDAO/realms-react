import { Disclosure } from '@headlessui/react';

interface FaqObject {
  faqs: Array<Faq>;
  heading?: string;
  description?: string;
}

interface Faq {
  title: string;
  text: string;
}

export const FaqBlock = (props: FaqObject) => {
  return (
    <div className="container flex flex-wrap justify-center px-4 mx-auto my-40 sm:px-10">
      <h2 className="w-full mb-4">{props.heading}</h2>
      <p>{props.description}</p>
      <div className="w-full mr-auto sm:w-1/2">
        {props.faqs.map((a, index) => {
          return (
            <Disclosure key={index}>
              <Disclosure.Button className="w-full px-4 py-2 my-2 text-left transition-all duration-300 rounded sm:py-4 sm:px-8 sm:text-2xl bg-gray-1000/80 hover:bg-gray-900">
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
