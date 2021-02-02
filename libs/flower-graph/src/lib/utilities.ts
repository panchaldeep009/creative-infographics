
export const chunkArray = (array: unknown[], chunkSize: number) =>
  [...Array(Math.ceil(array.length / chunkSize))].map(_ => array.splice(0, chunkSize));

export const getSplitCirclePosition = (chunk: number, index: number, radius: number) => {
  const angle = ((360 / chunk) * index);
  // To radians
  const thita = (Math.PI * angle) / 180;
  return {
    x: Math.cos(thita) * radius,
    y: Math.sin(thita) * radius
  }
}