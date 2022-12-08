import Airtable from 'airtable';
import { useState } from 'react';

export const EmailForm = () => {
  const [email, setEmail] = useState('');

  const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE }).base(
    'appTnNFerVjGI8IsE'
  );

  const fireEmail = () => {
    base('emails').create(
      [
        {
          fields: { email: email },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records?.forEach(function (record) {
          console.log(record.getId());
        });
      }
    );
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="flex-row text-center sm:w-1/2">
        <h1 className="text-xl font-semibold text-center font-display lg:text-4xl">
          Stay up to Date
        </h1>

        <div className="mx-auto bg-white rounded-lg">
          <div className="flex justify-between flex-warp md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(() => e.target.value);
              }}
              className="w-full p-3 m-1 text-sm font-medium text-gray-700 border-none appearance-none focus:outline-none focus:border-white focus:rounded focus:placeholder-transparent"
              placeholder="Enter your email"
              aria-label="Enter your email"
            />
            <button
              onClick={fireEmail}
              className="right-0 w-full p-2 m-1 text-sm font-semibold bg-gray-800 rounded-lg lg:w-auto hover:bg-gray-700"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
