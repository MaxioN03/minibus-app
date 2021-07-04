import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../../components/ui/Button';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary_Main_color = Template.bind({});
Primary_Main_color.args = {
};

export const Secondary_Main_color = Template.bind({});
Secondary_Main_color.args = {
  secondary: true
};

export const Primary_Second_color = Template.bind({});
Primary_Second_color.args = {
  secondColor: true
};

export const Secondary_Second_color = Template.bind({});
Secondary_Second_color.args = {
  secondary: true,
  secondColor: true
};

// export const Primary_Disabled = Template.bind({});
// Primary_Disabled.args = {
//   disabled: true
// };
//
// export const Secondary_Disabled = Template.bind({});
// Secondary_Disabled.args = {
//   secondary: true,
//   disabled: true
// };
