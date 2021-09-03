import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ISwitcherValue, Switcher} from "../../components/ui/Switcher";

const SWITCHER_OPTIONS: [ISwitcherValue, ISwitcherValue] = [
    {value: 'forward', selected: true, text: 'Туда'},
    {value: 'back', selected: false, text: 'Обратно'},
]

export default {
    title: 'UI/Switcher',
    component: Switcher,
} as ComponentMeta<typeof Switcher>;

const Template: ComponentStory<typeof Switcher> = (args) => <Switcher {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    options: SWITCHER_OPTIONS
};

// export const Hovered = Template.bind({});
// Hovered.args = {};
//
// export const Active = Template.bind({});
// Active.args = {};
//
// export const Disabled = Template.bind({});
// Disabled.args = {
//     disabled: true,
// };
//
// Hovered.parameters = {pseudo: {hover: true}};
// Disabled.parameters = {pseudo: {active: true}};