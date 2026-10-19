import React, { useState, useEffect } from "react";
import { Joyride, EventData, STATUS, Step, TooltipRenderProps } from "react-joyride";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAuth } from "../../context/AuthContext";

export const triggerProductTour = () => {
  window.dispatchEvent(new Event("startProductTour"));
};

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) => {
  return (
    <Box
      {...tooltipProps}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        p: 3,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        maxWidth: 420,
        border: "1px solid rgba(255,255,255,0.4)",
        transformOrigin: "center",
        animation: "tourFadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "@keyframes tourFadeIn": {
          "0%": { opacity: 0, transform: "scale(0.9) translateY(10px)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <AutoAwesomeIcon sx={{ color: "#2A1989", fontSize: 24 }} />
          <Typography variant="h6" fontWeight="700" color="#1a105c">
            {step.title || "Feature Spotlight"}
          </Typography>
        </Box>
        <IconButton size="small" {...closeProps} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body1" color="text.secondary" mb={3} sx={{ lineHeight: 1.6 }}>
        {step.content}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          {!isLastStep && (
            <Button size="small" sx={{ color: "#666", textTransform: "none" }} {...skipProps}>
              Skip Tour
            </Button>
          )}
        </Box>
        <Box gap={1} display="flex" alignItems="center">
          {index > 0 && (
            <Button
              variant="outlined"
              size="small"
              {...backProps}
              sx={{
                borderColor: "#d1d5db",
                color: "#4b5563",
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f3f4f6" },
              }}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            {...primaryProps}
            sx={{
              backgroundColor: "#2A1989",
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(42, 25, 137, 0.4)",
              "&:hover": { backgroundColor: "#1e1163" },
            }}
          >
            {isLastStep ? "Let's Go!" : "Next"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const ProductTour: React.FC = () => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  
  // Create a user-specific storage key
  const userId = (user as any)?.u_id || user?.id || user?.email || "guest";
  const userStorageKey = `hasSeenProductTour_${userId}`;

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(userStorageKey);
    if (!hasSeenTour) {
      setRun(true);
    }

    const handleStartTour = () => setRun(true);
    window.addEventListener("startProductTour", handleStartTour);
    return () => window.removeEventListener("startProductTour", handleStartTour);
  }, [userStorageKey]);

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(userStorageKey, "true");
    }
  };

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      title: "Welcome to Tech Patashala! 🎉",
      content: "Let's take a quick tour to help you navigate through your powerful new dashboard.",
      disableBeacon: true,
    },
    {
      target: ".tour-dashboard",
      title: "Dashboard Overview",
      content: "Get a bird's-eye view of your school. Track total teachers, students, and live attendance metrics all in one place.",
      placement: "right",
      disableBeacon: false,
    },
    {
      target: ".tour-teachers",
      title: "Teacher Management",
      content: "Easily register new educators, view their profiles, and manage their organizational roles.",
      placement: "right",
    },
    {
      target: ".tour-teacher-attendance",
      title: "Teacher Attendance",
      content: "Log daily attendance seamlessly. Keep track of who is present, absent, or on leave.",
      placement: "right",
    },
    {
      target: ".tour-parents",
      title: "Parent Portal",
      content: "Maintain a complete directory of parents and securely link them to their children's records.",
      placement: "right",
    },
    {
      target: ".tour-students",
      title: "Student Records",
      content: "From admissions to assigning sections, you can manage the entire student lifecycle here.",
      placement: "right",
    },
    {
      target: ".tour-student-attendance",
      title: "Student Attendance",
      content: "Monitor daily attendance section by section and ensure no student is left behind.",
      placement: "right",
    },
    {
      target: ".profile-button",
      title: "Your Profile",
      content: "Access your account settings or log out safely whenever you're done.",
      placement: "bottom",
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      tooltipComponent={CustomTooltip}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
        },
        overlay: {
          backgroundColor: "rgba(15, 23, 42, 0.75)",
        },
        spotlight: {
          borderRadius: "12px",
          boxShadow: "0 0 0 4px rgba(42, 25, 137, 0.3)",
        },
      }}
    />
  );
};

export default ProductTour;
