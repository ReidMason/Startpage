import type { UseFormRegisterReturn } from "react-hook-form";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import Input from "../../../../../input/Input";

interface BaseTextSettingProps {
  label: string;
  formRegister: UseFormRegisterReturn;
}

export default function BaseTextSetting({
  label,
  formRegister,
}: BaseTextSettingProps) {
  return (
    <FormElementWrapper label={label}>
      <Input register={formRegister} />
    </FormElementWrapper>
  );
}
