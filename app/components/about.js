import React from 'react'

import { ThemeConsumer } from '../contexts/theme'

export default class About extends React.Component {

	intext = (text) => {
		const toRender = text? text : 'heatmap interpolator'
		const defaultClass = text? '' : 'keyword-bold'
		return (
			<ThemeConsumer>
				{({ theme }) => (
						<span className={`keyword ${defaultClass} keyword-${theme}`}>
							&nbsp;{toRender}&nbsp;
						</span>
				)}
			</ThemeConsumer>
		)
	}
	
	render() {
		return (
			<ThemeConsumer>
				{({ theme }) => (
					<div className={`inner-container bg-${theme}`}>
						<div className='room-panel-detail'>
							<h1 className={`room-title room-title-${theme}`}>
								About heatmap interpolator
							</h1>
							<div className='about'>
								<h3>
								<br/>
								</h3>
								<p>
								{this.intext()} takes a se
								</p>
								<p>
								In computer science labs and office hours, sometimes there are too many students for
								TAs to attend to. (Often when exams dates or assigment deadlines are nearing). Instead of 
								keeping track of the queue messily on a whiteboard, {this.intext()} provides a
								convenient and clean way to organize interactions between
								TAs and students.
								</p>
								<h3>
								<br/>Example
								</h3>
								<p>
								When looking at the how-to section below, you can follow with an example.
								Look at `CS 000 Example Office Hours`:
								</p>
								<div>
									<ul className='about-list'>
										<li>
											Room ID `eg_room_id`
										</li>
										<li>
											TA code `eg_ta_code`
										</li>
										<li>
											Student code `eg_st_code`
										</li>
									</ul>
								</div>
								<h3>
								<br/>How-to
								</h3>
								<p>
								Two types of users: TAs and students. When you create a room, you will be a TA.
								</p>
								<p>
								Every room has a room ID and code - one for TAs and one for students - for joining.
								</p>
								<p>
								A TA can select a student in queue to "attend to". When done, the TA can click on
								"complete" - with the option of keeping the student in the queue, or removing them.
								</p>
								<p>
								A student can join a queue. Must include the topic (i.e., what topic 
								they need help with.) The student will wait until a TA "attends" to them. There are several
								reasons for entering the queue topic:
								</p>
								<div>
									<ul className='about-list'>
										<li>
											May find other student(s) that need help with the same topic. Can get together 
											to work on it as they wait in the queue.
										</li>
										<li>
											Another student, who is familiar with the topic, may be able to help.
										</li>
										<li>
											TA(s) may be able to see if there is a common topic many students are struggling with.
										</li>
									</ul>
								</div>
							</div>					
						</div>
					</div>
				)}
			</ThemeConsumer>
		)
	}


}