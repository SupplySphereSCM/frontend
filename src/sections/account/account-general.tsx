import * as Yup from "yup";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
// hooks
import { useRouter } from "src/routes/hooks";
import { useAuthContext } from "src/auth/hooks";
import { useBoolean } from "src/hooks/use-boolean";
// utils
import { fData } from "src/utils/format-number";
import axios, { endpoints } from "src/utils/axios";

// components
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from "src/components/hook-form";
import { ConfirmDialog } from "src/components/custom-dialog";
import { Chip, TextField } from "@mui/material";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const confirm = useBoolean();

  const router = useRouter();

  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string(),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    ethAddress: Yup.string().required("Address is required"),
    profilePictureUrl: Yup.mixed<any>()
      .nullable()
      .required("Avatar is required"),
  });

  const defaultValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    ethAddress: user?.ethAddress || "",
    profilePictureUrl: user?.profilePictureUrl || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar("Update success!");
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("profilePictureUrl", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleDeleteUser = async () => {
    axios.delete(endpoints.auth.delete);
    logout();
    router.replace("/");
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: "center" }}>
              <RHFUploadAvatar
                name="profilePictureUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.disabled",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />

              <Box mt={3}>
                <Chip label={user?.roles[0]} variant="outlined" />
              </Box>

              <Button color="error" sx={{ mt: 3 }} onClick={confirm.onTrue}>
                Delete User
              </Button>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFTextField name="firstName" label="First Name" />
                <RHFTextField name="lastName" label="Last Name" />
                <RHFTextField name="email" label="Email Address" disabled />
              </Box>
              <Box display="flex" sx={{ pt: 3 }} flex={1}>
                <TextField
                  // variant={variant}
                  disabled
                  fullWidth
                  label="Disabled"
                  defaultValue="0xEthaddress"
                />
                {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}> */}
                <LoadingButton
                  sx={{ ml: 2, width: 210 }}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Verify Address
                </LoadingButton>
                {/* </Stack> */}
              </Box>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <RHFTextField name="about" multiline rows={4} label="About" />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to delete?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteUser();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
