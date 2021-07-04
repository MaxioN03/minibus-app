import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Select } from '../../components/ui/Select';

const MOCK_CITIES = [
    {text: 'Новогрудок', value: 'Новогрудок'},
    {text: 'Кореличи', value: 'Кореличи'},
    {text: 'Мир', value: 'Мир'},
    {text: 'Дзержинск', value: 'Дзержинск'},
    {text: 'Ивацевичи', value: 'Ивацевичи'},
    {text: 'Минск', value: 'Минск'}
]

export default {
    title: 'UI/Select',
    component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <div style={{padding: '1em', backgroundColor: 'grey'}}>
    <Select {...args} />
</div>;

export const Primary = Template.bind({});
Primary.args = {
    placeholder: 'Выберите',
    options: MOCK_CITIES
};
