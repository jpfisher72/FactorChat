'use client'
import { Chat, Close, Refresh } from "@mui/icons-material";
import { Box, Button, Fab, Fade, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { useChat, Message } from "ai/react"
import { useEffect, useRef, useState } from "react";
import Draggable from 'react-draggable';

export default function ChatComponenet() {

  // https://m2.material.io/inline-tools/color/


  //https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#usechat
  const { input, handleInputChange, handleSubmit, messages, setMessages } = useChat();
  const [open, setOpen] = useState(true);
  const [draggableKey, setDraggableKey] = useState(Math.random())

  const handleOpen = () => {
    setOpen(true);
    setDraggableKey(Math.random())
  }
  const handleClose = () => setOpen(false);

  const messageRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
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

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages])

  const handleClearMessages = () => {
    setMessages([])
  }

  const Message = (message: Message) => {
    const isUser = message.role === "user"
    // const borderWidth = theme.spacing(1)

    return (
      <Box
        border={'2px solid grey'}
        borderRadius={isUser ? '8px 8px 0px 8px' : '8px 8px 8px 0px'}
        p={1}
        maxWidth={'70%'}
        alignSelf={isUser ? "flex-end" : "flex-start"}

      >
        {message.content.split("\n").map((currentTextBlock: string, index: number) => {
          if (currentTextBlock === "") { //handle newlines
            return <Typography key={message.id + index}>&nbsp;</Typography>
          } else {
            return <Typography key={message.id + index}>{currentTextBlock}</Typography>
          }
        })}
      </Box>
    )
  }

  const paperStyle = {
    pointerEvents: 'auto',
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 1000
  };


  return (
    <Box height={'100vh'} width={'100vw'} position={"fixed"} top={0} left={0} sx={{pointerEvents: 'none'}}>
      {/* Chat window */}
      <Draggable
        key={draggableKey}
        handle="#drag-surface"
        nodeRef={paperRef}
        bounds="parent"
      >
        <Fade in={open}>
          <Paper elevation={5} sx={paperStyle} ref={paperRef}>
            <Stack width={600} height={600} m={2}>
              <Stack direction={"row"}>
                <Typography variant="h4" flexGrow={1} id='drag-surface' sx={{ cursor: "move" }}>FactorChat</Typography>
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              </Stack>
              {/* The Chat */}
              <Stack ref={messageRef} gap={2} flexGrow={1} overflow={"auto"}>
                {messages.map((message: Message) => {
                  return (
                    <Message {...message} key={message.id} />
                  )
                })}
              </Stack>
              {/* The Input */}
              <form
                className="mt-3"
                onSubmit={handleSubmit}
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
                <Stack direction={"row"} justifyContent={"space-between"} mt={2}>
                  <Button variant="contained" type="submit">
                    Send Message
                  </Button>
                  <Button variant="contained" onClick={handleClearMessages} disabled={messages.length === 0} endIcon={<Refresh />}>
                    Restart Conversation
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Fade>
      </Draggable>
      {/* Icon to open chat */}
      <Fade in={!open}>
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
      </Fade>
    </Box>
  )
}