import { useEffect, useMemo } from "react";
import { ConnectionsRef } from "./Connections";
import { CirclesRef, LinesRef, TextsRef } from "./PetalsComponents";
import { Data, GraphBasicProps, Position, Root } from "./types";
import { getSplitCirclePosition } from "./utilities";

type UsePetalsPositions = {
  dataChunks: Data[][];
  roots: Root[];
  textsRef: TextsRef;
  linesRef: LinesRef;
  circlesRef: CirclesRef;
  position: Position;
  connectionsRef: ConnectionsRef;
} & Pick <GraphBasicProps, 
  'fontSize' | 
  'petalsOptions' |
  'innerCircle'
>

export const usePetalsPositions = ({
  dataChunks,
  roots,
  petalsOptions: options,
  fontSize: globalFontSize,
  position,
  innerCircle,
  circlesRef,
  linesRef,
  textsRef,
  connectionsRef
}: UsePetalsPositions) => {

  const innerCircleDefault = useMemo(() => ({
    rotation: innerCircle?.rotation ?? 0,
    radianOffset: innerCircle?.radianOffset ?? 0,
    radius: innerCircle?.radius ?? 195
  }), [innerCircle]);

  const {
    radius,
    rotation,
    radianOffset,
    labelLineLength,
    labelLineDistance,
    typeIndicatorRadius,
  } = useMemo(() => ({
    radius: options?.radius ?? 55,
    rotation: options?.rotation ?? 0,
    radianOffset: options?.radianOffset ?? 0,
    labelLineLength: options?.labelLineLength ?? 4,
    labelLineDistance: options?.labelLineDistance ?? 4,
    typeIndicatorRadius: options?.typeIndicatorRadius ?? 3,
  }), [options]);
  
  const dataChunksWithPosition = useMemo(() =>
    dataChunks
      .map((data, index) => {
        const { x, y } = getSplitCirclePosition(
          dataChunks.length,
          index,
          innerCircleDefault.rotation,
          innerCircleDefault.radianOffset);
        const petalCircleX = (x * innerCircleDefault.radius) + position.x;
        const petalCircleY = (y * innerCircleDefault.radius) + position.y;
        return {
          data,
          petalCircleX,
          petalCircleY
        }
      })
  , [dataChunks, innerCircleDefault.radianOffset, innerCircleDefault.radius, innerCircleDefault.rotation, position.x, position.y]);
  
  useEffect(() =>
    {
      dataChunksWithPosition
        .forEach((chunk, chunkIndex) => {
          const rotationOffset = (((360 - innerCircleDefault.radianOffset) / dataChunksWithPosition.length) * chunkIndex);
          const textRotation =  (-(radianOffset - 360) / chunk.data.length);
          
          chunk.data.forEach((entry, entryIndex) => {
            const { x, y } = getSplitCirclePosition(
              chunk.data.length,
              entryIndex,
              rotation + rotationOffset,
              radianOffset
            );

            const labelRef = textsRef?.current[`${chunkIndex}_${entryIndex}`];
            if (labelRef) {
              labelRef.setAttribute('x', (chunk.petalCircleX + radius + labelLineLength + labelLineDistance + 2).toString());
              labelRef.setAttribute('y', chunk.petalCircleY.toString());
              labelRef.setAttribute('transform', `
                rotate(
                  ${((textRotation) * entryIndex) + rotationOffset + rotation},
                  ${chunk.petalCircleX},
                  ${chunk.petalCircleY}
                )
              `);
            }

            const labelIndicatorRef = linesRef?.current[`${chunkIndex}_${entryIndex}`];
            if (labelIndicatorRef) {
              labelIndicatorRef.setAttribute('x1', ((x * (radius + labelLineDistance)) + chunk.petalCircleX).toString());
              labelIndicatorRef.setAttribute('y1', ((y * (radius + labelLineDistance)) + chunk.petalCircleY).toString());
              labelIndicatorRef.setAttribute('x2', ((x * (radius + labelLineDistance + labelLineLength)) + chunk.petalCircleX).toString());
              labelIndicatorRef.setAttribute('y2', ((y * (radius + labelLineDistance + labelLineLength)) + chunk.petalCircleY).toString());
            }

            entry.types.forEach(({type: thisType}, typeIndex) => { 
              const typeRef = circlesRef?.current[`${chunkIndex}_${entryIndex}_${typeIndex}`];
              const r = radius - (typeIndex * (typeIndicatorRadius * 2));
              const cx = (x * r) + chunk.petalCircleX;
              const cy = (y * r) + chunk.petalCircleY;
              if (typeRef) {
                typeRef.setAttribute('r', typeIndicatorRadius.toString());
                typeRef.setAttribute('cx', cx.toString());
                typeRef.setAttribute('cy', cy.toString());
              }
              const connectionRef = connectionsRef?.current[`${typeIndex}_${chunkIndex}_${entryIndex}`];
              if (connectionRef) {
                const pos = roots.find(({ type }) => type === thisType); 
                if (pos) {
                  const path = `M ${cx} ${cy} C ${chunk.petalCircleX} ${chunk.petalCircleY}, ${pos?.x} ${pos?.y}, ${pos?.x} ${pos?.y}`
                  connectionRef.setAttribute('d', path);
                }
              }
            })
        })
      });
    }
  , [dataChunksWithPosition, roots, textsRef, linesRef, circlesRef, connectionsRef, innerCircleDefault.radianOffset, labelLineDistance, labelLineLength, radianOffset, radius, rotation, typeIndicatorRadius]);
}