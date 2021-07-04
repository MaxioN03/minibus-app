import * as React from 'react';
import { Button } from './index';
import { storiesOf } from '@storybook/react';

const onClickMock = () => {
};

storiesOf('Buttonnn', module)
    .add('Unknown type, without title', () => (
        <Button onClick={onClickMock}/>
    ));