import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Heading, Spinner, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/auth";

type Status = {
  level: "error" | "info",
  message: string;
}

export default function Login() {
  const {
    login
  } = useAuth();

  const navigate = useNavigate();
  const [ status, setStatus ] = useState<Status | undefined>();

  return (
    <Flex
      justifyContent={"center"}
    >
      <Box
        maxW={"400px"}
        mt={5}
        p={5}
        w={"100%"}
      >
        <Box
          mb={5}
        >
          <Heading size={"lg"}>Login to Porla</Heading>
        </Box>

        <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          onSubmit={async (values) => {
            setStatus({ level: "info", message: "Signing in" });
            await login(values.username, values.password);
            return navigate("/");
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack spacing={5}>
                <Field name="username">
                  {(w: any) => (
                    <FormControl isDisabled={isSubmitting}>
                      <FormLabel>Username</FormLabel>
                      <Input {...w.field} />
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {(w: any) => (
                    <FormControl isDisabled={isSubmitting} mt={3}>
                      <FormLabel>Password</FormLabel>
                      <Input {...w.field} type={"password"} />
                    </FormControl>
                  )}
                </Field>
              </VStack>

              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                mt={5}
              >
                <Flex alignItems={"center"} visibility={!!status ? "visible" : "hidden"}>
                  <Spinner me={2} size={"sm"} />
                  <Text fontSize={"sm"}>{status?.message}</Text>
                </Flex>

                <Flex alignItems={"center"}>
                  <Button
                    colorScheme={"purple"}
                    disabled={isSubmitting}
                    type={"submit"}
                  >
                      Login
                  </Button>
                </Flex>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  )
}
