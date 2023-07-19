import React, { Fragment, useCallback, useEffect } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

const Notification = ({ message, open, setOpen, timeout }) => {
  const closeNotification = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  useEffect(() => {
    if (timeout) {
      setTimeout(() => {
        closeNotification();
      }, timeout);
    }
  }, [open, closeNotification, timeout]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <div
          className={clsx(
            'border-2 border-slate-500 fixed top-6 right-8 px-6 py-4 rounded-md bg-white max-w-md'
          )}>
          <button onClick={() => setOpen(false)}>
            <XCircleIcon className='w-8 fixed right-4 top-3 bg-red-100 rounded-full text-red-600 hover:bg-red-300' />
          </button>
          {message}
        </div>
      </Transition.Child>
    </Transition.Root>
  );
};

export default Notification;
