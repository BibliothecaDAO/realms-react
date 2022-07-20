import { Disclosure } from '@headlessui/react';

const faqs = [
  {
    title: 'We are a decentralised game studio',
    text: 'Formed from the Lootverse',
  },
  {
    title: 'Why do we exist?',
    text: 'To buidler',
  },
  {
    title: 'Can I join?',
    text: 'Yes!',
  },
];

export const FaqBlock = () => {
  return (
    <div className="container flex justify-center mx-auto my-40">
      <div className="w-full">
        {faqs.map((a, index) => {
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
