import { UIPosition } from './types'

export const enum COLOR {
  RED = '#DB2763',
  LIGHT_BLUE = '#3185FC',
  GREEN = '#06D6A0'
}

export const enum SPACING {
  SMALL = '4px',
  MEDIUM = '8px',
  LARGE = '16px'
}

export const absolutePositionAt = ({ fromCenter, x, y, relative }: UIPosition) =>
  relative
    ? {}
    : {
        position: 'absolute',
        top: fromCenter ? `calc(50% - ${y}px)` : `${y}px`,
        left: fromCenter ? `calc(50% - ${x}px)` : `${x}px`,
        transform: 'translate(-50%, -50%)'
      }
