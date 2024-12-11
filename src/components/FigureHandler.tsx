import React, { useState, useRef } from "react";
import {
  Button,
  Box,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  FileDownloadOutlined,
  HelpOutline as HelpOutlineIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";
import { DNALogo, DNAAlphabet } from "logots-react";
import { downloadData, svgData, meme } from "../utilities/utilities";
import { FactorChatFigure } from "./types";

// Customizing DNA base colors for A & T
DNAAlphabet[0].color = ["#228b22"]; // A -> Green
DNAAlphabet[3].color = ["red"]; // T -> Red

interface FigureHandlerProps {
  figure: FactorChatFigure;
  index: number;
  onReverseComplement: (index: number) => void;
}

// Reverse Complement Logic
export const reverseComplement = (ppm: number[][]): number[][] =>
  ppm && ppm[0] && ppm[0].length === 4
    ? ppm.map((inner) => inner.slice().reverse()).reverse()
    : ppm
        .map((entry) => [
          entry[3],
          entry[2],
          entry[1],
          entry[0],
          entry[5],
          entry[4],
        ])
        .reverse();

const FigureHandler: React.FC<FigureHandlerProps> = ({
  figure,
  index,
  onReverseComplement,
}) => {
  const [reverseComplementState, setReverseComplementState] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null); // Reference to the wrapper div

  const handleReverseComplement = () => {
    setReverseComplementState(!reverseComplementState);
    onReverseComplement(index);
  };

  const handleDownload = (format: "svg" | "meme") => {
    if (format === "svg") {
      const svgElement = svgRef.current?.querySelector("svg");
      if (svgElement) {
        const svgContent = svgData(svgElement);
        downloadData(svgContent, `Figure_${index + 1}.svg`, "image/svg+xml");
        setDownloadSuccess(true);
      }
    } else if (format === "meme") {
      const name = `Figure_${index + 1}`;
      const data = meme([
        {
          accession: name,
          pwm: figure.data.ppm,
          factor: "",
          dbd: "",
          color: "",
          coordinates: [0, 0],
        },
      ]);
      downloadData(data, `${name}.meme`);
      setDownloadSuccess(true);
    }
  };

  const displayedPPM = reverseComplementState
    ? reverseComplement(figure.data.ppm)
    : figure.data.ppm;

  return (
    <Box mt={2}>
      {/* Wrap DNALogo in a div with ref */}
      <div ref={svgRef}>
        <DNALogo ppm={displayedPPM} />
      </div>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          onClick={handleReverseComplement}
          variant={reverseComplementState ? "outlined" : "contained"} // Toggle styles
          color={reverseComplementState ? "secondary" : "primary"} // Change color for inline mode
          startIcon={<SwapHorizIcon />}
        >
          Reverse Complement
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowDownloadDialog(true)}
          endIcon={<FileDownloadOutlined />}
        >
          Download
        </Button>
      </Box>

      {/* E-value and Occurrences Section */}
      <Box mt={2}>
        {/* E-value */}
        <Box display="flex" alignItems="center">
          <Tooltip
            title={
              <Typography sx={{ fontSize: "1rem" }}>
                The statistical significance of the motif. The E-value is an
                estimate of the expected number that one would find in a
                similarly sized set of random sequences.
              </Typography>
            }
          >
            <HelpOutlineIcon fontSize="small" sx={{ marginRight: 0.5 }} />
          </Tooltip>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            E-value:
          </Typography>
          <Typography variant="body1" component="span" sx={{ marginLeft: 0.5 }}>
            {figure.data.e_value || "N/A"}
          </Typography>
        </Box>

        {/* Occurrences */}
        <Box display="flex" alignItems="center" mt={1}>
          <Tooltip
            title={
              <Typography sx={{ fontSize: "1rem" }}>
                The number of optimal IDR thresholded peaks which contained at
                least one occurrence of this motif according to FIMO.
              </Typography>
            }
          >
            <HelpOutlineIcon fontSize="small" sx={{ marginRight: 0.5 }} />
          </Tooltip>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Occurrences:
          </Typography>
          <Typography variant="body1" component="span" sx={{ marginLeft: 0.5 }}>
            {figure.data.original_peaks_occurrences?.toLocaleString() || 0} /{" "}
            {figure.data.original_peaks?.toLocaleString() || 0}
          </Typography>
        </Box>
      </Box>

      {/* Download Dialog */}
      <Dialog
        open={showDownloadDialog}
        onClose={() => setShowDownloadDialog(false)}
      >
        <DialogTitle>Download Options</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => handleDownload("meme")}
            startIcon={
              downloadSuccess && (
                <FileDownloadOutlined color="success" fontSize="small" />
              )
            }
          >
            Download MEME
          </Button>
          <Button
            onClick={() => handleDownload("svg")}
            startIcon={
              downloadSuccess && (
                <FileDownloadOutlined color="success" fontSize="small" />
              )
            }
          >
            Download SVG
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FigureHandler;