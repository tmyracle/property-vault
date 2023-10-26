/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import React, { useState, forwardRef, type ChangeEvent } from "react";
import { Input, type InputProps } from "~/app/_components/ui/input";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";

interface PhoneNumberInputProps extends Omit<InputProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>("");

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
      const inputNumber = event.target.value;
      const asYouType = new AsYouType("US").input(inputNumber);
      setDisplayValue(asYouType);

      const phoneNumber = parsePhoneNumberFromString(inputNumber, "US");
      const e164value = phoneNumber?.format("E.164") ?? "";
      onChange(e164value);
    };

    return (
      <Input
        ref={ref}
        value={displayValue}
        onChange={handleOnChange}
        {...props}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput; // If you're using default exports
