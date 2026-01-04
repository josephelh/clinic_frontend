import React from "react";

// Define the interface to include standard HTML Input props
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  extra?: string;
  placeholder?: string;
  variant?: string;
  state?: "error" | "success";
  disabled?: boolean;
  type?: string;
}

function InputField(props: Props) {
  const {
    label,
    id,
    extra,
    type,
    placeholder,
    variant,
    state,
    disabled,
    value,      // Explicitly pull value
    onChange,   // Explicitly pull onChange
    ...rest     // Capture any other standard props (onBlur, onFocus, etc.)
  } = props;

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        }`}
      >
        {label}
      </label>
      <input
        {...rest}
        disabled={disabled}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5"
            : state === "error"
            ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
            : state === "success"
            ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
            : "border-gray-200 dark:!border-white/10 dark:text-white"
        }`}
      />
    </div>
  );
}

export default InputField;