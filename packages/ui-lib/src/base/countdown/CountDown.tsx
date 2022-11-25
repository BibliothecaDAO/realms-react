import useCountdown from '@bibliotheca-dao/core-lib/hooks/use-countdown';

interface DateProps {
  date: string;
  statement?: string;
}

interface TimeDisplay {
  value: any;
  type: any;
  isDanger: any;
}

interface Counter {
  days: any;
  hours: any;
  minutes: any;
  seconds: any;
}

const DateTimeDisplay = (props: TimeDisplay) => {
  return (
    <div className={`mr-1 ${props.isDanger ? 'text-red-200' : 'countdown'}`}>
      <p>
        {props.value}
        <span className="text-gray-700">{props.type}</span>
      </p>
    </div>
  );
};

const ShowCounter = (props: Counter) => {
  return (
    <div className="flex ">
      <DateTimeDisplay
        value={props.days}
        type={'D'}
        isDanger={props.days <= 3}
      />

      <DateTimeDisplay value={props.hours} type={'H'} isDanger={true} />

      <DateTimeDisplay value={props.minutes} type={'M'} isDanger={true} />

      {/* <DateTimeDisplay value={props.seconds} type={'S'} isDanger={true} /> */}
    </div>
  );
};

export const CountdownTimer = (props: DateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(props);

  if (days + hours + minutes + seconds <= 0) {
    return <p>{props.statement ? props.statement : ''}</p>;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};
