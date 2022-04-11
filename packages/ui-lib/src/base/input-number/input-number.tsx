import clsx from 'clsx';
import RcInputNumber from 'rc-input-number';
import type { InputNumberProps } from 'rc-input-number';
import React from 'react';

export interface IInputNumberProps extends InputNumberProps {
  // eslint-disable-next-line react/no-unused-prop-types
  inputSize?: 'lg' | 'md' | 'sm';
  // eslint-disable-next-line react/no-unused-prop-types
  colorScheme?: 'gray-300' | 'gray' | 'outline' | 'transparent' | 'white';
  // eslint-disable-next-line react/no-unused-prop-types
  inputPrefix?: string | React.ReactElement;
  // eslint-disable-next-line react/no-unused-prop-types
  prefixPosition?: 'right' | 'left' | 'top' | 'button';
  // eslint-disable-next-line react/no-unused-prop-types
  inputClass?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  ref?: React.ForwardedRef<HTMLInputElement>;
}

export const InputNumber: React.ForwardRefExoticComponent<IInputNumberProps> =
  React.memo(
    React.forwardRef<HTMLInputElement, IInputNumberProps>((props, ref) => {
      const {
        inputSize = 'lg',
        colorScheme = 'gray',
        inputPrefix,
        className,
        max,
        min,
        inputClass,
        value,
        prefixPosition = 'right',
        ...otherProps
      } = props;

      // const blockInvalidChar = (e: any) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

      return (
        <div
          className={clsx(
            'input-number__box box-f',
            `input-number-${inputSize}-box`,
            `bg-${colorScheme}`,
            className,
            {
              'box-f-ai-c': prefixPosition === 'right',
              'box-f-fd-c': prefixPosition === 'button',
            }
          )}
        >
          <RcInputNumber
            min={min}
            max={max}
            type="number"
            ref={ref}
            className={clsx(
              `bg-${colorScheme}`,
              `input-number-${inputSize}`,
              inputClass
            )}
            value={value}
            onWheel={(e: any) => {
              e.target.blur();
            }}
            // onKeyDown={blockInvalidChar}
            {...otherProps}
          />
          {inputPrefix ? (
            <div
              className={clsx('input-number__prefix', {
                'input-number__prefix-bottom': prefixPosition === 'button',
              })}
            >
              {inputPrefix}
            </div>
          ) : (
            ''
          )}
        </div>
      );
    })
  );
InputNumber.displayName = 'InputNumber';
