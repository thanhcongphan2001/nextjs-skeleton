"use client";

import React, { useState } from "react";
import { useForm, FormApi } from "@tanstack/react-form";
import { z } from "zod";
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
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

// Types
interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  skills: string[];
  bio: string;
  agreeToTerms: boolean;
  newsletter: boolean;
}

// Zod Schema for validation
const userSchema = z.object({
  firstName: z
    .string()
    .min(1, "Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  lastName: z
    .string()
    .min(1, "Họ là bắt buộc")
    .min(2, "Họ phải có ít nhất 2 ký tự"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  age: z
    .number()
    .min(18, "Tuổi phải từ 18 trở lên")
    .max(100, "Tuổi không được quá 100"),
  department: z.string().min(1, "Phòng ban là bắt buộc"),
  skills: z.array(z.string()).min(1, "Phải chọn ít nhất 1 kỹ năng"),
  bio: z
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả không được quá 500 ký tự"),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "Phải đồng ý với điều khoản"),
  newsletter: z.boolean().optional(),
});

// Validation functions using Zod
const validateField = (fieldName: keyof UserFormData, value: any) => {
  try {
    const fieldSchema = userSchema.shape[fieldName];
    fieldSchema.parse(value);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Validation error";
  }
};

// Async validation for email uniqueness
const validateEmailAsync = async (email: string) => {
  if (!email) return undefined;

  // Simulate API call to check email uniqueness
  await new Promise((resolve) => setTimeout(resolve, 500));

  const existingEmails = [
    "admin@example.com",
    "user@test.com",
    "demo@demo.com",
  ];
  if (existingEmails.includes(email.toLowerCase())) {
    return "Email này đã được sử dụng";
  }

  return undefined;
};

// Legacy validation functions (keeping for compatibility)
const validateEmail = (email: string) => {
  return validateField("email", email);
};

const validateAge = (age: number) => {
  return validateField("age", age);
};

const validateRequired = (value: any, fieldName: string) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return undefined;
};

/**
 * Live Preview Component - Demonstrates sharing form state
 */
function LivePreviewComponent({ form }: { form: FormApi<UserFormData> }) {
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
            background: "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          <FuseSvgIcon sx={{ mr: 1 }}>lucide:eye</FuseSvgIcon>
          Live Preview (Shared State)
        </Typography>

        <form.Subscribe
          selector={(state) => state.values}
          children={(values) => (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Dữ liệu form được chia sẻ real-time:
              </Typography>

              <Box sx={{ display: "grid", gap: 1, mt: 2 }}>
                <Typography variant="body2">
                  <strong>Họ tên:</strong> {values.firstName} {values.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {values.email || "Chưa nhập"}
                </Typography>
                <Typography variant="body2">
                  <strong>Tuổi:</strong> {values.age || "Chưa nhập"}
                </Typography>
                <Typography variant="body2">
                  <strong>Phòng ban:</strong> {values.department || "Chưa chọn"}
                </Typography>
                <Typography variant="body2">
                  <strong>Kỹ năng:</strong>{" "}
                  {values.skills.length > 0
                    ? values.skills.join(", ")
                    : "Chưa chọn"}
                </Typography>
                <Typography variant="body2">
                  <strong>Mô tả:</strong>{" "}
                  {values.bio
                    ? `${values.bio.substring(0, 50)}...`
                    : "Chưa nhập"}
                </Typography>
              </Box>

              {/* Form State Indicators */}
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <form.Subscribe
                  selector={(state) => state.isDirty}
                  children={(isDirty) => (
                    <Chip
                      label={isDirty ? "Đã chỉnh sửa" : "Chưa chỉnh sửa"}
                      color={isDirty ? "warning" : "default"}
                      size="small"
                    />
                  )}
                />
                <form.Subscribe
                  selector={(state) => state.isValid}
                  children={(isValid) => (
                    <Chip
                      label={isValid ? "Hợp lệ" : "Không hợp lệ"}
                      color={isValid ? "success" : "error"}
                      size="small"
                    />
                  )}
                />
              </Box>
            </Box>
          )}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Beautiful TanStack Form Demo Page
 */
function TanStackFormDemoPageBeautiful() {
  const [submittedData, setSubmittedData] = useState<UserFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TanStack Form
  const form = useForm<UserFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
      department: "",
      skills: [],
      bio: "",
      agreeToTerms: false,
      newsletter: false,
    },
    // Form-level validation using Zod
    validators: {
      onChange: ({ value }) => {
        // Validate toàn bộ form với Zod schema
        try {
          userSchema.parse(value);
          return undefined; // No errors
        } catch (error) {
          if (error instanceof z.ZodError) {
            // Convert Zod errors to form errors
            const formErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
              if (err.path.length > 0) {
                formErrors[err.path[0] as string] = err.message;
              }
            });
            return formErrors;
          }
        }
      },
      // Async validation for email uniqueness
      onChangeAsync: async ({ value }) => {
        if (value.email) {
          const emailError = await validateEmailAsync(value.email);
          if (emailError) {
            return { email: emailError };
          }
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmittedData(value);
      setIsSubmitting(false);

      // Reset form after successful submission
      form.reset();
    },
  });

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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)",
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
              lucide:form-input
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
            TanStack Form Demo
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
            Experience type-safe forms with real-time validation and beautiful
            Material-UI integration
          </Typography>
        </Box>

        {/* Live Preview Component - Demonstrates shared state */}
        <LivePreviewComponent form={form} />

        {/* Features Alert */}
        <Alert
          severity="info"
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
            <strong>✨ Features:</strong> Real-time validation • Type safety •
            Field-level validation • Form state management • Seamless
            Material-UI integration
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
              {isSubmitting && (
                <LinearProgress
                  sx={{
                    height: 3,
                    background:
                      "linear-gradient(90deg, #4a7c59 0%, #2d5a3d 100%)",
                  }}
                />
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
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
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <form.Field
                        name="firstName"
                        // No field-level validators needed - using form-level validation
                        children={(field) => (
                          <TextField
                            fullWidth
                            label="First Name"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={!!field.state.meta.errors.length}
                            helperText={field.state.meta.errors[0] as string}
                            required
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#4a7c59",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#4a7c59",
                                },
                              },
                            }}
                          />
                        )}
                      />

                      <form.Field
                        name="lastName"
                        // No field-level validators needed - using form-level validation
                        children={(field) => (
                          <TextField
                            fullWidth
                            label="Last Name"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={!!field.state.meta.errors.length}
                            helperText={field.state.meta.errors[0] as string}
                            required
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#4a7c59",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#4a7c59",
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </Stack>

                    {/* Email & Age */}
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <form.Field
                        name="email"
                        // Email validation handled at form level + async validation
                        children={(field) => (
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={!!field.state.meta.errors.length}
                            helperText={field.state.meta.errors[0] as string}
                            required
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#4a7c59",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#4a7c59",
                                },
                              },
                            }}
                          />
                        )}
                      />

                      <form.Field
                        name="age"
                        // Age validation handled at form level
                        children={(field) => (
                          <TextField
                            fullWidth
                            label="Age"
                            type="number"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            onBlur={field.handleBlur}
                            error={!!field.state.meta.errors.length}
                            helperText={field.state.meta.errors[0] as string}
                            inputProps={{ min: 18, max: 100 }}
                            required
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: "#4a7c59",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#4a7c59",
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Department & Skills */}
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <form.Field
                        name="department"
                        validators={{
                          onChange: ({ value }) =>
                            validateRequired(value, "Department"),
                        }}
                        children={(field) => (
                          <FormControl
                            fullWidth
                            error={!!field.state.meta.errors.length}
                          >
                            <InputLabel>Department *</InputLabel>
                            <Select
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              label="Department *"
                              sx={{ borderRadius: 2 }}
                            >
                              {departmentOptions.map((dept) => (
                                <MenuItem key={dept} value={dept}>
                                  {dept}
                                </MenuItem>
                              ))}
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, ml: 1.5 }}
                              >
                                {field.state.meta.errors[0] as string}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />

                      <form.Field
                        name="skills"
                        children={(field) => (
                          <FormControl fullWidth>
                            <InputLabel>Skills</InputLabel>
                            <Select
                              multiple
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value as string[])
                              }
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
                                          "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
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
                    <form.Field
                      name="bio"
                      children={(field) => (
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={4}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Tell us about yourself..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": {
                                borderColor: "#4a7c59",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#4a7c59",
                              },
                            },
                          }}
                        />
                      )}
                    />

                    <Divider sx={{ my: 2 }} />

                    {/* Checkboxes */}
                    <Stack spacing={2}>
                      <form.Field
                        name="agreeToTerms"
                        validators={{
                          onChange: ({ value }) =>
                            !value
                              ? "You must agree to terms and conditions"
                              : undefined,
                        }}
                        children={(field) => (
                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.checked)
                                  }
                                  sx={{
                                    color:
                                      field.state.meta.errors.length > 0
                                        ? "error.main"
                                        : "primary.main",
                                    "&.Mui-checked": {
                                      color: "#4a7c59",
                                    },
                                  }}
                                />
                              }
                              label="I agree to the terms and conditions *"
                            />
                            {field.state.meta.errors.length > 0 && (
                              <Typography
                                variant="caption"
                                color="error"
                                display="block"
                                sx={{ ml: 4 }}
                              >
                                {field.state.meta.errors[0] as string}
                              </Typography>
                            )}
                          </Box>
                        )}
                      />

                      <form.Field
                        name="newsletter"
                        children={(field) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.checked)
                                }
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#4a7c59",
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
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => form.reset()}
                      startIcon={<FuseSvgIcon>lucide:refresh-cw</FuseSvgIcon>}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: 2,
                        borderColor: "#4a7c59",
                        color: "#4a7c59",
                        "&:hover": {
                          borderColor: "#2d5a3d",
                          background: "rgba(74, 124, 89, 0.04)",
                        },
                      }}
                    >
                      Reset Form
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => {
                        const state = form.state;
                        console.log("TanStack Form state:", {
                          values: state.values,
                          errors: state.errors,
                          canSubmit: state.canSubmit,
                          isSubmitting: state.isSubmitting,
                          isDirty: state.isDirty,
                          isValid: state.isValid,
                        });
                      }}
                      sx={{ color: "#4a7c59" }}
                    >
                      Debug
                    </Button>
                  </Stack>

                  <form.Subscribe
                    selector={(state) => [
                      state.canSubmit,
                      state.isSubmitting,
                      state.isDirty,
                    ]}
                    children={([canSubmit, isSubmitting, isDirty]) => {
                      // Force canSubmit to be false initially until user interacts
                      const hasInteracted = isDirty;
                      const adjustedCanSubmit = hasInteracted
                        ? canSubmit
                        : false;

                      return (
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={!adjustedCanSubmit || isSubmitting}
                          startIcon={
                            isSubmitting ? (
                              <FuseSvgIcon>lucide:loader-2</FuseSvgIcon>
                            ) : (
                              <FuseSvgIcon>lucide:send</FuseSvgIcon>
                            )
                          }
                          sx={{
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
                            boxShadow: "0 4px 15px rgba(74, 124, 89, 0.4)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #3d6b4a 0%, #1f4a2b 100%)",
                              boxShadow: "0 6px 20px rgba(74, 124, 89, 0.6)",
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
                          {isSubmitting ? "Submitting..." : "Submit Form"}
                        </Button>
                      );
                    }}
                  />
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
                      "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  <FuseSvgIcon sx={{ mr: 1 }}>lucide:info</FuseSvgIcon>
                  Form State
                </Typography>

                <form.Subscribe
                  selector={(state) => [
                    state.values,
                    state.errors,
                    state.canSubmit,
                    state.isSubmitting,
                    state.isDirty,
                    state.isValid,
                    state.fieldMeta,
                  ]}
                  children={([
                    values,
                    errors,
                    canSubmit,
                    isSubmitting,
                    isDirty,
                    isValid,
                    fieldMeta,
                  ]) => {
                    // Force canSubmit and isValid to be false initially until user interacts
                    const hasInteracted = isDirty;
                    const adjustedCanSubmit = hasInteracted ? canSubmit : false;
                    const adjustedIsValid = hasInteracted ? isValid : false;

                    return (
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
                            label={adjustedCanSubmit ? "Yes" : "No"}
                            color={adjustedCanSubmit ? "success" : "default"}
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
                            label={adjustedIsValid ? "Yes" : "No"}
                            color={adjustedIsValid ? "success" : "error"}
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
                          <Typography variant="body2">
                            Is Submitting:
                          </Typography>
                          <Chip
                            label={isSubmitting ? "Yes" : "No"}
                            color={isSubmitting ? "info" : "default"}
                            size="small"
                          />
                        </Box>

                        {/* Debug button to check errors structure */}
                        <Button
                          variant="text"
                          size="small"
                          onClick={() =>
                            console.log("TanStack Form errors:", errors)
                          }
                          sx={{ mb: 1 }}
                        >
                          Debug Errors
                        </Button>

                        {/* Check if there are any form or field errors */}
                        {(() => {
                          // Collect all field errors
                          const allFieldErrors = {};
                          Object.entries(fieldMeta).forEach(
                            ([fieldName, meta]) => {
                              if (meta.errors && meta.errors.length > 0) {
                                allFieldErrors[fieldName] = meta.errors;
                              }
                            }
                          );

                          const hasErrors =
                            Object.keys(errors).length > 0 ||
                            Object.keys(allFieldErrors).length > 0;

                          return hasErrors ? (
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
                                  {JSON.stringify(
                                    {
                                      formErrors: errors,
                                      fieldErrors: allFieldErrors,
                                    },
                                    null,
                                    2
                                  )}
                                </pre>
                              </Paper>
                            </Box>
                          ) : null;
                        })()}

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
                              {JSON.stringify(values, null, 2)}
                            </pre>
                          </Paper>
                        </Box>
                      </Stack>
                    );
                  }}
                />
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
                      "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  TanStack Form Features
                </Typography>

                <Stack spacing={1}>
                  {[
                    "Type-safe form handling",
                    "Real-time validation",
                    "Field-level validation",
                    "Form state management",
                    "Async validation support",
                    "Framework agnostic",
                    "Minimal re-renders",
                    "Built-in accessibility",
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <FuseSvgIcon
                        sx={{ mr: 1, color: "#4a7c59", fontSize: "1rem" }}
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
                    "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
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
                  border: "1px solid rgba(102, 126, 234, 0.1)",
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
      </Container>
    </Box>
  );
}

export default TanStackFormDemoPageBeautiful;
