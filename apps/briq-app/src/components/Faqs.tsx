import { Disclosure } from '@headlessui/react';

const faqs = [
  { title: 'sadas', text: 'sadads' },
  { title: 'sadas', text: 'sadads' },
  { title: 'sadas', text: 'sadads' },
];

export const FaqBlock = () => {
  return (
    <div className="container justify-center flex mx-auto my-20">
      <div className="w-1/2">
        <h2 className="mb-8 text-center">Faqs</h2>

        {faqs.map((a, index) => {
          return (
            <Disclosure key={index}>
              <Disclosure.Button className="w-full my-2 py-2 bg-gray-900 rounded px-8">
                {a.title}
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500 py-4">
                {a.text}
              </Disclosure.Panel>
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
};
