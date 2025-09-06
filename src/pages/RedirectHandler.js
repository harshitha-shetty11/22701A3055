import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logEvent } from "../middleware/Logger";
import { Container, Typography, CircularProgress } from "@mui/material";

const STORAGE_KEY = "shortenedUrls_v1";

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const urlEntry = storedUrls[shortCode];

    if (!urlEntry) {
      setErrorMsg("Oops! This short link does not exist.");
      logEvent({ eventName: "RedirectError", shortcode: shortCode, reason: "NotFound" });
      return;
    }

    // Check if expired
    if (new Date(urlEntry.expiresAt) < new Date()) {
      setErrorMsg("Sorry, this short link has expired.");
      logEvent({ eventName: "RedirectError", shortcode: shortCode, reason: "Expired" });
      return;
    }

    // Log click with timestamp, source, and estimated location (dummy here)
    const newClick = {
      timestamp: new Date().toISOString(),
      source: document.referrer || "direct",
      location: "Unknown", // could integrate geolocation API here if available
    };

    if (!urlEntry.clicks) urlEntry.clicks = [];
    urlEntry.clicks.push(newClick);

    // Save updated click info back
    storedUrls[shortCode] = urlEntry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedUrls));

    logEvent({ eventName: "RedirectSuccess", shortcode: shortCode });

    // Redirect after a short delay for UX
    setTimeout(() => {
      window.location.href = urlEntry.originalUrl;
    }, 800);
  }, [shortCode]);

  return (
    <Container sx={{ marginTop: 5, textAlign: "center" }}>
      {errorMsg ? (
        <Typography variant="h6" color="error">
          {errorMsg}
        </Typography>
      ) : (
        <>
          <Typography variant="h6">Redirecting you now...</Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </>
      )}
    </Container>
  );
};

export default RedirectHandler;
