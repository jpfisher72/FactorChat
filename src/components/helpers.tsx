/**
 * 
 * @param url 
 * @returns the file size for download at url (in bytes)
 */
export const getFileSize = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) {
      return parseInt(contentLength, 10)
    } else return null
  } catch (error) {
    console.log("error fetching file size for ", url)
    return null
  }
}