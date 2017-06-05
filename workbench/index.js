import {storiesOf, action} from '@kadira/storybook';
import React from 'react';
import SimpleComponent from '../src/components/simpleComponent.jsx';

storiesOf('SimpleComponent', module)
	.add('default', () =>
		<SimpleComponent onClick={action('clicked')}>
			Click Me</SimpleComponent>);