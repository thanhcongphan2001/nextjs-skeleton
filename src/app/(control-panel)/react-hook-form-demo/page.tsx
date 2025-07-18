"use client";

import React, { useState } from "react";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DevTool } from "@hookform/devtools";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
  Stack,
  Container,
  Divider,
  Avatar,
  LinearProgress,
  FormHelperText,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

// Zod Schema for validation
const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  age: z.coerce
    .number()
    .min(18, "Must be at least 18 years old")
    .max(100, "Please enter a valid age"),
  department: z.string().min(1, "Department is required"),
  skills: z.array(z.string()).default([]),
  bio: z.string().optional(),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to terms and conditions"),
  newsletter: z.boolean().default(false),
});

type UserFormData = z.infer<typeof userSchema>;

/**
 * Live Preview Component for React Hook Form - Demonstrates shared state
 */
function LivePreviewComponent() {
  const { watch, formState } = useFormContext<UserFormData>();

  // Watch all form values
  const allValues = watch();

  // Watch specific fields for better performance
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const age = watch("age");
  const department = watch("department");
  const skills = watch("skills");
  const bio = watch("bio");

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)",
        mb: 4,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, #5a9fd4 0%, #3e7cb8 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          <FuseSvgIcon sx={{ mr: 1 }}>lucide:eye</FuseSvgIcon>
          Live Preview (Shared State với useFormContext)
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Dữ liệu form được chia sẻ real-time qua FormProvider:
          </Typography>

          <Box sx={{ display: "grid", gap: 1, mt: 2 }}>
            <Typography variant="body2">
              <strong>Họ tên:</strong> {firstName} {lastName}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {email || "Chưa nhập"}
            </Typography>
            <Typography variant="body2">
              <strong>Tuổi:</strong> {age || "Chưa nhập"}
            </Typography>
            <Typography variant="body2">
              <strong>Phòng ban:</strong> {department || "Chưa chọn"}
            </Typography>
            <Typography variant="body2">
              <strong>Kỹ năng:</strong>{" "}
              {skills?.length > 0 ? skills.join(", ") : "Chưa chọn"}
            </Typography>
            <Typography variant="body2">
              <strong>Mô tả:</strong>{" "}
              {bio ? `${bio.substring(0, 50)}...` : "Chưa nhập"}
            </Typography>
          </Box>

          {/* Form State Indicators */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Chip
              label={formState.isDirty ? "Đã chỉnh sửa" : "Chưa chỉnh sửa"}
              color={formState.isDirty ? "warning" : "default"}
              size="small"
            />
            <Chip
              label={formState.isValid ? "Hợp lệ" : "Không hợp lệ"}
              color={formState.isValid ? "success" : "error"}
              size="small"
            />
            <Chip
              label={formState.isSubmitting ? "Đang submit" : "Sẵn sàng"}
              color={formState.isSubmitting ? "info" : "default"}
              size="small"
            />
          </Box>

          {/* Performance Note */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              <strong>Note:</strong> React Hook Form sử dụng watch() để share
              state. Mỗi lần watch() được gọi có thể gây re-render component
              này.
            </Typography>
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * React Hook Form Demo Page
 */
function ReactHookFormDemoPage() {
  const [submittedData, setSubmittedData] = useState<UserFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup - get all methods for FormProvider
  const methods = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      department: "",
      skills: [],
      bio: "",
      agreeToTerms: false,
      newsletter: false,
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty, isSubmitting: formIsSubmitting },
  } = methods;

  const watchedValues = watch();

  const onSubmit = async (data: UserFormData) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmittedData(data);
      console.log("Form submission successful");

      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillOptions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Go",
    "Rust",
  ];

  const departmentOptions = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Design",
  ];

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #a8d8ea 0%, #7fb3d3 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              color: "white",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <FuseSvgIcon sx={{ fontSize: "2.5rem" }}>
                lucide:clipboard-list
              </FuseSvgIcon>
            </Avatar>

            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                mb: 2,
              }}
            >
              React Hook Form Demo
            </Typography>

            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                maxWidth: "600px",
                mx: "auto",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                fontWeight: 300,
              }}
            >
              Performant forms with easy validation using React Hook Form and
              Zod
            </Typography>
          </Box>

          {/* Live Preview Component - Demonstrates shared state */}
          <LivePreviewComponent />

          {/* Features Alert */}
          <Alert
            severity="success"
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              <strong>🚀 Features:</strong> Minimal re-renders • Zod validation
              • Built-in accessibility • Easy integration • Excellent
              performance • TypeScript support
            </Typography>
          </Alert>

          <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
            {/* Form Section */}
            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {(isSubmitting || formIsSubmitting) && (
                  <LinearProgress
                    sx={{
                      height: 3,
                      background:
                        "linear-gradient(90deg, #a8d8ea 0%, #7fb3d3 100%)",
                    }}
                  />
                )}

                <form
                  onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.log("Form validation errors:", errors);
                  })}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        background:
                          "linear-gradient(135deg, #5a9fd4 0%, #3e7cb8 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 3,
                      }}
                    >
                      User Registration Form
                    </Typography>

                    <Stack spacing={3}>
                      {/* Name Fields */}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Controller
                          name="firstName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="First Name"
                              error={!!errors.firstName}
                              helperText={errors.firstName?.message}
                              required
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          name="lastName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Last Name"
                              error={!!errors.lastName}
                              helperText={errors.lastName?.message}
                              required
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Stack>

                      {/* Email & Age */}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Email"
                              type="email"
                              error={!!errors.email}
                              helperText={errors.email?.message}
                              required
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          name="age"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Age"
                              type="number"
                              error={!!errors.age}
                              helperText={errors.age?.message}
                              inputProps={{ min: 18, max: 100 }}
                              required
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#5a9fd4",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      {/* Department & Skills */}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Controller
                          name="department"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.department}>
                              <InputLabel>Department *</InputLabel>
                              <Select
                                {...field}
                                label="Department *"
                                sx={{ borderRadius: 2 }}
                              >
                                {departmentOptions.map((dept) => (
                                  <MenuItem key={dept} value={dept}>
                                    {dept}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.department && (
                                <FormHelperText>
                                  {errors.department.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />

                        <Controller
                          name="skills"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>Skills</InputLabel>
                              <Select
                                {...field}
                                multiple
                                label="Skills"
                                sx={{ borderRadius: 2 }}
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {(selected as string[]).map((value) => (
                                      <Chip
                                        key={value}
                                        label={value}
                                        size="small"
                                        sx={{
                                          background:
                                            "linear-gradient(135deg, #a8d8ea 0%, #7fb3d3 100%)",
                                          color: "white",
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              >
                                {skillOptions.map((skill) => (
                                  <MenuItem key={skill} value={skill}>
                                    {skill}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Stack>

                      {/* Bio */}
                      <Controller
                        name="bio"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Bio"
                            multiline
                            rows={4}
                            placeholder="Tell us about yourself..."
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#5a9fd4",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#5a9fd4",
                                },
                              },
                            }}
                          />
                        )}
                      />

                      <Divider sx={{ my: 2 }} />

                      {/* Checkboxes */}
                      <Stack spacing={2}>
                        <Controller
                          name="agreeToTerms"
                          control={control}
                          render={({ field }) => (
                            <Box>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    sx={{
                                      color: errors.agreeToTerms
                                        ? "error.main"
                                        : "primary.main",
                                      "&.Mui-checked": {
                                        color: "#5a9fd4",
                                      },
                                    }}
                                  />
                                }
                                label="I agree to the terms and conditions *"
                              />
                              {errors.agreeToTerms && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  display="block"
                                  sx={{ ml: 4 }}
                                >
                                  {errors.agreeToTerms.message}
                                </Typography>
                              )}
                            </Box>
                          )}
                        />

                        <Controller
                          name="newsletter"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  sx={{
                                    "&.Mui-checked": {
                                      color: "#5a9fd4",
                                    },
                                  }}
                                />
                              }
                              label="Subscribe to newsletter"
                            />
                          )}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      px: 4,
                      pb: 4,
                      pt: 0,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => reset()}
                      startIcon={<FuseSvgIcon>lucide:refresh-cw</FuseSvgIcon>}
                      disabled={isSubmitting || formIsSubmitting}
                      sx={{
                        borderRadius: 2,
                        borderColor: "#5a9fd4",
                        color: "#5a9fd4",
                        "&:hover": {
                          borderColor: "#3e7cb8",
                          background: "rgba(90, 159, 212, 0.04)",
                        },
                      }}
                    >
                      Reset Form
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => {
                        console.log("Current form state:", {
                          values: watchedValues,
                          errors,
                          isValid,
                          isDirty,
                          formIsSubmitting,
                        });
                      }}
                      sx={{ color: "#5a9fd4", mr: 2 }}
                    >
                      Debug
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || formIsSubmitting}
                      startIcon={
                        isSubmitting || formIsSubmitting ? (
                          <FuseSvgIcon>lucide:loader-2</FuseSvgIcon>
                        ) : (
                          <FuseSvgIcon>lucide:send</FuseSvgIcon>
                        )
                      }
                      sx={{
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #5a9fd4 0%, #3e7cb8 100%)",
                        boxShadow: "0 4px 15px rgba(90, 159, 212, 0.4)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #4a8bc2 0%, #2e6ba0 100%)",
                          boxShadow: "0 6px 20px rgba(90, 159, 212, 0.6)",
                        },
                        "& .lucide-loader-2": {
                          animation: "spin 1s linear infinite",
                        },
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    >
                      {isSubmitting || formIsSubmitting
                        ? "Submitting..."
                        : "Submit Form"}
                    </Button>
                  </CardActions>
                </form>
              </Card>
            </Box>

            {/* Sidebar */}
            <Box sx={{ width: { xs: "100%", lg: "400px" } }}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      background:
                        "linear-gradient(135deg, #5a9fd4 0%, #3e7cb8 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    <FuseSvgIcon sx={{ mr: 1 }}>lucide:info</FuseSvgIcon>
                    Form State
                  </Typography>

                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Can Submit:</Typography>
                      <Chip
                        label={
                          isValid && !isSubmitting && !formIsSubmitting
                            ? "Yes"
                            : "No"
                        }
                        color={
                          isValid && !isSubmitting && !formIsSubmitting
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Is Valid:</Typography>
                      <Chip
                        label={isValid ? "Yes" : "No"}
                        color={isValid ? "success" : "error"}
                        size="small"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Is Dirty:</Typography>
                      <Chip
                        label={isDirty ? "Yes" : "No"}
                        color={isDirty ? "warning" : "default"}
                        size="small"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Is Submitting:</Typography>
                      <Chip
                        label={formIsSubmitting ? "Yes" : "No"}
                        color={formIsSubmitting ? "info" : "default"}
                        size="small"
                      />
                    </Box>

                    {Object.keys(errors).length > 0 && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="error"
                          gutterBottom
                        >
                          Validation Errors:
                        </Typography>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "error.light",
                            color: "error.contrastText",
                            borderRadius: 2,
                          }}
                        >
                          <pre
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {JSON.stringify(errors, null, 2)}
                          </pre>
                        </Paper>
                      </Box>
                    )}

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Values:
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          maxHeight: 200,
                          overflow: "auto",
                        }}
                      >
                        <pre
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {JSON.stringify(watchedValues, null, 2)}
                        </pre>
                      </Paper>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Features Card */}
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      background:
                        "linear-gradient(135deg, #5a9fd4 0%, #3e7cb8 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    React Hook Form Features
                  </Typography>

                  <Stack spacing={1}>
                    {[
                      "Minimal re-renders",
                      "Easy validation with Zod",
                      "Built-in performance optimization",
                      "Uncontrolled components",
                      "Easy integration",
                      "Small bundle size",
                      "No dependencies",
                      "Excellent TypeScript support",
                    ].map((feature, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <FuseSvgIcon
                          sx={{ mr: 1, color: "#5a9fd4", fontSize: "1rem" }}
                        >
                          lucide:check-circle
                        </FuseSvgIcon>
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Stack>

          {/* Results Section */}
          {submittedData && (
            <Card
              sx={{
                mt: 4,
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    background:
                      "linear-gradient(135deg, #5a9fd4 0%, #3e7cb8 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  <FuseSvgIcon sx={{ mr: 2 }}>lucide:check-circle</FuseSvgIcon>
                  Form Submission Results
                </Typography>

                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    border: "1px solid rgba(255, 107, 107, 0.1)",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      overflow: "auto",
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    }}
                  >
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                </Paper>
              </CardContent>
            </Card>
          )}
          {/* React Hook Form DevTools */}
          <Box sx={{ position: "fixed", bottom: 0, right: 0, zIndex: 9999 }}>
            <DevTool control={control} />
          </Box>
        </Container>
      </Box>
    </FormProvider>
  );
}

export default ReactHookFormDemoPage;
