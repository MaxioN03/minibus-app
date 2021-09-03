import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {SwipeRoutesButton} from "../../../components/ui/Button/SwipeRoutesButton";

export default {
    title: 'UI/Button/SwipeRoutesButton',
    component: SwipeRoutesButton,
} as ComponentMeta<typeof SwipeRoutesButton>;

const Template: ComponentStory<typeof SwipeRoutesButton> = (args) => <SwipeRoutesButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Hovered = Template.bind({});
Hovered.args = {};

export const Active = Template.bind({});
Active.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
};

Hovered.parameters = {pseudo: {hover: true}};
Disabled.parameters = {pseudo: {active: true}};