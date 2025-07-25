import React from 'react';
import classNames from 'classnames';
import styles from './ColorPicker.module.scss';
import { defaultColors } from '@/shared/config/defaultColors';

interface Color {
  name: string;
  value: string;
}

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect?: (color: string) => void;
  colors?: Color[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect, colors = defaultColors }) => {
  return (
    <div className={styles.panelContainer} data-testid="color-picker-container">
      <div className={styles.colorPicker}>
        <h3>Color Picker</h3>
        <div className={styles.colorPanel} data-testid="color-panel">
          {colors.map((color, index) => (
            <button
              key={index}
              className={classNames(styles.colorButton, {
                [styles.selected]: selectedColor === color.value,
              })}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorSelect?.(color.value)}
              title={color.name}
              data-testid={`color-button-${index}`}
              data-color={color.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
