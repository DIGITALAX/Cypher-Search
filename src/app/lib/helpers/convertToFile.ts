const convertToFile = (base64: string, mimeType: string) => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new File([ab], `media.${mimeType.split("/")[1] ?? "bin"}`, {
      type: mimeType,
    });
  };
  
  export default convertToFile;
  