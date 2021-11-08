import { useState, useCallback } from "react";
import {
  Input,
  Flex,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { loginApi } from "./api";

const useYupValidationResolver = () => {
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(4, "Must be more than 4 characters")
      .required("Username is required"),
    password: yup
      .string()
      .min(4, "Must be more than 4 characters")
      .required("Password is required"),
  });

  return useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );
};

export const LoginForm = () => {
  const [secure, setSecure] = useState(true);
  const resolver = useYupValidationResolver();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver,
    reValidateMode: "onBlur",
  });

  const onSubmit = async (formData) => {
    try {
      const result = await loginApi(formData.username, formData.password);
      toast({
        title: result ? result : "Login successful",
        position: "top",
        status: result?.includes("Username") ? "error" : "success",
      });
      if (result === "Login successful") {
        setIsAuthenticated(true);
      }
    } catch (error) {
      toast({
        title: error.message,
        position: "top",
        status: "error",
      });
    }
  };

  return (
    <Flex flexDir="column" mt="8">
      {!isAuthenticated ? (
        <>
          <Flex flexDir="column" align="flex-start" mb="6">
            <Text mb="2">Username</Text>
            <InputGroup>
              <Input
                placeholder="Username"
                {...register("username")}
                focusBorderColor={errors?.username ? "red.500" : undefined}
              />
            </InputGroup>
            {errors?.username?.message ? (
              <Flex
                sx={{
                  justifyContent: "center",
                  pt: 2,
                }}
              >
                <Text>{errors?.username?.message}</Text>
              </Flex>
            ) : null}
          </Flex>
          <Flex flexDir="column" align="flex-start" mb="6">
            <Text mb="2">Password</Text>
            <InputGroup>
              <InputRightElement
                children={
                  secure ? (
                    <ViewIcon
                      color="gray.300"
                      onClick={() => setSecure(false)}
                      cursor="pointer"
                    />
                  ) : (
                    <ViewOffIcon
                      color="gray.300"
                      onClick={() => setSecure(true)}
                      cursor="pointer"
                    />
                  )
                }
              />
              <Input
                focusBorderColor={errors?.password ? "red.500" : undefined}
                type={secure ? "password" : "text"}
                placeholder="Password"
                {...register("password")}
              />
            </InputGroup>
            {errors?.password?.message ? (
              <Flex
                sx={{
                  justifyContent: "center",
                  pt: 2,
                }}
              >
                <Text>{errors?.password?.message}</Text>
              </Flex>
            ) : null}
          </Flex>
          <Button onClick={handleSubmit(onSubmit)}>Login</Button>
        </>
      ) : (
        <>
          <Text mb="4">You are logged in</Text>
          <Button onClick={() => setIsAuthenticated(false)}>Logout</Button>
        </>
      )}
    </Flex>
  );
};
