import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FightPage from "./pages/FightPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MyBotsPage from "./pages/MyBotsPage";
import { UserContextProvider } from "./contexts/UserContext";
import NotFoundPage from "./pages/NotFoundPage";
import { Canvas } from "@react-three/fiber";
import RobotsScene from "./components/FightPage/RobotsScene";

import { BotStatsContextProvider } from "./contexts/BotStatsContext";
import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import { CurLevelContextProvider } from "./contexts/CurLevelContext";
import { EnemyInfoContextProvider } from "./contexts/EnemyInfoContext";
import { GameScoreContextProvider } from "./contexts/GameScore";
import { PaceContextProvider } from "./contexts/PaceContext";
import { SceneContextProvider } from "./contexts/SceneContext";
import { UpdateEnemyContextProvider } from "./contexts/UpdateEnemyContext";

const App = () => {
	return (
		<BrowserRouter>
			<UserContextProvider>
				<PaceContextProvider>
					<EnemyInfoContextProvider>
						<UpdateEnemyContextProvider>
							<CurLevelContextProvider>
								<BotStatsContextProvider>
									<SceneContextProvider>
										<ConsoleContextProvider>
											<GameScoreContextProvider>
												<div className="h-full flex flex-col bg-[#151515]">
													<Header />
													<div className="flex-grow relative">
														<div className="absolute top-0 bottom-0 left-0 right-0">
															<Canvas
																camera={{
																	fov: 75,
																	near: 0.1,
																	far: 1000,
																	position: [-2, 3, 3],
																}}
																shadows
															>
																<RobotsScene />
															</Canvas>
														</div>

														<Routes>
															<Route index element={<FightPage />} />
															<Route
																path="/login"
																element={<LogInPage />}
															/>
															<Route
																path="/signup"
																element={<SignUpPage />}
															/>
															<Route
																path="/leaderboard"
																element={<LeaderboardPage />}
															/>
															<Route
																path="/mybots"
																element={<MyBotsPage />}
															/>
															<Route
																path="*"
																element={<NotFoundPage />}
															/>
														</Routes>
													</div>
												</div>
											</GameScoreContextProvider>
										</ConsoleContextProvider>
									</SceneContextProvider>
								</BotStatsContextProvider>
							</CurLevelContextProvider>
						</UpdateEnemyContextProvider>
					</EnemyInfoContextProvider>
				</PaceContextProvider>
			</UserContextProvider>
		</BrowserRouter>
	);
};

export default App;
