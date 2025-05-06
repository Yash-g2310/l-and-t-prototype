"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from '../context/AuthContext';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconEye,
  IconEyeOff,
  IconLock,
  IconCheck,
  IconAlertCircle,
  IconLoader2,
} from "@tabler/icons-react";

export default function SignupFormDemo({ onSwitchToSignin }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "worker", // Default role
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [apiError, setApiError] = useState(""); // State for API error

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));

    // Password strength indicator
    if (id === 'password') {
      let strength = 0;
      if (value.length > 6) strength += 1;
      if (value.match(/[A-Z]/)) strength += 1;
      if (value.match(/[0-9]/)) strength += 1;
      if (value.match(/[^A-Za-z0-9]/)) strength += 1;
      setPasswordStrength(strength);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(""); // Reset API error
    setErrors({}); // Reset errors

    // Validate form
    const newErrors = {};
    if (!formValues.firstname) newErrors.firstname = "First name is required";
    if (!formValues.email) newErrors.email = "Email is required";
    if (!formValues.password) newErrors.password = "Password is required";
    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Format data for the API
        const userData = {
          username: formValues.email,
          email: formValues.email,
          password: formValues.password,
          password2: formValues.confirmPassword,
          first_name: formValues.firstname,
          last_name: formValues.lastname || "",
          role: formValues.role,
        };
        
        await register(userData);
      } catch (error) {
        // Keep your error handling as is
        if (error.errors) {
          const serverErrors = {};
          
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field])) {
              serverErrors[field] = error.errors[field].join(' ');
            } else {
              serverErrors[field] = error.errors[field];
            }
          });
          
          setErrors(prev => ({ ...prev, ...serverErrors }));
          
          if (error.errors.detail || error.errors.non_field_errors) {
            setApiError(error.errors.detail || error.errors.non_field_errors);
          }
        } else {
          setApiError(error.message || "Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome
      </h2>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Create your account to get started
      </p>

      {apiError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          <IconAlertCircle className="inline-block h-4 w-4 mr-2" />
          {apiError}
        </div>
      )}

<form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="Tyler"
              type="text"
              value={formValues.firstname}
              onChange={handleChange}
              className={`transition duration-200 focus:ring-2 focus:ring-cyan-500/20 ${errors.firstname ? 'border-red-500' : ''}`}
            />
            {errors.firstname && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <IconAlertCircle className="h-3 w-3 mr-1" />
                {errors.firstname}
              </p>
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Durden"
              type="text"
              value={formValues.lastname}
              onChange={handleChange}
              className="transition duration-200 focus:ring-2 focus:ring-cyan-500/20"
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              className={`pr-10 transition duration-200 focus:ring-2 focus:ring-cyan-500/20 ${errors.email ? 'border-red-500' : ''}`}
            />
            {formValues.email && formValues.email.includes('@') && formValues.email.includes('.') ? (
              <IconCheck size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            ) : null}
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center">
              <IconAlertCircle className="h-3 w-3 mr-1" />
              {errors.email}
            </p>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={formValues.role}
            onChange={handleChange}
            className={`flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm transition duration-200 focus:ring-2 focus:ring-cyan-500/20 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white ${errors.role ? 'border-red-500' : ''}`}
          >
            <option value="worker">Worker</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={formValues.password}
              onChange={handleChange}
              className={`pr-10 transition duration-200 focus:ring-2 focus:ring-cyan-500/20 ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          </div>
          {passwordStrength > 0 && (
            <div className="mt-2">
              <div className="flex space-x-1 mb-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-full rounded-full ${passwordStrength >= level
                        ? level <= 1 ? 'bg-red-500'
                          : level <= 2 ? 'bg-orange-500'
                            : level <= 3 ? 'bg-yellow-500'
                              : 'bg-green-500'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                  />
                ))}
              </div>
              {passwordStrength >= 3 && (
                <p className="text-xs text-green-500 flex items-center">
                  <IconCheck className="h-3 w-3 mr-1" />
                  Strong password
                </p>
              )}
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 flex items-center">
              <IconAlertCircle className="h-3 w-3 mr-1" />
              {errors.password}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters with mix of letters, numbers and symbols
          </p>
        </LabelInputContainer>

        <LabelInputContainer className="mb-6">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              onChange={handleChange}
              className={`pr-10 transition duration-200 focus:ring-2 focus:ring-cyan-500/20 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {formValues.confirmPassword && formValues.password === formValues.confirmPassword ? (
              <IconCheck size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            ) : (
              <IconLock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1 flex items-center">
              <IconAlertCircle className="h-3 w-3 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </LabelInputContainer>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <button
          className="group/btn relative flex justify-center items-center h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {loading ? "Signing up..." : "Sign up →"}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
            type="button"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
            type="button"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <button
            onClick={onSwitchToSignin}
            className="font-medium text-cyan-600 hover:text-cyan-500 hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);