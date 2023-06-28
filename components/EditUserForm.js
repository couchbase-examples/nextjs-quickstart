import React from 'react';

export const EditUserForm = ({firstName, setFirstName, lastName, setLastName, email, setEmail}) => {
  return (
      <form>
        <div className="pb-2 mt-4">
          <label className="text-sm font-medium leading-6 text-gray-900">
            Personal Details
          </label>
          <div className="grid grid-cols-6 gap-x-3 gap-y-2">
            <div className="col-span-3">
              <div className="mt-2">
                <input
                    defaultValue={firstName}
                    onChange={(e) => {setFirstName(e.target.value)}}
                    placeholder='First Name'
                    type="text"
                    name="first-name-edit"
                    id="first-name-edit"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-3">
              <div className="mt-2">
                <input
                    defaultValue={lastName}
                    onChange={(e) => {setLastName(e.target.value)}}
                    placeholder='Last Name'
                    type="text"
                    name="last-name-edit"
                    id="last-name-edit"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-6">
              <div className="mt-2">
                <input
                    defaultValue={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    placeholder='Email Address'
                    id="email-edit"
                    name="email-edit"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
  )
}
