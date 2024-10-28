import { ChangeEvent, FormEvent, useState } from "react";
import Input from "../../components/Input";
import LOGO from "../../assets/tractian.png";
import Button from "../../components/Button";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.email) newErrors.email = "Insira o e-mail";
    if (!formData.password) newErrors.password = "Insira a senha";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted", formData);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center sm:bg-primary">
      <div className="flex flex-col gap-4 w-[450px] text-primary sm:border-2 bg-white border-primary p-12 rounded-2xl">
        <img src={LOGO} className="mb-8 w-52 self-center"></img>
        <div className="text-center text-3xl font-bold">Login</div>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          errors={errors.email}
        />
        <Input
          label="Senha"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          errors={errors.password}
        />
        <div className="self-center mt-3">
          <Button type="submit" onClick={handleSubmit}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
