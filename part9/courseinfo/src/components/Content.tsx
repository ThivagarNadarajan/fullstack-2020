import React from "react";
import Part from './Part'
import { CoursePart } from '../types';

const Content: React.FC<{ content: Array<CoursePart> }> = ({ content }) => (
	<>
		{
			content.map(coursePart => <Part key={coursePart.name} part={coursePart} />)
		}
	</>
)


export default Content