import { useContext } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import  {Context} from "../../../context/Context";
import NavBar from "../../../components/NavBar";
const Main = () => {
	const {
		onSent,
		recentPrompt,
		showResults,
		loading,
		resultData,
		setInput,
		input,
	} = useContext(Context);

    const handleCardClick = (promptText) => {
			setInput(promptText);
		};

		const handleKeyPress = (e) => {
			if (e.key === 'Enter') {
			  onSent();
			  setInput("")
			}
		  };
	return (
		<div className="main">
			<NavBar></NavBar>
			<div className="main-container">
				{!showResults ? (
					<>
						<div className="greet">
							<p>
								<span>Hello  </span>
							</p>
							<p>How Can i Help You Today?</p>
						</div>
						<div className="cards_ai">
							<div
								className="card_ai"
								onClick={() =>
									handleCardClick("Suggest Some workout to improve sprinting speed")
								}
							>
								<p>Suggest Some workout to improve sprinting speed</p>
								<img src={assets.compass_icon} alt="" />
							</div>
							<div
								className="card_ai"
								onClick={() =>
									handleCardClick(
										"Brainstorm team bonding activities for our cup celebration"
									)
								}
							>
								<p>Brainstorm team bonding activities for our cup celebration </p>
								<img src={assets.message_icon} alt="" />
							</div>
							<div
								className="card_ai"
								onClick={() =>
									handleCardClick("How to join a new football club")
								}
							>
								<p>How to join a new football club?</p>
								<img src={assets.bulb_icon} alt="" />
							</div>
							<div
								className="card_ai"
								onClick={() => {
									handleCardClick(
										"Suggest some jersy design"
									);
								}}
							>
								<p>Suggest some jersy design for my new team</p>
								<img src={assets.code_icon} alt="" />
							</div>
						</div>
					</>
				) : (
					<div className="result">
						<div className="result-title">
							<p>{recentPrompt}</p>
						</div>
						<div className="result-data">
							<img src={assets.gemini_icon} alt="" />
							{loading ? (
								<div className="loader">
									<hr />
									<hr />
									<hr />
								</div>
							) : (
								
								<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
							)}
						</div>
					</div>
				)}

				<div className="main-bottom">
					<div className="search-box">
						<input
							onChange={(e) => {
								setInput(e.target.value);
							}}
							onKeyPress={handleKeyPress}
							value={input}
							type="text"
							placeholder="Enter the Prompt Here"
						/>
						<div>

							<img
								src={assets.send_icon}
								alt=""
								onClick={() => {
									setInput("")
									onSent();
								}}
							/>
						</div>
					</div>
					<div className="bottom-info">
						<p>
							AI may display inaccurate info, including about people, so
							double-check its responses. Your privacy & Gemini Apps
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;
