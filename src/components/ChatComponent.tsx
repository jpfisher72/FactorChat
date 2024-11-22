'use client'
import { Chat, Close, InfoOutlined, Minimize, Refresh, Send } from "@mui/icons-material";
import { Box, Button, Divider, Fab, Fade, IconButton, Paper, Stack, SxProps, TextField, Theme, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useFactorChat } from "./useFactorChat";
import { FactorChatMessage } from "./types";
import { Message } from "./Message";
import { LoadingMessage } from "./LoadingMessage";

export default function ChatComponenet() {
  const { input, handleInputChange, handleSubmit, messages, setMessages, loading } = useFactorChat();
  const [open, setOpen] = useState(true);
  const [draggableKey, setDraggableKey] = useState(Math.random())
  // Start with null or consistent initial position
  const [defaultPosition, setDefaultPosition] = useState({
    x: 0,
    y: 0,
    width: 600,
    height: 600
  });

  // Calculate position after initial render
  useEffect(() => {
    const handleResize = () => {
      setDefaultPosition({
        x: window.innerWidth - 600 - 15,
        y: window.innerHeight - 600 - 15,
        width: 600,
        height: 600
      });
      setDraggableKey(Math.random()); // force reset once proper position is determined
    };

    // Run on initial render
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false)
    setDraggableKey(Math.random())
    setMessages([])
  };

  const handleMinimize = () => {
    setOpen(false)
  }

  const messageRef = useRef<HTMLDivElement>(null)
  // const paperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  //Focus input when chat window opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  //Move scroll position along with new messages if scroll close to bottom
  useEffect(() => {
    const container = messageRef.current
    if (!container) return;
    
    const shouldScroll = messages.at(-1)?.origin === "user"
    if (shouldScroll) container.scrollTop = container.scrollHeight;
  }, [messages])

  const handleClearMessages = () => {
    setMessages([])
  }

  const theme = useTheme()

  const paperStyle: SxProps<Theme> = {
    boxSizing: "border-box",
    width: '100%',
    height: '100%',
    paddingX: theme.spacing(1.5),
    paddingY: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
  };

  return (
    <Box height={'100vh'} width={'100vw'} position={"fixed"} top={0} left={0} sx={{ pointerEvents: 'none' }}>
      {/* Chat window */}
      <Rnd
        key={draggableKey}
        dragHandleClassName="drag-surface"
        default={defaultPosition}
        minHeight={500}
        minWidth={500}
        style={{ display: 'flex', flexDirection: 'column', pointerEvents: open ? 'auto' : 'none', zIndex: 1000 }}
        bounds={"window"}
      >
        {/* Fade does not work when parent of Rnd, so setting pointerEvents to none on Rnd when not open */}
        <Fade in={open}>
          <Paper elevation={5} sx={{ ...paperStyle }} >
            {/* <Stack> */}
            <Stack direction={"row"} ml={0.5} mr={0.5}>
              <Typography variant="h4" flexGrow={1} className='drag-surface' sx={{ cursor: "move" }}>
                FactorChat
                <Tooltip title="Here is some information on how FactorChat works" placement="top">
                  <InfoOutlined sx={{ ml: 0.5 }} />
                </Tooltip>
              </Typography>
              <IconButton onClick={handleMinimize}>
                <Minimize />
              </IconButton>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Stack>
            <Divider />
            {/* The Chat */}
            <Stack ref={messageRef} gap={2} flexGrow={1} overflow={"auto"}>
              {messages.map((message: FactorChatMessage, i) => {
                return (
                  <Message {...message} key={"message-" + i} />
                )
              })}
              {loading && <LoadingMessage />}
            </Stack>
            {/* The Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                marginLeft: theme.spacing(0.5),
                marginRight: theme.spacing(0.5),
              }}
            >
              <TextField
                inputRef={inputRef}
                placeholder={"Ask a question to FactorChat"}
                fullWidth
                multiline
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSubmit(e)
                  }
                }}
              />
              <Stack direction={"row"} justifyContent={"space-between"} mt={1}>
                <Button variant="contained" type="submit" disabled={!input} endIcon={<Send />}>
                  Send Message
                </Button>
                <Button variant="contained" onClick={handleClearMessages} disabled={messages.length === 0} endIcon={<Refresh />}>
                  Restart Conversation
                </Button>
              </Stack>
            </form>
          </Paper>
        </Fade>
      </Rnd>
      {/* Icon to open chat */}
      <Fade in={!open}>
        <Tooltip title="Ask FactorChat" placement="left">
          <Fab
            color="primary"
            aria-label="open modal"
            onClick={handleOpen}
            size="medium"
            sx={{
              pointerEvents: 'auto',
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <Chat />
          </Fab>
        </Tooltip>
      </Fade>
    </Box>
  )
}