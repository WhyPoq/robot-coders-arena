import FightPage from "./pages/FightPage";
import { SceneContextProvider } from "./contexts/SceneContext";
import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import { BotStatsContextProvider } from "./contexts/BotStatsContext";
import { GameScoreContextProvider } from "./contexts/GameScore";
import { CurLevelContextProvider } from "./contexts/CurLevelContext";
import { UpdateEnemyContextProvider } from "./contexts/UpdateEnemyContext";
import { EnemyInfoContextProvider } from "./contexts/EnemyInfoContext";
import { PaceContextProvider } from "./contexts/PaceContext";

const App = () => {
	return (
		<div className="h-full flex flex-col">
			<header className="h-10 bg-purple-950 text-white flex items-center p-4">Header</header>
			<div className="flex-grow">
				<PaceContextProvider>
					<EnemyInfoContextProvider>
						<UpdateEnemyContextProvider>
							<CurLevelContextProvider>
								<BotStatsContextProvider>
									<SceneContextProvider>
										<ConsoleContextProvider>
											<GameScoreContextProvider>
												<FightPage />
											</GameScoreContextProvider>
										</ConsoleContextProvider>
									</SceneContextProvider>
								</BotStatsContextProvider>
							</CurLevelContextProvider>
						</UpdateEnemyContextProvider>
					</EnemyInfoContextProvider>
				</PaceContextProvider>
			</div>
		</div>
	);
};

export default App;
