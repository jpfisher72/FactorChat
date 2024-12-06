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

type MotifFigure = {
  type: string;
  data: {
    ppm: number[][];
    sites?: number;
    e_value?: number;
    original_peaks_occurrences?: number;
    original_peaks?: number;
    flank_occurrences_ratio?: number;
    flank_z_score?: number;
    flank_p_value?: number;
    shuffled_occurrences_ratio?: number;
    shuffled_z_score?: number;
    shuffled_p_value?: number;
  };
};


export type FactorChatFigure = (MotifFigure) //Add union type when more supported

export type FactorChatMessage = UserMessage | BackendMessage
