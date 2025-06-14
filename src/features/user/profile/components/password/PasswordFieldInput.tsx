import { ErrorMessage, Field } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { FC, useState } from 'react';

interface PasswordFieldInputProps {
  name: string;
  label: string;
}

const PasswordFieldInput: FC<PasswordFieldInputProps> = ({ name, label }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-6 relative group">
      <Field
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder=" "
        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg peer"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-3 text-base text-gray-500 transition-all duration-200 ease-in-out
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
          peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-600
          bg-white px-1 pointer-events-none"
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      <ErrorMessage name={name} component="div" className="text-sm text-red-500 mt-1" />
    </div>
  );
};

export default PasswordFieldInput;