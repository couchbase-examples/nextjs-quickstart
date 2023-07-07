import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  UserPlusIcon,
  TrashIcon,
  PencilIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Modal({
  title,
  subheading,
  bodyNode,
  onConfirm,
  onCancel = () => {},
  open,
  setOpen,
  accentColor,
  icon,
  isConfirmValid,
}) {
  const cancelButtonRef = useRef(null);

  let colors = {
    green: {
      button: 'bg-green-600',
      buttonHover: isConfirmValid ? 'bg-green-500' : 'bg-green-600',
      text: 'text-green-600',
      splash: 'bg-green-100',
    },
    red: {
      button: 'bg-red-600',
      buttonHover: isConfirmValid ? 'bg-red-500' : 'bg-red-600',
      text: 'text-red-600',
      splash: 'bg-red-100',
    },
  };

  const handleModalConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const handleModalCancel = () => {
    setOpen(false);
    onCancel();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex items-end justify-center p-4 sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-12 sm:w-full sm:max-w-lg'>
                <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-center mt-2 pb-2'>
                    <div
                      className={clsx(
                        accentColor === 'red' && colors.red.splash,
                        colors.green.splash,
                        'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10'
                      )}>
                      {icon === 'user-plus' && (
                        <UserPlusIcon
                          className={clsx(
                            accentColor === 'red' && colors.red.text,
                            colors.green.text,
                            'h-6 w-6'
                          )}
                          aria-hidden='true'
                        />
                      )}
                      {icon === 'trash' && (
                        <TrashIcon
                          className={clsx(
                            accentColor === 'red' && colors.red.text,
                            colors.green.text,
                            'h-6 w-6'
                          )}
                          aria-hidden='true'
                        />
                      )}
                      {icon === 'pencil' && (
                        <PencilIcon
                          className={clsx(
                            accentColor === 'red' && colors.red.text,
                            colors.green.text,
                            'h-6 w-6'
                          )}
                          aria-hidden='true'
                        />
                      )}
                      {icon !== 'user-plus' &&
                        icon !== 'trash' &&
                        icon !== 'pencil' && (
                          <RocketLaunchIcon
                            className={clsx(
                              accentColor === 'red' && colors.red.text,
                              colors.green.text,
                              'h-6 w-6'
                            )}
                            aria-hidden='true'
                          />
                        )}
                    </div>
                    <div className='sm:ml-4 sm:text-left'>
                      <Dialog.Title
                        as='h3'
                        className='text-base font-semibold leading-6 text-gray-900'>
                        {title}
                      </Dialog.Title>
                      <div className='mt-1'>
                        <p className='text-sm text-gray-500'>{subheading}</p>
                      </div>
                    </div>
                  </div>

                  <div className='text-gray-900'>{bodyNode}</div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    className={clsx(
                      !isConfirmValid && 'opacity-50 cursor-not-allowed',
                      accentColor === 'red' &&
                        `${colors.red.button} hover:${colors.red.buttonHover}`,
                      `${colors.green.button} hover:${colors.green.buttonHover}`,
                      'mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto'
                    )}
                    onClick={handleModalConfirm}
                    disabled={!isConfirmValid}>
                    Confirm
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                    onClick={handleModalCancel}
                    ref={cancelButtonRef}>
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
