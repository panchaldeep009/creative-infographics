
export const chunkArray = <A extends unknown>(array: A[], chunkSize: number) =>{
  const size = Math.ceil(array.length / chunkSize);
  return [...Array(chunkSize)].map(_ => array.splice(0, size));
}

export const getSplitCirclePosition = (chunk: number, index: number, radius: number, rotateOffset = 0, radianOffset = 0) => {
  const angle = (((360 - radianOffset) / chunk) * index) + rotateOffset;
  // To radians
  const thita = (Math.PI * angle) / 180;
  return {
    x: Math.cos(thita) * radius,
    y: Math.sin(thita) * radius
  }
}