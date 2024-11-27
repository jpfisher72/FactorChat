export type FactorChatResponse = {
  text: string //how to parse markdown?
  files: {description: string, url: string}[]
  figures: FactorChatFigure[] //Need to define all types of data display
}


export type UserMessage = {
  origin: "user"
  contents: string
}

export type BackendMessage = {
  origin: "backend"
  contents: FactorChatResponse
}

export type MotifFigure = {
  type: "logo",
  data: { ppm: number[][] }
}

export type FactorChatFigure = (MotifFigure) //Add union type when more supported

export type FactorChatMessage = UserMessage | BackendMessage
