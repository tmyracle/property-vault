/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useState, type ChangeEvent } from "react";
import { Input, type InputProps } from "~/app/_components/ui/input";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";

interface PhoneNumberInputProps extends Omit<InputProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneInput: React.FC<PhoneNumberInputProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value,
  onChange,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputNumber = event.target.value;
    const asYouType = new AsYouType("US").input(inputNumber);
    setDisplayValue(asYouType);

    const phoneNumber = parsePhoneNumberFromString(inputNumber, "US");
    const e164value = phoneNumber?.format("E.164") ?? "";
    onChange(e164value);
  };

  return <Input value={displayValue} onChange={handleOnChange} {...props} />;
};
