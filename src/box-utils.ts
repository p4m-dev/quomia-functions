const generateAccessCode = (length: number = 8): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let accessCode = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      accessCode += characters[randomIndex];
    }
  
    return accessCode;
}

export {
    generateAccessCode
}