import { useState } from "react";
import { FactorChatMessage, FactorChatResponse } from "./types";
import { exampleResponse } from "@/components/exampleResponse";

export function useFactorChat() {
  const [messages, setMessages] = useState<FactorChatMessage[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // handles text box state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()

    // append user message to end of array
    const newMessages: FactorChatMessage[] = [...messages, { origin: 'user', contents: input }]
    setMessages(newMessages)

    // clear text box
    setInput('')

    //try getting response. If successful push new message, if not display error
    try {
      setLoading(true)

      // for sending POST with payload. Might need to modify headers or how the body is sent, not sure
      const res = await fetch('http://localhost:5000/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessages)
      })

      // Should change this to the type "FactorChatResponse" when receiving response from actual backend. See types.ts for definition
      const backendMessage: FactorChatResponse = await res.json()

      setMessages([...newMessages, {origin: "backend", contents: backendMessage}])
    
    } catch (error) {
      console.error('Error:\n', error)
      const errorMsg: FactorChatResponse = {
        text: "Something went wrong", //probably should handle displaying actual error,
        figures: [],
        files: []
      }
      setMessages([...newMessages, {origin: "backend", contents: errorMsg}])
    }

    // For using example response
    // setMessages([...newMessages, { origin: "backend", contents: exampleResponse }])
    
    setLoading(false)
  }

  return {input, handleInputChange, handleSubmit, messages, setMessages, loading}
}
