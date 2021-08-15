import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Button} from "../../components/ui/Button";

const MOCK_TITLE = 'Button';

export default {
    title: 'UI/Button',
    component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const PrimaryEmpty = Template.bind({});
PrimaryEmpty.args = {};


export const Primary = Template.bind({});
Primary.args = {
    children: MOCK_TITLE,
};

export const PrimaryHovered = Template.bind({});
PrimaryHovered.args = {
    children: MOCK_TITLE,
};

export const PrimaryActive = Template.bind({});
PrimaryActive.args = {
    children: MOCK_TITLE,
};

export const Secondary = Template.bind({});
Secondary.args = {
    children: MOCK_TITLE,
    secondary: true
};

export const SecondaryHovered = Template.bind({});
SecondaryHovered.args = {
    children: MOCK_TITLE,
    secondary: true
};

export const SecondaryActive = Template.bind({});
SecondaryActive.args = {
    children: MOCK_TITLE,
    secondary: true
};


export const PrimarySecondColor = Template.bind({});
PrimarySecondColor.args = {
    children: MOCK_TITLE,
    secondColor: true,
};

export const PrimarySecondColorHovered = Template.bind({});
PrimarySecondColorHovered.args = {
    children: MOCK_TITLE,
    secondColor: true,
};

export const PrimarySecondColorActive = Template.bind({});
PrimarySecondColorActive.args = {
    children: MOCK_TITLE,
    secondColor: true,
};

export const SecondarySecondColor = Template.bind({});
SecondarySecondColor.args = {
    children: MOCK_TITLE,
    secondary: true,
    secondColor: true,
};

export const SecondarySecondColorHovered = Template.bind({});
SecondarySecondColorHovered.args = {
    children: MOCK_TITLE,
    secondary: true,
    secondColor: true,
};

export const SecondarySecondColorActive = Template.bind({});
SecondaryActive.args = {
    children: MOCK_TITLE,
    secondary: true,
    secondColor: true,
};


PrimaryHovered.parameters = {pseudo: {hover: true}};
PrimaryActive.parameters = {pseudo: {active: true}};
SecondaryHovered.parameters = {pseudo: {hover: true}};
SecondaryActive.parameters = {pseudo: {active: true}};

PrimarySecondColorHovered.parameters = {pseudo: {hover: true}};
PrimarySecondColorActive.parameters = {pseudo: {active: true}};
SecondarySecondColorHovered.parameters = {pseudo: {hover: true}};
SecondarySecondColorActive.parameters = {pseudo: {active: true}};