import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  CheckCircle,
  PictureAsPdf,
  Movie,
  Image,
  InsertChart,
  InsertDriveFile,
} from "@mui/icons-material";
import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";

interface FileUploadDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  uploadProgress?: number;
  accept?: string;
  helperText?: string;
  error?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    return <PictureAsPdf sx={{ fontSize: 32, color: "#F44336" }} />;
  }
  if (["ppt", "pptx"].includes(ext || "")) {
    return <InsertChart sx={{ fontSize: 32, color: "#FF5722" }} />;
  }
  if (["mp4", "mov", "avi", "mkv"].includes(ext || "")) {
    return <Movie sx={{ fontSize: 32, color: "#2196F3" }} />;
  }
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
    try {
      const src = URL.createObjectURL(file);
      return (
        <Box
          component="img"
          src={src}
          alt="file preview"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "8px",
            objectFit: "cover",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        />
      );
    } catch (e) {
      return <Image sx={{ fontSize: 32, color: "#4CAF50" }} />;
    }
  }
  return <InsertDriveFile sx={{ fontSize: 32, color: COLORS.PRIMARY_NAVY }} />;
};

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  file,
  onFileSelect,
  onFileRemove,
  uploadProgress = 100,
  accept = "*",
  helperText = "Supports PDF, PPT, Videos, Images (max 10MB)",
  error,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const FS = { fontFamily: poppins.style.fontFamily };

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept={accept}
      />

      {!file ? (
        <Box
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          sx={{
            border: `2px dashed ${
              isDragActive ? COLORS.PRIMARY_NAVY : "rgba(11, 23, 39, 0.15)"
            }`,
            borderRadius: "16px",
            bgcolor: isDragActive
              ? "rgba(1, 90, 80, 0.05)"
              : "rgba(11, 23, 39, 0.01)",
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            "&:hover": {
              border: `2px dashed ${COLORS.PRIMARY_NAVY}`,
              bgcolor: "rgba(1, 90, 80, 0.02)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: COLORS.PRIMARY_NAVY }} />
          <Box>
            <Typography
              sx={{
                ...FS,
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              Drag & drop file here or click to browse
            </Typography>
            <Typography
              sx={{
                ...FS,
                fontSize: 12,
                color: COLORS.TEXT_SECONDARY,
                mt: 0.5,
              }}
            >
              {helperText}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            border: `1px solid rgba(11, 23, 39, 0.1)`,
            borderRadius: "16px",
            bgcolor: COLORS.WHITE,
            p: 2.5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            {getFileIcon(file)}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  ...FS,
                  fontSize: 14,
                  fontWeight: 600,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                {file.name}
              </Typography>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 12,
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                {formatFileSize(file.size)}
              </Typography>
            </Box>
            {uploadProgress === 100 ? (
              <CheckCircle sx={{ color: COLORS.SUCCESS }} />
            ) : (
              <Typography
                sx={{
                  ...FS,
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                {uploadProgress}%
              </Typography>
            )}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              sx={{
                color: COLORS.ERROR,
                bgcolor: "rgba(244, 67, 54, 0.05)",
                "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
              }}
            >
              <Delete />
            </IconButton>
          </Stack>

          {uploadProgress < 100 && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                mt: 2,
                height: 6,
                borderRadius: "3px",
                bgcolor: "rgba(1, 90, 80, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: COLORS.PRIMARY_NAVY,
                  borderRadius: "3px",
                },
              }}
            />
          )}
        </Box>
      )}

      {error && (
        <Typography
          sx={{
            ...FS,
            fontSize: 12,
            color: COLORS.ERROR,
            mt: 1,
            ml: 1.5,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
