import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DateInput } from '../../components/ui/DateInput';

export default {
    title: 'UI/DateInput',
    component: DateInput,
} as ComponentMeta<typeof DateInput>;

const Template: ComponentStory<typeof DateInput> = (args) => <div style={{display: 'inline-block', padding: '1em', backgroundColor: 'grey'}}>
    <DateInput {...args} />
</div>;

export const Primary = Template.bind({});
Primary.args = {
};
