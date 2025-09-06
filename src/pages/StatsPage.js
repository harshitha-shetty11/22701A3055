import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const STORAGE_KEY = "shortenedUrls_v1";

const StatsPage = () => {
  const [urlsData, setUrlsData] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUrlsData(JSON.parse(stored));
    }
  }, []);

  const toggleRowExpansion = (shortCode) => {
    setExpandedRows((prev) => ({
      ...prev,
      [shortCode]: !prev[shortCode],
    }));
  };

  return (
    <Container sx={{ marginTop: 6 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Short Code</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Expires At</TableCell>
            <TableCell>Click Count</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.entries(urlsData).map(([code, urlInfo]) => (
            <React.Fragment key={code}>
              <TableRow>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => toggleRowExpansion(code)}
                    aria-label={expandedRows[code] ? "Collapse" : "Expand"}
                  >
                    {expandedRows[code] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>{code}</TableCell>
                <TableCell>{new Date(urlInfo.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(urlInfo.expiresAt).toLocaleString()}</TableCell>
                <TableCell>{urlInfo.clicks ? urlInfo.clicks.length : 0}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={expandedRows[code]} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="subtitle1" gutterBottom>
                        Click Details
                      </Typography>
                      <Table size="small" aria-label="click details">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {urlInfo.clicks && urlInfo.clicks.length > 0 ? (
                            urlInfo.clicks.map((click, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{click.source}</TableCell>
                                <TableCell>{click.location}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3}>No clicks yet</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default StatsPage;
