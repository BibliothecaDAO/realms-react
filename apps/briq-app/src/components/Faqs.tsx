import { Disclosure } from '@headlessui/react';

const faqs = [
  {
    title: 'Do I have to use all 20k briqs per entry?',
    text: 'You can use as many briqs as you need, no need to use the entire amount.',
  },
  {
    title: 'I need more briqs to build my wonders, what should I do?',
    text: 'Drop us a message in Discord and we’ll see what we can do.',
  },
  {
    title:
      'Are there any costs involved in receiving briqs, building or minting the NFT entry?',
    text: 'Nope! All free',
  },
  {
    title:
      'Do I have to tweet your creation to enter? What if I don’t have Twitter?',
    text: 'Yes, this is a requirement for entry. There is no time like now to get an account!',
  },
  {
    title: 'How were the Wonders chosen?',
    text: 'They were carefully chosen by the Bibliotheca DAO core team to ensure a variety of different styles.',
  },
  {
    title: ' I have an issue, what should I do?',
    text: 'Send us a message on Discord and the team will help you out.',
  },
  {
    title: 'Do I need an Argent X wallet?',
    text: 'Yes, this is the only wallet that can currently be used on StarkNet. It is very quick and simple to create one - you can do this here',
  },
  {
    title: 'Can I win more than once?',
    text: 'Yes, if you have multiple entries across different Wonders, you have the chance of winning more than once as voted by the Bibliotheca DAO.',
  },
];

export const FaqBlock = () => {
  return (
    <div className="container justify-center flex mx-auto my-20">
      <div className="sm:w-1/2">
        <h2 className="mb-8 text-center">Faqs</h2>

        {faqs.map((a, index) => {
          return (
            <Disclosure key={index}>
              <Disclosure.Button className="w-full my-2 py-2 bg-gray-900 rounded px-8 hover:bg-gray-600">
                {a.title}
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-200 py-4 px-4">
                {a.text}
              </Disclosure.Panel>
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
};
