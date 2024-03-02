import { redirect } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { Button } from 'flowbite-react';

function Dashboard() {
  return (
    <>
      <DefaultLayout>
        <div className="text-center min-h-screen flex flex-col justify-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard
          </h2>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Under Development
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={() => {
                return redirect('/');
              }}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Button>
            <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span>&rarr;</span>
            </a>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}

export default Dashboard;
