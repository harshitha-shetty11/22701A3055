import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logEvent } from "../middleware/Logger";
import { isValidUrl, isValidShortcode, isValidInteger } from "../utils/validation";

const STORAGE_KEY = "shortenedUrls_v1";

function generateShortcode() {
  return Math.random().toString(36).slice(2, 8);
}

const UrlShortenerPage = () => {
  const [urlInputs, setUrlInputs] = useState([
    { originalUrl: "", validityMinutes: "", preferredCode: "" },
  ]);
  const [inputErrors, setInputErrors] = useState([]);
  const [savedUrls, setSavedUrls] = useState({});
  const navigate = useNavigate();

  // Load saved URLs on mount
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      setSavedUrls(JSON.parse(data));
    }
  }, []);

  // Update a specific input field at a certain index
  const updateInput = (idx, field, value) => {
    const updated = [...urlInputs];
    updated[idx][field] = value;
    setUrlInputs(updated);
  };

  // Validate all inputs before shortening
  const validateInputs = () => {
    let allValid = true;
    const errors = urlInputs.map(({ originalUrl, validityMinutes, preferredCode }) => {
      const errorObj = {};

      if (!isValidUrl(originalUrl)) {
        errorObj.originalUrl = "Please enter a valid URL including http:// or https://";
        allValid = false;
      }

      if (validityMinutes && !isValidInteger(validityMinutes)) {
        errorObj.validityMinutes = "Enter a positive integer for validity duration.";
        allValid = false;
      }

      if (preferredCode && !isValidShortcode(preferredCode)) {
        errorObj.preferredCode = "Shortcode must be 1-10 chars, alphanumeric only.";
        allValid = false;
      }

      return errorObj;
    });
    setInputErrors(errors);
    return allValid;
  };

  // Save URLs to localStorage and state
  const saveUrls = (urls) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    setSavedUrls(urls);
  };

  // Add new input row if less than 5
  const addInputRow = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, { originalUrl: "", validityMinutes: "", preferredCode: "" }]);
      setInputErrors([...inputErrors, {}]);
    }
  };

  // Handle submission of shortened URLs
  const handleShorten = () => {
    if (!validateInputs()) {
      logEvent({ eventName: "ValidationFailed", message: "User inputs failed validation" });
      return;
    }

    const updatedUrls = { ...savedUrls };

    for (const { originalUrl, validityMinutes, preferredCode } of urlInputs) {
      let code = preferredCode.trim() || generateShortcode();

      // Ensure shortcode uniqueness
      let attempts = 0;
      while (updatedUrls.hasOwnProperty(code) && attempts < 15) {
        code = generateShortcode();
        attempts++;
      }

      if (updatedUrls.hasOwnProperty(code)) {
        alert(`Shortcode "${code}" is already taken. Please try again with a different code.`);
        logEvent({ eventName: "ShortcodeCollision", shortcode: code });
        return;
      }

      const now = new Date();
      const expiryDuration = validityMinutes && Number(validityMinutes) > 0
        ? Number(validityMinutes)
        : 120; 

      const expiryDate = new Date(now.getTime() + expiryDuration * 60000);

      updatedUrls[code] = {
        originalUrl,
        createdAt: now.toISOString(),
        expiresAt: expiryDate.toISOString(),
        clicks: [],
      };

      logEvent({ eventName: "UrlCreated", shortcode: code, url: originalUrl });
    }

    saveUrls(updatedUrls);
    alert("URL(s) shortened successfully!");
    setUrlInputs([{ originalUrl: "", validityMinutes: "", preferredCode: "" }]);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 6 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urlInputs.map((input, idx) => (
        <Paper key={idx} sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                label="Original URL"
                value={input.originalUrl}
                onChange={(e) => updateInput(idx, "originalUrl", e.target.value)}
                fullWidth
                error={Boolean(inputErrors[idx]?.originalUrl)}
                helperText={inputErrors[idx]?.originalUrl}
                required
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                label="Validity (minutes)"
                type="number"
                value={input.validityMinutes}
                onChange={(e) => updateInput(idx, "validityMinutes", e.target.value)}
                fullWidth
                error={Boolean(inputErrors[idx]?.validityMinutes)}
                helperText={inputErrors[idx]?.validityMinutes || "Defaults to 120 minutes"}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                label="Preferred Shortcode (optional)"
                value={input.preferredCode}
                onChange={(e) => updateInput(idx, "preferredCode", e.target.value)}
                fullWidth
                error={Boolean(inputErrors[idx]?.preferredCode)}
                helperText={inputErrors[idx]?.preferredCode}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box sx={{ textAlign: "left", marginBottom: 2 }}>
        <Button onClick={addInputRow} disabled={urlInputs.length >= 5}>
          Add Another URL
        </Button>
      </Box>

      <Button variant="contained" onClick={handleShorten}>
        Shorten URLs
      </Button>

      <Box sx={{ marginTop: 4 }}>
        <Button onClick={() => navigate("/statistics")}>View Statistics</Button>
      </Box>
    </Container>
  );
};

export default UrlShortenerPage;
