"use client";

import React, { useState } from "react";
import styles from "./Login.module.scss";
import zod from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define Zod schema for form validation
const FormSchema = zod.object({
  username: zod.string().min(1, "Username is required"),
  password: zod.string().min(1, "Password is required"),
  // .min(8, "Password must have more than 8 characters"),
});

type FormData = zod.infer<typeof FormSchema>;

const LoginView = ({ searchParams }: any) => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const router = useRouter();
  const callbackUrl = searchParams.callbackUrl || "/";

  // Handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      // Validate form data
      FormSchema.parse(formData);
      setFormErrors({}); // Clear errors if validation passes
      const loginData = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
        callbackUrl,
      });

      if (loginData?.error) {
        console.log(loginData.error);
        setFormErrors({ username: "Username or password incorrect" });
      } else {
        router.push(callbackUrl);
      }
    } catch (e) {
      if (e instanceof zod.ZodError) {
        // Map errors to their respective fields
        const errors = e.errors.reduce((acc, err) => {
          acc[err.path[0] as keyof FormData] = err.message;
          return acc;
        }, {} as Partial<FormData>);
        setFormErrors(errors);
      }
    }
  };

  return (
    <div className={styles.login}>
      <h2 className={styles.login_title}>Login Admin</h2>
      <div className={styles.login_error}>
        {Object.values(formErrors).map((error, index) => (
          <div key={index} className={styles.login_error_message}>
            {error}
          </div>
        ))}
      </div>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <div className={styles.login_form_item}>
          <label htmlFor="username" className={styles.login_form_item_label}>
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.login_form_item_input}
          />
        </div>
        <div className={styles.login_form_item}>
          <label htmlFor="password" className={styles.login_form_item_label}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.login_form_item_input}
          />
        </div>
        <button type="submit" className={styles.login_form_button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginView;
