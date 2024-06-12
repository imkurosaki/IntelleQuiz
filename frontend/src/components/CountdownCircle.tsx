import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export function CountdownCircle({ countdown }: {
   countdown: number
}) {
   return <CountdownCircleTimer
      isPlaying
      duration={countdown}
      size={100}
      strokeWidth={6}
      colors={['#000000', '#000000', '#000000', '#000000']}
      colorsTime={[7, 5, 2, 0]}
   >
      {({ remainingTime }) => {
         return (
            <div className="align-middle">
               <div className="text-3xl">{remainingTime}</div>
            </div>
         )
      }}
   </CountdownCircleTimer>
}
