/**
 *
 * @param url
 * @returns the file size for download at url (in bytes)
 */
export const getFileSize = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentLength = response.headers.get("Content-Length");
    if (contentLength) {
      return parseInt(contentLength, 10);
    } else return null;
  } catch (error) {
    console.log("error fetching file size for ", url);
    return null;
  }
};

/**
 * Generates the content for a .meme file based on provided motifs.
 */
export const meme = (
  motifs: Array<{
    accession: string;
    pwm: number[][];
    factor: string;
    dbd: string;
    color: string;
    coordinates: [number, number];
  }>
): string => {
  let content = "MEME version 4\n\n";
  content += "ALPHABET= ACGT\n\n";
  content += "strands: + -\n\n";
  content += "Background letter frequencies:\n";
  content += "A 0.25 C 0.25 G 0.25 T 0.25\n\n";

  for (const motif of motifs) {
    content += `MOTIF ${motif.accession}\n`;
    content +=
      "letter-probability matrix: alength= 4 w= " +
      motif.pwm.length +
      " nsites= 20 E= 0.000\n";
    for (const row of motif.pwm) {
      content += row.map((val) => val.toFixed(6)).join(" ") + "\n";
    }
    content += "\n";
  }

  return content;
};

/**
 * Triggers a download of a given string as a file.
 */
export const downloadData = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
