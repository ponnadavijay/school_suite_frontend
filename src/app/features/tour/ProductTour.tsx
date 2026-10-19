import React, { useState, useEffect, useCallback } from "react";
import { Joyride, EventData, STATUS, ACTIONS, EVENTS, Step, TooltipRenderProps } from "react-joyride";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAuth } from "../../context/AuthContext";

// Global trigger to replay or start product tour from anywhere
export const triggerProductTour = () => {
  window.dispatchEvent(new CustomEvent("startProductTour"));
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
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    if (closeProps.onClick) {
      closeProps.onClick(e);
    }
    window.dispatchEvent(new CustomEvent("closeProductTour"));
  };

  const handleSkip = (e: React.MouseEvent<HTMLElement>) => {
    if (skipProps.onClick) {
      skipProps.onClick(e);
    }
    window.dispatchEvent(new CustomEvent("closeProductTour"));
  };

  return (
    <Box
      {...tooltipProps}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(14px)",
        borderRadius: "16px",
        p: 3,
        boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
        maxWidth: 420,
        border: "1px solid rgba(226, 232, 240, 0.8)",
        transformOrigin: "center",
        animation: "tourFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "@keyframes tourFadeIn": {
          "0%": { opacity: 0, transform: "scale(0.94) translateY(8px)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <AutoAwesomeIcon sx={{ color: "#2563eb", fontSize: 22 }} />
          <Typography variant="h6" fontWeight="700" color="#1e293b" fontSize="1.1rem">
            {step.title || "Feature Spotlight"}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "#94a3b8", "&:hover": { color: "#475569" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body2" color="#475569" mb={3} sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}>
        {step.content}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          {!isLastStep && (
            <Button
              size="small"
              onClick={handleSkip}
              sx={{ color: "#94a3b8", textTransform: "none", fontWeight: 600, "&:hover": { color: "#64748b" } }}
            >
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
                borderColor: "#e2e8f0",
                color: "#475569",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
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
              backgroundColor: "#2563eb",
              color: "white",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            {isLastStep ? "Got it, Let's Go! 🎉" : "Next →"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const ProductTour: React.FC = () => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourKey, setTourKey] = useState(0);

  // Consistent unique storage key for current user & global fallback
  const userIdentifier =
    (user as any)?.u_id ||
    user?.id ||
    user?.email ||
    (user as any)?.username ||
    "default_user";

  const storageKey = `patashala_tour_seen_${userIdentifier}`;
  const globalStorageKey = "patashala_tour_seen_global";

  // Mark tour as permanently seen in localStorage
  const markTourSeen = useCallback(() => {
    try {
      localStorage.setItem(storageKey, "true");
      localStorage.setItem(globalStorageKey, "true");
    } catch (e) {
      console.warn("Could not save tour state to localStorage", e);
    }
  }, [storageKey, globalStorageKey]);

  // First-time new user check (NEVER auto-triggers on page refresh)
  useEffect(() => {
    const hasSeenUser = localStorage.getItem(storageKey);
    const hasSeenGlobal = localStorage.getItem(globalStorageKey);

    // If user has already seen or closed the tour, DO NOT auto-run on refresh
    if (hasSeenUser === "true" || hasSeenGlobal === "true") {
      setRun(false);
      return;
    }

    // New user first time: mark immediately so any page reload never triggers it again
    markTourSeen();

    // Start tour automatically after UI components are mounted
    const timer = setTimeout(() => {
      setStepIndex(0);
      setTourKey((prev) => prev + 1);
      setRun(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [storageKey, globalStorageKey, markTourSeen]);

  // Handle manual trigger and close events
  useEffect(() => {
    const handleStartTour = () => {
      setStepIndex(0);
      setTourKey((prev) => prev + 1);
      setRun(true);
    };

    const handleCloseTour = () => {
      setRun(false);
      markTourSeen();
    };

    window.addEventListener("startProductTour", handleStartTour);
    window.addEventListener("closeProductTour", handleCloseTour);

    return () => {
      window.removeEventListener("startProductTour", handleStartTour);
      window.removeEventListener("closeProductTour", handleCloseTour);
    };
  }, [markTourSeen]);

  const handleJoyrideCallback = (data: EventData) => {
    const { status, action, type, index } = data;

    const isFinished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
    const isClosed = action === ACTIONS.CLOSE || action === ACTIONS.SKIP || action === ACTIONS.STOP;

    if (isFinished || isClosed) {
      setRun(false);
      markTourSeen();
    } else if (type === EVENTS.STEP_AFTER) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      // If a target DOM element is not mounted yet, advance to next step
      setStepIndex(index + 1);
    }
  };

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      title: "Welcome to Tech Patashala! 🎉",
      content: "Let's take a quick interactive tour to help you navigate through your new school management suite.",
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
      target: ".tour-attendance",
      title: "Attendance Management Hub",
      content: "Track and record daily attendance for both students and faculty seamlessly in one unified hub.",
      placement: "right",
    },
    {
      target: ".profile-button",
      title: "Your Profile & Replay Tour",
      content: "Access your account settings, logout, or replay this quick tour anytime from here.",
      placement: "bottom",
    },
  ];

  return (
    <Joyride
      key={tourKey}
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      tooltipComponent={CustomTooltip}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#2563eb",
        },
        overlay: {
          backgroundColor: "rgba(15, 23, 42, 0.7)",
        },
        spotlight: {
          borderRadius: "12px",
          boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.35)",
        },
      }}
    />
  );
};

export default ProductTour;
