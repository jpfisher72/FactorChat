import Markdown from "react-markdown" //todo remove one of these depending on which I decide to use
import { getOverrides, MuiMarkdown } from 'mui-markdown'; //https://www.npmjs.com/package/mui-markdown
import { MessageBubble } from "./MessageBubble"
import { FactorChatFigure, FactorChatMessage } from "./types"
import { Alert, Button, Typography } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { DNALogo } from "logots-react";
import { getFileSize } from "./helpers";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link"

const Figure = (figure: FactorChatFigure) => {
  switch (figure.type) {
    case "logo": return <DNALogo ppm={figure.data.ppm} />
    default: return <Alert severity="warning">Issue displaying figure of type {figure.type}</Alert>
  }
}

// Message.tsx
export const Message = (message: FactorChatMessage) => {
  const isUser = message.origin === "user"
  const contents = isUser ? message.contents : message.contents.text
  const figures = isUser ? [] : message.contents.figures
  const files = useMemo(() => isUser ? [] : message.contents.files, [])
  const [fileSizes, setFileSizes] = useState<{[key: string]: number | null}>({})

  useEffect(() => {
    const fetchFileSizes = async () => {
      const sizes: {[key: string]: number | null} = {}
      for (const file of files) {
        const size = await getFileSize(file.url)
        sizes[file.url] = size
      }
      setFileSizes(sizes)
    }
    
    fetchFileSizes()
  }, [files])

  return (
    <MessageBubble isUser={isUser}>
      <MuiMarkdown
        overrides={{
          ...getOverrides({}),
          a: {
            component: Link, //override <a> with Next.js <Link> to avoid hard navigation (resets chatbot state)
          }
        }}
      >
        {contents}
      </MuiMarkdown>
      {figures.length > 0 && figures.map((figure, i) =>
        <Figure {...figure} key={i} />
      )}
      {/* Todo fetch file size and display */}
      {files.length > 0 && files.map((file, i) =>
        <Button
          href={file.url}
          fullWidth
          endIcon={<FileDownloadOutlined />}
          variant="contained"
          sx={{ justifyContent: "space-between" }}
          key={i}
        >
          <Typography
            variant="body2"
            sx={{ flexGrow: 1 }}
          >
            {file.description}
          </Typography>
          {fileSizes[file.url] !== undefined 
            ? `${((fileSizes[file.url] || 0) / 1000000).toFixed(1)} MB` 
            : 'Loading...'}
        </Button>
      )}
    </MessageBubble>
  )
}