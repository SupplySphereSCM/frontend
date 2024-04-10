import * as Yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
import { useRouter, useSearchParams } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { AuthProvider } from "src/auth/context/jwt";
import { useAuthContext } from "src/auth/hooks";
import { PATH_AFTER_LOGIN } from "src/config-global";

import Iconify from "src/components/iconify";
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import { Menu, MenuItem, Select } from "@mui/material";

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo");

  const password = useBoolean();

  enum Roles {
    SELLER = "SELLER",
    MANUFACTURER = "MANUFACTURER",
    TRANSPORTER = "TRANSPORTER",
    RETAILER = "RETAILER",
  }

  const RegisterSchema = Yup.object().shape({
    // firstName: Yup.string().required('First name required'),
    // lastName: Yup.string().required('Last name required'),
    role: Yup.string()
      .oneOf(Object.values(Roles).map((role) => role.toString()))
      .required("Role is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    // firstName: '',
    // lastName: '',
    role: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);

      // await register?.(data.email, data.password, data.firstName, data.lastName);
      await register?.(data.email, data.password, data.role);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === "string" ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link
          href={paths.auth.jwt.login}
          component={RouterLink}
          variant="subtitle2"
        >
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: "center",
        typography: "caption",
        color: "text.secondary",
      }}
    >
      {"By signing up, I agree to "}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {" and "}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        
      </Stack> */}

      {/* <Select name="role" label="Role">
        <MenuItem value="Seller">Seller</MenuItem>
        <MenuItem value="Manufacturer">Manufacturer</MenuItem>
        <MenuItem value="Transporter">Transporter</MenuItem>
        <MenuItem value="Retailer">Retailer</MenuItem>
      </Select> */}

      <RHFSelect name="role" label="Role">
        {Object.values(Roles).map((role) => (
          <MenuItem value={role}>{role}</MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      {renderTerms}
    </>
  );
}
