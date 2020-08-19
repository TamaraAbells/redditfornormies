import React from "react";
import moment from "moment";
import {
	StyledNotificationBar,
	StyledNotificationBarContainer,
	StyledNotification,
	StyledNFooter,
} from "../styles/components/notificationbarStyles";
import { StyledBtnImg } from "../styles/components/headerStyles";
import { StyledLoader } from "../styles/components/profileStyles";

class Notificationbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
		};
	}
	componentDidMount() {
		return fetch(`https://oauth.reddit.com/message/inbox`, {
			method: "GET",
			headers: {
				Authorization: `bearer ${this.props.token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				const after = json.data.after;
				let notifications = json.data.children.map((child) => {
					const {
						author,
						body,
						created,
						id,
						link_title,
						num_comments,
						subreddit_name_prefixed: subreddit,
						subject,
					} = child.data;
					const obj = {
						author,
						body,
						created,
						id,
						link_title,
						num_comments,
						subreddit,
						subject,
					};
					return obj;
				});
				this.setState({ notifications });
			})
			.catch((err) => {
				console.log("something went wrong", err);
			});
	}
	render() {
		return (
			<StyledNotificationBar>
				<StyledNotificationBarContainer>
					{this.state.notifications.length === 0 && (
						<StyledLoader size="mid" src="/loaders/spinner.gif" />
					)}
					{this.state.notifications.map((notification) => {
						return (
							<StyledNotification key={notification.id}>
								<p>
									<b>{notification.author}</b>&nbsp;
									{notification.subreddit && (
										<span>({notification.subreddit})</span>
									)}
								</p>
								<StyledNFooter>
									<p>{notification.subject}</p>
									{notification.num_comments && (
										<div>
											<StyledBtnImg
												type="comment"
												src={
													this.props.nightmode
														? "/images/comment-light.png"
														: "/images/comment.png"
												}
												alt="comments"
											/>
											{notification.num_comments}
										</div>
									)}
									<p>
										{moment
											.unix(notification.created)
											.format("DD/MM HH:mm")}
									</p>
								</StyledNFooter>
							</StyledNotification>
						);
					})}
				</StyledNotificationBarContainer>
			</StyledNotificationBar>
		);
	}
}

export default Notificationbar;
