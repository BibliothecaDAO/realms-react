import type { Story, Meta } from '@storybook/react';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { useState, useCallback } from 'react';
import ChevronRight from '../../icons/chevron-right.svg';
import type { IInputNumberProps } from './input-number';
import { InputNumber } from './input-number';
export default {
  component: InputNumber,
  title: 'Base/InputNumber',
} as Meta;

const mockData = {
  additionalCurrency: 'LORDS',
};

const Template: Story<IInputNumberProps> = (args) => {
  const [value, setValue] = useState<string | number>();
  const [time, setTime] = useState<NodeJS.Timeout | null>(null);

  const validateInputValue = useCallback(
    (value: string | number) => {
      /* return new BigNumber(
        new BigNumber(value).toFixed(
          stakingToken ? stakingToken.decimals : DEFAULT_TOKEN_POWER
        )
      ); */
      return value;
    },
    [
      /* stakingToken */
    ]
  );

  const updateInputValue = useCallback(
    (newValue: string | number) => {
      setValue(validateInputValue(newValue));
    },
    [validateInputValue]
  );

  const handleValueChange = (newValue: ValueType | null) => {
    if (newValue === null) return;
    if (time) {
      clearTimeout(time);
    }
    let timerId: NodeJS.Timeout | null = null;
    timerId = setTimeout(() => {
      updateInputValue(newValue);
      /* updatePercentByValue(newValue); */
    }, 500);
    setTime(timerId);
  };

  return (
    <div className="p-16 sm:w-1/3 bg-gray-800/40">
      <InputNumber
        value={value}
        inputSize="md"
        className="w-12 text-2xl font-bold text-right "
        /* inputPrefix={/* <span className="text-md text-gray">
            ~{value} {mockData.additionalCurrency}
          </span>} 
        prefixPosition="button" */
        min={0}
        max={10000}
        stringMode // to support high precision decimals
        onChange={handleValueChange}
        {...args}
      />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
