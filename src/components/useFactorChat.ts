import { useState } from "react";
import { FactorChatMessage } from "./types";
import { exampleResponse } from "@/components/exampleResponse";


export function useFactorChat() {
  const [messages, setMessages] = useState<FactorChatMessage[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()

    const newMessages: FactorChatMessage[] = [...messages, {origin: 'user', contents: input}]
    setMessages(newMessages)
    setInput('')
    
    /**
     * @todo replace this with actual call to backend
     */
    setLoading(true)
    setTimeout(() => {
      setMessages([...newMessages, {origin: "backend", contents: exampleResponse}])
      setLoading(false)
    }, 2000);
  }

  return {input, handleInputChange, handleSubmit, messages, setMessages, loading}
}